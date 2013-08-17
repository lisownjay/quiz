//communication module
KISSY.add(function(KS){
	var queue = {
		/*queue of msg
		key : {
			callback:fn, scope:obj
		}
		*/
	};
	var uuid = function(){
		return Math.random();
	};
	var ret = {
		expose: function(key, callback, scope){
			queue[key] = {
				callback: callback,
				scope: scope
			}
		},
		invoke: function(key){
			var evt = queue[key];
			if(!evt){return;}
			var args = [].slice.call(arguments, 1);
			return evt.callback.apply(evt.scope, args);
		},
		api: {
			main: {
				adjustContainerSize: 'ADJUSTCONTAINERSIZE' + uuid()
			},
			question: {
				show: 'SHOW' + uuid(),
				hide: 'HIDE' + uuid(),
				switchTo: 'SWITCHTO' + uuid(),
				startTest: 'STARTTEST' + uuid()
			},
			answer: {
				show: 'SHOW' + uuid(),
				hide: 'HIDE' + uuid(),
				setTitle: 'SETTITLE' + uuid(),
				debug: 'DEBUG' + uuid(),
				save: 'SAVE' + uuid(),
                submit: 'SUBMIT' + uuid()
			},
			topMenu: {
				counting: 'COUNTING' + uuid()
			},
			bottomMenu: {
				switchToAnswer: 'SWITCHTOANSWER' + uuid(),
				switchToSave: 'SWITCHTOSAVE' + uuid()
			}
		},
		data: {}
	};
	return ret;
});