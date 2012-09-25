(function(){

	var Liepin = function(a){},
		uuid = +new Date,
		expando = 'liepin'+uuid;
	//扩充对象 简单扩展
	Liepin.extend = function ( target,source ) {
	 	var argus = arguments,
			i = 1,
			force = typeof argus[argus.length - 1] == 'boolean' ? argus.pop() : true;

        argus.length == 1 && (target = Liepin) && (i = 0);
        while (source = argus[i++]) {
            for (var p in source) {
                if (source.hasOwnProperty(p) && (force || ! (p in target))) {
                    target[p] = source[p];
                }
            }
        }
        return target;
	};
	
	Liepin.extend(Liepin,{
		//简单的定义函数
		define: function(name,factory){
			name = name.replace(/^Liepin\./i,'');
			Liepin[name] = typeof factory == 'function' ? factory() : factory ;
		},
		//原型继承
		procopy: function(sbc) {
		
            var supers,POSING;
            if (arguments.length >= 2) {
                for (var len = arguments.length - 1; len > 0; len--) {
                    supers = arguments[len];
                    for (var p in supers.prototype) {
                        if(supers.prototype.hasOwnProperty(p) ){
                            sbc.prototype[p] = supers.prototype[p];
                        }
                    }
                }
            }
			return sbc;
        }
	});
	//注册函数
	window.define = Liepin.define;
	
	//异步事件，也可以叫消息广播
	define('Liepin.Emitter',function(){
		
		var Emitter = function(){},
			expando = 'emitter'+(+new Date);
		
		Emitter.prototype = {
			//注册事件
			addListener: function(event,handler,data,once){
				
				this['@emitter'] || ( this['@emitter'] = {});
				this['@emitter'][event] || (this['@emitter'][event]=[]);
				
				if (typeof handler == 'function') {
					this['@emitter'][event].push({
						handler: handler,
						fhid: handler[expando] || (handler[expando]=++uuid),
						data: data || {},
						once: once
					});
				}
				return this;
			},
			on: function(event,handler,data){
				return this.addListener(event,handler,data);
			},
			once: function(event,handler,data){
				return this.addListener(event,handler,data,true);
			},
			//注意这里的可以删除所有的事件，也可以删除指定的事件，更可以删除一般情况下事件
			removeListener: function(event,handler,evt){
				
				this['@emitter'] || ( this['@emitter'] = {});
				//删除指定hanler
				if ( event !== undefined ) {
					if( evt = this['@emitter'][event] ) {
						if ( handler == undefined ) {
							return this['@emitter'][event] = [];
						}
						for(var len = evt.length-1;len>=0;len--){
							if ( evt[len].fhid == handler[expando]){
								evt.splice(len,1);
							}
						}
					}
				//删除全部事件
				} else {
					for (var p in this['@memitter']){
						this.removeListener(p);
					}
				} 
			},
			//触发
			trigger: function(event,data){
				
				var retvalue , evt ,item;
					this['@emitter'] || ( this['@emitter'] = {});
				
				if ( evt = this['@emitter'][event] ) {
					for(var len = evt.length-1;len>=0;len--) {
						retvalue = (item = evt[len]).handler(Liepin.extend({},item.data,data||{}));
						//只触发一次
						if ( item.once ) {
							evt.splice( len,1 );
						}
					}
				}
				return retvalue;
			}
		};
		
		return Emitter;
	 });
	
	
	window.Liepin = Liepin;
})();