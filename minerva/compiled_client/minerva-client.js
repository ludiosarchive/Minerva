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
  this.kb = a;
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
  return this.Bd ? this.kb.call(this.rc || this.src, a) : this.kb.handleEvent.call(this.kb, a)
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
;var ob = {yf:"click", Df:"dblclick", Xf:"mousedown", ag:"mouseup", $f:"mouseover", Zf:"mouseout", Yf:"mousemove", kg:"selectstart", Sf:"keypress", Rf:"keydown", Tf:"keyup", wf:"blur", Lf:"focus", Ef:"deactivate", Mf:E ? "focusin" : "DOMFocusIn", Nf:E ? "focusout" : "DOMFocusOut", xf:"change", jg:"select", lg:"submit", Qf:"input", fg:"propertychange", If:"dragstart", Ff:"dragenter", Hf:"dragover", Gf:"dragleave", Jf:"drop", pg:"touchstart", og:"touchmove", ng:"touchend", mg:"touchcancel", Af:"contextmenu", 
Kf:"error", Pf:"help", Uf:"load", Vf:"losecapture", gg:"readystatechange", hg:"resize", ig:"scroll", rg:"unload", Of:"hashchange", bg:"pagehide", cg:"pageshow", eg:"popstate", Bf:"copy", dg:"paste", Cf:"cut", tf:"beforecopy", uf:"beforecut", vf:"beforepaste", Wf:"message", zf:"connect", qg:F ? "webkitTransitionEnd" : Ka ? "oTransitionEnd" : "transitionend"};
function J() {
}
J.prototype.ba = m;
J.prototype.b = function() {
  this.ba || (this.ba = j, this.d())
};
J.prototype.d = function() {
  this.ye && pb.apply(k, this.ye)
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
K.prototype.Vb = j;
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
  a && this.Kb(a, b)
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
p.fb = k;
p.Kb = function(a, b) {
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
  this.fb = a;
  delete this.Vb;
  delete this.Ea
};
p.stopPropagation = function() {
  sb.n.stopPropagation.call(this);
  this.fb.stopPropagation ? this.fb.stopPropagation() : this.fb.cancelBubble = j
};
p.d = function() {
  sb.n.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.fb = k
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
        if(h = n[g], h.kb == c && h.rc == e) {
          if(h.Ua) {
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
    h.Kb(c, g, a, b, d, e);
    c = h.key;
    g.key = c;
    n.push(h);
    tb[c] = h;
    ub[l] || (ub[l] = []);
    ub[l].push(h);
    a.addEventListener ? (a == r || !a.fd) && a.addEventListener(b, g, d) : a.attachEvent(b in vb ? vb[b] : vb[b] = "on" + b, g);
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
  tb[a].dc = j;
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
        if(a[g].kb == c && a[g].capture == d && a[g].rc == e) {
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
  if(b.Ua) {
    return m
  }
  var c = b.src, d = b.type, e = b.Sd, g = b.capture;
  c.removeEventListener ? (c == r || !c.fd) && c.removeEventListener(d, e, g) : c.detachEvent && c.detachEvent(d in vb ? vb[d] : vb[d] = "on" + d, e);
  c = ja(c);
  e = L[d][g][c];
  if(ub[c]) {
    var h = ub[c];
    ib(h, b);
    0 == h.length && delete ub[c]
  }
  b.Ua = j;
  e.Md = j;
  Cb(d, g, c, e);
  delete tb[a];
  return j
}
function Cb(a, b, c, d) {
  if(!d.Mb && d.Md) {
    for(var e = 0, g = 0;e < d.length;e++) {
      d[e].Ua ? d[e].Sd.src = k : (e != g && (d[g] = d[e]), g++)
    }
    d.length = g;
    d.Md = m;
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
    a.Mb ? a.Mb++ : a.Mb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Ua && (g &= Fb(n, e) !== m)
      }
    }finally {
      a.Mb--, Cb(c, d, b, a)
    }
  }
  return Boolean(g)
}
function Fb(a, b) {
  var c = a.handleEvent(b);
  a.dc && Bb(a.key);
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
    u = new sb;
    u.Kb(g, this);
    g = j;
    try {
      if(l) {
        for(var q = [], w = u.currentTarget;w;w = w.parentNode) {
          q.push(w)
        }
        h = e[j];
        h.M = h.c;
        for(var C = q.length - 1;!u.Ea && 0 <= C && h.M;C--) {
          u.currentTarget = q[C], g &= Eb(h, q[C], d, j, u)
        }
        if(n) {
          h = e[m];
          h.M = h.c;
          for(C = 0;!u.Ea && C < q.length && h.M;C++) {
            u.currentTarget = q[C], g &= Eb(h, q[C], d, m, u)
          }
        }
      }else {
        g = Fb(c, u)
      }
    }finally {
      q && (q.length = 0), u.b()
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
p.fd = j;
p.Pb = k;
p.Jc = aa("Pb");
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
      for(g = this;g;g = g.Pb) {
        e.push(g)
      }
      g = c[j];
      g.M = g.c;
      for(var h = e.length - 1;!a.Ea && 0 <= h && g.M;h--) {
        a.currentTarget = e[h], d &= Eb(g, e[h], a.type, j, a) && a.Vb != m
      }
    }
    if(m in c) {
      if(g = c[m], g.M = g.c, b) {
        for(h = 0;!a.Ea && h < e.length && g.M;h++) {
          a.currentTarget = e[h], d &= Eb(g, e[h], a.type, m, a) && a.Vb != m
        }
      }else {
        for(e = this;!a.Ea && e && g.M;e = e.Pb) {
          a.currentTarget = e, d &= Eb(g, e, a.type, m, a) && a.Vb != m
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
  this.Pb = k
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
  this.yb = [];
  this.ad = a;
  this.hd = b || k
}
p = M.prototype;
p.da = m;
p.gb = m;
p.mb = 0;
p.Kc = m;
p.te = m;
p.wb = 0;
p.cancel = function(a) {
  if(this.da) {
    this.ob instanceof M && this.ob.cancel()
  }else {
    if(this.r) {
      var b = this.r;
      delete this.r;
      a ? b.cancel(a) : (b.wb--, 0 >= b.wb && b.cancel())
    }
    this.ad ? this.ad.call(this.hd, this) : this.Kc = j;
    this.da || this.U(new Jb)
  }
};
p.dd = function(a, b) {
  Kb(this, a, b);
  this.mb--;
  0 == this.mb && this.da && Lb(this)
};
function Kb(a, b, c) {
  a.da = j;
  a.ob = c;
  a.gb = !b;
  Lb(a)
}
function Mb(a) {
  a.da && (a.Kc || f(new Nb), a.Kc = m)
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
  return this.ka(a, k, b)
};
p.vb = function(a, b) {
  return this.ka(k, a, b)
};
p.ka = function(a, b, c) {
  this.yb.push([a, b, c]);
  this.da && Lb(this);
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
function Ob(a) {
  return gb(a.yb, function(a) {
    return ia(a[1])
  })
}
function Lb(a) {
  a.Tc && a.da && Ob(a) && (r.clearTimeout(a.Tc), delete a.Tc);
  a.r && (a.r.wb--, delete a.r);
  for(var b = a.ob, c = m, d = m;a.yb.length && 0 == a.mb;) {
    var e = a.yb.shift(), g = e[0], h = e[1], e = e[2];
    if(g = a.gb ? h : g) {
      try {
        var l = g.call(e || a.hd, b);
        t(l) && (a.gb = a.gb && (l == b || l instanceof Error), a.ob = b = l);
        b instanceof M && (d = j, a.mb++)
      }catch(n) {
        b = n, a.gb = j, Ob(a) || (c = j)
      }
    }
  }
  a.ob = b;
  d && a.mb && (b.ka(y(a.dd, a, j), y(a.dd, a, m)), b.te = j);
  c && (a.Tc = r.setTimeout(function() {
    t(b.message) && b.stack && (b.message = b.message + ("\n" + b.stack));
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
  this.Cb = [];
  this.ld = [];
  this.se = y(this.nf, this)
}
Rb.prototype.Qc = k;
function Sb(a, b, c, d) {
  a.Cb.push([b, c, d]);
  a.Qc == k && (a.Qc = a.A.setTimeout(a.se, 0))
}
Rb.prototype.nf = function() {
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
  this.Ub = a
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
          c.push(e), e = b[g], Wb(a, a.Ub ? a.Ub.call(b, "" + g, e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(g in b) {
        Object.prototype.hasOwnProperty.call(b, g) && (e = b[g], "function" != typeof e && (c.push(d), Yb(g, c), c.push(":"), Wb(a, a.Ub ? a.Ub.call(b, g, e) : e, c), d = ","))
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
    d = s(a);
    if("boolean" == d || "number" == d || "null" == d || "undefined" == d) {
      b.push("" + a)
    }else {
      if("string" == d) {
        Yb(a, b)
      }else {
        if(Ub(a.u)) {
          a.u(b, c)
        }else {
          if(Ub(a.ke)) {
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
    a && this.cc(a)
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
p.gc = function(a) {
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
  var c = b || oc;
  mc(this);
  for(var d, e = 0;d = this.h[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function oc(a, b) {
  return a === b
}
p.ib = function() {
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
function pc(a) {
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
;var sc = {ke:ba("<cw.eq.Wildcard>")};
function tc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function uc(a, b, c) {
  var d = s(a), e = s(b);
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
          if(a.je == Ca && b.je == Ca) {
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
  this.Ye = a;
  this.Sb = b
}
Q.prototype.I = function(a, b) {
  return ha(a) && this.constructor == a.constructor && uc(this.Sb, a.Sb, b)
};
Q.prototype.u = function(a, b) {
  a.push("new ", this.Ye, "(");
  for(var c = "", d = 0;d < this.Sb.length;d++) {
    a.push(c), c = ", ", N(this.Sb[d], a, b)
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
  this.message = a
}
A(Fc, B);
function Gc(a) {
  a = fc(a);
  a === k && f(new Fc("bad qid"));
  return a
}
function Hc(a) {
  a || f(new Fc("0-length frame"));
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
  t(c) || f(new Fc("Expected pipe char in frame"));
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
  f(new Fc("Invalid QAN frame type " + O(b)))
}
function Ic(a) {
  B.call(this);
  this.body = a
}
A(Ic, B);
Ic.prototype.message = "KnownError with arbitrary body";
Ic.prototype.u = function(a, b) {
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
Jc.prototype.u = function(a, b) {
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
  this.Zc = a;
  this.lb = b;
  this.ha = c;
  this.Eb = d;
  this.Rb = 0;
  this.na = new P;
  this.Za = new P
}
p = R.prototype;
p.u = function(a) {
  a.push("<QANHelper asked ", "" + this.Rb, " questions, waiting for ", "" + this.na.B(), " peer answers and ", "" + this.Za.B(), " local answers>")
};
p.vd = function(a) {
  if(a instanceof yc || a instanceof zc || a instanceof Ac) {
    var b = a.ga, c = this.na.get(b);
    this.na.remove(b);
    t(c) ? c !== k && (a instanceof yc ? c.N(a.body) : a instanceof zc ? c.U(new Ic(a.body)) : a instanceof Ac ? c.U(new Jc(a.body)) : f(Error("handleQANFrame bug"))) : this.Eb("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof Cc) {
      try {
        this.Zc(a.body, m)
      }catch(d) {
        this.lb("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof xc) {
        if(b = a.ga, this.Za.P(b)) {
          this.Eb("Received Question with duplicate qid: " + b)
        }else {
          c = rc(this.Zc, [a.body, j]);
          this.Za.set(b, c);
          var e = this;
          c.ka(function(a) {
            var c = b;
            e.Za.remove(c);
            e.ha(new yc(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Za.remove(c);
            a instanceof Ic ? e.ha(new zc(a.body, c)) : a instanceof Jb ? e.ha(new Ac("CancelledError", c)) : (e.lb("Peer's Question #" + c + " caused uncaught exception", a), e.ha(new Ac("Uncaught exception", c)));
            return k
          });
          c.vb(function(a) {
            this.lb("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof Bc && (b = a.ga, c = this.Za.get(b), t(c) && c.cancel())
      }
    }
  }
};
p.ne = function(a) {
  var b = this.Rb += 1;
  this.ha(new xc(a, b));
  var c = this, a = new M(function() {
    c.na.set(b, k);
    c.ha(new Bc(b))
  });
  this.na.set(b, a);
  return a
};
p.Ue = function(a) {
  this.ha(new Cc(a))
};
p.nd = function(a) {
  for(var b = this.na.V(), c = 0;c < b.length;c++) {
    var d = this.na.get(b[c]);
    t(d) && (this.na.set(b[c], k), d.U(new Kc(a)))
  }
};
function Lc() {
  this.Vd = oa()
}
var Mc = new Lc;
Lc.prototype.set = aa("Vd");
Lc.prototype.reset = function() {
  this.set(oa())
};
Lc.prototype.get = o("Vd");
function Nc(a) {
  this.We = a || "";
  this.df = Mc
}
Nc.prototype.ce = j;
Nc.prototype.cf = j;
Nc.prototype.bf = j;
Nc.prototype.de = m;
function Oc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Pc(a, b) {
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
function Qc(a) {
  Nc.call(this, a)
}
A(Qc, Nc);
Qc.prototype.de = j;
var Rc;
function Sc(a, b) {
  var c;
  c = a.className;
  c = x(c) && c.match(/\S+/g) || [];
  for(var d = lb(arguments, 1), e = c.length + d.length, g = c, h = 0;h < d.length;h++) {
    0 <= db(g, d[h]) || g.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == e
}
;var Tc = !E || Va();
!La && !E || E && Va() || La && G("1.9.1");
E && G("9");
function Uc(a) {
  return a ? new Vc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Rc || (Rc = new Vc)
}
function Wc(a) {
  return x(a) ? document.getElementById(a) : a
}
function Xc(a, b) {
  Ya(b, function(b, d) {
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
  d && (x(d) ? c.className = d : v(d) ? Sc.apply(k, [c].concat(d)) : Xc(c, d));
  2 < b.length && ad(a, c, b, 2);
  return c
}
function ad(a, b, c, d) {
  function e(c) {
    c && b.appendChild(x(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var g = c[d];
    fa(g) && !(ha(g) && 0 < g.nodeType) ? eb(bd(g) ? kb(g) : g, e) : e(g)
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
  return m
}
function Vc(a) {
  this.ya = a || r.document || document
}
p = Vc.prototype;
p.qd = Uc;
p.Aa = function(a) {
  return x(a) ? this.ya.getElementById(a) : a
};
function dd(a, b) {
  var c;
  c = a.ya;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && (!F || "CSS1Compat" == document.compatMode || G("528")) && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.eb = function(a, b, c) {
  return $c(this.ya, arguments)
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
  this.m = new P;
  a && this.cc(a)
}
function hd(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ja(a) : b.substr(0, 1) + a
}
p = gd.prototype;
p.B = function() {
  return this.m.B()
};
p.add = function(a) {
  this.m.set(hd(a), a)
};
p.cc = function(a) {
  for(var a = ic(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Gc = function(a) {
  for(var a = ic(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.m.remove(hd(a))
};
p.clear = function() {
  this.m.clear()
};
p.ib = function() {
  return this.m.ib()
};
p.contains = function(a) {
  return this.m.P(hd(a))
};
p.J = function() {
  return this.m.J()
};
p.O = function() {
  return new gd(this)
};
p.I = function(a) {
  return this.B() == hc(a) && id(this, a)
};
function id(a, b) {
  var c = hc(b);
  if(a.B() > c) {
    return m
  }
  !(b instanceof gd) && 5 < c && (b = new gd(b));
  return lc(a, function(a) {
    if("function" == typeof b.contains) {
      a = b.contains(a)
    }else {
      if("function" == typeof b.gc) {
        a = b.gc(a)
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
;function jd(a) {
  return kd(a || arguments.callee.caller, [])
}
function kd(a, b) {
  var c = [];
  if(0 <= db(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(ld(a) + "(");
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
            g = (g = ld(g)) ? g : "[fn]";
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
        c.push(kd(a.caller, b))
      }catch(h) {
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
nd.prototype.oc = k;
nd.prototype.nc = k;
var od = 0;
nd.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || od++;
  this.fe = d || oa();
  this.Qa = a;
  this.Kd = b;
  this.Qe = c;
  delete this.oc;
  delete this.nc
};
nd.prototype.Ic = aa("Qa");
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
var pd = new T("OFF", Infinity), qd = new T("SHOUT", 1200), rd = new T("SEVERE", 1E3), sd = new T("WARNING", 900), ud = new T("INFO", 800), vd = new T("CONFIG", 700), wd = new T("FINE", 500), xd = new T("FINER", 400), yd = new T("FINEST", 300), zd = new T("ALL", 0);
function U(a) {
  return V.sd(a)
}
p = S.prototype;
p.getParent = o("r");
p.Ic = aa("Qa");
function Ad(a) {
  if(a.Qa) {
    return a.Qa
  }
  if(a.r) {
    return Ad(a.r)
  }
  Ba("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= Ad(this).value) {
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
  var d = new nd(a, "" + b, this.Se);
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
      e = "Message: " + D(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + D(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + D(jd(g) + "-> ")
    }catch(C) {
      e = "Exception trying to expose exception! You win, we lose. " + C
    }
    d.nc = e
  }
  return d
};
p.af = function(a, b) {
  this.log(qd, a, b)
};
p.F = function(a, b) {
  this.log(rd, a, b)
};
p.z = function(a, b) {
  this.log(sd, a, b)
};
p.info = function(a, b) {
  this.log(ud, a, b)
};
p.ve = function(a, b) {
  this.log(vd, a, b)
};
p.k = function(a, b) {
  this.log(wd, a, b)
};
p.Ee = function(a, b) {
  this.log(xd, a, b)
};
p.q = function(a, b) {
  this.log(yd, a, b)
};
var V = {Nb:{}, pb:k, yd:function() {
  V.pb || (V.pb = new S(""), V.Nb[""] = V.pb, V.pb.Ic(vd))
}, tg:function() {
  return V.Nb
}, qc:function() {
  V.yd();
  return V.pb
}, sd:function(a) {
  V.yd();
  return V.Nb[a] || V.xe(a)
}, sg:function(a) {
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
function Bd(a) {
  this.Td = y(this.le, this);
  this.pd = new Qc;
  this.Ad = this.pd.ce = m;
  this.i = a;
  this.Ce = this.i.ownerDocument || this.i.document;
  var a = Uc(this.i), b = k;
  if(E) {
    b = a.ya.createStyleSheet(), fd(b)
  }else {
    var c = dd(a, "head")[0];
    c || (b = dd(a, "body")[0], c = a.eb("head"), b.parentNode.insertBefore(c, b));
    b = a.eb("style");
    fd(b);
    a.appendChild(c, b)
  }
  this.i.className += " logdiv"
}
Bd.prototype.$e = function(a) {
  if(a != this.Ad) {
    var b = V.qc();
    if(a) {
      var c = this.Td;
      b.Ma || (b.Ma = []);
      b.Ma.push(c)
    }else {
      (b = b.Ma) && ib(b, this.Td)
    }
    this.Ad = a
  }
};
Bd.prototype.le = function(a) {
  var b = 100 >= this.i.scrollHeight - this.i.scrollTop - this.i.clientHeight, c = this.Ce.createElement("div");
  c.className = "logmsg";
  var d = this.pd, e;
  switch(a.Qa.value) {
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
  var g = [];
  g.push(d.We, " ");
  if(d.ce) {
    var h = new Date(a.fe);
    g.push("[", Oc(h.getFullYear() - 2E3) + Oc(h.getMonth() + 1) + Oc(h.getDate()) + " " + Oc(h.getHours()) + ":" + Oc(h.getMinutes()) + ":" + Oc(h.getSeconds()) + "." + Oc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.cf && g.push("[", ya(Pc(a, d.df.get())), "s] ");
  d.bf && g.push("[", D(a.Qe), "] ");
  g.push('<span class="', e, '">', sa(ya(D(a.Kd))));
  d.de && a.oc && g.push("<br>", sa(ya(a.nc || "")));
  g.push("</span><br>");
  c.innerHTML = g.join("");
  this.i.appendChild(c);
  b && (this.i.scrollTop = this.i.scrollHeight)
};
Bd.prototype.clear = function() {
  this.i.innerHTML = ""
};
var Cd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function Dd(a, b) {
  var c = a.match(Cd), d = b.match(Cd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function Ed(a, b) {
  var c;
  a instanceof Ed ? (this.Xa(b == k ? a.X : b), Fd(this, a.$), Gd(this, a.Ia), Hd(this, a.Q), Id(this, a.pa), Jd(this, a.K), Kd(this, a.L.O()), Ld(this, a.za)) : a && (c = ("" + a).match(Cd)) ? (this.Xa(!!b), Fd(this, c[1] || "", j), Gd(this, c[2] || "", j), Hd(this, c[3] || "", j), Id(this, c[4]), Jd(this, c[5] || "", j), Kd(this, c[6] || "", j), Ld(this, c[7] || "", j)) : (this.Xa(!!b), this.L = new Md(k, this, this.X))
}
p = Ed.prototype;
p.$ = "";
p.Ia = "";
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
  this.$ && a.push(Nd(this.$, Od), ":");
  this.Q && (a.push("//"), this.Ia && a.push(Nd(this.Ia, Od), "@"), a.push(x(this.Q) ? encodeURIComponent(this.Q) : k), this.pa != k && a.push(":", "" + this.pa));
  this.K && (this.Q && "/" != this.K.charAt(0) && a.push("/"), a.push(Nd(this.K, "/" == this.K.charAt(0) ? Pd : Qd)));
  var b = "" + this.L;
  b && a.push("?", b);
  this.za && a.push("#", Nd(this.za, Rd));
  return this.T = a.join("")
};
p.O = function() {
  var a = this.$, b = this.Ia, c = this.Q, d = this.pa, e = this.K, g = this.L.O(), h = this.za, l = new Ed(k, this.X);
  a && Fd(l, a);
  b && Gd(l, b);
  c && Hd(l, c);
  d && Id(l, d);
  e && Jd(l, e);
  g && Kd(l, g);
  h && Ld(l, h);
  return l
};
function Fd(a, b, c) {
  Sd(a);
  delete a.T;
  a.$ = c ? b ? decodeURIComponent(b) : "" : b;
  a.$ && (a.$ = a.$.replace(/:$/, ""))
}
function Gd(a, b, c) {
  Sd(a);
  delete a.T;
  a.Ia = c ? b ? decodeURIComponent(b) : "" : b
}
function Hd(a, b, c) {
  Sd(a);
  delete a.T;
  a.Q = c ? b ? decodeURIComponent(b) : "" : b
}
function Id(a, b) {
  Sd(a);
  delete a.T;
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.pa = b) : a.pa = k
}
function Jd(a, b, c) {
  Sd(a);
  delete a.T;
  a.K = c ? b ? decodeURIComponent(b) : "" : b
}
function Kd(a, b, c) {
  Sd(a);
  delete a.T;
  b instanceof Md ? (a.L = b, a.L.Uc = a, a.L.Xa(a.X)) : (c || (b = Nd(b, Td)), a.L = new Md(b, a, a.X))
}
function Ld(a, b, c) {
  Sd(a);
  delete a.T;
  a.za = c ? b ? decodeURIComponent(b) : "" : b
}
function Sd(a) {
  a.Oe && f(Error("Tried to modify a read-only Uri"))
}
p.Xa = function(a) {
  this.X = a;
  this.L && this.L.Xa(a);
  return this
};
function Ud(a) {
  return a instanceof Ed ? a.O() : new Ed(a, i)
}
var Vd = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function Nd(a, b) {
  var c = k;
  x(a) && (c = a, Vd.test(c) || (c = encodeURI(a)), 0 <= c.search(b) && (c = c.replace(b, Wd)));
  return c
}
function Wd(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Od = /[#\/\?@]/g, Qd = /[\#\?:]/g, Pd = /[\#\?]/g, Td = /[\#\?@]/g, Rd = /#/g;
function Md(a, b, c) {
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
      e = Xd(a, e);
      a.add(e, g ? decodeURIComponent(g.replace(/\+/g, " ")) : "")
    }
  }
}
p = Md.prototype;
p.g = k;
p.c = k;
p.B = function() {
  W(this);
  return this.c
};
p.add = function(a, b) {
  W(this);
  Yd(this);
  a = Xd(this, a);
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
  a = Xd(this, a);
  if(this.g.P(a)) {
    Yd(this);
    var b = this.g.get(a);
    v(b) ? this.c -= b.length : this.c--;
    return this.g.remove(a)
  }
  return m
};
p.clear = function() {
  Yd(this);
  this.g && this.g.clear();
  this.c = 0
};
p.ib = function() {
  W(this);
  return 0 == this.c
};
p.P = function(a) {
  W(this);
  a = Xd(this, a);
  return this.g.P(a)
};
p.gc = function(a) {
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
    a = Xd(this, a), this.P(a) && (b = jb(b, this.g.get(a)))
  }else {
    for(var a = this.g.J(), c = 0;c < a.length;c++) {
      b = jb(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  W(this);
  Yd(this);
  a = Xd(this, a);
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
  a = Xd(this, a);
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
function Yd(a) {
  delete a.La;
  delete a.ca;
  a.Uc && delete a.Uc.T
}
p.O = function() {
  var a = new Md;
  this.La && (a.La = this.La);
  this.ca && (a.ca = this.ca);
  this.g && (a.g = this.g.O());
  return a
};
function Xd(a, b) {
  var c = "" + b;
  a.X && (c = c.toLowerCase());
  return c
}
p.Xa = function(a) {
  a && !this.X && (W(this), Yd(this), kc(this.g, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.X = a
};
function Zd(a) {
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
;function $d(a, b) {
  this.Ja = a;
  this.Fa = b
}
$d.prototype.I = function(a) {
  return a instanceof $d && this.Ja == a.Ja && this.Fa.join(",") == a.Fa
};
$d.prototype.u = function(a, b) {
  a.push("new SACK(", "" + this.Ja, ", ");
  N(this.Fa, a, b);
  a.push(")")
};
function ae() {
  this.D = new P
}
ae.prototype.xa = -1;
ae.prototype.G = 0;
ae.prototype.append = function(a) {
  var b = Zd(a);
  this.D.set(this.xa + 1, [a, b]);
  this.xa += 1;
  this.G += b
};
ae.prototype.u = function(a) {
  a.push("<Queue with ", "" + this.D.B(), " item(s), counter=#", "" + this.xa, ", size=", "" + this.G, ">")
};
function be(a) {
  a = a.D.V();
  mb(a);
  return a
}
function ce() {
  this.wa = new P
}
ce.prototype.Da = -1;
ce.prototype.G = 0;
function de(a) {
  var b = a.wa.V();
  mb(b);
  return new $d(a.Da, b)
}
var ee = {};
function fe(a, b) {
  switch(s(b)) {
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
        a.push('<property id="', d, '">'), fe(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != s(b[c]) && (a.push('<property id="', D(c), '">'), fe(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function ge(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var g = e.length, h = 1;h < g;h++) {
    fe(d, e[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var he = m, ie = "";
function je(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var ke = navigator.plugins["Shockwave Flash"];
  ke && (he = j, ke.description && (ie = je(ke.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (he = j, ie = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var le = navigator.mimeTypes["application/x-shockwave-flash"];
    (he = le && le.enabledPlugin) && (ie = je(le.enabledPlugin.description))
  }else {
    try {
      var me = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), he = j, ie = je(me.GetVariable("$version"))
    }catch(ne) {
      try {
        me = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), he = j, ie = "6.0.21"
      }catch(oe) {
        try {
          me = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), he = j, ie = je(me.GetVariable("$version"))
        }catch(pe) {
        }
      }
    }
  }
}
var qe = ie;
function re(a) {
  this.Ke = a;
  this.h = []
}
A(re, J);
var se = [];
re.prototype.Gc = function() {
  eb(this.h, Bb);
  this.h.length = 0
};
re.prototype.d = function() {
  re.n.d.call(this);
  this.Gc()
};
re.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function te() {
}
te.rd = function() {
  return te.zd ? te.zd : te.zd = new te
};
te.prototype.Te = 0;
te.rd();
function ue(a) {
  this.Ab = a || Uc()
}
A(ue, Hb);
p = ue.prototype;
p.Ne = te.rd();
p.W = k;
p.Ca = m;
p.i = k;
p.r = k;
p.la = k;
p.zb = k;
p.of = m;
function ve(a) {
  return a.W || (a.W = ":" + (a.Ne.Te++).toString(36))
}
p.Aa = o("i");
p.getParent = o("r");
p.Jc = function(a) {
  this.r && this.r != a && f(Error("Method not supported"));
  ue.n.Jc.call(this, a)
};
p.qd = o("Ab");
p.eb = function() {
  this.i = this.Ab.createElement("div")
};
function we(a, b) {
  a.Ca && f(Error("Component already rendered"));
  a.i || a.eb();
  b ? b.insertBefore(a.i, k) : a.Ab.ya.body.appendChild(a.i);
  (!a.r || a.r.Ca) && a.Bb()
}
p.Bb = function() {
  this.Ca = j;
  xe(this, function(a) {
    !a.Ca && a.Aa() && a.Bb()
  })
};
function ye(a) {
  xe(a, function(a) {
    a.Ca && ye(a)
  });
  a.Ib && a.Ib.Gc();
  a.Ca = m
}
p.d = function() {
  ue.n.d.call(this);
  this.Ca && ye(this);
  this.Ib && (this.Ib.b(), delete this.Ib);
  xe(this, function(a) {
    a.b()
  });
  !this.of && this.i && cd(this.i);
  this.r = this.i = this.zb = this.la = k
};
function xe(a, b) {
  a.la && eb(a.la, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = x(a) ? a : ve(a), d;
    this.zb && c ? (d = this.zb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.zb, c in d && delete d[c], ib(this.la, a), b && (ye(a), a.i && cd(a.i)), c = a, c == k && f(Error("Unable to set parent component")), c.r = k, ue.n.Jc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function ze(a, b) {
  this.Ab = b || Uc();
  this.Ge = a;
  this.mc = new re(this);
  this.Fb = new P
}
A(ze, ue);
p = ze.prototype;
p.a = U("goog.ui.media.FlashObject");
p.qf = "window";
p.Yc = "#000000";
p.me = "sameDomain";
function Ae(a, b, c) {
  a.Vc = x(b) ? b : Math.round(b) + "px";
  a.sc = x(c) ? c : Math.round(c) + "px";
  a.Aa() && (b = a.Aa() ? a.Aa().firstChild : k, c = a.Vc, a = a.sc, a == i && f(Error("missing height argument")), b.style.width = ed(c), b.style.height = ed(a))
}
p.Bb = function() {
  ze.n.Bb.call(this);
  var a = this.Aa(), b;
  b = E ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = E ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = pa(c, this.qf), d = this.Fb.V(), e = this.Fb.J(), g = [], h = 0;h < d.length;h++) {
    var l = ra(d[h]), n = ra(e[h]);
    g.push(l + "=" + n)
  }
  b = pa(b, ve(this), ve(this), "goog-ui-media-flash-object", D(this.Ge), D(g.join("&")), this.Yc, this.me, c);
  a.innerHTML = b;
  this.Vc && this.sc && Ae(this, this.Vc, this.sc);
  a = this.mc;
  b = this.Aa();
  c = Za(ob);
  v(c) || (se[0] = c, c = se);
  for(d = 0;d < c.length;d++) {
    a.h.push(wb(b, c[d], qb || a, m, a.Ke || a))
  }
};
p.eb = function() {
  this.Xd != k && !(0 <= za(qe, this.Xd)) && (this.a.z("Required flash version not found:" + this.Xd), f(Error("Method not supported")));
  var a = this.qd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.i = a
};
p.d = function() {
  ze.n.d.call(this);
  this.Fb = k;
  this.mc.b();
  this.mc = k
};
function Be(a) {
  B.call(this, a)
}
A(Be, B);
Be.prototype.name = "cw.loadflash.FlashLoadFailed";
r.__loadFlashObject_callbacks = {};
function Ce(a, b, c) {
  function d() {
    e && delete r.__loadFlashObject_callbacks[e]
  }
  var e;
  if(La && !G("1.8.1.20")) {
    return Qb(new Be("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(0 <= za(qe, "9"))) {
    return Qb(new Be("Need Flash Player 9+; had " + (qe ? qe : "none")))
  }
  var g;
  e = "_" + bc();
  var h = new M(d);
  r.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      h.N(Wc(g))
    }, 0)
  };
  b.Fb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  g = ve(b);
  we(b, c);
  return h
}
function De(a, b, c) {
  var d = Ce(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  d.Wc(function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function Ee(a, b) {
  this.W = "_" + bc();
  this.Zb = a;
  this.qa = b;
  this.va = a.va
}
A(Ee, J);
p = Ee.prototype;
p.Ra = j;
p.ic = m;
p.a = U("cw.net.FlashSocket");
p.u = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.W);
  a.push("'>")
};
function Fe(a, b, c) {
  "frames" == b ? (a = a.qa, Ge(a.v), He(a.v, c)) : "stillreceiving" == b ? (c = a.qa, c.a.q("onstillreceiving"), Ge(c.v)) : "connect" == b ? (c = a.qa, c.a.info("onconnect"), Ge(c.v), a = c.bb, c.bb = k, a.length && (c.a.q("onconnect: Writing " + a.length + " buffered frame(s)."), c.Wb.ub(a))) : "close" == b ? (a.Ra = m, a.b()) : "ioerror" == b ? (a.Ra = m, b = a.qa, b.a.z("onioerror: " + O(c)), Ie(b.v, m), a.b()) : "securityerror" == b ? (a.Ra = m, b = a.qa, b.a.z("onsecurityerror: " + O(c)), Ie(b.v, 
  m), a.b()) : f(Error("bad event: " + b))
}
function Je(a) {
  a.ic = j;
  a.Ra = m;
  a.b()
}
p.fc = function(a, b) {
  try {
    var c = this.va.CallFunction(ge("__FC_connect", this.W, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.F("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), Je(this)
  }
  '"OK"' != c && f(Error("__FC_connect failed? ret: " + c))
};
p.ub = function(a) {
  try {
    var b = this.va.CallFunction(ge("__FC_writeFrames", this.W, a))
  }catch(c) {
    return this.a.F("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), Je(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.z("Flash no longer knows of " + this.W + "; disposing."), this.b()) : f(Error("__FC_writeFrames failed? ret: " + b)))
};
p.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Ra);
  Ee.n.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Ra) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(ge("__FC_close", this.W)))
    }catch(b) {
      this.a.F("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.ic = j
    }
  }
  if(this.ic) {
    a = this.qa, a.a.z("oncrash"), Ie(a.v, j)
  }else {
    this.qa.onclose()
  }
  delete this.qa;
  delete this.Zb.Na[this.W]
};
function Ke(a, b) {
  this.o = a;
  this.va = b;
  this.Na = {};
  this.ec = "__FST_" + bc();
  r[this.ec] = y(this.Be, this);
  var c = b.CallFunction(ge("__FC_setCallbackFunc", this.ec));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(Ke, J);
p = Ke.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.u = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Na, a, b);
  a.push(">")
};
p.jc = function(a) {
  a = new Ee(this, a);
  return this.Na[a.W] = a
};
p.ze = function(a, b, c, d) {
  var e = this.Na[a];
  e ? "frames" == b && d ? (Fe(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : Fe(e, b, c) : this.a.z("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
p.Be = function(a, b, c, d) {
  try {
    Sb(this.o, this.ze, this, [a, b, c, d])
  }catch(e) {
    r.window.setTimeout(function() {
      f(e)
    }, 0)
  }
};
p.d = function() {
  Ke.n.d.call(this);
  for(var a = Za(this.Na);a.length;) {
    a.pop().b()
  }
  delete this.Na;
  delete this.va;
  r[this.ec] = i
};
function Me(a) {
  this.v = a;
  this.bb = []
}
A(Me, J);
p = Me.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.ub = function(a) {
  this.bb ? (this.a.q("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.bb.push.apply(this.bb, a)) : (this.a.q("writeFrames: Writing " + a.length + " frame(s)."), this.Wb.ub(a))
};
p.fc = function(a, b) {
  this.Wb.fc(a, b)
};
p.onclose = function() {
  this.a.info("onclose");
  Ie(this.v, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  Me.n.d.call(this);
  this.Wb.b();
  delete this.v
};
var Ne = [];
function Oe() {
  var a = new M;
  Ne.push(a);
  return a
}
function Pe(a) {
  var b = Ne;
  Ne = [];
  eb(b, function(b) {
    b.N(a)
  })
}
function Qe(a, b) {
  if(Ne.length) {
    return Oe()
  }
  var c = new ze(b + "FlashConnector.swf?cb=" + Re);
  c.Yc = "#777777";
  Ae(c, 300, 30);
  var d = Wc("minerva-elements");
  d || f(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
  var e = Wc("minerva-elements-FlashConnectorSwf");
  e || (e = Zc("div", {id:"minerva-elements-FlashConnectorSwf"}), d.appendChild(e));
  vc = De(a.A, c, e);
  vc.ua(Pe);
  return Oe()
}
;function Se() {
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
function Te() {
}
Te.prototype.I = function(a, b) {
  return!(a instanceof Te) ? m : uc(Ue(this), Ue(a), b)
};
Te.prototype.u = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Ue(this), a, b);
  a.push(">")
};
function Ue(a) {
  return[a.$a, a.Rd, a.xd, a.Wd, a.rb, a.Nc, a.Ld, a.Jd, a.Ac, a.Hd, a.he, a.ee, a.sa, a.Lb]
}
Te.prototype.H = Y;
Te.prototype.R = function(a) {
  var b = {};
  b.tnum = this.$a;
  b.ver = this.Rd;
  b.format = this.xd;
  b["new"] = this.Wd;
  b.id = this.rb;
  b.ming = this.Nc;
  b.pad = this.Ld;
  b.maxb = this.Jd;
  t(this.Ac) && (b.maxt = this.Ac);
  b.maxia = this.Hd;
  b.tcpack = this.he;
  b.eeds = this.ee;
  b.sack = this.sa instanceof $d ? cc((new Ve(this.sa)).H()) : this.sa;
  b.seenack = this.Lb instanceof $d ? cc((new Ve(this.Lb)).H()) : this.Lb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(Vb(b), "H")
};
function We(a) {
  Q.call(this, "StringFrame", [a]);
  this.Pc = a
}
A(We, Q);
We.prototype.H = Y;
We.prototype.R = function(a) {
  a.push(this.Pc, " ")
};
function Xe(a) {
  Q.call(this, "CommentFrame", [a]);
  this.ue = a
}
A(Xe, Q);
Xe.prototype.H = Y;
Xe.prototype.R = function(a) {
  a.push(this.ue, "^")
};
function Ye(a) {
  Q.call(this, "SeqNumFrame", [a]);
  this.be = a
}
A(Ye, Q);
Ye.prototype.H = Y;
Ye.prototype.R = function(a) {
  a.push("" + this.be, "N")
};
function Ze(a) {
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
  return new $d(a, c)
}
function Ve(a) {
  Q.call(this, "SackFrame", [a]);
  this.sa = a
}
A(Ve, Q);
Ve.prototype.H = Y;
Ve.prototype.R = function(a) {
  var b = this.sa;
  a.push(b.Fa.join(","), "|", "" + b.Ja);
  a.push("A")
};
function $e(a) {
  Q.call(this, "StreamStatusFrame", [a]);
  this.Dd = a
}
A($e, Q);
$e.prototype.H = Y;
$e.prototype.R = function(a) {
  var b = this.Dd;
  a.push(b.Fa.join(","), "|", "" + b.Ja);
  a.push("T")
};
function af() {
  Q.call(this, "StreamCreatedFrame", [])
}
A(af, Q);
af.prototype.H = Y;
af.prototype.R = function(a) {
  a.push("C")
};
function bf() {
  Q.call(this, "YouCloseItFrame", [])
}
A(bf, Q);
bf.prototype.H = Y;
bf.prototype.R = function(a) {
  a.push("Y")
};
function cf(a, b) {
  Q.call(this, "ResetFrame", [a, b]);
  this.Ud = a;
  this.Xc = b
}
A(cf, Q);
cf.prototype.H = Y;
cf.prototype.R = function(a) {
  a.push(this.Ud, "|", "" + Number(this.Xc), "!")
};
var df = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function ef(a) {
  Q.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(ef, Q);
ef.prototype.H = Y;
ef.prototype.R = function(a) {
  a.push(this.reason, "K")
};
function ff(a) {
  a || f(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new We(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = Ze(cc(a)), a == k && f(new X("bad sack")), new Ve(a)
  }
  if("N" == b) {
    return a = fc(cc(a)), a == k && f(new X("bad seqNum")), new Ye(a)
  }
  if("T" == b) {
    return a = Ze(cc(a)), a == k && f(new X("bad lastSackSeen")), new $e(a)
  }
  if("Y" == b) {
    return 1 != a.length && f(new X("leading garbage")), new bf
  }
  if("^" == b) {
    return new Xe(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && f(new X("leading garbage")), new af
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && f(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && f(new X("bad applicationLevel")), new cf(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = df[a], a == k && f(new X("unknown kill reason: " + a)), new ef(a)
  }
  f(new X("Invalid frame type " + b))
}
;function gf(a, b, c, d) {
  this.contentWindow = a;
  this.Db = b;
  this.Oc = c;
  this.He = d
}
gf.prototype.u = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.He, a, b);
  a.push(", expandedUrl=");
  N(this.Db, a, b);
  a.push(", streams=");
  N(this.Oc, a, b);
  a.push(">")
};
function hf() {
  this.frames = [];
  this.yc = new P
}
hf.prototype.a = U("cw.net.XDRTracker");
function jf(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + Math.floor(Se()) + ("" + Math.floor(Se()))
  })
}
function kf(a, b) {
  for(var c = lf, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], g;
    if(g = 0 == e.Oc.length) {
      g = e.Db;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      g = RegExp("^" + h + "$").test(g)
    }
    if(g) {
      return c.a.info("Giving " + O(b) + " existing frame " + O(e)), Pb(e)
    }
  }
  d = bc() + bc();
  e = jf(a);
  g = r.location;
  g instanceof Ed || (g = Ud(g));
  e instanceof Ed || (e = Ud(e));
  var l = g;
  g = l.O();
  (h = !!e.$) ? Fd(g, e.$) : h = !!e.Ia;
  h ? Gd(g, e.Ia) : h = !!e.Q;
  h ? Hd(g, e.Q) : h = e.pa != k;
  var n = e.K;
  if(h) {
    Id(g, e.pa)
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
  h ? Jd(g, n) : h = "" !== e.L.toString();
  h ? (l = e.L, l.La || (l.La = l.toString() ? decodeURIComponent(l.toString()) : ""), Kd(g, l.La, i)) : h = !!e.za;
  h && Ld(g, e.za);
  e = g.toString();
  g = ("" + r.location).match(Cd)[3] || k;
  h = e.match(Cd)[3] || k;
  g == h ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = Pb(new gf(r, e, [b], k))) : ((g = Wc("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new M, c.yc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = Zc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), g.appendChild(c), c = h);
  return c
}
hf.prototype.sf = function(a) {
  var b = this.yc.get(a);
  b || f(Error("Unknown frameId " + O(a)));
  this.yc.remove(b);
  var c = b[0], a = new gf(Wc("minerva-xdrframe-" + a).contentWindow || (Wc("minerva-xdrframe-" + a).contentDocument || Wc("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Wc("minerva-xdrframe-" + a).contentDocument || Wc("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var lf = new hf;
r.__XHRTracker_xdrFrameLoaded = y(lf.sf, lf);
var mf;
mf = m;
var nf = Ha();
nf && (-1 != nf.indexOf("Firefox") || -1 != nf.indexOf("Camino") || -1 != nf.indexOf("iPhone") || -1 != nf.indexOf("iPod") || -1 != nf.indexOf("iPad") || -1 != nf.indexOf("Android") || -1 != nf.indexOf("Chrome") && (mf = j));
var of = mf;
var Re = "4bdfc178fc0e508c0cd5efc3fdb09920";
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function pf(a, b, c, d, e, g) {
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
A(pf, M);
pf.prototype.Nd = 0;
pf.prototype.ud = function(a, b, c) {
  this.Nd++;
  this.kc[a] = [b, c];
  this.da || (this.od && b ? this.N([a, c]) : this.Fe && !b ? this.U(c) : this.Nd == this.Gd.length && this.N(this.kc));
  this.we && !b && (c = k);
  return c
};
pf.prototype.U = function(a) {
  pf.n.U.call(this, a);
  eb(this.Gd, function(a) {
    a.cancel()
  })
};
function qf(a) {
  a = new pf(a, m, j);
  a.ua(function(a) {
    return fb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function rf(a, b) {
  this.rf = a;
  this.Id = b
}
rf.prototype.wc = 0;
rf.prototype.Ob = 0;
rf.prototype.pc = m;
function sf(a) {
  var b = [];
  if(a.pc) {
    return[b, 2]
  }
  var c = a.wc, d = a.rf.responseText;
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
;function tf(a, b, c) {
  this.v = b;
  this.S = a;
  this.hc = c
}
A(tf, J);
p = tf.prototype;
p.a = U("cw.net.XHRMaster");
p.ra = -1;
p.zc = function(a, b, c) {
  this.hc.__XHRSlave_makeRequest(this.S, a, b, c)
};
p.ma = o("ra");
p.Cc = function(a, b) {
  1 != b && this.a.F(O(this.S) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  Ge(this.v);
  He(this.v, a)
};
p.Dc = function(a) {
  this.a.k("ongotheaders_: " + O(a));
  var b = k;
  "Content-Length" in a && (b = fc(a["Content-Length"]));
  a = this.v;
  a.a.k(a.l() + " got Content-Length: " + b);
  a.aa == uf && (b == k && (a.a.z("Expected to receive a valid Content-Length, but did not."), b = 5E5), vf(a, 2E3 + 1E3 * (b / 3072)))
};
p.Ec = function(a) {
  1 != a && this.a.k(this.v.l() + "'s XHR's readyState is " + a);
  this.ra = a;
  2 <= this.ra && Ge(this.v)
};
p.Bc = function() {
  this.v.b()
};
p.d = function() {
  tf.n.d.call(this);
  delete Z.fa[this.S];
  this.hc.__XHRSlave_dispose(this.S);
  delete this.hc
};
function wf() {
  this.fa = {}
}
A(wf, J);
p = wf.prototype;
p.a = U("cw.net.XHRMasterTracker");
p.jc = function(a, b) {
  var c = "_" + bc(), d = new tf(c, a, b);
  return this.fa[c] = d
};
p.Cc = function(a, b, c) {
  if(La) {
    for(var d = [], e = 0, g = b.length;e < g;e++) {
      d[e] = b[e]
    }
    b = d
  }else {
    b = jb(b)
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
  wf.n.d.call(this);
  for(var a = Za(this.fa);a.length;) {
    a.pop().b()
  }
  delete this.fa
};
var Z = new wf;
r.__XHRMaster_onframes = y(Z.Cc, Z);
r.__XHRMaster_oncomplete = y(Z.Bc, Z);
r.__XHRMaster_ongotheaders = y(Z.Dc, Z);
r.__XHRMaster_onreadystatechange = y(Z.Ec, Z);
function xf(a, b, c) {
  this.Y = a;
  this.host = b;
  this.port = c
}
function yf(a, b, c) {
  this.host = a;
  this.port = b;
  this.lf = c
}
function zf(a, b) {
  b || (b = a);
  this.Y = a;
  this.ta = b
}
zf.prototype.u = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.Y, a, b);
  a.push(", secondaryUrl=");
  N(this.ta, a, b);
  a.push(">")
};
function Af(a, b, c, d) {
  this.Y = a;
  this.Qd = b;
  this.ta = c;
  this.$d = d;
  (!(0 == this.Y.indexOf("http://") || 0 == this.Y.indexOf("https://")) || !(0 == this.ta.indexOf("http://") || 0 == this.ta.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Qd.location.href;
  Dd(this.Y, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.$d.location.href;
  Dd(this.ta, a) || f(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
Af.prototype.u = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.Y, a, b);
  a.push(", secondaryUrl=");
  N(this.ta, a, b);
  a.push(">")
};
var Bf = new Xe(";)]}");
function Cf(a, b) {
  t(b) || (b = j);
  this.Ta = a;
  this.hf = b
}
p = Cf.prototype;
p.a = U("cw.net.QANProtocolWrapper");
p.lb = function(a, b) {
  this.a.z(a, b);
  this.hf && r.setTimeout(function() {
    t(b.message) && b.stack && (b.message += "\n" + b.stack);
    f(b)
  }, 0)
};
p.ha = function(a) {
  this.Ya.ae(Ec(a))
};
p.Eb = function(a) {
  this.Ya.reset("QANHelper said: " + a)
};
p.ff = function(a) {
  this.Ya = a;
  this.Fc = new R(y(this.Ta.bodyReceived, this.Ta), y(this.lb, this), y(this.ha, this), y(this.Eb, this));
  this.Ta.streamStarted.call(this.Ta, this.Ya, this.Fc)
};
p.ef = function(a, b) {
  this.Fc.nd("Stream reset applicationLevel=" + O(b) + ", reason: " + a);
  this.Ta.streamReset.call(this.Ta, a, b)
};
p.gf = function(a) {
  try {
    var b = Hc(a)
  }catch(c) {
    c instanceof Fc || f(c);
    this.Ya.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Fc.vd(b)
};
function Df(a) {
  this.Ya = a
}
Df.prototype.u = function(a, b) {
  a.push("<UserContext for ");
  N(this.Ya, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.p = a;
  this.o = c ? c : Tb;
  this.sb = new gd;
  this.rb = bc() + bc();
  this.Z = new ae;
  this.vc = new ce;
  this.tb = k;
  this.$b = [];
  this.Ha = new Df(this);
  this.re = y(this.mf, this);
  F && (this.tb = zb(r, "load", this.Ze, m, this))
}
A($, J);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Ed = new $d(-1, []);
p.Fd = new $d(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = k;
p.onstarted = k;
p.onreset = k;
p.ondisconnect = k;
p.Wa = k;
p.Lc = m;
p.Hc = m;
p.w = 1;
p.Rc = -1;
p.e = k;
p.s = k;
p.nb = k;
p.Mc = 0;
p.Pd = 0;
p.Zd = 0;
p.u = function(a, b) {
  a.push("<ClientStream id=");
  N(this.rb, a, b);
  a.push(", state=", "" + this.w);
  a.push(", primary=");
  N(this.e, a, b);
  a.push(", secondary=");
  N(this.s, a, b);
  a.push(", resetting=");
  N(this.nb, a, b);
  a.push(">")
};
p.Je = o("Ha");
p.pe = function(a) {
  t(a.streamStarted) || f(Error("Protocol is missing required method streamStarted"));
  t(a.streamReset) || f(Error("Protocol is missing required method streamReset"));
  t(a.stringReceived) || f(Error("Protocol is missing required method stringReceived"));
  this.onstarted = y(a.streamStarted, a);
  this.onreset = y(a.streamReset, a);
  this.onstring = y(a.stringReceived, a)
};
function Ef(a) {
  var b = [-1];
  a.e && b.push(a.e.Sa);
  a.s && b.push(a.s.Sa);
  return Math.max.apply(Math.max, b)
}
function Ff(a) {
  if(!(3 > a.w)) {
    Gf(a);
    var b = 0 != a.Z.D.B(), c = de(a.vc), d = !c.I(a.Fd) && !(a.e && c.I(a.e.Pa) || a.s && c.I(a.s.Pa)), e = Ef(a);
    if((b = b && e < a.Z.xa) || d) {
      var g = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.cb ? (a.a.q("tryToSend_: writing " + g + " to primary"), d && (d = a.e, c != d.Pa && (!d.ia && !d.t.length && Hf(d), d.t.push(new Ve(c)), d.Pa = c)), b && If(a.e, a.Z, e + 1), a.e.ea()) : a.s == k ? a.Lc ? (a.a.q("tryToSend_: creating secondary to send " + g), a.s = Jf(a, m), b && If(a.s, a.Z, e + 1), a.s.ea()) : (a.a.q("tryToSend_: not creating a secondary because stream might not exist on server"), a.Hc = j) : a.a.q("tryToSend_: need to send " + g + ", but can't right now")
    }
  }
}
function Gf(a) {
  a.Wa != k && (a.o.A.clearTimeout(a.Wa), a.Wa = k)
}
p.mf = function() {
  this.Wa = k;
  Ff(this)
};
function Kf(a) {
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
  3 < this.w && f(Error("sendString: Can't send in state " + this.w));
  b && !/^([ -~]*)$/.test(a) && f(Error("sendString: string has illegal chars: " + O(a)));
  this.Z.append(a);
  Kf(this)
};
function Jf(a, b) {
  var c;
  a.p instanceof Af ? c = uf : a.p instanceof yf ? c = Lf : f(Error("Don't support endpoint " + O(a.p)));
  a.Rc += 1;
  c = new Mf(a.o, a, a.Rc, c, a.p, b);
  a.a.q("Created: " + c.l());
  a.sb.add(c);
  return c
}
function Nf(a, b, c) {
  var d = new Of(a.o, a, b, c);
  a.a.q("Created: " + d.l() + ", delay=" + b + ", times=" + c);
  a.sb.add(d);
  return d
}
function Pf(a, b) {
  a.sb.remove(b) || f(Error("transportOffline_: Transport was not removed?"));
  a.a.k("Offline: " + b.l());
  a.Mc = b.oa ? a.Mc + b.oa : 0;
  1 <= a.Mc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.Ha, "stream penalty reached limit", m), a.b());
  if(3 < a.w) {
    4 == a.w && b.ie ? (a.a.k("Disposing because resettingTransport_ is done."), a.b()) : a.a.k("Not creating a transport because ClientStream is in state " + a.w)
  }else {
    var c;
    var d;
    c = b instanceof Of;
    if(!c && b.bc) {
      var e = F ? of ? [0, 1] : [9, 20] : [0, 0];
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
    b == a.e ? (a.e = k, c ? a.e = Nf(a, e, c) : (e = Ef(a), a.e = Jf(a, j), If(a.e, a.Z, e + 1)), a.e.ea()) : b == a.s && (a.s = k, c ? (a.s = Nf(a, e, c), a.s.ea()) : Ff(a))
  }
}
p.reset = function(a) {
  3 < this.w && f(Error("reset: Can't send reset in state " + this.w));
  Gf(this);
  0 != this.Z.D.B() && this.a.z("reset: strings in send queue will never be sent: " + O(this.Z));
  this.w = 4;
  this.e && this.e.cb ? (this.a.info("reset: Sending ResetFrame over existing primary."), Qf(this.e, a), this.e.ea()) : (this.e && (this.a.k("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.s && (this.a.k("reset: Disposing secondary before sending ResetFrame."), this.s.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.nb = Jf(this, m), Qf(this.nb, a), this.nb.ea());
  this.onreset && this.onreset.call(this.Ha, a, j)
};
function Rf(a, b, c, d) {
  var e;
  e = a.vc;
  for(var g = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], n = m, u = 0, H = c.length;u < H;u++) {
    var q = c[u], w = q[0], q = q[1];
    if(w == e.Da + 1) {
      e.Da += 1;
      for(l.push(q);;) {
        w = e.Da + 1;
        q = e.wa.get(w, ee);
        if(q === ee) {
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
        var C = Zd(q);
        if(h != k && e.G + C > h) {
          n = j;
          break
        }
        e.wa.set(w, [q, C]);
        e.G += C
      }
    }
  }
  e.wa.ib() && e.wa.clear();
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
  d || Kf(a);
  if(!(4 == a.w || a.ba) && e) {
    b.a.F(b.l() + "'s peer caused rwin overflow."), b.b()
  }
}
p.kd = function(a) {
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
  if(this.p instanceof zf) {
    var a = kf(this.p.Y, this), b = kf(this.p.ta, this), a = qf([a, b]);
    a.ua(y(this.De, this));
    a.vb(y(this.kd, this))
  }else {
    if(this.p instanceof xf) {
      if(wc) {
        this.md()
      }else {
        var a = Qe(this.o, this.p.Y), c = this;
        a.ua(function(a) {
          wc || (wc = new Ke(c.o, a));
          return k
        });
        a.ua(y(this.md, this));
        a.vb(y(this.kd, this))
      }
    }else {
      Sf(this)
    }
  }
};
p.De = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Db, e = a[1].Db;
  this.$b.push(a[0]);
  this.$b.push(a[1]);
  this.p = new Af(d, b, e, c);
  Sf(this)
};
p.md = function() {
  this.p = new yf(this.p.host, this.p.port, wc);
  Sf(this)
};
function Sf(a) {
  a.w = 3;
  a.e = Jf(a, j);
  If(a.e, a.Z, k);
  a.e.ea()
}
p.d = function() {
  this.a.info(O(this) + " in disposeInternal.");
  Gf(this);
  this.w = 5;
  for(var a = this.sb.J(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.$b.length;a++) {
    ib(this.$b[a].Oc, this)
  }
  F && this.tb && (Bb(this.tb), this.tb = k);
  this.ondisconnect && this.ondisconnect.call(this.Ha);
  delete this.sb;
  delete this.e;
  delete this.s;
  delete this.nb;
  delete this.Ha;
  $.n.d.call(this)
};
var uf = 1, Lf = 3;
function Mf(a, b, c, d, e, g) {
  this.o = a;
  this.C = b;
  this.$a = c;
  this.aa = d;
  this.p = e;
  this.t = [];
  this.Ka = g;
  this.cb = !this.Oa();
  this.Va = this.aa != uf;
  this.qe = y(this.jf, this)
}
A(Mf, J);
p = Mf.prototype;
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
p.hb = m;
p.u = function(a) {
  a.push("<ClientTransport #", "" + this.$a, ", becomePrimary=", "" + this.Ka, ">")
};
p.l = function() {
  return(this.Ka ? "Prim. T#" : "Sec. T#") + this.$a
};
p.cd = function() {
  return!(!this.hb && this.Gb)
};
p.Oa = function() {
  return this.aa == uf || 2 == this.aa
};
function Tf(a, b) {
  mb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Rf(a.C, a, b, !a.Va)
}
function Uf(a, b, c) {
  try {
    var d = ff(b);
    a.Gb += 1;
    a.a.k(a.l() + " RECV " + O(d));
    var e;
    1 == a.Gb && !d.I(Bf) && a.Oa() ? (a.a.z(a.l() + " is closing soon because got bad preamble: " + O(d)), e = j) : e = m;
    if(e) {
      return j
    }
    if(d instanceof We) {
      if(!/^([ -~]*)$/.test(d.Pc)) {
        return a.hb = j
      }
      a.Qb += 1;
      c.push([a.Qb, d.Pc])
    }else {
      if(d instanceof Ve) {
        var g = a.C, h = d.sa;
        g.Ed = h;
        var l = g.Z, n = h.Ja, c = m;
        n > l.xa && (c = j);
        for(var u = be(l).concat(), d = 0;d < u.length;d++) {
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
        l.D.ib() && l.D.clear();
        if(c) {
          return a.a.z(a.l() + " is closing soon because got bad SackFrame"), a.hb = j
        }
      }else {
        if(d instanceof Ye) {
          a.Qb = d.be - 1
        }else {
          if(d instanceof $e) {
            a.C.Fd = d.Dd
          }else {
            if(d instanceof bf) {
              return a.a.q(a.l() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof ef) {
              return a.hb = j, "stream_attach_failure" == d.reason ? a.oa += 1 : "acked_unsent_strings" == d.reason && (a.oa += 0.5), a.a.q(a.l() + " is closing soon because got " + O(d)), j
            }
            if(!(d instanceof Xe)) {
              if(d instanceof af) {
                var C = a.C, lg = !a.Va;
                C.a.q("Stream is now confirmed to exist at server.");
                C.Lc = j;
                C.Hc && !lg && (C.Hc = m, Ff(C))
              }else {
                if(c.length) {
                  Tf(a, c);
                  if(!v(c)) {
                    for(var td = c.length - 1;0 <= td;td--) {
                      delete c[td]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof cf) {
                  var qc = a.C;
                  qc.onreset && qc.onreset.call(qc.Ha, d.Ud, d.Xc);
                  qc.b();
                  return j
                }
                f(Error(a.l() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Le) {
    return Le instanceof X || f(Le), a.a.z(a.l() + " is closing soon because got InvalidFrame: " + O(b)), a.hb = j
  }
  return m
}
function He(a, b) {
  a.Xb = j;
  try {
    for(var c = m, d = [], e = 0, g = b.length;e < g;e++) {
      if(a.ba) {
        a.a.info(a.l() + " returning from loop because we're disposed.");
        return
      }
      if(c = Uf(a, b[e], d)) {
        break
      }
    }
    d.length && Tf(a, d);
    a.Xb = m;
    a.t.length && a.ea();
    c && (a.a.q(a.l() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Xb = m
  }
}
p.jf = function() {
  this.a.z(this.l() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Vf(a) {
  a.Tb != k && (a.o.A.clearTimeout(a.Tb), a.Tb = k)
}
function vf(a, b) {
  Vf(a);
  b = Math.round(b);
  a.Tb = a.o.A.setTimeout(a.qe, b);
  a.a.k(a.l() + "'s receive timeout set to " + b + " ms.")
}
function Ge(a) {
  a.aa != uf && (a.aa == Lf || 2 == a.aa ? vf(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.aa)))
}
function Hf(a) {
  var b = new Te;
  b.$a = a.$a;
  b.Rd = 2;
  b.xd = 2;
  a.C.Lc || (b.Wd = j);
  b.rb = a.C.rb;
  b.Nc = a.Va;
  b.Nc && (b.Ld = 4096);
  b.Jd = 3E5;
  b.Hd = a.Va ? Math.floor(10) : 0;
  b.he = m;
  a.Ka && (b.ee = k, b.Ac = Math.floor((a.Va ? 358E4 : 25E3) / 1E3));
  b.sa = de(a.C.vc);
  b.Lb = a.C.Ed;
  a.t.push(b);
  a.Pa = b.sa
}
function Ie(a, b) {
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
    !a && !this.t.length && Hf(this);
    for(a = 0;a < this.t.length;a++) {
      this.a.k(this.l() + " SEND " + O(this.t[a]))
    }
    if(this.Oa()) {
      for(var a = [], b = 0, c = this.t.length;b < c;b++) {
        this.t[b].R(a), a.push("\n")
      }
      this.t = [];
      a = a.join("");
      b = this.Ka ? this.p.Y : this.p.ta;
      this.j = Z.jc(this, this.Ka ? this.p.Qd : this.p.$d);
      this.Sc = this.o.A === Ib ? oa() : this.o.A.getTime();
      this.j.zc(b, "POST", a);
      vf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.Va ? 0 : this.Ka ? 25E3 : 0))
    }else {
      if(this.aa == Lf) {
        a = [];
        b = 0;
        for(c = this.t.length;b < c;b++) {
          a.push(this.t[b].H())
        }
        this.t = [];
        this.j ? this.j.ub(a) : (b = this.p, this.j = new Me(this), this.j.Wb = b.lf.jc(this.j), this.Sc = this.o.A === Ib ? oa() : this.o.A.getTime(), this.j.fc(b.host, b.port), this.j.ba || (this.j.ub(a), this.j.ba || vf(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.aa))
      }
    }
  }
};
function If(a, b, c) {
  !a.ia && !a.t.length && Hf(a);
  for(var d = Math.max(c, a.Sa + 1), e = be(b), c = [], g = 0;g < e.length;g++) {
    var h = e[g];
    (d == k || h >= d) && c.push([h, b.D.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    g = c[b], e = g[0], g = g[1], (-1 == a.Sa || a.Sa + 1 != e) && a.t.push(new Ye(e)), a.t.push(new We(g)), a.Sa = e
  }
}
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Mf.n.d.call(this);
  this.ge = this.o.A === Ib ? oa() : this.o.A.getTime();
  this.t = [];
  Vf(this);
  this.j && this.j.b();
  var a = this.C;
  this.C = k;
  Pf(a, this)
};
function Qf(a, b) {
  !a.ia && !a.t.length && Hf(a);
  a.t.push(new cf(b, j));
  a.ie = j
}
function Of(a, b, c, d) {
  this.o = a;
  this.C = b;
  this.jd = c;
  this.ed = d
}
A(Of, J);
p = Of.prototype;
p.ia = m;
p.cb = m;
p.Hb = k;
p.Pa = k;
p.a = U("cw.net.DoNothingTransport");
function Wf(a) {
  a.Hb = a.o.A.setTimeout(function() {
    a.Hb = k;
    a.ed--;
    a.ed ? Wf(a) : a.b()
  }, a.jd)
}
p.ea = function() {
  this.ia && !this.cb && f(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ia = j;
  Wf(this)
};
p.u = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.jd, ">")
};
p.Oa = ba(m);
p.l = ba("Wast. T");
p.cd = ba(m);
p.d = function() {
  this.a.info(this.l() + " in disposeInternal.");
  Of.n.d.call(this);
  this.Hb != k && this.o.A.clearTimeout(this.Hb);
  var a = this.C;
  this.C = k;
  Pf(a, this)
};
function Xf() {
}
Xf.prototype.xb = k;
var Yf;
function Zf() {
}
A(Zf, Xf);
function $f(a) {
  return(a = ag(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function bg(a) {
  var b = {};
  ag(a) && (b[0] = j, b[1] = j);
  return b
}
Zf.prototype.tc = k;
function ag(a) {
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
Yf = new Zf;
function cg(a) {
  this.headers = new P;
  this.ab = a || k
}
A(cg, Hb);
cg.prototype.a = U("goog.net.XhrIo");
var dg = /^https?$/i;
p = cg.prototype;
p.ja = m;
p.f = k;
p.ac = k;
p.xc = "";
p.Cd = "";
p.jb = "";
p.lc = m;
p.Jb = m;
p.uc = m;
p.Ba = m;
p.Yb = 0;
p.Ga = k;
p.Yd = "";
p.pf = m;
p.send = function(a, b, c, d) {
  this.f && f(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.xc = a;
  this.jb = "";
  this.Cd = b;
  this.lc = m;
  this.ja = j;
  this.f = this.ab ? $f(this.ab) : $f(Yf);
  this.ac = this.ab ? this.ab.xb || (this.ab.xb = bg(this.ab)) : Yf.xb || (Yf.xb = bg(Yf));
  this.f.onreadystatechange = y(this.Od, this);
  try {
    this.a.k(eg(this, "Opening Xhr")), this.uc = j, this.f.open(b, a, j), this.uc = m
  }catch(e) {
    this.a.k(eg(this, "Error opening Xhr: " + e.message));
    fg(this, e);
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
  this.Yd && (this.f.responseType = this.Yd);
  "withCredentials" in this.f && (this.f.withCredentials = this.pf);
  try {
    this.Ga && (Ib.clearTimeout(this.Ga), this.Ga = k), 0 < this.Yb && (this.a.k(eg(this, "Will abort after " + this.Yb + "ms if incomplete")), this.Ga = Ib.setTimeout(y(this.kf, this), this.Yb)), this.a.k(eg(this, "Sending request")), this.Jb = j, this.f.send(a), this.Jb = m
  }catch(h) {
    this.a.k(eg(this, "Send error: " + h.message)), fg(this, h)
  }
};
p.kf = function() {
  "undefined" != typeof ca && this.f && (this.jb = "Timed out after " + this.Yb + "ms, aborting", this.a.k(eg(this, this.jb)), this.dispatchEvent("timeout"), this.abort(8))
};
function fg(a, b) {
  a.ja = m;
  a.f && (a.Ba = j, a.f.abort(), a.Ba = m);
  a.jb = b;
  gg(a);
  hg(a)
}
function gg(a) {
  a.lc || (a.lc = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function() {
  this.f && this.ja && (this.a.k(eg(this, "Aborting")), this.ja = m, this.Ba = j, this.f.abort(), this.Ba = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), hg(this))
};
p.d = function() {
  this.f && (this.ja && (this.ja = m, this.Ba = j, this.f.abort(), this.Ba = m), hg(this, j));
  cg.n.d.call(this)
};
p.Od = function() {
  !this.uc && !this.Jb && !this.Ba ? this.Ve() : ig(this)
};
p.Ve = function() {
  ig(this)
};
function ig(a) {
  if(a.ja && "undefined" != typeof ca) {
    if(a.ac[1] && 4 == a.ma() && 2 == jg(a)) {
      a.a.k(eg(a, "Local request error detected and ignored"))
    }else {
      if(a.Jb && 4 == a.ma()) {
        Ib.setTimeout(y(a.Od, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.ma()) {
          a.a.k(eg(a, "Request complete"));
          a.ja = m;
          var b = jg(a), c;
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
              b = ("" + a.xc).match(Cd)[1] || k, !b && self.location && (b = self.location.protocol, b = b.substr(0, b.length - 1)), b = !dg.test(b ? b.toLowerCase() : "")
            }
            c = b
          }
          if(c) {
            a.dispatchEvent("complete"), a.dispatchEvent("success")
          }else {
            var d;
            try {
              d = 2 < a.ma() ? a.f.statusText : ""
            }catch(e) {
              a.a.k("Can not get status: " + e.message), d = ""
            }
            a.jb = d + " [" + jg(a) + "]";
            gg(a)
          }
          hg(a)
        }
      }
    }
  }
}
function hg(a, b) {
  if(a.f) {
    var c = a.f, d = a.ac[0] ? ea : k;
    a.f = k;
    a.ac = k;
    a.Ga && (Ib.clearTimeout(a.Ga), a.Ga = k);
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
function jg(a) {
  try {
    return 2 < a.ma() ? a.f.status : -1
  }catch(b) {
    return a.a.z("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.ma() ? this.f.getResponseHeader(a) : i
};
function eg(a, b) {
  return b + " [" + a.Cd + " " + a.xc + " " + jg(a) + "]"
}
;var kg = !(E || F && !G("420+"));
function mg(a, b) {
  this.Zb = a;
  this.S = b
}
A(mg, J);
p = mg.prototype;
p.j = k;
p.ra = -1;
p.td = m;
p.wd = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function ng(a) {
  var b = sf(a.gd), c = b[0], b = b[1], d = r.parent;
  d ? (d.__XHRMaster_onframes(a.S, c, b), 1 != b && a.b()) : a.b()
}
p.Me = function() {
  ng(this);
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
      if(b.B() && (this.td = j, a.__XHRMaster_ongotheaders(this.S, pc(b)), this.ba)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.S, this.ra);
    kg && 3 == this.ra && ng(this)
  }else {
    this.b()
  }
};
p.zc = function(a, b, c) {
  this.j = new cg;
  wb(this.j, "readystatechange", y(this.Xe, this));
  wb(this.j, "complete", y(this.Me, this));
  this.j.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.gd = new rf(this.j.f, 1048576)
};
p.d = function() {
  mg.n.d.call(this);
  delete this.gd;
  this.j && this.j.b();
  delete this.Zb.qb[this.S];
  delete this.Zb
};
function og() {
  this.qb = {}
}
A(og, J);
og.prototype.Re = function(a, b, c, d) {
  var e = new mg(this, a);
  this.qb[a] = e;
  e.zc(b, c, d)
};
og.prototype.Ae = function(a) {
  (a = this.qb[a]) && a.b()
};
og.prototype.d = function() {
  og.n.d.call(this);
  for(var a = Za(this.qb);a.length;) {
    a.pop().b()
  }
  delete this.qb
};
var pg = new og;
r.__XHRSlave_makeRequest = y(pg.Re, pg);
r.__XHRSlave_dispose = y(pg.Ae, pg);
var qg = U("cw.net.demo");
function rg(a, b, c, d) {
  a = new Ed(document.location);
  if(c) {
    return new xf(d, a.Q, r.__demo_mainSocketPort)
  }
  b ? (b = r.__demo_shared_domain, x(b) || f(Error("domain was " + O(b) + "; expected a string.")), c = a.O(), Hd(c, "_____random_____." + b)) : c = a.O();
  Jd(c, d);
  Kd(c, "", i);
  return new zf(c.toString().replace("_____random_____", "%random%"))
}
;z("Minerva.HttpEndpoint", zf);
z("Minerva.SocketEndpoint", xf);
z("Minerva.QANHelper", R);
R.prototype.handleQANFrame = R.prototype.vd;
R.prototype.ask = R.prototype.ne;
R.prototype.notify = R.prototype.Ue;
R.prototype.failAll = R.prototype.nd;
z("Minerva.QANProtocolWrapper", Cf);
Cf.prototype.streamStarted = Cf.prototype.ff;
Cf.prototype.streamReset = Cf.prototype.ef;
Cf.prototype.stringReceived = Cf.prototype.gf;
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
S.prototype.warning = S.prototype.z;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.ve;
S.prototype.fine = S.prototype.k;
S.prototype.finer = S.prototype.Ee;
S.prototype.finest = S.prototype.q;
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
V.getRoot = V.qc;
z("Minerva.DivConsole", Bd);
Bd.prototype.setCapturing = Bd.prototype.$e;
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
z("Minerva.getEndpoint", rg);
z("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new Ed(document.location)).L;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !r.__demo_shared_domain) {
    qg.z("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return rg(0, a, b, "/_minerva/")
});
})();
