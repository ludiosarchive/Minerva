(function(){(function() {
  function d() {
    document.getElementById("minerva-xdrframes").innerHTML = '<iframe width=16 height=16 src="' + a.xdrurl1 + '" id="xdrframe-1"></iframe><iframe width=16 height=16 src="' + a.xdrurl2 + '" id="xdrframe-2"></iframe>'
  }
  function b() {
    return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ +new Date).toString(36)
  }
  var a = window.__XDRSetup;
  if(typeof a != "object") {
    throw Error("__XDRSetup not an object?");
  }
  document.domain = a.domain;
  a.loaded = function(b) {
    a.done.push(b)
  };
  a.done = [];
  var c = window.location.port ? ":" + window.location.port : "";
  a.id1 = b() + b();
  a.id2 = b() + b();
  a.suffix = "." + a.domain + c + "/";
  a.baseurl1 = window.location.protocol + "//" + a.sub1 + a.suffix;
  a.baseurl2 = window.location.protocol + "//" + a.sub2 + a.suffix;
  c = a.dev ? "xdrframe_dev/" : "xdrframe/";
  a.xdrurl1 = a.baseurl1 + c + "?framenum=1&id=" + a.id1;
  a.xdrurl2 = a.baseurl2 + c + "?framenum=2&id=" + a.id2;
  a.redirectCountdown = 2;
  eval("/*@cc_on!@*/false") ? window.setTimeout(d, 0) : d()
})();
})();
