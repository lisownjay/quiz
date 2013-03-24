//main module
KISSY.add(function(KS, questionModule, answerModule, topMenuModule, bottomMenuModule, COM){
	var $ = KS.all;
	var ret = {
		view:{
			$topicSlide: null,
			$answerContainer: null,
			$answerBox: null,
			doc: null
		},
		adjustContainerSize: function(){
			var D = KS.DOM, E = KS.Event, $ = KS.all;
			var topicSlide = ret.view.$topicSlide;
			var answerContainer = ret.view.$answerContainer;
			var answerBox = ret.view.$answerBox;
			var doc = ret.view.doc;
			var clientWidth = doc.clientWidth;
			var clientHeight = doc.clientHeight;
			topicSlide.width(clientWidth);
			topicSlide.height(clientHeight - 160);
			topicSlide.all('.J_TopicItem').height(clientHeight - 180);
			topicSlide.all('.J_TopicItem').width(clientWidth - 60);
			answerContainer.width(clientWidth);
			answerContainer.height(clientHeight - 140);
			answerBox.width(clientWidth - 50);
			answerBox.height(clientHeight - 160);
		},
		bindEvent: function(){
			KS.ready(function(KS){
				var E = KS.Event;
				E.on(window, 'resize', function(){
					ret.adjustContainerSize();
				});
				setTimeout(function(){
					ret.adjustContainerSize();
				},500);
			});
		},
		exposeAPI: function(){
			COM.expose(COM.api.main.adjustContainerSize, ret.adjustContainerSize, ret);
		},
		init: function(){
			ret.exposeAPI();
			ret.view.$topicSlide = $('#J_TopicSlide');
			ret.view.$answerContainer = $('#answer .g-body');
			ret.view.$answerBox = $('#answer textarea');
			var docE = document.documentElement;
			var docB = document.body;
			ret.view.doc = (docE)? docE : docB;
			questionModule.init();
			answerModule.init();
			topMenuModule.init();
			bottomMenuModule.init();
			ret.bindEvent();
		}
	};
	return ret;
},{
	requires:['./question', './answer', './topmenu', './bottommenu', './communicator']
});