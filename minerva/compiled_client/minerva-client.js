(function() {
function f(a) {
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
var p;
var ca = ca || {}, s = this;
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
  return a !== i
}
function fa(a) {
  return"array" == t(a)
}
function ga(a) {
  var b = t(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function ha(a) {
  return ia(a) && "function" == typeof a.getFullYear
}
function v(a) {
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
  for(var g;c.length && (g = c.shift());) {
    !c.length && u(b) ? d[g] = b : d = d[g] ? d[g] : d[g] = {}
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
function qa(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
function ra(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
}
function C(a) {
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
  for(var c = 0, d = ("" + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), g = ("" + b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = Math.max(d.length, g.length), h = 0;0 == c && h < e;h++) {
    var l = d[h] || "", n = g[h] || "", q = RegExp("(\\d*)(\\D*)", "g"), z = RegExp("(\\d*)(\\D*)", "g");
    do {
      var r = q.exec(l) || ["", "", ""], w = z.exec(n) || ["", "", ""];
      if(0 == r[0].length && 0 == w[0].length) {
        break
      }
      c = ((0 == r[1].length ? 0 : parseInt(r[1], 10)) < (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? -1 : (0 == r[1].length ? 0 : parseInt(r[1], 10)) > (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? 1 : 0) || ((0 == r[2].length) < (0 == w[2].length) ? -1 : (0 == r[2].length) > (0 == w[2].length) ? 1 : 0) || (r[2] < w[2] ? -1 : r[2] > w[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
}
;function za(a, b) {
  b.unshift(a);
  B.call(this, qa.apply(k, b));
  b.shift();
  this.Hg = a
}
A(za, B);
za.prototype.name = "AssertionError";
function Aa(a, b) {
  f(new za("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;var Ba;
Ba = ba(j);
var Ca, Da, Ea, Fa;
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
var Ja = Ca, D = Da, Ka = Fa, F = Ea, La = s.navigator, Ma = -1 != (La && La.platform || "").indexOf("Mac"), Na;
a: {
  var Oa = "", Pa;
  if(Ja && s.opera) {
    var Qa = s.opera.version, Oa = "function" == typeof Qa ? Qa() : Qa
  }else {
    if(Ka ? Pa = /rv\:([^\);]+)(\)|;)/ : D ? Pa = /MSIE\s+([^\);]+)(\)|;)/ : F && (Pa = /WebKit\/(\S+)/), Pa) {
      var Ra = Pa.exec(Ga()), Oa = Ra ? Ra[1] : ""
    }
  }
  if(D) {
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
  return Ua[a] || (Ua[a] = 0 <= ya(Na, a))
}
var Va = {};
function Wa() {
  return Va[9] || (Va[9] = D && !!document.documentMode && 9 <= document.documentMode)
}
;function Xa() {
}
var Ya = 0;
p = Xa.prototype;
p.key = 0;
p.Wa = m;
p.bc = m;
p.Ib = function(a, b, c, d, g, e) {
  ja(a) ? this.Cd = j : a && a.handleEvent && ja(a.handleEvent) ? this.Cd = m : f(Error("Invalid listener argument"));
  this.ib = a;
  this.Ud = b;
  this.src = c;
  this.type = d;
  this.capture = !!g;
  this.pc = e;
  this.bc = m;
  this.key = ++Ya;
  this.Wa = m
};
p.handleEvent = function(a) {
  return this.Cd ? this.ib.call(this.pc || this.src, a) : this.ib.handleEvent.call(this.ib, a)
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
var bb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function cb(a, b) {
  for(var c, d, g = 1;g < arguments.length;g++) {
    d = arguments[g];
    for(c in d) {
      a[c] = d[c]
    }
    for(var e = 0;e < bb.length;e++) {
      c = bb[e], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!D || Wa();
var db = !D || Wa(), eb = D && !G("8");
!F || G("528");
Ka && G("1.9b") || D && G("8") || Ja && G("9.5") || F && G("528");
Ka && !G("8") || D && G("9");
var H = Array.prototype, fb = H.indexOf ? function(a, b, c) {
  return H.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == k ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(v(a)) {
    return!v(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, gb = H.forEach ? function(a, b, c) {
  H.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    e in g && b.call(c, g[e], e, a)
  }
}, hb = H.map ? function(a, b, c) {
  return H.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = Array(d), e = v(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in e && (g[h] = b.call(c, e[h], h, a))
  }
  return g
}, ib = H.some ? function(a, b, c) {
  return H.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in g && b.call(c, g[e], e, a)) {
      return j
    }
  }
  return m
}, jb = H.every ? function(a, b, c) {
  return H.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in g && !b.call(c, g[e], e, a)) {
      return m
    }
  }
  return j
};
function kb(a, b) {
  var c = fb(a, b);
  0 <= c && H.splice.call(a, c, 1)
}
function lb(a) {
  return H.concat.apply(H, arguments)
}
function mb(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}
function nb(a, b, c) {
  return 2 >= arguments.length ? H.slice.call(a, b) : H.slice.call(a, b, c)
}
function ob(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var pb = {Gf:"click", Lf:"dblclick", eg:"mousedown", ig:"mouseup", hg:"mouseover", gg:"mouseout", fg:"mousemove", ug:"selectstart", $f:"keypress", Zf:"keydown", ag:"keyup", Ef:"blur", Tf:"focus", Mf:"deactivate", Uf:D ? "focusin" : "DOMFocusIn", Vf:D ? "focusout" : "DOMFocusOut", Ff:"change", tg:"select", vg:"submit", Yf:"input", pg:"propertychange", Qf:"dragstart", Nf:"dragenter", Pf:"dragover", Of:"dragleave", Rf:"drop", zg:"touchstart", yg:"touchmove", xg:"touchend", wg:"touchcancel", If:"contextmenu", 
Sf:"error", Xf:"help", bg:"load", cg:"losecapture", qg:"readystatechange", rg:"resize", sg:"scroll", Bg:"unload", Wf:"hashchange", lg:"pagehide", mg:"pageshow", og:"popstate", Jf:"copy", ng:"paste", Kf:"cut", Bf:"beforecopy", Cf:"beforecut", Df:"beforepaste", kg:"online", jg:"offline", dg:"message", Hf:"connect", Ag:F ? "webkitTransitionEnd" : Ja ? "oTransitionEnd" : "transitionend"};
function I() {
}
I.prototype.ja = m;
I.prototype.b = function() {
  this.ja || (this.ja = j, this.d())
};
I.prototype.d = function() {
  this.Be && qb.apply(k, this.Be);
  if(this.Pd) {
    for(;this.Pd.length;) {
      this.Pd.shift()()
    }
  }
};
function qb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    ga(d) ? qb.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function rb(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
A(rb, I);
p = rb.prototype;
p.d = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
p.Ga = m;
p.defaultPrevented = m;
p.Tb = j;
p.stopPropagation = function() {
  this.Ga = j
};
p.preventDefault = function() {
  this.defaultPrevented = j;
  this.Tb = m
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
  a && this.Ib(a, b)
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
p.$e = m;
p.Na = k;
p.Ib = function(a, b) {
  var c = this.type = a.type;
  rb.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ka) {
      var g;
      a: {
        try {
          tb(d.nodeName);
          g = j;
          break a
        }catch(e) {
        }
        g = m
      }
      g || (d = k)
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
  this.$e = Ma ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.Na = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Ga
};
p.stopPropagation = function() {
  ub.m.stopPropagation.call(this);
  this.Na.stopPropagation ? this.Na.stopPropagation() : this.Na.cancelBubble = j
};
p.preventDefault = function() {
  ub.m.preventDefault.call(this);
  var a = this.Na;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = m, eb) {
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
  this.relatedTarget = this.currentTarget = this.target = this.Na = k
};
var vb = {}, J = {}, K = {}, wb = {};
function xb(a, b, c, d, g) {
  if(b) {
    if(fa(b)) {
      for(var e = 0;e < b.length;e++) {
        xb(a, b[e], c, d, g)
      }
      return k
    }
    var d = !!d, h = J;
    b in h || (h[b] = {c:0, M:0});
    h = h[b];
    d in h || (h[d] = {c:0, M:0}, h.c++);
    var h = h[d], l = ka(a), n;
    h.M++;
    if(h[l]) {
      n = h[l];
      for(e = 0;e < n.length;e++) {
        if(h = n[e], h.ib == c && h.pc == g) {
          if(h.Wa) {
            break
          }
          return n[e].key
        }
      }
    }else {
      n = h[l] = [], h.c++
    }
    var q = yb, z = db ? function(a) {
      return q.call(z.src, z.key, a)
    } : function(a) {
      a = q.call(z.src, z.key, a);
      if(!a) {
        return a
      }
    }, e = z;
    e.src = a;
    h = new Xa;
    h.Ib(c, e, a, b, d, g);
    c = h.key;
    e.key = c;
    n.push(h);
    vb[c] = h;
    K[l] || (K[l] = []);
    K[l].push(h);
    a.addEventListener ? (a == s || !a.fd) && a.addEventListener(b, e, d) : a.attachEvent(b in wb ? wb[b] : wb[b] = "on" + b, e);
    return c
  }
  f(Error("Invalid event type"))
}
function zb(a, b, c, d, g) {
  if(fa(b)) {
    for(var e = 0;e < b.length;e++) {
      zb(a, b[e], c, d, g)
    }
    return k
  }
  a = xb(a, b, c, d, g);
  vb[a].bc = j;
  return a
}
function Ab(a, b, c, d, g) {
  if(fa(b)) {
    for(var e = 0;e < b.length;e++) {
      Ab(a, b[e], c, d, g)
    }
  }else {
    d = !!d;
    a: {
      e = J;
      if(b in e && (e = e[b], d in e && (e = e[d], a = ka(a), e[a]))) {
        a = e[a];
        break a
      }
      a = k
    }
    if(a) {
      for(e = 0;e < a.length;e++) {
        if(a[e].ib == c && a[e].capture == d && a[e].pc == g) {
          Bb(a[e].key);
          break
        }
      }
    }
  }
}
function Bb(a) {
  if(!vb[a]) {
    return m
  }
  var b = vb[a];
  if(b.Wa) {
    return m
  }
  var c = b.src, d = b.type, g = b.Ud, e = b.capture;
  c.removeEventListener ? (c == s || !c.fd) && c.removeEventListener(d, g, e) : c.detachEvent && c.detachEvent(d in wb ? wb[d] : wb[d] = "on" + d, g);
  c = ka(c);
  g = J[d][e][c];
  if(K[c]) {
    var h = K[c];
    kb(h, b);
    0 == h.length && delete K[c]
  }
  b.Wa = j;
  g.Nd = j;
  Cb(d, e, c, g);
  delete vb[a];
  return j
}
function Cb(a, b, c, d) {
  if(!d.Kb && d.Nd) {
    for(var g = 0, e = 0;g < d.length;g++) {
      d[g].Wa ? d[g].Ud.src = k : (g != e && (d[e] = d[g]), e++)
    }
    d.length = e;
    d.Nd = m;
    0 == e && (delete J[a][b][c], J[a][b].c--, 0 == J[a][b].c && (delete J[a][b], J[a].c--), 0 == J[a].c && delete J[a])
  }
}
function Db(a, b, c, d, g) {
  var e = 1, b = ka(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.Kb ? a.Kb++ : a.Kb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Wa && (e &= Eb(n, g) !== m)
      }
    }finally {
      a.Kb--, Cb(c, d, b, a)
    }
  }
  return Boolean(e)
}
function Eb(a, b) {
  a.bc && Bb(a.key);
  return a.handleEvent(b)
}
function yb(a, b) {
  if(!vb[a]) {
    return j
  }
  var c = vb[a], d = c.type, g = J;
  if(!(d in g)) {
    return j
  }
  var g = g[d], e, h;
  if(!db) {
    e = b || da("window.event");
    var l = j in g, n = m in g;
    if(l) {
      if(0 > e.keyCode || e.returnValue != i) {
        return j
      }
      a: {
        var q = m;
        if(0 == e.keyCode) {
          try {
            e.keyCode = -1;
            break a
          }catch(z) {
            q = j
          }
        }
        if(q || e.returnValue == i) {
          e.returnValue = j
        }
      }
    }
    q = new ub;
    q.Ib(e, this);
    e = j;
    try {
      if(l) {
        for(var r = [], w = q.currentTarget;w;w = w.parentNode) {
          r.push(w)
        }
        h = g[j];
        h.M = h.c;
        for(var E = r.length - 1;!q.Ga && 0 <= E && h.M;E--) {
          q.currentTarget = r[E], e &= Db(h, r[E], d, j, q)
        }
        if(n) {
          h = g[m];
          h.M = h.c;
          for(E = 0;!q.Ga && E < r.length && h.M;E++) {
            q.currentTarget = r[E], e &= Db(h, r[E], d, m, q)
          }
        }
      }else {
        e = Eb(c, q)
      }
    }finally {
      r && (r.length = 0), q.b()
    }
    return e
  }
  d = new ub(b, this);
  try {
    e = Eb(c, d)
  }finally {
    d.b()
  }
  return e
}
var Fb = 0;
function Gb() {
}
A(Gb, I);
p = Gb.prototype;
p.fd = j;
p.Nb = k;
p.Jc = aa("Nb");
p.addEventListener = function(a, b, c, d) {
  xb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  Ab(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
  var b = a.type || a, c = J;
  if(b in c) {
    if(v(a)) {
      a = new rb(a, this)
    }else {
      if(a instanceof rb) {
        a.target = a.target || this
      }else {
        var d = a, a = new rb(b, this);
        cb(a, d)
      }
    }
    var d = 1, g, c = c[b], b = j in c, e;
    if(b) {
      g = [];
      for(e = this;e;e = e.Nb) {
        g.push(e)
      }
      e = c[j];
      e.M = e.c;
      for(var h = g.length - 1;!a.Ga && 0 <= h && e.M;h--) {
        a.currentTarget = g[h], d &= Db(e, g[h], a.type, j, a) && a.Tb != m
      }
    }
    if(m in c) {
      if(e = c[m], e.M = e.c, b) {
        for(h = 0;!a.Ga && h < g.length && e.M;h++) {
          a.currentTarget = g[h], d &= Db(e, g[h], a.type, m, a) && a.Tb != m
        }
      }else {
        for(g = this;!a.Ga && g && e.M;g = g.Nb) {
          a.currentTarget = g, d &= Db(e, g, a.type, m, a) && a.Tb != m
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
  var a, b = 0, c = a == k;
  a = !!a;
  if(this == k) {
    Za(K, function(d) {
      for(var e = d.length - 1;0 <= e;e--) {
        var g = d[e];
        if(c || a == g.capture) {
          Bb(g.key), b++
        }
      }
    })
  }else {
    var d = ka(this);
    if(K[d]) {
      for(var d = K[d], g = d.length - 1;0 <= g;g--) {
        var e = d[g];
        if(c || a == e.capture) {
          Bb(e.key), b++
        }
      }
    }
  }
  this.Nb = k
};
var Hb = s.window;
Fb++;
Fb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function L(a, b) {
  this.wb = [];
  this.ad = a;
  this.hd = b || k
}
p = L.prototype;
p.$ = m;
p.cb = m;
p.kb = 0;
p.Kc = m;
p.ve = m;
p.ub = 0;
p.cancel = function(a) {
  if(this.$) {
    this.mb instanceof L && this.mb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.ub--, 0 >= b.ub && b.cancel())
    }
    this.ad ? this.ad.call(this.hd, this) : this.Kc = j;
    this.$ || this.P(new Ib(this))
  }
};
p.dd = function(a, b) {
  Jb(this, a, b);
  this.kb--;
  0 == this.kb && this.$ && Kb(this)
};
function Jb(a, b, c) {
  a.$ = j;
  a.mb = c;
  a.cb = !b;
  Kb(a)
}
function Lb(a) {
  a.$ && (a.Kc || f(new Mb(a)), a.Kc = m)
}
p.N = function(a) {
  Lb(this);
  Jb(this, j, a)
};
p.P = function(a) {
  Lb(this);
  Jb(this, m, a)
};
p.Ma = function(a, b) {
  return this.Y(a, k, b)
};
p.tb = function(a, b) {
  return this.Y(k, a, b)
};
p.Y = function(a, b, c) {
  this.wb.push([a, b, c]);
  this.$ && Kb(this);
  return this
};
p.bd = function(a) {
  this.Y(a.N, a.P, a);
  return this
};
p.qe = function(a) {
  return this.Ma(x(a.$c, a))
};
p.$c = function(a) {
  var b = new L;
  this.bd(b);
  a && (b.t = this, this.ub++);
  return b
};
p.Wc = function(a, b) {
  return this.Y(a, a, b)
};
p.Oe = o("$");
function Nb(a) {
  return ib(a.wb, function(a) {
    return ja(a[1])
  })
}
function Kb(a) {
  a.Tc && (a.$ && Nb(a)) && (s.clearTimeout(a.Tc), delete a.Tc);
  a.t && (a.t.ub--, delete a.t);
  for(var b = a.mb, c = m, d = m;a.wb.length && 0 == a.kb;) {
    var g = a.wb.shift(), e = g[0], h = g[1], g = g[2];
    if(e = a.cb ? h : e) {
      try {
        var l = e.call(g || a.hd, b);
        u(l) && (a.cb = a.cb && (l == b || l instanceof Error), a.mb = b = l);
        b instanceof L && (d = j, a.kb++)
      }catch(n) {
        b = n, a.cb = j, Nb(a) || (c = j)
      }
    }
  }
  a.mb = b;
  d && a.kb && (b.Y(x(a.dd, a, j), x(a.dd, a, m)), b.ve = j);
  c && (a.Tc = s.setTimeout(function() {
    f(new Ob(b))
  }, 0))
}
function Pb(a) {
  var b = new L;
  b.N(a);
  return b
}
function Qb(a) {
  var b = new L;
  b.P(a);
  return b
}
function Mb(a) {
  B.call(this);
  this.Ae = a
}
A(Mb, B);
Mb.prototype.message = "Already called";
function Ib(a) {
  B.call(this);
  this.Ae = a
}
A(Ib, B);
Ib.prototype.message = "Deferred was cancelled";
function Ob(a) {
  B.call(this);
  this.Cg = a;
  this.message = "Unhandled Error in Deferred: " + (a.message || "[No message]")
}
A(Ob, B);
function Rb(a) {
  this.z = a;
  this.Ab = [];
  this.ld = [];
  this.ue = x(this.uf, this)
}
Rb.prototype.Qc = k;
Rb.prototype.uf = function() {
  this.Qc = k;
  var a = this.Ab;
  this.Ab = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], g = c[1], c = c[2];
    try {
      d.apply(g, c)
    }catch(e) {
      this.z.setTimeout(function() {
        f(e)
      }, 0)
    }
  }
  if(0 == this.Ab.length) {
    a = this.ld;
    this.ld = [];
    for(b = 0;b < a.length;b++) {
      a[b].N(k)
    }
  }
};
var Sb = new Rb(s.window);
function Tb(a) {
  return ja(a) || "object" == typeof a && ja(a.call) && ja(a.apply)
}
;function Ub(a, b) {
  var c = [];
  Vb(new Wb(b), a, c);
  return c.join("")
}
function Wb(a) {
  this.Sb = a
}
function Vb(a, b, c) {
  switch(typeof b) {
    case "string":
      Xb(b, c);
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
      if(fa(b)) {
        var d = b.length;
        c.push("[");
        for(var g = "", e = 0;e < d;e++) {
          c.push(g), g = b[e], Vb(a, a.Sb ? a.Sb.call(b, "" + e, g) : g, c), g = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(e in b) {
        Object.prototype.hasOwnProperty.call(b, e) && (g = b[e], "function" != typeof g && (c.push(d), Xb(e, c), c.push(":"), Vb(a, a.Sb ? a.Sb.call(b, e, g) : g, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      f(Error("Unknown type: " + typeof b))
  }
}
var Yb = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, Zb = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function Xb(a, b) {
  b.push('"', a.replace(Zb, function(a) {
    if(a in Yb) {
      return Yb[a]
    }
    var b = a.charCodeAt(0), g = "\\u";
    16 > b ? g += "000" : 256 > b ? g += "00" : 4096 > b && (g += "0");
    return Yb[a] = g + b.toString(16)
  }), '"')
}
;function $b(a, b, c) {
  var d = fb(c, a);
  if(-1 != d) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = t(a);
    if("boolean" == d || "number" == d || "null" == d || "undefined" == d) {
      b.push("" + a)
    }else {
      if("string" == d) {
        Xb(a, b)
      }else {
        if(Tb(a.v)) {
          a.v(b, c)
        }else {
          if(Tb(a.me)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var g = "", e = 0;e < d;e++) {
                  b.push(g), $b(a[e], b, c), g = ", "
                }
                b.push("]")
              }else {
                if("object" == d) {
                  if(ha(a) && "function" == typeof a.valueOf) {
                    b.push("new Date(", "" + a.valueOf(), ")")
                  }else {
                    for(var d = ab(a).concat(bb), g = {}, h = e = 0;h < d.length;) {
                      var l = d[h++], n = ia(l) ? "o" + ka(l) : (typeof l).charAt(0) + l;
                      Object.prototype.hasOwnProperty.call(g, n) || (g[n] = j, d[e++] = l)
                    }
                    d.length = e;
                    b.push("{");
                    g = "";
                    for(h = 0;h < d.length;h++) {
                      e = d[h], Object.prototype.hasOwnProperty.call(a, e) && (l = a[e], b.push(g), Xb(e, b), b.push(": "), $b(l, b, c), g = ", ")
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
function M(a, b, c) {
  c || (c = []);
  $b(a, b, c)
}
function N(a, b) {
  var c = [];
  M(a, c, b);
  return c.join("")
}
;function ac() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ pa()).toString(36)
}
function bc(a) {
  return a.substr(0, a.length - 1)
}
var cc = /^(0|[1-9]\d*)$/, dc = /^(0|\-?[1-9]\d*)$/;
function ec(a) {
  var b = fc;
  return cc.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;var fc = Math.pow(2, 53);
function gc(a) {
  if("function" == typeof a.A) {
    a = a.A()
  }else {
    if(ga(a) || v(a)) {
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
function hc(a) {
  if("function" == typeof a.C) {
    return a.C()
  }
  if(v(a)) {
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
function ic(a) {
  if("function" == typeof a.T) {
    return a.T()
  }
  if("function" != typeof a.C) {
    if(ga(a) || v(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return ab(a)
  }
}
function jc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ga(a) || v(a)) {
      gb(a, b, c)
    }else {
      for(var d = ic(a), g = hc(a), e = g.length, h = 0;h < e;h++) {
        b.call(c, g[h], d && d[h], a)
      }
    }
  }
}
function lc(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, i)
  }
  if(ga(a) || v(a)) {
    return jb(a, b, i)
  }
  for(var c = ic(a), d = hc(a), g = d.length, e = 0;e < g;e++) {
    if(!b.call(i, d[e], c && c[e], a)) {
      return m
    }
  }
  return j
}
;function O(a, b) {
  this.n = {};
  this.g = [];
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
p = O.prototype;
p.c = 0;
p.Uc = 0;
p.A = o("c");
p.C = function() {
  mc(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.n[this.g[b]])
  }
  return a
};
p.T = function() {
  mc(this);
  return this.g.concat()
};
p.Z = function(a) {
  return nc(this.n, a)
};
p.ec = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(nc(this.n, c) && this.n[c] == a) {
      return j
    }
  }
  return m
};
p.K = function(a, b) {
  if(this === a) {
    return j
  }
  if(this.c != a.A()) {
    return m
  }
  var c = b || oc;
  mc(this);
  for(var d, g = 0;d = this.g[g];g++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function oc(a, b) {
  return a === b
}
p.fb = function() {
  return 0 == this.c
};
p.clear = function() {
  this.n = {};
  this.Uc = this.c = this.g.length = 0
};
p.remove = function(a) {
  return nc(this.n, a) ? (delete this.n[a], this.c--, this.Uc++, this.g.length > 2 * this.c && mc(this), j) : m
};
function mc(a) {
  if(a.c != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      nc(a.n, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.c != a.g.length) {
    for(var g = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], nc(g, d) || (a.g[c++] = d, g[d] = 1), b++
    }
    a.g.length = c
  }
}
p.get = function(a, b) {
  return nc(this.n, a) ? this.n[a] : b
};
p.set = function(a, b) {
  nc(this.n, a) || (this.c++, this.g.push(a), this.Uc++);
  this.n[a] = b
};
p.ac = function(a) {
  var b;
  a instanceof O ? (b = a.T(), a = a.C()) : (b = ab(a), a = $a(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
p.S = function() {
  return new O(this)
};
function pc(a) {
  mc(a);
  for(var b = {}, c = 0;c < a.g.length;c++) {
    var d = a.g[c];
    b[d] = a.n[d]
  }
  return b
}
function nc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;var qc = {me:ba("<cw.eq.Wildcard>")};
function rc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function sc(a, b, c) {
  var d = t(a), g = t(b);
  if(a == qc || b == qc) {
    return j
  }
  if(a != k && "function" == typeof a.K) {
    return c && c.push("running custom equals function on left object"), a.K(b, c)
  }
  if(b != k && "function" == typeof b.K) {
    return c && c.push("running custom equals function on right object"), b.K(a, c)
  }
  if(rc(d) || rc(g)) {
    a = a === b
  }else {
    if(a instanceof RegExp && b instanceof RegExp) {
      a = a.toString() === b.toString()
    }else {
      if(ha(a) && ha(b)) {
        a = a.valueOf() === b.valueOf()
      }else {
        if("array" == d && "array" == g) {
          a: {
            if(c && c.push("descending into array"), a.length != b.length) {
              c && c.push("array length mismatch: " + a.length + ", " + b.length), a = m
            }else {
              d = 0;
              for(g = a.length;d < g;d++) {
                if(!sc(a[d], b[d], c)) {
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
          if(a.le == Ba && b.le == Ba) {
            a: {
              c && c.push("descending into object");
              for(var e in a) {
                if(!(e in b)) {
                  c && c.push("property " + e + " missing on right object");
                  a = m;
                  break a
                }
                if(!sc(a[e], b[e], c)) {
                  c && c.push("earlier comparisons indicate mismatch at property " + e);
                  a = m;
                  break a
                }
              }
              for(e in b) {
                if(!(e in a)) {
                  c && c.push("property " + e + " missing on left object");
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
;function P(a, b) {
  this.cf = a;
  this.Qb = b
}
P.prototype.K = function(a, b) {
  return ia(a) && this.constructor == a.constructor && sc(this.Qb, a.Qb, b)
};
P.prototype.v = function(a, b) {
  a.push("new ", this.cf, "(");
  for(var c = "", d = 0;d < this.Qb.length;d++) {
    a.push(c), c = ", ", M(this.Qb[d], a, b)
  }
  a.push(")")
};
var tc, uc;
function vc(a, b) {
  P.call(this, "Question", [a, b]);
  this.body = a;
  this.ca = b
}
A(vc, P);
function wc(a, b) {
  P.call(this, "OkayAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(wc, P);
function xc(a, b) {
  P.call(this, "KnownErrorAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(xc, P);
function yc(a, b) {
  P.call(this, "UnknownErrorAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(yc, P);
function zc(a) {
  P.call(this, "Cancellation", [a]);
  this.ca = a
}
A(zc, P);
function Ac(a) {
  P.call(this, "Notification", [a]);
  this.body = a
}
A(Ac, P);
function Bc(a) {
  if(a instanceof vc) {
    return"Q"
  }
  if(a instanceof wc) {
    return"K"
  }
  if(a instanceof xc) {
    return"E"
  }
  if(a instanceof yc) {
    return"U"
  }
  if(a instanceof zc) {
    return"C"
  }
  if(a instanceof Ac) {
    return"#"
  }
  f(Error("qanTypeToCode bug"))
}
function Cc(a) {
  var b = Bc(a);
  if(a instanceof zc) {
    return"" + a.ca + b
  }
  v(a.body) || f(Error("qanFrame.body must be a string, was " + N(a.body)));
  return a instanceof Ac ? a.body + b : a.body + "|" + ("" + a.ca) + b
}
function Dc(a) {
  B.call(this);
  this.message = a
}
A(Dc, B);
function Ec(a) {
  a = ec(a);
  a === k && f(new Dc("bad qid"));
  return a
}
function Fc(a) {
  a || f(new Dc("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if("#" == b) {
    return new Ac(bc(a))
  }
  if("C" == b) {
    var c = Ec(bc(a));
    return new zc(c)
  }
  a = a.split("|");
  c = a.splice(a.length - 1, a.length);
  0 < a.length && c.splice(0, 0, a.join("|"));
  a = c[0];
  c = c[1];
  u(c) || f(new Dc("Expected pipe char in frame"));
  c = Ec(bc(c));
  if("Q" == b) {
    return new vc(a, c)
  }
  if("K" == b) {
    return new wc(a, c)
  }
  if("E" == b) {
    return new xc(a, c)
  }
  if("U" == b) {
    return new yc(a, c)
  }
  f(new Dc("Invalid QAN frame type " + N(b)))
}
function Gc(a) {
  B.call(this);
  this.body = a
}
A(Gc, B);
Gc.prototype.message = "KnownError with arbitrary body";
Gc.prototype.v = function(a, b) {
  a.push("new KnownError(");
  M(this.body, a, b);
  a.push(")")
};
function Hc(a) {
  B.call(this);
  this.body = a
}
A(Hc, B);
Hc.prototype.message = "UnknownError with arbitrary body";
Hc.prototype.v = function(a, b) {
  a.push("new UnknownError(");
  M(this.body, a, b);
  a.push(")")
};
function Ic(a) {
  B.call(this);
  this.message = a
}
A(Ic, B);
function Q(a, b, c, d) {
  this.Zc = a;
  this.jb = b;
  this.da = c;
  this.Cb = d;
  this.Pb = 0;
  this.ma = new O;
  this.Za = new O
}
p = Q.prototype;
p.v = function(a) {
  a.push("<QANHelper asked ", "" + this.Pb, " questions, waiting for ", "" + this.ma.A(), " peer answers and ", "" + this.Za.A(), " local answers>")
};
p.vd = function(a) {
  if(a instanceof wc || a instanceof xc || a instanceof yc) {
    var b = a.ca, c = this.ma.get(b);
    this.ma.remove(b);
    u(c) ? c !== k && (a instanceof wc ? c.N(a.body) : a instanceof xc ? c.P(new Gc(a.body)) : a instanceof yc ? c.P(new Hc(a.body)) : f(Error("handleQANFrame bug"))) : this.Cb("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof Ac) {
      try {
        this.Zc(a.body, m)
      }catch(d) {
        this.jb("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof vc) {
        if(b = a.ca, this.Za.Z(b)) {
          this.Cb("Received Question with duplicate qid: " + b)
        }else {
          a: {
            a = [a.body, j];
            try {
              c = this.Zc.apply(k, a ? a : [])
            }catch(g) {
              c = Qb(g);
              break a
            }
            c = c instanceof L ? c : c instanceof Error ? Qb(c) : Pb(c)
          }
          this.Za.set(b, c);
          var e = this;
          c.Y(function(a) {
            var c = b;
            e.Za.remove(c);
            e.da(new wc(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Za.remove(c);
            a instanceof Gc ? e.da(new xc(a.body, c)) : a instanceof Ib ? e.da(new yc("CancelledError", c)) : (e.jb("Peer's Question #" + c + " caused uncaught exception", a), e.da(new yc("Uncaught exception", c)));
            return k
          });
          c.tb(function(a) {
            this.jb("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof zc && (b = a.ca, c = this.Za.get(b), u(c) && c.cancel())
      }
    }
  }
};
p.pe = function(a) {
  var b = this.Pb + 1;
  this.da(new vc(a, b));
  this.Pb += 1;
  var c = this, a = new L(function() {
    c.ma.set(b, k);
    c.da(new zc(b))
  });
  this.ma.set(b, a);
  return a
};
p.Ye = function(a) {
  this.da(new Ac(a))
};
p.nd = function(a) {
  for(var b = this.ma.T(), c = 0;c < b.length;c++) {
    var d = this.ma.get(b[c]);
    u(d) && (this.ma.set(b[c], k), d.P(new Ic(a)))
  }
};
function Jc() {
  this.Xd = pa()
}
var Kc = new Jc;
Jc.prototype.set = aa("Xd");
Jc.prototype.reset = function() {
  this.set(pa())
};
Jc.prototype.get = o("Xd");
function Lc(a) {
  this.af = a || "";
  this.lf = Kc
}
Lc.prototype.ee = j;
Lc.prototype.kf = j;
Lc.prototype.jf = j;
Lc.prototype.fe = m;
function Mc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Nc(a, b) {
  var c = (a.he - b) / 1E3, d = c.toFixed(3), g = 0;
  if(1 > c) {
    g = 2
  }else {
    for(;100 > c;) {
      g++, c *= 10
    }
  }
  for(;0 < g--;) {
    d = " " + d
  }
  return d
}
function Oc(a) {
  Lc.call(this, a)
}
A(Oc, Lc);
Oc.prototype.fe = j;
function Pc() {
  var a = Math.pow(10, 9);
  return a + Math.random() * (Math.pow(10, 10) - a)
}
;var Qc;
function Rc(a, b) {
  var c;
  c = a.className;
  c = v(c) && c.match(/\S+/g) || [];
  for(var d = nb(arguments, 1), g = c.length + d.length, e = c, h = 0;h < d.length;h++) {
    0 <= fb(e, d[h]) || e.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == g
}
;var Sc = !D || Wa();
!Ka && !D || D && Wa() || Ka && G("1.9.1");
D && G("9");
function Tc(a) {
  return a ? new Uc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Qc || (Qc = new Uc)
}
function R(a) {
  return v(a) ? document.getElementById(a) : a
}
var Vc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Wc(a, b, c) {
  return Xc(document, arguments)
}
function Xc(a, b) {
  var c = b[0], d = b[1];
  if(!Sc && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', C(d.name), '"');
    if(d.type) {
      c.push(' type="', C(d.type), '"');
      var g = {};
      cb(g, d);
      d = g;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  var e = a.createElement(c);
  d && (v(d) ? e.className = d : fa(d) ? Rc.apply(k, [e].concat(d)) : Za(d, function(a, b) {
    "style" == b ? e.style.cssText = a : "class" == b ? e.className = a : "for" == b ? e.htmlFor = a : b in Vc ? e.setAttribute(Vc[b], a) : 0 == b.lastIndexOf("aria-", 0) ? e.setAttribute(b, a) : e[b] = a
  }));
  2 < b.length && Yc(a, e, b, 2);
  return e
}
function Yc(a, b, c, d) {
  function g(c) {
    c && b.appendChild(v(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var e = c[d];
    if(ga(e) && !(ia(e) && 0 < e.nodeType)) {
      var h = gb, l;
      a: {
        if((l = e) && "number" == typeof l.length) {
          if(ia(l)) {
            l = "function" == typeof l.item || "string" == typeof l.item;
            break a
          }
          if(ja(l)) {
            l = "function" == typeof l.item;
            break a
          }
        }
        l = m
      }
      h(l ? mb(e) : e, g)
    }else {
      g(e)
    }
  }
}
function Uc(a) {
  this.za = a || s.document || document
}
p = Uc.prototype;
p.qd = Tc;
p.Ba = function(a) {
  return v(a) ? this.za.getElementById(a) : a
};
function Zc(a, b) {
  var c;
  c = a.za;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.bb = function(a, b, c) {
  return Xc(this.za, arguments)
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
function $c(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
function ad(a) {
  D ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[F ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function bd(a) {
  this.n = new O;
  a && this.ac(a)
}
function cd(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ka(a) : b.substr(0, 1) + a
}
p = bd.prototype;
p.A = function() {
  return this.n.A()
};
p.add = function(a) {
  this.n.set(cd(a), a)
};
p.ac = function(a) {
  for(var a = hc(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Fc = function(a) {
  for(var a = hc(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.n.remove(cd(a))
};
p.clear = function() {
  this.n.clear()
};
p.fb = function() {
  return this.n.fb()
};
p.contains = function(a) {
  return this.n.Z(cd(a))
};
p.C = function() {
  return this.n.C()
};
p.S = function() {
  return new bd(this)
};
p.K = function(a) {
  var b;
  if(b = this.A() == gc(a)) {
    var c = a, a = gc(c);
    this.A() > a ? b = m : (!(c instanceof bd) && 5 < a && (c = new bd(c)), b = lc(this, function(a) {
      if("function" == typeof c.contains) {
        a = c.contains(a)
      }else {
        if("function" == typeof c.ec) {
          a = c.ec(a)
        }else {
          if(ga(c) || v(c)) {
            a = 0 <= fb(c, a)
          }else {
            a: {
              for(var b in c) {
                if(c[b] == a) {
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
    }))
  }
  return b
};
function dd(a) {
  return ed(a || arguments.callee.caller, [])
}
function ed(a, b) {
  var c = [];
  if(0 <= fb(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(fd(a) + "(");
      for(var d = a.arguments, g = 0;g < d.length;g++) {
        0 < g && c.push(", ");
        var e;
        e = d[g];
        switch(typeof e) {
          case "object":
            e = e ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            e = "" + e;
            break;
          case "boolean":
            e = e ? "true" : "false";
            break;
          case "function":
            e = (e = fd(e)) ? e : "[fn]";
            break;
          default:
            e = typeof e
        }
        40 < e.length && (e = e.substr(0, 40) + "...");
        c.push(e)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(ed(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function fd(a) {
  if(gd[a]) {
    return gd[a]
  }
  a = "" + a;
  if(!gd[a]) {
    var b = /function ([^\(]+)/.exec(a);
    gd[a] = b ? b[1] : "[Anonymous]"
  }
  return gd[a]
}
var gd = {};
function hd(a, b, c, d, g) {
  this.reset(a, b, c, d, g)
}
hd.prototype.ff = 0;
hd.prototype.mc = k;
hd.prototype.lc = k;
var id = 0;
hd.prototype.reset = function(a, b, c, d, g) {
  this.ff = "number" == typeof g ? g : id++;
  this.he = d || pa();
  this.Sa = a;
  this.Ld = b;
  this.Te = c;
  delete this.mc;
  delete this.lc
};
hd.prototype.Ic = aa("Sa");
function S(a) {
  this.We = a
}
S.prototype.t = k;
S.prototype.Sa = k;
S.prototype.ia = k;
S.prototype.Oa = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var jd = new T("OFF", Infinity), kd = new T("SHOUT", 1200), ld = new T("SEVERE", 1E3), md = new T("WARNING", 900), nd = new T("INFO", 800), od = new T("CONFIG", 700), pd = new T("FINE", 500), qd = new T("FINER", 400), rd = new T("FINEST", 300), sd = new T("ALL", 0);
function U(a) {
  return V.sd(a)
}
p = S.prototype;
p.getParent = o("t");
p.Ic = aa("Sa");
function td(a) {
  if(a.Sa) {
    return a.Sa
  }
  if(a.t) {
    return td(a.t)
  }
  Aa("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= td(this).value) {
    a = this.Le(a, b, c);
    b = "log:" + a.Ld;
    s.console && (s.console.timeStamp ? s.console.timeStamp(b) : s.console.markTimeline && s.console.markTimeline(b));
    s.msWriteProfilerMark && s.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Oa) {
        for(var g = 0, e = i;e = c.Oa[g];g++) {
          e(d)
        }
      }
      b = b.getParent()
    }
  }
};
p.Le = function(a, b, c) {
  var d = new hd(a, "" + b, this.We);
  if(c) {
    d.mc = c;
    var g;
    var e = arguments.callee.caller;
    try {
      var h;
      var l = da("window.location.href");
      if(v(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:l, stack:"Not available"}
      }else {
        var n, q, z = m;
        try {
          n = c.lineNumber || c.Se || "Not available"
        }catch(r) {
          n = "Not available", z = j
        }
        try {
          q = c.fileName || c.filename || c.sourceURL || l
        }catch(w) {
          q = "Not available", z = j
        }
        h = z || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:q, stack:c.stack || "Not available"} : c
      }
      g = "Message: " + C(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + C(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + C(dd(e) + "-> ")
    }catch(E) {
      g = "Exception trying to expose exception! You win, we lose. " + E
    }
    d.lc = g
  }
  return d
};
p.hf = function(a, b) {
  this.log(kd, a, b)
};
p.H = function(a, b) {
  this.log(ld, a, b)
};
p.q = function(a, b) {
  this.log(md, a, b)
};
p.info = function(a, b) {
  this.log(nd, a, b)
};
p.xe = function(a, b) {
  this.log(od, a, b)
};
p.j = function(a, b) {
  this.log(pd, a, b)
};
p.He = function(a, b) {
  this.log(qd, a, b)
};
p.s = function(a, b) {
  this.log(rd, a, b)
};
var V = {Lb:{}, nb:k, zd:function() {
  V.nb || (V.nb = new S(""), V.Lb[""] = V.nb, V.nb.Ic(od))
}, Eg:function() {
  return V.Lb
}, oc:function() {
  V.zd();
  return V.nb
}, sd:function(a) {
  V.zd();
  return V.Lb[a] || V.ze(a)
}, Dg:function(a) {
  return function(b) {
    (a || V.oc()).H("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Se + ")")
  }
}, ze:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.sd(a.substr(0, c));
  c.ia || (c.ia = {});
  c.ia[d] = b;
  b.t = c;
  return V.Lb[a] = b
}};
function ud(a) {
  this.Vd = x(this.ne, this);
  this.pd = new Oc;
  this.Bd = this.pd.ee = m;
  this.h = a;
  this.Fe = this.h.ownerDocument || this.h.document;
  var a = Tc(this.h), b = k;
  if(D) {
    b = a.za.createStyleSheet(), ad(b)
  }else {
    var c = Zc(a, "head")[0];
    c || (b = Zc(a, "body")[0], c = a.bb("head"), b.parentNode.insertBefore(c, b));
    b = a.bb("style");
    ad(b);
    a.appendChild(c, b)
  }
  this.h.className += " logdiv"
}
ud.prototype.gf = function(a) {
  if(a != this.Bd) {
    var b = V.oc();
    if(a) {
      var c = this.Vd;
      b.Oa || (b.Oa = []);
      b.Oa.push(c)
    }else {
      (b = b.Oa) && kb(b, this.Vd), this.Gg = ""
    }
    this.Bd = a
  }
};
ud.prototype.ne = function(a) {
  var b = 100 >= this.h.scrollHeight - this.h.scrollTop - this.h.clientHeight, c = this.Fe.createElement("div");
  c.className = "logmsg";
  var d = this.pd, g;
  switch(a.Sa.value) {
    case kd.value:
      g = "dbg-sh";
      break;
    case ld.value:
      g = "dbg-sev";
      break;
    case md.value:
      g = "dbg-w";
      break;
    case nd.value:
      g = "dbg-i";
      break;
    default:
      g = "dbg-f"
  }
  var e = [];
  e.push(d.af, " ");
  if(d.ee) {
    var h = new Date(a.he);
    e.push("[", Mc(h.getFullYear() - 2E3) + Mc(h.getMonth() + 1) + Mc(h.getDate()) + " " + Mc(h.getHours()) + ":" + Mc(h.getMinutes()) + ":" + Mc(h.getSeconds()) + "." + Mc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.kf && e.push("[", xa(Nc(a, d.lf.get())), "s] ");
  d.jf && e.push("[", C(a.Te), "] ");
  e.push('<span class="', g, '">', ra(xa(C(a.Ld))));
  d.fe && a.mc && e.push("<br>", ra(xa(a.lc || "")));
  e.push("</span><br>");
  c.innerHTML = e.join("");
  this.h.appendChild(c);
  b && (this.h.scrollTop = this.h.scrollHeight)
};
ud.prototype.clear = function() {
  this.h.innerHTML = ""
};
var vd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function xd(a, b) {
  var c = a.match(vd), d = b.match(vd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function yd(a, b) {
  var c;
  if(a instanceof yd) {
    this.L = u(b) ? b : a.L, zd(this, a.ta), c = a.Ka, W(this), this.Ka = c, Ad(this, a.ka), Bd(this, a.Ua), Cd(this, a.na), Dd(this, a.Q.S()), c = a.Aa, W(this), this.Aa = c
  }else {
    if(a && (c = ("" + a).match(vd))) {
      this.L = !!b;
      zd(this, c[1] || "", j);
      var d = c[2] || "";
      W(this);
      this.Ka = d ? decodeURIComponent(d) : "";
      Ad(this, c[3] || "", j);
      Bd(this, c[4]);
      Cd(this, c[5] || "", j);
      Dd(this, c[6] || "", j);
      c = c[7] || "";
      W(this);
      this.Aa = c ? decodeURIComponent(c) : ""
    }else {
      this.L = !!b, this.Q = new Ed(k, 0, this.L)
    }
  }
}
p = yd.prototype;
p.ta = "";
p.Ka = "";
p.ka = "";
p.Ua = k;
p.na = "";
p.Aa = "";
p.Re = m;
p.L = m;
p.toString = function() {
  var a = [], b = this.ta;
  b && a.push(Fd(b, Gd), ":");
  if(b = this.ka) {
    a.push("//");
    var c = this.Ka;
    c && a.push(Fd(c, Gd), "@");
    a.push(encodeURIComponent("" + b));
    b = this.Ua;
    b != k && a.push(":", "" + b)
  }
  if(b = this.na) {
    this.ka && "/" != b.charAt(0) && a.push("/"), a.push(Fd(b, "/" == b.charAt(0) ? Hd : Id))
  }
  (b = this.Q.toString()) && a.push("?", b);
  (b = this.Aa) && a.push("#", Fd(b, Jd));
  return a.join("")
};
p.S = function() {
  return new yd(this)
};
function zd(a, b, c) {
  W(a);
  a.ta = c ? b ? decodeURIComponent(b) : "" : b;
  a.ta && (a.ta = a.ta.replace(/:$/, ""))
}
function Ad(a, b, c) {
  W(a);
  a.ka = c ? b ? decodeURIComponent(b) : "" : b
}
function Bd(a, b) {
  W(a);
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.Ua = b) : a.Ua = k
}
function Cd(a, b, c) {
  W(a);
  a.na = c ? b ? decodeURIComponent(b) : "" : b
}
function Dd(a, b, c) {
  W(a);
  b instanceof Ed ? (a.Q = b, a.Q.Hc(a.L)) : (c || (b = Fd(b, Kd)), a.Q = new Ed(b, 0, a.L))
}
function W(a) {
  a.Re && f(Error("Tried to modify a read-only Uri"))
}
p.Hc = function(a) {
  this.L = a;
  this.Q && this.Q.Hc(a);
  return this
};
function Ld(a) {
  return a instanceof yd ? a.S() : new yd(a, i)
}
function Fd(a, b) {
  return v(a) ? encodeURI(a).replace(b, Md) : k
}
function Md(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Gd = /[#\/\?@]/g, Id = /[\#\?:]/g, Hd = /[\#\?]/g, Kd = /[\#\?@]/g, Jd = /#/g;
function Ed(a, b, c) {
  this.F = a || k;
  this.L = !!c
}
function Nd(a) {
  if(!a.l && (a.l = new O, a.c = 0, a.F)) {
    for(var b = a.F.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), g = k, e = k;
      0 <= d ? (g = b[c].substring(0, d), e = b[c].substring(d + 1)) : g = b[c];
      g = decodeURIComponent(g.replace(/\+/g, " "));
      g = Od(a, g);
      a.add(g, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
    }
  }
}
p = Ed.prototype;
p.l = k;
p.c = k;
p.A = function() {
  Nd(this);
  return this.c
};
p.add = function(a, b) {
  Nd(this);
  this.F = k;
  var a = Od(this, a), c = this.l.get(a);
  c || this.l.set(a, c = []);
  c.push(b);
  this.c++;
  return this
};
p.remove = function(a) {
  Nd(this);
  a = Od(this, a);
  return this.l.Z(a) ? (this.F = k, this.c -= this.l.get(a).length, this.l.remove(a)) : m
};
p.clear = function() {
  this.l = this.F = k;
  this.c = 0
};
p.fb = function() {
  Nd(this);
  return 0 == this.c
};
p.Z = function(a) {
  Nd(this);
  a = Od(this, a);
  return this.l.Z(a)
};
p.ec = function(a) {
  var b = this.C();
  return 0 <= fb(b, a)
};
p.T = function() {
  Nd(this);
  for(var a = this.l.C(), b = this.l.T(), c = [], d = 0;d < b.length;d++) {
    for(var g = a[d], e = 0;e < g.length;e++) {
      c.push(b[d])
    }
  }
  return c
};
p.C = function(a) {
  Nd(this);
  var b = [];
  if(a) {
    this.Z(a) && (b = lb(b, this.l.get(Od(this, a))))
  }else {
    for(var a = this.l.C(), c = 0;c < a.length;c++) {
      b = lb(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  Nd(this);
  this.F = k;
  a = Od(this, a);
  this.Z(a) && (this.c -= this.l.get(a).length);
  this.l.set(a, [b]);
  this.c++;
  return this
};
p.get = function(a, b) {
  var c = a ? this.C(a) : [];
  return 0 < c.length ? c[0] : b
};
p.toString = function() {
  if(this.F) {
    return this.F
  }
  if(!this.l) {
    return""
  }
  for(var a = [], b = this.l.T(), c = 0;c < b.length;c++) {
    for(var d = b[c], g = encodeURIComponent("" + d), d = this.C(d), e = 0;e < d.length;e++) {
      var h = g;
      "" !== d[e] && (h += "=" + encodeURIComponent("" + d[e]));
      a.push(h)
    }
  }
  return this.F = a.join("&")
};
p.S = function() {
  var a = new Ed;
  a.F = this.F;
  this.l && (a.l = this.l.S());
  return a
};
function Od(a, b) {
  var c = "" + b;
  a.L && (c = c.toLowerCase());
  return c
}
p.Hc = function(a) {
  a && !this.L && (Nd(this), this.F = k, jc(this.l, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.remove(d), 0 < a.length && (this.F = k, this.l.set(Od(this, d), mb(a)), this.c += a.length))
  }, this));
  this.L = a
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
  f(Error("cannot determine size of object type " + b))
}
;function Qd(a, b) {
  this.La = a;
  this.Ha = b
}
Qd.prototype.K = function(a) {
  return a instanceof Qd && this.La == a.La && this.Ha.join(",") == a.Ha
};
Qd.prototype.v = function(a, b) {
  a.push("new SACK(", "" + this.La, ", ");
  M(this.Ha, a, b);
  a.push(")")
};
function Rd() {
  this.G = new O
}
Rd.prototype.ya = -1;
Rd.prototype.I = 0;
Rd.prototype.append = function(a) {
  var b = Pd(a);
  this.G.set(this.ya + 1, [a, b]);
  this.ya += 1;
  this.I += b
};
Rd.prototype.v = function(a) {
  a.push("<Queue with ", "" + this.G.A(), " item(s), counter=#", "" + this.ya, ", size=", "" + this.I, ">")
};
function Sd(a) {
  a = a.G.T();
  H.sort.call(a, ob);
  return a
}
function Td() {
  this.wa = new O
}
Td.prototype.Ea = -1;
Td.prototype.I = 0;
function Ud(a) {
  var b = a.wa.T();
  H.sort.call(b, ob);
  return new Qd(a.Ea, b)
}
var Vd = {};
function Wd(a, b) {
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
          Object.prototype.hasOwnProperty.call(b, c) && "function" != t(b[c]) && (a.push('<property id="', C(c), '">'), Wd(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function Xd(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, g = arguments;
  d.push("<arguments>");
  for(var e = g.length, h = 1;h < e;h++) {
    Wd(d, g[h])
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
  this.Ne = a;
  this.g = []
}
A(he, I);
var ie = [];
he.prototype.Fc = function() {
  gb(this.g, Bb);
  this.g.length = 0
};
he.prototype.d = function() {
  he.m.d.call(this);
  this.Fc()
};
he.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function je() {
}
je.rd = function() {
  return je.Ad ? je.Ad : je.Ad = new je
};
je.prototype.Xe = 0;
je.rd();
function ke(a) {
  this.ic = a || Tc();
  this.ef = le
}
A(ke, Gb);
ke.prototype.Qe = je.rd();
var le = k;
p = ke.prototype;
p.U = k;
p.Da = m;
p.h = k;
p.ef = k;
p.Ve = k;
p.t = k;
p.ia = k;
p.xb = k;
p.wf = m;
function me(a) {
  return a.U || (a.U = ":" + (a.Qe.Xe++).toString(36))
}
p.Ba = o("h");
p.getParent = o("t");
p.Jc = function(a) {
  this.t && this.t != a && f(Error("Method not supported"));
  ke.m.Jc.call(this, a)
};
p.qd = o("ic");
p.bb = function() {
  this.h = this.ic.createElement("div")
};
p.zb = function() {
  this.Da = j;
  ne(this, function(a) {
    !a.Da && a.Ba() && a.zb()
  })
};
function oe(a) {
  ne(a, function(a) {
    a.Da && oe(a)
  });
  a.Gb && a.Gb.Fc();
  a.Da = m
}
p.d = function() {
  ke.m.d.call(this);
  this.Da && oe(this);
  this.Gb && (this.Gb.b(), delete this.Gb);
  ne(this, function(a) {
    a.b()
  });
  if(!this.wf && this.h) {
    var a = this.h;
    a && a.parentNode && a.parentNode.removeChild(a)
  }
  this.t = this.Ve = this.h = this.xb = this.ia = k
};
function ne(a, b) {
  a.ia && gb(a.ia, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = v(a) ? a : me(a), d;
    this.xb && c ? (d = this.xb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.xb, c in d && delete d[c], kb(this.ia, a), b && (oe(a), a.h && (c = a.h) && c.parentNode && c.parentNode.removeChild(c)), c = a, c == k && f(Error("Unable to set parent component")), c.t = k, ke.m.Jc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function pe(a, b) {
  ke.call(this, b);
  this.Je = a;
  this.kc = new he(this);
  this.Db = new O
}
A(pe, ke);
p = pe.prototype;
p.a = U("goog.ui.media.FlashObject");
p.yf = "window";
p.Yc = "#000000";
p.oe = "sameDomain";
function qe(a, b, c) {
  a.Vc = v(b) ? b : Math.round(b) + "px";
  a.qc = v(c) ? c : Math.round(c) + "px";
  a.Ba() && (b = a.Ba() ? a.Ba().firstChild : k, c = a.Vc, a = a.qc, a == i && f(Error("missing height argument")), b.style.width = $c(c), b.style.height = $c(a))
}
p.zb = function() {
  pe.m.zb.call(this);
  var a = this.Ba(), b;
  b = D ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = D ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = qa(c, this.yf), d = this.Db.T(), g = this.Db.C(), e = [], h = 0;h < d.length;h++) {
    e.push(encodeURIComponent("" + d[h]) + "=" + encodeURIComponent("" + g[h]))
  }
  b = qa(b, me(this), me(this), "goog-ui-media-flash-object", C(this.Je), C(e.join("&")), this.Yc, this.oe, c);
  a.innerHTML = b;
  this.Vc && this.qc && qe(this, this.Vc, this.qc);
  a = this.kc;
  b = this.Ba();
  c = $a(pb);
  fa(c) || (ie[0] = c, c = ie);
  for(d = 0;d < c.length;d++) {
    a.g.push(xb(b, c[d], sb || a, m, a.Ne || a))
  }
};
p.bb = function() {
  this.Zd != k && !(0 <= ya(ge, this.Zd)) && (this.a.q("Required flash version not found:" + this.Zd), f(Error("Method not supported")));
  var a = this.qd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.h = a
};
p.d = function() {
  pe.m.d.call(this);
  this.Db = k;
  this.kc.b();
  this.kc = k
};
function re(a) {
  B.call(this, a)
}
A(re, B);
re.prototype.name = "cw.loadflash.FlashLoadFailed";
s.__loadFlashObject_callbacks = {};
function se(a, b) {
  this.U = "_" + ac();
  this.Xb = a;
  this.pa = b;
  this.va = a.va
}
A(se, I);
p = se.prototype;
p.Fa = j;
p.yb = m;
p.a = U("cw.net.FlashSocket");
p.v = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.U);
  a.push("'>")
};
function te(a, b, c) {
  if("frames" == b) {
    a = a.pa, ue(a.w), ve(a.w, c)
  }else {
    if("stillreceiving" == b) {
      c = a.pa, c.a.s("onstillreceiving"), ue(c.w)
    }else {
      if("connect" == b) {
        a.pa.onconnect()
      }else {
        "close" == b ? (a.Fa = m, a.b()) : "ioerror" == b ? (a.Fa = m, b = a.pa, b.a.q("onioerror: " + N(c)), we(b.w, m), a.b()) : "securityerror" == b ? (a.Fa = m, b = a.pa, b.a.q("onsecurityerror: " + N(c)), we(b.w, m), a.b()) : f(Error("bad event: " + b))
      }
    }
  }
}
p.dc = function(a, b) {
  try {
    var c = this.va.CallFunction(Xd("__FC_connect", this.U, a, b, "<int32/>\n"))
  }catch(d) {
    this.a.H("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message);
    this.yb = j;
    this.Fa = m;
    this.b();
    return
  }
  '"OK"' != c && f(Error("__FC_connect failed? ret: " + c))
};
p.sb = function(a) {
  try {
    var b = this.va.CallFunction(Xd("__FC_writeFrames", this.U, a))
  }catch(c) {
    this.a.H("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message);
    this.yb = j;
    this.Fa = m;
    this.b();
    return
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.q("Flash no longer knows of " + this.U + "; disposing."), this.b()) : f(Error("__FC_writeFrames failed? ret: " + b)))
};
p.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Fa);
  se.m.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Fa) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(Xd("__FC_close", this.U)))
    }catch(b) {
      this.a.H("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.yb = j
    }
  }
  if(this.yb) {
    a = this.pa, a.a.q("oncrash"), we(a.w, j)
  }else {
    this.pa.onclose()
  }
  delete this.pa;
  delete this.Xb.Pa[this.U]
};
function xe(a, b) {
  this.o = a;
  this.va = b;
  this.Pa = {};
  this.cc = "__FST_" + ac();
  s[this.cc] = x(this.Ee, this);
  var c = b.CallFunction(Xd("__FC_setCallbackFunc", this.cc));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(xe, I);
p = xe.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.v = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  M(this.Pa, a, b);
  a.push(">")
};
p.gc = function(a) {
  a = new se(this, a);
  return this.Pa[a.U] = a
};
p.Ce = function(a, b, c, d) {
  var g = this.Pa[a];
  g ? "frames" == b && d ? (te(g, "ioerror", "FlashConnector hadError while handling data."), g.b()) : te(g, b, c) : this.a.q("Cannot dispatch because we have no instance: " + N([a, b, c, d]))
};
p.Ee = function(a, b, c, d) {
  try {
    var g = this.o;
    g.Ab.push([this.Ce, this, [a, b, c, d]]);
    g.Qc == k && (g.Qc = g.z.setTimeout(g.ue, 0))
  }catch(e) {
    s.window.setTimeout(function() {
      f(e)
    }, 0)
  }
};
p.d = function() {
  xe.m.d.call(this);
  for(var a = $a(this.Pa);a.length;) {
    a.pop().b()
  }
  delete this.Pa;
  delete this.va;
  s[this.cc] = i
};
function ye(a) {
  this.w = a;
  this.ab = []
}
A(ye, I);
p = ye.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.sb = function(a) {
  this.ab ? (this.a.s("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.ab.push.apply(this.ab, a)) : (this.a.s("writeFrames: Writing " + a.length + " frame(s)."), this.Ub.sb(a))
};
p.dc = function(a, b) {
  this.Ub.dc(a, b)
};
p.onconnect = function() {
  this.a.info("onconnect");
  ue(this.w);
  var a = this.ab;
  this.ab = k;
  a.length && (this.a.s("onconnect: Writing " + a.length + " buffered frame(s)."), this.Ub.sb(a))
};
p.onclose = function() {
  this.a.info("onclose");
  we(this.w, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  ye.m.d.call(this);
  this.Ub.b();
  delete this.w
};
var ze = [];
function Ae() {
  var a = new L;
  ze.push(a);
  return a
}
function Be(a) {
  var b = ze;
  ze = [];
  gb(b, function(b) {
    b.N(a)
  });
  return k
}
function Ce(a) {
  var b = ze;
  ze = [];
  gb(b, function(b) {
    b.P(a)
  });
  return k
}
;function X(a) {
  B.call(this, a)
}
A(X, B);
X.prototype.name = "cw.net.InvalidFrame";
function Y() {
  var a = [];
  this.O(a);
  return a.join("")
}
function De() {
}
De.prototype.K = function(a, b) {
  return!(a instanceof De) ? m : sc(Ee(this), Ee(a), b)
};
De.prototype.v = function(a, b) {
  a.push("<HelloFrame properties=");
  M(Ee(this), a, b);
  a.push(">")
};
function Ee(a) {
  return[a.fa, a.Td, a.xd, a.Yd, a.pb, a.Nc, a.Md, a.Kd, a.xc, a.Id, a.je, a.ge, a.sa, a.Jb]
}
De.prototype.J = Y;
De.prototype.O = function(a) {
  var b = {};
  b.tnum = this.fa;
  b.ver = this.Td;
  b.format = this.xd;
  b["new"] = this.Yd;
  b.id = this.pb;
  b.ming = this.Nc;
  b.pad = this.Md;
  b.maxb = this.Kd;
  u(this.xc) && (b.maxt = this.xc);
  b.maxia = this.Id;
  b.tcpack = this.je;
  b.eeds = this.ge;
  b.sack = this.sa instanceof Qd ? bc((new Fe(this.sa)).J()) : this.sa;
  b.seenack = this.Jb instanceof Qd ? bc((new Fe(this.Jb)).J()) : this.Jb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(Ub(b), "H")
};
function Ge(a) {
  P.call(this, "StringFrame", [a]);
  this.Pc = a
}
A(Ge, P);
Ge.prototype.J = Y;
Ge.prototype.O = function(a) {
  a.push(this.Pc, " ")
};
function He(a) {
  P.call(this, "CommentFrame", [a]);
  this.we = a
}
A(He, P);
He.prototype.J = Y;
He.prototype.O = function(a) {
  a.push(this.we, "^")
};
function Ie(a) {
  P.call(this, "SeqNumFrame", [a]);
  this.de = a
}
A(Ie, P);
Ie.prototype.J = Y;
Ie.prototype.O = function(a) {
  a.push("" + this.de, "N")
};
function Je(a) {
  var b = a.split("|");
  if(2 != b.length) {
    return k
  }
  a: {
    var c = b[1], a = fc;
    if(dc.test(c) && (c = parseInt(c, 10), -1 <= c && c <= a)) {
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
    for(var b = b[0].split(","), d = 0, g = b.length;d < g;d++) {
      var e = ec(b[d]);
      if(e == k) {
        return k
      }
      c.push(e)
    }
  }
  return new Qd(a, c)
}
function Fe(a) {
  P.call(this, "SackFrame", [a]);
  this.sa = a
}
A(Fe, P);
Fe.prototype.J = Y;
Fe.prototype.O = function(a) {
  var b = this.sa;
  a.push(b.Ha.join(","), "|", "" + b.La);
  a.push("A")
};
function Ke(a) {
  P.call(this, "StreamStatusFrame", [a]);
  this.Ed = a
}
A(Ke, P);
Ke.prototype.J = Y;
Ke.prototype.O = function(a) {
  var b = this.Ed;
  a.push(b.Ha.join(","), "|", "" + b.La);
  a.push("T")
};
function Ne() {
  P.call(this, "StreamCreatedFrame", [])
}
A(Ne, P);
Ne.prototype.J = Y;
Ne.prototype.O = function(a) {
  a.push("C")
};
function Oe() {
  P.call(this, "YouCloseItFrame", [])
}
A(Oe, P);
Oe.prototype.J = Y;
Oe.prototype.O = function(a) {
  a.push("Y")
};
function Pe(a, b) {
  P.call(this, "ResetFrame", [a, b]);
  this.Wd = a;
  this.Xc = b
}
A(Pe, P);
Pe.prototype.J = Y;
Pe.prototype.O = function(a) {
  a.push(this.Wd, "|", "" + Number(this.Xc), "!")
};
var Qe = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Re(a) {
  P.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(Re, P);
Re.prototype.J = Y;
Re.prototype.O = function(a) {
  a.push(this.reason, "K")
};
function Se(a) {
  a || f(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new Ge(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = Je(bc(a)), a == k && f(new X("bad sack")), new Fe(a)
  }
  if("N" == b) {
    return a = ec(bc(a)), a == k && f(new X("bad seqNum")), new Ie(a)
  }
  if("T" == b) {
    return a = Je(bc(a)), a == k && f(new X("bad lastSackSeen")), new Ke(a)
  }
  if("Y" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Oe
  }
  if("^" == b) {
    return new He(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Ne
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && f(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && f(new X("bad applicationLevel")), new Pe(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = Qe[a], a == k && f(new X("unknown kill reason: " + a)), new Re(a)
  }
  f(new X("Invalid frame type " + b))
}
;function Te(a, b, c, d) {
  this.contentWindow = a;
  this.Bb = b;
  this.Oc = c;
  this.Ke = d
}
Te.prototype.v = function(a, b) {
  a.push("<XDRFrame frameId=");
  M(this.Ke, a, b);
  a.push(", expandedUrl=");
  M(this.Bb, a, b);
  a.push(", streams=");
  M(this.Oc, a, b);
  a.push(">")
};
function Ue() {
  this.frames = [];
  this.vc = new O
}
Ue.prototype.a = U("cw.net.XDRTracker");
function Ve(a, b) {
  for(var c = We, d = 0;d < c.frames.length;d++) {
    var g = c.frames[d], e;
    if(e = 0 == g.Oc.length) {
      e = g.Bb;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      e = RegExp("^" + h + "$").test(e)
    }
    if(e) {
      return c.a.info("Giving " + N(b) + " existing frame " + N(g)), Pb(g)
    }
  }
  d = ac() + ac();
  g = a.replace(/%random%/g, function() {
    return"ml" + Math.floor(Pc()) + ("" + Math.floor(Pc()))
  });
  e = s.location;
  e instanceof yd || (e = Ld(e));
  g instanceof yd || (g = Ld(g));
  var l = e;
  e = g;
  g = l.S();
  (h = !!e.ta) ? zd(g, e.ta) : h = !!e.Ka;
  if(h) {
    var n = e.Ka;
    W(g);
    g.Ka = n
  }else {
    h = !!e.ka
  }
  h ? Ad(g, e.ka) : h = e.Ua != k;
  n = e.na;
  if(h) {
    Bd(g, e.Ua)
  }else {
    if(h = !!e.na) {
      if("/" != n.charAt(0) && (l.ka && !l.na ? n = "/" + n : (l = g.na.lastIndexOf("/"), -1 != l && (n = g.na.substr(0, l + 1) + n))), ".." == n || "." == n) {
        n = ""
      }else {
        if(!(-1 == n.indexOf("./") && -1 == n.indexOf("/."))) {
          for(var l = 0 == n.lastIndexOf("/", 0), n = n.split("/"), q = [], z = 0;z < n.length;) {
            var r = n[z++];
            "." == r ? l && z == n.length && q.push("") : ".." == r ? ((1 < q.length || 1 == q.length && "" != q[0]) && q.pop(), l && z == n.length && q.push("")) : (q.push(r), l = j)
          }
          n = q.join("/")
        }
      }
    }
  }
  h ? Cd(g, n) : h = "" !== e.Q.toString();
  h ? Dd(g, e.Q.toString() ? decodeURIComponent(e.Q.toString()) : "") : h = !!e.Aa;
  h && (e = e.Aa, W(g), g.Aa = e);
  g = g.toString();
  e = ("" + s.location).match(vd)[3] || k;
  h = g.match(vd)[3] || k;
  e == h ? (c.a.info("No need to make a real XDRFrame for " + N(b)), c = Pb(new Te(s, g, [b], k))) : ((e = R("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new L, c.vc.set(d, [h, g, b]), c.a.info("Creating new XDRFrame " + N(d) + "for " + N(b)), c = Wc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:g + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), e.appendChild(c), c = h);
  return c
}
Ue.prototype.Af = function(a) {
  var b = this.vc.get(a);
  b || f(Error("Unknown frameId " + N(a)));
  this.vc.remove(b);
  var c = b[0], a = new Te(R("minerva-xdrframe-" + a).contentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var We = new Ue;
s.__XHRTracker_xdrFrameLoaded = x(We.Af, We);
var Xe;
Xe = m;
var Ye = Ga();
Ye && (-1 != Ye.indexOf("Firefox") || -1 != Ye.indexOf("Camino") || -1 != Ye.indexOf("iPhone") || -1 != Ye.indexOf("iPod") || -1 != Ye.indexOf("iPad") || -1 != Ye.indexOf("Android") || -1 != Ye.indexOf("Chrome") && (Xe = j));
var Ze = Xe;
function $e(a, b, c, d, g, e) {
  L.call(this, g, e);
  this.Hd = a;
  this.hc = [];
  this.od = !!b;
  this.Ie = !!c;
  this.ye = !!d;
  for(b = 0;b < a.length;b++) {
    a[b].Y(x(this.ud, this, b, j), x(this.ud, this, b, m))
  }
  0 == a.length && !this.od && this.N(this.hc)
}
A($e, L);
$e.prototype.Od = 0;
$e.prototype.ud = function(a, b, c) {
  this.Od++;
  this.hc[a] = [b, c];
  this.$ || (this.od && b ? this.N([a, c]) : this.Ie && !b ? this.P(c) : this.Od == this.Hd.length && this.N(this.hc));
  this.ye && !b && (c = k);
  return c
};
$e.prototype.P = function(a) {
  $e.m.P.call(this, a);
  gb(this.Hd, function(a) {
    a.cancel()
  })
};
function af(a, b) {
  this.zf = a;
  this.Jd = b
}
af.prototype.tc = 0;
af.prototype.Mb = 0;
af.prototype.nc = m;
function bf(a) {
  var b = [];
  if(a.nc) {
    return[b, 2]
  }
  var c = a.tc, d = a.zf.responseText;
  for(a.tc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var g = d.substr(a.Mb, c - a.Mb), g = g.replace(/\r$/, "");
    if(g.length > a.Jd) {
      return a.nc = j, [b, 2]
    }
    b.push(g);
    a.Mb = c += 1
  }
  return a.tc - a.Mb - 1 > a.Jd ? (a.nc = j, [b, 2]) : [b, 1]
}
;function cf(a, b, c) {
  this.w = b;
  this.R = a;
  this.fc = c
}
A(cf, I);
p = cf.prototype;
p.a = U("cw.net.XHRMaster");
p.qa = -1;
p.wc = function(a, b, c) {
  this.fc.__XHRSlave_makeRequest(this.R, a, b, c)
};
p.la = o("qa");
p.zc = function(a, b) {
  1 != b && this.a.H(N(this.R) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  ue(this.w);
  ve(this.w, a)
};
p.Ac = function(a) {
  this.a.j("ongotheaders_: " + N(a));
  var b = k;
  "Content-Length" in a && (b = ec(a["Content-Length"]));
  a = this.w;
  a.a.j(a.k() + " got Content-Length: " + b);
  a.X == df && (b == k && (a.a.q("Expected to receive a valid Content-Length, but did not."), b = 5E5), ef(a, 2E3 + 1E3 * (b / 3072)))
};
p.Bc = function(a) {
  1 != a && this.a.j(this.w.k() + "'s XHR's readyState is " + a);
  this.qa = a;
  2 <= this.qa && ue(this.w)
};
p.yc = function() {
  this.w.b()
};
p.d = function() {
  cf.m.d.call(this);
  delete Z.ba[this.R];
  this.fc.__XHRSlave_dispose(this.R);
  delete this.fc
};
function ff() {
  this.ba = {}
}
A(ff, I);
p = ff.prototype;
p.a = U("cw.net.XHRMasterTracker");
p.gc = function(a, b) {
  var c = "_" + ac(), d = new cf(c, a, b);
  return this.ba[c] = d
};
p.zc = function(a, b, c) {
  if(Ka) {
    for(var d = [], g = 0, e = b.length;g < e;g++) {
      d[g] = b[g]
    }
    b = d
  }else {
    b = lb(b)
  }
  (d = this.ba[a]) ? d.zc(b, c) : this.a.H("onframes_: no master for " + N(a))
};
p.Ac = function(a, b) {
  var c = this.ba[a];
  c ? c.Ac(b) : this.a.H("ongotheaders_: no master for " + N(a))
};
p.Bc = function(a, b) {
  var c = this.ba[a];
  c ? c.Bc(b) : this.a.H("onreadystatechange_: no master for " + N(a))
};
p.yc = function(a) {
  var b = this.ba[a];
  b ? (delete this.ba[b.R], b.yc()) : this.a.H("oncomplete_: no master for " + N(a))
};
p.d = function() {
  ff.m.d.call(this);
  for(var a = $a(this.ba);a.length;) {
    a.pop().b()
  }
  delete this.ba
};
var Z = new ff;
s.__XHRMaster_onframes = x(Z.zc, Z);
s.__XHRMaster_oncomplete = x(Z.yc, Z);
s.__XHRMaster_ongotheaders = x(Z.Ac, Z);
s.__XHRMaster_onreadystatechange = x(Z.Bc, Z);
function gf(a, b, c) {
  this.V = a;
  this.host = b;
  this.port = c
}
function hf(a, b, c) {
  this.host = a;
  this.port = b;
  this.sf = c
}
function jf(a, b) {
  b || (b = a);
  this.V = a;
  this.ua = b
}
jf.prototype.v = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  M(this.V, a, b);
  a.push(", secondaryUrl=");
  M(this.ua, a, b);
  a.push(">")
};
function kf(a, b, c, d) {
  this.V = a;
  this.Sd = b;
  this.ua = c;
  this.be = d;
  (!(0 == this.V.indexOf("http://") || 0 == this.V.indexOf("https://")) || !(0 == this.ua.indexOf("http://") || 0 == this.ua.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Sd.location.href;
  xd(this.V, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.be.location.href;
  xd(this.ua, a) || f(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
kf.prototype.v = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  M(this.V, a, b);
  a.push(", secondaryUrl=");
  M(this.ua, a, b);
  a.push(">")
};
var lf = new He(";)]}");
function mf() {
}
function nf(a) {
  s.setTimeout(function() {
    u(a.message) && a.stack && (a.message += "\n" + a.stack);
    f(a)
  }, 0)
}
function of(a, b, c) {
  u(b) || (b = j);
  u(c) || (c = j);
  this.Va = a;
  this.vf = b;
  this.pf = c
}
p = of.prototype;
p.a = U("cw.net.QANProtocolWrapper");
p.jb = function(a, b) {
  this.a.q(a, b);
  this.pf && nf(b)
};
p.da = function(a) {
  this.Ya.ce(Cc(a), this.vf)
};
p.Cb = function(a) {
  this.Ya.reset("QANHelper said: " + a)
};
p.nf = function(a) {
  this.Ya = a;
  this.Ec = new Q(x(this.Va.bodyReceived, this.Va), x(this.jb, this), x(this.da, this), x(this.Cb, this));
  this.Va.streamStarted.call(this.Va, this.Ya, this.Ec)
};
p.mf = function(a, b) {
  this.Ec.nd("Stream reset applicationLevel=" + N(b) + ", reason: " + a);
  this.Va.streamReset.call(this.Va, a, b)
};
p.of = function(a) {
  try {
    var b = Fc(a)
  }catch(c) {
    c instanceof Dc || f(c);
    this.Ya.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Ec.vd(b)
};
function pf(a) {
  this.Ya = a
}
pf.prototype.v = function(a, b) {
  a.push("<UserContext for ");
  M(this.Ya, a, b);
  a.push(">")
};
pf.prototype.toString = function() {
  return N(this)
};
function qf(a, b, c, d) {
  P.call(this, "TransportInfo", [a, b, c, d]);
  this.fa = a;
  this.Fg = b;
  this.Jg = c;
  this.Kg = d
}
A(qf, P);
function $(a, b, c) {
  this.r = a;
  this.Ig = b ? b : new mf;
  this.o = c ? c : Sb;
  this.qb = new bd;
  this.pb = ac() + ac();
  this.W = new Rd;
  this.sc = new Td;
  this.rb = k;
  this.Yb = [];
  this.Ja = new pf(this);
  this.te = x(this.tf, this);
  F && (this.rb = zb(s, "load", this.df, m, this))
}
A($, I);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Fd = new Qd(-1, []);
p.Gd = new Qd(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = k;
p.onstarted = k;
p.Cc = k;
p.Dc = k;
p.onreset = k;
p.ondisconnect = k;
p.Xa = k;
p.Lc = m;
p.Gc = m;
p.B = "1_UNSTARTED";
p.Rc = -1;
p.e = k;
p.p = k;
p.lb = k;
p.Mc = 0;
p.Rd = 0;
p.ae = 0;
p.v = function(a, b) {
  a.push("<ClientStream id=");
  M(this.pb, a, b);
  a.push(", state=", "" + this.B);
  a.push(", primary=");
  M(this.e, a, b);
  a.push(", secondary=");
  M(this.p, a, b);
  a.push(", resetting=");
  M(this.lb, a, b);
  a.push(">")
};
p.toString = function() {
  return N(this)
};
p.Me = o("Ja");
p.re = function(a) {
  u(a.streamStarted) || f(Error("Protocol is missing required method streamStarted"));
  u(a.streamReset) || f(Error("Protocol is missing required method streamReset"));
  u(a.stringReceived) || f(Error("Protocol is missing required method stringReceived"));
  this.onstarted = x(a.streamStarted, a);
  this.onreset = x(a.streamReset, a);
  this.onstring = x(a.stringReceived, a);
  this.Cc = u(a.transportCreated) ? x(a.transportCreated, a) : k;
  this.Dc = u(a.transportDestroyed) ? x(a.transportDestroyed, a) : k
};
function rf(a) {
  var b = [-1];
  a.e && b.push(a.e.Ta);
  a.p && b.push(a.p.Ta);
  return Math.max.apply(Math.max, b)
}
function sf(a) {
  if(!("3_STARTED" > a.B)) {
    tf(a);
    var b = 0 != a.W.G.A(), c = Ud(a.sc), d = !c.K(a.Gd) && !(a.e && c.K(a.e.Ra) || a.p && c.K(a.p.Ra)), g = rf(a);
    if((b = b && g < a.W.ya) || d) {
      var e = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.xa ? (a.a.s("tryToSend_: writing " + e + " to primary"), d && (d = a.e, c != d.Ra && (!d.ea && !d.u.length && uf(d), d.u.push(new Fe(c)), d.Ra = c)), b && vf(a.e, a.W, g + 1), a.e.aa()) : a.p == k ? a.Lc ? (a.a.s("tryToSend_: creating secondary to send " + e), a.p = wf(a, m, j), a.p && (b && vf(a.p, a.W, g + 1), a.p.aa())) : (a.a.s("tryToSend_: not creating a secondary because stream might not exist on server"), a.Gc = j) : a.a.s("tryToSend_: need to send " + e + ", but can't right now")
    }
  }
}
function tf(a) {
  a.Xa != k && (a.o.z.clearTimeout(a.Xa), a.Xa = k)
}
p.tf = function() {
  this.Xa = k;
  sf(this)
};
function xf(a) {
  a.Xa == k && (a.Xa = a.o.z.setTimeout(a.te, 6))
}
p.df = function() {
  this.rb = k;
  if(this.e && this.e.Qa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.$b = j;
    a.b()
  }
  this.p && this.p.Qa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.p, a.$b = j, a.b())
};
p.ce = function(a, b) {
  u(b) || (b = j);
  "3_STARTED" < this.B && f(Error("sendString: Can't send in state " + this.B));
  b && (v(a) || f(Error("sendString: not a string: " + N(a))), /^([ -~]*)$/.test(a) || f(Error("sendString: string has illegal chars: " + N(a))));
  this.W.append(a);
  xf(this)
};
function wf(a, b, c) {
  var d;
  a.r instanceof kf ? d = df : a.r instanceof hf ? d = yf : f(Error("Don't support endpoint " + N(a.r)));
  a.Rc += 1;
  b = new zf(a.o, a, a.Rc, d, a.r, b);
  a.a.s("Created: " + b.k());
  if(c) {
    if(a.Cc) {
      c = new qf(b.fa, b.ha, b.ra, b.xa);
      try {
        a.Cc.call(a.Ja, c)
      }catch(g) {
        a.a.q("ontransportcreated raised uncaught exception", g), nf(g)
      }
    }
    if(Af(a)) {
      return k
    }
  }
  a.qb.add(b);
  return b
}
function Bf(a, b, c) {
  var d = new Cf(a.o, a, b, c);
  a.a.s("Created: " + d.k() + ", delay=" + b + ", times=" + c);
  a.qb.add(d);
  return d
}
function Df(a, b) {
  a.qb.remove(b) || f(Error("transportOffline_: Transport was not removed?"));
  a.a.j("Offline: " + b.k());
  var c = "4_RESETTING" == a.B && b.ke;
  if(b instanceof zf && !c) {
    if(a.Dc) {
      var d = new qf(b.fa, b.ha, b.ra, b.xa);
      try {
        a.Dc.call(a.Ja, d)
      }catch(g) {
        a.a.q("ontransportdestroyed raised uncaught exception", g), nf(g)
      }
    }
    if(Af(a)) {
      return
    }
  }
  a.Mc = b.oa ? a.Mc + b.oa : 0;
  1 <= a.Mc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), Ef(a, "stream penalty reached limit", m), a.b());
  if("3_STARTED" < a.B) {
    c ? (a.a.j("Disposing because resettingTransport_ is done."), a.b()) : a.a.j("Not creating a transport because ClientStream is in state " + a.B)
  }else {
    c = b instanceof Cf;
    if(!c && b.$b) {
      var e = F ? Ze ? [0, 1] : [9, 20] : [0, 0], c = e[0], d = e[1];
      a.a.s("getDelayForNextTransport_: " + N({delay:c, times:d}))
    }else {
      if(d = b.cd(), b == a.e ? d ? e = ++a.Rd : c || (e = a.Rd = 0) : d ? e = ++a.ae : c || (e = a.ae = 0), c || !e) {
        d = c = 0, a.a.s("getDelayForNextTransport_: " + N({count:e, delay:c, times:d}))
      }else {
        var h = 2E3 * Math.min(e, 3), l = Math.floor(4E3 * Math.random()) - 2E3, n = Math.max(0, b.ie - b.Sc), d = (c = Math.max(0, h + l - n)) ? 1 : 0;
        a.a.s("getDelayForNextTransport_: " + N({count:e, base:h, variance:l, oldDuration:n, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    if(b == a.e) {
      a.e = k;
      if(c) {
        a.e = Bf(a, e, c)
      }else {
        e = rf(a);
        a.e = wf(a, j, j);
        if(!a.e) {
          return
        }
        vf(a.e, a.W, e + 1)
      }
      a.e.aa()
    }else {
      b == a.p && (a.p = k, c ? (a.p = Bf(a, e, c), a.p.aa()) : sf(a))
    }
  }
}
function Ef(a, b, c) {
  if(a.onreset) {
    try {
      a.onreset.call(a.Ja, b, c)
    }catch(d) {
      a.a.q("onreset raised uncaught exception", d), nf(d)
    }
  }
}
p.reset = function(a) {
  "3_STARTED" < this.B && f(Error("reset: Can't send reset in state " + this.B));
  tf(this);
  0 != this.W.G.A() && this.a.q("reset: strings in send queue will never be sent: " + N(this.W));
  this.B = "4_RESETTING";
  this.e && this.e.xa ? (this.a.info("reset: Sending ResetFrame over existing primary."), Ff(this.e, a), this.e.aa()) : (this.e && (this.a.j("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.p && (this.a.j("reset: Disposing secondary before sending ResetFrame."), this.p.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.lb = wf(this, m, m), Ff(this.lb, a), this.lb.aa());
  Ef(this, a, j)
};
function Af(a) {
  return"4_RESETTING" == a.B || a.ja
}
p.kd = function(a) {
  this.a.H("Failed to start " + N(this) + "; error was " + N(a.message));
  this.b();
  return k
};
p.start = function() {
  this.onmessage && f(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  "1_UNSTARTED" != this.B && f(Error("ClientStream.start: " + N(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.B = "2_WAITING_RESOURCES";
  if(this.r instanceof jf) {
    var a = Ve(this.r.V, this), b = Ve(this.r.ua, this), a = new $e([a, b], m, j);
    a.Ma(function(a) {
      return hb(a, function(a) {
        return a[1]
      })
    });
    a.Ma(x(this.Ge, this));
    a.tb(x(this.kd, this))
  }else {
    if(this.r instanceof gf) {
      if(uc) {
        this.md()
      }else {
        a = this.o;
        b = this.r.V;
        if(ze.length) {
          a = Ae()
        }else {
          b = new pe(b + "FlashConnector.swf?cb=4bdfc178fc0e508c0cd5efc3fdb09920");
          b.Yc = "#777777";
          qe(b, 300, 30);
          var c = R("minerva-elements");
          c || f(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
          var d = R("minerva-elements-FlashConnectorSwf");
          d || (d = Wc("div", {id:"minerva-elements-FlashConnectorSwf"}), c.appendChild(d));
          var g = a.z, e;
          var a = d, h, l = function() {
            h && delete s.__loadFlashObject_callbacks[h]
          };
          if(Ka && !G("1.8.1.20")) {
            e = Qb(new re("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
          }else {
            if(0 <= ya(ge, "9")) {
              var n;
              h = "_" + ac();
              var q = new L(l);
              s.__loadFlashObject_callbacks[h] = function() {
                g.setTimeout(function() {
                  l();
                  q.N(R(n))
                }, 0)
              };
              b.Db.set("onloadcallback", '__loadFlashObject_callbacks["' + h + '"]()');
              n = me(b);
              b.Da && f(Error("Component already rendered"));
              b.h || b.bb();
              a ? a.insertBefore(b.h, k) : b.ic.za.body.appendChild(b.h);
              (!b.t || b.t.Da) && b.zb();
              e = q
            }else {
              e = Qb(new re("Need Flash Player 9+; had " + (ge ? ge : "none")))
            }
          }
          var z = g.setTimeout(function() {
            e.cancel()
          }, 8E3);
          e.Wc(function(a) {
            g.clearTimeout(z);
            return a
          });
          tc = e;
          a = Ae();
          tc.Y(Be, Ce)
        }
        var r = this;
        a.Ma(function(a) {
          uc || (uc = new xe(r.o, a));
          return k
        });
        a.Ma(x(this.md, this));
        a.tb(x(this.kd, this))
      }
    }else {
      Gf(this)
    }
  }
};
p.Ge = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Bb, g = a[1].Bb;
  this.Yb.push(a[0]);
  this.Yb.push(a[1]);
  this.r = new kf(d, b, g, c);
  Gf(this)
};
p.md = function() {
  this.r = new hf(this.r.host, this.r.port, uc);
  Gf(this)
};
function Gf(a) {
  a.B = "3_STARTED";
  a.e = wf(a, j, j);
  a.e && (vf(a.e, a.W, k), a.e.aa())
}
p.d = function() {
  this.a.info(N(this) + " in disposeInternal.");
  tf(this);
  this.B = "5_DISCONNECTED";
  for(var a = this.qb.C(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Yb.length;a++) {
    kb(this.Yb[a].Oc, this)
  }
  F && this.rb && (Bb(this.rb), this.rb = k);
  this.ondisconnect && this.ondisconnect.call(this.Ja);
  delete this.qb;
  delete this.e;
  delete this.p;
  delete this.lb;
  delete this.Ja;
  $.m.d.call(this)
};
var df = 1, yf = 3;
function zf(a, b, c, d, g, e) {
  this.o = a;
  this.D = b;
  this.fa = c;
  this.X = d;
  this.r = g;
  this.u = [];
  this.ha = e;
  this.xa = !this.Qa();
  this.ra = this.X != df;
  this.se = x(this.qf, this)
}
A(zf, I);
p = zf.prototype;
p.a = U("cw.net.ClientTransport");
p.i = k;
p.Sc = k;
p.ie = k;
p.Rb = k;
p.ea = m;
p.Vb = m;
p.Ra = k;
p.Eb = 0;
p.Ta = -1;
p.Ob = -1;
p.ke = m;
p.$b = m;
p.oa = 0;
p.eb = m;
p.v = function(a) {
  a.push("<ClientTransport #", "" + this.fa, ", becomePrimary=", "" + this.ha, ">")
};
p.k = function() {
  return(this.ha ? "Prim. T#" : "Sec. T#") + this.fa
};
p.cd = function() {
  return!(!this.eb && this.Eb)
};
p.Qa = function() {
  return this.X == df || 2 == this.X
};
function Hf(a, b) {
  H.sort.call(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  } || ob);
  a: {
    var c = a.D, d = !a.ra, g, e = c.sc;
    g = c.maxUndeliveredStrings;
    for(var h = c.maxUndeliveredBytes, l = [], n = m, q = 0, z = b.length;q < z;q++) {
      var r = b[q], w = r[0], r = r[1];
      if(w == e.Ea + 1) {
        e.Ea += 1;
        for(l.push(r);;) {
          w = e.Ea + 1;
          r = e.wa.get(w, Vd);
          if(r === Vd) {
            break
          }
          l.push(r[0]);
          e.wa.remove(w);
          e.I -= r[1];
          e.Ea = w
        }
      }else {
        if(!(w <= e.Ea)) {
          if(g != k && e.wa.A() >= g) {
            n = j;
            break
          }
          var E = Pd(r);
          if(h != k && e.I + E > h) {
            n = j;
            break
          }
          e.wa.set(w, [r, E]);
          e.I += E
        }
      }
    }
    e.wa.fb() && e.wa.clear();
    g = [l, n];
    e = g[0];
    g = g[1];
    if(e) {
      for(h = 0;h < e.length;h++) {
        l = e[h];
        if(c.onstring) {
          try {
            c.onstring.call(c.Ja, l)
          }catch(kc) {
            c.a.q("onstring raised uncaught exception", kc), nf(kc)
          }
        }
        if(Af(c)) {
          break a
        }
      }
    }
    d || xf(c);
    !Af(c) && g && (a.a.H(a.k() + "'s peer caused rwin overflow."), a.b())
  }
}
function If(a, b, c) {
  try {
    var d = Se(b);
    a.Eb += 1;
    a.a.j(a.k() + " RECV " + N(d));
    var g;
    1 == a.Eb && !d.K(lf) && a.Qa() ? (a.a.q(a.k() + " is closing soon because got bad preamble: " + N(d)), g = j) : g = m;
    if(g) {
      return j
    }
    if(d instanceof Ge) {
      if(!/^([ -~]*)$/.test(d.Pc)) {
        return a.eb = j
      }
      a.Ob += 1;
      c.push([a.Ob, d.Pc])
    }else {
      if(d instanceof Fe) {
        var e = a.D, h = d.sa;
        e.Fd = h;
        var l = e.W, n = h.La, c = m;
        n > l.ya && (c = j);
        for(var q = Sd(l).concat(), d = 0;d < q.length;d++) {
          var z = q[d];
          if(z > n) {
            break
          }
          var r = l.G.get(z)[1];
          l.G.remove(z);
          l.I -= r
        }
        for(d = 0;d < h.Ha.length;d++) {
          var w = h.Ha[d];
          w > l.ya && (c = j);
          l.G.Z(w) && (r = l.G.get(w)[1], l.G.remove(w), l.I -= r)
        }
        l.G.fb() && l.G.clear();
        if(c) {
          return a.a.q(a.k() + " is closing soon because got bad SackFrame"), a.eb = j
        }
      }else {
        if(d instanceof Ie) {
          a.Ob = d.de - 1
        }else {
          if(d instanceof Ke) {
            a.D.Gd = d.Ed
          }else {
            if(d instanceof Oe) {
              return a.a.s(a.k() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof Re) {
              return a.eb = j, "stream_attach_failure" == d.reason ? a.oa += 1 : "acked_unsent_strings" == d.reason && (a.oa += 0.5), a.a.s(a.k() + " is closing soon because got " + N(d)), j
            }
            if(!(d instanceof He)) {
              if(d instanceof Ne) {
                var E = a.D, kc = !a.ra;
                E.a.s("Stream is now confirmed to exist at server.");
                E.Lc = j;
                E.Gc && !kc && (E.Gc = m, sf(E))
              }else {
                if(c.length) {
                  Hf(a, c);
                  if(!fa(c)) {
                    for(var wd = c.length - 1;0 <= wd;wd--) {
                      delete c[wd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof Pe) {
                  var Le = a.D;
                  Ef(Le, d.Wd, d.Xc);
                  Le.b();
                  return j
                }
                f(Error(a.k() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Me) {
    return Me instanceof X || f(Me), a.a.q(a.k() + " is closing soon because got InvalidFrame: " + N(b)), a.eb = j
  }
  return m
}
function ve(a, b) {
  a.Vb = j;
  try {
    for(var c = m, d = [], g = 0, e = b.length;g < e;g++) {
      if(a.ja) {
        a.a.info(a.k() + " returning from loop because we're disposed.");
        return
      }
      if(c = If(a, b[g], d)) {
        break
      }
    }
    d.length && Hf(a, d);
    a.Vb = m;
    a.u.length && a.aa();
    c && (a.a.s(a.k() + " closeSoon is true.  Frames were: " + N(b)), a.b())
  }finally {
    a.Vb = m
  }
}
p.qf = function() {
  this.a.q(this.k() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Jf(a) {
  a.Rb != k && (a.o.z.clearTimeout(a.Rb), a.Rb = k)
}
function ef(a, b) {
  Jf(a);
  b = Math.round(b);
  a.Rb = a.o.z.setTimeout(a.se, b);
  a.a.j(a.k() + "'s receive timeout set to " + b + " ms.")
}
function ue(a) {
  a.X != df && (a.X == yf || 2 == a.X ? ef(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.X)))
}
function uf(a) {
  var b = new De;
  b.fa = a.fa;
  b.Td = 2;
  b.xd = 2;
  a.D.Lc || (b.Yd = j);
  b.pb = a.D.pb;
  b.Nc = a.ra;
  b.Nc && (b.Md = 4096);
  b.Kd = 3E5;
  b.Id = a.ra ? Math.floor(10) : 0;
  b.je = m;
  a.ha && (b.ge = k, b.xc = Math.floor((a.ra ? 358E4 : 25E3) / 1E3));
  b.sa = Ud(a.D.sc);
  b.Jb = a.D.Fd;
  a.u.push(b);
  a.Ra = b.sa
}
function we(a, b) {
  b && (a.oa += 0.5);
  a.b()
}
p.aa = function() {
  this.ea && !this.xa && f(Error("flush_: Can't flush more than once to this transport."));
  if(this.Vb) {
    this.a.s(this.k() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ea;
    this.ea = j;
    !a && !this.u.length && uf(this);
    for(a = 0;a < this.u.length;a++) {
      this.a.j(this.k() + " SEND " + N(this.u[a]))
    }
    if(this.Qa()) {
      for(var a = [], b = 0, c = this.u.length;b < c;b++) {
        this.u[b].O(a), a.push("\n")
      }
      this.u = [];
      a = a.join("");
      b = this.ha ? this.r.V : this.r.ua;
      this.i = Z.gc(this, this.ha ? this.r.Sd : this.r.be);
      this.Sc = this.o.z === Hb ? pa() : this.o.z.getTime();
      this.i.wc(b, "POST", a);
      ef(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.ra ? 0 : this.ha ? 25E3 : 0))
    }else {
      if(this.X == yf) {
        a = [];
        b = 0;
        for(c = this.u.length;b < c;b++) {
          a.push(this.u[b].J())
        }
        this.u = [];
        this.i ? this.i.sb(a) : (b = this.r, this.i = new ye(this), this.i.Ub = b.sf.gc(this.i), this.Sc = this.o.z === Hb ? pa() : this.o.z.getTime(), this.i.dc(b.host, b.port), this.i.ja || (this.i.sb(a), this.i.ja || ef(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.X))
      }
    }
  }
};
function vf(a, b, c) {
  !a.ea && !a.u.length && uf(a);
  for(var d = Math.max(c, a.Ta + 1), g = Sd(b), c = [], e = 0;e < g.length;e++) {
    var h = g[e];
    (d == k || h >= d) && c.push([h, b.G.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    e = c[b], g = e[0], e = e[1], (-1 == a.Ta || a.Ta + 1 != g) && a.u.push(new Ie(g)), a.u.push(new Ge(e)), a.Ta = g
  }
}
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  zf.m.d.call(this);
  this.ie = this.o.z === Hb ? pa() : this.o.z.getTime();
  this.u = [];
  Jf(this);
  this.i && this.i.b();
  var a = this.D;
  this.D = k;
  Df(a, this)
};
function Ff(a, b) {
  !a.ea && !a.u.length && uf(a);
  a.u.push(new Pe(b, j));
  a.ke = j
}
function Cf(a, b, c, d) {
  this.o = a;
  this.D = b;
  this.jd = c;
  this.ed = d
}
A(Cf, I);
p = Cf.prototype;
p.ea = m;
p.xa = m;
p.Fb = k;
p.Ra = k;
p.a = U("cw.net.DoNothingTransport");
function Kf(a) {
  a.Fb = a.o.z.setTimeout(function() {
    a.Fb = k;
    a.ed--;
    a.ed ? Kf(a) : a.b()
  }, a.jd)
}
p.aa = function() {
  this.ea && !this.xa && f(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ea = j;
  Kf(this)
};
p.v = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.jd, ">")
};
p.Qa = ba(m);
p.k = ba("Wast. T");
p.cd = ba(m);
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  Cf.m.d.call(this);
  this.Fb != k && this.o.z.clearTimeout(this.Fb);
  var a = this.D;
  this.D = k;
  Df(a, this)
};
function Lf() {
}
Lf.prototype.vb = k;
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
function Pf(a) {
  if(!a.yd && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.yd = d
      }catch(g) {
      }
    }
    f(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.yd
}
Mf = new Nf;
function Rf(a) {
  this.headers = new O;
  this.$a = a || k
}
A(Rf, Gb);
Rf.prototype.a = U("goog.net.XhrIo");
var Sf = /^https?$/i;
p = Rf.prototype;
p.ga = m;
p.f = k;
p.Zb = k;
p.uc = "";
p.Dd = "";
p.gb = 0;
p.hb = "";
p.jc = m;
p.Hb = m;
p.rc = m;
p.Ca = m;
p.Wb = 0;
p.Ia = k;
p.$d = "";
p.xf = m;
p.send = function(a, b, c, d) {
  this.f && f(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.uc = a;
  this.hb = "";
  this.gb = 0;
  this.Dd = b;
  this.jc = m;
  this.ga = j;
  this.f = this.$a ? Of(this.$a) : Of(Mf);
  this.Zb = this.$a ? this.$a.vb || (this.$a.vb = Qf(this.$a)) : Mf.vb || (Mf.vb = Qf(Mf));
  this.f.onreadystatechange = x(this.Qd, this);
  try {
    this.a.j(Tf(this, "Opening Xhr")), this.rc = j, this.f.open(b, a, j), this.rc = m
  }catch(g) {
    this.a.j(Tf(this, "Error opening Xhr: " + g.message));
    Uf(this, g);
    return
  }
  var a = c || "", e = this.headers.S();
  d && jc(d, function(a, b) {
    e.set(b, a)
  });
  "POST" == b && !e.Z("Content-Type") && e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  jc(e, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.$d && (this.f.responseType = this.$d);
  "withCredentials" in this.f && (this.f.withCredentials = this.xf);
  try {
    this.Ia && (Hb.clearTimeout(this.Ia), this.Ia = k), 0 < this.Wb && (this.a.j(Tf(this, "Will abort after " + this.Wb + "ms if incomplete")), this.Ia = Hb.setTimeout(x(this.rf, this), this.Wb)), this.a.j(Tf(this, "Sending request")), this.Hb = j, this.f.send(a), this.Hb = m
  }catch(h) {
    this.a.j(Tf(this, "Send error: " + h.message)), Uf(this, h)
  }
};
p.rf = function() {
  "undefined" != typeof ca && this.f && (this.hb = "Timed out after " + this.Wb + "ms, aborting", this.gb = 8, this.a.j(Tf(this, this.hb)), this.dispatchEvent("timeout"), this.abort(8))
};
function Uf(a, b) {
  a.ga = m;
  a.f && (a.Ca = j, a.f.abort(), a.Ca = m);
  a.hb = b;
  a.gb = 5;
  Vf(a);
  Wf(a)
}
function Vf(a) {
  a.jc || (a.jc = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function(a) {
  this.f && this.ga && (this.a.j(Tf(this, "Aborting")), this.ga = m, this.Ca = j, this.f.abort(), this.Ca = m, this.gb = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Wf(this))
};
p.d = function() {
  this.f && (this.ga && (this.ga = m, this.Ca = j, this.f.abort(), this.Ca = m), Wf(this, j));
  Rf.m.d.call(this)
};
p.Qd = function() {
  !this.rc && !this.Hb && !this.Ca ? this.Ze() : Xf(this)
};
p.Ze = function() {
  Xf(this)
};
function Xf(a) {
  if(a.ga && "undefined" != typeof ca) {
    if(a.Zb[1] && 4 == a.la() && 2 == Yf(a)) {
      a.a.j(Tf(a, "Local request error detected and ignored"))
    }else {
      if(a.Hb && 4 == a.la()) {
        Hb.setTimeout(x(a.Qd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.la()) {
          a.a.j(Tf(a, "Request complete"));
          a.ga = m;
          try {
            var b = Yf(a), c, d;
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
              var g;
              if(g = 0 === b) {
                var e = ("" + a.uc).match(vd)[1] || k;
                if(!e && self.location) {
                  var h = self.location.protocol, e = h.substr(0, h.length - 1)
                }
                g = !Sf.test(e ? e.toLowerCase() : "")
              }
              c = g
            }
            if(c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success")
            }else {
              a.gb = 6;
              var l;
              try {
                l = 2 < a.la() ? a.f.statusText : ""
              }catch(n) {
                a.a.j("Can not get status: " + n.message), l = ""
              }
              a.hb = l + " [" + Yf(a) + "]";
              Vf(a)
            }
          }finally {
            Wf(a)
          }
        }
      }
    }
  }
}
function Wf(a, b) {
  if(a.f) {
    var c = a.f, d = a.Zb[0] ? ea : k;
    a.f = k;
    a.Zb = k;
    a.Ia && (Hb.clearTimeout(a.Ia), a.Ia = k);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(g) {
      a.a.H("Problem encountered resetting onreadystatechange: " + g.message)
    }
  }
}
p.la = function() {
  return this.f ? this.f.readyState : 0
};
function Yf(a) {
  try {
    return 2 < a.la() ? a.f.status : -1
  }catch(b) {
    return a.a.q("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.la() ? this.f.getResponseHeader(a) : i
};
function Tf(a, b) {
  return b + " [" + a.Dd + " " + a.uc + " " + Yf(a) + "]"
}
;var Zf = !(D || F && !G("420+"));
function $f(a, b) {
  this.Xb = a;
  this.R = b
}
A($f, I);
p = $f.prototype;
p.i = k;
p.qa = -1;
p.td = m;
p.wd = "Content-Length Server Date Expires Keep-Alive Content-Type Transfer-Encoding Cache-Control".split(" ");
function ag(a) {
  var b = bf(a.gd), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.R, c, b), 1 != b && a.b()) : a.b()
}
p.Pe = function() {
  ag(this);
  if(!this.ja) {
    var a = s.parent;
    a && a.__XHRMaster_oncomplete(this.R);
    this.b()
  }
};
p.bf = function() {
  var a = s.parent;
  if(a) {
    this.qa = this.i.la();
    if(2 <= this.qa && !this.td) {
      for(var b = new O, c = this.wd.length;c--;) {
        var d = this.wd[c];
        try {
          b.set(d, this.i.f.getResponseHeader(d))
        }catch(g) {
        }
      }
      if(b.A() && (this.td = j, a.__XHRMaster_ongotheaders(this.R, pc(b)), this.ja)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.R, this.qa);
    Zf && 3 == this.qa && ag(this)
  }else {
    this.b()
  }
};
p.wc = function(a, b, c) {
  this.i = new Rf;
  xb(this.i, "readystatechange", x(this.bf, this));
  xb(this.i, "complete", x(this.Pe, this));
  this.i.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.gd = new af(this.i.f, 1048576)
};
p.d = function() {
  $f.m.d.call(this);
  delete this.gd;
  this.i && this.i.b();
  delete this.Xb.ob[this.R];
  delete this.Xb
};
function bg() {
  this.ob = {}
}
A(bg, I);
bg.prototype.Ue = function(a, b, c, d) {
  var g = new $f(this, a);
  this.ob[a] = g;
  g.wc(b, c, d)
};
bg.prototype.De = function(a) {
  (a = this.ob[a]) && a.b()
};
bg.prototype.d = function() {
  bg.m.d.call(this);
  for(var a = $a(this.ob);a.length;) {
    a.pop().b()
  }
  delete this.ob
};
var cg = new bg;
s.__XHRSlave_makeRequest = x(cg.Ue, cg);
s.__XHRSlave_dispose = x(cg.De, cg);
var dg = U("cw.net.demo");
function eg(a, b, c, d) {
  a = new yd(document.location);
  if(c) {
    return new gf(d, a.ka, s.__demo_mainSocketPort)
  }
  b ? (b = s.__demo_shared_domain, v(b) || f(Error("domain was " + N(b) + "; expected a string.")), c = a.S(), Ad(c, "_____random_____." + b)) : c = a.S();
  Cd(c, d);
  Dd(c, "", i);
  return new jf(c.toString().replace("_____random_____", "%random%"))
}
;y("Minerva.HttpEndpoint", jf);
y("Minerva.SocketEndpoint", gf);
y("Minerva.QANHelper", Q);
Q.prototype.handleQANFrame = Q.prototype.vd;
Q.prototype.ask = Q.prototype.pe;
Q.prototype.notify = Q.prototype.Ye;
Q.prototype.failAll = Q.prototype.nd;
y("Minerva.QANProtocolWrapper", of);
of.prototype.streamStarted = of.prototype.nf;
of.prototype.streamReset = of.prototype.mf;
of.prototype.stringReceived = of.prototype.of;
y("Minerva.Deferred", L);
L.prototype.cancel = L.prototype.cancel;
L.prototype.callback = L.prototype.N;
L.prototype.errback = L.prototype.P;
L.prototype.addErrback = L.prototype.tb;
L.prototype.addCallback = L.prototype.Ma;
L.prototype.addCallbacks = L.prototype.Y;
L.prototype.chainDeferred = L.prototype.bd;
L.prototype.awaitDeferred = L.prototype.qe;
L.prototype.branch = L.prototype.$c;
L.prototype.addBoth = L.prototype.Wc;
L.prototype.hasFired = L.prototype.Oe;
y("Minerva.Deferred.succeed", Pb);
y("Minerva.Deferred.fail", Qb);
y("Minerva.Deferred.cancelled", function() {
  var a = new L;
  a.cancel();
  return a
});
y("Minerva.Deferred.AlreadyCalledError", Mb);
y("Minerva.Deferred.CancelledError", Ib);
y("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Me;
$.prototype.bindToProtocol = $.prototype.re;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.ce;
$.prototype.reset = $.prototype.reset;
$.prototype.dispose = $.prototype.b;
y("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.Ic;
S.prototype.shout = S.prototype.hf;
S.prototype.severe = S.prototype.H;
S.prototype.warning = S.prototype.q;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.xe;
S.prototype.fine = S.prototype.j;
S.prototype.finer = S.prototype.He;
S.prototype.finest = S.prototype.s;
T.OFF = jd;
T.SHOUT = kd;
T.SEVERE = ld;
T.WARNING = md;
T.INFO = nd;
T.CONFIG = od;
T.FINE = pd;
T.FINER = qd;
T.FINEST = rd;
T.ALL = sd;
y("Minerva.LogManager", V);
V.getRoot = V.oc;
y("Minerva.DivConsole", ud);
ud.prototype.setCapturing = ud.prototype.gf;
y("Minerva.JSON", {});
y("Minerva.JSON.parse", function(a) {
  a = "" + a;
  if(/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  f(Error("Invalid JSON string: " + a))
});
y("Minerva.JSON.serialize", Ub);
y("Minerva.JSON.asciify", Ub);
y("Minerva.bind", x);
y("Minerva.repr", N);
y("Minerva.theCallQueue", Sb);
y("Minerva.MINIMUM_FLASH_VERSION", "9");
y("Minerva.getEndpoint", eg);
y("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new yd(document.location)).Q;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !s.__demo_shared_domain) {
    dg.q("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return eg(0, a, b, "/_minerva/")
});

})();
