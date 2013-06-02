//answer module
KISSY.add(function(KS, COM, Overlay){
	var $ = KS.all, isIE = KS.UA.ie;
	var ret = {
		view: {
			$container: null,
			$textarea: null,
			$editor: null,
			$btnBack: null,
			$btnSave: null,
			$btnDebug: null,
			$btnSaveAndNext: null,
			$title: null
		},
		editor: null,
		initEditor: function(){
			if(!KS.UA.ie || KS.UA.ie > 7){
				ret.view.$textarea.hide();
				ret.view.$editor.show();
				ret.editor = ace.edit(ret.view.$editor[0]);
				ret.editor.setTheme("ace/theme/dreamweaver");
				ret.editor.getSession().setMode("ace/mode/html");
				ret.on
			}else{
				ret.editor = {
					focus: function(){
						var txtElm = ret.view.$textarea[0];
						var len = txtElm.value.length;
						if(txtElm.setSelectionRange){
							txtElm.focus();
							txtElm.setSelectionRange(len, len);
						}else if(txtElm.createTextRange){
							var range = txtElm.createTextRange();
							range.collapse(true);
							range.moveEnd("character", len);
							range.moveStart("character", len);
							range.select();
						}
					},
					clearSelection: function(){

					},
					getValue: function(){
						return ret.view.$textarea.val();
					},
					setValue: function(s){
						ret.view.$textarea.val(s);
					}
				};
			}
		},
		popup: null,
		initPopup: function(){
			ret.popup = new Overlay({
				elStyle: {
					background: '#fff',
					border: '2px solid gray',
					borderRadius: '8px',
					padding: '5px',
					overflow: 'auto',
					boxShadow: '5px 0 60px 10px rgba(0,0,0,0.3)'
				},
				width: '85%', //配置高和宽
				height: '50%',
				effect: {
					effect: 'slide', //popup层显示动画效果，slide是展开，也可以'fade'渐变
					duration: 0.1
				}
			});
			ret.popup.on('afterRenderUI', function(e){
				var t = this.get('el');
				t.on('mouseenter', function(e){clearTimeout(ret.hidePopupTimer);});
				t.on('mouseleave', function(e){ret.hidePopup();});
			});
		},
		popupQuestion: function(e){
			clearTimeout(ret.hidePopupTimer);
			ret.view.$btnBack.removeClass('btn-back-hover').addClass('btn-back-hover');
			var t = $(e.target);
			ret.popup.set('content', '<h3>第'+(COM.data.idx+1)+'题</h3><br/>'+COM.invoke(COM.api.question.getCurrentQuestion));
			ret.popup.set('align', {
				node:t,
				points:['bl', 'tl']
			});
			ret.popup.show();
		},
		hidePopup: function(){
			ret.hidePopupTimer = setTimeout(function(){
				ret.view.$btnBack.removeClass('btn-back-hover');
				ret.popup.hide();
			}, 200);
		},
		setTitle: function(str){
			ret.view.$title.html(str);
		},
		show: function(){
			var $textarea = ret.view.$textarea;
			ret.view.$container.show();
			ret.editor.setValue(COM.data.answer[COM.data.idx]||'');
			ret.editor.focus();
			ret.editor.clearSelection();
		},
		hide: function(){
			ret.view.$container.hide();
		},
		back: function(e){
			e.preventDefault();
			ret.view.$btnBack.removeClass('btn-back-hover');
			ret.hide();
			clearTimeout(ret.hidePopupTimer);
			ret.popup.hide();
			COM.invoke(COM.api.question.show);
			COM.invoke(COM.api.bottomMenu.switchToAnswer);
		},
		insertToSelection: function(dObj, sTxt){
			if(!dObj||!sTxt){return;}
			var l = (isIE && -1 !== sTxt.indexOf('\n')) ? sTxt.replace(/\r?\n/g, '*').length : sTxt.length;
			var Selection = document.selection, sValue = dObj.value, nStart = dObj.selectionStart, nEnd, sel;
			dObj.focus();
			if(nStart!==undefined){
				nTop = dObj.scrollTop;
				nEnd = nStart + sTxt.length;
				dObj.value = sValue.substr(0, nStart) + sTxt + sValue.substr(dObj.selectionEnd);
				dObj.setSelectionRange(nEnd, nEnd);
				dObj.scrollTop = nTop;
			}else if(Selection && Selection.createRange) {
				sel = Selection.createRange();
				sel.text = sTxt;
				sel.moveStart('character', -l);
			}else{
				dObj.value += sTxt;
			}
		},
		insertTab: function(e){
			var keyCode = e.which;
			if(keyCode===9){//Tab key
				e.preventDefault();
				ret.insertToSelection(this, '    ');
			}
		},
		debug: function(){
			var code = ret.editor.getValue();
			var doc = window.open().document;
			doc.open();
			doc.write(code);
			doc.close();
		},
		commit: function(success, failure){
			if(!COM.data.isTesting){return;}
			var idx = COM.data.idx;
			var questionID = COM.data.question.docs[idx].index;
			var code = ret.editor.getValue();
			var data = {};
			if(code.replace(/\s/g,'')){
				//data["a" + questionID+'[html]'] = code;
                data["answer[" + questionID + "]"] = code;
				data['_id'] = COM.data.question._id;
				//data['method'] = 'save';
				KS.io.post(
					'/io/test/solve',
					data,
					function(data){
						if(data.success){
							if(typeof success==='function'){success(data);}
						}else{
							if(typeof failure==='function'){failure(data);}
						}
					},
					"json"
				);
			}
		},
		save: function(){
			var code = ret.editor.getValue();
			COM.data.answer[COM.data.idx] = code;
			ret.commit(function(d){
            }, function(d){
                if (d.message === "timeout") {
                    alert("你已超过答题时间，不能再提交！");
                }
            });
		},
		bindEvent: function(){
			ret.view.$textarea.on('keydown', ret.insertTab);
			ret.view.$btnBack.on('click', ret.back);
			ret.view.$btnBack.on('mouseenter', ret.popupQuestion);
			ret.view.$btnBack.on('mouseleave', ret.hidePopup);
		},
		exposeAPI: function(){
			COM.expose(COM.api.answer.show, ret.show);
			COM.expose(COM.api.answer.hide, ret.hide);
			COM.expose(COM.api.answer.setTitle, ret.setTitle);
			COM.expose(COM.api.answer.debug, ret.debug);
			COM.expose(COM.api.answer.save, ret.save);
		},
		init: function(){
			ret.view.$container = $('#answer');
			ret.view.$btnBack = $('#answer .btn-back');
			ret.view.$btnSave = $('#answer .save');
			ret.view.$btnDebug = $('#answer .debug');
			ret.view.$btnSaveAndNext = $('#answer .saveandnext');
			ret.view.$textarea = $('#answer textarea');
			ret.view.$editor = $('#editor');
			ret.view.$title = $('#answer .msg');
			ret.initEditor();
			ret.initPopup();
			ret.exposeAPI();
			ret.bindEvent();
		}
	};
	return ret;
},{
	requires:['./communicator', 'overlay']
});
