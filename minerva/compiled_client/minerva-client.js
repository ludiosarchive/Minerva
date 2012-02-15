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
function u(a) {
  return"array" == t(a)
}
function w(a) {
  var b = t(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function fa(a) {
  return ga(a) && "function" == typeof a.getFullYear
}
function x(a) {
  return"string" == typeof a
}
function ha(a) {
  return"function" == t(a)
}
function ga(a) {
  var b = typeof a;
  return"object" == b && a != k || "function" == b
}
function ia(a) {
  return a[ja] || (a[ja] = ++ka)
}
var ja = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), ka = 0;
function la(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function ma(a, b, c) {
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
function y(a, b, c) {
  y = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? la : ma;
  return y.apply(k, arguments)
}
var na = Date.now || function() {
  return+new Date
};
function z(a, b) {
  var c = a.split("."), d = s;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && b !== i ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
function B(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.n = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
}
;function C(a) {
  this.stack = Error().stack || "";
  a && (this.message = "" + a)
}
B(C, Error);
C.prototype.name = "CustomError";
function oa(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
var pa = /^[a-zA-Z0-9\-_.!~*'()]*$/;
function qa(a) {
  a = "" + a;
  return!pa.test(a) ? encodeURIComponent(a) : a
}
function ra(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
}
function D(a) {
  if(!sa.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(ta, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(ua, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(va, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(wa, "&quot;"));
  return a
}
var ta = /&/g, ua = /</g, va = />/g, wa = /\"/g, sa = /[&<>\"]/;
function xa(a) {
  return ra(a.replace(/  /g, " &#160;"), i)
}
function ya(a, b) {
  for(var c = 0, d = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = ("" + b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;0 == c && h < f;h++) {
    var l = d[h] || "", n = e[h] || "", r = RegExp("(\\d*)(\\D*)", "g"), E = RegExp("(\\d*)(\\D*)", "g");
    do {
      var p = r.exec(l) || ["", "", ""], v = E.exec(n) || ["", "", ""];
      if(0 == p[0].length && 0 == v[0].length) {
        break
      }
      c = ((0 == p[1].length ? 0 : parseInt(p[1], 10)) < (0 == v[1].length ? 0 : parseInt(v[1], 10)) ? -1 : (0 == p[1].length ? 0 : parseInt(p[1], 10)) > (0 == v[1].length ? 0 : parseInt(v[1], 10)) ? 1 : 0) || ((0 == p[2].length) < (0 == v[2].length) ? -1 : (0 == p[2].length) > (0 == v[2].length) ? 1 : 0) || (p[2] < v[2] ? -1 : p[2] > v[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
}
;function za(a, b) {
  b.unshift(a);
  C.call(this, oa.apply(k, b));
  b.shift()
}
B(za, C);
za.prototype.name = "AssertionError";
function Aa(a, b) {
  g(new za("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;function Ba() {
  return j
}
;var Ca, Da, Ea, Fa;
function Ga() {
  return s.navigator ? s.navigator.userAgent : k
}
Fa = Ea = Da = Ca = m;
var Ha;
if(Ha = Ga()) {
  var Ia = s.navigator;
  Ca = 0 == Ha.indexOf("Opera");
  Da = !Ca && -1 != Ha.indexOf("MSIE");
  Ea = !Ca && -1 != Ha.indexOf("WebKit");
  Fa = !Ca && !Ea && "Gecko" == Ia.product
}
var Ja = Ca, F = Da, Ka = Fa, G = Ea, La;
a: {
  var Ma = "", Na;
  if(Ja && s.opera) {
    var Oa = s.opera.version, Ma = "function" == typeof Oa ? Oa() : Oa
  }else {
    if(Ka ? Na = /rv\:([^\);]+)(\)|;)/ : F ? Na = /MSIE\s+([^\);]+)(\)|;)/ : G && (Na = /WebKit\/(\S+)/), Na) {
      var Pa = Na.exec(Ga()), Ma = Pa ? Pa[1] : ""
    }
  }
  if(F) {
    var Qa, Ra = s.document;
    Qa = Ra ? Ra.documentMode : i;
    if(Qa > parseFloat(Ma)) {
      La = "" + Qa;
      break a
    }
  }
  La = Ma
}
var Sa = {};
function H(a) {
  return Sa[a] || (Sa[a] = 0 <= ya(La, a))
}
var Ta = {};
function Ua() {
  return Ta[9] || (Ta[9] = F && !!document.documentMode && 9 <= document.documentMode)
}
;function Va() {
}
var Wa = 0;
q = Va.prototype;
q.key = 0;
q.Ma = m;
q.Qb = m;
q.wb = function(a, b, c, d, e, f) {
  ha(a) ? this.ed = j : a && a.handleEvent && ha(a.handleEvent) ? this.ed = m : g(Error("Invalid listener argument"));
  this.ab = a;
  this.wd = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.dc = f;
  this.Qb = m;
  this.key = ++Wa;
  this.Ma = m
};
q.handleEvent = function(a) {
  return this.ed ? this.ab.call(this.dc || this.src, a) : this.ab.handleEvent.call(this.ab, a)
};
function Xa(a, b) {
  for(var c in a) {
    b.call(i, a[c], c, a)
  }
}
function Ya(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function Za(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var $a = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function ab(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < $a.length;f++) {
      c = $a[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!F || Ua();
var bb = !F || Ua();
F && H("8");
!G || H("528");
Ka && H("1.9b") || F && H("8") || Ja && H("9.5") || G && H("528");
!Ka || H("8");
var I = Array.prototype, cb = I.indexOf ? function(a, b, c) {
  return I.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == k ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(x(a)) {
    return!x(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, db = I.forEach ? function(a, b, c) {
  I.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
}, eb = I.map ? function(a, b, c) {
  return I.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = x(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in f && (e[h] = b.call(c, f[h], h, a))
  }
  return e
}, fb = I.some ? function(a, b, c) {
  return I.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return j
    }
  }
  return m
}, gb = I.every ? function(a, b, c) {
  return I.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return m
    }
  }
  return j
};
function hb(a, b) {
  var c = cb(a, b);
  0 <= c && I.splice.call(a, c, 1)
}
function ib(a) {
  return I.concat.apply(I, arguments)
}
function jb(a) {
  if(u(a)) {
    return ib(a)
  }
  for(var b = [], c = 0, d = a.length;c < d;c++) {
    b[c] = a[c]
  }
  return b
}
function kb(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(u(d) || (e = w(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, h = d.length, l = 0;l < h;l++) {
          a[f + l] = d[l]
        }
      }else {
        a.push(d)
      }
    }
  }
}
function lb(a, b, c) {
  return 2 >= arguments.length ? I.slice.call(a, b) : I.slice.call(a, b, c)
}
function mb(a, b) {
  I.sort.call(a, b || nb)
}
function nb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var ob = {Ue:"click", Ze:"dblclick", tf:"mousedown", xf:"mouseup", wf:"mouseover", vf:"mouseout", uf:"mousemove", Hf:"selectstart", of:"keypress", nf:"keydown", pf:"keyup", Se:"blur", gf:"focus", $e:"deactivate", hf:F ? "focusin" : "DOMFocusIn", jf:F ? "focusout" : "DOMFocusOut", Te:"change", Gf:"select", If:"submit", mf:"input", Cf:"propertychange", df:"dragstart", af:"dragenter", cf:"dragover", bf:"dragleave", ef:"drop", Mf:"touchstart", Lf:"touchmove", Kf:"touchend", Jf:"touchcancel", We:"contextmenu", 
ff:"error", lf:"help", qf:"load", rf:"losecapture", Df:"readystatechange", Ef:"resize", Ff:"scroll", Of:"unload", kf:"hashchange", yf:"pagehide", zf:"pageshow", Bf:"popstate", Xe:"copy", Af:"paste", Ye:"cut", Pe:"beforecopy", Qe:"beforecut", Re:"beforepaste", sf:"message", Ve:"connect", Nf:G ? "webkitTransitionEnd" : Ja ? "oTransitionEnd" : "transitionend"};
function J() {
}
J.prototype.Y = m;
J.prototype.b = function() {
  this.Y || (this.Y = j, this.d())
};
J.prototype.d = function() {
  this.Zd && pb.apply(k, this.Zd)
};
function pb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    w(d) ? pb.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function K(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
B(K, J);
K.prototype.d = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
K.prototype.xa = m;
K.prototype.Gb = j;
K.prototype.stopPropagation = function() {
  this.xa = j
};
function qb(a) {
  a.stopPropagation()
}
;function rb(a) {
  rb[" "](a);
  return a
}
rb[" "] = ea;
function sb(a, b) {
  a && this.wb(a, b)
}
B(sb, K);
q = sb.prototype;
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
q.wb = function(a, b) {
  var c = this.type = a.type;
  K.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ka) {
      var e;
      a: {
        try {
          rb(d.nodeName);
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
  this.offsetX = G || a.offsetX !== i ? a.offsetX : a.layerX;
  this.offsetY = G || a.offsetY !== i ? a.offsetY : a.layerY;
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
  delete this.Gb;
  delete this.xa
};
q.stopPropagation = function() {
  sb.n.stopPropagation.call(this);
  this.Wa.stopPropagation ? this.Wa.stopPropagation() : this.Wa.cancelBubble = j
};
q.d = function() {
  sb.n.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.Wa = k
};
var tb = {}, L = {}, M = {}, ub = {};
function vb(a, b, c, d, e) {
  if(b) {
    if(u(b)) {
      for(var f = 0;f < b.length;f++) {
        vb(a, b[f], c, d, e)
      }
      return k
    }
    var d = !!d, h = L;
    b in h || (h[b] = {c:0, M:0});
    h = h[b];
    d in h || (h[d] = {c:0, M:0}, h.c++);
    var h = h[d], l = ia(a), n;
    h.M++;
    if(h[l]) {
      n = h[l];
      for(f = 0;f < n.length;f++) {
        if(h = n[f], h.ab == c && h.dc == e) {
          if(h.Ma) {
            break
          }
          return n[f].key
        }
      }
    }else {
      n = h[l] = [], h.c++
    }
    f = wb();
    f.src = a;
    h = new Va;
    h.wb(c, f, a, b, d, e);
    c = h.key;
    f.key = c;
    n.push(h);
    tb[c] = h;
    M[l] || (M[l] = []);
    M[l].push(h);
    a.addEventListener ? (a == s || !a.Nc) && a.addEventListener(b, f, d) : a.attachEvent(b in ub ? ub[b] : ub[b] = "on" + b, f);
    return c
  }
  g(Error("Invalid event type"))
}
function wb() {
  var a = xb, b = bb ? function(c) {
    return a.call(b.src, b.key, c)
  } : function(c) {
    c = a.call(b.src, b.key, c);
    if(!c) {
      return c
    }
  };
  return b
}
function yb(a, b, c, d, e) {
  if(u(b)) {
    for(var f = 0;f < b.length;f++) {
      yb(a, b[f], c, d, e)
    }
    return k
  }
  a = vb(a, b, c, d, e);
  tb[a].Qb = j;
  return a
}
function zb(a, b, c, d, e) {
  if(u(b)) {
    for(var f = 0;f < b.length;f++) {
      zb(a, b[f], c, d, e)
    }
  }else {
    d = !!d;
    a: {
      f = L;
      if(b in f && (f = f[b], d in f && (f = f[d], a = ia(a), f[a]))) {
        a = f[a];
        break a
      }
      a = k
    }
    if(a) {
      for(f = 0;f < a.length;f++) {
        if(a[f].ab == c && a[f].capture == d && a[f].dc == e) {
          Ab(a[f].key);
          break
        }
      }
    }
  }
}
function Ab(a) {
  if(!tb[a]) {
    return m
  }
  var b = tb[a];
  if(b.Ma) {
    return m
  }
  var c = b.src, d = b.type, e = b.wd, f = b.capture;
  c.removeEventListener ? (c == s || !c.Nc) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in ub ? ub[d] : ub[d] = "on" + d, e);
  c = ia(c);
  e = L[d][f][c];
  if(M[c]) {
    var h = M[c];
    hb(h, b);
    0 == h.length && delete M[c]
  }
  b.Ma = j;
  e.qd = j;
  Bb(d, f, c, e);
  delete tb[a];
  return j
}
function Bb(a, b, c, d) {
  if(!d.yb && d.qd) {
    for(var e = 0, f = 0;e < d.length;e++) {
      d[e].Ma ? d[e].wd.src = k : (e != f && (d[f] = d[e]), f++)
    }
    d.length = f;
    d.qd = m;
    0 == f && (delete L[a][b][c], L[a][b].c--, 0 == L[a][b].c && (delete L[a][b], L[a].c--), 0 == L[a].c && delete L[a])
  }
}
function Cb(a) {
  var b, c = 0, d = b == k;
  b = !!b;
  if(a == k) {
    Xa(M, function(a) {
      for(var e = a.length - 1;0 <= e;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Ab(f.key), c++
        }
      }
    })
  }else {
    if(a = ia(a), M[a]) {
      for(var a = M[a], e = a.length - 1;0 <= e;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Ab(f.key), c++
        }
      }
    }
  }
}
function Db(a, b, c, d, e) {
  var f = 1, b = ia(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.yb ? a.yb++ : a.yb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Ma && (f &= Eb(n, e) !== m)
      }
    }finally {
      a.yb--, Bb(c, d, b, a)
    }
  }
  return Boolean(f)
}
function Eb(a, b) {
  var c = a.handleEvent(b);
  a.Qb && Ab(a.key);
  return c
}
function xb(a, b) {
  if(!tb[a]) {
    return j
  }
  var c = tb[a], d = c.type, e = L;
  if(!(d in e)) {
    return j
  }
  var e = e[d], f, h;
  if(!bb) {
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
          }catch(E) {
            r = j
          }
        }
        if(r || f.returnValue == i) {
          f.returnValue = j
        }
      }
    }
    r = new sb;
    r.wb(f, this);
    f = j;
    try {
      if(l) {
        for(var p = [], v = r.currentTarget;v;v = v.parentNode) {
          p.push(v)
        }
        h = e[j];
        h.M = h.c;
        for(var A = p.length - 1;!r.xa && 0 <= A && h.M;A--) {
          r.currentTarget = p[A], f &= Db(h, p[A], d, j, r)
        }
        if(n) {
          h = e[m];
          h.M = h.c;
          for(A = 0;!r.xa && A < p.length && h.M;A++) {
            r.currentTarget = p[A], f &= Db(h, p[A], d, m, r)
          }
        }
      }else {
        f = Eb(c, r)
      }
    }finally {
      p && (p.length = 0), r.b()
    }
    return f
  }
  d = new sb(b, this);
  try {
    f = Eb(c, d)
  }finally {
    d.b()
  }
  return f
}
var Fb = 0;
function Gb() {
}
B(Gb, J);
q = Gb.prototype;
q.Nc = j;
q.Bb = k;
q.uc = aa("Bb");
q.addEventListener = function(a, b, c, d) {
  vb(this, a, b, c, d)
};
q.removeEventListener = function(a, b, c, d) {
  zb(this, a, b, c, d)
};
q.dispatchEvent = function(a) {
  var b = a.type || a, c = L;
  if(b in c) {
    if(x(a)) {
      a = new K(a, this)
    }else {
      if(a instanceof K) {
        a.target = a.target || this
      }else {
        var d = a, a = new K(b, this);
        ab(a, d)
      }
    }
    var d = 1, e, c = c[b], b = j in c, f;
    if(b) {
      e = [];
      for(f = this;f;f = f.Bb) {
        e.push(f)
      }
      f = c[j];
      f.M = f.c;
      for(var h = e.length - 1;!a.xa && 0 <= h && f.M;h--) {
        a.currentTarget = e[h], d &= Db(f, e[h], a.type, j, a) && a.Gb != m
      }
    }
    if(m in c) {
      if(f = c[m], f.M = f.c, b) {
        for(h = 0;!a.xa && h < e.length && f.M;h++) {
          a.currentTarget = e[h], d &= Db(f, e[h], a.type, m, a) && a.Gb != m
        }
      }else {
        for(e = this;!a.xa && e && f.M;e = e.Bb) {
          a.currentTarget = e, d &= Db(f, e, a.type, m, a) && a.Gb != m
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
  Gb.n.d.call(this);
  Cb(this);
  this.Bb = k
};
var Hb = s.window;
Fb++;
Fb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function N(a, b) {
  this.mb = [];
  this.Jc = a;
  this.Pc = b || k
}
q = N.prototype;
q.ga = m;
q.Xa = m;
q.bb = 0;
q.vc = m;
q.Ud = m;
q.Pb = 0;
q.cancel = function(a) {
  if(this.ga) {
    this.eb instanceof N && this.eb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.Pb--, 0 >= b.Pb && b.cancel())
    }
    this.Jc ? this.Jc.call(this.Pc, this) : this.vc = j;
    this.ga || this.Va(new Ib)
  }
};
q.Lc = function(a, b) {
  Jb(this, a, b);
  this.bb--;
  0 == this.bb && this.ga && Kb(this)
};
function Jb(a, b, c) {
  a.ga = j;
  a.eb = c;
  a.Xa = !b;
  Kb(a)
}
function Lb(a) {
  a.ga && (a.vc || g(new Mb), a.vc = m)
}
function Nb(a, b) {
  Lb(a);
  Jb(a, j, b)
}
q.Va = function(a) {
  Lb(this);
  Jb(this, m, a)
};
function Ob(a, b) {
  Pb(a, b, k, i)
}
function Qb(a, b) {
  Pb(a, k, b, i)
}
function Pb(a, b, c, d) {
  a.mb.push([b, c, d]);
  a.ga && Kb(a)
}
function Rb(a, b) {
  Pb(a, b, b, i)
}
function Sb(a) {
  return fb(a.mb, function(a) {
    return ha(a[1])
  })
}
function Kb(a) {
  a.Ec && a.ga && Sb(a) && (s.clearTimeout(a.Ec), delete a.Ec);
  a.t && (a.t.Pb--, delete a.t);
  for(var b = a.eb, c = m, d = m;a.mb.length && 0 == a.bb;) {
    var e = a.mb.shift(), f = e[0], h = e[1], e = e[2];
    if(f = a.Xa ? h : f) {
      try {
        var l = f.call(e || a.Pc, b);
        l !== i && (a.Xa = a.Xa && (l == b || l instanceof Error), a.eb = b = l);
        b instanceof N && (d = j, a.bb++)
      }catch(n) {
        b = n, a.Xa = j, Sb(a) || (c = j)
      }
    }
  }
  a.eb = b;
  d && a.bb && (Pb(b, y(a.Lc, a, j), y(a.Lc, a, m)), b.Ud = j);
  c && (a.Ec = s.setTimeout(function() {
    b.message !== i && b.stack && (b.message += "\n" + b.stack);
    g(b)
  }, 0))
}
function Tb(a) {
  var b = new N;
  Nb(b, a);
  return b
}
function Ub(a) {
  var b = new N;
  b.Va(a);
  return b
}
function Mb() {
  C.call(this)
}
B(Mb, C);
Mb.prototype.message = "Already called";
function Ib() {
  C.call(this)
}
B(Ib, C);
Ib.prototype.message = "Deferred was cancelled";
function Vb(a) {
  this.B = a;
  this.pb = [];
  this.Sc = [];
  this.Td = y(this.Je, this)
}
Vb.prototype.Bc = k;
function Wb(a, b, c, d) {
  a.pb.push([b, c, d]);
  a.Bc == k && (a.Bc = a.B.setTimeout(a.Td, 0))
}
Vb.prototype.Je = function() {
  this.Bc = k;
  var a = this.pb;
  this.pb = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], e = c[1], c = c[2];
    try {
      d.apply(e, c)
    }catch(f) {
      this.B.setTimeout(function() {
        g(f)
      }, 0)
    }
  }
  if(0 == this.pb.length) {
    a = this.Sc;
    this.Sc = [];
    for(b = 0;b < a.length;b++) {
      Nb(a[b], k)
    }
  }
};
var Xb = new Vb(s.window);
function Yb(a) {
  return ha(a) || "object" == typeof a && ha(a.call) && ha(a.apply)
}
;function Zb() {
  this.Fb = i
}
function $b(a) {
  var b = [];
  ac(new Zb, a, b);
  return b.join("")
}
function ac(a, b, c) {
  switch(typeof b) {
    case "string":
      bc(b, c);
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
      if(u(b)) {
        var d = b.length;
        c.push("[");
        for(var e = "", f = 0;f < d;f++) {
          c.push(e), e = b[f], ac(a, a.Fb ? a.Fb.call(b, "" + f, e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(f in b) {
        Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], "function" != typeof e && (c.push(d), bc(f, c), c.push(":"), ac(a, a.Fb ? a.Fb.call(b, f, e) : e, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var dc = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, ec = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function bc(a, b) {
  b.push('"', a.replace(ec, function(a) {
    if(a in dc) {
      return dc[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
    return dc[a] = e + b.toString(16)
  }), '"')
}
;function fc(a, b, c) {
  var d = cb(c, a);
  if(-1 != d) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = t(a);
    if("boolean" == d || "number" == d || "null" == d || "undefined" == d) {
      b.push("" + a)
    }else {
      if("string" == d) {
        bc(a, b)
      }else {
        if(Yb(a.w)) {
          a.w(b, c)
        }else {
          if(Yb(a.Od)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var e = "", f = 0;f < d;f++) {
                  b.push(e), fc(a[f], b, c), e = ", "
                }
                b.push("]")
              }else {
                if("object" == d) {
                  if(fa(a) && "function" == typeof a.valueOf) {
                    b.push("new Date(", "" + a.valueOf(), ")")
                  }else {
                    for(var d = Za(a).concat($a), e = {}, h = f = 0;h < d.length;) {
                      var l = d[h++], n = ga(l) ? "o" + ia(l) : (typeof l).charAt(0) + l;
                      Object.prototype.hasOwnProperty.call(e, n) || (e[n] = j, d[f++] = l)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      f = d[h], Object.prototype.hasOwnProperty.call(a, f) && (l = a[f], b.push(e), bc(f, b), b.push(": "), fc(l, b, c), e = ", ")
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
function O(a, b, c) {
  c || (c = []);
  fc(a, b, c)
}
function P(a, b) {
  var c = [];
  O(a, c, b);
  return c.join("")
}
;function gc() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ na()).toString(36)
}
function hc(a) {
  return a.substr(0, a.length - 1)
}
var ic = /^(0|[1-9]\d*)$/, jc = /^(0|\-?[1-9]\d*)$/;
function kc(a) {
  var b = lc;
  return ic.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;var lc = Math.pow(2, 53);
function mc(a) {
  if("function" == typeof a.H) {
    a = a.H()
  }else {
    if(w(a) || x(a)) {
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
function nc(a) {
  if("function" == typeof a.I) {
    return a.I()
  }
  if(x(a)) {
    return a.split("")
  }
  if(w(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return Ya(a)
}
function oc(a) {
  if("function" == typeof a.aa) {
    return a.aa()
  }
  if("function" != typeof a.I) {
    if(w(a) || x(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return Za(a)
  }
}
function pc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(w(a) || x(a)) {
      db(a, b, c)
    }else {
      for(var d = oc(a), e = nc(a), f = e.length, h = 0;h < f;h++) {
        b.call(c, e[h], d && d[h], a)
      }
    }
  }
}
function qc(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, i)
  }
  if(w(a) || x(a)) {
    return gb(a, b, i)
  }
  for(var c = oc(a), d = nc(a), e = d.length, f = 0;f < e;f++) {
    if(!b.call(i, d[f], c && c[f], a)) {
      return m
    }
  }
  return j
}
;function Q(a, b) {
  this.m = {};
  this.h = [];
  var c = arguments.length;
  if(1 < c) {
    c % 2 && g(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.Ob(a)
  }
}
q = Q.prototype;
q.c = 0;
q.H = o("c");
q.I = function() {
  rc(this);
  for(var a = [], b = 0;b < this.h.length;b++) {
    a.push(this.m[this.h[b]])
  }
  return a
};
q.aa = function() {
  rc(this);
  return this.h.concat()
};
q.S = function(a) {
  return sc(this.m, a)
};
q.Tb = function(a) {
  for(var b = 0;b < this.h.length;b++) {
    var c = this.h[b];
    if(sc(this.m, c) && this.m[c] == a) {
      return j
    }
  }
  return m
};
q.G = function(a, b) {
  if(this === a) {
    return j
  }
  if(this.c != a.H()) {
    return m
  }
  var c = b || tc;
  rc(this);
  for(var d, e = 0;d = this.h[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function tc(a, b) {
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
  return sc(this.m, a) ? (delete this.m[a], this.c--, this.h.length > 2 * this.c && rc(this), j) : m
};
function rc(a) {
  if(a.c != a.h.length) {
    for(var b = 0, c = 0;b < a.h.length;) {
      var d = a.h[b];
      sc(a.m, d) && (a.h[c++] = d);
      b++
    }
    a.h.length = c
  }
  if(a.c != a.h.length) {
    for(var e = {}, c = b = 0;b < a.h.length;) {
      d = a.h[b], sc(e, d) || (a.h[c++] = d, e[d] = 1), b++
    }
    a.h.length = c
  }
}
q.get = function(a, b) {
  return sc(this.m, a) ? this.m[a] : b
};
q.set = function(a, b) {
  sc(this.m, a) || (this.c++, this.h.push(a));
  this.m[a] = b
};
q.Ob = function(a) {
  var b;
  a instanceof Q ? (b = a.aa(), a = a.I()) : (b = Za(a), a = Ya(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
q.N = function() {
  return new Q(this)
};
function uc(a) {
  rc(a);
  for(var b = {}, c = 0;c < a.h.length;c++) {
    var d = a.h[c];
    b[d] = a.m[d]
  }
  return b
}
function sc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;var vc = {Od:ba("<cw.eq.Wildcard>")};
function wc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function xc(a, b, c) {
  var d = t(a), e = t(b);
  if(a == vc || b == vc) {
    return j
  }
  if(a != k && "function" == typeof a.G) {
    return c && c.push("running custom equals function on left object"), a.G(b, c)
  }
  if(b != k && "function" == typeof b.G) {
    return c && c.push("running custom equals function on right object"), b.G(a, c)
  }
  if(wc(d) || wc(e)) {
    a = a === b
  }else {
    if(a instanceof RegExp && b instanceof RegExp) {
      a = a.toString() === b.toString()
    }else {
      if(fa(a) && fa(b)) {
        a = a.valueOf() === b.valueOf()
      }else {
        if("array" == d && "array" == e) {
          a: {
            if(c && c.push("descending into array"), a.length != b.length) {
              c && c.push("array length mismatch: " + a.length + ", " + b.length), a = m
            }else {
              d = 0;
              for(e = a.length;d < e;d++) {
                if(!xc(a[d], b[d], c)) {
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
          if(a.Nd == Ba && b.Nd == Ba) {
            a: {
              c && c.push("descending into object");
              for(var f in a) {
                if(!(f in b)) {
                  c && c.push("property " + f + " missing on right object");
                  a = m;
                  break a
                }
                if(!xc(a[f], b[f], c)) {
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
;function R(a, b) {
  this.xe = a;
  this.Db = b
}
R.prototype.G = function(a, b) {
  return ga(a) && this.constructor == a.constructor && xc(this.Db, a.Db, b)
};
R.prototype.w = function(a, b) {
  a.push("new ", this.xe, "(");
  for(var c = "", d = 0;d < this.Db.length;d++) {
    a.push(c), c = ", ", O(this.Db[d], a, b)
  }
  a.push(")")
};
var yc, zc;
function Ac() {
  this.zd = na()
}
var Bc = new Ac;
Ac.prototype.set = aa("zd");
Ac.prototype.reset = function() {
  this.set(na())
};
Ac.prototype.get = o("zd");
function Cc(a) {
  this.ve = a || "";
  this.Ee = Bc
}
Cc.prototype.Gd = j;
Cc.prototype.De = j;
Cc.prototype.Ce = j;
Cc.prototype.Hd = m;
function Dc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Ec(a, b) {
  var c = (a.Jd - b) / 1E3, d = c.toFixed(3), e = 0;
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
function Fc(a) {
  Cc.call(this, a)
}
B(Fc, Cc);
Fc.prototype.Hd = j;
var Gc;
function Hc(a, b) {
  var c;
  c = a.className;
  c = x(c) && c.match(/\S+/g) || [];
  for(var d = lb(arguments, 1), e = c.length + d.length, f = c, h = 0;h < d.length;h++) {
    0 <= cb(f, d[h]) || f.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == e
}
;var Ic = !F || Ua();
!Ka && !F || F && Ua() || Ka && H("1.9.1");
F && H("9");
function Jc(a) {
  return a ? new Kc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Gc || (Gc = new Kc)
}
function Lc(a) {
  return x(a) ? document.getElementById(a) : a
}
function Mc(a, b) {
  var c = b && "*" != b ? b.toUpperCase() : "";
  return a.querySelectorAll && a.querySelector && (!G || "CSS1Compat" == document.compatMode || H("528")) && c ? a.querySelectorAll(c + "") : a.getElementsByTagName(c || "*")
}
function Nc(a, b) {
  Xa(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in Oc ? a.setAttribute(Oc[d], b) : 0 == d.lastIndexOf("aria-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var Oc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Pc(a, b, c) {
  return Qc(document, arguments)
}
function Qc(a, b) {
  var c = b[0], d = b[1];
  if(!Ic && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', D(d.name), '"');
    if(d.type) {
      c.push(' type="', D(d.type), '"');
      var e = {};
      ab(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (x(d) ? c.className = d : u(d) ? Hc.apply(k, [c].concat(d)) : Nc(c, d));
  2 < b.length && Rc(a, c, b, 2);
  return c
}
function Rc(a, b, c, d) {
  function e(c) {
    c && b.appendChild(x(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    w(f) && !(ga(f) && 0 < f.nodeType) ? db(Sc(f) ? jb(f) : f, e) : e(f)
  }
}
function Tc(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function Sc(a) {
  if(a && "number" == typeof a.length) {
    if(ga(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(ha(a)) {
      return"function" == typeof a.item
    }
  }
  return m
}
function Kc(a) {
  this.fa = a || s.document || document
}
q = Kc.prototype;
q.Wc = Jc;
q.ta = function(a) {
  return x(a) ? this.fa.getElementById(a) : a
};
q.Ua = function(a, b, c) {
  return Qc(this.fa, arguments)
};
q.createElement = function(a) {
  return this.fa.createElement(a)
};
q.createTextNode = function(a) {
  return this.fa.createTextNode(a)
};
q.appendChild = function(a, b) {
  a.appendChild(b)
};
q.append = function(a, b) {
  Rc(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
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
  F ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[G ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function Wc(a) {
  this.m = new Q;
  a && this.Ob(a)
}
function Xc(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ia(a) : b.substr(0, 1) + a
}
q = Wc.prototype;
q.H = function() {
  return this.m.H()
};
q.add = function(a) {
  this.m.set(Xc(a), a)
};
q.Ob = function(a) {
  for(var a = nc(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
q.rc = function(a) {
  for(var a = nc(a), b = a.length, c = 0;c < b;c++) {
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
q.I = function() {
  return this.m.I()
};
q.N = function() {
  return new Wc(this)
};
q.G = function(a) {
  return this.H() == mc(a) && Yc(this, a)
};
function Yc(a, b) {
  var c = mc(b);
  if(a.H() > c) {
    return m
  }
  !(b instanceof Wc) && 5 < c && (b = new Wc(b));
  return qc(a, function(a) {
    if("function" == typeof b.contains) {
      a = b.contains(a)
    }else {
      if("function" == typeof b.Tb) {
        a = b.Tb(a)
      }else {
        if(w(b) || x(b)) {
          a = 0 <= cb(b, a)
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
  if(0 <= cb(b, a)) {
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
cd.prototype.ac = k;
cd.prototype.$b = k;
var dd = 0;
cd.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || dd++;
  this.Jd = d || na();
  this.Ja = a;
  this.od = b;
  this.qe = c;
  delete this.ac;
  delete this.$b
};
cd.prototype.tc = aa("Ja");
function S(a) {
  this.se = a
}
S.prototype.t = k;
S.prototype.Ja = k;
S.prototype.ea = k;
S.prototype.Fa = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var ed = new T("OFF", Infinity), gd = new T("SHOUT", 1200), hd = new T("SEVERE", 1E3), id = new T("WARNING", 900), jd = new T("INFO", 800), kd = new T("CONFIG", 700), ld = new T("FINE", 500), md = new T("FINER", 400), nd = new T("FINEST", 300), od = new T("ALL", 0);
function U(a) {
  return V.Yc(a)
}
q = S.prototype;
q.getParent = o("t");
q.tc = aa("Ja");
function pd(a) {
  if(a.Ja) {
    return a.Ja
  }
  if(a.t) {
    return pd(a.t)
  }
  Aa("Root logger has no level set.");
  return k
}
q.log = function(a, b, c) {
  if(a.value >= pd(this).value) {
    a = this.ie(a, b, c);
    b = "log:" + a.od;
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
q.ie = function(a, b, c) {
  var d = new cd(a, "" + b, this.se);
  if(c) {
    d.ac = c;
    var e;
    var f = arguments.callee.caller;
    try {
      var h;
      var l = da("window.location.href");
      if(x(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:l, stack:"Not available"}
      }else {
        var n, r, E = m;
        try {
          n = c.lineNumber || c.pe || "Not available"
        }catch(p) {
          n = "Not available", E = j
        }
        try {
          r = c.fileName || c.filename || c.sourceURL || l
        }catch(v) {
          r = "Not available", E = j
        }
        h = E || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:r, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + D(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + D(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + D(Zc(f) + "-> ")
    }catch(A) {
      e = "Exception trying to expose exception! You win, we lose. " + A
    }
    d.$b = e
  }
  return d
};
q.Be = function(a, b) {
  this.log(gd, a, b)
};
q.C = function(a, b) {
  this.log(hd, a, b)
};
q.A = function(a, b) {
  this.log(id, a, b)
};
q.info = function(a, b) {
  this.log(jd, a, b)
};
q.Wd = function(a, b) {
  this.log(kd, a, b)
};
q.k = function(a, b) {
  this.log(ld, a, b)
};
q.ee = function(a, b) {
  this.log(md, a, b)
};
q.p = function(a, b) {
  this.log(nd, a, b)
};
var V = {zb:{}, fb:k};
V.cd = function() {
  V.fb || (V.fb = new S(""), V.zb[""] = V.fb, V.fb.tc(kd))
};
V.Qf = function() {
  return V.zb
};
V.cc = function() {
  V.cd();
  return V.fb
};
V.Yc = function(a) {
  V.cd();
  return V.zb[a] || V.Yd(a)
};
V.Pf = function(a) {
  return function(b) {
    (a || V.cc()).C("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.pe + ")")
  }
};
V.Yd = function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.Yc(a.substr(0, c));
  c.ea || (c.ea = {});
  c.ea[d] = b;
  b.t = c;
  return V.zb[a] = b
};
function qd(a) {
  this.xd = y(this.Pd, this);
  this.Vc = new Fc;
  this.dd = this.Vc.Gd = m;
  this.i = a;
  this.ce = this.i.ownerDocument || this.i.document;
  var a = Jc(this.i), b = k;
  if(F) {
    b = a.fa.createStyleSheet(), Vc(b)
  }else {
    var c = Mc(a.fa, "head")[0];
    c || (b = Mc(a.fa, "body")[0], c = a.Ua("head"), b.parentNode.insertBefore(c, b));
    b = a.Ua("style");
    Vc(b);
    a.appendChild(c, b)
  }
  this.i.className += " logdiv"
}
qd.prototype.Ae = function(a) {
  if(a != this.dd) {
    var b = V.cc();
    if(a) {
      var c = this.xd;
      b.Fa || (b.Fa = []);
      b.Fa.push(c)
    }else {
      (b = b.Fa) && hb(b, this.xd)
    }
    this.dd = a
  }
};
qd.prototype.Pd = function(a) {
  var b = 100 >= this.i.scrollHeight - this.i.scrollTop - this.i.clientHeight, c = this.ce.createElement("div");
  c.className = "logmsg";
  var d = this.Vc, e;
  switch(a.Ja.value) {
    case gd.value:
      e = "dbg-sh";
      break;
    case hd.value:
      e = "dbg-sev";
      break;
    case id.value:
      e = "dbg-w";
      break;
    case jd.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var f = [];
  f.push(d.ve, " ");
  if(d.Gd) {
    var h = new Date(a.Jd);
    f.push("[", Dc(h.getFullYear() - 2E3) + Dc(h.getMonth() + 1) + Dc(h.getDate()) + " " + Dc(h.getHours()) + ":" + Dc(h.getMinutes()) + ":" + Dc(h.getSeconds()) + "." + Dc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.De && f.push("[", xa(Ec(a, d.Ee.get())), "s] ");
  d.Ce && f.push("[", D(a.qe), "] ");
  f.push('<span class="', e, '">', ra(xa(D(a.od))));
  d.Hd && a.ac && f.push("<br>", ra(xa(a.$b || "")));
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
  a instanceof td ? (this.Oa(b == k ? a.U : b), ud(this, a.W), vd(this, a.Ba), wd(this, a.O), xd(this, a.ja), yd(this, a.K), zd(this, a.L.N()), Ad(this, a.sa)) : a && (c = ("" + a).match(rd)) ? (this.Oa(!!b), ud(this, c[1] || "", j), vd(this, c[2] || "", j), wd(this, c[3] || "", j), xd(this, c[4]), yd(this, c[5] || "", j), zd(this, c[6] || "", j), Ad(this, c[7] || "", j)) : (this.Oa(!!b), this.L = new Bd(k, this, this.U))
}
q = td.prototype;
q.W = "";
q.Ba = "";
q.O = "";
q.ja = k;
q.K = "";
q.sa = "";
q.oe = m;
q.U = m;
q.toString = function() {
  if(this.R) {
    return this.R
  }
  var a = [];
  this.W && a.push(Cd(this.W, Dd), ":");
  this.O && (a.push("//"), this.Ba && a.push(Cd(this.Ba, Dd), "@"), a.push(x(this.O) ? encodeURIComponent(this.O) : k), this.ja != k && a.push(":", "" + this.ja));
  this.K && (this.O && "/" != this.K.charAt(0) && a.push("/"), a.push(Cd(this.K, "/" == this.K.charAt(0) ? Ed : Fd)));
  var b = "" + this.L;
  b && a.push("?", b);
  this.sa && a.push("#", Cd(this.sa, Gd));
  return this.R = a.join("")
};
q.N = function() {
  var a = this.W, b = this.Ba, c = this.O, d = this.ja, e = this.K, f = this.L.N(), h = this.sa, l = new td(k, this.U);
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
  a.W = c ? b ? decodeURIComponent(b) : "" : b;
  a.W && (a.W = a.W.replace(/:$/, ""))
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
  b instanceof Bd ? (a.L = b, a.L.Fc = a, a.L.Oa(a.U)) : (c || (b = Cd(b, Id)), a.L = new Bd(b, a, a.U))
}
function Ad(a, b, c) {
  Hd(a);
  delete a.R;
  a.sa = c ? b ? decodeURIComponent(b) : "" : b
}
function Hd(a) {
  a.oe && g(Error("Tried to modify a read-only Uri"))
}
q.Oa = function(a) {
  this.U = a;
  this.L && this.L.Oa(a);
  return this
};
function Jd(a) {
  return a instanceof td ? a.N() : new td(a, i)
}
var Kd = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function Cd(a, b) {
  var c = k;
  x(a) && (c = a, Kd.test(c) || (c = encodeURI(a)), 0 <= c.search(b) && (c = c.replace(b, Ld)));
  return c
}
function Ld(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Dd = /[#\/\?@]/g, Fd = /[\#\?:]/g, Ed = /[\#\?]/g, Id = /[\#\?@]/g, Gd = /#/g;
function Bd(a, b, c) {
  this.Z = a || k;
  this.Fc = b || k;
  this.U = !!c
}
function W(a) {
  if(!a.g && (a.g = new Q, a.c = 0, a.Z)) {
    for(var b = a.Z.split("&"), c = 0;c < b.length;c++) {
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
q.H = function() {
  W(this);
  return this.c
};
q.add = function(a, b) {
  W(this);
  Nd(this);
  a = Md(this, a);
  if(this.S(a)) {
    var c = this.g.get(a);
    u(c) ? c.push(b) : this.g.set(a, [c, b])
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
    u(b) ? this.c -= b.length : this.c--;
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
q.Tb = function(a) {
  var b = this.I();
  return 0 <= cb(b, a)
};
q.aa = function() {
  W(this);
  for(var a = this.g.I(), b = this.g.aa(), c = [], d = 0;d < b.length;d++) {
    var e = a[d];
    if(u(e)) {
      for(var f = 0;f < e.length;f++) {
        c.push(b[d])
      }
    }else {
      c.push(b[d])
    }
  }
  return c
};
q.I = function(a) {
  W(this);
  if(a) {
    if(a = Md(this, a), this.S(a)) {
      var b = this.g.get(a);
      if(u(b)) {
        return b
      }
      a = [];
      a.push(b)
    }else {
      a = []
    }
  }else {
    for(var b = this.g.I(), a = [], c = 0;c < b.length;c++) {
      var d = b[c];
      u(d) ? kb(a, d) : a.push(d)
    }
  }
  return a
};
q.set = function(a, b) {
  W(this);
  Nd(this);
  a = Md(this, a);
  if(this.S(a)) {
    var c = this.g.get(a);
    u(c) ? this.c -= c.length : this.c--
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
    return u(c) ? c[0] : c
  }
  return b
};
q.toString = function() {
  if(this.Z) {
    return this.Z
  }
  if(!this.g) {
    return""
  }
  for(var a = [], b = 0, c = this.g.aa(), d = 0;d < c.length;d++) {
    var e = c[d], f = qa(e), e = this.g.get(e);
    if(u(e)) {
      for(var h = 0;h < e.length;h++) {
        0 < b && a.push("&"), a.push(f), "" !== e[h] && a.push("=", qa(e[h])), b++
      }
    }else {
      0 < b && a.push("&"), a.push(f), "" !== e && a.push("=", qa(e)), b++
    }
  }
  return this.Z = a.join("")
};
function Nd(a) {
  delete a.Ea;
  delete a.Z;
  a.Fc && delete a.Fc.R
}
q.N = function() {
  var a = new Bd;
  this.Ea && (a.Ea = this.Ea);
  this.Z && (a.Z = this.Z);
  this.g && (a.g = this.g.N());
  return a
};
function Md(a, b) {
  var c = "" + b;
  a.U && (c = c.toLowerCase());
  return c
}
q.Oa = function(a) {
  a && !this.U && (W(this), Nd(this), pc(this.g, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.U = a
};
q.extend = function(a) {
  for(var b = 0;b < arguments.length;b++) {
    pc(arguments[b], function(a, b) {
      this.add(b, a)
    }, this)
  }
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
Pd.prototype.G = function(a) {
  return a instanceof Pd && this.Ca == a.Ca && this.ya.join(",") == a.ya
};
Pd.prototype.w = function(a, b) {
  a.push("new SACK(", "" + this.Ca, ", ");
  O(this.ya, a, b);
  a.push(")")
};
function Qd() {
  this.J = new Q
}
q = Qd.prototype;
q.ra = -1;
q.D = 0;
q.append = function(a) {
  var b = Od(a);
  this.J.set(this.ra + 1, [a, b]);
  this.ra += 1;
  this.D += b
};
q.extend = function(a) {
  for(var b = 0;b < a.length;b++) {
    this.append(a[b])
  }
};
q.w = function(a) {
  a.push("<Queue with ", "" + this.J.H(), " item(s), counter=#", "" + this.ra, ", size=", "" + this.D, ">")
};
function Rd(a) {
  a = a.J.aa();
  mb(a);
  return a
}
function Sd() {
  this.qa = new Q
}
Sd.prototype.wa = -1;
Sd.prototype.D = 0;
function Td(a) {
  var b = a.qa.aa();
  mb(b);
  return new Pd(a.wa, b)
}
var Ud = {};
function Vd(a, b) {
  switch(t(b)) {
    case "string":
      a.push("<string>", D(b), "</string>");
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
          Object.prototype.hasOwnProperty.call(b, c) && "function" != t(b[c]) && (a.push('<property id="', D(c), '">'), Vd(a, b[c]), a.push("</property>"))
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
  this.ke = a;
  this.h = []
}
B(ge, J);
var he = [];
ge.prototype.rc = function() {
  db(this.h, Ab);
  this.h.length = 0
};
ge.prototype.d = function() {
  ge.n.d.call(this);
  this.rc()
};
ge.prototype.handleEvent = function() {
  g(Error("EventHandler.handleEvent not implemented"))
};
function ie() {
}
(function(a) {
  a.Xc = function() {
    return a.ne || (a.ne = new a)
  }
})(ie);
ie.prototype.te = 0;
ie.Xc();
function je(a) {
  this.nb = a || Jc()
}
B(je, Gb);
q = je.prototype;
q.me = ie.Xc();
q.T = k;
q.va = m;
q.i = k;
q.t = k;
q.ea = k;
q.Ta = k;
q.Ke = m;
function ke(a) {
  return a.T || (a.T = ":" + (a.me.te++).toString(36))
}
q.ta = o("i");
q.getParent = o("t");
q.uc = function(a) {
  this.t && this.t != a && g(Error("Method not supported"));
  je.n.uc.call(this, a)
};
q.Wc = o("nb");
q.Ua = function() {
  this.i = this.nb.createElement("div")
};
function le(a, b) {
  a.va && g(Error("Component already rendered"));
  a.i || a.Ua();
  b ? b.insertBefore(a.i, k) : a.nb.fa.body.appendChild(a.i);
  (!a.t || a.t.va) && a.ob()
}
q.ob = function() {
  this.va = j;
  me(this, function(a) {
    !a.va && a.ta() && a.ob()
  })
};
function ne(a) {
  me(a, function(a) {
    a.va && ne(a)
  });
  a.ub && a.ub.rc();
  a.va = m
}
q.d = function() {
  je.n.d.call(this);
  this.va && ne(this);
  this.ub && (this.ub.b(), delete this.ub);
  me(this, function(a) {
    a.b()
  });
  !this.Ke && this.i && Tc(this.i);
  this.t = this.i = this.Ta = this.ea = k
};
function me(a, b) {
  a.ea && db(a.ea, b, i)
}
q.removeChild = function(a, b) {
  if(a) {
    var c = x(a) ? a : ke(a), a = this.Ta && c ? (c in this.Ta ? this.Ta[c] : i) || k : k;
    if(c && a) {
      var d = this.Ta;
      c in d && delete d[c];
      hb(this.ea, a);
      b && (ne(a), a.i && Tc(a.i));
      c = a;
      c == k && g(Error("Unable to set parent component"));
      c.t = k;
      je.n.uc.call(c, k)
    }
  }
  a || g(Error("Child is not in parent component"));
  return a
};
function oe(a, b) {
  this.nb = b || Jc();
  this.ge = a;
  this.Zb = new ge(this);
  this.rb = new Q
}
B(oe, je);
q = oe.prototype;
q.a = U("goog.ui.media.FlashObject");
q.Me = "window";
q.Ic = "#000000";
q.Qd = "sameDomain";
function pe(a, b, c) {
  a.Gc = x(b) ? b : Math.round(b) + "px";
  a.ec = x(c) ? c : Math.round(c) + "px";
  a.ta() && (b = a.ta() ? a.ta().firstChild : k, c = a.ec, c == i && g(Error("missing height argument")), b.style.width = Uc(a.Gc), b.style.height = Uc(c))
}
q.ob = function() {
  oe.n.ob.call(this);
  var a = this.ta(), b;
  b = F ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = F ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = oa(c, this.Me), d = this.rb.aa(), e = this.rb.I(), f = [], h = 0;h < d.length;h++) {
    var l = qa(d[h]), n = qa(e[h]);
    f.push(l + "=" + n)
  }
  b = oa(b, ke(this), ke(this), "goog-ui-media-flash-object", D(this.ge), D(f.join("&")), this.Ic, this.Qd, c);
  a.innerHTML = b;
  this.Gc && this.ec && pe(this, this.Gc, this.ec);
  a = this.Zb;
  b = this.ta();
  c = Ya(ob);
  u(c) || (he[0] = c, c = he);
  for(d = 0;d < c.length;d++) {
    a.h.push(vb(b, c[d], qb || a, m, a.ke || a))
  }
};
q.Ua = function() {
  this.Bd != k && !(0 <= ya(fe, this.Bd)) && (this.a.A("Required flash version not found:" + this.Bd), g(Error("Method not supported")));
  var a = this.Wc().createElement("div");
  a.className = "goog-ui-media-flash";
  this.i = a
};
q.d = function() {
  oe.n.d.call(this);
  this.rb = k;
  this.Zb.b();
  this.Zb = k
};
function qe(a) {
  C.call(this, a)
}
B(qe, C);
qe.prototype.name = "cw.loadflash.FlashLoadFailed";
s.__loadFlashObject_callbacks = {};
function re(a, b, c) {
  function d() {
    e && delete s.__loadFlashObject_callbacks[e]
  }
  var e;
  if(Ka && !H("1.8.1.20")) {
    return Ub(new qe("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(0 <= ya(fe, "9"))) {
    return Ub(new qe("Need Flash Player 9+; had " + (fe ? fe : "none")))
  }
  var f;
  e = "_" + gc();
  var h = new N(d);
  s.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      Nb(h, Lc(f))
    }, 0)
  };
  b.rb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  f = ke(b);
  le(b, c);
  return h
}
function se(a, b, c) {
  var d = re(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  Rb(d, function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function te(a, b) {
  this.T = "_" + gc();
  this.Kb = a;
  this.ka = b;
  this.pa = a.pa
}
B(te, J);
q = te.prototype;
q.Ka = j;
q.Vb = m;
q.a = U("cw.net.FlashSocket");
q.w = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.T);
  a.push("'>")
};
function ue(a, b, c) {
  "frames" == b ? (a = a.ka, ve(a.u), we(a.u, c)) : "stillreceiving" == b ? (c = a.ka, c.a.p("onstillreceiving"), ve(c.u)) : "connect" == b ? (c = a.ka, c.a.info("onconnect"), ve(c.u), a = c.Ra, c.Ra = k, a.length && (c.a.p("onconnect: Writing " + a.length + " buffered frame(s)."), c.Hb.kb(a))) : "close" == b ? (a.Ka = m, a.b()) : "ioerror" == b ? (a.Ka = m, b = a.ka, b.a.A("onioerror: " + P(c)), xe(b.u, m), a.b()) : "securityerror" == b ? (a.Ka = m, b = a.ka, b.a.A("onsecurityerror: " + P(c)), xe(b.u, 
  m), a.b()) : g(Error("bad event: " + b))
}
function ze(a) {
  a.Vb = j;
  a.Ka = m;
  a.b()
}
q.Sb = function(a, b) {
  try {
    var c = this.pa.CallFunction(Wd("__FC_connect", this.T, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.C("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), ze(this)
  }
  '"OK"' != c && g(Error("__FC_connect failed? ret: " + c))
};
q.kb = function(a) {
  try {
    var b = this.pa.CallFunction(Wd("__FC_writeFrames", this.T, a))
  }catch(c) {
    return this.a.C("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), ze(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.A("Flash no longer knows of " + this.T + "; disposing."), this.b()) : g(Error("__FC_writeFrames failed? ret: " + b)))
};
q.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Ka);
  te.n.d.call(this);
  var a = this.pa;
  delete this.pa;
  if(this.Ka) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(Wd("__FC_close", this.T)))
    }catch(b) {
      this.a.C("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.Vb = j
    }
  }
  if(this.Vb) {
    a = this.ka, a.a.A("oncrash"), xe(a.u, j)
  }else {
    this.ka.onclose()
  }
  delete this.ka;
  delete this.Kb.Ga[this.T]
};
function Ae(a, b) {
  this.s = a;
  this.pa = b;
  this.Ga = {};
  this.Rb = "__FST_" + gc();
  s[this.Rb] = y(this.be, this);
  var c = b.CallFunction(Wd("__FC_setCallbackFunc", this.Rb));
  '"OK"' != c && g(Error("__FC_setCallbackFunc failed? ret: " + c))
}
B(Ae, J);
q = Ae.prototype;
q.a = U("cw.net.FlashSocketTracker");
q.w = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  O(this.Ga, a, b);
  a.push(">")
};
q.Wb = function(a) {
  a = new te(this, a);
  return this.Ga[a.T] = a
};
q.$d = function(a, b, c, d) {
  var e = this.Ga[a];
  e ? "frames" == b && d ? (ue(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : ue(e, b, c) : this.a.A("Cannot dispatch because we have no instance: " + P([a, b, c, d]))
};
q.be = function(a, b, c, d) {
  try {
    Wb(this.s, this.$d, this, [a, b, c, d])
  }catch(e) {
    s.window.setTimeout(function() {
      g(e)
    }, 0)
  }
};
q.d = function() {
  Ae.n.d.call(this);
  for(var a = Ya(this.Ga);a.length;) {
    a.pop().b()
  }
  delete this.Ga;
  delete this.pa;
  s[this.Rb] = i
};
function Be(a) {
  this.u = a;
  this.Ra = []
}
B(Be, J);
q = Be.prototype;
q.a = U("cw.net.FlashSocketConduit");
q.kb = function(a) {
  this.Ra ? (this.a.p("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.Ra.push.apply(this.Ra, a)) : (this.a.p("writeFrames: Writing " + a.length + " frame(s)."), this.Hb.kb(a))
};
q.Sb = function(a, b) {
  this.Hb.Sb(a, b)
};
q.onclose = function() {
  this.a.info("onclose");
  xe(this.u, m)
};
q.d = function() {
  this.a.info("in disposeInternal.");
  Be.n.d.call(this);
  this.Hb.b();
  delete this.u
};
var Ce = [];
function De() {
  var a = new N;
  Ce.push(a);
  return a
}
function Ee(a) {
  var b = Ce;
  Ce = [];
  db(b, function(b) {
    Nb(b, a)
  })
}
function Fe(a, b) {
  if(Ce.length) {
    return De()
  }
  var c = new oe(b + "FlashConnector.swf?cb=" + Ge);
  c.Ic = "#777777";
  pe(c, 300, 30);
  var d = Lc("minerva-elements");
  d || g(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = Lc("minerva-elements-FlashConnectorSwf");
  e || (e = Pc("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  yc = se(a.B, c, e);
  Ob(yc, Ee);
  return De()
}
;function He() {
  var a = Math.pow(10, 9);
  return a + Math.random() * (Math.pow(10, 10) - a)
}
;function X(a) {
  C.call(this, a)
}
B(X, C);
X.prototype.name = "cw.net.InvalidFrame";
function Y() {
  var a = [];
  this.P(a);
  return a.join("")
}
function Ie() {
}
Ie.prototype.G = function(a, b) {
  return!(a instanceof Ie) ? m : xc(Je(this), Je(a), b)
};
Ie.prototype.w = function(a, b) {
  a.push("<HelloFrame properties=");
  O(Je(this), a, b);
  a.push(">")
};
function Je(a) {
  return[a.Pa, a.vd, a.bd, a.Ad, a.hb, a.yc, a.pd, a.nd, a.mc, a.ld, a.Ld, a.Id, a.na, a.xb]
}
Ie.prototype.F = Y;
Ie.prototype.P = function(a) {
  var b = {};
  b.tnum = this.Pa;
  b.ver = this.vd;
  b.format = this.bd;
  b["new"] = this.Ad;
  b.id = this.hb;
  b.ming = this.yc;
  b.pad = this.pd;
  b.maxb = this.nd;
  this.mc !== i && (b.maxt = this.mc);
  b.maxia = this.ld;
  b.tcpack = this.Ld;
  b.eeds = this.Id;
  b.sack = this.na instanceof Pd ? hc((new Ke(this.na)).F()) : this.na;
  b.seenack = this.xb instanceof Pd ? hc((new Ke(this.xb)).F()) : this.xb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push($b(b), "H")
};
function Le(a) {
  R.call(this, "StringFrame", [a]);
  this.Ac = a
}
B(Le, R);
Le.prototype.F = Y;
Le.prototype.P = function(a) {
  a.push(this.Ac, " ")
};
function Me(a) {
  R.call(this, "CommentFrame", [a]);
  this.Vd = a
}
B(Me, R);
Me.prototype.F = Y;
Me.prototype.P = function(a) {
  a.push(this.Vd, "^")
};
function Ne(a) {
  R.call(this, "SeqNumFrame", [a]);
  this.Fd = a
}
B(Ne, R);
Ne.prototype.F = Y;
Ne.prototype.P = function(a) {
  a.push("" + this.Fd, "N")
};
function Oe(a) {
  var b = a.split("|");
  if(2 != b.length) {
    return k
  }
  a: {
    var c = b[1], a = lc;
    if(jc.test(c) && (c = parseInt(c, 10), -1 <= c && c <= a)) {
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
      var f = kc(b[d]);
      if(f == k) {
        return k
      }
      c.push(f)
    }
  }
  return new Pd(a, c)
}
function Ke(a) {
  R.call(this, "SackFrame", [a]);
  this.na = a
}
B(Ke, R);
Ke.prototype.F = Y;
Ke.prototype.P = function(a) {
  var b = this.na;
  a.push(b.ya.join(","), "|", "" + b.Ca);
  a.push("A")
};
function Pe(a) {
  R.call(this, "StreamStatusFrame", [a]);
  this.gd = a
}
B(Pe, R);
Pe.prototype.F = Y;
Pe.prototype.P = function(a) {
  var b = this.gd;
  a.push(b.ya.join(","), "|", "" + b.Ca);
  a.push("T")
};
function Qe() {
  R.call(this, "StreamCreatedFrame", [])
}
B(Qe, R);
Qe.prototype.F = Y;
Qe.prototype.P = function(a) {
  a.push("C")
};
function Re() {
  R.call(this, "YouCloseItFrame", [])
}
B(Re, R);
Re.prototype.F = Y;
Re.prototype.P = function(a) {
  a.push("Y")
};
function Se(a, b) {
  R.call(this, "ResetFrame", [a, b]);
  this.yd = a;
  this.Hc = b
}
B(Se, R);
Se.prototype.F = Y;
Se.prototype.P = function(a) {
  a.push(this.yd, "|", "" + Number(this.Hc), "!")
};
var Te = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Ue(a) {
  R.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
B(Ue, R);
Ue.prototype.F = Y;
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
    return a = Oe(hc(a)), a == k && g(new X("bad sack")), new Ke(a)
  }
  if("N" == b) {
    return a = kc(hc(a)), a == k && g(new X("bad seqNum")), new Ne(a)
  }
  if("T" == b) {
    return a = Oe(hc(a)), a == k && g(new X("bad lastSackSeen")), new Pe(a)
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
  this.qb = b;
  this.zc = c;
  this.he = d
}
We.prototype.w = function(a, b) {
  a.push("<XDRFrame frameId=");
  O(this.he, a, b);
  a.push(", expandedUrl=");
  O(this.qb, a, b);
  a.push(", streams=");
  O(this.zc, a, b);
  a.push(">")
};
function Xe() {
  this.frames = [];
  this.kc = new Q
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
    if(f = 0 == e.zc.length) {
      f = e.qb;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      f = RegExp("^" + h + "$").test(f)
    }
    if(f) {
      return c.a.info("Giving " + P(b) + " existing frame " + P(e)), Tb(e)
    }
  }
  d = gc() + gc();
  e = Ye(a);
  f = s.location;
  f instanceof td || (f = Jd(f));
  e instanceof td || (e = Jd(e));
  var l = f;
  f = l.N();
  (h = !!e.W) ? ud(f, e.W) : h = !!e.Ba;
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
          for(var l = 0 == n.lastIndexOf("/", 0), n = n.split("/"), r = [], E = 0;E < n.length;) {
            var p = n[E++];
            "." == p ? l && E == n.length && r.push("") : ".." == p ? ((1 < r.length || 1 == r.length && "" != r[0]) && r.pop(), l && E == n.length && r.push("")) : (r.push(p), l = j)
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
  f == h ? (c.a.info("No need to make a real XDRFrame for " + P(b)), c = Tb(new We(s, e, [b], k))) : ((f = Lc("minerva-elements")) || g(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new N, c.kc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + P(d) + "for " + P(b)), c = Pc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), f.appendChild(c), c = h);
  return c
}
Xe.prototype.Oe = function(a) {
  var b = this.kc.get(a);
  b || g(Error("Unknown frameId " + P(a)));
  this.kc.remove(b);
  var c = b[0], a = new We(Lc("minerva-xdrframe-" + a).contentWindow || (Lc("minerva-xdrframe-" + a).contentDocument || Lc("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Lc("minerva-xdrframe-" + a).contentDocument || Lc("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  Nb(c, a)
};
var $e = new Xe;
s.__XHRTracker_xdrFrameLoaded = y($e.Oe, $e);
var af;
af = m;
var bf = Ga();
bf && (-1 != bf.indexOf("Firefox") || -1 != bf.indexOf("Camino") || -1 != bf.indexOf("iPhone") || -1 != bf.indexOf("iPod") || -1 != bf.indexOf("iPad") || -1 != bf.indexOf("Android") || -1 != bf.indexOf("Chrome") && (af = j));
var cf = af;
var Ge = "4bdfc178fc0e508c0cd5efc3fdb09920";
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function df(a, b, c, d, e, f) {
  N.call(this, e, f);
  this.kd = a;
  this.Xb = [];
  this.Uc = !!b;
  this.fe = !!c;
  this.Xd = !!d;
  for(b = 0;b < a.length;b++) {
    Pb(a[b], y(this.$c, this, b, j), y(this.$c, this, b, m))
  }
  0 == a.length && !this.Uc && Nb(this, this.Xb)
}
B(df, N);
df.prototype.rd = 0;
df.prototype.$c = function(a, b, c) {
  this.rd++;
  this.Xb[a] = [b, c];
  this.ga || (this.Uc && b ? Nb(this, [a, c]) : this.fe && !b ? this.Va(c) : this.rd == this.kd.length && Nb(this, this.Xb));
  this.Xd && !b && (c = k);
  return c
};
df.prototype.Va = function(a) {
  df.n.Va.call(this, a);
  db(this.kd, function(a) {
    a.cancel()
  })
};
function ef(a) {
  a = new df(a, m, j);
  Ob(a, function(a) {
    return eb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function ff(a, b) {
  this.Ne = a;
  this.md = b
}
ff.prototype.ic = 0;
ff.prototype.Ab = 0;
ff.prototype.bc = m;
function gf(a) {
  var b = [];
  if(a.bc) {
    return[b, 2]
  }
  var c = a.ic, d = a.Ne.responseText;
  for(a.ic = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var e = d.substr(a.Ab, c - a.Ab), e = e.replace(/\r$/, "");
    if(e.length > a.md) {
      return a.bc = j, [b, 2]
    }
    b.push(e);
    a.Ab = c += 1
  }
  return a.ic - a.Ab - 1 > a.md ? (a.bc = j, [b, 2]) : [b, 1]
}
;function hf(a, b, c) {
  this.u = b;
  this.Q = a;
  this.Ub = c
}
B(hf, J);
q = hf.prototype;
q.a = U("cw.net.XHRMaster");
q.ma = -1;
q.lc = function(a, b, c) {
  this.Ub.__XHRSlave_makeRequest(this.Q, a, b, c)
};
q.ha = o("ma");
q.oc = function(a, b) {
  1 != b && this.a.C(P(this.Q) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  ve(this.u);
  we(this.u, a)
};
q.pc = function(a) {
  this.a.k("ongotheaders_: " + P(a));
  var b = k;
  "Content-Length" in a && (b = kc(a["Content-Length"]));
  a = this.u;
  a.a.k(a.l() + " got Content-Length: " + b);
  a.X == jf && (b == k && (a.a.A("Expected to receive a valid Content-Length, but did not."), b = 5E5), kf(a, 2E3 + 1E3 * (b / 3072)))
};
q.qc = function(a) {
  1 != a && this.a.k(this.u.l() + "'s XHR's readyState is " + a);
  this.ma = a;
  2 <= this.ma && ve(this.u)
};
q.nc = function() {
  this.u.b()
};
q.d = function() {
  hf.n.d.call(this);
  delete Z.ba[this.Q];
  this.Ub.__XHRSlave_dispose(this.Q);
  delete this.Ub
};
function lf() {
  this.ba = {}
}
B(lf, J);
q = lf.prototype;
q.a = U("cw.net.XHRMasterTracker");
q.Wb = function(a, b) {
  var c = "_" + gc(), d = new hf(c, a, b);
  return this.ba[c] = d
};
q.oc = function(a, b, c) {
  if(Ka) {
    for(var d = [], e = 0, f = b.length;e < f;e++) {
      d[e] = b[e]
    }
    b = d
  }else {
    b = ib(b)
  }
  (d = this.ba[a]) ? d.oc(b, c) : this.a.C("onframes_: no master for " + P(a))
};
q.pc = function(a, b) {
  var c = this.ba[a];
  c ? c.pc(b) : this.a.C("ongotheaders_: no master for " + P(a))
};
q.qc = function(a, b) {
  var c = this.ba[a];
  c ? c.qc(b) : this.a.C("onreadystatechange_: no master for " + P(a))
};
q.nc = function(a) {
  var b = this.ba[a];
  b ? (delete this.ba[b.Q], b.nc()) : this.a.C("oncomplete_: no master for " + P(a))
};
q.d = function() {
  lf.n.d.call(this);
  for(var a = Ya(this.ba);a.length;) {
    a.pop().b()
  }
  delete this.ba
};
var Z = new lf;
s.__XHRMaster_onframes = y(Z.oc, Z);
s.__XHRMaster_oncomplete = y(Z.nc, Z);
s.__XHRMaster_ongotheaders = y(Z.pc, Z);
s.__XHRMaster_onreadystatechange = y(Z.qc, Z);
function mf(a, b, c) {
  this.V = a;
  this.host = b;
  this.port = c
}
function nf(a, b, c) {
  this.host = a;
  this.port = b;
  this.Ie = c
}
function of(a, b) {
  b || (b = a);
  this.V = a;
  this.oa = b
}
of.prototype.w = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  O(this.V, a, b);
  a.push(", secondaryUrl=");
  O(this.oa, a, b);
  a.push(">")
};
function pf(a, b, c, d) {
  this.V = a;
  this.ud = b;
  this.oa = c;
  this.Ed = d;
  (!(0 == this.V.indexOf("http://") || 0 == this.V.indexOf("https://")) || !(0 == this.oa.indexOf("http://") || 0 == this.oa.indexOf("https://"))) && g(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.ud.location.href;
  sd(this.V, a) || g(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.Ed.location.href;
  sd(this.oa, a) || g(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
pf.prototype.w = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  O(this.V, a, b);
  a.push(", secondaryUrl=");
  O(this.oa, a, b);
  a.push(">")
};
var qf = new Me(";)]}");
(function() {
}).prototype.a = U("cw.net.QANProtocolWrapper");
function rf(a) {
  this.Fe = a
}
rf.prototype.w = function(a, b) {
  a.push("<UserContext for ");
  O(this.Fe, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.o = a;
  this.s = c ? c : Xb;
  this.ib = new Wc;
  this.hb = gc() + gc();
  this.la = new Qd;
  this.hc = new Sd;
  this.jb = k;
  this.Lb = [];
  this.Aa = new rf(this);
  G && (this.jb = yb(s, "load", this.ye, m, this))
}
B($, J);
q = $.prototype;
q.a = U("cw.net.ClientStream");
q.hd = new Pd(-1, []);
q.jd = new Pd(-1, []);
q.maxUndeliveredStrings = 50;
q.maxUndeliveredBytes = 1048576;
q.onstring = k;
q.onreset = k;
q.ondisconnect = k;
q.wc = m;
q.sc = m;
q.v = 1;
q.Cc = -1;
q.e = k;
q.q = k;
q.cb = k;
q.xc = 0;
q.td = 0;
q.Dd = 0;
q.w = function(a, b) {
  a.push("<ClientStream id=");
  O(this.hb, a, b);
  a.push(", state=", "" + this.v);
  a.push(", primary=");
  O(this.e, a, b);
  a.push(", secondary=");
  O(this.q, a, b);
  a.push(", resetting=");
  O(this.cb, a, b);
  a.push(">")
};
q.je = o("Aa");
q.Rd = function(a) {
  this.onstring = y(a.stringReceived, a);
  this.onreset = y(a.streamReset, a)
};
function sf(a) {
  var b = [-1];
  a.e && b.push(a.e.La);
  a.q && b.push(a.q.La);
  return Math.max.apply(Math.max, b)
}
function tf(a) {
  if(!(3 > a.v)) {
    var b = 0 != a.la.J.H(), c = Td(a.hc), d = !c.G(a.jd) && !(a.e && c.G(a.e.Ia) || a.q && c.G(a.q.Ia)), e = sf(a);
    if((b = b && e < a.la.ra) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.Sa ? (a.a.p("tryToSend_: writing " + f + " to primary"), d && (d = a.e, c != d.Ia && (!d.ca && !d.r.length && uf(d), d.r.push(new Ke(c)), d.Ia = c)), b && vf(a.e, a.la, e + 1), a.e.$()) : a.q == k ? a.wc ? (a.a.p("tryToSend_: creating secondary to send " + f), a.q = wf(a, m), b && vf(a.q, a.la, e + 1), a.q.$()) : (a.a.p("tryToSend_: not creating a secondary because stream might not exist on server"), a.sc = j) : a.a.p("tryToSend_: need to send " + f + ", but can't right now")
    }
  }
}
q.ye = function() {
  this.jb = k;
  if(this.e && this.e.Ha()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.Nb = j;
    a.b()
  }
  this.q && this.q.Ha() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.q, a.Nb = j, a.b())
};
q.ze = function(a, b) {
  b !== i || (b = j);
  3 < this.v && g(Error("sendStrings: Can't send strings in state " + this.v));
  if(a.length) {
    if(b) {
      for(var c = 0;c < a.length;c++) {
        var d = a[c];
        /^([ -~]*)$/.test(d) || g(Error("sendStrings: string #" + c + " has illegal chars: " + P(d)))
      }
    }
    this.la.extend(a);
    tf(this)
  }
};
function wf(a, b) {
  var c;
  a.o instanceof pf ? c = jf : a.o instanceof nf ? c = xf : g(Error("Don't support endpoint " + P(a.o)));
  a.Cc += 1;
  c = new yf(a.s, a, a.Cc, c, a.o, b);
  a.a.p("Created: " + c.l());
  a.ib.add(c);
  return c
}
function zf(a, b, c) {
  var d = new Af(a.s, a, b, c);
  a.a.p("Created: " + d.l() + ", delay=" + b + ", times=" + c);
  a.ib.add(d);
  return d
}
function Bf(a, b) {
  a.ib.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  a.a.k("Offline: " + b.l());
  a.xc = b.ia ? a.xc + b.ia : 0;
  1 <= a.xc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.Aa, "stream penalty reached limit", m), a.b());
  if(3 < a.v) {
    4 == a.v && b.Md ? (a.a.k("Disposing because resettingTransport_ is done."), a.b()) : a.a.k("Not creating a transport because ClientStream is in state " + a.v)
  }else {
    var c;
    var d;
    c = b instanceof Af;
    if(!c && b.Nb) {
      var e = G ? cf ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      a.a.p("getDelayForNextTransport_: " + P({delay:c, times:d}))
    }else {
      if(d = b.Kc(), b == a.e ? d ? e = ++a.td : c || (e = a.td = 0) : d ? e = ++a.Dd : c || (e = a.Dd = 0), c || !e) {
        d = c = 0, a.a.p("getDelayForNextTransport_: " + P({count:e, delay:c, times:d}))
      }else {
        var f = 2E3 * Math.min(e, 3), h = Math.floor(4E3 * Math.random()) - 2E3, l = Math.max(0, b.Kd - b.Dc);
        d = (c = Math.max(0, f + h - l)) ? 1 : 0;
        a.a.p("getDelayForNextTransport_: " + P({count:e, base:f, variance:h, oldDuration:l, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    b == a.e ? (a.e = k, c ? a.e = zf(a, e, c) : (e = sf(a), a.e = wf(a, j), vf(a.e, a.la, e + 1)), a.e.$()) : b == a.q && (a.q = k, c ? (a.q = zf(a, e, c), a.q.$()) : tf(a))
  }
}
q.reset = function(a) {
  3 < this.v && g(Error("reset: Can't send reset in state " + this.v));
  this.v = 4;
  this.e && this.e.Sa ? (this.a.info("reset: Sending ResetFrame over existing primary."), Cf(this.e, a), this.e.$()) : (this.e && (this.a.k("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.q && (this.a.k("reset: Disposing secondary before sending ResetFrame."), this.q.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.cb = wf(this, m), Cf(this.cb, a), this.cb.$());
  this.onreset && this.onreset.call(this.Aa, a, j)
};
function Df(a, b, c, d) {
  var e;
  e = a.hc;
  for(var f = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], n = m, r = 0, E = c.length;r < E;r++) {
    var p = c[r], v = p[0], p = p[1];
    if(v == e.wa + 1) {
      e.wa += 1;
      for(l.push(p);;) {
        v = e.wa + 1;
        p = e.qa.get(v, Ud);
        if(p === Ud) {
          break
        }
        l.push(p[0]);
        e.qa.remove(v);
        e.D -= p[1];
        e.wa = v
      }
    }else {
      if(!(v <= e.wa)) {
        if(f != k && e.qa.H() >= f) {
          n = j;
          break
        }
        var A = Od(p);
        if(h != k && e.D + A > h) {
          n = j;
          break
        }
        e.qa.set(v, [p, A]);
        e.D += A
      }
    }
  }
  e.qa.Za() && e.qa.clear();
  e = [l, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(f = 0;f < c.length;f++) {
      if(h = c[f], a.onstring && a.onstring.call(a.Aa, h), 4 == a.v || a.Y) {
        return
      }
    }
  }
  d || tf(a);
  if(!(4 == a.v || a.Y) && e) {
    b.a.C(b.l() + "'s peer caused rwin overflow."), b.b()
  }
}
q.Rc = function(a) {
  this.a.C("Failed to start " + P(this) + "; error was " + P(a.message));
  this.b()
};
q.start = function() {
  this.onmessage && g(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  1 != this.v && g(Error("ClientStream.start: " + P(this) + " already started"));
  this.v = 2;
  if(this.o instanceof of) {
    var a = Ze(this.o.V, this), b = Ze(this.o.oa, this), a = ef([a, b]);
    Ob(a, y(this.de, this));
    Qb(a, y(this.Rc, this))
  }else {
    if(this.o instanceof mf) {
      if(zc) {
        this.Tc()
      }else {
        var a = Fe(this.s, this.o.V), c = this;
        Ob(a, function(a) {
          zc || (zc = new Ae(c.s, a));
          return k
        });
        Ob(a, y(this.Tc, this));
        Qb(a, y(this.Rc, this))
      }
    }else {
      Ef(this)
    }
  }
};
q.de = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].qb, e = a[1].qb;
  this.Lb.push(a[0]);
  this.Lb.push(a[1]);
  this.o = new pf(d, b, e, c);
  Ef(this)
};
q.Tc = function() {
  this.o = new nf(this.o.host, this.o.port, zc);
  Ef(this)
};
function Ef(a) {
  a.v = 3;
  a.e = wf(a, j);
  vf(a.e, a.la, k);
  a.e.$()
}
q.d = function() {
  this.a.info(P(this) + " in disposeInternal.");
  this.v = 5;
  for(var a = this.ib.I(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Lb.length;a++) {
    hb(this.Lb[a].zc, this)
  }
  G && this.jb && (Ab(this.jb), this.jb = k);
  this.ondisconnect && this.ondisconnect.call(this.Aa);
  delete this.ib;
  delete this.e;
  delete this.q;
  delete this.cb;
  delete this.Aa;
  $.n.d.call(this)
};
var jf = 1, xf = 3;
function yf(a, b, c, d, e, f) {
  this.s = a;
  this.z = b;
  this.Pa = c;
  this.X = d;
  this.o = e;
  this.r = [];
  this.Da = f;
  this.Sa = !this.Ha();
  this.Na = this.X != jf;
  this.Sd = y(this.Ge, this)
}
B(yf, J);
q = yf.prototype;
q.a = U("cw.net.ClientTransport");
q.j = k;
q.Dc = k;
q.Kd = k;
q.Eb = k;
q.ca = m;
q.Ib = m;
q.Ia = k;
q.sb = 0;
q.La = -1;
q.Cb = -1;
q.Md = m;
q.Nb = m;
q.ia = 0;
q.Ya = m;
q.w = function(a) {
  a.push("<ClientTransport #", "" + this.Pa, ", becomePrimary=", "" + this.Da, ">")
};
q.l = function() {
  return(this.Da ? "Prim. T#" : "Sec. T#") + this.Pa
};
q.Kc = function() {
  return!(!this.Ya && this.sb)
};
q.Ha = function() {
  return this.X == jf || 2 == this.X
};
function Ff(a, b) {
  mb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Df(a.z, a, b, !a.Na)
}
function Gf(a, b, c) {
  try {
    var d = Ve(b);
    a.sb += 1;
    a.a.k(a.l() + " RECV " + P(d));
    var e;
    1 == a.sb && !d.G(qf) && a.Ha() ? (a.a.A(a.l() + " is closing soon because got bad preamble: " + P(d)), e = j) : e = m;
    if(e) {
      return j
    }
    if(d instanceof Le) {
      if(!/^([ -~]*)$/.test(d.Ac)) {
        return a.Ya = j
      }
      a.Cb += 1;
      c.push([a.Cb, d.Ac])
    }else {
      if(d instanceof Ke) {
        var f = a.z, h = d.na;
        f.hd = h;
        var l = f.la, n = h.Ca, c = m;
        n > l.ra && (c = j);
        for(var r = Rd(l).concat(), d = 0;d < r.length;d++) {
          var E = r[d];
          if(E > n) {
            break
          }
          var p = l.J.get(E)[1];
          l.J.remove(E);
          l.D -= p
        }
        for(d = 0;d < h.ya.length;d++) {
          var v = h.ya[d];
          v > l.ra && (c = j);
          l.J.S(v) && (p = l.J.get(v)[1], l.J.remove(v), l.D -= p)
        }
        l.J.Za() && l.J.clear();
        if(c) {
          return a.a.A(a.l() + " is closing soon because got bad SackFrame"), a.Ya = j
        }
      }else {
        if(d instanceof Ne) {
          a.Cb = d.Fd - 1
        }else {
          if(d instanceof Pe) {
            a.z.jd = d.gd
          }else {
            if(d instanceof Re) {
              return a.a.p(a.l() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof Ue) {
              return a.Ya = j, "stream_attach_failure" == d.reason ? a.ia += 1 : "acked_unsent_strings" == d.reason && (a.ia += 0.5), a.a.p(a.l() + " is closing soon because got " + P(d)), j
            }
            if(!(d instanceof Me)) {
              if(d instanceof Qe) {
                var A = a.z, Yf = !a.Na;
                A.a.p("Stream is now confirmed to exist at server.");
                A.wc = j;
                A.sc && !Yf && (A.sc = m, tf(A))
              }else {
                if(c.length) {
                  Ff(a, c);
                  if(!u(c)) {
                    for(var fd = c.length - 1;0 <= fd;fd--) {
                      delete c[fd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof Se) {
                  var cc = a.z;
                  cc.onreset && cc.onreset.call(cc.Aa, d.yd, d.Hc);
                  cc.b();
                  return j
                }
                g(Error(a.l() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(ye) {
    return ye instanceof X || g(ye), a.a.A(a.l() + " is closing soon because got InvalidFrame: " + P(b)), a.Ya = j
  }
  return m
}
function we(a, b) {
  a.Ib = j;
  try {
    for(var c = m, d = [], e = 0, f = b.length;e < f;e++) {
      if(a.Y) {
        a.a.info(a.l() + " returning from loop because we're disposed.");
        return
      }
      if(c = Gf(a, b[e], d)) {
        break
      }
    }
    d.length && Ff(a, d);
    a.Ib = m;
    a.r.length && a.$();
    c && (a.a.p(a.l() + " closeSoon is true.  Frames were: " + P(b)), a.b())
  }finally {
    a.Ib = m
  }
}
q.Ge = function() {
  this.a.A(this.l() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Hf(a) {
  a.Eb != k && (a.s.B.clearTimeout(a.Eb), a.Eb = k)
}
function kf(a, b) {
  Hf(a);
  b = Math.round(b);
  a.Eb = a.s.B.setTimeout(a.Sd, b);
  a.a.k(a.l() + "'s receive timeout set to " + b + " ms.")
}
function ve(a) {
  a.X != jf && (a.X == xf || 2 == a.X ? kf(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.X)))
}
function uf(a) {
  var b = new Ie;
  b.Pa = a.Pa;
  b.vd = 2;
  b.bd = 2;
  a.z.wc || (b.Ad = j);
  b.hb = a.z.hb;
  b.yc = a.Na;
  b.yc && (b.pd = 4096);
  b.nd = 3E5;
  b.ld = a.Na ? Math.floor(10) : 0;
  b.Ld = m;
  a.Da && (b.Id = k, b.mc = Math.floor((a.Na ? 358E4 : 25E3) / 1E3));
  b.na = Td(a.z.hc);
  b.xb = a.z.hd;
  a.r.push(b);
  a.Ia = b.na
}
function xe(a, b) {
  b && (a.ia += 0.5);
  a.b()
}
q.$ = function() {
  this.ca && !this.Sa && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.Ib) {
    this.a.p(this.l() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ca;
    this.ca = j;
    !a && !this.r.length && uf(this);
    for(a = 0;a < this.r.length;a++) {
      this.a.k(this.l() + " SEND " + P(this.r[a]))
    }
    if(this.Ha()) {
      for(var a = [], b = 0, c = this.r.length;b < c;b++) {
        this.r[b].P(a), a.push("\n")
      }
      this.r = [];
      a = a.join("");
      b = this.Da ? this.o.V : this.o.oa;
      this.j = Z.Wb(this, this.Da ? this.o.ud : this.o.Ed);
      this.Dc = this.s.B === Hb ? na() : this.s.B.getTime();
      this.j.lc(b, "POST", a);
      kf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.Na ? 0 : this.Da ? 25E3 : 0))
    }else {
      if(this.X == xf) {
        a = [];
        b = 0;
        for(c = this.r.length;b < c;b++) {
          a.push(this.r[b].F())
        }
        this.r = [];
        this.j ? this.j.kb(a) : (b = this.o, this.j = new Be(this), this.j.Hb = b.Ie.Wb(this.j), this.Dc = this.s.B === Hb ? na() : this.s.B.getTime(), this.j.Sb(b.host, b.port), this.j.Y || (this.j.kb(a), this.j.Y || kf(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.X))
      }
    }
  }
};
function vf(a, b, c) {
  !a.ca && !a.r.length && uf(a);
  for(var d = Math.max(c, a.La + 1), e = Rd(b), c = [], f = 0;f < e.length;f++) {
    var h = e[f];
    (d == k || h >= d) && c.push([h, b.J.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (-1 == a.La || a.La + 1 != e) && a.r.push(new Ne(e)), a.r.push(new Le(f)), a.La = e
  }
}
q.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  yf.n.d.call(this);
  this.Kd = this.s.B === Hb ? na() : this.s.B.getTime();
  this.r = [];
  Hf(this);
  this.j && this.j.b();
  var a = this.z;
  this.z = k;
  Bf(a, this)
};
function Cf(a, b) {
  !a.ca && !a.r.length && uf(a);
  a.r.push(new Se(b, j));
  a.Md = j
}
function Af(a, b, c, d) {
  this.s = a;
  this.z = b;
  this.Qc = c;
  this.Mc = d
}
B(Af, J);
q = Af.prototype;
q.ca = m;
q.Sa = m;
q.tb = k;
q.Ia = k;
q.a = U("cw.net.DoNothingTransport");
function If(a) {
  a.tb = a.s.B.setTimeout(function() {
    a.tb = k;
    a.Mc--;
    a.Mc ? If(a) : a.b()
  }, a.Qc)
}
q.$ = function() {
  this.ca && !this.Sa && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ca = j;
  If(this)
};
q.w = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.Qc, ">")
};
q.Ha = ba(m);
q.l = ba("Wast. T");
q.Kc = ba(m);
q.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Af.n.d.call(this);
  this.tb != k && this.s.B.clearTimeout(this.tb);
  var a = this.z;
  this.z = k;
  Bf(a, this)
};
function Jf() {
}
Jf.prototype.lb = k;
var Kf;
function Lf() {
}
B(Lf, Jf);
function Mf(a) {
  return(a = Nf(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Of(a) {
  var b = {};
  Nf(a) && (b[0] = j, b[1] = j);
  return b
}
Lf.prototype.fc = k;
function Nf(a) {
  if(!a.fc && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.fc = d
      }catch(e) {
      }
    }
    g(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.fc
}
Kf = new Lf;
function Pf(a) {
  this.headers = new Q;
  this.Qa = a || k
}
B(Pf, Gb);
Pf.prototype.a = U("goog.net.XhrIo");
var Qf = /^https?$/i;
q = Pf.prototype;
q.da = m;
q.f = k;
q.Mb = k;
q.jc = "";
q.fd = "";
q.$a = "";
q.Yb = m;
q.vb = m;
q.gc = m;
q.ua = m;
q.Jb = 0;
q.za = k;
q.Cd = "";
q.Le = m;
q.send = function(a, b, c, d) {
  this.f && g(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.jc = a;
  this.$a = "";
  this.fd = b;
  this.Yb = m;
  this.da = j;
  this.f = this.Qa ? Mf(this.Qa) : Mf(Kf);
  this.Mb = this.Qa ? this.Qa.lb || (this.Qa.lb = Of(this.Qa)) : Kf.lb || (Kf.lb = Of(Kf));
  this.f.onreadystatechange = y(this.sd, this);
  try {
    this.a.k(Rf(this, "Opening Xhr")), this.gc = j, this.f.open(b, a, j), this.gc = m
  }catch(e) {
    this.a.k(Rf(this, "Error opening Xhr: " + e.message));
    Sf(this, e);
    return
  }
  var a = c || "", f = this.headers.N();
  d && pc(d, function(a, b) {
    f.set(b, a)
  });
  "POST" == b && !f.S("Content-Type") && f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  pc(f, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.Cd && (this.f.responseType = this.Cd);
  "withCredentials" in this.f && (this.f.withCredentials = this.Le);
  try {
    this.za && (Hb.clearTimeout(this.za), this.za = k), 0 < this.Jb && (this.a.k(Rf(this, "Will abort after " + this.Jb + "ms if incomplete")), this.za = Hb.setTimeout(y(this.He, this), this.Jb)), this.a.k(Rf(this, "Sending request")), this.vb = j, this.f.send(a), this.vb = m
  }catch(h) {
    this.a.k(Rf(this, "Send error: " + h.message)), Sf(this, h)
  }
};
q.He = function() {
  "undefined" != typeof ca && this.f && (this.$a = "Timed out after " + this.Jb + "ms, aborting", this.a.k(Rf(this, this.$a)), this.dispatchEvent("timeout"), this.abort(8))
};
function Sf(a, b) {
  a.da = m;
  a.f && (a.ua = j, a.f.abort(), a.ua = m);
  a.$a = b;
  Tf(a);
  Uf(a)
}
function Tf(a) {
  a.Yb || (a.Yb = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
q.abort = function() {
  this.f && this.da && (this.a.k(Rf(this, "Aborting")), this.da = m, this.ua = j, this.f.abort(), this.ua = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Uf(this))
};
q.d = function() {
  this.f && (this.da && (this.da = m, this.ua = j, this.f.abort(), this.ua = m), Uf(this, j));
  Pf.n.d.call(this)
};
q.sd = function() {
  !this.gc && !this.vb && !this.ua ? this.ue() : Vf(this)
};
q.ue = function() {
  Vf(this)
};
function Vf(a) {
  if(a.da && "undefined" != typeof ca) {
    if(a.Mb[1] && 4 == a.ha() && 2 == Wf(a)) {
      a.a.k(Rf(a, "Local request error detected and ignored"))
    }else {
      if(a.vb && 4 == a.ha()) {
        Hb.setTimeout(y(a.sd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.ha()) {
          a.a.k(Rf(a, "Request complete"));
          a.da = m;
          var b = Wf(a), c;
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
              b = ("" + a.jc).match(rd)[1] || k, !b && self.location && (b = self.location.protocol, b = b.substr(0, b.length - 1)), b = !Qf.test(b ? b.toLowerCase() : "")
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
            a.$a = d + " [" + Wf(a) + "]";
            Tf(a)
          }
          Uf(a)
        }
      }
    }
  }
}
function Uf(a, b) {
  if(a.f) {
    var c = a.f, d = a.Mb[0] ? ea : k;
    a.f = k;
    a.Mb = k;
    a.za && (Hb.clearTimeout(a.za), a.za = k);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(e) {
      a.a.C("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
}
q.ha = function() {
  return this.f ? this.f.readyState : 0
};
function Wf(a) {
  try {
    return 2 < a.ha() ? a.f.status : -1
  }catch(b) {
    return a.a.A("Can not get status: " + b.message), -1
  }
}
q.getResponseHeader = function(a) {
  return this.f && 4 == this.ha() ? this.f.getResponseHeader(a) : i
};
function Rf(a, b) {
  return b + " [" + a.fd + " " + a.jc + " " + Wf(a) + "]"
}
;var Xf = !(F || G && !H("420+"));
function Zf(a, b) {
  this.Kb = a;
  this.Q = b
}
B(Zf, J);
q = Zf.prototype;
q.j = k;
q.ma = -1;
q.Zc = m;
q.ad = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function $f(a) {
  var b = gf(a.Oc), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.Q, c, b), 1 != b && a.b()) : a.b()
}
q.le = function() {
  $f(this);
  if(!this.Y) {
    var a = s.parent;
    a && a.__XHRMaster_oncomplete(this.Q);
    this.b()
  }
};
q.we = function() {
  var a = s.parent;
  if(a) {
    this.ma = this.j.ha();
    if(2 <= this.ma && !this.Zc) {
      for(var b = new Q, c = this.ad.length;c--;) {
        var d = this.ad[c];
        try {
          b.set(d, this.j.f.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.H() && (this.Zc = j, a.__XHRMaster_ongotheaders(this.Q, uc(b)), this.Y)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.Q, this.ma);
    Xf && 3 == this.ma && $f(this)
  }else {
    this.b()
  }
};
q.lc = function(a, b, c) {
  this.j = new Pf;
  vb(this.j, "readystatechange", y(this.we, this));
  vb(this.j, "complete", y(this.le, this));
  this.j.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.Oc = new ff(this.j.f, 1048576)
};
q.d = function() {
  Zf.n.d.call(this);
  delete this.Oc;
  this.j && this.j.b();
  delete this.Kb.gb[this.Q];
  delete this.Kb
};
function ag() {
  this.gb = {}
}
B(ag, J);
ag.prototype.re = function(a, b, c, d) {
  var e = new Zf(this, a);
  this.gb[a] = e;
  e.lc(b, c, d)
};
ag.prototype.ae = function(a) {
  (a = this.gb[a]) && a.b()
};
ag.prototype.d = function() {
  ag.n.d.call(this);
  for(var a = Ya(this.gb);a.length;) {
    a.pop().b()
  }
  delete this.gb
};
var bg = new ag;
s.__XHRSlave_makeRequest = y(bg.re, bg);
s.__XHRSlave_dispose = y(bg.ae, bg);
var cg = U("cw.net.demo");
function dg(a, b, c, d) {
  a = new td(document.location);
  if(c) {
    return new mf(d, a.O, s.__demo_mainSocketPort)
  }
  b ? (b = s.__demo_shared_domain, x(b) || g(Error("domain was " + P(b) + "; expected a string.")), c = a.N(), wd(c, "_____random_____." + b)) : c = a.N();
  yd(c, d);
  zd(c, "", i);
  return new of(c.toString().replace("_____random_____", "%random%"))
}
;z("Minerva.HttpEndpoint", of);
z("Minerva.SocketEndpoint", mf);
z("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.je;
$.prototype.bindToProtocol = $.prototype.Rd;
$.prototype.start = $.prototype.start;
$.prototype.sendStrings = $.prototype.ze;
$.prototype.reset = $.prototype.reset;
z("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.tc;
S.prototype.shout = S.prototype.Be;
S.prototype.severe = S.prototype.C;
S.prototype.warning = S.prototype.A;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.Wd;
S.prototype.fine = S.prototype.k;
S.prototype.finer = S.prototype.ee;
S.prototype.finest = S.prototype.p;
T.OFF = ed;
T.SHOUT = gd;
T.SEVERE = hd;
T.WARNING = id;
T.INFO = jd;
T.CONFIG = kd;
T.FINE = ld;
T.FINER = md;
T.FINEST = nd;
T.ALL = od;
z("Minerva.LogManager", V);
V.getRoot = V.cc;
z("Minerva.DivConsole", qd);
qd.prototype.setCapturing = qd.prototype.Ae;
z("Minerva.bind", y);
z("Minerva.repr", P);
z("Minerva.theCallQueue", Xb);
z("Minerva.getEndpoint", dg);
z("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new td(document.location)).L;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !s.__demo_shared_domain) {
    cg.A("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return dg(0, a, b, "/_minerva/")
});
})();
