//bottom menu module
KISSY.add(function(KS, COM){
	var $ = KS.all;
	var ret = {
		view: {
			$answerContainer: null,
			$saveContainer: null,
			$btnAnswer: null,
			$btnSave: null,
			$btnDebug: null,
			$btnSaveAndNext: null,
			$btnSaveAndPrev: null,
			$title: null
		},
		handleAnswer: function(e){
			e.preventDefault();
			COM.invoke(COM.api.question.hide);
			COM.invoke(COM.api.answer.show);
			ret.switchToSave();
		},
		handleSave: function(e){
			e.preventDefault();
			COM.invoke(COM.api.answer.save);
		},
		handleDebug: function(e){
			e.preventDefault();
			COM.invoke(COM.api.answer.debug);
		},
		handleSaveAndNext: function(e){
			e.preventDefault();
			COM.invoke(COM.api.answer.save);
			COM.invoke(COM.api.question.switchTo, ++COM.data.idx);
			COM.invoke(COM.api.answer.show);
			ret.switchToSave();
		},
		handleSaveAndPrev: function(e){
			e.preventDefault();
			COM.invoke(COM.api.answer.save);
			COM.invoke(COM.api.question.switchTo, --COM.data.idx);
			COM.invoke(COM.api.answer.show);
			ret.switchToSave();
		},
		switchToAnswer: function(){
			ret.view.$saveContainer.hide();
			ret.view.$answerContainer.show();
		},
		switchToSave: function(){
			ret.view.$answerContainer.hide();
			ret.view.$saveContainer.show();
			COM.invoke(COM.api.answer.setTitle, '正在回答 题 ' + (COM.data.idx+1) + ' <sup>of '+COM.data.totalQuestions+'</sup>');
			if(COM.data.idx > 0){
				ret.view.$btnSaveAndPrev.show();
			}else{
				ret.view.$btnSaveAndPrev.hide();
			}
			if(COM.data.idx < (COM.data.totalQuestions - 1)){
				ret.view.$btnSaveAndNext.show();
			}else{
				ret.view.$btnSaveAndNext.hide();
			}
		},
		bindEvent: function(){
			ret.view.$btnAnswer.on('click', ret.handleAnswer);
			ret.view.$btnSaveAndNext.on('click', ret.handleSaveAndNext);
			ret.view.$btnSaveAndPrev.on('click', ret.handleSaveAndPrev);
			ret.view.$btnDebug.on('click', ret.handleDebug);
			ret.view.$btnSave.on('click', ret.handleSave);
		},
		exposeAPI: function(){
			COM.expose(COM.api.bottomMenu.switchToAnswer, ret.switchToAnswer);
			COM.expose(COM.api.bottomMenu.switchToSave, ret.switchToSave);
		},
		init: function(){
			ret.view.$answerContainer = $('#bottommenu .msg-answer');
			ret.view.$saveContainer = $('#bottommenu .msg-save');
			ret.view.$btnAnswer = $('#bottommenu .answer');
			ret.view.$btnSave = $('#bottommenu .save');
			ret.view.$btnDebug = $('#bottommenu .debug');
			ret.view.$btnSaveAndNext = $('#bottommenu .saveandnext');
			ret.view.$btnSaveAndPrev = $('#bottommenu .saveandprev');
			ret.bindEvent();
			ret.exposeAPI();
		}
	};
	return ret;
},{
	requires:['./communicator']
});