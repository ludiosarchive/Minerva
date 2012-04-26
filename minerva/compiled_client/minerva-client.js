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
p.Ya = m;
p.dc = m;
p.Kb = function(a, b, c, d, e, g) {
  ia(a) ? this.Dd = j : a && a.handleEvent && ia(a.handleEvent) ? this.Dd = m : f(Error("Invalid listener argument"));
  this.kb = a;
  this.Ud = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.rc = g;
  this.dc = m;
  this.key = ++Xa;
  this.Ya = m
};
p.handleEvent = function(a) {
  return this.Dd ? this.kb.call(this.rc || this.src, a) : this.kb.handleEvent.call(this.kb, a)
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
;var pb = {Bf:"click", Gf:"dblclick", $f:"mousedown", dg:"mouseup", cg:"mouseover", bg:"mouseout", ag:"mousemove", ng:"selectstart", Vf:"keypress", Uf:"keydown", Wf:"keyup", zf:"blur", Of:"focus", Hf:"deactivate", Pf:E ? "focusin" : "DOMFocusIn", Qf:E ? "focusout" : "DOMFocusOut", Af:"change", mg:"select", og:"submit", Tf:"input", ig:"propertychange", Lf:"dragstart", If:"dragenter", Kf:"dragover", Jf:"dragleave", Mf:"drop", sg:"touchstart", rg:"touchmove", qg:"touchend", pg:"touchcancel", Df:"contextmenu", 
Nf:"error", Sf:"help", Xf:"load", Yf:"losecapture", jg:"readystatechange", kg:"resize", lg:"scroll", ug:"unload", Rf:"hashchange", eg:"pagehide", fg:"pageshow", hg:"popstate", Ef:"copy", gg:"paste", Ff:"cut", wf:"beforecopy", xf:"beforecut", yf:"beforepaste", Zf:"message", Cf:"connect", tg:F ? "webkitTransitionEnd" : Ka ? "oTransitionEnd" : "transitionend"};
function J() {
}
J.prototype.Q = m;
J.prototype.b = function() {
  this.Q || (this.Q = j, this.d())
};
J.prototype.d = function() {
  this.Ae && qb.apply(k, this.Ae)
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
p.Ia = m;
p.defaultPrevented = m;
p.Vb = j;
p.stopPropagation = function() {
  this.Ia = j
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
p.Pa = k;
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
  this.Pa = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Ia
};
p.stopPropagation = function() {
  ub.m.stopPropagation.call(this);
  this.Pa.stopPropagation ? this.Pa.stopPropagation() : this.Pa.cancelBubble = j
};
p.preventDefault = function() {
  ub.m.preventDefault.call(this);
  var a = this.Pa;
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
  this.relatedTarget = this.currentTarget = this.target = this.Pa = k
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
        if(h = n[g], h.kb == c && h.rc == e) {
          if(h.Ya) {
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
    a.addEventListener ? (a == r || !a.hd) && a.addEventListener(b, g, d) : a.attachEvent(b in wb ? wb[b] : wb[b] = "on" + b, g);
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
        if(a[g].kb == c && a[g].capture == d && a[g].rc == e) {
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
  if(b.Ya) {
    return m
  }
  var c = b.src, d = b.type, e = b.Ud, g = b.capture;
  c.removeEventListener ? (c == r || !c.hd) && c.removeEventListener(d, e, g) : c.detachEvent && c.detachEvent(d in wb ? wb[d] : wb[d] = "on" + d, e);
  c = ja(c);
  e = K[d][g][c];
  if(L[c]) {
    var h = L[c];
    jb(h, b);
    0 == h.length && delete L[c]
  }
  b.Ya = j;
  e.Od = j;
  Db(d, g, c, e);
  delete vb[a];
  return j
}
function Db(a, b, c, d) {
  if(!d.Mb && d.Od) {
    for(var e = 0, g = 0;e < d.length;e++) {
      d[e].Ya ? d[e].Ud.src = k : (e != g && (d[g] = d[e]), g++)
    }
    d.length = g;
    d.Od = m;
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
        n && !n.Ya && (g &= Gb(n, e) !== m)
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
        for(var D = q.length - 1;!u.Ia && 0 <= D && h.M;D--) {
          u.currentTarget = q[D], g &= Fb(h, q[D], d, j, u)
        }
        if(n) {
          h = e[m];
          h.M = h.c;
          for(D = 0;!u.Ia && D < q.length && h.M;D++) {
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
p.hd = j;
p.Pb = k;
p.Lc = aa("Pb");
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
      for(var h = e.length - 1;!a.Ia && 0 <= h && g.M;h--) {
        a.currentTarget = e[h], d &= Fb(g, e[h], a.type, j, a) && a.Vb != m
      }
    }
    if(m in c) {
      if(g = c[m], g.M = g.c, b) {
        for(h = 0;!a.Ia && h < e.length && g.M;h++) {
          a.currentTarget = e[h], d &= Fb(g, e[h], a.type, m, a) && a.Vb != m
        }
      }else {
        for(e = this;!a.Ia && e && g.M;e = e.Pb) {
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
  this.cd = a;
  this.kd = b || k
}
p = M.prototype;
p.da = m;
p.gb = m;
p.mb = 0;
p.Mc = m;
p.ve = m;
p.wb = 0;
p.cancel = function(a) {
  if(this.da) {
    this.ob instanceof M && this.ob.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.wb--, 0 >= b.wb && b.cancel())
    }
    this.cd ? this.cd.call(this.kd, this) : this.Mc = j;
    this.da || this.V(new Kb)
  }
};
p.fd = function(a, b) {
  Lb(this, a, b);
  this.mb--;
  0 == this.mb && this.da && Mb(this)
};
function Lb(a, b, c) {
  a.da = j;
  a.ob = c;
  a.gb = !b;
  Mb(a)
}
function Nb(a) {
  a.da && (a.Mc || f(new Ob), a.Mc = m)
}
p.N = function(a) {
  Nb(this);
  Lb(this, j, a)
};
p.V = function(a) {
  Nb(this);
  Lb(this, m, a)
};
p.xa = function(a, b) {
  return this.la(a, k, b)
};
p.vb = function(a, b) {
  return this.la(k, a, b)
};
p.la = function(a, b, c) {
  this.yb.push([a, b, c]);
  this.da && Mb(this);
  return this
};
p.dd = function(a) {
  this.la(a.N, a.V, a);
  return this
};
p.qe = function(a) {
  return this.xa(y(a.bd, a))
};
p.bd = function(a) {
  var b = new M;
  this.dd(b);
  a && (b.t = this, this.wb++);
  return b
};
p.Yc = function(a, b) {
  return this.la(a, a, b)
};
p.Ne = o("da");
function Pb(a) {
  return hb(a.yb, function(a) {
    return ia(a[1])
  })
}
function Mb(a) {
  a.Vc && (a.da && Pb(a)) && (r.clearTimeout(a.Vc), delete a.Vc);
  a.t && (a.t.wb--, delete a.t);
  for(var b = a.ob, c = m, d = m;a.yb.length && 0 == a.mb;) {
    var e = a.yb.shift(), g = e[0], h = e[1], e = e[2];
    if(g = a.gb ? h : g) {
      try {
        var l = g.call(e || a.kd, b);
        t(l) && (a.gb = a.gb && (l == b || l instanceof Error), a.ob = b = l);
        b instanceof M && (d = j, a.mb++)
      }catch(n) {
        b = n, a.gb = j, Pb(a) || (c = j)
      }
    }
  }
  a.ob = b;
  d && a.mb && (b.la(y(a.fd, a, j), y(a.fd, a, m)), b.ve = j);
  c && (a.Vc = r.setTimeout(function() {
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
  b.V(a);
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
  this.nd = [];
  this.ue = y(this.pf, this)
}
Tb.prototype.Sc = k;
function Ub(a, b, c, d) {
  a.Cb.push([b, c, d]);
  a.Sc == k && (a.Sc = a.A.setTimeout(a.ue, 0))
}
Tb.prototype.pf = function() {
  this.Sc = k;
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
    a = this.nd;
    this.nd = [];
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
        if(Wb(a.w)) {
          a.w(b, c)
        }else {
          if(Wb(a.me)) {
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
  if("function" == typeof a.W) {
    return a.W()
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
p.W = function() {
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
  var c = b || qc;
  oc(this);
  for(var d, e = 0;d = this.h[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function qc(a, b) {
  return a === b
}
p.ib = function() {
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
  a instanceof P ? (b = a.W(), a = a.J()) : (b = $a(a), a = Za(a));
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
;var uc = {me:ba("<cw.eq.Wildcard>")};
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
          if(a.le == Ca && b.le == Ca) {
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
  this.$e = a;
  this.Sb = b
}
Q.prototype.I = function(a, b) {
  return ha(a) && this.constructor == a.constructor && wc(this.Sb, a.Sb, b)
};
Q.prototype.w = function(a, b) {
  a.push("new ", this.$e, "(");
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
Kc.prototype.w = function(a, b) {
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
Lc.prototype.w = function(a, b) {
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
  this.ad = a;
  this.lb = b;
  this.ha = c;
  this.Eb = d;
  this.Rb = 0;
  this.pa = new P;
  this.bb = new P
}
p = R.prototype;
p.w = function(a) {
  a.push("<QANHelper asked ", "" + this.Rb, " questions, waiting for ", "" + this.pa.B(), " peer answers and ", "" + this.bb.B(), " local answers>")
};
p.xd = function(a) {
  if(a instanceof Ac || a instanceof Bc || a instanceof Cc) {
    var b = a.ga, c = this.pa.get(b);
    this.pa.remove(b);
    t(c) ? c !== k && (a instanceof Ac ? c.N(a.body) : a instanceof Bc ? c.V(new Kc(a.body)) : a instanceof Cc ? c.V(new Lc(a.body)) : f(Error("handleQANFrame bug"))) : this.Eb("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof Ec) {
      try {
        this.ad(a.body, m)
      }catch(d) {
        this.lb("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof zc) {
        if(b = a.ga, this.bb.P(b)) {
          this.Eb("Received Question with duplicate qid: " + b)
        }else {
          c = tc(this.ad, [a.body, j]);
          this.bb.set(b, c);
          var e = this;
          c.la(function(a) {
            var c = b;
            e.bb.remove(c);
            e.ha(new Ac(a, c));
            return k
          }, function(a) {
            var c = b;
            e.bb.remove(c);
            a instanceof Kc ? e.ha(new Bc(a.body, c)) : a instanceof Kb ? e.ha(new Cc("CancelledError", c)) : (e.lb("Peer's Question #" + c + " caused uncaught exception", a), e.ha(new Cc("Uncaught exception", c)));
            return k
          });
          c.vb(function(a) {
            this.lb("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof Dc && (b = a.ga, c = this.bb.get(b), t(c) && c.cancel())
      }
    }
  }
};
p.pe = function(a) {
  var b = this.Rb + 1;
  this.ha(new zc(a, b));
  this.Rb += 1;
  var c = this, a = new M(function() {
    c.pa.set(b, k);
    c.ha(new Dc(b))
  });
  this.pa.set(b, a);
  return a
};
p.We = function(a) {
  this.ha(new Ec(a))
};
p.pd = function(a) {
  for(var b = this.pa.W(), c = 0;c < b.length;c++) {
    var d = this.pa.get(b[c]);
    t(d) && (this.pa.set(b[c], k), d.V(new Mc(a)))
  }
};
function Nc() {
  this.Xd = oa()
}
var Oc = new Nc;
Nc.prototype.set = aa("Xd");
Nc.prototype.reset = function() {
  this.set(oa())
};
Nc.prototype.get = o("Xd");
function Pc(a) {
  this.Ye = a || "";
  this.ff = Oc
}
Pc.prototype.ee = j;
Pc.prototype.ef = j;
Pc.prototype.df = j;
Pc.prototype.fe = m;
function Qc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Rc(a, b) {
  var c = (a.he - b) / 1E3, d = c.toFixed(3), e = 0;
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
Sc.prototype.fe = j;
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
  this.Ca = a || r.document || document
}
p = Xc.prototype;
p.sd = Wc;
p.Ea = function(a) {
  return x(a) ? this.Ca.getElementById(a) : a
};
function fd(a, b) {
  var c;
  c = a.Ca;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && (c.querySelector && (!F || "CSS1Compat" == document.compatMode || G("528"))) && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.fb = function(a, b, c) {
  return bd(this.Ca, arguments)
};
p.createElement = function(a) {
  return this.Ca.createElement(a)
};
p.createTextNode = function(a) {
  return this.Ca.createTextNode(a)
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
p.Ic = function(a) {
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
p.ib = function() {
  return this.n.ib()
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
  this.he = d || oa();
  this.Ua = a;
  this.Md = b;
  this.Se = c;
  delete this.oc;
  delete this.nc
};
pd.prototype.Kc = aa("Ua");
function S(a) {
  this.Ue = a
}
S.prototype.t = k;
S.prototype.Ua = k;
S.prototype.na = k;
S.prototype.Qa = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var rd = new T("OFF", Infinity), sd = new T("SHOUT", 1200), td = new T("SEVERE", 1E3), ud = new T("WARNING", 900), vd = new T("INFO", 800), wd = new T("CONFIG", 700), yd = new T("FINE", 500), zd = new T("FINER", 400), Ad = new T("FINEST", 300), Bd = new T("ALL", 0);
function U(a) {
  return V.ud(a)
}
p = S.prototype;
p.getParent = o("t");
p.Kc = aa("Ua");
function Cd(a) {
  if(a.Ua) {
    return a.Ua
  }
  if(a.t) {
    return Cd(a.t)
  }
  Ba("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= Cd(this).value) {
    a = this.Ke(a, b, c);
    b = "log:" + a.Md;
    r.console && (r.console.timeStamp ? r.console.timeStamp(b) : r.console.markTimeline && r.console.markTimeline(b));
    r.msWriteProfilerMark && r.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Qa) {
        for(var e = 0, g = i;g = c.Qa[e];e++) {
          g(d)
        }
      }
      b = b.getParent()
    }
  }
};
p.Ke = function(a, b, c) {
  var d = new pd(a, "" + b, this.Ue);
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
          n = c.lineNumber || c.Re || "Not available"
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
p.cf = function(a, b) {
  this.log(sd, a, b)
};
p.F = function(a, b) {
  this.log(td, a, b)
};
p.q = function(a, b) {
  this.log(ud, a, b)
};
p.info = function(a, b) {
  this.log(vd, a, b)
};
p.xe = function(a, b) {
  this.log(wd, a, b)
};
p.k = function(a, b) {
  this.log(yd, a, b)
};
p.Ge = function(a, b) {
  this.log(zd, a, b)
};
p.s = function(a, b) {
  this.log(Ad, a, b)
};
var V = {Nb:{}, pb:k, Ad:function() {
  V.pb || (V.pb = new S(""), V.Nb[""] = V.pb, V.pb.Kc(wd))
}, wg:function() {
  return V.Nb
}, qc:function() {
  V.Ad();
  return V.pb
}, ud:function(a) {
  V.Ad();
  return V.Nb[a] || V.ze(a)
}, vg:function(a) {
  return function(b) {
    (a || V.qc()).F("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Re + ")")
  }
}, ze:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.ud(a.substr(0, c));
  c.na || (c.na = {});
  c.na[d] = b;
  b.t = c;
  return V.Nb[a] = b
}};
function Dd(a) {
  this.Vd = y(this.ne, this);
  this.rd = new Sc;
  this.Cd = this.rd.ee = m;
  this.i = a;
  this.Ee = this.i.ownerDocument || this.i.document;
  var a = Wc(this.i), b = k;
  if(E) {
    b = a.Ca.createStyleSheet(), hd(b)
  }else {
    var c = fd(a, "head")[0];
    c || (b = fd(a, "body")[0], c = a.fb("head"), b.parentNode.insertBefore(c, b));
    b = a.fb("style");
    hd(b);
    a.appendChild(c, b)
  }
  this.i.className += " logdiv"
}
Dd.prototype.bf = function(a) {
  if(a != this.Cd) {
    var b = V.qc();
    if(a) {
      var c = this.Vd;
      b.Qa || (b.Qa = []);
      b.Qa.push(c)
    }else {
      (b = b.Qa) && jb(b, this.Vd)
    }
    this.Cd = a
  }
};
Dd.prototype.ne = function(a) {
  var b = 100 >= this.i.scrollHeight - this.i.scrollTop - this.i.clientHeight, c = this.Ee.createElement("div");
  c.className = "logmsg";
  var d = this.rd, e;
  switch(a.Ua.value) {
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
  g.push(d.Ye, " ");
  if(d.ee) {
    var h = new Date(a.he);
    g.push("[", Qc(h.getFullYear() - 2E3) + Qc(h.getMonth() + 1) + Qc(h.getDate()) + " " + Qc(h.getHours()) + ":" + Qc(h.getMinutes()) + ":" + Qc(h.getSeconds()) + "." + Qc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.ef && g.push("[", ya(Rc(a, d.ff.get())), "s] ");
  d.df && g.push("[", C(a.Se), "] ");
  g.push('<span class="', e, '">', sa(ya(C(a.Md))));
  d.fe && a.oc && g.push("<br>", sa(ya(a.nc || "")));
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
  a instanceof Gd ? (this.$a(b == k ? a.Y : b), Hd(this, a.aa), Id(this, a.Ma), Jd(this, a.R), Kd(this, a.ra), Ld(this, a.K), Md(this, a.L.O()), Nd(this, a.Da)) : a && (c = ("" + a).match(Ed)) ? (this.$a(!!b), Hd(this, c[1] || "", j), Id(this, c[2] || "", j), Jd(this, c[3] || "", j), Kd(this, c[4]), Ld(this, c[5] || "", j), Md(this, c[6] || "", j), Nd(this, c[7] || "", j)) : (this.$a(!!b), this.L = new Od(k, this, this.Y))
}
p = Gd.prototype;
p.aa = "";
p.Ma = "";
p.R = "";
p.ra = k;
p.K = "";
p.Da = "";
p.Qe = m;
p.Y = m;
p.toString = function() {
  if(this.U) {
    return this.U
  }
  var a = [];
  this.aa && a.push(Pd(this.aa, Qd), ":");
  this.R && (a.push("//"), this.Ma && a.push(Pd(this.Ma, Qd), "@"), a.push(x(this.R) ? encodeURIComponent(this.R) : k), this.ra != k && a.push(":", "" + this.ra));
  this.K && (this.R && "/" != this.K.charAt(0) && a.push("/"), a.push(Pd(this.K, "/" == this.K.charAt(0) ? Rd : Sd)));
  var b = "" + this.L;
  b && a.push("?", b);
  this.Da && a.push("#", Pd(this.Da, Td));
  return this.U = a.join("")
};
p.O = function() {
  var a = this.aa, b = this.Ma, c = this.R, d = this.ra, e = this.K, g = this.L.O(), h = this.Da, l = new Gd(k, this.Y);
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
  delete a.U;
  a.aa = c ? b ? decodeURIComponent(b) : "" : b;
  a.aa && (a.aa = a.aa.replace(/:$/, ""))
}
function Id(a, b, c) {
  Ud(a);
  delete a.U;
  a.Ma = c ? b ? decodeURIComponent(b) : "" : b
}
function Jd(a, b, c) {
  Ud(a);
  delete a.U;
  a.R = c ? b ? decodeURIComponent(b) : "" : b
}
function Kd(a, b) {
  Ud(a);
  delete a.U;
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.ra = b) : a.ra = k
}
function Ld(a, b, c) {
  Ud(a);
  delete a.U;
  a.K = c ? b ? decodeURIComponent(b) : "" : b
}
function Md(a, b, c) {
  Ud(a);
  delete a.U;
  b instanceof Od ? (a.L = b, a.L.Wc = a, a.L.$a(a.Y)) : (c || (b = Pd(b, Vd)), a.L = new Od(b, a, a.Y))
}
function Nd(a, b, c) {
  Ud(a);
  delete a.U;
  a.Da = c ? b ? decodeURIComponent(b) : "" : b
}
function Ud(a) {
  a.Qe && f(Error("Tried to modify a read-only Uri"))
}
p.$a = function(a) {
  this.Y = a;
  this.L && this.L.$a(a);
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
  this.Wc = b || k;
  this.Y = !!c
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
p.ib = function() {
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
p.W = function() {
  W(this);
  for(var a = this.g.J(), b = this.g.W(), c = [], d = 0;d < b.length;d++) {
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
  for(var a = [], b = 0, c = this.g.W(), d = 0;d < c.length;d++) {
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
  delete a.Oa;
  delete a.ca;
  a.Wc && delete a.Wc.U
}
p.O = function() {
  var a = new Od;
  this.Oa && (a.Oa = this.Oa);
  this.ca && (a.ca = this.ca);
  this.g && (a.g = this.g.O());
  return a
};
function Zd(a, b) {
  var c = "" + b;
  a.Y && (c = c.toLowerCase());
  return c
}
p.$a = function(a) {
  a && !this.Y && (W(this), $d(this), mc(this.g, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.Y = a
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
  this.Na = a;
  this.Ja = b
}
be.prototype.I = function(a) {
  return a instanceof be && this.Na == a.Na && this.Ja.join(",") == a.Ja
};
be.prototype.w = function(a, b) {
  a.push("new SACK(", "" + this.Na, ", ");
  N(this.Ja, a, b);
  a.push(")")
};
function ce() {
  this.D = new P
}
ce.prototype.Ba = -1;
ce.prototype.G = 0;
ce.prototype.append = function(a) {
  var b = ae(a);
  this.D.set(this.Ba + 1, [a, b]);
  this.Ba += 1;
  this.G += b
};
ce.prototype.w = function(a) {
  a.push("<Queue with ", "" + this.D.B(), " item(s), counter=#", "" + this.Ba, ", size=", "" + this.G, ">")
};
function de(a) {
  a = a.D.W();
  nb(a);
  return a
}
function ee() {
  this.za = new P
}
ee.prototype.Ha = -1;
ee.prototype.G = 0;
function fe(a) {
  var b = a.za.W();
  nb(b);
  return new be(a.Ha, b)
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
  this.Me = a;
  this.h = []
}
A(te, J);
var ue = [];
te.prototype.Ic = function() {
  fb(this.h, Cb);
  this.h.length = 0
};
te.prototype.d = function() {
  te.m.d.call(this);
  this.Ic()
};
te.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function ve() {
}
ve.td = function() {
  return ve.Bd ? ve.Bd : ve.Bd = new ve
};
ve.prototype.Ve = 0;
ve.td();
function we(a) {
  this.Ab = a || Wc()
}
A(we, Ib);
p = we.prototype;
p.Pe = ve.td();
p.X = k;
p.Ga = m;
p.i = k;
p.t = k;
p.na = k;
p.zb = k;
p.rf = m;
function xe(a) {
  return a.X || (a.X = ":" + (a.Pe.Ve++).toString(36))
}
p.Ea = o("i");
p.getParent = o("t");
p.Lc = function(a) {
  this.t && this.t != a && f(Error("Method not supported"));
  we.m.Lc.call(this, a)
};
p.sd = o("Ab");
p.fb = function() {
  this.i = this.Ab.createElement("div")
};
function ye(a, b) {
  a.Ga && f(Error("Component already rendered"));
  a.i || a.fb();
  b ? b.insertBefore(a.i, k) : a.Ab.Ca.body.appendChild(a.i);
  (!a.t || a.t.Ga) && a.Bb()
}
p.Bb = function() {
  this.Ga = j;
  ze(this, function(a) {
    !a.Ga && a.Ea() && a.Bb()
  })
};
function Ae(a) {
  ze(a, function(a) {
    a.Ga && Ae(a)
  });
  a.Ib && a.Ib.Ic();
  a.Ga = m
}
p.d = function() {
  we.m.d.call(this);
  this.Ga && Ae(this);
  this.Ib && (this.Ib.b(), delete this.Ib);
  ze(this, function(a) {
    a.b()
  });
  !this.rf && this.i && ed(this.i);
  this.t = this.i = this.zb = this.na = k
};
function ze(a, b) {
  a.na && fb(a.na, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = x(a) ? a : xe(a), d;
    this.zb && c ? (d = this.zb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.zb, c in d && delete d[c], jb(this.na, a), b && (Ae(a), a.i && ed(a.i)), c = a, c == k && f(Error("Unable to set parent component")), c.t = k, we.m.Lc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function Be(a, b) {
  this.Ab = b || Wc();
  this.Ie = a;
  this.mc = new te(this);
  this.Fb = new P
}
A(Be, we);
p = Be.prototype;
p.a = U("goog.ui.media.FlashObject");
p.tf = "window";
p.$c = "#000000";
p.oe = "sameDomain";
function Ce(a, b, c) {
  a.Xc = x(b) ? b : Math.round(b) + "px";
  a.sc = x(c) ? c : Math.round(c) + "px";
  a.Ea() && (b = a.Ea() ? a.Ea().firstChild : k, c = a.Xc, a = a.sc, a == i && f(Error("missing height argument")), b.style.width = gd(c), b.style.height = gd(a))
}
p.Bb = function() {
  Be.m.Bb.call(this);
  var a = this.Ea(), b;
  b = E ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = E ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = pa(c, this.tf), d = this.Fb.W(), e = this.Fb.J(), g = [], h = 0;h < d.length;h++) {
    var l = ra(d[h]), n = ra(e[h]);
    g.push(l + "=" + n)
  }
  b = pa(b, xe(this), xe(this), "goog-ui-media-flash-object", C(this.Ie), C(g.join("&")), this.$c, this.oe, c);
  a.innerHTML = b;
  this.Xc && this.sc && Ce(this, this.Xc, this.sc);
  a = this.mc;
  b = this.Ea();
  c = Za(pb);
  v(c) || (ue[0] = c, c = ue);
  for(d = 0;d < c.length;d++) {
    a.h.push(xb(b, c[d], sb || a, m, a.Me || a))
  }
};
p.fb = function() {
  this.Zd != k && !(0 <= za(se, this.Zd)) && (this.a.q("Required flash version not found:" + this.Zd), f(Error("Method not supported")));
  var a = this.sd().createElement("div");
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
  d.Yc(function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function Ge(a, b) {
  this.X = "_" + dc();
  this.Zb = a;
  this.sa = b;
  this.ya = a.ya
}
A(Ge, J);
p = Ge.prototype;
p.Va = j;
p.ic = m;
p.a = U("cw.net.FlashSocket");
p.w = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.X);
  a.push("'>")
};
function He(a, b, c) {
  "frames" == b ? (a = a.sa, Ie(a.z), Je(a.z, c)) : "stillreceiving" == b ? (c = a.sa, c.a.s("onstillreceiving"), Ie(c.z)) : "connect" == b ? (c = a.sa, c.a.info("onconnect"), Ie(c.z), a = c.eb, c.eb = k, a.length && (c.a.s("onconnect: Writing " + a.length + " buffered frame(s)."), c.Wb.ub(a))) : "close" == b ? (a.Va = m, a.b()) : "ioerror" == b ? (a.Va = m, b = a.sa, b.a.q("onioerror: " + O(c)), Ke(b.z, m), a.b()) : "securityerror" == b ? (a.Va = m, b = a.sa, b.a.q("onsecurityerror: " + O(c)), Ke(b.z, 
  m), a.b()) : f(Error("bad event: " + b))
}
function Le(a) {
  a.ic = j;
  a.Va = m;
  a.b()
}
p.fc = function(a, b) {
  try {
    var c = this.ya.CallFunction(ie("__FC_connect", this.X, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.F("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), Le(this)
  }
  '"OK"' != c && f(Error("__FC_connect failed? ret: " + c))
};
p.ub = function(a) {
  try {
    var b = this.ya.CallFunction(ie("__FC_writeFrames", this.X, a))
  }catch(c) {
    return this.a.F("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), Le(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.q("Flash no longer knows of " + this.X + "; disposing."), this.b()) : f(Error("__FC_writeFrames failed? ret: " + b)))
};
p.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Va);
  Ge.m.d.call(this);
  var a = this.ya;
  delete this.ya;
  if(this.Va) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(ie("__FC_close", this.X)))
    }catch(b) {
      this.a.F("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.ic = j
    }
  }
  if(this.ic) {
    a = this.sa, a.a.q("oncrash"), Ke(a.z, j)
  }else {
    this.sa.onclose()
  }
  delete this.sa;
  delete this.Zb.Ra[this.X]
};
function Me(a, b) {
  this.o = a;
  this.ya = b;
  this.Ra = {};
  this.ec = "__FST_" + dc();
  r[this.ec] = y(this.De, this);
  var c = b.CallFunction(ie("__FC_setCallbackFunc", this.ec));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(Me, J);
p = Me.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.w = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Ra, a, b);
  a.push(">")
};
p.jc = function(a) {
  a = new Ge(this, a);
  return this.Ra[a.X] = a
};
p.Be = function(a, b, c, d) {
  var e = this.Ra[a];
  e ? "frames" == b && d ? (He(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : He(e, b, c) : this.a.q("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
p.De = function(a, b, c, d) {
  try {
    Ub(this.o, this.Be, this, [a, b, c, d])
  }catch(e) {
    r.window.setTimeout(function() {
      f(e)
    }, 0)
  }
};
p.d = function() {
  Me.m.d.call(this);
  for(var a = Za(this.Ra);a.length;) {
    a.pop().b()
  }
  delete this.Ra;
  delete this.ya;
  r[this.ec] = i
};
function Ne(a) {
  this.z = a;
  this.eb = []
}
A(Ne, J);
p = Ne.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.ub = function(a) {
  this.eb ? (this.a.s("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.eb.push.apply(this.eb, a)) : (this.a.s("writeFrames: Writing " + a.length + " frame(s)."), this.Wb.ub(a))
};
p.fc = function(a, b) {
  this.Wb.fc(a, b)
};
p.onclose = function() {
  this.a.info("onclose");
  Ke(this.z, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  Ne.m.d.call(this);
  this.Wb.b();
  delete this.z
};
var Oe = [];
function Re() {
  var a = new M;
  Oe.push(a);
  return a
}
function Se(a) {
  var b = Oe;
  Oe = [];
  fb(b, function(b) {
    b.N(a)
  })
}
function Te(a, b) {
  if(Oe.length) {
    return Re()
  }
  var c = new Be(b + "FlashConnector.swf?cb=" + Ue);
  c.$c = "#777777";
  Ce(c, 300, 30);
  var d = Yc("minerva-elements");
  d || f(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = Yc("minerva-elements-FlashConnectorSwf");
  e || (e = ad("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  xc = Fe(a.A, c, e);
  xc.xa(Se);
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
  this.S(a);
  return a.join("")
}
function We() {
}
We.prototype.I = function(a, b) {
  return!(a instanceof We) ? m : wc(Xe(this), Xe(a), b)
};
We.prototype.w = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Xe(this), a, b);
  a.push(">")
};
function Xe(a) {
  return[a.ja, a.Td, a.zd, a.Yd, a.rb, a.Pc, a.Nd, a.Ld, a.Ac, a.Jd, a.je, a.ge, a.va, a.Lb]
}
We.prototype.H = Y;
We.prototype.S = function(a) {
  var b = {};
  b.tnum = this.ja;
  b.ver = this.Td;
  b.format = this.zd;
  b["new"] = this.Yd;
  b.id = this.rb;
  b.ming = this.Pc;
  b.pad = this.Nd;
  b.maxb = this.Ld;
  t(this.Ac) && (b.maxt = this.Ac);
  b.maxia = this.Jd;
  b.tcpack = this.je;
  b.eeds = this.ge;
  b.sack = this.va instanceof be ? ec((new Ye(this.va)).H()) : this.va;
  b.seenack = this.Lb instanceof be ? ec((new Ye(this.Lb)).H()) : this.Lb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(Xb(b), "H")
};
function Ze(a) {
  Q.call(this, "StringFrame", [a]);
  this.Rc = a
}
A(Ze, Q);
Ze.prototype.H = Y;
Ze.prototype.S = function(a) {
  a.push(this.Rc, " ")
};
function $e(a) {
  Q.call(this, "CommentFrame", [a]);
  this.we = a
}
A($e, Q);
$e.prototype.H = Y;
$e.prototype.S = function(a) {
  a.push(this.we, "^")
};
function af(a) {
  Q.call(this, "SeqNumFrame", [a]);
  this.de = a
}
A(af, Q);
af.prototype.H = Y;
af.prototype.S = function(a) {
  a.push("" + this.de, "N")
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
  this.va = a
}
A(Ye, Q);
Ye.prototype.H = Y;
Ye.prototype.S = function(a) {
  var b = this.va;
  a.push(b.Ja.join(","), "|", "" + b.Na);
  a.push("A")
};
function cf(a) {
  Q.call(this, "StreamStatusFrame", [a]);
  this.Fd = a
}
A(cf, Q);
cf.prototype.H = Y;
cf.prototype.S = function(a) {
  var b = this.Fd;
  a.push(b.Ja.join(","), "|", "" + b.Na);
  a.push("T")
};
function df() {
  Q.call(this, "StreamCreatedFrame", [])
}
A(df, Q);
df.prototype.H = Y;
df.prototype.S = function(a) {
  a.push("C")
};
function ef() {
  Q.call(this, "YouCloseItFrame", [])
}
A(ef, Q);
ef.prototype.H = Y;
ef.prototype.S = function(a) {
  a.push("Y")
};
function ff(a, b) {
  Q.call(this, "ResetFrame", [a, b]);
  this.Wd = a;
  this.Zc = b
}
A(ff, Q);
ff.prototype.H = Y;
ff.prototype.S = function(a) {
  a.push(this.Wd, "|", "" + Number(this.Zc), "!")
};
var gf = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function hf(a) {
  Q.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(hf, Q);
hf.prototype.H = Y;
hf.prototype.S = function(a) {
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
  this.Qc = c;
  this.Je = d
}
kf.prototype.w = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.Je, a, b);
  a.push(", expandedUrl=");
  N(this.Db, a, b);
  a.push(", streams=");
  N(this.Qc, a, b);
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
    if(g = 0 == e.Qc.length) {
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
  (h = !!e.aa) ? Hd(g, e.aa) : h = !!e.Ma;
  h ? Id(g, e.Ma) : h = !!e.R;
  h ? Jd(g, e.R) : h = e.ra != k;
  var n = e.K;
  if(h) {
    Kd(g, e.ra)
  }else {
    if(h = !!e.K) {
      if("/" != n.charAt(0) && (l.R && !l.K ? n = "/" + n : (l = g.K.lastIndexOf("/"), -1 != l && (n = g.K.substr(0, l + 1) + n))), ".." == n || "." == n) {
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
  h ? (l = e.L, l.Oa || (l.Oa = l.toString() ? decodeURIComponent(l.toString()) : ""), Md(g, l.Oa, i)) : h = !!e.Da;
  h && Nd(g, e.Da);
  e = g.toString();
  g = ("" + r.location).match(Ed)[3] || k;
  h = e.match(Ed)[3] || k;
  g == h ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = Rb(new kf(r, e, [b], k))) : ((g = Yc("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new M, c.yc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = ad("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), g.appendChild(c), c = h);
  return c
}
lf.prototype.vf = function(a) {
  var b = this.yc.get(a);
  b || f(Error("Unknown frameId " + O(a)));
  this.yc.remove(b);
  var c = b[0], a = new kf(Yc("minerva-xdrframe-" + a).contentWindow || (Yc("minerva-xdrframe-" + a).contentDocument || Yc("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Yc("minerva-xdrframe-" + a).contentDocument || Yc("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var of = new lf;
r.__XHRTracker_xdrFrameLoaded = y(of.vf, of);
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
  this.Id = a;
  this.kc = [];
  this.qd = !!b;
  this.He = !!c;
  this.ye = !!d;
  for(b = 0;b < a.length;b++) {
    a[b].la(y(this.wd, this, b, j), y(this.wd, this, b, m))
  }
  0 == a.length && !this.qd && this.N(this.kc)
}
A(sf, M);
sf.prototype.Pd = 0;
sf.prototype.wd = function(a, b, c) {
  this.Pd++;
  this.kc[a] = [b, c];
  this.da || (this.qd && b ? this.N([a, c]) : this.He && !b ? this.V(c) : this.Pd == this.Id.length && this.N(this.kc));
  this.ye && !b && (c = k);
  return c
};
sf.prototype.V = function(a) {
  sf.m.V.call(this, a);
  fb(this.Id, function(a) {
    a.cancel()
  })
};
function tf(a) {
  a = new sf(a, m, j);
  a.xa(function(a) {
    return gb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function uf(a, b) {
  this.uf = a;
  this.Kd = b
}
uf.prototype.wc = 0;
uf.prototype.Ob = 0;
uf.prototype.pc = m;
function vf(a) {
  var b = [];
  if(a.pc) {
    return[b, 2]
  }
  var c = a.wc, d = a.uf.responseText;
  for(a.wc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var e = d.substr(a.Ob, c - a.Ob), e = e.replace(/\r$/, "");
    if(e.length > a.Kd) {
      return a.pc = j, [b, 2]
    }
    b.push(e);
    a.Ob = c += 1
  }
  return a.wc - a.Ob - 1 > a.Kd ? (a.pc = j, [b, 2]) : [b, 1]
}
;function wf(a, b, c) {
  this.z = b;
  this.T = a;
  this.hc = c
}
A(wf, J);
p = wf.prototype;
p.a = U("cw.net.XHRMaster");
p.ta = -1;
p.zc = function(a, b, c) {
  this.hc.__XHRSlave_makeRequest(this.T, a, b, c)
};
p.oa = o("ta");
p.Cc = function(a, b) {
  1 != b && this.a.F(O(this.T) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  Ie(this.z);
  Je(this.z, a)
};
p.Dc = function(a) {
  this.a.k("ongotheaders_: " + O(a));
  var b = k;
  "Content-Length" in a && (b = hc(a["Content-Length"]));
  a = this.z;
  a.a.k(a.l() + " got Content-Length: " + b);
  a.ba == xf && (b == k && (a.a.q("Expected to receive a valid Content-Length, but did not."), b = 5E5), yf(a, 2E3 + 1E3 * (b / 3072)))
};
p.Ec = function(a) {
  1 != a && this.a.k(this.z.l() + "'s XHR's readyState is " + a);
  this.ta = a;
  2 <= this.ta && Ie(this.z)
};
p.Bc = function() {
  this.z.b()
};
p.d = function() {
  wf.m.d.call(this);
  delete Z.fa[this.T];
  this.hc.__XHRSlave_dispose(this.T);
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
  b ? (delete this.fa[b.T], b.Bc()) : this.a.F("oncomplete_: no master for " + O(a))
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
  this.Z = a;
  this.host = b;
  this.port = c
}
function Bf(a, b, c) {
  this.host = a;
  this.port = b;
  this.nf = c
}
function Cf(a, b) {
  b || (b = a);
  this.Z = a;
  this.wa = b
}
Cf.prototype.w = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.Z, a, b);
  a.push(", secondaryUrl=");
  N(this.wa, a, b);
  a.push(">")
};
function Df(a, b, c, d) {
  this.Z = a;
  this.Sd = b;
  this.wa = c;
  this.be = d;
  (!(0 == this.Z.indexOf("http://") || 0 == this.Z.indexOf("https://")) || !(0 == this.wa.indexOf("http://") || 0 == this.wa.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Sd.location.href;
  Fd(this.Z, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.be.location.href;
  Fd(this.wa, a) || f(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
Df.prototype.w = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.Z, a, b);
  a.push(", secondaryUrl=");
  N(this.wa, a, b);
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
  this.Xa = a;
  this.qf = b;
  this.kf = c
}
p = Gf.prototype;
p.a = U("cw.net.QANProtocolWrapper");
p.lb = function(a, b) {
  this.a.q(a, b);
  this.kf && Ff(b)
};
p.ha = function(a) {
  this.ab.ce(Gc(a), this.qf)
};
p.Eb = function(a) {
  this.ab.reset("QANHelper said: " + a)
};
p.hf = function(a) {
  this.ab = a;
  this.Hc = new R(y(this.Xa.bodyReceived, this.Xa), y(this.lb, this), y(this.ha, this), y(this.Eb, this));
  this.Xa.streamStarted.call(this.Xa, this.ab, this.Hc)
};
p.gf = function(a, b) {
  this.Hc.pd("Stream reset applicationLevel=" + O(b) + ", reason: " + a);
  this.Xa.streamReset.call(this.Xa, a, b)
};
p.jf = function(a) {
  try {
    var b = Jc(a)
  }catch(c) {
    c instanceof Hc || f(c);
    this.ab.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Hc.xd(b)
};
function Hf(a) {
  this.ab = a
}
Hf.prototype.w = function(a, b) {
  a.push("<UserContext for ");
  N(this.ab, a, b);
  a.push(">")
};
function If(a, b, c, d) {
  Q.call(this, "TransportInfo", [a, b, c, d]);
  this.ja = a
}
A(If, Q);
function $(a, b, c) {
  this.r = a;
  this.o = c ? c : Vb;
  this.sb = new id;
  this.rb = dc() + dc();
  this.$ = new ce;
  this.vc = new ee;
  this.tb = k;
  this.$b = [];
  this.La = new Hf(this);
  this.te = y(this.of, this);
  F && (this.tb = Ab(r, "load", this.af, m, this))
}
A($, J);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Gd = new be(-1, []);
p.Hd = new be(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = k;
p.onstarted = k;
p.Fc = k;
p.Gc = k;
p.onreset = k;
p.ondisconnect = k;
p.Za = k;
p.Nc = m;
p.Jc = m;
p.v = 1;
p.Tc = -1;
p.e = k;
p.p = k;
p.nb = k;
p.Oc = 0;
p.Rd = 0;
p.ae = 0;
p.w = function(a, b) {
  a.push("<ClientStream id=");
  N(this.rb, a, b);
  a.push(", state=", "" + this.v);
  a.push(", primary=");
  N(this.e, a, b);
  a.push(", secondary=");
  N(this.p, a, b);
  a.push(", resetting=");
  N(this.nb, a, b);
  a.push(">")
};
p.Le = o("La");
p.re = function(a) {
  t(a.streamStarted) || f(Error("Protocol is missing required method streamStarted"));
  t(a.streamReset) || f(Error("Protocol is missing required method streamReset"));
  t(a.stringReceived) || f(Error("Protocol is missing required method stringReceived"));
  this.onstarted = y(a.streamStarted, a);
  this.onreset = y(a.streamReset, a);
  this.onstring = y(a.stringReceived, a);
  this.Fc = t(a.transportCreated) ? y(a.transportCreated, a) : k;
  this.Gc = t(a.transportDestroyed) ? y(a.transportDestroyed, a) : k
};
function Jf(a) {
  var b = [-1];
  a.e && b.push(a.e.Wa);
  a.p && b.push(a.p.Wa);
  return Math.max.apply(Math.max, b)
}
function Kf(a) {
  if(!(3 > a.v)) {
    Lf(a);
    var b = 0 != a.$.D.B(), c = fe(a.vc), d = !c.I(a.Hd) && !(a.e && c.I(a.e.Ta) || a.p && c.I(a.p.Ta)), e = Jf(a);
    if((b = b && e < a.$.Ba) || d) {
      var g = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.Aa ? (a.a.s("tryToSend_: writing " + g + " to primary"), d && (d = a.e, c != d.Ta && (!d.ia && !d.u.length && Mf(d), d.u.push(new Ye(c)), d.Ta = c)), b && Nf(a.e, a.$, e + 1), a.e.ea()) : a.p == k ? a.Nc ? (a.a.s("tryToSend_: creating secondary to send " + g), a.p = Of(a, m, j), a.p && (b && Nf(a.p, a.$, e + 1), a.p.ea())) : (a.a.s("tryToSend_: not creating a secondary because stream might not exist on server"), a.Jc = j) : a.a.s("tryToSend_: need to send " + g + ", but can't right now")
    }
  }
}
function Lf(a) {
  a.Za != k && (a.o.A.clearTimeout(a.Za), a.Za = k)
}
p.of = function() {
  this.Za = k;
  Kf(this)
};
function Pf(a) {
  a.Za == k && (a.Za = a.o.A.setTimeout(a.te, 6))
}
p.af = function() {
  this.tb = k;
  if(this.e && this.e.Sa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.bc = j;
    a.b()
  }
  this.p && this.p.Sa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.p, a.bc = j, a.b())
};
p.ce = function(a, b) {
  t(b) || (b = j);
  3 < this.v && f(Error("sendString: Can't send in state " + this.v));
  b && (x(a) || f(Error("sendString: not a string: " + O(a))), /^([ -~]*)$/.test(a) || f(Error("sendString: string has illegal chars: " + O(a))));
  this.$.append(a);
  Pf(this)
};
function Of(a, b, c) {
  var d;
  a.r instanceof Df ? d = xf : a.r instanceof Bf ? d = Qf : f(Error("Don't support endpoint " + O(a.r)));
  a.Tc += 1;
  b = new Rf(a.o, a, a.Tc, d, a.r, b);
  a.a.s("Created: " + b.l());
  if(c) {
    if(a.Fc) {
      c = new If(b.ja, b.ma, b.ua, b.Aa);
      try {
        a.Fc.call(a.La, c)
      }catch(e) {
        a.a.q("ontransportcreated raised uncaught exception", e), Ff(e)
      }
    }
    if(4 == a.v || a.Q) {
      return k
    }
  }
  a.sb.add(b);
  return b
}
function Sf(a, b, c) {
  var d = new Tf(a.o, a, b, c);
  a.a.s("Created: " + d.l() + ", delay=" + b + ", times=" + c);
  a.sb.add(d);
  return d
}
function Uf(a, b) {
  a.sb.remove(b) || f(Error("transportOffline_: Transport was not removed?"));
  a.a.k("Offline: " + b.l());
  var c = 4 == a.v && b.ke;
  if(b instanceof Rf && !c) {
    if(a.Gc) {
      var d = new If(b.ja, b.ma, b.ua, b.Aa);
      try {
        a.Gc.call(a.La, d)
      }catch(e) {
        a.a.q("ontransportdestroyed raised uncaught exception", e), Ff(e)
      }
    }
    if(4 == a.v || a.Q) {
      return
    }
  }
  a.Oc = b.qa ? a.Oc + b.qa : 0;
  1 <= a.Oc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), Vf(a, "stream penalty reached limit", m), a.b());
  if(3 < a.v) {
    c ? (a.a.k("Disposing because resettingTransport_ is done."), a.b()) : a.a.k("Not creating a transport because ClientStream is in state " + a.v)
  }else {
    c = b instanceof Tf;
    if(!c && b.bc) {
      var g = F ? rf ? [0, 1] : [9, 20] : [0, 0], c = g[0], d = g[1];
      a.a.s("getDelayForNextTransport_: " + O({delay:c, times:d}))
    }else {
      if(d = b.ed(), b == a.e ? d ? g = ++a.Rd : c || (g = a.Rd = 0) : d ? g = ++a.ae : c || (g = a.ae = 0), c || !g) {
        d = c = 0, a.a.s("getDelayForNextTransport_: " + O({count:g, delay:c, times:d}))
      }else {
        var h = 2E3 * Math.min(g, 3), l = Math.floor(4E3 * Math.random()) - 2E3, n = Math.max(0, b.ie - b.Uc), d = (c = Math.max(0, h + l - n)) ? 1 : 0;
        a.a.s("getDelayForNextTransport_: " + O({count:g, base:h, variance:l, oldDuration:n, delay:c, times:d}))
      }
    }
    c = [c, d];
    g = c[0];
    c = c[1];
    if(b == a.e) {
      a.e = k;
      if(c) {
        a.e = Sf(a, g, c)
      }else {
        g = Jf(a);
        a.e = Of(a, j, j);
        if(!a.e) {
          return
        }
        Nf(a.e, a.$, g + 1)
      }
      a.e.ea()
    }else {
      b == a.p && (a.p = k, c ? (a.p = Sf(a, g, c), a.p.ea()) : Kf(a))
    }
  }
}
function Vf(a, b, c) {
  if(a.onreset) {
    try {
      a.onreset.call(a.La, b, c)
    }catch(d) {
      a.a.q("onreset raised uncaught exception", d), Ff(d)
    }
  }
}
p.reset = function(a) {
  3 < this.v && f(Error("reset: Can't send reset in state " + this.v));
  Lf(this);
  0 != this.$.D.B() && this.a.q("reset: strings in send queue will never be sent: " + O(this.$));
  this.v = 4;
  this.e && this.e.Aa ? (this.a.info("reset: Sending ResetFrame over existing primary."), Wf(this.e, a), this.e.ea()) : (this.e && (this.a.k("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.p && (this.a.k("reset: Disposing secondary before sending ResetFrame."), this.p.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.nb = Of(this, m, m), Wf(this.nb, a), this.nb.ea());
  Vf(this, a, j)
};
function Xf(a, b, c, d) {
  var e;
  e = a.vc;
  for(var g = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], n = m, u = 0, H = c.length;u < H;u++) {
    var q = c[u], w = q[0], q = q[1];
    if(w == e.Ha + 1) {
      e.Ha += 1;
      for(l.push(q);;) {
        w = e.Ha + 1;
        q = e.za.get(w, ge);
        if(q === ge) {
          break
        }
        l.push(q[0]);
        e.za.remove(w);
        e.G -= q[1];
        e.Ha = w
      }
    }else {
      if(!(w <= e.Ha)) {
        if(g != k && e.za.B() >= g) {
          n = j;
          break
        }
        var D = ae(q);
        if(h != k && e.G + D > h) {
          n = j;
          break
        }
        e.za.set(w, [q, D]);
        e.G += D
      }
    }
  }
  e.za.ib() && e.za.clear();
  e = [l, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(g = 0;g < c.length;g++) {
      h = c[g];
      if(a.onstring) {
        try {
          a.onstring.call(a.La, h)
        }catch(rc) {
          a.a.q("onstring raised uncaught exception", rc), Ff(rc)
        }
      }
      if(4 == a.v || a.Q) {
        return
      }
    }
  }
  d || Pf(a);
  if(!(4 == a.v || a.Q) && e) {
    b.a.F(b.l() + "'s peer caused rwin overflow."), b.b()
  }
}
p.md = function(a) {
  this.a.F("Failed to start " + O(this) + "; error was " + O(a.message));
  this.b()
};
p.start = function() {
  this.onmessage && f(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  1 != this.v && f(Error("ClientStream.start: " + O(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.v = 2;
  if(this.r instanceof Cf) {
    var a = nf(this.r.Z, this), b = nf(this.r.wa, this), a = tf([a, b]);
    a.xa(y(this.Fe, this));
    a.vb(y(this.md, this))
  }else {
    if(this.r instanceof Af) {
      if(yc) {
        this.od()
      }else {
        var a = Te(this.o, this.r.Z), c = this;
        a.xa(function(a) {
          yc || (yc = new Me(c.o, a));
          return k
        });
        a.xa(y(this.od, this));
        a.vb(y(this.md, this))
      }
    }else {
      Yf(this)
    }
  }
};
p.Fe = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Db, e = a[1].Db;
  this.$b.push(a[0]);
  this.$b.push(a[1]);
  this.r = new Df(d, b, e, c);
  Yf(this)
};
p.od = function() {
  this.r = new Bf(this.r.host, this.r.port, yc);
  Yf(this)
};
function Yf(a) {
  a.v = 3;
  a.e = Of(a, j, j);
  a.e && (Nf(a.e, a.$, k), a.e.ea())
}
p.d = function() {
  this.a.info(O(this) + " in disposeInternal.");
  Lf(this);
  this.v = 5;
  for(var a = this.sb.J(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.$b.length;a++) {
    jb(this.$b[a].Qc, this)
  }
  F && this.tb && (Cb(this.tb), this.tb = k);
  this.ondisconnect && this.ondisconnect.call(this.La);
  delete this.sb;
  delete this.e;
  delete this.p;
  delete this.nb;
  delete this.La;
  $.m.d.call(this)
};
var xf = 1, Qf = 3;
function Rf(a, b, c, d, e, g) {
  this.o = a;
  this.C = b;
  this.ja = c;
  this.ba = d;
  this.r = e;
  this.u = [];
  this.ma = g;
  this.Aa = !this.Sa();
  this.ua = this.ba != xf;
  this.se = y(this.lf, this)
}
A(Rf, J);
p = Rf.prototype;
p.a = U("cw.net.ClientTransport");
p.j = k;
p.Uc = k;
p.ie = k;
p.Tb = k;
p.ia = m;
p.Xb = m;
p.Ta = k;
p.Gb = 0;
p.Wa = -1;
p.Qb = -1;
p.ke = m;
p.bc = m;
p.qa = 0;
p.hb = m;
p.w = function(a) {
  a.push("<ClientTransport #", "" + this.ja, ", becomePrimary=", "" + this.ma, ">")
};
p.l = function() {
  return(this.ma ? "Prim. T#" : "Sec. T#") + this.ja
};
p.ed = function() {
  return!(!this.hb && this.Gb)
};
p.Sa = function() {
  return this.ba == xf || 2 == this.ba
};
function Zf(a, b) {
  nb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Xf(a.C, a, b, !a.ua)
}
function $f(a, b, c) {
  try {
    var d = jf(b);
    a.Gb += 1;
    a.a.k(a.l() + " RECV " + O(d));
    var e;
    1 == a.Gb && !d.I(Ef) && a.Sa() ? (a.a.q(a.l() + " is closing soon because got bad preamble: " + O(d)), e = j) : e = m;
    if(e) {
      return j
    }
    if(d instanceof Ze) {
      if(!/^([ -~]*)$/.test(d.Rc)) {
        return a.hb = j
      }
      a.Qb += 1;
      c.push([a.Qb, d.Rc])
    }else {
      if(d instanceof Ye) {
        var g = a.C, h = d.va;
        g.Gd = h;
        var l = g.$, n = h.Na, c = m;
        n > l.Ba && (c = j);
        for(var u = de(l).concat(), d = 0;d < u.length;d++) {
          var H = u[d];
          if(H > n) {
            break
          }
          var q = l.D.get(H)[1];
          l.D.remove(H);
          l.G -= q
        }
        for(d = 0;d < h.Ja.length;d++) {
          var w = h.Ja[d];
          w > l.Ba && (c = j);
          l.D.P(w) && (q = l.D.get(w)[1], l.D.remove(w), l.G -= q)
        }
        l.D.ib() && l.D.clear();
        if(c) {
          return a.a.q(a.l() + " is closing soon because got bad SackFrame"), a.hb = j
        }
      }else {
        if(d instanceof af) {
          a.Qb = d.de - 1
        }else {
          if(d instanceof cf) {
            a.C.Hd = d.Fd
          }else {
            if(d instanceof ef) {
              return a.a.s(a.l() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof hf) {
              return a.hb = j, "stream_attach_failure" == d.reason ? a.qa += 1 : "acked_unsent_strings" == d.reason && (a.qa += 0.5), a.a.s(a.l() + " is closing soon because got " + O(d)), j
            }
            if(!(d instanceof $e)) {
              if(d instanceof df) {
                var D = a.C, rc = !a.ua;
                D.a.s("Stream is now confirmed to exist at server.");
                D.Nc = j;
                D.Jc && !rc && (D.Jc = m, Kf(D))
              }else {
                if(c.length) {
                  Zf(a, c);
                  if(!v(c)) {
                    for(var xd = c.length - 1;0 <= xd;xd--) {
                      delete c[xd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof ff) {
                  var Pe = a.C;
                  Vf(Pe, d.Wd, d.Zc);
                  Pe.b();
                  return j
                }
                f(Error(a.l() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Qe) {
    return Qe instanceof X || f(Qe), a.a.q(a.l() + " is closing soon because got InvalidFrame: " + O(b)), a.hb = j
  }
  return m
}
function Je(a, b) {
  a.Xb = j;
  try {
    for(var c = m, d = [], e = 0, g = b.length;e < g;e++) {
      if(a.Q) {
        a.a.info(a.l() + " returning from loop because we're disposed.");
        return
      }
      if(c = $f(a, b[e], d)) {
        break
      }
    }
    d.length && Zf(a, d);
    a.Xb = m;
    a.u.length && a.ea();
    c && (a.a.s(a.l() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Xb = m
  }
}
p.lf = function() {
  this.a.q(this.l() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function ag(a) {
  a.Tb != k && (a.o.A.clearTimeout(a.Tb), a.Tb = k)
}
function yf(a, b) {
  ag(a);
  b = Math.round(b);
  a.Tb = a.o.A.setTimeout(a.se, b);
  a.a.k(a.l() + "'s receive timeout set to " + b + " ms.")
}
function Ie(a) {
  a.ba != xf && (a.ba == Qf || 2 == a.ba ? yf(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.ba)))
}
function Mf(a) {
  var b = new We;
  b.ja = a.ja;
  b.Td = 2;
  b.zd = 2;
  a.C.Nc || (b.Yd = j);
  b.rb = a.C.rb;
  b.Pc = a.ua;
  b.Pc && (b.Nd = 4096);
  b.Ld = 3E5;
  b.Jd = a.ua ? Math.floor(10) : 0;
  b.je = m;
  a.ma && (b.ge = k, b.Ac = Math.floor((a.ua ? 358E4 : 25E3) / 1E3));
  b.va = fe(a.C.vc);
  b.Lb = a.C.Gd;
  a.u.push(b);
  a.Ta = b.va
}
function Ke(a, b) {
  b && (a.qa += 0.5);
  a.b()
}
p.ea = function() {
  this.ia && !this.Aa && f(Error("flush_: Can't flush more than once to this transport."));
  if(this.Xb) {
    this.a.s(this.l() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ia;
    this.ia = j;
    !a && !this.u.length && Mf(this);
    for(a = 0;a < this.u.length;a++) {
      this.a.k(this.l() + " SEND " + O(this.u[a]))
    }
    if(this.Sa()) {
      for(var a = [], b = 0, c = this.u.length;b < c;b++) {
        this.u[b].S(a), a.push("\n")
      }
      this.u = [];
      a = a.join("");
      b = this.ma ? this.r.Z : this.r.wa;
      this.j = Z.jc(this, this.ma ? this.r.Sd : this.r.be);
      this.Uc = this.o.A === Jb ? oa() : this.o.A.getTime();
      this.j.zc(b, "POST", a);
      yf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.ua ? 0 : this.ma ? 25E3 : 0))
    }else {
      if(this.ba == Qf) {
        a = [];
        b = 0;
        for(c = this.u.length;b < c;b++) {
          a.push(this.u[b].H())
        }
        this.u = [];
        this.j ? this.j.ub(a) : (b = this.r, this.j = new Ne(this), this.j.Wb = b.nf.jc(this.j), this.Uc = this.o.A === Jb ? oa() : this.o.A.getTime(), this.j.fc(b.host, b.port), this.j.Q || (this.j.ub(a), this.j.Q || yf(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.ba))
      }
    }
  }
};
function Nf(a, b, c) {
  !a.ia && !a.u.length && Mf(a);
  for(var d = Math.max(c, a.Wa + 1), e = de(b), c = [], g = 0;g < e.length;g++) {
    var h = e[g];
    (d == k || h >= d) && c.push([h, b.D.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    g = c[b], e = g[0], g = g[1], (-1 == a.Wa || a.Wa + 1 != e) && a.u.push(new af(e)), a.u.push(new Ze(g)), a.Wa = e
  }
}
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Rf.m.d.call(this);
  this.ie = this.o.A === Jb ? oa() : this.o.A.getTime();
  this.u = [];
  ag(this);
  this.j && this.j.b();
  var a = this.C;
  this.C = k;
  Uf(a, this)
};
function Wf(a, b) {
  !a.ia && !a.u.length && Mf(a);
  a.u.push(new ff(b, j));
  a.ke = j
}
function Tf(a, b, c, d) {
  this.o = a;
  this.C = b;
  this.ld = c;
  this.gd = d
}
A(Tf, J);
p = Tf.prototype;
p.ia = m;
p.Aa = m;
p.Hb = k;
p.Ta = k;
p.a = U("cw.net.DoNothingTransport");
function bg(a) {
  a.Hb = a.o.A.setTimeout(function() {
    a.Hb = k;
    a.gd--;
    a.gd ? bg(a) : a.b()
  }, a.ld)
}
p.ea = function() {
  this.ia && !this.Aa && f(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ia = j;
  bg(this)
};
p.w = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.ld, ">")
};
p.Sa = ba(m);
p.l = ba("Wast. T");
p.ed = ba(m);
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Tf.m.d.call(this);
  this.Hb != k && this.o.A.clearTimeout(this.Hb);
  var a = this.C;
  this.C = k;
  Uf(a, this)
};
function cg() {
}
cg.prototype.xb = k;
var dg;
function eg() {
}
A(eg, cg);
function fg(a) {
  return(a = gg(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function hg(a) {
  var b = {};
  gg(a) && (b[0] = j, b[1] = j);
  return b
}
eg.prototype.tc = k;
function gg(a) {
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
dg = new eg;
function ig(a) {
  this.headers = new P;
  this.cb = a || k
}
A(ig, Ib);
ig.prototype.a = U("goog.net.XhrIo");
var jg = /^https?$/i;
p = ig.prototype;
p.ka = m;
p.f = k;
p.ac = k;
p.xc = "";
p.Ed = "";
p.jb = "";
p.lc = m;
p.Jb = m;
p.uc = m;
p.Fa = m;
p.Yb = 0;
p.Ka = k;
p.$d = "";
p.sf = m;
p.send = function(a, b, c, d) {
  this.f && f(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.xc = a;
  this.jb = "";
  this.Ed = b;
  this.lc = m;
  this.ka = j;
  this.f = this.cb ? fg(this.cb) : fg(dg);
  this.ac = this.cb ? this.cb.xb || (this.cb.xb = hg(this.cb)) : dg.xb || (dg.xb = hg(dg));
  this.f.onreadystatechange = y(this.Qd, this);
  try {
    this.a.k(kg(this, "Opening Xhr")), this.uc = j, this.f.open(b, a, j), this.uc = m
  }catch(e) {
    this.a.k(kg(this, "Error opening Xhr: " + e.message));
    lg(this, e);
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
  this.$d && (this.f.responseType = this.$d);
  "withCredentials" in this.f && (this.f.withCredentials = this.sf);
  try {
    this.Ka && (Jb.clearTimeout(this.Ka), this.Ka = k), 0 < this.Yb && (this.a.k(kg(this, "Will abort after " + this.Yb + "ms if incomplete")), this.Ka = Jb.setTimeout(y(this.mf, this), this.Yb)), this.a.k(kg(this, "Sending request")), this.Jb = j, this.f.send(a), this.Jb = m
  }catch(h) {
    this.a.k(kg(this, "Send error: " + h.message)), lg(this, h)
  }
};
p.mf = function() {
  "undefined" != typeof ca && this.f && (this.jb = "Timed out after " + this.Yb + "ms, aborting", this.a.k(kg(this, this.jb)), this.dispatchEvent("timeout"), this.abort(8))
};
function lg(a, b) {
  a.ka = m;
  a.f && (a.Fa = j, a.f.abort(), a.Fa = m);
  a.jb = b;
  mg(a);
  ng(a)
}
function mg(a) {
  a.lc || (a.lc = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function() {
  this.f && this.ka && (this.a.k(kg(this, "Aborting")), this.ka = m, this.Fa = j, this.f.abort(), this.Fa = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), ng(this))
};
p.d = function() {
  this.f && (this.ka && (this.ka = m, this.Fa = j, this.f.abort(), this.Fa = m), ng(this, j));
  ig.m.d.call(this)
};
p.Qd = function() {
  !this.uc && !this.Jb && !this.Fa ? this.Xe() : og(this)
};
p.Xe = function() {
  og(this)
};
function og(a) {
  if(a.ka && "undefined" != typeof ca) {
    if(a.ac[1] && 4 == a.oa() && 2 == pg(a)) {
      a.a.k(kg(a, "Local request error detected and ignored"))
    }else {
      if(a.Jb && 4 == a.oa()) {
        Jb.setTimeout(y(a.Qd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.oa()) {
          a.a.k(kg(a, "Request complete"));
          a.ka = m;
          try {
            var b = pg(a), c, d;
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
                e = !jg.test(g ? g.toLowerCase() : "")
              }
              c = e
            }
            if(c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success")
            }else {
              var l;
              try {
                l = 2 < a.oa() ? a.f.statusText : ""
              }catch(n) {
                a.a.k("Can not get status: " + n.message), l = ""
              }
              a.jb = l + " [" + pg(a) + "]";
              mg(a)
            }
          }finally {
            ng(a)
          }
        }
      }
    }
  }
}
function ng(a, b) {
  if(a.f) {
    var c = a.f, d = a.ac[0] ? ea : k;
    a.f = k;
    a.ac = k;
    a.Ka && (Jb.clearTimeout(a.Ka), a.Ka = k);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(e) {
      a.a.F("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
}
p.oa = function() {
  return this.f ? this.f.readyState : 0
};
function pg(a) {
  try {
    return 2 < a.oa() ? a.f.status : -1
  }catch(b) {
    return a.a.q("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.oa() ? this.f.getResponseHeader(a) : i
};
function kg(a, b) {
  return b + " [" + a.Ed + " " + a.xc + " " + pg(a) + "]"
}
;var qg = !(E || F && !G("420+"));
function rg(a, b) {
  this.Zb = a;
  this.T = b
}
A(rg, J);
p = rg.prototype;
p.j = k;
p.ta = -1;
p.vd = m;
p.yd = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function sg(a) {
  var b = vf(a.jd), c = b[0], b = b[1], d = r.parent;
  d ? (d.__XHRMaster_onframes(a.T, c, b), 1 != b && a.b()) : a.b()
}
p.Oe = function() {
  sg(this);
  if(!this.Q) {
    var a = r.parent;
    a && a.__XHRMaster_oncomplete(this.T);
    this.b()
  }
};
p.Ze = function() {
  var a = r.parent;
  if(a) {
    this.ta = this.j.oa();
    if(2 <= this.ta && !this.vd) {
      for(var b = new P, c = this.yd.length;c--;) {
        var d = this.yd[c];
        try {
          b.set(d, this.j.f.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.B() && (this.vd = j, a.__XHRMaster_ongotheaders(this.T, sc(b)), this.Q)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.T, this.ta);
    qg && 3 == this.ta && sg(this)
  }else {
    this.b()
  }
};
p.zc = function(a, b, c) {
  this.j = new ig;
  xb(this.j, "readystatechange", y(this.Ze, this));
  xb(this.j, "complete", y(this.Oe, this));
  this.j.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.jd = new uf(this.j.f, 1048576)
};
p.d = function() {
  rg.m.d.call(this);
  delete this.jd;
  this.j && this.j.b();
  delete this.Zb.qb[this.T];
  delete this.Zb
};
function tg() {
  this.qb = {}
}
A(tg, J);
tg.prototype.Te = function(a, b, c, d) {
  var e = new rg(this, a);
  this.qb[a] = e;
  e.zc(b, c, d)
};
tg.prototype.Ce = function(a) {
  (a = this.qb[a]) && a.b()
};
tg.prototype.d = function() {
  tg.m.d.call(this);
  for(var a = Za(this.qb);a.length;) {
    a.pop().b()
  }
  delete this.qb
};
var ug = new tg;
r.__XHRSlave_makeRequest = y(ug.Te, ug);
r.__XHRSlave_dispose = y(ug.Ce, ug);
var vg = U("cw.net.demo");
function wg(a, b, c, d) {
  a = new Gd(document.location);
  if(c) {
    return new Af(d, a.R, r.__demo_mainSocketPort)
  }
  b ? (b = r.__demo_shared_domain, x(b) || f(Error("domain was " + O(b) + "; expected a string.")), c = a.O(), Jd(c, "_____random_____." + b)) : c = a.O();
  Ld(c, d);
  Md(c, "", i);
  return new Cf(c.toString().replace("_____random_____", "%random%"))
}
;z("Minerva.HttpEndpoint", Cf);
z("Minerva.SocketEndpoint", Af);
z("Minerva.QANHelper", R);
R.prototype.handleQANFrame = R.prototype.xd;
R.prototype.ask = R.prototype.pe;
R.prototype.notify = R.prototype.We;
R.prototype.failAll = R.prototype.pd;
z("Minerva.QANProtocolWrapper", Gf);
Gf.prototype.streamStarted = Gf.prototype.hf;
Gf.prototype.streamReset = Gf.prototype.gf;
Gf.prototype.stringReceived = Gf.prototype.jf;
z("Minerva.Deferred", M);
M.prototype.cancel = M.prototype.cancel;
M.prototype.callback = M.prototype.N;
M.prototype.errback = M.prototype.V;
M.prototype.addErrback = M.prototype.vb;
M.prototype.addCallback = M.prototype.xa;
M.prototype.addCallbacks = M.prototype.la;
M.prototype.chainDeferred = M.prototype.dd;
M.prototype.awaitDeferred = M.prototype.qe;
M.prototype.branch = M.prototype.bd;
M.prototype.addBoth = M.prototype.Yc;
M.prototype.hasFired = M.prototype.Ne;
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
$.prototype.getUserContext = $.prototype.Le;
$.prototype.bindToProtocol = $.prototype.re;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.ce;
$.prototype.reset = $.prototype.reset;
z("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.Kc;
S.prototype.shout = S.prototype.cf;
S.prototype.severe = S.prototype.F;
S.prototype.warning = S.prototype.q;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.xe;
S.prototype.fine = S.prototype.k;
S.prototype.finer = S.prototype.Ge;
S.prototype.finest = S.prototype.s;
T.OFF = rd;
T.SHOUT = sd;
T.SEVERE = td;
T.WARNING = ud;
T.INFO = vd;
T.CONFIG = wd;
T.FINE = yd;
T.FINER = zd;
T.FINEST = Ad;
T.ALL = Bd;
z("Minerva.LogManager", V);
V.getRoot = V.qc;
z("Minerva.DivConsole", Dd);
Dd.prototype.setCapturing = Dd.prototype.bf;
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
z("Minerva.getEndpoint", wg);
z("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new Gd(document.location)).L;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !r.__demo_shared_domain) {
    vg.q("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return wg(0, a, b, "/_minerva/")
});
})();
