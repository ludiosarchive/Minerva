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
  a.n = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
}
;function B(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, B) : this.stack = Error().stack || "";
  a && (this.message = String(a))
}
A(B, Error);
B.prototype.name = "CustomError";
function qa(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
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
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), g = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = Math.max(d.length, g.length), h = 0;0 == c && h < e;h++) {
    var l = d[h] || "", n = g[h] || "", r = RegExp("(\\d*)(\\D*)", "g"), z = RegExp("(\\d*)(\\D*)", "g");
    do {
      var q = r.exec(l) || ["", "", ""], w = z.exec(n) || ["", "", ""];
      if(0 == q[0].length && 0 == w[0].length) {
        break
      }
      c = ((0 == q[1].length ? 0 : parseInt(q[1], 10)) < (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? -1 : (0 == q[1].length ? 0 : parseInt(q[1], 10)) > (0 == w[1].length ? 0 : parseInt(w[1], 10)) ? 1 : 0) || ((0 == q[2].length) < (0 == w[2].length) ? -1 : (0 == q[2].length) > (0 == w[2].length) ? 1 : 0) || (q[2] < w[2] ? -1 : q[2] > w[2] ? 1 : 0)
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
      Na = String(Sa);
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
p.Va = m;
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
  this.Va = m
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
p = sb.prototype;
p.d = function() {
};
p.b = function() {
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
p.bb = k;
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
  this.bb = a;
  a.defaultPrevented && this.preventDefault();
  delete this.Ga
};
p.stopPropagation = function() {
  vb.n.stopPropagation.call(this);
  this.bb.stopPropagation ? this.bb.stopPropagation() : this.bb.cancelBubble = j
};
p.preventDefault = function() {
  vb.n.preventDefault.call(this);
  var a = this.bb;
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
          if(h.Va) {
            break
          }
          return n[e].key
        }
      }
    }else {
      n = h[l] = [], h.c++
    }
    var r = zb, z = db ? function(a) {
      return r.call(z.src, z.key, a)
    } : function(a) {
      a = r.call(z.src, z.key, a);
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
  if(b.Va) {
    return m
  }
  var c = b.src, d = b.type, g = b.Vd, e = b.capture;
  c.removeEventListener ? (c == s || !c.fd) && c.removeEventListener(d, g, e) : c.detachEvent && c.detachEvent(d in xb ? xb[d] : xb[d] = "on" + d, g);
  c = ka(c);
  K[c] && (g = K[c], lb(g, b), 0 == g.length && delete K[c]);
  b.Va = j;
  if(b = J[d][e][c]) {
    b.Od = j, Db(d, e, c, b)
  }
  delete wb[a];
  return j
}
function Db(a, b, c, d) {
  if(!d.Kb && d.Od) {
    for(var g = 0, e = 0;g < d.length;g++) {
      d[g].Va ? d[g].Vd.src = k : (g != e && (d[e] = d[g]), e++)
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
        n && !n.Va && (e &= Fb(n, g) !== m)
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
        var r = m;
        if(0 == e.keyCode) {
          try {
            e.keyCode = -1;
            break a
          }catch(z) {
            r = j
          }
        }
        if(r || e.returnValue == i) {
          e.returnValue = j
        }
      }
    }
    r = new vb;
    r.Ib(e, this);
    e = j;
    try {
      if(l) {
        for(var q = [], w = r.currentTarget;w;w = w.parentNode) {
          q.push(w)
        }
        h = g[j];
        h.M = h.c;
        for(var E = q.length - 1;!r.Ga && 0 <= E && h.M;E--) {
          r.currentTarget = q[E], e &= Eb(h, q[E], d, j, r)
        }
        if(n) {
          h = g[m];
          h.M = h.c;
          for(E = 0;!r.Ga && E < q.length && h.M;E++) {
            r.currentTarget = q[E], e &= Eb(h, q[E], d, m, r)
          }
        }
      }else {
        e = Fb(c, r)
      }
    }finally {
      q && (q.length = 0)
    }
    return e
  }
  d = new vb(b, this);
  return e = Fb(c, d)
}
var Gb = 0;
function Hb() {
}
A(Hb, I);
p = Hb.prototype;
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
  Hb.n.d.call(this);
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
var Ib = s.window;
Gb++;
Gb++;
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
p.we = m;
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
    this.$ || this.P(new Jb(this))
  }
};
p.dd = function(a, b) {
  Kb(this, a, b);
  this.kb--;
  0 == this.kb && this.$ && Lb(this)
};
function Kb(a, b, c) {
  a.$ = j;
  a.mb = c;
  a.cb = !b;
  Lb(a)
}
function Mb(a) {
  a.$ && (a.Kc || f(new Nb(a)), a.Kc = m)
}
p.N = function(a) {
  Mb(this);
  Kb(this, j, a)
};
p.P = function(a) {
  Mb(this);
  Kb(this, m, a)
};
p.Ma = function(a, b) {
  return this.Y(a, k, b)
};
p.tb = function(a, b) {
  return this.Y(k, a, b)
};
p.Y = function(a, b, c) {
  this.wb.push([a, b, c]);
  this.$ && Lb(this);
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
  var b = new L;
  this.bd(b);
  a && (b.t = this, this.ub++);
  return b
};
p.Wc = function(a, b) {
  return this.Y(a, a, b)
};
p.Pe = o("$");
function Ob(a) {
  return jb(a.wb, function(a) {
    return ja(a[1])
  })
}
function Lb(a) {
  a.Tc && (a.$ && Ob(a)) && (s.clearTimeout(a.Tc), delete a.Tc);
  a.t && (a.t.ub--, delete a.t);
  for(var b = a.mb, c = m, d = m;a.wb.length && 0 == a.kb;) {
    var g = a.wb.shift(), e = g[0], h = g[1], g = g[2];
    if(e = a.cb ? h : e) {
      try {
        var l = e.call(g || a.hd, b);
        u(l) && (a.cb = a.cb && (l == b || l instanceof Error), a.mb = b = l);
        b instanceof L && (d = j, a.kb++)
      }catch(n) {
        b = n, a.cb = j, Ob(a) || (c = j)
      }
    }
  }
  a.mb = b;
  d && a.kb && (b.Y(x(a.dd, a, j), x(a.dd, a, m)), b.we = j);
  c && (a.Tc = s.setTimeout(function() {
    f(b)
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
function Nb(a) {
  B.call(this);
  this.Be = a
}
A(Nb, B);
Nb.prototype.message = "Deferred has already fired";
Nb.prototype.name = "AlreadyCalledError";
function Jb(a) {
  B.call(this);
  this.Be = a
}
A(Jb, B);
Jb.prototype.message = "Deferred was cancelled";
Jb.prototype.name = "CancelledError";
function Rb(a) {
  this.z = a;
  this.Ab = [];
  this.ld = [];
  this.ve = x(this.vf, this)
}
Rb.prototype.Qc = k;
Rb.prototype.vf = function() {
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
          c.push(g), g = b[e], Vb(a, a.Sb ? a.Sb.call(b, String(e), g) : g, c), g = ","
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
      b.push(String(a))
    }else {
      if("string" == d) {
        Xb(a, b)
      }else {
        if(Tb(a.v)) {
          a.v(b, c)
        }else {
          if(Tb(a.ne)) {
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
                    b.push("new Date(", String(a.valueOf()), ")")
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
    return kb(a, b, i)
  }
  for(var c = ic(a), d = hc(a), g = d.length, e = 0;e < g;e++) {
    if(!b.call(i, d[e], c && c[e], a)) {
      return m
    }
  }
  return j
}
;function O(a, b) {
  this.m = {};
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
    a.push(this.m[this.g[b]])
  }
  return a
};
p.T = function() {
  mc(this);
  return this.g.concat()
};
p.Z = function(a) {
  return nc(this.m, a)
};
p.ec = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(nc(this.m, c) && this.m[c] == a) {
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
  this.m = {};
  this.Uc = this.c = this.g.length = 0
};
p.remove = function(a) {
  return nc(this.m, a) ? (delete this.m[a], this.c--, this.Uc++, this.g.length > 2 * this.c && mc(this), j) : m
};
function mc(a) {
  if(a.c != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      nc(a.m, d) && (a.g[c++] = d);
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
  return nc(this.m, a) ? this.m[a] : b
};
p.set = function(a, b) {
  nc(this.m, a) || (this.c++, this.g.push(a), this.Uc++);
  this.m[a] = b
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
    b[d] = a.m[d]
  }
  return b
}
function nc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;var qc = {ne:ba("<cw.eq.Wildcard>")};
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
          if(a.me == Ba && b.me == Ba) {
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
  this.df = a;
  this.Qb = b
}
P.prototype.K = function(a, b) {
  return ia(a) && this.constructor == a.constructor && sc(this.Qb, a.Qb, b)
};
P.prototype.v = function(a, b) {
  a.push("new ", this.df, "(");
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
    return String(a.ca) + b
  }
  v(a.body) || f(Error("qanFrame.body must be a string, was " + N(a.body)));
  return a instanceof Ac ? a.body + b : a.body + "|" + String(a.ca) + b
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
  this.Ya = new O
}
p = Q.prototype;
p.v = function(a) {
  a.push("<QANHelper asked ", String(this.Pb), " questions, waiting for ", String(this.ma.A()), " peer answers and ", String(this.Ya.A()), " local answers>")
};
p.wd = function(a) {
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
        if(b = a.ca, this.Ya.Z(b)) {
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
          this.Ya.set(b, c);
          var e = this;
          c.Y(function(a) {
            var c = b;
            e.Ya.remove(c);
            e.da(new wc(a, c));
            return k
          }, function(a) {
            var c = b;
            e.Ya.remove(c);
            a instanceof Gc ? e.da(new xc(a.body, c)) : a instanceof Jb ? e.da(new yc("CancelledError", c)) : (e.jb("Peer's Question #" + c + " caused uncaught exception", a), e.da(new yc("Uncaught exception", c)));
            return k
          });
          c.tb(function(a) {
            this.jb("Bug in QANHelper.sendOkayAnswer_ or sendErrorAnswer_", a);
            return k
          })
        }
      }else {
        a instanceof zc && (b = a.ca, c = this.Ya.get(b), u(c) && c.cancel())
      }
    }
  }
};
p.qe = function(a) {
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
p.Ze = function(a) {
  this.da(new Ac(a))
};
p.nd = function(a) {
  for(var b = this.ma.T(), c = 0;c < b.length;c++) {
    var d = this.ma.get(b[c]);
    u(d) && (this.ma.set(b[c], k), d.P(new Ic(a)))
  }
};
function Jc() {
  this.Yd = pa()
}
var Kc = new Jc;
Jc.prototype.set = aa("Yd");
Jc.prototype.reset = function() {
  this.set(pa())
};
Jc.prototype.get = o("Yd");
function Lc(a) {
  this.bf = a || "";
  this.mf = Kc
}
Lc.prototype.fe = j;
Lc.prototype.lf = j;
Lc.prototype.kf = j;
Lc.prototype.ge = m;
function Mc(a) {
  return 10 > a ? "0" + a : String(a)
}
function Nc(a, b) {
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
function Oc(a) {
  Lc.call(this, a)
}
A(Oc, Lc);
Oc.prototype.ge = j;
function Pc() {
  var a = Math.pow(10, 9);
  return a + Math.random() * (Math.pow(10, 10) - a)
}
;var Qc;
function Rc(a, b) {
  var c;
  c = a.className;
  c = v(c) && c.match(/\S+/g) || [];
  for(var d = ob(arguments, 1), g = c.length + d.length, e = c, h = 0;h < d.length;h++) {
    0 <= fb(e, d[h]) || e.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == g
}
;var Sc = !D || Wa(), Tc = !Ka && !D || D && Wa() || Ka && G("1.9.1");
D && G("9");
function Uc(a) {
  return a ? new Vc(9 == a.nodeType ? a : a.ownerDocument || a.document) : Qc || (Qc = new Vc)
}
function R(a) {
  return v(a) ? document.getElementById(a) : a
}
var Wc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
function Xc(a, b, c) {
  return Yc(document, arguments)
}
function Yc(a, b) {
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
    "style" == b ? e.style.cssText = a : "class" == b ? e.className = a : "for" == b ? e.htmlFor = a : b in Wc ? e.setAttribute(Wc[b], a) : 0 == b.lastIndexOf("aria-", 0) || 0 == b.lastIndexOf("data-", 0) ? e.setAttribute(b, a) : e[b] = a
  }));
  2 < b.length && Zc(a, e, b, 2);
  return e
}
function Zc(a, b, c, d) {
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
function Vc(a) {
  this.za = a || s.document || document
}
p = Vc.prototype;
p.rd = Uc;
p.Ba = function(a) {
  return v(a) ? this.za.getElementById(a) : a
};
function $c(a, b) {
  var c;
  c = a.za;
  var d = b && "*" != b ? b.toUpperCase() : "";
  c = c.querySelectorAll && c.querySelector && d ? c.querySelectorAll(d + "") : c.getElementsByTagName(d || "*");
  return c
}
p.ab = function(a, b, c) {
  return Yc(this.za, arguments)
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
  Zc(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments, 1)
};
p.qd = function(a) {
  return Tc && a.children != i ? a.children : hb(a.childNodes, function(a) {
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
function ad(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
;function bd(a) {
  this.m = new O;
  a && this.ac(a)
}
function cd(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + ka(a) : b.substr(0, 1) + a
}
p = bd.prototype;
p.A = function() {
  return this.m.A()
};
p.add = function(a) {
  this.m.set(cd(a), a)
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
  return this.m.remove(cd(a))
};
p.clear = function() {
  this.m.clear()
};
p.fb = function() {
  return this.m.fb()
};
p.contains = function(a) {
  return this.m.Z(cd(a))
};
p.C = function() {
  return this.m.C()
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
            e = String(e);
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
  a = String(a);
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
hd.prototype.gf = 0;
hd.prototype.mc = k;
hd.prototype.lc = k;
var id = 0;
hd.prototype.reset = function(a, b, c, d, g) {
  this.gf = "number" == typeof g ? g : id++;
  this.ie = d || pa();
  this.Ra = a;
  this.Md = b;
  this.Ue = c;
  delete this.mc;
  delete this.lc
};
hd.prototype.Ic = aa("Ra");
function S(a) {
  this.Xe = a
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
var jd = new T("OFF", Infinity), kd = new T("SHOUT", 1200), ld = new T("SEVERE", 1E3), md = new T("WARNING", 900), nd = new T("INFO", 800), od = new T("CONFIG", 700), pd = new T("FINE", 500), qd = new T("FINER", 400), rd = new T("FINEST", 300), sd = new T("ALL", 0);
function U(a) {
  return V.td(a)
}
p = S.prototype;
p.getParent = o("t");
p.qd = function() {
  this.ia || (this.ia = {});
  return this.ia
};
p.Ic = aa("Ra");
function td(a) {
  if(a.Ra) {
    return a.Ra
  }
  if(a.t) {
    return td(a.t)
  }
  Aa("Root logger has no level set.");
  return k
}
p.log = function(a, b, c) {
  if(a.value >= td(this).value) {
    a = this.Me(a, b, c);
    b = "log:" + a.Md;
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
p.Me = function(a, b, c) {
  var d = new hd(a, String(b), this.Xe);
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
        var n, r, z = m;
        try {
          n = c.lineNumber || c.Te || "Not available"
        }catch(q) {
          n = "Not available", z = j
        }
        try {
          r = c.fileName || c.filename || c.sourceURL || l
        }catch(w) {
          r = "Not available", z = j
        }
        h = z || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:r, stack:c.stack || "Not available"} : c
      }
      g = "Message: " + C(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + C(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + C(dd(e) + "-> ")
    }catch(E) {
      g = "Exception trying to expose exception! You win, we lose. " + E
    }
    d.lc = g
  }
  return d
};
p.jf = function(a, b) {
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
p.ye = function(a, b) {
  this.log(od, a, b)
};
p.j = function(a, b) {
  this.log(pd, a, b)
};
p.Ie = function(a, b) {
  this.log(qd, a, b)
};
p.s = function(a, b) {
  this.log(rd, a, b)
};
var V = {Lb:{}, nb:k, Ad:function() {
  V.nb || (V.nb = new S(""), V.Lb[""] = V.nb, V.nb.Ic(od))
}, Eg:function() {
  return V.Lb
}, oc:function() {
  V.Ad();
  return V.nb
}, td:function(a) {
  V.Ad();
  return V.Lb[a] || V.Ae(a)
}, Dg:function(a) {
  return function(b) {
    (a || V.oc()).H("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Te + ")")
  }
}, Ae:function(a) {
  var b = new S(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = V.td(a.substr(0, c));
  c.qd()[d] = b;
  b.t = c;
  return V.Lb[a] = b
}};
function ud(a) {
  this.Wd = x(this.oe, this);
  this.pd = new Oc;
  this.Cd = this.pd.fe = m;
  this.h = a;
  this.Ge = this.h.ownerDocument || this.h.document;
  var a = Uc(this.h), b = k;
  if(D) {
    a = b = a.za.createStyleSheet(), D ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a.innerHTML = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
  }else {
    var c = $c(a, "head")[0];
    c || (b = $c(a, "body")[0], c = a.ab("head"), b.parentNode.insertBefore(c, b));
    var d = b = a.ab("style");
    D ? d.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : d.innerHTML = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}";
    a.appendChild(c, b)
  }
  this.h.className += " logdiv"
}
ud.prototype.hf = function(a) {
  if(a != this.Cd) {
    var b = V.oc();
    if(a) {
      var c = this.Wd;
      b.Na || (b.Na = []);
      b.Na.push(c)
    }else {
      (b = b.Na) && lb(b, this.Wd), this.Gg = ""
    }
    this.Cd = a
  }
};
ud.prototype.oe = function(a) {
  var b = 100 >= this.h.scrollHeight - this.h.scrollTop - this.h.clientHeight, c = this.Ge.createElement("div");
  c.className = "logmsg";
  var d = this.pd, g;
  switch(a.Ra.value) {
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
  e.push(d.bf, " ");
  if(d.fe) {
    var h = new Date(a.ie);
    e.push("[", Mc(h.getFullYear() - 2E3) + Mc(h.getMonth() + 1) + Mc(h.getDate()) + " " + Mc(h.getHours()) + ":" + Mc(h.getMinutes()) + ":" + Mc(h.getSeconds()) + "." + Mc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.lf && e.push("[", xa(Nc(a, d.mf.get())), "s] ");
  d.kf && e.push("[", C(a.Ue), "] ");
  e.push('<span class="', g, '">', ra(xa(C(a.Md))));
  d.ge && a.mc && e.push("<br>", ra(xa(a.lc || "")));
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
    this.L = u(b) ? b : a.L, zd(this, a.ta), c = a.Ka, W(this), this.Ka = c, Ad(this, a.ka), Bd(this, a.Ta), Cd(this, a.na), Dd(this, a.Q.S()), c = a.Aa, W(this), this.Aa = c
  }else {
    if(a && (c = String(a).match(vd))) {
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
p.Ta = k;
p.na = "";
p.Aa = "";
p.Se = m;
p.L = m;
p.toString = function() {
  var a = [], b = this.ta;
  b && a.push(Fd(b, Gd), ":");
  if(b = this.ka) {
    a.push("//");
    var c = this.Ka;
    c && a.push(Fd(c, Gd), "@");
    a.push(encodeURIComponent(String(b)));
    b = this.Ta;
    b != k && a.push(":", String(b))
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
  b ? (b = Number(b), (isNaN(b) || 0 > b) && f(Error("Bad port number " + b)), a.Ta = b) : a.Ta = k
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
  a.Se && f(Error("Tried to modify a read-only Uri"))
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
    this.Z(a) && (b = mb(b, this.l.get(Od(this, a))))
  }else {
    for(var a = this.l.C(), c = 0;c < a.length;c++) {
      b = mb(b, a[c])
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
  return 0 < c.length ? String(c[0]) : b
};
p.toString = function() {
  if(this.F) {
    return this.F
  }
  if(!this.l) {
    return""
  }
  for(var a = [], b = this.l.T(), c = 0;c < b.length;c++) {
    for(var d = b[c], g = encodeURIComponent(String(d)), d = this.C(d), e = 0;e < d.length;e++) {
      var h = g;
      "" !== d[e] && (h += "=" + encodeURIComponent(String(d[e])));
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
  var c = String(b);
  a.L && (c = c.toLowerCase());
  return c
}
p.Hc = function(a) {
  a && !this.L && (Nd(this), this.F = k, jc(this.l, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.remove(d), 0 < a.length && (this.F = k, this.l.set(Od(this, d), nb(a)), this.c += a.length))
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
  a.push("new SACK(", String(this.La), ", ");
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
  a.push("<Queue with ", String(this.G.A()), " item(s), counter=#", String(this.ya), ", size=", String(this.I), ">")
};
function Sd(a) {
  a = a.G.T();
  H.sort.call(a, pb);
  return a
}
function Td() {
  this.wa = new O
}
Td.prototype.Ea = -1;
Td.prototype.I = 0;
function Ud(a) {
  var b = a.wa.T();
  H.sort.call(b, pb);
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
  this.Oe = a;
  this.g = []
}
A(he, I);
var ie = [];
he.prototype.Fc = function() {
  gb(this.g, Cb);
  this.g.length = 0
};
he.prototype.d = function() {
  he.n.d.call(this);
  this.Fc()
};
he.prototype.handleEvent = function() {
  f(Error("EventHandler.handleEvent not implemented"))
};
function je() {
}
je.sd = function() {
  return je.Bd ? je.Bd : je.Bd = new je
};
je.prototype.Ye = 0;
je.sd();
function ke(a) {
  this.ic = a || Uc();
  this.ff = le
}
A(ke, Hb);
ke.prototype.Re = je.sd();
var le = k;
p = ke.prototype;
p.U = k;
p.Da = m;
p.h = k;
p.ff = k;
p.We = k;
p.t = k;
p.ia = k;
p.xb = k;
p.xf = m;
function me(a) {
  return a.U || (a.U = ":" + (a.Re.Ye++).toString(36))
}
p.Ba = o("h");
p.getParent = o("t");
p.Jc = function(a) {
  this.t && this.t != a && f(Error("Method not supported"));
  ke.n.Jc.call(this, a)
};
p.rd = o("ic");
p.ab = function() {
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
  ke.n.d.call(this);
  this.Da && oe(this);
  this.Gb && (this.Gb.b(), delete this.Gb);
  ne(this, function(a) {
    a.b()
  });
  if(!this.xf && this.h) {
    var a = this.h;
    a && a.parentNode && a.parentNode.removeChild(a)
  }
  this.t = this.We = this.h = this.xb = this.ia = k
};
function ne(a, b) {
  a.ia && gb(a.ia, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = v(a) ? a : me(a), d;
    this.xb && c ? (d = this.xb, d = (c in d ? d[c] : i) || k) : d = k;
    a = d;
    c && a && (d = this.xb, c in d && delete d[c], lb(this.ia, a), b && (oe(a), a.h && (c = a.h) && c.parentNode && c.parentNode.removeChild(c)), c = a, c == k && f(Error("Unable to set parent component")), c.t = k, ke.n.Jc.call(c, k))
  }
  a || f(Error("Child is not in parent component"));
  return a
};
function pe(a, b) {
  ke.call(this, b);
  this.Ke = a;
  this.kc = new he(this);
  this.Db = new O
}
A(pe, ke);
p = pe.prototype;
p.a = U("goog.ui.media.FlashObject");
p.zf = "window";
p.Yc = "#000000";
p.pe = "sameDomain";
function qe(a, b, c) {
  a.Vc = v(b) ? b : Math.round(b) + "px";
  a.qc = v(c) ? c : Math.round(c) + "px";
  a.Ba() && (b = a.Ba() ? a.Ba().firstChild : k, c = a.Vc, a = a.qc, a == i && f(Error("missing height argument")), b.style.width = ad(c), b.style.height = ad(a))
}
p.zb = function() {
  pe.n.zb.call(this);
  var a = this.Ba(), b;
  b = D ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = D ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = qa(c, this.zf), d = this.Db.T(), g = this.Db.C(), e = [], h = 0;h < d.length;h++) {
    e.push(encodeURIComponent(String(d[h])) + "=" + encodeURIComponent(String(g[h])))
  }
  b = qa(b, me(this), me(this), "goog-ui-media-flash-object", C(this.Ke), C(e.join("&")), this.Yc, this.pe, c);
  a.innerHTML = b;
  this.Vc && this.qc && qe(this, this.Vc, this.qc);
  a = this.kc;
  b = this.Ba();
  c = $a(qb);
  fa(c) || (ie[0] = c, c = ie);
  for(d = 0;d < c.length;d++) {
    g = yb(b, c[d], tb || a, m, a.Oe || a), a.g.push(g)
  }
};
p.ab = function() {
  this.$d != k && !(0 <= ya(ge, this.$d)) && (this.a.q("Required flash version not found:" + this.$d), f(Error("Method not supported")));
  var a = this.rd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.h = a
};
p.d = function() {
  pe.n.d.call(this);
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
  se.n.d.call(this);
  var a = this.va;
  delete this.va;
  if(this.Fa) {
    try {
      var b = a.CallFunction(Xd("__FC_close", this.U));
      this.a.info("disposeInternal: __FC_close ret: " + b)
    }catch(c) {
      this.a.H("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + c.message), this.yb = j
    }
  }
  if(this.yb) {
    a = this.pa, a.a.q("oncrash"), we(a.w, j)
  }else {
    this.pa.onclose()
  }
  delete this.pa;
  delete this.Xb.Oa[this.U]
};
function xe(a, b) {
  this.o = a;
  this.va = b;
  this.Oa = {};
  this.cc = "__FST_" + ac();
  s[this.cc] = x(this.Fe, this);
  var c = b.CallFunction(Xd("__FC_setCallbackFunc", this.cc));
  '"OK"' != c && f(Error("__FC_setCallbackFunc failed? ret: " + c))
}
A(xe, I);
p = xe.prototype;
p.a = U("cw.net.FlashSocketTracker");
p.v = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  M(this.Oa, a, b);
  a.push(">")
};
p.gc = function(a) {
  a = new se(this, a);
  return this.Oa[a.U] = a
};
p.De = function(a, b, c, d) {
  var g = this.Oa[a];
  g ? "frames" == b && d ? (te(g, "ioerror", "FlashConnector hadError while handling data."), g.b()) : te(g, b, c) : this.a.q("Cannot dispatch because we have no instance: " + N([a, b, c, d]))
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
  xe.n.d.call(this);
  for(var a = $a(this.Oa);a.length;) {
    a.pop().b()
  }
  delete this.Oa;
  delete this.va;
  s[this.cc] = i
};
function ye(a) {
  this.w = a;
  this.$a = []
}
A(ye, I);
p = ye.prototype;
p.a = U("cw.net.FlashSocketConduit");
p.sb = function(a) {
  this.$a ? (this.a.s("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.$a.push.apply(this.$a, a)) : (this.a.s("writeFrames: Writing " + a.length + " frame(s)."), this.Ub.sb(a))
};
p.dc = function(a, b) {
  this.Ub.dc(a, b)
};
p.onconnect = function() {
  this.a.info("onconnect");
  ue(this.w);
  var a = this.$a;
  this.$a = k;
  a.length && (this.a.s("onconnect: Writing " + a.length + " buffered frame(s)."), this.Ub.sb(a))
};
p.onclose = function() {
  this.a.info("onclose");
  we(this.w, m)
};
p.d = function() {
  this.a.info("in disposeInternal.");
  ye.n.d.call(this);
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
  return[a.fa, a.Ud, a.yd, a.Zd, a.pb, a.Nc, a.Nd, a.Ld, a.xc, a.Jd, a.ke, a.he, a.sa, a.Jb]
}
De.prototype.J = Y;
De.prototype.O = function(a) {
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
  this.xe = a
}
A(He, P);
He.prototype.J = Y;
He.prototype.O = function(a) {
  a.push(this.xe, "^")
};
function Ie(a) {
  P.call(this, "SeqNumFrame", [a]);
  this.ee = a
}
A(Ie, P);
Ie.prototype.J = Y;
Ie.prototype.O = function(a) {
  a.push(String(this.ee), "N")
};
function Le(a) {
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
  a.push(b.Ha.join(","), "|", String(b.La));
  a.push("A")
};
function Me(a) {
  P.call(this, "StreamStatusFrame", [a]);
  this.Fd = a
}
A(Me, P);
Me.prototype.J = Y;
Me.prototype.O = function(a) {
  var b = this.Fd;
  a.push(b.Ha.join(","), "|", String(b.La));
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
  this.Xd = a;
  this.Xc = b
}
A(Pe, P);
Pe.prototype.J = Y;
Pe.prototype.O = function(a) {
  a.push(this.Xd, "|", String(Number(this.Xc)), "!")
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
    return a = Le(bc(a)), a == k && f(new X("bad sack")), new Fe(a)
  }
  if("N" == b) {
    return a = ec(bc(a)), a == k && f(new X("bad seqNum")), new Ie(a)
  }
  if("T" == b) {
    return a = Le(bc(a)), a == k && f(new X("bad lastSackSeen")), new Me(a)
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
  this.Le = d
}
Te.prototype.v = function(a, b) {
  a.push("<XDRFrame frameId=");
  M(this.Le, a, b);
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
      var h = String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      e = RegExp("^" + h + "$").test(e)
    }
    if(e) {
      return c.a.info("Giving " + N(b) + " existing frame " + N(g)), Pb(g)
    }
  }
  d = ac() + ac();
  g = a.replace(/%random%/g, function() {
    return"ml" + String(Math.floor(Pc())) + String(Math.floor(Pc()))
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
  h ? Ad(g, e.ka) : h = e.Ta != k;
  n = e.na;
  if(h) {
    Bd(g, e.Ta)
  }else {
    if(h = !!e.na) {
      if("/" != n.charAt(0) && (l.ka && !l.na ? n = "/" + n : (l = g.na.lastIndexOf("/"), -1 != l && (n = g.na.substr(0, l + 1) + n))), ".." == n || "." == n) {
        n = ""
      }else {
        if(!(-1 == n.indexOf("./") && -1 == n.indexOf("/."))) {
          for(var l = 0 == n.lastIndexOf("/", 0), n = n.split("/"), r = [], z = 0;z < n.length;) {
            var q = n[z++];
            "." == q ? l && z == n.length && r.push("") : ".." == q ? ((1 < r.length || 1 == r.length && "" != r[0]) && r.pop(), l && z == n.length && r.push("")) : (r.push(q), l = j)
          }
          n = r.join("/")
        }
      }
    }
  }
  h ? Cd(g, n) : h = "" !== e.Q.toString();
  h ? Dd(g, e.Q.toString() ? decodeURIComponent(e.Q.toString()) : "") : h = !!e.Aa;
  h && (e = e.Aa, W(g), g.Aa = e);
  g = g.toString();
  e = String(s.location).match(vd)[3] || k;
  h = g.match(vd)[3] || k;
  e == h ? (c.a.info("No need to make a real XDRFrame for " + N(b)), c = Pb(new Te(s, g, [b], k))) : ((e = R("minerva-elements")) || f(Error('makeWindowForUrl_: Page is missing an empty div with id "minerva-elements"; please add one.')), h = new L, c.vc.set(d, [h, g, b]), c.a.info("Creating new XDRFrame " + N(d) + "for " + N(b)), c = Xc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:g + "xdrframe/?domain=" + document.domain + "&id=" + 
  d}), e.appendChild(c), c = h);
  return c
}
Ue.prototype.Bf = function(a) {
  var b = this.vc.get(a);
  b || f(Error("Unknown frameId " + N(a)));
  this.vc.remove(b);
  var c = b[0], a = new Te(R("minerva-xdrframe-" + a).contentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (R("minerva-xdrframe-" + a).contentDocument || R("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  c.N(a)
};
var We = new Ue;
s.__XHRTracker_xdrFrameLoaded = x(We.Bf, We);
var Xe;
Xe = m;
var Ye = Ga();
Ye && (-1 != Ye.indexOf("Firefox") || -1 != Ye.indexOf("Camino") || -1 != Ye.indexOf("iPhone") || -1 != Ye.indexOf("iPod") || -1 != Ye.indexOf("iPad") || -1 != Ye.indexOf("Android") || -1 != Ye.indexOf("Chrome") && (Xe = j));
var Ze = Xe;
function $e(a, b, c, d, g, e) {
  L.call(this, g, e);
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
A($e, L);
$e.prototype.Pd = 0;
$e.prototype.vd = function(a, b, c) {
  this.Pd++;
  this.hc[a] = [b, c];
  this.$ || (this.od && b ? this.N([a, c]) : this.Je && !b ? this.P(c) : this.Pd == this.Id.length && this.N(this.hc));
  this.ze && !b && (c = k);
  return c
};
$e.prototype.P = function(a) {
  $e.n.P.call(this, a);
  gb(this.Id, function(a) {
    a.cancel()
  })
};
function af(a, b) {
  this.Af = a;
  this.Kd = b
}
af.prototype.tc = 0;
af.prototype.Mb = 0;
af.prototype.nc = m;
function bf(a) {
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
  cf.n.d.call(this);
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
    b = mb(b)
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
  ff.n.d.call(this);
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
  this.tf = c
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
  this.Td = b;
  this.ua = c;
  this.ce = d;
  (!(0 == this.V.indexOf("http://") || 0 == this.V.indexOf("https://")) || !(0 == this.ua.indexOf("http://") || 0 == this.ua.indexOf("https://"))) && f(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Td.location.href;
  xd(this.V, a) || f(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.ce.location.href;
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
  this.Ua = a;
  this.wf = b;
  this.qf = c
}
p = of.prototype;
p.a = U("cw.net.QANProtocolWrapper");
p.jb = function(a, b) {
  this.a.q(a, b);
  this.qf && nf(b)
};
p.da = function(a) {
  this.Xa.de(Cc(a), this.wf)
};
p.Cb = function(a) {
  this.Xa.reset("QANHelper said: " + a)
};
p.of = function(a) {
  this.Xa = a;
  this.Ec = new Q(x(this.Ua.bodyReceived, this.Ua), x(this.jb, this), x(this.da, this), x(this.Cb, this));
  this.Ua.streamStarted.call(this.Ua, this.Xa, this.Ec)
};
p.nf = function(a, b) {
  this.Ec.nd("Stream reset applicationLevel=" + N(b) + ", reason: " + a);
  this.Ua.streamReset.call(this.Ua, a, b)
};
p.pf = function(a) {
  try {
    var b = Fc(a)
  }catch(c) {
    c instanceof Dc || f(c);
    this.Xa.reset("Bad QAN frame.  Did peer send a non-QAN string?");
    return
  }
  this.Ec.wd(b)
};
function pf(a) {
  this.Xa = a
}
pf.prototype.v = function(a, b) {
  a.push("<UserContext for ");
  M(this.Xa, a, b);
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
  this.ue = x(this.uf, this);
  F && (this.rb = Ab(s, "load", this.ef, m, this))
}
A($, I);
p = $.prototype;
p.a = U("cw.net.ClientStream");
p.Gd = new Qd(-1, []);
p.Hd = new Qd(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = k;
p.onstarted = k;
p.Cc = k;
p.Dc = k;
p.onreset = k;
p.ondisconnect = k;
p.Wa = k;
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
  M(this.pb, a, b);
  a.push(", state=", String(this.B));
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
function rf(a) {
  var b = [-1];
  a.e && b.push(a.e.Sa);
  a.p && b.push(a.p.Sa);
  return Math.max.apply(Math.max, b)
}
function sf(a) {
  if(!("3_STARTED" > a.B)) {
    tf(a);
    var b = 0 != a.W.G.A(), c = Ud(a.sc), d = !c.K(a.Hd) && !(a.e && c.K(a.e.Qa) || a.p && c.K(a.p.Qa)), g = rf(a);
    if((b = b && g < a.W.ya) || d) {
      var e = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      a.e.xa ? (a.a.s("tryToSend_: writing " + e + " to primary"), d && (d = a.e, c != d.Qa && (!d.ea && !d.u.length && uf(d), d.u.push(new Fe(c)), d.Qa = c)), b && vf(a.e, a.W, g + 1), a.e.aa()) : a.p == k ? a.Lc ? (a.a.s("tryToSend_: creating secondary to send " + e), a.p = wf(a, m, j), a.p && (b && vf(a.p, a.W, g + 1), a.p.aa())) : (a.a.s("tryToSend_: not creating a secondary because stream might not exist on server"), a.Gc = j) : a.a.s("tryToSend_: need to send " + e + ", but can't right now")
    }
  }
}
function tf(a) {
  a.Wa != k && (a.o.z.clearTimeout(a.Wa), a.Wa = k)
}
p.uf = function() {
  this.Wa = k;
  sf(this)
};
function xf(a) {
  a.Wa == k && (a.Wa = a.o.z.setTimeout(a.ue, 6))
}
p.ef = function() {
  this.rb = k;
  if(this.e && this.e.Pa()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.e;
    a.$b = j;
    a.b()
  }
  this.p && this.p.Pa() && (this.a.info("restartHttpRequests_: aborting secondary"), a = this.p, a.$b = j, a.b())
};
p.de = function(a, b) {
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
  var c = "4_RESETTING" == a.B && b.le;
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
      if(d = b.cd(), b == a.e ? d ? e = ++a.Sd : c || (e = a.Sd = 0) : d ? e = ++a.be : c || (e = a.be = 0), c || !e) {
        d = c = 0, a.a.s("getDelayForNextTransport_: " + N({count:e, delay:c, times:d}))
      }else {
        var h = 2E3 * Math.min(e, 3), l = Math.floor(4E3 * Math.random()) - 2E3, n = Math.max(0, b.je - b.Sc), d = (c = Math.max(0, h + l - n)) ? 1 : 0;
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
      return ib(a, function(a) {
        return a[1]
      })
    });
    a.Ma(x(this.He, this));
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
          d || (d = Xc("div", {id:"minerva-elements-FlashConnectorSwf"}), c.appendChild(d));
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
              var r = new L(l);
              s.__loadFlashObject_callbacks[h] = function() {
                g.setTimeout(function() {
                  l();
                  r.N(R(n))
                }, 0)
              };
              b.Db.set("onloadcallback", '__loadFlashObject_callbacks["' + h + '"]()');
              n = me(b);
              b.Da && f(Error("Component already rendered"));
              b.h || b.ab();
              a ? a.insertBefore(b.h, k) : b.ic.za.body.appendChild(b.h);
              (!b.t || b.t.Da) && b.zb();
              e = r
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
        var q = this;
        a.Ma(function(a) {
          uc || (uc = new xe(q.o, a));
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
p.He = function(a) {
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
    lb(this.Yb[a].Oc, this)
  }
  F && this.rb && (Cb(this.rb), this.rb = k);
  this.ondisconnect && this.ondisconnect.call(this.Ja);
  delete this.qb;
  delete this.e;
  delete this.p;
  delete this.lb;
  delete this.Ja;
  $.n.d.call(this)
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
  this.xa = !this.Pa();
  this.ra = this.X != df;
  this.te = x(this.rf, this)
}
A(zf, I);
p = zf.prototype;
p.a = U("cw.net.ClientTransport");
p.i = k;
p.Sc = k;
p.je = k;
p.Rb = k;
p.ea = m;
p.Vb = m;
p.Qa = k;
p.Eb = 0;
p.Sa = -1;
p.Ob = -1;
p.le = m;
p.$b = m;
p.oa = 0;
p.eb = m;
p.v = function(a) {
  a.push("<ClientTransport #", String(this.fa), ", becomePrimary=", String(this.ha), ">")
};
p.k = function() {
  return(this.ha ? "Prim. T#" : "Sec. T#") + this.fa
};
p.cd = function() {
  return!(!this.eb && this.Eb)
};
p.Pa = function() {
  return this.X == df || 2 == this.X
};
function Hf(a, b) {
  H.sort.call(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  } || pb);
  a: {
    var c = a.D, d = !a.ra, g, e = c.sc;
    g = c.maxUndeliveredStrings;
    for(var h = c.maxUndeliveredBytes, l = [], n = m, r = 0, z = b.length;r < z;r++) {
      var q = b[r], w = q[0], q = q[1];
      if(w == e.Ea + 1) {
        e.Ea += 1;
        for(l.push(q);;) {
          w = e.Ea + 1;
          q = e.wa.get(w, Vd);
          if(q === Vd) {
            break
          }
          l.push(q[0]);
          e.wa.remove(w);
          e.I -= q[1];
          e.Ea = w
        }
      }else {
        if(!(w <= e.Ea)) {
          if(g != k && e.wa.A() >= g) {
            n = j;
            break
          }
          var E = Pd(q);
          if(h != k && e.I + E > h) {
            n = j;
            break
          }
          e.wa.set(w, [q, E]);
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
    1 == a.Eb && !d.K(lf) && a.Pa() ? (a.a.q(a.k() + " is closing soon because got bad preamble: " + N(d)), g = j) : g = m;
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
        e.Gd = h;
        var l = e.W, n = h.La, c = m;
        n > l.ya && (c = j);
        for(var r = Sd(l).concat(), d = 0;d < r.length;d++) {
          var z = r[d];
          if(z > n) {
            break
          }
          var q = l.G.get(z)[1];
          l.G.remove(z);
          l.I -= q
        }
        for(d = 0;d < h.Ha.length;d++) {
          var w = h.Ha[d];
          w > l.ya && (c = j);
          l.G.Z(w) && (q = l.G.get(w)[1], l.G.remove(w), l.I -= q)
        }
        l.G.fb() && l.G.clear();
        if(c) {
          return a.a.q(a.k() + " is closing soon because got bad SackFrame"), a.eb = j
        }
      }else {
        if(d instanceof Ie) {
          a.Ob = d.ee - 1
        }else {
          if(d instanceof Me) {
            a.D.Hd = d.Fd
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
                  var Je = a.D;
                  Ef(Je, d.Xd, d.Xc);
                  Je.b();
                  return j
                }
                f(Error(a.k() + " had unexpected state in framesReceived_."))
              }
            }
          }
        }
      }
    }
  }catch(Ke) {
    return Ke instanceof X || f(Ke), a.a.q(a.k() + " is closing soon because got InvalidFrame: " + N(b)), a.eb = j
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
p.rf = function() {
  this.a.q(this.k() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function Jf(a) {
  a.Rb != k && (a.o.z.clearTimeout(a.Rb), a.Rb = k)
}
function ef(a, b) {
  Jf(a);
  b = Math.round(b);
  a.Rb = a.o.z.setTimeout(a.te, b);
  a.a.j(a.k() + "'s receive timeout set to " + b + " ms.")
}
function ue(a) {
  a.X != df && (a.X == yf || 2 == a.X ? ef(a, 13500) : f(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.X)))
}
function uf(a) {
  var b = new De;
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
  b.sa = Ud(a.D.sc);
  b.Jb = a.D.Gd;
  a.u.push(b);
  a.Qa = b.sa
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
    if(this.Pa()) {
      for(var a = [], b = 0, c = this.u.length;b < c;b++) {
        this.u[b].O(a), a.push("\n")
      }
      this.u = [];
      a = a.join("");
      b = this.ha ? this.r.V : this.r.ua;
      this.i = Z.gc(this, this.ha ? this.r.Td : this.r.ce);
      this.Sc = this.o.z === Ib ? pa() : this.o.z.getTime();
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
        this.i ? this.i.sb(a) : (b = this.r, this.i = new ye(this), c = b.tf.gc(this.i), this.i.Ub = c, this.Sc = this.o.z === Ib ? pa() : this.o.z.getTime(), this.i.dc(b.host, b.port), this.i.ja || (this.i.sb(a), this.i.ja || ef(this, 8E3)))
      }else {
        f(Error("flush_: Don't know what to do for this transportType: " + this.X))
      }
    }
  }
};
function vf(a, b, c) {
  !a.ea && !a.u.length && uf(a);
  for(var d = Math.max(c, a.Sa + 1), g = Sd(b), c = [], e = 0;e < g.length;e++) {
    var h = g[e];
    (d == k || h >= d) && c.push([h, b.G.get(h)[0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    e = c[b], g = e[0], e = e[1], (-1 == a.Sa || a.Sa + 1 != g) && a.u.push(new Ie(g)), a.u.push(new Ge(e)), a.Sa = g
  }
}
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  zf.n.d.call(this);
  this.je = this.o.z === Ib ? pa() : this.o.z.getTime();
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
  a.le = j
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
p.Qa = k;
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
  a.push("<DoNothingTransport delay=", String(this.jd), ">")
};
p.Pa = ba(m);
p.k = ba("Wast. T");
p.cd = ba(m);
p.d = function() {
  this.a.info(this.k() + " in disposeInternal.");
  Cf.n.d.call(this);
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
Mf = new Nf;
function Rf(a) {
  this.headers = new O;
  this.Za = a || k
}
A(Rf, Hb);
Rf.prototype.a = U("goog.net.XhrIo");
var Sf = /^https?$/i;
p = Rf.prototype;
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
  this.f = this.Za ? Of(this.Za) : Of(Mf);
  this.Zb = this.Za ? this.Za.vb || (this.Za.vb = Qf(this.Za)) : Mf.vb || (Mf.vb = Qf(Mf));
  this.f.onreadystatechange = x(this.Rd, this);
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
  this.ae && (this.f.responseType = this.ae);
  "withCredentials" in this.f && (this.f.withCredentials = this.yf);
  try {
    this.Ia && (Ib.clearTimeout(this.Ia), this.Ia = k), 0 < this.Wb && (this.a.j(Tf(this, "Will abort after " + this.Wb + "ms if incomplete")), this.Ia = Ib.setTimeout(x(this.sf, this), this.Wb)), this.a.j(Tf(this, "Sending request")), this.Hb = j, this.f.send(a), this.Hb = m
  }catch(h) {
    this.a.j(Tf(this, "Send error: " + h.message)), Uf(this, h)
  }
};
p.sf = function() {
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
  Rf.n.d.call(this)
};
p.Rd = function() {
  !this.rc && !this.Hb && !this.Ca ? this.$e() : Xf(this)
};
p.$e = function() {
  Xf(this)
};
function Xf(a) {
  if(a.ga && "undefined" != typeof ca) {
    if(a.Zb[1] && 4 == a.la() && 2 == Yf(a)) {
      a.a.j(Tf(a, "Local request error detected and ignored"))
    }else {
      if(a.Hb && 4 == a.la()) {
        Ib.setTimeout(x(a.Rd, a), 0)
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
                var e = String(a.uc).match(vd)[1] || k;
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
    a.Ia && (Ib.clearTimeout(a.Ia), a.Ia = k);
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
  return b + " [" + a.Ed + " " + a.uc + " " + Yf(a) + "]"
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
p.ud = m;
p.xd = "Content-Length Server Date Expires Keep-Alive Content-Type Transfer-Encoding Cache-Control".split(" ");
function ag(a) {
  var b = bf(a.gd), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.R, c, b), 1 != b && a.b()) : a.b()
}
p.Qe = function() {
  ag(this);
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
      for(var b = new O, c = this.xd.length;c--;) {
        var d = this.xd[c];
        try {
          b.set(d, this.i.f.getResponseHeader(d))
        }catch(g) {
        }
      }
      if(b.A() && (this.ud = j, a.__XHRMaster_ongotheaders(this.R, pc(b)), this.ja)) {
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
  yb(this.i, "readystatechange", x(this.cf, this));
  yb(this.i, "complete", x(this.Qe, this));
  this.i.send(a + "io/", b, c, {"Content-Type":"application/octet-stream"});
  this.gd = new af(this.i.f, 1048576)
};
p.d = function() {
  $f.n.d.call(this);
  delete this.gd;
  this.i && this.i.b();
  delete this.Xb.ob[this.R];
  delete this.Xb
};
function bg() {
  this.ob = {}
}
A(bg, I);
bg.prototype.Ve = function(a, b, c, d) {
  var g = new $f(this, a);
  this.ob[a] = g;
  g.wc(b, c, d)
};
bg.prototype.Ee = function(a) {
  (a = this.ob[a]) && a.b()
};
bg.prototype.d = function() {
  bg.n.d.call(this);
  for(var a = $a(this.ob);a.length;) {
    a.pop().b()
  }
  delete this.ob
};
var cg = new bg;
s.__XHRSlave_makeRequest = x(cg.Ve, cg);
s.__XHRSlave_dispose = x(cg.Ee, cg);
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
Q.prototype.handleQANFrame = Q.prototype.wd;
Q.prototype.ask = Q.prototype.qe;
Q.prototype.notify = Q.prototype.Ze;
Q.prototype.failAll = Q.prototype.nd;
y("Minerva.QANProtocolWrapper", of);
of.prototype.streamStarted = of.prototype.of;
of.prototype.streamReset = of.prototype.nf;
of.prototype.stringReceived = of.prototype.pf;
y("Minerva.Deferred", L);
L.prototype.cancel = L.prototype.cancel;
L.prototype.callback = L.prototype.N;
L.prototype.errback = L.prototype.P;
L.prototype.addErrback = L.prototype.tb;
L.prototype.addCallback = L.prototype.Ma;
L.prototype.addCallbacks = L.prototype.Y;
L.prototype.chainDeferred = L.prototype.bd;
L.prototype.awaitDeferred = L.prototype.re;
L.prototype.branch = L.prototype.$c;
L.prototype.addBoth = L.prototype.Wc;
L.prototype.hasFired = L.prototype.Pe;
y("Minerva.Deferred.succeed", Pb);
y("Minerva.Deferred.fail", Qb);
y("Minerva.Deferred.cancelled", function() {
  var a = new L;
  a.cancel();
  return a
});
y("Minerva.Deferred.AlreadyCalledError", Nb);
y("Minerva.Deferred.CancelledError", Jb);
y("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Ne;
$.prototype.bindToProtocol = $.prototype.se;
$.prototype.start = $.prototype.start;
$.prototype.sendString = $.prototype.de;
$.prototype.reset = $.prototype.reset;
$.prototype.dispose = $.prototype.b;
y("Minerva.Logger", S);
S.Level = T;
S.getLogger = U;
S.prototype.setLevel = S.prototype.Ic;
S.prototype.shout = S.prototype.jf;
S.prototype.severe = S.prototype.H;
S.prototype.warning = S.prototype.q;
S.prototype.info = S.prototype.info;
S.prototype.config = S.prototype.ye;
S.prototype.fine = S.prototype.j;
S.prototype.finer = S.prototype.Ie;
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
ud.prototype.setCapturing = ud.prototype.hf;
y("Minerva.JSON", {});
y("Minerva.JSON.parse", function(a) {
  a = String(a);
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
