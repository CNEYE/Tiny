/*
 * 简单弹窗
 * 作者 蜗眼 <iceet@uoeye.com>
 */
 define('Liepin.dialog',function(){
	
	var Dialog = function(config,id){
		
		var uuid = id || config.title;
		
		if ( CACHE[uuid] ){
			
			return CACHE[uuid].show().reset();
		}
		
		if ( !(this instanceof arguments.callee) ) {
			return CACHE[uuid] = new arguments.callee(config);
		}
		this.entry(config);
	},
	CACHE ={};
	
	Dialog.prototype = {
		entry: function(config){
			
			this.opche = Liepin.extend({
				title: '弹窗',
				content: '内容',
				width:400,
				//初始化调用
				onInited: null
			},config);
			
			this.init();
			this.bind();
			this.show();
		},
		//初始化
		init: function(){
			
			var chtml = ['<div class="ui-dialog clearfix"><div class="ui-dialog-header"><h3>']
				chtml.push(this.opche.title);
				chtml.push('</h3><a class="close">×</a></div><div class="ui-dialog-bodyer clearfix">');
				chtml.push(this.opche.content);
				chtml.push('</div><div class="ui-dialog-footer"><button class="ui-button"><em>确认</em>');
				chtml.push('</button><button class="ui-button ui-button-gray"><em>取消</em></button></div></div>');
			
			this.Window = $(chtml.join('')).appendTo(document.body);
			this.Close  = this.Window.find('.ui-dialog-header a.close');
			this.Body = this.Window.find('.ui-dialog-bodyer');
			
			var button  = this.Window.find('.ui-dialog-footer button');
			
			this.Ok 	= button.eq(0);
			this.Cancel = button.eq(1);
			
			this.reset();
		},
		//绑定事件
		bind: function(){
			
			var self = this;
			
			this.Close.click(function(){
				if (self.trigger('onClose') !==false){
					self.hide();
				}
			});
			this.Ok.click(function(){
				if (self.trigger('onOk') !== false){
					self.hide();
				}
			});
			this.Cancel.click(function(){
				if (self.trigger('onCancel') !== false){
					self.hide();
				}
			});
		},
		//背景遮罩
		mask: function(remove){
			
			if (remove){
				this.Mask.remove();
			} else {
				this.Mask = $('<div class="ui-mask"></div>').appendTo(document.body);
				this.Mask.css({
					height: $(document.body).outerHeight()
				});
			}
		},
		//重置
		reset: function (){
			
			var height = this.Window.outerHeight();
			var scroll = $(document).scrollTop();
			this.Window.css({
				'width': this.opche.width,
				'margin-left': -this.opche.width/2,
				'margin-top': -height/2+scroll 
			});
			return this;
		},
		//展示
		show: function (){
			if ( !this.isshow ){
				if ( this.trigger('showBefore') !== false ) {
					this.Window.show();
					this.mask();
					this.isshow = true;
				}
			}
			return this;
		},
		//隐藏
		hide: function(){
			if (this.isshow){
				if (this.trigger('hideBefore') !== false){
					this.Window.hide();
					this.mask(true);
					this.isshow =false;
				}
			}
		}
	}
	return Liepin.procopy(Dialog,Liepin.Emitter);
 });