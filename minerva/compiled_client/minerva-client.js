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
  this.Ig = a
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
  ja(a) ? this.Dd = j : a && a.handleEvent && ja(a.handleEvent) ? this.Dd = m : f(Error("Invalid listener argument"));
  this.ib = a;
  this.Vd = b;
  this.src = c;
  this.type = d;
  this.capture = !!g;
  this.pc = e;
  this.bc = m;
  this.key = ++Ya;
  this.Wa = m
};
p.handleEvent = function(a) {
  return this.Dd ? this.ib.call(this.pc || this.src, a) : this.ib.handleEvent.call(this.ib, a)
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
}, hb = H.filter ? function(a, b, c) {
  return H.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = [], e = 0, h = v(a) ? a.split("") : a, l = 0;l < d;l++) {
    if(l in h) {
      var n = h[l];
      b.call(c, n, l, a) && (g[e++] = n)
    }
  }
  return g
}, ib = H.map ? function(a, b, c) {
  return H.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = Array(d), e = v(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in e && (g[h] = b.call(c, e[h], h, a))
  }
  return g
}, jb = H.some ? function(a, b, c) {
  return H.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in g && b.call(c, g[e], e, a)) {
      return j
    }
  }
  return m
}, kb = H.every ? function(a, b, c) {
  return H.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in g && !b.call(c, g[e], e, a)) {
      return m
    }
  }
  return j
};
function lb(a, b) {
  var c = fb(a, b);
  0 <= c && H.splice.call(a, c, 1)
}
function mb(a) {
  return H.concat.apply(H, arguments)
}
function nb(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}
function ob(a, b, c) {
  return 2 >= arguments.length ? H.slice.call(a, b) : H.slice.call(a, b, c)
}
function pb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var qb = {Hf:"click", Mf:"dblclick", fg:"mousedown", jg:"mouseup", ig:"mouseover", hg:"mouseout", gg:"mousemove", vg:"selectstart", ag:"keypress", $f:"keydown", bg:"keyup", Ff:"blur", Uf:"focus", Nf:"deactivate", Vf:D ? "focusin" : "DOMFocusIn", Wf:D ? "focusout" : "DOMFocusOut", Gf:"change", ug:"select", wg:"submit", Zf:"input", qg:"propertychange", Rf:"dragstart", Of:"dragenter", Qf:"dragover", Pf:"dragleave", Sf:"drop", Ag:"touchstart", zg:"touchmove", yg:"touchend", xg:"touchcancel", Jf:"contextmenu", 
Tf:"error", Yf:"help", cg:"load", dg:"losecapture", rg:"readystatechange", sg:"resize", tg:"scroll", Cg:"unload", Xf:"hashchange", mg:"pagehide", ng:"pageshow", pg:"popstate", Kf:"copy", og:"paste", Lf:"cut", Cf:"beforecopy", Df:"beforecut", Ef:"beforepaste", lg:"online", kg:"offline", eg:"message", If:"connect", Bg:F ? "webkitTransitionEnd" : Ja ? "oTransitionEnd" : "transitionend"};
function I() {
}
I.prototype.ja = m;
I.prototype.b = function() {
  this.ja || (this.ja = j, this.d())
};
I.prototype.d = function() {
  this.Ce && rb.apply(k, this.Ce);
  if(this.Qd) {
    for(;this.Qd.length;) {
      this.Qd.shift()()
    }
  }
};
function rb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    ga(d) ? rb.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function sb(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
A(sb, I);
p = sb.prototype;
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
function tb(a) {
  a.stopPropagation()
}
;function ub(a) {
  ub[" "](a);
  return a
}
ub[" "] = ea;
function vb(a, b) {
  a && this.Ib(a, b)
}
A(vb, sb);
p = vb.prototype;
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
p.af = m;
p.Na = k;
p.Ib = function(a, b) {
  var c = this.type = a.type;
  sb.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ka) {
      var g;
      a: {
        try {
          ub(d.nodeName);
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
  this.af = Ma ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.Na = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Ga
};
p.stopPropagation = function() {
  vb.m.stopPropagation.call(this);
  this.Na.stopPropagation ? this.Na.stopPropagation() : this.Na.cancelBubble = j
};
p.preventDefault = function() {
  vb.m.preventDefault.call(this);
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
  vb.m.d.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.Na = k
};
var wb = {}, J = {}, K = {}, xb = {};
function yb(a, b, c, d, g) {
  if(b) {
    if(fa(b)) {
      for(var e = 0;e < b.length;e++) {
        yb(a, b[e], c, d, g)
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
    var q = zb, z = db ? function(a) {
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
    wb[c] = h;
    K[l] || (K[l] = []);
    K[l].push(h);
    a.addEventListener ? (a == s || !a.fd) && a.addEventListener(b, e, d) : a.attachEvent(b in xb ? xb[b] : xb[b] = "on" + b, e);
    return c
  }
  f(Error("Invalid event type"))
}
function Ab(a, b, c, d, g) {
  if(fa(b)) {
    for(var e = 0;e < b.length;e++) {
      Ab(a, b[e], c, d, g)
    }
    return k
  }
  a = yb(a, b, c, d, g);
  wb[a].bc = j;
  return a
}
function Bb(a, b, c, d, g) {
  if(fa(b)) {
    for(var e = 0;e < b.length;e++) {
      Bb(a, b[e], c, d, g)
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
          Cb(a[e].key);
          break
        }
      }
    }
  }
}
function Cb(a) {
  if(!wb[a]) {
    return m
  }
  var b = wb[a];
  if(b.Wa) {
    return m
  }
  var c = b.src, d = b.type, g = b.Vd, e = b.capture;
  c.removeEventListener ? (c == s || !c.fd) && c.removeEventListener(d, g, e) : c.detachEvent && c.detachEvent(d in xb ? xb[d] : xb[d] = "on" + d, g);
  c = ka(c);
  K[c] && (g = K[c], lb(g, b), 0 == g.length && delete K[c]);
  b.Wa = j;
  if(b = J[d][e][c]) {
    b.Od = j, Db(d, e, c, b)
  }
  delete wb[a];
  return j
}
function Db(a, b, c, d) {
  if(!d.Kb && d.Od) {
    for(var g = 0, e = 0;g < d.length;g++) {
      d[g].Wa ? d[g].Vd.src = k : (g != e && (d[e] = d[g]), e++)
    }
    d.length = e;
    d.Od = m;
    0 == e && (delete J[a][b][c], J[a][b].c--, 0 == J[a][b].c && (delete J[a][b], J[a].c--), 0 == J[a].c && delete J[a])
  }
}
function Eb(a, b, c, d, g) {
  var e = 1, b = ka(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.Kb ? a.Kb++ : a.Kb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Wa && (e &= Fb(n, g) !== m)
      }
    }finally {
      a.Kb--, Db(c, d, b, a)
    }
  }
  return Boolean(e)
}
function Fb(a, b) {
  a.bc && Cb(a.key);
  return a.handleEvent(b)
}
function zb(a, b) {
  if(!wb[a]) {
    return j
  }
  var c = wb[a], d = c.type, g = J;
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
    q = new vb;
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
          q.currentTarget = r[E], e &= Eb(h, r[E], d, j, q)
        }
        if(n) {
          h = g[m];
          h.M = h.c;
          for(E = 0;!q.Ga && E < r.length && h.M;E++) {
            q.currentTarget = r[E], e &= Eb(h, r[E], d, m, q)
          }
        }
      }else {
        e = Fb(c, q)
      }
    }finally {
      r && (r.length = 0), q.b()
    }
    return e
  }
  d = new vb(b, this);
  try {
    e = Fb(c, d)
  }finally {
    d.b()
  }
  return e
}
var Gb = 0;
function Hb(a) {
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
function Ib(a) {
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
function Jb(a) {
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
function Kb(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ga(a) || v(a)) {
      gb(a, b, c)
    }else {
      for(var d = Jb(a), g = Ib(a), e = g.length, h = 0;h < e;h++) {
        b.call(c, g[h], d && d[h], a)
      }
    }
  }
}
function Lb(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, i)
  }
  if(ga(a) || v(a)) {
    return kb(a, b, i)
  }
  for(var c = Jb(a), d = Ib(a), g = d.length, e = 0;e < g;e++) {
    if(!b.call(i, d[e], c && c[e], a)) {
      return m
    }
  }
  return j
}
;function L(a, b) {
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
p = L.prototype;
p.c = 0;
p.Uc = 0;
p.A = o("c");
p.C = function() {
  Mb(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.n[this.g[b]])
  }
  return a
};
p.T = function() {
  Mb(this);
  return this.g.concat()
};
p.Z = function(a) {
  return Nb(this.n, a)
};
p.ec = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(Nb(this.n, c) && this.n[c] == a) {
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
  var c = b || Ob;
  Mb(this);
  for(var d, g = 0;d = this.g[g];g++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function Ob(a, b) {
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
  return Nb(this.n, a) ? (delete this.n[a], this.c--, this.Uc++, this.g.length > 2 * this.c && Mb(this), j) : m
};
function Mb(a) {
  if(a.c != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      Nb(a.n, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.c != a.g.length) {
    for(var g = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], Nb(g, d) || (a.g[c++] = d, g[d] = 1), b++
    }
    a.g.length = c
  }
}
p.get = function(a, b) {
  return Nb(this.n, a) ? this.n[a] : b
};
p.set = function(a, b) {
  Nb(this.n, a) || (this.c++, this.g.push(a), this.Uc++);
  this.n[a] = b
};
p.ac = function(a) {
  var b;
  a instanceof L ? (b = a.T(), a = a.C()) : (b = ab(a), a = $a(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
p.S = function() {
  return new L(this)
};
function Pb(a) {
  Mb(a);
  for(var b = {}, c = 0;c < a.g.length;c++) {
    var d = a.g[c];
    b[d] = a.n[d]
  }
  return b
}
function Nb(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function Qb(a) {
  this.n = new L;
  a && this.ac(a)
}
function Rb(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ka(a) : b.substr(0, 1) + a
}
p = Qb.prototype;
p.A = function() {
  return this.n.A()
};
p.add = function(a) {
  this.n.set(Rb(a), a)
};
p.ac = function(a) {
  for(var a = Ib(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Fc = function(a) {
  for(var a = Ib(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.n.remove(Rb(a))
};
p.clear = function() {
  this.n.clear()
};
p.fb = function() {
  return this.n.fb()
};
p.contains = function(a) {
  return this.n.Z(Rb(a))
};
p.C = function() {
  return this.n.C()
};
p.S = function() {
  return new Qb(this)
};
p.K = function(a) {
  var b;
  if(b = this.A() == Hb(a)) {
    var c = a, a = Hb(c);
    this.A() > a ? b = m : (!(c instanceof Qb) && 5 < a && (c = new Qb(c)), b = Lb(this, function(a) {
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
function Sb(a) {
  return Tb(a || arguments.callee.caller, [])
}
function Tb(a, b) {
  var c = [];
  if(0 <= fb(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(Ub(a) + "(");
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
            e = (e = Ub(e)) ? e : "[fn]";
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
        c.push(Tb(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function Ub(a) {
  if(Vb[a]) {
    return Vb[a]
  }
  a = "" + a;
  if(!Vb[a]) {
    var b = /function ([^\(]+)/.exec(a);
    Vb[a] = b ? b[1] : "[Anonymous]"
  }
  return Vb[a]
}
var Vb = {};
function Wb(a, b, c, d, g) {
  this.reset(a, b, c, d, g)
}
Wb.prototype.gf = 0;
Wb.prototype.mc = k;
Wb.prototype.lc = k;
var Xb = 0;
Wb.prototype.reset = function(a, b, c, d, g) {
  this.gf = "number" == typeof g ? g : Xb++;
  this.ie = d || pa();
  this.Sa = a;
  this.Md = b;
  this.Ue = c;
  delete this.mc;
  delete this.lc
};
Wb.prototype.Ic = aa("Sa");
function M(a) {
  this.Xe = a
}
M.prototype.t = k;
M.prototype.Sa = k;
M.prototype.ia = k;
M.prototype.Oa = k;
function N(a, b) {
  this.name = a;
  this.value = b
}
N.prototype.toString = o("name");
var Yb = new N("OFF", Infinity), Zb = new N("SHOUT", 1200), $b = new N("SEVERE", 1E3), ac = new N("WARNING", 900), bc = new N("INFO", 800), cc = new N("CONFIG", 700), dc = new N("FINE", 500), ec = new N("FINER", 400), fc = new N("FINEST", 300), gc = new N("ALL", 0);
function O(a) {
  return P.td(a)
}
p = M.prototype;
p.getParent = o("t");
p.qd = function() {
  this.ia || (this.ia = {});
  return this.ia
};
p.Ic = aa("Sa");
function hc(a) {
  if(a.Sa) {
    return a.Sa
  }
  if(a.t) {
    return hc(a.t)
  }
  Aa("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= hc(this).value) {
    a = this.Me(a, b, c);
    b = "log:" + a.Md;
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
p.Me = function(a, b, c) {
  var d = new Wb(a, "" + b, this.Xe);
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
          n = c.lineNumber || c.Te || "Not available"
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
      g = "Message: " + C(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + C(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + C(Sb(e) + "-> ")
    }catch(E) {
      g = "Exception trying to expose exception! You win, we lose. " + E
    }
    d.lc = g
  }
  return d
};
p.jf = function(a, b) {
  this.log(Zb, a, b)
};
p.H = function(a, b) {
  this.log($b, a, b)
};
p.q = function(a, b) {
  this.log(ac, a, b)
};
p.info = function(a, b) {
  this.log(bc, a, b)
};
p.ye = function(a, b) {
  this.log(cc, a, b)
};
p.j = function(a, b) {
  this.log(dc, a, b)
};
p.Ie = function(a, b) {
  this.log(ec, a, b)
};
p.s = function(a, b) {
  this.log(fc, a, b)
};
var P = {Lb:{}, nb:k, Ad:function() {
  P.nb || (P.nb = new M(""), P.Lb[""] = P.nb, P.nb.Ic(cc))
}, Fg:function() {
  return P.Lb
}, oc:function() {
  P.Ad();
  return P.nb
}, td:function(a) {
  P.Ad();
  return P.Lb[a] || P.Ae(a)
}, Eg:function(a) {
  return function(b) {
    (a || P.oc()).H("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Te + ")")
  }
}, Ae:function(a) {
  var b = new M(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = P.td(a.substr(0, c));
  c.qd()[d] = b;
  b.t = c;
  return P.Lb[a] = b
}};
function ic() {
}
A(ic, I);
p = ic.prototype;
p.fd = j;
p.Nb = k;
p.Jc = aa("Nb");
p.addEventListener = function(a, b, c, d) {
  yb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  Bb(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
  var b = a.type || a, c = J;
  if(b in c) {
    if(v(a)) {
      a = new sb(a, this)
    }else {
      if(a instanceof sb) {
        a.target = a.target || this
      }else {
        var d = a, a = new sb(b, this);
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
        a.currentTarget = g[h], d &= Eb(e, g[h], a.type, j, a) && a.Tb != m
      }
    }
    if(m in c) {
      if(e = c[m], e.M = e.c, b) {
        for(h = 0;!a.Ga && h < g.length && e.M;h++) {
          a.currentTarget = g[h], d &= Eb(e, g[h], a.type, m, a) && a.Tb != m
        }
      }else {
        for(g = this;!a.Ga && g && e.M;g = g.Nb) {
          a.currentTarget = g, d &= Eb(e, g, a.type, m, a) && a.Tb != m
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
  ic.m.d.call(this);
  var a, b = 0, c = a == k;
  a = !!a;
  if(this == k) {
    Za(K, function(d) {
      for(var e = d.length - 1;0 <= e;e--) {
        var g = d[e];
        if(c || a == g.capture) {
          Cb(g.key), b++
        }
      }
    })
  }else {
    var d = ka(this);
    if(K[d]) {
      for(var d = K[d], g = d.length - 1;0 <= g;g--) {
        var e = d[g];
        if(c || a == e.capture) {
          Cb(e.key), b++
        }
      }
    }
  }
  this.Nb = k
};
var jc = s.window;
Gb++;
Gb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function Q(a, b) {
  this.wb = [];
  this.ad = a;
  this.hd = b || k
}
p = Q.prototype;
p.$ = m;
p.cb = m;
p.kb = 0;
p.Kc = m;
p.we = m;
p.ub = 0;
p.cancel = function(a) {
  if(this.$) {
    this.mb instanceof Q && this.mb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.ub--, 0 >= b.ub && b.cancel())
    }
    this.ad ? this.ad.call(this.hd, this) : this.Kc = j;
    this.$ || this.P(new lc(this))
  }
};
p.dd = function(a, b) {
  mc(this, a, b);
  this.kb--;
  0 == this.kb && this.$ && nc(this)
};
function mc(a, b, c) {
  a.$ = j;
  a.mb = c;
  a.cb = !b;
  nc(a)
}
function oc(a) {
  a.$ && (a.Kc || f(new pc(a)), a.Kc = m)
}
p.N = function(a) {
  oc(this);
  mc(this, j, a)
};
p.P = function(a) {
  oc(this);
  mc(this, m, a)
};
p.Ma = function(a, b) {
  return this.Y(a, k, b)
};
p.tb = function(a, b) {
  return this.Y(k, a, b)
};
p.Y = function(a, b, c) {
  this.wb.push([a, b, c]);
  this.$ && nc(this);
  return this
};
p.bd = function(a) {
  this.Y(a.N, a.P, a);
  return this
};
p.re = function(a) {
  return this.Ma(x(a.$c, a))
};
p.$c = function(a) {
  var b = new Q;
  this.bd(b);
  a && (b.t = this, this.ub++);
  return b
};
p.Wc = function(a, b) {
  return this.Y(a, a, b)
};
p.Pe = o("$");
function qc(a) {
  return jb(a.wb, function(a) {
    return ja(a[1])
  })
}
function nc(a) {
  a.Tc && (a.$ && qc(a)) && (s.clearTimeout(a.Tc), delete a.Tc);
  a.t && (a.t.ub--, delete a.t);
  for(var b = a.mb, c = m, d = m;a.wb.length && 0 == a.kb;) {
    var g = a.wb.shift(), e = g[0], h = g[1], g = g[2];
    if(e = a.cb ? h : e) {
      try {
        var l = e.call(g || a.hd, b);
        u(l) && (a.cb = a.cb && (l == b || l instanceof Error), a.mb = b = l);
        b instanceof Q && (d = j, a.kb++)
      }catch(n) {
        b = n, a.cb = j, qc(a) || (c = j)
      }
    }
  }
  a.mb = b;
  d && a.kb && (b.Y(x(a.dd, a, j), x(a.dd, a, m)), b.we = j);
  c && (a.Tc = s.setTimeout(function() {
    f(new rc(b))
  }, 0))
}
function sc(a) {
  var b = new Q;
  b.N(a);
  return b
}
function tc(a) {
  var b = new Q;
  b.P(a);
  return b
}
function pc(a) {
  B.call(this);
  this.Be = a
}
A(pc, B);
pc.prototype.message = "Already called";
function lc(a) {
  B.call(this);
  this.Be = a
}
A(lc, B);
lc.prototype.message = "Deferred was cancelled";
function rc(a) {
  B.call(this);
  this.Dg = a;
  this.message = "Unhandled Error in Deferred: " + (a.message || "[No message]")
}
A(rc, B);
function uc(a) {
  this.z = a;
  this.Ab = [];
  this.ld = [];
  this.ve = x(this.vf, this)
}
uc.prototype.Qc = k;
uc.prototype.vf = function() {
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
var vc = new uc(s.window);
function wc(a) {
  return ja(a) || "object" == typeof a && ja(a.call) && ja(a.apply)
}
;function xc(a, b) {
  var c = [];
  yc(new zc(b), a, c);
  return c.join("")
}
function zc(a) {
  this.Sb = a
}
function yc(a, b, c) {
  switch(typeof b) {
    case "string":
      Ac(b, c);
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
          c.push(g), g = b[e], yc(a, a.Sb ? a.Sb.call(b, "" + e, g) : g, c), g = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(e in b) {
        Object.prototype.hasOwnProperty.call(b, e) && (g = b[e], "function" != typeof g && (c.push(d), Ac(e, c), c.push(":"), yc(a, a.Sb ? a.Sb.call(b, e, g) : g, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      f(Error("Unknown type: " + typeof b))
  }
}
var Bc = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, Cc = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function Ac(a, b) {
  b.push('"', a.replace(Cc, function(a) {
    if(a in Bc) {
      return Bc[a]
    }
    var b = a.charCodeAt(0), g = "\\u";
    16 > b ? g += "000" : 256 > b ? g += "00" : 4096 > b && (g += "0");
    return Bc[a] = g + b.toString(16)
  }), '"')
}
;function Dc(a, b, c) {
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
        Ac(a, b)
      }else {
        if(wc(a.v)) {
          a.v(b, c)
        }else {
          if(wc(a.ne)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var g = "", e = 0;e < d;e++) {
                  b.push(g), Dc(a[e], b, c), g = ", "
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
                      e = d[h], Object.prototype.hasOwnProperty.call(a, e) && (l = a[e], b.push(g), Ac(e, b), b.push(": "), Dc(l, b, c), g = ", ")
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
function R(a, b, c) {
  c || (c = []);
  Dc(a, b, c)
}
function S(a, b) {
  var c = [];
  R(a, c, b);
  return c.join("")
}
;function Ec() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ pa()).toString(36)
}
function Fc(a) {
  return a.substr(0, a.length - 1)
}
var Gc = /^(0|[1-9]\d*)$/, Hc = /^(0|\-?[1-9]\d*)$/;
function Ic(a) {
  var b = Jc;
  return Gc.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;var Jc = Math.pow(2, 53);
var Kc = {ne:ba("<cw.eq.Wildcard>")};
function Lc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function Mc(a, b, c) {
  var d = t(a), g = t(b);
  if(a == Kc || b == Kc) {
    return j
  }
  if(a != k && "function" == typeof a.K) {
    return c && c.push("running custom equals function on left object"), a.K(b, c)
  }
  if(b != k && "function" == typeof b.K) {
    return c && c.push("running custom equals function on right object"), b.K(a, c)
  }
  if(Lc(d) || Lc(g)) {
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
                if(!Mc(a[d], b[d], c)) {
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
          if(a.me == Ba && b.me == Ba) {
            a: {
              c && c.push("descending into object");
              for(var e in a) {
                if(!(e in b)) {
                  c && c.push("property " + e + " missing on right object");
                  a = m;
                  break a
                }
                if(!Mc(a[e], b[e], c)) {
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
;function T(a, b) {
  this.df = a;
  this.Qb = b
}
T.prototype.K = function(a, b) {
  return ia(a) && this.constructor == a.constructor && Mc(this.Qb, a.Qb, b)
};
T.prototype.v = function(a, b) {
  a.push("new ", this.df, "(");
  for(var c = "", d = 0;d < this.Qb.length;d++) {
    a.push(c), c = ", ", R(this.Qb[d], a, b)
  }
  a.push(")")
};
var Nc, Oc;
function Pc(a, b) {
  T.call(this, "Question", [a, b]);
  this.body = a;
  this.ca = b
}
A(Pc, T);
function Qc(a, b) {
  T.call(this, "OkayAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(Qc, T);
function Rc(a, b) {
  T.call(this, "KnownErrorAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(Rc, T);
function Sc(a, b) {
  T.call(this, "UnknownErrorAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(Sc, T);
function Tc(a) {
  T.call(this, "Cancellation", [a]);
  this.ca = a
}
A(Tc, T);
function Uc(a) {
  T.call(this, "Notification", [a]);
  this.body = a
}
A(Uc, T);
function Vc(a) {
  if(a instanceof Pc) {
    return"Q"
  }
  if(a instanceof Qc) {
    return"K"
  }
  if(a instanceof Rc) {
    return"E"
  }
  if(a instanceof Sc) {
    return"U"
  }
  if(a instanceof Tc) {
    return"C"
  }
  if(a instanceof Uc) {
    return"#"
  }
  f(Error("qanTypeToCode bug"))
}
function Wc(a) {
  var b = Vc(a);
  if(a instanceof Tc) {
    return"" + a.ca + b
  }
  v(a.body) || f(Error("qanFrame.body must be a string, was " + S(a.body)));
  return a instanceof Uc ? a.body + b : a.body + "|" + ("" + a.ca) + b
}
function Xc(a) {
  B.call(this);
  this.message = a
}
A(Xc, B);
function Yc(a) {
  a = Ic(a);
  a === k && f(new Xc("bad qid"));
  return a
}
function Zc(a) {
  a || f(new Xc("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if("#" == b) {
    return new Uc(Fc(a))
  }
  if("C" == b) {
    var c = Yc(Fc(a));
    return new Tc(c)
  }
  a = a.split("|");
  c = a.splice(a.length - 1, a.length);
  0 < a.length && c.splice(0, 0, a.join("|"));
  a = c[0];
  c = c[1];
  u(c) || f(new Xc("Expected pipe char in frame"));
  c = Yc(Fc(c));
  if("Q" == b) {
    return new Pc(a, c)
  }
  if("K" == b) {
    return new Qc(a, c)
  }
  if("E" == b) {
    return new Rc(a, c)
  }
  if("U" == b) {
    return new Sc(a, c)
  }
  f(new Xc("Invalid QAN frame type " + S(b)))
}
function $c(a) {
  B.call(this);
  this.body = a
}
A($c, B);
$c.prototype.message = "KnownError with arbitrary body";
$c.prototype.v = function(a, b) {
  a.push("new KnownError(");
  R(this.body, a, b);
  a.push(")")
};
function ad(a) {
  B.call(this);
  this.body = a
}
A(ad, B);
ad.prototype.message = "UnknownError with arbitrary body";
ad.prototype.v = function(a, b) {
  a.push("new UnknownError(");
  R(this.body, a, b);
  a.push(")")
};
function bd(a) {
  B.call(this);
  this.message = a
}
A(bd, B);
function U(a, b, c, d) {
  this.Zc = a;
  this.jb = b;
  this.da = c;
  this.Cb = d;
  this.Pb = 0;
  this.ma = new L;
  this.Za = new L
}
p = U.prototype;
p.v = function(a) {
  a.push("<QANHelper asked ", "" + this.Pb, " questions, waiting for ", "" + this.ma.A(), " peer answers and ", "" + this.Za.A(), " local answers>")
};
p.wd = function(a) {
  if(a instanceof Qc || a instanceof Rc || a instanceof Sc) {
    var b = a.ca, c = this.ma.get(b);
    this.ma.remove(b);
    u(c) ? c !== k && (a instanceof Qc ? c.N(a.body) : a instanceof Rc ? c.P(new $c(a.body)) : a instanceof Sc ? c.P(new ad(a.body)) : f(Error("handleQANFrame bug"))) : this.Cb("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof Uc) {
      try {
        this.Zc(a.body, m)
      }catch(d) {
        this.jb("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof Pc) {
        if(b = a.ca, this.Za.Z(b)) {
          this.Cb("Received Question with duplicate qid: " + b)
        }else {
          a: {
            a = [a.body, j];
            try {
              c = this.Zc.apply(k, a ? a : [])
            }catch(g) {
              c = tc(g);
              break a
            }
            c = c instanceof Q ? c : c instanceof Error ? tc(c) : sc(c)
          }
          this.Za.set(b, c);
          var e = this;
          c.Y(function(a) {
            var c = b;
            e.Za.remove(c);
            e.da(new Qc(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Za.remove(c);
            a instanceof $c ? e.da(new Rc(a.body, c)) : a instanceof lc ? e.da(new Sc("CancelledError", c)) : (e.jb("Peer's Question #" + c + " caused uncaught exception", a), e.da(new Sc("Uncaught exception", c)));
            return k
          });
          c.tb(function(a) {
            this.jb("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof Tc && (b = a.ca, c = this.Za.get(b), u(c) && c.cancel())
      }
    }
  }
};
p.qe = function(a) {
  var b = this.Pb + 1;
  this.da(new Pc(a, b));
  this.Pb += 1;
  var c = this, a = new Q(function() {
    c.ma.set(b, k);
    c.da(new Tc(b))
  });
  this.ma.set(b, a);
  return a
};
p.Ze = function(a) {
  this.da(new Uc(a))
};
p.nd = function(a) {
  for(var b = this.ma.T(), c = 0;c < b.length;c++) {
    var d = this.ma.get(b[c]);
    u(d) && (this.ma.set(b[c], k), d.P(new bd(a)))
  }
};
function cd() {
  this.Yd = pa()
}
var dd = new cd;
cd.prototype.set = aa("Yd");
cd.prototype.reset = function() {
  this.set(pa())
};
cd.prototype.get = o("Yd");
function ed(a) {
  this.bf = a || "";
  this.mf = dd
}
ed.prototype.fe = j;
ed.prototype.lf = j;
ed.prototype.kf = j;
ed.prototype.ge = m;
function fd(a) {
  return 10 > a ? "0" + a : "" + a
}
function gd(a, b) {
  var c = (a.ie - b) / 1E3, d = c.toFixed(3), g = 0;
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
function hd(a) {
  ed.call(this, a)
}
A(hd, ed);
hd.prototype.ge = j;
function id() {
  var a = Math.pow(10, 9);
  return a + Math.random() * (Math.pow(10, 10) - a)
}
;var jd;
function kd(a, b) {
  var c;
  c = a.className;
  c = v(c) && c.match(/\S+/g) || [];
  for(var d = ob(arguments, 1), g = c.length + d.length, e = c, h = 0;h < d.length;h++) {
    0 <= fb(e, d[h]) || e.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == g
}
;var ld = !D || Wa(), md = !Ka && !D || D && Wa() || Ka && G("1.9.1");
D && G("9");
function nd(a) {
  return a ? new od(9 == a.nodeType ? a : a.ownerDocument || a.document) : jd || (jd = new od)
}
function V(a) {
  return v(a) ? document.getElementById(a) : a
}
var pd = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function qd(a, b, c) {
  return rd(document, arguments)
}
function rd(a, b) {
  var c = b[0], d = b[1];
  if(!ld && d && (d.name || d.type)) {
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
  d && (v(d) ? e.className = d : fa(d) ? kd.apply(k, [e].concat(d)) : Za(d, function(a, b) {
    "style" == b ? e.style.cssText = a : "class" == b ? e.className = a : "for" == b ? e.htmlFor = a : b in pd ? e.setAttribute(pd[b], a) : 0 == b.lastIndexOf("aria-", 0) ? e.setAttribute(b, a) : e[b] = a
  }));
  2 < b.length && sd(a, e, b, 2);
  return e
}
function sd(a, b, c, d) {
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
      h(l ? nb(e) : e, g)
    }else {
      g(e)
    }
  }
}
function od(a) {
  this.za = a || s.document || document
}
p = od.prototype;
p.rd = nd;
p.Ba = function(a) {
  return v(a) ? this.za.getElementById(a) : a
};
function td(a, b) {
  var c;
  c = a.za;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.bb = function(a, b, c) {
  return rd(this.za, arguments)
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
  sd(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
};
p.qd = function(a) {
  return md && a.children != i ? a.children : hb(a.childNodes, function(a) {
    return 1 == a.nodeType
  })
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
function ud(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
;function vd(a) {
  this.Wd = x(this.oe, this);
  this.pd = new hd;
  this.Cd = this.pd.fe = m;
  this.h = a;
  this.Ge = this.h.ownerDocument || this.h.document;
  var a = nd(this.h), b = k;
  if(D) {
    a = b = a.za.createStyleSheet(), D ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a.innerHTML = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
  }else {
    var c = td(a, "head")[0];
    c || (b = td(a, "body")[0], c = a.bb("head"), b.parentNode.insertBefore(c, b));
    var d = b = a.bb("style");
    D ? d.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : d.innerHTML = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}";
    a.appendChild(c, b)
  }
  this.h.className += " logdiv"
}
vd.prototype.hf = function(a) {
  if(a != this.Cd) {
    var b = P.oc();
    if(a) {
      var c = this.Wd;
      b.Oa || (b.Oa = []);
      b.Oa.push(c)
    }else {
      (b = b.Oa) && lb(b, this.Wd), this.Hg = ""
    }
    this.Cd = a
  }
};
vd.prototype.oe = function(a) {
  var b = 100 >= this.h.scrollHeight - this.h.scrollTop - this.h.clientHeight, c = this.Ge.createElement("div");
  c.className = "logmsg";
  var d = this.pd, g;
  switch(a.Sa.value) {
    case Zb.value:
      g = "dbg-sh";
      break;
    case $b.value:
      g = "dbg-sev";
      break;
    case ac.value:
      g = "dbg-w";
      break;
    case bc.value:
      g = "dbg-i";
      break;
    default:
      g = "dbg-f"
  }
  var e = [];
  e.push(d.bf, " ");
  if(d.fe) {
    var h = new Date(a.ie);
    e.push("[", fd(h.getFullYear() - 2E3) + fd(h.getMonth() + 1) + fd(h.getDate()) + " " + fd(h.getHours()) + ":" + fd(h.getMinutes()) + ":" + fd(h.getSeconds()) + "." + fd(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.lf && e.push("[", xa(gd(a, d.mf.get())), "s] ");
  d.kf && e.push("[", C(a.Ue), "] ");
  e.push('<span class="', g, '">', ra(xa(C(a.Md))));
  d.ge && a.mc && e.push("<br>", ra(xa(a.lc || "")));
  e.push("</span><br>");
  c.innerHTML = e.join("");
  this.h.appendChild(c);
  b && (this.h.scrollTop = this.h.scrollHeight)
};
vd.prototype.clear = function() {
  this.h.innerHTML = ""
};
var xd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function yd(a, b) {
  var c = a.match(xd), d = b.match(xd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function zd(a, b) {
  var c;
  if(a instanceof zd) {
    this.L = u(b) ? b : a.L, Ad(this, a.ta), c = a.Ka, W(this), this.Ka = c, Bd(this, a.ka), Cd(this, a.Ua), Dd(this, a.na), Ed(this, a.Q.S()), c = a.Aa, W(this), this.Aa = c
  }else {
    if(a && (c = ("" + a).match(xd))) {
      this.L = !!b;
      Ad(this, c[1] || "", j);
      var d = c[2] || "";
      W(this);
      this.Ka = d ? decodeURIComponent(d) : "";
      Bd(this, c[3] || "", j);
      Cd(this, c[4]);
      Dd(this, c[5] || "", j);
      Ed(this, c[6] || "", j);
      c = c[7] || "";
      W(this);
      this.Aa = c ? decodeURIComponent(c) : ""
    }else {
      this.L = !!b, this.Q = new Fd(k, 0, this.L)
    }
  }
}
p = zd.prototype;
p.ta = "";
p.Ka = "";
p.ka = "";
p.Ua = k;
p.na = "";
p.Aa = "";
p.Se = m;
p.L = m;
p.toString = function() {
  var a = [], b = this.ta;
  b && a.push(Gd(b, Hd), ":");
  if(b = this.ka) {
    a.push("//");
    var c = this.Ka;
    c && a.push(Gd(c, Hd), "@");
    a.push(encodeURIComponent("" + b));
    b = this.Ua;
    b != k && a.push(":", "" + b)
  }
  if(b = this.na) {
    this.ka && "/" != b.charAt(0) && a.push("/"), a.push(Gd(b, "/" == b.charAt(0) ? Id : Jd))
  }
  (b = this.Q.toString()) && a.push("?", b);
  (b = this.Aa) && a.push("#", Gd(b, Kd));
  return a.join("")
};
p.S = function() {
  return new zd(this)
};
function Ad(a, b, c) {
  W(a);
  a.ta = c ? b ? decodeURIComponent(b) : "" : b;
  a.ta && (a.ta = a.ta.replace(/:$/, ""))
}
function Bd(a, b, c) {
  W(a);
  a.ka = c ? b ? decodeURIComponent(b) : "" : b
}
function Cd(a, b) {
  W(a);
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.Ua = b) : a.Ua = k
}
function Dd(a, b, c) {
  W(a);
  a.na = c ? b ? decodeURIComponent(b) : "" : b
}
function Ed(a, b, c) {
  W(a);
  b instanceof Fd ? (a.Q = b, a.Q.Hc(a.L)) : (c || (b = Gd(b, Ld)), a.Q = new Fd(b, 0, a.L))
}
function W(a) {
  a.Se && f(Error("Tried to modify a read-only Uri"))
}
p.Hc = function(a) {
  this.L = a;
  this.Q && this.Q.Hc(a);
  return this
};
function Md(a) {
  return a instanceof zd ? a.S() : new zd(a, i)
}
function Gd(a, b) {
  return v(a) ? encodeURI(a).replace(b, Nd) : k
}
function Nd(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Hd = /[#\/\?@]/g, Jd = /[\#\?:]/g, Id = /[\#\?]/g, Ld = /[\#\?@]/g, Kd = /#/g;
function Fd(a, b, c) {
  this.F = a || k;
  this.L = !!c
}
function Od(a) {
  if(!a.l && (a.l = new L, a.c = 0, a.F)) {
    for(var b = a.F.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), g = k, e = k;
      0 <= d ? (g = b[c].substring(0, d), e = b[c].substring(d + 1)) : g = b[c];
      g = decodeURIComponent(g.replace(/\+/g, " "));
      g = Pd(a, g);
      a.add(g, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
    }
  }
}
p = Fd.prototype;
p.l = k;
p.c = k;
p.A = function() {
  Od(this);
  return this.c
};
p.add = function(a, b) {
  Od(this);
  this.F = k;
  var a = Pd(this, a), c = this.l.get(a);
  c || this.l.set(a, c = []);
  c.push(b);
  this.c++;
  return this
};
p.remove = function(a) {
  Od(this);
  a = Pd(this, a);
  return this.l.Z(a) ? (this.F = k, this.c -= this.l.get(a).length, this.l.remove(a)) : m
};
p.clear = function() {
  this.l = this.F = k;
  this.c = 0
};
p.fb = function() {
  Od(this);
  return 0 == this.c
};
p.Z = function(a) {
  Od(this);
  a = Pd(this, a);
  return this.l.Z(a)
};
p.ec = function(a) {
  var b = this.C();
  return 0 <= fb(b, a)
};
p.T = function() {
  Od(this);
  for(var a = this.l.C(), b = this.l.T(), c = [], d = 0;d < b.length;d++) {
    for(var g = a[d], e = 0;e < g.length;e++) {
      c.push(b[d])
    }
  }
  return c
};
p.C = function(a) {
  Od(this);
  var b = [];
  if(a) {
    this.Z(a) && (b = mb(b, this.l.get(Pd(this, a))))
  }else {
    for(var a = this.l.C(), c = 0;c < a.length;c++) {
      b = mb(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  Od(this);
  this.F = k;
  a = Pd(this, a);
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
  var a = new Fd;
  a.F = this.F;
  this.l && (a.l = this.l.S());
  return a
};
function Pd(a, b) {
  var c = "" + b;
  a.L && (c = c.toLowerCase());
  return c
}
p.Hc = function(a) {
  a && !this.L && (Od(this), this.F = k, Kb(this.l, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.remove(d), 0 < a.length && (this.F = k, this.l.set(Pd(this, d), nb(a)), this.c += a.length))
  }, this));
  this.L = a
};
function Qd(a) {
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
;function Rd(a, b) {
  this.La = a;
  this.Ha = b
}
Rd.prototype.K = function(a) {
  return a instanceof Rd && this.La == a.La && this.Ha.join(",") == a.Ha
};
Rd.prototype.v = function(a, b) {
  a.push("new SACK(", "" + this.La, ", ");
  R(this.Ha, a, b);
  a.push(")")
};
function Sd() {
  this.G = new L
}
Sd.prototype.ya = -1;
Sd.prototype.I = 0;
Sd.prototype.append = function(a) {
  var b = Qd(a);
  this.G.set(this.ya + 1, [a, b]);
  this.ya += 1;
  this.I += b
};
Sd.prototype.v = function(a) {
  a.push("<Queue with ", "" + this.G.A(), " item(s), counter=#", "" + this.ya, ", size=", "" + this.I, ">")
};
function Td(a) {
  a = a.G.T();
  H.sort.call(a, pb);
  return a
}
function Ud() {
  this.wa = new L
}
Ud.prototype.Ea = -1;
Ud.prototype.I = 0;
function Vd(a) {
  var b = a.wa.T();
  H.sort.call(b, pb);
  return new Rd(a.Ea, b)
}
var Wd = {};
function Xd(a, b) {
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
        a.push('<property id="', d, '">'), Xd(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != t(b[c]) && (a.push('<property id="', C(c), '">'), Xd(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function Yd(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, g = arguments;
  d.push("<arguments>");
  for(var e = g.length, h = 1;h < e;h++) {
    Xd(d, g[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var Zd = m, $d = "";
function ae(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var be = navigator.plugins["Shockwave Flash"];
  be && (Zd = j, be.description && ($d = ae(be.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (Zd = j, $d = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var ce = navigator.mimeTypes["application/x-shockwave-flash"];
    (Zd = ce && ce.enabledPlugin) && ($d = ae(ce.enabledPlugin.description))
  }else {
    try {
      var de = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), Zd = j, $d = ae(de.GetVariable("$version"))
    }catch(ee) {
      try {
        de = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), Zd = j, $d = "6.0.21"
      }catch(fe) {
        try {
          de = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), Zd = j, $d = ae(de.GetVariable("$version"))
        }catch(ge) {
        }
      }
    }
  }
}
var he = $d;
function ie(a) {
  this.Oe = a;
  this.g = []
}
A(ie, I);
var je = [];
ie.prototype.Fc = function() {
  gb(this.g, Cb);
  this.g.length = 0
};
ie.prototype.d = function() {
  ie.m.d.call(this);
  this.Fc()
};
ie.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function ke() {
}
ke.sd = function() {
  return ke.Bd ? ke.Bd : ke.Bd = new ke
};
ke.prototype.Ye = 0;
ke.sd();
function le(a) {
  this.ic = a || nd();
  this.ff = me
}
A(le, ic);
le.prototype.Re = ke.sd();
var me = k;
p = le.prototype;
p.U = k;
p.Da = m;
p.h = k;
p.ff = k;
p.We = k;
p.t = k;
p.ia = k;
p.xb = k;
p.xf = m;
function ne(a) {
  return a.U || (a.U = ":" + (a.Re.Ye++).toString(36))
}
p.Ba = o("h");
p.getParent = o("t");
p.Jc = function(a) {
  this.t && this.t != a && f(Error("Method not supported"));
  le.m.Jc.call(this, a)
};
p.rd = o("ic");
p.bb = function() {
  this.h = this.ic.createElement("div")
};
p.zb = function() {
  this.Da = j;
  oe(this, function(a) {
    !a.Da && a.Ba() && a.zb()
  })
};
function pe(a) {
  oe(a, function(a) {
    a.Da && pe(a)
  });
  a.Gb && a.Gb.Fc();
  a.Da = m
}
p.d = function() {
  le.m.d.call(this);
  this.Da && pe(this);
  this.Gb && (this.Gb.b(), delete this.Gb);
  oe(this, function(a) {
    a.b()
  });
  if(!this.xf && this.h) {
    var a = this.h;
    a && a.parentNode && a.parentNode.removeChild(a)
  }
  this.t = this.We = this.h = this.xb = this.ia = k
};
function oe(a, b) {
  a.ia && gb(a.ia, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = v(a) ? a : ne(a), d;
    this.xb && c ? (d = this.xb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.xb, c in d && delete d[c], lb(this.ia, a), b && (pe(a), a.h && (c = a.h) && c.parentNode && c.parentNode.removeChild(c)), c = a, c == k && f(Error("Unable to set parent component")), c.t = k, le.m.Jc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function qe(a, b) {
  le.call(this, b);
  this.Ke = a;
  this.kc = new ie(this);
  this.Db = new L
}
A(qe, le);
p = qe.prototype;
p.a = O("goog.ui.media.FlashObject");
p.zf = "window";
p.Yc = "#000000";
p.pe = "sameDomain";
function re(a, b, c) {
  a.Vc = v(b) ? b : Math.round(b) + "px";
  a.qc = v(c) ? c : Math.round(c) + "px";
  a.Ba() && (b = a.Ba() ? a.Ba().firstChild : k, c = a.Vc, a = a.qc, a == i && f(Error("missing height argument")), b.style.width = ud(c), b.style.height = ud(a))
}
p.zb = function() {
  qe.m.zb.call(this);
  var a = this.Ba(), b;
  b = D ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = D ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = qa(c, this.zf), d = this.Db.T(), g = this.Db.C(), e = [], h = 0;h < d.length;h++) {
    e.push(encodeURIComponent("" + d[h]) + "=" + encodeURIComponent("" + g[h]))
  }
  b = qa(b, ne(this), ne(this), "goog-ui-media-flash-object", C(this.Ke), C(e.join("&")), this.Yc, this.pe, c);
  a.innerHTML = b;
  this.Vc && this.qc && re(this, this.Vc, this.qc);
  a = this.kc;
  b = this.Ba();
  c = $a(qb);
  fa(c) || (je[0] = c, c = je);
  for(d = 0;d < c.length;d++) {
    g = yb(b, c[d], tb || a, m, a.Oe || a), a.g.push(g)
  }
};
p.bb = function() {
  this.$d != k && !(0 <= ya(he, this.$d)) && (this.a.q("Required flash version not found:" + this.$d), f(Error("Method not supported")));
  var a = this.rd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.h = a
};
p.d = function() {
  qe.m.d.call(this);
  this.Db = k;
  this.kc.b();
  this.kc = k
};
function se(a) {
  B.call(this, a)
}
A(se, B);
se.prototype.name = "cw.loadflash.FlashLoadFailed";
s.__loadFlashObject_callbacks = {};
function te(a, b) {
  this.U = "_" + Ec();
  this.Xb = a;
  this.pa = b;
  this.va = a.va
}
A(te, I);
p = te.prototype;
p.Fa = j;
p.yb = m;
p.a = O("cw.net.FlashSocket");
p.v = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.U);
  a.push("'>")
};
function ue(a, b, c) {
  if("frames" == b) {
    a = a.pa, ve(a.w), we(a.w, c)
  }else {
    if("stillreceiving" == b) {
      c = a.pa, c.a.s("onstillreceiving"), ve(c.w)
    }else {
      if("connect" == b) {
        a.pa.onconnect()
      }else {
        "close" == b ? (a.Fa = m, a.b()) : "ioerror" == b ? (a.Fa = m, b = a.pa, b.a.q("onioerror: " + S(c)), xe(b.w, m), a.b()) : "securityerror" == b ? (a.Fa = m, b = a.pa, b.a.q("onsecurityerror: " + S(c)), xe(b.w, m), a.b()) : f(Error("bad event: " + b))
      }
    }
  }
}
p.dc = function(a, b) {
  try {
    var c = this.va.CallFunction(Yd("__FC_connect", this.U, a, b, "<int32/>\n"))
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
    var b = this.va.CallFunction(Yd("__FC_writeFrames", this.U, a))
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
  te.m.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Fa) {
    try {
      var b = a.CallFunction(Yd("__FC_close", this.U));
      this.a.info("disposeInternal: __FC_close ret: " + b)
    }catch(c) {
      this.a.H("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + c.message), this.yb = j
    }
  }
  if(this.yb) {
    a = this.pa, a.a.q("oncrash"), xe(a.w, j)
  }else {
    this.pa.onclose()
  }
  delete this.pa;
  delete this.Xb.Pa[this.U]
};
function ye(a, b) {
  this.o = a;
  this.va = b;
  this.Pa = {};
  this.cc = "__FST_" + Ec();
  s[this.cc] = x(this.Fe, this);
  var c = b.CallFunction(Yd("__FC_setCallbackFunc", this.cc));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(ye, I);
p = ye.prototype;
p.a = O("cw.net.FlashSocketTracker");
p.v = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  R(this.Pa, a, b);
  a.push(">")
};
p.gc = function(a) {
  a = new te(this, a);
  return this.Pa[a.U] = a
};
p.De = function(a, b, c, d) {
  var g = this.Pa[a];
  g ? "frames" == b && d ? (ue(g, "ioerror", "FlashConnector hadError while handling data."), g.b()) : ue(g, b, c) : this.a.q("Cannot dispatch because we have no instance: " + S([a, b, c, d]))
};
p.Fe = function(a, b, c, d) {
  try {
    var g = this.o;
    g.Ab.push([this.De, this, [a, b, c, d]]);
    g.Qc == k && (g.Qc = g.z.setTimeout(g.ve, 0))
  }catch(e) {
    s.window.setTimeout(function() {
      f(e)
    }, 0)
  }
};
p.d = function() {
  ye.m.d.call(this);
  for(var a = $a(this.Pa);a.length;) {
    a.pop().b()
  }
  delete this.Pa;
  delete this.va;
  s[this.cc] = i
};
function ze(a) {
  this.w = a;
  this.ab = []
}
A(ze, I);
p = ze.prototype;
p.a = O("cw.net.FlashSocketConduit");
p.sb = function(a) {
  this.ab ? (this.a.s("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.ab.push.apply(this.ab, a)) : (this.a.s("writeFrames: Writing " + a.length + " frame(s)."), this.Ub.sb(a))
};
p.dc = function(a, b) {
  this.Ub.dc(a, b)
};
p.onconnect = function() {
  this.a.info("onconnect");
  ve(this.w);
  var a = this.ab;
  this.ab = k;
  a.length && (this.a.s("onconnect: Writing " + a.length + " buffered frame(s)."), this.Ub.sb(a))
};
p.onclose = function() {
  this.a.info("onclose");
  xe(this.w, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  ze.m.d.call(this);
  this.Ub.b();
  delete this.w
};
var Ae = [];
function Be() {
  var a = new Q;
  Ae.push(a);
  return a
}
function Ce(a) {
  var b = Ae;
  Ae = [];
  gb(b, function(b) {
    b.N(a)
  });
  return k
}
function De(a) {
  var b = Ae;
  Ae = [];
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
function Ee() {
}
Ee.prototype.K = function(a, b) {
  return!(a instanceof Ee) ? m : Mc(Fe(this), Fe(a), b)
};
Ee.prototype.v = function(a, b) {
  a.push("<HelloFrame properties=");
  R(Fe(this), a, b);
  a.push(">")
};
function Fe(a) {
  return[a.fa, a.Ud, a.yd, a.Zd, a.pb, a.Nc, a.Nd, a.Ld, a.xc, a.Jd, a.ke, a.he, a.sa, a.Jb]
}
Ee.prototype.J = Y;
Ee.prototype.O = function(a) {
  var b = {};
  b.tnum = this.fa;
  b.ver = this.Ud;
  b.format = this.yd;
  b["new"] = this.Zd;
  b.id = this.pb;
  b.ming = this.Nc;
  b.pad = this.Nd;
  b.maxb = this.Ld;
  u(this.xc) && (b.maxt = this.xc);
  b.maxia = this.Jd;
  b.tcpack = this.ke;
  b.eeds = this.he;
  b.sack = this.sa instanceof Rd ? Fc((new Ge(this.sa)).J()) : this.sa;
  b.seenack = this.Jb instanceof Rd ? Fc((new Ge(this.Jb)).J()) : this.Jb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(xc(b), "H")
};
function He(a) {
  T.call(this, "StringFrame", [a]);
  this.Pc = a
}
A(He, T);
He.prototype.J = Y;
He.prototype.O = function(a) {
  a.push(this.Pc, " ")
};
function Ie(a) {
  T.call(this, "CommentFrame", [a]);
  this.xe = a
}
A(Ie, T);
Ie.prototype.J = Y;
Ie.prototype.O = function(a) {
  a.push(this.xe, "^")
};
function Je(a) {
  T.call(this, "SeqNumFrame", [a]);
  this.ee = a
}
A(Je, T);
Je.prototype.J = Y;
Je.prototype.O = function(a) {
  a.push("" + this.ee, "N")
};
function Me(a) {
  var b = a.split("|");
  if(2 != b.length) {
    return k
  }
  a: {
    var c = b[1], a = Jc;
    if(Hc.test(c) && (c = parseInt(c, 10), -1 <= c && c <= a)) {
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
      var e = Ic(b[d]);
      if(e == k) {
        return k
      }
      c.push(e)
    }
  }
  return new Rd(a, c)
}
function Ge(a) {
  T.call(this, "SackFrame", [a]);
  this.sa = a
}
A(Ge, T);
Ge.prototype.J = Y;
Ge.prototype.O = function(a) {
  var b = this.sa;
  a.push(b.Ha.join(","), "|", "" + b.La);
  a.push("A")
};
function Ne(a) {
  T.call(this, "StreamStatusFrame", [a]);
  this.Fd = a
}
A(Ne, T);
Ne.prototype.J = Y;
Ne.prototype.O = function(a) {
  var b = this.Fd;
  a.push(b.Ha.join(","), "|", "" + b.La);
  a.push("T")
};
function Oe() {
  T.call(this, "StreamCreatedFrame", [])
}
A(Oe, T);
Oe.prototype.J = Y;
Oe.prototype.O = function(a) {
  a.push("C")
};
function Pe() {
  T.call(this, "YouCloseItFrame", [])
}
A(Pe, T);
Pe.prototype.J = Y;
Pe.prototype.O = function(a) {
  a.push("Y")
};
function Qe(a, b) {
  T.call(this, "ResetFrame", [a, b]);
  this.Xd = a;
  this.Xc = b
}
A(Qe, T);
Qe.prototype.J = Y;
Qe.prototype.O = function(a) {
  a.push(this.Xd, "|", "" + Number(this.Xc), "!")
};
var Re = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Se(a) {
  T.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(Se, T);
Se.prototype.J = Y;
Se.prototype.O = function(a) {
  a.push(this.reason, "K")
};
function Te(a) {
  a || f(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new He(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = Me(Fc(a)), a == k && f(new X("bad sack")), new Ge(a)
  }
  if("N" == b) {
    return a = Ic(Fc(a)), a == k && f(new X("bad seqNum")), new Je(a)
  }
  if("T" == b) {
    return a = Me(Fc(a)), a == k && f(new X("bad lastSackSeen")), new Ne(a)
  }
  if("Y" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Pe
  }
  if("^" == b) {
    return new Ie(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Oe
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && f(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && f(new X("bad applicationLevel")), new Qe(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = Re[a], a == k && f(new X("unknown kill reason: " + a)), new Se(a)
  }
  f(new X("Invalid frame type " + b))
}
;function Ue(a, b, c, d) {
  this.contentWindow = a;
  this.Bb = b;
  this.Oc = c;
  this.Le = d
}
Ue.prototype.v = function(a, b) {
  a.push("<XDRFrame frameId=");
  R(this.Le, a, b);
  a.push(", expandedUrl=");
  R(this.Bb, a, b);
  a.push(", streams=");
  R(this.Oc, a, b);
  a.push(">")
};
function Ve() {
  this.frames = [];
  this.vc = new L
}
Ve.prototype.a = O("cw.net.XDRTracker");
function We(a, b) {
  for(var c = Xe, d = 0;d < c.frames.length;d++) {
    var g = c.frames[d], e;
    if(e = 0 == g.Oc.length) {
      e = g.Bb;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      e = RegExp("^" + h + "$").test(e)
    }
    if(e) {
      return c.a.info("Giving " + S(b) + " existing frame " + S(g)), sc(g)
    }
  }
  d = Ec() + Ec();
  g = a.replace(/%random%/g, function() {
    return"ml" + Math.floor(id()) + ("" + Math.floor(id()))
  });
  e = s.location;
  e instanceof zd || (e = Md(e));
  g instanceof zd || (g = Md(g));
  var l = e;
  e = g;
  g = l.S();
  (h = !!e.ta) ? Ad(g, e.ta) : h = !!e.Ka;
  if(h) {
    var n = e.Ka;
    W(g);
    g.Ka = n
  }else {
    h = !!e.ka
  }
  h ? Bd(g, e.ka) : h = e.Ua != k;
  n = e.na;
  if(h) {
    Cd(g, e.Ua)
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
  h ? Dd(g, n) : h = "" !== e.Q.toString();
  h ? Ed(g, e.Q.toString() ? decodeURIComponent(e.Q.toString()) : "") : h = !!e.Aa;
  h && (e = e.Aa, W(g), g.Aa = e);
  g = g.toString();
  e = ("" + s.location).match(xd)[3] || k;
  h = g.match(xd)[3] || k;
  e == h ? (c.a.info("No need to make a real XDRFrame for " + S(b)), c = sc(new Ue(s, g, [b], k))) : ((e = V("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new Q, c.vc.set(d, [h, g, b]), c.a.info("Creating new XDRFrame " + S(d) + "for " + S(b)), c = qd("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:g + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), e.appendChild(c), c = h);
  return c
}
Ve.prototype.Bf = function(a) {
  var b = this.vc.get(a);
  b || f(Error("Unknown frameId " + S(a)));
  this.vc.remove(b);
  var c = b[0], a = new Ue(V("minerva-xdrframe-" + a).contentWindow || (V("minerva-xdrframe-" + a).contentDocument || V("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (V("minerva-xdrframe-" + a).contentDocument || V("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var Xe = new Ve;
s.__XHRTracker_xdrFrameLoaded = x(Xe.Bf, Xe);
var Ye;
Ye = m;
var Ze = Ga();
Ze && (-1 != Ze.indexOf("Firefox") || -1 != Ze.indexOf("Camino") || -1 != Ze.indexOf("iPhone") || -1 != Ze.indexOf("iPod") || -1 != Ze.indexOf("iPad") || -1 != Ze.indexOf("Android") || -1 != Ze.indexOf("Chrome") && (Ye = j));
var $e = Ye;
function af(a, b, c, d, g, e) {
  Q.call(this, g, e);
  this.Id = a;
  this.hc = [];
  this.od = !!b;
  this.Je = !!c;
  this.ze = !!d;
  for(b = 0;b < a.length;b++) {
    a[b].Y(x(this.vd, this, b, j), x(this.vd, this, b, m))
  }
  0 == a.length && !this.od && this.N(this.hc)
}
A(af, Q);
af.prototype.Pd = 0;
af.prototype.vd = function(a, b, c) {
  this.Pd++;
  this.hc[a] = [b, c];
  this.$ || (this.od && b ? this.N([a, c]) : this.Je && !b ? this.P(c) : this.Pd == this.Id.length && this.N(this.hc));
  this.ze && !b && (c = k);
  return c
};
af.prototype.P = function(a) {
  af.m.P.call(this, a);
  gb(this.Id, function(a) {
    a.cancel()
  })
};
function bf(a, b) {
  this.Af = a;
  this.Kd = b
}
bf.prototype.tc = 0;
bf.prototype.Mb = 0;
bf.prototype.nc = m;
function cf(a) {
  var b = [];
  if(a.nc) {
    return[b, 2]
  }
  var c = a.tc, d = a.Af.responseText;
  for(a.tc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var g = d.substr(a.Mb, c - a.Mb), g = g.replace(/\r$/, "");
    if(g.length > a.Kd) {
      return a.nc = j, [b, 2]
    }
    b.push(g);
    a.Mb = c += 1
  }
  return a.tc - a.Mb - 1 > a.Kd ? (a.nc = j, [b, 2]) : [b, 1]
}
;function df(a, b, c) {
  this.w = b;
  this.R = a;
  this.fc = c
}
A(df, I);
p = df.prototype;
p.a = O("cw.net.XHRMaster");
p.qa = -1;
p.wc = function(a, b, c) {
  this.fc.__XHRSlave_makeRequest(this.R, a, b, c)
};
p.la = o("qa");
p.zc = function(a, b) {
  1 != b && this.a.H(S(this.R) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  ve(this.w);
  we(this.w, a)
};
p.Ac = function(a) {
  this.a.j("ongotheaders_: " + S(a));
  var b = k;
  "Content-Length" in a && (b = Ic(a["Content-Length"]));
  a = this.w;
  a.a.j(a.k() + " got Content-Length: " + b);
  a.X == ef && (b == k && (a.a.q("Expected to receive a valid Content-Length, but did not."), b = 5E5), ff(a, 2E3 + 1E3 * (b / 3072)))
};
p.Bc = function(a) {
  1 != a && this.a.j(this.w.k() + "'s XHR's readyState is " + a);
  this.qa = a;
  2 <= this.qa && ve(this.w)
};
p.yc = function() {
  this.w.b()
};
p.d = function() {
  df.m.d.call(this);
  delete Z.ba[this.R];
  this.fc.__XHRSlave_dispose(this.R);
  delete this.fc
};
function gf() {
  this.ba = {}
}
A(gf, I);
p = gf.prototype;
p.a = O("cw.net.XHRMasterTracker");
p.gc = function(a, b) {
  var c = "_" + Ec(), d = new df(c, a, b);
  return this.ba[c] = d
};
p.zc = function(a, b, c) {
  if(Ka) {
    for(var d = [], g = 0, e = b.length;g < e;g++) {
      d[g] = b[g]
    }
    b = d
  }else {
    b = mb(b)
  }
  (d = this.ba[a]) ? d.zc(b, c) : this.a.H("onframes_: no master for " + S(a))
};
p.Ac = function(a, b) {
  var c = this.ba[a];
  c ? c.Ac(b) : this.a.H("ongotheaders_: no master for " + S(a))
};
p.Bc = function(a, b) {
  var c = this.ba[a];
  c ? c.Bc(b) : this.a.H("onreadystatechange_: no master for " + S(a))
};
p.yc = function(a) {
  var b = this.ba[a];
  b ? (delete this.ba[b.R], b.yc()) : this.a.H("oncomplete_: no master for " + S(a))
};
p.d = function() {
  gf.m.d.call(this);
  for(var a = $a(this.ba);a.length;) {
    a.pop().b()
  }
  delete this.ba
};
var Z = new gf;
s.__XHRMaster_onframes = x(Z.zc, Z);
s.__XHRMaster_oncomplete = x(Z.yc, Z);
s.__XHRMaster_ongotheaders = x(Z.Ac, Z);
s.__XHRMaster_onreadystatechange = x(Z.Bc, Z);
function hf(a, b, c) {
  this.V = a;
  this.host = b;
  this.port = c
}
function jf(a, b, c) {
  this.host = a;
  this.port = b;
  this.tf = c
}
function kf(a, b) {
  b || (b = a);
  this.V = a;
  this.ua = b
}
kf.prototype.v = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  R(this.V, a, b);
  a.push(", secondaryUrl=");
  R(this.ua, a, b);
  a.push(">")
};
function lf(a, b, c, d) {
  this.V = a;
  this.Td = b;
  this.ua = c;
  this.ce = d;
  (!(0 == this.V.indexOf("http://") || 0 == this.V.indexOf("https://")) || !(0 == this.ua.indexOf("http://") || 0 == this.ua.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Td.location.href;
  yd(this.V, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.ce.location.href;
  yd(this.ua, a) || f(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
lf.prototype.v = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  R(this.V, a, b);
  a.push(", secondaryUrl=");
  R(this.ua, a, b);
  a.push(">")
};
var mf = new Ie(";)]}");
function nf() {
}
function of(a) {
  s.setTimeout(function() {
    u(a.message) && a.stack && (a.message += "\n" + a.stack);
    f(a)
  }, 0)
}
function pf(a, b, c) {
  u(b) || (b = j);
  u(c) || (c = j);
  this.Va = a;
  this.wf = b;
  this.qf = c
}
p = pf.prototype;
p.a = O("cw.net.QANProtocolWrapper");
p.jb = function(a, b) {
  this.a.q(a, b);
  this.qf && of(b)
};
p.da = function(a) {
  this.Ya.de(Wc(a), this.wf)
};
p.Cb = function(a) {
  this.Ya.reset("QANHelper said: " + a)
};
p.of = function(a) {
  this.Ya = a;
  this.Ec = new U(x(this.Va.bodyReceived, this.Va), x(this.jb, this), x(this.da, this), x(this.Cb, this));
  this.Va.streamStarted.call(this.Va, this.Ya, this.Ec)
};
p.nf = function(a, b) {
  this.Ec.nd("Stream reset applicationLevel=" + S(b) + ", reason: " + a);
  this.Va.streamReset.call(this.Va, a, b)
};
p.pf = function(a) {
  try {
    var b = Zc(a)
  }catch(c) {
    c instanceof Xc || f(c);
    this.Ya.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Ec.wd(b)
};
function qf(a) {
  this.Ya = a
}
qf.prototype.v = function(a, b) {
  a.push("<UserContext for ");
  R(this.Ya, a, b);
  a.push(">")
};
qf.prototype.toString = function() {
  return S(this)
};
function rf(a, b, c, d) {
  T.call(this, "TransportInfo", [a, b, c, d]);
  this.fa = a;
  this.Gg = b;
  this.Kg = c;
  this.Lg = d
}
A(rf, T);
function $(a, b, c) {
  this.r = a;
  this.Jg = b ? b : new nf;
  this.o = c ? c : vc;
  this.qb = new Qb;
  this.pb = Ec() + Ec();
  this.W = new Sd;
  this.sc = new Ud;
  this.rb = k;
  this.Yb = [];
  this.Ja = new qf(this);
  this.ue = x(this.uf, this);
  F && (this.rb = Ab(s, "load", this.ef, m, this))
}
A($, I);
p = $.prototype;
p.a = O("cw.net.ClientStream");
p.Gd = new Rd(-1, []);
p.Hd = new Rd(-1, []);
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
p.Sd = 0;
p.be = 0;
p.v = function(a, b) {
  a.push("<ClientStream id=");
  R(this.pb, a, b);
  a.push(", state=", "" + this.B);
  a.push(", primary=");
  R(this.e, a, b);
  a.push(", secondary=");
  R(this.p, a, b);
  a.push(", resetting=");
  R(this.lb, a, b);
  a.push(">")
};
p.toString = function() {
  return S(this)
};
p.Ne = o("Ja");
p.se = function(a) {
  u(a.streamStarted) || f(Error("Protocol is missing required method streamStarted"));
  u(a.streamReset) || f(Error("Protocol is missing required method streamReset"));
  u(a.stringReceived) || f(Error("Protocol is missing required method stringReceived"));
  this.onstarted = x(a.streamStarted, a);
  this.onreset = x(a.streamReset, a);
  this.onstring = x(a.stringReceived, a);
  this.Cc = u(a.transportCreated) ? x(a.transportCreated, a) : k;
  this.Dc = u(a.transportDestroyed) ? x(a.transportDestroyed, a) : k
};
function sf(a) {
  var b = [-1];
  a.e && b.push(a.e.Ta);
  a.p && b.push(a.p.Ta);
  return Math.max.apply(Math.max, b)
}
function tf(a) {
  if(!("3_STARTED" > a.B)) {
    uf(a);
    var b = 0 != a.W.G.A(), c = Vd(a.sc), d = !c.K(a.Hd) && !(a.e && c.K(a.e.Ra) || a.p && c.K(a.p.Ra)), g = sf(a);
    if((b = b && g < a.W.ya) || d) {
      var e = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.xa ? (a.a.s("tryToSend_: writing " + e + " to primary"), d && (d = a.e, c != d.Ra && (!d.ea && !d.u.length && vf(d), d.u.push(new Ge(c)), d.Ra = c)), b && wf(a.e, a.W, g + 1), a.e.aa()) : a.p == k ? a.Lc ? (a.a.s("tryToSend_: creating secondary to send " + e), a.p = xf(a, m, j), a.p && (b && wf(a.p, a.W, g + 1), a.p.aa())) : (a.a.s("tryToSend_: not creating a secondary because stream might not exist on server"), a.Gc = j) : a.a.s("tryToSend_: need to send " + e + ", but can't right now")
    }
  }
}
function uf(a) {
  a.Xa != k && (a.o.z.clearTimeout(a.Xa), a.Xa = k)
}
p.uf = function() {
  this.Xa = k;
  tf(this)
};
function yf(a) {
  a.Xa == k && (a.Xa = a.o.z.setTimeout(a.ue, 6))
}
p.ef = function() {
  this.rb = k;
  if(this.e && this.e.Qa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.$b = j;
    a.b()
  }
  this.p && this.p.Qa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.p, a.$b = j, a.b())
};
p.de = function(a, b) {
  u(b) || (b = j);
  "3_STARTED" < this.B && f(Error("sendString: Can't send in state " + this.B));
  b && (v(a) || f(Error("sendString: not a string: " + S(a))), /^([ -~]*)$/.test(a) || f(Error("sendString: string has illegal chars: " + S(a))));
  this.W.append(a);
  yf(this)
};
function xf(a, b, c) {
  var d;
  a.r instanceof lf ? d = ef : a.r instanceof jf ? d = zf : f(Error("Don't support endpoint " + S(a.r)));
  a.Rc += 1;
  b = new Af(a.o, a, a.Rc, d, a.r, b);
  a.a.s("Created: " + b.k());
  if(c) {
    if(a.Cc) {
      c = new rf(b.fa, b.ha, b.ra, b.xa);
      try {
        a.Cc.call(a.Ja, c)
      }catch(g) {
        a.a.q("ontransportcreated raised uncaught exception", g), of(g)
      }
    }
    if(Bf(a)) {
      return k
    }
  }
  a.qb.add(b);
  return b
}
function Cf(a, b, c) {
  var d = new Df(a.o, a, b, c);
  a.a.s("Created: " + d.k() + ", delay=" + b + ", times=" + c);
  a.qb.add(d);
  return d
}
function Ef(a, b) {
  a.qb.remove(b) || f(Error("transportOffline_: Transport was not removed?"));
  a.a.j("Offline: " + b.k());
  var c = "4_RESETTING" == a.B && b.le;
  if(b instanceof Af && !c) {
    if(a.Dc) {
      var d = new rf(b.fa, b.ha, b.ra, b.xa);
      try {
        a.Dc.call(a.Ja, d)
      }catch(g) {
        a.a.q("ontransportdestroyed raised uncaught exception", g), of(g)
      }
    }
    if(Bf(a)) {
      return
    }
  }
  a.Mc = b.oa ? a.Mc + b.oa : 0;
  1 <= a.Mc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), Ff(a, "stream penalty reached limit", m), a.b());
  if("3_STARTED" < a.B) {
    c ? (a.a.j("Disposing because resettingTransport_ is done."), a.b()) : a.a.j("Not creating a transport because ClientStream is in state " + a.B)
  }else {
    c = b instanceof Df;
    if(!c && b.$b) {
      var e = F ? $e ? [0, 1] : [9, 20] : [0, 0], c = e[0], d = e[1];
      a.a.s("getDelayForNextTransport_: " + S({delay:c, times:d}))
    }else {
      if(d = b.cd(), b == a.e ? d ? e = ++a.Sd : c || (e = a.Sd = 0) : d ? e = ++a.be : c || (e = a.be = 0), c || !e) {
        d = c = 0, a.a.s("getDelayForNextTransport_: " + S({count:e, delay:c, times:d}))
      }else {
        var h = 2E3 * Math.min(e, 3), l = Math.floor(4E3 * Math.random()) - 2E3, n = Math.max(0, b.je - b.Sc), d = (c = Math.max(0, h + l - n)) ? 1 : 0;
        a.a.s("getDelayForNextTransport_: " + S({count:e, base:h, variance:l, oldDuration:n, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    if(b == a.e) {
      a.e = k;
      if(c) {
        a.e = Cf(a, e, c)
      }else {
        e = sf(a);
        a.e = xf(a, j, j);
        if(!a.e) {
          return
        }
        wf(a.e, a.W, e + 1)
      }
      a.e.aa()
    }else {
      b == a.p && (a.p = k, c ? (a.p = Cf(a, e, c), a.p.aa()) : tf(a))
    }
  }
}
function Ff(a, b, c) {
  if(a.onreset) {
    try {
      a.onreset.call(a.Ja, b, c)
    }catch(d) {
      a.a.q("onreset raised uncaught exception", d), of(d)
    }
  }
}
p.reset = function(a) {
  "3_STARTED" < this.B && f(Error("reset: Can't send reset in state " + this.B));
  uf(this);
  0 != this.W.G.A() && this.a.q("reset: strings in send queue will never be sent: " + S(this.W));
  this.B = "4_RESETTING";
  this.e && this.e.xa ? (this.a.info("reset: Sending ResetFrame over existing primary."), Gf(this.e, a), this.e.aa()) : (this.e && (this.a.j("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.p && (this.a.j("reset: Disposing secondary before sending ResetFrame."), this.p.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.lb = xf(this, m, m), Gf(this.lb, a), this.lb.aa());
  Ff(this, a, j)
};
function Bf(a) {
  return"4_RESETTING" == a.B || a.ja
}
p.kd = function(a) {
  this.a.H("Failed to start " + S(this) + "; error was " + S(a.message));
  this.b();
  return k
};
p.start = function() {
  this.onmessage && f(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  "1_UNSTARTED" != this.B && f(Error("ClientStream.start: " + S(this) + " already started"));
  if(this.onstarted) {
    this.onstarted(this)
  }
  this.B = "2_WAITING_RESOURCES";
  if(this.r instanceof kf) {
    var a = We(this.r.V, this), b = We(this.r.ua, this), a = new af([a, b], m, j);
    a.Ma(function(a) {
      return ib(a, function(a) {
        return a[1]
      })
    });
    a.Ma(x(this.He, this));
    a.tb(x(this.kd, this))
  }else {
    if(this.r instanceof hf) {
      if(Oc) {
        this.md()
      }else {
        a = this.o;
        b = this.r.V;
        if(Ae.length) {
          a = Be()
        }else {
          b = new qe(b + "FlashConnector.swf?cb=4bdfc178fc0e508c0cd5efc3fdb09920");
          b.Yc = "#777777";
          re(b, 300, 30);
          var c = V("minerva-elements");
          c || f(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
          var d = V("minerva-elements-FlashConnectorSwf");
          d || (d = qd("div", {id:"minerva-elements-FlashConnectorSwf"}), c.appendChild(d));
          var g = a.z, e;
          var a = d, h, l = function() {
            h && delete s.__loadFlashObject_callbacks[h]
          };
          if(Ka && !G("1.8.1.20")) {
            e = tc(new se("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
          }else {
            if(0 <= ya(he, "9")) {
              var n;
              h = "_" + Ec();
              var q = new Q(l);
              s.__loadFlashObject_callbacks[h] = function() {
                g.setTimeout(function() {
                  l();
                  q.N(V(n))
                }, 0)
              };
              b.Db.set("onloadcallback", '__loadFlashObject_callbacks["' + h + '"]()');
              n = ne(b);
              b.Da && f(Error("Component already rendered"));
              b.h || b.bb();
              a ? a.insertBefore(b.h, k) : b.ic.za.body.appendChild(b.h);
              (!b.t || b.t.Da) && b.zb();
              e = q
            }else {
              e = tc(new se("Need Flash Player 9+; had " + (he ? he : "none")))
            }
          }
          var z = g.setTimeout(function() {
            e.cancel()
          }, 8E3);
          e.Wc(function(a) {
            g.clearTimeout(z);
            return a
          });
          Nc = e;
          a = Be();
          Nc.Y(Ce, De)
        }
        var r = this;
        a.Ma(function(a) {
          Oc || (Oc = new ye(r.o, a));
          return k
        });
        a.Ma(x(this.md, this));
        a.tb(x(this.kd, this))
      }
    }else {
      Hf(this)
    }
  }
};
p.He = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Bb, g = a[1].Bb;
  this.Yb.push(a[0]);
  this.Yb.push(a[1]);
  this.r = new lf(d, b, g, c);
  Hf(this)
};
p.md = function() {
  this.r = new jf(this.r.host, this.r.port, Oc);
  Hf(this)
};
function Hf(a) {
  a.B = "3_STARTED";
  a.e = xf(a, j, j);
  a.e && (wf(a.e, a.W, k), a.e.aa())
}
p.d = function() {
  this.a.info(S(this) + " in disposeInternal.");
  uf(this);
  this.B = "5_DISCONNECTED";
  for(var a = this.qb.C(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Yb.length;a++) {
    lb(this.Yb[a].Oc, this)
  }
  F && this.rb && (Cb(this.rb), this.rb = k);
  this.ondisconnect && this.ondisconnect.call(this.Ja);
  delete this.qb;
  delete this.e;
  delete this.p;
  delete this.lb;
  delete this.Ja;
  $.m.d.call(this)
};
var ef = 1, zf = 3;
function Af(a, b, c, d, g, e) {
  this.o = a;
  this.D = b;
  this.fa = c;
  this.X = d;
  this.r = g;
  this.u = [];
  this.ha = e;
  this.xa = !this.Qa();
  this.ra = this.X != ef;
  this.te = x(this.rf, this)
}
A(Af, I);
p = Af.prototype;
p.a = O("cw.net.ClientTransport");
p.i = k;
p.Sc = k;
p.je = k;
p.Rb = k;
p.ea = m;
p.Vb = m;
p.Ra = k;
p.Eb = 0;
p.Ta = -1;
p.Ob = -1;
p.le = m;
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
  return this.X == ef || 2 == this.X
};
function If(a, b) {
  H.sort.call(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  } || pb);
  a: {
    var c = a.D, d = !a.ra, g, e = c.sc;
    g = c.maxUndeliveredStrings;
    for(var h = c.maxUndeliveredBytes, l = [], n = m, q = 0, z = b.length;q < z;q++) {
      var r = b[q], w = r[0], r = r[1];
      if(w == e.Ea + 1) {
        e.Ea += 1;
        for(l.push(r);;) {
          w = e.Ea + 1;
          r = e.wa.get(w, Wd);
          if(r === Wd) {
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
          var E = Qd(r);
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
            c.a.q("onstring raised uncaught exception", kc), of(kc)
          }
        }
        if(Bf(c)) {
          break a
        }
      }
    }
    d || yf(c);
    !Bf(c) && g && (a.a.H(a.k() + "'s peer caused rwin overflow."), a.b())
  }
}
function Jf(a, b, c) {
  try {
    var d = Te(b);
    a.Eb += 1;
    a.a.j(a.k() + " RECV " + S(d));
    var g;
    1 == a.Eb && !d.K(mf) && a.Qa() ? (a.a.q(a.k() + " is closing soon because got bad preamble: " + S(d)), g = j) : g = m;
    if(g) {
      return j
    }
    if(d instanceof He) {
      if(!/^([ -~]*)$/.test(d.Pc)) {
        return a.eb = j
      }
      a.Ob += 1;
      c.push([a.Ob, d.Pc])
    }else {
      if(d instanceof Ge) {
        var e = a.D, h = d.sa;
        e.Gd = h;
        var l = e.W, n = h.La, c = m;
        n > l.ya && (c = j);
        for(var q = Td(l).concat(), d = 0;d < q.length;d++) {
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
        if(d instanceof Je) {
          a.Ob = d.ee - 1
        }else {
          if(d instanceof Ne) {
            a.D.Hd = d.Fd
          }else {
            if(d instanceof Pe) {
              return a.a.s(a.k() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof Se) {
              return a.eb = j, "stream_attach_failure" == d.reason ? a.oa += 1 : "acked_unsent_strings" == d.reason && (a.oa += 0.5), a.a.s(a.k() + " is closing soon because got " + S(d)), j
            }
            if(!(d instanceof Ie)) {
              if(d instanceof Oe) {
                var E = a.D, kc = !a.ra;
                E.a.s("Stream is now confirmed to exist at server.");
                E.Lc = j;
                E.Gc && !kc && (E.Gc = m, tf(E))
              }else {
                if(c.length) {
                  If(a, c);
                  if(!fa(c)) {
                    for(var wd = c.length - 1;0 <= wd;wd--) {
                      delete c[wd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof Qe) {
                  var Ke = a.D;
                  Ff(Ke, d.Xd, d.Xc);
                  Ke.b();
                  return j
                }
                f(Error(a.k() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Le) {
    return Le instanceof X || f(Le), a.a.q(a.k() + " is closing soon because got InvalidFrame: " + S(b)), a.eb = j
  }
  return m
}
function we(a, b) {
  a.Vb = j;
  try {
    for(var c = m, d = [], g = 0, e = b.length;g < e;g++) {
      if(a.ja) {
        a.a.info(a.k() + " returning from loop because we're disposed.");
        return
      }
      if(c = Jf(a, b[g], d)) {
        break
      }
    }
    d.length && If(a, d);
    a.Vb = m;
    a.u.length && a.aa();
    c && (a.a.s(a.k() + " closeSoon is true.  Frames were: " + S(b)), a.b())
  }finally {
    a.Vb = m
  }
}
p.rf = function() {
  this.a.q(this.k() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Kf(a) {
  a.Rb != k && (a.o.z.clearTimeout(a.Rb), a.Rb = k)
}
function ff(a, b) {
  Kf(a);
  b = Math.round(b);
  a.Rb = a.o.z.setTimeout(a.te, b);
  a.a.j(a.k() + "'s receive timeout set to " + b + " ms.")
}
function ve(a) {
  a.X != ef && (a.X == zf || 2 == a.X ? ff(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.X)))
}
function vf(a) {
  var b = new Ee;
  b.fa = a.fa;
  b.Ud = 2;
  b.yd = 2;
  a.D.Lc || (b.Zd = j);
  b.pb = a.D.pb;
  b.Nc = a.ra;
  b.Nc && (b.Nd = 4096);
  b.Ld = 3E5;
  b.Jd = a.ra ? Math.floor(10) : 0;
  b.ke = m;
  a.ha && (b.he = k, b.xc = Math.floor((a.ra ? 358E4 : 25E3) / 1E3));
  b.sa = Vd(a.D.sc);
  b.Jb = a.D.Gd;
  a.u.push(b);
  a.Ra = b.sa
}
function xe(a, b) {
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
    !a && !this.u.length && vf(this);
    for(a = 0;a < this.u.length;a++) {
      this.a.j(this.k() + " SEND " + S(this.u[a]))
    }
    if(this.Qa()) {
      for(var a = [], b = 0, c = this.u.length;b < c;b++) {
        this.u[b].O(a), a.push("\n")
      }
      this.u = [];
      a = a.join("");
      b = this.ha ? this.r.V : this.r.ua;
      this.i = Z.gc(this, this.ha ? this.r.Td : this.r.ce);
      this.Sc = this.o.z === jc ? pa() : this.o.z.getTime();
      this.i.wc(b, "POST", a);
      ff(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.ra ? 0 : this.ha ? 25E3 : 0))
    }else {
      if(this.X == zf) {
        a = [];
        b = 0;
        for(c = this.u.length;b < c;b++) {
          a.push(this.u[b].J())
        }
        this.u = [];
        this.i ? this.i.sb(a) : (b = this.r, this.i = new ze(this), c = b.tf.gc(this.i), this.i.Ub = c, this.Sc = this.o.z === jc ? pa() : this.o.z.getTime(), this.i.dc(b.host, b.port), this.i.ja || (this.i.sb(a), this.i.ja || ff(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.X))
      }
    }
  }
};
function wf(a, b, c) {
  !a.ea && !a.u.length && vf(a);
  for(var d = Math.max(c, a.Ta + 1), g = Td(b), c = [], e = 0;e < g.length;e++) {
    var h = g[e];
    (d == k || h >= d) && c.push([h, b.G.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    e = c[b], g = e[0], e = e[1], (-1 == a.Ta || a.Ta + 1 != g) && a.u.push(new Je(g)), a.u.push(new He(e)), a.Ta = g
  }
}
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  Af.m.d.call(this);
  this.je = this.o.z === jc ? pa() : this.o.z.getTime();
  this.u = [];
  Kf(this);
  this.i && this.i.b();
  var a = this.D;
  this.D = k;
  Ef(a, this)
};
function Gf(a, b) {
  !a.ea && !a.u.length && vf(a);
  a.u.push(new Qe(b, j));
  a.le = j
}
function Df(a, b, c, d) {
  this.o = a;
  this.D = b;
  this.jd = c;
  this.ed = d
}
A(Df, I);
p = Df.prototype;
p.ea = m;
p.xa = m;
p.Fb = k;
p.Ra = k;
p.a = O("cw.net.DoNothingTransport");
function Lf(a) {
  a.Fb = a.o.z.setTimeout(function() {
    a.Fb = k;
    a.ed--;
    a.ed ? Lf(a) : a.b()
  }, a.jd)
}
p.aa = function() {
  this.ea && !this.xa && f(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ea = j;
  Lf(this)
};
p.v = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.jd, ">")
};
p.Qa = ba(m);
p.k = ba("Wast. T");
p.cd = ba(m);
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  Df.m.d.call(this);
  this.Fb != k && this.o.z.clearTimeout(this.Fb);
  var a = this.D;
  this.D = k;
  Ef(a, this)
};
function Mf() {
}
Mf.prototype.vb = k;
var Nf;
function Of() {
}
A(Of, Mf);
function Pf(a) {
  return(a = Qf(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Rf(a) {
  var b = {};
  Qf(a) && (b[0] = j, b[1] = j);
  return b
}
function Qf(a) {
  if(!a.zd && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.zd = d
      }catch(g) {
      }
    }
    f(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.zd
}
Nf = new Of;
function Sf(a) {
  this.headers = new L;
  this.$a = a || k
}
A(Sf, ic);
Sf.prototype.a = O("goog.net.XhrIo");
var Tf = /^https?$/i;
p = Sf.prototype;
p.ga = m;
p.f = k;
p.Zb = k;
p.uc = "";
p.Ed = "";
p.gb = 0;
p.hb = "";
p.jc = m;
p.Hb = m;
p.rc = m;
p.Ca = m;
p.Wb = 0;
p.Ia = k;
p.ae = "";
p.yf = m;
p.send = function(a, b, c, d) {
  this.f && f(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.uc = a;
  this.hb = "";
  this.gb = 0;
  this.Ed = b;
  this.jc = m;
  this.ga = j;
  this.f = this.$a ? Pf(this.$a) : Pf(Nf);
  this.Zb = this.$a ? this.$a.vb || (this.$a.vb = Rf(this.$a)) : Nf.vb || (Nf.vb = Rf(Nf));
  this.f.onreadystatechange = x(this.Rd, this);
  try {
    this.a.j(Uf(this, "Opening Xhr")), this.rc = j, this.f.open(b, a, j), this.rc = m
  }catch(g) {
    this.a.j(Uf(this, "Error opening Xhr: " + g.message));
    Vf(this, g);
    return
  }
  var a = c || "", e = this.headers.S();
  d && Kb(d, function(a, b) {
    e.set(b, a)
  });
  "POST" == b && !e.Z("Content-Type") && e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  Kb(e, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.ae && (this.f.responseType = this.ae);
  "withCredentials" in this.f && (this.f.withCredentials = this.yf);
  try {
    this.Ia && (jc.clearTimeout(this.Ia), this.Ia = k), 0 < this.Wb && (this.a.j(Uf(this, "Will abort after " + this.Wb + "ms if incomplete")), this.Ia = jc.setTimeout(x(this.sf, this), this.Wb)), this.a.j(Uf(this, "Sending request")), this.Hb = j, this.f.send(a), this.Hb = m
  }catch(h) {
    this.a.j(Uf(this, "Send error: " + h.message)), Vf(this, h)
  }
};
p.sf = function() {
  "undefined" != typeof ca && this.f && (this.hb = "Timed out after " + this.Wb + "ms, aborting", this.gb = 8, this.a.j(Uf(this, this.hb)), this.dispatchEvent("timeout"), this.abort(8))
};
function Vf(a, b) {
  a.ga = m;
  a.f && (a.Ca = j, a.f.abort(), a.Ca = m);
  a.hb = b;
  a.gb = 5;
  Wf(a);
  Xf(a)
}
function Wf(a) {
  a.jc || (a.jc = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function(a) {
  this.f && this.ga && (this.a.j(Uf(this, "Aborting")), this.ga = m, this.Ca = j, this.f.abort(), this.Ca = m, this.gb = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Xf(this))
};
p.d = function() {
  this.f && (this.ga && (this.ga = m, this.Ca = j, this.f.abort(), this.Ca = m), Xf(this, j));
  Sf.m.d.call(this)
};
p.Rd = function() {
  !this.rc && !this.Hb && !this.Ca ? this.$e() : Yf(this)
};
p.$e = function() {
  Yf(this)
};
function Yf(a) {
  if(a.ga && "undefined" != typeof ca) {
    if(a.Zb[1] && 4 == a.la() && 2 == Zf(a)) {
      a.a.j(Uf(a, "Local request error detected and ignored"))
    }else {
      if(a.Hb && 4 == a.la()) {
        jc.setTimeout(x(a.Rd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.la()) {
          a.a.j(Uf(a, "Request complete"));
          a.ga = m;
          try {
            var b = Zf(a), c, d;
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
                var e = ("" + a.uc).match(xd)[1] || k;
                if(!e && self.location) {
                  var h = self.location.protocol, e = h.substr(0, h.length - 1)
                }
                g = !Tf.test(e ? e.toLowerCase() : "")
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
              a.hb = l + " [" + Zf(a) + "]";
              Wf(a)
            }
          }finally {
            Xf(a)
          }
        }
      }
    }
  }
}
function Xf(a, b) {
  if(a.f) {
    var c = a.f, d = a.Zb[0] ? ea : k;
    a.f = k;
    a.Zb = k;
    a.Ia && (jc.clearTimeout(a.Ia), a.Ia = k);
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
function Zf(a) {
  try {
    return 2 < a.la() ? a.f.status : -1
  }catch(b) {
    return a.a.q("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.la() ? this.f.getResponseHeader(a) : i
};
function Uf(a, b) {
  return b + " [" + a.Ed + " " + a.uc + " " + Zf(a) + "]"
}
;var $f = !(D || F && !G("420+"));
function ag(a, b) {
  this.Xb = a;
  this.R = b
}
A(ag, I);
p = ag.prototype;
p.i = k;
p.qa = -1;
p.ud = m;
p.xd = "Content-Length Server Date Expires Keep-Alive Content-Type Transfer-Encoding Cache-Control".split(" ");
function bg(a) {
  var b = cf(a.gd), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.R, c, b), 1 != b && a.b()) : a.b()
}
p.Qe = function() {
  bg(this);
  if(!this.ja) {
    var a = s.parent;
    a && a.__XHRMaster_oncomplete(this.R);
    this.b()
  }
};
p.cf = function() {
  var a = s.parent;
  if(a) {
    this.qa = this.i.la();
    if(2 <= this.qa && !this.ud) {
      for(var b = new L, c = this.xd.length;c--;) {
        var d = this.xd[c];
        try {
          b.set(d, this.i.f.getResponseHeader(d))
        }catch(g) {
        }
      }
      if(b.A() && (this.ud = j, a.__XHRMaster_ongotheaders(this.R, Pb(b)), this.ja)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.R, this.qa);
    $f && 3 == this.qa && bg(this)
  }else {
    this.b()
  }
};
p.wc = function(a, b, c) {
  this.i = new Sf;
  yb(this.i, "readystatechange", x(this.cf, this));
  yb(this.i, "complete", x(this.Qe, this));
  this.i.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.gd = new bf(this.i.f, 1048576)
};
p.d = function() {
  ag.m.d.call(this);
  delete this.gd;
  this.i && this.i.b();
  delete this.Xb.ob[this.R];
  delete this.Xb
};
function cg() {
  this.ob = {}
}
A(cg, I);
cg.prototype.Ve = function(a, b, c, d) {
  var g = new ag(this, a);
  this.ob[a] = g;
  g.wc(b, c, d)
};
cg.prototype.Ee = function(a) {
  (a = this.ob[a]) && a.b()
};
cg.prototype.d = function() {
  cg.m.d.call(this);
  for(var a = $a(this.ob);a.length;) {
    a.pop().b()
  }
  delete this.ob
};
var dg = new cg;
s.__XHRSlave_makeRequest = x(dg.Ve, dg);
s.__XHRSlave_dispose = x(dg.Ee, dg);
var eg = O("cw.net.demo");
function fg(a, b, c, d) {
  a = new zd(document.location);
  if(c) {
    return new hf(d, a.ka, s.__demo_mainSocketPort)
  }
  b ? (b = s.__demo_shared_domain, v(b) || f(Error("domain was " + S(b) + "; expected a string.")), c = a.S(), Bd(c, "_____random_____." + b)) : c = a.S();
  Dd(c, d);
  Ed(c, "", i);
  return new kf(c.toString().replace("_____random_____", "%random%"))
}
;y("Minerva.HttpEndpoint", kf);
y("Minerva.SocketEndpoint", hf);
y("Minerva.QANHelper", U);
U.prototype.handleQANFrame = U.prototype.wd;
U.prototype.ask = U.prototype.qe;
U.prototype.notify = U.prototype.Ze;
U.prototype.failAll = U.prototype.nd;
y("Minerva.QANProtocolWrapper", pf);
pf.prototype.streamStarted = pf.prototype.of;
pf.prototype.streamReset = pf.prototype.nf;
pf.prototype.stringReceived = pf.prototype.pf;
y("Minerva.Deferred", Q);
Q.prototype.cancel = Q.prototype.cancel;
Q.prototype.callback = Q.prototype.N;
Q.prototype.errback = Q.prototype.P;
Q.prototype.addErrback = Q.prototype.tb;
Q.prototype.addCallback = Q.prototype.Ma;
Q.prototype.addCallbacks = Q.prototype.Y;
Q.prototype.chainDeferred = Q.prototype.bd;
Q.prototype.awaitDeferred = Q.prototype.re;
Q.prototype.branch = Q.prototype.$c;
Q.prototype.addBoth = Q.prototype.Wc;
Q.prototype.hasFired = Q.prototype.Pe;
y("Minerva.Deferred.succeed", sc);
y("Minerva.Deferred.fail", tc);
y("Minerva.Deferred.cancelled", function() {
  var a = new Q;
  a.cancel();
  return a
});
y("Minerva.Deferred.AlreadyCalledError", pc);
y("Minerva.Deferred.CancelledError", lc);
y("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Ne;
$.prototype.bindToProtocol = $.prototype.se;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.de;
$.prototype.reset = $.prototype.reset;
$.prototype.dispose = $.prototype.b;
y("Minerva.Logger", M);
M.Level = N;
M.getLogger = O;
M.prototype.setLevel = M.prototype.Ic;
M.prototype.shout = M.prototype.jf;
M.prototype.severe = M.prototype.H;
M.prototype.warning = M.prototype.q;
M.prototype.info = M.prototype.info;
M.prototype.config = M.prototype.ye;
M.prototype.fine = M.prototype.j;
M.prototype.finer = M.prototype.Ie;
M.prototype.finest = M.prototype.s;
N.OFF = Yb;
N.SHOUT = Zb;
N.SEVERE = $b;
N.WARNING = ac;
N.INFO = bc;
N.CONFIG = cc;
N.FINE = dc;
N.FINER = ec;
N.FINEST = fc;
N.ALL = gc;
y("Minerva.LogManager", P);
P.getRoot = P.oc;
y("Minerva.DivConsole", vd);
vd.prototype.setCapturing = vd.prototype.hf;
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
y("Minerva.JSON.serialize", xc);
y("Minerva.JSON.asciify", xc);
y("Minerva.bind", x);
y("Minerva.repr", S);
y("Minerva.theCallQueue", vc);
y("Minerva.MINIMUM_FLASH_VERSION", "9");
y("Minerva.getEndpoint", fg);
y("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new zd(document.location)).Q;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !s.__demo_shared_domain) {
    eg.q("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return fg(0, a, b, "/_minerva/")
});

})();
