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
function w(a) {
  var b = t(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function ga(a) {
  return ha(a) && "function" == typeof a.getFullYear
}
function x(a) {
  return"string" == typeof a
}
function ia(a) {
  return"function" == t(a)
}
function ha(a) {
  var b = typeof a;
  return"object" == b && a != k || "function" == b
}
function ja(a) {
  return a[ka] || (a[ka] = ++la)
}
var ka = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), la = 0;
function ma(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function na(a, b, c) {
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
  y = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ma : na;
  return y.apply(k, arguments)
}
var oa = Date.now || function() {
  return+new Date
};
function z(a, b) {
  var c = a.split("."), d = s;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && fa(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
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
function pa(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
var qa = /^[a-zA-Z0-9\-_.!~*'()]*$/;
function ra(a) {
  a = "" + a;
  return!qa.test(a) ? encodeURIComponent(a) : a
}
function sa(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
}
function D(a) {
  if(!ta.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(ua, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(va, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(wa, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(xa, "&quot;"));
  return a
}
var ua = /&/g, va = /</g, wa = />/g, xa = /\"/g, ta = /[&<>\"]/;
function ya(a) {
  return sa(a.replace(/  /g, " &#160;"), i)
}
function za(a, b) {
  for(var c = 0, d = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = ("" + b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;0 == c && h < f;h++) {
    var l = d[h] || "", n = e[h] || "", r = RegExp("(\\d*)(\\D*)", "g"), E = RegExp("(\\d*)(\\D*)", "g");
    do {
      var p = r.exec(l) || ["", "", ""], u = E.exec(n) || ["", "", ""];
      if(0 == p[0].length && 0 == u[0].length) {
        break
      }
      c = ((0 == p[1].length ? 0 : parseInt(p[1], 10)) < (0 == u[1].length ? 0 : parseInt(u[1], 10)) ? -1 : (0 == p[1].length ? 0 : parseInt(p[1], 10)) > (0 == u[1].length ? 0 : parseInt(u[1], 10)) ? 1 : 0) || ((0 == p[2].length) < (0 == u[2].length) ? -1 : (0 == p[2].length) > (0 == u[2].length) ? 1 : 0) || (p[2] < u[2] ? -1 : p[2] > u[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
}
;function Aa(a, b) {
  b.unshift(a);
  C.call(this, pa.apply(k, b));
  b.shift()
}
B(Aa, C);
Aa.prototype.name = "AssertionError";
function Ba(a, b) {
  g(new Aa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;function Ca() {
  return j
}
;var Da, Ea, Fa, Ga;
function Ha() {
  return s.navigator ? s.navigator.userAgent : k
}
Ga = Fa = Ea = Da = m;
var Ia;
if(Ia = Ha()) {
  var Ja = s.navigator;
  Da = 0 == Ia.indexOf("Opera");
  Ea = !Da && -1 != Ia.indexOf("MSIE");
  Fa = !Da && -1 != Ia.indexOf("WebKit");
  Ga = !Da && !Fa && "Gecko" == Ja.product
}
var Ka = Da, F = Ea, La = Ga, G = Fa, Ma;
a: {
  var Na = "", Oa;
  if(Ka && s.opera) {
    var Pa = s.opera.version, Na = "function" == typeof Pa ? Pa() : Pa
  }else {
    if(La ? Oa = /rv\:([^\);]+)(\)|;)/ : F ? Oa = /MSIE\s+([^\);]+)(\)|;)/ : G && (Oa = /WebKit\/(\S+)/), Oa) {
      var Qa = Oa.exec(Ha()), Na = Qa ? Qa[1] : ""
    }
  }
  if(F) {
    var Ra, Sa = s.document;
    Ra = Sa ? Sa.documentMode : i;
    if(Ra > parseFloat(Na)) {
      Ma = "" + Ra;
      break a
    }
  }
  Ma = Na
}
var Ta = {};
function H(a) {
  return Ta[a] || (Ta[a] = 0 <= za(Ma, a))
}
var Ua = {};
function Va() {
  return Ua[9] || (Ua[9] = F && !!document.documentMode && 9 <= document.documentMode)
}
;function Wa() {
}
var Xa = 0;
q = Wa.prototype;
q.key = 0;
q.Ma = m;
q.Rb = m;
q.xb = function(a, b, c, d, e, f) {
  ia(a) ? this.fd = j : a && a.handleEvent && ia(a.handleEvent) ? this.fd = m : g(Error("Invalid listener argument"));
  this.bb = a;
  this.xd = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.ec = f;
  this.Rb = m;
  this.key = ++Xa;
  this.Ma = m
};
q.handleEvent = function(a) {
  return this.fd ? this.bb.call(this.ec || this.src, a) : this.bb.handleEvent.call(this.bb, a)
};
function Ya(a, b) {
  for(var c in a) {
    b.call(i, a[c], c, a)
  }
}
function Za(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function $a(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var ab = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function bb(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < ab.length;f++) {
      c = ab[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!F || Va();
var cb = !F || Va();
F && H("8");
!G || H("528");
La && H("1.9b") || F && H("8") || Ka && H("9.5") || G && H("528");
La && !H("8") || F && H("9");
var I = Array.prototype, db = I.indexOf ? function(a, b, c) {
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
}, eb = I.forEach ? function(a, b, c) {
  I.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
}, fb = I.map ? function(a, b, c) {
  return I.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = x(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in f && (e[h] = b.call(c, f[h], h, a))
  }
  return e
}, gb = I.some ? function(a, b, c) {
  return I.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return j
    }
  }
  return m
}, hb = I.every ? function(a, b, c) {
  return I.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return m
    }
  }
  return j
};
function ib(a, b) {
  var c = db(a, b);
  0 <= c && I.splice.call(a, c, 1)
}
function jb(a) {
  return I.concat.apply(I, arguments)
}
function kb(a) {
  if(v(a)) {
    return jb(a)
  }
  for(var b = [], c = 0, d = a.length;c < d;c++) {
    b[c] = a[c]
  }
  return b
}
function lb(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(v(d) || (e = w(d)) && d.hasOwnProperty("callee")) {
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
function mb(a, b, c) {
  return 2 >= arguments.length ? I.slice.call(a, b) : I.slice.call(a, b, c)
}
function nb(a, b) {
  I.sort.call(a, b || ob)
}
function ob(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var pb = {Xe:"click", bf:"dblclick", wf:"mousedown", Af:"mouseup", zf:"mouseover", yf:"mouseout", xf:"mousemove", Kf:"selectstart", rf:"keypress", qf:"keydown", sf:"keyup", Ve:"blur", kf:"focus", cf:"deactivate", lf:F ? "focusin" : "DOMFocusIn", mf:F ? "focusout" : "DOMFocusOut", We:"change", Jf:"select", Lf:"submit", pf:"input", Ff:"propertychange", gf:"dragstart", df:"dragenter", ff:"dragover", ef:"dragleave", hf:"drop", Pf:"touchstart", Of:"touchmove", Nf:"touchend", Mf:"touchcancel", Ze:"contextmenu", 
jf:"error", of:"help", tf:"load", uf:"losecapture", Gf:"readystatechange", Hf:"resize", If:"scroll", Rf:"unload", nf:"hashchange", Bf:"pagehide", Cf:"pageshow", Ef:"popstate", $e:"copy", Df:"paste", af:"cut", Se:"beforecopy", Te:"beforecut", Ue:"beforepaste", vf:"message", Ye:"connect", Qf:G ? "webkitTransitionEnd" : Ka ? "oTransitionEnd" : "transitionend"};
function J() {
}
J.prototype.Z = m;
J.prototype.b = function() {
  this.Z || (this.Z = j, this.d())
};
J.prototype.d = function() {
  this.ae && qb.apply(k, this.ae)
};
function qb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    w(d) ? qb.apply(k, d) : d && "function" == typeof d.b && d.b()
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
K.prototype.Hb = j;
K.prototype.stopPropagation = function() {
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
B(tb, K);
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
q.Xa = k;
q.xb = function(a, b) {
  var c = this.type = a.type;
  K.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(La) {
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
  this.Xa = a;
  delete this.Hb;
  delete this.xa
};
q.stopPropagation = function() {
  tb.n.stopPropagation.call(this);
  this.Xa.stopPropagation ? this.Xa.stopPropagation() : this.Xa.cancelBubble = j
};
q.d = function() {
  tb.n.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.Xa = k
};
var ub = {}, L = {}, M = {}, vb = {};
function wb(a, b, c, d, e) {
  if(b) {
    if(v(b)) {
      for(var f = 0;f < b.length;f++) {
        wb(a, b[f], c, d, e)
      }
      return k
    }
    var d = !!d, h = L;
    b in h || (h[b] = {c:0, M:0});
    h = h[b];
    d in h || (h[d] = {c:0, M:0}, h.c++);
    var h = h[d], l = ja(a), n;
    h.M++;
    if(h[l]) {
      n = h[l];
      for(f = 0;f < n.length;f++) {
        if(h = n[f], h.bb == c && h.ec == e) {
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
    h = new Wa;
    h.xb(c, f, a, b, d, e);
    c = h.key;
    f.key = c;
    n.push(h);
    ub[c] = h;
    M[l] || (M[l] = []);
    M[l].push(h);
    a.addEventListener ? (a == s || !a.Oc) && a.addEventListener(b, f, d) : a.attachEvent(b in vb ? vb[b] : vb[b] = "on" + b, f);
    return c
  }
  g(Error("Invalid event type"))
}
function xb() {
  var a = yb, b = cb ? function(c) {
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
      f = L;
      if(b in f && (f = f[b], d in f && (f = f[d], a = ja(a), f[a]))) {
        a = f[a];
        break a
      }
      a = k
    }
    if(a) {
      for(f = 0;f < a.length;f++) {
        if(a[f].bb == c && a[f].capture == d && a[f].ec == e) {
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
  var c = b.src, d = b.type, e = b.xd, f = b.capture;
  c.removeEventListener ? (c == s || !c.Oc) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in vb ? vb[d] : vb[d] = "on" + d, e);
  c = ja(c);
  e = L[d][f][c];
  if(M[c]) {
    var h = M[c];
    ib(h, b);
    0 == h.length && delete M[c]
  }
  b.Ma = j;
  e.rd = j;
  Cb(d, f, c, e);
  delete ub[a];
  return j
}
function Cb(a, b, c, d) {
  if(!d.zb && d.rd) {
    for(var e = 0, f = 0;e < d.length;e++) {
      d[e].Ma ? d[e].xd.src = k : (e != f && (d[f] = d[e]), f++)
    }
    d.length = f;
    d.rd = m;
    0 == f && (delete L[a][b][c], L[a][b].c--, 0 == L[a][b].c && (delete L[a][b], L[a].c--), 0 == L[a].c && delete L[a])
  }
}
function Db(a) {
  var b, c = 0, d = b == k;
  b = !!b;
  if(a == k) {
    Ya(M, function(a) {
      for(var e = a.length - 1;0 <= e;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Bb(f.key), c++
        }
      }
    })
  }else {
    if(a = ja(a), M[a]) {
      for(var a = M[a], e = a.length - 1;0 <= e;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Bb(f.key), c++
        }
      }
    }
  }
}
function Eb(a, b, c, d, e) {
  var f = 1, b = ja(b);
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
  var c = ub[a], d = c.type, e = L;
  if(!(d in e)) {
    return j
  }
  var e = e[d], f, h;
  if(!cb) {
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
        for(var A = p.length - 1;!r.xa && 0 <= A && h.M;A--) {
          r.currentTarget = p[A], f &= Eb(h, p[A], d, j, r)
        }
        if(n) {
          h = e[m];
          h.M = h.c;
          for(A = 0;!r.xa && A < p.length && h.M;A++) {
            r.currentTarget = p[A], f &= Eb(h, p[A], d, m, r)
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
B(Hb, J);
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
  var b = a.type || a, c = L;
  if(b in c) {
    if(x(a)) {
      a = new K(a, this)
    }else {
      if(a instanceof K) {
        a.target = a.target || this
      }else {
        var d = a, a = new K(b, this);
        bb(a, d)
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
function N(a, b) {
  this.nb = [];
  this.Kc = a;
  this.Qc = b || k
}
q = N.prototype;
q.ha = m;
q.Ya = m;
q.cb = 0;
q.wc = m;
q.Wd = m;
q.Qb = 0;
q.cancel = function(a) {
  if(this.ha) {
    this.fb instanceof N && this.fb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.Qb--, 0 >= b.Qb && b.cancel())
    }
    this.Kc ? this.Kc.call(this.Qc, this) : this.wc = j;
    this.ha || this.Wa(new Jb)
  }
};
q.Mc = function(a, b) {
  Kb(this, a, b);
  this.cb--;
  0 == this.cb && this.ha && Lb(this)
};
function Kb(a, b, c) {
  a.ha = j;
  a.fb = c;
  a.Ya = !b;
  Lb(a)
}
function Mb(a) {
  a.ha && (a.wc || g(new Nb), a.wc = m)
}
function Ob(a, b) {
  Mb(a);
  Kb(a, j, b)
}
q.Wa = function(a) {
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
  a.nb.push([b, c, d]);
  a.ha && Lb(a)
}
function Sb(a, b) {
  Qb(a, b, b, i)
}
function Tb(a) {
  return gb(a.nb, function(a) {
    return ia(a[1])
  })
}
function Lb(a) {
  a.Fc && a.ha && Tb(a) && (s.clearTimeout(a.Fc), delete a.Fc);
  a.t && (a.t.Qb--, delete a.t);
  for(var b = a.fb, c = m, d = m;a.nb.length && 0 == a.cb;) {
    var e = a.nb.shift(), f = e[0], h = e[1], e = e[2];
    if(f = a.Ya ? h : f) {
      try {
        var l = f.call(e || a.Qc, b);
        fa(l) && (a.Ya = a.Ya && (l == b || l instanceof Error), a.fb = b = l);
        b instanceof N && (d = j, a.cb++)
      }catch(n) {
        b = n, a.Ya = j, Tb(a) || (c = j)
      }
    }
  }
  a.fb = b;
  d && a.cb && (Qb(b, y(a.Mc, a, j), y(a.Mc, a, m)), b.Wd = j);
  c && (a.Fc = s.setTimeout(function() {
    fa(b.message) && b.stack && (b.message += "\n" + b.stack);
    g(b)
  }, 0))
}
function Ub(a) {
  var b = new N;
  Ob(b, a);
  return b
}
function Vb(a) {
  var b = new N;
  b.Wa(a);
  return b
}
function Nb() {
  C.call(this)
}
B(Nb, C);
Nb.prototype.message = "Already called";
function Jb() {
  C.call(this)
}
B(Jb, C);
Jb.prototype.message = "Deferred was cancelled";
function Wb(a) {
  this.w = a;
  this.qb = [];
  this.Tc = [];
  this.Vd = y(this.Me, this)
}
Wb.prototype.Cc = k;
function Xb(a, b, c, d) {
  a.qb.push([b, c, d]);
  a.Cc == k && (a.Cc = a.w.setTimeout(a.Vd, 0))
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
  return ia(a) || "object" == typeof a && ia(a.call) && ia(a.apply)
}
;function $b() {
  this.Gb = i
}
function ac(a) {
  var b = [];
  bc(new $b, a, b);
  return b.join("")
}
function bc(a, b, c) {
  switch(typeof b) {
    case "string":
      dc(b, c);
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
          c.push(e), e = b[f], bc(a, a.Gb ? a.Gb.call(b, "" + f, e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(f in b) {
        Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], "function" != typeof e && (c.push(d), dc(f, c), c.push(":"), bc(a, a.Gb ? a.Gb.call(b, f, e) : e, c), d = ","))
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
function dc(a, b) {
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
  var d = db(c, a);
  if(-1 != d) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = t(a);
    if("boolean" == d || "number" == d || "null" == d || "undefined" == d) {
      b.push("" + a)
    }else {
      if("string" == d) {
        dc(a, b)
      }else {
        if(Zb(a.A)) {
          a.A(b, c)
        }else {
          if(Zb(a.Pd)) {
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
                  if(ga(a) && "function" == typeof a.valueOf) {
                    b.push("new Date(", "" + a.valueOf(), ")")
                  }else {
                    for(var d = $a(a).concat(ab), e = {}, h = f = 0;h < d.length;) {
                      var l = d[h++], n = ha(l) ? "o" + ja(l) : (typeof l).charAt(0) + l;
                      Object.prototype.hasOwnProperty.call(e, n) || (e[n] = j, d[f++] = l)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      f = d[h], Object.prototype.hasOwnProperty.call(a, f) && (l = a[f], b.push(e), dc(f, b), b.push(": "), gc(l, b, c), e = ", ")
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
  gc(a, b, c)
}
function P(a, b) {
  var c = [];
  O(a, c, b);
  return c.join("")
}
;function hc() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ oa()).toString(36)
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
function oc(a) {
  if("function" == typeof a.J) {
    return a.J()
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
  return Za(a)
}
function pc(a) {
  if("function" == typeof a.ba) {
    return a.ba()
  }
  if("function" != typeof a.J) {
    if(w(a) || x(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return $a(a)
  }
}
function qc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(w(a) || x(a)) {
      eb(a, b, c)
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
  if(w(a) || x(a)) {
    return hb(a, b, i)
  }
  for(var c = pc(a), d = oc(a), e = d.length, f = 0;f < e;f++) {
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
    a && this.Pb(a)
  }
}
q = Q.prototype;
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
q.$a = function() {
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
  a instanceof Q ? (b = a.ba(), a = a.J()) : (b = $a(a), a = Za(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
q.N = function() {
  return new Q(this)
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
;var wc = {Pd:ba("<cw.eq.Wildcard>")};
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
      if(ga(a) && ga(b)) {
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
          if(a.Od == Ca && b.Od == Ca) {
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
;function R(a, b) {
  this.ze = a;
  this.Eb = b
}
R.prototype.I = function(a, b) {
  return ha(a) && this.constructor == a.constructor && yc(this.Eb, a.Eb, b)
};
R.prototype.A = function(a, b) {
  a.push("new ", this.ze, "(");
  for(var c = "", d = 0;d < this.Eb.length;d++) {
    a.push(c), c = ", ", O(this.Eb[d], a, b)
  }
  a.push(")")
};
var zc, Ac;
function Bc() {
  this.Ad = oa()
}
var Cc = new Bc;
Bc.prototype.set = aa("Ad");
Bc.prototype.reset = function() {
  this.set(oa())
};
Bc.prototype.get = o("Ad");
function Dc(a) {
  this.xe = a || "";
  this.Ge = Cc
}
Dc.prototype.Hd = j;
Dc.prototype.Fe = j;
Dc.prototype.Ee = j;
Dc.prototype.Id = m;
function Ec(a) {
  return 10 > a ? "0" + a : "" + a
}
function Fc(a, b) {
  var c = (a.Kd - b) / 1E3, d = c.toFixed(3), e = 0;
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
B(Gc, Dc);
Gc.prototype.Id = j;
var Hc;
function Ic(a, b) {
  var c;
  c = a.className;
  c = x(c) && c.match(/\S+/g) || [];
  for(var d = mb(arguments, 1), e = c.length + d.length, f = c, h = 0;h < d.length;h++) {
    0 <= db(f, d[h]) || f.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == e
}
;var Jc = !F || Va();
!La && !F || F && Va() || La && H("1.9.1");
F && H("9");
function Kc(a) {
  return a ? new Lc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Hc || (Hc = new Lc)
}
function Mc(a) {
  return x(a) ? document.getElementById(a) : a
}
function Nc(a, b) {
  var c = b && "*" != b ? b.toUpperCase() : "";
  return a.querySelectorAll && a.querySelector && (!G || "CSS1Compat" == document.compatMode || H("528")) && c ? a.querySelectorAll(c + "") : a.getElementsByTagName(c || "*")
}
function Oc(a, b) {
  Ya(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in Pc ? a.setAttribute(Pc[d], b) : 0 == d.lastIndexOf("aria-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var Pc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Qc(a, b, c) {
  return Rc(document, arguments)
}
function Rc(a, b) {
  var c = b[0], d = b[1];
  if(!Jc && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', D(d.name), '"');
    if(d.type) {
      c.push(' type="', D(d.type), '"');
      var e = {};
      bb(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (x(d) ? c.className = d : v(d) ? Ic.apply(k, [c].concat(d)) : Oc(c, d));
  2 < b.length && Sc(a, c, b, 2);
  return c
}
function Sc(a, b, c, d) {
  function e(c) {
    c && b.appendChild(x(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    w(f) && !(ha(f) && 0 < f.nodeType) ? eb(Tc(f) ? kb(f) : f, e) : e(f)
  }
}
function Uc(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function Tc(a) {
  if(a && "number" == typeof a.length) {
    if(ha(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(ia(a)) {
      return"function" == typeof a.item
    }
  }
  return m
}
function Lc(a) {
  this.ga = a || s.document || document
}
q = Lc.prototype;
q.Xc = Kc;
q.ta = function(a) {
  return x(a) ? this.ga.getElementById(a) : a
};
q.Va = function(a, b, c) {
  return Rc(this.ga, arguments)
};
q.createElement = function(a) {
  return this.ga.createElement(a)
};
q.createTextNode = function(a) {
  return this.ga.createTextNode(a)
};
q.appendChild = function(a, b) {
  a.appendChild(b)
};
q.append = function(a, b) {
  Sc(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
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
function Vc(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
function Wc(a) {
  F ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[G ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function Xc(a) {
  this.m = new Q;
  a && this.Pb(a)
}
function Yc(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ja(a) : b.substr(0, 1) + a
}
q = Xc.prototype;
q.C = function() {
  return this.m.C()
};
q.add = function(a) {
  this.m.set(Yc(a), a)
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
  return this.m.remove(Yc(a))
};
q.clear = function() {
  this.m.clear()
};
q.$a = function() {
  return this.m.$a()
};
q.contains = function(a) {
  return this.m.S(Yc(a))
};
q.J = function() {
  return this.m.J()
};
q.N = function() {
  return new Xc(this)
};
q.I = function(a) {
  return this.C() == nc(a) && Zc(this, a)
};
function Zc(a, b) {
  var c = nc(b);
  if(a.C() > c) {
    return m
  }
  !(b instanceof Xc) && 5 < c && (b = new Xc(b));
  return rc(a, function(a) {
    if("function" == typeof b.contains) {
      a = b.contains(a)
    }else {
      if("function" == typeof b.Ub) {
        a = b.Ub(a)
      }else {
        if(w(b) || x(b)) {
          a = 0 <= db(b, a)
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
;function $c(a) {
  return ad(a || arguments.callee.caller, [])
}
function ad(a, b) {
  var c = [];
  if(0 <= db(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(bd(a) + "(");
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
            f = (f = bd(f)) ? f : "[fn]";
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
        c.push(ad(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function bd(a) {
  if(cd[a]) {
    return cd[a]
  }
  a = "" + a;
  if(!cd[a]) {
    var b = /function ([^\(]+)/.exec(a);
    cd[a] = b ? b[1] : "[Anonymous]"
  }
  return cd[a]
}
var cd = {};
function dd(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
dd.prototype.bc = k;
dd.prototype.ac = k;
var ed = 0;
dd.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || ed++;
  this.Kd = d || oa();
  this.Ja = a;
  this.pd = b;
  this.se = c;
  delete this.bc;
  delete this.ac
};
dd.prototype.uc = aa("Ja");
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
var fd = new T("OFF", Infinity), gd = new T("SHOUT", 1200), hd = new T("SEVERE", 1E3), jd = new T("WARNING", 900), kd = new T("INFO", 800), ld = new T("CONFIG", 700), md = new T("FINE", 500), nd = new T("FINER", 400), od = new T("FINEST", 300), pd = new T("ALL", 0);
function U(a) {
  return V.Zc(a)
}
q = S.prototype;
q.getParent = o("t");
q.uc = aa("Ja");
function qd(a) {
  if(a.Ja) {
    return a.Ja
  }
  if(a.t) {
    return qd(a.t)
  }
  Ba("Root logger has no level set.");
  return k
}
q.log = function(a, b, c) {
  if(a.value >= qd(this).value) {
    a = this.ke(a, b, c);
    b = "log:" + a.pd;
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
q.ke = function(a, b, c) {
  var d = new dd(a, "" + b, this.ue);
  if(c) {
    d.bc = c;
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
          n = c.lineNumber || c.re || "Not available"
        }catch(p) {
          n = "Not available", E = j
        }
        try {
          r = c.fileName || c.filename || c.sourceURL || l
        }catch(u) {
          r = "Not available", E = j
        }
        h = E || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:r, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + D(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + D(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + D($c(f) + "-> ")
    }catch(A) {
      e = "Exception trying to expose exception! You win, we lose. " + A
    }
    d.ac = e
  }
  return d
};
q.De = function(a, b) {
  this.log(gd, a, b)
};
q.F = function(a, b) {
  this.log(hd, a, b)
};
q.z = function(a, b) {
  this.log(jd, a, b)
};
q.info = function(a, b) {
  this.log(kd, a, b)
};
q.Yd = function(a, b) {
  this.log(ld, a, b)
};
q.k = function(a, b) {
  this.log(md, a, b)
};
q.ge = function(a, b) {
  this.log(nd, a, b)
};
q.q = function(a, b) {
  this.log(od, a, b)
};
var V = {Ab:{}, gb:k};
V.dd = function() {
  V.gb || (V.gb = new S(""), V.Ab[""] = V.gb, V.gb.uc(ld))
};
V.Tf = function() {
  return V.Ab
};
V.dc = function() {
  V.dd();
  return V.gb
};
V.Zc = function(a) {
  V.dd();
  return V.Ab[a] || V.$d(a)
};
V.Sf = function(a) {
  return function(b) {
    (a || V.dc()).F("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.re + ")")
  }
};
V.$d = function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.Zc(a.substr(0, c));
  c.fa || (c.fa = {});
  c.fa[d] = b;
  b.t = c;
  return V.Ab[a] = b
};
function rd(a) {
  this.yd = y(this.Qd, this);
  this.Wc = new Gc;
  this.ed = this.Wc.Hd = m;
  this.i = a;
  this.ee = this.i.ownerDocument || this.i.document;
  var a = Kc(this.i), b = k;
  if(F) {
    b = a.ga.createStyleSheet(), Wc(b)
  }else {
    var c = Nc(a.ga, "head")[0];
    c || (b = Nc(a.ga, "body")[0], c = a.Va("head"), b.parentNode.insertBefore(c, b));
    b = a.Va("style");
    Wc(b);
    a.appendChild(c, b)
  }
  this.i.className += " logdiv"
}
rd.prototype.Ce = function(a) {
  if(a != this.ed) {
    var b = V.dc();
    if(a) {
      var c = this.yd;
      b.Fa || (b.Fa = []);
      b.Fa.push(c)
    }else {
      (b = b.Fa) && ib(b, this.yd)
    }
    this.ed = a
  }
};
rd.prototype.Qd = function(a) {
  var b = 100 >= this.i.scrollHeight - this.i.scrollTop - this.i.clientHeight, c = this.ee.createElement("div");
  c.className = "logmsg";
  var d = this.Wc, e;
  switch(a.Ja.value) {
    case gd.value:
      e = "dbg-sh";
      break;
    case hd.value:
      e = "dbg-sev";
      break;
    case jd.value:
      e = "dbg-w";
      break;
    case kd.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var f = [];
  f.push(d.xe, " ");
  if(d.Hd) {
    var h = new Date(a.Kd);
    f.push("[", Ec(h.getFullYear() - 2E3) + Ec(h.getMonth() + 1) + Ec(h.getDate()) + " " + Ec(h.getHours()) + ":" + Ec(h.getMinutes()) + ":" + Ec(h.getSeconds()) + "." + Ec(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.Fe && f.push("[", ya(Fc(a, d.Ge.get())), "s] ");
  d.Ee && f.push("[", D(a.se), "] ");
  f.push('<span class="', e, '">', sa(ya(D(a.pd))));
  d.Id && a.bc && f.push("<br>", sa(ya(a.ac || "")));
  f.push("</span><br>");
  c.innerHTML = f.join("");
  this.i.appendChild(c);
  b && (this.i.scrollTop = this.i.scrollHeight)
};
rd.prototype.clear = function() {
  this.i.innerHTML = ""
};
var sd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function td(a, b) {
  var c = a.match(sd), d = b.match(sd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function ud(a, b) {
  var c;
  a instanceof ud ? (this.Pa(b == k ? a.U : b), vd(this, a.X), wd(this, a.Ba), xd(this, a.O), yd(this, a.ka), zd(this, a.K), Ad(this, a.L.N()), Bd(this, a.sa)) : a && (c = ("" + a).match(sd)) ? (this.Pa(!!b), vd(this, c[1] || "", j), wd(this, c[2] || "", j), xd(this, c[3] || "", j), yd(this, c[4]), zd(this, c[5] || "", j), Ad(this, c[6] || "", j), Bd(this, c[7] || "", j)) : (this.Pa(!!b), this.L = new Cd(k, this, this.U))
}
q = ud.prototype;
q.X = "";
q.Ba = "";
q.O = "";
q.ka = k;
q.K = "";
q.sa = "";
q.qe = m;
q.U = m;
q.toString = function() {
  if(this.R) {
    return this.R
  }
  var a = [];
  this.X && a.push(Dd(this.X, Ed), ":");
  this.O && (a.push("//"), this.Ba && a.push(Dd(this.Ba, Ed), "@"), a.push(x(this.O) ? encodeURIComponent(this.O) : k), this.ka != k && a.push(":", "" + this.ka));
  this.K && (this.O && "/" != this.K.charAt(0) && a.push("/"), a.push(Dd(this.K, "/" == this.K.charAt(0) ? Fd : Gd)));
  var b = "" + this.L;
  b && a.push("?", b);
  this.sa && a.push("#", Dd(this.sa, Hd));
  return this.R = a.join("")
};
q.N = function() {
  var a = this.X, b = this.Ba, c = this.O, d = this.ka, e = this.K, f = this.L.N(), h = this.sa, l = new ud(k, this.U);
  a && vd(l, a);
  b && wd(l, b);
  c && xd(l, c);
  d && yd(l, d);
  e && zd(l, e);
  f && Ad(l, f);
  h && Bd(l, h);
  return l
};
function vd(a, b, c) {
  Id(a);
  delete a.R;
  a.X = c ? b ? decodeURIComponent(b) : "" : b;
  a.X && (a.X = a.X.replace(/:$/, ""))
}
function wd(a, b, c) {
  Id(a);
  delete a.R;
  a.Ba = c ? b ? decodeURIComponent(b) : "" : b
}
function xd(a, b, c) {
  Id(a);
  delete a.R;
  a.O = c ? b ? decodeURIComponent(b) : "" : b
}
function yd(a, b) {
  Id(a);
  delete a.R;
  b ? (b = Number(b), (isNaN(b) || 0 > b) && g(Error("Bad port number " + b)), a.ka = b) : a.ka = k
}
function zd(a, b, c) {
  Id(a);
  delete a.R;
  a.K = c ? b ? decodeURIComponent(b) : "" : b
}
function Ad(a, b, c) {
  Id(a);
  delete a.R;
  b instanceof Cd ? (a.L = b, a.L.Gc = a, a.L.Pa(a.U)) : (c || (b = Dd(b, Jd)), a.L = new Cd(b, a, a.U))
}
function Bd(a, b, c) {
  Id(a);
  delete a.R;
  a.sa = c ? b ? decodeURIComponent(b) : "" : b
}
function Id(a) {
  a.qe && g(Error("Tried to modify a read-only Uri"))
}
q.Pa = function(a) {
  this.U = a;
  this.L && this.L.Pa(a);
  return this
};
function Kd(a) {
  return a instanceof ud ? a.N() : new ud(a, i)
}
var Ld = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function Dd(a, b) {
  var c = k;
  x(a) && (c = a, Ld.test(c) || (c = encodeURI(a)), 0 <= c.search(b) && (c = c.replace(b, Md)));
  return c
}
function Md(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Ed = /[#\/\?@]/g, Gd = /[\#\?:]/g, Fd = /[\#\?]/g, Jd = /[\#\?@]/g, Hd = /#/g;
function Cd(a, b, c) {
  this.$ = a || k;
  this.Gc = b || k;
  this.U = !!c
}
function W(a) {
  if(!a.g && (a.g = new Q, a.c = 0, a.$)) {
    for(var b = a.$.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), e = k, f = k;
      0 <= d ? (e = b[c].substring(0, d), f = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = Nd(a, e);
      a.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
    }
  }
}
q = Cd.prototype;
q.g = k;
q.c = k;
q.C = function() {
  W(this);
  return this.c
};
q.add = function(a, b) {
  W(this);
  Od(this);
  a = Nd(this, a);
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
  a = Nd(this, a);
  if(this.g.S(a)) {
    Od(this);
    var b = this.g.get(a);
    v(b) ? this.c -= b.length : this.c--;
    return this.g.remove(a)
  }
  return m
};
q.clear = function() {
  Od(this);
  this.g && this.g.clear();
  this.c = 0
};
q.$a = function() {
  W(this);
  return 0 == this.c
};
q.S = function(a) {
  W(this);
  a = Nd(this, a);
  return this.g.S(a)
};
q.Ub = function(a) {
  var b = this.J();
  return 0 <= db(b, a)
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
  if(a) {
    if(a = Nd(this, a), this.S(a)) {
      var b = this.g.get(a);
      if(v(b)) {
        return b
      }
      a = [];
      a.push(b)
    }else {
      a = []
    }
  }else {
    for(var b = this.g.J(), a = [], c = 0;c < b.length;c++) {
      var d = b[c];
      v(d) ? lb(a, d) : a.push(d)
    }
  }
  return a
};
q.set = function(a, b) {
  W(this);
  Od(this);
  a = Nd(this, a);
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
  a = Nd(this, a);
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
    var e = c[d], f = ra(e), e = this.g.get(e);
    if(v(e)) {
      for(var h = 0;h < e.length;h++) {
        0 < b && a.push("&"), a.push(f), "" !== e[h] && a.push("=", ra(e[h])), b++
      }
    }else {
      0 < b && a.push("&"), a.push(f), "" !== e && a.push("=", ra(e)), b++
    }
  }
  return this.$ = a.join("")
};
function Od(a) {
  delete a.Ea;
  delete a.$;
  a.Gc && delete a.Gc.R
}
q.N = function() {
  var a = new Cd;
  this.Ea && (a.Ea = this.Ea);
  this.$ && (a.$ = this.$);
  this.g && (a.g = this.g.N());
  return a
};
function Nd(a, b) {
  var c = "" + b;
  a.U && (c = c.toLowerCase());
  return c
}
q.Pa = function(a) {
  a && !this.U && (W(this), Od(this), qc(this.g, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.U = a
};
function Pd(a) {
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
;function Qd(a, b) {
  this.Ca = a;
  this.ya = b
}
Qd.prototype.I = function(a) {
  return a instanceof Qd && this.Ca == a.Ca && this.ya.join(",") == a.ya
};
Qd.prototype.A = function(a, b) {
  a.push("new SACK(", "" + this.Ca, ", ");
  O(this.ya, a, b);
  a.push(")")
};
function Rd() {
  this.D = new Q
}
Rd.prototype.ra = -1;
Rd.prototype.G = 0;
Rd.prototype.append = function(a) {
  var b = Pd(a);
  this.D.set(this.ra + 1, [a, b]);
  this.ra += 1;
  this.G += b
};
Rd.prototype.A = function(a) {
  a.push("<Queue with ", "" + this.D.C(), " item(s), counter=#", "" + this.ra, ", size=", "" + this.G, ">")
};
function Sd(a) {
  a = a.D.ba();
  nb(a);
  return a
}
function Td() {
  this.qa = new Q
}
Td.prototype.wa = -1;
Td.prototype.G = 0;
function Ud(a) {
  var b = a.qa.ba();
  nb(b);
  return new Qd(a.wa, b)
}
var Vd = {};
function Wd(a, b) {
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
        a.push('<property id="', d, '">'), Wd(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != t(b[c]) && (a.push('<property id="', D(c), '">'), Wd(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function Xd(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var f = e.length, h = 1;h < f;h++) {
    Wd(d, e[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var Yd = m, Zd = "";
function $d(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var ae = navigator.plugins["Shockwave Flash"];
  ae && (Yd = j, ae.description && (Zd = $d(ae.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (Yd = j, Zd = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var be = navigator.mimeTypes["application/x-shockwave-flash"];
    (Yd = be && be.enabledPlugin) && (Zd = $d(be.enabledPlugin.description))
  }else {
    try {
      var ce = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), Yd = j, Zd = $d(ce.GetVariable("$version"))
    }catch(de) {
      try {
        ce = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), Yd = j, Zd = "6.0.21"
      }catch(ee) {
        try {
          ce = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), Yd = j, Zd = $d(ce.GetVariable("$version"))
        }catch(fe) {
        }
      }
    }
  }
}
var ge = Zd;
function he(a) {
  this.me = a;
  this.h = []
}
B(he, J);
var ie = [];
he.prototype.sc = function() {
  eb(this.h, Bb);
  this.h.length = 0
};
he.prototype.d = function() {
  he.n.d.call(this);
  this.sc()
};
he.prototype.handleEvent = function() {
  g(Error("EventHandler.handleEvent not implemented"))
};
function je() {
}
(function(a) {
  a.Yc = function() {
    return a.pe || (a.pe = new a)
  }
})(je);
je.prototype.ve = 0;
je.Yc();
function ke(a) {
  this.ob = a || Kc()
}
B(ke, Hb);
q = ke.prototype;
q.oe = je.Yc();
q.T = k;
q.va = m;
q.i = k;
q.t = k;
q.fa = k;
q.Ua = k;
q.Ne = m;
function le(a) {
  return a.T || (a.T = ":" + (a.oe.ve++).toString(36))
}
q.ta = o("i");
q.getParent = o("t");
q.vc = function(a) {
  this.t && this.t != a && g(Error("Method not supported"));
  ke.n.vc.call(this, a)
};
q.Xc = o("ob");
q.Va = function() {
  this.i = this.ob.createElement("div")
};
function me(a, b) {
  a.va && g(Error("Component already rendered"));
  a.i || a.Va();
  b ? b.insertBefore(a.i, k) : a.ob.ga.body.appendChild(a.i);
  (!a.t || a.t.va) && a.pb()
}
q.pb = function() {
  this.va = j;
  ne(this, function(a) {
    !a.va && a.ta() && a.pb()
  })
};
function oe(a) {
  ne(a, function(a) {
    a.va && oe(a)
  });
  a.vb && a.vb.sc();
  a.va = m
}
q.d = function() {
  ke.n.d.call(this);
  this.va && oe(this);
  this.vb && (this.vb.b(), delete this.vb);
  ne(this, function(a) {
    a.b()
  });
  !this.Ne && this.i && Uc(this.i);
  this.t = this.i = this.Ua = this.fa = k
};
function ne(a, b) {
  a.fa && eb(a.fa, b, i)
}
q.removeChild = function(a, b) {
  if(a) {
    var c = x(a) ? a : le(a), a = this.Ua && c ? (c in this.Ua ? this.Ua[c] : i) || k : k;
    if(c && a) {
      var d = this.Ua;
      c in d && delete d[c];
      ib(this.fa, a);
      b && (oe(a), a.i && Uc(a.i));
      c = a;
      c == k && g(Error("Unable to set parent component"));
      c.t = k;
      ke.n.vc.call(c, k)
    }
  }
  a || g(Error("Child is not in parent component"));
  return a
};
function pe(a, b) {
  this.ob = b || Kc();
  this.ie = a;
  this.$b = new he(this);
  this.sb = new Q
}
B(pe, ke);
q = pe.prototype;
q.a = U("goog.ui.media.FlashObject");
q.Pe = "window";
q.Jc = "#000000";
q.Rd = "sameDomain";
function qe(a, b, c) {
  a.Hc = x(b) ? b : Math.round(b) + "px";
  a.fc = x(c) ? c : Math.round(c) + "px";
  a.ta() && (b = a.ta() ? a.ta().firstChild : k, c = a.fc, c == i && g(Error("missing height argument")), b.style.width = Vc(a.Hc), b.style.height = Vc(c))
}
q.pb = function() {
  pe.n.pb.call(this);
  var a = this.ta(), b;
  b = F ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = F ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = pa(c, this.Pe), d = this.sb.ba(), e = this.sb.J(), f = [], h = 0;h < d.length;h++) {
    var l = ra(d[h]), n = ra(e[h]);
    f.push(l + "=" + n)
  }
  b = pa(b, le(this), le(this), "goog-ui-media-flash-object", D(this.ie), D(f.join("&")), this.Jc, this.Rd, c);
  a.innerHTML = b;
  this.Hc && this.fc && qe(this, this.Hc, this.fc);
  a = this.$b;
  b = this.ta();
  c = Za(pb);
  v(c) || (ie[0] = c, c = ie);
  for(d = 0;d < c.length;d++) {
    a.h.push(wb(b, c[d], rb || a, m, a.me || a))
  }
};
q.Va = function() {
  this.Cd != k && !(0 <= za(ge, this.Cd)) && (this.a.z("Required flash version not found:" + this.Cd), g(Error("Method not supported")));
  var a = this.Xc().createElement("div");
  a.className = "goog-ui-media-flash";
  this.i = a
};
q.d = function() {
  pe.n.d.call(this);
  this.sb = k;
  this.$b.b();
  this.$b = k
};
function re(a) {
  C.call(this, a)
}
B(re, C);
re.prototype.name = "cw.loadflash.FlashLoadFailed";
s.__loadFlashObject_callbacks = {};
function se(a, b, c) {
  function d() {
    e && delete s.__loadFlashObject_callbacks[e]
  }
  var e;
  if(La && !H("1.8.1.20")) {
    return Vb(new re("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(0 <= za(ge, "9"))) {
    return Vb(new re("Need Flash Player 9+; had " + (ge ? ge : "none")))
  }
  var f;
  e = "_" + hc();
  var h = new N(d);
  s.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      Ob(h, Mc(f))
    }, 0)
  };
  b.sb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  f = le(b);
  me(b, c);
  return h
}
function te(a, b, c) {
  var d = se(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  Sb(d, function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function ue(a, b) {
  this.T = "_" + hc();
  this.Lb = a;
  this.la = b;
  this.pa = a.pa
}
B(ue, J);
q = ue.prototype;
q.Ka = j;
q.Wb = m;
q.a = U("cw.net.FlashSocket");
q.A = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.T);
  a.push("'>")
};
function ve(a, b, c) {
  "frames" == b ? (a = a.la, we(a.u), xe(a.u, c)) : "stillreceiving" == b ? (c = a.la, c.a.q("onstillreceiving"), we(c.u)) : "connect" == b ? (c = a.la, c.a.info("onconnect"), we(c.u), a = c.Sa, c.Sa = k, a.length && (c.a.q("onconnect: Writing " + a.length + " buffered frame(s)."), c.Ib.lb(a))) : "close" == b ? (a.Ka = m, a.b()) : "ioerror" == b ? (a.Ka = m, b = a.la, b.a.z("onioerror: " + P(c)), ye(b.u, m), a.b()) : "securityerror" == b ? (a.Ka = m, b = a.la, b.a.z("onsecurityerror: " + P(c)), ye(b.u, 
  m), a.b()) : g(Error("bad event: " + b))
}
function ze(a) {
  a.Wb = j;
  a.Ka = m;
  a.b()
}
q.Tb = function(a, b) {
  try {
    var c = this.pa.CallFunction(Xd("__FC_connect", this.T, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.F("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), ze(this)
  }
  '"OK"' != c && g(Error("__FC_connect failed? ret: " + c))
};
q.lb = function(a) {
  try {
    var b = this.pa.CallFunction(Xd("__FC_writeFrames", this.T, a))
  }catch(c) {
    return this.a.F("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), ze(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.z("Flash no longer knows of " + this.T + "; disposing."), this.b()) : g(Error("__FC_writeFrames failed? ret: " + b)))
};
q.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Ka);
  ue.n.d.call(this);
  var a = this.pa;
  delete this.pa;
  if(this.Ka) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(Xd("__FC_close", this.T)))
    }catch(b) {
      this.a.F("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.Wb = j
    }
  }
  if(this.Wb) {
    a = this.la, a.a.z("oncrash"), ye(a.u, j)
  }else {
    this.la.onclose()
  }
  delete this.la;
  delete this.Lb.Ga[this.T]
};
function Ae(a, b) {
  this.o = a;
  this.pa = b;
  this.Ga = {};
  this.Sb = "__FST_" + hc();
  s[this.Sb] = y(this.de, this);
  var c = b.CallFunction(Xd("__FC_setCallbackFunc", this.Sb));
  '"OK"' != c && g(Error("__FC_setCallbackFunc failed? ret: " + c))
}
B(Ae, J);
q = Ae.prototype;
q.a = U("cw.net.FlashSocketTracker");
q.A = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  O(this.Ga, a, b);
  a.push(">")
};
q.Xb = function(a) {
  a = new ue(this, a);
  return this.Ga[a.T] = a
};
q.be = function(a, b, c, d) {
  var e = this.Ga[a];
  e ? "frames" == b && d ? (ve(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : ve(e, b, c) : this.a.z("Cannot dispatch because we have no instance: " + P([a, b, c, d]))
};
q.de = function(a, b, c, d) {
  try {
    Xb(this.o, this.be, this, [a, b, c, d])
  }catch(e) {
    s.window.setTimeout(function() {
      g(e)
    }, 0)
  }
};
q.d = function() {
  Ae.n.d.call(this);
  for(var a = Za(this.Ga);a.length;) {
    a.pop().b()
  }
  delete this.Ga;
  delete this.pa;
  s[this.Sb] = i
};
function Ce(a) {
  this.u = a;
  this.Sa = []
}
B(Ce, J);
q = Ce.prototype;
q.a = U("cw.net.FlashSocketConduit");
q.lb = function(a) {
  this.Sa ? (this.a.q("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.Sa.push.apply(this.Sa, a)) : (this.a.q("writeFrames: Writing " + a.length + " frame(s)."), this.Ib.lb(a))
};
q.Tb = function(a, b) {
  this.Ib.Tb(a, b)
};
q.onclose = function() {
  this.a.info("onclose");
  ye(this.u, m)
};
q.d = function() {
  this.a.info("in disposeInternal.");
  Ce.n.d.call(this);
  this.Ib.b();
  delete this.u
};
var De = [];
function Ee() {
  var a = new N;
  De.push(a);
  return a
}
function Fe(a) {
  var b = De;
  De = [];
  eb(b, function(b) {
    Ob(b, a)
  })
}
function Ge(a, b) {
  if(De.length) {
    return Ee()
  }
  var c = new pe(b + "FlashConnector.swf?cb=" + He);
  c.Jc = "#777777";
  qe(c, 300, 30);
  var d = Mc("minerva-elements");
  d || g(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = Mc("minerva-elements-FlashConnectorSwf");
  e || (e = Qc("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  zc = te(a.w, c, e);
  Pb(zc, Fe);
  return Ee()
}
;function Ie() {
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
function Je() {
}
Je.prototype.I = function(a, b) {
  return!(a instanceof Je) ? m : yc(Ke(this), Ke(a), b)
};
Je.prototype.A = function(a, b) {
  a.push("<HelloFrame properties=");
  O(Ke(this), a, b);
  a.push(">")
};
function Ke(a) {
  return[a.Qa, a.wd, a.cd, a.Bd, a.ib, a.zc, a.qd, a.od, a.nc, a.md, a.Md, a.Jd, a.na, a.yb]
}
Je.prototype.H = Y;
Je.prototype.P = function(a) {
  var b = {};
  b.tnum = this.Qa;
  b.ver = this.wd;
  b.format = this.cd;
  b["new"] = this.Bd;
  b.id = this.ib;
  b.ming = this.zc;
  b.pad = this.qd;
  b.maxb = this.od;
  fa(this.nc) && (b.maxt = this.nc);
  b.maxia = this.md;
  b.tcpack = this.Md;
  b.eeds = this.Jd;
  b.sack = this.na instanceof Qd ? ic((new Le(this.na)).H()) : this.na;
  b.seenack = this.yb instanceof Qd ? ic((new Le(this.yb)).H()) : this.yb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(ac(b), "H")
};
function Me(a) {
  R.call(this, "StringFrame", [a]);
  this.Bc = a
}
B(Me, R);
Me.prototype.H = Y;
Me.prototype.P = function(a) {
  a.push(this.Bc, " ")
};
function Ne(a) {
  R.call(this, "CommentFrame", [a]);
  this.Xd = a
}
B(Ne, R);
Ne.prototype.H = Y;
Ne.prototype.P = function(a) {
  a.push(this.Xd, "^")
};
function Oe(a) {
  R.call(this, "SeqNumFrame", [a]);
  this.Gd = a
}
B(Oe, R);
Oe.prototype.H = Y;
Oe.prototype.P = function(a) {
  a.push("" + this.Gd, "N")
};
function Pe(a) {
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
  return new Qd(a, c)
}
function Le(a) {
  R.call(this, "SackFrame", [a]);
  this.na = a
}
B(Le, R);
Le.prototype.H = Y;
Le.prototype.P = function(a) {
  var b = this.na;
  a.push(b.ya.join(","), "|", "" + b.Ca);
  a.push("A")
};
function Qe(a) {
  R.call(this, "StreamStatusFrame", [a]);
  this.hd = a
}
B(Qe, R);
Qe.prototype.H = Y;
Qe.prototype.P = function(a) {
  var b = this.hd;
  a.push(b.ya.join(","), "|", "" + b.Ca);
  a.push("T")
};
function Re() {
  R.call(this, "StreamCreatedFrame", [])
}
B(Re, R);
Re.prototype.H = Y;
Re.prototype.P = function(a) {
  a.push("C")
};
function Se() {
  R.call(this, "YouCloseItFrame", [])
}
B(Se, R);
Se.prototype.H = Y;
Se.prototype.P = function(a) {
  a.push("Y")
};
function Te(a, b) {
  R.call(this, "ResetFrame", [a, b]);
  this.zd = a;
  this.Ic = b
}
B(Te, R);
Te.prototype.H = Y;
Te.prototype.P = function(a) {
  a.push(this.zd, "|", "" + Number(this.Ic), "!")
};
var Ue = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Ve(a) {
  R.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
B(Ve, R);
Ve.prototype.H = Y;
Ve.prototype.P = function(a) {
  a.push(this.reason, "K")
};
function We(a) {
  a || g(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new Me(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = Pe(ic(a)), a == k && g(new X("bad sack")), new Le(a)
  }
  if("N" == b) {
    return a = lc(ic(a)), a == k && g(new X("bad seqNum")), new Oe(a)
  }
  if("T" == b) {
    return a = Pe(ic(a)), a == k && g(new X("bad lastSackSeen")), new Qe(a)
  }
  if("Y" == b) {
    return 1 != a.length && g(new X("leading garbage")), new Se
  }
  if("^" == b) {
    return new Ne(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && g(new X("leading garbage")), new Re
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && g(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && g(new X("bad applicationLevel")), new Te(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = Ue[a], a == k && g(new X("unknown kill reason: " + a)), new Ve(a)
  }
  g(new X("Invalid frame type " + b))
}
;function Xe(a, b, c, d) {
  this.contentWindow = a;
  this.rb = b;
  this.Ac = c;
  this.je = d
}
Xe.prototype.A = function(a, b) {
  a.push("<XDRFrame frameId=");
  O(this.je, a, b);
  a.push(", expandedUrl=");
  O(this.rb, a, b);
  a.push(", streams=");
  O(this.Ac, a, b);
  a.push(">")
};
function Ye() {
  this.frames = [];
  this.lc = new Q
}
Ye.prototype.a = U("cw.net.XDRTracker");
function Ze(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + Math.floor(Ie()) + ("" + Math.floor(Ie()))
  })
}
function $e(a, b) {
  for(var c = af, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], f;
    if(f = 0 == e.Ac.length) {
      f = e.rb;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      f = RegExp("^" + h + "$").test(f)
    }
    if(f) {
      return c.a.info("Giving " + P(b) + " existing frame " + P(e)), Ub(e)
    }
  }
  d = hc() + hc();
  e = Ze(a);
  f = s.location;
  f instanceof ud || (f = Kd(f));
  e instanceof ud || (e = Kd(e));
  var l = f;
  f = l.N();
  (h = !!e.X) ? vd(f, e.X) : h = !!e.Ba;
  h ? wd(f, e.Ba) : h = !!e.O;
  h ? xd(f, e.O) : h = e.ka != k;
  var n = e.K;
  if(h) {
    yd(f, e.ka)
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
  h ? zd(f, n) : h = "" !== e.L.toString();
  h ? (l = e.L, l.Ea || (l.Ea = l.toString() ? decodeURIComponent(l.toString()) : ""), Ad(f, l.Ea, i)) : h = !!e.sa;
  h && Bd(f, e.sa);
  e = f.toString();
  f = ("" + s.location).match(sd)[3] || k;
  h = e.match(sd)[3] || k;
  f == h ? (c.a.info("No need to make a real XDRFrame for " + P(b)), c = Ub(new Xe(s, e, [b], k))) : ((f = Mc("minerva-elements")) || g(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new N, c.lc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + P(d) + "for " + P(b)), c = Qc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), f.appendChild(c), c = h);
  return c
}
Ye.prototype.Re = function(a) {
  var b = this.lc.get(a);
  b || g(Error("Unknown frameId " + P(a)));
  this.lc.remove(b);
  var c = b[0], a = new Xe(Mc("minerva-xdrframe-" + a).contentWindow || (Mc("minerva-xdrframe-" + a).contentDocument || Mc("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Mc("minerva-xdrframe-" + a).contentDocument || Mc("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  Ob(c, a)
};
var af = new Ye;
s.__XHRTracker_xdrFrameLoaded = y(af.Re, af);
var bf;
bf = m;
var cf = Ha();
cf && (-1 != cf.indexOf("Firefox") || -1 != cf.indexOf("Camino") || -1 != cf.indexOf("iPhone") || -1 != cf.indexOf("iPod") || -1 != cf.indexOf("iPad") || -1 != cf.indexOf("Android") || -1 != cf.indexOf("Chrome") && (bf = j));
var df = bf;
var He = "4bdfc178fc0e508c0cd5efc3fdb09920";
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function ef(a, b, c, d, e, f) {
  N.call(this, e, f);
  this.ld = a;
  this.Yb = [];
  this.Vc = !!b;
  this.he = !!c;
  this.Zd = !!d;
  for(b = 0;b < a.length;b++) {
    Qb(a[b], y(this.ad, this, b, j), y(this.ad, this, b, m))
  }
  0 == a.length && !this.Vc && Ob(this, this.Yb)
}
B(ef, N);
ef.prototype.sd = 0;
ef.prototype.ad = function(a, b, c) {
  this.sd++;
  this.Yb[a] = [b, c];
  this.ha || (this.Vc && b ? Ob(this, [a, c]) : this.he && !b ? this.Wa(c) : this.sd == this.ld.length && Ob(this, this.Yb));
  this.Zd && !b && (c = k);
  return c
};
ef.prototype.Wa = function(a) {
  ef.n.Wa.call(this, a);
  eb(this.ld, function(a) {
    a.cancel()
  })
};
function ff(a) {
  a = new ef(a, m, j);
  Pb(a, function(a) {
    return fb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function gf(a, b) {
  this.Qe = a;
  this.nd = b
}
gf.prototype.jc = 0;
gf.prototype.Bb = 0;
gf.prototype.cc = m;
function hf(a) {
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
    if(e.length > a.nd) {
      return a.cc = j, [b, 2]
    }
    b.push(e);
    a.Bb = c += 1
  }
  return a.jc - a.Bb - 1 > a.nd ? (a.cc = j, [b, 2]) : [b, 1]
}
;function jf(a, b, c) {
  this.u = b;
  this.Q = a;
  this.Vb = c
}
B(jf, J);
q = jf.prototype;
q.a = U("cw.net.XHRMaster");
q.ma = -1;
q.mc = function(a, b, c) {
  this.Vb.__XHRSlave_makeRequest(this.Q, a, b, c)
};
q.ia = o("ma");
q.pc = function(a, b) {
  1 != b && this.a.F(P(this.Q) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  we(this.u);
  xe(this.u, a)
};
q.qc = function(a) {
  this.a.k("ongotheaders_: " + P(a));
  var b = k;
  "Content-Length" in a && (b = lc(a["Content-Length"]));
  a = this.u;
  a.a.k(a.l() + " got Content-Length: " + b);
  a.Y == kf && (b == k && (a.a.z("Expected to receive a valid Content-Length, but did not."), b = 5E5), lf(a, 2E3 + 1E3 * (b / 3072)))
};
q.rc = function(a) {
  1 != a && this.a.k(this.u.l() + "'s XHR's readyState is " + a);
  this.ma = a;
  2 <= this.ma && we(this.u)
};
q.oc = function() {
  this.u.b()
};
q.d = function() {
  jf.n.d.call(this);
  delete Z.ca[this.Q];
  this.Vb.__XHRSlave_dispose(this.Q);
  delete this.Vb
};
function mf() {
  this.ca = {}
}
B(mf, J);
q = mf.prototype;
q.a = U("cw.net.XHRMasterTracker");
q.Xb = function(a, b) {
  var c = "_" + hc(), d = new jf(c, a, b);
  return this.ca[c] = d
};
q.pc = function(a, b, c) {
  if(La) {
    for(var d = [], e = 0, f = b.length;e < f;e++) {
      d[e] = b[e]
    }
    b = d
  }else {
    b = jb(b)
  }
  (d = this.ca[a]) ? d.pc(b, c) : this.a.F("onframes_: no master for " + P(a))
};
q.qc = function(a, b) {
  var c = this.ca[a];
  c ? c.qc(b) : this.a.F("ongotheaders_: no master for " + P(a))
};
q.rc = function(a, b) {
  var c = this.ca[a];
  c ? c.rc(b) : this.a.F("onreadystatechange_: no master for " + P(a))
};
q.oc = function(a) {
  var b = this.ca[a];
  b ? (delete this.ca[b.Q], b.oc()) : this.a.F("oncomplete_: no master for " + P(a))
};
q.d = function() {
  mf.n.d.call(this);
  for(var a = Za(this.ca);a.length;) {
    a.pop().b()
  }
  delete this.ca
};
var Z = new mf;
s.__XHRMaster_onframes = y(Z.pc, Z);
s.__XHRMaster_oncomplete = y(Z.oc, Z);
s.__XHRMaster_ongotheaders = y(Z.qc, Z);
s.__XHRMaster_onreadystatechange = y(Z.rc, Z);
function nf(a, b, c) {
  this.V = a;
  this.host = b;
  this.port = c
}
function of(a, b, c) {
  this.host = a;
  this.port = b;
  this.Ke = c
}
function pf(a, b) {
  b || (b = a);
  this.V = a;
  this.oa = b
}
pf.prototype.A = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  O(this.V, a, b);
  a.push(", secondaryUrl=");
  O(this.oa, a, b);
  a.push(">")
};
function qf(a, b, c, d) {
  this.V = a;
  this.vd = b;
  this.oa = c;
  this.Fd = d;
  (!(0 == this.V.indexOf("http://") || 0 == this.V.indexOf("https://")) || !(0 == this.oa.indexOf("http://") || 0 == this.oa.indexOf("https://"))) && g(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.vd.location.href;
  td(this.V, a) || g(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.Fd.location.href;
  td(this.oa, a) || g(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
qf.prototype.A = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  O(this.V, a, b);
  a.push(", secondaryUrl=");
  O(this.oa, a, b);
  a.push(">")
};
var rf = new Ne(";)]}");
(function() {
}).prototype.a = U("cw.net.QANProtocolWrapper");
function sf(a) {
  this.He = a
}
sf.prototype.A = function(a, b) {
  a.push("<UserContext for ");
  O(this.He, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.p = a;
  this.o = c ? c : Yb;
  this.jb = new Xc;
  this.ib = hc() + hc();
  this.W = new Rd;
  this.ic = new Td;
  this.kb = k;
  this.Mb = [];
  this.Aa = new sf(this);
  this.Ud = y(this.Le, this);
  G && (this.kb = zb(s, "load", this.Ae, m, this))
}
B($, J);
q = $.prototype;
q.a = U("cw.net.ClientStream");
q.jd = new Qd(-1, []);
q.kd = new Qd(-1, []);
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
q.eb = k;
q.yc = 0;
q.ud = 0;
q.Ed = 0;
q.A = function(a, b) {
  a.push("<ClientStream id=");
  O(this.ib, a, b);
  a.push(", state=", "" + this.v);
  a.push(", primary=");
  O(this.e, a, b);
  a.push(", secondary=");
  O(this.r, a, b);
  a.push(", resetting=");
  O(this.eb, a, b);
  a.push(">")
};
q.le = o("Aa");
q.Sd = function(a) {
  fa(a.streamStarted) || g(Error("Protocol is missing required method streamStarted"));
  fa(a.streamReset) || g(Error("Protocol is missing required method streamReset"));
  fa(a.stringReceived) || g(Error("Protocol is missing required method stringReceived"));
  this.onstarted = y(a.streamStarted, a);
  this.onreset = y(a.streamReset, a);
  this.onstring = y(a.stringReceived, a)
};
function tf(a) {
  var b = [-1];
  a.e && b.push(a.e.La);
  a.r && b.push(a.r.La);
  return Math.max.apply(Math.max, b)
}
function uf(a) {
  if(!(3 > a.v)) {
    vf(a);
    var b = 0 != a.W.D.C(), c = Ud(a.ic), d = !c.I(a.kd) && !(a.e && c.I(a.e.Ia) || a.r && c.I(a.r.Ia)), e = tf(a);
    if((b = b && e < a.W.ra) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.Ta ? (a.a.q("tryToSend_: writing " + f + " to primary"), d && (d = a.e, c != d.Ia && (!d.da && !d.s.length && wf(d), d.s.push(new Le(c)), d.Ia = c)), b && xf(a.e, a.W, e + 1), a.e.aa()) : a.r == k ? a.xc ? (a.a.q("tryToSend_: creating secondary to send " + f), a.r = yf(a, m), b && xf(a.r, a.W, e + 1), a.r.aa()) : (a.a.q("tryToSend_: not creating a secondary because stream might not exist on server"), a.tc = j) : a.a.q("tryToSend_: need to send " + f + ", but can't right now")
    }
  }
}
function vf(a) {
  a.Oa != k && (a.o.w.clearTimeout(a.Oa), a.Oa = k)
}
q.Le = function() {
  this.Oa = k;
  uf(this)
};
function zf(a) {
  a.Oa == k && (a.Oa = a.o.w.setTimeout(a.Ud, 6))
}
q.Ae = function() {
  this.kb = k;
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
  b && !/^([ -~]*)$/.test(a) && g(Error("sendString: string has illegal chars: " + P(a)));
  this.W.append(a);
  zf(this)
};
function yf(a, b) {
  var c;
  a.p instanceof qf ? c = kf : a.p instanceof of ? c = Af : g(Error("Don't support endpoint " + P(a.p)));
  a.Dc += 1;
  c = new Bf(a.o, a, a.Dc, c, a.p, b);
  a.a.q("Created: " + c.l());
  a.jb.add(c);
  return c
}
function Cf(a, b, c) {
  var d = new Df(a.o, a, b, c);
  a.a.q("Created: " + d.l() + ", delay=" + b + ", times=" + c);
  a.jb.add(d);
  return d
}
function Ef(a, b) {
  a.jb.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  a.a.k("Offline: " + b.l());
  a.yc = b.ja ? a.yc + b.ja : 0;
  1 <= a.yc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.Aa, "stream penalty reached limit", m), a.b());
  if(3 < a.v) {
    4 == a.v && b.Nd ? (a.a.k("Disposing because resettingTransport_ is done."), a.b()) : a.a.k("Not creating a transport because ClientStream is in state " + a.v)
  }else {
    var c;
    var d;
    c = b instanceof Df;
    if(!c && b.Ob) {
      var e = G ? df ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      a.a.q("getDelayForNextTransport_: " + P({delay:c, times:d}))
    }else {
      if(d = b.Lc(), b == a.e ? d ? e = ++a.ud : c || (e = a.ud = 0) : d ? e = ++a.Ed : c || (e = a.Ed = 0), c || !e) {
        d = c = 0, a.a.q("getDelayForNextTransport_: " + P({count:e, delay:c, times:d}))
      }else {
        var f = 2E3 * Math.min(e, 3), h = Math.floor(4E3 * Math.random()) - 2E3, l = Math.max(0, b.Ld - b.Ec);
        d = (c = Math.max(0, f + h - l)) ? 1 : 0;
        a.a.q("getDelayForNextTransport_: " + P({count:e, base:f, variance:h, oldDuration:l, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    b == a.e ? (a.e = k, c ? a.e = Cf(a, e, c) : (e = tf(a), a.e = yf(a, j), xf(a.e, a.W, e + 1)), a.e.aa()) : b == a.r && (a.r = k, c ? (a.r = Cf(a, e, c), a.r.aa()) : uf(a))
  }
}
q.reset = function(a) {
  3 < this.v && g(Error("reset: Can't send reset in state " + this.v));
  vf(this);
  0 != this.W.D.C() && this.a.z("reset: strings in send queue will never be sent: " + P(this.W));
  this.v = 4;
  this.e && this.e.Ta ? (this.a.info("reset: Sending ResetFrame over existing primary."), Ff(this.e, a), this.e.aa()) : (this.e && (this.a.k("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.r && (this.a.k("reset: Disposing secondary before sending ResetFrame."), this.r.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.eb = yf(this, m), Ff(this.eb, a), this.eb.aa());
  this.onreset && this.onreset.call(this.Aa, a, j)
};
function Gf(a, b, c, d) {
  var e;
  e = a.ic;
  for(var f = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], n = m, r = 0, E = c.length;r < E;r++) {
    var p = c[r], u = p[0], p = p[1];
    if(u == e.wa + 1) {
      e.wa += 1;
      for(l.push(p);;) {
        u = e.wa + 1;
        p = e.qa.get(u, Vd);
        if(p === Vd) {
          break
        }
        l.push(p[0]);
        e.qa.remove(u);
        e.G -= p[1];
        e.wa = u
      }
    }else {
      if(!(u <= e.wa)) {
        if(f != k && e.qa.C() >= f) {
          n = j;
          break
        }
        var A = Pd(p);
        if(h != k && e.G + A > h) {
          n = j;
          break
        }
        e.qa.set(u, [p, A]);
        e.G += A
      }
    }
  }
  e.qa.$a() && e.qa.clear();
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
  d || zf(a);
  if(!(4 == a.v || a.Z) && e) {
    b.a.F(b.l() + "'s peer caused rwin overflow."), b.b()
  }
}
q.Sc = function(a) {
  this.a.F("Failed to start " + P(this) + "; error was " + P(a.message));
  this.b()
};
q.start = function() {
  this.onmessage && g(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  1 != this.v && g(Error("ClientStream.start: " + P(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.v = 2;
  if(this.p instanceof pf) {
    var a = $e(this.p.V, this), b = $e(this.p.oa, this), a = ff([a, b]);
    Pb(a, y(this.fe, this));
    Rb(a, y(this.Sc, this))
  }else {
    if(this.p instanceof nf) {
      if(Ac) {
        this.Uc()
      }else {
        var a = Ge(this.o, this.p.V), c = this;
        Pb(a, function(a) {
          Ac || (Ac = new Ae(c.o, a));
          return k
        });
        Pb(a, y(this.Uc, this));
        Rb(a, y(this.Sc, this))
      }
    }else {
      Hf(this)
    }
  }
};
q.fe = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].rb, e = a[1].rb;
  this.Mb.push(a[0]);
  this.Mb.push(a[1]);
  this.p = new qf(d, b, e, c);
  Hf(this)
};
q.Uc = function() {
  this.p = new of(this.p.host, this.p.port, Ac);
  Hf(this)
};
function Hf(a) {
  a.v = 3;
  a.e = yf(a, j);
  xf(a.e, a.W, k);
  a.e.aa()
}
q.d = function() {
  this.a.info(P(this) + " in disposeInternal.");
  vf(this);
  this.v = 5;
  for(var a = this.jb.J(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Mb.length;a++) {
    ib(this.Mb[a].Ac, this)
  }
  G && this.kb && (Bb(this.kb), this.kb = k);
  this.ondisconnect && this.ondisconnect.call(this.Aa);
  delete this.jb;
  delete this.e;
  delete this.r;
  delete this.eb;
  delete this.Aa;
  $.n.d.call(this)
};
var kf = 1, Af = 3;
function Bf(a, b, c, d, e, f) {
  this.o = a;
  this.B = b;
  this.Qa = c;
  this.Y = d;
  this.p = e;
  this.s = [];
  this.Da = f;
  this.Ta = !this.Ha();
  this.Na = this.Y != kf;
  this.Td = y(this.Ie, this)
}
B(Bf, J);
q = Bf.prototype;
q.a = U("cw.net.ClientTransport");
q.j = k;
q.Ec = k;
q.Ld = k;
q.Fb = k;
q.da = m;
q.Jb = m;
q.Ia = k;
q.tb = 0;
q.La = -1;
q.Db = -1;
q.Nd = m;
q.Ob = m;
q.ja = 0;
q.Za = m;
q.A = function(a) {
  a.push("<ClientTransport #", "" + this.Qa, ", becomePrimary=", "" + this.Da, ">")
};
q.l = function() {
  return(this.Da ? "Prim. T#" : "Sec. T#") + this.Qa
};
q.Lc = function() {
  return!(!this.Za && this.tb)
};
q.Ha = function() {
  return this.Y == kf || 2 == this.Y
};
function If(a, b) {
  nb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Gf(a.B, a, b, !a.Na)
}
function Jf(a, b, c) {
  try {
    var d = We(b);
    a.tb += 1;
    a.a.k(a.l() + " RECV " + P(d));
    var e;
    1 == a.tb && !d.I(rf) && a.Ha() ? (a.a.z(a.l() + " is closing soon because got bad preamble: " + P(d)), e = j) : e = m;
    if(e) {
      return j
    }
    if(d instanceof Me) {
      if(!/^([ -~]*)$/.test(d.Bc)) {
        return a.Za = j
      }
      a.Db += 1;
      c.push([a.Db, d.Bc])
    }else {
      if(d instanceof Le) {
        var f = a.B, h = d.na;
        f.jd = h;
        var l = f.W, n = h.Ca, c = m;
        n > l.ra && (c = j);
        for(var r = Sd(l).concat(), d = 0;d < r.length;d++) {
          var E = r[d];
          if(E > n) {
            break
          }
          var p = l.D.get(E)[1];
          l.D.remove(E);
          l.G -= p
        }
        for(d = 0;d < h.ya.length;d++) {
          var u = h.ya[d];
          u > l.ra && (c = j);
          l.D.S(u) && (p = l.D.get(u)[1], l.D.remove(u), l.G -= p)
        }
        l.D.$a() && l.D.clear();
        if(c) {
          return a.a.z(a.l() + " is closing soon because got bad SackFrame"), a.Za = j
        }
      }else {
        if(d instanceof Oe) {
          a.Db = d.Gd - 1
        }else {
          if(d instanceof Qe) {
            a.B.kd = d.hd
          }else {
            if(d instanceof Se) {
              return a.a.q(a.l() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof Ve) {
              return a.Za = j, "stream_attach_failure" == d.reason ? a.ja += 1 : "acked_unsent_strings" == d.reason && (a.ja += 0.5), a.a.q(a.l() + " is closing soon because got " + P(d)), j
            }
            if(!(d instanceof Ne)) {
              if(d instanceof Re) {
                var A = a.B, ag = !a.Na;
                A.a.q("Stream is now confirmed to exist at server.");
                A.xc = j;
                A.tc && !ag && (A.tc = m, uf(A))
              }else {
                if(c.length) {
                  If(a, c);
                  if(!v(c)) {
                    for(var id = c.length - 1;0 <= id;id--) {
                      delete c[id]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof Te) {
                  var cc = a.B;
                  cc.onreset && cc.onreset.call(cc.Aa, d.zd, d.Ic);
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
  }catch(Be) {
    return Be instanceof X || g(Be), a.a.z(a.l() + " is closing soon because got InvalidFrame: " + P(b)), a.Za = j
  }
  return m
}
function xe(a, b) {
  a.Jb = j;
  try {
    for(var c = m, d = [], e = 0, f = b.length;e < f;e++) {
      if(a.Z) {
        a.a.info(a.l() + " returning from loop because we're disposed.");
        return
      }
      if(c = Jf(a, b[e], d)) {
        break
      }
    }
    d.length && If(a, d);
    a.Jb = m;
    a.s.length && a.aa();
    c && (a.a.q(a.l() + " closeSoon is true.  Frames were: " + P(b)), a.b())
  }finally {
    a.Jb = m
  }
}
q.Ie = function() {
  this.a.z(this.l() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Kf(a) {
  a.Fb != k && (a.o.w.clearTimeout(a.Fb), a.Fb = k)
}
function lf(a, b) {
  Kf(a);
  b = Math.round(b);
  a.Fb = a.o.w.setTimeout(a.Td, b);
  a.a.k(a.l() + "'s receive timeout set to " + b + " ms.")
}
function we(a) {
  a.Y != kf && (a.Y == Af || 2 == a.Y ? lf(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.Y)))
}
function wf(a) {
  var b = new Je;
  b.Qa = a.Qa;
  b.wd = 2;
  b.cd = 2;
  a.B.xc || (b.Bd = j);
  b.ib = a.B.ib;
  b.zc = a.Na;
  b.zc && (b.qd = 4096);
  b.od = 3E5;
  b.md = a.Na ? Math.floor(10) : 0;
  b.Md = m;
  a.Da && (b.Jd = k, b.nc = Math.floor((a.Na ? 358E4 : 25E3) / 1E3));
  b.na = Ud(a.B.ic);
  b.yb = a.B.jd;
  a.s.push(b);
  a.Ia = b.na
}
function ye(a, b) {
  b && (a.ja += 0.5);
  a.b()
}
q.aa = function() {
  this.da && !this.Ta && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.Jb) {
    this.a.q(this.l() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.da;
    this.da = j;
    !a && !this.s.length && wf(this);
    for(a = 0;a < this.s.length;a++) {
      this.a.k(this.l() + " SEND " + P(this.s[a]))
    }
    if(this.Ha()) {
      for(var a = [], b = 0, c = this.s.length;b < c;b++) {
        this.s[b].P(a), a.push("\n")
      }
      this.s = [];
      a = a.join("");
      b = this.Da ? this.p.V : this.p.oa;
      this.j = Z.Xb(this, this.Da ? this.p.vd : this.p.Fd);
      this.Ec = this.o.w === Ib ? oa() : this.o.w.getTime();
      this.j.mc(b, "POST", a);
      lf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.Na ? 0 : this.Da ? 25E3 : 0))
    }else {
      if(this.Y == Af) {
        a = [];
        b = 0;
        for(c = this.s.length;b < c;b++) {
          a.push(this.s[b].H())
        }
        this.s = [];
        this.j ? this.j.lb(a) : (b = this.p, this.j = new Ce(this), this.j.Ib = b.Ke.Xb(this.j), this.Ec = this.o.w === Ib ? oa() : this.o.w.getTime(), this.j.Tb(b.host, b.port), this.j.Z || (this.j.lb(a), this.j.Z || lf(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.Y))
      }
    }
  }
};
function xf(a, b, c) {
  !a.da && !a.s.length && wf(a);
  for(var d = Math.max(c, a.La + 1), e = Sd(b), c = [], f = 0;f < e.length;f++) {
    var h = e[f];
    (d == k || h >= d) && c.push([h, b.D.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (-1 == a.La || a.La + 1 != e) && a.s.push(new Oe(e)), a.s.push(new Me(f)), a.La = e
  }
}
q.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Bf.n.d.call(this);
  this.Ld = this.o.w === Ib ? oa() : this.o.w.getTime();
  this.s = [];
  Kf(this);
  this.j && this.j.b();
  var a = this.B;
  this.B = k;
  Ef(a, this)
};
function Ff(a, b) {
  !a.da && !a.s.length && wf(a);
  a.s.push(new Te(b, j));
  a.Nd = j
}
function Df(a, b, c, d) {
  this.o = a;
  this.B = b;
  this.Rc = c;
  this.Nc = d
}
B(Df, J);
q = Df.prototype;
q.da = m;
q.Ta = m;
q.ub = k;
q.Ia = k;
q.a = U("cw.net.DoNothingTransport");
function Lf(a) {
  a.ub = a.o.w.setTimeout(function() {
    a.ub = k;
    a.Nc--;
    a.Nc ? Lf(a) : a.b()
  }, a.Rc)
}
q.aa = function() {
  this.da && !this.Ta && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.da = j;
  Lf(this)
};
q.A = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.Rc, ">")
};
q.Ha = ba(m);
q.l = ba("Wast. T");
q.Lc = ba(m);
q.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Df.n.d.call(this);
  this.ub != k && this.o.w.clearTimeout(this.ub);
  var a = this.B;
  this.B = k;
  Ef(a, this)
};
function Mf() {
}
Mf.prototype.mb = k;
var Nf;
function Of() {
}
B(Of, Mf);
function Pf(a) {
  return(a = Qf(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Rf(a) {
  var b = {};
  Qf(a) && (b[0] = j, b[1] = j);
  return b
}
Of.prototype.gc = k;
function Qf(a) {
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
Nf = new Of;
function Sf(a) {
  this.headers = new Q;
  this.Ra = a || k
}
B(Sf, Hb);
Sf.prototype.a = U("goog.net.XhrIo");
var Tf = /^https?$/i;
q = Sf.prototype;
q.ea = m;
q.f = k;
q.Nb = k;
q.kc = "";
q.gd = "";
q.ab = "";
q.Zb = m;
q.wb = m;
q.hc = m;
q.ua = m;
q.Kb = 0;
q.za = k;
q.Dd = "";
q.Oe = m;
q.send = function(a, b, c, d) {
  this.f && g(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.kc = a;
  this.ab = "";
  this.gd = b;
  this.Zb = m;
  this.ea = j;
  this.f = this.Ra ? Pf(this.Ra) : Pf(Nf);
  this.Nb = this.Ra ? this.Ra.mb || (this.Ra.mb = Rf(this.Ra)) : Nf.mb || (Nf.mb = Rf(Nf));
  this.f.onreadystatechange = y(this.td, this);
  try {
    this.a.k(Uf(this, "Opening Xhr")), this.hc = j, this.f.open(b, a, j), this.hc = m
  }catch(e) {
    this.a.k(Uf(this, "Error opening Xhr: " + e.message));
    Vf(this, e);
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
  this.Dd && (this.f.responseType = this.Dd);
  "withCredentials" in this.f && (this.f.withCredentials = this.Oe);
  try {
    this.za && (Ib.clearTimeout(this.za), this.za = k), 0 < this.Kb && (this.a.k(Uf(this, "Will abort after " + this.Kb + "ms if incomplete")), this.za = Ib.setTimeout(y(this.Je, this), this.Kb)), this.a.k(Uf(this, "Sending request")), this.wb = j, this.f.send(a), this.wb = m
  }catch(h) {
    this.a.k(Uf(this, "Send error: " + h.message)), Vf(this, h)
  }
};
q.Je = function() {
  "undefined" != typeof ca && this.f && (this.ab = "Timed out after " + this.Kb + "ms, aborting", this.a.k(Uf(this, this.ab)), this.dispatchEvent("timeout"), this.abort(8))
};
function Vf(a, b) {
  a.ea = m;
  a.f && (a.ua = j, a.f.abort(), a.ua = m);
  a.ab = b;
  Wf(a);
  Xf(a)
}
function Wf(a) {
  a.Zb || (a.Zb = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
q.abort = function() {
  this.f && this.ea && (this.a.k(Uf(this, "Aborting")), this.ea = m, this.ua = j, this.f.abort(), this.ua = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Xf(this))
};
q.d = function() {
  this.f && (this.ea && (this.ea = m, this.ua = j, this.f.abort(), this.ua = m), Xf(this, j));
  Sf.n.d.call(this)
};
q.td = function() {
  !this.hc && !this.wb && !this.ua ? this.we() : Yf(this)
};
q.we = function() {
  Yf(this)
};
function Yf(a) {
  if(a.ea && "undefined" != typeof ca) {
    if(a.Nb[1] && 4 == a.ia() && 2 == Zf(a)) {
      a.a.k(Uf(a, "Local request error detected and ignored"))
    }else {
      if(a.wb && 4 == a.ia()) {
        Ib.setTimeout(y(a.td, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.ia()) {
          a.a.k(Uf(a, "Request complete"));
          a.ea = m;
          var b = Zf(a), c;
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
              b = ("" + a.kc).match(sd)[1] || k, !b && self.location && (b = self.location.protocol, b = b.substr(0, b.length - 1)), b = !Tf.test(b ? b.toLowerCase() : "")
            }
            c = b
          }
          if(c) {
            a.dispatchEvent("complete"), a.dispatchEvent("success")
          }else {
            var d;
            try {
              d = 2 < a.ia() ? a.f.statusText : ""
            }catch(e) {
              a.a.k("Can not get status: " + e.message), d = ""
            }
            a.ab = d + " [" + Zf(a) + "]";
            Wf(a)
          }
          Xf(a)
        }
      }
    }
  }
}
function Xf(a, b) {
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
q.ia = function() {
  return this.f ? this.f.readyState : 0
};
function Zf(a) {
  try {
    return 2 < a.ia() ? a.f.status : -1
  }catch(b) {
    return a.a.z("Can not get status: " + b.message), -1
  }
}
q.getResponseHeader = function(a) {
  return this.f && 4 == this.ia() ? this.f.getResponseHeader(a) : i
};
function Uf(a, b) {
  return b + " [" + a.gd + " " + a.kc + " " + Zf(a) + "]"
}
;var $f = !(F || G && !H("420+"));
function bg(a, b) {
  this.Lb = a;
  this.Q = b
}
B(bg, J);
q = bg.prototype;
q.j = k;
q.ma = -1;
q.$c = m;
q.bd = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function cg(a) {
  var b = hf(a.Pc), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.Q, c, b), 1 != b && a.b()) : a.b()
}
q.ne = function() {
  cg(this);
  if(!this.Z) {
    var a = s.parent;
    a && a.__XHRMaster_oncomplete(this.Q);
    this.b()
  }
};
q.ye = function() {
  var a = s.parent;
  if(a) {
    this.ma = this.j.ia();
    if(2 <= this.ma && !this.$c) {
      for(var b = new Q, c = this.bd.length;c--;) {
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
    a.__XHRMaster_onreadystatechange(this.Q, this.ma);
    $f && 3 == this.ma && cg(this)
  }else {
    this.b()
  }
};
q.mc = function(a, b, c) {
  this.j = new Sf;
  wb(this.j, "readystatechange", y(this.ye, this));
  wb(this.j, "complete", y(this.ne, this));
  this.j.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.Pc = new gf(this.j.f, 1048576)
};
q.d = function() {
  bg.n.d.call(this);
  delete this.Pc;
  this.j && this.j.b();
  delete this.Lb.hb[this.Q];
  delete this.Lb
};
function dg() {
  this.hb = {}
}
B(dg, J);
dg.prototype.te = function(a, b, c, d) {
  var e = new bg(this, a);
  this.hb[a] = e;
  e.mc(b, c, d)
};
dg.prototype.ce = function(a) {
  (a = this.hb[a]) && a.b()
};
dg.prototype.d = function() {
  dg.n.d.call(this);
  for(var a = Za(this.hb);a.length;) {
    a.pop().b()
  }
  delete this.hb
};
var eg = new dg;
s.__XHRSlave_makeRequest = y(eg.te, eg);
s.__XHRSlave_dispose = y(eg.ce, eg);
var fg = U("cw.net.demo");
function gg(a, b, c, d) {
  a = new ud(document.location);
  if(c) {
    return new nf(d, a.O, s.__demo_mainSocketPort)
  }
  b ? (b = s.__demo_shared_domain, x(b) || g(Error("domain was " + P(b) + "; expected a string.")), c = a.N(), xd(c, "_____random_____." + b)) : c = a.N();
  zd(c, d);
  Ad(c, "", i);
  return new pf(c.toString().replace("_____random_____", "%random%"))
}
;z("Minerva.HttpEndpoint", pf);
z("Minerva.SocketEndpoint", nf);
z("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.le;
$.prototype.bindToProtocol = $.prototype.Sd;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.Be;
$.prototype.reset = $.prototype.reset;
z("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.uc;
S.prototype.shout = S.prototype.De;
S.prototype.severe = S.prototype.F;
S.prototype.warning = S.prototype.z;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.Yd;
S.prototype.fine = S.prototype.k;
S.prototype.finer = S.prototype.ge;
S.prototype.finest = S.prototype.q;
T.OFF = fd;
T.SHOUT = gd;
T.SEVERE = hd;
T.WARNING = jd;
T.INFO = kd;
T.CONFIG = ld;
T.FINE = md;
T.FINER = nd;
T.FINEST = od;
T.ALL = pd;
z("Minerva.LogManager", V);
V.getRoot = V.dc;
z("Minerva.DivConsole", rd);
rd.prototype.setCapturing = rd.prototype.Ce;
z("Minerva.bind", y);
z("Minerva.repr", P);
z("Minerva.theCallQueue", Yb);
z("Minerva.getEndpoint", gg);
z("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new ud(document.location)).L;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !s.__demo_shared_domain) {
    fg.z("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return gg(0, a, b, "/_minerva/")
});
})();
