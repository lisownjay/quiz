<link rel="stylesheet" href="assets/jsbin/font.css" />
<link rel="stylesheet" href="assets/jsbin/style.css" />

<div id="control">
  <div class="control">
    <div class="buttons">
      <div class="menu">
        <span class="button group">添加javascript库,帮助你答题
        <select id="library"></select>
        </span>
      </div>
      <div id="start-saving" class="menu">
        <a href="/isarur/2/save" class="save button group">Start saving your work</a>
      </div>
      <div id="panels"></div>
      
    </div>
  </div>
</div>
<div id="bin" class="stretch" style="opacity: 0; filter:alpha(opacity=0);">
  <div id="source" class="binview stretch">
  </div>
  <div id="panelswaiting">
    <div class="code stretch html panel">
      <div class="label menu">
        <span class="name"><strong><a href="#htmlprocessors" class="fake-dropdown button-dropdown">HTML</a></strong></span>
        <div class="dropdown" id="htmlprocessors">
          <div class="dropdownmenu processorSelector" data-type="html">
            <a href="#html">HTML</a>
            <a href="#markdown">Markdown</a>
            <a href="#jade">Jade</a>
            <a href="#convert">Convert to HTML</a>
          </div>
        </div> 
      </div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="html"></textarea>
      </div>
    </div>
    <div class="code stretch javascript panel">
      <div class="label menu"><span class="name"><strong><a  class="fake-dropdown button-dropdown" href="#javascriptprocessors">JavaScript</a></strong></span>
        <div class="dropdown" id="javascriptprocessors">
          <div class="dropdownmenu processorSelector" data-type="javascript">
            <a href="#javascript">JavaScript</a>
            <a href="#coffeescript">CoffeeScript</a>
            <a href="#processing">Processing</a>
            <a href="#traceur">Traceur</a>
            <a href="#convert">Convert to JavaScript</a>
          </div>
        </div> 
      </div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="javascript"></textarea>
      </div>
    </div>
    <div class="code stretch css panel">
      <div class="label menu"><span class="name"><strong><a class="fake-dropdown button-dropdown" href="#cssprocessors">CSS</a></strong></span>
        <div class="dropdown" id="cssprocessors">
          <div class="dropdownmenu processorSelector" data-type="css">
            <a href="#css">CSS</a>
            <a href="#less">LESS</a>
            <a href="#stylus">Stylus</a>
            <a href="#convert">Convert to CSS</a>
          </div>
        </div> 
      </div>
      <div class="editbox">
        <textarea spellcheck="false" autocapitalize="off" autocorrect="off" id="css"></textarea>
      </div>
    </div>
    <div class="stretch console panel">
      <div class="label">
        <span class="name"><strong>Console</strong></span>
        <span class="options">
          <button id="runconsole" title="ctrl + enter">Run</button>
        </span>
      </div>
      <div id="console" class="stretch"><ul id="output"></ul><form>
          <textarea autofocus id="exec" spellcheck="false" autocapitalize="off" rows="1" autocorrect="off"></textarea>
      </form></div>
    </div>
    <div id="live" class="stretch live panel">
      <div class="label">
        <span class="name"><strong>Output</strong></span>
        <span class="options">
          <button id="runwithalerts" title="ctrl + enter
Include alerts, prompts &amp; confirm boxes">Run with JS</button>
          <label>Auto-run JS<input type="checkbox" id="enablejs"></label>
          <a target="_blank" title="Live preview" id="jsbinurl" class="" href="/isarur/2"><img src="http://static.jsbin.com/images/popout.png"></a>
        </span>
      </div>
    </div>
  </div>
  <form  id="saveform" method="post" action="/isarur/2/save">
    <input type="hidden" name="method" />
    <input type="hidden" name="_csrf" value="+Z9/I03LPaqjFUqRiNRvMPSY" />
  </form>
</div>
<div id="tip">
    <p>You can jump to the latest bin by adding <code>/latest</code> to your URL</p><a class="dismiss" href="#">Dismiss x</a>
</div>

<script>
  var template = {
   "html": "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=utf-8 />\n<title>JS Bin</title>\n</head>\n<body>\n  <h1>ddddd</h1>\n  <script>\n    document.getElementsByTagName('h1')[0].style.color='pink';\n  <\/script>\n</body>\n</html>\n",
   "url": "http://jsbin.com/isarur/2"
 };
 var jsbin = {
   "root": "http://jsbin.com",
   // "static": "http://static.jsbin.com",
   "version": "3.0.11",
   "state": {
     "token": "+Z9/I03LPaqjFUqRiNRvMPSY",
     "stream": false,
     "code": "isarur",
     "revision": 2,
     "processors": {},
     "checksum": null
   },
   "settings": {
     "panels": []
   }
 };
 tips = {};
</script>
<script src="assets/jsbin/jsbin-3.0.11.min.js"></script>