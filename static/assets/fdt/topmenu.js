//top menu module
KISSY.add(function(KS, COM, Countdown){
	var $ = KS.all;
	var ret = {
		view:{
			$answerContainer: null,
			$btnStartTest: null,
			$countingContainer: null
		},
		countingInstance: null,
		counting: function(time){
			ret.view.$answerContainer.hide();
			var timecountBox = $('#countingdown');
			timecountBox.attr('data-total', Math.abs(time) * 1000);
			ret.countingInstance = Countdown(timecountBox, {effect: 'slide'});
			timecountBox.show();
		},
		hindleStartTest: function(e){
			e.preventDefault();
			if(ret.testing){return;}
			ret.testing = true;
			$(this).html('loading...').removeClass('btn-action').addClass('btn-action-deactive');
			COM.invoke(COM.api.question.startTest);
			COM.invoke(COM.api.question.show);
			COM.invoke(COM.api.answer.hide);
			COM.invoke(COM.api.bottomMenu.switchToAnswer);
		},
		bindEvent: function(){
			ret.view.$btnStartTest.on('click', ret.hindleStartTest);
		},
		exposeAPI: function(){
			var topMenuAPI = COM.api.topMenu;
			COM.expose(topMenuAPI.counting, ret.counting, ret);
		},
		init: function(){
			ret.view.$answerContainer = $('#starttest');
			ret.view.$btnStartTest = $('#starttest .btn-action');
			ret.view.$countingContainer = $('#countingdown');
			ret.exposeAPI();
			ret.bindEvent();
		}
	};
	return ret;
},{
	requires:['./communicator', 'gallery/countdown/1.2/index', 'gallery/countdown/1.2/assets/countdown.css']
});