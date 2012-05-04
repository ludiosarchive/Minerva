(function(){function g(a) {
  throw a;
}
var h = void 0, j = !0, k = null, l = !1;
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
var p, ca = ca || {}, r = this;
function da(a) {
  for(var a = a.split("."), b = r, c;c = a.shift();) {
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
function s(a) {
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
function t(a) {
  return a !== h
}
function v(a) {
  return"array" == s(a)
}
function fa(a) {
  var b = s(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function ga(a) {
  return ha(a) && "function" == typeof a.getFullYear
}
function x(a) {
  return"string" == typeof a
}
function ia(a) {
  return"function" == s(a)
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
  var c = a.split("."), d = r;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && t(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
function A(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.m = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
}
;function B(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, B) : this.stack = Error().stack || "";
  a && (this.message = "" + a)
}
A(B, Error);
B.prototype.name = "CustomError";
function pa(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
function qa(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
}
function C(a) {
  if(!ra.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(sa, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(ta, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(ua, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(va, "&quot;"));
  return a
}
var sa = /&/g, ta = /</g, ua = />/g, va = /\"/g, ra = /[&<>\"]/;
function wa(a) {
  return qa(a.replace(/  /g, " &#160;"), h)
}
function xa(a, b) {
  for(var c = 0, d = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = ("" + b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), i = 0;0 == c && i < f;i++) {
    var m = d[i] || "", n = e[i] || "", u = RegExp("(\\d*)(\\D*)", "g"), I = RegExp("(\\d*)(\\D*)", "g");
    do {
      var q = u.exec(m) || ["", "", ""], w = I.exec(n) || ["", "", ""];
      if(0 == q[0].length && 0 == w[0].length) {
        break
      }
      c = ((0 == q[1].length ? 0 : parseInt(q[1], 10)) < (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? -1 : (0 == q[1].length ? 0 : parseInt(q[1], 10)) > (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? 1 : 0) || ((0 == q[2].length) < (0 == w[2].length) ? -1 : (0 == q[2].length) > (0 == w[2].length) ? 1 : 0) || (q[2] < w[2] ? -1 : q[2] > w[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
}
;function ya(a, b) {
  b.unshift(a);
  B.call(this, pa.apply(k, b));
  b.shift()
}
A(ya, B);
ya.prototype.name = "AssertionError";
function za(a, b) {
  g(new ya("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;function Aa() {
  return j
}
;var Ba, Ca, Da, Ea;
function Fa() {
  return r.navigator ? r.navigator.userAgent : k
}
Ea = Da = Ca = Ba = l;
var Ga;
if(Ga = Fa()) {
  var Ha = r.navigator;
  Ba = 0 == Ga.indexOf("Opera");
  Ca = !Ba && -1 != Ga.indexOf("MSIE");
  Da = !Ba && -1 != Ga.indexOf("WebKit");
  Ea = !Ba && !Da && "Gecko" == Ha.product
}
var Ia = Ba, E = Ca, Ja = Ea, F = Da, Ka;
a: {
  var La = "", Ma;
  if(Ia && r.opera) {
    var Na = r.opera.version, La = "function" == typeof Na ? Na() : Na
  }else {
    if(Ja ? Ma = /rv\:([^\);]+)(\)|;)/ : E ? Ma = /MSIE\s+([^\);]+)(\)|;)/ : F && (Ma = /WebKit\/(\S+)/), Ma) {
      var Oa = Ma.exec(Fa()), La = Oa ? Oa[1] : ""
    }
  }
  if(E) {
    var Pa, Qa = r.document;
    Pa = Qa ? Qa.documentMode : h;
    if(Pa > parseFloat(La)) {
      Ka = "" + Pa;
      break a
    }
  }
  Ka = La
}
var Ra = {};
function G(a) {
  return Ra[a] || (Ra[a] = 0 <= xa(Ka, a))
}
var Sa = {};
function Ta() {
  return Sa[9] || (Sa[9] = E && !!document.documentMode && 9 <= document.documentMode)
}
;function Ua() {
}
var Va = 0;
p = Ua.prototype;
p.key = 0;
p.Wa = l;
p.ac = l;
p.Hb = function(a, b, c, d, e, f) {
  ia(a) ? this.Ad = j : a && a.handleEvent && ia(a.handleEvent) ? this.Ad = l : g(Error("Invalid listener argument"));
  this.hb = a;
  this.Rd = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.oc = f;
  this.ac = l;
  this.key = ++Va;
  this.Wa = l
};
p.handleEvent = function(a) {
  return this.Ad ? this.hb.call(this.oc || this.src, a) : this.hb.handleEvent.call(this.hb, a)
};
function Wa(a, b) {
  for(var c in a) {
    b.call(h, a[c], c, a)
  }
}
function Xa(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function Ya(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var Za = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function $a(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < Za.length;f++) {
      c = Za[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!E || Ta();
var ab = !E || Ta(), bb = E && !G("8");
!F || G("528");
Ja && G("1.9b") || E && G("8") || Ia && G("9.5") || F && G("528");
Ja && !G("8") || E && G("9");
var H = Array.prototype, cb = H.indexOf ? function(a, b, c) {
  return H.indexOf.call(a, b, c)
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
}, db = H.forEach ? function(a, b, c) {
  H.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
}, eb = H.map ? function(a, b, c) {
  return H.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = x(a) ? a.split("") : a, i = 0;i < d;i++) {
    i in f && (e[i] = b.call(c, f[i], i, a))
  }
  return e
}, fb = H.some ? function(a, b, c) {
  return H.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return j
    }
  }
  return l
}, gb = H.every ? function(a, b, c) {
  return H.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return l
    }
  }
  return j
};
function hb(a, b) {
  var c = cb(a, b);
  0 <= c && H.splice.call(a, c, 1)
}
function ib(a) {
  return H.concat.apply(H, arguments)
}
function jb(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}
function kb(a, b, c) {
  return 2 >= arguments.length ? H.slice.call(a, b) : H.slice.call(a, b, c)
}
function lb(a, b) {
  H.sort.call(a, b || mb)
}
function mb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var nb = {yf:"click", Df:"dblclick", Xf:"mousedown", ag:"mouseup", $f:"mouseover", Zf:"mouseout", Yf:"mousemove", mg:"selectstart", Sf:"keypress", Rf:"keydown", Tf:"keyup", wf:"blur", Lf:"focus", Ef:"deactivate", Mf:E ? "focusin" : "DOMFocusIn", Nf:E ? "focusout" : "DOMFocusOut", xf:"change", lg:"select", ng:"submit", Qf:"input", hg:"propertychange", If:"dragstart", Ff:"dragenter", Hf:"dragover", Gf:"dragleave", Jf:"drop", rg:"touchstart", qg:"touchmove", pg:"touchend", og:"touchcancel", Af:"contextmenu", 
Kf:"error", Pf:"help", Uf:"load", Vf:"losecapture", ig:"readystatechange", jg:"resize", kg:"scroll", tg:"unload", Of:"hashchange", dg:"pagehide", eg:"pageshow", gg:"popstate", Bf:"copy", fg:"paste", Cf:"cut", tf:"beforecopy", uf:"beforecut", vf:"beforepaste", cg:"online", bg:"offline", Wf:"message", zf:"connect", sg:F ? "webkitTransitionEnd" : Ia ? "oTransitionEnd" : "transitionend"};
function J() {
}
J.prototype.O = l;
J.prototype.b = function() {
  this.O || (this.O = j, this.d())
};
J.prototype.d = function() {
  this.xe && ob.apply(k, this.xe)
};
function ob(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    fa(d) ? ob.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function pb(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
A(pb, J);
p = pb.prototype;
p.d = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
p.Fa = l;
p.defaultPrevented = l;
p.Sb = j;
p.stopPropagation = function() {
  this.Fa = j
};
p.preventDefault = function() {
  this.defaultPrevented = j;
  this.Sb = l
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
  a && this.Hb(a, b)
}
A(sb, pb);
p = sb.prototype;
p.target = k;
p.relatedTarget = k;
p.offsetX = 0;
p.offsetY = 0;
p.clientX = 0;
p.clientY = 0;
p.screenX = 0;
p.screenY = 0;
p.button = 0;
p.keyCode = 0;
p.charCode = 0;
p.ctrlKey = l;
p.altKey = l;
p.shiftKey = l;
p.metaKey = l;
p.Ma = k;
p.Hb = function(a, b) {
  var c = this.type = a.type;
  pb.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ja) {
      var e;
      a: {
        try {
          rb(d.nodeName);
          e = j;
          break a
        }catch(f) {
        }
        e = l
      }
      e || (d = k)
    }
  }else {
    "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement)
  }
  this.relatedTarget = d;
  this.offsetX = F || a.offsetX !== h ? a.offsetX : a.layerX;
  this.offsetY = F || a.offsetY !== h ? a.offsetY : a.layerY;
  this.clientX = a.clientX !== h ? a.clientX : a.pageX;
  this.clientY = a.clientY !== h ? a.clientY : a.pageY;
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
  this.Ma = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Fa
};
p.stopPropagation = function() {
  sb.m.stopPropagation.call(this);
  this.Ma.stopPropagation ? this.Ma.stopPropagation() : this.Ma.cancelBubble = j
};
p.preventDefault = function() {
  sb.m.preventDefault.call(this);
  var a = this.Ma;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = l, bb) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
p.d = function() {
  sb.m.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.Ma = k
};
var tb = {}, K = {}, L = {}, ub = {};
function vb(a, b, c, d, e) {
  if(b) {
    if(v(b)) {
      for(var f = 0;f < b.length;f++) {
        vb(a, b[f], c, d, e)
      }
      return k
    }
    var d = !!d, i = K;
    b in i || (i[b] = {c:0, M:0});
    i = i[b];
    d in i || (i[d] = {c:0, M:0}, i.c++);
    var i = i[d], m = ja(a), n;
    i.M++;
    if(i[m]) {
      n = i[m];
      for(f = 0;f < n.length;f++) {
        if(i = n[f], i.hb == c && i.oc == e) {
          if(i.Wa) {
            break
          }
          return n[f].key
        }
      }
    }else {
      n = i[m] = [], i.c++
    }
    f = wb();
    f.src = a;
    i = new Ua;
    i.Hb(c, f, a, b, d, e);
    c = i.key;
    f.key = c;
    n.push(i);
    tb[c] = i;
    L[m] || (L[m] = []);
    L[m].push(i);
    a.addEventListener ? (a == r || !a.ed) && a.addEventListener(b, f, d) : a.attachEvent(b in ub ? ub[b] : ub[b] = "on" + b, f);
    return c
  }
  g(Error("Invalid event type"))
}
function wb() {
  var a = xb, b = ab ? function(c) {
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
  if(v(b)) {
    for(var f = 0;f < b.length;f++) {
      yb(a, b[f], c, d, e)
    }
    return k
  }
  a = vb(a, b, c, d, e);
  tb[a].ac = j;
  return a
}
function zb(a, b, c, d, e) {
  if(v(b)) {
    for(var f = 0;f < b.length;f++) {
      zb(a, b[f], c, d, e)
    }
  }else {
    d = !!d;
    a: {
      f = K;
      if(b in f && (f = f[b], d in f && (f = f[d], a = ja(a), f[a]))) {
        a = f[a];
        break a
      }
      a = k
    }
    if(a) {
      for(f = 0;f < a.length;f++) {
        if(a[f].hb == c && a[f].capture == d && a[f].oc == e) {
          Ab(a[f].key);
          break
        }
      }
    }
  }
}
function Ab(a) {
  if(!tb[a]) {
    return l
  }
  var b = tb[a];
  if(b.Wa) {
    return l
  }
  var c = b.src, d = b.type, e = b.Rd, f = b.capture;
  c.removeEventListener ? (c == r || !c.ed) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in ub ? ub[d] : ub[d] = "on" + d, e);
  c = ja(c);
  e = K[d][f][c];
  if(L[c]) {
    var i = L[c];
    hb(i, b);
    0 == i.length && delete L[c]
  }
  b.Wa = j;
  e.Ld = j;
  Bb(d, f, c, e);
  delete tb[a];
  return j
}
function Bb(a, b, c, d) {
  if(!d.Jb && d.Ld) {
    for(var e = 0, f = 0;e < d.length;e++) {
      d[e].Wa ? d[e].Rd.src = k : (e != f && (d[f] = d[e]), f++)
    }
    d.length = f;
    d.Ld = l;
    0 == f && (delete K[a][b][c], K[a][b].c--, 0 == K[a][b].c && (delete K[a][b], K[a].c--), 0 == K[a].c && delete K[a])
  }
}
function Cb(a) {
  var b, c = 0, d = b == k;
  b = !!b;
  if(a == k) {
    Wa(L, function(a) {
      for(var f = a.length - 1;0 <= f;f--) {
        var e = a[f];
        if(d || b == e.capture) {
          Ab(e.key), c++
        }
      }
    })
  }else {
    if(a = ja(a), L[a]) {
      for(var a = L[a], e = a.length - 1;0 <= e;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Ab(f.key), c++
        }
      }
    }
  }
}
function Db(a, b, c, d, e) {
  var f = 1, b = ja(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.Jb ? a.Jb++ : a.Jb = 1;
    try {
      for(var i = a.length, m = 0;m < i;m++) {
        var n = a[m];
        n && !n.Wa && (f &= Eb(n, e) !== l)
      }
    }finally {
      a.Jb--, Bb(c, d, b, a)
    }
  }
  return Boolean(f)
}
function Eb(a, b) {
  var c = a.handleEvent(b);
  a.ac && Ab(a.key);
  return c
}
function xb(a, b) {
  if(!tb[a]) {
    return j
  }
  var c = tb[a], d = c.type, e = K;
  if(!(d in e)) {
    return j
  }
  var e = e[d], f, i;
  if(!ab) {
    f = b || da("window.event");
    var m = j in e, n = l in e;
    if(m) {
      if(0 > f.keyCode || f.returnValue != h) {
        return j
      }
      a: {
        var u = l;
        if(0 == f.keyCode) {
          try {
            f.keyCode = -1;
            break a
          }catch(I) {
            u = j
          }
        }
        if(u || f.returnValue == h) {
          f.returnValue = j
        }
      }
    }
    u = new sb;
    u.Hb(f, this);
    f = j;
    try {
      if(m) {
        for(var q = [], w = u.currentTarget;w;w = w.parentNode) {
          q.push(w)
        }
        i = e[j];
        i.M = i.c;
        for(var D = q.length - 1;!u.Fa && 0 <= D && i.M;D--) {
          u.currentTarget = q[D], f &= Db(i, q[D], d, j, u)
        }
        if(n) {
          i = e[l];
          i.M = i.c;
          for(D = 0;!u.Fa && D < q.length && i.M;D++) {
            u.currentTarget = q[D], f &= Db(i, q[D], d, l, u)
          }
        }
      }else {
        f = Eb(c, u)
      }
    }finally {
      q && (q.length = 0), u.b()
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
A(Gb, J);
p = Gb.prototype;
p.ed = j;
p.Mb = k;
p.Jc = aa("Mb");
p.addEventListener = function(a, b, c, d) {
  vb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  zb(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
  var b = a.type || a, c = K;
  if(b in c) {
    if(x(a)) {
      a = new pb(a, this)
    }else {
      if(a instanceof pb) {
        a.target = a.target || this
      }else {
        var d = a, a = new pb(b, this);
        $a(a, d)
      }
    }
    var d = 1, e, c = c[b], b = j in c, f;
    if(b) {
      e = [];
      for(f = this;f;f = f.Mb) {
        e.push(f)
      }
      f = c[j];
      f.M = f.c;
      for(var i = e.length - 1;!a.Fa && 0 <= i && f.M;i--) {
        a.currentTarget = e[i], d &= Db(f, e[i], a.type, j, a) && a.Sb != l
      }
    }
    if(l in c) {
      if(f = c[l], f.M = f.c, b) {
        for(i = 0;!a.Fa && i < e.length && f.M;i++) {
          a.currentTarget = e[i], d &= Db(f, e[i], a.type, l, a) && a.Sb != l
        }
      }else {
        for(e = this;!a.Fa && e && f.M;e = e.Mb) {
          a.currentTarget = e, d &= Db(f, e, a.type, l, a) && a.Sb != l
        }
      }
    }
    a = Boolean(d)
  }else {
    a = j
  }
  return a
};
p.d = function() {
  Gb.m.d.call(this);
  Cb(this);
  this.Mb = k
};
var Hb = r.window;
Fb++;
Fb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function M(a, b) {
  this.vb = [];
  this.$c = a;
  this.gd = b || k
}
p = M.prototype;
p.aa = l;
p.cb = l;
p.jb = 0;
p.Kc = l;
p.se = l;
p.tb = 0;
p.cancel = function(a) {
  if(this.aa) {
    this.lb instanceof M && this.lb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.tb--, 0 >= b.tb && b.cancel())
    }
    this.$c ? this.$c.call(this.gd, this) : this.Kc = j;
    this.aa || this.Q(new Ib)
  }
};
p.cd = function(a, b) {
  Jb(this, a, b);
  this.jb--;
  0 == this.jb && this.aa && Kb(this)
};
function Jb(a, b, c) {
  a.aa = j;
  a.lb = c;
  a.cb = !b;
  Kb(a)
}
function Lb(a) {
  a.aa && (a.Kc || g(new Mb), a.Kc = l)
}
p.N = function(a) {
  Lb(this);
  Jb(this, j, a)
};
p.Q = function(a) {
  Lb(this);
  Jb(this, l, a)
};
p.La = function(a, b) {
  return this.$(a, k, b)
};
p.sb = function(a, b) {
  return this.$(k, a, b)
};
p.$ = function(a, b, c) {
  this.vb.push([a, b, c]);
  this.aa && Kb(this);
  return this
};
p.ad = function(a) {
  this.$(a.N, a.Q, a);
  return this
};
p.ne = function(a) {
  return this.La(y(a.Zc, a))
};
p.Zc = function(a) {
  var b = new M;
  this.ad(b);
  a && (b.t = this, this.tb++);
  return b
};
p.Vc = function(a, b) {
  return this.$(a, a, b)
};
p.Ke = o("aa");
function Nb(a) {
  return fb(a.vb, function(a) {
    return ia(a[1])
  })
}
function Kb(a) {
  a.Tc && (a.aa && Nb(a)) && (r.clearTimeout(a.Tc), delete a.Tc);
  a.t && (a.t.tb--, delete a.t);
  for(var b = a.lb, c = l, d = l;a.vb.length && 0 == a.jb;) {
    var e = a.vb.shift(), f = e[0], i = e[1], e = e[2];
    if(f = a.cb ? i : f) {
      try {
        var m = f.call(e || a.gd, b);
        t(m) && (a.cb = a.cb && (m == b || m instanceof Error), a.lb = b = m);
        b instanceof M && (d = j, a.jb++)
      }catch(n) {
        b = n, a.cb = j, Nb(a) || (c = j)
      }
    }
  }
  a.lb = b;
  d && a.jb && (b.$(y(a.cd, a, j), y(a.cd, a, l)), b.se = j);
  c && (a.Tc = r.setTimeout(function() {
    g(new Ob(b))
  }, 0))
}
function Pb(a) {
  var b = new M;
  b.N(a);
  return b
}
function Qb(a) {
  var b = new M;
  b.Q(a);
  return b
}
function Mb() {
  B.call(this)
}
A(Mb, B);
Mb.prototype.message = "Already called";
function Ib() {
  B.call(this)
}
A(Ib, B);
Ib.prototype.message = "Deferred was cancelled";
function Ob(a) {
  B.call(this);
  this.message = "Unhandled Error in Deferred: " + (a.message || "[No message]")
}
A(Ob, B);
function Rb(a) {
  this.A = a;
  this.zb = [];
  this.kd = [];
  this.re = y(this.mf, this)
}
Rb.prototype.Qc = k;
function Sb(a, b, c, d) {
  a.zb.push([b, c, d]);
  a.Qc == k && (a.Qc = a.A.setTimeout(a.re, 0))
}
Rb.prototype.mf = function() {
  this.Qc = k;
  var a = this.zb;
  this.zb = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], e = c[1], c = c[2];
    try {
      d.apply(e, c)
    }catch(f) {
      this.A.setTimeout(function() {
        g(f)
      }, 0)
    }
  }
  if(0 == this.zb.length) {
    a = this.kd;
    this.kd = [];
    for(b = 0;b < a.length;b++) {
      a[b].N(k)
    }
  }
};
var Tb = new Rb(r.window);
function Ub(a) {
  return ia(a) || "object" == typeof a && ia(a.call) && ia(a.apply)
}
;function Vb(a, b) {
  var c = [];
  Wb(new Xb(b), a, c);
  return c.join("")
}
function Xb(a) {
  this.Rb = a
}
function Wb(a, b, c) {
  switch(typeof b) {
    case "string":
      Yb(b, c);
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
          c.push(e), e = b[f], Wb(a, a.Rb ? a.Rb.call(b, "" + f, e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(f in b) {
        Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], "function" != typeof e && (c.push(d), Yb(f, c), c.push(":"), Wb(a, a.Rb ? a.Rb.call(b, f, e) : e, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var Zb = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, $b = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function Yb(a, b) {
  b.push('"', a.replace($b, function(a) {
    if(a in Zb) {
      return Zb[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
    return Zb[a] = e + b.toString(16)
  }), '"')
}
;function ac(a, b, c) {
  var d = cb(c, a);
  if(-1 != d) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = s(a);
    if("boolean" == d || "number" == d || "null" == d || "undefined" == d) {
      b.push("" + a)
    }else {
      if("string" == d) {
        Yb(a, b)
      }else {
        if(Ub(a.w)) {
          a.w(b, c)
        }else {
          if(Ub(a.je)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var e = "", f = 0;f < d;f++) {
                  b.push(e), ac(a[f], b, c), e = ", "
                }
                b.push("]")
              }else {
                if("object" == d) {
                  if(ga(a) && "function" == typeof a.valueOf) {
                    b.push("new Date(", "" + a.valueOf(), ")")
                  }else {
                    for(var d = Ya(a).concat(Za), e = {}, i = f = 0;i < d.length;) {
                      var m = d[i++], n = ha(m) ? "o" + ja(m) : (typeof m).charAt(0) + m;
                      Object.prototype.hasOwnProperty.call(e, n) || (e[n] = j, d[f++] = m)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(i = 0;i < d.length;i++) {
                      f = d[i], Object.prototype.hasOwnProperty.call(a, f) && (m = a[f], b.push(e), Yb(f, b), b.push(": "), ac(m, b, c), e = ", ")
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
  ac(a, b, c)
}
function O(a, b) {
  var c = [];
  N(a, c, b);
  return c.join("")
}
;function bc() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ oa()).toString(36)
}
function cc(a) {
  return a.substr(0, a.length - 1)
}
var dc = /^(0|[1-9]\d*)$/, ec = /^(0|\-?[1-9]\d*)$/;
function fc(a) {
  var b = gc;
  return dc.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;var gc = Math.pow(2, 53);
function hc(a) {
  if("function" == typeof a.B) {
    a = a.B()
  }else {
    if(fa(a) || x(a)) {
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
function ic(a) {
  if("function" == typeof a.C) {
    return a.C()
  }
  if(x(a)) {
    return a.split("")
  }
  if(fa(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return Xa(a)
}
function jc(a) {
  if("function" == typeof a.V) {
    return a.V()
  }
  if("function" != typeof a.C) {
    if(fa(a) || x(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return Ya(a)
  }
}
function lc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(fa(a) || x(a)) {
      db(a, b, c)
    }else {
      for(var d = jc(a), e = ic(a), f = e.length, i = 0;i < f;i++) {
        b.call(c, e[i], d && d[i], a)
      }
    }
  }
}
function mc(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, h)
  }
  if(fa(a) || x(a)) {
    return gb(a, b, h)
  }
  for(var c = jc(a), d = ic(a), e = d.length, f = 0;f < e;f++) {
    if(!b.call(h, d[f], c && c[f], a)) {
      return l
    }
  }
  return j
}
;function P(a, b) {
  this.n = {};
  this.g = [];
  var c = arguments.length;
  if(1 < c) {
    c % 2 && g(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.$b(a)
  }
}
p = P.prototype;
p.c = 0;
p.B = o("c");
p.C = function() {
  nc(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.n[this.g[b]])
  }
  return a
};
p.V = function() {
  nc(this);
  return this.g.concat()
};
p.U = function(a) {
  return oc(this.n, a)
};
p.dc = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(oc(this.n, c) && this.n[c] == a) {
      return j
    }
  }
  return l
};
p.K = function(a, b) {
  if(this === a) {
    return j
  }
  if(this.c != a.B()) {
    return l
  }
  var c = b || pc;
  nc(this);
  for(var d, e = 0;d = this.g[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return l
    }
  }
  return j
};
function pc(a, b) {
  return a === b
}
p.fb = function() {
  return 0 == this.c
};
p.clear = function() {
  this.n = {};
  this.c = this.g.length = 0
};
p.remove = function(a) {
  return oc(this.n, a) ? (delete this.n[a], this.c--, this.g.length > 2 * this.c && nc(this), j) : l
};
function nc(a) {
  if(a.c != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      oc(a.n, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.c != a.g.length) {
    for(var e = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], oc(e, d) || (a.g[c++] = d, e[d] = 1), b++
    }
    a.g.length = c
  }
}
p.get = function(a, b) {
  return oc(this.n, a) ? this.n[a] : b
};
p.set = function(a, b) {
  oc(this.n, a) || (this.c++, this.g.push(a));
  this.n[a] = b
};
p.$b = function(a) {
  var b;
  a instanceof P ? (b = a.V(), a = a.C()) : (b = Ya(a), a = Xa(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
p.T = function() {
  return new P(this)
};
function qc(a) {
  nc(a);
  for(var b = {}, c = 0;c < a.g.length;c++) {
    var d = a.g[c];
    b[d] = a.n[d]
  }
  return b
}
function oc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function rc(a, b) {
  try {
    var c = a.apply(k, b ? b : [])
  }catch(d) {
    return Qb(d)
  }
  return c instanceof M ? c : c instanceof Error ? Qb(c) : Pb(c)
}
;var sc = {je:ba("<cw.eq.Wildcard>")};
function tc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function uc(a, b, c) {
  var d = s(a), e = s(b);
  if(a == sc || b == sc) {
    return j
  }
  if(a != k && "function" == typeof a.K) {
    return c && c.push("running custom equals function on left object"), a.K(b, c)
  }
  if(b != k && "function" == typeof b.K) {
    return c && c.push("running custom equals function on right object"), b.K(a, c)
  }
  if(tc(d) || tc(e)) {
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
              c && c.push("array length mismatch: " + a.length + ", " + b.length), a = l
            }else {
              d = 0;
              for(e = a.length;d < e;d++) {
                if(!uc(a[d], b[d], c)) {
                  c && c.push("earlier comparisons indicate mismatch at array item #" + d);
                  a = l;
                  break a
                }
              }
              c && c.push("ascending from array");
              a = j
            }
          }
        }else {
          if(a.ie == Aa && b.ie == Aa) {
            a: {
              c && c.push("descending into object");
              for(var f in a) {
                if(!(f in b)) {
                  c && c.push("property " + f + " missing on right object");
                  a = l;
                  break a
                }
                if(!uc(a[f], b[f], c)) {
                  c && c.push("earlier comparisons indicate mismatch at property " + f);
                  a = l;
                  break a
                }
              }
              for(f in b) {
                if(!(f in a)) {
                  c && c.push("property " + f + " missing on left object");
                  a = l;
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
  this.Xe = a;
  this.Pb = b
}
Q.prototype.K = function(a, b) {
  return ha(a) && this.constructor == a.constructor && uc(this.Pb, a.Pb, b)
};
Q.prototype.w = function(a, b) {
  a.push("new ", this.Xe, "(");
  for(var c = "", d = 0;d < this.Pb.length;d++) {
    a.push(c), c = ", ", N(this.Pb[d], a, b)
  }
  a.push(")")
};
var vc, wc;
function xc(a, b) {
  Q.call(this, "Question", [a, b]);
  this.body = a;
  this.da = b
}
A(xc, Q);
function yc(a, b) {
  Q.call(this, "OkayAnswer", [a, b]);
  this.body = a;
  this.da = b
}
A(yc, Q);
function zc(a, b) {
  Q.call(this, "KnownErrorAnswer", [a, b]);
  this.body = a;
  this.da = b
}
A(zc, Q);
function Ac(a, b) {
  Q.call(this, "UnknownErrorAnswer", [a, b]);
  this.body = a;
  this.da = b
}
A(Ac, Q);
function Bc(a) {
  Q.call(this, "Cancellation", [a]);
  this.da = a
}
A(Bc, Q);
function Cc(a) {
  Q.call(this, "Notification", [a]);
  this.body = a
}
A(Cc, Q);
function Dc(a) {
  if(a instanceof xc) {
    return"Q"
  }
  if(a instanceof yc) {
    return"K"
  }
  if(a instanceof zc) {
    return"E"
  }
  if(a instanceof Ac) {
    return"U"
  }
  if(a instanceof Bc) {
    return"C"
  }
  if(a instanceof Cc) {
    return"#"
  }
  g(Error("qanTypeToCode bug"))
}
function Ec(a) {
  var b = Dc(a);
  if(a instanceof Bc) {
    return"" + a.da + b
  }
  x(a.body) || g(Error("qanFrame.body must be a string, was " + O(a.body)));
  return a instanceof Cc ? a.body + b : a.body + "|" + ("" + a.da) + b
}
function Fc(a) {
  B.call(this);
  this.message = a
}
A(Fc, B);
function Gc(a) {
  a = fc(a);
  a === k && g(new Fc("bad qid"));
  return a
}
function Hc(a) {
  a || g(new Fc("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if("#" == b) {
    return new Cc(cc(a))
  }
  if("C" == b) {
    var c = Gc(cc(a));
    return new Bc(c)
  }
  a = a.split("|");
  c = a.splice(a.length - 1, a.length);
  0 < a.length && c.splice(0, 0, a.join("|"));
  a = c[0];
  c = c[1];
  t(c) || g(new Fc("Expected pipe char in frame"));
  c = Gc(cc(c));
  if("Q" == b) {
    return new xc(a, c)
  }
  if("K" == b) {
    return new yc(a, c)
  }
  if("E" == b) {
    return new zc(a, c)
  }
  if("U" == b) {
    return new Ac(a, c)
  }
  g(new Fc("Invalid QAN frame type " + O(b)))
}
function Ic(a) {
  B.call(this);
  this.body = a
}
A(Ic, B);
Ic.prototype.message = "KnownError with arbitrary body";
Ic.prototype.w = function(a, b) {
  a.push("new KnownError(");
  N(this.body, a, b);
  a.push(")")
};
function Jc(a) {
  B.call(this);
  this.body = a
}
A(Jc, B);
Jc.prototype.message = "UnknownError with arbitrary body";
Jc.prototype.w = function(a, b) {
  a.push("new UnknownError(");
  N(this.body, a, b);
  a.push(")")
};
function Kc(a) {
  B.call(this);
  this.message = a
}
A(Kc, B);
function R(a, b, c, d) {
  this.Yc = a;
  this.ib = b;
  this.ea = c;
  this.Bb = d;
  this.Ob = 0;
  this.ma = new P;
  this.Za = new P
}
p = R.prototype;
p.w = function(a) {
  a.push("<QANHelper asked ", "" + this.Ob, " questions, waiting for ", "" + this.ma.B(), " peer answers and ", "" + this.Za.B(), " local answers>")
};
p.ud = function(a) {
  if(a instanceof yc || a instanceof zc || a instanceof Ac) {
    var b = a.da, c = this.ma.get(b);
    this.ma.remove(b);
    t(c) ? c !== k && (a instanceof yc ? c.N(a.body) : a instanceof zc ? c.Q(new Ic(a.body)) : a instanceof Ac ? c.Q(new Jc(a.body)) : g(Error("handleQANFrame bug"))) : this.Bb("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof Cc) {
      try {
        this.Yc(a.body, l)
      }catch(d) {
        this.ib("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof xc) {
        if(b = a.da, this.Za.U(b)) {
          this.Bb("Received Question with duplicate qid: " + b)
        }else {
          c = rc(this.Yc, [a.body, j]);
          this.Za.set(b, c);
          var e = this;
          c.$(function(a) {
            var c = b;
            e.Za.remove(c);
            e.ea(new yc(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Za.remove(c);
            a instanceof Ic ? e.ea(new zc(a.body, c)) : a instanceof Ib ? e.ea(new Ac("CancelledError", c)) : (e.ib("Peer's Question #" + c + " caused uncaught exception", a), e.ea(new Ac("Uncaught exception", c)));
            return k
          });
          c.sb(function(a) {
            this.ib("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof Bc && (b = a.da, c = this.Za.get(b), t(c) && c.cancel())
      }
    }
  }
};
p.me = function(a) {
  var b = this.Ob + 1;
  this.ea(new xc(a, b));
  this.Ob += 1;
  var c = this, a = new M(function() {
    c.ma.set(b, k);
    c.ea(new Bc(b))
  });
  this.ma.set(b, a);
  return a
};
p.Te = function(a) {
  this.ea(new Cc(a))
};
p.md = function(a) {
  for(var b = this.ma.V(), c = 0;c < b.length;c++) {
    var d = this.ma.get(b[c]);
    t(d) && (this.ma.set(b[c], k), d.Q(new Kc(a)))
  }
};
function Lc() {
  this.Ud = oa()
}
var Mc = new Lc;
Lc.prototype.set = aa("Ud");
Lc.prototype.reset = function() {
  this.set(oa())
};
Lc.prototype.get = o("Ud");
function Nc(a) {
  this.Ve = a || "";
  this.cf = Mc
}
Nc.prototype.be = j;
Nc.prototype.bf = j;
Nc.prototype.af = j;
Nc.prototype.ce = l;
function Oc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Pc(a, b) {
  var c = (a.ee - b) / 1E3, d = c.toFixed(3), e = 0;
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
function Qc(a) {
  Nc.call(this, a)
}
A(Qc, Nc);
Qc.prototype.ce = j;
var Rc;
function Sc(a, b) {
  var c;
  c = a.className;
  c = x(c) && c.match(/\S+/g) || [];
  for(var d = kb(arguments, 1), e = c.length + d.length, f = c, i = 0;i < d.length;i++) {
    0 <= cb(f, d[i]) || f.push(d[i])
  }
  a.className = c.join(" ");
  return c.length == e
}
;var Tc = !E || Ta();
!Ja && !E || E && Ta() || Ja && G("1.9.1");
E && G("9");
function Uc(a) {
  return a ? new Vc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Rc || (Rc = new Vc)
}
function Wc(a) {
  return x(a) ? document.getElementById(a) : a
}
function Xc(a, b) {
  Wa(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in Yc ? a.setAttribute(Yc[d], b) : 0 == d.lastIndexOf("aria-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var Yc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Zc(a, b, c) {
  return $c(document, arguments)
}
function $c(a, b) {
  var c = b[0], d = b[1];
  if(!Tc && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', C(d.name), '"');
    if(d.type) {
      c.push(' type="', C(d.type), '"');
      var e = {};
      $a(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (x(d) ? c.className = d : v(d) ? Sc.apply(k, [c].concat(d)) : Xc(c, d));
  2 < b.length && ad(a, c, b, 2);
  return c
}
function ad(a, b, c, d) {
  function e(c) {
    c && b.appendChild(x(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    fa(f) && !(ha(f) && 0 < f.nodeType) ? db(bd(f) ? jb(f) : f, e) : e(f)
  }
}
function cd(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function bd(a) {
  if(a && "number" == typeof a.length) {
    if(ha(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(ia(a)) {
      return"function" == typeof a.item
    }
  }
  return l
}
function Vc(a) {
  this.za = a || r.document || document
}
p = Vc.prototype;
p.pd = Uc;
p.Ba = function(a) {
  return x(a) ? this.za.getElementById(a) : a
};
function dd(a, b) {
  var c;
  c = a.za;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.bb = function(a, b, c) {
  return $c(this.za, arguments)
};
p.createElement = function(a) {
  return this.za.createElement(a)
};
p.createTextNode = function(a) {
  return this.za.createTextNode(a)
};
p.appendChild = function(a, b) {
  a.appendChild(b)
};
p.append = function(a, b) {
  ad(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
};
p.contains = function(a, b) {
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
function ed(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
function fd(a) {
  E ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[F ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function gd(a) {
  this.n = new P;
  a && this.$b(a)
}
function hd(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ja(a) : b.substr(0, 1) + a
}
p = gd.prototype;
p.B = function() {
  return this.n.B()
};
p.add = function(a) {
  this.n.set(hd(a), a)
};
p.$b = function(a) {
  for(var a = ic(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Fc = function(a) {
  for(var a = ic(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.n.remove(hd(a))
};
p.clear = function() {
  this.n.clear()
};
p.fb = function() {
  return this.n.fb()
};
p.contains = function(a) {
  return this.n.U(hd(a))
};
p.C = function() {
  return this.n.C()
};
p.T = function() {
  return new gd(this)
};
p.K = function(a) {
  return this.B() == hc(a) && id(this, a)
};
function id(a, b) {
  var c = hc(b);
  if(a.B() > c) {
    return l
  }
  !(b instanceof gd) && 5 < c && (b = new gd(b));
  return mc(a, function(a) {
    if("function" == typeof b.contains) {
      a = b.contains(a)
    }else {
      if("function" == typeof b.dc) {
        a = b.dc(a)
      }else {
        if(fa(b) || x(b)) {
          a = 0 <= cb(b, a)
        }else {
          a: {
            for(var c in b) {
              if(b[c] == a) {
                a = j;
                break a
              }
            }
            a = l
          }
        }
      }
    }
    return a
  })
}
;function jd(a) {
  return kd(a || arguments.callee.caller, [])
}
function kd(a, b) {
  var c = [];
  if(0 <= cb(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(ld(a) + "(");
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
            f = (f = ld(f)) ? f : "[fn]";
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
        c.push(kd(a.caller, b))
      }catch(i) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function ld(a) {
  if(md[a]) {
    return md[a]
  }
  a = "" + a;
  if(!md[a]) {
    var b = /function ([^\(]+)/.exec(a);
    md[a] = b ? b[1] : "[Anonymous]"
  }
  return md[a]
}
var md = {};
function nd(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
nd.prototype.lc = k;
nd.prototype.kc = k;
var od = 0;
nd.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || od++;
  this.ee = d || oa();
  this.Ra = a;
  this.Jd = b;
  this.Pe = c;
  delete this.lc;
  delete this.kc
};
nd.prototype.Ic = aa("Ra");
function S(a) {
  this.Re = a
}
S.prototype.t = k;
S.prototype.Ra = k;
S.prototype.ja = k;
S.prototype.Na = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var pd = new T("OFF", Infinity), qd = new T("SHOUT", 1200), rd = new T("SEVERE", 1E3), sd = new T("WARNING", 900), ud = new T("INFO", 800), vd = new T("CONFIG", 700), wd = new T("FINE", 500), xd = new T("FINER", 400), yd = new T("FINEST", 300), zd = new T("ALL", 0);
function U(a) {
  return V.rd(a)
}
p = S.prototype;
p.getParent = o("t");
p.Ic = aa("Ra");
function Ad(a) {
  if(a.Ra) {
    return a.Ra
  }
  if(a.t) {
    return Ad(a.t)
  }
  za("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= Ad(this).value) {
    a = this.He(a, b, c);
    b = "log:" + a.Jd;
    r.console && (r.console.timeStamp ? r.console.timeStamp(b) : r.console.markTimeline && r.console.markTimeline(b));
    r.msWriteProfilerMark && r.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Na) {
        for(var e = 0, f = h;f = c.Na[e];e++) {
          f(d)
        }
      }
      b = b.getParent()
    }
  }
};
p.He = function(a, b, c) {
  var d = new nd(a, "" + b, this.Re);
  if(c) {
    d.lc = c;
    var e;
    var f = arguments.callee.caller;
    try {
      var i;
      var m = da("window.location.href");
      if(x(c)) {
        i = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:m, stack:"Not available"}
      }else {
        var n, u, I = l;
        try {
          n = c.lineNumber || c.Oe || "Not available"
        }catch(q) {
          n = "Not available", I = j
        }
        try {
          u = c.fileName || c.filename || c.sourceURL || m
        }catch(w) {
          u = "Not available", I = j
        }
        i = I || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:u, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + C(i.message) + '\nUrl: <a href="view-source:' + i.fileName + '" target="_new">' + i.fileName + "</a>\nLine: " + i.lineNumber + "\n\nBrowser stack:\n" + C(i.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + C(jd(f) + "-> ")
    }catch(D) {
      e = "Exception trying to expose exception! You win, we lose. " + D
    }
    d.kc = e
  }
  return d
};
p.$e = function(a, b) {
  this.log(qd, a, b)
};
p.G = function(a, b) {
  this.log(rd, a, b)
};
p.q = function(a, b) {
  this.log(sd, a, b)
};
p.info = function(a, b) {
  this.log(ud, a, b)
};
p.ue = function(a, b) {
  this.log(vd, a, b)
};
p.j = function(a, b) {
  this.log(wd, a, b)
};
p.De = function(a, b) {
  this.log(xd, a, b)
};
p.s = function(a, b) {
  this.log(yd, a, b)
};
var V = {Kb:{}, mb:k, xd:function() {
  V.mb || (V.mb = new S(""), V.Kb[""] = V.mb, V.mb.Ic(vd))
}, vg:function() {
  return V.Kb
}, nc:function() {
  V.xd();
  return V.mb
}, rd:function(a) {
  V.xd();
  return V.Kb[a] || V.we(a)
}, ug:function(a) {
  return function(b) {
    (a || V.nc()).G("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Oe + ")")
  }
}, we:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.rd(a.substr(0, c));
  c.ja || (c.ja = {});
  c.ja[d] = b;
  b.t = c;
  return V.Kb[a] = b
}};
function Bd(a) {
  this.Sd = y(this.ke, this);
  this.od = new Qc;
  this.zd = this.od.be = l;
  this.h = a;
  this.Be = this.h.ownerDocument || this.h.document;
  var a = Uc(this.h), b = k;
  if(E) {
    b = a.za.createStyleSheet(), fd(b)
  }else {
    var c = dd(a, "head")[0];
    c || (b = dd(a, "body")[0], c = a.bb("head"), b.parentNode.insertBefore(c, b));
    b = a.bb("style");
    fd(b);
    a.appendChild(c, b)
  }
  this.h.className += " logdiv"
}
Bd.prototype.Ze = function(a) {
  if(a != this.zd) {
    var b = V.nc();
    if(a) {
      var c = this.Sd;
      b.Na || (b.Na = []);
      b.Na.push(c)
    }else {
      (b = b.Na) && hb(b, this.Sd)
    }
    this.zd = a
  }
};
Bd.prototype.ke = function(a) {
  var b = 100 >= this.h.scrollHeight - this.h.scrollTop - this.h.clientHeight, c = this.Be.createElement("div");
  c.className = "logmsg";
  var d = this.od, e;
  switch(a.Ra.value) {
    case qd.value:
      e = "dbg-sh";
      break;
    case rd.value:
      e = "dbg-sev";
      break;
    case sd.value:
      e = "dbg-w";
      break;
    case ud.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var f = [];
  f.push(d.Ve, " ");
  if(d.be) {
    var i = new Date(a.ee);
    f.push("[", Oc(i.getFullYear() - 2E3) + Oc(i.getMonth() + 1) + Oc(i.getDate()) + " " + Oc(i.getHours()) + ":" + Oc(i.getMinutes()) + ":" + Oc(i.getSeconds()) + "." + Oc(Math.floor(i.getMilliseconds() / 10)), "] ")
  }
  d.bf && f.push("[", wa(Pc(a, d.cf.get())), "s] ");
  d.af && f.push("[", C(a.Pe), "] ");
  f.push('<span class="', e, '">', qa(wa(C(a.Jd))));
  d.ce && a.lc && f.push("<br>", qa(wa(a.kc || "")));
  f.push("</span><br>");
  c.innerHTML = f.join("");
  this.h.appendChild(c);
  b && (this.h.scrollTop = this.h.scrollHeight)
};
Bd.prototype.clear = function() {
  this.h.innerHTML = ""
};
var Cd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function Dd(a, b) {
  var c = a.match(Cd), d = b.match(Cd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function Ed(a, b) {
  var c;
  if(a instanceof Ed) {
    this.L = t(b) ? b : a.L, Fd(this, a.ta), c = a.Ja, W(this), this.Ja = c, Gd(this, a.ka), Hd(this, a.Ua), Id(this, a.na), Jd(this, a.R.T()), c = a.Aa, W(this), this.Aa = c
  }else {
    if(a && (c = ("" + a).match(Cd))) {
      this.L = !!b;
      Fd(this, c[1] || "", j);
      var d = c[2] || "";
      W(this);
      this.Ja = d ? decodeURIComponent(d) : "";
      Gd(this, c[3] || "", j);
      Hd(this, c[4]);
      Id(this, c[5] || "", j);
      Jd(this, c[6] || "", j);
      c = c[7] || "";
      W(this);
      this.Aa = c ? decodeURIComponent(c) : ""
    }else {
      this.L = !!b, this.R = new Kd(k, 0, this.L)
    }
  }
}
p = Ed.prototype;
p.ta = "";
p.Ja = "";
p.ka = "";
p.Ua = k;
p.na = "";
p.Aa = "";
p.Ne = l;
p.L = l;
p.toString = function() {
  var a = [], b = this.ta;
  b && a.push(Ld(b, Md), ":");
  if(b = this.ka) {
    a.push("//");
    var c = this.Ja;
    c && a.push(Ld(c, Md), "@");
    a.push(encodeURIComponent("" + b));
    b = this.Ua;
    b != k && a.push(":", "" + b)
  }
  if(b = this.na) {
    this.ka && "/" != b.charAt(0) && a.push("/"), a.push(Ld(b, "/" == b.charAt(0) ? Nd : Od))
  }
  (b = this.R.toString()) && a.push("?", b);
  (b = this.Aa) && a.push("#", Ld(b, Pd));
  return a.join("")
};
p.T = function() {
  return new Ed(this)
};
function Fd(a, b, c) {
  W(a);
  a.ta = c ? b ? decodeURIComponent(b) : "" : b;
  a.ta && (a.ta = a.ta.replace(/:$/, ""))
}
function Gd(a, b, c) {
  W(a);
  a.ka = c ? b ? decodeURIComponent(b) : "" : b
}
function Hd(a, b) {
  W(a);
  b ? (b = Number(b), (isNaN(b) || 0 > b) && g(Error("Bad port number " + b)), a.Ua = b) : a.Ua = k
}
function Id(a, b, c) {
  W(a);
  a.na = c ? b ? decodeURIComponent(b) : "" : b
}
function Jd(a, b, c) {
  W(a);
  b instanceof Kd ? (a.R = b, a.R.Hc(a.L)) : (c || (b = Ld(b, Qd)), a.R = new Kd(b, 0, a.L))
}
function W(a) {
  a.Ne && g(Error("Tried to modify a read-only Uri"))
}
p.Hc = function(a) {
  this.L = a;
  this.R && this.R.Hc(a);
  return this
};
function Rd(a) {
  return a instanceof Ed ? a.T() : new Ed(a, h)
}
function Ld(a, b) {
  return x(a) ? encodeURI(a).replace(b, Sd) : k
}
function Sd(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Md = /[#\/\?@]/g, Od = /[\#\?:]/g, Nd = /[\#\?]/g, Qd = /[\#\?@]/g, Pd = /#/g;
function Kd(a, b, c) {
  this.J = a || k;
  this.L = !!c
}
function Td(a) {
  if(!a.l && (a.l = new P, a.c = 0, a.J)) {
    for(var b = a.J.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), e = k, f = k;
      0 <= d ? (e = b[c].substring(0, d), f = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = Ud(a, e);
      a.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
    }
  }
}
p = Kd.prototype;
p.l = k;
p.c = k;
p.B = function() {
  Td(this);
  return this.c
};
p.add = function(a, b) {
  Td(this);
  this.J = k;
  a = Ud(this, a);
  if(this.U(a)) {
    var c = this.l.get(a);
    v(c) ? c.push(b) : this.l.set(a, [c, b])
  }else {
    this.l.set(a, b)
  }
  this.c++;
  return this
};
p.remove = function(a) {
  Td(this);
  a = Ud(this, a);
  if(this.l.U(a)) {
    this.J = k;
    var b = this.l.get(a);
    v(b) ? this.c -= b.length : this.c--;
    return this.l.remove(a)
  }
  return l
};
p.clear = function() {
  this.l = this.J = k;
  this.c = 0
};
p.fb = function() {
  Td(this);
  return 0 == this.c
};
p.U = function(a) {
  Td(this);
  a = Ud(this, a);
  return this.l.U(a)
};
p.dc = function(a) {
  var b = this.C();
  return 0 <= cb(b, a)
};
p.V = function() {
  Td(this);
  for(var a = this.l.C(), b = this.l.V(), c = [], d = 0;d < b.length;d++) {
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
p.C = function(a) {
  Td(this);
  var b = [];
  if(a) {
    this.U(a) && (b = ib(b, this.l.get(Ud(this, a))))
  }else {
    for(var a = this.l.C(), c = 0;c < a.length;c++) {
      b = ib(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  Td(this);
  this.J = k;
  a = Ud(this, a);
  if(this.U(a)) {
    var c = this.l.get(a);
    v(c) ? this.c -= c.length : this.c--
  }
  this.l.set(a, b);
  this.c++;
  return this
};
p.get = function(a, b) {
  var c = a ? this.C(a) : [];
  return 0 < c.length ? c[0] : b
};
p.toString = function() {
  if(this.J) {
    return this.J
  }
  if(!this.l) {
    return""
  }
  for(var a = [], b = this.l.V(), c = 0;c < b.length;c++) {
    for(var d = b[c], e = encodeURIComponent("" + d), d = this.C(d), f = 0;f < d.length;f++) {
      var i = e;
      "" !== d[f] && (i += "=" + encodeURIComponent("" + d[f]));
      a.push(i)
    }
  }
  return this.J = a.join("&")
};
p.T = function() {
  var a = new Kd;
  a.J = this.J;
  this.l && (a.l = this.l.T());
  return a
};
function Ud(a, b) {
  var c = "" + b;
  a.L && (c = c.toLowerCase());
  return c
}
p.Hc = function(a) {
  a && !this.L && (Td(this), this.J = k, lc(this.l, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.L = a
};
function Vd(a) {
  var b = s(a);
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
;function Wd(a, b) {
  this.Ka = a;
  this.Ga = b
}
Wd.prototype.K = function(a) {
  return a instanceof Wd && this.Ka == a.Ka && this.Ga.join(",") == a.Ga
};
Wd.prototype.w = function(a, b) {
  a.push("new SACK(", "" + this.Ka, ", ");
  N(this.Ga, a, b);
  a.push(")")
};
function Xd() {
  this.F = new P
}
Xd.prototype.ya = -1;
Xd.prototype.H = 0;
Xd.prototype.append = function(a) {
  var b = Vd(a);
  this.F.set(this.ya + 1, [a, b]);
  this.ya += 1;
  this.H += b
};
Xd.prototype.w = function(a) {
  a.push("<Queue with ", "" + this.F.B(), " item(s), counter=#", "" + this.ya, ", size=", "" + this.H, ">")
};
function Yd(a) {
  a = a.F.V();
  lb(a);
  return a
}
function Zd() {
  this.wa = new P
}
Zd.prototype.Ea = -1;
Zd.prototype.H = 0;
function $d(a) {
  var b = a.wa.V();
  lb(b);
  return new Wd(a.Ea, b)
}
var ae = {};
function be(a, b) {
  switch(s(b)) {
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
        a.push('<property id="', d, '">'), be(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != s(b[c]) && (a.push('<property id="', C(c), '">'), be(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function ce(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var f = e.length, i = 1;i < f;i++) {
    be(d, e[i])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var de = l, ee = "";
function fe(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var ge = navigator.plugins["Shockwave Flash"];
  ge && (de = j, ge.description && (ee = fe(ge.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (de = j, ee = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var he = navigator.mimeTypes["application/x-shockwave-flash"];
    (de = he && he.enabledPlugin) && (ee = fe(he.enabledPlugin.description))
  }else {
    try {
      var ie = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), de = j, ee = fe(ie.GetVariable("$version"))
    }catch(je) {
      try {
        ie = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), de = j, ee = "6.0.21"
      }catch(ke) {
        try {
          ie = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), de = j, ee = fe(ie.GetVariable("$version"))
        }catch(le) {
        }
      }
    }
  }
}
var me = ee;
function ne(a) {
  this.Je = a;
  this.g = []
}
A(ne, J);
var oe = [];
ne.prototype.Fc = function() {
  db(this.g, Ab);
  this.g.length = 0
};
ne.prototype.d = function() {
  ne.m.d.call(this);
  this.Fc()
};
ne.prototype.handleEvent = function() {
  g(Error("EventHandler.handleEvent not implemented"))
};
function pe() {
}
pe.qd = function() {
  return pe.yd ? pe.yd : pe.yd = new pe
};
pe.prototype.Se = 0;
pe.qd();
function qe(a) {
  this.xb = a || Uc()
}
A(qe, Gb);
p = qe.prototype;
p.Me = pe.qd();
p.W = k;
p.Da = l;
p.h = k;
p.t = k;
p.ja = k;
p.wb = k;
p.of = l;
function re(a) {
  return a.W || (a.W = ":" + (a.Me.Se++).toString(36))
}
p.Ba = o("h");
p.getParent = o("t");
p.Jc = function(a) {
  this.t && this.t != a && g(Error("Method not supported"));
  qe.m.Jc.call(this, a)
};
p.pd = o("xb");
p.bb = function() {
  this.h = this.xb.createElement("div")
};
function se(a, b) {
  a.Da && g(Error("Component already rendered"));
  a.h || a.bb();
  b ? b.insertBefore(a.h, k) : a.xb.za.body.appendChild(a.h);
  (!a.t || a.t.Da) && a.yb()
}
p.yb = function() {
  this.Da = j;
  te(this, function(a) {
    !a.Da && a.Ba() && a.yb()
  })
};
function ue(a) {
  te(a, function(a) {
    a.Da && ue(a)
  });
  a.Fb && a.Fb.Fc();
  a.Da = l
}
p.d = function() {
  qe.m.d.call(this);
  this.Da && ue(this);
  this.Fb && (this.Fb.b(), delete this.Fb);
  te(this, function(a) {
    a.b()
  });
  !this.of && this.h && cd(this.h);
  this.t = this.h = this.wb = this.ja = k
};
function te(a, b) {
  a.ja && db(a.ja, b, h)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = x(a) ? a : re(a), d;
    this.wb && c ? (d = this.wb, d = (c in d ? d[c] : h) || k) : d = k;
    a = d;
    c && a && (d = this.wb, c in d && delete d[c], hb(this.ja, a), b && (ue(a), a.h && cd(a.h)), c = a, c == k && g(Error("Unable to set parent component")), c.t = k, qe.m.Jc.call(c, k))
  }
  a || g(Error("Child is not in parent component"));
  return a
};
function ve(a, b) {
  this.xb = b || Uc();
  this.Fe = a;
  this.jc = new ne(this);
  this.Cb = new P
}
A(ve, qe);
p = ve.prototype;
p.a = U("goog.ui.media.FlashObject");
p.qf = "window";
p.Xc = "#000000";
p.le = "sameDomain";
function we(a, b, c) {
  a.Uc = x(b) ? b : Math.round(b) + "px";
  a.pc = x(c) ? c : Math.round(c) + "px";
  a.Ba() && (b = a.Ba() ? a.Ba().firstChild : k, c = a.Uc, a = a.pc, a == h && g(Error("missing height argument")), b.style.width = ed(c), b.style.height = ed(a))
}
p.yb = function() {
  ve.m.yb.call(this);
  var a = this.Ba(), b;
  b = E ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = E ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = pa(c, this.qf), d = this.Cb.V(), e = this.Cb.C(), f = [], i = 0;i < d.length;i++) {
    f.push(encodeURIComponent("" + d[i]) + "=" + encodeURIComponent("" + e[i]))
  }
  b = pa(b, re(this), re(this), "goog-ui-media-flash-object", C(this.Fe), C(f.join("&")), this.Xc, this.le, c);
  a.innerHTML = b;
  this.Uc && this.pc && we(this, this.Uc, this.pc);
  a = this.jc;
  b = this.Ba();
  c = Xa(nb);
  v(c) || (oe[0] = c, c = oe);
  for(d = 0;d < c.length;d++) {
    a.g.push(vb(b, c[d], qb || a, l, a.Je || a))
  }
};
p.bb = function() {
  this.Wd != k && !(0 <= xa(me, this.Wd)) && (this.a.q("Required flash version not found:" + this.Wd), g(Error("Method not supported")));
  var a = this.pd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.h = a
};
p.d = function() {
  ve.m.d.call(this);
  this.Cb = k;
  this.jc.b();
  this.jc = k
};
function xe(a) {
  B.call(this, a)
}
A(xe, B);
xe.prototype.name = "cw.loadflash.FlashLoadFailed";
r.__loadFlashObject_callbacks = {};
function ye(a, b, c) {
  function d() {
    e && delete r.__loadFlashObject_callbacks[e]
  }
  var e;
  if(Ja && !G("1.8.1.20")) {
    return Qb(new xe("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(0 <= xa(me, "9"))) {
    return Qb(new xe("Need Flash Player 9+; had " + (me ? me : "none")))
  }
  var f;
  e = "_" + bc();
  var i = new M(d);
  r.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      i.N(Wc(f))
    }, 0)
  };
  b.Cb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  f = re(b);
  se(b, c);
  return i
}
function ze(a, b, c) {
  var d = ye(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  d.Vc(function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function Ae(a, b) {
  this.W = "_" + bc();
  this.Wb = a;
  this.pa = b;
  this.va = a.va
}
A(Ae, J);
p = Ae.prototype;
p.Sa = j;
p.fc = l;
p.a = U("cw.net.FlashSocket");
p.w = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.W);
  a.push("'>")
};
function Be(a, b, c) {
  "frames" == b ? (a = a.pa, Ce(a.z), De(a.z, c)) : "stillreceiving" == b ? (c = a.pa, c.a.s("onstillreceiving"), Ce(c.z)) : "connect" == b ? (c = a.pa, c.a.info("onconnect"), Ce(c.z), a = c.ab, c.ab = k, a.length && (c.a.s("onconnect: Writing " + a.length + " buffered frame(s)."), c.Tb.rb(a))) : "close" == b ? (a.Sa = l, a.b()) : "ioerror" == b ? (a.Sa = l, b = a.pa, b.a.q("onioerror: " + O(c)), Ee(b.z, l), a.b()) : "securityerror" == b ? (a.Sa = l, b = a.pa, b.a.q("onsecurityerror: " + O(c)), Ee(b.z, 
  l), a.b()) : g(Error("bad event: " + b))
}
function Fe(a) {
  a.fc = j;
  a.Sa = l;
  a.b()
}
p.cc = function(a, b) {
  try {
    var c = this.va.CallFunction(ce("__FC_connect", this.W, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.G("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), Fe(this)
  }
  '"OK"' != c && g(Error("__FC_connect failed? ret: " + c))
};
p.rb = function(a) {
  try {
    var b = this.va.CallFunction(ce("__FC_writeFrames", this.W, a))
  }catch(c) {
    return this.a.G("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), Fe(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.q("Flash no longer knows of " + this.W + "; disposing."), this.b()) : g(Error("__FC_writeFrames failed? ret: " + b)))
};
p.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Sa);
  Ae.m.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Sa) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(ce("__FC_close", this.W)))
    }catch(b) {
      this.a.G("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.fc = j
    }
  }
  if(this.fc) {
    a = this.pa, a.a.q("oncrash"), Ee(a.z, j)
  }else {
    this.pa.onclose()
  }
  delete this.pa;
  delete this.Wb.Oa[this.W]
};
function Ge(a, b) {
  this.o = a;
  this.va = b;
  this.Oa = {};
  this.bc = "__FST_" + bc();
  r[this.bc] = y(this.Ae, this);
  var c = b.CallFunction(ce("__FC_setCallbackFunc", this.bc));
  '"OK"' != c && g(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(Ge, J);
p = Ge.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.w = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Oa, a, b);
  a.push(">")
};
p.gc = function(a) {
  a = new Ae(this, a);
  return this.Oa[a.W] = a
};
p.ye = function(a, b, c, d) {
  var e = this.Oa[a];
  e ? "frames" == b && d ? (Be(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : Be(e, b, c) : this.a.q("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
p.Ae = function(a, b, c, d) {
  try {
    Sb(this.o, this.ye, this, [a, b, c, d])
  }catch(e) {
    r.window.setTimeout(function() {
      g(e)
    }, 0)
  }
};
p.d = function() {
  Ge.m.d.call(this);
  for(var a = Xa(this.Oa);a.length;) {
    a.pop().b()
  }
  delete this.Oa;
  delete this.va;
  r[this.bc] = h
};
function He(a) {
  this.z = a;
  this.ab = []
}
A(He, J);
p = He.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.rb = function(a) {
  this.ab ? (this.a.s("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.ab.push.apply(this.ab, a)) : (this.a.s("writeFrames: Writing " + a.length + " frame(s)."), this.Tb.rb(a))
};
p.cc = function(a, b) {
  this.Tb.cc(a, b)
};
p.onclose = function() {
  this.a.info("onclose");
  Ee(this.z, l)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  He.m.d.call(this);
  this.Tb.b();
  delete this.z
};
var Ie = [];
function Je() {
  var a = new M;
  Ie.push(a);
  return a
}
function Ke(a) {
  var b = Ie;
  Ie = [];
  db(b, function(b) {
    b.N(a)
  });
  return k
}
function Ne(a) {
  var b = Ie;
  Ie = [];
  db(b, function(b) {
    b.Q(a)
  });
  return k
}
function Oe(a, b) {
  if(Ie.length) {
    return Je()
  }
  var c = new ve(b + "FlashConnector.swf?cb=" + Pe);
  c.Xc = "#777777";
  we(c, 300, 30);
  var d = Wc("minerva-elements");
  d || g(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = Wc("minerva-elements-FlashConnectorSwf");
  e || (e = Zc("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  vc = ze(a.A, c, e);
  c = Je();
  vc.$(Ke, Ne);
  return c
}
;function Qe() {
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
function Re() {
}
Re.prototype.K = function(a, b) {
  return!(a instanceof Re) ? l : uc(Se(this), Se(a), b)
};
Re.prototype.w = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Se(this), a, b);
  a.push(">")
};
function Se(a) {
  return[a.ga, a.Qd, a.wd, a.Vd, a.ob, a.Nc, a.Kd, a.Id, a.xc, a.Gd, a.ge, a.de, a.sa, a.Ib]
}
Re.prototype.I = Y;
Re.prototype.P = function(a) {
  var b = {};
  b.tnum = this.ga;
  b.ver = this.Qd;
  b.format = this.wd;
  b["new"] = this.Vd;
  b.id = this.ob;
  b.ming = this.Nc;
  b.pad = this.Kd;
  b.maxb = this.Id;
  t(this.xc) && (b.maxt = this.xc);
  b.maxia = this.Gd;
  b.tcpack = this.ge;
  b.eeds = this.de;
  b.sack = this.sa instanceof Wd ? cc((new Te(this.sa)).I()) : this.sa;
  b.seenack = this.Ib instanceof Wd ? cc((new Te(this.Ib)).I()) : this.Ib;
  for(var c in b) {
    b[c] === h && delete b[c]
  }
  a.push(Vb(b), "H")
};
function Ue(a) {
  Q.call(this, "StringFrame", [a]);
  this.Pc = a
}
A(Ue, Q);
Ue.prototype.I = Y;
Ue.prototype.P = function(a) {
  a.push(this.Pc, " ")
};
function Ve(a) {
  Q.call(this, "CommentFrame", [a]);
  this.te = a
}
A(Ve, Q);
Ve.prototype.I = Y;
Ve.prototype.P = function(a) {
  a.push(this.te, "^")
};
function We(a) {
  Q.call(this, "SeqNumFrame", [a]);
  this.ae = a
}
A(We, Q);
We.prototype.I = Y;
We.prototype.P = function(a) {
  a.push("" + this.ae, "N")
};
function Xe(a) {
  var b = a.split("|");
  if(2 != b.length) {
    return k
  }
  a: {
    var c = b[1], a = gc;
    if(ec.test(c) && (c = parseInt(c, 10), -1 <= c && c <= a)) {
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
      var f = fc(b[d]);
      if(f == k) {
        return k
      }
      c.push(f)
    }
  }
  return new Wd(a, c)
}
function Te(a) {
  Q.call(this, "SackFrame", [a]);
  this.sa = a
}
A(Te, Q);
Te.prototype.I = Y;
Te.prototype.P = function(a) {
  var b = this.sa;
  a.push(b.Ga.join(","), "|", "" + b.Ka);
  a.push("A")
};
function Ye(a) {
  Q.call(this, "StreamStatusFrame", [a]);
  this.Cd = a
}
A(Ye, Q);
Ye.prototype.I = Y;
Ye.prototype.P = function(a) {
  var b = this.Cd;
  a.push(b.Ga.join(","), "|", "" + b.Ka);
  a.push("T")
};
function Ze() {
  Q.call(this, "StreamCreatedFrame", [])
}
A(Ze, Q);
Ze.prototype.I = Y;
Ze.prototype.P = function(a) {
  a.push("C")
};
function $e() {
  Q.call(this, "YouCloseItFrame", [])
}
A($e, Q);
$e.prototype.I = Y;
$e.prototype.P = function(a) {
  a.push("Y")
};
function af(a, b) {
  Q.call(this, "ResetFrame", [a, b]);
  this.Td = a;
  this.Wc = b
}
A(af, Q);
af.prototype.I = Y;
af.prototype.P = function(a) {
  a.push(this.Td, "|", "" + Number(this.Wc), "!")
};
var bf = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function cf(a) {
  Q.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(cf, Q);
cf.prototype.I = Y;
cf.prototype.P = function(a) {
  a.push(this.reason, "K")
};
function df(a) {
  a || g(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new Ue(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = Xe(cc(a)), a == k && g(new X("bad sack")), new Te(a)
  }
  if("N" == b) {
    return a = fc(cc(a)), a == k && g(new X("bad seqNum")), new We(a)
  }
  if("T" == b) {
    return a = Xe(cc(a)), a == k && g(new X("bad lastSackSeen")), new Ye(a)
  }
  if("Y" == b) {
    return 1 != a.length && g(new X("leading garbage")), new $e
  }
  if("^" == b) {
    return new Ve(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && g(new X("leading garbage")), new Ze
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && g(new X("bad reasonString")), a = {"|0":l, "|1":j}[a.substr(a.length - 3, 2)], a == k && g(new X("bad applicationLevel")), new af(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = bf[a], a == k && g(new X("unknown kill reason: " + a)), new cf(a)
  }
  g(new X("Invalid frame type " + b))
}
;function ef(a, b, c, d) {
  this.contentWindow = a;
  this.Ab = b;
  this.Oc = c;
  this.Ge = d
}
ef.prototype.w = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.Ge, a, b);
  a.push(", expandedUrl=");
  N(this.Ab, a, b);
  a.push(", streams=");
  N(this.Oc, a, b);
  a.push(">")
};
function ff() {
  this.frames = [];
  this.vc = new P
}
ff.prototype.a = U("cw.net.XDRTracker");
function gf(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + Math.floor(Qe()) + ("" + Math.floor(Qe()))
  })
}
function hf(a, b) {
  for(var c = jf, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], f;
    if(f = 0 == e.Oc.length) {
      f = e.Ab;
      var i = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      f = RegExp("^" + i + "$").test(f)
    }
    if(f) {
      return c.a.info("Giving " + O(b) + " existing frame " + O(e)), Pb(e)
    }
  }
  d = bc() + bc();
  e = gf(a);
  f = r.location;
  f instanceof Ed || (f = Rd(f));
  e instanceof Ed || (e = Rd(e));
  var m = f;
  f = e;
  e = m.T();
  (i = !!f.ta) ? Fd(e, f.ta) : i = !!f.Ja;
  if(i) {
    var n = f.Ja;
    W(e);
    e.Ja = n
  }else {
    i = !!f.ka
  }
  i ? Gd(e, f.ka) : i = f.Ua != k;
  n = f.na;
  if(i) {
    Hd(e, f.Ua)
  }else {
    if(i = !!f.na) {
      if("/" != n.charAt(0) && (m.ka && !m.na ? n = "/" + n : (m = e.na.lastIndexOf("/"), -1 != m && (n = e.na.substr(0, m + 1) + n))), ".." == n || "." == n) {
        n = ""
      }else {
        if(!(-1 == n.indexOf("./") && -1 == n.indexOf("/."))) {
          for(var m = 0 == n.lastIndexOf("/", 0), n = n.split("/"), u = [], I = 0;I < n.length;) {
            var q = n[I++];
            "." == q ? m && I == n.length && u.push("") : ".." == q ? ((1 < u.length || 1 == u.length && "" != u[0]) && u.pop(), m && I == n.length && u.push("")) : (u.push(q), m = j)
          }
          n = u.join("/")
        }
      }
    }
  }
  i ? Id(e, n) : i = "" !== f.R.toString();
  i ? Jd(e, f.R.toString() ? decodeURIComponent(f.R.toString()) : "") : i = !!f.Aa;
  i && (f = f.Aa, W(e), e.Aa = f);
  e = e.toString();
  f = ("" + r.location).match(Cd)[3] || k;
  i = e.match(Cd)[3] || k;
  f == i ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = Pb(new ef(r, e, [b], k))) : ((f = Wc("minerva-elements")) || g(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), i = new M, c.vc.set(d, [i, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = Zc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), f.appendChild(c), c = i);
  return c
}
ff.prototype.sf = function(a) {
  var b = this.vc.get(a);
  b || g(Error("Unknown frameId " + O(a)));
  this.vc.remove(b);
  var c = b[0], a = new ef(Wc("minerva-xdrframe-" + a).contentWindow || (Wc("minerva-xdrframe-" + a).contentDocument || Wc("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Wc("minerva-xdrframe-" + a).contentDocument || Wc("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var jf = new ff;
r.__XHRTracker_xdrFrameLoaded = y(jf.sf, jf);
var kf;
kf = l;
var lf = Fa();
lf && (-1 != lf.indexOf("Firefox") || -1 != lf.indexOf("Camino") || -1 != lf.indexOf("iPhone") || -1 != lf.indexOf("iPod") || -1 != lf.indexOf("iPad") || -1 != lf.indexOf("Android") || -1 != lf.indexOf("Chrome") && (kf = j));
var mf = kf;
var Pe = "4bdfc178fc0e508c0cd5efc3fdb09920";
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function nf(a, b, c, d, e, f) {
  M.call(this, e, f);
  this.Fd = a;
  this.hc = [];
  this.nd = !!b;
  this.Ee = !!c;
  this.ve = !!d;
  for(b = 0;b < a.length;b++) {
    a[b].$(y(this.td, this, b, j), y(this.td, this, b, l))
  }
  0 == a.length && !this.nd && this.N(this.hc)
}
A(nf, M);
nf.prototype.Md = 0;
nf.prototype.td = function(a, b, c) {
  this.Md++;
  this.hc[a] = [b, c];
  this.aa || (this.nd && b ? this.N([a, c]) : this.Ee && !b ? this.Q(c) : this.Md == this.Fd.length && this.N(this.hc));
  this.ve && !b && (c = k);
  return c
};
nf.prototype.Q = function(a) {
  nf.m.Q.call(this, a);
  db(this.Fd, function(a) {
    a.cancel()
  })
};
function of(a) {
  a = new nf(a, l, j);
  a.La(function(a) {
    return eb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function pf(a, b) {
  this.rf = a;
  this.Hd = b
}
pf.prototype.tc = 0;
pf.prototype.Lb = 0;
pf.prototype.mc = l;
function qf(a) {
  var b = [];
  if(a.mc) {
    return[b, 2]
  }
  var c = a.tc, d = a.rf.responseText;
  for(a.tc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var e = d.substr(a.Lb, c - a.Lb), e = e.replace(/\r$/, "");
    if(e.length > a.Hd) {
      return a.mc = j, [b, 2]
    }
    b.push(e);
    a.Lb = c += 1
  }
  return a.tc - a.Lb - 1 > a.Hd ? (a.mc = j, [b, 2]) : [b, 1]
}
;function rf(a, b, c) {
  this.z = b;
  this.S = a;
  this.ec = c
}
A(rf, J);
p = rf.prototype;
p.a = U("cw.net.XHRMaster");
p.qa = -1;
p.wc = function(a, b, c) {
  this.ec.__XHRSlave_makeRequest(this.S, a, b, c)
};
p.la = o("qa");
p.zc = function(a, b) {
  1 != b && this.a.G(O(this.S) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  Ce(this.z);
  De(this.z, a)
};
p.Ac = function(a) {
  this.a.j("ongotheaders_: " + O(a));
  var b = k;
  "Content-Length" in a && (b = fc(a["Content-Length"]));
  a = this.z;
  a.a.j(a.k() + " got Content-Length: " + b);
  a.Z == sf && (b == k && (a.a.q("Expected to receive a valid Content-Length, but did not."), b = 5E5), tf(a, 2E3 + 1E3 * (b / 3072)))
};
p.Bc = function(a) {
  1 != a && this.a.j(this.z.k() + "'s XHR's readyState is " + a);
  this.qa = a;
  2 <= this.qa && Ce(this.z)
};
p.yc = function() {
  this.z.b()
};
p.d = function() {
  rf.m.d.call(this);
  delete Z.ca[this.S];
  this.ec.__XHRSlave_dispose(this.S);
  delete this.ec
};
function uf() {
  this.ca = {}
}
A(uf, J);
p = uf.prototype;
p.a = U("cw.net.XHRMasterTracker");
p.gc = function(a, b) {
  var c = "_" + bc(), d = new rf(c, a, b);
  return this.ca[c] = d
};
p.zc = function(a, b, c) {
  if(Ja) {
    for(var d = [], e = 0, f = b.length;e < f;e++) {
      d[e] = b[e]
    }
    b = d
  }else {
    b = ib(b)
  }
  (d = this.ca[a]) ? d.zc(b, c) : this.a.G("onframes_: no master for " + O(a))
};
p.Ac = function(a, b) {
  var c = this.ca[a];
  c ? c.Ac(b) : this.a.G("ongotheaders_: no master for " + O(a))
};
p.Bc = function(a, b) {
  var c = this.ca[a];
  c ? c.Bc(b) : this.a.G("onreadystatechange_: no master for " + O(a))
};
p.yc = function(a) {
  var b = this.ca[a];
  b ? (delete this.ca[b.S], b.yc()) : this.a.G("oncomplete_: no master for " + O(a))
};
p.d = function() {
  uf.m.d.call(this);
  for(var a = Xa(this.ca);a.length;) {
    a.pop().b()
  }
  delete this.ca
};
var Z = new uf;
r.__XHRMaster_onframes = y(Z.zc, Z);
r.__XHRMaster_oncomplete = y(Z.yc, Z);
r.__XHRMaster_ongotheaders = y(Z.Ac, Z);
r.__XHRMaster_onreadystatechange = y(Z.Bc, Z);
function vf(a, b, c) {
  this.X = a;
  this.host = b;
  this.port = c
}
function wf(a, b, c) {
  this.host = a;
  this.port = b;
  this.kf = c
}
function xf(a, b) {
  b || (b = a);
  this.X = a;
  this.ua = b
}
xf.prototype.w = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.X, a, b);
  a.push(", secondaryUrl=");
  N(this.ua, a, b);
  a.push(">")
};
function yf(a, b, c, d) {
  this.X = a;
  this.Pd = b;
  this.ua = c;
  this.Zd = d;
  (!(0 == this.X.indexOf("http://") || 0 == this.X.indexOf("https://")) || !(0 == this.ua.indexOf("http://") || 0 == this.ua.indexOf("https://"))) && g(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Pd.location.href;
  Dd(this.X, a) || g(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.Zd.location.href;
  Dd(this.ua, a) || g(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
yf.prototype.w = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.X, a, b);
  a.push(", secondaryUrl=");
  N(this.ua, a, b);
  a.push(">")
};
var zf = new Ve(";)]}");
function Af(a) {
  r.setTimeout(function() {
    t(a.message) && a.stack && (a.message += "\n" + a.stack);
    g(a)
  }, 0)
}
function Bf(a, b, c) {
  t(b) || (b = j);
  t(c) || (c = j);
  this.Va = a;
  this.nf = b;
  this.gf = c
}
p = Bf.prototype;
p.a = U("cw.net.QANProtocolWrapper");
p.ib = function(a, b) {
  this.a.q(a, b);
  this.gf && Af(b)
};
p.ea = function(a) {
  this.Ya.$d(Ec(a), this.nf)
};
p.Bb = function(a) {
  this.Ya.reset("QANHelper said: " + a)
};
p.ef = function(a) {
  this.Ya = a;
  this.Ec = new R(y(this.Va.bodyReceived, this.Va), y(this.ib, this), y(this.ea, this), y(this.Bb, this));
  this.Va.streamStarted.call(this.Va, this.Ya, this.Ec)
};
p.df = function(a, b) {
  this.Ec.md("Stream reset applicationLevel=" + O(b) + ", reason: " + a);
  this.Va.streamReset.call(this.Va, a, b)
};
p.ff = function(a) {
  try {
    var b = Hc(a)
  }catch(c) {
    c instanceof Fc || g(c);
    this.Ya.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Ec.ud(b)
};
function Cf(a) {
  this.Ya = a
}
Cf.prototype.w = function(a, b) {
  a.push("<UserContext for ");
  N(this.Ya, a, b);
  a.push(">")
};
function Df(a, b, c, d) {
  Q.call(this, "TransportInfo", [a, b, c, d]);
  this.ga = a
}
A(Df, Q);
function $(a, b, c) {
  this.r = a;
  this.o = c ? c : Tb;
  this.pb = new gd;
  this.ob = bc() + bc();
  this.Y = new Xd;
  this.sc = new Zd;
  this.qb = k;
  this.Xb = [];
  this.Ia = new Cf(this);
  this.qe = y(this.lf, this);
  F && (this.qb = yb(r, "load", this.Ye, l, this))
}
A($, J);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Dd = new Wd(-1, []);
p.Ed = new Wd(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = k;
p.onstarted = k;
p.Cc = k;
p.Dc = k;
p.onreset = k;
p.ondisconnect = k;
p.Xa = k;
p.Lc = l;
p.Gc = l;
p.v = 1;
p.Rc = -1;
p.e = k;
p.p = k;
p.kb = k;
p.Mc = 0;
p.Od = 0;
p.Yd = 0;
p.w = function(a, b) {
  a.push("<ClientStream id=");
  N(this.ob, a, b);
  a.push(", state=", "" + this.v);
  a.push(", primary=");
  N(this.e, a, b);
  a.push(", secondary=");
  N(this.p, a, b);
  a.push(", resetting=");
  N(this.kb, a, b);
  a.push(">")
};
p.Ie = o("Ia");
p.oe = function(a) {
  t(a.streamStarted) || g(Error("Protocol is missing required method streamStarted"));
  t(a.streamReset) || g(Error("Protocol is missing required method streamReset"));
  t(a.stringReceived) || g(Error("Protocol is missing required method stringReceived"));
  this.onstarted = y(a.streamStarted, a);
  this.onreset = y(a.streamReset, a);
  this.onstring = y(a.stringReceived, a);
  this.Cc = t(a.transportCreated) ? y(a.transportCreated, a) : k;
  this.Dc = t(a.transportDestroyed) ? y(a.transportDestroyed, a) : k
};
function Ef(a) {
  var b = [-1];
  a.e && b.push(a.e.Ta);
  a.p && b.push(a.p.Ta);
  return Math.max.apply(Math.max, b)
}
function Ff(a) {
  if(!(3 > a.v)) {
    Gf(a);
    var b = 0 != a.Y.F.B(), c = $d(a.sc), d = !c.K(a.Ed) && !(a.e && c.K(a.e.Qa) || a.p && c.K(a.p.Qa)), e = Ef(a);
    if((b = b && e < a.Y.ya) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.xa ? (a.a.s("tryToSend_: writing " + f + " to primary"), d && (d = a.e, c != d.Qa && (!d.fa && !d.u.length && Hf(d), d.u.push(new Te(c)), d.Qa = c)), b && If(a.e, a.Y, e + 1), a.e.ba()) : a.p == k ? a.Lc ? (a.a.s("tryToSend_: creating secondary to send " + f), a.p = Jf(a, l, j), a.p && (b && If(a.p, a.Y, e + 1), a.p.ba())) : (a.a.s("tryToSend_: not creating a secondary because stream might not exist on server"), a.Gc = j) : a.a.s("tryToSend_: need to send " + f + ", but can't right now")
    }
  }
}
function Gf(a) {
  a.Xa != k && (a.o.A.clearTimeout(a.Xa), a.Xa = k)
}
p.lf = function() {
  this.Xa = k;
  Ff(this)
};
function Kf(a) {
  a.Xa == k && (a.Xa = a.o.A.setTimeout(a.qe, 6))
}
p.Ye = function() {
  this.qb = k;
  if(this.e && this.e.Pa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.Zb = j;
    a.b()
  }
  this.p && this.p.Pa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.p, a.Zb = j, a.b())
};
p.$d = function(a, b) {
  t(b) || (b = j);
  3 < this.v && g(Error("sendString: Can't send in state " + this.v));
  b && (x(a) || g(Error("sendString: not a string: " + O(a))), /^([ -~]*)$/.test(a) || g(Error("sendString: string has illegal chars: " + O(a))));
  this.Y.append(a);
  Kf(this)
};
function Jf(a, b, c) {
  var d;
  a.r instanceof yf ? d = sf : a.r instanceof wf ? d = Lf : g(Error("Don't support endpoint " + O(a.r)));
  a.Rc += 1;
  b = new Mf(a.o, a, a.Rc, d, a.r, b);
  a.a.s("Created: " + b.k());
  if(c) {
    if(a.Cc) {
      c = new Df(b.ga, b.ia, b.ra, b.xa);
      try {
        a.Cc.call(a.Ia, c)
      }catch(e) {
        a.a.q("ontransportcreated raised uncaught exception", e), Af(e)
      }
    }
    if(4 == a.v || a.O) {
      return k
    }
  }
  a.pb.add(b);
  return b
}
function Nf(a, b, c) {
  var d = new Of(a.o, a, b, c);
  a.a.s("Created: " + d.k() + ", delay=" + b + ", times=" + c);
  a.pb.add(d);
  return d
}
function Pf(a, b) {
  a.pb.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  a.a.j("Offline: " + b.k());
  var c = 4 == a.v && b.he;
  if(b instanceof Mf && !c) {
    if(a.Dc) {
      var d = new Df(b.ga, b.ia, b.ra, b.xa);
      try {
        a.Dc.call(a.Ia, d)
      }catch(e) {
        a.a.q("ontransportdestroyed raised uncaught exception", e), Af(e)
      }
    }
    if(4 == a.v || a.O) {
      return
    }
  }
  a.Mc = b.oa ? a.Mc + b.oa : 0;
  1 <= a.Mc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), Qf(a, "stream penalty reached limit", l), a.b());
  if(3 < a.v) {
    c ? (a.a.j("Disposing because resettingTransport_ is done."), a.b()) : a.a.j("Not creating a transport because ClientStream is in state " + a.v)
  }else {
    c = b instanceof Of;
    if(!c && b.Zb) {
      var f = F ? mf ? [0, 1] : [9, 20] : [0, 0], c = f[0], d = f[1];
      a.a.s("getDelayForNextTransport_: " + O({delay:c, times:d}))
    }else {
      if(d = b.bd(), b == a.e ? d ? f = ++a.Od : c || (f = a.Od = 0) : d ? f = ++a.Yd : c || (f = a.Yd = 0), c || !f) {
        d = c = 0, a.a.s("getDelayForNextTransport_: " + O({count:f, delay:c, times:d}))
      }else {
        var i = 2E3 * Math.min(f, 3), m = Math.floor(4E3 * Math.random()) - 2E3, n = Math.max(0, b.fe - b.Sc), d = (c = Math.max(0, i + m - n)) ? 1 : 0;
        a.a.s("getDelayForNextTransport_: " + O({count:f, base:i, variance:m, oldDuration:n, delay:c, times:d}))
      }
    }
    c = [c, d];
    f = c[0];
    c = c[1];
    if(b == a.e) {
      a.e = k;
      if(c) {
        a.e = Nf(a, f, c)
      }else {
        f = Ef(a);
        a.e = Jf(a, j, j);
        if(!a.e) {
          return
        }
        If(a.e, a.Y, f + 1)
      }
      a.e.ba()
    }else {
      b == a.p && (a.p = k, c ? (a.p = Nf(a, f, c), a.p.ba()) : Ff(a))
    }
  }
}
function Qf(a, b, c) {
  if(a.onreset) {
    try {
      a.onreset.call(a.Ia, b, c)
    }catch(d) {
      a.a.q("onreset raised uncaught exception", d), Af(d)
    }
  }
}
p.reset = function(a) {
  3 < this.v && g(Error("reset: Can't send reset in state " + this.v));
  Gf(this);
  0 != this.Y.F.B() && this.a.q("reset: strings in send queue will never be sent: " + O(this.Y));
  this.v = 4;
  this.e && this.e.xa ? (this.a.info("reset: Sending ResetFrame over existing primary."), Rf(this.e, a), this.e.ba()) : (this.e && (this.a.j("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.p && (this.a.j("reset: Disposing secondary before sending ResetFrame."), this.p.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.kb = Jf(this, l, l), Rf(this.kb, a), this.kb.ba());
  Qf(this, a, j)
};
function Sf(a, b, c, d) {
  var e;
  e = a.sc;
  for(var f = a.maxUndeliveredStrings, i = a.maxUndeliveredBytes, m = [], n = l, u = 0, I = c.length;u < I;u++) {
    var q = c[u], w = q[0], q = q[1];
    if(w == e.Ea + 1) {
      e.Ea += 1;
      for(m.push(q);;) {
        w = e.Ea + 1;
        q = e.wa.get(w, ae);
        if(q === ae) {
          break
        }
        m.push(q[0]);
        e.wa.remove(w);
        e.H -= q[1];
        e.Ea = w
      }
    }else {
      if(!(w <= e.Ea)) {
        if(f != k && e.wa.B() >= f) {
          n = j;
          break
        }
        var D = Vd(q);
        if(i != k && e.H + D > i) {
          n = j;
          break
        }
        e.wa.set(w, [q, D]);
        e.H += D
      }
    }
  }
  e.wa.fb() && e.wa.clear();
  e = [m, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(f = 0;f < c.length;f++) {
      i = c[f];
      if(a.onstring) {
        try {
          a.onstring.call(a.Ia, i)
        }catch(kc) {
          a.a.q("onstring raised uncaught exception", kc), Af(kc)
        }
      }
      if(4 == a.v || a.O) {
        return
      }
    }
  }
  d || Kf(a);
  if(!(4 == a.v || a.O) && e) {
    b.a.G(b.k() + "'s peer caused rwin overflow."), b.b()
  }
}
p.jd = function(a) {
  this.a.G("Failed to start " + O(this) + "; error was " + O(a.message));
  this.b();
  return k
};
p.start = function() {
  this.onmessage && g(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  1 != this.v && g(Error("ClientStream.start: " + O(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.v = 2;
  if(this.r instanceof xf) {
    var a = hf(this.r.X, this), b = hf(this.r.ua, this), a = of([a, b]);
    a.La(y(this.Ce, this));
    a.sb(y(this.jd, this))
  }else {
    if(this.r instanceof vf) {
      if(wc) {
        this.ld()
      }else {
        var a = Oe(this.o, this.r.X), c = this;
        a.La(function(a) {
          wc || (wc = new Ge(c.o, a));
          return k
        });
        a.La(y(this.ld, this));
        a.sb(y(this.jd, this))
      }
    }else {
      Tf(this)
    }
  }
};
p.Ce = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Ab, e = a[1].Ab;
  this.Xb.push(a[0]);
  this.Xb.push(a[1]);
  this.r = new yf(d, b, e, c);
  Tf(this)
};
p.ld = function() {
  this.r = new wf(this.r.host, this.r.port, wc);
  Tf(this)
};
function Tf(a) {
  a.v = 3;
  a.e = Jf(a, j, j);
  a.e && (If(a.e, a.Y, k), a.e.ba())
}
p.d = function() {
  this.a.info(O(this) + " in disposeInternal.");
  Gf(this);
  this.v = 5;
  for(var a = this.pb.C(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Xb.length;a++) {
    hb(this.Xb[a].Oc, this)
  }
  F && this.qb && (Ab(this.qb), this.qb = k);
  this.ondisconnect && this.ondisconnect.call(this.Ia);
  delete this.pb;
  delete this.e;
  delete this.p;
  delete this.kb;
  delete this.Ia;
  $.m.d.call(this)
};
var sf = 1, Lf = 3;
function Mf(a, b, c, d, e, f) {
  this.o = a;
  this.D = b;
  this.ga = c;
  this.Z = d;
  this.r = e;
  this.u = [];
  this.ia = f;
  this.xa = !this.Pa();
  this.ra = this.Z != sf;
  this.pe = y(this.hf, this)
}
A(Mf, J);
p = Mf.prototype;
p.a = U("cw.net.ClientTransport");
p.i = k;
p.Sc = k;
p.fe = k;
p.Qb = k;
p.fa = l;
p.Ub = l;
p.Qa = k;
p.Db = 0;
p.Ta = -1;
p.Nb = -1;
p.he = l;
p.Zb = l;
p.oa = 0;
p.eb = l;
p.w = function(a) {
  a.push("<ClientTransport #", "" + this.ga, ", becomePrimary=", "" + this.ia, ">")
};
p.k = function() {
  return(this.ia ? "Prim. T#" : "Sec. T#") + this.ga
};
p.bd = function() {
  return!(!this.eb && this.Db)
};
p.Pa = function() {
  return this.Z == sf || 2 == this.Z
};
function Uf(a, b) {
  lb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Sf(a.D, a, b, !a.ra)
}
function Vf(a, b, c) {
  try {
    var d = df(b);
    a.Db += 1;
    a.a.j(a.k() + " RECV " + O(d));
    var e;
    1 == a.Db && !d.K(zf) && a.Pa() ? (a.a.q(a.k() + " is closing soon because got bad preamble: " + O(d)), e = j) : e = l;
    if(e) {
      return j
    }
    if(d instanceof Ue) {
      if(!/^([ -~]*)$/.test(d.Pc)) {
        return a.eb = j
      }
      a.Nb += 1;
      c.push([a.Nb, d.Pc])
    }else {
      if(d instanceof Te) {
        var f = a.D, i = d.sa;
        f.Dd = i;
        var m = f.Y, n = i.Ka, c = l;
        n > m.ya && (c = j);
        for(var u = Yd(m).concat(), d = 0;d < u.length;d++) {
          var I = u[d];
          if(I > n) {
            break
          }
          var q = m.F.get(I)[1];
          m.F.remove(I);
          m.H -= q
        }
        for(d = 0;d < i.Ga.length;d++) {
          var w = i.Ga[d];
          w > m.ya && (c = j);
          m.F.U(w) && (q = m.F.get(w)[1], m.F.remove(w), m.H -= q)
        }
        m.F.fb() && m.F.clear();
        if(c) {
          return a.a.q(a.k() + " is closing soon because got bad SackFrame"), a.eb = j
        }
      }else {
        if(d instanceof We) {
          a.Nb = d.ae - 1
        }else {
          if(d instanceof Ye) {
            a.D.Ed = d.Cd
          }else {
            if(d instanceof $e) {
              return a.a.s(a.k() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof cf) {
              return a.eb = j, "stream_attach_failure" == d.reason ? a.oa += 1 : "acked_unsent_strings" == d.reason && (a.oa += 0.5), a.a.s(a.k() + " is closing soon because got " + O(d)), j
            }
            if(!(d instanceof Ve)) {
              if(d instanceof Ze) {
                var D = a.D, kc = !a.ra;
                D.a.s("Stream is now confirmed to exist at server.");
                D.Lc = j;
                D.Gc && !kc && (D.Gc = l, Ff(D))
              }else {
                if(c.length) {
                  Uf(a, c);
                  if(!v(c)) {
                    for(var td = c.length - 1;0 <= td;td--) {
                      delete c[td]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof af) {
                  var Le = a.D;
                  Qf(Le, d.Td, d.Wc);
                  Le.b();
                  return j
                }
                g(Error(a.k() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Me) {
    return Me instanceof X || g(Me), a.a.q(a.k() + " is closing soon because got InvalidFrame: " + O(b)), a.eb = j
  }
  return l
}
function De(a, b) {
  a.Ub = j;
  try {
    for(var c = l, d = [], e = 0, f = b.length;e < f;e++) {
      if(a.O) {
        a.a.info(a.k() + " returning from loop because we're disposed.");
        return
      }
      if(c = Vf(a, b[e], d)) {
        break
      }
    }
    d.length && Uf(a, d);
    a.Ub = l;
    a.u.length && a.ba();
    c && (a.a.s(a.k() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Ub = l
  }
}
p.hf = function() {
  this.a.q(this.k() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Wf(a) {
  a.Qb != k && (a.o.A.clearTimeout(a.Qb), a.Qb = k)
}
function tf(a, b) {
  Wf(a);
  b = Math.round(b);
  a.Qb = a.o.A.setTimeout(a.pe, b);
  a.a.j(a.k() + "'s receive timeout set to " + b + " ms.")
}
function Ce(a) {
  a.Z != sf && (a.Z == Lf || 2 == a.Z ? tf(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.Z)))
}
function Hf(a) {
  var b = new Re;
  b.ga = a.ga;
  b.Qd = 2;
  b.wd = 2;
  a.D.Lc || (b.Vd = j);
  b.ob = a.D.ob;
  b.Nc = a.ra;
  b.Nc && (b.Kd = 4096);
  b.Id = 3E5;
  b.Gd = a.ra ? Math.floor(10) : 0;
  b.ge = l;
  a.ia && (b.de = k, b.xc = Math.floor((a.ra ? 358E4 : 25E3) / 1E3));
  b.sa = $d(a.D.sc);
  b.Ib = a.D.Dd;
  a.u.push(b);
  a.Qa = b.sa
}
function Ee(a, b) {
  b && (a.oa += 0.5);
  a.b()
}
p.ba = function() {
  this.fa && !this.xa && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.Ub) {
    this.a.s(this.k() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.fa;
    this.fa = j;
    !a && !this.u.length && Hf(this);
    for(a = 0;a < this.u.length;a++) {
      this.a.j(this.k() + " SEND " + O(this.u[a]))
    }
    if(this.Pa()) {
      for(var a = [], b = 0, c = this.u.length;b < c;b++) {
        this.u[b].P(a), a.push("\n")
      }
      this.u = [];
      a = a.join("");
      b = this.ia ? this.r.X : this.r.ua;
      this.i = Z.gc(this, this.ia ? this.r.Pd : this.r.Zd);
      this.Sc = this.o.A === Hb ? oa() : this.o.A.getTime();
      this.i.wc(b, "POST", a);
      tf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.ra ? 0 : this.ia ? 25E3 : 0))
    }else {
      if(this.Z == Lf) {
        a = [];
        b = 0;
        for(c = this.u.length;b < c;b++) {
          a.push(this.u[b].I())
        }
        this.u = [];
        this.i ? this.i.rb(a) : (b = this.r, this.i = new He(this), this.i.Tb = b.kf.gc(this.i), this.Sc = this.o.A === Hb ? oa() : this.o.A.getTime(), this.i.cc(b.host, b.port), this.i.O || (this.i.rb(a), this.i.O || tf(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.Z))
      }
    }
  }
};
function If(a, b, c) {
  !a.fa && !a.u.length && Hf(a);
  for(var d = Math.max(c, a.Ta + 1), e = Yd(b), c = [], f = 0;f < e.length;f++) {
    var i = e[f];
    (d == k || i >= d) && c.push([i, b.F.get(i)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (-1 == a.Ta || a.Ta + 1 != e) && a.u.push(new We(e)), a.u.push(new Ue(f)), a.Ta = e
  }
}
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  Mf.m.d.call(this);
  this.fe = this.o.A === Hb ? oa() : this.o.A.getTime();
  this.u = [];
  Wf(this);
  this.i && this.i.b();
  var a = this.D;
  this.D = k;
  Pf(a, this)
};
function Rf(a, b) {
  !a.fa && !a.u.length && Hf(a);
  a.u.push(new af(b, j));
  a.he = j
}
function Of(a, b, c, d) {
  this.o = a;
  this.D = b;
  this.hd = c;
  this.dd = d
}
A(Of, J);
p = Of.prototype;
p.fa = l;
p.xa = l;
p.Eb = k;
p.Qa = k;
p.a = U("cw.net.DoNothingTransport");
function Xf(a) {
  a.Eb = a.o.A.setTimeout(function() {
    a.Eb = k;
    a.dd--;
    a.dd ? Xf(a) : a.b()
  }, a.hd)
}
p.ba = function() {
  this.fa && !this.xa && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.fa = j;
  Xf(this)
};
p.w = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.hd, ">")
};
p.Pa = ba(l);
p.k = ba("Wast. T");
p.bd = ba(l);
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  Of.m.d.call(this);
  this.Eb != k && this.o.A.clearTimeout(this.Eb);
  var a = this.D;
  this.D = k;
  Pf(a, this)
};
function Yf() {
}
Yf.prototype.ub = k;
var Zf;
function $f() {
}
A($f, Yf);
function ag(a) {
  return(a = bg(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function cg(a) {
  var b = {};
  bg(a) && (b[0] = j, b[1] = j);
  return b
}
$f.prototype.qc = k;
function bg(a) {
  if(!a.qc && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.qc = d
      }catch(e) {
      }
    }
    g(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.qc
}
Zf = new $f;
function dg(a) {
  this.headers = new P;
  this.$a = a || k
}
A(dg, Gb);
dg.prototype.a = U("goog.net.XhrIo");
var eg = /^https?$/i;
p = dg.prototype;
p.ha = l;
p.f = k;
p.Yb = k;
p.uc = "";
p.Bd = "";
p.gb = "";
p.ic = l;
p.Gb = l;
p.rc = l;
p.Ca = l;
p.Vb = 0;
p.Ha = k;
p.Xd = "";
p.pf = l;
p.send = function(a, b, c, d) {
  this.f && g(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.uc = a;
  this.gb = "";
  this.Bd = b;
  this.ic = l;
  this.ha = j;
  this.f = this.$a ? ag(this.$a) : ag(Zf);
  this.Yb = this.$a ? this.$a.ub || (this.$a.ub = cg(this.$a)) : Zf.ub || (Zf.ub = cg(Zf));
  this.f.onreadystatechange = y(this.Nd, this);
  try {
    this.a.j(fg(this, "Opening Xhr")), this.rc = j, this.f.open(b, a, j), this.rc = l
  }catch(e) {
    this.a.j(fg(this, "Error opening Xhr: " + e.message));
    gg(this, e);
    return
  }
  var a = c || "", f = this.headers.T();
  d && lc(d, function(a, b) {
    f.set(b, a)
  });
  "POST" == b && !f.U("Content-Type") && f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  lc(f, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.Xd && (this.f.responseType = this.Xd);
  "withCredentials" in this.f && (this.f.withCredentials = this.pf);
  try {
    this.Ha && (Hb.clearTimeout(this.Ha), this.Ha = k), 0 < this.Vb && (this.a.j(fg(this, "Will abort after " + this.Vb + "ms if incomplete")), this.Ha = Hb.setTimeout(y(this.jf, this), this.Vb)), this.a.j(fg(this, "Sending request")), this.Gb = j, this.f.send(a), this.Gb = l
  }catch(i) {
    this.a.j(fg(this, "Send error: " + i.message)), gg(this, i)
  }
};
p.jf = function() {
  "undefined" != typeof ca && this.f && (this.gb = "Timed out after " + this.Vb + "ms, aborting", this.a.j(fg(this, this.gb)), this.dispatchEvent("timeout"), this.abort(8))
};
function gg(a, b) {
  a.ha = l;
  a.f && (a.Ca = j, a.f.abort(), a.Ca = l);
  a.gb = b;
  hg(a);
  ig(a)
}
function hg(a) {
  a.ic || (a.ic = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function() {
  this.f && this.ha && (this.a.j(fg(this, "Aborting")), this.ha = l, this.Ca = j, this.f.abort(), this.Ca = l, this.dispatchEvent("complete"), this.dispatchEvent("abort"), ig(this))
};
p.d = function() {
  this.f && (this.ha && (this.ha = l, this.Ca = j, this.f.abort(), this.Ca = l), ig(this, j));
  dg.m.d.call(this)
};
p.Nd = function() {
  !this.rc && !this.Gb && !this.Ca ? this.Ue() : jg(this)
};
p.Ue = function() {
  jg(this)
};
function jg(a) {
  if(a.ha && "undefined" != typeof ca) {
    if(a.Yb[1] && 4 == a.la() && 2 == kg(a)) {
      a.a.j(fg(a, "Local request error detected and ignored"))
    }else {
      if(a.Gb && 4 == a.la()) {
        Hb.setTimeout(y(a.Nd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.la()) {
          a.a.j(fg(a, "Request complete"));
          a.ha = l;
          try {
            var b = kg(a), c, d;
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
                  d = j;
                  break a;
                default:
                  d = l
              }
            }
            if(!(c = d)) {
              var e;
              if(e = 0 === b) {
                var f = ("" + a.uc).match(Cd)[1] || k;
                if(!f && self.location) {
                  var i = self.location.protocol, f = i.substr(0, i.length - 1)
                }
                e = !eg.test(f ? f.toLowerCase() : "")
              }
              c = e
            }
            if(c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success")
            }else {
              var m;
              try {
                m = 2 < a.la() ? a.f.statusText : ""
              }catch(n) {
                a.a.j("Can not get status: " + n.message), m = ""
              }
              a.gb = m + " [" + kg(a) + "]";
              hg(a)
            }
          }finally {
            ig(a)
          }
        }
      }
    }
  }
}
function ig(a, b) {
  if(a.f) {
    var c = a.f, d = a.Yb[0] ? ea : k;
    a.f = k;
    a.Yb = k;
    a.Ha && (Hb.clearTimeout(a.Ha), a.Ha = k);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(e) {
      a.a.G("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
}
p.la = function() {
  return this.f ? this.f.readyState : 0
};
function kg(a) {
  try {
    return 2 < a.la() ? a.f.status : -1
  }catch(b) {
    return a.a.q("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.la() ? this.f.getResponseHeader(a) : h
};
function fg(a, b) {
  return b + " [" + a.Bd + " " + a.uc + " " + kg(a) + "]"
}
;var lg = !(E || F && !G("420+"));
function mg(a, b) {
  this.Wb = a;
  this.S = b
}
A(mg, J);
p = mg.prototype;
p.i = k;
p.qa = -1;
p.sd = l;
p.vd = "Content-Length Server Date Expires Keep-Alive Content-Type Transfer-Encoding Cache-Control".split(" ");
function ng(a) {
  var b = qf(a.fd), c = b[0], b = b[1], d = r.parent;
  d ? (d.__XHRMaster_onframes(a.S, c, b), 1 != b && a.b()) : a.b()
}
p.Le = function() {
  ng(this);
  if(!this.O) {
    var a = r.parent;
    a && a.__XHRMaster_oncomplete(this.S);
    this.b()
  }
};
p.We = function() {
  var a = r.parent;
  if(a) {
    this.qa = this.i.la();
    if(2 <= this.qa && !this.sd) {
      for(var b = new P, c = this.vd.length;c--;) {
        var d = this.vd[c];
        try {
          b.set(d, this.i.f.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.B() && (this.sd = j, a.__XHRMaster_ongotheaders(this.S, qc(b)), this.O)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.S, this.qa);
    lg && 3 == this.qa && ng(this)
  }else {
    this.b()
  }
};
p.wc = function(a, b, c) {
  this.i = new dg;
  vb(this.i, "readystatechange", y(this.We, this));
  vb(this.i, "complete", y(this.Le, this));
  this.i.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.fd = new pf(this.i.f, 1048576)
};
p.d = function() {
  mg.m.d.call(this);
  delete this.fd;
  this.i && this.i.b();
  delete this.Wb.nb[this.S];
  delete this.Wb
};
function og() {
  this.nb = {}
}
A(og, J);
og.prototype.Qe = function(a, b, c, d) {
  var e = new mg(this, a);
  this.nb[a] = e;
  e.wc(b, c, d)
};
og.prototype.ze = function(a) {
  (a = this.nb[a]) && a.b()
};
og.prototype.d = function() {
  og.m.d.call(this);
  for(var a = Xa(this.nb);a.length;) {
    a.pop().b()
  }
  delete this.nb
};
var pg = new og;
r.__XHRSlave_makeRequest = y(pg.Qe, pg);
r.__XHRSlave_dispose = y(pg.ze, pg);
var qg = U("cw.net.demo");
function rg(a, b, c, d) {
  a = new Ed(document.location);
  if(c) {
    return new vf(d, a.ka, r.__demo_mainSocketPort)
  }
  b ? (b = r.__demo_shared_domain, x(b) || g(Error("domain was " + O(b) + "; expected a string.")), c = a.T(), Gd(c, "_____random_____." + b)) : c = a.T();
  Id(c, d);
  Jd(c, "", h);
  return new xf(c.toString().replace("_____random_____", "%random%"))
}
;z("Minerva.HttpEndpoint", xf);
z("Minerva.SocketEndpoint", vf);
z("Minerva.QANHelper", R);
R.prototype.handleQANFrame = R.prototype.ud;
R.prototype.ask = R.prototype.me;
R.prototype.notify = R.prototype.Te;
R.prototype.failAll = R.prototype.md;
z("Minerva.QANProtocolWrapper", Bf);
Bf.prototype.streamStarted = Bf.prototype.ef;
Bf.prototype.streamReset = Bf.prototype.df;
Bf.prototype.stringReceived = Bf.prototype.ff;
z("Minerva.Deferred", M);
M.prototype.cancel = M.prototype.cancel;
M.prototype.callback = M.prototype.N;
M.prototype.errback = M.prototype.Q;
M.prototype.addErrback = M.prototype.sb;
M.prototype.addCallback = M.prototype.La;
M.prototype.addCallbacks = M.prototype.$;
M.prototype.chainDeferred = M.prototype.ad;
M.prototype.awaitDeferred = M.prototype.ne;
M.prototype.branch = M.prototype.Zc;
M.prototype.addBoth = M.prototype.Vc;
M.prototype.hasFired = M.prototype.Ke;
z("Minerva.Deferred.succeed", Pb);
z("Minerva.Deferred.fail", Qb);
z("Minerva.Deferred.cancelled", function() {
  var a = new M;
  a.cancel();
  return a
});
z("Minerva.Deferred.AlreadyCalledError", Mb);
z("Minerva.Deferred.CancelledError", Ib);
z("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Ie;
$.prototype.bindToProtocol = $.prototype.oe;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.$d;
$.prototype.reset = $.prototype.reset;
z("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.Ic;
S.prototype.shout = S.prototype.$e;
S.prototype.severe = S.prototype.G;
S.prototype.warning = S.prototype.q;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.ue;
S.prototype.fine = S.prototype.j;
S.prototype.finer = S.prototype.De;
S.prototype.finest = S.prototype.s;
T.OFF = pd;
T.SHOUT = qd;
T.SEVERE = rd;
T.WARNING = sd;
T.INFO = ud;
T.CONFIG = vd;
T.FINE = wd;
T.FINER = xd;
T.FINEST = yd;
T.ALL = zd;
z("Minerva.LogManager", V);
V.getRoot = V.nc;
z("Minerva.DivConsole", Bd);
Bd.prototype.setCapturing = Bd.prototype.Ze;
z("Minerva.JSON", {});
z("Minerva.JSON.parse", function(a) {
  a = "" + a;
  if(/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  g(Error("Invalid JSON string: " + a))
});
z("Minerva.JSON.serialize", Vb);
z("Minerva.JSON.asciify", Vb);
z("Minerva.bind", y);
z("Minerva.repr", O);
z("Minerva.theCallQueue", Tb);
z("Minerva.MINIMUM_FLASH_VERSION", "9");
z("Minerva.getEndpoint", rg);
z("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new Ed(document.location)).R;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !r.__demo_shared_domain) {
    qg.q("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = l
  }
  return rg(0, a, b, "/_minerva/")
});
})();
