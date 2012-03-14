(function(){function g(a) {
  throw a;
}
var i = void 0, j = !0, k = null, m = !1;
function aa(a) {
  return function(b) {
    this[a] = b
  }
}
function o(a) {
  return function() {
    return this[a]
  }
}
function ba(a) {
  return function() {
    return a
  }
}
var q, ca = ca || {}, s = this;
function da(a) {
  for(var a = a.split("."), b = s, c;c = a.shift();) {
    if(b[c] != k) {
      b = b[c]
    }else {
      return k
    }
  }
  return b
}
function ea() {
}
function t(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
}
function fa(a) {
  return a !== i
}
function v(a) {
  return"array" == t(a)
}
function ga(a) {
  var b = t(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function ha(a) {
  return ia(a) && "function" == typeof a.getFullYear
}
function w(a) {
  return"string" == typeof a
}
function ja(a) {
  return"function" == t(a)
}
function ia(a) {
  var b = typeof a;
  return"object" == b && a != k || "function" == b
}
function ka(a) {
  return a[la] || (a[la] = ++ma)
}
var la = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), ma = 0;
function na(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function oa(a, b, c) {
  a || g(Error());
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
}
function x(a, b, c) {
  x = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? na : oa;
  return x.apply(k, arguments)
}
var pa = Date.now || function() {
  return+new Date
};
function y(a, b) {
  var c = a.split("."), d = s;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && fa(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
function A(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.n = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
}
;function B(a) {
  this.stack = Error().stack || "";
  a && (this.message = "" + a)
}
A(B, Error);
B.prototype.name = "CustomError";
function qa(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
var ra = /^[a-zA-Z0-9\-_.!~*'()]*$/;
function sa(a) {
  a = "" + a;
  return!ra.test(a) ? encodeURIComponent(a) : a
}
function ta(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
}
function C(a) {
  if(!ua.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(va, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(wa, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(xa, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(ya, "&quot;"));
  return a
}
var va = /&/g, wa = /</g, xa = />/g, ya = /\"/g, ua = /[&<>\"]/;
function za(a) {
  return ta(a.replace(/  /g, " &#160;"), i)
}
function Aa(a, b) {
  for(var c = 0, d = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = ("" + b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;0 == c && h < f;h++) {
    var l = d[h] || "", n = e[h] || "", r = RegExp("(\\d*)(\\D*)", "g"), D = RegExp("(\\d*)(\\D*)", "g");
    do {
      var p = r.exec(l) || ["", "", ""], u = D.exec(n) || ["", "", ""];
      if(0 == p[0].length && 0 == u[0].length) {
        break
      }
      c = ((0 == p[1].length ? 0 : parseInt(p[1], 10)) < (0 == u[1].length ? 0 : parseInt(u[1], 10)) ? -1 : (0 == p[1].length ? 0 : parseInt(p[1], 10)) > (0 == u[1].length ? 0 : parseInt(u[1], 10)) ? 1 : 0) || ((0 == p[2].length) < (0 == u[2].length) ? -1 : (0 == p[2].length) > (0 == u[2].length) ? 1 : 0) || (p[2] < u[2] ? -1 : p[2] > u[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
}
;function Ba(a, b) {
  b.unshift(a);
  B.call(this, qa.apply(k, b));
  b.shift()
}
A(Ba, B);
Ba.prototype.name = "AssertionError";
function Ca(a, b) {
  g(new Ba("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;function Da() {
  return j
}
;var Ea, Fa, Ga, Ha;
function Ia() {
  return s.navigator ? s.navigator.userAgent : k
}
Ha = Ga = Fa = Ea = m;
var Ja;
if(Ja = Ia()) {
  var Ka = s.navigator;
  Ea = 0 == Ja.indexOf("Opera");
  Fa = !Ea && -1 != Ja.indexOf("MSIE");
  Ga = !Ea && -1 != Ja.indexOf("WebKit");
  Ha = !Ea && !Ga && "Gecko" == Ka.product
}
var La = Ea, E = Fa, Ma = Ha, F = Ga, Na;
a: {
  var Oa = "", Pa;
  if(La && s.opera) {
    var Qa = s.opera.version, Oa = "function" == typeof Qa ? Qa() : Qa
  }else {
    if(Ma ? Pa = /rv\:([^\);]+)(\)|;)/ : E ? Pa = /MSIE\s+([^\);]+)(\)|;)/ : F && (Pa = /WebKit\/(\S+)/), Pa) {
      var Ra = Pa.exec(Ia()), Oa = Ra ? Ra[1] : ""
    }
  }
  if(E) {
    var Sa, Ta = s.document;
    Sa = Ta ? Ta.documentMode : i;
    if(Sa > parseFloat(Oa)) {
      Na = "" + Sa;
      break a
    }
  }
  Na = Oa
}
var Ua = {};
function G(a) {
  return Ua[a] || (Ua[a] = 0 <= Aa(Na, a))
}
var Va = {};
function Wa() {
  return Va[9] || (Va[9] = E && !!document.documentMode && 9 <= document.documentMode)
}
;function Xa() {
}
var Ya = 0;
q = Xa.prototype;
q.key = 0;
q.Ma = m;
q.Rb = m;
q.xb = function(a, b, c, d, e, f) {
  ja(a) ? this.gd = j : a && a.handleEvent && ja(a.handleEvent) ? this.gd = m : g(Error("Invalid listener argument"));
  this.ab = a;
  this.yd = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.ec = f;
  this.Rb = m;
  this.key = ++Ya;
  this.Ma = m
};
q.handleEvent = function(a) {
  return this.gd ? this.ab.call(this.ec || this.src, a) : this.ab.handleEvent.call(this.ab, a)
};
function Za(a, b) {
  for(var c in a) {
    b.call(i, a[c], c, a)
  }
}
function $a(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function ab(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var bb = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function cb(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < bb.length;f++) {
      c = bb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!E || Wa();
var db = !E || Wa();
E && G("8");
!F || G("528");
Ma && G("1.9b") || E && G("8") || La && G("9.5") || F && G("528");
Ma && !G("8") || E && G("9");
var H = Array.prototype, eb = H.indexOf ? function(a, b, c) {
  return H.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == k ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(w(a)) {
    return!w(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, fb = H.forEach ? function(a, b, c) {
  H.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = w(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
}, gb = H.map ? function(a, b, c) {
  return H.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = w(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in f && (e[h] = b.call(c, f[h], h, a))
  }
  return e
}, hb = H.some ? function(a, b, c) {
  return H.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = w(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return j
    }
  }
  return m
}, ib = H.every ? function(a, b, c) {
  return H.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = w(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return m
    }
  }
  return j
};
function jb(a, b) {
  var c = eb(a, b);
  0 <= c && H.splice.call(a, c, 1)
}
function kb(a) {
  return H.concat.apply(H, arguments)
}
function lb(a) {
  if(v(a)) {
    return kb(a)
  }
  for(var b = [], c = 0, d = a.length;c < d;c++) {
    b[c] = a[c]
  }
  return b
}
function mb(a, b, c) {
  return 2 >= arguments.length ? H.slice.call(a, b) : H.slice.call(a, b, c)
}
function nb(a, b) {
  H.sort.call(a, b || ob)
}
function ob(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var pb = {Xe:"click", bf:"dblclick", wf:"mousedown", Af:"mouseup", zf:"mouseover", yf:"mouseout", xf:"mousemove", Kf:"selectstart", rf:"keypress", qf:"keydown", sf:"keyup", Ve:"blur", kf:"focus", cf:"deactivate", lf:E ? "focusin" : "DOMFocusIn", mf:E ? "focusout" : "DOMFocusOut", We:"change", Jf:"select", Lf:"submit", pf:"input", Ff:"propertychange", gf:"dragstart", df:"dragenter", ff:"dragover", ef:"dragleave", hf:"drop", Pf:"touchstart", Of:"touchmove", Nf:"touchend", Mf:"touchcancel", Ze:"contextmenu", 
jf:"error", of:"help", tf:"load", uf:"losecapture", Gf:"readystatechange", Hf:"resize", If:"scroll", Rf:"unload", nf:"hashchange", Bf:"pagehide", Cf:"pageshow", Ef:"popstate", $e:"copy", Df:"paste", af:"cut", Se:"beforecopy", Te:"beforecut", Ue:"beforepaste", vf:"message", Ye:"connect", Qf:F ? "webkitTransitionEnd" : La ? "oTransitionEnd" : "transitionend"};
function I() {
}
I.prototype.Z = m;
I.prototype.b = function() {
  this.Z || (this.Z = j, this.d())
};
I.prototype.d = function() {
  this.be && qb.apply(k, this.be)
};
function qb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    ga(d) ? qb.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function J(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
A(J, I);
J.prototype.d = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
J.prototype.xa = m;
J.prototype.Hb = j;
J.prototype.stopPropagation = function() {
  this.xa = j
};
function rb(a) {
  a.stopPropagation()
}
;function sb(a) {
  sb[" "](a);
  return a
}
sb[" "] = ea;
function tb(a, b) {
  a && this.xb(a, b)
}
A(tb, J);
q = tb.prototype;
q.target = k;
q.relatedTarget = k;
q.offsetX = 0;
q.offsetY = 0;
q.clientX = 0;
q.clientY = 0;
q.screenX = 0;
q.screenY = 0;
q.button = 0;
q.keyCode = 0;
q.charCode = 0;
q.ctrlKey = m;
q.altKey = m;
q.shiftKey = m;
q.metaKey = m;
q.Wa = k;
q.xb = function(a, b) {
  var c = this.type = a.type;
  J.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ma) {
      var e;
      a: {
        try {
          sb(d.nodeName);
          e = j;
          break a
        }catch(f) {
        }
        e = m
      }
      e || (d = k)
    }
  }else {
    "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement)
  }
  this.relatedTarget = d;
  this.offsetX = F || a.offsetX !== i ? a.offsetX : a.layerX;
  this.offsetY = F || a.offsetY !== i ? a.offsetY : a.layerY;
  this.clientX = a.clientX !== i ? a.clientX : a.pageX;
  this.clientY = a.clientY !== i ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.state = a.state;
  this.Wa = a;
  delete this.Hb;
  delete this.xa
};
q.stopPropagation = function() {
  tb.n.stopPropagation.call(this);
  this.Wa.stopPropagation ? this.Wa.stopPropagation() : this.Wa.cancelBubble = j
};
q.d = function() {
  tb.n.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.Wa = k
};
var ub = {}, K = {}, L = {}, vb = {};
function wb(a, b, c, d, e) {
  if(b) {
    if(v(b)) {
      for(var f = 0;f < b.length;f++) {
        wb(a, b[f], c, d, e)
      }
      return k
    }
    var d = !!d, h = K;
    b in h || (h[b] = {c:0, M:0});
    h = h[b];
    d in h || (h[d] = {c:0, M:0}, h.c++);
    var h = h[d], l = ka(a), n;
    h.M++;
    if(h[l]) {
      n = h[l];
      for(f = 0;f < n.length;f++) {
        if(h = n[f], h.ab == c && h.ec == e) {
          if(h.Ma) {
            break
          }
          return n[f].key
        }
      }
    }else {
      n = h[l] = [], h.c++
    }
    f = xb();
    f.src = a;
    h = new Xa;
    h.xb(c, f, a, b, d, e);
    c = h.key;
    f.key = c;
    n.push(h);
    ub[c] = h;
    L[l] || (L[l] = []);
    L[l].push(h);
    a.addEventListener ? (a == s || !a.Oc) && a.addEventListener(b, f, d) : a.attachEvent(b in vb ? vb[b] : vb[b] = "on" + b, f);
    return c
  }
  g(Error("Invalid event type"))
}
function xb() {
  var a = yb, b = db ? function(c) {
    return a.call(b.src, b.key, c)
  } : function(c) {
    c = a.call(b.src, b.key, c);
    if(!c) {
      return c
    }
  };
  return b
}
function zb(a, b, c, d, e) {
  if(v(b)) {
    for(var f = 0;f < b.length;f++) {
      zb(a, b[f], c, d, e)
    }
    return k
  }
  a = wb(a, b, c, d, e);
  ub[a].Rb = j;
  return a
}
function Ab(a, b, c, d, e) {
  if(v(b)) {
    for(var f = 0;f < b.length;f++) {
      Ab(a, b[f], c, d, e)
    }
  }else {
    d = !!d;
    a: {
      f = K;
      if(b in f && (f = f[b], d in f && (f = f[d], a = ka(a), f[a]))) {
        a = f[a];
        break a
      }
      a = k
    }
    if(a) {
      for(f = 0;f < a.length;f++) {
        if(a[f].ab == c && a[f].capture == d && a[f].ec == e) {
          Bb(a[f].key);
          break
        }
      }
    }
  }
}
function Bb(a) {
  if(!ub[a]) {
    return m
  }
  var b = ub[a];
  if(b.Ma) {
    return m
  }
  var c = b.src, d = b.type, e = b.yd, f = b.capture;
  c.removeEventListener ? (c == s || !c.Oc) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in vb ? vb[d] : vb[d] = "on" + d, e);
  c = ka(c);
  e = K[d][f][c];
  if(L[c]) {
    var h = L[c];
    jb(h, b);
    0 == h.length && delete L[c]
  }
  b.Ma = j;
  e.sd = j;
  Cb(d, f, c, e);
  delete ub[a];
  return j
}
function Cb(a, b, c, d) {
  if(!d.zb && d.sd) {
    for(var e = 0, f = 0;e < d.length;e++) {
      d[e].Ma ? d[e].yd.src = k : (e != f && (d[f] = d[e]), f++)
    }
    d.length = f;
    d.sd = m;
    0 == f && (delete K[a][b][c], K[a][b].c--, 0 == K[a][b].c && (delete K[a][b], K[a].c--), 0 == K[a].c && delete K[a])
  }
}
function Db(a) {
  var b, c = 0, d = b == k;
  b = !!b;
  if(a == k) {
    Za(L, function(a) {
      for(var e = a.length - 1;0 <= e;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Bb(f.key), c++
        }
      }
    })
  }else {
    if(a = ka(a), L[a]) {
      for(var a = L[a], e = a.length - 1;0 <= e;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Bb(f.key), c++
        }
      }
    }
  }
}
function Eb(a, b, c, d, e) {
  var f = 1, b = ka(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.zb ? a.zb++ : a.zb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Ma && (f &= Fb(n, e) !== m)
      }
    }finally {
      a.zb--, Cb(c, d, b, a)
    }
  }
  return Boolean(f)
}
function Fb(a, b) {
  var c = a.handleEvent(b);
  a.Rb && Bb(a.key);
  return c
}
function yb(a, b) {
  if(!ub[a]) {
    return j
  }
  var c = ub[a], d = c.type, e = K;
  if(!(d in e)) {
    return j
  }
  var e = e[d], f, h;
  if(!db) {
    f = b || da("window.event");
    var l = j in e, n = m in e;
    if(l) {
      if(0 > f.keyCode || f.returnValue != i) {
        return j
      }
      a: {
        var r = m;
        if(0 == f.keyCode) {
          try {
            f.keyCode = -1;
            break a
          }catch(D) {
            r = j
          }
        }
        if(r || f.returnValue == i) {
          f.returnValue = j
        }
      }
    }
    r = new tb;
    r.xb(f, this);
    f = j;
    try {
      if(l) {
        for(var p = [], u = r.currentTarget;u;u = u.parentNode) {
          p.push(u)
        }
        h = e[j];
        h.M = h.c;
        for(var z = p.length - 1;!r.xa && 0 <= z && h.M;z--) {
          r.currentTarget = p[z], f &= Eb(h, p[z], d, j, r)
        }
        if(n) {
          h = e[m];
          h.M = h.c;
          for(z = 0;!r.xa && z < p.length && h.M;z++) {
            r.currentTarget = p[z], f &= Eb(h, p[z], d, m, r)
          }
        }
      }else {
        f = Fb(c, r)
      }
    }finally {
      p && (p.length = 0), r.b()
    }
    return f
  }
  d = new tb(b, this);
  try {
    f = Fb(c, d)
  }finally {
    d.b()
  }
  return f
}
var Gb = 0;
function Hb() {
}
A(Hb, I);
q = Hb.prototype;
q.Oc = j;
q.Cb = k;
q.vc = aa("Cb");
q.addEventListener = function(a, b, c, d) {
  wb(this, a, b, c, d)
};
q.removeEventListener = function(a, b, c, d) {
  Ab(this, a, b, c, d)
};
q.dispatchEvent = function(a) {
  var b = a.type || a, c = K;
  if(b in c) {
    if(w(a)) {
      a = new J(a, this)
    }else {
      if(a instanceof J) {
        a.target = a.target || this
      }else {
        var d = a, a = new J(b, this);
        cb(a, d)
      }
    }
    var d = 1, e, c = c[b], b = j in c, f;
    if(b) {
      e = [];
      for(f = this;f;f = f.Cb) {
        e.push(f)
      }
      f = c[j];
      f.M = f.c;
      for(var h = e.length - 1;!a.xa && 0 <= h && f.M;h--) {
        a.currentTarget = e[h], d &= Eb(f, e[h], a.type, j, a) && a.Hb != m
      }
    }
    if(m in c) {
      if(f = c[m], f.M = f.c, b) {
        for(h = 0;!a.xa && h < e.length && f.M;h++) {
          a.currentTarget = e[h], d &= Eb(f, e[h], a.type, m, a) && a.Hb != m
        }
      }else {
        for(e = this;!a.xa && e && f.M;e = e.Cb) {
          a.currentTarget = e, d &= Eb(f, e, a.type, m, a) && a.Hb != m
        }
      }
    }
    a = Boolean(d)
  }else {
    a = j
  }
  return a
};
q.d = function() {
  Hb.n.d.call(this);
  Db(this);
  this.Cb = k
};
var Ib = s.window;
Gb++;
Gb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function M(a, b) {
  this.mb = [];
  this.Kc = a;
  this.Qc = b || k
}
q = M.prototype;
q.ga = m;
q.Xa = m;
q.bb = 0;
q.wc = m;
q.Xd = m;
q.Qb = 0;
q.cancel = function(a) {
  if(this.ga) {
    this.eb instanceof M && this.eb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.Qb--, 0 >= b.Qb && b.cancel())
    }
    this.Kc ? this.Kc.call(this.Qc, this) : this.wc = j;
    this.ga || this.Va(new Jb)
  }
};
q.Mc = function(a, b) {
  Kb(this, a, b);
  this.bb--;
  0 == this.bb && this.ga && Lb(this)
};
function Kb(a, b, c) {
  a.ga = j;
  a.eb = c;
  a.Xa = !b;
  Lb(a)
}
function Mb(a) {
  a.ga && (a.wc || g(new Nb), a.wc = m)
}
function Ob(a, b) {
  Mb(a);
  Kb(a, j, b)
}
q.Va = function(a) {
  Mb(this);
  Kb(this, m, a)
};
function Pb(a, b) {
  Qb(a, b, k, i)
}
function Rb(a, b) {
  Qb(a, k, b, i)
}
function Qb(a, b, c, d) {
  a.mb.push([b, c, d]);
  a.ga && Lb(a)
}
function Sb(a, b) {
  Qb(a, b, b, i)
}
function Tb(a) {
  return hb(a.mb, function(a) {
    return ja(a[1])
  })
}
function Lb(a) {
  a.Fc && a.ga && Tb(a) && (s.clearTimeout(a.Fc), delete a.Fc);
  a.t && (a.t.Qb--, delete a.t);
  for(var b = a.eb, c = m, d = m;a.mb.length && 0 == a.bb;) {
    var e = a.mb.shift(), f = e[0], h = e[1], e = e[2];
    if(f = a.Xa ? h : f) {
      try {
        var l = f.call(e || a.Qc, b);
        fa(l) && (a.Xa = a.Xa && (l == b || l instanceof Error), a.eb = b = l);
        b instanceof M && (d = j, a.bb++)
      }catch(n) {
        b = n, a.Xa = j, Tb(a) || (c = j)
      }
    }
  }
  a.eb = b;
  d && a.bb && (Qb(b, x(a.Mc, a, j), x(a.Mc, a, m)), b.Xd = j);
  c && (a.Fc = s.setTimeout(function() {
    fa(b.message) && b.stack && (b.message = b.message + ("\n" + b.stack));
    g(b)
  }, 0))
}
function Ub(a) {
  var b = new M;
  Ob(b, a);
  return b
}
function Vb(a) {
  var b = new M;
  b.Va(a);
  return b
}
function Nb() {
  B.call(this)
}
A(Nb, B);
Nb.prototype.message = "Already called";
function Jb() {
  B.call(this)
}
A(Jb, B);
Jb.prototype.message = "Deferred was cancelled";
function Wb(a) {
  this.w = a;
  this.qb = [];
  this.Tc = [];
  this.Wd = x(this.Me, this)
}
Wb.prototype.Cc = k;
function Xb(a, b, c, d) {
  a.qb.push([b, c, d]);
  a.Cc == k && (a.Cc = a.w.setTimeout(a.Wd, 0))
}
Wb.prototype.Me = function() {
  this.Cc = k;
  var a = this.qb;
  this.qb = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], e = c[1], c = c[2];
    try {
      d.apply(e, c)
    }catch(f) {
      this.w.setTimeout(function() {
        g(f)
      }, 0)
    }
  }
  if(0 == this.qb.length) {
    a = this.Tc;
    this.Tc = [];
    for(b = 0;b < a.length;b++) {
      Ob(a[b], k)
    }
  }
};
var Yb = new Wb(s.window);
function Zb(a) {
  return ja(a) || "object" == typeof a && ja(a.call) && ja(a.apply)
}
;function $b(a) {
  var b = [];
  ac(new bc, a, b);
  return b.join("")
}
function bc() {
  this.Gb = i
}
function ac(a, b, c) {
  switch(typeof b) {
    case "string":
      cc(b, c);
      break;
    case "number":
      c.push(isFinite(b) && !isNaN(b) ? b : "null");
      break;
    case "boolean":
      c.push(b);
      break;
    case "undefined":
      c.push("null");
      break;
    case "object":
      if(b == k) {
        c.push("null");
        break
      }
      if(v(b)) {
        var d = b.length;
        c.push("[");
        for(var e = "", f = 0;f < d;f++) {
          c.push(e), e = b[f], ac(a, a.Gb ? a.Gb.call(b, "" + f, e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(f in b) {
        Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], "function" != typeof e && (c.push(d), cc(f, c), c.push(":"), ac(a, a.Gb ? a.Gb.call(b, f, e) : e, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var ec = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, fc = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function cc(a, b) {
  b.push('"', a.replace(fc, function(a) {
    if(a in ec) {
      return ec[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
    return ec[a] = e + b.toString(16)
  }), '"')
}
;function gc(a, b, c) {
  var d = eb(c, a);
  if(-1 != d) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = t(a);
    if("boolean" == d || "number" == d || "null" == d || "undefined" == d) {
      b.push("" + a)
    }else {
      if("string" == d) {
        cc(a, b)
      }else {
        if(Zb(a.A)) {
          a.A(b, c)
        }else {
          if(Zb(a.Qd)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var e = "", f = 0;f < d;f++) {
                  b.push(e), gc(a[f], b, c), e = ", "
                }
                b.push("]")
              }else {
                if("object" == d) {
                  if(ha(a) && "function" == typeof a.valueOf) {
                    b.push("new Date(", "" + a.valueOf(), ")")
                  }else {
                    for(var d = ab(a).concat(bb), e = {}, h = f = 0;h < d.length;) {
                      var l = d[h++], n = ia(l) ? "o" + ka(l) : (typeof l).charAt(0) + l;
                      Object.prototype.hasOwnProperty.call(e, n) || (e[n] = j, d[f++] = l)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      f = d[h], Object.prototype.hasOwnProperty.call(a, f) && (l = a[f], b.push(e), cc(f, b), b.push(": "), gc(l, b, c), e = ", ")
                    }
                    b.push("}")
                  }
                }else {
                  b.push(a.toString())
                }
              }
            }
          }
        }
      }
    }
    c.pop()
  }
}
function N(a, b, c) {
  c || (c = []);
  gc(a, b, c)
}
function O(a, b) {
  var c = [];
  N(a, c, b);
  return c.join("")
}
;function hc() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ pa()).toString(36)
}
function ic(a) {
  return a.substr(0, a.length - 1)
}
var jc = /^(0|[1-9]\d*)$/, kc = /^(0|\-?[1-9]\d*)$/;
function lc(a) {
  var b = mc;
  return jc.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;var mc = Math.pow(2, 53);
function nc(a) {
  if("function" == typeof a.C) {
    a = a.C()
  }else {
    if(ga(a) || w(a)) {
      a = a.length
    }else {
      var b = 0, c;
      for(c in a) {
        b++
      }
      a = b
    }
  }
  return a
}
function oc(a) {
  if("function" == typeof a.J) {
    return a.J()
  }
  if(w(a)) {
    return a.split("")
  }
  if(ga(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return $a(a)
}
function pc(a) {
  if("function" == typeof a.ba) {
    return a.ba()
  }
  if("function" != typeof a.J) {
    if(ga(a) || w(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return ab(a)
  }
}
function qc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ga(a) || w(a)) {
      fb(a, b, c)
    }else {
      for(var d = pc(a), e = oc(a), f = e.length, h = 0;h < f;h++) {
        b.call(c, e[h], d && d[h], a)
      }
    }
  }
}
function rc(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, i)
  }
  if(ga(a) || w(a)) {
    return ib(a, b, i)
  }
  for(var c = pc(a), d = oc(a), e = d.length, f = 0;f < e;f++) {
    if(!b.call(i, d[f], c && c[f], a)) {
      return m
    }
  }
  return j
}
;function P(a, b) {
  this.m = {};
  this.h = [];
  var c = arguments.length;
  if(1 < c) {
    c % 2 && g(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.Pb(a)
  }
}
q = P.prototype;
q.c = 0;
q.C = o("c");
q.J = function() {
  sc(this);
  for(var a = [], b = 0;b < this.h.length;b++) {
    a.push(this.m[this.h[b]])
  }
  return a
};
q.ba = function() {
  sc(this);
  return this.h.concat()
};
q.S = function(a) {
  return tc(this.m, a)
};
q.Ub = function(a) {
  for(var b = 0;b < this.h.length;b++) {
    var c = this.h[b];
    if(tc(this.m, c) && this.m[c] == a) {
      return j
    }
  }
  return m
};
q.I = function(a, b) {
  if(this === a) {
    return j
  }
  if(this.c != a.C()) {
    return m
  }
  var c = b || uc;
  sc(this);
  for(var d, e = 0;d = this.h[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function uc(a, b) {
  return a === b
}
q.Za = function() {
  return 0 == this.c
};
q.clear = function() {
  this.m = {};
  this.c = this.h.length = 0
};
q.remove = function(a) {
  return tc(this.m, a) ? (delete this.m[a], this.c--, this.h.length > 2 * this.c && sc(this), j) : m
};
function sc(a) {
  if(a.c != a.h.length) {
    for(var b = 0, c = 0;b < a.h.length;) {
      var d = a.h[b];
      tc(a.m, d) && (a.h[c++] = d);
      b++
    }
    a.h.length = c
  }
  if(a.c != a.h.length) {
    for(var e = {}, c = b = 0;b < a.h.length;) {
      d = a.h[b], tc(e, d) || (a.h[c++] = d, e[d] = 1), b++
    }
    a.h.length = c
  }
}
q.get = function(a, b) {
  return tc(this.m, a) ? this.m[a] : b
};
q.set = function(a, b) {
  tc(this.m, a) || (this.c++, this.h.push(a));
  this.m[a] = b
};
q.Pb = function(a) {
  var b;
  a instanceof P ? (b = a.ba(), a = a.J()) : (b = ab(a), a = $a(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
q.N = function() {
  return new P(this)
};
function vc(a) {
  sc(a);
  for(var b = {}, c = 0;c < a.h.length;c++) {
    var d = a.h[c];
    b[d] = a.m[d]
  }
  return b
}
function tc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;var wc = {Qd:ba("<cw.eq.Wildcard>")};
function xc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function yc(a, b, c) {
  var d = t(a), e = t(b);
  if(a == wc || b == wc) {
    return j
  }
  if(a != k && "function" == typeof a.I) {
    return c && c.push("running custom equals function on left object"), a.I(b, c)
  }
  if(b != k && "function" == typeof b.I) {
    return c && c.push("running custom equals function on right object"), b.I(a, c)
  }
  if(xc(d) || xc(e)) {
    a = a === b
  }else {
    if(a instanceof RegExp && b instanceof RegExp) {
      a = a.toString() === b.toString()
    }else {
      if(ha(a) && ha(b)) {
        a = a.valueOf() === b.valueOf()
      }else {
        if("array" == d && "array" == e) {
          a: {
            if(c && c.push("descending into array"), a.length != b.length) {
              c && c.push("array length mismatch: " + a.length + ", " + b.length), a = m
            }else {
              d = 0;
              for(e = a.length;d < e;d++) {
                if(!yc(a[d], b[d], c)) {
                  c && c.push("earlier comparisons indicate mismatch at array item #" + d);
                  a = m;
                  break a
                }
              }
              c && c.push("ascending from array");
              a = j
            }
          }
        }else {
          if(a.Pd == Da && b.Pd == Da) {
            a: {
              c && c.push("descending into object");
              for(var f in a) {
                if(!(f in b)) {
                  c && c.push("property " + f + " missing on right object");
                  a = m;
                  break a
                }
                if(!yc(a[f], b[f], c)) {
                  c && c.push("earlier comparisons indicate mismatch at property " + f);
                  a = m;
                  break a
                }
              }
              for(f in b) {
                if(!(f in a)) {
                  c && c.push("property " + f + " missing on left object");
                  a = m;
                  break a
                }
              }
              c && c.push("ascending from object");
              a = j
            }
          }else {
            a = a === b
          }
        }
      }
    }
  }
  return a
}
;function Q(a, b) {
  this.ze = a;
  this.Eb = b
}
Q.prototype.I = function(a, b) {
  return ia(a) && this.constructor == a.constructor && yc(this.Eb, a.Eb, b)
};
Q.prototype.A = function(a, b) {
  a.push("new ", this.ze, "(");
  for(var c = "", d = 0;d < this.Eb.length;d++) {
    a.push(c), c = ", ", N(this.Eb[d], a, b)
  }
  a.push(")")
};
var zc, Ac;
function Bc() {
  this.Bd = pa()
}
var Cc = new Bc;
Bc.prototype.set = aa("Bd");
Bc.prototype.reset = function() {
  this.set(pa())
};
Bc.prototype.get = o("Bd");
function Dc(a) {
  this.xe = a || "";
  this.Ge = Cc
}
Dc.prototype.Id = j;
Dc.prototype.Fe = j;
Dc.prototype.Ee = j;
Dc.prototype.Jd = m;
function Ec(a) {
  return 10 > a ? "0" + a : "" + a
}
function Fc(a, b) {
  var c = (a.Ld - b) / 1E3, d = c.toFixed(3), e = 0;
  if(1 > c) {
    e = 2
  }else {
    for(;100 > c;) {
      e++, c *= 10
    }
  }
  for(;0 < e--;) {
    d = " " + d
  }
  return d
}
function Gc(a) {
  Dc.call(this, a)
}
A(Gc, Dc);
Gc.prototype.Jd = j;
var Hc;
function Ic(a, b) {
  var c;
  c = a.className;
  c = w(c) && c.match(/\S+/g) || [];
  for(var d = mb(arguments, 1), e = c.length + d.length, f = c, h = 0;h < d.length;h++) {
    0 <= eb(f, d[h]) || f.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == e
}
;var Jc = !E || Wa();
!Ma && !E || E && Wa() || Ma && G("1.9.1");
E && G("9");
function Kc(a) {
  return a ? new Lc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Hc || (Hc = new Lc)
}
function R(a) {
  return w(a) ? document.getElementById(a) : a
}
function Mc(a, b) {
  Za(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in Nc ? a.setAttribute(Nc[d], b) : 0 == d.lastIndexOf("aria-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var Nc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Oc(a, b, c) {
  return Pc(document, arguments)
}
function Pc(a, b) {
  var c = b[0], d = b[1];
  if(!Jc && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', C(d.name), '"');
    if(d.type) {
      c.push(' type="', C(d.type), '"');
      var e = {};
      cb(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (w(d) ? c.className = d : v(d) ? Ic.apply(k, [c].concat(d)) : Mc(c, d));
  2 < b.length && Qc(a, c, b, 2);
  return c
}
function Qc(a, b, c, d) {
  function e(c) {
    c && b.appendChild(w(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    ga(f) && !(ia(f) && 0 < f.nodeType) ? fb(Rc(f) ? lb(f) : f, e) : e(f)
  }
}
function Sc(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function Rc(a) {
  if(a && "number" == typeof a.length) {
    if(ia(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(ja(a)) {
      return"function" == typeof a.item
    }
  }
  return m
}
function Lc(a) {
  this.ra = a || s.document || document
}
q = Lc.prototype;
q.Xc = Kc;
q.ta = function(a) {
  return w(a) ? this.ra.getElementById(a) : a
};
function Tc(a, b) {
  var c;
  c = a.ra;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && (!F || "CSS1Compat" == document.compatMode || G("528")) && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
q.Ua = function(a, b, c) {
  return Pc(this.ra, arguments)
};
q.createElement = function(a) {
  return this.ra.createElement(a)
};
q.createTextNode = function(a) {
  return this.ra.createTextNode(a)
};
q.appendChild = function(a, b) {
  a.appendChild(b)
};
q.append = function(a, b) {
  Qc(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
};
q.contains = function(a, b) {
  if(a.contains && 1 == b.nodeType) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
function Uc(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
function Vc(a) {
  E ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[F ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function Wc(a) {
  this.m = new P;
  a && this.Pb(a)
}
function Xc(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ka(a) : b.substr(0, 1) + a
}
q = Wc.prototype;
q.C = function() {
  return this.m.C()
};
q.add = function(a) {
  this.m.set(Xc(a), a)
};
q.Pb = function(a) {
  for(var a = oc(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
q.sc = function(a) {
  for(var a = oc(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
q.remove = function(a) {
  return this.m.remove(Xc(a))
};
q.clear = function() {
  this.m.clear()
};
q.Za = function() {
  return this.m.Za()
};
q.contains = function(a) {
  return this.m.S(Xc(a))
};
q.J = function() {
  return this.m.J()
};
q.N = function() {
  return new Wc(this)
};
q.I = function(a) {
  return this.C() == nc(a) && Yc(this, a)
};
function Yc(a, b) {
  var c = nc(b);
  if(a.C() > c) {
    return m
  }
  !(b instanceof Wc) && 5 < c && (b = new Wc(b));
  return rc(a, function(a) {
    if("function" == typeof b.contains) {
      a = b.contains(a)
    }else {
      if("function" == typeof b.Ub) {
        a = b.Ub(a)
      }else {
        if(ga(b) || w(b)) {
          a = 0 <= eb(b, a)
        }else {
          a: {
            for(var c in b) {
              if(b[c] == a) {
                a = j;
                break a
              }
            }
            a = m
          }
        }
      }
    }
    return a
  })
}
;function Zc(a) {
  return $c(a || arguments.callee.caller, [])
}
function $c(a, b) {
  var c = [];
  if(0 <= eb(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(ad(a) + "(");
      for(var d = a.arguments, e = 0;e < d.length;e++) {
        0 < e && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = "" + f;
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = ad(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push($c(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function ad(a) {
  if(bd[a]) {
    return bd[a]
  }
  a = "" + a;
  if(!bd[a]) {
    var b = /function ([^\(]+)/.exec(a);
    bd[a] = b ? b[1] : "[Anonymous]"
  }
  return bd[a]
}
var bd = {};
function cd(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
cd.prototype.bc = k;
cd.prototype.ac = k;
var dd = 0;
cd.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || dd++;
  this.Ld = d || pa();
  this.Ja = a;
  this.qd = b;
  this.se = c;
  delete this.bc;
  delete this.ac
};
cd.prototype.uc = aa("Ja");
function S(a) {
  this.ue = a
}
S.prototype.t = k;
S.prototype.Ja = k;
S.prototype.fa = k;
S.prototype.Fa = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var ed = new T("OFF", Infinity), fd = new T("SHOUT", 1200), gd = new T("SEVERE", 1E3), hd = new T("WARNING", 900), id = new T("INFO", 800), kd = new T("CONFIG", 700), ld = new T("FINE", 500), md = new T("FINER", 400), nd = new T("FINEST", 300), od = new T("ALL", 0);
function U(a) {
  return V.Zc(a)
}
q = S.prototype;
q.getParent = o("t");
q.uc = aa("Ja");
function pd(a) {
  if(a.Ja) {
    return a.Ja
  }
  if(a.t) {
    return pd(a.t)
  }
  Ca("Root logger has no level set.");
  return k
}
q.log = function(a, b, c) {
  if(a.value >= pd(this).value) {
    a = this.le(a, b, c);
    b = "log:" + a.qd;
    s.console && (s.console.timeStamp ? s.console.timeStamp(b) : s.console.markTimeline && s.console.markTimeline(b));
    s.msWriteProfilerMark && s.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Fa) {
        for(var e = 0, f = i;f = c.Fa[e];e++) {
          f(d)
        }
      }
      b = b.getParent()
    }
  }
};
q.le = function(a, b, c) {
  var d = new cd(a, "" + b, this.ue);
  if(c) {
    d.bc = c;
    var e;
    var f = arguments.callee.caller;
    try {
      var h;
      var l = da("window.location.href");
      if(w(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:l, stack:"Not available"}
      }else {
        var n, r, D = m;
        try {
          n = c.lineNumber || c.re || "Not available"
        }catch(p) {
          n = "Not available", D = j
        }
        try {
          r = c.fileName || c.filename || c.sourceURL || l
        }catch(u) {
          r = "Not available", D = j
        }
        h = D || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:r, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + C(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + C(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + C(Zc(f) + "-> ")
    }catch(z) {
      e = "Exception trying to expose exception! You win, we lose. " + z
    }
    d.ac = e
  }
  return d
};
q.De = function(a, b) {
  this.log(fd, a, b)
};
q.F = function(a, b) {
  this.log(gd, a, b)
};
q.z = function(a, b) {
  this.log(hd, a, b)
};
q.info = function(a, b) {
  this.log(id, a, b)
};
q.Zd = function(a, b) {
  this.log(kd, a, b)
};
q.k = function(a, b) {
  this.log(ld, a, b)
};
q.he = function(a, b) {
  this.log(md, a, b)
};
q.q = function(a, b) {
  this.log(nd, a, b)
};
var V = {Ab:{}, fb:k, dd:function() {
  V.fb || (V.fb = new S(""), V.Ab[""] = V.fb, V.fb.uc(kd))
}, Tf:function() {
  return V.Ab
}, dc:function() {
  V.dd();
  return V.fb
}, Zc:function(a) {
  V.dd();
  return V.Ab[a] || V.ae(a)
}, Sf:function(a) {
  return function(b) {
    (a || V.dc()).F("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.re + ")")
  }
}, ae:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.Zc(a.substr(0, c));
  c.fa || (c.fa = {});
  c.fa[d] = b;
  b.t = c;
  return V.Ab[a] = b
}};
function qd(a) {
  this.zd = x(this.Rd, this);
  this.Wc = new Gc;
  this.fd = this.Wc.Id = m;
  this.i = a;
  this.fe = this.i.ownerDocument || this.i.document;
  var a = Kc(this.i), b = k;
  if(E) {
    b = a.ra.createStyleSheet(), Vc(b)
  }else {
    var c = Tc(a, "head")[0];
    c || (b = Tc(a, "body")[0], c = a.Ua("head"), b.parentNode.insertBefore(c, b));
    b = a.Ua("style");
    Vc(b);
    a.appendChild(c, b)
  }
  this.i.className += " logdiv"
}
qd.prototype.Ce = function(a) {
  if(a != this.fd) {
    var b = V.dc();
    if(a) {
      var c = this.zd;
      b.Fa || (b.Fa = []);
      b.Fa.push(c)
    }else {
      (b = b.Fa) && jb(b, this.zd)
    }
    this.fd = a
  }
};
qd.prototype.Rd = function(a) {
  var b = 100 >= this.i.scrollHeight - this.i.scrollTop - this.i.clientHeight, c = this.fe.createElement("div");
  c.className = "logmsg";
  var d = this.Wc, e;
  switch(a.Ja.value) {
    case fd.value:
      e = "dbg-sh";
      break;
    case gd.value:
      e = "dbg-sev";
      break;
    case hd.value:
      e = "dbg-w";
      break;
    case id.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var f = [];
  f.push(d.xe, " ");
  if(d.Id) {
    var h = new Date(a.Ld);
    f.push("[", Ec(h.getFullYear() - 2E3) + Ec(h.getMonth() + 1) + Ec(h.getDate()) + " " + Ec(h.getHours()) + ":" + Ec(h.getMinutes()) + ":" + Ec(h.getSeconds()) + "." + Ec(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.Fe && f.push("[", za(Fc(a, d.Ge.get())), "s] ");
  d.Ee && f.push("[", C(a.se), "] ");
  f.push('<span class="', e, '">', ta(za(C(a.qd))));
  d.Jd && a.bc && f.push("<br>", ta(za(a.ac || "")));
  f.push("</span><br>");
  c.innerHTML = f.join("");
  this.i.appendChild(c);
  b && (this.i.scrollTop = this.i.scrollHeight)
};
qd.prototype.clear = function() {
  this.i.innerHTML = ""
};
var rd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function sd(a, b) {
  var c = a.match(rd), d = b.match(rd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function td(a, b) {
  var c;
  a instanceof td ? (this.Pa(b == k ? a.U : b), ud(this, a.X), vd(this, a.Ba), wd(this, a.O), xd(this, a.ja), yd(this, a.K), zd(this, a.L.N()), Ad(this, a.sa)) : a && (c = ("" + a).match(rd)) ? (this.Pa(!!b), ud(this, c[1] || "", j), vd(this, c[2] || "", j), wd(this, c[3] || "", j), xd(this, c[4]), yd(this, c[5] || "", j), zd(this, c[6] || "", j), Ad(this, c[7] || "", j)) : (this.Pa(!!b), this.L = new Bd(k, this, this.U))
}
q = td.prototype;
q.X = "";
q.Ba = "";
q.O = "";
q.ja = k;
q.K = "";
q.sa = "";
q.qe = m;
q.U = m;
q.toString = function() {
  if(this.R) {
    return this.R
  }
  var a = [];
  this.X && a.push(Cd(this.X, Dd), ":");
  this.O && (a.push("//"), this.Ba && a.push(Cd(this.Ba, Dd), "@"), a.push(w(this.O) ? encodeURIComponent(this.O) : k), this.ja != k && a.push(":", "" + this.ja));
  this.K && (this.O && "/" != this.K.charAt(0) && a.push("/"), a.push(Cd(this.K, "/" == this.K.charAt(0) ? Ed : Fd)));
  var b = "" + this.L;
  b && a.push("?", b);
  this.sa && a.push("#", Cd(this.sa, Gd));
  return this.R = a.join("")
};
q.N = function() {
  var a = this.X, b = this.Ba, c = this.O, d = this.ja, e = this.K, f = this.L.N(), h = this.sa, l = new td(k, this.U);
  a && ud(l, a);
  b && vd(l, b);
  c && wd(l, c);
  d && xd(l, d);
  e && yd(l, e);
  f && zd(l, f);
  h && Ad(l, h);
  return l
};
function ud(a, b, c) {
  Hd(a);
  delete a.R;
  a.X = c ? b ? decodeURIComponent(b) : "" : b;
  a.X && (a.X = a.X.replace(/:$/, ""))
}
function vd(a, b, c) {
  Hd(a);
  delete a.R;
  a.Ba = c ? b ? decodeURIComponent(b) : "" : b
}
function wd(a, b, c) {
  Hd(a);
  delete a.R;
  a.O = c ? b ? decodeURIComponent(b) : "" : b
}
function xd(a, b) {
  Hd(a);
  delete a.R;
  b ? (b = Number(b), (isNaN(b) || 0 > b) && g(Error("Bad port number " + b)), a.ja = b) : a.ja = k
}
function yd(a, b, c) {
  Hd(a);
  delete a.R;
  a.K = c ? b ? decodeURIComponent(b) : "" : b
}
function zd(a, b, c) {
  Hd(a);
  delete a.R;
  b instanceof Bd ? (a.L = b, a.L.Gc = a, a.L.Pa(a.U)) : (c || (b = Cd(b, Id)), a.L = new Bd(b, a, a.U))
}
function Ad(a, b, c) {
  Hd(a);
  delete a.R;
  a.sa = c ? b ? decodeURIComponent(b) : "" : b
}
function Hd(a) {
  a.qe && g(Error("Tried to modify a read-only Uri"))
}
q.Pa = function(a) {
  this.U = a;
  this.L && this.L.Pa(a);
  return this
};
function Jd(a) {
  return a instanceof td ? a.N() : new td(a, i)
}
var Kd = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function Cd(a, b) {
  var c = k;
  w(a) && (c = a, Kd.test(c) || (c = encodeURI(a)), 0 <= c.search(b) && (c = c.replace(b, Ld)));
  return c
}
function Ld(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Dd = /[#\/\?@]/g, Fd = /[\#\?:]/g, Ed = /[\#\?]/g, Id = /[\#\?@]/g, Gd = /#/g;
function Bd(a, b, c) {
  this.$ = a || k;
  this.Gc = b || k;
  this.U = !!c
}
function W(a) {
  if(!a.g && (a.g = new P, a.c = 0, a.$)) {
    for(var b = a.$.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), e = k, f = k;
      0 <= d ? (e = b[c].substring(0, d), f = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = Md(a, e);
      a.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
    }
  }
}
q = Bd.prototype;
q.g = k;
q.c = k;
q.C = function() {
  W(this);
  return this.c
};
q.add = function(a, b) {
  W(this);
  Nd(this);
  a = Md(this, a);
  if(this.S(a)) {
    var c = this.g.get(a);
    v(c) ? c.push(b) : this.g.set(a, [c, b])
  }else {
    this.g.set(a, b)
  }
  this.c++;
  return this
};
q.remove = function(a) {
  W(this);
  a = Md(this, a);
  if(this.g.S(a)) {
    Nd(this);
    var b = this.g.get(a);
    v(b) ? this.c -= b.length : this.c--;
    return this.g.remove(a)
  }
  return m
};
q.clear = function() {
  Nd(this);
  this.g && this.g.clear();
  this.c = 0
};
q.Za = function() {
  W(this);
  return 0 == this.c
};
q.S = function(a) {
  W(this);
  a = Md(this, a);
  return this.g.S(a)
};
q.Ub = function(a) {
  var b = this.J();
  return 0 <= eb(b, a)
};
q.ba = function() {
  W(this);
  for(var a = this.g.J(), b = this.g.ba(), c = [], d = 0;d < b.length;d++) {
    var e = a[d];
    if(v(e)) {
      for(var f = 0;f < e.length;f++) {
        c.push(b[d])
      }
    }else {
      c.push(b[d])
    }
  }
  return c
};
q.J = function(a) {
  W(this);
  var b = [];
  if(a) {
    a = Md(this, a), this.S(a) && (b = kb(b, this.g.get(a)))
  }else {
    for(var a = this.g.J(), c = 0;c < a.length;c++) {
      b = kb(b, a[c])
    }
  }
  return b
};
q.set = function(a, b) {
  W(this);
  Nd(this);
  a = Md(this, a);
  if(this.S(a)) {
    var c = this.g.get(a);
    v(c) ? this.c -= c.length : this.c--
  }
  this.g.set(a, b);
  this.c++;
  return this
};
q.get = function(a, b) {
  W(this);
  a = Md(this, a);
  if(this.S(a)) {
    var c = this.g.get(a);
    return v(c) ? c[0] : c
  }
  return b
};
q.toString = function() {
  if(this.$) {
    return this.$
  }
  if(!this.g) {
    return""
  }
  for(var a = [], b = 0, c = this.g.ba(), d = 0;d < c.length;d++) {
    var e = c[d], f = sa(e), e = this.g.get(e);
    if(v(e)) {
      for(var h = 0;h < e.length;h++) {
        0 < b && a.push("&"), a.push(f), "" !== e[h] && a.push("=", sa(e[h])), b++
      }
    }else {
      0 < b && a.push("&"), a.push(f), "" !== e && a.push("=", sa(e)), b++
    }
  }
  return this.$ = a.join("")
};
function Nd(a) {
  delete a.Ea;
  delete a.$;
  a.Gc && delete a.Gc.R
}
q.N = function() {
  var a = new Bd;
  this.Ea && (a.Ea = this.Ea);
  this.$ && (a.$ = this.$);
  this.g && (a.g = this.g.N());
  return a
};
function Md(a, b) {
  var c = "" + b;
  a.U && (c = c.toLowerCase());
  return c
}
q.Pa = function(a) {
  a && !this.U && (W(this), Nd(this), qc(this.g, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.U = a
};
function Od(a) {
  var b = t(a);
  if("string" == b) {
    return 21 + 2 * a.length
  }
  if("number" == b) {
    return 16
  }
  if("boolean" == b) {
    return 12
  }
  if("null" == b || "undefined" == b) {
    return 8
  }
  g(Error("cannot determine size of object type " + b))
}
;function Pd(a, b) {
  this.Ca = a;
  this.ya = b
}
Pd.prototype.I = function(a) {
  return a instanceof Pd && this.Ca == a.Ca && this.ya.join(",") == a.ya
};
Pd.prototype.A = function(a, b) {
  a.push("new SACK(", "" + this.Ca, ", ");
  N(this.ya, a, b);
  a.push(")")
};
function Qd() {
  this.D = new P
}
Qd.prototype.qa = -1;
Qd.prototype.G = 0;
Qd.prototype.append = function(a) {
  var b = Od(a);
  this.D.set(this.qa + 1, [a, b]);
  this.qa += 1;
  this.G += b
};
Qd.prototype.A = function(a) {
  a.push("<Queue with ", "" + this.D.C(), " item(s), counter=#", "" + this.qa, ", size=", "" + this.G, ">")
};
function Rd(a) {
  a = a.D.ba();
  nb(a);
  return a
}
function Sd() {
  this.pa = new P
}
Sd.prototype.wa = -1;
Sd.prototype.G = 0;
function Td(a) {
  var b = a.pa.ba();
  nb(b);
  return new Pd(a.wa, b)
}
var Ud = {};
function Vd(a, b) {
  switch(t(b)) {
    case "string":
      a.push("<string>", C(b), "</string>");
      break;
    case "number":
      a.push("<number>", b, "</number>");
      break;
    case "boolean":
      a.push(b ? "<true/>" : "<false/>");
      break;
    case "undefined":
      a.push("<undefined/>");
      break;
    case "array":
      a.push("<array>");
      for(var c = b.length, d = 0;d < c;d++) {
        a.push('<property id="', d, '">'), Vd(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != t(b[c]) && (a.push('<property id="', C(c), '">'), Vd(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function Wd(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var f = e.length, h = 1;h < f;h++) {
    Vd(d, e[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var Xd = m, Yd = "";
function Zd(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var $d = navigator.plugins["Shockwave Flash"];
  $d && (Xd = j, $d.description && (Yd = Zd($d.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (Xd = j, Yd = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var ae = navigator.mimeTypes["application/x-shockwave-flash"];
    (Xd = ae && ae.enabledPlugin) && (Yd = Zd(ae.enabledPlugin.description))
  }else {
    try {
      var be = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), Xd = j, Yd = Zd(be.GetVariable("$version"))
    }catch(ce) {
      try {
        be = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), Xd = j, Yd = "6.0.21"
      }catch(de) {
        try {
          be = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), Xd = j, Yd = Zd(be.GetVariable("$version"))
        }catch(ee) {
        }
      }
    }
  }
}
var fe = Yd;
function ge(a) {
  this.ne = a;
  this.h = []
}
A(ge, I);
var he = [];
ge.prototype.sc = function() {
  fb(this.h, Bb);
  this.h.length = 0
};
ge.prototype.d = function() {
  ge.n.d.call(this);
  this.sc()
};
ge.prototype.handleEvent = function() {
  g(Error("EventHandler.handleEvent not implemented"))
};
function ie() {
}
ie.Yc = function() {
  return ie.ed ? ie.ed : ie.ed = new ie
};
ie.prototype.ve = 0;
ie.Yc();
function je(a) {
  this.ob = a || Kc()
}
A(je, Hb);
q = je.prototype;
q.pe = ie.Yc();
q.T = k;
q.va = m;
q.i = k;
q.t = k;
q.fa = k;
q.nb = k;
q.Ne = m;
function ke(a) {
  return a.T || (a.T = ":" + (a.pe.ve++).toString(36))
}
q.ta = o("i");
q.getParent = o("t");
q.vc = function(a) {
  this.t && this.t != a && g(Error("Method not supported"));
  je.n.vc.call(this, a)
};
q.Xc = o("ob");
q.Ua = function() {
  this.i = this.ob.createElement("div")
};
function le(a, b) {
  a.va && g(Error("Component already rendered"));
  a.i || a.Ua();
  b ? b.insertBefore(a.i, k) : a.ob.ra.body.appendChild(a.i);
  (!a.t || a.t.va) && a.pb()
}
q.pb = function() {
  this.va = j;
  me(this, function(a) {
    !a.va && a.ta() && a.pb()
  })
};
function ne(a) {
  me(a, function(a) {
    a.va && ne(a)
  });
  a.vb && a.vb.sc();
  a.va = m
}
q.d = function() {
  je.n.d.call(this);
  this.va && ne(this);
  this.vb && (this.vb.b(), delete this.vb);
  me(this, function(a) {
    a.b()
  });
  !this.Ne && this.i && Sc(this.i);
  this.t = this.i = this.nb = this.fa = k
};
function me(a, b) {
  a.fa && fb(a.fa, b, i)
}
q.removeChild = function(a, b) {
  if(a) {
    var c = w(a) ? a : ke(a), d;
    this.nb && c ? (d = this.nb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.nb, c in d && delete d[c], jb(this.fa, a), b && (ne(a), a.i && Sc(a.i)), c = a, c == k && g(Error("Unable to set parent component")), c.t = k, je.n.vc.call(c, k))
  }
  a || g(Error("Child is not in parent component"));
  return a
};
function oe(a, b) {
  this.ob = b || Kc();
  this.je = a;
  this.$b = new ge(this);
  this.sb = new P
}
A(oe, je);
q = oe.prototype;
q.a = U("goog.ui.media.FlashObject");
q.Pe = "window";
q.Jc = "#000000";
q.Sd = "sameDomain";
function pe(a, b, c) {
  a.Hc = w(b) ? b : Math.round(b) + "px";
  a.fc = w(c) ? c : Math.round(c) + "px";
  a.ta() && (b = a.ta() ? a.ta().firstChild : k, c = a.Hc, a = a.fc, a == i && g(Error("missing height argument")), b.style.width = Uc(c), b.style.height = Uc(a))
}
q.pb = function() {
  oe.n.pb.call(this);
  var a = this.ta(), b;
  b = E ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = E ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = qa(c, this.Pe), d = this.sb.ba(), e = this.sb.J(), f = [], h = 0;h < d.length;h++) {
    var l = sa(d[h]), n = sa(e[h]);
    f.push(l + "=" + n)
  }
  b = qa(b, ke(this), ke(this), "goog-ui-media-flash-object", C(this.je), C(f.join("&")), this.Jc, this.Sd, c);
  a.innerHTML = b;
  this.Hc && this.fc && pe(this, this.Hc, this.fc);
  a = this.$b;
  b = this.ta();
  c = $a(pb);
  v(c) || (he[0] = c, c = he);
  for(d = 0;d < c.length;d++) {
    a.h.push(wb(b, c[d], rb || a, m, a.ne || a))
  }
};
q.Ua = function() {
  this.Dd != k && !(0 <= Aa(fe, this.Dd)) && (this.a.z("Required flash version not found:" + this.Dd), g(Error("Method not supported")));
  var a = this.Xc().createElement("div");
  a.className = "goog-ui-media-flash";
  this.i = a
};
q.d = function() {
  oe.n.d.call(this);
  this.sb = k;
  this.$b.b();
  this.$b = k
};
function qe(a) {
  B.call(this, a)
}
A(qe, B);
qe.prototype.name = "cw.loadflash.FlashLoadFailed";
s.__loadFlashObject_callbacks = {};
function re(a, b, c) {
  function d() {
    e && delete s.__loadFlashObject_callbacks[e]
  }
  var e;
  if(Ma && !G("1.8.1.20")) {
    return Vb(new qe("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(0 <= Aa(fe, "9"))) {
    return Vb(new qe("Need Flash Player 9+; had " + (fe ? fe : "none")))
  }
  var f;
  e = "_" + hc();
  var h = new M(d);
  s.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      Ob(h, R(f))
    }, 0)
  };
  b.sb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  f = ke(b);
  le(b, c);
  return h
}
function se(a, b, c) {
  var d = re(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  Sb(d, function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function te(a, b) {
  this.T = "_" + hc();
  this.Lb = a;
  this.ka = b;
  this.oa = a.oa
}
A(te, I);
q = te.prototype;
q.Ka = j;
q.Wb = m;
q.a = U("cw.net.FlashSocket");
q.A = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.T);
  a.push("'>")
};
function ue(a, b, c) {
  "frames" == b ? (a = a.ka, ve(a.u), we(a.u, c)) : "stillreceiving" == b ? (c = a.ka, c.a.q("onstillreceiving"), ve(c.u)) : "connect" == b ? (c = a.ka, c.a.info("onconnect"), ve(c.u), a = c.Sa, c.Sa = k, a.length && (c.a.q("onconnect: Writing " + a.length + " buffered frame(s)."), c.Ib.kb(a))) : "close" == b ? (a.Ka = m, a.b()) : "ioerror" == b ? (a.Ka = m, b = a.ka, b.a.z("onioerror: " + O(c)), xe(b.u, m), a.b()) : "securityerror" == b ? (a.Ka = m, b = a.ka, b.a.z("onsecurityerror: " + O(c)), xe(b.u, 
  m), a.b()) : g(Error("bad event: " + b))
}
function ye(a) {
  a.Wb = j;
  a.Ka = m;
  a.b()
}
q.Tb = function(a, b) {
  try {
    var c = this.oa.CallFunction(Wd("__FC_connect", this.T, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.F("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), ye(this)
  }
  '"OK"' != c && g(Error("__FC_connect failed? ret: " + c))
};
q.kb = function(a) {
  try {
    var b = this.oa.CallFunction(Wd("__FC_writeFrames", this.T, a))
  }catch(c) {
    return this.a.F("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), ye(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.z("Flash no longer knows of " + this.T + "; disposing."), this.b()) : g(Error("__FC_writeFrames failed? ret: " + b)))
};
q.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Ka);
  te.n.d.call(this);
  var a = this.oa;
  delete this.oa;
  if(this.Ka) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(Wd("__FC_close", this.T)))
    }catch(b) {
      this.a.F("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.Wb = j
    }
  }
  if(this.Wb) {
    a = this.ka, a.a.z("oncrash"), xe(a.u, j)
  }else {
    this.ka.onclose()
  }
  delete this.ka;
  delete this.Lb.Ga[this.T]
};
function ze(a, b) {
  this.o = a;
  this.oa = b;
  this.Ga = {};
  this.Sb = "__FST_" + hc();
  s[this.Sb] = x(this.ee, this);
  var c = b.CallFunction(Wd("__FC_setCallbackFunc", this.Sb));
  '"OK"' != c && g(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(ze, I);
q = ze.prototype;
q.a = U("cw.net.FlashSocketTracker");
q.A = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Ga, a, b);
  a.push(">")
};
q.Xb = function(a) {
  a = new te(this, a);
  return this.Ga[a.T] = a
};
q.ce = function(a, b, c, d) {
  var e = this.Ga[a];
  e ? "frames" == b && d ? (ue(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : ue(e, b, c) : this.a.z("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
q.ee = function(a, b, c, d) {
  try {
    Xb(this.o, this.ce, this, [a, b, c, d])
  }catch(e) {
    s.window.setTimeout(function() {
      g(e)
    }, 0)
  }
};
q.d = function() {
  ze.n.d.call(this);
  for(var a = $a(this.Ga);a.length;) {
    a.pop().b()
  }
  delete this.Ga;
  delete this.oa;
  s[this.Sb] = i
};
function Ae(a) {
  this.u = a;
  this.Sa = []
}
A(Ae, I);
q = Ae.prototype;
q.a = U("cw.net.FlashSocketConduit");
q.kb = function(a) {
  this.Sa ? (this.a.q("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.Sa.push.apply(this.Sa, a)) : (this.a.q("writeFrames: Writing " + a.length + " frame(s)."), this.Ib.kb(a))
};
q.Tb = function(a, b) {
  this.Ib.Tb(a, b)
};
q.onclose = function() {
  this.a.info("onclose");
  xe(this.u, m)
};
q.d = function() {
  this.a.info("in disposeInternal.");
  Ae.n.d.call(this);
  this.Ib.b();
  delete this.u
};
var Ce = [];
function De() {
  var a = new M;
  Ce.push(a);
  return a
}
function Ee(a) {
  var b = Ce;
  Ce = [];
  fb(b, function(b) {
    Ob(b, a)
  })
}
function Fe(a, b) {
  if(Ce.length) {
    return De()
  }
  var c = new oe(b + "FlashConnector.swf?cb=" + Ge);
  c.Jc = "#777777";
  pe(c, 300, 30);
  var d = R("minerva-elements");
  d || g(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = R("minerva-elements-FlashConnectorSwf");
  e || (e = Oc("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  zc = se(a.w, c, e);
  Pb(zc, Ee);
  return De()
}
;function He() {
  var a = Math.pow(10, 9);
  return a + Math.random() * (Math.pow(10, 10) - a)
}
;function X(a) {
  B.call(this, a)
}
A(X, B);
X.prototype.name = "cw.net.InvalidFrame";
function Y() {
  var a = [];
  this.P(a);
  return a.join("")
}
function Ie() {
}
Ie.prototype.I = function(a, b) {
  return!(a instanceof Ie) ? m : yc(Je(this), Je(a), b)
};
Ie.prototype.A = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Je(this), a, b);
  a.push(">")
};
function Je(a) {
  return[a.Qa, a.xd, a.cd, a.Cd, a.hb, a.zc, a.rd, a.pd, a.nc, a.nd, a.Nd, a.Kd, a.ma, a.yb]
}
Ie.prototype.H = Y;
Ie.prototype.P = function(a) {
  var b = {};
  b.tnum = this.Qa;
  b.ver = this.xd;
  b.format = this.cd;
  b["new"] = this.Cd;
  b.id = this.hb;
  b.ming = this.zc;
  b.pad = this.rd;
  b.maxb = this.pd;
  fa(this.nc) && (b.maxt = this.nc);
  b.maxia = this.nd;
  b.tcpack = this.Nd;
  b.eeds = this.Kd;
  b.sack = this.ma instanceof Pd ? ic((new Ke(this.ma)).H()) : this.ma;
  b.seenack = this.yb instanceof Pd ? ic((new Ke(this.yb)).H()) : this.yb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push($b(b), "H")
};
function Le(a) {
  Q.call(this, "StringFrame", [a]);
  this.Bc = a
}
A(Le, Q);
Le.prototype.H = Y;
Le.prototype.P = function(a) {
  a.push(this.Bc, " ")
};
function Me(a) {
  Q.call(this, "CommentFrame", [a]);
  this.Yd = a
}
A(Me, Q);
Me.prototype.H = Y;
Me.prototype.P = function(a) {
  a.push(this.Yd, "^")
};
function Ne(a) {
  Q.call(this, "SeqNumFrame", [a]);
  this.Hd = a
}
A(Ne, Q);
Ne.prototype.H = Y;
Ne.prototype.P = function(a) {
  a.push("" + this.Hd, "N")
};
function Oe(a) {
  var b = a.split("|");
  if(2 != b.length) {
    return k
  }
  a: {
    var c = b[1], a = mc;
    if(kc.test(c) && (c = parseInt(c, 10), -1 <= c && c <= a)) {
      a = c;
      break a
    }
    a = k
  }
  if(a == k) {
    return k
  }
  c = [];
  if(b[0]) {
    for(var b = b[0].split(","), d = 0, e = b.length;d < e;d++) {
      var f = lc(b[d]);
      if(f == k) {
        return k
      }
      c.push(f)
    }
  }
  return new Pd(a, c)
}
function Ke(a) {
  Q.call(this, "SackFrame", [a]);
  this.ma = a
}
A(Ke, Q);
Ke.prototype.H = Y;
Ke.prototype.P = function(a) {
  var b = this.ma;
  a.push(b.ya.join(","), "|", "" + b.Ca);
  a.push("A")
};
function Pe(a) {
  Q.call(this, "StreamStatusFrame", [a]);
  this.jd = a
}
A(Pe, Q);
Pe.prototype.H = Y;
Pe.prototype.P = function(a) {
  var b = this.jd;
  a.push(b.ya.join(","), "|", "" + b.Ca);
  a.push("T")
};
function Qe() {
  Q.call(this, "StreamCreatedFrame", [])
}
A(Qe, Q);
Qe.prototype.H = Y;
Qe.prototype.P = function(a) {
  a.push("C")
};
function Re() {
  Q.call(this, "YouCloseItFrame", [])
}
A(Re, Q);
Re.prototype.H = Y;
Re.prototype.P = function(a) {
  a.push("Y")
};
function Se(a, b) {
  Q.call(this, "ResetFrame", [a, b]);
  this.Ad = a;
  this.Ic = b
}
A(Se, Q);
Se.prototype.H = Y;
Se.prototype.P = function(a) {
  a.push(this.Ad, "|", "" + Number(this.Ic), "!")
};
var Te = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Ue(a) {
  Q.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(Ue, Q);
Ue.prototype.H = Y;
Ue.prototype.P = function(a) {
  a.push(this.reason, "K")
};
function Ve(a) {
  a || g(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new Le(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = Oe(ic(a)), a == k && g(new X("bad sack")), new Ke(a)
  }
  if("N" == b) {
    return a = lc(ic(a)), a == k && g(new X("bad seqNum")), new Ne(a)
  }
  if("T" == b) {
    return a = Oe(ic(a)), a == k && g(new X("bad lastSackSeen")), new Pe(a)
  }
  if("Y" == b) {
    return 1 != a.length && g(new X("leading garbage")), new Re
  }
  if("^" == b) {
    return new Me(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && g(new X("leading garbage")), new Qe
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && g(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && g(new X("bad applicationLevel")), new Se(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = Te[a], a == k && g(new X("unknown kill reason: " + a)), new Ue(a)
  }
  g(new X("Invalid frame type " + b))
}
;function We(a, b, c, d) {
  this.contentWindow = a;
  this.rb = b;
  this.Ac = c;
  this.ke = d
}
We.prototype.A = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.ke, a, b);
  a.push(", expandedUrl=");
  N(this.rb, a, b);
  a.push(", streams=");
  N(this.Ac, a, b);
  a.push(">")
};
function Xe() {
  this.frames = [];
  this.lc = new P
}
Xe.prototype.a = U("cw.net.XDRTracker");
function Ye(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + Math.floor(He()) + ("" + Math.floor(He()))
  })
}
function Ze(a, b) {
  for(var c = $e, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], f;
    if(f = 0 == e.Ac.length) {
      f = e.rb;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      f = RegExp("^" + h + "$").test(f)
    }
    if(f) {
      return c.a.info("Giving " + O(b) + " existing frame " + O(e)), Ub(e)
    }
  }
  d = hc() + hc();
  e = Ye(a);
  f = s.location;
  f instanceof td || (f = Jd(f));
  e instanceof td || (e = Jd(e));
  var l = f;
  f = l.N();
  (h = !!e.X) ? ud(f, e.X) : h = !!e.Ba;
  h ? vd(f, e.Ba) : h = !!e.O;
  h ? wd(f, e.O) : h = e.ja != k;
  var n = e.K;
  if(h) {
    xd(f, e.ja)
  }else {
    if(h = !!e.K) {
      if("/" != n.charAt(0) && (l.O && !l.K ? n = "/" + n : (l = f.K.lastIndexOf("/"), -1 != l && (n = f.K.substr(0, l + 1) + n))), ".." == n || "." == n) {
        n = ""
      }else {
        if(!(-1 == n.indexOf("./") && -1 == n.indexOf("/."))) {
          for(var l = 0 == n.lastIndexOf("/", 0), n = n.split("/"), r = [], D = 0;D < n.length;) {
            var p = n[D++];
            "." == p ? l && D == n.length && r.push("") : ".." == p ? ((1 < r.length || 1 == r.length && "" != r[0]) && r.pop(), l && D == n.length && r.push("")) : (r.push(p), l = j)
          }
          n = r.join("/")
        }
      }
    }
  }
  h ? yd(f, n) : h = "" !== e.L.toString();
  h ? (l = e.L, l.Ea || (l.Ea = l.toString() ? decodeURIComponent(l.toString()) : ""), zd(f, l.Ea, i)) : h = !!e.sa;
  h && Ad(f, e.sa);
  e = f.toString();
  f = ("" + s.location).match(rd)[3] || k;
  h = e.match(rd)[3] || k;
  f == h ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = Ub(new We(s, e, [b], k))) : ((f = R("minerva-elements")) || g(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new M, c.lc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = Oc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), f.appendChild(c), c = h);
  return c
}
Xe.prototype.Re = function(a) {
  var b = this.lc.get(a);
  b || g(Error("Unknown frameId " + O(a)));
  this.lc.remove(b);
  var c = b[0], a = new We(R("minerva-xdrframe-" + a).contentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  Ob(c, a)
};
var $e = new Xe;
s.__XHRTracker_xdrFrameLoaded = x($e.Re, $e);
var af;
af = m;
var bf = Ia();
bf && (-1 != bf.indexOf("Firefox") || -1 != bf.indexOf("Camino") || -1 != bf.indexOf("iPhone") || -1 != bf.indexOf("iPod") || -1 != bf.indexOf("iPad") || -1 != bf.indexOf("Android") || -1 != bf.indexOf("Chrome") && (af = j));
var cf = af;
var Ge = "4bdfc178fc0e508c0cd5efc3fdb09920";
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function df(a, b, c, d, e, f) {
  M.call(this, e, f);
  this.md = a;
  this.Yb = [];
  this.Vc = !!b;
  this.ie = !!c;
  this.$d = !!d;
  for(b = 0;b < a.length;b++) {
    Qb(a[b], x(this.ad, this, b, j), x(this.ad, this, b, m))
  }
  0 == a.length && !this.Vc && Ob(this, this.Yb)
}
A(df, M);
df.prototype.td = 0;
df.prototype.ad = function(a, b, c) {
  this.td++;
  this.Yb[a] = [b, c];
  this.ga || (this.Vc && b ? Ob(this, [a, c]) : this.ie && !b ? this.Va(c) : this.td == this.md.length && Ob(this, this.Yb));
  this.$d && !b && (c = k);
  return c
};
df.prototype.Va = function(a) {
  df.n.Va.call(this, a);
  fb(this.md, function(a) {
    a.cancel()
  })
};
function ef(a) {
  a = new df(a, m, j);
  Pb(a, function(a) {
    return gb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function ff(a, b) {
  this.Qe = a;
  this.od = b
}
ff.prototype.jc = 0;
ff.prototype.Bb = 0;
ff.prototype.cc = m;
function gf(a) {
  var b = [];
  if(a.cc) {
    return[b, 2]
  }
  var c = a.jc, d = a.Qe.responseText;
  for(a.jc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var e = d.substr(a.Bb, c - a.Bb), e = e.replace(/\r$/, "");
    if(e.length > a.od) {
      return a.cc = j, [b, 2]
    }
    b.push(e);
    a.Bb = c += 1
  }
  return a.jc - a.Bb - 1 > a.od ? (a.cc = j, [b, 2]) : [b, 1]
}
;function hf(a, b, c) {
  this.u = b;
  this.Q = a;
  this.Vb = c
}
A(hf, I);
q = hf.prototype;
q.a = U("cw.net.XHRMaster");
q.la = -1;
q.mc = function(a, b, c) {
  this.Vb.__XHRSlave_makeRequest(this.Q, a, b, c)
};
q.ha = o("la");
q.pc = function(a, b) {
  1 != b && this.a.F(O(this.Q) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  ve(this.u);
  we(this.u, a)
};
q.qc = function(a) {
  this.a.k("ongotheaders_: " + O(a));
  var b = k;
  "Content-Length" in a && (b = lc(a["Content-Length"]));
  a = this.u;
  a.a.k(a.l() + " got Content-Length: " + b);
  a.Y == jf && (b == k && (a.a.z("Expected to receive a valid Content-Length, but did not."), b = 5E5), kf(a, 2E3 + 1E3 * (b / 3072)))
};
q.rc = function(a) {
  1 != a && this.a.k(this.u.l() + "'s XHR's readyState is " + a);
  this.la = a;
  2 <= this.la && ve(this.u)
};
q.oc = function() {
  this.u.b()
};
q.d = function() {
  hf.n.d.call(this);
  delete Z.ca[this.Q];
  this.Vb.__XHRSlave_dispose(this.Q);
  delete this.Vb
};
function lf() {
  this.ca = {}
}
A(lf, I);
q = lf.prototype;
q.a = U("cw.net.XHRMasterTracker");
q.Xb = function(a, b) {
  var c = "_" + hc(), d = new hf(c, a, b);
  return this.ca[c] = d
};
q.pc = function(a, b, c) {
  if(Ma) {
    for(var d = [], e = 0, f = b.length;e < f;e++) {
      d[e] = b[e]
    }
    b = d
  }else {
    b = kb(b)
  }
  (d = this.ca[a]) ? d.pc(b, c) : this.a.F("onframes_: no master for " + O(a))
};
q.qc = function(a, b) {
  var c = this.ca[a];
  c ? c.qc(b) : this.a.F("ongotheaders_: no master for " + O(a))
};
q.rc = function(a, b) {
  var c = this.ca[a];
  c ? c.rc(b) : this.a.F("onreadystatechange_: no master for " + O(a))
};
q.oc = function(a) {
  var b = this.ca[a];
  b ? (delete this.ca[b.Q], b.oc()) : this.a.F("oncomplete_: no master for " + O(a))
};
q.d = function() {
  lf.n.d.call(this);
  for(var a = $a(this.ca);a.length;) {
    a.pop().b()
  }
  delete this.ca
};
var Z = new lf;
s.__XHRMaster_onframes = x(Z.pc, Z);
s.__XHRMaster_oncomplete = x(Z.oc, Z);
s.__XHRMaster_ongotheaders = x(Z.qc, Z);
s.__XHRMaster_onreadystatechange = x(Z.rc, Z);
function mf(a, b, c) {
  this.V = a;
  this.host = b;
  this.port = c
}
function nf(a, b, c) {
  this.host = a;
  this.port = b;
  this.Ke = c
}
function of(a, b) {
  b || (b = a);
  this.V = a;
  this.na = b
}
of.prototype.A = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.V, a, b);
  a.push(", secondaryUrl=");
  N(this.na, a, b);
  a.push(">")
};
function pf(a, b, c, d) {
  this.V = a;
  this.wd = b;
  this.na = c;
  this.Gd = d;
  (!(0 == this.V.indexOf("http://") || 0 == this.V.indexOf("https://")) || !(0 == this.na.indexOf("http://") || 0 == this.na.indexOf("https://"))) && g(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.wd.location.href;
  sd(this.V, a) || g(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.Gd.location.href;
  sd(this.na, a) || g(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
pf.prototype.A = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.V, a, b);
  a.push(", secondaryUrl=");
  N(this.na, a, b);
  a.push(">")
};
var qf = new Me(";)]}");
(function() {
}).prototype.a = U("cw.net.QANProtocolWrapper");
function rf(a) {
  this.He = a
}
rf.prototype.A = function(a, b) {
  a.push("<UserContext for ");
  N(this.He, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.p = a;
  this.o = c ? c : Yb;
  this.ib = new Wc;
  this.hb = hc() + hc();
  this.W = new Qd;
  this.ic = new Sd;
  this.jb = k;
  this.Mb = [];
  this.Aa = new rf(this);
  this.Vd = x(this.Le, this);
  F && (this.jb = zb(s, "load", this.Ae, m, this))
}
A($, I);
q = $.prototype;
q.a = U("cw.net.ClientStream");
q.kd = new Pd(-1, []);
q.ld = new Pd(-1, []);
q.maxUndeliveredStrings = 50;
q.maxUndeliveredBytes = 1048576;
q.onstring = k;
q.onstarted = k;
q.onreset = k;
q.ondisconnect = k;
q.Oa = k;
q.xc = m;
q.tc = m;
q.v = 1;
q.Dc = -1;
q.e = k;
q.r = k;
q.cb = k;
q.yc = 0;
q.vd = 0;
q.Fd = 0;
q.A = function(a, b) {
  a.push("<ClientStream id=");
  N(this.hb, a, b);
  a.push(", state=", "" + this.v);
  a.push(", primary=");
  N(this.e, a, b);
  a.push(", secondary=");
  N(this.r, a, b);
  a.push(", resetting=");
  N(this.cb, a, b);
  a.push(">")
};
q.me = o("Aa");
q.Td = function(a) {
  fa(a.streamStarted) || g(Error("Protocol is missing required method streamStarted"));
  fa(a.streamReset) || g(Error("Protocol is missing required method streamReset"));
  fa(a.stringReceived) || g(Error("Protocol is missing required method stringReceived"));
  this.onstarted = x(a.streamStarted, a);
  this.onreset = x(a.streamReset, a);
  this.onstring = x(a.stringReceived, a)
};
function sf(a) {
  var b = [-1];
  a.e && b.push(a.e.La);
  a.r && b.push(a.r.La);
  return Math.max.apply(Math.max, b)
}
function tf(a) {
  if(!(3 > a.v)) {
    uf(a);
    var b = 0 != a.W.D.C(), c = Td(a.ic), d = !c.I(a.ld) && !(a.e && c.I(a.e.Ia) || a.r && c.I(a.r.Ia)), e = sf(a);
    if((b = b && e < a.W.qa) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.Ta ? (a.a.q("tryToSend_: writing " + f + " to primary"), d && (d = a.e, c != d.Ia && (!d.da && !d.s.length && vf(d), d.s.push(new Ke(c)), d.Ia = c)), b && wf(a.e, a.W, e + 1), a.e.aa()) : a.r == k ? a.xc ? (a.a.q("tryToSend_: creating secondary to send " + f), a.r = xf(a, m), b && wf(a.r, a.W, e + 1), a.r.aa()) : (a.a.q("tryToSend_: not creating a secondary because stream might not exist on server"), a.tc = j) : a.a.q("tryToSend_: need to send " + f + ", but can't right now")
    }
  }
}
function uf(a) {
  a.Oa != k && (a.o.w.clearTimeout(a.Oa), a.Oa = k)
}
q.Le = function() {
  this.Oa = k;
  tf(this)
};
function yf(a) {
  a.Oa == k && (a.Oa = a.o.w.setTimeout(a.Vd, 6))
}
q.Ae = function() {
  this.jb = k;
  if(this.e && this.e.Ha()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.Ob = j;
    a.b()
  }
  this.r && this.r.Ha() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.r, a.Ob = j, a.b())
};
q.Be = function(a, b) {
  fa(b) || (b = j);
  3 < this.v && g(Error("sendString: Can't send in state " + this.v));
  b && !/^([ -~]*)$/.test(a) && g(Error("sendString: string has illegal chars: " + O(a)));
  this.W.append(a);
  yf(this)
};
function xf(a, b) {
  var c;
  a.p instanceof pf ? c = jf : a.p instanceof nf ? c = zf : g(Error("Don't support endpoint " + O(a.p)));
  a.Dc += 1;
  c = new Af(a.o, a, a.Dc, c, a.p, b);
  a.a.q("Created: " + c.l());
  a.ib.add(c);
  return c
}
function Bf(a, b, c) {
  var d = new Cf(a.o, a, b, c);
  a.a.q("Created: " + d.l() + ", delay=" + b + ", times=" + c);
  a.ib.add(d);
  return d
}
function Df(a, b) {
  a.ib.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  a.a.k("Offline: " + b.l());
  a.yc = b.ia ? a.yc + b.ia : 0;
  1 <= a.yc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.Aa, "stream penalty reached limit", m), a.b());
  if(3 < a.v) {
    4 == a.v && b.Od ? (a.a.k("Disposing because resettingTransport_ is done."), a.b()) : a.a.k("Not creating a transport because ClientStream is in state " + a.v)
  }else {
    var c;
    var d;
    c = b instanceof Cf;
    if(!c && b.Ob) {
      var e = F ? cf ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      a.a.q("getDelayForNextTransport_: " + O({delay:c, times:d}))
    }else {
      if(d = b.Lc(), b == a.e ? d ? e = ++a.vd : c || (e = a.vd = 0) : d ? e = ++a.Fd : c || (e = a.Fd = 0), c || !e) {
        d = c = 0, a.a.q("getDelayForNextTransport_: " + O({count:e, delay:c, times:d}))
      }else {
        var f = 2E3 * Math.min(e, 3), h = Math.floor(4E3 * Math.random()) - 2E3, l = Math.max(0, b.Md - b.Ec);
        d = (c = Math.max(0, f + h - l)) ? 1 : 0;
        a.a.q("getDelayForNextTransport_: " + O({count:e, base:f, variance:h, oldDuration:l, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    b == a.e ? (a.e = k, c ? a.e = Bf(a, e, c) : (e = sf(a), a.e = xf(a, j), wf(a.e, a.W, e + 1)), a.e.aa()) : b == a.r && (a.r = k, c ? (a.r = Bf(a, e, c), a.r.aa()) : tf(a))
  }
}
q.reset = function(a) {
  3 < this.v && g(Error("reset: Can't send reset in state " + this.v));
  uf(this);
  0 != this.W.D.C() && this.a.z("reset: strings in send queue will never be sent: " + O(this.W));
  this.v = 4;
  this.e && this.e.Ta ? (this.a.info("reset: Sending ResetFrame over existing primary."), Ef(this.e, a), this.e.aa()) : (this.e && (this.a.k("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.r && (this.a.k("reset: Disposing secondary before sending ResetFrame."), this.r.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.cb = xf(this, m), Ef(this.cb, a), this.cb.aa());
  this.onreset && this.onreset.call(this.Aa, a, j)
};
function Ff(a, b, c, d) {
  var e;
  e = a.ic;
  for(var f = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], n = m, r = 0, D = c.length;r < D;r++) {
    var p = c[r], u = p[0], p = p[1];
    if(u == e.wa + 1) {
      e.wa += 1;
      for(l.push(p);;) {
        u = e.wa + 1;
        p = e.pa.get(u, Ud);
        if(p === Ud) {
          break
        }
        l.push(p[0]);
        e.pa.remove(u);
        e.G -= p[1];
        e.wa = u
      }
    }else {
      if(!(u <= e.wa)) {
        if(f != k && e.pa.C() >= f) {
          n = j;
          break
        }
        var z = Od(p);
        if(h != k && e.G + z > h) {
          n = j;
          break
        }
        e.pa.set(u, [p, z]);
        e.G += z
      }
    }
  }
  e.pa.Za() && e.pa.clear();
  e = [l, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(f = 0;f < c.length;f++) {
      if(h = c[f], a.onstring && a.onstring.call(a.Aa, h), 4 == a.v || a.Z) {
        return
      }
    }
  }
  d || yf(a);
  if(!(4 == a.v || a.Z) && e) {
    b.a.F(b.l() + "'s peer caused rwin overflow."), b.b()
  }
}
q.Sc = function(a) {
  this.a.F("Failed to start " + O(this) + "; error was " + O(a.message));
  this.b()
};
q.start = function() {
  this.onmessage && g(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  1 != this.v && g(Error("ClientStream.start: " + O(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.v = 2;
  if(this.p instanceof of) {
    var a = Ze(this.p.V, this), b = Ze(this.p.na, this), a = ef([a, b]);
    Pb(a, x(this.ge, this));
    Rb(a, x(this.Sc, this))
  }else {
    if(this.p instanceof mf) {
      if(Ac) {
        this.Uc()
      }else {
        var a = Fe(this.o, this.p.V), c = this;
        Pb(a, function(a) {
          Ac || (Ac = new ze(c.o, a));
          return k
        });
        Pb(a, x(this.Uc, this));
        Rb(a, x(this.Sc, this))
      }
    }else {
      Gf(this)
    }
  }
};
q.ge = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].rb, e = a[1].rb;
  this.Mb.push(a[0]);
  this.Mb.push(a[1]);
  this.p = new pf(d, b, e, c);
  Gf(this)
};
q.Uc = function() {
  this.p = new nf(this.p.host, this.p.port, Ac);
  Gf(this)
};
function Gf(a) {
  a.v = 3;
  a.e = xf(a, j);
  wf(a.e, a.W, k);
  a.e.aa()
}
q.d = function() {
  this.a.info(O(this) + " in disposeInternal.");
  uf(this);
  this.v = 5;
  for(var a = this.ib.J(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Mb.length;a++) {
    jb(this.Mb[a].Ac, this)
  }
  F && this.jb && (Bb(this.jb), this.jb = k);
  this.ondisconnect && this.ondisconnect.call(this.Aa);
  delete this.ib;
  delete this.e;
  delete this.r;
  delete this.cb;
  delete this.Aa;
  $.n.d.call(this)
};
var jf = 1, zf = 3;
function Af(a, b, c, d, e, f) {
  this.o = a;
  this.B = b;
  this.Qa = c;
  this.Y = d;
  this.p = e;
  this.s = [];
  this.Da = f;
  this.Ta = !this.Ha();
  this.Na = this.Y != jf;
  this.Ud = x(this.Ie, this)
}
A(Af, I);
q = Af.prototype;
q.a = U("cw.net.ClientTransport");
q.j = k;
q.Ec = k;
q.Md = k;
q.Fb = k;
q.da = m;
q.Jb = m;
q.Ia = k;
q.tb = 0;
q.La = -1;
q.Db = -1;
q.Od = m;
q.Ob = m;
q.ia = 0;
q.Ya = m;
q.A = function(a) {
  a.push("<ClientTransport #", "" + this.Qa, ", becomePrimary=", "" + this.Da, ">")
};
q.l = function() {
  return(this.Da ? "Prim. T#" : "Sec. T#") + this.Qa
};
q.Lc = function() {
  return!(!this.Ya && this.tb)
};
q.Ha = function() {
  return this.Y == jf || 2 == this.Y
};
function Hf(a, b) {
  nb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Ff(a.B, a, b, !a.Na)
}
function If(a, b, c) {
  try {
    var d = Ve(b);
    a.tb += 1;
    a.a.k(a.l() + " RECV " + O(d));
    var e;
    1 == a.tb && !d.I(qf) && a.Ha() ? (a.a.z(a.l() + " is closing soon because got bad preamble: " + O(d)), e = j) : e = m;
    if(e) {
      return j
    }
    if(d instanceof Le) {
      if(!/^([ -~]*)$/.test(d.Bc)) {
        return a.Ya = j
      }
      a.Db += 1;
      c.push([a.Db, d.Bc])
    }else {
      if(d instanceof Ke) {
        var f = a.B, h = d.ma;
        f.kd = h;
        var l = f.W, n = h.Ca, c = m;
        n > l.qa && (c = j);
        for(var r = Rd(l).concat(), d = 0;d < r.length;d++) {
          var D = r[d];
          if(D > n) {
            break
          }
          var p = l.D.get(D)[1];
          l.D.remove(D);
          l.G -= p
        }
        for(d = 0;d < h.ya.length;d++) {
          var u = h.ya[d];
          u > l.qa && (c = j);
          l.D.S(u) && (p = l.D.get(u)[1], l.D.remove(u), l.G -= p)
        }
        l.D.Za() && l.D.clear();
        if(c) {
          return a.a.z(a.l() + " is closing soon because got bad SackFrame"), a.Ya = j
        }
      }else {
        if(d instanceof Ne) {
          a.Db = d.Hd - 1
        }else {
          if(d instanceof Pe) {
            a.B.ld = d.jd
          }else {
            if(d instanceof Re) {
              return a.a.q(a.l() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof Ue) {
              return a.Ya = j, "stream_attach_failure" == d.reason ? a.ia += 1 : "acked_unsent_strings" == d.reason && (a.ia += 0.5), a.a.q(a.l() + " is closing soon because got " + O(d)), j
            }
            if(!(d instanceof Me)) {
              if(d instanceof Qe) {
                var z = a.B, $f = !a.Na;
                z.a.q("Stream is now confirmed to exist at server.");
                z.xc = j;
                z.tc && !$f && (z.tc = m, tf(z))
              }else {
                if(c.length) {
                  Hf(a, c);
                  if(!v(c)) {
                    for(var jd = c.length - 1;0 <= jd;jd--) {
                      delete c[jd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof Se) {
                  var dc = a.B;
                  dc.onreset && dc.onreset.call(dc.Aa, d.Ad, d.Ic);
                  dc.b();
                  return j
                }
                g(Error(a.l() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Be) {
    return Be instanceof X || g(Be), a.a.z(a.l() + " is closing soon because got InvalidFrame: " + O(b)), a.Ya = j
  }
  return m
}
function we(a, b) {
  a.Jb = j;
  try {
    for(var c = m, d = [], e = 0, f = b.length;e < f;e++) {
      if(a.Z) {
        a.a.info(a.l() + " returning from loop because we're disposed.");
        return
      }
      if(c = If(a, b[e], d)) {
        break
      }
    }
    d.length && Hf(a, d);
    a.Jb = m;
    a.s.length && a.aa();
    c && (a.a.q(a.l() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Jb = m
  }
}
q.Ie = function() {
  this.a.z(this.l() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Jf(a) {
  a.Fb != k && (a.o.w.clearTimeout(a.Fb), a.Fb = k)
}
function kf(a, b) {
  Jf(a);
  b = Math.round(b);
  a.Fb = a.o.w.setTimeout(a.Ud, b);
  a.a.k(a.l() + "'s receive timeout set to " + b + " ms.")
}
function ve(a) {
  a.Y != jf && (a.Y == zf || 2 == a.Y ? kf(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.Y)))
}
function vf(a) {
  var b = new Ie;
  b.Qa = a.Qa;
  b.xd = 2;
  b.cd = 2;
  a.B.xc || (b.Cd = j);
  b.hb = a.B.hb;
  b.zc = a.Na;
  b.zc && (b.rd = 4096);
  b.pd = 3E5;
  b.nd = a.Na ? Math.floor(10) : 0;
  b.Nd = m;
  a.Da && (b.Kd = k, b.nc = Math.floor((a.Na ? 358E4 : 25E3) / 1E3));
  b.ma = Td(a.B.ic);
  b.yb = a.B.kd;
  a.s.push(b);
  a.Ia = b.ma
}
function xe(a, b) {
  b && (a.ia += 0.5);
  a.b()
}
q.aa = function() {
  this.da && !this.Ta && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.Jb) {
    this.a.q(this.l() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.da;
    this.da = j;
    !a && !this.s.length && vf(this);
    for(a = 0;a < this.s.length;a++) {
      this.a.k(this.l() + " SEND " + O(this.s[a]))
    }
    if(this.Ha()) {
      for(var a = [], b = 0, c = this.s.length;b < c;b++) {
        this.s[b].P(a), a.push("\n")
      }
      this.s = [];
      a = a.join("");
      b = this.Da ? this.p.V : this.p.na;
      this.j = Z.Xb(this, this.Da ? this.p.wd : this.p.Gd);
      this.Ec = this.o.w === Ib ? pa() : this.o.w.getTime();
      this.j.mc(b, "POST", a);
      kf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.Na ? 0 : this.Da ? 25E3 : 0))
    }else {
      if(this.Y == zf) {
        a = [];
        b = 0;
        for(c = this.s.length;b < c;b++) {
          a.push(this.s[b].H())
        }
        this.s = [];
        this.j ? this.j.kb(a) : (b = this.p, this.j = new Ae(this), this.j.Ib = b.Ke.Xb(this.j), this.Ec = this.o.w === Ib ? pa() : this.o.w.getTime(), this.j.Tb(b.host, b.port), this.j.Z || (this.j.kb(a), this.j.Z || kf(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.Y))
      }
    }
  }
};
function wf(a, b, c) {
  !a.da && !a.s.length && vf(a);
  for(var d = Math.max(c, a.La + 1), e = Rd(b), c = [], f = 0;f < e.length;f++) {
    var h = e[f];
    (d == k || h >= d) && c.push([h, b.D.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (-1 == a.La || a.La + 1 != e) && a.s.push(new Ne(e)), a.s.push(new Le(f)), a.La = e
  }
}
q.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Af.n.d.call(this);
  this.Md = this.o.w === Ib ? pa() : this.o.w.getTime();
  this.s = [];
  Jf(this);
  this.j && this.j.b();
  var a = this.B;
  this.B = k;
  Df(a, this)
};
function Ef(a, b) {
  !a.da && !a.s.length && vf(a);
  a.s.push(new Se(b, j));
  a.Od = j
}
function Cf(a, b, c, d) {
  this.o = a;
  this.B = b;
  this.Rc = c;
  this.Nc = d
}
A(Cf, I);
q = Cf.prototype;
q.da = m;
q.Ta = m;
q.ub = k;
q.Ia = k;
q.a = U("cw.net.DoNothingTransport");
function Kf(a) {
  a.ub = a.o.w.setTimeout(function() {
    a.ub = k;
    a.Nc--;
    a.Nc ? Kf(a) : a.b()
  }, a.Rc)
}
q.aa = function() {
  this.da && !this.Ta && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.da = j;
  Kf(this)
};
q.A = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.Rc, ">")
};
q.Ha = ba(m);
q.l = ba("Wast. T");
q.Lc = ba(m);
q.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Cf.n.d.call(this);
  this.ub != k && this.o.w.clearTimeout(this.ub);
  var a = this.B;
  this.B = k;
  Df(a, this)
};
function Lf() {
}
Lf.prototype.lb = k;
var Mf;
function Nf() {
}
A(Nf, Lf);
function Of(a) {
  return(a = Pf(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Qf(a) {
  var b = {};
  Pf(a) && (b[0] = j, b[1] = j);
  return b
}
Nf.prototype.gc = k;
function Pf(a) {
  if(!a.gc && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.gc = d
      }catch(e) {
      }
    }
    g(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.gc
}
Mf = new Nf;
function Rf(a) {
  this.headers = new P;
  this.Ra = a || k
}
A(Rf, Hb);
Rf.prototype.a = U("goog.net.XhrIo");
var Sf = /^https?$/i;
q = Rf.prototype;
q.ea = m;
q.f = k;
q.Nb = k;
q.kc = "";
q.hd = "";
q.$a = "";
q.Zb = m;
q.wb = m;
q.hc = m;
q.ua = m;
q.Kb = 0;
q.za = k;
q.Ed = "";
q.Oe = m;
q.send = function(a, b, c, d) {
  this.f && g(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.kc = a;
  this.$a = "";
  this.hd = b;
  this.Zb = m;
  this.ea = j;
  this.f = this.Ra ? Of(this.Ra) : Of(Mf);
  this.Nb = this.Ra ? this.Ra.lb || (this.Ra.lb = Qf(this.Ra)) : Mf.lb || (Mf.lb = Qf(Mf));
  this.f.onreadystatechange = x(this.ud, this);
  try {
    this.a.k(Tf(this, "Opening Xhr")), this.hc = j, this.f.open(b, a, j), this.hc = m
  }catch(e) {
    this.a.k(Tf(this, "Error opening Xhr: " + e.message));
    Uf(this, e);
    return
  }
  var a = c || "", f = this.headers.N();
  d && qc(d, function(a, b) {
    f.set(b, a)
  });
  "POST" == b && !f.S("Content-Type") && f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  qc(f, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.Ed && (this.f.responseType = this.Ed);
  "withCredentials" in this.f && (this.f.withCredentials = this.Oe);
  try {
    this.za && (Ib.clearTimeout(this.za), this.za = k), 0 < this.Kb && (this.a.k(Tf(this, "Will abort after " + this.Kb + "ms if incomplete")), this.za = Ib.setTimeout(x(this.Je, this), this.Kb)), this.a.k(Tf(this, "Sending request")), this.wb = j, this.f.send(a), this.wb = m
  }catch(h) {
    this.a.k(Tf(this, "Send error: " + h.message)), Uf(this, h)
  }
};
q.Je = function() {
  "undefined" != typeof ca && this.f && (this.$a = "Timed out after " + this.Kb + "ms, aborting", this.a.k(Tf(this, this.$a)), this.dispatchEvent("timeout"), this.abort(8))
};
function Uf(a, b) {
  a.ea = m;
  a.f && (a.ua = j, a.f.abort(), a.ua = m);
  a.$a = b;
  Vf(a);
  Wf(a)
}
function Vf(a) {
  a.Zb || (a.Zb = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
q.abort = function() {
  this.f && this.ea && (this.a.k(Tf(this, "Aborting")), this.ea = m, this.ua = j, this.f.abort(), this.ua = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Wf(this))
};
q.d = function() {
  this.f && (this.ea && (this.ea = m, this.ua = j, this.f.abort(), this.ua = m), Wf(this, j));
  Rf.n.d.call(this)
};
q.ud = function() {
  !this.hc && !this.wb && !this.ua ? this.we() : Xf(this)
};
q.we = function() {
  Xf(this)
};
function Xf(a) {
  if(a.ea && "undefined" != typeof ca) {
    if(a.Nb[1] && 4 == a.ha() && 2 == Yf(a)) {
      a.a.k(Tf(a, "Local request error detected and ignored"))
    }else {
      if(a.wb && 4 == a.ha()) {
        Ib.setTimeout(x(a.ud, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.ha()) {
          a.a.k(Tf(a, "Request complete"));
          a.ea = m;
          var b = Yf(a), c;
          a: {
            switch(b) {
              case 200:
              ;
              case 201:
              ;
              case 202:
              ;
              case 204:
              ;
              case 304:
              ;
              case 1223:
                c = j;
                break a;
              default:
                c = m
            }
          }
          if(!c) {
            if(b = 0 === b) {
              b = ("" + a.kc).match(rd)[1] || k, !b && self.location && (b = self.location.protocol, b = b.substr(0, b.length - 1)), b = !Sf.test(b ? b.toLowerCase() : "")
            }
            c = b
          }
          if(c) {
            a.dispatchEvent("complete"), a.dispatchEvent("success")
          }else {
            var d;
            try {
              d = 2 < a.ha() ? a.f.statusText : ""
            }catch(e) {
              a.a.k("Can not get status: " + e.message), d = ""
            }
            a.$a = d + " [" + Yf(a) + "]";
            Vf(a)
          }
          Wf(a)
        }
      }
    }
  }
}
function Wf(a, b) {
  if(a.f) {
    var c = a.f, d = a.Nb[0] ? ea : k;
    a.f = k;
    a.Nb = k;
    a.za && (Ib.clearTimeout(a.za), a.za = k);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(e) {
      a.a.F("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
}
q.ha = function() {
  return this.f ? this.f.readyState : 0
};
function Yf(a) {
  try {
    return 2 < a.ha() ? a.f.status : -1
  }catch(b) {
    return a.a.z("Can not get status: " + b.message), -1
  }
}
q.getResponseHeader = function(a) {
  return this.f && 4 == this.ha() ? this.f.getResponseHeader(a) : i
};
function Tf(a, b) {
  return b + " [" + a.hd + " " + a.kc + " " + Yf(a) + "]"
}
;var Zf = !(E || F && !G("420+"));
function ag(a, b) {
  this.Lb = a;
  this.Q = b
}
A(ag, I);
q = ag.prototype;
q.j = k;
q.la = -1;
q.$c = m;
q.bd = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function bg(a) {
  var b = gf(a.Pc), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.Q, c, b), 1 != b && a.b()) : a.b()
}
q.oe = function() {
  bg(this);
  if(!this.Z) {
    var a = s.parent;
    a && a.__XHRMaster_oncomplete(this.Q);
    this.b()
  }
};
q.ye = function() {
  var a = s.parent;
  if(a) {
    this.la = this.j.ha();
    if(2 <= this.la && !this.$c) {
      for(var b = new P, c = this.bd.length;c--;) {
        var d = this.bd[c];
        try {
          b.set(d, this.j.f.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.C() && (this.$c = j, a.__XHRMaster_ongotheaders(this.Q, vc(b)), this.Z)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.Q, this.la);
    Zf && 3 == this.la && bg(this)
  }else {
    this.b()
  }
};
q.mc = function(a, b, c) {
  this.j = new Rf;
  wb(this.j, "readystatechange", x(this.ye, this));
  wb(this.j, "complete", x(this.oe, this));
  this.j.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.Pc = new ff(this.j.f, 1048576)
};
q.d = function() {
  ag.n.d.call(this);
  delete this.Pc;
  this.j && this.j.b();
  delete this.Lb.gb[this.Q];
  delete this.Lb
};
function cg() {
  this.gb = {}
}
A(cg, I);
cg.prototype.te = function(a, b, c, d) {
  var e = new ag(this, a);
  this.gb[a] = e;
  e.mc(b, c, d)
};
cg.prototype.de = function(a) {
  (a = this.gb[a]) && a.b()
};
cg.prototype.d = function() {
  cg.n.d.call(this);
  for(var a = $a(this.gb);a.length;) {
    a.pop().b()
  }
  delete this.gb
};
var dg = new cg;
s.__XHRSlave_makeRequest = x(dg.te, dg);
s.__XHRSlave_dispose = x(dg.de, dg);
var eg = U("cw.net.demo");
function fg(a, b, c, d) {
  a = new td(document.location);
  if(c) {
    return new mf(d, a.O, s.__demo_mainSocketPort)
  }
  b ? (b = s.__demo_shared_domain, w(b) || g(Error("domain was " + O(b) + "; expected a string.")), c = a.N(), wd(c, "_____random_____." + b)) : c = a.N();
  yd(c, d);
  zd(c, "", i);
  return new of(c.toString().replace("_____random_____", "%random%"))
}
;y("Minerva.HttpEndpoint", of);
y("Minerva.SocketEndpoint", mf);
y("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.me;
$.prototype.bindToProtocol = $.prototype.Td;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.Be;
$.prototype.reset = $.prototype.reset;
y("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.uc;
S.prototype.shout = S.prototype.De;
S.prototype.severe = S.prototype.F;
S.prototype.warning = S.prototype.z;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.Zd;
S.prototype.fine = S.prototype.k;
S.prototype.finer = S.prototype.he;
S.prototype.finest = S.prototype.q;
T.OFF = ed;
T.SHOUT = fd;
T.SEVERE = gd;
T.WARNING = hd;
T.INFO = id;
T.CONFIG = kd;
T.FINE = ld;
T.FINER = md;
T.FINEST = nd;
T.ALL = od;
y("Minerva.LogManager", V);
V.getRoot = V.dc;
y("Minerva.DivConsole", qd);
qd.prototype.setCapturing = qd.prototype.Ce;
y("Minerva.bind", x);
y("Minerva.repr", O);
y("Minerva.theCallQueue", Yb);
y("Minerva.getEndpoint", fg);
y("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new td(document.location)).L;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !s.__demo_shared_domain) {
    eg.z("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return fg(0, a, b, "/_minerva/")
});
})();
