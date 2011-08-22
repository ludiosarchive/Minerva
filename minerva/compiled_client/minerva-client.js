(function(){function g(a) {
  throw a;
}
var i = void 0, l = null;
function aa(a) {
  return function(b) {
    this[a] = b
  }
}
function m(a) {
  return function() {
    return this[a]
  }
}
function ba(a) {
  return function() {
    return a
  }
}
var p, ca = ca || {}, q = this;
function da(a) {
  for(var a = a.split("."), b = q, c;c = a.shift();) {
    if(b[c] != l) {
      b = b[c]
    }else {
      return l
    }
  }
  return b
}
function ea() {
}
function r(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }else {
        if(a instanceof Object) {
          return b
        }
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
}
function s(a) {
  return r(a) == "array"
}
function t(a) {
  var b = r(a);
  return b == "array" || b == "object" && typeof a.length == "number"
}
function fa(a) {
  return ga(a) && typeof a.getFullYear == "function"
}
function u(a) {
  return typeof a == "string"
}
function ha(a) {
  return r(a) == "function"
}
function ga(a) {
  a = r(a);
  return a == "object" || a == "array" || a == "function"
}
function v(a) {
  return a[ia] || (a[ia] = ++ja)
}
var ia = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36), ja = 0;
function ka(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function la(a, b, c) {
  a || g(Error());
  if(arguments.length > 2) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }else {
    return function() {
      return a.apply(b, arguments)
    }
  }
}
function x(a, b, c) {
  x = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? ka : la;
  return x.apply(l, arguments)
}
var ma = Date.now || function() {
  return+new Date
};
function y(a, b) {
  var c = a.split("."), d = q;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && b !== i ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
function B(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.k = b.prototype;
  a.prototype = new c
}
;function C(a) {
  this.stack = Error().stack || "";
  if(a) {
    this.message = String(a)
  }
}
B(C, Error);
C.prototype.name = "CustomError";
function na(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
var oa = /^[a-zA-Z0-9\-_.!~*'()]*$/;
function pa(a) {
  a = String(a);
  return!oa.test(a) ? encodeURIComponent(a) : a
}
function qa(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
}
function D(a) {
  if(!ra.test(a)) {
    return a
  }
  a.indexOf("&") != -1 && (a = a.replace(sa, "&amp;"));
  a.indexOf("<") != -1 && (a = a.replace(ta, "&lt;"));
  a.indexOf(">") != -1 && (a = a.replace(ua, "&gt;"));
  a.indexOf('"') != -1 && (a = a.replace(va, "&quot;"));
  return a
}
var sa = /&/g, ta = /</g, ua = />/g, va = /\"/g, ra = /[&<>\"]/;
function wa(a) {
  return qa(a.replace(/  /g, " &#160;"), i)
}
function xa(a, b) {
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;c == 0 && h < f;h++) {
    var j = d[h] || "", k = e[h] || "", n = RegExp("(\\d*)(\\D*)", "g"), z = RegExp("(\\d*)(\\D*)", "g");
    do {
      var o = n.exec(j) || ["", "", ""], w = z.exec(k) || ["", "", ""];
      if(o[0].length == 0 && w[0].length == 0) {
        break
      }
      c = ya(o[1].length == 0 ? 0 : parseInt(o[1], 10), w[1].length == 0 ? 0 : parseInt(w[1], 10)) || ya(o[2].length == 0, w[2].length == 0) || ya(o[2], w[2])
    }while(c == 0)
  }
  return c
}
function ya(a, b) {
  if(a < b) {
    return-1
  }else {
    if(a > b) {
      return 1
    }
  }
  return 0
}
;function za(a, b) {
  b.unshift(a);
  C.call(this, na.apply(l, b));
  b.shift();
  this.cg = a
}
B(za, C);
za.prototype.name = "AssertionError";
function Aa(a, b) {
  g(new za("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;function Ba() {
  return!0
}
;var Ca, Da, Ea, Fa;
function Ga() {
  return q.navigator ? q.navigator.userAgent : l
}
Fa = Ea = Da = Ca = !1;
var Ha;
if(Ha = Ga()) {
  var Ia = q.navigator;
  Ca = Ha.indexOf("Opera") == 0;
  Da = !Ca && Ha.indexOf("MSIE") != -1;
  Ea = !Ca && Ha.indexOf("WebKit") != -1;
  Fa = !Ca && !Ea && Ia.product == "Gecko"
}
var E = Da, Ja = Fa, F = Ea, Ka = q.navigator, La = (Ka && Ka.platform || "").indexOf("Mac") != -1, Ma;
a: {
  var Na = "", Oa;
  if(Ca && q.opera) {
    var Pa = q.opera.version, Na = typeof Pa == "function" ? Pa() : Pa
  }else {
    if(Ja ? Oa = /rv\:([^\);]+)(\)|;)/ : E ? Oa = /MSIE\s+([^\);]+)(\)|;)/ : F && (Oa = /WebKit\/(\S+)/), Oa) {
      var Qa = Oa.exec(Ga()), Na = Qa ? Qa[1] : ""
    }
  }
  if(E) {
    var Ra, Sa = q.document;
    Ra = Sa ? Sa.documentMode : i;
    if(Ra > parseFloat(Na)) {
      Ma = String(Ra);
      break a
    }
  }
  Ma = Na
}
var Ta = {};
function Ua(a) {
  return Ta[a] || (Ta[a] = xa(Ma, a) >= 0)
}
var Va = {};
function Wa() {
  return Va[9] || (Va[9] = E && document.documentMode && document.documentMode >= 9)
}
;function Xa(a, b) {
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
var $a = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function ab(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < $a.length;f++) {
      c = $a[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;var G = Array.prototype, bb = G.indexOf ? function(a, b, c) {
  return G.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == l ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
  if(u(a)) {
    return!u(b) || b.length != 1 ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, cb = G.forEach ? function(a, b, c) {
  G.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = u(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
}, db = G.map ? function(a, b, c) {
  return G.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = u(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in f && (e[h] = b.call(c, f[h], h, a))
  }
  return e
}, eb = G.some ? function(a, b, c) {
  return G.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = u(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
}, fb = G.every ? function(a, b, c) {
  return G.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = u(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
function gb(a, b) {
  var c = bb(a, b);
  c >= 0 && G.splice.call(a, c, 1)
}
function hb(a) {
  return G.concat.apply(G, arguments)
}
function ib(a) {
  if(s(a)) {
    return hb(a)
  }else {
    for(var b = [], c = 0, d = a.length;c < d;c++) {
      b[c] = a[c]
    }
    return b
  }
}
function jb(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(s(d) || (e = t(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, h = d.length, j = 0;j < h;j++) {
          a[f + j] = d[j]
        }
      }else {
        a.push(d)
      }
    }
  }
}
function kb(a, b, c) {
  return arguments.length <= 2 ? G.slice.call(a, b) : G.slice.call(a, b, c)
}
function lb(a, b) {
  G.sort.call(a, b || mb)
}
function mb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var nb;
var ob = {ff:"click", lf:"dblclick", Ff:"mousedown", Jf:"mouseup", If:"mouseover", Hf:"mouseout", Gf:"mousemove", Tf:"selectstart", Af:"keypress", zf:"keydown", Bf:"keyup", df:"blur", tf:"focus", mf:"deactivate", uf:E ? "focusin" : "DOMFocusIn", vf:E ? "focusout" : "DOMFocusOut", ef:"change", Sf:"select", Uf:"submit", yf:"input", Of:"propertychange", qf:"dragstart", nf:"dragenter", pf:"dragover", of:"dragleave", rf:"drop", Yf:"touchstart", Xf:"touchmove", Wf:"touchend", Vf:"touchcancel", hf:"contextmenu", 
sf:"error", xf:"help", Cf:"load", Df:"losecapture", Pf:"readystatechange", Qf:"resize", Rf:"scroll", Zf:"unload", wf:"hashchange", Kf:"pagehide", Lf:"pageshow", Nf:"popstate", jf:"copy", Mf:"paste", kf:"cut", af:"beforecopy", bf:"beforecut", cf:"beforepaste", Ef:"message", gf:"connect"};
!E || Wa();
E && Ua("8");
function H() {
}
H.prototype.Y = !1;
H.prototype.b = function() {
  if(!this.Y) {
    this.Y = !0, this.c()
  }
};
H.prototype.c = function() {
  this.he && pb.apply(l, this.he)
};
function pb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    t(d) ? pb.apply(l, d) : d && typeof d.b == "function" && d.b()
  }
}
;function I(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
B(I, H);
I.prototype.c = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
I.prototype.ya = !1;
I.prototype.Pb = !0;
I.prototype.stopPropagation = function() {
  this.ya = !0
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
  a && this.Ib(a, b)
}
B(sb, I);
p = sb.prototype;
p.target = l;
p.relatedTarget = l;
p.offsetX = 0;
p.offsetY = 0;
p.clientX = 0;
p.clientY = 0;
p.screenX = 0;
p.screenY = 0;
p.button = 0;
p.keyCode = 0;
p.charCode = 0;
p.ctrlKey = !1;
p.altKey = !1;
p.shiftKey = !1;
p.metaKey = !1;
p.Fe = !1;
p.$a = l;
p.Ib = function(a, b) {
  var c = this.type = a.type;
  I.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ja) {
      var e;
      a: {
        try {
          rb(d.nodeName);
          e = !0;
          break a
        }catch(f) {
        }
        e = !1
      }
      e || (d = l)
    }
  }else {
    if(c == "mouseover") {
      d = a.fromElement
    }else {
      if(c == "mouseout") {
        d = a.toElement
      }
    }
  }
  this.relatedTarget = d;
  this.offsetX = a.offsetX !== i ? a.offsetX : a.layerX;
  this.offsetY = a.offsetY !== i ? a.offsetY : a.layerY;
  this.clientX = a.clientX !== i ? a.clientX : a.pageX;
  this.clientY = a.clientY !== i ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || (c == "keypress" ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.Fe = La ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.$a = a;
  delete this.Pb;
  delete this.ya
};
p.stopPropagation = function() {
  sb.k.stopPropagation.call(this);
  this.$a.stopPropagation ? this.$a.stopPropagation() : this.$a.cancelBubble = !0
};
p.c = function() {
  sb.k.c.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.$a = l
};
function tb() {
}
var ub = 0;
p = tb.prototype;
p.key = 0;
p.Oa = !1;
p.ac = !1;
p.Ib = function(a, b, c, d, e, f) {
  ha(a) ? this.pd = !0 : a && a.handleEvent && ha(a.handleEvent) ? this.pd = !1 : g(Error("Invalid listener argument"));
  this.ib = a;
  this.Gd = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.pc = f;
  this.ac = !1;
  this.key = ++ub;
  this.Oa = !1
};
p.handleEvent = function(a) {
  return this.pd ? this.ib.call(this.pc || this.src, a) : this.ib.handleEvent.call(this.ib, a)
};
var vb, wb = (vb = "ScriptEngine" in q && q.ScriptEngine() == "JScript") ? q.ScriptEngineMajorVersion() + "." + q.ScriptEngineMinorVersion() + "." + q.ScriptEngineBuildVersion() : "0";
function J(a, b) {
  this.ud = b;
  this.ta = [];
  a > this.ud && g(Error("[goog.structs.SimplePool] Initial cannot be greater than max"));
  for(var c = 0;c < a;c++) {
    this.ta.push(this.X ? this.X() : {})
  }
}
B(J, H);
J.prototype.X = l;
J.prototype.bd = l;
J.prototype.getObject = function() {
  return this.ta.length ? this.ta.pop() : this.X ? this.X() : {}
};
function xb(a, b) {
  a.ta.length < a.ud ? a.ta.push(b) : yb(a, b)
}
function yb(a, b) {
  if(a.bd) {
    a.bd(b)
  }else {
    if(ga(b)) {
      if(ha(b.b)) {
        b.b()
      }else {
        for(var c in b) {
          delete b[c]
        }
      }
    }
  }
}
J.prototype.c = function() {
  J.k.c.call(this);
  for(var a = this.ta;a.length;) {
    yb(this, a.pop())
  }
  delete this.ta
};
var zb, Ab, Bb, Cb, Db, Eb, Fb, Gb, Hb, Ib, Jb;
(function() {
  function a() {
    return{d:0, O:0}
  }
  function b() {
    return[]
  }
  function c() {
    function a(b) {
      b = h.call(a.src, a.key, b);
      if(!b) {
        return b
      }
    }
    return a
  }
  function d() {
    return new tb
  }
  function e() {
    return new sb
  }
  var f = vb && !(xa(wb, "5.7") >= 0), h;
  Eb = function(a) {
    h = a
  };
  if(f) {
    zb = function() {
      return j.getObject()
    };
    Ab = function(a) {
      xb(j, a)
    };
    Bb = function() {
      return k.getObject()
    };
    Cb = function(a) {
      xb(k, a)
    };
    Db = function() {
      return n.getObject()
    };
    Fb = function() {
      xb(n, c())
    };
    Gb = function() {
      return z.getObject()
    };
    Hb = function(a) {
      xb(z, a)
    };
    Ib = function() {
      return o.getObject()
    };
    Jb = function(a) {
      xb(o, a)
    };
    var j = new J(0, 600);
    j.X = a;
    var k = new J(0, 600);
    k.X = b;
    var n = new J(0, 600);
    n.X = c;
    var z = new J(0, 600);
    z.X = d;
    var o = new J(0, 600);
    o.X = e
  }else {
    zb = a, Ab = ea, Bb = b, Cb = ea, Db = c, Fb = ea, Gb = d, Hb = ea, Ib = e, Jb = ea
  }
})();
var Kb = {}, K = {}, L = {}, Lb = {};
function Mb(a, b, c, d, e) {
  if(b) {
    if(s(b)) {
      for(var f = 0;f < b.length;f++) {
        Mb(a, b[f], c, d, e)
      }
      return l
    }else {
      var d = !!d, h = K;
      b in h || (h[b] = zb());
      h = h[b];
      d in h || (h[d] = zb(), h.d++);
      var h = h[d], j = v(a), k;
      h.O++;
      if(h[j]) {
        k = h[j];
        for(f = 0;f < k.length;f++) {
          if(h = k[f], h.ib == c && h.pc == e) {
            if(h.Oa) {
              break
            }
            return k[f].key
          }
        }
      }else {
        k = h[j] = Bb(), h.d++
      }
      f = Db();
      f.src = a;
      h = Gb();
      h.Ib(c, f, a, b, d, e);
      c = h.key;
      f.key = c;
      k.push(h);
      Kb[c] = h;
      L[j] || (L[j] = Bb());
      L[j].push(h);
      a.addEventListener ? (a == q || !a.Yc) && a.addEventListener(b, f, d) : a.attachEvent(b in Lb ? Lb[b] : Lb[b] = "on" + b, f);
      return c
    }
  }else {
    g(Error("Invalid event type"))
  }
}
function Nb(a, b, c, d, e) {
  if(s(b)) {
    for(var f = 0;f < b.length;f++) {
      Nb(a, b[f], c, d, e)
    }
    return l
  }
  a = Mb(a, b, c, d, e);
  Kb[a].ac = !0;
  return a
}
function Ob(a, b, c, d, e) {
  if(s(b)) {
    for(var f = 0;f < b.length;f++) {
      Ob(a, b[f], c, d, e)
    }
  }else {
    d = !!d;
    a: {
      f = K;
      if(b in f && (f = f[b], d in f && (f = f[d], a = v(a), f[a]))) {
        a = f[a];
        break a
      }
      a = l
    }
    if(a) {
      for(f = 0;f < a.length;f++) {
        if(a[f].ib == c && a[f].capture == d && a[f].pc == e) {
          Pb(a[f].key);
          break
        }
      }
    }
  }
}
function Pb(a) {
  if(!Kb[a]) {
    return!1
  }
  var b = Kb[a];
  if(b.Oa) {
    return!1
  }
  var c = b.src, d = b.type, e = b.Gd, f = b.capture;
  c.removeEventListener ? (c == q || !c.Yc) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in Lb ? Lb[d] : Lb[d] = "on" + d, e);
  c = v(c);
  e = K[d][f][c];
  if(L[c]) {
    var h = L[c];
    gb(h, b);
    h.length == 0 && delete L[c]
  }
  b.Oa = !0;
  e.Ad = !0;
  Qb(d, f, c, e);
  delete Kb[a];
  return!0
}
function Qb(a, b, c, d) {
  if(!d.Kb && d.Ad) {
    for(var e = 0, f = 0;e < d.length;e++) {
      if(d[e].Oa) {
        var h = d[e].Gd;
        h.src = l;
        Fb(h);
        Hb(d[e])
      }else {
        e != f && (d[f] = d[e]), f++
      }
    }
    d.length = f;
    d.Ad = !1;
    f == 0 && (Cb(d), delete K[a][b][c], K[a][b].d--, K[a][b].d == 0 && (Ab(K[a][b]), delete K[a][b], K[a].d--), K[a].d == 0 && (Ab(K[a]), delete K[a]))
  }
}
function Rb(a) {
  var b, c = 0, d = b == l;
  b = !!b;
  if(a == l) {
    Xa(L, function(a) {
      for(var e = a.length - 1;e >= 0;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Pb(f.key), c++
        }
      }
    })
  }else {
    if(a = v(a), L[a]) {
      for(var a = L[a], e = a.length - 1;e >= 0;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Pb(f.key), c++
        }
      }
    }
  }
}
function Sb(a, b, c, d, e) {
  var f = 1, b = v(b);
  if(a[b]) {
    a.O--;
    a = a[b];
    a.Kb ? a.Kb++ : a.Kb = 1;
    try {
      for(var h = a.length, j = 0;j < h;j++) {
        var k = a[j];
        k && !k.Oa && (f &= Tb(k, e) !== !1)
      }
    }finally {
      a.Kb--, Qb(c, d, b, a)
    }
  }
  return Boolean(f)
}
function Tb(a, b) {
  var c = a.handleEvent(b);
  a.ac && Pb(a.key);
  return c
}
Eb(function(a, b) {
  if(!Kb[a]) {
    return!0
  }
  var c = Kb[a], d = c.type, e = K;
  if(!(d in e)) {
    return!0
  }
  var e = e[d], f, h;
  nb === i && (nb = E && !q.addEventListener);
  if(nb) {
    f = b || da("window.event");
    var j = !0 in e, k = !1 in e;
    if(j) {
      if(f.keyCode < 0 || f.returnValue != i) {
        return!0
      }
      a: {
        var n = !1;
        if(f.keyCode == 0) {
          try {
            f.keyCode = -1;
            break a
          }catch(z) {
            n = !0
          }
        }
        if(n || f.returnValue == i) {
          f.returnValue = !0
        }
      }
    }
    n = Ib();
    n.Ib(f, this);
    f = !0;
    try {
      if(j) {
        for(var o = Bb(), w = n.currentTarget;w;w = w.parentNode) {
          o.push(w)
        }
        h = e[!0];
        h.O = h.d;
        for(var A = o.length - 1;!n.ya && A >= 0 && h.O;A--) {
          n.currentTarget = o[A], f &= Sb(h, o[A], d, !0, n)
        }
        if(k) {
          h = e[!1];
          h.O = h.d;
          for(A = 0;!n.ya && A < o.length && h.O;A++) {
            n.currentTarget = o[A], f &= Sb(h, o[A], d, !1, n)
          }
        }
      }else {
        f = Tb(c, n)
      }
    }finally {
      if(o) {
        o.length = 0, Cb(o)
      }
      n.b();
      Jb(n)
    }
    return f
  }
  d = new sb(b, this);
  try {
    f = Tb(c, d)
  }finally {
    d.b()
  }
  return f
});
var Vb = 0;
function Wb() {
}
B(Wb, H);
p = Wb.prototype;
p.Yc = !0;
p.Nb = l;
p.Gc = aa("Nb");
p.addEventListener = function(a, b, c, d) {
  Mb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  Ob(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
  var b = a.type || a, c = K;
  if(b in c) {
    if(u(a)) {
      a = new I(a, this)
    }else {
      if(a instanceof I) {
        a.target = a.target || this
      }else {
        var d = a, a = new I(b, this);
        ab(a, d)
      }
    }
    var d = 1, e, c = c[b], b = !0 in c, f;
    if(b) {
      e = [];
      for(f = this;f;f = f.Nb) {
        e.push(f)
      }
      f = c[!0];
      f.O = f.d;
      for(var h = e.length - 1;!a.ya && h >= 0 && f.O;h--) {
        a.currentTarget = e[h], d &= Sb(f, e[h], a.type, !0, a) && a.Pb != !1
      }
    }
    if(!1 in c) {
      if(f = c[!1], f.O = f.d, b) {
        for(h = 0;!a.ya && h < e.length && f.O;h++) {
          a.currentTarget = e[h], d &= Sb(f, e[h], a.type, !1, a) && a.Pb != !1
        }
      }else {
        for(e = this;!a.ya && e && f.O;e = e.Nb) {
          a.currentTarget = e, d &= Sb(f, e, a.type, !1, a) && a.Pb != !1
        }
      }
    }
    a = Boolean(d)
  }else {
    a = !0
  }
  return a
};
p.c = function() {
  Wb.k.c.call(this);
  Rb(this);
  this.Nb = l
};
var Xb = q.window;
Vb++;
Vb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function M(a, b) {
  this.xb = [];
  this.Uc = a;
  this.$c = b || l
}
p = M.prototype;
p.fa = !1;
p.ab = !1;
p.jb = 0;
p.Hc = !1;
p.ce = !1;
p.$b = 0;
p.cancel = function(a) {
  if(this.fa) {
    this.nb instanceof M && this.nb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.$b--, b.$b <= 0 && b.cancel())
    }
    this.Uc ? this.Uc.call(this.$c, this) : this.Hc = !0;
    this.fa || this.Za(new Yb(this))
  }
};
p.Wc = function(a, b) {
  Zb(this, a, b);
  this.jb--;
  this.jb == 0 && this.fa && $b(this)
};
function Zb(a, b, c) {
  a.fa = !0;
  a.nb = c;
  a.ab = !b;
  $b(a)
}
function ac(a) {
  if(a.fa) {
    a.Hc || g(new bc(a)), a.Hc = !1
  }
}
function cc(a, b) {
  ac(a);
  Zb(a, !0, b)
}
p.Za = function(a) {
  ac(this);
  Zb(this, !1, a)
};
p.vb = function(a, b) {
  return dc(this, a, l, b)
};
p.Yd = function(a, b) {
  return dc(this, l, a, b)
};
function dc(a, b, c, d) {
  a.xb.push([b, c, d]);
  a.fa && $b(a);
  return a
}
p.Sc = function(a, b) {
  return dc(this, a, a, b)
};
function ec(a) {
  return eb(a.xb, function(a) {
    return ha(a[1])
  })
}
function $b(a) {
  a.Oc && a.fa && ec(a) && (q.clearTimeout(a.Oc), delete a.Oc);
  a.t && (a.t.$b--, delete a.t);
  for(var b = a.nb, c = !1, d = !1;a.xb.length && a.jb == 0;) {
    var e = a.xb.shift(), f = e[0], h = e[1], e = e[2];
    if(f = a.ab ? h : f) {
      try {
        var j = f.call(e || a.$c, b);
        if(j !== i) {
          a.ab = a.ab && (j == b || j instanceof Error), a.nb = b = j
        }
        b instanceof M && (d = !0, a.jb++)
      }catch(k) {
        b = k, a.ab = !0, ec(a) || (c = !0)
      }
    }
  }
  a.nb = b;
  if(d && a.jb) {
    dc(b, x(a.Wc, a, !0), x(a.Wc, a, !1)), b.ce = !0
  }
  if(c) {
    a.Oc = q.setTimeout(function() {
      b.message !== i && b.stack && (b.message += "\n" + b.stack);
      g(b)
    }, 0)
  }
}
function fc(a) {
  var b = new M;
  cc(b, a);
  return b
}
function gc(a) {
  var b = new M;
  b.Za(a);
  return b
}
function bc(a) {
  C.call(this);
  this.ge = a
}
B(bc, C);
bc.prototype.message = "Already called";
function Yb(a) {
  C.call(this);
  this.ge = a
}
B(Yb, C);
Yb.prototype.message = "Deferred was cancelled";
function hc(a) {
  this.C = a;
  this.Cb = [];
  this.cd = [];
  this.be = x(this.Ve, this)
}
hc.prototype.Mc = l;
function ic(a, b, c, d) {
  a.Cb.push([b, c, d]);
  if(a.Mc == l) {
    a.Mc = a.C.setTimeout(a.be, 0)
  }
}
hc.prototype.Ve = function() {
  this.Mc = l;
  var a = this.Cb;
  this.Cb = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], e = c[1], c = c[2];
    try {
      d.apply(e, c)
    }catch(f) {
      this.C.setTimeout(function() {
        g(f)
      }, 0)
    }
  }
  if(this.Cb.length == 0) {
    a = this.cd;
    this.cd = [];
    for(b = 0;b < a.length;b++) {
      cc(a[b], l)
    }
  }
};
var jc = new hc(q.window);
function kc(a) {
  return ha(a) || typeof a == "object" && ha(a.call) && ha(a.apply)
}
;function lc() {
}
function mc(a) {
  var b = [];
  nc(new lc, a, b);
  return b.join("")
}
function nc(a, b, c) {
  switch(typeof b) {
    case "string":
      oc(b, c);
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
      if(b == l) {
        c.push("null");
        break
      }
      if(s(b)) {
        var d = b.length;
        c.push("[");
        for(var e = "", f = 0;f < d;f++) {
          c.push(e), nc(a, b[f], c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(e in b) {
        Object.prototype.hasOwnProperty.call(b, e) && (f = b[e], typeof f != "function" && (c.push(d), oc(e, c), c.push(":"), nc(a, f, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var pc = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"}, qc = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function oc(a, b) {
  b.push('"', a.replace(qc, function(a) {
    if(a in pc) {
      return pc[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    b < 16 ? e += "000" : b < 256 ? e += "00" : b < 4096 && (e += "0");
    return pc[a] = e + b.toString(16)
  }), '"')
}
;function rc(a, b, c) {
  var d = bb(c, a);
  if(d != -1) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = r(a);
    if(d == "boolean" || d == "number" || d == "null" || d == "undefined") {
      b.push(String(a))
    }else {
      if(d == "string") {
        oc(a, b)
      }else {
        if(kc(a.n)) {
          a.n(b, c)
        }else {
          if(kc(a.Xd)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if(d == "array") {
                d = a.length;
                b.push("[");
                for(var e = "", f = 0;f < d;f++) {
                  b.push(e), rc(a[f], b, c), e = ", "
                }
                b.push("]")
              }else {
                if(d == "object") {
                  if(fa(a) && typeof a.valueOf == "function") {
                    b.push("new Date(", String(a.valueOf()), ")")
                  }else {
                    for(var d = Za(a).concat($a), e = {}, h = f = 0;h < d.length;) {
                      var j = d[h++], k = ga(j) ? "o" + v(j) : (typeof j).charAt(0) + j;
                      Object.prototype.hasOwnProperty.call(e, k) || (e[k] = !0, d[f++] = j)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      f = d[h], Object.prototype.hasOwnProperty.call(a, f) && (j = a[f], b.push(e), oc(f, b), b.push(": "), rc(j, b, c), e = ", ")
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
  rc(a, b, c)
}
function O(a, b) {
  var c = [];
  N(a, c, b);
  return c.join("")
}
;function sc() {
  this.Id = ma()
}
var tc = new sc;
sc.prototype.set = aa("Id");
sc.prototype.reset = function() {
  this.set(ma())
};
sc.prototype.get = m("Id");
function uc(a) {
  this.Ge = a || "";
  this.Qe = tc
}
uc.prototype.Od = !0;
uc.prototype.Pe = !0;
uc.prototype.Oe = !0;
uc.prototype.Pd = !1;
function vc(a) {
  return a < 10 ? "0" + a : String(a)
}
function wc(a, b) {
  var c = (a.Rd - b) / 1E3, d = c.toFixed(3), e = 0;
  if(c < 1) {
    e = 2
  }else {
    for(;c < 100;) {
      e++, c *= 10
    }
  }
  for(;e-- > 0;) {
    d = " " + d
  }
  return d
}
function xc(a) {
  uc.call(this, a)
}
B(xc, uc);
xc.prototype.Pd = !0;
var yc;
function zc(a, b) {
  var c;
  c = (c = a.className) && typeof c.split == "function" ? c.split(/\s+/) : [];
  var d = kb(arguments, 1), e;
  e = c;
  for(var f = 0, h = 0;h < d.length;h++) {
    bb(e, d[h]) >= 0 || (e.push(d[h]), f++)
  }
  e = f == d.length;
  a.className = c.join(" ");
  return e
}
;var Ac = !E || Wa();
!Ja && !E || E && Wa() || Ja && Ua("1.9.1");
E && Ua("9");
function Bc(a) {
  return a ? new Cc(a.nodeType == 9 ? a : a.ownerDocument || a.document) : yc || (yc = new Cc)
}
function P(a) {
  return u(a) ? document.getElementById(a) : a
}
function Dc(a, b) {
  var c = b && b != "*" ? b.toUpperCase() : "";
  return a.querySelectorAll && a.querySelector && (!F || document.compatMode == "CSS1Compat" || Ua("528")) && c ? a.querySelectorAll(c + "") : a.getElementsByTagName(c || "*")
}
function Ec(a, b) {
  Xa(b, function(b, d) {
    d == "style" ? a.style.cssText = b : d == "class" ? a.className = b : d == "for" ? a.htmlFor = b : d in Fc ? a.setAttribute(Fc[d], b) : d.lastIndexOf("aria-", 0) == 0 ? a.setAttribute(d, b) : a[d] = b
  })
}
var Fc = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Gc(a, b, c) {
  return Hc(document, arguments)
}
function Hc(a, b) {
  var c = b[0], d = b[1];
  if(!Ac && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', D(d.name), '"');
    if(d.type) {
      c.push(' type="', D(d.type), '"');
      var e = {};
      ab(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  if(d) {
    u(d) ? c.className = d : s(d) ? zc.apply(l, [c].concat(d)) : Ec(c, d)
  }
  b.length > 2 && Ic(a, c, b, 2);
  return c
}
function Ic(a, b, c, d) {
  function e(c) {
    c && b.appendChild(u(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    t(f) && !(ga(f) && f.nodeType > 0) ? cb(Jc(f) ? ib(f) : f, e) : e(f)
  }
}
function Kc(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function Jc(a) {
  if(a && typeof a.length == "number") {
    if(ga(a)) {
      return typeof a.item == "function" || typeof a.item == "string"
    }else {
      if(ha(a)) {
        return typeof a.item == "function"
      }
    }
  }
  return!1
}
function Cc(a) {
  this.ea = a || q.document || document
}
p = Cc.prototype;
p.fd = Bc;
p.ua = function(a) {
  return u(a) ? this.ea.getElementById(a) : a
};
p.Ya = function(a, b, c) {
  return Hc(this.ea, arguments)
};
p.createElement = function(a) {
  return this.ea.createElement(a)
};
p.createTextNode = function(a) {
  return this.ea.createTextNode(a)
};
p.appendChild = function(a, b) {
  a.appendChild(b)
};
p.append = function(a, b) {
  Ic(a.nodeType == 9 ? a : a.ownerDocument || a.document, a, arguments, 1)
};
p.contains = function(a, b) {
  if(a.contains && b.nodeType == 1) {
    return a == b || a.contains(b)
  }
  if(typeof a.compareDocumentPosition != "undefined") {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
function Lc(a) {
  typeof a == "number" && (a = Math.round(a) + "px");
  return a
}
function Mc(a) {
  E ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[F ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function Nc(a) {
  if(typeof a.G == "function") {
    a = a.G()
  }else {
    if(t(a) || u(a)) {
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
function Oc(a) {
  if(typeof a.H == "function") {
    return a.H()
  }
  if(u(a)) {
    return a.split("")
  }
  if(t(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return Ya(a)
}
function Pc(a) {
  if(typeof a.ga == "function") {
    return a.ga()
  }
  if(typeof a.H != "function") {
    if(t(a) || u(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return Za(a)
  }
}
function Qc(a, b, c) {
  if(typeof a.forEach == "function") {
    a.forEach(b, c)
  }else {
    if(t(a) || u(a)) {
      cb(a, b, c)
    }else {
      for(var d = Pc(a), e = Oc(a), f = e.length, h = 0;h < f;h++) {
        b.call(c, e[h], d && d[h], a)
      }
    }
  }
}
function Rc(a, b) {
  if(typeof a.every == "function") {
    return a.every(b, i)
  }
  if(t(a) || u(a)) {
    return fb(a, b, i)
  }
  for(var c = Pc(a), d = Oc(a), e = d.length, f = 0;f < e;f++) {
    if(!b.call(i, d[f], c && c[f], a)) {
      return!1
    }
  }
  return!0
}
;function Q(a, b) {
  this.j = {};
  this.g = [];
  var c = arguments.length;
  if(c > 1) {
    c % 2 && g(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.Zb(a)
  }
}
p = Q.prototype;
p.d = 0;
p.Qc = 0;
p.G = m("d");
p.H = function() {
  Sc(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.j[this.g[b]])
  }
  return a
};
p.ga = function() {
  Sc(this);
  return this.g.concat()
};
p.T = function(a) {
  return Tc(this.j, a)
};
p.dc = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(Tc(this.j, c) && this.j[c] == a) {
      return!0
    }
  }
  return!1
};
p.o = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.d != a.G()) {
    return!1
  }
  var c = b || Uc;
  Sc(this);
  for(var d, e = 0;d = this.g[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
function Uc(a, b) {
  return a === b
}
p.cb = function() {
  return this.d == 0
};
p.clear = function() {
  this.j = {};
  this.Qc = this.d = this.g.length = 0
};
p.remove = function(a) {
  return Tc(this.j, a) ? (delete this.j[a], this.d--, this.Qc++, this.g.length > 2 * this.d && Sc(this), !0) : !1
};
function Sc(a) {
  if(a.d != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      Tc(a.j, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.d != a.g.length) {
    for(var e = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], Tc(e, d) || (a.g[c++] = d, e[d] = 1), b++
    }
    a.g.length = c
  }
}
p.get = function(a, b) {
  return Tc(this.j, a) ? this.j[a] : b
};
p.set = function(a, b) {
  Tc(this.j, a) || (this.d++, this.g.push(a), this.Qc++);
  this.j[a] = b
};
p.Zb = function(a) {
  var b;
  a instanceof Q ? (b = a.ga(), a = a.H()) : (b = Za(a), a = Ya(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
p.L = function() {
  return new Q(this)
};
function Vc(a) {
  Sc(a);
  for(var b = {}, c = 0;c < a.g.length;c++) {
    var d = a.g[c];
    b[d] = a.j[d]
  }
  return b
}
function Tc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function Wc(a) {
  this.j = new Q;
  a && this.Zb(a)
}
function Xc(a) {
  var b = typeof a;
  return b == "object" && a || b == "function" ? "o" + v(a) : b.substr(0, 1) + a
}
p = Wc.prototype;
p.G = function() {
  return this.j.G()
};
p.add = function(a) {
  this.j.set(Xc(a), a)
};
p.Zb = function(a) {
  for(var a = Oc(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
p.Dc = function(a) {
  for(var a = Oc(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
p.remove = function(a) {
  return this.j.remove(Xc(a))
};
p.clear = function() {
  this.j.clear()
};
p.cb = function() {
  return this.j.cb()
};
p.contains = function(a) {
  return this.j.T(Xc(a))
};
p.H = function() {
  return this.j.H()
};
p.L = function() {
  return new Wc(this)
};
p.o = function(a) {
  return this.G() == Nc(a) && Yc(this, a)
};
function Yc(a, b) {
  var c = Nc(b);
  if(a.G() > c) {
    return!1
  }
  !(b instanceof Wc) && c > 5 && (b = new Wc(b));
  return Rc(a, function(a) {
    if(typeof b.contains == "function") {
      a = b.contains(a)
    }else {
      if(typeof b.dc == "function") {
        a = b.dc(a)
      }else {
        if(t(b) || u(b)) {
          a = bb(b, a) >= 0
        }else {
          a: {
            for(var c in b) {
              if(b[c] == a) {
                a = !0;
                break a
              }
            }
            a = !1
          }
        }
      }
    }
    return a
  })
}
;function Zc(a) {
  return $c(a || arguments.callee.caller, [])
}
function $c(a, b) {
  var c = [];
  if(bb(b, a) >= 0) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < 50) {
      c.push(ad(a) + "(");
      for(var d = a.arguments, e = 0;e < d.length;e++) {
        e > 0 && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = ad(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f
        }
        f.length > 40 && (f = f.substr(0, 40) + "...");
        c.push(f)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push($c(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function ad(a) {
  if(bd[a]) {
    return bd[a]
  }
  a = String(a);
  if(!bd[a]) {
    var b = /function ([^\(]+)/.exec(a);
    bd[a] = b ? b[1] : "[Anonymous]"
  }
  return bd[a]
}
var bd = {};
function cd(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
cd.prototype.Le = 0;
cd.prototype.lc = l;
cd.prototype.kc = l;
var dd = 0;
cd.prototype.reset = function(a, b, c, d, e) {
  this.Le = typeof e == "number" ? e : dd++;
  this.Rd = d || ma();
  this.Ma = a;
  this.yd = b;
  this.ze = c;
  delete this.lc;
  delete this.kc
};
cd.prototype.Fc = aa("Ma");
function R(a) {
  this.Ce = a
}
R.prototype.t = l;
R.prototype.Ma = l;
R.prototype.da = l;
R.prototype.Ha = l;
function S(a, b) {
  this.name = a;
  this.value = b
}
S.prototype.toString = m("name");
var ed = new S("OFF", Infinity), fd = new S("SHOUT", 1200), gd = new S("SEVERE", 1E3), id = new S("WARNING", 900), jd = new S("INFO", 800), kd = new S("CONFIG", 700), ld = new S("FINE", 500), md = new S("FINER", 400), nd = new S("FINEST", 300), od = new S("ALL", 0);
function T(a) {
  return U.hd(a)
}
p = R.prototype;
p.getParent = m("t");
p.Fc = aa("Ma");
function pd(a) {
  if(a.Ma) {
    return a.Ma
  }
  if(a.t) {
    return pd(a.t)
  }
  Aa("Root logger has no level set.");
  return l
}
p.log = function(a, b, c) {
  if(a.value >= pd(this).value) {
    a = this.re(a, b, c);
    b = "log:" + a.yd;
    q.console && (q.console.timeStamp ? q.console.timeStamp(b) : q.console.markTimeline && q.console.markTimeline(b));
    q.msWriteProfilerMark && q.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Ha) {
        for(var e = 0, f = i;f = c.Ha[e];e++) {
          f(d)
        }
      }
      b = b.getParent()
    }
  }
};
p.re = function(a, b, c) {
  var d = new cd(a, String(b), this.Ce);
  if(c) {
    d.lc = c;
    var e;
    var f = arguments.callee.caller;
    try {
      var h;
      var j = da("window.location.href");
      if(u(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:j, stack:"Not available"}
      }else {
        var k, n, z = !1;
        try {
          k = c.lineNumber || c.ye || "Not available"
        }catch(o) {
          k = "Not available", z = !0
        }
        try {
          n = c.fileName || c.filename || c.sourceURL || j
        }catch(w) {
          n = "Not available", z = !0
        }
        h = z || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:k, fileName:n, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + D(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + D(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + D(Zc(f) + "-> ")
    }catch(A) {
      e = "Exception trying to expose exception! You win, we lose. " + A
    }
    d.kc = e
  }
  return d
};
p.Ne = function(a, b) {
  this.log(fd, a, b)
};
p.K = function(a, b) {
  this.log(gd, a, b)
};
p.D = function(a, b) {
  this.log(id, a, b)
};
p.info = function(a, b) {
  this.log(jd, a, b)
};
p.de = function(a, b) {
  this.log(kd, a, b)
};
p.i = function(a, b) {
  this.log(ld, a, b)
};
p.ne = function(a, b) {
  this.log(md, a, b)
};
p.p = function(a, b) {
  this.log(nd, a, b)
};
var U = {Lb:{}, ob:l};
U.nd = function() {
  if(!U.ob) {
    U.ob = new R(""), U.Lb[""] = U.ob, U.ob.Fc(kd)
  }
};
U.ag = function() {
  return U.Lb
};
U.oc = function() {
  U.nd();
  return U.ob
};
U.hd = function(a) {
  U.nd();
  return U.Lb[a] || U.fe(a)
};
U.$f = function(a) {
  return function(b) {
    (a || U.oc()).K("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.ye + ")")
  }
};
U.fe = function(a) {
  var b = new R(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = U.hd(a.substr(0, c));
  if(!c.da) {
    c.da = {}
  }
  c.da[d] = b;
  b.t = c;
  return U.Lb[a] = b
};
function qd(a) {
  this.Hd = x(this.Zd, this);
  this.ed = new xc;
  this.od = this.ed.Od = !1;
  this.l = a;
  this.le = this.l.ownerDocument || this.l.document;
  var a = Bc(this.l), b = l;
  if(E) {
    b = a.ea.createStyleSheet(), Mc(b)
  }else {
    var c = Dc(a.ea, "head")[0];
    c || (b = Dc(a.ea, "body")[0], c = a.Ya("head"), b.parentNode.insertBefore(c, b));
    b = a.Ya("style");
    Mc(b);
    a.appendChild(c, b)
  }
  this.l.className += " logdiv"
}
qd.prototype.Me = function(a) {
  if(a != this.od) {
    var b = U.oc();
    if(a) {
      var c = this.Hd;
      if(!b.Ha) {
        b.Ha = []
      }
      b.Ha.push(c)
    }else {
      (b = b.Ha) && gb(b, this.Hd), this.bg = ""
    }
    this.od = a
  }
};
qd.prototype.Zd = function(a) {
  var b = this.l.scrollHeight - this.l.scrollTop - this.l.clientHeight <= 100, c = this.le.createElement("div");
  c.className = "logmsg";
  var d = this.ed, e;
  switch(a.Ma.value) {
    case fd.value:
      e = "dbg-sh";
      break;
    case gd.value:
      e = "dbg-sev";
      break;
    case id.value:
      e = "dbg-w";
      break;
    case jd.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var f = [];
  f.push(d.Ge, " ");
  if(d.Od) {
    var h = new Date(a.Rd);
    f.push("[", vc(h.getFullYear() - 2E3) + vc(h.getMonth() + 1) + vc(h.getDate()) + " " + vc(h.getHours()) + ":" + vc(h.getMinutes()) + ":" + vc(h.getSeconds()) + "." + vc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.Pe && f.push("[", wa(wc(a, d.Qe.get())), "s] ");
  d.Oe && f.push("[", D(a.ze), "] ");
  f.push('<span class="', e, '">', qa(wa(D(a.yd))));
  d.Pd && a.lc && f.push("<br>", qa(wa(a.kc || "")));
  f.push("</span><br>");
  c.innerHTML = f.join("");
  this.l.appendChild(c);
  if(b) {
    this.l.scrollTop = this.l.scrollHeight
  }
};
qd.prototype.clear = function() {
  this.l.innerHTML = ""
};
function rd(a) {
  var b = r(a);
  if(b == "string") {
    return 21 + 2 * a.length
  }else {
    if(b == "number") {
      return 16
    }else {
      if(b == "boolean") {
        return 12
      }else {
        if(b == "null" || b == "undefined") {
          return 8
        }else {
          g(Error("cannot determine size of object type " + b))
        }
      }
    }
  }
}
;function sd(a, b) {
  this.Da = a;
  this.za = b
}
sd.prototype.o = function(a) {
  return a instanceof sd && this.Da == a.Da && this.za.join(",") == a.za
};
sd.prototype.n = function(a, b) {
  a.push("new SACK(", String(this.Da), ", ");
  N(this.za, a, b);
  a.push(")")
};
function td() {
  this.A = new Q
}
p = td.prototype;
p.Fa = -1;
p.oa = 0;
p.append = function(a) {
  var b = rd(a);
  this.A.set(this.Fa + 1, [a, b]);
  this.Fa += 1;
  this.oa += b
};
p.extend = function(a) {
  for(var b = 0;b < a.length;b++) {
    this.append(a[b])
  }
};
p.n = function(a) {
  a.push("<Queue with ", String(this.A.G()), " item(s), counter=#", String(this.Fa), ", size=", String(this.oa), ">")
};
function ud(a) {
  Sc(a.A);
  lb(a.A.g);
  return a.A.g
}
function vd() {
  this.qa = new Q
}
vd.prototype.Ka = -1;
vd.prototype.oa = 0;
function wd(a) {
  var b = a.qa.ga();
  lb(b);
  return new sd(a.Ka, b)
}
var xd = {};
function yd(a, b) {
  switch(r(b)) {
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
        a.push('<property id="', d, '">'), yd(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if(typeof b.getFullYear == "function") {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && r(b[c]) != "function" && (a.push('<property id="', D(c), '">'), yd(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function zd(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var f = e.length, h = 1;h < f;h++) {
    yd(d, e[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;function Ad() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ ma()).toString(36)
}
function Bd(a) {
  return a.substr(0, a.length - 1)
}
var Cd = /^(0|[1-9]\d*)$/, Dd = /^(0|\-?[1-9]\d*)$/;
function Ed(a) {
  var b = Fd;
  return Cd.test(a) && (a = parseInt(a, 10), a <= b) ? a : l
}
;function Gd(a, b) {
  this.U = "_" + Ad();
  this.Ub = a;
  this.ka = b;
  this.pa = a.pa
}
B(Gd, H);
p = Gd.prototype;
p.xa = !0;
p.zb = !1;
p.a = T("cw.net.FlashSocket");
p.n = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.U);
  a.push("'>")
};
function Hd(a, b, c) {
  b == "frames" ? (a = a.ka, Id(a.v), Jd(a.v, c)) : b == "stillreceiving" ? (c = a.ka, c.a.p("onstillreceiving"), Id(c.v)) : b == "connect" ? (c = a.ka, c.a.info("onconnect"), Id(c.v), a = c.Va, c.Va = l, a.length && (c.a.p("onconnect: Writing " + a.length + " buffered frame(s)."), c.Qb.ub(a))) : b == "close" ? (a.xa = !1, a.b()) : b == "ioerror" ? (a.xa = !1, b = a.ka, b.a.D("onioerror: " + O(c)), Kd(b.v, !1), a.b()) : b == "securityerror" ? (a.xa = !1, b = a.ka, b.a.D("onsecurityerror: " + O(c)), 
  Kd(b.v, !1), a.b()) : g(Error("bad event: " + b))
}
p.cc = function(a, b) {
  try {
    var c = this.pa.CallFunction(zd("__FC_connect", this.U, a, b, "<int32/>\n"))
  }catch(d) {
    this.a.K("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message);
    this.zb = !0;
    this.xa = !1;
    this.b();
    return
  }
  c != '"OK"' && g(Error("__FC_connect failed? ret: " + c))
};
p.ub = function(a) {
  try {
    var b = this.pa.CallFunction(zd("__FC_writeFrames", this.U, a))
  }catch(c) {
    this.a.K("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message);
    this.zb = !0;
    this.xa = !1;
    this.b();
    return
  }
  b != '"OK"' && (b == '"no such instance"' ? (this.a.D("Flash no longer knows of " + this.U + "; disposing."), this.b()) : g(Error("__FC_writeFrames failed? ret: " + b)))
};
p.c = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.xa);
  Gd.k.c.call(this);
  var a = this.pa;
  delete this.pa;
  if(this.xa) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(zd("__FC_close", this.U)))
    }catch(b) {
      this.a.K("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.zb = !0
    }
  }
  if(this.zb) {
    a = this.ka, a.a.D("oncrash"), Kd(a.v, !0)
  }else {
    this.ka.onclose()
  }
  delete this.ka;
  delete this.Ub.Ia[this.U]
};
function Ld(a, b) {
  this.u = a;
  this.pa = b;
  this.Ia = {};
  this.bc = "__FST_" + Ad();
  q[this.bc] = x(this.ke, this);
  var c = b.CallFunction(zd("__FC_setCallbackFunc", this.bc));
  c != '"OK"' && g(Error("__FC_setCallbackFunc failed? ret: " + c))
}
B(Ld, H);
p = Ld.prototype;
p.a = T("cw.net.FlashSocketTracker");
p.n = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Ia, a, b);
  a.push(">")
};
p.fc = function(a) {
  a = new Gd(this, a);
  return this.Ia[a.U] = a
};
p.ie = function(a, b, c, d) {
  var e = this.Ia[a];
  e ? b == "frames" && d ? (Hd(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : Hd(e, b, c) : this.a.D("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
p.ke = function(a, b, c, d) {
  try {
    ic(this.u, this.ie, this, [a, b, c, d])
  }catch(e) {
    q.window.setTimeout(function() {
      g(e)
    }, 0)
  }
};
p.c = function() {
  Ld.k.c.call(this);
  for(var a = Ya(this.Ia);a.length;) {
    a.pop().b()
  }
  delete this.Ia;
  delete this.pa;
  q[this.bc] = i
};
function Md(a) {
  this.v = a;
  this.Va = []
}
B(Md, H);
p = Md.prototype;
p.a = T("cw.net.FlashSocketConduit");
p.ub = function(a) {
  this.Va ? (this.a.p("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.Va.push.apply(this.Va, a)) : (this.a.p("writeFrames: Writing " + a.length + " frame(s)."), this.Qb.ub(a))
};
p.cc = function(a, b) {
  this.Qb.cc(a, b)
};
p.onclose = function() {
  this.a.info("onclose");
  Kd(this.v, !1)
};
p.c = function() {
  this.a.info("in disposeInternal.");
  Md.k.c.call(this);
  this.Qb.b();
  delete this.v
};
function Nd() {
  var a = Math.pow(10, 9);
  return a + Math.random() * (Math.pow(10, 10) - a)
}
;var Fd = Math.pow(2, 53);
var Od = {Xd:ba("<cw.eq.Wildcard>")};
function Pd(a) {
  return a == "boolean" || a == "number" || a == "null" || a == "undefined" || a == "string"
}
function Qd(a, b, c) {
  var d = r(a), e = r(b);
  if(a == Od || b == Od) {
    return!0
  }else {
    if(a != l && typeof a.o == "function") {
      return c && c.push("running custom equals function on left object"), a.o(b, c)
    }else {
      if(b != l && typeof b.o == "function") {
        return c && c.push("running custom equals function on right object"), b.o(a, c)
      }else {
        if(Pd(d) || Pd(e)) {
          a = a === b
        }else {
          if(a instanceof RegExp && b instanceof RegExp) {
            a = a.toString() === b.toString()
          }else {
            if(fa(a) && fa(b)) {
              a = a.valueOf() === b.valueOf()
            }else {
              if(d == "array" && e == "array") {
                a: {
                  if(c && c.push("descending into array"), a.length != b.length) {
                    c && c.push("array length mismatch: " + a.length + ", " + b.length), a = !1
                  }else {
                    d = 0;
                    for(e = a.length;d < e;d++) {
                      if(!Qd(a[d], b[d], c)) {
                        c && c.push("earlier comparisons indicate mismatch at array item #" + d);
                        a = !1;
                        break a
                      }
                    }
                    c && c.push("ascending from array");
                    a = !0
                  }
                }
              }else {
                if(a.Wd == Ba && b.Wd == Ba) {
                  a: {
                    c && c.push("descending into object");
                    for(var f in a) {
                      if(!(f in b)) {
                        c && c.push("property " + f + " missing on right object");
                        a = !1;
                        break a
                      }
                      if(!Qd(a[f], b[f], c)) {
                        c && c.push("earlier comparisons indicate mismatch at property " + f);
                        a = !1;
                        break a
                      }
                    }
                    for(f in b) {
                      if(!(f in a)) {
                        c && c.push("property " + f + " missing on left object");
                        a = !1;
                        break a
                      }
                    }
                    c && c.push("ascending from object");
                    a = !0
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
    }
  }
}
;function V(a) {
  C.call(this, a)
}
B(V, C);
V.prototype.name = "cw.net.InvalidFrame";
function W() {
  var a = [];
  this.N(a);
  return a.join("")
}
function Rd() {
}
Rd.prototype.o = function(a, b) {
  return!(a instanceof Rd) ? !1 : Qd(Sd(this), Sd(a), b)
};
Rd.prototype.n = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Sd(this), a, b);
  a.push(">")
};
function Sd(a) {
  return[a.Sa, a.Fd, a.md, a.Jd, a.rb, a.Kc, a.zd, a.xd, a.xc, a.vd, a.Ud, a.Qd, a.Q, a.Jb]
}
Rd.prototype.F = W;
Rd.prototype.N = function(a) {
  var b = {};
  b.tnum = this.Sa;
  b.ver = this.Fd;
  b.format = this.md;
  b["new"] = this.Jd;
  b.id = this.rb;
  b.ming = this.Kc;
  b.pad = this.zd;
  b.maxb = this.xd;
  if(this.xc !== i) {
    b.maxt = this.xc
  }
  b.maxia = this.vd;
  b.tcpack = this.Ud;
  b.eeds = this.Qd;
  b.sack = this.Q instanceof sd ? Bd((new X(this.Q)).F()) : this.Q;
  b.seenack = this.Jb instanceof sd ? Bd((new X(this.Jb)).F()) : this.Jb;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(mc(b), "H")
};
function Td(a) {
  this.Ra = a
}
Td.prototype.o = function(a) {
  return a instanceof Td && this.Ra == a.Ra
};
Td.prototype.n = function(a, b) {
  a.push("new StringFrame(");
  N(this.Ra, a, b);
  a.push(")")
};
Td.prototype.F = W;
Td.prototype.N = function(a) {
  a.push(this.Ra, " ")
};
function Ud(a) {
  this.yb = a
}
Ud.prototype.o = function(a) {
  return a instanceof Ud && this.yb == a.yb
};
Ud.prototype.n = function(a, b) {
  a.push("new CommentFrame(");
  N(this.yb, a, b);
  a.push(")")
};
Ud.prototype.F = W;
Ud.prototype.N = function(a) {
  a.push(this.yb, "^")
};
function Vd(a) {
  this.pb = a
}
Vd.prototype.o = function(a) {
  return a instanceof Vd && this.pb == a.pb
};
Vd.prototype.n = function(a) {
  a.push("new SeqNumFrame(", String(this.pb), ")")
};
Vd.prototype.F = W;
Vd.prototype.N = function(a) {
  a.push(String(this.pb), "N")
};
function Wd(a) {
  var b = a.split("|");
  if(b.length != 2) {
    return l
  }
  a: {
    var c = b[1], a = Fd;
    if(Dd.test(c) && (c = parseInt(c, 10), c >= -1 && c <= a)) {
      a = c;
      break a
    }
    a = l
  }
  if(a == l) {
    return l
  }
  c = [];
  if(b[0]) {
    for(var b = b[0].split(","), d = 0, e = b.length;d < e;d++) {
      var f = Ed(b[d]);
      if(f == l) {
        return l
      }
      c.push(f)
    }
  }
  return new sd(a, c)
}
function X(a) {
  this.Q = a
}
X.prototype.o = function(a, b) {
  return a instanceof X && this.Q.o(a.Q, b)
};
X.prototype.n = function(a, b) {
  a.push("new SackFrame(");
  N(this.Q, a, b);
  a.push(")")
};
X.prototype.F = W;
X.prototype.N = function(a) {
  var b = this.Q;
  a.push(b.za.join(","), "|", String(b.Da));
  a.push("A")
};
function Xd(a) {
  this.gb = a
}
Xd.prototype.o = function(a, b) {
  return a instanceof Xd && this.gb.o(a.gb, b)
};
Xd.prototype.n = function(a, b) {
  a.push("new StreamStatusFrame(");
  N(this.gb, a, b);
  a.push(")")
};
Xd.prototype.F = W;
Xd.prototype.N = function(a) {
  var b = this.gb;
  a.push(b.za.join(","), "|", String(b.Da));
  a.push("T")
};
function Yd() {
}
Yd.prototype.n = function(a) {
  a.push("new StreamCreatedFrame()")
};
Yd.prototype.o = function(a) {
  return a instanceof Yd
};
Yd.prototype.F = W;
Yd.prototype.N = function(a) {
  a.push("C")
};
function Zd() {
}
Zd.prototype.n = function(a) {
  a.push("new YouCloseItFrame()")
};
Zd.prototype.o = function(a) {
  return a instanceof Zd
};
Zd.prototype.F = W;
Zd.prototype.N = function(a) {
  a.push("Y")
};
function $d(a, b) {
  this.lb = a;
  this.Ua = b
}
$d.prototype.o = function(a) {
  return a instanceof $d && this.lb == a.lb && this.Ua == a.Ua
};
$d.prototype.n = function(a, b) {
  a.push("new ResetFrame(");
  N(this.lb, a, b);
  a.push(", ", String(this.Ua), ")")
};
$d.prototype.F = W;
$d.prototype.N = function(a) {
  a.push(this.lb, "|", String(Number(this.Ua)), "!")
};
var ae = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function be(a) {
  this.reason = a
}
be.prototype.o = function(a) {
  return a instanceof be && this.reason == a.reason
};
be.prototype.n = function(a, b) {
  a.push("new TransportKillFrame(");
  N(this.reason, a, b);
  a.push(")")
};
be.prototype.F = W;
be.prototype.N = function(a) {
  a.push(this.reason, "K")
};
function ce(a) {
  a || g(new V("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(b == " ") {
    return new Td(a.substr(0, a.length - 1))
  }else {
    if(b == "A") {
      return a = Wd(Bd(a)), a == l && g(new V("bad sack")), new X(a)
    }else {
      if(b == "N") {
        return a = Ed(Bd(a)), a == l && g(new V("bad seqNum")), new Vd(a)
      }else {
        if(b == "T") {
          return a = Wd(Bd(a)), a == l && g(new V("bad lastSackSeen")), new Xd(a)
        }else {
          if(b == "Y") {
            return a.length != 1 && g(new V("leading garbage")), new Zd
          }else {
            if(b == "^") {
              return new Ud(a.substr(0, a.length - 1))
            }else {
              if(b == "C") {
                return a.length != 1 && g(new V("leading garbage")), new Yd
              }else {
                if(b == "!") {
                  return b = a.substr(0, a.length - 3), (b.length > 255 || !/^([ -~]*)$/.test(b)) && g(new V("bad reasonString")), a = {"|0":!1, "|1":!0}[a.substr(a.length - 3, 2)], a == l && g(new V("bad applicationLevel")), new $d(b, a)
                }else {
                  if(b == "K") {
                    return a = a.substr(0, a.length - 1), a = ae[a], a == l && g(new V("unknown kill reason: " + a)), new be(a)
                  }else {
                    g(new V("Invalid frame type " + b))
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
;var de = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function ee(a, b) {
  var c = a.match(de), d = b.match(de);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function fe(a, b) {
  var c;
  a instanceof fe ? (this.Qa(b == l ? a.V : b), ge(this, a.R), he(this, a.Ca), ie(this, a.M), je(this, a.ia), ke(this, a.I), le(this, a.J.L()), me(this, a.sa)) : a && (c = String(a).match(de)) ? (this.Qa(!!b), ge(this, c[1] || "", !0), he(this, c[2] || "", !0), ie(this, c[3] || "", !0), je(this, c[4]), ke(this, c[5] || "", !0), le(this, c[6] || "", !0), me(this, c[7] || "", !0)) : (this.Qa(!!b), this.J = new ne(l, this, this.V))
}
p = fe.prototype;
p.R = "";
p.Ca = "";
p.M = "";
p.ia = l;
p.I = "";
p.sa = "";
p.xe = !1;
p.V = !1;
p.toString = function() {
  if(this.S) {
    return this.S
  }
  var a = [];
  this.R && a.push(oe(this.R, pe), ":");
  this.M && (a.push("//"), this.Ca && a.push(oe(this.Ca, pe), "@"), a.push(u(this.M) ? encodeURIComponent(this.M) : l), this.ia != l && a.push(":", String(this.ia)));
  this.I && (this.M && this.I.charAt(0) != "/" && a.push("/"), a.push(oe(this.I, this.I.charAt(0) == "/" ? qe : re)));
  var b = String(this.J);
  b && a.push("?", b);
  this.sa && a.push("#", oe(this.sa, se));
  return this.S = a.join("")
};
p.L = function() {
  var a = this.R, b = this.Ca, c = this.M, d = this.ia, e = this.I, f = this.J.L(), h = this.sa, j = new fe(l, this.V);
  a && ge(j, a);
  b && he(j, b);
  c && ie(j, c);
  d && je(j, d);
  e && ke(j, e);
  f && le(j, f);
  h && me(j, h);
  return j
};
function ge(a, b, c) {
  te(a);
  delete a.S;
  a.R = c ? b ? decodeURIComponent(b) : "" : b;
  if(a.R) {
    a.R = a.R.replace(/:$/, "")
  }
}
function he(a, b, c) {
  te(a);
  delete a.S;
  a.Ca = c ? b ? decodeURIComponent(b) : "" : b
}
function ie(a, b, c) {
  te(a);
  delete a.S;
  a.M = c ? b ? decodeURIComponent(b) : "" : b
}
function je(a, b) {
  te(a);
  delete a.S;
  b ? (b = Number(b), (isNaN(b) || b < 0) && g(Error("Bad port number " + b)), a.ia = b) : a.ia = l
}
function ke(a, b, c) {
  te(a);
  delete a.S;
  a.I = c ? b ? decodeURIComponent(b) : "" : b
}
function le(a, b, c) {
  te(a);
  delete a.S;
  b instanceof ne ? (a.J = b, a.J.Pc = a, a.J.Qa(a.V)) : (c || (b = oe(b, ue)), a.J = new ne(b, a, a.V))
}
function me(a, b, c) {
  te(a);
  delete a.S;
  a.sa = c ? b ? decodeURIComponent(b) : "" : b
}
function te(a) {
  a.xe && g(Error("Tried to modify a read-only Uri"))
}
p.Qa = function(a) {
  this.V = a;
  this.J && this.J.Qa(a);
  return this
};
function ve(a) {
  return a instanceof fe ? a.L() : new fe(a, i)
}
var we = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function oe(a, b) {
  var c = l;
  u(a) && (c = a, we.test(c) || (c = encodeURI(a)), c.search(b) >= 0 && (c = c.replace(b, ye)));
  return c
}
function ye(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var pe = /[#\/\?@]/g, re = /[\#\?:]/g, qe = /[\#\?]/g, ue = /[\#\?@]/g, se = /#/g;
function ne(a, b, c) {
  this.Z = a || l;
  this.Pc = b || l;
  this.V = !!c
}
function Y(a) {
  if(!a.h && (a.h = new Q, a.d = 0, a.Z)) {
    for(var b = a.Z.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), e = l, f = l;
      d >= 0 ? (e = b[c].substring(0, d), f = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = ze(a, e);
      a.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
    }
  }
}
p = ne.prototype;
p.h = l;
p.d = l;
p.G = function() {
  Y(this);
  return this.d
};
p.add = function(a, b) {
  Y(this);
  Ae(this);
  a = ze(this, a);
  if(this.T(a)) {
    var c = this.h.get(a);
    s(c) ? c.push(b) : this.h.set(a, [c, b])
  }else {
    this.h.set(a, b)
  }
  this.d++;
  return this
};
p.remove = function(a) {
  Y(this);
  a = ze(this, a);
  if(this.h.T(a)) {
    Ae(this);
    var b = this.h.get(a);
    s(b) ? this.d -= b.length : this.d--;
    return this.h.remove(a)
  }
  return!1
};
p.clear = function() {
  Ae(this);
  this.h && this.h.clear();
  this.d = 0
};
p.cb = function() {
  Y(this);
  return this.d == 0
};
p.T = function(a) {
  Y(this);
  a = ze(this, a);
  return this.h.T(a)
};
p.dc = function(a) {
  var b = this.H();
  return bb(b, a) >= 0
};
p.ga = function() {
  Y(this);
  for(var a = this.h.H(), b = this.h.ga(), c = [], d = 0;d < b.length;d++) {
    var e = a[d];
    if(s(e)) {
      for(var f = 0;f < e.length;f++) {
        c.push(b[d])
      }
    }else {
      c.push(b[d])
    }
  }
  return c
};
p.H = function(a) {
  Y(this);
  if(a) {
    if(a = ze(this, a), this.T(a)) {
      var b = this.h.get(a);
      if(s(b)) {
        return b
      }else {
        a = [], a.push(b)
      }
    }else {
      a = []
    }
  }else {
    for(var b = this.h.H(), a = [], c = 0;c < b.length;c++) {
      var d = b[c];
      s(d) ? jb(a, d) : a.push(d)
    }
  }
  return a
};
p.set = function(a, b) {
  Y(this);
  Ae(this);
  a = ze(this, a);
  if(this.T(a)) {
    var c = this.h.get(a);
    s(c) ? this.d -= c.length : this.d--
  }
  this.h.set(a, b);
  this.d++;
  return this
};
p.get = function(a, b) {
  Y(this);
  a = ze(this, a);
  if(this.T(a)) {
    var c = this.h.get(a);
    return s(c) ? c[0] : c
  }else {
    return b
  }
};
p.toString = function() {
  if(this.Z) {
    return this.Z
  }
  if(!this.h) {
    return""
  }
  for(var a = [], b = 0, c = this.h.ga(), d = 0;d < c.length;d++) {
    var e = c[d], f = pa(e), e = this.h.get(e);
    if(s(e)) {
      for(var h = 0;h < e.length;h++) {
        b > 0 && a.push("&"), a.push(f), e[h] !== "" && a.push("=", pa(e[h])), b++
      }
    }else {
      b > 0 && a.push("&"), a.push(f), e !== "" && a.push("=", pa(e)), b++
    }
  }
  return this.Z = a.join("")
};
function Ae(a) {
  delete a.Ga;
  delete a.Z;
  a.Pc && delete a.Pc.S
}
p.L = function() {
  var a = new ne;
  if(this.Ga) {
    a.Ga = this.Ga
  }
  if(this.Z) {
    a.Z = this.Z
  }
  if(this.h) {
    a.h = this.h.L()
  }
  return a
};
function ze(a, b) {
  var c = String(b);
  a.V && (c = c.toLowerCase());
  return c
}
p.Qa = function(a) {
  a && !this.V && (Y(this), Ae(this), Qc(this.h, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.V = a
};
p.extend = function(a) {
  for(var b = 0;b < arguments.length;b++) {
    Qc(arguments[b], function(a, b) {
      this.add(b, a)
    }, this)
  }
};
function Be(a, b, c, d) {
  this.contentWindow = a;
  this.Db = b;
  this.Lc = c;
  this.qe = d
}
Be.prototype.n = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.qe, a, b);
  a.push(", expandedUrl=");
  N(this.Db, a, b);
  a.push(", streams=");
  N(this.Lc, a, b);
  a.push(">")
};
function Ce() {
  this.frames = [];
  this.vc = new Q
}
Ce.prototype.a = T("cw.net.XDRTracker");
function De(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + String(Math.floor(Nd())) + String(Math.floor(Nd()))
  })
}
function Ee(a, b) {
  for(var c = Fe, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], f;
    if(f = e.Lc.length == 0) {
      f = e.Db;
      var h = String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      f = RegExp("^" + h + "$").test(f)
    }
    if(f) {
      return c.a.info("Giving " + O(b) + " existing frame " + O(e)), fc(e)
    }
  }
  d = Ad() + Ad();
  e = De(a);
  f = q.location;
  f instanceof fe || (f = ve(f));
  e instanceof fe || (e = ve(e));
  var j = f;
  f = j.L();
  (h = !!e.R) ? ge(f, e.R) : h = !!e.Ca;
  h ? he(f, e.Ca) : h = !!e.M;
  h ? ie(f, e.M) : h = e.ia != l;
  var k = e.I;
  if(h) {
    je(f, e.ia)
  }else {
    if(h = !!e.I) {
      if(k.charAt(0) != "/" && (j.M && !j.I ? k = "/" + k : (j = f.I.lastIndexOf("/"), j != -1 && (k = f.I.substr(0, j + 1) + k))), k == ".." || k == ".") {
        k = ""
      }else {
        if(!(k.indexOf("./") == -1 && k.indexOf("/.") == -1)) {
          for(var j = k.lastIndexOf("/", 0) == 0, k = k.split("/"), n = [], z = 0;z < k.length;) {
            var o = k[z++];
            o == "." ? j && z == k.length && n.push("") : o == ".." ? ((n.length > 1 || n.length == 1 && n[0] != "") && n.pop(), j && z == k.length && n.push("")) : (n.push(o), j = !0)
          }
          k = n.join("/")
        }
      }
    }
  }
  h ? ke(f, k) : h = e.J.toString() !== "";
  if(h) {
    j = e.J;
    if(!j.Ga) {
      j.Ga = j.toString() ? decodeURIComponent(j.toString()) : ""
    }
    le(f, j.Ga, i)
  }else {
    h = !!e.sa
  }
  h && me(f, e.sa);
  e = f.toString();
  f = String(q.location).match(de)[3] || l;
  h = e.match(de)[3] || l;
  f == h ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = fc(new Be(q, e, [b], l))) : (f = P("minerva-elements"), h = new M, c.vc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = Gc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + d}), f.appendChild(c), c = h);
  return c
}
Ce.prototype.$e = function(a) {
  var b = this.vc.get(a);
  b || g(Error("Unknown frameId " + O(a)));
  this.vc.remove(b);
  var c = b[0], a = new Be(P("minerva-xdrframe-" + a).contentWindow || (F ? P("minerva-xdrframe-" + a).document || P("minerva-xdrframe-" + a).contentWindow.document : P("minerva-xdrframe-" + a).contentDocument || P("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (F ? P("minerva-xdrframe-" + a).document || P("minerva-xdrframe-" + a).contentWindow.document : P("minerva-xdrframe-" + a).contentDocument || P("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  cc(c, a)
};
var Fe = new Ce;
q.__XHRTracker_xdrFrameLoaded = x(Fe.$e, Fe);
var Ge;
Ge = !1;
var He = Ga();
He && (He.indexOf("Firefox") != -1 || He.indexOf("Camino") != -1 || He.indexOf("iPhone") != -1 || He.indexOf("iPod") != -1 || He.indexOf("iPad") != -1 || He.indexOf("Android") != -1 || He.indexOf("Chrome") != -1 && (Ge = !0));
var Ie = Ge;
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function Je(a, b, c, d, e, f) {
  M.call(this, e, f);
  this.td = a;
  this.gc = [];
  this.dd = !!b;
  this.oe = !!c;
  this.ee = !!d;
  for(b = 0;b < a.length;b++) {
    dc(a[b], x(this.kd, this, b, !0), x(this.kd, this, b, !1))
  }
  a.length == 0 && !this.dd && cc(this, this.gc)
}
B(Je, M);
Je.prototype.Bd = 0;
Je.prototype.kd = function(a, b, c) {
  this.Bd++;
  this.gc[a] = [b, c];
  this.fa || (this.dd && b ? cc(this, [a, c]) : this.oe && !b ? this.Za(c) : this.Bd == this.td.length && cc(this, this.gc));
  this.ee && !b && (c = l);
  return c
};
Je.prototype.Za = function(a) {
  Je.k.Za.call(this, a);
  cb(this.td, function(a) {
    a.cancel()
  })
};
function Ke(a) {
  a = new Je(a, !1, !0);
  a.vb(function(a) {
    return db(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function Le(a, b) {
  this.Ze = a;
  this.wd = b
}
Le.prototype.uc = 0;
Le.prototype.Mb = 0;
Le.prototype.mc = !1;
function Me(a) {
  var b = [];
  if(a.mc) {
    return[b, 2]
  }
  var c = a.uc, d = a.Ze.responseText;
  for(a.uc = d.length;;) {
    c = d.indexOf("\n", c);
    if(c == -1) {
      break
    }
    var e = d.substr(a.Mb, c - a.Mb), e = e.replace(/\r$/, "");
    if(e.length > a.wd) {
      return a.mc = !0, [b, 2]
    }
    b.push(e);
    a.Mb = c += 1
  }
  return a.uc - a.Mb - 1 > a.wd ? (a.mc = !0, [b, 2]) : [b, 1]
}
;function Ne(a, b, c) {
  this.v = b;
  this.P = a;
  this.ec = c
}
B(Ne, H);
p = Ne.prototype;
p.a = T("cw.net.XHRMaster");
p.ma = -1;
p.wc = function(a, b, c) {
  this.ec.__XHRSlave_makeRequest(this.P, a, b, c)
};
p.ha = m("ma");
p.zc = function(a, b) {
  b != 1 && this.a.K(O(this.P) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  Id(this.v);
  Jd(this.v, a)
};
p.Ac = function(a) {
  this.a.i("ongotheaders_: " + O(a));
  var b = l;
  "Content-Length" in a && (b = Ed(a["Content-Length"]));
  a = this.v;
  a.a.i(a.q() + " got Content-Length: " + b);
  a.W == Oe && (b == l && (a.a.D("Expected to receive a valid Content-Length, but did not."), b = 5E5), Pe(a, 2E3 + b / 3072 * 1E3))
};
p.Bc = function(a) {
  a != 1 && this.a.i(this.v.q() + "'s XHR's readyState is " + a);
  this.ma = a;
  this.ma >= 2 && Id(this.v)
};
p.yc = function() {
  this.v.b()
};
p.c = function() {
  Ne.k.c.call(this);
  delete Z.aa[this.P];
  this.ec.__XHRSlave_dispose(this.P);
  delete this.ec
};
function Qe() {
  this.aa = {}
}
B(Qe, H);
p = Qe.prototype;
p.a = T("cw.net.XHRMasterTracker");
p.fc = function(a, b) {
  var c = "_" + Ad(), d = new Ne(c, a, b);
  return this.aa[c] = d
};
p.zc = function(a, b, c) {
  var b = hb(b), d = this.aa[a];
  d ? d.zc(b, c) : this.a.K("onframes_: no master for " + O(a))
};
p.Ac = function(a, b) {
  var c = this.aa[a];
  c ? c.Ac(b) : this.a.K("ongotheaders_: no master for " + O(a))
};
p.Bc = function(a, b) {
  var c = this.aa[a];
  c ? c.Bc(b) : this.a.K("onreadystatechange_: no master for " + O(a))
};
p.yc = function(a) {
  var b = this.aa[a];
  b ? (delete this.aa[b.P], b.yc()) : this.a.K("oncomplete_: no master for " + O(a))
};
p.c = function() {
  Qe.k.c.call(this);
  for(var a = Ya(this.aa);a.length;) {
    a.pop().b()
  }
  delete this.aa
};
var Z = new Qe;
q.__XHRMaster_onframes = x(Z.zc, Z);
q.__XHRMaster_oncomplete = x(Z.yc, Z);
q.__XHRMaster_ongotheaders = x(Z.Ac, Z);
q.__XHRMaster_onreadystatechange = x(Z.Bc, Z);
function Re(a, b, c) {
  this.host = a;
  this.port = b;
  this.Ue = c
}
function Se(a, b) {
  b || (b = a);
  this.ja = a;
  this.na = b
}
Se.prototype.n = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.ja, a, b);
  a.push(", secondaryUrl=");
  N(this.na, a, b);
  a.push(">")
};
function Te(a, b, c, d) {
  this.ja = a;
  this.Ed = b;
  this.na = c;
  this.Nd = d;
  (!(this.ja.indexOf("http://") == 0 || this.ja.indexOf("https://") == 0) || !(this.na.indexOf("http://") == 0 || this.na.indexOf("https://") == 0)) && g(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Ed.location.href;
  ee(this.ja, a) || g(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.Nd.location.href;
  ee(this.na, a) || g(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
Te.prototype.n = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.ja, a, b);
  a.push(", secondaryUrl=");
  N(this.na, a, b);
  a.push(">")
};
var Ue = new Ud(";)]}");
function Ve() {
}
function We(a) {
  this.Re = a
}
We.prototype.n = function(a, b) {
  a.push("<UserContext for ");
  N(this.Re, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.z = a;
  this.dg = b ? b : new Ve;
  this.u = c ? c : jc;
  this.sb = new Wc;
  this.rb = Ad() + Ad();
  this.la = new td;
  this.tc = new vd;
  this.tb = l;
  this.Vb = [];
  this.Ba = new We(this);
  if(F) {
    this.tb = Nb(q, "load", this.Ie, !1, this)
  }
}
B($, H);
p = $.prototype;
p.a = T("cw.net.ClientStream");
p.rd = new sd(-1, []);
p.sd = new sd(-1, []);
p.maxUndeliveredStrings = 50;
p.maxUndeliveredBytes = 1048576;
p.onstring = l;
p.onreset = l;
p.ondisconnect = l;
p.Ic = !1;
p.Ec = !1;
p.w = 1;
p.Sd = -1;
p.f = l;
p.r = l;
p.mb = l;
p.Jc = 0;
p.Dd = 0;
p.Md = 0;
p.n = function(a, b) {
  a.push("<ClientStream id=");
  N(this.rb, a, b);
  a.push(", state=", String(this.w));
  a.push(", primary=");
  N(this.f, a, b);
  a.push(", secondary=");
  N(this.r, a, b);
  a.push(", resetting=");
  N(this.mb, a, b);
  a.push(">")
};
p.se = m("Ba");
function Xe(a) {
  var b = [-1];
  a.f && b.push(a.f.Na);
  a.r && b.push(a.r.Na);
  return Math.max.apply(Math.max, b)
}
function Ye(a) {
  if(a.w != 1) {
    var b = a.la.A.G() != 0, c = wd(a.tc), d = !c.o(a.sd) && !(a.f && c.o(a.f.La) || a.r && c.o(a.r.La)), e = Xe(a);
    if((b = b && e < a.la.Fa) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      if(a.f.Wa) {
        a.a.p("tryToSend_: writing " + f + " to primary");
        if(d && (d = a.f, c != d.La)) {
          !d.ba && !d.s.length && Ze(d), d.s.push(new X(c)), d.La = c
        }
        b && $e(a.f, a.la, e + 1);
        a.f.$()
      }else {
        a.r == l ? a.Ic ? (a.a.p("tryToSend_: creating secondary to send " + f), a.r = af(a, !1), b && $e(a.r, a.la, e + 1), a.r.$()) : (a.a.p("tryToSend_: not creating a secondary because stream might not exist on server"), a.Ec = !0) : a.a.p("tryToSend_: need to send " + f + ", but can't right now")
      }
    }
  }
}
p.Ie = function() {
  this.tb = l;
  if(this.f && this.f.Ja()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.f;
    a.Yb = !0;
    a.b()
  }
  if(this.r && this.r.Ja()) {
    this.a.info("restartHttpRequests_: aborting secondary"), a = this.r, a.Yb = !0, a.b()
  }
};
p.Ke = function(a, b) {
  b !== i || (b = !0);
  this.w > 3 && g(Error("sendStrings: Can't send strings in state " + this.w));
  if(a.length) {
    if(b) {
      for(var c = 0;c < a.length;c++) {
        var d = a[c];
        /^([ -~]*)$/.test(d) || g(Error("sendStrings: string #" + c + " has illegal chars: " + O(d)))
      }
    }
    this.la.extend(a);
    Ye(this)
  }
};
function af(a, b) {
  var c;
  a.z instanceof Te ? c = Oe : a.z instanceof Re ? c = bf : g(Error("Don't support endpoint " + O(a.z)));
  a.Sd += 1;
  c = new cf(a.u, a, a.Sd, c, a.z, b);
  a.a.p("Created: " + c.q());
  a.sb.add(c);
  return c
}
function df(a, b, c) {
  var d = new ef(a.u, a, b, c);
  a.a.p("Created: " + d.q() + ", delay=" + b + ", times=" + c);
  a.sb.add(d);
  return d
}
function ff(a, b) {
  a.sb.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  a.a.i("Offline: " + b.q());
  b.kb ? a.Jc += b.kb : a.Jc = 0;
  a.Jc >= 1 && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.Ba, "stream penalty reached limit", !1), a.b());
  if(a.w > 3) {
    a.w == 4 && b.Vd ? (a.a.i("Disposing because resettingTransport_ is done."), a.b()) : a.a.i("Not creating a transport because ClientStream is in state " + a.w)
  }else {
    var c;
    var d;
    c = b instanceof ef;
    if(!c && b.Yb) {
      var e = F ? Ie ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      a.a.p("getDelayForNextTransport_: " + O({delay:c, times:d}))
    }else {
      d = b.Vc();
      if(b == a.f) {
        if(d) {
          e = ++a.Dd
        }else {
          if(!c) {
            e = a.Dd = 0
          }
        }
      }else {
        if(d) {
          e = ++a.Md
        }else {
          if(!c) {
            e = a.Md = 0
          }
        }
      }
      if(c || !e) {
        d = c = 0, a.a.p("getDelayForNextTransport_: " + O({count:e, delay:c, times:d}))
      }else {
        var f = 2E3 * Math.min(e, 3), h = Math.floor(Math.random() * 4E3) - 2E3, j = Math.max(0, b.Td - b.Nc);
        d = (c = Math.max(0, f + h - j)) ? 1 : 0;
        a.a.p("getDelayForNextTransport_: " + O({count:e, base:f, variance:h, oldDuration:j, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    if(b == a.f) {
      a.f = l, c ? a.f = df(a, e, c) : (e = Xe(a), a.f = af(a, !0), $e(a.f, a.la, e + 1)), a.f.$()
    }else {
      if(b == a.r) {
        a.r = l, c ? (a.r = df(a, e, c), a.r.$()) : Ye(a)
      }
    }
  }
}
p.reset = function(a) {
  this.w > 3 && g(Error("reset: Can't send reset in state " + this.w));
  this.w = 4;
  this.f && this.f.Wa ? (this.a.info("reset: Sending ResetFrame over existing primary."), gf(this.f, a), this.f.$()) : (this.f && (this.a.i("reset: Disposing primary before sending ResetFrame."), this.f.b()), this.r && (this.a.i("reset: Disposing secondary before sending ResetFrame."), this.r.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.mb = af(this, !1), gf(this.mb, a), this.mb.$());
  this.onreset && this.onreset.call(this.Ba, a, !0)
};
function hf(a, b, c, d) {
  var e;
  e = a.tc;
  for(var f = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, j = [], k = !1, n = 0, z = c.length;n < z;n++) {
    var o = c[n], w = o[0], o = o[1];
    if(w == e.Ka + 1) {
      e.Ka += 1;
      for(j.push(o);;) {
        w = e.Ka + 1;
        o = e.qa.get(w, xd);
        if(o === xd) {
          break
        }
        j.push(o[0]);
        e.qa.remove(w);
        e.oa -= o[1];
        e.Ka = w
      }
    }else {
      if(!(w <= e.Ka)) {
        if(f != l && e.qa.G() >= f) {
          k = !0;
          break
        }
        var A = rd(o);
        if(h != l && e.oa + A > h) {
          k = !0;
          break
        }
        e.qa.set(w, [o, A]);
        e.oa += A
      }
    }
  }
  e.qa.cb() && e.qa.clear();
  e = [j, k];
  c = e[0];
  e = e[1];
  if(c) {
    for(f = 0;f < c.length;f++) {
      if(h = c[f], a.onstring && a.onstring.call(a.Ba, h), a.w == 4 || a.Y) {
        return
      }
    }
  }
  d || Ye(a);
  if(!(a.w == 4 || a.Y) && e) {
    b.a.K(b.q() + "'s peer caused rwin overflow."), b.b()
  }
}
p.start = function() {
  this.onmessage && g(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  this.w != 1 && g(Error("ClientStream.start: " + O(this) + " already started"));
  this.w = 2;
  if(this.z instanceof Se) {
    var a = Ee(this.z.ja, this), b = Ee(this.z.na, this);
    Ke([a, b]).vb(x(this.me, this))
  }else {
    jf(this)
  }
};
p.me = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Db, e = a[1].Db;
  this.Vb.push(a[0]);
  this.Vb.push(a[1]);
  this.z = new Te(d, b, e, c);
  jf(this)
};
function jf(a) {
  a.w = 3;
  a.f = af(a, !0);
  $e(a.f, a.la, l);
  a.f.$()
}
p.c = function() {
  this.a.info(O(this) + " in disposeInternal.");
  this.w = 5;
  for(var a = this.sb.H(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Vb.length;a++) {
    gb(this.Vb[a].Lc, this)
  }
  if(F && this.tb) {
    Pb(this.tb), this.tb = l
  }
  this.ondisconnect && this.ondisconnect.call(this.Ba);
  delete this.sb;
  delete this.f;
  delete this.r;
  delete this.mb;
  delete this.Ba;
  $.k.c.call(this)
};
var Oe = 1, bf = 3;
function cf(a, b, c, d, e, f) {
  this.u = a;
  this.B = b;
  this.Sa = c;
  this.W = d;
  this.z = e;
  this.s = [];
  this.Ea = f;
  this.Wa = !this.Ja();
  this.Pa = this.W != Oe;
  this.ae = x(this.Se, this)
}
B(cf, H);
p = cf.prototype;
p.a = T("cw.net.ClientTransport");
p.m = l;
p.Nc = l;
p.Td = l;
p.Ob = l;
p.ba = !1;
p.Rb = !1;
p.La = l;
p.nc = 0;
p.Na = -1;
p.Cc = -1;
p.Vd = !1;
p.Yb = !1;
p.kb = 0;
p.bb = !1;
p.n = function(a) {
  a.push("<ClientTransport #", String(this.Sa), ", becomePrimary=", String(this.Ea), ">")
};
p.q = function() {
  return(this.Ea ? "Prim. T#" : "Sec. T#") + this.Sa
};
p.Vc = function() {
  return!(!this.bb && this.nc)
};
p.Ja = function() {
  return this.W == Oe || this.W == 2
};
function kf(a, b) {
  lb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  hf(a.B, a, b, !a.Pa)
}
function lf(a, b, c) {
  try {
    var d = ce(b);
    a.nc += 1;
    a.a.i(a.q() + " RECV " + O(d));
    var e;
    a.nc == 1 && !d.o(Ue) && a.Ja() ? (a.a.D(a.q() + " is closing soon because got bad preamble: " + O(d)), e = !0) : e = !1;
    if(e) {
      return!0
    }
    if(d instanceof Td) {
      if(!/^([ -~]*)$/.test(d.Ra)) {
        return a.bb = !0
      }
      a.Cc += 1;
      c.push([a.Cc, d.Ra])
    }else {
      if(d instanceof X) {
        var f = a.B, h = d.Q;
        f.rd = h;
        var j = f.la, k = h.Da, c = !1;
        k > j.Fa && (c = !0);
        for(var n = ud(j).concat(), d = 0;d < n.length;d++) {
          var z = n[d];
          if(z > k) {
            break
          }
          var o = j.A.j[z][1];
          j.A.remove(z);
          j.oa -= o
        }
        for(d = 0;d < h.za.length;d++) {
          var w = h.za[d];
          w > j.Fa && (c = !0);
          j.A.T(w) && (o = j.A.j[w][1], j.A.remove(w), j.oa -= o)
        }
        j.A.cb() && j.A.clear();
        if(c) {
          return a.a.D(a.q() + " is closing soon because got bad SackFrame"), a.bb = !0
        }
      }else {
        if(d instanceof Vd) {
          a.Cc = d.pb - 1
        }else {
          if(d instanceof Xd) {
            a.B.sd = d.gb
          }else {
            if(d instanceof Zd) {
              return a.a.p(a.q() + " is closing soon because got YouCloseItFrame"), !0
            }else {
              if(d instanceof be) {
                return a.bb = !0, d.reason == "stream_attach_failure" ? a.kb += 1 : d.reason == "acked_unsent_strings" && (a.kb += 0.5), a.a.p(a.q() + " is closing soon because got " + O(d)), !0
              }else {
                if(!(d instanceof Ud)) {
                  if(d instanceof Yd) {
                    var A = a.B, Wf = !a.Pa;
                    A.a.p("Stream is now confirmed to exist at server.");
                    A.Ic = !0;
                    if(A.Ec && !Wf) {
                      A.Ec = !1, Ye(A)
                    }
                  }else {
                    if(c.length) {
                      kf(a, c);
                      if(!s(c)) {
                        for(var hd = c.length - 1;hd >= 0;hd--) {
                          delete c[hd]
                        }
                      }
                      c.length = 0
                    }
                    if(d instanceof $d) {
                      var Ub = a.B;
                      Ub.onreset && Ub.onreset.call(Ub.Ba, d.lb, d.Ua);
                      Ub.b();
                      return!0
                    }else {
                      g(Error(a.q() + " had unexpected state in framesReceived_."))
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }catch(xe) {
    return xe instanceof V || g(xe), a.a.D(a.q() + " is closing soon because got InvalidFrame: " + O(b)), a.bb = !0
  }
  return!1
}
function Jd(a, b) {
  a.Rb = !0;
  try {
    for(var c = !1, d = [], e = 0, f = b.length;e < f;e++) {
      if(a.Y) {
        a.a.info(a.q() + " returning from loop because we're disposed.");
        return
      }
      if(c = lf(a, b[e], d)) {
        break
      }
    }
    d.length && kf(a, d);
    a.Rb = !1;
    a.s.length && a.$();
    c && (a.a.p(a.q() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Rb = !1
  }
}
p.Se = function() {
  this.a.D(this.q() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function mf(a) {
  if(a.Ob != l) {
    a.u.C.clearTimeout(a.Ob), a.Ob = l
  }
}
function Pe(a, b) {
  mf(a);
  b = Math.round(b);
  a.Ob = a.u.C.setTimeout(a.ae, b);
  a.a.i(a.q() + "'s receive timeout set to " + b + " ms.")
}
function Id(a) {
  a.W != Oe && (a.W == bf || a.W == 2 ? Pe(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.W)))
}
function Ze(a) {
  var b = new Rd;
  b.Sa = a.Sa;
  b.Fd = 2;
  b.md = 2;
  if(!a.B.Ic) {
    b.Jd = !0
  }
  b.rb = a.B.rb;
  b.Kc = a.Pa;
  if(b.Kc) {
    b.zd = 4096
  }
  b.xd = 3E5;
  b.vd = a.Pa ? Math.floor(10) : 0;
  b.Ud = !1;
  if(a.Ea) {
    b.Qd = l, b.xc = Math.floor((a.Pa ? 358E4 : 25E3) / 1E3)
  }
  b.Q = wd(a.B.tc);
  b.Jb = a.B.rd;
  a.s.push(b);
  a.La = b.Q
}
function Kd(a, b) {
  b && (a.kb += 0.5);
  a.b()
}
p.$ = function() {
  this.ba && !this.Wa && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.Rb) {
    this.a.p(this.q() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ba;
    this.ba = !0;
    !a && !this.s.length && Ze(this);
    for(a = 0;a < this.s.length;a++) {
      this.a.i(this.q() + " SEND " + O(this.s[a]))
    }
    if(this.Ja()) {
      for(var a = [], b = 0, c = this.s.length;b < c;b++) {
        this.s[b].N(a), a.push("\n")
      }
      this.s = [];
      a = a.join("");
      b = this.Ea ? this.z.ja : this.z.na;
      this.m = Z.fc(this, this.Ea ? this.z.Ed : this.z.Nd);
      this.Nc = this.u.C === Xb ? ma() : this.u.C.getTime();
      this.m.wc(b, "POST", a);
      Pe(this, 3E3 * (1.5 + (b.indexOf("https://") == 0 ? 3 : 1)) + 4E3 + (this.Pa ? 0 : this.Ea ? 25E3 : 0))
    }else {
      if(this.W == bf) {
        a = [];
        b = 0;
        for(c = this.s.length;b < c;b++) {
          a.push(this.s[b].F())
        }
        this.s = [];
        this.m ? this.m.ub(a) : (b = this.z, this.m = new Md(this), this.m.Qb = b.Ue.fc(this.m), this.Nc = this.u.C === Xb ? ma() : this.u.C.getTime(), this.m.cc(b.host, b.port), this.m.Y || (this.m.ub(a), this.m.Y || Pe(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.W))
      }
    }
  }
};
function $e(a, b, c) {
  !a.ba && !a.s.length && Ze(a);
  for(var d = Math.max(c, a.Na + 1), e = ud(b), c = [], f = 0;f < e.length;f++) {
    var h = e[f];
    (d == l || h >= d) && c.push([h, b.A.j[h][0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (a.Na == -1 || a.Na + 1 != e) && a.s.push(new Vd(e)), a.s.push(new Td(f)), a.Na = e
  }
}
p.c = function() {
  this.a.info(this.q() + " in disposeInternal.");
  cf.k.c.call(this);
  this.Td = this.u.C === Xb ? ma() : this.u.C.getTime();
  this.s = [];
  mf(this);
  this.m && this.m.b();
  var a = this.B;
  this.B = l;
  ff(a, this)
};
function gf(a, b) {
  !a.ba && !a.s.length && Ze(a);
  a.s.push(new $d(b, !0));
  a.Vd = !0
}
function ef(a, b, c, d) {
  this.u = a;
  this.B = b;
  this.ad = c;
  this.Xc = d
}
B(ef, H);
p = ef.prototype;
p.ba = !1;
p.Wa = !1;
p.Fb = l;
p.La = l;
p.a = T("cw.net.DoNothingTransport");
function nf(a) {
  a.Fb = a.u.C.setTimeout(function() {
    a.Fb = l;
    a.Xc--;
    a.Xc ? nf(a) : a.b()
  }, a.ad)
}
p.$ = function() {
  this.ba && !this.Wa && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ba = !0;
  nf(this)
};
p.n = function(a) {
  a.push("<DoNothingTransport delay=", String(this.ad), ">")
};
p.Ja = ba(!1);
p.q = ba("Wast. T");
p.Vc = ba(!1);
p.c = function() {
  this.a.info(this.q() + " in disposeInternal.");
  ef.k.c.call(this);
  this.Fb != l && this.u.C.clearTimeout(this.Fb);
  var a = this.B;
  this.B = l;
  ff(a, this)
};
var of;
(function() {
  function a(a) {
    a = a.match(/[\d]+/g);
    a.length = 3;
    return a.join(".")
  }
  var b = !1, c = "";
  if(navigator.plugins && navigator.plugins.length) {
    var d = navigator.plugins["Shockwave Flash"];
    d && (b = !0, d.description && (c = a(d.description)));
    navigator.plugins["Shockwave Flash 2.0"] && (b = !0, c = "2.0.0.11")
  }else {
    if(navigator.mimeTypes && navigator.mimeTypes.length) {
      (b = (d = navigator.mimeTypes["application/x-shockwave-flash"]) && d.enabledPlugin) && (c = a(d.enabledPlugin.description))
    }else {
      try {
        d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), b = !0, c = a(d.GetVariable("$version"))
      }catch(e) {
        try {
          d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), b = !0, c = "6.0.21"
        }catch(f) {
          try {
            d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), b = !0, c = a(d.GetVariable("$version"))
          }catch(h) {
          }
        }
      }
    }
  }
  of = c
})();
function pf(a) {
  this.te = a;
  this.g = []
}
B(pf, H);
var qf = [];
pf.prototype.Dc = function() {
  cb(this.g, Pb);
  this.g.length = 0
};
pf.prototype.c = function() {
  pf.k.c.call(this);
  this.Dc()
};
pf.prototype.handleEvent = function() {
  g(Error("EventHandler.handleEvent not implemented"))
};
function rf() {
}
(function(a) {
  a.gd = function() {
    return a.we || (a.we = new a)
  }
})(rf);
rf.prototype.De = 0;
rf.gd();
function sf(a) {
  this.hc = a || Bc();
  this.Je = tf
}
B(sf, Wb);
sf.prototype.ve = rf.gd();
var tf = l;
p = sf.prototype;
p.U = l;
p.wa = !1;
p.l = l;
p.Je = l;
p.Be = l;
p.t = l;
p.da = l;
p.Xa = l;
p.We = !1;
function uf(a) {
  return a.U || (a.U = ":" + (a.ve.De++).toString(36))
}
p.ua = m("l");
p.getParent = m("t");
p.Gc = function(a) {
  this.t && this.t != a && g(Error("Method not supported"));
  sf.k.Gc.call(this, a)
};
p.fd = m("hc");
p.Ya = function() {
  this.l = this.hc.createElement("div")
};
function vf(a, b) {
  a.wa && g(Error("Component already rendered"));
  a.l || a.Ya();
  b ? b.insertBefore(a.l, l) : a.hc.ea.body.appendChild(a.l);
  (!a.t || a.t.wa) && a.Bb()
}
p.Bb = function() {
  this.wa = !0;
  wf(this, function(a) {
    !a.wa && a.ua() && a.Bb()
  })
};
function xf(a) {
  wf(a, function(a) {
    a.wa && xf(a)
  });
  a.Gb && a.Gb.Dc();
  a.wa = !1
}
p.c = function() {
  sf.k.c.call(this);
  this.wa && xf(this);
  this.Gb && (this.Gb.b(), delete this.Gb);
  wf(this, function(a) {
    a.b()
  });
  !this.We && this.l && Kc(this.l);
  this.t = this.Be = this.l = this.Xa = this.da = l
};
function wf(a, b) {
  a.da && cb(a.da, b, i)
}
p.removeChild = function(a, b) {
  if(a) {
    var c = u(a) ? a : uf(a), a = this.Xa && c ? (c in this.Xa ? this.Xa[c] : i) || l : l;
    if(c && a) {
      var d = this.Xa;
      c in d && delete d[c];
      gb(this.da, a);
      b && (xf(a), a.l && Kc(a.l));
      c = a;
      c == l && g(Error("Unable to set parent component"));
      c.t = l;
      sf.k.Gc.call(c, l)
    }
  }
  a || g(Error("Child is not in parent component"));
  return a
};
function yf(a, b) {
  sf.call(this, b);
  this.pe = a;
  this.jc = new pf(this);
  this.Eb = new Q
}
B(yf, sf);
p = yf.prototype;
p.a = T("goog.ui.media.FlashObject");
p.Ye = "window";
p.Tc = "#000000";
p.$d = "sameDomain";
function zf(a, b, c) {
  a.Rc = u(b) ? b : Math.round(b) + "px";
  a.qc = u(c) ? c : Math.round(c) + "px";
  if(a.ua()) {
    b = a.ua() ? a.ua().firstChild : l, c = a.qc, c == i && g(Error("missing height argument")), b.style.width = Lc(a.Rc), b.style.height = Lc(c)
  }
}
p.Bb = function() {
  yf.k.Bb.call(this);
  var a = this.ua(), b;
  b = E ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = E ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = na(c, this.Ye), d = this.Eb.ga(), e = this.Eb.H(), f = [], h = 0;h < d.length;h++) {
    var j = pa(d[h]), k = pa(e[h]);
    f.push(j + "=" + k)
  }
  b = na(b, uf(this), uf(this), "goog-ui-media-flash-object", D(this.pe), D(f.join("&")), this.Tc, this.$d, c);
  a.innerHTML = b;
  this.Rc && this.qc && zf(this, this.Rc, this.qc);
  a = this.jc;
  b = this.ua();
  c = Ya(ob);
  s(c) || (qf[0] = c, c = qf);
  for(d = 0;d < c.length;d++) {
    a.g.push(Mb(b, c[d], qb || a, !1, a.te || a))
  }
};
p.Ya = function() {
  this.Kd != l && !(xa(of, this.Kd) >= 0) && (this.a.D("Required flash version not found:" + this.Kd), g(Error("Method not supported")));
  var a = this.fd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.l = a
};
p.c = function() {
  yf.k.c.call(this);
  this.Eb = l;
  this.jc.b();
  this.jc = l
};
function Af(a) {
  C.call(this, a)
}
B(Af, C);
Af.prototype.name = "cw.loadflash.FlashLoadFailed";
q.__loadFlashObject_callbacks = {};
function Bf(a, b, c) {
  function d() {
    e && delete q.__loadFlashObject_callbacks[e]
  }
  var e;
  if(Ja && !Ua("1.8.1.20")) {
    return gc(new Af("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(xa(of, "9") >= 0)) {
    return b = of, gc(new Af("Need Flash Player 9+; had " + (b ? b : "none")))
  }
  var f;
  e = "_" + Ad();
  var h = new M(d);
  q.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      cc(h, P(f))
    }, 0)
  };
  b.Eb.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  f = uf(b);
  vf(b, c);
  return h
}
function Cf(a, b, c) {
  var d = Bf(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  d.Sc(function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function Df() {
  if(Ja) {
    this.ra = {}, this.Xb = {}, this.Sb = []
  }
}
Df.prototype.a = T("goog.net.xhrMonitor");
Df.prototype.Ab = Ja;
function Ef(a) {
  var b = Ff;
  if(b.Ab) {
    var c = u(a) ? a : ga(a) ? v(a) : "";
    b.a.p("Pushing context: " + a + " (" + c + ")");
    b.Sb.push(c)
  }
}
function Gf() {
  var a = Ff;
  if(a.Ab) {
    var b = a.Sb.pop();
    a.a.p("Popping context: " + b);
    Hf(a, b)
  }
}
function If(a) {
  var b = Ff;
  if(b.Ab) {
    a = v(a);
    b.a.i("Opening XHR : " + a);
    for(var c = 0;c < b.Sb.length;c++) {
      var d = b.Sb[c];
      Jf(b.ra, d, a);
      Jf(b.Xb, a, d)
    }
  }
}
function Hf(a, b) {
  var c = a.Xb[b], d = a.ra[b];
  c && d && (a.a.p("Updating dependent contexts"), cb(c, function(a) {
    cb(d, function(b) {
      Jf(this.ra, a, b);
      Jf(this.Xb, b, a)
    }, this)
  }, a))
}
function Jf(a, b, c) {
  a[b] || (a[b] = []);
  bb(a[b], c) >= 0 || a[b].push(c)
}
var Ff = new Df;
function Kf() {
}
Kf.prototype.wb = l;
var Lf;
function Mf() {
}
B(Mf, Kf);
function Nf(a) {
  return(a = Of(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Pf(a) {
  var b = {};
  Of(a) && (b[0] = !0, b[1] = !0);
  return b
}
Mf.prototype.rc = l;
function Of(a) {
  if(!a.rc && typeof XMLHttpRequest == "undefined" && typeof ActiveXObject != "undefined") {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.rc = d
      }catch(e) {
      }
    }
    g(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.rc
}
Lf = new Mf;
function Qf(a) {
  this.headers = new Q;
  this.Ta = a || l
}
B(Qf, Wb);
Qf.prototype.a = T("goog.net.XhrIo");
var Rf = /^https?:?$/i;
p = Qf.prototype;
p.ca = !1;
p.e = l;
p.Wb = l;
p.hb = "";
p.qd = "";
p.eb = 0;
p.fb = "";
p.ic = !1;
p.Hb = !1;
p.sc = !1;
p.va = !1;
p.Tb = 0;
p.Aa = l;
p.Ld = "";
p.Xe = !1;
p.send = function(a, b, c, d) {
  this.e && g(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.hb = a;
  this.fb = "";
  this.eb = 0;
  this.qd = b;
  this.ic = !1;
  this.ca = !0;
  this.e = this.Ta ? Nf(this.Ta) : Nf(Lf);
  this.Wb = this.Ta ? this.Ta.wb || (this.Ta.wb = Pf(this.Ta)) : Lf.wb || (Lf.wb = Pf(Lf));
  If(this.e);
  this.e.onreadystatechange = x(this.Cd, this);
  try {
    this.a.i(Sf(this, "Opening Xhr")), this.sc = !0, this.e.open(b, a, !0), this.sc = !1
  }catch(e) {
    this.a.i(Sf(this, "Error opening Xhr: " + e.message));
    Tf(this, e);
    return
  }
  var a = c || "", f = this.headers.L();
  d && Qc(d, function(a, b) {
    f.set(b, a)
  });
  b == "POST" && !f.T("Content-Type") && f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  Qc(f, function(a, b) {
    this.e.setRequestHeader(b, a)
  }, this);
  if(this.Ld) {
    this.e.responseType = this.Ld
  }
  if("withCredentials" in this.e) {
    this.e.withCredentials = this.Xe
  }
  try {
    if(this.Aa) {
      Xb.clearTimeout(this.Aa), this.Aa = l
    }
    if(this.Tb > 0) {
      this.a.i(Sf(this, "Will abort after " + this.Tb + "ms if incomplete")), this.Aa = Xb.setTimeout(x(this.Te, this), this.Tb)
    }
    this.a.i(Sf(this, "Sending request"));
    this.Hb = !0;
    this.e.send(a);
    this.Hb = !1
  }catch(h) {
    this.a.i(Sf(this, "Send error: " + h.message)), Tf(this, h)
  }
};
p.dispatchEvent = function(a) {
  if(this.e) {
    Ef(this.e);
    try {
      return Qf.k.dispatchEvent.call(this, a)
    }finally {
      Gf()
    }
  }else {
    return Qf.k.dispatchEvent.call(this, a)
  }
};
p.Te = function() {
  if(typeof ca != "undefined" && this.e) {
    this.fb = "Timed out after " + this.Tb + "ms, aborting", this.eb = 8, this.a.i(Sf(this, this.fb)), this.dispatchEvent("timeout"), this.abort(8)
  }
};
function Tf(a, b) {
  a.ca = !1;
  if(a.e) {
    a.va = !0, a.e.abort(), a.va = !1
  }
  a.fb = b;
  a.eb = 5;
  Uf(a);
  Vf(a)
}
function Uf(a) {
  if(!a.ic) {
    a.ic = !0, a.dispatchEvent("complete"), a.dispatchEvent("error")
  }
}
p.abort = function(a) {
  if(this.e && this.ca) {
    this.a.i(Sf(this, "Aborting")), this.ca = !1, this.va = !0, this.e.abort(), this.va = !1, this.eb = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Vf(this)
  }
};
p.c = function() {
  if(this.e) {
    if(this.ca) {
      this.ca = !1, this.va = !0, this.e.abort(), this.va = !1
    }
    Vf(this, !0)
  }
  Qf.k.c.call(this)
};
p.Cd = function() {
  !this.sc && !this.Hb && !this.va ? this.Ee() : Xf(this)
};
p.Ee = function() {
  Xf(this)
};
function Xf(a) {
  if(a.ca && typeof ca != "undefined") {
    if(a.Wb[1] && a.ha() == 4 && Yf(a) == 2) {
      a.a.i(Sf(a, "Local request error detected and ignored"))
    }else {
      if(a.Hb && a.ha() == 4) {
        Xb.setTimeout(x(a.Cd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), a.ha() == 4) {
          a.a.i(Sf(a, "Request complete"));
          a.ca = !1;
          var b;
          a: {
            switch(Yf(a)) {
              case 0:
                b = u(a.hb) ? a.hb.match(de)[1] || l : a.hb.R;
                b = !(b ? Rf.test(b) : self.location ? Rf.test(self.location.protocol) : 1);
                break a;
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
                b = !0;
                break a;
              default:
                b = !1
            }
          }
          if(b) {
            a.dispatchEvent("complete"), a.dispatchEvent("success")
          }else {
            a.eb = 6;
            var c;
            try {
              c = a.ha() > 2 ? a.e.statusText : ""
            }catch(d) {
              a.a.i("Can not get status: " + d.message), c = ""
            }
            a.fb = c + " [" + Yf(a) + "]";
            Uf(a)
          }
          Vf(a)
        }
      }
    }
  }
}
function Vf(a, b) {
  if(a.e) {
    var c = a.e, d = a.Wb[0] ? ea : l;
    a.e = l;
    a.Wb = l;
    if(a.Aa) {
      Xb.clearTimeout(a.Aa), a.Aa = l
    }
    b || (Ef(c), a.dispatchEvent("ready"), Gf());
    var e = Ff;
    if(e.Ab) {
      var f = v(c);
      e.a.i("Closing XHR : " + f);
      delete e.Xb[f];
      for(var h in e.ra) {
        gb(e.ra[h], f), e.ra[h].length == 0 && delete e.ra[h]
      }
    }
    try {
      c.onreadystatechange = d
    }catch(j) {
      a.a.K("Problem encountered resetting onreadystatechange: " + j.message)
    }
  }
}
p.ha = function() {
  return this.e ? this.e.readyState : 0
};
function Yf(a) {
  try {
    return a.ha() > 2 ? a.e.status : -1
  }catch(b) {
    return a.a.D("Can not get status: " + b.message), -1
  }
}
p.getResponseHeader = function(a) {
  return this.e && this.ha() == 4 ? this.e.getResponseHeader(a) : i
};
function Sf(a, b) {
  return b + " [" + a.qd + " " + a.hb + " " + Yf(a) + "]"
}
;var Zf = !(E || F && !Ua("420+"));
function $f(a, b) {
  this.Ub = a;
  this.P = b
}
B($f, H);
p = $f.prototype;
p.m = l;
p.ma = -1;
p.jd = !1;
p.ld = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function ag(a) {
  var b = Me(a.Zc), c = b[0], b = b[1], d = q.parent;
  d ? (d.__XHRMaster_onframes(a.P, c, b), b != 1 && a.b()) : a.b()
}
p.ue = function() {
  ag(this);
  if(!this.Y) {
    var a = q.parent;
    a && a.__XHRMaster_oncomplete(this.P);
    this.b()
  }
};
p.He = function() {
  var a = q.parent;
  if(a) {
    this.ma = this.m.ha();
    if(this.ma >= 2 && !this.jd) {
      for(var b = new Q, c = this.ld.length;c--;) {
        var d = this.ld[c];
        try {
          b.set(d, this.m.e.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.G() && (this.jd = !0, a.__XHRMaster_ongotheaders(this.P, Vc(b)), this.Y)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.P, this.ma);
    Zf && this.ma == 3 && ag(this)
  }else {
    this.b()
  }
};
p.wc = function(a, b, c) {
  this.m = new Qf;
  Mb(this.m, "readystatechange", x(this.He, this));
  Mb(this.m, "complete", x(this.ue, this));
  this.m.send(a, b, c, {"Content-Type":"application/octet-stream"});
  this.Zc = new Le(this.m.e, 1048576)
};
p.c = function() {
  $f.k.c.call(this);
  delete this.Zc;
  this.m && this.m.b();
  delete this.Ub.qb[this.P];
  delete this.Ub
};
function bg() {
  this.qb = {}
}
B(bg, H);
bg.prototype.Ae = function(a, b, c, d) {
  var e = new $f(this, a);
  this.qb[a] = e;
  e.wc(b, c, d)
};
bg.prototype.je = function(a) {
  (a = this.qb[a]) && a.b()
};
bg.prototype.c = function() {
  bg.k.c.call(this);
  for(var a = Ya(this.qb);a.length;) {
    a.pop().b()
  }
  delete this.qb
};
var cg = new bg;
q.__XHRSlave_makeRequest = x(cg.Ae, cg);
q.__XHRSlave_dispose = x(cg.je, cg);
function dg(a) {
  var b = new yf("/compiled_client/FlashConnector.swf?cb=2ae8d8a79afe8f3a96bb49e8a9339914");
  b.Tc = "#777777";
  zf(b, 300, 30);
  var c = P("FlashConnectorSwf");
  c || g(Error("no FlashConnectorSwf?"));
  return Cf(a.C, b, c)
}
function eg(a, b, c) {
  var d = new fe(document.location);
  if(c) {
    var e = d.M, d = dg(a);
    d.vb(function(b) {
      b = new Ld(a, b);
      return new Re(e, 843, b)
    });
    return d
  }else {
    return b ? (b = q.__demo_shared_domain, d = d.L(), ie(d, "_____random_____." + b)) : d = d.L(), ke(d, "/httpface/"), le(d, "", i), d = new Se(d.toString().replace("_____random_____", "%random%")), fc(d)
  }
}
;y("Minerva.HttpEndpoint", Se);
y("Minerva.SocketEndpoint", Re);
y("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.se;
$.prototype.start = $.prototype.start;
$.prototype.sendStrings = $.prototype.Ke;
$.prototype.reset = $.prototype.reset;
y("Minerva.Logger", R);
R.Level = S;
R.getLogger = T;
R.prototype.setLevel = R.prototype.Fc;
R.prototype.shout = R.prototype.Ne;
R.prototype.severe = R.prototype.K;
R.prototype.warning = R.prototype.D;
R.prototype.info = R.prototype.info;
R.prototype.config = R.prototype.de;
R.prototype.fine = R.prototype.i;
R.prototype.finer = R.prototype.ne;
R.prototype.finest = R.prototype.p;
S.OFF = ed;
S.SHOUT = fd;
S.SEVERE = gd;
S.WARNING = id;
S.INFO = jd;
S.CONFIG = kd;
S.FINE = ld;
S.FINER = md;
S.FINEST = nd;
S.ALL = od;
y("Minerva.LogManager", U);
U.getRoot = U.oc;
y("Minerva.DivConsole", qd);
qd.prototype.setCapturing = qd.prototype.Me;
y("Minerva.bind", x);
y("Minerva.repr", O);
y("Minerva.theCallQueue", jc);
y("Minerva.getEndpointByQueryArgs", function(a) {
  var b;
  b = (new fe(document.location)).J;
  var c = b.get("mode") != "http";
  b = Boolean(Number(b.get("useSub", "1")));
  return eg(a, b, c)
});
M.prototype.addCallback = M.prototype.vb;
M.prototype.addErrback = M.prototype.Yd;
M.prototype.addBoth = M.prototype.Sc;
})();
