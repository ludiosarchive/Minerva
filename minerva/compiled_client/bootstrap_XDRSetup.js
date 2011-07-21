(function(){(function() {
  function f() {
    document.getElementById("minerva-xdrframes").innerHTML = '<iframe width=16 height=16 src="' + a.xdrurl1 + '" id="xdrframe-1"></iframe><iframe width=16 height=16 src="' + a.xdrurl2 + '" id="xdrframe-2"></iframe>'
  }
  function e() {
    return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ +new Date).toString(36)
  }
  var a = window.__XDRSetup;
  if(typeof a != "object") {
    throw Error("__XDRSetup not an object?");
  }
  var c = a.domain != null;
  if(a.use_subdomains = c) {
    document.domain = a.domain
  }
  a.loaded = function(b) {
    a.done.push(b)
  };
  a.done = [];
  var b = window.location, d = b.port ? ":" + b.port : "";
  a.id1 = e() + e();
  a.id2 = e() + e();
  c ? (c = a.sub1 + "." + a.domain + d, d = a.sub2 + "." + a.domain + d) : d = c = b.host;
  a.host1 = c;
  a.host2 = d;
  a.baseurl1 = b.protocol + "//" + c + "/";
  a.baseurl2 = b.protocol + "//" + d + "/";
  b = a.dev ? "httpface/xdrframe_dev/" : "httpface/xdrframe/";
  a.xdrurl1 = a.baseurl1 + b + "?framenum=1&id=" + a.id1 + "&domain=" + a.domain;
  a.xdrurl2 = a.baseurl2 + b + "?framenum=2&id=" + a.id2 + "&domain=" + a.domain;
  a.redirectCountdown = 2;
  eval("/*@cc_on!@*/false") ? window.setTimeout(f, 0) : f()
})();
})();
