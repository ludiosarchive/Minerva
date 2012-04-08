(function(){function f(a) {
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
  return a !== i
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
  a || f(Error());
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
var qa = /^[a-zA-Z0-9\-_.!~*'()]*$/;
function ra(a) {
  a = "" + a;
  return!qa.test(a) ? encodeURIComponent(a) : a
}
function sa(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
}
function C(a) {
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
  for(var c = 0, d = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = ("" + b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), g = Math.max(d.length, e.length), h = 0;0 == c && h < g;h++) {
    var l = d[h] || "", n = e[h] || "", u = RegExp("(\\d*)(\\D*)", "g"), H = RegExp("(\\d*)(\\D*)", "g");
    do {
      var q = u.exec(l) || ["", "", ""], w = H.exec(n) || ["", "", ""];
      if(0 == q[0].length && 0 == w[0].length) {
        break
      }
      c = ((0 == q[1].length ? 0 : parseInt(q[1], 10)) < (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? -1 : (0 == q[1].length ? 0 : parseInt(q[1], 10)) > (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? 1 : 0) || ((0 == q[2].length) < (0 == w[2].length) ? -1 : (0 == q[2].length) > (0 == w[2].length) ? 1 : 0) || (q[2] < w[2] ? -1 : q[2] > w[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
}
;function Aa(a, b) {
  b.unshift(a);
  B.call(this, pa.apply(k, b));
  b.shift()
}
A(Aa, B);
Aa.prototype.name = "AssertionError";
function Ba(a, b) {
  f(new Aa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;function Ca() {
  return j
}
;var Da, Ea, Fa, Ga;
function Ha() {
  return r.navigator ? r.navigator.userAgent : k
}
Ga = Fa = Ea = Da = m;
var Ia;
if(Ia = Ha()) {
  var Ja = r.navigator;
  Da = 0 == Ia.indexOf("Opera");
  Ea = !Da && -1 != Ia.indexOf("MSIE");
  Fa = !Da && -1 != Ia.indexOf("WebKit");
  Ga = !Da && !Fa && "Gecko" == Ja.product
}
var Ka = Da, E = Ea, La = Ga, F = Fa, Ma;
a: {
  var Na = "", Oa;
  if(Ka && r.opera) {
    var Pa = r.opera.version, Na = "function" == typeof Pa ? Pa() : Pa
  }else {
    if(La ? Oa = /rv\:([^\);]+)(\)|;)/ : E ? Oa = /MSIE\s+([^\);]+)(\)|;)/ : F && (Oa = /WebKit\/(\S+)/), Oa) {
      var Qa = Oa.exec(Ha()), Na = Qa ? Qa[1] : ""
    }
  }
  if(E) {
    var Ra, Sa = r.document;
    Ra = Sa ? Sa.documentMode : i;
    if(Ra > parseFloat(Na)) {
      Ma = "" + Ra;
      break a
    }
  }
  Ma = Na
}
var Ta = {};
function G(a) {
  return Ta[a] || (Ta[a] = 0 <= za(Ma, a))
}
var Ua = {};
function Va() {
  return Ua[9] || (Ua[9] = E && !!document.documentMode && 9 <= document.documentMode)
}
;function Wa() {
}
var Xa = 0;
p = Wa.prototype;
p.key = 0;
p.Ua = m;
p.dc = m;
p.Kb = function(a, b, c, d, e, g) {
  ia(a) ? this.Bd = j : a && a.handleEvent && ia(a.handleEvent) ? this.Bd = m : f(Error("Invalid listener argument"));
  this.jb = a;
  this.Sd = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.rc = g;
  this.dc = m;
  this.key = ++Xa;
  this.Ua = m
};
p.handleEvent = function(a) {
  return this.Bd ? this.jb.call(this.rc || this.src, a) : this.jb.handleEvent.call(this.jb, a)
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
    for(var g = 0;g < ab.length;g++) {
      c = ab[g], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!E || Va();
var cb = !E || Va(), db = E && !G("8");
!F || G("528");
La && G("1.9b") || E && G("8") || Ka && G("9.5") || F && G("528");
La && !G("8") || E && G("9");
var I = Array.prototype, eb = I.indexOf ? function(a, b, c) {
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
}, fb = I.forEach ? function(a, b, c) {
  I.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in e && b.call(c, e[g], g, a)
  }
}, gb = I.map ? function(a, b, c) {
  return I.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), g = x(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in g && (e[h] = b.call(c, g[h], h, a))
  }
  return e
}, hb = I.some ? function(a, b, c) {
  return I.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, g = 0;g < d;g++) {
    if(g in e && b.call(c, e[g], g, a)) {
      return j
    }
  }
  return m
}, ib = I.every ? function(a, b, c) {
  return I.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, g = 0;g < d;g++) {
    if(g in e && !b.call(c, e[g], g, a)) {
      return m
    }
  }
  return j
};
function jb(a, b) {
  var c = eb(a, b);
  0 <= c && I.splice.call(a, c, 1)
}
function kb(a) {
  return I.concat.apply(I, arguments)
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
  return 2 >= arguments.length ? I.slice.call(a, b) : I.slice.call(a, b, c)
}
function nb(a, b) {
  I.sort.call(a, b || ob)
}
function ob(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var pb = {zf:"click", Ef:"dblclick", Yf:"mousedown", bg:"mouseup", ag:"mouseover", $f:"mouseout", Zf:"mousemove", lg:"selectstart", Tf:"keypress", Sf:"keydown", Uf:"keyup", xf:"blur", Mf:"focus", Ff:"deactivate", Nf:E ? "focusin" : "DOMFocusIn", Of:E ? "focusout" : "DOMFocusOut", yf:"change", kg:"select", mg:"submit", Rf:"input", gg:"propertychange", Jf:"dragstart", Gf:"dragenter", If:"dragover", Hf:"dragleave", Kf:"drop", qg:"touchstart", pg:"touchmove", og:"touchend", ng:"touchcancel", Bf:"contextmenu", 
Lf:"error", Qf:"help", Vf:"load", Wf:"losecapture", hg:"readystatechange", ig:"resize", jg:"scroll", sg:"unload", Pf:"hashchange", cg:"pagehide", dg:"pageshow", fg:"popstate", Cf:"copy", eg:"paste", Df:"cut", uf:"beforecopy", vf:"beforecut", wf:"beforepaste", Xf:"message", Af:"connect", rg:F ? "webkitTransitionEnd" : Ka ? "oTransitionEnd" : "transitionend"};
function J() {
}
J.prototype.ba = m;
J.prototype.b = function() {
  this.ba || (this.ba = j, this.d())
};
J.prototype.d = function() {
  this.ye && qb.apply(k, this.ye)
};
function qb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    fa(d) ? qb.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function rb(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
A(rb, J);
p = rb.prototype;
p.d = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
p.Ea = m;
p.defaultPrevented = m;
p.Vb = j;
p.stopPropagation = function() {
  this.Ea = j
};
p.preventDefault = function() {
  this.defaultPrevented = j;
  this.Vb = m
};
function sb(a) {
  a.stopPropagation()
}
;function tb(a) {
  tb[" "](a);
  return a
}
tb[" "] = ea;
function ub(a, b) {
  a && this.Kb(a, b)
}
A(ub, rb);
p = ub.prototype;
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
p.ctrlKey = m;
p.altKey = m;
p.shiftKey = m;
p.metaKey = m;
p.La = k;
p.Kb = function(a, b) {
  var c = this.type = a.type;
  rb.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(La) {
      var e;
      a: {
        try {
          tb(d.nodeName);
          e = j;
          break a
        }catch(g) {
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
  this.La = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Ea
};
p.stopPropagation = function() {
  ub.m.stopPropagation.call(this);
  this.La.stopPropagation ? this.La.stopPropagation() : this.La.cancelBubble = j
};
p.preventDefault = function() {
  ub.m.preventDefault.call(this);
  var a = this.La;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = m, db) {
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
  ub.m.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.La = k
};
var vb = {}, K = {}, L = {}, wb = {};
function xb(a, b, c, d, e) {
  if(b) {
    if(v(b)) {
      for(var g = 0;g < b.length;g++) {
        xb(a, b[g], c, d, e)
      }
      return k
    }
    var d = !!d, h = K;
    b in h || (h[b] = {c:0, M:0});
    h = h[b];
    d in h || (h[d] = {c:0, M:0}, h.c++);
    var h = h[d], l = ja(a), n;
    h.M++;
    if(h[l]) {
      n = h[l];
      for(g = 0;g < n.length;g++) {
        if(h = n[g], h.jb == c && h.rc == e) {
          if(h.Ua) {
            break
          }
          return n[g].key
        }
      }
    }else {
      n = h[l] = [], h.c++
    }
    g = yb();
    g.src = a;
    h = new Wa;
    h.Kb(c, g, a, b, d, e);
    c = h.key;
    g.key = c;
    n.push(h);
    vb[c] = h;
    L[l] || (L[l] = []);
    L[l].push(h);
    a.addEventListener ? (a == r || !a.fd) && a.addEventListener(b, g, d) : a.attachEvent(b in wb ? wb[b] : wb[b] = "on" + b, g);
    return c
  }
  f(Error("Invalid event type"))
}
function yb() {
  var a = zb, b = cb ? function(c) {
    return a.call(b.src, b.key, c)
  } : function(c) {
    c = a.call(b.src, b.key, c);
    if(!c) {
      return c
    }
  };
  return b
}
function Ab(a, b, c, d, e) {
  if(v(b)) {
    for(var g = 0;g < b.length;g++) {
      Ab(a, b[g], c, d, e)
    }
    return k
  }
  a = xb(a, b, c, d, e);
  vb[a].dc = j;
  return a
}
function Bb(a, b, c, d, e) {
  if(v(b)) {
    for(var g = 0;g < b.length;g++) {
      Bb(a, b[g], c, d, e)
    }
  }else {
    d = !!d;
    a: {
      g = K;
      if(b in g && (g = g[b], d in g && (g = g[d], a = ja(a), g[a]))) {
        a = g[a];
        break a
      }
      a = k
    }
    if(a) {
      for(g = 0;g < a.length;g++) {
        if(a[g].jb == c && a[g].capture == d && a[g].rc == e) {
          Cb(a[g].key);
          break
        }
      }
    }
  }
}
function Cb(a) {
  if(!vb[a]) {
    return m
  }
  var b = vb[a];
  if(b.Ua) {
    return m
  }
  var c = b.src, d = b.type, e = b.Sd, g = b.capture;
  c.removeEventListener ? (c == r || !c.fd) && c.removeEventListener(d, e, g) : c.detachEvent && c.detachEvent(d in wb ? wb[d] : wb[d] = "on" + d, e);
  c = ja(c);
  e = K[d][g][c];
  if(L[c]) {
    var h = L[c];
    jb(h, b);
    0 == h.length && delete L[c]
  }
  b.Ua = j;
  e.Md = j;
  Db(d, g, c, e);
  delete vb[a];
  return j
}
function Db(a, b, c, d) {
  if(!d.Mb && d.Md) {
    for(var e = 0, g = 0;e < d.length;e++) {
      d[e].Ua ? d[e].Sd.src = k : (e != g && (d[g] = d[e]), g++)
    }
    d.length = g;
    d.Md = m;
    0 == g && (delete K[a][b][c], K[a][b].c--, 0 == K[a][b].c && (delete K[a][b], K[a].c--), 0 == K[a].c && delete K[a])
  }
}
function Eb(a) {
  var b, c = 0, d = b == k;
  b = !!b;
  if(a == k) {
    Ya(L, function(a) {
      for(var e = a.length - 1;0 <= e;e--) {
        var g = a[e];
        if(d || b == g.capture) {
          Cb(g.key), c++
        }
      }
    })
  }else {
    if(a = ja(a), L[a]) {
      for(var a = L[a], e = a.length - 1;0 <= e;e--) {
        var g = a[e];
        if(d || b == g.capture) {
          Cb(g.key), c++
        }
      }
    }
  }
}
function Fb(a, b, c, d, e) {
  var g = 1, b = ja(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.Mb ? a.Mb++ : a.Mb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Ua && (g &= Gb(n, e) !== m)
      }
    }finally {
      a.Mb--, Db(c, d, b, a)
    }
  }
  return Boolean(g)
}
function Gb(a, b) {
  var c = a.handleEvent(b);
  a.dc && Cb(a.key);
  return c
}
function zb(a, b) {
  if(!vb[a]) {
    return j
  }
  var c = vb[a], d = c.type, e = K;
  if(!(d in e)) {
    return j
  }
  var e = e[d], g, h;
  if(!cb) {
    g = b || da("window.event");
    var l = j in e, n = m in e;
    if(l) {
      if(0 > g.keyCode || g.returnValue != i) {
        return j
      }
      a: {
        var u = m;
        if(0 == g.keyCode) {
          try {
            g.keyCode = -1;
            break a
          }catch(H) {
            u = j
          }
        }
        if(u || g.returnValue == i) {
          g.returnValue = j
        }
      }
    }
    u = new ub;
    u.Kb(g, this);
    g = j;
    try {
      if(l) {
        for(var q = [], w = u.currentTarget;w;w = w.parentNode) {
          q.push(w)
        }
        h = e[j];
        h.M = h.c;
        for(var D = q.length - 1;!u.Ea && 0 <= D && h.M;D--) {
          u.currentTarget = q[D], g &= Fb(h, q[D], d, j, u)
        }
        if(n) {
          h = e[m];
          h.M = h.c;
          for(D = 0;!u.Ea && D < q.length && h.M;D++) {
            u.currentTarget = q[D], g &= Fb(h, q[D], d, m, u)
          }
        }
      }else {
        g = Gb(c, u)
      }
    }finally {
      q && (q.length = 0), u.b()
    }
    return g
  }
  d = new ub(b, this);
  try {
    g = Gb(c, d)
  }finally {
    d.b()
  }
  return g
}
var Hb = 0;
function Ib() {
}
A(Ib, J);
p = Ib.prototype;
p.fd = j;
p.Pb = k;
p.Jc = aa("Pb");
p.addEventListener = function(a, b, c, d) {
  xb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  Bb(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
  var b = a.type || a, c = K;
  if(b in c) {
    if(x(a)) {
      a = new rb(a, this)
    }else {
      if(a instanceof rb) {
        a.target = a.target || this
      }else {
        var d = a, a = new rb(b, this);
        bb(a, d)
      }
    }
    var d = 1, e, c = c[b], b = j in c, g;
    if(b) {
      e = [];
      for(g = this;g;g = g.Pb) {
        e.push(g)
      }
      g = c[j];
      g.M = g.c;
      for(var h = e.length - 1;!a.Ea && 0 <= h && g.M;h--) {
        a.currentTarget = e[h], d &= Fb(g, e[h], a.type, j, a) && a.Vb != m
      }
    }
    if(m in c) {
      if(g = c[m], g.M = g.c, b) {
        for(h = 0;!a.Ea && h < e.length && g.M;h++) {
          a.currentTarget = e[h], d &= Fb(g, e[h], a.type, m, a) && a.Vb != m
        }
      }else {
        for(e = this;!a.Ea && e && g.M;e = e.Pb) {
          a.currentTarget = e, d &= Fb(g, e, a.type, m, a) && a.Vb != m
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
  Ib.m.d.call(this);
  Eb(this);
  this.Pb = k
};
var Jb = r.window;
Hb++;
Hb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function M(a, b) {
  this.yb = [];
  this.ad = a;
  this.hd = b || k
}
p = M.prototype;
p.da = m;
p.fb = m;
p.lb = 0;
p.Kc = m;
p.te = m;
p.wb = 0;
p.cancel = function(a) {
  if(this.da) {
    this.nb instanceof M && this.nb.cancel()
  }else {
    if(this.r) {
      var b = this.r;
      delete this.r;
      a ? b.cancel(a) : (b.wb--, 0 >= b.wb && b.cancel())
    }
    this.ad ? this.ad.call(this.hd, this) : this.Kc = j;
    this.da || this.U(new Kb)
  }
};
p.dd = function(a, b) {
  Lb(this, a, b);
  this.lb--;
  0 == this.lb && this.da && Mb(this)
};
function Lb(a, b, c) {
  a.da = j;
  a.nb = c;
  a.fb = !b;
  Mb(a)
}
function Nb(a) {
  a.da && (a.Kc || f(new Ob), a.Kc = m)
}
p.N = function(a) {
  Nb(this);
  Lb(this, j, a)
};
p.U = function(a) {
  Nb(this);
  Lb(this, m, a)
};
p.ua = function(a, b) {
  return this.ka(a, k, b)
};
p.vb = function(a, b) {
  return this.ka(k, a, b)
};
p.ka = function(a, b, c) {
  this.yb.push([a, b, c]);
  this.da && Mb(this);
  return this
};
p.bd = function(a) {
  this.ka(a.N, a.U, a);
  return this
};
p.oe = function(a) {
  return this.ua(y(a.$c, a))
};
p.$c = function(a) {
  var b = new M;
  this.bd(b);
  a && (b.r = this, this.wb++);
  return b
};
p.Wc = function(a, b) {
  return this.ka(a, a, b)
};
p.Le = o("da");
function Pb(a) {
  return hb(a.yb, function(a) {
    return ia(a[1])
  })
}
function Mb(a) {
  a.Tc && (a.da && Pb(a)) && (r.clearTimeout(a.Tc), delete a.Tc);
  a.r && (a.r.wb--, delete a.r);
  for(var b = a.nb, c = m, d = m;a.yb.length && 0 == a.lb;) {
    var e = a.yb.shift(), g = e[0], h = e[1], e = e[2];
    if(g = a.fb ? h : g) {
      try {
        var l = g.call(e || a.hd, b);
        t(l) && (a.fb = a.fb && (l == b || l instanceof Error), a.nb = b = l);
        b instanceof M && (d = j, a.lb++)
      }catch(n) {
        b = n, a.fb = j, Pb(a) || (c = j)
      }
    }
  }
  a.nb = b;
  d && a.lb && (b.ka(y(a.dd, a, j), y(a.dd, a, m)), b.te = j);
  c && (a.Tc = r.setTimeout(function() {
    f(new Qb(b))
  }, 0))
}
function Rb(a) {
  var b = new M;
  b.N(a);
  return b
}
function Sb(a) {
  var b = new M;
  b.U(a);
  return b
}
function Ob() {
  B.call(this)
}
A(Ob, B);
Ob.prototype.message = "Already called";
function Kb() {
  B.call(this)
}
A(Kb, B);
Kb.prototype.message = "Deferred was cancelled";
function Qb(a) {
  B.call(this);
  this.message = "Unhandled Error in Deferred: " + (a.message || "[No message]")
}
A(Qb, B);
function Tb(a) {
  this.A = a;
  this.Cb = [];
  this.ld = [];
  this.se = y(this.nf, this)
}
Tb.prototype.Qc = k;
function Ub(a, b, c, d) {
  a.Cb.push([b, c, d]);
  a.Qc == k && (a.Qc = a.A.setTimeout(a.se, 0))
}
Tb.prototype.nf = function() {
  this.Qc = k;
  var a = this.Cb;
  this.Cb = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], e = c[1], c = c[2];
    try {
      d.apply(e, c)
    }catch(g) {
      this.A.setTimeout(function() {
        f(g)
      }, 0)
    }
  }
  if(0 == this.Cb.length) {
    a = this.ld;
    this.ld = [];
    for(b = 0;b < a.length;b++) {
      a[b].N(k)
    }
  }
};
var Vb = new Tb(r.window);
function Wb(a) {
  return ia(a) || "object" == typeof a && ia(a.call) && ia(a.apply)
}
;function Xb(a, b) {
  var c = [];
  Yb(new Zb(b), a, c);
  return c.join("")
}
function Zb(a) {
  this.Ub = a
}
function Yb(a, b, c) {
  switch(typeof b) {
    case "string":
      $b(b, c);
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
        for(var e = "", g = 0;g < d;g++) {
          c.push(e), e = b[g], Yb(a, a.Ub ? a.Ub.call(b, "" + g, e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(g in b) {
        Object.prototype.hasOwnProperty.call(b, g) && (e = b[g], "function" != typeof e && (c.push(d), $b(g, c), c.push(":"), Yb(a, a.Ub ? a.Ub.call(b, g, e) : e, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      f(Error("Unknown type: " + typeof b))
  }
}
var ac = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, bc = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function $b(a, b) {
  b.push('"', a.replace(bc, function(a) {
    if(a in ac) {
      return ac[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
    return ac[a] = e + b.toString(16)
  }), '"')
}
;function cc(a, b, c) {
  var d = eb(c, a);
  if(-1 != d) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = s(a);
    if("boolean" == d || "number" == d || "null" == d || "undefined" == d) {
      b.push("" + a)
    }else {
      if("string" == d) {
        $b(a, b)
      }else {
        if(Wb(a.v)) {
          a.v(b, c)
        }else {
          if(Wb(a.ke)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var e = "", g = 0;g < d;g++) {
                  b.push(e), cc(a[g], b, c), e = ", "
                }
                b.push("]")
              }else {
                if("object" == d) {
                  if(ga(a) && "function" == typeof a.valueOf) {
                    b.push("new Date(", "" + a.valueOf(), ")")
                  }else {
                    for(var d = $a(a).concat(ab), e = {}, h = g = 0;h < d.length;) {
                      var l = d[h++], n = ha(l) ? "o" + ja(l) : (typeof l).charAt(0) + l;
                      Object.prototype.hasOwnProperty.call(e, n) || (e[n] = j, d[g++] = l)
                    }
                    d.length = g;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      g = d[h], Object.prototype.hasOwnProperty.call(a, g) && (l = a[g], b.push(e), $b(g, b), b.push(": "), cc(l, b, c), e = ", ")
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
  cc(a, b, c)
}
function O(a, b) {
  var c = [];
  N(a, c, b);
  return c.join("")
}
;function dc() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ oa()).toString(36)
}
function ec(a) {
  return a.substr(0, a.length - 1)
}
var fc = /^(0|[1-9]\d*)$/, gc = /^(0|\-?[1-9]\d*)$/;
function hc(a) {
  var b = ic;
  return fc.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;var ic = Math.pow(2, 53);
function jc(a) {
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
function kc(a) {
  if("function" == typeof a.J) {
    return a.J()
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
  return Za(a)
}
function lc(a) {
  if("function" == typeof a.V) {
    return a.V()
  }
  if("function" != typeof a.J) {
    if(fa(a) || x(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return $a(a)
  }
}
function mc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(fa(a) || x(a)) {
      fb(a, b, c)
    }else {
      for(var d = lc(a), e = kc(a), g = e.length, h = 0;h < g;h++) {
        b.call(c, e[h], d && d[h], a)
      }
    }
  }
}
function nc(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, i)
  }
  if(fa(a) || x(a)) {
    return ib(a, b, i)
  }
  for(var c = lc(a), d = kc(a), e = d.length, g = 0;g < e;g++) {
    if(!b.call(i, d[g], c && c[g], a)) {
      return m
    }
  }
  return j
}
;function P(a, b) {
  this.n = {};
  this.h = [];
  var c = arguments.length;
  if(1 < c) {
    c % 2 && f(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.cc(a)
  }
}
p = P.prototype;
p.c = 0;
p.B = o("c");
p.J = function() {
  oc(this);
  for(var a = [], b = 0;b < this.h.length;b++) {
    a.push(this.n[this.h[b]])
  }
  return a
};
p.V = function() {
  oc(this);
  return this.h.concat()
};
p.P = function(a) {
  return pc(this.n, a)
};
p.gc = function(a) {
  for(var b = 0;b < this.h.length;b++) {
    var c = this.h[b];
    if(pc(this.n, c) && this.n[c] == a) {
      return j
    }
  }
  return m
};
p.I = function(a, b) {
  if(this === a) {
    return j
  }
  if(this.c != a.B()) {
    return m
  }
  var c = b || rc;
  oc(this);
  for(var d, e = 0;d = this.h[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function rc(a, b) {
  return a === b
}
p.hb = function() {
  return 0 == this.c
};
p.clear = function() {
  this.n = {};
  this.c = this.h.length = 0
};
p.remove = function(a) {
  return pc(this.n, a) ? (delete this.n[a], this.c--, this.h.length > 2 * this.c && oc(this), j) : m
};
function oc(a) {
  if(a.c != a.h.length) {
    for(var b = 0, c = 0;b < a.h.length;) {
      var d = a.h[b];
      pc(a.n, d) && (a.h[c++] = d);
      b++
    }
    a.h.length = c
  }
  if(a.c != a.h.length) {
    for(var e = {}, c = b = 0;b < a.h.length;) {
      d = a.h[b], pc(e, d) || (a.h[c++] = d, e[d] = 1), b++
    }
    a.h.length = c
  }
}
p.get = function(a, b) {
  return pc(this.n, a) ? this.n[a] : b
};
p.set = function(a, b) {
  pc(this.n, a) || (this.c++, this.h.push(a));
  this.n[a] = b
};
p.cc = function(a) {
  var b;
  a instanceof P ? (b = a.V(), a = a.J()) : (b = $a(a), a = Za(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
p.O = function() {
  return new P(this)
};
function sc(a) {
  oc(a);
  for(var b = {}, c = 0;c < a.h.length;c++) {
    var d = a.h[c];
    b[d] = a.n[d]
  }
  return b
}
function pc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function tc(a, b) {
  try {
    var c = a.apply(k, b ? b : [])
  }catch(d) {
    return Sb(d)
  }
  return c instanceof M ? c : c instanceof Error ? Sb(c) : Rb(c)
}
;var uc = {ke:ba("<cw.eq.Wildcard>")};
function vc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function wc(a, b, c) {
  var d = s(a), e = s(b);
  if(a == uc || b == uc) {
    return j
  }
  if(a != k && "function" == typeof a.I) {
    return c && c.push("running custom equals function on left object"), a.I(b, c)
  }
  if(b != k && "function" == typeof b.I) {
    return c && c.push("running custom equals function on right object"), b.I(a, c)
  }
  if(vc(d) || vc(e)) {
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
                if(!wc(a[d], b[d], c)) {
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
          if(a.je == Ca && b.je == Ca) {
            a: {
              c && c.push("descending into object");
              for(var g in a) {
                if(!(g in b)) {
                  c && c.push("property " + g + " missing on right object");
                  a = m;
                  break a
                }
                if(!wc(a[g], b[g], c)) {
                  c && c.push("earlier comparisons indicate mismatch at property " + g);
                  a = m;
                  break a
                }
              }
              for(g in b) {
                if(!(g in a)) {
                  c && c.push("property " + g + " missing on left object");
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
  this.Ye = a;
  this.Sb = b
}
Q.prototype.I = function(a, b) {
  return ha(a) && this.constructor == a.constructor && wc(this.Sb, a.Sb, b)
};
Q.prototype.v = function(a, b) {
  a.push("new ", this.Ye, "(");
  for(var c = "", d = 0;d < this.Sb.length;d++) {
    a.push(c), c = ", ", N(this.Sb[d], a, b)
  }
  a.push(")")
};
var xc, yc;
function zc(a, b) {
  Q.call(this, "Question", [a, b]);
  this.body = a;
  this.ga = b
}
A(zc, Q);
function Ac(a, b) {
  Q.call(this, "OkayAnswer", [a, b]);
  this.body = a;
  this.ga = b
}
A(Ac, Q);
function Bc(a, b) {
  Q.call(this, "KnownErrorAnswer", [a, b]);
  this.body = a;
  this.ga = b
}
A(Bc, Q);
function Cc(a, b) {
  Q.call(this, "UnknownErrorAnswer", [a, b]);
  this.body = a;
  this.ga = b
}
A(Cc, Q);
function Dc(a) {
  Q.call(this, "Cancellation", [a]);
  this.ga = a
}
A(Dc, Q);
function Ec(a) {
  Q.call(this, "Notification", [a]);
  this.body = a
}
A(Ec, Q);
function Fc(a) {
  if(a instanceof zc) {
    return"Q"
  }
  if(a instanceof Ac) {
    return"K"
  }
  if(a instanceof Bc) {
    return"E"
  }
  if(a instanceof Cc) {
    return"U"
  }
  if(a instanceof Dc) {
    return"C"
  }
  if(a instanceof Ec) {
    return"#"
  }
  f(Error("qanTypeToCode bug"))
}
function Gc(a) {
  var b = Fc(a);
  if(a instanceof Dc) {
    return"" + a.ga + b
  }
  x(a.body) || f(Error("qanFrame.body must be a string, was " + O(a.body)));
  return a instanceof Ec ? a.body + b : a.body + "|" + ("" + a.ga) + b
}
function Hc(a) {
  B.call(this);
  this.message = a
}
A(Hc, B);
function Ic(a) {
  a = hc(a);
  a === k && f(new Hc("bad qid"));
  return a
}
function Jc(a) {
  a || f(new Hc("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if("#" == b) {
    return new Ec(ec(a))
  }
  if("C" == b) {
    var c = Ic(ec(a));
    return new Dc(c)
  }
  a = a.split("|");
  c = a.splice(a.length - 1, a.length);
  0 < a.length && c.splice(0, 0, a.join("|"));
  a = c[0];
  c = c[1];
  t(c) || f(new Hc("Expected pipe char in frame"));
  c = Ic(ec(c));
  if("Q" == b) {
    return new zc(a, c)
  }
  if("K" == b) {
    return new Ac(a, c)
  }
  if("E" == b) {
    return new Bc(a, c)
  }
  if("U" == b) {
    return new Cc(a, c)
  }
  f(new Hc("Invalid QAN frame type " + O(b)))
}
function Kc(a) {
  B.call(this);
  this.body = a
}
A(Kc, B);
Kc.prototype.message = "KnownError with arbitrary body";
Kc.prototype.v = function(a, b) {
  a.push("new KnownError(");
  N(this.body, a, b);
  a.push(")")
};
function Lc(a) {
  B.call(this);
  this.body = a
}
A(Lc, B);
Lc.prototype.message = "UnknownError with arbitrary body";
Lc.prototype.v = function(a, b) {
  a.push("new UnknownError(");
  N(this.body, a, b);
  a.push(")")
};
function Mc(a) {
  B.call(this);
  this.message = a
}
A(Mc, B);
function R(a, b, c, d) {
  this.Zc = a;
  this.kb = b;
  this.ha = c;
  this.Eb = d;
  this.Rb = 0;
  this.na = new P;
  this.Za = new P
}
p = R.prototype;
p.v = function(a) {
  a.push("<QANHelper asked ", "" + this.Rb, " questions, waiting for ", "" + this.na.B(), " peer answers and ", "" + this.Za.B(), " local answers>")
};
p.vd = function(a) {
  if(a instanceof Ac || a instanceof Bc || a instanceof Cc) {
    var b = a.ga, c = this.na.get(b);
    this.na.remove(b);
    t(c) ? c !== k && (a instanceof Ac ? c.N(a.body) : a instanceof Bc ? c.U(new Kc(a.body)) : a instanceof Cc ? c.U(new Lc(a.body)) : f(Error("handleQANFrame bug"))) : this.Eb("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof Ec) {
      try {
        this.Zc(a.body, m)
      }catch(d) {
        this.kb("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof zc) {
        if(b = a.ga, this.Za.P(b)) {
          this.Eb("Received Question with duplicate qid: " + b)
        }else {
          c = tc(this.Zc, [a.body, j]);
          this.Za.set(b, c);
          var e = this;
          c.ka(function(a) {
            var c = b;
            e.Za.remove(c);
            e.ha(new Ac(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Za.remove(c);
            a instanceof Kc ? e.ha(new Bc(a.body, c)) : a instanceof Kb ? e.ha(new Cc("CancelledError", c)) : (e.kb("Peer's Question #" + c + " caused uncaught exception", a), e.ha(new Cc("Uncaught exception", c)));
            return k
          });
          c.vb(function(a) {
            this.kb("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof Dc && (b = a.ga, c = this.Za.get(b), t(c) && c.cancel())
      }
    }
  }
};
p.ne = function(a) {
  var b = this.Rb + 1;
  this.ha(new zc(a, b));
  this.Rb += 1;
  var c = this, a = new M(function() {
    c.na.set(b, k);
    c.ha(new Dc(b))
  });
  this.na.set(b, a);
  return a
};
p.Ue = function(a) {
  this.ha(new Ec(a))
};
p.nd = function(a) {
  for(var b = this.na.V(), c = 0;c < b.length;c++) {
    var d = this.na.get(b[c]);
    t(d) && (this.na.set(b[c], k), d.U(new Mc(a)))
  }
};
function Nc() {
  this.Vd = oa()
}
var Oc = new Nc;
Nc.prototype.set = aa("Vd");
Nc.prototype.reset = function() {
  this.set(oa())
};
Nc.prototype.get = o("Vd");
function Pc(a) {
  this.We = a || "";
  this.df = Oc
}
Pc.prototype.ce = j;
Pc.prototype.cf = j;
Pc.prototype.bf = j;
Pc.prototype.de = m;
function Qc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Rc(a, b) {
  var c = (a.fe - b) / 1E3, d = c.toFixed(3), e = 0;
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
function Sc(a) {
  Pc.call(this, a)
}
A(Sc, Pc);
Sc.prototype.de = j;
var Tc;
function Uc(a, b) {
  var c;
  c = a.className;
  c = x(c) && c.match(/\S+/g) || [];
  for(var d = mb(arguments, 1), e = c.length + d.length, g = c, h = 0;h < d.length;h++) {
    0 <= eb(g, d[h]) || g.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == e
}
;var Vc = !E || Va();
!La && !E || E && Va() || La && G("1.9.1");
E && G("9");
function Wc(a) {
  return a ? new Xc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Tc || (Tc = new Xc)
}
function Yc(a) {
  return x(a) ? document.getElementById(a) : a
}
function Zc(a, b) {
  Ya(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in $c ? a.setAttribute($c[d], b) : 0 == d.lastIndexOf("aria-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var $c = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function ad(a, b, c) {
  return bd(document, arguments)
}
function bd(a, b) {
  var c = b[0], d = b[1];
  if(!Vc && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', C(d.name), '"');
    if(d.type) {
      c.push(' type="', C(d.type), '"');
      var e = {};
      bb(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (x(d) ? c.className = d : v(d) ? Uc.apply(k, [c].concat(d)) : Zc(c, d));
  2 < b.length && cd(a, c, b, 2);
  return c
}
function cd(a, b, c, d) {
  function e(c) {
    c && b.appendChild(x(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var g = c[d];
    fa(g) && !(ha(g) && 0 < g.nodeType) ? fb(dd(g) ? lb(g) : g, e) : e(g)
  }
}
function ed(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function dd(a) {
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
function Xc(a) {
  this.ya = a || r.document || document
}
p = Xc.prototype;
p.qd = Wc;
p.Aa = function(a) {
  return x(a) ? this.ya.getElementById(a) : a
};
function fd(a, b) {
  var c;
  c = a.ya;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && (c.querySelector && (!F || "CSS1Compat" == document.compatMode || G("528"))) && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.eb = function(a, b, c) {
  return bd(this.ya, arguments)
};
p.createElement = function(a) {
  return this.ya.createElement(a)
};
p.createTextNode = function(a) {
  return this.ya.createTextNode(a)
};
p.appendChild = function(a, b) {
  a.appendChild(b)
};
p.append = function(a, b) {
  cd(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
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
function gd(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
function hd(a) {
  E ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[F ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function id(a) {
  this.n = new P;
  a && this.cc(a)
}
function jd(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ja(a) : b.substr(0, 1) + a
}
p = id.prototype;
p.B = function() {
  return this.n.B()
};
p.add = function(a) {
  this.n.set(jd(a), a)
};
p.cc = function(a) {
  for(var a = kc(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Gc = function(a) {
  for(var a = kc(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.n.remove(jd(a))
};
p.clear = function() {
  this.n.clear()
};
p.hb = function() {
  return this.n.hb()
};
p.contains = function(a) {
  return this.n.P(jd(a))
};
p.J = function() {
  return this.n.J()
};
p.O = function() {
  return new id(this)
};
p.I = function(a) {
  return this.B() == jc(a) && kd(this, a)
};
function kd(a, b) {
  var c = jc(b);
  if(a.B() > c) {
    return m
  }
  !(b instanceof id) && 5 < c && (b = new id(b));
  return nc(a, function(a) {
    if("function" == typeof b.contains) {
      a = b.contains(a)
    }else {
      if("function" == typeof b.gc) {
        a = b.gc(a)
      }else {
        if(fa(b) || x(b)) {
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
;function ld(a) {
  return md(a || arguments.callee.caller, [])
}
function md(a, b) {
  var c = [];
  if(0 <= eb(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(nd(a) + "(");
      for(var d = a.arguments, e = 0;e < d.length;e++) {
        0 < e && c.push(", ");
        var g;
        g = d[e];
        switch(typeof g) {
          case "object":
            g = g ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            g = "" + g;
            break;
          case "boolean":
            g = g ? "true" : "false";
            break;
          case "function":
            g = (g = nd(g)) ? g : "[fn]";
            break;
          default:
            g = typeof g
        }
        40 < g.length && (g = g.substr(0, 40) + "...");
        c.push(g)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(md(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function nd(a) {
  if(od[a]) {
    return od[a]
  }
  a = "" + a;
  if(!od[a]) {
    var b = /function ([^\(]+)/.exec(a);
    od[a] = b ? b[1] : "[Anonymous]"
  }
  return od[a]
}
var od = {};
function pd(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
pd.prototype.oc = k;
pd.prototype.nc = k;
var qd = 0;
pd.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || qd++;
  this.fe = d || oa();
  this.Qa = a;
  this.Kd = b;
  this.Qe = c;
  delete this.oc;
  delete this.nc
};
pd.prototype.Ic = aa("Qa");
function S(a) {
  this.Se = a
}
S.prototype.r = k;
S.prototype.Qa = k;
S.prototype.la = k;
S.prototype.Ma = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var rd = new T("OFF", Infinity), sd = new T("SHOUT", 1200), td = new T("SEVERE", 1E3), ud = new T("WARNING", 900), vd = new T("INFO", 800), xd = new T("CONFIG", 700), yd = new T("FINE", 500), zd = new T("FINER", 400), Ad = new T("FINEST", 300), Bd = new T("ALL", 0);
function U(a) {
  return V.sd(a)
}
p = S.prototype;
p.getParent = o("r");
p.Ic = aa("Qa");
function Cd(a) {
  if(a.Qa) {
    return a.Qa
  }
  if(a.r) {
    return Cd(a.r)
  }
  Ba("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= Cd(this).value) {
    a = this.Ie(a, b, c);
    b = "log:" + a.Kd;
    r.console && (r.console.timeStamp ? r.console.timeStamp(b) : r.console.markTimeline && r.console.markTimeline(b));
    r.msWriteProfilerMark && r.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Ma) {
        for(var e = 0, g = i;g = c.Ma[e];e++) {
          g(d)
        }
      }
      b = b.getParent()
    }
  }
};
p.Ie = function(a, b, c) {
  var d = new pd(a, "" + b, this.Se);
  if(c) {
    d.oc = c;
    var e;
    var g = arguments.callee.caller;
    try {
      var h;
      var l = da("window.location.href");
      if(x(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:l, stack:"Not available"}
      }else {
        var n, u, H = m;
        try {
          n = c.lineNumber || c.Pe || "Not available"
        }catch(q) {
          n = "Not available", H = j
        }
        try {
          u = c.fileName || c.filename || c.sourceURL || l
        }catch(w) {
          u = "Not available", H = j
        }
        h = H || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:u, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + C(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + C(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + C(ld(g) + "-> ")
    }catch(D) {
      e = "Exception trying to expose exception! You win, we lose. " + D
    }
    d.nc = e
  }
  return d
};
p.af = function(a, b) {
  this.log(sd, a, b)
};
p.F = function(a, b) {
  this.log(td, a, b)
};
p.u = function(a, b) {
  this.log(ud, a, b)
};
p.info = function(a, b) {
  this.log(vd, a, b)
};
p.ve = function(a, b) {
  this.log(xd, a, b)
};
p.k = function(a, b) {
  this.log(yd, a, b)
};
p.Ee = function(a, b) {
  this.log(zd, a, b)
};
p.q = function(a, b) {
  this.log(Ad, a, b)
};
var V = {Nb:{}, ob:k, yd:function() {
  V.ob || (V.ob = new S(""), V.Nb[""] = V.ob, V.ob.Ic(xd))
}, ug:function() {
  return V.Nb
}, qc:function() {
  V.yd();
  return V.ob
}, sd:function(a) {
  V.yd();
  return V.Nb[a] || V.xe(a)
}, tg:function(a) {
  return function(b) {
    (a || V.qc()).F("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Pe + ")")
  }
}, xe:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.sd(a.substr(0, c));
  c.la || (c.la = {});
  c.la[d] = b;
  b.r = c;
  return V.Nb[a] = b
}};
function Dd(a) {
  this.Td = y(this.le, this);
  this.pd = new Sc;
  this.Ad = this.pd.ce = m;
  this.i = a;
  this.Ce = this.i.ownerDocument || this.i.document;
  var a = Wc(this.i), b = k;
  if(E) {
    b = a.ya.createStyleSheet(), hd(b)
  }else {
    var c = fd(a, "head")[0];
    c || (b = fd(a, "body")[0], c = a.eb("head"), b.parentNode.insertBefore(c, b));
    b = a.eb("style");
    hd(b);
    a.appendChild(c, b)
  }
  this.i.className += " logdiv"
}
Dd.prototype.$e = function(a) {
  if(a != this.Ad) {
    var b = V.qc();
    if(a) {
      var c = this.Td;
      b.Ma || (b.Ma = []);
      b.Ma.push(c)
    }else {
      (b = b.Ma) && jb(b, this.Td)
    }
    this.Ad = a
  }
};
Dd.prototype.le = function(a) {
  var b = 100 >= this.i.scrollHeight - this.i.scrollTop - this.i.clientHeight, c = this.Ce.createElement("div");
  c.className = "logmsg";
  var d = this.pd, e;
  switch(a.Qa.value) {
    case sd.value:
      e = "dbg-sh";
      break;
    case td.value:
      e = "dbg-sev";
      break;
    case ud.value:
      e = "dbg-w";
      break;
    case vd.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var g = [];
  g.push(d.We, " ");
  if(d.ce) {
    var h = new Date(a.fe);
    g.push("[", Qc(h.getFullYear() - 2E3) + Qc(h.getMonth() + 1) + Qc(h.getDate()) + " " + Qc(h.getHours()) + ":" + Qc(h.getMinutes()) + ":" + Qc(h.getSeconds()) + "." + Qc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.cf && g.push("[", ya(Rc(a, d.df.get())), "s] ");
  d.bf && g.push("[", C(a.Qe), "] ");
  g.push('<span class="', e, '">', sa(ya(C(a.Kd))));
  d.de && a.oc && g.push("<br>", sa(ya(a.nc || "")));
  g.push("</span><br>");
  c.innerHTML = g.join("");
  this.i.appendChild(c);
  b && (this.i.scrollTop = this.i.scrollHeight)
};
Dd.prototype.clear = function() {
  this.i.innerHTML = ""
};
var Ed = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function Fd(a, b) {
  var c = a.match(Ed), d = b.match(Ed);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function Gd(a, b) {
  var c;
  a instanceof Gd ? (this.Xa(b == k ? a.X : b), Hd(this, a.$), Id(this, a.Ha), Jd(this, a.Q), Kd(this, a.pa), Ld(this, a.K), Md(this, a.L.O()), Nd(this, a.za)) : a && (c = ("" + a).match(Ed)) ? (this.Xa(!!b), Hd(this, c[1] || "", j), Id(this, c[2] || "", j), Jd(this, c[3] || "", j), Kd(this, c[4]), Ld(this, c[5] || "", j), Md(this, c[6] || "", j), Nd(this, c[7] || "", j)) : (this.Xa(!!b), this.L = new Od(k, this, this.X))
}
p = Gd.prototype;
p.$ = "";
p.Ha = "";
p.Q = "";
p.pa = k;
p.K = "";
p.za = "";
p.Oe = m;
p.X = m;
p.toString = function() {
  if(this.T) {
    return this.T
  }
  var a = [];
  this.$ && a.push(Pd(this.$, Qd), ":");
  this.Q && (a.push("//"), this.Ha && a.push(Pd(this.Ha, Qd), "@"), a.push(x(this.Q) ? encodeURIComponent(this.Q) : k), this.pa != k && a.push(":", "" + this.pa));
  this.K && (this.Q && "/" != this.K.charAt(0) && a.push("/"), a.push(Pd(this.K, "/" == this.K.charAt(0) ? Rd : Sd)));
  var b = "" + this.L;
  b && a.push("?", b);
  this.za && a.push("#", Pd(this.za, Td));
  return this.T = a.join("")
};
p.O = function() {
  var a = this.$, b = this.Ha, c = this.Q, d = this.pa, e = this.K, g = this.L.O(), h = this.za, l = new Gd(k, this.X);
  a && Hd(l, a);
  b && Id(l, b);
  c && Jd(l, c);
  d && Kd(l, d);
  e && Ld(l, e);
  g && Md(l, g);
  h && Nd(l, h);
  return l
};
function Hd(a, b, c) {
  Ud(a);
  delete a.T;
  a.$ = c ? b ? decodeURIComponent(b) : "" : b;
  a.$ && (a.$ = a.$.replace(/:$/, ""))
}
function Id(a, b, c) {
  Ud(a);
  delete a.T;
  a.Ha = c ? b ? decodeURIComponent(b) : "" : b
}
function Jd(a, b, c) {
  Ud(a);
  delete a.T;
  a.Q = c ? b ? decodeURIComponent(b) : "" : b
}
function Kd(a, b) {
  Ud(a);
  delete a.T;
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.pa = b) : a.pa = k
}
function Ld(a, b, c) {
  Ud(a);
  delete a.T;
  a.K = c ? b ? decodeURIComponent(b) : "" : b
}
function Md(a, b, c) {
  Ud(a);
  delete a.T;
  b instanceof Od ? (a.L = b, a.L.Uc = a, a.L.Xa(a.X)) : (c || (b = Pd(b, Vd)), a.L = new Od(b, a, a.X))
}
function Nd(a, b, c) {
  Ud(a);
  delete a.T;
  a.za = c ? b ? decodeURIComponent(b) : "" : b
}
function Ud(a) {
  a.Oe && f(Error("Tried to modify a read-only Uri"))
}
p.Xa = function(a) {
  this.X = a;
  this.L && this.L.Xa(a);
  return this
};
function Wd(a) {
  return a instanceof Gd ? a.O() : new Gd(a, i)
}
var Xd = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function Pd(a, b) {
  var c = k;
  x(a) && (c = a, Xd.test(c) || (c = encodeURI(a)), 0 <= c.search(b) && (c = c.replace(b, Yd)));
  return c
}
function Yd(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Qd = /[#\/\?@]/g, Sd = /[\#\?:]/g, Rd = /[\#\?]/g, Vd = /[\#\?@]/g, Td = /#/g;
function Od(a, b, c) {
  this.ca = a || k;
  this.Uc = b || k;
  this.X = !!c
}
function W(a) {
  if(!a.g && (a.g = new P, a.c = 0, a.ca)) {
    for(var b = a.ca.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), e = k, g = k;
      0 <= d ? (e = b[c].substring(0, d), g = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = Zd(a, e);
      a.add(e, g ? decodeURIComponent(g.replace(/\+/g, " ")) : "")
    }
  }
}
p = Od.prototype;
p.g = k;
p.c = k;
p.B = function() {
  W(this);
  return this.c
};
p.add = function(a, b) {
  W(this);
  $d(this);
  a = Zd(this, a);
  if(this.P(a)) {
    var c = this.g.get(a);
    v(c) ? c.push(b) : this.g.set(a, [c, b])
  }else {
    this.g.set(a, b)
  }
  this.c++;
  return this
};
p.remove = function(a) {
  W(this);
  a = Zd(this, a);
  if(this.g.P(a)) {
    $d(this);
    var b = this.g.get(a);
    v(b) ? this.c -= b.length : this.c--;
    return this.g.remove(a)
  }
  return m
};
p.clear = function() {
  $d(this);
  this.g && this.g.clear();
  this.c = 0
};
p.hb = function() {
  W(this);
  return 0 == this.c
};
p.P = function(a) {
  W(this);
  a = Zd(this, a);
  return this.g.P(a)
};
p.gc = function(a) {
  var b = this.J();
  return 0 <= eb(b, a)
};
p.V = function() {
  W(this);
  for(var a = this.g.J(), b = this.g.V(), c = [], d = 0;d < b.length;d++) {
    var e = a[d];
    if(v(e)) {
      for(var g = 0;g < e.length;g++) {
        c.push(b[d])
      }
    }else {
      c.push(b[d])
    }
  }
  return c
};
p.J = function(a) {
  W(this);
  var b = [];
  if(a) {
    a = Zd(this, a), this.P(a) && (b = kb(b, this.g.get(a)))
  }else {
    for(var a = this.g.J(), c = 0;c < a.length;c++) {
      b = kb(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  W(this);
  $d(this);
  a = Zd(this, a);
  if(this.P(a)) {
    var c = this.g.get(a);
    v(c) ? this.c -= c.length : this.c--
  }
  this.g.set(a, b);
  this.c++;
  return this
};
p.get = function(a, b) {
  W(this);
  a = Zd(this, a);
  if(this.P(a)) {
    var c = this.g.get(a);
    return v(c) ? c[0] : c
  }
  return b
};
p.toString = function() {
  if(this.ca) {
    return this.ca
  }
  if(!this.g) {
    return""
  }
  for(var a = [], b = 0, c = this.g.V(), d = 0;d < c.length;d++) {
    var e = c[d], g = ra(e), e = this.g.get(e);
    if(v(e)) {
      for(var h = 0;h < e.length;h++) {
        0 < b && a.push("&"), a.push(g), "" !== e[h] && a.push("=", ra(e[h])), b++
      }
    }else {
      0 < b && a.push("&"), a.push(g), "" !== e && a.push("=", ra(e)), b++
    }
  }
  return this.ca = a.join("")
};
function $d(a) {
  delete a.Ka;
  delete a.ca;
  a.Uc && delete a.Uc.T
}
p.O = function() {
  var a = new Od;
  this.Ka && (a.Ka = this.Ka);
  this.ca && (a.ca = this.ca);
  this.g && (a.g = this.g.O());
  return a
};
function Zd(a, b) {
  var c = "" + b;
  a.X && (c = c.toLowerCase());
  return c
}
p.Xa = function(a) {
  a && !this.X && (W(this), $d(this), mc(this.g, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.X = a
};
function ae(a) {
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
  f(Error("cannot determine size of object type " + b))
}
;function be(a, b) {
  this.Ia = a;
  this.Fa = b
}
be.prototype.I = function(a) {
  return a instanceof be && this.Ia == a.Ia && this.Fa.join(",") == a.Fa
};
be.prototype.v = function(a, b) {
  a.push("new SACK(", "" + this.Ia, ", ");
  N(this.Fa, a, b);
  a.push(")")
};
function ce() {
  this.D = new P
}
ce.prototype.xa = -1;
ce.prototype.G = 0;
ce.prototype.append = function(a) {
  var b = ae(a);
  this.D.set(this.xa + 1, [a, b]);
  this.xa += 1;
  this.G += b
};
ce.prototype.v = function(a) {
  a.push("<Queue with ", "" + this.D.B(), " item(s), counter=#", "" + this.xa, ", size=", "" + this.G, ">")
};
function de(a) {
  a = a.D.V();
  nb(a);
  return a
}
function ee() {
  this.wa = new P
}
ee.prototype.Da = -1;
ee.prototype.G = 0;
function fe(a) {
  var b = a.wa.V();
  nb(b);
  return new be(a.Da, b)
}
var ge = {};
function he(a, b) {
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
        a.push('<property id="', d, '">'), he(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != s(b[c]) && (a.push('<property id="', C(c), '">'), he(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function ie(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var g = e.length, h = 1;h < g;h++) {
    he(d, e[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var je = m, ke = "";
function le(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var me = navigator.plugins["Shockwave Flash"];
  me && (je = j, me.description && (ke = le(me.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (je = j, ke = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var ne = navigator.mimeTypes["application/x-shockwave-flash"];
    (je = ne && ne.enabledPlugin) && (ke = le(ne.enabledPlugin.description))
  }else {
    try {
      var oe = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), je = j, ke = le(oe.GetVariable("$version"))
    }catch(pe) {
      try {
        oe = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), je = j, ke = "6.0.21"
      }catch(qe) {
        try {
          oe = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), je = j, ke = le(oe.GetVariable("$version"))
        }catch(re) {
        }
      }
    }
  }
}
var se = ke;
function te(a) {
  this.Ke = a;
  this.h = []
}
A(te, J);
var ue = [];
te.prototype.Gc = function() {
  fb(this.h, Cb);
  this.h.length = 0
};
te.prototype.d = function() {
  te.m.d.call(this);
  this.Gc()
};
te.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function ve() {
}
ve.rd = function() {
  return ve.zd ? ve.zd : ve.zd = new ve
};
ve.prototype.Te = 0;
ve.rd();
function we(a) {
  this.Ab = a || Wc()
}
A(we, Ib);
p = we.prototype;
p.Ne = ve.rd();
p.W = k;
p.Ca = m;
p.i = k;
p.r = k;
p.la = k;
p.zb = k;
p.pf = m;
function xe(a) {
  return a.W || (a.W = ":" + (a.Ne.Te++).toString(36))
}
p.Aa = o("i");
p.getParent = o("r");
p.Jc = function(a) {
  this.r && this.r != a && f(Error("Method not supported"));
  we.m.Jc.call(this, a)
};
p.qd = o("Ab");
p.eb = function() {
  this.i = this.Ab.createElement("div")
};
function ye(a, b) {
  a.Ca && f(Error("Component already rendered"));
  a.i || a.eb();
  b ? b.insertBefore(a.i, k) : a.Ab.ya.body.appendChild(a.i);
  (!a.r || a.r.Ca) && a.Bb()
}
p.Bb = function() {
  this.Ca = j;
  ze(this, function(a) {
    !a.Ca && a.Aa() && a.Bb()
  })
};
function Ae(a) {
  ze(a, function(a) {
    a.Ca && Ae(a)
  });
  a.Ib && a.Ib.Gc();
  a.Ca = m
}
p.d = function() {
  we.m.d.call(this);
  this.Ca && Ae(this);
  this.Ib && (this.Ib.b(), delete this.Ib);
  ze(this, function(a) {
    a.b()
  });
  !this.pf && this.i && ed(this.i);
  this.r = this.i = this.zb = this.la = k
};
function ze(a, b) {
  a.la && fb(a.la, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = x(a) ? a : xe(a), d;
    this.zb && c ? (d = this.zb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.zb, c in d && delete d[c], jb(this.la, a), b && (Ae(a), a.i && ed(a.i)), c = a, c == k && f(Error("Unable to set parent component")), c.r = k, we.m.Jc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function Be(a, b) {
  this.Ab = b || Wc();
  this.Ge = a;
  this.mc = new te(this);
  this.Fb = new P
}
A(Be, we);
p = Be.prototype;
p.a = U("goog.ui.media.FlashObject");
p.rf = "window";
p.Yc = "#000000";
p.me = "sameDomain";
function Ce(a, b, c) {
  a.Vc = x(b) ? b : Math.round(b) + "px";
  a.sc = x(c) ? c : Math.round(c) + "px";
  a.Aa() && (b = a.Aa() ? a.Aa().firstChild : k, c = a.Vc, a = a.sc, a == i && f(Error("missing height argument")), b.style.width = gd(c), b.style.height = gd(a))
}
p.Bb = function() {
  Be.m.Bb.call(this);
  var a = this.Aa(), b;
  b = E ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = E ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = pa(c, this.rf), d = this.Fb.V(), e = this.Fb.J(), g = [], h = 0;h < d.length;h++) {
    var l = ra(d[h]), n = ra(e[h]);
    g.push(l + "=" + n)
  }
  b = pa(b, xe(this), xe(this), "goog-ui-media-flash-object", C(this.Ge), C(g.join("&")), this.Yc, this.me, c);
  a.innerHTML = b;
  this.Vc && this.sc && Ce(this, this.Vc, this.sc);
  a = this.mc;
  b = this.Aa();
  c = Za(pb);
  v(c) || (ue[0] = c, c = ue);
  for(d = 0;d < c.length;d++) {
    a.h.push(xb(b, c[d], sb || a, m, a.Ke || a))
  }
};
p.eb = function() {
  this.Xd != k && !(0 <= za(se, this.Xd)) && (this.a.u("Required flash version not found:" + this.Xd), f(Error("Method not supported")));
  var a = this.qd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.i = a
};
p.d = function() {
  Be.m.d.call(this);
  this.Fb = k;
  this.mc.b();
  this.mc = k
};
function De(a) {
  B.call(this, a)
}
A(De, B);
De.prototype.name = "cw.loadflash.FlashLoadFailed";
r.__loadFlashObject_callbacks = {};
function Ee(a, b, c) {
  function d() {
    e && delete r.__loadFlashObject_callbacks[e]
  }
  var e;
  if(La && !G("1.8.1.20")) {
    return Sb(new De("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(0 <= za(se, "9"))) {
    return Sb(new De("Need Flash Player 9+; had " + (se ? se : "none")))
  }
  var g;
  e = "_" + dc();
  var h = new M(d);
  r.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      h.N(Yc(g))
    }, 0)
  };
  b.Fb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  g = xe(b);
  ye(b, c);
  return h
}
function Fe(a, b, c) {
  var d = Ee(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  d.Wc(function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function Ge(a, b) {
  this.W = "_" + dc();
  this.Zb = a;
  this.qa = b;
  this.va = a.va
}
A(Ge, J);
p = Ge.prototype;
p.Ra = j;
p.ic = m;
p.a = U("cw.net.FlashSocket");
p.v = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.W);
  a.push("'>")
};
function He(a, b, c) {
  "frames" == b ? (a = a.qa, Ie(a.w), Je(a.w, c)) : "stillreceiving" == b ? (c = a.qa, c.a.q("onstillreceiving"), Ie(c.w)) : "connect" == b ? (c = a.qa, c.a.info("onconnect"), Ie(c.w), a = c.bb, c.bb = k, a.length && (c.a.q("onconnect: Writing " + a.length + " buffered frame(s)."), c.Wb.ub(a))) : "close" == b ? (a.Ra = m, a.b()) : "ioerror" == b ? (a.Ra = m, b = a.qa, b.a.u("onioerror: " + O(c)), Ke(b.w, m), a.b()) : "securityerror" == b ? (a.Ra = m, b = a.qa, b.a.u("onsecurityerror: " + O(c)), Ke(b.w, 
  m), a.b()) : f(Error("bad event: " + b))
}
function Le(a) {
  a.ic = j;
  a.Ra = m;
  a.b()
}
p.fc = function(a, b) {
  try {
    var c = this.va.CallFunction(ie("__FC_connect", this.W, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.F("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), Le(this)
  }
  '"OK"' != c && f(Error("__FC_connect failed? ret: " + c))
};
p.ub = function(a) {
  try {
    var b = this.va.CallFunction(ie("__FC_writeFrames", this.W, a))
  }catch(c) {
    return this.a.F("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), Le(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.u("Flash no longer knows of " + this.W + "; disposing."), this.b()) : f(Error("__FC_writeFrames failed? ret: " + b)))
};
p.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Ra);
  Ge.m.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Ra) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(ie("__FC_close", this.W)))
    }catch(b) {
      this.a.F("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.ic = j
    }
  }
  if(this.ic) {
    a = this.qa, a.a.u("oncrash"), Ke(a.w, j)
  }else {
    this.qa.onclose()
  }
  delete this.qa;
  delete this.Zb.Na[this.W]
};
function Me(a, b) {
  this.o = a;
  this.va = b;
  this.Na = {};
  this.ec = "__FST_" + dc();
  r[this.ec] = y(this.Be, this);
  var c = b.CallFunction(ie("__FC_setCallbackFunc", this.ec));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(Me, J);
p = Me.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.v = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Na, a, b);
  a.push(">")
};
p.jc = function(a) {
  a = new Ge(this, a);
  return this.Na[a.W] = a
};
p.ze = function(a, b, c, d) {
  var e = this.Na[a];
  e ? "frames" == b && d ? (He(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : He(e, b, c) : this.a.u("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
p.Be = function(a, b, c, d) {
  try {
    Ub(this.o, this.ze, this, [a, b, c, d])
  }catch(e) {
    r.window.setTimeout(function() {
      f(e)
    }, 0)
  }
};
p.d = function() {
  Me.m.d.call(this);
  for(var a = Za(this.Na);a.length;) {
    a.pop().b()
  }
  delete this.Na;
  delete this.va;
  r[this.ec] = i
};
function Ne(a) {
  this.w = a;
  this.bb = []
}
A(Ne, J);
p = Ne.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.ub = function(a) {
  this.bb ? (this.a.q("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.bb.push.apply(this.bb, a)) : (this.a.q("writeFrames: Writing " + a.length + " frame(s)."), this.Wb.ub(a))
};
p.fc = function(a, b) {
  this.Wb.fc(a, b)
};
p.onclose = function() {
  this.a.info("onclose");
  Ke(this.w, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  Ne.m.d.call(this);
  this.Wb.b();
  delete this.w
};
var Qe = [];
function Re() {
  var a = new M;
  Qe.push(a);
  return a
}
function Se(a) {
  var b = Qe;
  Qe = [];
  fb(b, function(b) {
    b.N(a)
  })
}
function Te(a, b) {
  if(Qe.length) {
    return Re()
  }
  var c = new Be(b + "FlashConnector.swf?cb=" + Ue);
  c.Yc = "#777777";
  Ce(c, 300, 30);
  var d = Yc("minerva-elements");
  d || f(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = Yc("minerva-elements-FlashConnectorSwf");
  e || (e = ad("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  xc = Fe(a.A, c, e);
  xc.ua(Se);
  return Re()
}
;function Ve() {
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
  this.R(a);
  return a.join("")
}
function We() {
}
We.prototype.I = function(a, b) {
  return!(a instanceof We) ? m : wc(Xe(this), Xe(a), b)
};
We.prototype.v = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Xe(this), a, b);
  a.push(">")
};
function Xe(a) {
  return[a.$a, a.Rd, a.xd, a.Wd, a.qb, a.Nc, a.Ld, a.Jd, a.Ac, a.Hd, a.he, a.ee, a.sa, a.Lb]
}
We.prototype.H = Y;
We.prototype.R = function(a) {
  var b = {};
  b.tnum = this.$a;
  b.ver = this.Rd;
  b.format = this.xd;
  b["new"] = this.Wd;
  b.id = this.qb;
  b.ming = this.Nc;
  b.pad = this.Ld;
  b.maxb = this.Jd;
  t(this.Ac) && (b.maxt = this.Ac);
  b.maxia = this.Hd;
  b.tcpack = this.he;
  b.eeds = this.ee;
  b.sack = this.sa instanceof be ? ec((new Ye(this.sa)).H()) : this.sa;
  b.seenack = this.Lb instanceof be ? ec((new Ye(this.Lb)).H()) : this.Lb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(Xb(b), "H")
};
function Ze(a) {
  Q.call(this, "StringFrame", [a]);
  this.Pc = a
}
A(Ze, Q);
Ze.prototype.H = Y;
Ze.prototype.R = function(a) {
  a.push(this.Pc, " ")
};
function $e(a) {
  Q.call(this, "CommentFrame", [a]);
  this.ue = a
}
A($e, Q);
$e.prototype.H = Y;
$e.prototype.R = function(a) {
  a.push(this.ue, "^")
};
function af(a) {
  Q.call(this, "SeqNumFrame", [a]);
  this.be = a
}
A(af, Q);
af.prototype.H = Y;
af.prototype.R = function(a) {
  a.push("" + this.be, "N")
};
function bf(a) {
  var b = a.split("|");
  if(2 != b.length) {
    return k
  }
  a: {
    var c = b[1], a = ic;
    if(gc.test(c) && (c = parseInt(c, 10), -1 <= c && c <= a)) {
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
      var g = hc(b[d]);
      if(g == k) {
        return k
      }
      c.push(g)
    }
  }
  return new be(a, c)
}
function Ye(a) {
  Q.call(this, "SackFrame", [a]);
  this.sa = a
}
A(Ye, Q);
Ye.prototype.H = Y;
Ye.prototype.R = function(a) {
  var b = this.sa;
  a.push(b.Fa.join(","), "|", "" + b.Ia);
  a.push("A")
};
function cf(a) {
  Q.call(this, "StreamStatusFrame", [a]);
  this.Dd = a
}
A(cf, Q);
cf.prototype.H = Y;
cf.prototype.R = function(a) {
  var b = this.Dd;
  a.push(b.Fa.join(","), "|", "" + b.Ia);
  a.push("T")
};
function df() {
  Q.call(this, "StreamCreatedFrame", [])
}
A(df, Q);
df.prototype.H = Y;
df.prototype.R = function(a) {
  a.push("C")
};
function ef() {
  Q.call(this, "YouCloseItFrame", [])
}
A(ef, Q);
ef.prototype.H = Y;
ef.prototype.R = function(a) {
  a.push("Y")
};
function ff(a, b) {
  Q.call(this, "ResetFrame", [a, b]);
  this.Ud = a;
  this.Xc = b
}
A(ff, Q);
ff.prototype.H = Y;
ff.prototype.R = function(a) {
  a.push(this.Ud, "|", "" + Number(this.Xc), "!")
};
var gf = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function hf(a) {
  Q.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(hf, Q);
hf.prototype.H = Y;
hf.prototype.R = function(a) {
  a.push(this.reason, "K")
};
function jf(a) {
  a || f(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new Ze(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = bf(ec(a)), a == k && f(new X("bad sack")), new Ye(a)
  }
  if("N" == b) {
    return a = hc(ec(a)), a == k && f(new X("bad seqNum")), new af(a)
  }
  if("T" == b) {
    return a = bf(ec(a)), a == k && f(new X("bad lastSackSeen")), new cf(a)
  }
  if("Y" == b) {
    return 1 != a.length && f(new X("leading garbage")), new ef
  }
  if("^" == b) {
    return new $e(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && f(new X("leading garbage")), new df
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && f(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && f(new X("bad applicationLevel")), new ff(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = gf[a], a == k && f(new X("unknown kill reason: " + a)), new hf(a)
  }
  f(new X("Invalid frame type " + b))
}
;function kf(a, b, c, d) {
  this.contentWindow = a;
  this.Db = b;
  this.Oc = c;
  this.He = d
}
kf.prototype.v = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.He, a, b);
  a.push(", expandedUrl=");
  N(this.Db, a, b);
  a.push(", streams=");
  N(this.Oc, a, b);
  a.push(">")
};
function lf() {
  this.frames = [];
  this.yc = new P
}
lf.prototype.a = U("cw.net.XDRTracker");
function mf(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + Math.floor(Ve()) + ("" + Math.floor(Ve()))
  })
}
function nf(a, b) {
  for(var c = of, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], g;
    if(g = 0 == e.Oc.length) {
      g = e.Db;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      g = RegExp("^" + h + "$").test(g)
    }
    if(g) {
      return c.a.info("Giving " + O(b) + " existing frame " + O(e)), Rb(e)
    }
  }
  d = dc() + dc();
  e = mf(a);
  g = r.location;
  g instanceof Gd || (g = Wd(g));
  e instanceof Gd || (e = Wd(e));
  var l = g;
  g = l.O();
  (h = !!e.$) ? Hd(g, e.$) : h = !!e.Ha;
  h ? Id(g, e.Ha) : h = !!e.Q;
  h ? Jd(g, e.Q) : h = e.pa != k;
  var n = e.K;
  if(h) {
    Kd(g, e.pa)
  }else {
    if(h = !!e.K) {
      if("/" != n.charAt(0) && (l.Q && !l.K ? n = "/" + n : (l = g.K.lastIndexOf("/"), -1 != l && (n = g.K.substr(0, l + 1) + n))), ".." == n || "." == n) {
        n = ""
      }else {
        if(!(-1 == n.indexOf("./") && -1 == n.indexOf("/."))) {
          for(var l = 0 == n.lastIndexOf("/", 0), n = n.split("/"), u = [], H = 0;H < n.length;) {
            var q = n[H++];
            "." == q ? l && H == n.length && u.push("") : ".." == q ? ((1 < u.length || 1 == u.length && "" != u[0]) && u.pop(), l && H == n.length && u.push("")) : (u.push(q), l = j)
          }
          n = u.join("/")
        }
      }
    }
  }
  h ? Ld(g, n) : h = "" !== e.L.toString();
  h ? (l = e.L, l.Ka || (l.Ka = l.toString() ? decodeURIComponent(l.toString()) : ""), Md(g, l.Ka, i)) : h = !!e.za;
  h && Nd(g, e.za);
  e = g.toString();
  g = ("" + r.location).match(Ed)[3] || k;
  h = e.match(Ed)[3] || k;
  g == h ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = Rb(new kf(r, e, [b], k))) : ((g = Yc("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new M, c.yc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = ad("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), g.appendChild(c), c = h);
  return c
}
lf.prototype.tf = function(a) {
  var b = this.yc.get(a);
  b || f(Error("Unknown frameId " + O(a)));
  this.yc.remove(b);
  var c = b[0], a = new kf(Yc("minerva-xdrframe-" + a).contentWindow || (Yc("minerva-xdrframe-" + a).contentDocument || Yc("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Yc("minerva-xdrframe-" + a).contentDocument || Yc("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var of = new lf;
r.__XHRTracker_xdrFrameLoaded = y(of.tf, of);
var pf;
pf = m;
var qf = Ha();
qf && (-1 != qf.indexOf("Firefox") || -1 != qf.indexOf("Camino") || -1 != qf.indexOf("iPhone") || -1 != qf.indexOf("iPod") || -1 != qf.indexOf("iPad") || -1 != qf.indexOf("Android") || -1 != qf.indexOf("Chrome") && (pf = j));
var rf = pf;
var Ue = "4bdfc178fc0e508c0cd5efc3fdb09920";
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function sf(a, b, c, d, e, g) {
  M.call(this, e, g);
  this.Gd = a;
  this.kc = [];
  this.od = !!b;
  this.Fe = !!c;
  this.we = !!d;
  for(b = 0;b < a.length;b++) {
    a[b].ka(y(this.ud, this, b, j), y(this.ud, this, b, m))
  }
  0 == a.length && !this.od && this.N(this.kc)
}
A(sf, M);
sf.prototype.Nd = 0;
sf.prototype.ud = function(a, b, c) {
  this.Nd++;
  this.kc[a] = [b, c];
  this.da || (this.od && b ? this.N([a, c]) : this.Fe && !b ? this.U(c) : this.Nd == this.Gd.length && this.N(this.kc));
  this.we && !b && (c = k);
  return c
};
sf.prototype.U = function(a) {
  sf.m.U.call(this, a);
  fb(this.Gd, function(a) {
    a.cancel()
  })
};
function tf(a) {
  a = new sf(a, m, j);
  a.ua(function(a) {
    return gb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function uf(a, b) {
  this.sf = a;
  this.Id = b
}
uf.prototype.wc = 0;
uf.prototype.Ob = 0;
uf.prototype.pc = m;
function vf(a) {
  var b = [];
  if(a.pc) {
    return[b, 2]
  }
  var c = a.wc, d = a.sf.responseText;
  for(a.wc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var e = d.substr(a.Ob, c - a.Ob), e = e.replace(/\r$/, "");
    if(e.length > a.Id) {
      return a.pc = j, [b, 2]
    }
    b.push(e);
    a.Ob = c += 1
  }
  return a.wc - a.Ob - 1 > a.Id ? (a.pc = j, [b, 2]) : [b, 1]
}
;function wf(a, b, c) {
  this.w = b;
  this.S = a;
  this.hc = c
}
A(wf, J);
p = wf.prototype;
p.a = U("cw.net.XHRMaster");
p.ra = -1;
p.zc = function(a, b, c) {
  this.hc.__XHRSlave_makeRequest(this.S, a, b, c)
};
p.ma = o("ra");
p.Cc = function(a, b) {
  1 != b && this.a.F(O(this.S) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  Ie(this.w);
  Je(this.w, a)
};
p.Dc = function(a) {
  this.a.k("ongotheaders_: " + O(a));
  var b = k;
  "Content-Length" in a && (b = hc(a["Content-Length"]));
  a = this.w;
  a.a.k(a.l() + " got Content-Length: " + b);
  a.aa == xf && (b == k && (a.a.u("Expected to receive a valid Content-Length, but did not."), b = 5E5), yf(a, 2E3 + 1E3 * (b / 3072)))
};
p.Ec = function(a) {
  1 != a && this.a.k(this.w.l() + "'s XHR's readyState is " + a);
  this.ra = a;
  2 <= this.ra && Ie(this.w)
};
p.Bc = function() {
  this.w.b()
};
p.d = function() {
  wf.m.d.call(this);
  delete Z.fa[this.S];
  this.hc.__XHRSlave_dispose(this.S);
  delete this.hc
};
function zf() {
  this.fa = {}
}
A(zf, J);
p = zf.prototype;
p.a = U("cw.net.XHRMasterTracker");
p.jc = function(a, b) {
  var c = "_" + dc(), d = new wf(c, a, b);
  return this.fa[c] = d
};
p.Cc = function(a, b, c) {
  if(La) {
    for(var d = [], e = 0, g = b.length;e < g;e++) {
      d[e] = b[e]
    }
    b = d
  }else {
    b = kb(b)
  }
  (d = this.fa[a]) ? d.Cc(b, c) : this.a.F("onframes_: no master for " + O(a))
};
p.Dc = function(a, b) {
  var c = this.fa[a];
  c ? c.Dc(b) : this.a.F("ongotheaders_: no master for " + O(a))
};
p.Ec = function(a, b) {
  var c = this.fa[a];
  c ? c.Ec(b) : this.a.F("onreadystatechange_: no master for " + O(a))
};
p.Bc = function(a) {
  var b = this.fa[a];
  b ? (delete this.fa[b.S], b.Bc()) : this.a.F("oncomplete_: no master for " + O(a))
};
p.d = function() {
  zf.m.d.call(this);
  for(var a = Za(this.fa);a.length;) {
    a.pop().b()
  }
  delete this.fa
};
var Z = new zf;
r.__XHRMaster_onframes = y(Z.Cc, Z);
r.__XHRMaster_oncomplete = y(Z.Bc, Z);
r.__XHRMaster_ongotheaders = y(Z.Dc, Z);
r.__XHRMaster_onreadystatechange = y(Z.Ec, Z);
function Af(a, b, c) {
  this.Y = a;
  this.host = b;
  this.port = c
}
function Bf(a, b, c) {
  this.host = a;
  this.port = b;
  this.lf = c
}
function Cf(a, b) {
  b || (b = a);
  this.Y = a;
  this.ta = b
}
Cf.prototype.v = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.Y, a, b);
  a.push(", secondaryUrl=");
  N(this.ta, a, b);
  a.push(">")
};
function Df(a, b, c, d) {
  this.Y = a;
  this.Qd = b;
  this.ta = c;
  this.$d = d;
  (!(0 == this.Y.indexOf("http://") || 0 == this.Y.indexOf("https://")) || !(0 == this.ta.indexOf("http://") || 0 == this.ta.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Qd.location.href;
  Fd(this.Y, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.$d.location.href;
  Fd(this.ta, a) || f(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
Df.prototype.v = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.Y, a, b);
  a.push(", secondaryUrl=");
  N(this.ta, a, b);
  a.push(">")
};
var Ef = new $e(";)]}");
function Ff(a) {
  r.setTimeout(function() {
    t(a.message) && a.stack && (a.message += "\n" + a.stack);
    f(a)
  }, 0)
}
function Gf(a, b, c) {
  t(b) || (b = j);
  t(c) || (c = j);
  this.Ta = a;
  this.of = b;
  this.hf = c
}
p = Gf.prototype;
p.a = U("cw.net.QANProtocolWrapper");
p.kb = function(a, b) {
  this.a.u(a, b);
  this.hf && Ff(b)
};
p.ha = function(a) {
  this.Ya.ae(Gc(a), this.of)
};
p.Eb = function(a) {
  this.Ya.reset("QANHelper said: " + a)
};
p.ff = function(a) {
  this.Ya = a;
  this.Fc = new R(y(this.Ta.bodyReceived, this.Ta), y(this.kb, this), y(this.ha, this), y(this.Eb, this));
  this.Ta.streamStarted.call(this.Ta, this.Ya, this.Fc)
};
p.ef = function(a, b) {
  this.Fc.nd("Stream reset applicationLevel=" + O(b) + ", reason: " + a);
  this.Ta.streamReset.call(this.Ta, a, b)
};
p.gf = function(a) {
  try {
    var b = Jc(a)
  }catch(c) {
    c instanceof Hc || f(c);
    this.Ya.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Fc.vd(b)
};
function Hf(a) {
  this.Ya = a
}
Hf.prototype.v = function(a, b) {
  a.push("<UserContext for ");
  N(this.Ya, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.p = a;
  this.o = c ? c : Vb;
  this.rb = new id;
  this.qb = dc() + dc();
  this.Z = new ce;
  this.vc = new ee;
  this.tb = k;
  this.$b = [];
  this.sb = new Hf(this);
  this.re = y(this.mf, this);
  F && (this.tb = Ab(r, "load", this.Ze, m, this))
}
A($, J);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Ed = new be(-1, []);
p.Fd = new be(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = k;
p.onstarted = k;
p.onreset = k;
p.ondisconnect = k;
p.Wa = k;
p.Lc = m;
p.Hc = m;
p.z = 1;
p.Rc = -1;
p.e = k;
p.s = k;
p.mb = k;
p.Mc = 0;
p.Pd = 0;
p.Zd = 0;
p.v = function(a, b) {
  a.push("<ClientStream id=");
  N(this.qb, a, b);
  a.push(", state=", "" + this.z);
  a.push(", primary=");
  N(this.e, a, b);
  a.push(", secondary=");
  N(this.s, a, b);
  a.push(", resetting=");
  N(this.mb, a, b);
  a.push(">")
};
p.Je = o("sb");
p.pe = function(a) {
  t(a.streamStarted) || f(Error("Protocol is missing required method streamStarted"));
  t(a.streamReset) || f(Error("Protocol is missing required method streamReset"));
  t(a.stringReceived) || f(Error("Protocol is missing required method stringReceived"));
  this.onstarted = y(a.streamStarted, a);
  this.onreset = y(a.streamReset, a);
  this.onstring = y(a.stringReceived, a)
};
function If(a) {
  var b = [-1];
  a.e && b.push(a.e.Sa);
  a.s && b.push(a.s.Sa);
  return Math.max.apply(Math.max, b)
}
function Jf(a) {
  if(!(3 > a.z)) {
    Kf(a);
    var b = 0 != a.Z.D.B(), c = fe(a.vc), d = !c.I(a.Fd) && !(a.e && c.I(a.e.Pa) || a.s && c.I(a.s.Pa)), e = If(a);
    if((b = b && e < a.Z.xa) || d) {
      var g = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.cb ? (a.a.q("tryToSend_: writing " + g + " to primary"), d && (d = a.e, c != d.Pa && (!d.ia && !d.t.length && Lf(d), d.t.push(new Ye(c)), d.Pa = c)), b && Mf(a.e, a.Z, e + 1), a.e.ea()) : a.s == k ? a.Lc ? (a.a.q("tryToSend_: creating secondary to send " + g), a.s = Nf(a, m), b && Mf(a.s, a.Z, e + 1), a.s.ea()) : (a.a.q("tryToSend_: not creating a secondary because stream might not exist on server"), a.Hc = j) : a.a.q("tryToSend_: need to send " + g + ", but can't right now")
    }
  }
}
function Kf(a) {
  a.Wa != k && (a.o.A.clearTimeout(a.Wa), a.Wa = k)
}
p.mf = function() {
  this.Wa = k;
  Jf(this)
};
function Of(a) {
  a.Wa == k && (a.Wa = a.o.A.setTimeout(a.re, 6))
}
p.Ze = function() {
  this.tb = k;
  if(this.e && this.e.Oa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.bc = j;
    a.b()
  }
  this.s && this.s.Oa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.s, a.bc = j, a.b())
};
p.ae = function(a, b) {
  t(b) || (b = j);
  3 < this.z && f(Error("sendString: Can't send in state " + this.z));
  b && (x(a) || f(Error("sendString: not a string: " + O(a))), /^([ -~]*)$/.test(a) || f(Error("sendString: string has illegal chars: " + O(a))));
  this.Z.append(a);
  Of(this)
};
function Nf(a, b) {
  var c;
  a.p instanceof Df ? c = xf : a.p instanceof Bf ? c = Pf : f(Error("Don't support endpoint " + O(a.p)));
  a.Rc += 1;
  c = new Qf(a.o, a, a.Rc, c, a.p, b);
  a.a.q("Created: " + c.l());
  a.rb.add(c);
  return c
}
function Rf(a, b, c) {
  var d = new Sf(a.o, a, b, c);
  a.a.q("Created: " + d.l() + ", delay=" + b + ", times=" + c);
  a.rb.add(d);
  return d
}
function Tf(a, b) {
  a.rb.remove(b) || f(Error("transportOffline_: Transport was not removed?"));
  a.a.k("Offline: " + b.l());
  a.Mc = b.oa ? a.Mc + b.oa : 0;
  1 <= a.Mc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), Uf(a, "stream penalty reached limit", m), a.b());
  if(3 < a.z) {
    4 == a.z && b.ie ? (a.a.k("Disposing because resettingTransport_ is done."), a.b()) : a.a.k("Not creating a transport because ClientStream is in state " + a.z)
  }else {
    var c;
    var d;
    c = b instanceof Sf;
    if(!c && b.bc) {
      var e = F ? rf ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      a.a.q("getDelayForNextTransport_: " + O({delay:c, times:d}))
    }else {
      if(d = b.cd(), b == a.e ? d ? e = ++a.Pd : c || (e = a.Pd = 0) : d ? e = ++a.Zd : c || (e = a.Zd = 0), c || !e) {
        d = c = 0, a.a.q("getDelayForNextTransport_: " + O({count:e, delay:c, times:d}))
      }else {
        var g = 2E3 * Math.min(e, 3), h = Math.floor(4E3 * Math.random()) - 2E3, l = Math.max(0, b.ge - b.Sc);
        d = (c = Math.max(0, g + h - l)) ? 1 : 0;
        a.a.q("getDelayForNextTransport_: " + O({count:e, base:g, variance:h, oldDuration:l, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    b == a.e ? (a.e = k, c ? a.e = Rf(a, e, c) : (e = If(a), a.e = Nf(a, j), Mf(a.e, a.Z, e + 1)), a.e.ea()) : b == a.s && (a.s = k, c ? (a.s = Rf(a, e, c), a.s.ea()) : Jf(a))
  }
}
function Uf(a, b, c) {
  if(a.onreset) {
    try {
      a.onreset.call(a.sb, b, c)
    }catch(d) {
      a.a.u("onreset raised uncaught exception", d), Ff(d)
    }
  }
}
p.reset = function(a) {
  3 < this.z && f(Error("reset: Can't send reset in state " + this.z));
  Kf(this);
  0 != this.Z.D.B() && this.a.u("reset: strings in send queue will never be sent: " + O(this.Z));
  this.z = 4;
  this.e && this.e.cb ? (this.a.info("reset: Sending ResetFrame over existing primary."), Vf(this.e, a), this.e.ea()) : (this.e && (this.a.k("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.s && (this.a.k("reset: Disposing secondary before sending ResetFrame."), this.s.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.mb = Nf(this, m), Vf(this.mb, a), this.mb.ea());
  Uf(this, a, j)
};
function Wf(a, b, c, d) {
  var e;
  e = a.vc;
  for(var g = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], n = m, u = 0, H = c.length;u < H;u++) {
    var q = c[u], w = q[0], q = q[1];
    if(w == e.Da + 1) {
      e.Da += 1;
      for(l.push(q);;) {
        w = e.Da + 1;
        q = e.wa.get(w, ge);
        if(q === ge) {
          break
        }
        l.push(q[0]);
        e.wa.remove(w);
        e.G -= q[1];
        e.Da = w
      }
    }else {
      if(!(w <= e.Da)) {
        if(g != k && e.wa.B() >= g) {
          n = j;
          break
        }
        var D = ae(q);
        if(h != k && e.G + D > h) {
          n = j;
          break
        }
        e.wa.set(w, [q, D]);
        e.G += D
      }
    }
  }
  e.wa.hb() && e.wa.clear();
  e = [l, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(g = 0;g < c.length;g++) {
      h = c[g];
      if(a.onstring) {
        try {
          a.onstring.call(a.sb, h)
        }catch(qc) {
          a.a.u("onstring raised uncaught exception", qc), Ff(qc)
        }
      }
      if(4 == a.z || a.ba) {
        return
      }
    }
  }
  d || Of(a);
  if(!(4 == a.z || a.ba) && e) {
    b.a.F(b.l() + "'s peer caused rwin overflow."), b.b()
  }
}
p.kd = function(a) {
  this.a.F("Failed to start " + O(this) + "; error was " + O(a.message));
  this.b()
};
p.start = function() {
  this.onmessage && f(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  1 != this.z && f(Error("ClientStream.start: " + O(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.z = 2;
  if(this.p instanceof Cf) {
    var a = nf(this.p.Y, this), b = nf(this.p.ta, this), a = tf([a, b]);
    a.ua(y(this.De, this));
    a.vb(y(this.kd, this))
  }else {
    if(this.p instanceof Af) {
      if(yc) {
        this.md()
      }else {
        var a = Te(this.o, this.p.Y), c = this;
        a.ua(function(a) {
          yc || (yc = new Me(c.o, a));
          return k
        });
        a.ua(y(this.md, this));
        a.vb(y(this.kd, this))
      }
    }else {
      Xf(this)
    }
  }
};
p.De = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Db, e = a[1].Db;
  this.$b.push(a[0]);
  this.$b.push(a[1]);
  this.p = new Df(d, b, e, c);
  Xf(this)
};
p.md = function() {
  this.p = new Bf(this.p.host, this.p.port, yc);
  Xf(this)
};
function Xf(a) {
  a.z = 3;
  a.e = Nf(a, j);
  Mf(a.e, a.Z, k);
  a.e.ea()
}
p.d = function() {
  this.a.info(O(this) + " in disposeInternal.");
  Kf(this);
  this.z = 5;
  for(var a = this.rb.J(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.$b.length;a++) {
    jb(this.$b[a].Oc, this)
  }
  F && this.tb && (Cb(this.tb), this.tb = k);
  this.ondisconnect && this.ondisconnect.call(this.sb);
  delete this.rb;
  delete this.e;
  delete this.s;
  delete this.mb;
  delete this.sb;
  $.m.d.call(this)
};
var xf = 1, Pf = 3;
function Qf(a, b, c, d, e, g) {
  this.o = a;
  this.C = b;
  this.$a = c;
  this.aa = d;
  this.p = e;
  this.t = [];
  this.Ja = g;
  this.cb = !this.Oa();
  this.Va = this.aa != xf;
  this.qe = y(this.jf, this)
}
A(Qf, J);
p = Qf.prototype;
p.a = U("cw.net.ClientTransport");
p.j = k;
p.Sc = k;
p.ge = k;
p.Tb = k;
p.ia = m;
p.Xb = m;
p.Pa = k;
p.Gb = 0;
p.Sa = -1;
p.Qb = -1;
p.ie = m;
p.bc = m;
p.oa = 0;
p.gb = m;
p.v = function(a) {
  a.push("<ClientTransport #", "" + this.$a, ", becomePrimary=", "" + this.Ja, ">")
};
p.l = function() {
  return(this.Ja ? "Prim. T#" : "Sec. T#") + this.$a
};
p.cd = function() {
  return!(!this.gb && this.Gb)
};
p.Oa = function() {
  return this.aa == xf || 2 == this.aa
};
function Yf(a, b) {
  nb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Wf(a.C, a, b, !a.Va)
}
function Zf(a, b, c) {
  try {
    var d = jf(b);
    a.Gb += 1;
    a.a.k(a.l() + " RECV " + O(d));
    var e;
    1 == a.Gb && !d.I(Ef) && a.Oa() ? (a.a.u(a.l() + " is closing soon because got bad preamble: " + O(d)), e = j) : e = m;
    if(e) {
      return j
    }
    if(d instanceof Ze) {
      if(!/^([ -~]*)$/.test(d.Pc)) {
        return a.gb = j
      }
      a.Qb += 1;
      c.push([a.Qb, d.Pc])
    }else {
      if(d instanceof Ye) {
        var g = a.C, h = d.sa;
        g.Ed = h;
        var l = g.Z, n = h.Ia, c = m;
        n > l.xa && (c = j);
        for(var u = de(l).concat(), d = 0;d < u.length;d++) {
          var H = u[d];
          if(H > n) {
            break
          }
          var q = l.D.get(H)[1];
          l.D.remove(H);
          l.G -= q
        }
        for(d = 0;d < h.Fa.length;d++) {
          var w = h.Fa[d];
          w > l.xa && (c = j);
          l.D.P(w) && (q = l.D.get(w)[1], l.D.remove(w), l.G -= q)
        }
        l.D.hb() && l.D.clear();
        if(c) {
          return a.a.u(a.l() + " is closing soon because got bad SackFrame"), a.gb = j
        }
      }else {
        if(d instanceof af) {
          a.Qb = d.be - 1
        }else {
          if(d instanceof cf) {
            a.C.Fd = d.Dd
          }else {
            if(d instanceof ef) {
              return a.a.q(a.l() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof hf) {
              return a.gb = j, "stream_attach_failure" == d.reason ? a.oa += 1 : "acked_unsent_strings" == d.reason && (a.oa += 0.5), a.a.q(a.l() + " is closing soon because got " + O(d)), j
            }
            if(!(d instanceof $e)) {
              if(d instanceof df) {
                var D = a.C, qc = !a.Va;
                D.a.q("Stream is now confirmed to exist at server.");
                D.Lc = j;
                D.Hc && !qc && (D.Hc = m, Jf(D))
              }else {
                if(c.length) {
                  Yf(a, c);
                  if(!v(c)) {
                    for(var wd = c.length - 1;0 <= wd;wd--) {
                      delete c[wd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof ff) {
                  var Oe = a.C;
                  Uf(Oe, d.Ud, d.Xc);
                  Oe.b();
                  return j
                }
                f(Error(a.l() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Pe) {
    return Pe instanceof X || f(Pe), a.a.u(a.l() + " is closing soon because got InvalidFrame: " + O(b)), a.gb = j
  }
  return m
}
function Je(a, b) {
  a.Xb = j;
  try {
    for(var c = m, d = [], e = 0, g = b.length;e < g;e++) {
      if(a.ba) {
        a.a.info(a.l() + " returning from loop because we're disposed.");
        return
      }
      if(c = Zf(a, b[e], d)) {
        break
      }
    }
    d.length && Yf(a, d);
    a.Xb = m;
    a.t.length && a.ea();
    c && (a.a.q(a.l() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Xb = m
  }
}
p.jf = function() {
  this.a.u(this.l() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function $f(a) {
  a.Tb != k && (a.o.A.clearTimeout(a.Tb), a.Tb = k)
}
function yf(a, b) {
  $f(a);
  b = Math.round(b);
  a.Tb = a.o.A.setTimeout(a.qe, b);
  a.a.k(a.l() + "'s receive timeout set to " + b + " ms.")
}
function Ie(a) {
  a.aa != xf && (a.aa == Pf || 2 == a.aa ? yf(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.aa)))
}
function Lf(a) {
  var b = new We;
  b.$a = a.$a;
  b.Rd = 2;
  b.xd = 2;
  a.C.Lc || (b.Wd = j);
  b.qb = a.C.qb;
  b.Nc = a.Va;
  b.Nc && (b.Ld = 4096);
  b.Jd = 3E5;
  b.Hd = a.Va ? Math.floor(10) : 0;
  b.he = m;
  a.Ja && (b.ee = k, b.Ac = Math.floor((a.Va ? 358E4 : 25E3) / 1E3));
  b.sa = fe(a.C.vc);
  b.Lb = a.C.Ed;
  a.t.push(b);
  a.Pa = b.sa
}
function Ke(a, b) {
  b && (a.oa += 0.5);
  a.b()
}
p.ea = function() {
  this.ia && !this.cb && f(Error("flush_: Can't flush more than once to this transport."));
  if(this.Xb) {
    this.a.q(this.l() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ia;
    this.ia = j;
    !a && !this.t.length && Lf(this);
    for(a = 0;a < this.t.length;a++) {
      this.a.k(this.l() + " SEND " + O(this.t[a]))
    }
    if(this.Oa()) {
      for(var a = [], b = 0, c = this.t.length;b < c;b++) {
        this.t[b].R(a), a.push("\n")
      }
      this.t = [];
      a = a.join("");
      b = this.Ja ? this.p.Y : this.p.ta;
      this.j = Z.jc(this, this.Ja ? this.p.Qd : this.p.$d);
      this.Sc = this.o.A === Jb ? oa() : this.o.A.getTime();
      this.j.zc(b, "POST", a);
      yf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.Va ? 0 : this.Ja ? 25E3 : 0))
    }else {
      if(this.aa == Pf) {
        a = [];
        b = 0;
        for(c = this.t.length;b < c;b++) {
          a.push(this.t[b].H())
        }
        this.t = [];
        this.j ? this.j.ub(a) : (b = this.p, this.j = new Ne(this), this.j.Wb = b.lf.jc(this.j), this.Sc = this.o.A === Jb ? oa() : this.o.A.getTime(), this.j.fc(b.host, b.port), this.j.ba || (this.j.ub(a), this.j.ba || yf(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.aa))
      }
    }
  }
};
function Mf(a, b, c) {
  !a.ia && !a.t.length && Lf(a);
  for(var d = Math.max(c, a.Sa + 1), e = de(b), c = [], g = 0;g < e.length;g++) {
    var h = e[g];
    (d == k || h >= d) && c.push([h, b.D.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    g = c[b], e = g[0], g = g[1], (-1 == a.Sa || a.Sa + 1 != e) && a.t.push(new af(e)), a.t.push(new Ze(g)), a.Sa = e
  }
}
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Qf.m.d.call(this);
  this.ge = this.o.A === Jb ? oa() : this.o.A.getTime();
  this.t = [];
  $f(this);
  this.j && this.j.b();
  var a = this.C;
  this.C = k;
  Tf(a, this)
};
function Vf(a, b) {
  !a.ia && !a.t.length && Lf(a);
  a.t.push(new ff(b, j));
  a.ie = j
}
function Sf(a, b, c, d) {
  this.o = a;
  this.C = b;
  this.jd = c;
  this.ed = d
}
A(Sf, J);
p = Sf.prototype;
p.ia = m;
p.cb = m;
p.Hb = k;
p.Pa = k;
p.a = U("cw.net.DoNothingTransport");
function ag(a) {
  a.Hb = a.o.A.setTimeout(function() {
    a.Hb = k;
    a.ed--;
    a.ed ? ag(a) : a.b()
  }, a.jd)
}
p.ea = function() {
  this.ia && !this.cb && f(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ia = j;
  ag(this)
};
p.v = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.jd, ">")
};
p.Oa = ba(m);
p.l = ba("Wast. T");
p.cd = ba(m);
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Sf.m.d.call(this);
  this.Hb != k && this.o.A.clearTimeout(this.Hb);
  var a = this.C;
  this.C = k;
  Tf(a, this)
};
function bg() {
}
bg.prototype.xb = k;
var cg;
function dg() {
}
A(dg, bg);
function eg(a) {
  return(a = fg(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function gg(a) {
  var b = {};
  fg(a) && (b[0] = j, b[1] = j);
  return b
}
dg.prototype.tc = k;
function fg(a) {
  if(!a.tc && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.tc = d
      }catch(e) {
      }
    }
    f(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.tc
}
cg = new dg;
function hg(a) {
  this.headers = new P;
  this.ab = a || k
}
A(hg, Ib);
hg.prototype.a = U("goog.net.XhrIo");
var ig = /^https?$/i;
p = hg.prototype;
p.ja = m;
p.f = k;
p.ac = k;
p.xc = "";
p.Cd = "";
p.ib = "";
p.lc = m;
p.Jb = m;
p.uc = m;
p.Ba = m;
p.Yb = 0;
p.Ga = k;
p.Yd = "";
p.qf = m;
p.send = function(a, b, c, d) {
  this.f && f(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.xc = a;
  this.ib = "";
  this.Cd = b;
  this.lc = m;
  this.ja = j;
  this.f = this.ab ? eg(this.ab) : eg(cg);
  this.ac = this.ab ? this.ab.xb || (this.ab.xb = gg(this.ab)) : cg.xb || (cg.xb = gg(cg));
  this.f.onreadystatechange = y(this.Od, this);
  try {
    this.a.k(jg(this, "Opening Xhr")), this.uc = j, this.f.open(b, a, j), this.uc = m
  }catch(e) {
    this.a.k(jg(this, "Error opening Xhr: " + e.message));
    kg(this, e);
    return
  }
  var a = c || "", g = this.headers.O();
  d && mc(d, function(a, b) {
    g.set(b, a)
  });
  "POST" == b && !g.P("Content-Type") && g.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  mc(g, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.Yd && (this.f.responseType = this.Yd);
  "withCredentials" in this.f && (this.f.withCredentials = this.qf);
  try {
    this.Ga && (Jb.clearTimeout(this.Ga), this.Ga = k), 0 < this.Yb && (this.a.k(jg(this, "Will abort after " + this.Yb + "ms if incomplete")), this.Ga = Jb.setTimeout(y(this.kf, this), this.Yb)), this.a.k(jg(this, "Sending request")), this.Jb = j, this.f.send(a), this.Jb = m
  }catch(h) {
    this.a.k(jg(this, "Send error: " + h.message)), kg(this, h)
  }
};
p.kf = function() {
  "undefined" != typeof ca && this.f && (this.ib = "Timed out after " + this.Yb + "ms, aborting", this.a.k(jg(this, this.ib)), this.dispatchEvent("timeout"), this.abort(8))
};
function kg(a, b) {
  a.ja = m;
  a.f && (a.Ba = j, a.f.abort(), a.Ba = m);
  a.ib = b;
  lg(a);
  mg(a)
}
function lg(a) {
  a.lc || (a.lc = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function() {
  this.f && this.ja && (this.a.k(jg(this, "Aborting")), this.ja = m, this.Ba = j, this.f.abort(), this.Ba = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), mg(this))
};
p.d = function() {
  this.f && (this.ja && (this.ja = m, this.Ba = j, this.f.abort(), this.Ba = m), mg(this, j));
  hg.m.d.call(this)
};
p.Od = function() {
  !this.uc && !this.Jb && !this.Ba ? this.Ve() : ng(this)
};
p.Ve = function() {
  ng(this)
};
function ng(a) {
  if(a.ja && "undefined" != typeof ca) {
    if(a.ac[1] && 4 == a.ma() && 2 == og(a)) {
      a.a.k(jg(a, "Local request error detected and ignored"))
    }else {
      if(a.Jb && 4 == a.ma()) {
        Jb.setTimeout(y(a.Od, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.ma()) {
          a.a.k(jg(a, "Request complete"));
          a.ja = m;
          try {
            var b = og(a), c, d;
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
                  d = m
              }
            }
            if(!(c = d)) {
              var e;
              if(e = 0 === b) {
                var g = ("" + a.xc).match(Ed)[1] || k;
                if(!g && self.location) {
                  var h = self.location.protocol, g = h.substr(0, h.length - 1)
                }
                e = !ig.test(g ? g.toLowerCase() : "")
              }
              c = e
            }
            if(c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success")
            }else {
              var l;
              try {
                l = 2 < a.ma() ? a.f.statusText : ""
              }catch(n) {
                a.a.k("Can not get status: " + n.message), l = ""
              }
              a.ib = l + " [" + og(a) + "]";
              lg(a)
            }
          }finally {
            mg(a)
          }
        }
      }
    }
  }
}
function mg(a, b) {
  if(a.f) {
    var c = a.f, d = a.ac[0] ? ea : k;
    a.f = k;
    a.ac = k;
    a.Ga && (Jb.clearTimeout(a.Ga), a.Ga = k);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(e) {
      a.a.F("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
}
p.ma = function() {
  return this.f ? this.f.readyState : 0
};
function og(a) {
  try {
    return 2 < a.ma() ? a.f.status : -1
  }catch(b) {
    return a.a.u("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.ma() ? this.f.getResponseHeader(a) : i
};
function jg(a, b) {
  return b + " [" + a.Cd + " " + a.xc + " " + og(a) + "]"
}
;var pg = !(E || F && !G("420+"));
function qg(a, b) {
  this.Zb = a;
  this.S = b
}
A(qg, J);
p = qg.prototype;
p.j = k;
p.ra = -1;
p.td = m;
p.wd = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function rg(a) {
  var b = vf(a.gd), c = b[0], b = b[1], d = r.parent;
  d ? (d.__XHRMaster_onframes(a.S, c, b), 1 != b && a.b()) : a.b()
}
p.Me = function() {
  rg(this);
  if(!this.ba) {
    var a = r.parent;
    a && a.__XHRMaster_oncomplete(this.S);
    this.b()
  }
};
p.Xe = function() {
  var a = r.parent;
  if(a) {
    this.ra = this.j.ma();
    if(2 <= this.ra && !this.td) {
      for(var b = new P, c = this.wd.length;c--;) {
        var d = this.wd[c];
        try {
          b.set(d, this.j.f.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.B() && (this.td = j, a.__XHRMaster_ongotheaders(this.S, sc(b)), this.ba)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.S, this.ra);
    pg && 3 == this.ra && rg(this)
  }else {
    this.b()
  }
};
p.zc = function(a, b, c) {
  this.j = new hg;
  xb(this.j, "readystatechange", y(this.Xe, this));
  xb(this.j, "complete", y(this.Me, this));
  this.j.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.gd = new uf(this.j.f, 1048576)
};
p.d = function() {
  qg.m.d.call(this);
  delete this.gd;
  this.j && this.j.b();
  delete this.Zb.pb[this.S];
  delete this.Zb
};
function sg() {
  this.pb = {}
}
A(sg, J);
sg.prototype.Re = function(a, b, c, d) {
  var e = new qg(this, a);
  this.pb[a] = e;
  e.zc(b, c, d)
};
sg.prototype.Ae = function(a) {
  (a = this.pb[a]) && a.b()
};
sg.prototype.d = function() {
  sg.m.d.call(this);
  for(var a = Za(this.pb);a.length;) {
    a.pop().b()
  }
  delete this.pb
};
var tg = new sg;
r.__XHRSlave_makeRequest = y(tg.Re, tg);
r.__XHRSlave_dispose = y(tg.Ae, tg);
var ug = U("cw.net.demo");
function vg(a, b, c, d) {
  a = new Gd(document.location);
  if(c) {
    return new Af(d, a.Q, r.__demo_mainSocketPort)
  }
  b ? (b = r.__demo_shared_domain, x(b) || f(Error("domain was " + O(b) + "; expected a string.")), c = a.O(), Jd(c, "_____random_____." + b)) : c = a.O();
  Ld(c, d);
  Md(c, "", i);
  return new Cf(c.toString().replace("_____random_____", "%random%"))
}
;z("Minerva.HttpEndpoint", Cf);
z("Minerva.SocketEndpoint", Af);
z("Minerva.QANHelper", R);
R.prototype.handleQANFrame = R.prototype.vd;
R.prototype.ask = R.prototype.ne;
R.prototype.notify = R.prototype.Ue;
R.prototype.failAll = R.prototype.nd;
z("Minerva.QANProtocolWrapper", Gf);
Gf.prototype.streamStarted = Gf.prototype.ff;
Gf.prototype.streamReset = Gf.prototype.ef;
Gf.prototype.stringReceived = Gf.prototype.gf;
z("Minerva.Deferred", M);
M.prototype.cancel = M.prototype.cancel;
M.prototype.callback = M.prototype.N;
M.prototype.errback = M.prototype.U;
M.prototype.addErrback = M.prototype.vb;
M.prototype.addCallback = M.prototype.ua;
M.prototype.addCallbacks = M.prototype.ka;
M.prototype.chainDeferred = M.prototype.bd;
M.prototype.awaitDeferred = M.prototype.oe;
M.prototype.branch = M.prototype.$c;
M.prototype.addBoth = M.prototype.Wc;
M.prototype.hasFired = M.prototype.Le;
z("Minerva.Deferred.succeed", Rb);
z("Minerva.Deferred.fail", Sb);
z("Minerva.Deferred.cancelled", function() {
  var a = new M;
  a.cancel();
  return a
});
z("Minerva.Deferred.AlreadyCalledError", Ob);
z("Minerva.Deferred.CancelledError", Kb);
z("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Je;
$.prototype.bindToProtocol = $.prototype.pe;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.ae;
$.prototype.reset = $.prototype.reset;
z("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.Ic;
S.prototype.shout = S.prototype.af;
S.prototype.severe = S.prototype.F;
S.prototype.warning = S.prototype.u;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.ve;
S.prototype.fine = S.prototype.k;
S.prototype.finer = S.prototype.Ee;
S.prototype.finest = S.prototype.q;
T.OFF = rd;
T.SHOUT = sd;
T.SEVERE = td;
T.WARNING = ud;
T.INFO = vd;
T.CONFIG = xd;
T.FINE = yd;
T.FINER = zd;
T.FINEST = Ad;
T.ALL = Bd;
z("Minerva.LogManager", V);
V.getRoot = V.qc;
z("Minerva.DivConsole", Dd);
Dd.prototype.setCapturing = Dd.prototype.$e;
z("Minerva.JSON", {});
z("Minerva.JSON.parse", function(a) {
  a = "" + a;
  if(/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  f(Error("Invalid JSON string: " + a))
});
z("Minerva.JSON.serialize", Xb);
z("Minerva.JSON.asciify", Xb);
z("Minerva.bind", y);
z("Minerva.repr", O);
z("Minerva.theCallQueue", Vb);
z("Minerva.getEndpoint", vg);
z("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new Gd(document.location)).L;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !r.__demo_shared_domain) {
    ug.u("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return vg(0, a, b, "/_minerva/")
});
})();
