//question module
KISSY.add(function(KS, COM, TESTDATA, Switchable){
	var $ = KS.all;
	var ret = {
		view: {
			$container: null,
			$slideBox: null,
			$pagination: null
		},
		CONST: {
			helpTxt: [[
				'<!DOCTYPE html>\r\n',
				'<html>\r\n',
				'<head>\r\n',
				'<meta charset=utf-8 />\r\n',
				'<title>中国好前端</title>\r\n\r\n',
				'<style>\r\n',
				'/*CSS code here*/\r\n',
				'</style>\r\n\r\n',
				'</head>\r\n',
				'<body>\r\n',
				'<!--HTML code here-->\r\n\r\n',
				'TIPS:\r\n',
				'鼠标悬停至上方的[试题]按钮，可以快速查看当前正在回答的题目，点击后返回查看所有题目。\r\n\r\n',
				'<!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>-->\r\n',
				'<!--<script src="http://yui.yahooapis.com/3.7.2/build/yui/yui-min.js"></script>-->\r\n',
				'<!--<script src="http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js"></script>-->\r\n',
				'<!--<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.6.0/dojo/dojo.xd.js"></script>-->\r\n',
				'<!--<script src="http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js"></script>-->\r\n\r\n',
				'<script>\r\n',
				'//Javascript code here\r\n',
				'</script>\r\n\r\n',
				'</body>\r\n',
				'</html>'
			].join(''),
			'如果您准备好了，就点击右上角的 [开始答题] 来完成这次的测试吧！ : )'
			]
		},
		slideInstance: null,
		newSlide: function(){
			if(ret.slideInstance){
				ret.view.$pagination.remove();
				ret.view.$slideBox.css('cssText','');
			}
			ret.slideInstance = new Switchable('#J_TopicSlide', {
				contentCls: 'slide-content',
				viewSize: [1800],
				effect: "scrollx",
				triggerType: 'click',
				interval:4,
				autoplay:false,
				duration:0.5,
				delay:.2,
				steps: 1,
				prevBtnCls: 'prev-btn',
				nextBtnCls: 'next-btn',
				circular: true,
				easing: 'easeOutStrong' 
			});
			ret.slideInstance.on('switch', function(e){
				COM.data.idx = e.currentIndex;
			});
			COM.data.idx = 0;
		},
		newTest: function(data){
			var $slideBox = ret.view.$slideBox;
			var LEN = data.docs.length;
			var _html = [];
			for(var i = 0; i < LEN; ++i){
				_html.push(
					'<li class="topic-item J_Item">\
					<div class="J_TopicItem">\
					<div class="question J_Question">\
						<pre>' + data.docs[i].content + '</pre>\
					</div>\
				</div></li>');
			}
			$slideBox.html(_html.join(''));
			COM.data.totalQuestions = LEN;
			ret.newSlide();
			ret.view.$pagination = $('#J_TopicSlide .ks-switchable-nav');
			ret.view.$pagination.css('margin-left', -11*LEN);
			COM.invoke(COM.api.main.adjustContainerSize);
		},
		study: function(){
			ret.newTest(TESTDATA);
			COM.data.question = TESTDATA;
			COM.data.answer = {
				'0': ret.CONST.helpTxt[0],
				'1': ret.CONST.helpTxt[1]
			};
		},
		test: function(){
			var randomCode = window.location.search.match(/i=(.+)$/);
			randomCode && (randomCode = randomCode[1]);
			KS.io({
				type: 'get'
				,url: '/io/test/' + randomCode
				,dataType: 'json'
                ,cache: false
				,success: function(data){
                    if(!data.success){
                        alert(data.message);
                        $("#topmenu .btn-action-deactive").html('开始答题').removeClass('btn-action-deactive').addClass('btn-action');
                        return;
                    }
					ret.newTest(data);
					COM.data.isTesting = true;
					COM.data.question = data;
					COM.data.answer = {};
                    KS.each(data.docs, function(q) {
                        COM.data.answer[q.index] = q.answer;
                    });
					COM.invoke(COM.api.topMenu.counting, data.time);
				}
			});
		},
		show: function(){
			ret.view.$container.show();
		},
		hide: function(){
			ret.view.$container.hide();
		},
		switchTo: function(n){
			ret.slideInstance.switchTo(n);
		},
		getCurrentQuestion: function(){
			var idx = COM.data.idx;
			return '<pre>' + COM.data.question.docs[idx].content + '</pre>';
		},
		exposeAPI: function(){
			var Api = COM.api.question;
			COM.expose(Api.show, ret.show);
			COM.expose(Api.hide, ret.hide);
			COM.expose(Api.startTest, ret.test);
			COM.expose(Api.switchTo, ret.switchTo);
			COM.expose(Api.getCurrentQuestion, ret.getCurrentQuestion);
		},
		init: function(){
			ret.view.$container = $('#question');
			ret.view.$slideBox = $('#J_TopicSlide .slide-content');
			ret.exposeAPI();
			ret.study();
		}
	};
	return ret;
},{
	requires:['./communicator', './testData', 'switchable']
});
