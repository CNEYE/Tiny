/*
 * 简单表单工具类
 */
 
 define('Liepin.Form',function(){
	
	var Form = function(target,type,title,data){
		if (!(this instanceof arguments.callee)){
			return new arguments.callee(target,type,title,data);
		}
		this.entry(target,type,title,data);
	};
	
	Form.prototype = {
		entry: function(target,type,title,data){
		
			this.target = target;
			this.type = type.replace(/^[a-z]/,function($1){
				return $1.toUpperCase();
			});
			this.data = data;
			this.title = title;
			
			if ( typeof this['init'+this.type] != 'undefined'){
			
				var self = this;
				setTimeout(function(){
					self.init();
					self['init'+self.type]();
					self.setDefault()
				},0);
				return ;
			}
			
			throw new Error('请输入正确的类型（region/functions/business）');
		},
		setDefault: function(){
			
			var select = this.Body.find('input[name=selectItem]');
			var selectAll =this.Body.find('input[name=selectAll]');
			
			this.disabledAll(select,false);
			this.checkedAll(select,false);
			if (selectAll.length){
				selectAll[0].checked = false;
				selectAll[0].disabled = false;
			}
			
			this.defaultValue = (this.input.val()+'').replace(/[^0-9,a-z]/ig,'').split(',');
			 
			if ( this.defaultValue !='' && this.defaultValue.length){
				var self = this;
				
				this.titleUL && this.titleUL.html('');
				
				for(var len = this.defaultValue.length-1;len>=0;len--){
					var value = this.defaultValue[len];
					this.keys[value]=1;
					switch(this.type){
						case 'Region':
							value !=this.data.AllValue &&  $('#'+this.type.toLowerCase()+'_select_'+value+'_2').attr('checked',true);
						case 'Business': 
							if ( value === this.data.AllValue ){
								self.checkedAll(select,true);
								self.disabledAll(select,true,true);
								
								selectAll[0].checked = true;
								this.isall = true;
							} else {
								$('#'+this.type.toLowerCase()+'_select_'+value).attr('checked',true);
							}
							break;
						case 'Functions':
							var item = $('#'+this.type.toLowerCase()+'_select_'+value).attr('checked',true);
								this.title.show();
							$(this.titleItem({value:value,name:item.parent().text()})).appendTo(this.titleUL);
						default:
							break;
					}
				}
				this.num = this.keyNum = this.defaultValue.length;
				
				if (this.num >= this.max){
					this.disabledAll(select,true);
					this.disabledOne(selectAll,true);		
				}
				
				
			} else {
				this.num = this.keyNum = 0;
			}
			
			this.iput.css('width','auto');
			this.iput.width()<this.iputWidth && 
				this.iput.css('width',this.iputWidth);
		},
		init: function(){
			
			var self   = this;
			
			this.cbar  = this.target.find('a');
			this.icbar = this.target.find('span>em');
			this.iput  = this.target.find('ol');
			this.iputWidth = this.iput.width();
			this.input = this.target.find('input');
			
			this.input.val(this.input.attr('defaultvalue'));
			
			//缓存keys
			
			if (this.input.val()){
				this.icbar.hide();
				this.cbar.show();
				
				
			} else{
				this.icbar.show();
				this.cbar.hide();
			}
			
			this.keys 	= {};
			this.keyNum = 0;
			
			this.cbar.click(function(){
				self.show();
				return false;
			});
			this.icbar.click(function(){
				self.show();
				return false;
			});
			this.iput.click(function(e){
				self.click(e);
				return false;
			});
			
			var template = Liepin.Tiny($('#LTiny_'+this.type).html());
			
			this.win = Liepin.dialog({
				title: this.title,
				content:template(this.data),
				width:670
			},this.type);
			
			this.win.hide();
			this.Body = this.win.Body;
		},
		show: function(){
			this.win.show();
			this.setDefault();
		},
		click: function(e){
		
			if (e.target.nodeName == 'EM'){
				var target = $(e.target.parentNode),
					value = target.attr('data-value');
				target.remove();
				delete this.keys[value];
				this.keyNum --;
				this.trigger('remove',{value:value})
				this.setValue();
			}
		},
		setValue: function(){
		
			var rvalue = [];
			
			for(var p in this.keys){
				rvalue.push(p);
			}
			this.input.val(rvalue.join(','));
			//this.input.attr('defaultvalue',rvalue.join(','));
			
			if (this.keyNum ==0 ){
				this.cbar.hide();
				this.icbar.show();
			} else {
				this.cbar.show();
				this.icbar.hide();
			}
			
			this.iput.width()<this.iputWidth && 
				 this.iput.css('width',this.iputWidth);
		},
		add: function(value){
		
			var item ,idx=0,hval=[];
			this.iput.html('');
			this.keys={};
			this.keyNum=0;
			this.iput.css('width','auto');
			
			while(item = value[idx++]){
				this.keys[item.value]=1;
				this.keyNum++;
				hval.push('<li data-value="'+item.value+'">',item.name+'<em>×</em></li>');
			}
			this.iput.html(hval.join(''));
			
			this.setValue();
		},
		//初始化行业
		initBusiness: function(call){
			var self = this,se = '#'+this.type.toLowerCase()+'_select_';
				self.max = self.data.max;
				self.num = 0;
			var select = this.Body.find('input[name=selectItem]');
			
			if (call !== false){
				var selectAll = this.Body.find('input[name=selectAll]').click(function(){
				
					if (selectAll.attr('checked')){
					
						self.checkedAll(select,true);
						self.disabledAll(select,true,true);
						self.num = self.max;
						self.isall = true;
					} else {
					
						self.checkedAll(select);
						self.disabledAll(select);
						self.num=0;
						self.isall = false;
					}
				});
			
				select.change(function(e){
					var $this = $(e.target),val;
					var id = $this.attr('id');
					if (val = $this.attr('checked')) {
						if (++self.num>=self.max){
							self.disabledAll(select,true,null,/_2$/.test(id));
							self.disabledOne(selectAll,true);
							self.Tips('你最多选取'+self.max+'项！');
						}
					} else {
						if (--self.num == self.max-1){
							self.disabledAll(select,false,null,/_2$/.test(id));
							self.disabledOne(selectAll,false);
						}
					}
					call && call(val,id);
				});
			} 
			this.win.on('onOk',function(){
			
				var item = select.filter(':checked'),
					value=[],cache={};
					
				if ( self.isall ) {
					value[0] = {value:self.data.AllValue||0,name:'不限'};
				} else{
					item.each(function(){
						var target = $(this),
							val = target.val();
						if (!cache[val]){
							cache[val]=value.push({value:target.val(),name:target.parent().text()});
						}
					});
				}
				self.add(value);
			});
			
			this.on('remove',function(data){
			
				$(se+data.value).removeAttr('checked');
				
				call && $(se+data.value+'_2').removeAttr('checked');
				call === false && $('#'+self.type.toLowerCase()+'_item_'+data.value).remove();
				
				if (--self.num == self.max-1){
					self.disabledAll(select,false);
					selectAll && self.disabledOne(selectAll,false);
				}
				if( self.isall ){
					self.checkedAll(select);
					selectAll && self.checkedAll(selectAll);
				}
				
			});
		},
		checkedAll: function(input,tue){
			input.each(function(){
				var item = $(this);
				if ( tue ) {
					item[0].checked = true;
				} else {
					item[0].checked = false;
				}
			});
		},
		disabledOne: function(input,tue){
			if (input.length){
				tue ? input[0].disabled = true : input[0].disabled = false;
			}
		},
		disabledAll: function(inputs,tue,force,no){
			setTimeout(function(){
				inputs.each(function(_,item){
					if ( tue ){
						if ( !no && !force) {
							//存在依赖的情况
							!item.checked &&(item.disabled =true);
							return;
						}
						(force || !item.checked) &&(item.disabled =true);
					} else {
						item.disabled = false;
					}
				});
			},10);
		},
		//初始化职能
		initFunctions: function(){
			var self = this,
				uls = this.Body.find('.functions-colsitem'),
				tab = uls.eq(0).find('a'),
				cont= uls.eq(1).find('ul');
				
				self.max = self.data.max;
				self.num = 0;
			
			self.title = this.Body.find('.functions-title');
			self.titleUL = self.title.find('ul');
			self.titleItem = Liepin.Tiny(' <li id="functions_item_{/$value/}"><a href="javascript:;" data-value={/$value/}>{/$name/}<em>×</em></a></li>');
			
			var select = this.Body.find('input[name=selectItem]').change(function(e){
				var $this = $(e.target);
				var val = $this.val();
				var text = $this.parent().text();
				
				if ($this.attr('checked')) {
					if (++self.num>=self.max){
						self.disabledAll(select,true);
						self.Tips('你最多选取'+self.max+'项！');
					}
					$(self.titleItem({value:val,name:text})).appendTo(self.titleUL);
					
				} else {
					if (--self.num == self.max-1){
						self.disabledAll(select,false);
					}
					$('#functions_item_'+val).remove();
				}
				self.title[self.num>0?'show':'hide']();
				self.isall=false;
			});
			
			self.title.click(function(e){
				if (e.target.nodeName=='EM'){
					var target = $(e.target.parentNode);
					$('#functions_select_'+target.attr('data-value')).removeAttr('checked');
					target.parent().remove();
					if (--self.num == self.max-1){
						self.disabledAll(select,false);
					}
				}
			});
			
			tab.each(function(i){
				$(this).attr('data-index',i);
			}).click(function(){
				var $this = $(this);
				$this.parent().parent().find('.selected').removeClass('selected');
				$this.parent().addClass('selected');
				cont.hide();
				cont.eq($this.attr('data-index')^0).show();
			});
			
			self.initBusiness(false);
			
			self.Body.find('.functions-all input').change(function(){
				
				self.isall = true;
				self.win.trigger('onOk');
				self.win.hide();
				self.checkedAll(self.Body.find('input[name=selectItem]'));
				self.titleUL.html('');
				$(this).removeAttr('checked');
				self.num =0;
				return false;
			});
		},
		//初始化地点
		initRegion: function(){
			var tab  = this.Body.find('.region-tabs a'),
				cont = this.Body.find('dl');

			this.initBusiness(function(val,id){
				
				if (/_2$/.test(id)){
					var target = $('#'+id.substr(0,id.length-2));
				}else {
					var target = $('#'+id+'_2');
				}
				if (val){
					return target.attr('checked',true);
				} 
				target.removeAttr('checked');
			});
			
			tab.each(function(i){
				$(this).attr('data-index',i);
			}).click(function(){
				var $this = $(this);
				$this.parent().find('a').removeClass('current');
				$this.addClass('current');
				cont.hide();
				cont.eq($this.attr('data-index')^1).show();
			});
		},
		Tips: function(msg){
			return ;
			var str= $('<div class="ui-tips">'+msg+'</div>').appendTo(this.win.Body);
			setTimeout(function(){
				str.remove();
			},3000);
		}
	};
	
	//扩展
	Liepin.extend(Form,{
		placeholder: function(input,label){
			
			label || (label = input.parent().find('label'));
			function holder(){
				if (input.val()){
					label.hide();
				}else {
					label.show();
				}
			}
			input.keyup(holder);
			input.keydown(holder);
		},
		radio: function(wrap){
			wrap.each(function(){
				var $this = $(this),
					init = $this.find('a').eq(0);
				$this.find('input').val(init.attr('data-value'));
			});
			wrap.find('a').click(function(){
				var $this= $(this),
					parent = $this.parent().parent().parent();
				
				parent.find('.current').removeClass('current');
				$this.parent().addClass('current');
				parent.find('input').val($this.attr('data-value'));
			});
		}
	});
	return Liepin.procopy(Form,Liepin.Emitter);
 });
