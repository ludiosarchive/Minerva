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
  b.shift()
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
var Ja = Ca, D = Da, Ka = Fa, F = Ea, La;
a: {
  var Ma = "", Na;
  if(Ja && s.opera) {
    var Oa = s.opera.version, Ma = "function" == typeof Oa ? Oa() : Oa
  }else {
    if(Ka ? Na = /rv\:([^\);]+)(\)|;)/ : D ? Na = /MSIE\s+([^\);]+)(\)|;)/ : F && (Na = /WebKit\/(\S+)/), Na) {
      var Pa = Na.exec(Ga()), Ma = Pa ? Pa[1] : ""
    }
  }
  if(D) {
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
function G(a) {
  return Sa[a] || (Sa[a] = 0 <= ya(La, a))
}
var Ta = {};
function Ua() {
  return Ta[9] || (Ta[9] = D && !!document.documentMode && 9 <= document.documentMode)
}
;function Va() {
}
var Wa = 0;
p = Va.prototype;
p.key = 0;
p.Wa = m;
p.ac = m;
p.Hb = function(a, b, c, d, g, e) {
  ja(a) ? this.Ad = j : a && a.handleEvent && ja(a.handleEvent) ? this.Ad = m : f(Error("Invalid listener argument"));
  this.hb = a;
  this.Sd = b;
  this.src = c;
  this.type = d;
  this.capture = !!g;
  this.oc = e;
  this.ac = m;
  this.key = ++Wa;
  this.Wa = m
};
p.handleEvent = function(a) {
  return this.Ad ? this.hb.call(this.oc || this.src, a) : this.hb.handleEvent.call(this.hb, a)
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
var $a = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function ab(a, b) {
  for(var c, d, g = 1;g < arguments.length;g++) {
    d = arguments[g];
    for(c in d) {
      a[c] = d[c]
    }
    for(var e = 0;e < $a.length;e++) {
      c = $a[e], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!D || Ua();
var bb = !D || Ua(), cb = D && !G("8");
!F || G("528");
Ka && G("1.9b") || D && G("8") || Ja && G("9.5") || F && G("528");
Ka && !G("8") || D && G("9");
var H = Array.prototype, db = H.indexOf ? function(a, b, c) {
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
}, eb = H.forEach ? function(a, b, c) {
  H.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    e in g && b.call(c, g[e], e, a)
  }
}, fb = H.map ? function(a, b, c) {
  return H.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = Array(d), e = v(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in e && (g[h] = b.call(c, e[h], h, a))
  }
  return g
}, gb = H.some ? function(a, b, c) {
  return H.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in g && b.call(c, g[e], e, a)) {
      return j
    }
  }
  return m
}, hb = H.every ? function(a, b, c) {
  return H.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, g = v(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in g && !b.call(c, g[e], e, a)) {
      return m
    }
  }
  return j
};
function ib(a, b) {
  var c = db(a, b);
  0 <= c && H.splice.call(a, c, 1)
}
function jb(a) {
  return H.concat.apply(H, arguments)
}
function kb(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}
function lb(a, b, c) {
  return 2 >= arguments.length ? H.slice.call(a, b) : H.slice.call(a, b, c)
}
function mb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var nb = {zf:"click", Ef:"dblclick", Yf:"mousedown", bg:"mouseup", ag:"mouseover", $f:"mouseout", Zf:"mousemove", ng:"selectstart", Tf:"keypress", Sf:"keydown", Uf:"keyup", xf:"blur", Mf:"focus", Ff:"deactivate", Nf:D ? "focusin" : "DOMFocusIn", Of:D ? "focusout" : "DOMFocusOut", yf:"change", mg:"select", og:"submit", Rf:"input", ig:"propertychange", Jf:"dragstart", Gf:"dragenter", If:"dragover", Hf:"dragleave", Kf:"drop", sg:"touchstart", rg:"touchmove", qg:"touchend", pg:"touchcancel", Bf:"contextmenu", 
Lf:"error", Qf:"help", Vf:"load", Wf:"losecapture", jg:"readystatechange", kg:"resize", lg:"scroll", ug:"unload", Pf:"hashchange", eg:"pagehide", fg:"pageshow", hg:"popstate", Cf:"copy", gg:"paste", Df:"cut", uf:"beforecopy", vf:"beforecut", wf:"beforepaste", dg:"online", cg:"offline", Xf:"message", Af:"connect", tg:F ? "webkitTransitionEnd" : Ja ? "oTransitionEnd" : "transitionend"};
function I() {
}
I.prototype.ja = m;
I.prototype.b = function() {
  this.ja || (this.ja = j, this.d())
};
I.prototype.d = function() {
  this.ye && ob.apply(k, this.ye);
  if(this.Nd) {
    for(;this.Nd.length;) {
      this.Nd.shift()()
    }
  }
};
function ob(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    ga(d) ? ob.apply(k, d) : d && "function" == typeof d.b && d.b()
  }
}
;function pb(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
A(pb, I);
p = pb.prototype;
p.d = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
p.Fa = m;
p.defaultPrevented = m;
p.Sb = j;
p.stopPropagation = function() {
  this.Fa = j
};
p.preventDefault = function() {
  this.defaultPrevented = j;
  this.Sb = m
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
p.ctrlKey = m;
p.altKey = m;
p.shiftKey = m;
p.metaKey = m;
p.Ma = k;
p.Hb = function(a, b) {
  var c = this.type = a.type;
  pb.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ka) {
      var g;
      a: {
        try {
          rb(d.nodeName);
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
    if(a.returnValue = m, cb) {
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
var tb = {}, J = {}, K = {}, ub = {};
function vb(a, b, c, d, g) {
  if(b) {
    if(fa(b)) {
      for(var e = 0;e < b.length;e++) {
        vb(a, b[e], c, d, g)
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
        if(h = n[e], h.hb == c && h.oc == g) {
          if(h.Wa) {
            break
          }
          return n[e].key
        }
      }
    }else {
      n = h[l] = [], h.c++
    }
    var q = wb, z = bb ? function(a) {
      return q.call(z.src, z.key, a)
    } : function(a) {
      a = q.call(z.src, z.key, a);
      if(!a) {
        return a
      }
    }, e = z;
    e.src = a;
    h = new Va;
    h.Hb(c, e, a, b, d, g);
    c = h.key;
    e.key = c;
    n.push(h);
    tb[c] = h;
    K[l] || (K[l] = []);
    K[l].push(h);
    a.addEventListener ? (a == s || !a.ed) && a.addEventListener(b, e, d) : a.attachEvent(b in ub ? ub[b] : ub[b] = "on" + b, e);
    return c
  }
  f(Error("Invalid event type"))
}
function xb(a, b, c, d, g) {
  if(fa(b)) {
    for(var e = 0;e < b.length;e++) {
      xb(a, b[e], c, d, g)
    }
    return k
  }
  a = vb(a, b, c, d, g);
  tb[a].ac = j;
  return a
}
function yb(a, b, c, d, g) {
  if(fa(b)) {
    for(var e = 0;e < b.length;e++) {
      yb(a, b[e], c, d, g)
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
        if(a[e].hb == c && a[e].capture == d && a[e].oc == g) {
          zb(a[e].key);
          break
        }
      }
    }
  }
}
function zb(a) {
  if(!tb[a]) {
    return m
  }
  var b = tb[a];
  if(b.Wa) {
    return m
  }
  var c = b.src, d = b.type, g = b.Sd, e = b.capture;
  c.removeEventListener ? (c == s || !c.ed) && c.removeEventListener(d, g, e) : c.detachEvent && c.detachEvent(d in ub ? ub[d] : ub[d] = "on" + d, g);
  c = ka(c);
  g = J[d][e][c];
  if(K[c]) {
    var h = K[c];
    ib(h, b);
    0 == h.length && delete K[c]
  }
  b.Wa = j;
  g.Ld = j;
  Ab(d, e, c, g);
  delete tb[a];
  return j
}
function Ab(a, b, c, d) {
  if(!d.Jb && d.Ld) {
    for(var g = 0, e = 0;g < d.length;g++) {
      d[g].Wa ? d[g].Sd.src = k : (g != e && (d[e] = d[g]), e++)
    }
    d.length = e;
    d.Ld = m;
    0 == e && (delete J[a][b][c], J[a][b].c--, 0 == J[a][b].c && (delete J[a][b], J[a].c--), 0 == J[a].c && delete J[a])
  }
}
function Bb(a, b, c, d, g) {
  var e = 1, b = ka(b);
  if(a[b]) {
    a.M--;
    a = a[b];
    a.Jb ? a.Jb++ : a.Jb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var n = a[l];
        n && !n.Wa && (e &= Cb(n, g) !== m)
      }
    }finally {
      a.Jb--, Ab(c, d, b, a)
    }
  }
  return Boolean(e)
}
function Cb(a, b) {
  a.ac && zb(a.key);
  return a.handleEvent(b)
}
function wb(a, b) {
  if(!tb[a]) {
    return j
  }
  var c = tb[a], d = c.type, g = J;
  if(!(d in g)) {
    return j
  }
  var g = g[d], e, h;
  if(!bb) {
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
    q = new sb;
    q.Hb(e, this);
    e = j;
    try {
      if(l) {
        for(var r = [], w = q.currentTarget;w;w = w.parentNode) {
          r.push(w)
        }
        h = g[j];
        h.M = h.c;
        for(var E = r.length - 1;!q.Fa && 0 <= E && h.M;E--) {
          q.currentTarget = r[E], e &= Bb(h, r[E], d, j, q)
        }
        if(n) {
          h = g[m];
          h.M = h.c;
          for(E = 0;!q.Fa && E < r.length && h.M;E++) {
            q.currentTarget = r[E], e &= Bb(h, r[E], d, m, q)
          }
        }
      }else {
        e = Cb(c, q)
      }
    }finally {
      r && (r.length = 0), q.b()
    }
    return e
  }
  d = new sb(b, this);
  try {
    e = Cb(c, d)
  }finally {
    d.b()
  }
  return e
}
var Db = 0;
function Eb() {
}
A(Eb, I);
p = Eb.prototype;
p.ed = j;
p.Mb = k;
p.Jc = aa("Mb");
p.addEventListener = function(a, b, c, d) {
  vb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  yb(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
  var b = a.type || a, c = J;
  if(b in c) {
    if(v(a)) {
      a = new pb(a, this)
    }else {
      if(a instanceof pb) {
        a.target = a.target || this
      }else {
        var d = a, a = new pb(b, this);
        ab(a, d)
      }
    }
    var d = 1, g, c = c[b], b = j in c, e;
    if(b) {
      g = [];
      for(e = this;e;e = e.Mb) {
        g.push(e)
      }
      e = c[j];
      e.M = e.c;
      for(var h = g.length - 1;!a.Fa && 0 <= h && e.M;h--) {
        a.currentTarget = g[h], d &= Bb(e, g[h], a.type, j, a) && a.Sb != m
      }
    }
    if(m in c) {
      if(e = c[m], e.M = e.c, b) {
        for(h = 0;!a.Fa && h < g.length && e.M;h++) {
          a.currentTarget = g[h], d &= Bb(e, g[h], a.type, m, a) && a.Sb != m
        }
      }else {
        for(g = this;!a.Fa && g && e.M;g = g.Mb) {
          a.currentTarget = g, d &= Bb(e, g, a.type, m, a) && a.Sb != m
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
  Eb.m.d.call(this);
  var a, b = 0, c = a == k;
  a = !!a;
  if(this == k) {
    Xa(K, function(d) {
      for(var e = d.length - 1;0 <= e;e--) {
        var g = d[e];
        if(c || a == g.capture) {
          zb(g.key), b++
        }
      }
    })
  }else {
    var d = ka(this);
    if(K[d]) {
      for(var d = K[d], g = d.length - 1;0 <= g;g--) {
        var e = d[g];
        if(c || a == e.capture) {
          zb(e.key), b++
        }
      }
    }
  }
  this.Mb = k
};
var Fb = s.window;
Db++;
Db++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function L(a, b) {
  this.vb = [];
  this.$c = a;
  this.gd = b || k
}
p = L.prototype;
p.$ = m;
p.cb = m;
p.jb = 0;
p.Kc = m;
p.te = m;
p.tb = 0;
p.cancel = function(a) {
  if(this.$) {
    this.lb instanceof L && this.lb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.tb--, 0 >= b.tb && b.cancel())
    }
    this.$c ? this.$c.call(this.gd, this) : this.Kc = j;
    this.$ || this.P(new Gb)
  }
};
p.cd = function(a, b) {
  Hb(this, a, b);
  this.jb--;
  0 == this.jb && this.$ && Ib(this)
};
function Hb(a, b, c) {
  a.$ = j;
  a.lb = c;
  a.cb = !b;
  Ib(a)
}
function Jb(a) {
  a.$ && (a.Kc || f(new Kb), a.Kc = m)
}
p.N = function(a) {
  Jb(this);
  Hb(this, j, a)
};
p.P = function(a) {
  Jb(this);
  Hb(this, m, a)
};
p.La = function(a, b) {
  return this.Y(a, k, b)
};
p.sb = function(a, b) {
  return this.Y(k, a, b)
};
p.Y = function(a, b, c) {
  this.vb.push([a, b, c]);
  this.$ && Ib(this);
  return this
};
p.ad = function(a) {
  this.Y(a.N, a.P, a);
  return this
};
p.oe = function(a) {
  return this.La(x(a.Zc, a))
};
p.Zc = function(a) {
  var b = new L;
  this.ad(b);
  a && (b.t = this, this.tb++);
  return b
};
p.Vc = function(a, b) {
  return this.Y(a, a, b)
};
p.Le = o("$");
function Lb(a) {
  return gb(a.vb, function(a) {
    return ja(a[1])
  })
}
function Ib(a) {
  a.Tc && (a.$ && Lb(a)) && (s.clearTimeout(a.Tc), delete a.Tc);
  a.t && (a.t.tb--, delete a.t);
  for(var b = a.lb, c = m, d = m;a.vb.length && 0 == a.jb;) {
    var g = a.vb.shift(), e = g[0], h = g[1], g = g[2];
    if(e = a.cb ? h : e) {
      try {
        var l = e.call(g || a.gd, b);
        u(l) && (a.cb = a.cb && (l == b || l instanceof Error), a.lb = b = l);
        b instanceof L && (d = j, a.jb++)
      }catch(n) {
        b = n, a.cb = j, Lb(a) || (c = j)
      }
    }
  }
  a.lb = b;
  d && a.jb && (b.Y(x(a.cd, a, j), x(a.cd, a, m)), b.te = j);
  c && (a.Tc = s.setTimeout(function() {
    f(new Mb(b))
  }, 0))
}
function Nb(a) {
  var b = new L;
  b.N(a);
  return b
}
function Ob(a) {
  var b = new L;
  b.P(a);
  return b
}
function Kb() {
  B.call(this)
}
A(Kb, B);
Kb.prototype.message = "Already called";
function Gb() {
  B.call(this)
}
A(Gb, B);
Gb.prototype.message = "Deferred was cancelled";
function Mb(a) {
  B.call(this);
  this.message = "Unhandled Error in Deferred: " + (a.message || "[No message]")
}
A(Mb, B);
function Pb(a) {
  this.z = a;
  this.zb = [];
  this.kd = [];
  this.se = x(this.nf, this)
}
Pb.prototype.Qc = k;
Pb.prototype.nf = function() {
  this.Qc = k;
  var a = this.zb;
  this.zb = [];
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
  if(0 == this.zb.length) {
    a = this.kd;
    this.kd = [];
    for(b = 0;b < a.length;b++) {
      a[b].N(k)
    }
  }
};
var Qb = new Pb(s.window);
function Rb(a) {
  return ja(a) || "object" == typeof a && ja(a.call) && ja(a.apply)
}
;function Sb(a, b) {
  var c = [];
  Tb(new Ub(b), a, c);
  return c.join("")
}
function Ub(a) {
  this.Rb = a
}
function Tb(a, b, c) {
  switch(typeof b) {
    case "string":
      Vb(b, c);
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
          c.push(g), g = b[e], Tb(a, a.Rb ? a.Rb.call(b, "" + e, g) : g, c), g = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(e in b) {
        Object.prototype.hasOwnProperty.call(b, e) && (g = b[e], "function" != typeof g && (c.push(d), Vb(e, c), c.push(":"), Tb(a, a.Rb ? a.Rb.call(b, e, g) : g, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      f(Error("Unknown type: " + typeof b))
  }
}
var Wb = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, Xb = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function Vb(a, b) {
  b.push('"', a.replace(Xb, function(a) {
    if(a in Wb) {
      return Wb[a]
    }
    var b = a.charCodeAt(0), g = "\\u";
    16 > b ? g += "000" : 256 > b ? g += "00" : 4096 > b && (g += "0");
    return Wb[a] = g + b.toString(16)
  }), '"')
}
;function Yb(a, b, c) {
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
        Vb(a, b)
      }else {
        if(Rb(a.v)) {
          a.v(b, c)
        }else {
          if(Rb(a.ke)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if("array" == d) {
                d = a.length;
                b.push("[");
                for(var g = "", e = 0;e < d;e++) {
                  b.push(g), Yb(a[e], b, c), g = ", "
                }
                b.push("]")
              }else {
                if("object" == d) {
                  if(ha(a) && "function" == typeof a.valueOf) {
                    b.push("new Date(", "" + a.valueOf(), ")")
                  }else {
                    for(var d = Za(a).concat($a), g = {}, h = e = 0;h < d.length;) {
                      var l = d[h++], n = ia(l) ? "o" + ka(l) : (typeof l).charAt(0) + l;
                      Object.prototype.hasOwnProperty.call(g, n) || (g[n] = j, d[e++] = l)
                    }
                    d.length = e;
                    b.push("{");
                    g = "";
                    for(h = 0;h < d.length;h++) {
                      e = d[h], Object.prototype.hasOwnProperty.call(a, e) && (l = a[e], b.push(g), Vb(e, b), b.push(": "), Yb(l, b, c), g = ", ")
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
  Yb(a, b, c)
}
function N(a, b) {
  var c = [];
  M(a, c, b);
  return c.join("")
}
;function Zb() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ pa()).toString(36)
}
function $b(a) {
  return a.substr(0, a.length - 1)
}
var ac = /^(0|[1-9]\d*)$/, bc = /^(0|\-?[1-9]\d*)$/;
function cc(a) {
  var b = dc;
  return ac.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;var dc = Math.pow(2, 53);
function ec(a) {
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
function fc(a) {
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
  return Ya(a)
}
function gc(a) {
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
    return Za(a)
  }
}
function hc(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ga(a) || v(a)) {
      eb(a, b, c)
    }else {
      for(var d = gc(a), g = fc(a), e = g.length, h = 0;h < e;h++) {
        b.call(c, g[h], d && d[h], a)
      }
    }
  }
}
function ic(a, b) {
  if("function" == typeof a.every) {
    return a.every(b, i)
  }
  if(ga(a) || v(a)) {
    return hb(a, b, i)
  }
  for(var c = gc(a), d = fc(a), g = d.length, e = 0;e < g;e++) {
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
    a && this.$b(a)
  }
}
p = O.prototype;
p.c = 0;
p.A = o("c");
p.C = function() {
  jc(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.n[this.g[b]])
  }
  return a
};
p.T = function() {
  jc(this);
  return this.g.concat()
};
p.Z = function(a) {
  return kc(this.n, a)
};
p.dc = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(kc(this.n, c) && this.n[c] == a) {
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
  var c = b || mc;
  jc(this);
  for(var d, g = 0;d = this.g[g];g++) {
    if(!c(this.get(d), a.get(d))) {
      return m
    }
  }
  return j
};
function mc(a, b) {
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
  return kc(this.n, a) ? (delete this.n[a], this.c--, this.g.length > 2 * this.c && jc(this), j) : m
};
function jc(a) {
  if(a.c != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      kc(a.n, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.c != a.g.length) {
    for(var g = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], kc(g, d) || (a.g[c++] = d, g[d] = 1), b++
    }
    a.g.length = c
  }
}
p.get = function(a, b) {
  return kc(this.n, a) ? this.n[a] : b
};
p.set = function(a, b) {
  kc(this.n, a) || (this.c++, this.g.push(a));
  this.n[a] = b
};
p.$b = function(a) {
  var b;
  a instanceof O ? (b = a.T(), a = a.C()) : (b = Za(a), a = Ya(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
p.S = function() {
  return new O(this)
};
function nc(a) {
  jc(a);
  for(var b = {}, c = 0;c < a.g.length;c++) {
    var d = a.g[c];
    b[d] = a.n[d]
  }
  return b
}
function kc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;var oc = {ke:ba("<cw.eq.Wildcard>")};
function pc(a) {
  return"boolean" == a || "number" == a || "null" == a || "undefined" == a || "string" == a
}
function qc(a, b, c) {
  var d = t(a), g = t(b);
  if(a == oc || b == oc) {
    return j
  }
  if(a != k && "function" == typeof a.K) {
    return c && c.push("running custom equals function on left object"), a.K(b, c)
  }
  if(b != k && "function" == typeof b.K) {
    return c && c.push("running custom equals function on right object"), b.K(a, c)
  }
  if(pc(d) || pc(g)) {
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
                if(!qc(a[d], b[d], c)) {
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
          if(a.je == Ba && b.je == Ba) {
            a: {
              c && c.push("descending into object");
              for(var e in a) {
                if(!(e in b)) {
                  c && c.push("property " + e + " missing on right object");
                  a = m;
                  break a
                }
                if(!qc(a[e], b[e], c)) {
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
  this.Ye = a;
  this.Pb = b
}
P.prototype.K = function(a, b) {
  return ia(a) && this.constructor == a.constructor && qc(this.Pb, a.Pb, b)
};
P.prototype.v = function(a, b) {
  a.push("new ", this.Ye, "(");
  for(var c = "", d = 0;d < this.Pb.length;d++) {
    a.push(c), c = ", ", M(this.Pb[d], a, b)
  }
  a.push(")")
};
var rc, sc;
function tc(a, b) {
  P.call(this, "Question", [a, b]);
  this.body = a;
  this.ca = b
}
A(tc, P);
function uc(a, b) {
  P.call(this, "OkayAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(uc, P);
function vc(a, b) {
  P.call(this, "KnownErrorAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(vc, P);
function wc(a, b) {
  P.call(this, "UnknownErrorAnswer", [a, b]);
  this.body = a;
  this.ca = b
}
A(wc, P);
function xc(a) {
  P.call(this, "Cancellation", [a]);
  this.ca = a
}
A(xc, P);
function yc(a) {
  P.call(this, "Notification", [a]);
  this.body = a
}
A(yc, P);
function zc(a) {
  if(a instanceof tc) {
    return"Q"
  }
  if(a instanceof uc) {
    return"K"
  }
  if(a instanceof vc) {
    return"E"
  }
  if(a instanceof wc) {
    return"U"
  }
  if(a instanceof xc) {
    return"C"
  }
  if(a instanceof yc) {
    return"#"
  }
  f(Error("qanTypeToCode bug"))
}
function Ac(a) {
  var b = zc(a);
  if(a instanceof xc) {
    return"" + a.ca + b
  }
  v(a.body) || f(Error("qanFrame.body must be a string, was " + N(a.body)));
  return a instanceof yc ? a.body + b : a.body + "|" + ("" + a.ca) + b
}
function Bc(a) {
  B.call(this);
  this.message = a
}
A(Bc, B);
function Cc(a) {
  a = cc(a);
  a === k && f(new Bc("bad qid"));
  return a
}
function Dc(a) {
  a || f(new Bc("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if("#" == b) {
    return new yc($b(a))
  }
  if("C" == b) {
    var c = Cc($b(a));
    return new xc(c)
  }
  a = a.split("|");
  c = a.splice(a.length - 1, a.length);
  0 < a.length && c.splice(0, 0, a.join("|"));
  a = c[0];
  c = c[1];
  u(c) || f(new Bc("Expected pipe char in frame"));
  c = Cc($b(c));
  if("Q" == b) {
    return new tc(a, c)
  }
  if("K" == b) {
    return new uc(a, c)
  }
  if("E" == b) {
    return new vc(a, c)
  }
  if("U" == b) {
    return new wc(a, c)
  }
  f(new Bc("Invalid QAN frame type " + N(b)))
}
function Ec(a) {
  B.call(this);
  this.body = a
}
A(Ec, B);
Ec.prototype.message = "KnownError with arbitrary body";
Ec.prototype.v = function(a, b) {
  a.push("new KnownError(");
  M(this.body, a, b);
  a.push(")")
};
function Fc(a) {
  B.call(this);
  this.body = a
}
A(Fc, B);
Fc.prototype.message = "UnknownError with arbitrary body";
Fc.prototype.v = function(a, b) {
  a.push("new UnknownError(");
  M(this.body, a, b);
  a.push(")")
};
function Gc(a) {
  B.call(this);
  this.message = a
}
A(Gc, B);
function Q(a, b, c, d) {
  this.Yc = a;
  this.ib = b;
  this.da = c;
  this.Bb = d;
  this.Ob = 0;
  this.ma = new O;
  this.Za = new O
}
p = Q.prototype;
p.v = function(a) {
  a.push("<QANHelper asked ", "" + this.Ob, " questions, waiting for ", "" + this.ma.A(), " peer answers and ", "" + this.Za.A(), " local answers>")
};
p.ud = function(a) {
  if(a instanceof uc || a instanceof vc || a instanceof wc) {
    var b = a.ca, c = this.ma.get(b);
    this.ma.remove(b);
    u(c) ? c !== k && (a instanceof uc ? c.N(a.body) : a instanceof vc ? c.P(new Ec(a.body)) : a instanceof wc ? c.P(new Fc(a.body)) : f(Error("handleQANFrame bug"))) : this.Bb("Received an answer with invalid qid: " + b)
  }else {
    if(a instanceof yc) {
      try {
        this.Yc(a.body, m)
      }catch(d) {
        this.ib("Peer's Notification caused uncaught exception", d)
      }
    }else {
      if(a instanceof tc) {
        if(b = a.ca, this.Za.Z(b)) {
          this.Bb("Received Question with duplicate qid: " + b)
        }else {
          a: {
            a = [a.body, j];
            try {
              c = this.Yc.apply(k, a ? a : [])
            }catch(g) {
              c = Ob(g);
              break a
            }
            c = c instanceof L ? c : c instanceof Error ? Ob(c) : Nb(c)
          }
          this.Za.set(b, c);
          var e = this;
          c.Y(function(a) {
            var c = b;
            e.Za.remove(c);
            e.da(new uc(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Za.remove(c);
            a instanceof Ec ? e.da(new vc(a.body, c)) : a instanceof Gb ? e.da(new wc("CancelledError", c)) : (e.ib("Peer's Question #" + c + " caused uncaught exception", a), e.da(new wc("Uncaught exception", c)));
            return k
          });
          c.sb(function(a) {
            this.ib("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof xc && (b = a.ca, c = this.Za.get(b), u(c) && c.cancel())
      }
    }
  }
};
p.ne = function(a) {
  var b = this.Ob + 1;
  this.da(new tc(a, b));
  this.Ob += 1;
  var c = this, a = new L(function() {
    c.ma.set(b, k);
    c.da(new xc(b))
  });
  this.ma.set(b, a);
  return a
};
p.Ue = function(a) {
  this.da(new yc(a))
};
p.md = function(a) {
  for(var b = this.ma.T(), c = 0;c < b.length;c++) {
    var d = this.ma.get(b[c]);
    u(d) && (this.ma.set(b[c], k), d.P(new Gc(a)))
  }
};
function Hc() {
  this.Vd = pa()
}
var Ic = new Hc;
Hc.prototype.set = aa("Vd");
Hc.prototype.reset = function() {
  this.set(pa())
};
Hc.prototype.get = o("Vd");
function Jc(a) {
  this.We = a || "";
  this.df = Ic
}
Jc.prototype.ce = j;
Jc.prototype.cf = j;
Jc.prototype.bf = j;
Jc.prototype.de = m;
function Kc(a) {
  return 10 > a ? "0" + a : "" + a
}
function Lc(a, b) {
  var c = (a.fe - b) / 1E3, d = c.toFixed(3), g = 0;
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
function Mc(a) {
  Jc.call(this, a)
}
A(Mc, Jc);
Mc.prototype.de = j;
var Nc;
function Oc(a, b) {
  var c;
  c = a.className;
  c = v(c) && c.match(/\S+/g) || [];
  for(var d = lb(arguments, 1), g = c.length + d.length, e = c, h = 0;h < d.length;h++) {
    0 <= db(e, d[h]) || e.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == g
}
;var Pc = !D || Ua();
!Ka && !D || D && Ua() || Ka && G("1.9.1");
D && G("9");
function Qc(a) {
  return a ? new Rc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Nc || (Nc = new Rc)
}
function R(a) {
  return v(a) ? document.getElementById(a) : a
}
var Sc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Tc(a, b, c) {
  return Uc(document, arguments)
}
function Uc(a, b) {
  var c = b[0], d = b[1];
  if(!Pc && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', C(d.name), '"');
    if(d.type) {
      c.push(' type="', C(d.type), '"');
      var g = {};
      ab(g, d);
      d = g;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  var e = a.createElement(c);
  d && (v(d) ? e.className = d : fa(d) ? Oc.apply(k, [e].concat(d)) : Xa(d, function(a, b) {
    "style" == b ? e.style.cssText = a : "class" == b ? e.className = a : "for" == b ? e.htmlFor = a : b in Sc ? e.setAttribute(Sc[b], a) : 0 == b.lastIndexOf("aria-", 0) ? e.setAttribute(b, a) : e[b] = a
  }));
  2 < b.length && Vc(a, e, b, 2);
  return e
}
function Vc(a, b, c, d) {
  function g(c) {
    c && b.appendChild(v(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var e = c[d];
    if(ga(e) && !(ia(e) && 0 < e.nodeType)) {
      var h = eb, l;
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
      h(l ? kb(e) : e, g)
    }else {
      g(e)
    }
  }
}
function Rc(a) {
  this.za = a || s.document || document
}
p = Rc.prototype;
p.pd = Qc;
p.Ba = function(a) {
  return v(a) ? this.za.getElementById(a) : a
};
function Wc(a, b) {
  var c;
  c = a.za;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.bb = function(a, b, c) {
  return Uc(this.za, arguments)
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
  Vc(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
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
function Xc(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
function Yc(a) {
  D ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[F ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function Zc(a) {
  this.n = new O;
  a && this.$b(a)
}
function $c(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ka(a) : b.substr(0, 1) + a
}
p = Zc.prototype;
p.A = function() {
  return this.n.A()
};
p.add = function(a) {
  this.n.set($c(a), a)
};
p.$b = function(a) {
  for(var a = fc(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Fc = function(a) {
  for(var a = fc(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.n.remove($c(a))
};
p.clear = function() {
  this.n.clear()
};
p.fb = function() {
  return this.n.fb()
};
p.contains = function(a) {
  return this.n.Z($c(a))
};
p.C = function() {
  return this.n.C()
};
p.S = function() {
  return new Zc(this)
};
p.K = function(a) {
  var b;
  if(b = this.A() == ec(a)) {
    var c = a, a = ec(c);
    this.A() > a ? b = m : (!(c instanceof Zc) && 5 < a && (c = new Zc(c)), b = ic(this, function(a) {
      if("function" == typeof c.contains) {
        a = c.contains(a)
      }else {
        if("function" == typeof c.dc) {
          a = c.dc(a)
        }else {
          if(ga(c) || v(c)) {
            a = 0 <= db(c, a)
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
function ad(a) {
  return bd(a || arguments.callee.caller, [])
}
function bd(a, b) {
  var c = [];
  if(0 <= db(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(cd(a) + "(");
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
            e = (e = cd(e)) ? e : "[fn]";
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
        c.push(bd(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function cd(a) {
  if(dd[a]) {
    return dd[a]
  }
  a = "" + a;
  if(!dd[a]) {
    var b = /function ([^\(]+)/.exec(a);
    dd[a] = b ? b[1] : "[Anonymous]"
  }
  return dd[a]
}
var dd = {};
function ed(a, b, c, d, g) {
  this.reset(a, b, c, d, g)
}
ed.prototype.lc = k;
ed.prototype.kc = k;
var fd = 0;
ed.prototype.reset = function(a, b, c, d, g) {
  "number" == typeof g || fd++;
  this.fe = d || pa();
  this.Ra = a;
  this.Jd = b;
  this.Qe = c;
  delete this.lc;
  delete this.kc
};
ed.prototype.Ic = aa("Ra");
function S(a) {
  this.Se = a
}
S.prototype.t = k;
S.prototype.Ra = k;
S.prototype.ia = k;
S.prototype.Na = k;
function T(a, b) {
  this.name = a;
  this.value = b
}
T.prototype.toString = o("name");
var gd = new T("OFF", Infinity), hd = new T("SHOUT", 1200), id = new T("SEVERE", 1E3), jd = new T("WARNING", 900), kd = new T("INFO", 800), ld = new T("CONFIG", 700), md = new T("FINE", 500), nd = new T("FINER", 400), od = new T("FINEST", 300), pd = new T("ALL", 0);
function U(a) {
  return V.rd(a)
}
p = S.prototype;
p.getParent = o("t");
p.Ic = aa("Ra");
function qd(a) {
  if(a.Ra) {
    return a.Ra
  }
  if(a.t) {
    return qd(a.t)
  }
  Aa("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= qd(this).value) {
    a = this.Ie(a, b, c);
    b = "log:" + a.Jd;
    s.console && (s.console.timeStamp ? s.console.timeStamp(b) : s.console.markTimeline && s.console.markTimeline(b));
    s.msWriteProfilerMark && s.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Na) {
        for(var g = 0, e = i;e = c.Na[g];g++) {
          e(d)
        }
      }
      b = b.getParent()
    }
  }
};
p.Ie = function(a, b, c) {
  var d = new ed(a, "" + b, this.Se);
  if(c) {
    d.lc = c;
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
          n = c.lineNumber || c.Pe || "Not available"
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
      g = "Message: " + C(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + C(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + C(ad(e) + "-> ")
    }catch(E) {
      g = "Exception trying to expose exception! You win, we lose. " + E
    }
    d.kc = g
  }
  return d
};
p.af = function(a, b) {
  this.log(hd, a, b)
};
p.H = function(a, b) {
  this.log(id, a, b)
};
p.q = function(a, b) {
  this.log(jd, a, b)
};
p.info = function(a, b) {
  this.log(kd, a, b)
};
p.ve = function(a, b) {
  this.log(ld, a, b)
};
p.j = function(a, b) {
  this.log(md, a, b)
};
p.Ee = function(a, b) {
  this.log(nd, a, b)
};
p.s = function(a, b) {
  this.log(od, a, b)
};
var V = {Kb:{}, mb:k, xd:function() {
  V.mb || (V.mb = new S(""), V.Kb[""] = V.mb, V.mb.Ic(ld))
}, wg:function() {
  return V.Kb
}, nc:function() {
  V.xd();
  return V.mb
}, rd:function(a) {
  V.xd();
  return V.Kb[a] || V.xe(a)
}, vg:function(a) {
  return function(b) {
    (a || V.nc()).H("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Pe + ")")
  }
}, xe:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.rd(a.substr(0, c));
  c.ia || (c.ia = {});
  c.ia[d] = b;
  b.t = c;
  return V.Kb[a] = b
}};
function rd(a) {
  this.Td = x(this.le, this);
  this.od = new Mc;
  this.zd = this.od.ce = m;
  this.h = a;
  this.Ce = this.h.ownerDocument || this.h.document;
  var a = Qc(this.h), b = k;
  if(D) {
    b = a.za.createStyleSheet(), Yc(b)
  }else {
    var c = Wc(a, "head")[0];
    c || (b = Wc(a, "body")[0], c = a.bb("head"), b.parentNode.insertBefore(c, b));
    b = a.bb("style");
    Yc(b);
    a.appendChild(c, b)
  }
  this.h.className += " logdiv"
}
rd.prototype.$e = function(a) {
  if(a != this.zd) {
    var b = V.nc();
    if(a) {
      var c = this.Td;
      b.Na || (b.Na = []);
      b.Na.push(c)
    }else {
      (b = b.Na) && ib(b, this.Td)
    }
    this.zd = a
  }
};
rd.prototype.le = function(a) {
  var b = 100 >= this.h.scrollHeight - this.h.scrollTop - this.h.clientHeight, c = this.Ce.createElement("div");
  c.className = "logmsg";
  var d = this.od, g;
  switch(a.Ra.value) {
    case hd.value:
      g = "dbg-sh";
      break;
    case id.value:
      g = "dbg-sev";
      break;
    case jd.value:
      g = "dbg-w";
      break;
    case kd.value:
      g = "dbg-i";
      break;
    default:
      g = "dbg-f"
  }
  var e = [];
  e.push(d.We, " ");
  if(d.ce) {
    var h = new Date(a.fe);
    e.push("[", Kc(h.getFullYear() - 2E3) + Kc(h.getMonth() + 1) + Kc(h.getDate()) + " " + Kc(h.getHours()) + ":" + Kc(h.getMinutes()) + ":" + Kc(h.getSeconds()) + "." + Kc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.cf && e.push("[", xa(Lc(a, d.df.get())), "s] ");
  d.bf && e.push("[", C(a.Qe), "] ");
  e.push('<span class="', g, '">', ra(xa(C(a.Jd))));
  d.de && a.lc && e.push("<br>", ra(xa(a.kc || "")));
  e.push("</span><br>");
  c.innerHTML = e.join("");
  this.h.appendChild(c);
  b && (this.h.scrollTop = this.h.scrollHeight)
};
rd.prototype.clear = function() {
  this.h.innerHTML = ""
};
var sd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function td(a, b) {
  var c = a.match(sd), d = b.match(sd);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function ud(a, b) {
  var c;
  if(a instanceof ud) {
    this.L = u(b) ? b : a.L, wd(this, a.ta), c = a.Ja, W(this), this.Ja = c, xd(this, a.ka), yd(this, a.Ua), zd(this, a.na), Ad(this, a.Q.S()), c = a.Aa, W(this), this.Aa = c
  }else {
    if(a && (c = ("" + a).match(sd))) {
      this.L = !!b;
      wd(this, c[1] || "", j);
      var d = c[2] || "";
      W(this);
      this.Ja = d ? decodeURIComponent(d) : "";
      xd(this, c[3] || "", j);
      yd(this, c[4]);
      zd(this, c[5] || "", j);
      Ad(this, c[6] || "", j);
      c = c[7] || "";
      W(this);
      this.Aa = c ? decodeURIComponent(c) : ""
    }else {
      this.L = !!b, this.Q = new Bd(k, 0, this.L)
    }
  }
}
p = ud.prototype;
p.ta = "";
p.Ja = "";
p.ka = "";
p.Ua = k;
p.na = "";
p.Aa = "";
p.Oe = m;
p.L = m;
p.toString = function() {
  var a = [], b = this.ta;
  b && a.push(Cd(b, Dd), ":");
  if(b = this.ka) {
    a.push("//");
    var c = this.Ja;
    c && a.push(Cd(c, Dd), "@");
    a.push(encodeURIComponent("" + b));
    b = this.Ua;
    b != k && a.push(":", "" + b)
  }
  if(b = this.na) {
    this.ka && "/" != b.charAt(0) && a.push("/"), a.push(Cd(b, "/" == b.charAt(0) ? Ed : Fd))
  }
  (b = this.Q.toString()) && a.push("?", b);
  (b = this.Aa) && a.push("#", Cd(b, Gd));
  return a.join("")
};
p.S = function() {
  return new ud(this)
};
function wd(a, b, c) {
  W(a);
  a.ta = c ? b ? decodeURIComponent(b) : "" : b;
  a.ta && (a.ta = a.ta.replace(/:$/, ""))
}
function xd(a, b, c) {
  W(a);
  a.ka = c ? b ? decodeURIComponent(b) : "" : b
}
function yd(a, b) {
  W(a);
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.Ua = b) : a.Ua = k
}
function zd(a, b, c) {
  W(a);
  a.na = c ? b ? decodeURIComponent(b) : "" : b
}
function Ad(a, b, c) {
  W(a);
  b instanceof Bd ? (a.Q = b, a.Q.Hc(a.L)) : (c || (b = Cd(b, Hd)), a.Q = new Bd(b, 0, a.L))
}
function W(a) {
  a.Oe && f(Error("Tried to modify a read-only Uri"))
}
p.Hc = function(a) {
  this.L = a;
  this.Q && this.Q.Hc(a);
  return this
};
function Id(a) {
  return a instanceof ud ? a.S() : new ud(a, i)
}
function Cd(a, b) {
  return v(a) ? encodeURI(a).replace(b, Jd) : k
}
function Jd(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var Dd = /[#\/\?@]/g, Fd = /[\#\?:]/g, Ed = /[\#\?]/g, Hd = /[\#\?@]/g, Gd = /#/g;
function Bd(a, b, c) {
  this.F = a || k;
  this.L = !!c
}
function Kd(a) {
  if(!a.l && (a.l = new O, a.c = 0, a.F)) {
    for(var b = a.F.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), g = k, e = k;
      0 <= d ? (g = b[c].substring(0, d), e = b[c].substring(d + 1)) : g = b[c];
      g = decodeURIComponent(g.replace(/\+/g, " "));
      g = Ld(a, g);
      a.add(g, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
    }
  }
}
p = Bd.prototype;
p.l = k;
p.c = k;
p.A = function() {
  Kd(this);
  return this.c
};
p.add = function(a, b) {
  Kd(this);
  this.F = k;
  var a = Ld(this, a), c = this.l.get(a);
  c || this.l.set(a, c = []);
  c.push(b);
  this.c++;
  return this
};
p.remove = function(a) {
  Kd(this);
  a = Ld(this, a);
  return this.l.Z(a) ? (this.F = k, this.c -= this.l.get(a).length, this.l.remove(a)) : m
};
p.clear = function() {
  this.l = this.F = k;
  this.c = 0
};
p.fb = function() {
  Kd(this);
  return 0 == this.c
};
p.Z = function(a) {
  Kd(this);
  a = Ld(this, a);
  return this.l.Z(a)
};
p.dc = function(a) {
  var b = this.C();
  return 0 <= db(b, a)
};
p.T = function() {
  Kd(this);
  for(var a = this.l.C(), b = this.l.T(), c = [], d = 0;d < b.length;d++) {
    for(var g = a[d], e = 0;e < g.length;e++) {
      c.push(b[d])
    }
  }
  return c
};
p.C = function(a) {
  Kd(this);
  var b = [];
  if(a) {
    this.Z(a) && (b = jb(b, this.l.get(Ld(this, a))))
  }else {
    for(var a = this.l.C(), c = 0;c < a.length;c++) {
      b = jb(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  Kd(this);
  this.F = k;
  a = Ld(this, a);
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
  var a = new Bd;
  a.F = this.F;
  this.l && (a.l = this.l.S());
  return a
};
function Ld(a, b) {
  var c = "" + b;
  a.L && (c = c.toLowerCase());
  return c
}
p.Hc = function(a) {
  a && !this.L && (Kd(this), this.F = k, hc(this.l, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.remove(d), 0 < a.length && (this.F = k, this.l.set(Ld(this, d), kb(a)), this.c += a.length))
  }, this));
  this.L = a
};
function Md(a) {
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
;function Nd(a, b) {
  this.Ka = a;
  this.Ga = b
}
Nd.prototype.K = function(a) {
  return a instanceof Nd && this.Ka == a.Ka && this.Ga.join(",") == a.Ga
};
Nd.prototype.v = function(a, b) {
  a.push("new SACK(", "" + this.Ka, ", ");
  M(this.Ga, a, b);
  a.push(")")
};
function Od() {
  this.G = new O
}
Od.prototype.ya = -1;
Od.prototype.I = 0;
Od.prototype.append = function(a) {
  var b = Md(a);
  this.G.set(this.ya + 1, [a, b]);
  this.ya += 1;
  this.I += b
};
Od.prototype.v = function(a) {
  a.push("<Queue with ", "" + this.G.A(), " item(s), counter=#", "" + this.ya, ", size=", "" + this.I, ">")
};
function Pd(a) {
  a = a.G.T();
  H.sort.call(a, mb);
  return a
}
function Qd() {
  this.wa = new O
}
Qd.prototype.Ea = -1;
Qd.prototype.I = 0;
function Rd(a) {
  var b = a.wa.T();
  H.sort.call(b, mb);
  return new Nd(a.Ea, b)
}
var Sd = {};
function Td(a, b) {
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
        a.push('<property id="', d, '">'), Td(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if("function" == typeof b.getFullYear) {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && "function" != t(b[c]) && (a.push('<property id="', C(c), '">'), Td(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function Ud(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, g = arguments;
  d.push("<arguments>");
  for(var e = g.length, h = 1;h < e;h++) {
    Td(d, g[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;var Vd = m, Wd = "";
function Xd(a) {
  a = a.match(/[\d]+/g);
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var Yd = navigator.plugins["Shockwave Flash"];
  Yd && (Vd = j, Yd.description && (Wd = Xd(Yd.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (Vd = j, Wd = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var Zd = navigator.mimeTypes["application/x-shockwave-flash"];
    (Vd = Zd && Zd.enabledPlugin) && (Wd = Xd(Zd.enabledPlugin.description))
  }else {
    try {
      var $d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), Vd = j, Wd = Xd($d.GetVariable("$version"))
    }catch(ae) {
      try {
        $d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), Vd = j, Wd = "6.0.21"
      }catch(be) {
        try {
          $d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), Vd = j, Wd = Xd($d.GetVariable("$version"))
        }catch(ce) {
        }
      }
    }
  }
}
var de = Wd;
function ee(a) {
  this.Ke = a;
  this.g = []
}
A(ee, I);
var fe = [];
ee.prototype.Fc = function() {
  eb(this.g, zb);
  this.g.length = 0
};
ee.prototype.d = function() {
  ee.m.d.call(this);
  this.Fc()
};
ee.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function ge() {
}
ge.qd = function() {
  return ge.yd ? ge.yd : ge.yd = new ge
};
ge.prototype.Te = 0;
ge.qd();
function he(a) {
  this.xb = a || Qc()
}
A(he, Eb);
p = he.prototype;
p.Ne = ge.qd();
p.U = k;
p.Da = m;
p.h = k;
p.t = k;
p.ia = k;
p.wb = k;
p.pf = m;
function ie(a) {
  return a.U || (a.U = ":" + (a.Ne.Te++).toString(36))
}
p.Ba = o("h");
p.getParent = o("t");
p.Jc = function(a) {
  this.t && this.t != a && f(Error("Method not supported"));
  he.m.Jc.call(this, a)
};
p.pd = o("xb");
p.bb = function() {
  this.h = this.xb.createElement("div")
};
p.yb = function() {
  this.Da = j;
  je(this, function(a) {
    !a.Da && a.Ba() && a.yb()
  })
};
function ke(a) {
  je(a, function(a) {
    a.Da && ke(a)
  });
  a.Fb && a.Fb.Fc();
  a.Da = m
}
p.d = function() {
  he.m.d.call(this);
  this.Da && ke(this);
  this.Fb && (this.Fb.b(), delete this.Fb);
  je(this, function(a) {
    a.b()
  });
  if(!this.pf && this.h) {
    var a = this.h;
    a && a.parentNode && a.parentNode.removeChild(a)
  }
  this.t = this.h = this.wb = this.ia = k
};
function je(a, b) {
  a.ia && eb(a.ia, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = v(a) ? a : ie(a), d;
    this.wb && c ? (d = this.wb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.wb, c in d && delete d[c], ib(this.ia, a), b && (ke(a), a.h && (c = a.h) && c.parentNode && c.parentNode.removeChild(c)), c = a, c == k && f(Error("Unable to set parent component")), c.t = k, he.m.Jc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function le(a, b) {
  this.xb = b || Qc();
  this.Ge = a;
  this.jc = new ee(this);
  this.Cb = new O
}
A(le, he);
p = le.prototype;
p.a = U("goog.ui.media.FlashObject");
p.rf = "window";
p.Xc = "#000000";
p.me = "sameDomain";
function me(a, b, c) {
  a.Uc = v(b) ? b : Math.round(b) + "px";
  a.pc = v(c) ? c : Math.round(c) + "px";
  a.Ba() && (b = a.Ba() ? a.Ba().firstChild : k, c = a.Uc, a = a.pc, a == i && f(Error("missing height argument")), b.style.width = Xc(c), b.style.height = Xc(a))
}
p.yb = function() {
  le.m.yb.call(this);
  var a = this.Ba(), b;
  b = D ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = D ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = qa(c, this.rf), d = this.Cb.T(), g = this.Cb.C(), e = [], h = 0;h < d.length;h++) {
    e.push(encodeURIComponent("" + d[h]) + "=" + encodeURIComponent("" + g[h]))
  }
  b = qa(b, ie(this), ie(this), "goog-ui-media-flash-object", C(this.Ge), C(e.join("&")), this.Xc, this.me, c);
  a.innerHTML = b;
  this.Uc && this.pc && me(this, this.Uc, this.pc);
  a = this.jc;
  b = this.Ba();
  c = Ya(nb);
  fa(c) || (fe[0] = c, c = fe);
  for(d = 0;d < c.length;d++) {
    a.g.push(vb(b, c[d], qb || a, m, a.Ke || a))
  }
};
p.bb = function() {
  this.Xd != k && !(0 <= ya(de, this.Xd)) && (this.a.q("Required flash version not found:" + this.Xd), f(Error("Method not supported")));
  var a = this.pd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.h = a
};
p.d = function() {
  le.m.d.call(this);
  this.Cb = k;
  this.jc.b();
  this.jc = k
};
function ne(a) {
  B.call(this, a)
}
A(ne, B);
ne.prototype.name = "cw.loadflash.FlashLoadFailed";
s.__loadFlashObject_callbacks = {};
function oe(a, b) {
  this.U = "_" + Zb();
  this.Wb = a;
  this.pa = b;
  this.va = a.va
}
A(oe, I);
p = oe.prototype;
p.Sa = j;
p.fc = m;
p.a = U("cw.net.FlashSocket");
p.v = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.U);
  a.push("'>")
};
function pe(a, b, c) {
  if("frames" == b) {
    a = a.pa, qe(a.w), re(a.w, c)
  }else {
    if("stillreceiving" == b) {
      c = a.pa, c.a.s("onstillreceiving"), qe(c.w)
    }else {
      if("connect" == b) {
        a.pa.onconnect()
      }else {
        "close" == b ? (a.Sa = m, a.b()) : "ioerror" == b ? (a.Sa = m, b = a.pa, b.a.q("onioerror: " + N(c)), se(b.w, m), a.b()) : "securityerror" == b ? (a.Sa = m, b = a.pa, b.a.q("onsecurityerror: " + N(c)), se(b.w, m), a.b()) : f(Error("bad event: " + b))
      }
    }
  }
}
function te(a) {
  a.fc = j;
  a.Sa = m;
  a.b()
}
p.cc = function(a, b) {
  try {
    var c = this.va.CallFunction(Ud("__FC_connect", this.U, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.H("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), te(this)
  }
  '"OK"' != c && f(Error("__FC_connect failed? ret: " + c))
};
p.rb = function(a) {
  try {
    var b = this.va.CallFunction(Ud("__FC_writeFrames", this.U, a))
  }catch(c) {
    return this.a.H("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), te(this)
  }
  '"OK"' != b && ('"no such instance"' == b ? (this.a.q("Flash no longer knows of " + this.U + "; disposing."), this.b()) : f(Error("__FC_writeFrames failed? ret: " + b)))
};
p.d = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Sa);
  oe.m.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Sa) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(Ud("__FC_close", this.U)))
    }catch(b) {
      this.a.H("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.fc = j
    }
  }
  if(this.fc) {
    a = this.pa, a.a.q("oncrash"), se(a.w, j)
  }else {
    this.pa.onclose()
  }
  delete this.pa;
  delete this.Wb.Oa[this.U]
};
function ue(a, b) {
  this.o = a;
  this.va = b;
  this.Oa = {};
  this.bc = "__FST_" + Zb();
  s[this.bc] = x(this.Be, this);
  var c = b.CallFunction(Ud("__FC_setCallbackFunc", this.bc));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(ue, I);
p = ue.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.v = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  M(this.Oa, a, b);
  a.push(">")
};
p.gc = function(a) {
  a = new oe(this, a);
  return this.Oa[a.U] = a
};
p.ze = function(a, b, c, d) {
  var g = this.Oa[a];
  g ? "frames" == b && d ? (pe(g, "ioerror", "FlashConnector hadError while handling data."), g.b()) : pe(g, b, c) : this.a.q("Cannot dispatch because we have no instance: " + N([a, b, c, d]))
};
p.Be = function(a, b, c, d) {
  try {
    var g = this.o;
    g.zb.push([this.ze, this, [a, b, c, d]]);
    g.Qc == k && (g.Qc = g.z.setTimeout(g.se, 0))
  }catch(e) {
    s.window.setTimeout(function() {
      f(e)
    }, 0)
  }
};
p.d = function() {
  ue.m.d.call(this);
  for(var a = Ya(this.Oa);a.length;) {
    a.pop().b()
  }
  delete this.Oa;
  delete this.va;
  s[this.bc] = i
};
function ve(a) {
  this.w = a;
  this.ab = []
}
A(ve, I);
p = ve.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.rb = function(a) {
  this.ab ? (this.a.s("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.ab.push.apply(this.ab, a)) : (this.a.s("writeFrames: Writing " + a.length + " frame(s)."), this.Tb.rb(a))
};
p.cc = function(a, b) {
  this.Tb.cc(a, b)
};
p.onconnect = function() {
  this.a.info("onconnect");
  qe(this.w);
  var a = this.ab;
  this.ab = k;
  a.length && (this.a.s("onconnect: Writing " + a.length + " buffered frame(s)."), this.Tb.rb(a))
};
p.onclose = function() {
  this.a.info("onclose");
  se(this.w, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  ve.m.d.call(this);
  this.Tb.b();
  delete this.w
};
var we = [];
function xe() {
  var a = new L;
  we.push(a);
  return a
}
function ye(a) {
  var b = we;
  we = [];
  eb(b, function(b) {
    b.N(a)
  });
  return k
}
function ze(a) {
  var b = we;
  we = [];
  eb(b, function(b) {
    b.P(a)
  });
  return k
}
;function Ae() {
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
  this.O(a);
  return a.join("")
}
function Be() {
}
Be.prototype.K = function(a, b) {
  return!(a instanceof Be) ? m : qc(Ce(this), Ce(a), b)
};
Be.prototype.v = function(a, b) {
  a.push("<HelloFrame properties=");
  M(Ce(this), a, b);
  a.push(">")
};
function Ce(a) {
  return[a.fa, a.Rd, a.wd, a.Wd, a.ob, a.Nc, a.Kd, a.Id, a.xc, a.Gd, a.he, a.ee, a.sa, a.Ib]
}
Be.prototype.J = Y;
Be.prototype.O = function(a) {
  var b = {};
  b.tnum = this.fa;
  b.ver = this.Rd;
  b.format = this.wd;
  b["new"] = this.Wd;
  b.id = this.ob;
  b.ming = this.Nc;
  b.pad = this.Kd;
  b.maxb = this.Id;
  u(this.xc) && (b.maxt = this.xc);
  b.maxia = this.Gd;
  b.tcpack = this.he;
  b.eeds = this.ee;
  b.sack = this.sa instanceof Nd ? $b((new De(this.sa)).J()) : this.sa;
  b.seenack = this.Ib instanceof Nd ? $b((new De(this.Ib)).J()) : this.Ib;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(Sb(b), "H")
};
function Ee(a) {
  P.call(this, "StringFrame", [a]);
  this.Pc = a
}
A(Ee, P);
Ee.prototype.J = Y;
Ee.prototype.O = function(a) {
  a.push(this.Pc, " ")
};
function Fe(a) {
  P.call(this, "CommentFrame", [a]);
  this.ue = a
}
A(Fe, P);
Fe.prototype.J = Y;
Fe.prototype.O = function(a) {
  a.push(this.ue, "^")
};
function Ge(a) {
  P.call(this, "SeqNumFrame", [a]);
  this.be = a
}
A(Ge, P);
Ge.prototype.J = Y;
Ge.prototype.O = function(a) {
  a.push("" + this.be, "N")
};
function He(a) {
  var b = a.split("|");
  if(2 != b.length) {
    return k
  }
  a: {
    var c = b[1], a = dc;
    if(bc.test(c) && (c = parseInt(c, 10), -1 <= c && c <= a)) {
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
      var e = cc(b[d]);
      if(e == k) {
        return k
      }
      c.push(e)
    }
  }
  return new Nd(a, c)
}
function De(a) {
  P.call(this, "SackFrame", [a]);
  this.sa = a
}
A(De, P);
De.prototype.J = Y;
De.prototype.O = function(a) {
  var b = this.sa;
  a.push(b.Ga.join(","), "|", "" + b.Ka);
  a.push("A")
};
function Ie(a) {
  P.call(this, "StreamStatusFrame", [a]);
  this.Cd = a
}
A(Ie, P);
Ie.prototype.J = Y;
Ie.prototype.O = function(a) {
  var b = this.Cd;
  a.push(b.Ga.join(","), "|", "" + b.Ka);
  a.push("T")
};
function Je() {
  P.call(this, "StreamCreatedFrame", [])
}
A(Je, P);
Je.prototype.J = Y;
Je.prototype.O = function(a) {
  a.push("C")
};
function Ke() {
  P.call(this, "YouCloseItFrame", [])
}
A(Ke, P);
Ke.prototype.J = Y;
Ke.prototype.O = function(a) {
  a.push("Y")
};
function Le(a, b) {
  P.call(this, "ResetFrame", [a, b]);
  this.Ud = a;
  this.Wc = b
}
A(Le, P);
Le.prototype.J = Y;
Le.prototype.O = function(a) {
  a.push(this.Ud, "|", "" + Number(this.Wc), "!")
};
var Oe = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Pe(a) {
  P.call(this, "TransportKillFrame", [a]);
  this.reason = a
}
A(Pe, P);
Pe.prototype.J = Y;
Pe.prototype.O = function(a) {
  a.push(this.reason, "K")
};
function Qe(a) {
  a || f(new X("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(" " == b) {
    return new Ee(a.substr(0, a.length - 1))
  }
  if("A" == b) {
    return a = He($b(a)), a == k && f(new X("bad sack")), new De(a)
  }
  if("N" == b) {
    return a = cc($b(a)), a == k && f(new X("bad seqNum")), new Ge(a)
  }
  if("T" == b) {
    return a = He($b(a)), a == k && f(new X("bad lastSackSeen")), new Ie(a)
  }
  if("Y" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Ke
  }
  if("^" == b) {
    return new Fe(a.substr(0, a.length - 1))
  }
  if("C" == b) {
    return 1 != a.length && f(new X("leading garbage")), new Je
  }
  if("!" == b) {
    return b = a.substr(0, a.length - 3), (255 < b.length || !/^([ -~]*)$/.test(b)) && f(new X("bad reasonString")), a = {"|0":m, "|1":j}[a.substr(a.length - 3, 2)], a == k && f(new X("bad applicationLevel")), new Le(b, a)
  }
  if("K" == b) {
    return a = a.substr(0, a.length - 1), a = Oe[a], a == k && f(new X("unknown kill reason: " + a)), new Pe(a)
  }
  f(new X("Invalid frame type " + b))
}
;function Re(a, b, c, d) {
  this.contentWindow = a;
  this.Ab = b;
  this.Oc = c;
  this.He = d
}
Re.prototype.v = function(a, b) {
  a.push("<XDRFrame frameId=");
  M(this.He, a, b);
  a.push(", expandedUrl=");
  M(this.Ab, a, b);
  a.push(", streams=");
  M(this.Oc, a, b);
  a.push(">")
};
function Se() {
  this.frames = [];
  this.vc = new O
}
Se.prototype.a = U("cw.net.XDRTracker");
function Te(a, b) {
  for(var c = Ue, d = 0;d < c.frames.length;d++) {
    var g = c.frames[d], e;
    if(e = 0 == g.Oc.length) {
      e = g.Ab;
      var h = ("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      e = RegExp("^" + h + "$").test(e)
    }
    if(e) {
      return c.a.info("Giving " + N(b) + " existing frame " + N(g)), Nb(g)
    }
  }
  d = Zb() + Zb();
  g = a.replace(/%random%/g, function() {
    return"ml" + Math.floor(Ae()) + ("" + Math.floor(Ae()))
  });
  e = s.location;
  e instanceof ud || (e = Id(e));
  g instanceof ud || (g = Id(g));
  var l = e;
  e = g;
  g = l.S();
  (h = !!e.ta) ? wd(g, e.ta) : h = !!e.Ja;
  if(h) {
    var n = e.Ja;
    W(g);
    g.Ja = n
  }else {
    h = !!e.ka
  }
  h ? xd(g, e.ka) : h = e.Ua != k;
  n = e.na;
  if(h) {
    yd(g, e.Ua)
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
  h ? zd(g, n) : h = "" !== e.Q.toString();
  h ? Ad(g, e.Q.toString() ? decodeURIComponent(e.Q.toString()) : "") : h = !!e.Aa;
  h && (e = e.Aa, W(g), g.Aa = e);
  g = g.toString();
  e = ("" + s.location).match(sd)[3] || k;
  h = g.match(sd)[3] || k;
  e == h ? (c.a.info("No need to make a real XDRFrame for " + N(b)), c = Nb(new Re(s, g, [b], k))) : ((e = R("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new L, c.vc.set(d, [h, g, b]), c.a.info("Creating new XDRFrame " + N(d) + "for " + N(b)), c = Tc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:g + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), e.appendChild(c), c = h);
  return c
}
Se.prototype.tf = function(a) {
  var b = this.vc.get(a);
  b || f(Error("Unknown frameId " + N(a)));
  this.vc.remove(b);
  var c = b[0], a = new Re(R("minerva-xdrframe-" + a).contentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var Ue = new Se;
s.__XHRTracker_xdrFrameLoaded = x(Ue.tf, Ue);
var Ve;
Ve = m;
var We = Ga();
We && (-1 != We.indexOf("Firefox") || -1 != We.indexOf("Camino") || -1 != We.indexOf("iPhone") || -1 != We.indexOf("iPod") || -1 != We.indexOf("iPad") || -1 != We.indexOf("Android") || -1 != We.indexOf("Chrome") && (Ve = j));
var Xe = Ve;
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function Ye(a, b, c, d, g, e) {
  L.call(this, g, e);
  this.Fd = a;
  this.hc = [];
  this.nd = !!b;
  this.Fe = !!c;
  this.we = !!d;
  for(b = 0;b < a.length;b++) {
    a[b].Y(x(this.td, this, b, j), x(this.td, this, b, m))
  }
  0 == a.length && !this.nd && this.N(this.hc)
}
A(Ye, L);
Ye.prototype.Md = 0;
Ye.prototype.td = function(a, b, c) {
  this.Md++;
  this.hc[a] = [b, c];
  this.$ || (this.nd && b ? this.N([a, c]) : this.Fe && !b ? this.P(c) : this.Md == this.Fd.length && this.N(this.hc));
  this.we && !b && (c = k);
  return c
};
Ye.prototype.P = function(a) {
  Ye.m.P.call(this, a);
  eb(this.Fd, function(a) {
    a.cancel()
  })
};
function Ze(a, b) {
  this.sf = a;
  this.Hd = b
}
Ze.prototype.tc = 0;
Ze.prototype.Lb = 0;
Ze.prototype.mc = m;
function $e(a) {
  var b = [];
  if(a.mc) {
    return[b, 2]
  }
  var c = a.tc, d = a.sf.responseText;
  for(a.tc = d.length;;) {
    c = d.indexOf("\n", c);
    if(-1 == c) {
      break
    }
    var g = d.substr(a.Lb, c - a.Lb), g = g.replace(/\r$/, "");
    if(g.length > a.Hd) {
      return a.mc = j, [b, 2]
    }
    b.push(g);
    a.Lb = c += 1
  }
  return a.tc - a.Lb - 1 > a.Hd ? (a.mc = j, [b, 2]) : [b, 1]
}
;function af(a, b, c) {
  this.w = b;
  this.R = a;
  this.ec = c
}
A(af, I);
p = af.prototype;
p.a = U("cw.net.XHRMaster");
p.qa = -1;
p.wc = function(a, b, c) {
  this.ec.__XHRSlave_makeRequest(this.R, a, b, c)
};
p.la = o("qa");
p.zc = function(a, b) {
  1 != b && this.a.H(N(this.R) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  qe(this.w);
  re(this.w, a)
};
p.Ac = function(a) {
  this.a.j("ongotheaders_: " + N(a));
  var b = k;
  "Content-Length" in a && (b = cc(a["Content-Length"]));
  a = this.w;
  a.a.j(a.k() + " got Content-Length: " + b);
  a.X == bf && (b == k && (a.a.q("Expected to receive a valid Content-Length, but did not."), b = 5E5), cf(a, 2E3 + 1E3 * (b / 3072)))
};
p.Bc = function(a) {
  1 != a && this.a.j(this.w.k() + "'s XHR's readyState is " + a);
  this.qa = a;
  2 <= this.qa && qe(this.w)
};
p.yc = function() {
  this.w.b()
};
p.d = function() {
  af.m.d.call(this);
  delete Z.ba[this.R];
  this.ec.__XHRSlave_dispose(this.R);
  delete this.ec
};
function df() {
  this.ba = {}
}
A(df, I);
p = df.prototype;
p.a = U("cw.net.XHRMasterTracker");
p.gc = function(a, b) {
  var c = "_" + Zb(), d = new af(c, a, b);
  return this.ba[c] = d
};
p.zc = function(a, b, c) {
  if(Ka) {
    for(var d = [], g = 0, e = b.length;g < e;g++) {
      d[g] = b[g]
    }
    b = d
  }else {
    b = jb(b)
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
  df.m.d.call(this);
  for(var a = Ya(this.ba);a.length;) {
    a.pop().b()
  }
  delete this.ba
};
var Z = new df;
s.__XHRMaster_onframes = x(Z.zc, Z);
s.__XHRMaster_oncomplete = x(Z.yc, Z);
s.__XHRMaster_ongotheaders = x(Z.Ac, Z);
s.__XHRMaster_onreadystatechange = x(Z.Bc, Z);
function ef(a, b, c) {
  this.V = a;
  this.host = b;
  this.port = c
}
function ff(a, b, c) {
  this.host = a;
  this.port = b;
  this.lf = c
}
function gf(a, b) {
  b || (b = a);
  this.V = a;
  this.ua = b
}
gf.prototype.v = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  M(this.V, a, b);
  a.push(", secondaryUrl=");
  M(this.ua, a, b);
  a.push(">")
};
function hf(a, b, c, d) {
  this.V = a;
  this.Qd = b;
  this.ua = c;
  this.$d = d;
  (!(0 == this.V.indexOf("http://") || 0 == this.V.indexOf("https://")) || !(0 == this.ua.indexOf("http://") || 0 == this.ua.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Qd.location.href;
  td(this.V, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.$d.location.href;
  td(this.ua, a) || f(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
hf.prototype.v = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  M(this.V, a, b);
  a.push(", secondaryUrl=");
  M(this.ua, a, b);
  a.push(">")
};
var jf = new Fe(";)]}");
function kf(a) {
  s.setTimeout(function() {
    u(a.message) && a.stack && (a.message += "\n" + a.stack);
    f(a)
  }, 0)
}
function lf(a, b, c) {
  u(b) || (b = j);
  u(c) || (c = j);
  this.Va = a;
  this.of = b;
  this.hf = c
}
p = lf.prototype;
p.a = U("cw.net.QANProtocolWrapper");
p.ib = function(a, b) {
  this.a.q(a, b);
  this.hf && kf(b)
};
p.da = function(a) {
  this.Ya.ae(Ac(a), this.of)
};
p.Bb = function(a) {
  this.Ya.reset("QANHelper said: " + a)
};
p.ff = function(a) {
  this.Ya = a;
  this.Ec = new Q(x(this.Va.bodyReceived, this.Va), x(this.ib, this), x(this.da, this), x(this.Bb, this));
  this.Va.streamStarted.call(this.Va, this.Ya, this.Ec)
};
p.ef = function(a, b) {
  this.Ec.md("Stream reset applicationLevel=" + N(b) + ", reason: " + a);
  this.Va.streamReset.call(this.Va, a, b)
};
p.gf = function(a) {
  try {
    var b = Dc(a)
  }catch(c) {
    c instanceof Bc || f(c);
    this.Ya.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Ec.ud(b)
};
function mf(a) {
  this.Ya = a
}
mf.prototype.v = function(a, b) {
  a.push("<UserContext for ");
  M(this.Ya, a, b);
  a.push(">")
};
function nf(a, b, c, d) {
  P.call(this, "TransportInfo", [a, b, c, d]);
  this.fa = a
}
A(nf, P);
function $(a, b, c) {
  this.r = a;
  this.o = c ? c : Qb;
  this.pb = new Zc;
  this.ob = Zb() + Zb();
  this.W = new Od;
  this.sc = new Qd;
  this.qb = k;
  this.Xb = [];
  this.Ia = new mf(this);
  this.re = x(this.mf, this);
  F && (this.qb = xb(s, "load", this.Ze, m, this))
}
A($, I);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Dd = new Nd(-1, []);
p.Ed = new Nd(-1, []);
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
p.kb = k;
p.Mc = 0;
p.Pd = 0;
p.Zd = 0;
p.v = function(a, b) {
  a.push("<ClientStream id=");
  M(this.ob, a, b);
  a.push(", state=", "" + this.B);
  a.push(", primary=");
  M(this.e, a, b);
  a.push(", secondary=");
  M(this.p, a, b);
  a.push(", resetting=");
  M(this.kb, a, b);
  a.push(">")
};
p.Je = o("Ia");
p.pe = function(a) {
  u(a.streamStarted) || f(Error("Protocol is missing required method streamStarted"));
  u(a.streamReset) || f(Error("Protocol is missing required method streamReset"));
  u(a.stringReceived) || f(Error("Protocol is missing required method stringReceived"));
  this.onstarted = x(a.streamStarted, a);
  this.onreset = x(a.streamReset, a);
  this.onstring = x(a.stringReceived, a);
  this.Cc = u(a.transportCreated) ? x(a.transportCreated, a) : k;
  this.Dc = u(a.transportDestroyed) ? x(a.transportDestroyed, a) : k
};
function of(a) {
  var b = [-1];
  a.e && b.push(a.e.Ta);
  a.p && b.push(a.p.Ta);
  return Math.max.apply(Math.max, b)
}
function pf(a) {
  if(!("3_STARTED" > a.B)) {
    qf(a);
    var b = 0 != a.W.G.A(), c = Rd(a.sc), d = !c.K(a.Ed) && !(a.e && c.K(a.e.Qa) || a.p && c.K(a.p.Qa)), g = of(a);
    if((b = b && g < a.W.ya) || d) {
      var e = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.xa ? (a.a.s("tryToSend_: writing " + e + " to primary"), d && (d = a.e, c != d.Qa && (!d.ea && !d.u.length && rf(d), d.u.push(new De(c)), d.Qa = c)), b && sf(a.e, a.W, g + 1), a.e.aa()) : a.p == k ? a.Lc ? (a.a.s("tryToSend_: creating secondary to send " + e), a.p = tf(a, m, j), a.p && (b && sf(a.p, a.W, g + 1), a.p.aa())) : (a.a.s("tryToSend_: not creating a secondary because stream might not exist on server"), a.Gc = j) : a.a.s("tryToSend_: need to send " + e + ", but can't right now")
    }
  }
}
function qf(a) {
  a.Xa != k && (a.o.z.clearTimeout(a.Xa), a.Xa = k)
}
p.mf = function() {
  this.Xa = k;
  pf(this)
};
function uf(a) {
  a.Xa == k && (a.Xa = a.o.z.setTimeout(a.re, 6))
}
p.Ze = function() {
  this.qb = k;
  if(this.e && this.e.Pa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.Zb = j;
    a.b()
  }
  this.p && this.p.Pa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.p, a.Zb = j, a.b())
};
p.ae = function(a, b) {
  u(b) || (b = j);
  "3_STARTED" < this.B && f(Error("sendString: Can't send in state " + this.B));
  b && (v(a) || f(Error("sendString: not a string: " + N(a))), /^([ -~]*)$/.test(a) || f(Error("sendString: string has illegal chars: " + N(a))));
  this.W.append(a);
  uf(this)
};
function tf(a, b, c) {
  var d;
  a.r instanceof hf ? d = bf : a.r instanceof ff ? d = vf : f(Error("Don't support endpoint " + N(a.r)));
  a.Rc += 1;
  b = new wf(a.o, a, a.Rc, d, a.r, b);
  a.a.s("Created: " + b.k());
  if(c) {
    if(a.Cc) {
      c = new nf(b.fa, b.ha, b.ra, b.xa);
      try {
        a.Cc.call(a.Ia, c)
      }catch(g) {
        a.a.q("ontransportcreated raised uncaught exception", g), kf(g)
      }
    }
    if(xf(a)) {
      return k
    }
  }
  a.pb.add(b);
  return b
}
function yf(a, b, c) {
  var d = new zf(a.o, a, b, c);
  a.a.s("Created: " + d.k() + ", delay=" + b + ", times=" + c);
  a.pb.add(d);
  return d
}
function Af(a, b) {
  a.pb.remove(b) || f(Error("transportOffline_: Transport was not removed?"));
  a.a.j("Offline: " + b.k());
  var c = "4_RESETTING" == a.B && b.ie;
  if(b instanceof wf && !c) {
    if(a.Dc) {
      var d = new nf(b.fa, b.ha, b.ra, b.xa);
      try {
        a.Dc.call(a.Ia, d)
      }catch(g) {
        a.a.q("ontransportdestroyed raised uncaught exception", g), kf(g)
      }
    }
    if(xf(a)) {
      return
    }
  }
  a.Mc = b.oa ? a.Mc + b.oa : 0;
  1 <= a.Mc && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), Bf(a, "stream penalty reached limit", m), a.b());
  if("3_STARTED" < a.B) {
    c ? (a.a.j("Disposing because resettingTransport_ is done."), a.b()) : a.a.j("Not creating a transport because ClientStream is in state " + a.B)
  }else {
    c = b instanceof zf;
    if(!c && b.Zb) {
      var e = F ? Xe ? [0, 1] : [9, 20] : [0, 0], c = e[0], d = e[1];
      a.a.s("getDelayForNextTransport_: " + N({delay:c, times:d}))
    }else {
      if(d = b.bd(), b == a.e ? d ? e = ++a.Pd : c || (e = a.Pd = 0) : d ? e = ++a.Zd : c || (e = a.Zd = 0), c || !e) {
        d = c = 0, a.a.s("getDelayForNextTransport_: " + N({count:e, delay:c, times:d}))
      }else {
        var h = 2E3 * Math.min(e, 3), l = Math.floor(4E3 * Math.random()) - 2E3, n = Math.max(0, b.ge - b.Sc), d = (c = Math.max(0, h + l - n)) ? 1 : 0;
        a.a.s("getDelayForNextTransport_: " + N({count:e, base:h, variance:l, oldDuration:n, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    if(b == a.e) {
      a.e = k;
      if(c) {
        a.e = yf(a, e, c)
      }else {
        e = of(a);
        a.e = tf(a, j, j);
        if(!a.e) {
          return
        }
        sf(a.e, a.W, e + 1)
      }
      a.e.aa()
    }else {
      b == a.p && (a.p = k, c ? (a.p = yf(a, e, c), a.p.aa()) : pf(a))
    }
  }
}
function Bf(a, b, c) {
  if(a.onreset) {
    try {
      a.onreset.call(a.Ia, b, c)
    }catch(d) {
      a.a.q("onreset raised uncaught exception", d), kf(d)
    }
  }
}
p.reset = function(a) {
  "3_STARTED" < this.B && f(Error("reset: Can't send reset in state " + this.B));
  qf(this);
  0 != this.W.G.A() && this.a.q("reset: strings in send queue will never be sent: " + N(this.W));
  this.B = "4_RESETTING";
  this.e && this.e.xa ? (this.a.info("reset: Sending ResetFrame over existing primary."), Cf(this.e, a), this.e.aa()) : (this.e && (this.a.j("reset: Disposing primary before sending ResetFrame."), this.e.b()), this.p && (this.a.j("reset: Disposing secondary before sending ResetFrame."), this.p.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.kb = tf(this, m, m), Cf(this.kb, a), this.kb.aa());
  Bf(this, a, j)
};
function xf(a) {
  return"4_RESETTING" == a.B || a.ja
}
p.jd = function(a) {
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
  if(this.r instanceof gf) {
    var a = Te(this.r.V, this), b = Te(this.r.ua, this), a = new Ye([a, b], m, j);
    a.La(function(a) {
      return fb(a, function(a) {
        return a[1]
      })
    });
    a.La(x(this.De, this));
    a.sb(x(this.jd, this))
  }else {
    if(this.r instanceof ef) {
      if(sc) {
        this.ld()
      }else {
        a = this.o;
        b = this.r.V;
        if(we.length) {
          a = xe()
        }else {
          b = new le(b + "FlashConnector.swf?cb=4bdfc178fc0e508c0cd5efc3fdb09920");
          b.Xc = "#777777";
          me(b, 300, 30);
          var c = R("minerva-elements");
          c || f(Error('loadFlashConnector_: Page is missing an empty div with id "minerva-elements"; please add one.'));
          var d = R("minerva-elements-FlashConnectorSwf");
          d || (d = Tc("div", {id:"minerva-elements-FlashConnectorSwf"}), c.appendChild(d));
          var g = a.z, e;
          var a = d, h, l = function() {
            h && delete s.__loadFlashObject_callbacks[h]
          };
          if(Ka && !G("1.8.1.20")) {
            e = Ob(new ne("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
          }else {
            if(0 <= ya(de, "9")) {
              var n;
              h = "_" + Zb();
              var q = new L(l);
              s.__loadFlashObject_callbacks[h] = function() {
                g.setTimeout(function() {
                  l();
                  q.N(R(n))
                }, 0)
              };
              b.Cb.set("onloadcallback", '__loadFlashObject_callbacks["' + h + '"]()');
              n = ie(b);
              b.Da && f(Error("Component already rendered"));
              b.h || b.bb();
              a ? a.insertBefore(b.h, k) : b.xb.za.body.appendChild(b.h);
              (!b.t || b.t.Da) && b.yb();
              e = q
            }else {
              e = Ob(new ne("Need Flash Player 9+; had " + (de ? de : "none")))
            }
          }
          var z = g.setTimeout(function() {
            e.cancel()
          }, 8E3);
          e.Vc(function(a) {
            g.clearTimeout(z);
            return a
          });
          rc = e;
          a = xe();
          rc.Y(ye, ze)
        }
        var r = this;
        a.La(function(a) {
          sc || (sc = new ue(r.o, a));
          return k
        });
        a.La(x(this.ld, this));
        a.sb(x(this.jd, this))
      }
    }else {
      Df(this)
    }
  }
};
p.De = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Ab, g = a[1].Ab;
  this.Xb.push(a[0]);
  this.Xb.push(a[1]);
  this.r = new hf(d, b, g, c);
  Df(this)
};
p.ld = function() {
  this.r = new ff(this.r.host, this.r.port, sc);
  Df(this)
};
function Df(a) {
  a.B = "3_STARTED";
  a.e = tf(a, j, j);
  a.e && (sf(a.e, a.W, k), a.e.aa())
}
p.d = function() {
  this.a.info(N(this) + " in disposeInternal.");
  qf(this);
  this.B = "5_DISCONNECTED";
  for(var a = this.pb.C(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Xb.length;a++) {
    ib(this.Xb[a].Oc, this)
  }
  F && this.qb && (zb(this.qb), this.qb = k);
  this.ondisconnect && this.ondisconnect.call(this.Ia);
  delete this.pb;
  delete this.e;
  delete this.p;
  delete this.kb;
  delete this.Ia;
  $.m.d.call(this)
};
var bf = 1, vf = 3;
function wf(a, b, c, d, g, e) {
  this.o = a;
  this.D = b;
  this.fa = c;
  this.X = d;
  this.r = g;
  this.u = [];
  this.ha = e;
  this.xa = !this.Pa();
  this.ra = this.X != bf;
  this.qe = x(this.jf, this)
}
A(wf, I);
p = wf.prototype;
p.a = U("cw.net.ClientTransport");
p.i = k;
p.Sc = k;
p.ge = k;
p.Qb = k;
p.ea = m;
p.Ub = m;
p.Qa = k;
p.Db = 0;
p.Ta = -1;
p.Nb = -1;
p.ie = m;
p.Zb = m;
p.oa = 0;
p.eb = m;
p.v = function(a) {
  a.push("<ClientTransport #", "" + this.fa, ", becomePrimary=", "" + this.ha, ">")
};
p.k = function() {
  return(this.ha ? "Prim. T#" : "Sec. T#") + this.fa
};
p.bd = function() {
  return!(!this.eb && this.Db)
};
p.Pa = function() {
  return this.X == bf || 2 == this.X
};
function Ef(a, b) {
  H.sort.call(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  } || mb);
  a: {
    var c = a.D, d = !a.ra, g, e = c.sc;
    g = c.maxUndeliveredStrings;
    for(var h = c.maxUndeliveredBytes, l = [], n = m, q = 0, z = b.length;q < z;q++) {
      var r = b[q], w = r[0], r = r[1];
      if(w == e.Ea + 1) {
        e.Ea += 1;
        for(l.push(r);;) {
          w = e.Ea + 1;
          r = e.wa.get(w, Sd);
          if(r === Sd) {
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
          var E = Md(r);
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
            c.onstring.call(c.Ia, l)
          }catch(lc) {
            c.a.q("onstring raised uncaught exception", lc), kf(lc)
          }
        }
        if(xf(c)) {
          break a
        }
      }
    }
    d || uf(c);
    !xf(c) && g && (a.a.H(a.k() + "'s peer caused rwin overflow."), a.b())
  }
}
function Ff(a, b, c) {
  try {
    var d = Qe(b);
    a.Db += 1;
    a.a.j(a.k() + " RECV " + N(d));
    var g;
    1 == a.Db && !d.K(jf) && a.Pa() ? (a.a.q(a.k() + " is closing soon because got bad preamble: " + N(d)), g = j) : g = m;
    if(g) {
      return j
    }
    if(d instanceof Ee) {
      if(!/^([ -~]*)$/.test(d.Pc)) {
        return a.eb = j
      }
      a.Nb += 1;
      c.push([a.Nb, d.Pc])
    }else {
      if(d instanceof De) {
        var e = a.D, h = d.sa;
        e.Dd = h;
        var l = e.W, n = h.Ka, c = m;
        n > l.ya && (c = j);
        for(var q = Pd(l).concat(), d = 0;d < q.length;d++) {
          var z = q[d];
          if(z > n) {
            break
          }
          var r = l.G.get(z)[1];
          l.G.remove(z);
          l.I -= r
        }
        for(d = 0;d < h.Ga.length;d++) {
          var w = h.Ga[d];
          w > l.ya && (c = j);
          l.G.Z(w) && (r = l.G.get(w)[1], l.G.remove(w), l.I -= r)
        }
        l.G.fb() && l.G.clear();
        if(c) {
          return a.a.q(a.k() + " is closing soon because got bad SackFrame"), a.eb = j
        }
      }else {
        if(d instanceof Ge) {
          a.Nb = d.be - 1
        }else {
          if(d instanceof Ie) {
            a.D.Ed = d.Cd
          }else {
            if(d instanceof Ke) {
              return a.a.s(a.k() + " is closing soon because got YouCloseItFrame"), j
            }
            if(d instanceof Pe) {
              return a.eb = j, "stream_attach_failure" == d.reason ? a.oa += 1 : "acked_unsent_strings" == d.reason && (a.oa += 0.5), a.a.s(a.k() + " is closing soon because got " + N(d)), j
            }
            if(!(d instanceof Fe)) {
              if(d instanceof Je) {
                var E = a.D, lc = !a.ra;
                E.a.s("Stream is now confirmed to exist at server.");
                E.Lc = j;
                E.Gc && !lc && (E.Gc = m, pf(E))
              }else {
                if(c.length) {
                  Ef(a, c);
                  if(!fa(c)) {
                    for(var vd = c.length - 1;0 <= vd;vd--) {
                      delete c[vd]
                    }
                  }
                  c.length = 0
                }
                if(d instanceof Le) {
                  var Me = a.D;
                  Bf(Me, d.Ud, d.Wc);
                  Me.b();
                  return j
                }
                f(Error(a.k() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Ne) {
    return Ne instanceof X || f(Ne), a.a.q(a.k() + " is closing soon because got InvalidFrame: " + N(b)), a.eb = j
  }
  return m
}
function re(a, b) {
  a.Ub = j;
  try {
    for(var c = m, d = [], g = 0, e = b.length;g < e;g++) {
      if(a.ja) {
        a.a.info(a.k() + " returning from loop because we're disposed.");
        return
      }
      if(c = Ff(a, b[g], d)) {
        break
      }
    }
    d.length && Ef(a, d);
    a.Ub = m;
    a.u.length && a.aa();
    c && (a.a.s(a.k() + " closeSoon is true.  Frames were: " + N(b)), a.b())
  }finally {
    a.Ub = m
  }
}
p.jf = function() {
  this.a.q(this.k() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Gf(a) {
  a.Qb != k && (a.o.z.clearTimeout(a.Qb), a.Qb = k)
}
function cf(a, b) {
  Gf(a);
  b = Math.round(b);
  a.Qb = a.o.z.setTimeout(a.qe, b);
  a.a.j(a.k() + "'s receive timeout set to " + b + " ms.")
}
function qe(a) {
  a.X != bf && (a.X == vf || 2 == a.X ? cf(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.X)))
}
function rf(a) {
  var b = new Be;
  b.fa = a.fa;
  b.Rd = 2;
  b.wd = 2;
  a.D.Lc || (b.Wd = j);
  b.ob = a.D.ob;
  b.Nc = a.ra;
  b.Nc && (b.Kd = 4096);
  b.Id = 3E5;
  b.Gd = a.ra ? Math.floor(10) : 0;
  b.he = m;
  a.ha && (b.ee = k, b.xc = Math.floor((a.ra ? 358E4 : 25E3) / 1E3));
  b.sa = Rd(a.D.sc);
  b.Ib = a.D.Dd;
  a.u.push(b);
  a.Qa = b.sa
}
function se(a, b) {
  b && (a.oa += 0.5);
  a.b()
}
p.aa = function() {
  this.ea && !this.xa && f(Error("flush_: Can't flush more than once to this transport."));
  if(this.Ub) {
    this.a.s(this.k() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ea;
    this.ea = j;
    !a && !this.u.length && rf(this);
    for(a = 0;a < this.u.length;a++) {
      this.a.j(this.k() + " SEND " + N(this.u[a]))
    }
    if(this.Pa()) {
      for(var a = [], b = 0, c = this.u.length;b < c;b++) {
        this.u[b].O(a), a.push("\n")
      }
      this.u = [];
      a = a.join("");
      b = this.ha ? this.r.V : this.r.ua;
      this.i = Z.gc(this, this.ha ? this.r.Qd : this.r.$d);
      this.Sc = this.o.z === Fb ? pa() : this.o.z.getTime();
      this.i.wc(b, "POST", a);
      cf(this, 3E3 * (1.5 + (0 == b.indexOf("https://") ? 3 : 1)) + 4E3 + (this.ra ? 0 : this.ha ? 25E3 : 0))
    }else {
      if(this.X == vf) {
        a = [];
        b = 0;
        for(c = this.u.length;b < c;b++) {
          a.push(this.u[b].J())
        }
        this.u = [];
        this.i ? this.i.rb(a) : (b = this.r, this.i = new ve(this), this.i.Tb = b.lf.gc(this.i), this.Sc = this.o.z === Fb ? pa() : this.o.z.getTime(), this.i.cc(b.host, b.port), this.i.ja || (this.i.rb(a), this.i.ja || cf(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.X))
      }
    }
  }
};
function sf(a, b, c) {
  !a.ea && !a.u.length && rf(a);
  for(var d = Math.max(c, a.Ta + 1), g = Pd(b), c = [], e = 0;e < g.length;e++) {
    var h = g[e];
    (d == k || h >= d) && c.push([h, b.G.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    e = c[b], g = e[0], e = e[1], (-1 == a.Ta || a.Ta + 1 != g) && a.u.push(new Ge(g)), a.u.push(new Ee(e)), a.Ta = g
  }
}
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  wf.m.d.call(this);
  this.ge = this.o.z === Fb ? pa() : this.o.z.getTime();
  this.u = [];
  Gf(this);
  this.i && this.i.b();
  var a = this.D;
  this.D = k;
  Af(a, this)
};
function Cf(a, b) {
  !a.ea && !a.u.length && rf(a);
  a.u.push(new Le(b, j));
  a.ie = j
}
function zf(a, b, c, d) {
  this.o = a;
  this.D = b;
  this.hd = c;
  this.dd = d
}
A(zf, I);
p = zf.prototype;
p.ea = m;
p.xa = m;
p.Eb = k;
p.Qa = k;
p.a = U("cw.net.DoNothingTransport");
function Hf(a) {
  a.Eb = a.o.z.setTimeout(function() {
    a.Eb = k;
    a.dd--;
    a.dd ? Hf(a) : a.b()
  }, a.hd)
}
p.aa = function() {
  this.ea && !this.xa && f(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ea = j;
  Hf(this)
};
p.v = function(a) {
  a.push("<DoNothingTransport delay=", "" + this.hd, ">")
};
p.Pa = ba(m);
p.k = ba("Wast. T");
p.bd = ba(m);
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  zf.m.d.call(this);
  this.Eb != k && this.o.z.clearTimeout(this.Eb);
  var a = this.D;
  this.D = k;
  Af(a, this)
};
function If() {
}
If.prototype.ub = k;
var Jf;
function Kf() {
}
A(Kf, If);
function Lf(a) {
  return(a = Mf(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Nf(a) {
  var b = {};
  Mf(a) && (b[0] = j, b[1] = j);
  return b
}
Kf.prototype.qc = k;
function Mf(a) {
  if(!a.qc && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.qc = d
      }catch(g) {
      }
    }
    f(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.qc
}
Jf = new Kf;
function Of(a) {
  this.headers = new O;
  this.$a = a || k
}
A(Of, Eb);
Of.prototype.a = U("goog.net.XhrIo");
var Pf = /^https?$/i;
p = Of.prototype;
p.ga = m;
p.f = k;
p.Yb = k;
p.uc = "";
p.Bd = "";
p.gb = "";
p.ic = m;
p.Gb = m;
p.rc = m;
p.Ca = m;
p.Vb = 0;
p.Ha = k;
p.Yd = "";
p.qf = m;
p.send = function(a, b, c, d) {
  this.f && f(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.uc = a;
  this.gb = "";
  this.Bd = b;
  this.ic = m;
  this.ga = j;
  this.f = this.$a ? Lf(this.$a) : Lf(Jf);
  this.Yb = this.$a ? this.$a.ub || (this.$a.ub = Nf(this.$a)) : Jf.ub || (Jf.ub = Nf(Jf));
  this.f.onreadystatechange = x(this.Od, this);
  try {
    this.a.j(Qf(this, "Opening Xhr")), this.rc = j, this.f.open(b, a, j), this.rc = m
  }catch(g) {
    this.a.j(Qf(this, "Error opening Xhr: " + g.message));
    Rf(this, g);
    return
  }
  var a = c || "", e = this.headers.S();
  d && hc(d, function(a, b) {
    e.set(b, a)
  });
  "POST" == b && !e.Z("Content-Type") && e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  hc(e, function(a, b) {
    this.f.setRequestHeader(b, a)
  }, this);
  this.Yd && (this.f.responseType = this.Yd);
  "withCredentials" in this.f && (this.f.withCredentials = this.qf);
  try {
    this.Ha && (Fb.clearTimeout(this.Ha), this.Ha = k), 0 < this.Vb && (this.a.j(Qf(this, "Will abort after " + this.Vb + "ms if incomplete")), this.Ha = Fb.setTimeout(x(this.kf, this), this.Vb)), this.a.j(Qf(this, "Sending request")), this.Gb = j, this.f.send(a), this.Gb = m
  }catch(h) {
    this.a.j(Qf(this, "Send error: " + h.message)), Rf(this, h)
  }
};
p.kf = function() {
  "undefined" != typeof ca && this.f && (this.gb = "Timed out after " + this.Vb + "ms, aborting", this.a.j(Qf(this, this.gb)), this.dispatchEvent("timeout"), this.abort(8))
};
function Rf(a, b) {
  a.ga = m;
  a.f && (a.Ca = j, a.f.abort(), a.Ca = m);
  a.gb = b;
  Sf(a);
  Tf(a)
}
function Sf(a) {
  a.ic || (a.ic = j, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function() {
  this.f && this.ga && (this.a.j(Qf(this, "Aborting")), this.ga = m, this.Ca = j, this.f.abort(), this.Ca = m, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Tf(this))
};
p.d = function() {
  this.f && (this.ga && (this.ga = m, this.Ca = j, this.f.abort(), this.Ca = m), Tf(this, j));
  Of.m.d.call(this)
};
p.Od = function() {
  !this.rc && !this.Gb && !this.Ca ? this.Ve() : Uf(this)
};
p.Ve = function() {
  Uf(this)
};
function Uf(a) {
  if(a.ga && "undefined" != typeof ca) {
    if(a.Yb[1] && 4 == a.la() && 2 == Vf(a)) {
      a.a.j(Qf(a, "Local request error detected and ignored"))
    }else {
      if(a.Gb && 4 == a.la()) {
        Fb.setTimeout(x(a.Od, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == a.la()) {
          a.a.j(Qf(a, "Request complete"));
          a.ga = m;
          try {
            var b = Vf(a), c, d;
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
                var e = ("" + a.uc).match(sd)[1] || k;
                if(!e && self.location) {
                  var h = self.location.protocol, e = h.substr(0, h.length - 1)
                }
                g = !Pf.test(e ? e.toLowerCase() : "")
              }
              c = g
            }
            if(c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success")
            }else {
              var l;
              try {
                l = 2 < a.la() ? a.f.statusText : ""
              }catch(n) {
                a.a.j("Can not get status: " + n.message), l = ""
              }
              a.gb = l + " [" + Vf(a) + "]";
              Sf(a)
            }
          }finally {
            Tf(a)
          }
        }
      }
    }
  }
}
function Tf(a, b) {
  if(a.f) {
    var c = a.f, d = a.Yb[0] ? ea : k;
    a.f = k;
    a.Yb = k;
    a.Ha && (Fb.clearTimeout(a.Ha), a.Ha = k);
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
function Vf(a) {
  try {
    return 2 < a.la() ? a.f.status : -1
  }catch(b) {
    return a.a.q("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.f && 4 == this.la() ? this.f.getResponseHeader(a) : i
};
function Qf(a, b) {
  return b + " [" + a.Bd + " " + a.uc + " " + Vf(a) + "]"
}
;var Wf = !(D || F && !G("420+"));
function Xf(a, b) {
  this.Wb = a;
  this.R = b
}
A(Xf, I);
p = Xf.prototype;
p.i = k;
p.qa = -1;
p.sd = m;
p.vd = "Content-Length Server Date Expires Keep-Alive Content-Type Transfer-Encoding Cache-Control".split(" ");
function Yf(a) {
  var b = $e(a.fd), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.R, c, b), 1 != b && a.b()) : a.b()
}
p.Me = function() {
  Yf(this);
  if(!this.ja) {
    var a = s.parent;
    a && a.__XHRMaster_oncomplete(this.R);
    this.b()
  }
};
p.Xe = function() {
  var a = s.parent;
  if(a) {
    this.qa = this.i.la();
    if(2 <= this.qa && !this.sd) {
      for(var b = new O, c = this.vd.length;c--;) {
        var d = this.vd[c];
        try {
          b.set(d, this.i.f.getResponseHeader(d))
        }catch(g) {
        }
      }
      if(b.A() && (this.sd = j, a.__XHRMaster_ongotheaders(this.R, nc(b)), this.ja)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.R, this.qa);
    Wf && 3 == this.qa && Yf(this)
  }else {
    this.b()
  }
};
p.wc = function(a, b, c) {
  this.i = new Of;
  vb(this.i, "readystatechange", x(this.Xe, this));
  vb(this.i, "complete", x(this.Me, this));
  this.i.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.fd = new Ze(this.i.f, 1048576)
};
p.d = function() {
  Xf.m.d.call(this);
  delete this.fd;
  this.i && this.i.b();
  delete this.Wb.nb[this.R];
  delete this.Wb
};
function Zf() {
  this.nb = {}
}
A(Zf, I);
Zf.prototype.Re = function(a, b, c, d) {
  var g = new Xf(this, a);
  this.nb[a] = g;
  g.wc(b, c, d)
};
Zf.prototype.Ae = function(a) {
  (a = this.nb[a]) && a.b()
};
Zf.prototype.d = function() {
  Zf.m.d.call(this);
  for(var a = Ya(this.nb);a.length;) {
    a.pop().b()
  }
  delete this.nb
};
var $f = new Zf;
s.__XHRSlave_makeRequest = x($f.Re, $f);
s.__XHRSlave_dispose = x($f.Ae, $f);
var ag = U("cw.net.demo");
function bg(a, b, c, d) {
  a = new ud(document.location);
  if(c) {
    return new ef(d, a.ka, s.__demo_mainSocketPort)
  }
  b ? (b = s.__demo_shared_domain, v(b) || f(Error("domain was " + N(b) + "; expected a string.")), c = a.S(), xd(c, "_____random_____." + b)) : c = a.S();
  zd(c, d);
  Ad(c, "", i);
  return new gf(c.toString().replace("_____random_____", "%random%"))
}
;y("Minerva.HttpEndpoint", gf);
y("Minerva.SocketEndpoint", ef);
y("Minerva.QANHelper", Q);
Q.prototype.handleQANFrame = Q.prototype.ud;
Q.prototype.ask = Q.prototype.ne;
Q.prototype.notify = Q.prototype.Ue;
Q.prototype.failAll = Q.prototype.md;
y("Minerva.QANProtocolWrapper", lf);
lf.prototype.streamStarted = lf.prototype.ff;
lf.prototype.streamReset = lf.prototype.ef;
lf.prototype.stringReceived = lf.prototype.gf;
y("Minerva.Deferred", L);
L.prototype.cancel = L.prototype.cancel;
L.prototype.callback = L.prototype.N;
L.prototype.errback = L.prototype.P;
L.prototype.addErrback = L.prototype.sb;
L.prototype.addCallback = L.prototype.La;
L.prototype.addCallbacks = L.prototype.Y;
L.prototype.chainDeferred = L.prototype.ad;
L.prototype.awaitDeferred = L.prototype.oe;
L.prototype.branch = L.prototype.Zc;
L.prototype.addBoth = L.prototype.Vc;
L.prototype.hasFired = L.prototype.Le;
y("Minerva.Deferred.succeed", Nb);
y("Minerva.Deferred.fail", Ob);
y("Minerva.Deferred.cancelled", function() {
  var a = new L;
  a.cancel();
  return a
});
y("Minerva.Deferred.AlreadyCalledError", Kb);
y("Minerva.Deferred.CancelledError", Gb);
y("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Je;
$.prototype.bindToProtocol = $.prototype.pe;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.ae;
$.prototype.reset = $.prototype.reset;
y("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.Ic;
S.prototype.shout = S.prototype.af;
S.prototype.severe = S.prototype.H;
S.prototype.warning = S.prototype.q;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.ve;
S.prototype.fine = S.prototype.j;
S.prototype.finer = S.prototype.Ee;
S.prototype.finest = S.prototype.s;
T.OFF = gd;
T.SHOUT = hd;
T.SEVERE = id;
T.WARNING = jd;
T.INFO = kd;
T.CONFIG = ld;
T.FINE = md;
T.FINER = nd;
T.FINEST = od;
T.ALL = pd;
y("Minerva.LogManager", V);
V.getRoot = V.nc;
y("Minerva.DivConsole", rd);
rd.prototype.setCapturing = rd.prototype.$e;
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
y("Minerva.JSON.serialize", Sb);
y("Minerva.JSON.asciify", Sb);
y("Minerva.bind", x);
y("Minerva.repr", N);
y("Minerva.theCallQueue", Qb);
y("Minerva.MINIMUM_FLASH_VERSION", "9");
y("Minerva.getEndpoint", bg);
y("Minerva.getEndpointByQueryArgs", function() {
  var a;
  a = (new ud(document.location)).Q;
  var b = "http" != a.get("mode");
  if((a = Boolean(Number(a.get("useSubdomains", "0")))) && !s.__demo_shared_domain) {
    ag.q("You requested subdomains, but I cannot use them because you did not specify a domain.  Proceeding without subdomains."), a = m
  }
  return bg(0, a, b, "/_minerva/")
});

})();
