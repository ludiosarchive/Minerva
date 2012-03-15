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
  return a !== i
}
function v(a) {
  return"array" == t(a)
}
function fa(a) {
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
    !c.length && u(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
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
  for(var c = 0, d = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = ("" + b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), g = Math.max(d.length, e.length), h = 0;0 == c && h < g;h++) {
    var l = d[h] || "", n = e[h] || "", s = RegExp("(\\d*)(\\D*)", "g"), H = RegExp("(\\d*)(\\D*)", "g");
    do {
      var q = s.exec(l) || ["", "", ""], w = H.exec(n) || ["", "", ""];
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
p.Ta = m;
p.bc = m;
p.Gb = function(a, b, c, d, e, g) {
  ia(a) ? this.xd = j : a && a.handleEvent && ia(a.handleEvent) ? this.xd = m : f(Error("Invalid listener argument"));
  this.ib = a;
  this.Od = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.qc = g;
  this.bc = m;
  this.key = ++Xa;
  this.Ta = m
};
p.handleEvent = function(a) {
  return this.xd ? this.ib.call(this.qc || this.src, a) : this.ib.handleEvent.call(this.ib, a)
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
var cb = !E || Va();
E && G("8");
!F || G("528");
La && G("1.9b") || E && G("8") || Ka && G("9.5") || F && G("528");
La && !G("8") || E && G("9");
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
  for(var d = a.length, e = x(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in e && b.call(c, e[g], g, a)
  }
}, fb = I.map ? function(a, b, c) {
  return I.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), g = x(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in g && (e[h] = b.call(c, g[h], h, a))
  }
  return e
}, gb = I.some ? function(a, b, c) {
  return I.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, g = 0;g < d;g++) {
    if(g in e && b.call(c, e[g], g, a)) {
      return j
    }
  }
  return m
}, hb = I.every ? function(a, b, c) {
  return I.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = x(a) ? a.split("") : a, g = 0;g < d;g++) {
    if(g in e && !b.call(c, e[g], g, a)) {
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
function lb(a, b, c) {
  return 2 >= arguments.length ? I.slice.call(a, b) : I.slice.call(a, b, c)
}
function mb(a, b) {
  I.sort.call(a, b || nb)
}
function nb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var ob = {tf:"click", yf:"dblclick", Sf:"mousedown", Wf:"mouseup", Vf:"mouseover", Uf:"mouseout", Tf:"mousemove", fg:"selectstart", Nf:"keypress", Mf:"keydown", Of:"keyup", rf:"blur", Gf:"focus", zf:"deactivate", Hf:E ? "focusin" : "DOMFocusIn", If:E ? "focusout" : "DOMFocusOut", sf:"change", eg:"select", gg:"submit", Lf:"input", ag:"propertychange", Df:"dragstart", Af:"dragenter", Cf:"dragover", Bf:"dragleave", Ef:"drop", kg:"touchstart", jg:"touchmove", ig:"touchend", hg:"touchcancel", vf:"contextmenu", 
Ff:"error", Kf:"help", Pf:"load", Qf:"losecapture", bg:"readystatechange", cg:"resize", dg:"scroll", mg:"unload", Jf:"hashchange", Xf:"pagehide", Yf:"pageshow", $f:"popstate", wf:"copy", Zf:"paste", xf:"cut", of:"beforecopy", pf:"beforecut", qf:"beforepaste", Rf:"message", uf:"connect", lg:F ? "webkitTransitionEnd" : Ka ? "oTransitionEnd" : "transitionend"};
function J() {
}
J.prototype.ba = m;
J.prototype.b = function() {
  this.ba || (this.ba = j, this.d())
};
J.prototype.d = function() {
  this.ue && pb.apply(k, this.ue)
};
function pb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    fa(d) ? pb.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function K(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
A(K, J);
K.prototype.d = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
K.prototype.Ea = m;
K.prototype.Sb = j;
K.prototype.stopPropagation = function() {
  this.Ea = j
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
  a && this.Gb(a, b)
}
A(sb, K);
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
p.ctrlKey = m;
p.altKey = m;
p.shiftKey = m;
p.metaKey = m;
p.cb = k;
p.Gb = function(a, b) {
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
          rb(d.nodeName);
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
  this.cb = a;
  delete this.Sb;
  delete this.Ea
};
p.stopPropagation = function() {
  sb.n.stopPropagation.call(this);
  this.cb.stopPropagation ? this.cb.stopPropagation() : this.cb.cancelBubble = j
};
p.d = function() {
  sb.n.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.cb = k
};
var tb = {}, L = {}, ub = {}, vb = {};
function wb(a, b, c, d, e) {
  if(b) {
    if(v(b)) {
      for(var g = 0;g < b.length;g++) {
        wb(a, b[g], c, d, e)
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
      for(g = 0;g < n.length;g++) {
        if(h = n[g], h.ib == c && h.qc == e) {
          if(h.Ta) {
            break
          }
          return n[g].key
        }
      }
    }else {
      n = h[l] = [], h.c++
    }
    g = xb();
    g.src = a;
    h = new Wa;
    h.Gb(c, g, a, b, d, e);
    c = h.key;
    g.key = c;
    n.push(h);
    tb[c] = h;
    ub[l] || (ub[l] = []);
    ub[l].push(h);
    a.addEventListener ? (a == r || !a.dd) && a.addEventListener(b, g, d) : a.attachEvent(b in vb ? vb[b] : vb[b] = "on" + b, g);
    return c
  }
  f(Error("Invalid event type"))
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
    for(var g = 0;g < b.length;g++) {
      zb(a, b[g], c, d, e)
    }
    return k
  }
  a = wb(a, b, c, d, e);
  tb[a].bc = j;
  return a
}
function Ab(a, b, c, d, e) {
  if(v(b)) {
    for(var g = 0;g < b.length;g++) {
      Ab(a, b[g], c, d, e)
    }
  }else {
    d = !!d;
    a: {
      g = L;
      if(b in g && (g = g[b], d in g && (g = g[d], a = ja(a), g[a]))) {
        a = g[a];
        break a
      }
      a = k
    }
    if(a) {
      for(g = 0;g < a.length;g++) {
        if(a[g].ib == c && a[g].capture == d && a[g].qc == e) {
          Bb(a[g].key);
          break
        }
      }
    }
  }
}
function Bb(a) {
  if(!tb[a]) {
    return m
  }
  var b = tb[a];
  if(b.Ta) {
    return m
  }
  var c = b.src, d = b.type, e = b.Od, g = b.capture;
  c.removeEventListener ? (c == r || !c.dd) && c.removeEventListener(d, e, g) : c.detachEvent && c.detachEvent(d in vb ? vb[d] : vb[d] = "on" + d, e);
  c = ja(c);
  e = L[d][g][c];
  if(ub[c]) {
    var h = ub[c];
    ib(h, b);
    0 == h.length && delete ub[c]
  }
  b.Ta = j;
  e.Id = j;
  Cb(d, g, c, e);
  delete tb[a];
  return j
}
function Cb(a, b, c, d) {
  if(!d.Ib && d.Id) {
    for(var e = 0, g = 0;e < d.length;e++) {
      d[e].Ta ? d[e].Od.src = k : (e != g && (d[g] = d[e]), g++)
    }
    d.length = g;
    d.Id = m;
    0 == g && (delete L[a][b][c], L[a][b].c--, 0 == L[a][b].c && (delete L[a][b], L[a].c--), 0 == L[a].c && delete L[a])
  }
}
function Db(a) {
  var b, c = 0, d = b == k;
  b = !!b;
  if(a == k) {
    Ya(ub, function(a) {
      for(var e = a.length - 1;0 <= e;e--) {
        var g = a[e];
        if(d || b == g.capture) {
          Bb(g.key), c++
        }
      }
    })
  }else {
    if(a = ja(a), ub[a]) {
      for(var a = ub[a], e = a.length - 1;0 <= e;e--) {
        var g = a[e];
        if(d || b == g.capture) {
          Bb(g.key), c++
        }
      }
    }
  }
}
function Eb(a, b, c, d, e) {
  var g = 1, b = ja(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.Ib ? a.Ib++ : a.Ib = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Ta && (g &= Fb(n, e) !== m)
      }
    }finally {
      a.Ib--, Cb(c, d, b, a)
    }
  }
  return Boolean(g)
}
function Fb(a, b) {
  var c = a.handleEvent(b);
  a.bc && Bb(a.key);
  return c
}
function yb(a, b) {
  if(!tb[a]) {
    return j
  }
  var c = tb[a], d = c.type, e = L;
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
        var s = m;
        if(0 == g.keyCode) {
          try {
            g.keyCode = -1;
            break a
          }catch(H) {
            s = j
          }
        }
        if(s || g.returnValue == i) {
          g.returnValue = j
        }
      }
    }
    s = new sb;
    s.Gb(g, this);
    g = j;
    try {
      if(l) {
        for(var q = [], w = s.currentTarget;w;w = w.parentNode) {
          q.push(w)
        }
        h = e[j];
        h.M = h.c;
        for(var C = q.length - 1;!s.Ea && 0 <= C && h.M;C--) {
          s.currentTarget = q[C], g &= Eb(h, q[C], d, j, s)
        }
        if(n) {
          h = e[m];
          h.M = h.c;
          for(C = 0;!s.Ea && C < q.length && h.M;C++) {
            s.currentTarget = q[C], g &= Eb(h, q[C], d, m, s)
          }
        }
      }else {
        g = Fb(c, s)
      }
    }finally {
      q && (q.length = 0), s.b()
    }
    return g
  }
  d = new sb(b, this);
  try {
    g = Fb(c, d)
  }finally {
    d.b()
  }
  return g
}
var Gb = 0;
function Hb() {
}
A(Hb, J);
p = Hb.prototype;
p.dd = j;
p.Mb = k;
p.Hc = aa("Mb");
p.addEventListener = function(a, b, c, d) {
  wb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  Ab(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
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
    var d = 1, e, c = c[b], b = j in c, g;
    if(b) {
      e = [];
      for(g = this;g;g = g.Mb) {
        e.push(g)
      }
      g = c[j];
      g.M = g.c;
      for(var h = e.length - 1;!a.Ea && 0 <= h && g.M;h--) {
        a.currentTarget = e[h], d &= Eb(g, e[h], a.type, j, a) && a.Sb != m
      }
    }
    if(m in c) {
      if(g = c[m], g.M = g.c, b) {
        for(h = 0;!a.Ea && h < e.length && g.M;h++) {
          a.currentTarget = e[h], d &= Eb(g, e[h], a.type, m, a) && a.Sb != m
        }
      }else {
        for(e = this;!a.Ea && e && g.M;e = e.Mb) {
          a.currentTarget = e, d &= Eb(g, e, a.type, m, a) && a.Sb != m
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
  Hb.n.d.call(this);
  Db(this);
  this.Mb = k
};
var Ib = r.window;
Gb++;
Gb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function M(a, b) {
  this.vb = [];
  this.Zc = a;
  this.fd = b || k
}
p = M.prototype;
p.da = m;
p.eb = m;
p.jb = 0;
p.Ic = m;
p.pe = m;
p.tb = 0;
p.cancel = function(a) {
  if(this.da) {
    this.lb instanceof M && this.lb.cancel()
  }else {
    if(this.r) {
      var b = this.r;
      delete this.r;
      a ? b.cancel(a) : (b.tb--, 0 >= b.tb && b.cancel())
    }
    this.Zc ? this.Zc.call(this.fd, this) : this.Ic = j;
    this.da || this.U(new Jb)
  }
};
p.bd = function(a, b) {
  Kb(this, a, b);
  this.jb--;
  0 == this.jb && this.da && Lb(this)
};
function Kb(a, b, c) {
  a.da = j;
  a.lb = c;
  a.eb = !b;
  Lb(a)
}
function Mb(a) {
  a.da && (a.Ic || f(new Nb), a.Ic = m)
}
p.N = function(a) {
  Mb(this);
  Kb(this, j, a)
};
p.U = function(a) {
  Mb(this);
  Kb(this, m, a)
};
p.ua = function(a, b) {
  return this.ja(a, k, b)
};
p.sb = function(a, b) {
  return this.ja(k, a, b)
};
p.ja = function(a, b, c) {
  this.vb.push([a, b, c]);
  this.da && Lb(this);
  return this
};
p.$c = function(a) {
  this.ja(a.N, a.U, a);
  return this
};
p.ke = function(a) {
  return this.ua(y(a.Yc, a))
};
p.Yc = function(a) {
  var b = new M;
  this.$c(b);
  a && (b.r = this, this.tb++);
  return b
};
p.Uc = function(a, b) {
  return this.ja(a, a, b)
};
p.Je = o("da");
function Ob(a) {
  return gb(a.vb, function(a) {
    return ia(a[1])
  })
}
function Lb(a) {
  a.Rc && a.da && Ob(a) && (r.clearTimeout(a.Rc), delete a.Rc);
  a.r && (a.r.tb--, delete a.r);
  for(var b = a.lb, c = m, d = m;a.vb.length && 0 == a.jb;) {
    var e = a.vb.shift(), g = e[0], h = e[1], e = e[2];
    if(g = a.eb ? h : g) {
      try {
        var l = g.call(e || a.fd, b);
        u(l) && (a.eb = a.eb && (l == b || l instanceof Error), a.lb = b = l);
        b instanceof M && (d = j, a.jb++)
      }catch(n) {
        b = n, a.eb = j, Ob(a) || (c = j)
      }
    }
  }
  a.lb = b;
  d && a.jb && (b.ja(y(a.bd, a, j), y(a.bd, a, m)), b.pe = j);
  c && (a.Rc = r.setTimeout(function() {
    u(b.message) && b.stack && (b.message = b.message + ("\n" + b.stack));
    f(b)
  }, 0))
}
function Pb(a) {
  var b = new M;
  b.N(a);
  return b
}
function Qb(a) {
  var b = new M;
  b.U(a);
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
function Rb(a) {
  this.A = a;
  this.zb = [];
  this.jd = [];
  this.oe = y(this.hf, this)
}
Rb.prototype.Oc = k;
function Sb(a, b, c, d) {
  a.zb.push([b, c, d]);
  a.Oc == k && (a.Oc = a.A.setTimeout(a.oe, 0))
}
Rb.prototype.hf = function() {
  this.Oc = k;
  var a = this.zb;
  this.zb = [];
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
  if(0 == this.zb.length) {
    a = this.jd;
    this.jd = [];
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
        for(var e = "", g = 0;g < d;g++) {
          c.push(e), e = b[g], Wb(a, a.Rb ? a.Rb.call(b, "" + g, e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(g in b) {
        Object.prototype.hasOwnProperty.call(b, g) && (e = b[g], "function" != typeof e && (c.push(d), Yb(g, c), c.push(":"), Wb(a, a.Rb ? a.Rb.call(b, g, e) : e, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      f(Error("Unknown type: " + typeof b))
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
        Yb(a, b)
      }else {
        if(Ub(a.u)) {
          a.u(b, c)
        }else {
          if(Ub(a.ge)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var e = "", g = 0;g < d;g++) {
                  b.push(e), ac(a[g], b, c), e = ", "
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
                      g = d[h], Object.prototype.hasOwnProperty.call(a, g) && (l = a[g], b.push(e), Yb(g, b), b.push(": "), ac(l, b, c), e = ", ")
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
function jc(a) {
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
function kc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(fa(a) || x(a)) {
      eb(a, b, c)
    }else {
      for(var d = jc(a), e = ic(a), g = e.length, h = 0;h < g;h++) {
        b.call(c, e[h], d && d[h], a)
      }
    }
  }
}
function lc(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, i)
  }
  if(fa(a) || x(a)) {
    return hb(a, b, i)
  }
  for(var c = jc(a), d = ic(a), e = d.length, g = 0;g < e;g++) {
    if(!b.call(i, d[g], c && c[g], a)) {
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
    c % 2 && f(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.ac(a)
  }
}
p = P.prototype;
p.c = 0;
p.B = o("c");
p.J = function() {
  mc(this);
  for(var a = [], b = 0;b < this.h.length;b++) {
    a.push(this.m[this.h[b]])
  }
  return a
};
p.V = function() {
  mc(this);
  return this.h.concat()
};
p.P = function(a) {
  return nc(this.m, a)
};
p.ec = function(a) {
  for(var b = 0;b < this.h.length;b++) {
    var c = this.h[b];
    if(nc(this.m, c) && this.m[c] == a) {
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
  var c = b || pc;
  mc(this);
  for(var d, e = 0;d = this.h[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function pc(a, b) {
  return a === b
}
p.gb = function() {
  return 0 == this.c
};
p.clear = function() {
  this.m = {};
  this.c = this.h.length = 0
};
p.remove = function(a) {
  return nc(this.m, a) ? (delete this.m[a], this.c--, this.h.length > 2 * this.c && mc(this), j) : m
};
function mc(a) {
  if(a.c != a.h.length) {
    for(var b = 0, c = 0;b < a.h.length;) {
      var d = a.h[b];
      nc(a.m, d) && (a.h[c++] = d);
      b++
    }
    a.h.length = c
  }
  if(a.c != a.h.length) {
    for(var e = {}, c = b = 0;b < a.h.length;) {
      d = a.h[b], nc(e, d) || (a.h[c++] = d, e[d] = 1), b++
    }
    a.h.length = c
  }
}
p.get = function(a, b) {
  return nc(this.m, a) ? this.m[a] : b
};
p.set = function(a, b) {
  nc(this.m, a) || (this.c++, this.h.push(a));
  this.m[a] = b
};
p.ac = function(a) {
  var b;
  a instanceof P ? (b = a.V(), a = a.J()) : (b = $a(a), a = Za(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
p.O = function() {
  return new P(this)
};
function qc(a) {
  mc(a);
  for(var b = {}, c = 0;c < a.h.length;c++) {
    var d = a.h[c];
    b[d] = a.m[d]
  }
  return b
}
function nc(a, b) {
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
;var sc = {ge:ba("<cw.eq.Wildcard>")};
function tc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function uc(a, b, c) {
  var d = t(a), e = t(b);
  if(a == sc || b == sc) {
    return j
  }
  if(a != k && "function" == typeof a.I) {
    return c && c.push("running custom equals function on left object"), a.I(b, c)
  }
  if(b != k && "function" == typeof b.I) {
    return c && c.push("running custom equals function on right object"), b.I(a, c)
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
              c && c.push("array length mismatch: " + a.length + ", " + b.length), a = m
            }else {
              d = 0;
              for(e = a.length;d < e;d++) {
                if(!uc(a[d], b[d], c)) {
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
          if(a.fe == Ca && b.fe == Ca) {
            a: {
              c && c.push("descending into object");
              for(var g in a) {
                if(!(g in b)) {
                  c && c.push("property " + g + " missing on right object");
                  a = m;
                  break a
                }
                if(!uc(a[g], b[g], c)) {
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
  this.We = a;
  this.Pb = b
}
Q.prototype.I = function(a, b) {
  return ha(a) && this.constructor == a.constructor && uc(this.Pb, a.Pb, b)
};
Q.prototype.u = function(a, b) {
  a.push("new ", this.We, "(");
  for(var c = "", d = 0;d < this.Pb.length;d++) {
    a.push(c), c = ", ", N(this.Pb[d], a, b)
  }
  a.push(")")
};
var vc, wc;
function xc(a, b) {
  Q.call(this, "Question", [a, b]);
  this.body = a;
  this.ga = b
}
A(xc, Q);
function yc(a, b) {
  Q.call(this, "OkayAnswer", [a, b]);
  this.body = a;
  this.ga = b
}
A(yc, Q);
function zc(a, b) {
  Q.call(this, "KnownErrorAnswer", [a, b]);
  this.body = a;
  this.ga = b
}
A(zc, Q);
function Ac(a, b) {
  Q.call(this, "UnknownErrorAnswer", [a, b]);
  this.body = a;
  this.ga = b
}
A(Ac, Q);
function Bc(a) {
  Q.call(this, "Cancellation", [a]);
  this.ga = a
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
  f(Error("qanTypeToCode bug"))
}
function Ec(a) {
  var b = Dc(a);
  if(a instanceof Bc) {
    return"" + a.ga + b
  }
  x(a.body) || f(Error("qanFrame.body must be a string, was " + O(a.body)));
  return a instanceof Cc ? a.body + b : a.body + "|" + ("" + a.ga) + b
}
function Fc(a) {
  B.call(this);
  this.body = a
}
A(Fc, B);
Fc.prototype.message = "KnownError with arbitrary body";
Fc.prototype.u = function(a, b) {
  a.push("new KnownError(");
  N(this.body, a, b);
  a.push(")")
};
function Gc(a) {
  B.call(this);
  this.body = a
}
A(Gc, B);
Gc.prototype.message = "UnknownError with arbitrary body";
Gc.prototype.u = function(a, b) {
  a.push("new UnknownError(");
  N(this.body, a, b);
  a.push(")")
};
function Hc(a) {
  B.call(this);
  this.message = a
}
A(Hc, B);
function R(a, b, c, d) {
  this.Xc = a;
  this.Jb = b;
  this.ta = c;
  this.oc = d;
  this.Ob = 0;
  this.ma = new P;
  this.Xa = new P
}
p = R.prototype;
p.u = function(a) {
  a.push("<QANHelper asked ", "" + this.Ob, " questions, waiting for ", "" + this.ma.B(), " peer answers and ", "" + this.Xa.B(), " local answers>")
};
p.He = function(a) {
  if(a instanceof yc || a instanceof zc || a instanceof Ac) {
    var b = a.ga, c = this.ma.get(b);
    this.ma.remove(b);
    u(c) ? c !== k && (a instanceof yc ? c.N(a.body) : a instanceof zc ? c.U(new Fc(a.body)) : a instanceof Ac ? c.U(new Gc(a.body)) : f(Error("handleQANFrame bug"))) : this.oc("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof Cc) {
      try {
        this.Xc(a.body, m)
      }catch(d) {
        this.Jb("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof xc) {
        if(b = a.ga, this.Xa.P(b)) {
          this.oc("Received Question with duplicate qid: " + b)
        }else {
          c = rc(this.Xc, [a.body, j]);
          this.Xa.set(b, c);
          var e = this;
          c.ja(function(a) {
            var c = b;
            e.Xa.remove(c);
            e.ta(new yc(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Xa.remove(c);
            a instanceof Fc ? e.ta(new zc(a.body, c)) : a instanceof Jb ? e.ta(new Ac("CancelledError", c)) : (e.Jb("Peer's Question #" + c + " caused uncaught exception", a), e.ta(new Ac("Uncaught exception", c)));
            return k
          });
          c.sb(function(a) {
            this.Jb("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof Bc && (b = a.ga, c = this.Xa.get(b), u(c) && c.cancel())
      }
    }
  }
};
p.je = function(a) {
  var b = this.Ob += 1;
  this.ta(new xc(a, b));
  var c = this, a = new M(function() {
    c.ma.set(b, k);
    c.ta(new Bc(b))
  });
  this.ma.set(b, a);
  return a
};
p.Se = function(a) {
  this.ta(new Cc(a))
};
p.Ae = function(a) {
  for(var b = this.ma.V(), c = 0;c < b.length;c++) {
    var d = this.ma.get(b[c]);
    u(d) && (this.ma.set(b[c], k), d.U(new Hc(a)))
  }
};
function Ic() {
  this.Rd = oa()
}
var Jc = new Ic;
Ic.prototype.set = aa("Rd");
Ic.prototype.reset = function() {
  this.set(oa())
};
Ic.prototype.get = o("Rd");
function Kc(a) {
  this.Ue = a || "";
  this.bf = Jc
}
Kc.prototype.Zd = j;
Kc.prototype.af = j;
Kc.prototype.$e = j;
Kc.prototype.$d = m;
function Lc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Mc(a, b) {
  var c = (a.be - b) / 1E3, d = c.toFixed(3), e = 0;
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
function Nc(a) {
  Kc.call(this, a)
}
A(Nc, Kc);
Nc.prototype.$d = j;
var Oc;
function Pc(a, b) {
  var c;
  c = a.className;
  c = x(c) && c.match(/\S+/g) || [];
  for(var d = lb(arguments, 1), e = c.length + d.length, g = c, h = 0;h < d.length;h++) {
    0 <= db(g, d[h]) || g.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == e
}
;var Qc = !E || Va();
!La && !E || E && Va() || La && G("1.9.1");
E && G("9");
function Rc(a) {
  return a ? new Sc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Oc || (Oc = new Sc)
}
function Tc(a) {
  return x(a) ? document.getElementById(a) : a
}
function Uc(a, b) {
  Ya(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in Vc ? a.setAttribute(Vc[d], b) : 0 == d.lastIndexOf("aria-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var Vc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Wc(a, b, c) {
  return Xc(document, arguments)
}
function Xc(a, b) {
  var c = b[0], d = b[1];
  if(!Qc && d && (d.name || d.type)) {
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
  d && (x(d) ? c.className = d : v(d) ? Pc.apply(k, [c].concat(d)) : Uc(c, d));
  2 < b.length && Yc(a, c, b, 2);
  return c
}
function Yc(a, b, c, d) {
  function e(c) {
    c && b.appendChild(x(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var g = c[d];
    fa(g) && !(ha(g) && 0 < g.nodeType) ? eb(Zc(g) ? kb(g) : g, e) : e(g)
  }
}
function $c(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function Zc(a) {
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
function Sc(a) {
  this.ya = a || r.document || document
}
p = Sc.prototype;
p.nd = Rc;
p.Aa = function(a) {
  return x(a) ? this.ya.getElementById(a) : a
};
function ad(a, b) {
  var c;
  c = a.ya;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && (!F || "CSS1Compat" == document.compatMode || G("528")) && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.bb = function(a, b, c) {
  return Xc(this.ya, arguments)
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
  Yc(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
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
function bd(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
function cd(a) {
  E ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[F ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function dd(a) {
  this.m = new P;
  a && this.ac(a)
}
function ed(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ja(a) : b.substr(0, 1) + a
}
p = dd.prototype;
p.B = function() {
  return this.m.B()
};
p.add = function(a) {
  this.m.set(ed(a), a)
};
p.ac = function(a) {
  for(var a = ic(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Ec = function(a) {
  for(var a = ic(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.m.remove(ed(a))
};
p.clear = function() {
  this.m.clear()
};
p.gb = function() {
  return this.m.gb()
};
p.contains = function(a) {
  return this.m.P(ed(a))
};
p.J = function() {
  return this.m.J()
};
p.O = function() {
  return new dd(this)
};
p.I = function(a) {
  return this.B() == hc(a) && fd(this, a)
};
function fd(a, b) {
  var c = hc(b);
  if(a.B() > c) {
    return m
  }
  !(b instanceof dd) && 5 < c && (b = new dd(b));
  return lc(a, function(a) {
    if("function" == typeof b.contains) {
      a = b.contains(a)
    }else {
      if("function" == typeof b.ec) {
        a = b.ec(a)
      }else {
        if(fa(b) || x(b)) {
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
;function gd(a) {
  return hd(a || arguments.callee.caller, [])
}
function hd(a, b) {
  var c = [];
  if(0 <= db(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(id(a) + "(");
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
            g = (g = id(g)) ? g : "[fn]";
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
        c.push(hd(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function id(a) {
  if(jd[a]) {
    return jd[a]
  }
  a = "" + a;
  if(!jd[a]) {
    var b = /function ([^\(]+)/.exec(a);
    jd[a] = b ? b[1] : "[Anonymous]"
  }
  return jd[a]
}
var jd = {};
function kd(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
kd.prototype.mc = k;
kd.prototype.lc = k;
var ld = 0;
kd.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || ld++;
  this.be = d || oa();
  this.Qa = a;
  this.Gd = b;
  this.Oe = c;
  delete this.mc;
  delete this.lc
};
kd.prototype.Gc = aa("Qa");
function S(a) {
  this.Qe = a
}
S.prototype.r = k;
S.prototype.Qa = k;
S.prototype.ka = k;
S.prototype.Ma = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var md = new T("OFF", Infinity), nd = new T("SHOUT", 1200), od = new T("SEVERE", 1E3), pd = new T("WARNING", 900), qd = new T("INFO", 800), rd = new T("CONFIG", 700), td = new T("FINE", 500), ud = new T("FINER", 400), vd = new T("FINEST", 300), wd = new T("ALL", 0);
function U(a) {
  return V.pd(a)
}
p = S.prototype;
p.getParent = o("r");
p.Gc = aa("Qa");
function xd(a) {
  if(a.Qa) {
    return a.Qa
  }
  if(a.r) {
    return xd(a.r)
  }
  Ba("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= xd(this).value) {
    a = this.Fe(a, b, c);
    b = "log:" + a.Gd;
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
p.Fe = function(a, b, c) {
  var d = new kd(a, "" + b, this.Qe);
  if(c) {
    d.mc = c;
    var e;
    var g = arguments.callee.caller;
    try {
      var h;
      var l = da("window.location.href");
      if(x(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:l, stack:"Not available"}
      }else {
        var n, s, H = m;
        try {
          n = c.lineNumber || c.Ne || "Not available"
        }catch(q) {
          n = "Not available", H = j
        }
        try {
          s = c.fileName || c.filename || c.sourceURL || l
        }catch(w) {
          s = "Not available", H = j
        }
        h = H || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:s, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + D(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + D(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + D(gd(g) + "-> ")
    }catch(C) {
      e = "Exception trying to expose exception! You win, we lose. " + C
    }
    d.lc = e
  }
  return d
};
p.Ze = function(a, b) {
  this.log(nd, a, b)
};
p.F = function(a, b) {
  this.log(od, a, b)
};
p.z = function(a, b) {
  this.log(pd, a, b)
};
p.info = function(a, b) {
  this.log(qd, a, b)
};
p.re = function(a, b) {
  this.log(rd, a, b)
};
p.k = function(a, b) {
  this.log(td, a, b)
};
p.Be = function(a, b) {
  this.log(ud, a, b)
};
p.q = function(a, b) {
  this.log(vd, a, b)
};
var V = {Kb:{}, mb:k, ud:function() {
  V.mb || (V.mb = new S(""), V.Kb[""] = V.mb, V.mb.Gc(rd))
}, og:function() {
  return V.Kb
}, pc:function() {
  V.ud();
  return V.mb
}, pd:function(a) {
  V.ud();
  return V.Kb[a] || V.te(a)
}, ng:function(a) {
  return function(b) {
    (a || V.pc()).F("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Ne + ")")
  }
}, te:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.pd(a.substr(0, c));
  c.ka || (c.ka = {});
  c.ka[d] = b;
  b.r = c;
  return V.Kb[a] = b
}};
function yd(a) {
  this.Pd = y(this.he, this);
  this.md = new Nc;
  this.wd = this.md.Zd = m;
  this.i = a;
  this.ye = this.i.ownerDocument || this.i.document;
  var a = Rc(this.i), b = k;
  if(E) {
    b = a.ya.createStyleSheet(), cd(b)
  }else {
    var c = ad(a, "head")[0];
    c || (b = ad(a, "body")[0], c = a.bb("head"), b.parentNode.insertBefore(c, b));
    b = a.bb("style");
    cd(b);
    a.appendChild(c, b)
  }
  this.i.className += " logdiv"
}
yd.prototype.Ye = function(a) {
  if(a != this.wd) {
    var b = V.pc();
    if(a) {
      var c = this.Pd;
      b.Ma || (b.Ma = []);
      b.Ma.push(c)
    }else {
      (b = b.Ma) && ib(b, this.Pd)
    }
    this.wd = a
  }
};
yd.prototype.he = function(a) {
  var b = 100 >= this.i.scrollHeight - this.i.scrollTop - this.i.clientHeight, c = this.ye.createElement("div");
  c.className = "logmsg";
  var d = this.md, e;
  switch(a.Qa.value) {
    case nd.value:
      e = "dbg-sh";
      break;
    case od.value:
      e = "dbg-sev";
      break;
    case pd.value:
      e = "dbg-w";
      break;
    case qd.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var g = [];
  g.push(d.Ue, " ");
  if(d.Zd) {
    var h = new Date(a.be);
    g.push("[", Lc(h.getFullYear() - 2E3) + Lc(h.getMonth() + 1) + Lc(h.getDate()) + " " + Lc(h.getHours()) + ":" + Lc(h.getMinutes()) + ":" + Lc(h.getSeconds()) + "." + Lc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.af && g.push("[", ya(Mc(a, d.bf.get())), "s] ");
  d.$e && g.push("[", D(a.Oe), "] ");
  g.push('<span class="', e, '">', sa(ya(D(a.Gd))));
  d.$d && a.mc && g.push("<br>", sa(ya(a.lc || "")));
  g.push("</span><br>");
  c.innerHTML = g.join("");
  this.i.appendChild(c);
  b && (this.i.scrollTop = this.i.scrollHeight)
};
yd.prototype.clear = function() {
  this.i.innerHTML = ""
};
var zd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function Ad(a, b) {
  var c = a.match(zd), d = b.match(zd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function Bd(a, b) {
  var c;
  a instanceof Bd ? (this.Wa(b == k ? a.X : b), Cd(this, a.$), Dd(this, a.Ia), Ed(this, a.Q), Fd(this, a.oa), Gd(this, a.K), Hd(this, a.L.O()), Id(this, a.za)) : a && (c = ("" + a).match(zd)) ? (this.Wa(!!b), Cd(this, c[1] || "", j), Dd(this, c[2] || "", j), Ed(this, c[3] || "", j), Fd(this, c[4]), Gd(this, c[5] || "", j), Hd(this, c[6] || "", j), Id(this, c[7] || "", j)) : (this.Wa(!!b), this.L = new Jd(k, this, this.X))
}
p = Bd.prototype;
p.$ = "";
p.Ia = "";
p.Q = "";
p.oa = k;
p.K = "";
p.za = "";
p.Me = m;
p.X = m;
p.toString = function() {
  if(this.T) {
    return this.T
  }
  var a = [];
  this.$ && a.push(Kd(this.$, Ld), ":");
  this.Q && (a.push("//"), this.Ia && a.push(Kd(this.Ia, Ld), "@"), a.push(x(this.Q) ? encodeURIComponent(this.Q) : k), this.oa != k && a.push(":", "" + this.oa));
  this.K && (this.Q && "/" != this.K.charAt(0) && a.push("/"), a.push(Kd(this.K, "/" == this.K.charAt(0) ? Md : Nd)));
  var b = "" + this.L;
  b && a.push("?", b);
  this.za && a.push("#", Kd(this.za, Od));
  return this.T = a.join("")
};
p.O = function() {
  var a = this.$, b = this.Ia, c = this.Q, d = this.oa, e = this.K, g = this.L.O(), h = this.za, l = new Bd(k, this.X);
  a && Cd(l, a);
  b && Dd(l, b);
  c && Ed(l, c);
  d && Fd(l, d);
  e && Gd(l, e);
  g && Hd(l, g);
  h && Id(l, h);
  return l
};
function Cd(a, b, c) {
  Pd(a);
  delete a.T;
  a.$ = c ? b ? decodeURIComponent(b) : "" : b;
  a.$ && (a.$ = a.$.replace(/:$/, ""))
}
function Dd(a, b, c) {
  Pd(a);
  delete a.T;
  a.Ia = c ? b ? decodeURIComponent(b) : "" : b
}
function Ed(a, b, c) {
  Pd(a);
  delete a.T;
  a.Q = c ? b ? decodeURIComponent(b) : "" : b
}
function Fd(a, b) {
  Pd(a);
  delete a.T;
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.oa = b) : a.oa = k
}
function Gd(a, b, c) {
  Pd(a);
  delete a.T;
  a.K = c ? b ? decodeURIComponent(b) : "" : b
}
function Hd(a, b, c) {
  Pd(a);
  delete a.T;
  b instanceof Jd ? (a.L = b, a.L.Sc = a, a.L.Wa(a.X)) : (c || (b = Kd(b, Qd)), a.L = new Jd(b, a, a.X))
}
function Id(a, b, c) {
  Pd(a);
  delete a.T;
  a.za = c ? b ? decodeURIComponent(b) : "" : b
}
function Pd(a) {
  a.Me && f(Error("Tried to modify a read-only Uri"))
}
p.Wa = function(a) {
  this.X = a;
  this.L && this.L.Wa(a);
  return this
};
function Rd(a) {
  return a instanceof Bd ? a.O() : new Bd(a, i)
}
var Sd = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function Kd(a, b) {
  var c = k;
  x(a) && (c = a, Sd.test(c) || (c = encodeURI(a)), 0 <= c.search(b) && (c = c.replace(b, Td)));
  return c
}
function Td(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Ld = /[#\/\?@]/g, Nd = /[\#\?:]/g, Md = /[\#\?]/g, Qd = /[\#\?@]/g, Od = /#/g;
function Jd(a, b, c) {
  this.ca = a || k;
  this.Sc = b || k;
  this.X = !!c
}
function W(a) {
  if(!a.g && (a.g = new P, a.c = 0, a.ca)) {
    for(var b = a.ca.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), e = k, g = k;
      0 <= d ? (e = b[c].substring(0, d), g = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = Ud(a, e);
      a.add(e, g ? decodeURIComponent(g.replace(/\+/g, " ")) : "")
    }
  }
}
p = Jd.prototype;
p.g = k;
p.c = k;
p.B = function() {
  W(this);
  return this.c
};
p.add = function(a, b) {
  W(this);
  Vd(this);
  a = Ud(this, a);
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
  a = Ud(this, a);
  if(this.g.P(a)) {
    Vd(this);
    var b = this.g.get(a);
    v(b) ? this.c -= b.length : this.c--;
    return this.g.remove(a)
  }
  return m
};
p.clear = function() {
  Vd(this);
  this.g && this.g.clear();
  this.c = 0
};
p.gb = function() {
  W(this);
  return 0 == this.c
};
p.P = function(a) {
  W(this);
  a = Ud(this, a);
  return this.g.P(a)
};
p.ec = function(a) {
  var b = this.J();
  return 0 <= db(b, a)
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
    a = Ud(this, a), this.P(a) && (b = jb(b, this.g.get(a)))
  }else {
    for(var a = this.g.J(), c = 0;c < a.length;c++) {
      b = jb(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  W(this);
  Vd(this);
  a = Ud(this, a);
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
  a = Ud(this, a);
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
function Vd(a) {
  delete a.La;
  delete a.ca;
  a.Sc && delete a.Sc.T
}
p.O = function() {
  var a = new Jd;
  this.La && (a.La = this.La);
  this.ca && (a.ca = this.ca);
  this.g && (a.g = this.g.O());
  return a
};
function Ud(a, b) {
  var c = "" + b;
  a.X && (c = c.toLowerCase());
  return c
}
p.Wa = function(a) {
  a && !this.X && (W(this), Vd(this), kc(this.g, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.X = a
};
function Wd(a) {
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
  f(Error("cannot determine size of object type " + b))
}
;function Xd(a, b) {
  this.Ja = a;
  this.Fa = b
}
Xd.prototype.I = function(a) {
  return a instanceof Xd && this.Ja == a.Ja && this.Fa.join(",") == a.Fa
};
Xd.prototype.u = function(a, b) {
  a.push("new SACK(", "" + this.Ja, ", ");
  N(this.Fa, a, b);
  a.push(")")
};
function Yd() {
  this.D = new P
}
Yd.prototype.xa = -1;
Yd.prototype.G = 0;
Yd.prototype.append = function(a) {
  var b = Wd(a);
  this.D.set(this.xa + 1, [a, b]);
  this.xa += 1;
  this.G += b
};
Yd.prototype.u = function(a) {
  a.push("<Queue with ", "" + this.D.B(), " item(s), counter=#", "" + this.xa, ", size=", "" + this.G, ">")
};
function Zd(a) {
  a = a.D.V();
  mb(a);
  return a
}
function $d() {
  this.wa = new P
}
$d.prototype.Da = -1;
$d.prototype.G = 0;
function ae(a) {
  var b = a.wa.V();
  mb(b);
  return new Xd(a.Da, b)
}
var be = {};
function ce(a, b) {
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
        a.push('<property id="', d, '">'), ce(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != t(b[c]) && (a.push('<property id="', D(c), '">'), ce(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function de(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var g = e.length, h = 1;h < g;h++) {
    ce(d, e[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var ee = m, fe = "";
function ge(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var he = navigator.plugins["Shockwave Flash"];
  he && (ee = j, he.description && (fe = ge(he.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (ee = j, fe = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var ie = navigator.mimeTypes["application/x-shockwave-flash"];
    (ee = ie && ie.enabledPlugin) && (fe = ge(ie.enabledPlugin.description))
  }else {
    try {
      var je = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), ee = j, fe = ge(je.GetVariable("$version"))
    }catch(ke) {
      try {
        je = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), ee = j, fe = "6.0.21"
      }catch(le) {
        try {
          je = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), ee = j, fe = ge(je.GetVariable("$version"))
        }catch(me) {
        }
      }
    }
  }
}
var ne = fe;
function oe(a) {
  this.Ie = a;
  this.h = []
}
A(oe, J);
var pe = [];
oe.prototype.Ec = function() {
  eb(this.h, Bb);
  this.h.length = 0
};
oe.prototype.d = function() {
  oe.n.d.call(this);
  this.Ec()
};
oe.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function qe() {
}
qe.od = function() {
  return qe.vd ? qe.vd : qe.vd = new qe
};
qe.prototype.Re = 0;
qe.od();
function re(a) {
  this.xb = a || Rc()
}
A(re, Hb);
p = re.prototype;
p.Le = qe.od();
p.W = k;
p.Ca = m;
p.i = k;
p.r = k;
p.ka = k;
p.wb = k;
p.jf = m;
function se(a) {
  return a.W || (a.W = ":" + (a.Le.Re++).toString(36))
}
p.Aa = o("i");
p.getParent = o("r");
p.Hc = function(a) {
  this.r && this.r != a && f(Error("Method not supported"));
  re.n.Hc.call(this, a)
};
p.nd = o("xb");
p.bb = function() {
  this.i = this.xb.createElement("div")
};
function te(a, b) {
  a.Ca && f(Error("Component already rendered"));
  a.i || a.bb();
  b ? b.insertBefore(a.i, k) : a.xb.ya.body.appendChild(a.i);
  (!a.r || a.r.Ca) && a.yb()
}
p.yb = function() {
  this.Ca = j;
  ue(this, function(a) {
    !a.Ca && a.Aa() && a.yb()
  })
};
function ve(a) {
  ue(a, function(a) {
    a.Ca && ve(a)
  });
  a.Eb && a.Eb.Ec();
  a.Ca = m
}
p.d = function() {
  re.n.d.call(this);
  this.Ca && ve(this);
  this.Eb && (this.Eb.b(), delete this.Eb);
  ue(this, function(a) {
    a.b()
  });
  !this.jf && this.i && $c(this.i);
  this.r = this.i = this.wb = this.ka = k
};
function ue(a, b) {
  a.ka && eb(a.ka, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = x(a) ? a : se(a), d;
    this.wb && c ? (d = this.wb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.wb, c in d && delete d[c], ib(this.ka, a), b && (ve(a), a.i && $c(a.i)), c = a, c == k && f(Error("Unable to set parent component")), c.r = k, re.n.Hc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function we(a, b) {
  this.xb = b || Rc();
  this.De = a;
  this.kc = new oe(this);
  this.Bb = new P
}
A(we, re);
p = we.prototype;
p.a = U("goog.ui.media.FlashObject");
p.lf = "window";
p.Wc = "#000000";
p.ie = "sameDomain";
function xe(a, b, c) {
  a.Tc = x(b) ? b : Math.round(b) + "px";
  a.rc = x(c) ? c : Math.round(c) + "px";
  a.Aa() && (b = a.Aa() ? a.Aa().firstChild : k, c = a.Tc, a = a.rc, a == i && f(Error("missing height argument")), b.style.width = bd(c), b.style.height = bd(a))
}
p.yb = function() {
  we.n.yb.call(this);
  var a = this.Aa(), b;
  b = E ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = E ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = pa(c, this.lf), d = this.Bb.V(), e = this.Bb.J(), g = [], h = 0;h < d.length;h++) {
    var l = ra(d[h]), n = ra(e[h]);
    g.push(l + "=" + n)
  }
  b = pa(b, se(this), se(this), "goog-ui-media-flash-object", D(this.De), D(g.join("&")), this.Wc, this.ie, c);
  a.innerHTML = b;
  this.Tc && this.rc && xe(this, this.Tc, this.rc);
  a = this.kc;
  b = this.Aa();
  c = Za(ob);
  v(c) || (pe[0] = c, c = pe);
  for(d = 0;d < c.length;d++) {
    a.h.push(wb(b, c[d], qb || a, m, a.Ie || a))
  }
};
p.bb = function() {
  this.Td != k && !(0 <= za(ne, this.Td)) && (this.a.z("Required flash version not found:" + this.Td), f(Error("Method not supported")));
  var a = this.nd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.i = a
};
p.d = function() {
  we.n.d.call(this);
  this.Bb = k;
  this.kc.b();
  this.kc = k
};
function ye(a) {
  B.call(this, a)
}
A(ye, B);
ye.prototype.name = "cw.loadflash.FlashLoadFailed";
r.__loadFlashObject_callbacks = {};
function ze(a, b, c) {
  function d() {
    e && delete r.__loadFlashObject_callbacks[e]
  }
  var e;
  if(La && !G("1.8.1.20")) {
    return Qb(new ye("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(0 <= za(ne, "9"))) {
    return Qb(new ye("Need Flash Player 9+; had " + (ne ? ne : "none")))
  }
  var g;
  e = "_" + bc();
  var h = new M(d);
  r.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      h.N(Tc(g))
    }, 0)
  };
  b.Bb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  g = se(b);
  te(b, c);
  return h
}
function Ae(a, b, c) {
  var d = ze(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  d.Uc(function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function Be(a, b) {
  this.W = "_" + bc();
  this.Xb = a;
  this.pa = b;
  this.va = a.va
}
A(Be, J);
p = Be.prototype;
p.Ra = j;
p.gc = m;
p.a = U("cw.net.FlashSocket");
p.u = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.W);
  a.push("'>")
};
function Ce(a, b, c) {
  "frames" == b ? (a = a.pa, De(a.v), Ee(a.v, c)) : "stillreceiving" == b ? (c = a.pa, c.a.q("onstillreceiving"), De(c.v)) : "connect" == b ? (c = a.pa, c.a.info("onconnect"), De(c.v), a = c.$a, c.$a = k, a.length && (c.a.q("onconnect: Writing " + a.length + " buffered frame(s)."), c.Tb.rb(a))) : "close" == b ? (a.Ra = m, a.b()) : "ioerror" == b ? (a.Ra = m, b = a.pa, b.a.z("onioerror: " + O(c)), Fe(b.v, m), a.b()) : "securityerror" == b ? (a.Ra = m, b = a.pa, b.a.z("onsecurityerror: " + O(c)), Fe(b.v, 
  m), a.b()) : f(Error("bad event: " + b))
}
function Ge(a) {
  a.gc = j;
  a.Ra = m;
  a.b()
}
p.dc = function(a, b) {
  try {
    var c = this.va.CallFunction(de("__FC_connect", this.W, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.F("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), Ge(this)
  }
  '"OK"' != c && f(Error("__FC_connect failed? ret: " + c))
};
p.rb = function(a) {
  try {
    var b = this.va.CallFunction(de("__FC_writeFrames", this.W, a))
  }catch(c) {
    return this.a.F("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), Ge(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.z("Flash no longer knows of " + this.W + "; disposing."), this.b()) : f(Error("__FC_writeFrames failed? ret: " + b)))
};
p.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Ra);
  Be.n.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Ra) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(de("__FC_close", this.W)))
    }catch(b) {
      this.a.F("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.gc = j
    }
  }
  if(this.gc) {
    a = this.pa, a.a.z("oncrash"), Fe(a.v, j)
  }else {
    this.pa.onclose()
  }
  delete this.pa;
  delete this.Xb.Na[this.W]
};
function He(a, b) {
  this.o = a;
  this.va = b;
  this.Na = {};
  this.cc = "__FST_" + bc();
  r[this.cc] = y(this.xe, this);
  var c = b.CallFunction(de("__FC_setCallbackFunc", this.cc));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(He, J);
p = He.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.u = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Na, a, b);
  a.push(">")
};
p.hc = function(a) {
  a = new Be(this, a);
  return this.Na[a.W] = a
};
p.ve = function(a, b, c, d) {
  var e = this.Na[a];
  e ? "frames" == b && d ? (Ce(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : Ce(e, b, c) : this.a.z("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
p.xe = function(a, b, c, d) {
  try {
    Sb(this.o, this.ve, this, [a, b, c, d])
  }catch(e) {
    r.window.setTimeout(function() {
      f(e)
    }, 0)
  }
};
p.d = function() {
  He.n.d.call(this);
  for(var a = Za(this.Na);a.length;) {
    a.pop().b()
  }
  delete this.Na;
  delete this.va;
  r[this.cc] = i
};
function Ie(a) {
  this.v = a;
  this.$a = []
}
A(Ie, J);
p = Ie.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.rb = function(a) {
  this.$a ? (this.a.q("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.$a.push.apply(this.$a, a)) : (this.a.q("writeFrames: Writing " + a.length + " frame(s)."), this.Tb.rb(a))
};
p.dc = function(a, b) {
  this.Tb.dc(a, b)
};
p.onclose = function() {
  this.a.info("onclose");
  Fe(this.v, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  Ie.n.d.call(this);
  this.Tb.b();
  delete this.v
};
var Ke = [];
function Le() {
  var a = new M;
  Ke.push(a);
  return a
}
function Me(a) {
  var b = Ke;
  Ke = [];
  eb(b, function(b) {
    b.N(a)
  })
}
function Ne(a, b) {
  if(Ke.length) {
    return Le()
  }
  var c = new we(b + "FlashConnector.swf?cb=" + Oe);
  c.Wc = "#777777";
  xe(c, 300, 30);
  var d = Tc("minerva-elements");
  d || f(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = Tc("minerva-elements-FlashConnectorSwf");
  e || (e = Wc("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  vc = Ae(a.A, c, e);
  vc.ua(Me);
  return Le()
}
;function Pe() {
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
function Qe() {
}
Qe.prototype.I = function(a, b) {
  return!(a instanceof Qe) ? m : uc(Re(this), Re(a), b)
};
Qe.prototype.u = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Re(this), a, b);
  a.push(">")
};
function Re(a) {
  return[a.Ya, a.Nd, a.td, a.Sd, a.ob, a.Lc, a.Hd, a.Fd, a.zc, a.Dd, a.de, a.ae, a.ra, a.Hb]
}
Qe.prototype.H = Y;
Qe.prototype.R = function(a) {
  var b = {};
  b.tnum = this.Ya;
  b.ver = this.Nd;
  b.format = this.td;
  b["new"] = this.Sd;
  b.id = this.ob;
  b.ming = this.Lc;
  b.pad = this.Hd;
  b.maxb = this.Fd;
  u(this.zc) && (b.maxt = this.zc);
  b.maxia = this.Dd;
  b.tcpack = this.de;
  b.eeds = this.ae;
  b.sack = this.ra instanceof Xd ? cc((new Se(this.ra)).H()) : this.ra;
  b.seenack = this.Hb instanceof Xd ? cc((new Se(this.Hb)).H()) : this.Hb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(Vb(b), "H")
};
function Te(a) {
  Q.call(this, "StringFrame", [a]);
  this.Nc = a
}
A(Te, Q);
Te.prototype.H = Y;
Te.prototype.R = function(a) {
  a.push(this.Nc, " ")
};
function Ue(a) {
  Q.call(this, "CommentFrame", [a]);
  this.qe = a
}
A(Ue, Q);
Ue.prototype.H = Y;
Ue.prototype.R = function(a) {
  a.push(this.qe, "^")
};
function Ve(a) {
  Q.call(this, "SeqNumFrame", [a]);
  this.Yd = a
}
A(Ve, Q);
Ve.prototype.H = Y;
Ve.prototype.R = function(a) {
  a.push("" + this.Yd, "N")
};
function We(a) {
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
      var g = fc(b[d]);
      if(g == k) {
        return k
      }
      c.push(g)
    }
  }
  return new Xd(a, c)
}
function Se(a) {
  Q.call(this, "SackFrame", [a]);
  this.ra = a
}
A(Se, Q);
Se.prototype.H = Y;
Se.prototype.R = function(a) {
  var b = this.ra;
  a.push(b.Fa.join(","), "|", "" + b.Ja);
  a.push("A")
};
function Xe(a) {
  Q.call(this, "StreamStatusFrame", [a]);
  this.zd = a
}
A(Xe, Q);
Xe.prototype.H = Y;
Xe.prototype.R = function(a) {
  var b = this.zd;
  a.push(b.Fa.join(","), "|", "" + b.Ja);
  a.push("T")
};
function Ye() {
  Q.call(this, "StreamCreatedFrame", [])
}
A(Ye, Q);
Ye.prototype.H = Y;
Ye.prototype.R = function(a) {
  a.push("C")
};
function Ze() {
  Q.call(this, "YouCloseItFrame", [])
}
A(Ze, Q);
Ze.prototype.H = Y;
Ze.prototype.R = function(a) {
  a.push("Y")
};
function $e(a, b) {
  Q.call(this, "ResetFrame", [a, b]);
  this.Qd = a;
  this.Vc = b
}
A($e, Q);
$e.prototype.H = Y;
$e.prototype.R = function(a) {
  a.push(this.Qd, "|", "" + Number(this.Vc), "!")
};
var af = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function bf(a) {
  Q.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(bf, Q);
bf.prototype.H = Y;
bf.prototype.R = function(a) {
  a.push(this.reason, "K")
};
function cf(a) {
  a || f(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new Te(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = We(cc(a)), a == k && f(new X("bad sack")), new Se(a)
  }
  if("N" == b) {
    return a = fc(cc(a)), a == k && f(new X("bad seqNum")), new Ve(a)
  }
  if("T" == b) {
    return a = We(cc(a)), a == k && f(new X("bad lastSackSeen")), new Xe(a)
  }
  if("Y" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Ze
  }
  if("^" == b) {
    return new Ue(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Ye
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && f(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && f(new X("bad applicationLevel")), new $e(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = af[a], a == k && f(new X("unknown kill reason: " + a)), new bf(a)
  }
  f(new X("Invalid frame type " + b))
}
;function df(a, b, c, d) {
  this.contentWindow = a;
  this.Ab = b;
  this.Mc = c;
  this.Ee = d
}
df.prototype.u = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.Ee, a, b);
  a.push(", expandedUrl=");
  N(this.Ab, a, b);
  a.push(", streams=");
  N(this.Mc, a, b);
  a.push(">")
};
function ef() {
  this.frames = [];
  this.xc = new P
}
ef.prototype.a = U("cw.net.XDRTracker");
function ff(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + Math.floor(Pe()) + ("" + Math.floor(Pe()))
  })
}
function gf(a, b) {
  for(var c = hf, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], g;
    if(g = 0 == e.Mc.length) {
      g = e.Ab;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      g = RegExp("^" + h + "$").test(g)
    }
    if(g) {
      return c.a.info("Giving " + O(b) + " existing frame " + O(e)), Pb(e)
    }
  }
  d = bc() + bc();
  e = ff(a);
  g = r.location;
  g instanceof Bd || (g = Rd(g));
  e instanceof Bd || (e = Rd(e));
  var l = g;
  g = l.O();
  (h = !!e.$) ? Cd(g, e.$) : h = !!e.Ia;
  h ? Dd(g, e.Ia) : h = !!e.Q;
  h ? Ed(g, e.Q) : h = e.oa != k;
  var n = e.K;
  if(h) {
    Fd(g, e.oa)
  }else {
    if(h = !!e.K) {
      if("/" != n.charAt(0) && (l.Q && !l.K ? n = "/" + n : (l = g.K.lastIndexOf("/"), -1 != l && (n = g.K.substr(0, l + 1) + n))), ".." == n || "." == n) {
        n = ""
      }else {
        if(!(-1 == n.indexOf("./") && -1 == n.indexOf("/."))) {
          for(var l = 0 == n.lastIndexOf("/", 0), n = n.split("/"), s = [], H = 0;H < n.length;) {
            var q = n[H++];
            "." == q ? l && H == n.length && s.push("") : ".." == q ? ((1 < s.length || 1 == s.length && "" != s[0]) && s.pop(), l && H == n.length && s.push("")) : (s.push(q), l = j)
          }
          n = s.join("/")
        }
      }
    }
  }
  h ? Gd(g, n) : h = "" !== e.L.toString();
  h ? (l = e.L, l.La || (l.La = l.toString() ? decodeURIComponent(l.toString()) : ""), Hd(g, l.La, i)) : h = !!e.za;
  h && Id(g, e.za);
  e = g.toString();
  g = ("" + r.location).match(zd)[3] || k;
  h = e.match(zd)[3] || k;
  g == h ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = Pb(new df(r, e, [b], k))) : ((g = Tc("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new M, c.xc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = Wc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), g.appendChild(c), c = h);
  return c
}
ef.prototype.nf = function(a) {
  var b = this.xc.get(a);
  b || f(Error("Unknown frameId " + O(a)));
  this.xc.remove(b);
  var c = b[0], a = new df(Tc("minerva-xdrframe-" + a).contentWindow || (Tc("minerva-xdrframe-" + a).contentDocument || Tc("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Tc("minerva-xdrframe-" + a).contentDocument || Tc("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var hf = new ef;
r.__XHRTracker_xdrFrameLoaded = y(hf.nf, hf);
var jf;
jf = m;
var kf = Ha();
kf && (-1 != kf.indexOf("Firefox") || -1 != kf.indexOf("Camino") || -1 != kf.indexOf("iPhone") || -1 != kf.indexOf("iPod") || -1 != kf.indexOf("iPad") || -1 != kf.indexOf("Android") || -1 != kf.indexOf("Chrome") && (jf = j));
var lf = jf;
var Oe = "4bdfc178fc0e508c0cd5efc3fdb09920";
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function mf(a, b, c, d, e, g) {
  M.call(this, e, g);
  this.Cd = a;
  this.ic = [];
  this.ld = !!b;
  this.Ce = !!c;
  this.se = !!d;
  for(b = 0;b < a.length;b++) {
    a[b].ja(y(this.rd, this, b, j), y(this.rd, this, b, m))
  }
  0 == a.length && !this.ld && this.N(this.ic)
}
A(mf, M);
mf.prototype.Jd = 0;
mf.prototype.rd = function(a, b, c) {
  this.Jd++;
  this.ic[a] = [b, c];
  this.da || (this.ld && b ? this.N([a, c]) : this.Ce && !b ? this.U(c) : this.Jd == this.Cd.length && this.N(this.ic));
  this.se && !b && (c = k);
  return c
};
mf.prototype.U = function(a) {
  mf.n.U.call(this, a);
  eb(this.Cd, function(a) {
    a.cancel()
  })
};
function nf(a) {
  a = new mf(a, m, j);
  a.ua(function(a) {
    return fb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function of(a, b) {
  this.mf = a;
  this.Ed = b
}
of.prototype.vc = 0;
of.prototype.Lb = 0;
of.prototype.nc = m;
function pf(a) {
  var b = [];
  if(a.nc) {
    return[b, 2]
  }
  var c = a.vc, d = a.mf.responseText;
  for(a.vc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var e = d.substr(a.Lb, c - a.Lb), e = e.replace(/\r$/, "");
    if(e.length > a.Ed) {
      return a.nc = j, [b, 2]
    }
    b.push(e);
    a.Lb = c += 1
  }
  return a.vc - a.Lb - 1 > a.Ed ? (a.nc = j, [b, 2]) : [b, 1]
}
;function qf(a, b, c) {
  this.v = b;
  this.S = a;
  this.fc = c
}
A(qf, J);
p = qf.prototype;
p.a = U("cw.net.XHRMaster");
p.qa = -1;
p.yc = function(a, b, c) {
  this.fc.__XHRSlave_makeRequest(this.S, a, b, c)
};
p.la = o("qa");
p.Bc = function(a, b) {
  1 != b && this.a.F(O(this.S) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  De(this.v);
  Ee(this.v, a)
};
p.Cc = function(a) {
  this.a.k("ongotheaders_: " + O(a));
  var b = k;
  "Content-Length" in a && (b = fc(a["Content-Length"]));
  a = this.v;
  a.a.k(a.l() + " got Content-Length: " + b);
  a.aa == rf && (b == k && (a.a.z("Expected to receive a valid Content-Length, but did not."), b = 5E5), sf(a, 2E3 + 1E3 * (b / 3072)))
};
p.Dc = function(a) {
  1 != a && this.a.k(this.v.l() + "'s XHR's readyState is " + a);
  this.qa = a;
  2 <= this.qa && De(this.v)
};
p.Ac = function() {
  this.v.b()
};
p.d = function() {
  qf.n.d.call(this);
  delete Z.fa[this.S];
  this.fc.__XHRSlave_dispose(this.S);
  delete this.fc
};
function tf() {
  this.fa = {}
}
A(tf, J);
p = tf.prototype;
p.a = U("cw.net.XHRMasterTracker");
p.hc = function(a, b) {
  var c = "_" + bc(), d = new qf(c, a, b);
  return this.fa[c] = d
};
p.Bc = function(a, b, c) {
  if(La) {
    for(var d = [], e = 0, g = b.length;e < g;e++) {
      d[e] = b[e]
    }
    b = d
  }else {
    b = jb(b)
  }
  (d = this.fa[a]) ? d.Bc(b, c) : this.a.F("onframes_: no master for " + O(a))
};
p.Cc = function(a, b) {
  var c = this.fa[a];
  c ? c.Cc(b) : this.a.F("ongotheaders_: no master for " + O(a))
};
p.Dc = function(a, b) {
  var c = this.fa[a];
  c ? c.Dc(b) : this.a.F("onreadystatechange_: no master for " + O(a))
};
p.Ac = function(a) {
  var b = this.fa[a];
  b ? (delete this.fa[b.S], b.Ac()) : this.a.F("oncomplete_: no master for " + O(a))
};
p.d = function() {
  tf.n.d.call(this);
  for(var a = Za(this.fa);a.length;) {
    a.pop().b()
  }
  delete this.fa
};
var Z = new tf;
r.__XHRMaster_onframes = y(Z.Bc, Z);
r.__XHRMaster_oncomplete = y(Z.Ac, Z);
r.__XHRMaster_ongotheaders = y(Z.Cc, Z);
r.__XHRMaster_onreadystatechange = y(Z.Dc, Z);
function uf(a, b, c) {
  this.Y = a;
  this.host = b;
  this.port = c
}
function vf(a, b, c) {
  this.host = a;
  this.port = b;
  this.ff = c
}
function wf(a, b) {
  b || (b = a);
  this.Y = a;
  this.sa = b
}
wf.prototype.u = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.Y, a, b);
  a.push(", secondaryUrl=");
  N(this.sa, a, b);
  a.push(">")
};
function xf(a, b, c, d) {
  this.Y = a;
  this.Md = b;
  this.sa = c;
  this.Wd = d;
  (!(0 == this.Y.indexOf("http://") || 0 == this.Y.indexOf("https://")) || !(0 == this.sa.indexOf("http://") || 0 == this.sa.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Md.location.href;
  Ad(this.Y, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.Wd.location.href;
  Ad(this.sa, a) || f(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
xf.prototype.u = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.Y, a, b);
  a.push(", secondaryUrl=");
  N(this.sa, a, b);
  a.push(">")
};
var yf = new Ue(";)]}");
function zf(a, b) {
  u(b) || (b = j);
  this.cf = b
}
zf.prototype.a = U("cw.net.QANProtocolWrapper");
zf.prototype.Jb = function(a, b) {
  this.a.z(a, b);
  this.cf && r.setTimeout(function() {
    u(b.message) && b.stack && (b.message += "\n" + b.stack);
    f(b)
  }, 0)
};
zf.prototype.ta = function(a) {
  this.Vb.Xd(Ec(a))
};
zf.prototype.oc = function(a) {
  this.Vb.reset("QANHelper said: " + a)
};
function Af(a) {
  this.Vb = a
}
Af.prototype.u = function(a, b) {
  a.push("<UserContext for ");
  N(this.Vb, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.p = a;
  this.o = c ? c : Tb;
  this.pb = new dd;
  this.ob = bc() + bc();
  this.Z = new Yd;
  this.uc = new $d;
  this.qb = k;
  this.Yb = [];
  this.Ha = new Af(this);
  this.ne = y(this.gf, this);
  F && (this.qb = zb(r, "load", this.Xe, m, this))
}
A($, J);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Ad = new Xd(-1, []);
p.Bd = new Xd(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = k;
p.onstarted = k;
p.onreset = k;
p.ondisconnect = k;
p.Va = k;
p.Jc = m;
p.Fc = m;
p.w = 1;
p.Pc = -1;
p.e = k;
p.s = k;
p.kb = k;
p.Kc = 0;
p.Ld = 0;
p.Vd = 0;
p.u = function(a, b) {
  a.push("<ClientStream id=");
  N(this.ob, a, b);
  a.push(", state=", "" + this.w);
  a.push(", primary=");
  N(this.e, a, b);
  a.push(", secondary=");
  N(this.s, a, b);
  a.push(", resetting=");
  N(this.kb, a, b);
  a.push(">")
};
p.Ge = o("Ha");
p.le = function(a) {
  u(a.streamStarted) || f(Error("Protocol is missing required method streamStarted"));
  u(a.streamReset) || f(Error("Protocol is missing required method streamReset"));
  u(a.stringReceived) || f(Error("Protocol is missing required method stringReceived"));
  this.onstarted = y(a.streamStarted, a);
  this.onreset = y(a.streamReset, a);
  this.onstring = y(a.stringReceived, a)
};
function Bf(a) {
  var b = [-1];
  a.e && b.push(a.e.Sa);
  a.s && b.push(a.s.Sa);
  return Math.max.apply(Math.max, b)
}
function Cf(a) {
  if(!(3 > a.w)) {
    Df(a);
    var b = 0 != a.Z.D.B(), c = ae(a.uc), d = !c.I(a.Bd) && !(a.e && c.I(a.e.Pa) || a.s && c.I(a.s.Pa)), e = Bf(a);
    if((b = b && e < a.Z.xa) || d) {
      var g = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.ab ? (a.a.q("tryToSend_: writing " + g + " to primary"), d && (d = a.e, c != d.Pa && (!d.ha && !d.t.length && Ef(d), d.t.push(new Se(c)), d.Pa = c)), b && Ff(a.e, a.Z, e + 1), a.e.ea()) : a.s == k ? a.Jc ? (a.a.q("tryToSend_: creating secondary to send " + g), a.s = Gf(a, m), b && Ff(a.s, a.Z, e + 1), a.s.ea()) : (a.a.q("tryToSend_: not creating a secondary because stream might not exist on server"), a.Fc = j) : a.a.q("tryToSend_: need to send " + g + ", but can't right now")
    }
  }
}
function Df(a) {
  a.Va != k && (a.o.A.clearTimeout(a.Va), a.Va = k)
}
p.gf = function() {
  this.Va = k;
  Cf(this)
};
function Hf(a) {
  a.Va == k && (a.Va = a.o.A.setTimeout(a.ne, 6))
}
p.Xe = function() {
  this.qb = k;
  if(this.e && this.e.Oa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.$b = j;
    a.b()
  }
  this.s && this.s.Oa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.s, a.$b = j, a.b())
};
p.Xd = function(a, b) {
  u(b) || (b = j);
  3 < this.w && f(Error("sendString: Can't send in state " + this.w));
  b && !/^([ -~]*)$/.test(a) && f(Error("sendString: string has illegal chars: " + O(a)));
  this.Z.append(a);
  Hf(this)
};
function Gf(a, b) {
  var c;
  a.p instanceof xf ? c = rf : a.p instanceof vf ? c = If : f(Error("Don't support endpoint " + O(a.p)));
  a.Pc += 1;
  c = new Jf(a.o, a, a.Pc, c, a.p, b);
  a.a.q("Created: " + c.l());
  a.pb.add(c);
  return c
}
function Kf(a, b, c) {
  var d = new Lf(a.o, a, b, c);
  a.a.q("Created: " + d.l() + ", delay=" + b + ", times=" + c);
  a.pb.add(d);
  return d
}
function Mf(a, b) {
  a.pb.remove(b) || f(Error("transportOffline_: Transport was not removed?"));
  a.a.k("Offline: " + b.l());
  a.Kc = b.na ? a.Kc + b.na : 0;
  1 <= a.Kc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.Ha, "stream penalty reached limit", m), a.b());
  if(3 < a.w) {
    4 == a.w && b.ee ? (a.a.k("Disposing because resettingTransport_ is done."), a.b()) : a.a.k("Not creating a transport because ClientStream is in state " + a.w)
  }else {
    var c;
    var d;
    c = b instanceof Lf;
    if(!c && b.$b) {
      var e = F ? lf ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      a.a.q("getDelayForNextTransport_: " + O({delay:c, times:d}))
    }else {
      if(d = b.ad(), b == a.e ? d ? e = ++a.Ld : c || (e = a.Ld = 0) : d ? e = ++a.Vd : c || (e = a.Vd = 0), c || !e) {
        d = c = 0, a.a.q("getDelayForNextTransport_: " + O({count:e, delay:c, times:d}))
      }else {
        var g = 2E3 * Math.min(e, 3), h = Math.floor(4E3 * Math.random()) - 2E3, l = Math.max(0, b.ce - b.Qc);
        d = (c = Math.max(0, g + h - l)) ? 1 : 0;
        a.a.q("getDelayForNextTransport_: " + O({count:e, base:g, variance:h, oldDuration:l, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    b == a.e ? (a.e = k, c ? a.e = Kf(a, e, c) : (e = Bf(a), a.e = Gf(a, j), Ff(a.e, a.Z, e + 1)), a.e.ea()) : b == a.s && (a.s = k, c ? (a.s = Kf(a, e, c), a.s.ea()) : Cf(a))
  }
}
p.reset = function(a) {
  3 < this.w && f(Error("reset: Can't send reset in state " + this.w));
  Df(this);
  0 != this.Z.D.B() && this.a.z("reset: strings in send queue will never be sent: " + O(this.Z));
  this.w = 4;
  this.e && this.e.ab ? (this.a.info("reset: Sending ResetFrame over existing primary."), Nf(this.e, a), this.e.ea()) : (this.e && (this.a.k("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.s && (this.a.k("reset: Disposing secondary before sending ResetFrame."), this.s.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.kb = Gf(this, m), Nf(this.kb, a), this.kb.ea());
  this.onreset && this.onreset.call(this.Ha, a, j)
};
function Of(a, b, c, d) {
  var e;
  e = a.uc;
  for(var g = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], n = m, s = 0, H = c.length;s < H;s++) {
    var q = c[s], w = q[0], q = q[1];
    if(w == e.Da + 1) {
      e.Da += 1;
      for(l.push(q);;) {
        w = e.Da + 1;
        q = e.wa.get(w, be);
        if(q === be) {
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
        var C = Wd(q);
        if(h != k && e.G + C > h) {
          n = j;
          break
        }
        e.wa.set(w, [q, C]);
        e.G += C
      }
    }
  }
  e.wa.gb() && e.wa.clear();
  e = [l, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(g = 0;g < c.length;g++) {
      if(h = c[g], a.onstring && a.onstring.call(a.Ha, h), 4 == a.w || a.ba) {
        return
      }
    }
  }
  d || Hf(a);
  if(!(4 == a.w || a.ba) && e) {
    b.a.F(b.l() + "'s peer caused rwin overflow."), b.b()
  }
}
p.hd = function(a) {
  this.a.F("Failed to start " + O(this) + "; error was " + O(a.message));
  this.b()
};
p.start = function() {
  this.onmessage && f(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  1 != this.w && f(Error("ClientStream.start: " + O(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.w = 2;
  if(this.p instanceof wf) {
    var a = gf(this.p.Y, this), b = gf(this.p.sa, this), a = nf([a, b]);
    a.ua(y(this.ze, this));
    a.sb(y(this.hd, this))
  }else {
    if(this.p instanceof uf) {
      if(wc) {
        this.kd()
      }else {
        var a = Ne(this.o, this.p.Y), c = this;
        a.ua(function(a) {
          wc || (wc = new He(c.o, a));
          return k
        });
        a.ua(y(this.kd, this));
        a.sb(y(this.hd, this))
      }
    }else {
      Pf(this)
    }
  }
};
p.ze = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Ab, e = a[1].Ab;
  this.Yb.push(a[0]);
  this.Yb.push(a[1]);
  this.p = new xf(d, b, e, c);
  Pf(this)
};
p.kd = function() {
  this.p = new vf(this.p.host, this.p.port, wc);
  Pf(this)
};
function Pf(a) {
  a.w = 3;
  a.e = Gf(a, j);
  Ff(a.e, a.Z, k);
  a.e.ea()
}
p.d = function() {
  this.a.info(O(this) + " in disposeInternal.");
  Df(this);
  this.w = 5;
  for(var a = this.pb.J(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Yb.length;a++) {
    ib(this.Yb[a].Mc, this)
  }
  F && this.qb && (Bb(this.qb), this.qb = k);
  this.ondisconnect && this.ondisconnect.call(this.Ha);
  delete this.pb;
  delete this.e;
  delete this.s;
  delete this.kb;
  delete this.Ha;
  $.n.d.call(this)
};
var rf = 1, If = 3;
function Jf(a, b, c, d, e, g) {
  this.o = a;
  this.C = b;
  this.Ya = c;
  this.aa = d;
  this.p = e;
  this.t = [];
  this.Ka = g;
  this.ab = !this.Oa();
  this.Ua = this.aa != rf;
  this.me = y(this.df, this)
}
A(Jf, J);
p = Jf.prototype;
p.a = U("cw.net.ClientTransport");
p.j = k;
p.Qc = k;
p.ce = k;
p.Qb = k;
p.ha = m;
p.Ub = m;
p.Pa = k;
p.Cb = 0;
p.Sa = -1;
p.Nb = -1;
p.ee = m;
p.$b = m;
p.na = 0;
p.fb = m;
p.u = function(a) {
  a.push("<ClientTransport #", "" + this.Ya, ", becomePrimary=", "" + this.Ka, ">")
};
p.l = function() {
  return(this.Ka ? "Prim. T#" : "Sec. T#") + this.Ya
};
p.ad = function() {
  return!(!this.fb && this.Cb)
};
p.Oa = function() {
  return this.aa == rf || 2 == this.aa
};
function Qf(a, b) {
  mb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Of(a.C, a, b, !a.Ua)
}
function Rf(a, b, c) {
  try {
    var d = cf(b);
    a.Cb += 1;
    a.a.k(a.l() + " RECV " + O(d));
    var e;
    1 == a.Cb && !d.I(yf) && a.Oa() ? (a.a.z(a.l() + " is closing soon because got bad preamble: " + O(d)), e = j) : e = m;
    if(e) {
      return j
    }
    if(d instanceof Te) {
      if(!/^([ -~]*)$/.test(d.Nc)) {
        return a.fb = j
      }
      a.Nb += 1;
      c.push([a.Nb, d.Nc])
    }else {
      if(d instanceof Se) {
        var g = a.C, h = d.ra;
        g.Ad = h;
        var l = g.Z, n = h.Ja, c = m;
        n > l.xa && (c = j);
        for(var s = Zd(l).concat(), d = 0;d < s.length;d++) {
          var H = s[d];
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
        l.D.gb() && l.D.clear();
        if(c) {
          return a.a.z(a.l() + " is closing soon because got bad SackFrame"), a.fb = j
        }
      }else {
        if(d instanceof Ve) {
          a.Nb = d.Yd - 1
        }else {
          if(d instanceof Xe) {
            a.C.Bd = d.zd
          }else {
            if(d instanceof Ze) {
              return a.a.q(a.l() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof bf) {
              return a.fb = j, "stream_attach_failure" == d.reason ? a.na += 1 : "acked_unsent_strings" == d.reason && (a.na += 0.5), a.a.q(a.l() + " is closing soon because got " + O(d)), j
            }
            if(!(d instanceof Ue)) {
              if(d instanceof Ye) {
                var C = a.C, ig = !a.Ua;
                C.a.q("Stream is now confirmed to exist at server.");
                C.Jc = j;
                C.Fc && !ig && (C.Fc = m, Cf(C))
              }else {
                if(c.length) {
                  Qf(a, c);
                  if(!v(c)) {
                    for(var sd = c.length - 1;0 <= sd;sd--) {
                      delete c[sd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof $e) {
                  var oc = a.C;
                  oc.onreset && oc.onreset.call(oc.Ha, d.Qd, d.Vc);
                  oc.b();
                  return j
                }
                f(Error(a.l() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Je) {
    return Je instanceof X || f(Je), a.a.z(a.l() + " is closing soon because got InvalidFrame: " + O(b)), a.fb = j
  }
  return m
}
function Ee(a, b) {
  a.Ub = j;
  try {
    for(var c = m, d = [], e = 0, g = b.length;e < g;e++) {
      if(a.ba) {
        a.a.info(a.l() + " returning from loop because we're disposed.");
        return
      }
      if(c = Rf(a, b[e], d)) {
        break
      }
    }
    d.length && Qf(a, d);
    a.Ub = m;
    a.t.length && a.ea();
    c && (a.a.q(a.l() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Ub = m
  }
}
p.df = function() {
  this.a.z(this.l() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Sf(a) {
  a.Qb != k && (a.o.A.clearTimeout(a.Qb), a.Qb = k)
}
function sf(a, b) {
  Sf(a);
  b = Math.round(b);
  a.Qb = a.o.A.setTimeout(a.me, b);
  a.a.k(a.l() + "'s receive timeout set to " + b + " ms.")
}
function De(a) {
  a.aa != rf && (a.aa == If || 2 == a.aa ? sf(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.aa)))
}
function Ef(a) {
  var b = new Qe;
  b.Ya = a.Ya;
  b.Nd = 2;
  b.td = 2;
  a.C.Jc || (b.Sd = j);
  b.ob = a.C.ob;
  b.Lc = a.Ua;
  b.Lc && (b.Hd = 4096);
  b.Fd = 3E5;
  b.Dd = a.Ua ? Math.floor(10) : 0;
  b.de = m;
  a.Ka && (b.ae = k, b.zc = Math.floor((a.Ua ? 358E4 : 25E3) / 1E3));
  b.ra = ae(a.C.uc);
  b.Hb = a.C.Ad;
  a.t.push(b);
  a.Pa = b.ra
}
function Fe(a, b) {
  b && (a.na += 0.5);
  a.b()
}
p.ea = function() {
  this.ha && !this.ab && f(Error("flush_: Can't flush more than once to this transport."));
  if(this.Ub) {
    this.a.q(this.l() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ha;
    this.ha = j;
    !a && !this.t.length && Ef(this);
    for(a = 0;a < this.t.length;a++) {
      this.a.k(this.l() + " SEND " + O(this.t[a]))
    }
    if(this.Oa()) {
      for(var a = [], b = 0, c = this.t.length;b < c;b++) {
        this.t[b].R(a), a.push("\n")
      }
      this.t = [];
      a = a.join("");
      b = this.Ka ? this.p.Y : this.p.sa;
      this.j = Z.hc(this, this.Ka ? this.p.Md : this.p.Wd);
      this.Qc = this.o.A === Ib ? oa() : this.o.A.getTime();
      this.j.yc(b, "POST", a);
      sf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.Ua ? 0 : this.Ka ? 25E3 : 0))
    }else {
      if(this.aa == If) {
        a = [];
        b = 0;
        for(c = this.t.length;b < c;b++) {
          a.push(this.t[b].H())
        }
        this.t = [];
        this.j ? this.j.rb(a) : (b = this.p, this.j = new Ie(this), this.j.Tb = b.ff.hc(this.j), this.Qc = this.o.A === Ib ? oa() : this.o.A.getTime(), this.j.dc(b.host, b.port), this.j.ba || (this.j.rb(a), this.j.ba || sf(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.aa))
      }
    }
  }
};
function Ff(a, b, c) {
  !a.ha && !a.t.length && Ef(a);
  for(var d = Math.max(c, a.Sa + 1), e = Zd(b), c = [], g = 0;g < e.length;g++) {
    var h = e[g];
    (d == k || h >= d) && c.push([h, b.D.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    g = c[b], e = g[0], g = g[1], (-1 == a.Sa || a.Sa + 1 != e) && a.t.push(new Ve(e)), a.t.push(new Te(g)), a.Sa = e
  }
}
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Jf.n.d.call(this);
  this.ce = this.o.A === Ib ? oa() : this.o.A.getTime();
  this.t = [];
  Sf(this);
  this.j && this.j.b();
  var a = this.C;
  this.C = k;
  Mf(a, this)
};
function Nf(a, b) {
  !a.ha && !a.t.length && Ef(a);
  a.t.push(new $e(b, j));
  a.ee = j
}
function Lf(a, b, c, d) {
  this.o = a;
  this.C = b;
  this.gd = c;
  this.cd = d
}
A(Lf, J);
p = Lf.prototype;
p.ha = m;
p.ab = m;
p.Db = k;
p.Pa = k;
p.a = U("cw.net.DoNothingTransport");
function Tf(a) {
  a.Db = a.o.A.setTimeout(function() {
    a.Db = k;
    a.cd--;
    a.cd ? Tf(a) : a.b()
  }, a.gd)
}
p.ea = function() {
  this.ha && !this.ab && f(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ha = j;
  Tf(this)
};
p.u = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.gd, ">")
};
p.Oa = ba(m);
p.l = ba("Wast. T");
p.ad = ba(m);
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Lf.n.d.call(this);
  this.Db != k && this.o.A.clearTimeout(this.Db);
  var a = this.C;
  this.C = k;
  Mf(a, this)
};
function Uf() {
}
Uf.prototype.ub = k;
var Vf;
function Wf() {
}
A(Wf, Uf);
function Xf(a) {
  return(a = Yf(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Zf(a) {
  var b = {};
  Yf(a) && (b[0] = j, b[1] = j);
  return b
}
Wf.prototype.sc = k;
function Yf(a) {
  if(!a.sc && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.sc = d
      }catch(e) {
      }
    }
    f(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.sc
}
Vf = new Wf;
function $f(a) {
  this.headers = new P;
  this.Za = a || k
}
A($f, Hb);
$f.prototype.a = U("goog.net.XhrIo");
var ag = /^https?$/i;
p = $f.prototype;
p.ia = m;
p.f = k;
p.Zb = k;
p.wc = "";
p.yd = "";
p.hb = "";
p.jc = m;
p.Fb = m;
p.tc = m;
p.Ba = m;
p.Wb = 0;
p.Ga = k;
p.Ud = "";
p.kf = m;
p.send = function(a, b, c, d) {
  this.f && f(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.wc = a;
  this.hb = "";
  this.yd = b;
  this.jc = m;
  this.ia = j;
  this.f = this.Za ? Xf(this.Za) : Xf(Vf);
  this.Zb = this.Za ? this.Za.ub || (this.Za.ub = Zf(this.Za)) : Vf.ub || (Vf.ub = Zf(Vf));
  this.f.onreadystatechange = y(this.Kd, this);
  try {
    this.a.k(bg(this, "Opening Xhr")), this.tc = j, this.f.open(b, a, j), this.tc = m
  }catch(e) {
    this.a.k(bg(this, "Error opening Xhr: " + e.message));
    cg(this, e);
    return
  }
  var a = c || "", g = this.headers.O();
  d && kc(d, function(a, b) {
    g.set(b, a)
  });
  "POST" == b && !g.P("Content-Type") && g.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  kc(g, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.Ud && (this.f.responseType = this.Ud);
  "withCredentials" in this.f && (this.f.withCredentials = this.kf);
  try {
    this.Ga && (Ib.clearTimeout(this.Ga), this.Ga = k), 0 < this.Wb && (this.a.k(bg(this, "Will abort after " + this.Wb + "ms if incomplete")), this.Ga = Ib.setTimeout(y(this.ef, this), this.Wb)), this.a.k(bg(this, "Sending request")), this.Fb = j, this.f.send(a), this.Fb = m
  }catch(h) {
    this.a.k(bg(this, "Send error: " + h.message)), cg(this, h)
  }
};
p.ef = function() {
  "undefined" != typeof ca && this.f && (this.hb = "Timed out after " + this.Wb + "ms, aborting", this.a.k(bg(this, this.hb)), this.dispatchEvent("timeout"), this.abort(8))
};
function cg(a, b) {
  a.ia = m;
  a.f && (a.Ba = j, a.f.abort(), a.Ba = m);
  a.hb = b;
  dg(a);
  eg(a)
}
function dg(a) {
  a.jc || (a.jc = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function() {
  this.f && this.ia && (this.a.k(bg(this, "Aborting")), this.ia = m, this.Ba = j, this.f.abort(), this.Ba = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), eg(this))
};
p.d = function() {
  this.f && (this.ia && (this.ia = m, this.Ba = j, this.f.abort(), this.Ba = m), eg(this, j));
  $f.n.d.call(this)
};
p.Kd = function() {
  !this.tc && !this.Fb && !this.Ba ? this.Te() : fg(this)
};
p.Te = function() {
  fg(this)
};
function fg(a) {
  if(a.ia && "undefined" != typeof ca) {
    if(a.Zb[1] && 4 == a.la() && 2 == gg(a)) {
      a.a.k(bg(a, "Local request error detected and ignored"))
    }else {
      if(a.Fb && 4 == a.la()) {
        Ib.setTimeout(y(a.Kd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.la()) {
          a.a.k(bg(a, "Request complete"));
          a.ia = m;
          var b = gg(a), c;
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
              b = ("" + a.wc).match(zd)[1] || k, !b && self.location && (b = self.location.protocol, b = b.substr(0, b.length - 1)), b = !ag.test(b ? b.toLowerCase() : "")
            }
            c = b
          }
          if(c) {
            a.dispatchEvent("complete"), a.dispatchEvent("success")
          }else {
            var d;
            try {
              d = 2 < a.la() ? a.f.statusText : ""
            }catch(e) {
              a.a.k("Can not get status: " + e.message), d = ""
            }
            a.hb = d + " [" + gg(a) + "]";
            dg(a)
          }
          eg(a)
        }
      }
    }
  }
}
function eg(a, b) {
  if(a.f) {
    var c = a.f, d = a.Zb[0] ? ea : k;
    a.f = k;
    a.Zb = k;
    a.Ga && (Ib.clearTimeout(a.Ga), a.Ga = k);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(e) {
      a.a.F("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
}
p.la = function() {
  return this.f ? this.f.readyState : 0
};
function gg(a) {
  try {
    return 2 < a.la() ? a.f.status : -1
  }catch(b) {
    return a.a.z("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.la() ? this.f.getResponseHeader(a) : i
};
function bg(a, b) {
  return b + " [" + a.yd + " " + a.wc + " " + gg(a) + "]"
}
;var hg = !(E || F && !G("420+"));
function jg(a, b) {
  this.Xb = a;
  this.S = b
}
A(jg, J);
p = jg.prototype;
p.j = k;
p.qa = -1;
p.qd = m;
p.sd = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function kg(a) {
  var b = pf(a.ed), c = b[0], b = b[1], d = r.parent;
  d ? (d.__XHRMaster_onframes(a.S, c, b), 1 != b && a.b()) : a.b()
}
p.Ke = function() {
  kg(this);
  if(!this.ba) {
    var a = r.parent;
    a && a.__XHRMaster_oncomplete(this.S);
    this.b()
  }
};
p.Ve = function() {
  var a = r.parent;
  if(a) {
    this.qa = this.j.la();
    if(2 <= this.qa && !this.qd) {
      for(var b = new P, c = this.sd.length;c--;) {
        var d = this.sd[c];
        try {
          b.set(d, this.j.f.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.B() && (this.qd = j, a.__XHRMaster_ongotheaders(this.S, qc(b)), this.ba)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.S, this.qa);
    hg && 3 == this.qa && kg(this)
  }else {
    this.b()
  }
};
p.yc = function(a, b, c) {
  this.j = new $f;
  wb(this.j, "readystatechange", y(this.Ve, this));
  wb(this.j, "complete", y(this.Ke, this));
  this.j.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.ed = new of(this.j.f, 1048576)
};
p.d = function() {
  jg.n.d.call(this);
  delete this.ed;
  this.j && this.j.b();
  delete this.Xb.nb[this.S];
  delete this.Xb
};
function lg() {
  this.nb = {}
}
A(lg, J);
lg.prototype.Pe = function(a, b, c, d) {
  var e = new jg(this, a);
  this.nb[a] = e;
  e.yc(b, c, d)
};
lg.prototype.we = function(a) {
  (a = this.nb[a]) && a.b()
};
lg.prototype.d = function() {
  lg.n.d.call(this);
  for(var a = Za(this.nb);a.length;) {
    a.pop().b()
  }
  delete this.nb
};
var mg = new lg;
r.__XHRSlave_makeRequest = y(mg.Pe, mg);
r.__XHRSlave_dispose = y(mg.we, mg);
var ng = U("cw.net.demo");
function og(a, b, c, d) {
  a = new Bd(document.location);
  if(c) {
    return new uf(d, a.Q, r.__demo_mainSocketPort)
  }
  b ? (b = r.__demo_shared_domain, x(b) || f(Error("domain was " + O(b) + "; expected a string.")), c = a.O(), Ed(c, "_____random_____." + b)) : c = a.O();
  Gd(c, d);
  Hd(c, "", i);
  return new wf(c.toString().replace("_____random_____", "%random%"))
}
;z("Minerva.HttpEndpoint", wf);
z("Minerva.SocketEndpoint", uf);
z("Minerva.QANHelper", R);
R.prototype.handleQANFrame = R.prototype.He;
R.prototype.ask = R.prototype.je;
R.prototype.notify = R.prototype.Se;
R.prototype.failAll = R.prototype.Ae;
z("Minerva.QANProtocolWrapper", zf);
zf.prototype.stream = zf.prototype.Vb;
zf.prototype.qanHelper = zf.prototype.pg;
z("Minerva.Deferred", M);
M.prototype.cancel = M.prototype.cancel;
M.prototype.callback = M.prototype.N;
M.prototype.errback = M.prototype.U;
M.prototype.addErrback = M.prototype.sb;
M.prototype.addCallback = M.prototype.ua;
M.prototype.addCallbacks = M.prototype.ja;
M.prototype.chainDeferred = M.prototype.$c;
M.prototype.awaitDeferred = M.prototype.ke;
M.prototype.branch = M.prototype.Yc;
M.prototype.addBoth = M.prototype.Uc;
M.prototype.hasFired = M.prototype.Je;
z("Minerva.Deferred.succeed", Pb);
z("Minerva.Deferred.fail", Qb);
z("Minerva.Deferred.cancelled", function() {
  var a = new M;
  a.cancel();
  return a
});
z("Minerva.Deferred.AlreadyCalledError", Nb);
z("Minerva.Deferred.CancelledError", Jb);
z("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Ge;
$.prototype.bindToProtocol = $.prototype.le;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.Xd;
$.prototype.reset = $.prototype.reset;
z("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.Gc;
S.prototype.shout = S.prototype.Ze;
S.prototype.severe = S.prototype.F;
S.prototype.warning = S.prototype.z;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.re;
S.prototype.fine = S.prototype.k;
S.prototype.finer = S.prototype.Be;
S.prototype.finest = S.prototype.q;
T.OFF = md;
T.SHOUT = nd;
T.SEVERE = od;
T.WARNING = pd;
T.INFO = qd;
T.CONFIG = rd;
T.FINE = td;
T.FINER = ud;
T.FINEST = vd;
T.ALL = wd;
z("Minerva.LogManager", V);
V.getRoot = V.pc;
z("Minerva.DivConsole", yd);
yd.prototype.setCapturing = yd.prototype.Ye;
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
z("Minerva.JSON.serialize", Vb);
z("Minerva.bind", y);
z("Minerva.repr", O);
z("Minerva.theCallQueue", Tb);
z("Minerva.getEndpoint", og);
z("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new Bd(document.location)).L;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !r.__demo_shared_domain) {
    ng.z("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return og(0, a, b, "/_minerva/")
});
})();
