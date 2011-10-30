(function(){function g(a) {
  throw a;
}
var i = void 0, j = true, k = null, n = false;
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
var r, ca = ca || {}, s = this;
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
function u(a) {
  return t(a) == "array"
}
function v(a) {
  var b = t(a);
  return b == "array" || b == "object" && typeof a.length == "number"
}
function fa(a) {
  return ga(a) && typeof a.getFullYear == "function"
}
function w(a) {
  return typeof a == "string"
}
function ha(a) {
  return t(a) == "function"
}
function ga(a) {
  a = t(a);
  return a == "object" || a == "array" || a == "function"
}
function x(a) {
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
function z(a, b, c) {
  z = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? ka : la;
  return z.apply(k, arguments)
}
var ma = Date.now || function() {
  return+new Date
};
function A(a, b) {
  var c = a.split("."), d = s;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && b !== i ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
function D(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.k = b.prototype;
  a.prototype = new c
}
;function E(a) {
  this.stack = Error().stack || "";
  if(a) {
    this.message = String(a)
  }
}
D(E, Error);
E.prototype.name = "CustomError";
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
function F(a) {
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
    var l = d[h] || "", m = e[h] || "", p = RegExp("(\\d*)(\\D*)", "g"), B = RegExp("(\\d*)(\\D*)", "g");
    do {
      var q = p.exec(l) || ["", "", ""], y = B.exec(m) || ["", "", ""];
      if(q[0].length == 0 && y[0].length == 0) {
        break
      }
      c = ya(q[1].length == 0 ? 0 : parseInt(q[1], 10), y[1].length == 0 ? 0 : parseInt(y[1], 10)) || ya(q[2].length == 0, y[2].length == 0) || ya(q[2], y[2])
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
  E.call(this, na.apply(k, b));
  b.shift();
  this.eg = a
}
D(za, E);
za.prototype.name = "AssertionError";
function Aa(a, b) {
  g(new za("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;function Ba() {
  return j
}
;var Ca, Da, Ea, Fa;
function Ga() {
  return s.navigator ? s.navigator.userAgent : k
}
Fa = Ea = Da = Ca = n;
var Ha;
if(Ha = Ga()) {
  var Ia = s.navigator;
  Ca = Ha.indexOf("Opera") == 0;
  Da = !Ca && Ha.indexOf("MSIE") != -1;
  Ea = !Ca && Ha.indexOf("WebKit") != -1;
  Fa = !Ca && !Ea && Ia.product == "Gecko"
}
var G = Da, Ja = Fa, Ka = Ea, La = s.navigator, Ma = (La && La.platform || "").indexOf("Mac") != -1, Na;
a: {
  var Oa = "", Pa;
  if(Ca && s.opera) {
    var Qa = s.opera.version, Oa = typeof Qa == "function" ? Qa() : Qa
  }else {
    if(Ja ? Pa = /rv\:([^\);]+)(\)|;)/ : G ? Pa = /MSIE\s+([^\);]+)(\)|;)/ : Ka && (Pa = /WebKit\/(\S+)/), Pa) {
      var Ra = Pa.exec(Ga()), Oa = Ra ? Ra[1] : ""
    }
  }
  if(G) {
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
function Va(a) {
  return Ua[a] || (Ua[a] = xa(Na, a) >= 0)
}
var Wa = {};
function Xa() {
  return Wa[9] || (Wa[9] = G && document.documentMode && document.documentMode >= 9)
}
;function Ya(a, b) {
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
    for(var f = 0;f < ab.length;f++) {
      c = ab[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;!G || Xa();
var cb = !G || Xa();
G && Va("8");
var H = Array.prototype, db = H.indexOf ? function(a, b, c) {
  return H.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == k ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
  if(w(a)) {
    return!w(b) || b.length != 1 ? -1 : a.indexOf(b, c)
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
  for(var d = a.length, e = w(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
}, fb = H.map ? function(a, b, c) {
  return H.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = w(a) ? a.split("") : a, h = 0;h < d;h++) {
    h in f && (e[h] = b.call(c, f[h], h, a))
  }
  return e
}, gb = H.some ? function(a, b, c) {
  return H.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = w(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return j
    }
  }
  return n
}, hb = H.every ? function(a, b, c) {
  return H.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = w(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return n
    }
  }
  return j
};
function ib(a, b) {
  var c = db(a, b);
  c >= 0 && H.splice.call(a, c, 1)
}
function jb(a) {
  return H.concat.apply(H, arguments)
}
function kb(a) {
  if(u(a)) {
    return jb(a)
  }else {
    for(var b = [], c = 0, d = a.length;c < d;c++) {
      b[c] = a[c]
    }
    return b
  }
}
function lb(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(u(d) || (e = v(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, h = d.length, l = 0;l < h;l++) {
          a[f + l] = d[l]
        }
      }else {
        a.push(d)
      }
    }
  }
}
function mb(a, b, c) {
  return arguments.length <= 2 ? H.slice.call(a, b) : H.slice.call(a, b, c)
}
function nb(a, b) {
  H.sort.call(a, b || ob)
}
function ob(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;var pb = {hf:"click", nf:"dblclick", Hf:"mousedown", Lf:"mouseup", Kf:"mouseover", Jf:"mouseout", If:"mousemove", Vf:"selectstart", Cf:"keypress", Bf:"keydown", Df:"keyup", ff:"blur", vf:"focus", of:"deactivate", wf:G ? "focusin" : "DOMFocusIn", xf:G ? "focusout" : "DOMFocusOut", gf:"change", Uf:"select", Wf:"submit", Af:"input", Qf:"propertychange", sf:"dragstart", pf:"dragenter", rf:"dragover", qf:"dragleave", tf:"drop", $f:"touchstart", Zf:"touchmove", Yf:"touchend", Xf:"touchcancel", kf:"contextmenu", 
uf:"error", zf:"help", Ef:"load", Ff:"losecapture", Rf:"readystatechange", Sf:"resize", Tf:"scroll", ag:"unload", yf:"hashchange", Mf:"pagehide", Nf:"pageshow", Pf:"popstate", lf:"copy", Of:"paste", mf:"cut", cf:"beforecopy", df:"beforecut", ef:"beforepaste", Gf:"message", jf:"connect"};
function I() {
}
I.prototype.Y = n;
I.prototype.b = function() {
  if(!this.Y) {
    this.Y = j, this.c()
  }
};
I.prototype.c = function() {
  this.je && qb.apply(k, this.je)
};
function qb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    v(d) ? qb.apply(k, d) : d && typeof d.b == "function" && d.b()
  }
}
;function J(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
D(J, I);
J.prototype.c = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
J.prototype.xa = n;
J.prototype.Pb = j;
J.prototype.stopPropagation = function() {
  this.xa = j
};
function rb(a) {
  a.stopPropagation()
}
;function sb(a) {
  sb[" "](a);
  return a
}
sb[" "] = ea;
function tb(a, b) {
  a && this.Hb(a, b)
}
D(tb, J);
r = tb.prototype;
r.target = k;
r.relatedTarget = k;
r.offsetX = 0;
r.offsetY = 0;
r.clientX = 0;
r.clientY = 0;
r.screenX = 0;
r.screenY = 0;
r.button = 0;
r.keyCode = 0;
r.charCode = 0;
r.ctrlKey = n;
r.altKey = n;
r.shiftKey = n;
r.metaKey = n;
r.He = n;
r.$a = k;
r.Hb = function(a, b) {
  var c = this.type = a.type;
  J.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Ja) {
      var e;
      a: {
        try {
          sb(d.nodeName);
          e = j;
          break a
        }catch(f) {
        }
        e = n
      }
      e || (d = k)
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
  this.He = Ma ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.$a = a;
  delete this.Pb;
  delete this.xa
};
r.stopPropagation = function() {
  tb.k.stopPropagation.call(this);
  this.$a.stopPropagation ? this.$a.stopPropagation() : this.$a.cancelBubble = j
};
r.c = function() {
  tb.k.c.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.$a = k
};
function ub() {
}
var vb = 0;
r = ub.prototype;
r.key = 0;
r.Oa = n;
r.ac = n;
r.Hb = function(a, b, c, d, e, f) {
  ha(a) ? this.qd = j : a && a.handleEvent && ha(a.handleEvent) ? this.qd = n : g(Error("Invalid listener argument"));
  this.ib = a;
  this.Hd = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.qc = f;
  this.ac = n;
  this.key = ++vb;
  this.Oa = n
};
r.handleEvent = function(a) {
  return this.qd ? this.ib.call(this.qc || this.src, a) : this.ib.handleEvent.call(this.ib, a)
};
var wb, xb = (wb = "ScriptEngine" in s && s.ScriptEngine() == "JScript") ? s.ScriptEngineMajorVersion() + "." + s.ScriptEngineMinorVersion() + "." + s.ScriptEngineBuildVersion() : "0";
function K(a, b) {
  this.vd = b;
  this.ta = [];
  a > this.vd && g(Error("[goog.structs.SimplePool] Initial cannot be greater than max"));
  for(var c = 0;c < a;c++) {
    this.ta.push(this.X ? this.X() : {})
  }
}
D(K, I);
K.prototype.X = k;
K.prototype.cd = k;
function yb(a) {
  return a.ta.length ? a.ta.pop() : a.X ? a.X() : {}
}
function zb(a, b) {
  a.ta.length < a.vd ? a.ta.push(b) : Ab(a, b)
}
function Ab(a, b) {
  if(a.cd) {
    a.cd(b)
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
K.prototype.c = function() {
  K.k.c.call(this);
  for(var a = this.ta;a.length;) {
    Ab(this, a.pop())
  }
  delete this.ta
};
var Bb, Cb, Db, Eb, Fb, Gb, Hb, Ib, Jb, Kb, Lb;
(function() {
  function a() {
    return{d:0, O:0}
  }
  function b() {
    return[]
  }
  function c() {
    var a = cb ? function(b) {
      return h.call(a.src, a.key, b)
    } : function(b) {
      b = h.call(a.src, a.key, b);
      if(!b) {
        return b
      }
    };
    return a
  }
  function d() {
    return new ub
  }
  function e() {
    return new tb
  }
  var f = wb && !(xa(xb, "5.7") >= 0), h;
  Gb = function(a) {
    h = a
  };
  if(f) {
    Bb = function() {
      return yb(l)
    };
    Cb = function(a) {
      zb(l, a)
    };
    Db = function() {
      return yb(m)
    };
    Eb = function(a) {
      zb(m, a)
    };
    Fb = function() {
      return yb(p)
    };
    Hb = function() {
      zb(p, c())
    };
    Ib = function() {
      return yb(B)
    };
    Jb = function(a) {
      zb(B, a)
    };
    Kb = function() {
      return yb(q)
    };
    Lb = function(a) {
      zb(q, a)
    };
    var l = new K(0, 600);
    l.X = a;
    var m = new K(0, 600);
    m.X = b;
    var p = new K(0, 600);
    p.X = c;
    var B = new K(0, 600);
    B.X = d;
    var q = new K(0, 600);
    q.X = e
  }else {
    Bb = a, Cb = ea, Db = b, Eb = ea, Fb = c, Hb = ea, Ib = d, Jb = ea, Kb = e, Lb = ea
  }
})();
var Mb = {}, L = {}, Nb = {}, Ob = {};
function Pb(a, b, c, d, e) {
  if(b) {
    if(u(b)) {
      for(var f = 0;f < b.length;f++) {
        Pb(a, b[f], c, d, e)
      }
      return k
    }else {
      var d = !!d, h = L;
      b in h || (h[b] = Bb());
      h = h[b];
      d in h || (h[d] = Bb(), h.d++);
      var h = h[d], l = x(a), m;
      h.O++;
      if(h[l]) {
        m = h[l];
        for(f = 0;f < m.length;f++) {
          if(h = m[f], h.ib == c && h.qc == e) {
            if(h.Oa) {
              break
            }
            return m[f].key
          }
        }
      }else {
        m = h[l] = Db(), h.d++
      }
      f = Fb();
      f.src = a;
      h = Ib();
      h.Hb(c, f, a, b, d, e);
      c = h.key;
      f.key = c;
      m.push(h);
      Mb[c] = h;
      Nb[l] || (Nb[l] = Db());
      Nb[l].push(h);
      a.addEventListener ? (a == s || !a.Zc) && a.addEventListener(b, f, d) : a.attachEvent(b in Ob ? Ob[b] : Ob[b] = "on" + b, f);
      return c
    }
  }else {
    g(Error("Invalid event type"))
  }
}
function Qb(a, b, c, d, e) {
  if(u(b)) {
    for(var f = 0;f < b.length;f++) {
      Qb(a, b[f], c, d, e)
    }
    return k
  }
  a = Pb(a, b, c, d, e);
  Mb[a].ac = j;
  return a
}
function Rb(a, b, c, d, e) {
  if(u(b)) {
    for(var f = 0;f < b.length;f++) {
      Rb(a, b[f], c, d, e)
    }
  }else {
    d = !!d;
    a: {
      f = L;
      if(b in f && (f = f[b], d in f && (f = f[d], a = x(a), f[a]))) {
        a = f[a];
        break a
      }
      a = k
    }
    if(a) {
      for(f = 0;f < a.length;f++) {
        if(a[f].ib == c && a[f].capture == d && a[f].qc == e) {
          Sb(a[f].key);
          break
        }
      }
    }
  }
}
function Sb(a) {
  if(!Mb[a]) {
    return n
  }
  var b = Mb[a];
  if(b.Oa) {
    return n
  }
  var c = b.src, d = b.type, e = b.Hd, f = b.capture;
  c.removeEventListener ? (c == s || !c.Zc) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in Ob ? Ob[d] : Ob[d] = "on" + d, e);
  c = x(c);
  e = L[d][f][c];
  if(Nb[c]) {
    var h = Nb[c];
    ib(h, b);
    h.length == 0 && delete Nb[c]
  }
  b.Oa = j;
  e.Bd = j;
  Tb(d, f, c, e);
  delete Mb[a];
  return j
}
function Tb(a, b, c, d) {
  if(!d.Jb && d.Bd) {
    for(var e = 0, f = 0;e < d.length;e++) {
      if(d[e].Oa) {
        var h = d[e].Hd;
        h.src = k;
        Hb(h);
        Jb(d[e])
      }else {
        e != f && (d[f] = d[e]), f++
      }
    }
    d.length = f;
    d.Bd = n;
    f == 0 && (Eb(d), delete L[a][b][c], L[a][b].d--, L[a][b].d == 0 && (Cb(L[a][b]), delete L[a][b], L[a].d--), L[a].d == 0 && (Cb(L[a]), delete L[a]))
  }
}
function Ub(a) {
  var b, c = 0, d = b == k;
  b = !!b;
  if(a == k) {
    Ya(Nb, function(a) {
      for(var e = a.length - 1;e >= 0;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Sb(f.key), c++
        }
      }
    })
  }else {
    if(a = x(a), Nb[a]) {
      for(var a = Nb[a], e = a.length - 1;e >= 0;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Sb(f.key), c++
        }
      }
    }
  }
}
function Vb(a, b, c, d, e) {
  var f = 1, b = x(b);
  if(a[b]) {
    a.O--;
    a = a[b];
    a.Jb ? a.Jb++ : a.Jb = 1;
    try {
      for(var h = a.length, l = 0;l < h;l++) {
        var m = a[l];
        m && !m.Oa && (f &= Wb(m, e) !== n)
      }
    }finally {
      a.Jb--, Tb(c, d, b, a)
    }
  }
  return Boolean(f)
}
function Wb(a, b) {
  var c = a.handleEvent(b);
  a.ac && Sb(a.key);
  return c
}
Gb(function(a, b) {
  if(!Mb[a]) {
    return j
  }
  var c = Mb[a], d = c.type, e = L;
  if(!(d in e)) {
    return j
  }
  var e = e[d], f, h;
  if(!cb) {
    f = b || da("window.event");
    var l = j in e, m = n in e;
    if(l) {
      if(f.keyCode < 0 || f.returnValue != i) {
        return j
      }
      a: {
        var p = n;
        if(f.keyCode == 0) {
          try {
            f.keyCode = -1;
            break a
          }catch(B) {
            p = j
          }
        }
        if(p || f.returnValue == i) {
          f.returnValue = j
        }
      }
    }
    p = Kb();
    p.Hb(f, this);
    f = j;
    try {
      if(l) {
        for(var q = Db(), y = p.currentTarget;y;y = y.parentNode) {
          q.push(y)
        }
        h = e[j];
        h.O = h.d;
        for(var C = q.length - 1;!p.xa && C >= 0 && h.O;C--) {
          p.currentTarget = q[C], f &= Vb(h, q[C], d, j, p)
        }
        if(m) {
          h = e[n];
          h.O = h.d;
          for(C = 0;!p.xa && C < q.length && h.O;C++) {
            p.currentTarget = q[C], f &= Vb(h, q[C], d, n, p)
          }
        }
      }else {
        f = Wb(c, p)
      }
    }finally {
      if(q) {
        q.length = 0, Eb(q)
      }
      p.b();
      Lb(p)
    }
    return f
  }
  d = new tb(b, this);
  try {
    f = Wb(c, d)
  }finally {
    d.b()
  }
  return f
});
var Xb = 0;
function Zb() {
}
D(Zb, I);
r = Zb.prototype;
r.Zc = j;
r.Mb = k;
r.Hc = aa("Mb");
r.addEventListener = function(a, b, c, d) {
  Pb(this, a, b, c, d)
};
r.removeEventListener = function(a, b, c, d) {
  Rb(this, a, b, c, d)
};
r.dispatchEvent = function(a) {
  var b = a.type || a, c = L;
  if(b in c) {
    if(w(a)) {
      a = new J(a, this)
    }else {
      if(a instanceof J) {
        a.target = a.target || this
      }else {
        var d = a, a = new J(b, this);
        bb(a, d)
      }
    }
    var d = 1, e, c = c[b], b = j in c, f;
    if(b) {
      e = [];
      for(f = this;f;f = f.Mb) {
        e.push(f)
      }
      f = c[j];
      f.O = f.d;
      for(var h = e.length - 1;!a.xa && h >= 0 && f.O;h--) {
        a.currentTarget = e[h], d &= Vb(f, e[h], a.type, j, a) && a.Pb != n
      }
    }
    if(n in c) {
      if(f = c[n], f.O = f.d, b) {
        for(h = 0;!a.xa && h < e.length && f.O;h++) {
          a.currentTarget = e[h], d &= Vb(f, e[h], a.type, n, a) && a.Pb != n
        }
      }else {
        for(e = this;!a.xa && e && f.O;e = e.Mb) {
          a.currentTarget = e, d &= Vb(f, e, a.type, n, a) && a.Pb != n
        }
      }
    }
    a = Boolean(d)
  }else {
    a = j
  }
  return a
};
r.c = function() {
  Zb.k.c.call(this);
  Ub(this);
  this.Mb = k
};
var $b = s.window;
Xb++;
Xb++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function M(a, b) {
  this.xb = [];
  this.Vc = a;
  this.ad = b || k
}
r = M.prototype;
r.fa = n;
r.ab = n;
r.jb = 0;
r.Ic = n;
r.ee = n;
r.$b = 0;
r.cancel = function(a) {
  if(this.fa) {
    this.nb instanceof M && this.nb.cancel()
  }else {
    if(this.t) {
      var b = this.t;
      delete this.t;
      a ? b.cancel(a) : (b.$b--, b.$b <= 0 && b.cancel())
    }
    this.Vc ? this.Vc.call(this.ad, this) : this.Ic = j;
    this.fa || this.Za(new ac(this))
  }
};
r.Xc = function(a, b) {
  bc(this, a, b);
  this.jb--;
  this.jb == 0 && this.fa && cc(this)
};
function bc(a, b, c) {
  a.fa = j;
  a.nb = c;
  a.ab = !b;
  cc(a)
}
function dc(a) {
  if(a.fa) {
    a.Ic || g(new ec(a)), a.Ic = n
  }
}
function fc(a, b) {
  dc(a);
  bc(a, j, b)
}
r.Za = function(a) {
  dc(this);
  bc(this, n, a)
};
r.vb = function(a, b) {
  return gc(this, a, k, b)
};
r.Zd = function(a, b) {
  return gc(this, k, a, b)
};
function gc(a, b, c, d) {
  a.xb.push([b, c, d]);
  a.fa && cc(a);
  return a
}
r.Tc = function(a, b) {
  return gc(this, a, a, b)
};
function hc(a) {
  return gb(a.xb, function(a) {
    return ha(a[1])
  })
}
function cc(a) {
  a.Pc && a.fa && hc(a) && (s.clearTimeout(a.Pc), delete a.Pc);
  a.t && (a.t.$b--, delete a.t);
  for(var b = a.nb, c = n, d = n;a.xb.length && a.jb == 0;) {
    var e = a.xb.shift(), f = e[0], h = e[1], e = e[2];
    if(f = a.ab ? h : f) {
      try {
        var l = f.call(e || a.ad, b);
        if(l !== i) {
          a.ab = a.ab && (l == b || l instanceof Error), a.nb = b = l
        }
        b instanceof M && (d = j, a.jb++)
      }catch(m) {
        b = m, a.ab = j, hc(a) || (c = j)
      }
    }
  }
  a.nb = b;
  if(d && a.jb) {
    gc(b, z(a.Xc, a, j), z(a.Xc, a, n)), b.ee = j
  }
  if(c) {
    a.Pc = s.setTimeout(function() {
      b.message !== i && b.stack && (b.message += "\n" + b.stack);
      g(b)
    }, 0)
  }
}
function ic(a) {
  var b = new M;
  fc(b, a);
  return b
}
function jc(a) {
  var b = new M;
  b.Za(a);
  return b
}
function ec(a) {
  E.call(this);
  this.ie = a
}
D(ec, E);
ec.prototype.message = "Already called";
function ac(a) {
  E.call(this);
  this.ie = a
}
D(ac, E);
ac.prototype.message = "Deferred was cancelled";
function kc(a) {
  this.C = a;
  this.Bb = [];
  this.dd = [];
  this.de = z(this.Xe, this)
}
kc.prototype.Nc = k;
function lc(a, b, c, d) {
  a.Bb.push([b, c, d]);
  if(a.Nc == k) {
    a.Nc = a.C.setTimeout(a.de, 0)
  }
}
kc.prototype.Xe = function() {
  this.Nc = k;
  var a = this.Bb;
  this.Bb = [];
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
  if(this.Bb.length == 0) {
    a = this.dd;
    this.dd = [];
    for(b = 0;b < a.length;b++) {
      fc(a[b], k)
    }
  }
};
var mc = new kc(s.window);
function nc(a) {
  return ha(a) || typeof a == "object" && ha(a.call) && ha(a.apply)
}
;function oc() {
  this.Ob = i
}
function pc(a) {
  var b = [];
  qc(new oc, a, b);
  return b.join("")
}
function qc(a, b, c) {
  switch(typeof b) {
    case "string":
      rc(b, c);
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
      if(u(b)) {
        var d = b.length;
        c.push("[");
        for(var e = "", f = 0;f < d;f++) {
          c.push(e), e = b[f], qc(a, a.Ob ? a.Ob.call(b, String(f), e) : e, c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(f in b) {
        Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], typeof e != "function" && (c.push(d), rc(f, c), c.push(":"), qc(a, a.Ob ? a.Ob.call(b, f, e) : e, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var sc = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"}, tc = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function rc(a, b) {
  b.push('"', a.replace(tc, function(a) {
    if(a in sc) {
      return sc[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    b < 16 ? e += "000" : b < 256 ? e += "00" : b < 4096 && (e += "0");
    return sc[a] = e + b.toString(16)
  }), '"')
}
;function uc(a, b, c) {
  var d = db(c, a);
  if(d != -1) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = t(a);
    if(d == "boolean" || d == "number" || d == "null" || d == "undefined") {
      b.push(String(a))
    }else {
      if(d == "string") {
        rc(a, b)
      }else {
        if(nc(a.n)) {
          a.n(b, c)
        }else {
          if(nc(a.Yd)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if(d == "array") {
                d = a.length;
                b.push("[");
                for(var e = "", f = 0;f < d;f++) {
                  b.push(e), uc(a[f], b, c), e = ", "
                }
                b.push("]")
              }else {
                if(d == "object") {
                  if(fa(a) && typeof a.valueOf == "function") {
                    b.push("new Date(", String(a.valueOf()), ")")
                  }else {
                    for(var d = $a(a).concat(ab), e = {}, h = f = 0;h < d.length;) {
                      var l = d[h++], m = ga(l) ? "o" + x(l) : (typeof l).charAt(0) + l;
                      Object.prototype.hasOwnProperty.call(e, m) || (e[m] = j, d[f++] = l)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      f = d[h], Object.prototype.hasOwnProperty.call(a, f) && (l = a[f], b.push(e), rc(f, b), b.push(": "), uc(l, b, c), e = ", ")
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
  uc(a, b, c)
}
function O(a, b) {
  var c = [];
  N(a, c, b);
  return c.join("")
}
;function vc() {
  this.Jd = ma()
}
var wc = new vc;
vc.prototype.set = aa("Jd");
vc.prototype.reset = function() {
  this.set(ma())
};
vc.prototype.get = o("Jd");
function xc(a) {
  this.Ie = a || "";
  this.Se = wc
}
xc.prototype.Pd = j;
xc.prototype.Re = j;
xc.prototype.Qe = j;
xc.prototype.Qd = n;
function yc(a) {
  return a < 10 ? "0" + a : String(a)
}
function zc(a, b) {
  var c = (a.Sd - b) / 1E3, d = c.toFixed(3), e = 0;
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
function Ac(a) {
  xc.call(this, a)
}
D(Ac, xc);
Ac.prototype.Qd = j;
var Bc;
function Cc(a, b) {
  var c;
  c = (c = a.className) && typeof c.split == "function" ? c.split(/\s+/) : [];
  var d = mb(arguments, 1), e;
  e = c;
  for(var f = 0, h = 0;h < d.length;h++) {
    db(e, d[h]) >= 0 || (e.push(d[h]), f++)
  }
  e = f == d.length;
  a.className = c.join(" ");
  return e
}
;var Dc = !G || Xa();
!Ja && !G || G && Xa() || Ja && Va("1.9.1");
G && Va("9");
function Ec(a) {
  return a ? new Fc(a.nodeType == 9 ? a : a.ownerDocument || a.document) : Bc || (Bc = new Fc)
}
function P(a) {
  return w(a) ? document.getElementById(a) : a
}
function Gc(a, b) {
  var c = b && b != "*" ? b.toUpperCase() : "";
  return a.querySelectorAll && a.querySelector && (!Ka || document.compatMode == "CSS1Compat" || Va("528")) && c ? a.querySelectorAll(c + "") : a.getElementsByTagName(c || "*")
}
function Hc(a, b) {
  Ya(b, function(b, d) {
    d == "style" ? a.style.cssText = b : d == "class" ? a.className = b : d == "for" ? a.htmlFor = b : d in Ic ? a.setAttribute(Ic[d], b) : d.lastIndexOf("aria-", 0) == 0 ? a.setAttribute(d, b) : a[d] = b
  })
}
var Ic = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
function Jc(a, b, c) {
  return Kc(document, arguments)
}
function Kc(a, b) {
  var c = b[0], d = b[1];
  if(!Dc && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', F(d.name), '"');
    if(d.type) {
      c.push(' type="', F(d.type), '"');
      var e = {};
      bb(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  if(d) {
    w(d) ? c.className = d : u(d) ? Cc.apply(k, [c].concat(d)) : Hc(c, d)
  }
  b.length > 2 && Lc(a, c, b, 2);
  return c
}
function Lc(a, b, c, d) {
  function e(c) {
    c && b.appendChild(w(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    v(f) && !(ga(f) && f.nodeType > 0) ? eb(Mc(f) ? kb(f) : f, e) : e(f)
  }
}
function Nc(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function Mc(a) {
  if(a && typeof a.length == "number") {
    if(ga(a)) {
      return typeof a.item == "function" || typeof a.item == "string"
    }else {
      if(ha(a)) {
        return typeof a.item == "function"
      }
    }
  }
  return n
}
function Fc(a) {
  this.ea = a || s.document || document
}
r = Fc.prototype;
r.gd = Ec;
r.ua = function(a) {
  return w(a) ? this.ea.getElementById(a) : a
};
r.Ya = function(a, b, c) {
  return Kc(this.ea, arguments)
};
r.createElement = function(a) {
  return this.ea.createElement(a)
};
r.createTextNode = function(a) {
  return this.ea.createTextNode(a)
};
r.appendChild = function(a, b) {
  a.appendChild(b)
};
r.append = function(a, b) {
  Lc(a.nodeType == 9 ? a : a.ownerDocument || a.document, a, arguments, 1)
};
r.contains = function(a, b) {
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
function Oc(a) {
  typeof a == "number" && (a = Math.round(a) + "px");
  return a
}
function Pc(a) {
  G ? a.cssText = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}" : a[Ka ? "innerText" : "innerHTML"] = ".dbg-sev{color:#F00}.dbg-w{color:#C40}.dbg-sh{font-weight:bold;color:#000}.dbg-i{color:#444}.dbg-f{color:#999}.dbg-ev{color:#0A0}.dbg-m{color:#990}.logmsg{border-bottom:1px solid #CCC;padding:2px}.logsep{background-color: #8C8;}.logdiv{border:1px solid #CCC;background-color:#FCFCFC;font:medium monospace}"
}
;function Qc(a) {
  if(typeof a.G == "function") {
    a = a.G()
  }else {
    if(v(a) || w(a)) {
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
function Rc(a) {
  if(typeof a.H == "function") {
    return a.H()
  }
  if(w(a)) {
    return a.split("")
  }
  if(v(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return Za(a)
}
function Sc(a) {
  if(typeof a.ga == "function") {
    return a.ga()
  }
  if(typeof a.H != "function") {
    if(v(a) || w(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return $a(a)
  }
}
function Tc(a, b, c) {
  if(typeof a.forEach == "function") {
    a.forEach(b, c)
  }else {
    if(v(a) || w(a)) {
      eb(a, b, c)
    }else {
      for(var d = Sc(a), e = Rc(a), f = e.length, h = 0;h < f;h++) {
        b.call(c, e[h], d && d[h], a)
      }
    }
  }
}
function Uc(a, b) {
  if(typeof a.every == "function") {
    return a.every(b, i)
  }
  if(v(a) || w(a)) {
    return hb(a, b, i)
  }
  for(var c = Sc(a), d = Rc(a), e = d.length, f = 0;f < e;f++) {
    if(!b.call(i, d[f], c && c[f], a)) {
      return n
    }
  }
  return j
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
r = Q.prototype;
r.d = 0;
r.Rc = 0;
r.G = o("d");
r.H = function() {
  Vc(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.j[this.g[b]])
  }
  return a
};
r.ga = function() {
  Vc(this);
  return this.g.concat()
};
r.T = function(a) {
  return Wc(this.j, a)
};
r.dc = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(Wc(this.j, c) && this.j[c] == a) {
      return j
    }
  }
  return n
};
r.o = function(a, b) {
  if(this === a) {
    return j
  }
  if(this.d != a.G()) {
    return n
  }
  var c = b || Xc;
  Vc(this);
  for(var d, e = 0;d = this.g[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return n
    }
  }
  return j
};
function Xc(a, b) {
  return a === b
}
r.cb = function() {
  return this.d == 0
};
r.clear = function() {
  this.j = {};
  this.Rc = this.d = this.g.length = 0
};
r.remove = function(a) {
  return Wc(this.j, a) ? (delete this.j[a], this.d--, this.Rc++, this.g.length > 2 * this.d && Vc(this), j) : n
};
function Vc(a) {
  if(a.d != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      Wc(a.j, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.d != a.g.length) {
    for(var e = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], Wc(e, d) || (a.g[c++] = d, e[d] = 1), b++
    }
    a.g.length = c
  }
}
r.get = function(a, b) {
  return Wc(this.j, a) ? this.j[a] : b
};
r.set = function(a, b) {
  Wc(this.j, a) || (this.d++, this.g.push(a), this.Rc++);
  this.j[a] = b
};
r.Zb = function(a) {
  var b;
  a instanceof Q ? (b = a.ga(), a = a.H()) : (b = $a(a), a = Za(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
r.L = function() {
  return new Q(this)
};
function Yc(a) {
  Vc(a);
  for(var b = {}, c = 0;c < a.g.length;c++) {
    var d = a.g[c];
    b[d] = a.j[d]
  }
  return b
}
function Wc(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function Zc(a) {
  this.j = new Q;
  a && this.Zb(a)
}
function $c(a) {
  var b = typeof a;
  return b == "object" && a || b == "function" ? "o" + x(a) : b.substr(0, 1) + a
}
r = Zc.prototype;
r.G = function() {
  return this.j.G()
};
r.add = function(a) {
  this.j.set($c(a), a)
};
r.Zb = function(a) {
  for(var a = Rc(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
r.Ec = function(a) {
  for(var a = Rc(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
r.remove = function(a) {
  return this.j.remove($c(a))
};
r.clear = function() {
  this.j.clear()
};
r.cb = function() {
  return this.j.cb()
};
r.contains = function(a) {
  return this.j.T($c(a))
};
r.H = function() {
  return this.j.H()
};
r.L = function() {
  return new Zc(this)
};
r.o = function(a) {
  return this.G() == Qc(a) && ad(this, a)
};
function ad(a, b) {
  var c = Qc(b);
  if(a.G() > c) {
    return n
  }
  !(b instanceof Zc) && c > 5 && (b = new Zc(b));
  return Uc(a, function(a) {
    if(typeof b.contains == "function") {
      a = b.contains(a)
    }else {
      if(typeof b.dc == "function") {
        a = b.dc(a)
      }else {
        if(v(b) || w(b)) {
          a = db(b, a) >= 0
        }else {
          a: {
            for(var c in b) {
              if(b[c] == a) {
                a = j;
                break a
              }
            }
            a = n
          }
        }
      }
    }
    return a
  })
}
;function bd(a) {
  return cd(a || arguments.callee.caller, [])
}
function cd(a, b) {
  var c = [];
  if(db(b, a) >= 0) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < 50) {
      c.push(dd(a) + "(");
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
            f = (f = dd(f)) ? f : "[fn]";
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
        c.push(cd(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function dd(a) {
  if(ed[a]) {
    return ed[a]
  }
  a = String(a);
  if(!ed[a]) {
    var b = /function ([^\(]+)/.exec(a);
    ed[a] = b ? b[1] : "[Anonymous]"
  }
  return ed[a]
}
var ed = {};
function fd(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
fd.prototype.Ne = 0;
fd.prototype.mc = k;
fd.prototype.lc = k;
var gd = 0;
fd.prototype.reset = function(a, b, c, d, e) {
  this.Ne = typeof e == "number" ? e : gd++;
  this.Sd = d || ma();
  this.La = a;
  this.zd = b;
  this.Be = c;
  delete this.mc;
  delete this.lc
};
fd.prototype.Gc = aa("La");
function R(a) {
  this.Ee = a
}
R.prototype.t = k;
R.prototype.La = k;
R.prototype.da = k;
R.prototype.Ga = k;
function S(a, b) {
  this.name = a;
  this.value = b
}
S.prototype.toString = o("name");
var hd = new S("OFF", Infinity), id = new S("SHOUT", 1200), kd = new S("SEVERE", 1E3), ld = new S("WARNING", 900), md = new S("INFO", 800), nd = new S("CONFIG", 700), od = new S("FINE", 500), pd = new S("FINER", 400), qd = new S("FINEST", 300), rd = new S("ALL", 0);
function T(a) {
  return U.jd(a)
}
r = R.prototype;
r.getParent = o("t");
r.Gc = aa("La");
function sd(a) {
  if(a.La) {
    return a.La
  }
  if(a.t) {
    return sd(a.t)
  }
  Aa("Root logger has no level set.");
  return k
}
r.log = function(a, b, c) {
  if(a.value >= sd(this).value) {
    a = this.te(a, b, c);
    b = "log:" + a.zd;
    s.console && (s.console.timeStamp ? s.console.timeStamp(b) : s.console.markTimeline && s.console.markTimeline(b));
    s.msWriteProfilerMark && s.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.Ga) {
        for(var e = 0, f = i;f = c.Ga[e];e++) {
          f(d)
        }
      }
      b = b.getParent()
    }
  }
};
r.te = function(a, b, c) {
  var d = new fd(a, String(b), this.Ee);
  if(c) {
    d.mc = c;
    var e;
    var f = arguments.callee.caller;
    try {
      var h;
      var l = da("window.location.href");
      if(w(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:l, stack:"Not available"}
      }else {
        var m, p, B = n;
        try {
          m = c.lineNumber || c.Ae || "Not available"
        }catch(q) {
          m = "Not available", B = j
        }
        try {
          p = c.fileName || c.filename || c.sourceURL || l
        }catch(y) {
          p = "Not available", B = j
        }
        h = B || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:m, fileName:p, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + F(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + F(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + F(bd(f) + "-> ")
    }catch(C) {
      e = "Exception trying to expose exception! You win, we lose. " + C
    }
    d.lc = e
  }
  return d
};
r.Pe = function(a, b) {
  this.log(id, a, b)
};
r.K = function(a, b) {
  this.log(kd, a, b)
};
r.D = function(a, b) {
  this.log(ld, a, b)
};
r.info = function(a, b) {
  this.log(md, a, b)
};
r.fe = function(a, b) {
  this.log(nd, a, b)
};
r.i = function(a, b) {
  this.log(od, a, b)
};
r.pe = function(a, b) {
  this.log(pd, a, b)
};
r.p = function(a, b) {
  this.log(qd, a, b)
};
var U = {Kb:{}, ob:k};
U.od = function() {
  if(!U.ob) {
    U.ob = new R(""), U.Kb[""] = U.ob, U.ob.Gc(nd)
  }
};
U.cg = function() {
  return U.Kb
};
U.pc = function() {
  U.od();
  return U.ob
};
U.jd = function(a) {
  U.od();
  return U.Kb[a] || U.he(a)
};
U.bg = function(a) {
  return function(b) {
    (a || U.pc()).K("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.Ae + ")")
  }
};
U.he = function(a) {
  var b = new R(a), c = a.lastIndexOf("."), d = a.substr(c + 1), c = U.jd(a.substr(0, c));
  if(!c.da) {
    c.da = {}
  }
  c.da[d] = b;
  b.t = c;
  return U.Kb[a] = b
};
function td(a) {
  this.Id = z(this.$d, this);
  this.fd = new Ac;
  this.pd = this.fd.Pd = n;
  this.l = a;
  this.ne = this.l.ownerDocument || this.l.document;
  var a = Ec(this.l), b = k;
  if(G) {
    b = a.ea.createStyleSheet(), Pc(b)
  }else {
    var c = Gc(a.ea, "head")[0];
    c || (b = Gc(a.ea, "body")[0], c = a.Ya("head"), b.parentNode.insertBefore(c, b));
    b = a.Ya("style");
    Pc(b);
    a.appendChild(c, b)
  }
  this.l.className += " logdiv"
}
td.prototype.Oe = function(a) {
  if(a != this.pd) {
    var b = U.pc();
    if(a) {
      var c = this.Id;
      if(!b.Ga) {
        b.Ga = []
      }
      b.Ga.push(c)
    }else {
      (b = b.Ga) && ib(b, this.Id), this.dg = ""
    }
    this.pd = a
  }
};
td.prototype.$d = function(a) {
  var b = this.l.scrollHeight - this.l.scrollTop - this.l.clientHeight <= 100, c = this.ne.createElement("div");
  c.className = "logmsg";
  var d = this.fd, e;
  switch(a.La.value) {
    case id.value:
      e = "dbg-sh";
      break;
    case kd.value:
      e = "dbg-sev";
      break;
    case ld.value:
      e = "dbg-w";
      break;
    case md.value:
      e = "dbg-i";
      break;
    default:
      e = "dbg-f"
  }
  var f = [];
  f.push(d.Ie, " ");
  if(d.Pd) {
    var h = new Date(a.Sd);
    f.push("[", yc(h.getFullYear() - 2E3) + yc(h.getMonth() + 1) + yc(h.getDate()) + " " + yc(h.getHours()) + ":" + yc(h.getMinutes()) + ":" + yc(h.getSeconds()) + "." + yc(Math.floor(h.getMilliseconds() / 10)), "] ")
  }
  d.Re && f.push("[", wa(zc(a, d.Se.get())), "s] ");
  d.Qe && f.push("[", F(a.Be), "] ");
  f.push('<span class="', e, '">', qa(wa(F(a.zd))));
  d.Qd && a.mc && f.push("<br>", qa(wa(a.lc || "")));
  f.push("</span><br>");
  c.innerHTML = f.join("");
  this.l.appendChild(c);
  if(b) {
    this.l.scrollTop = this.l.scrollHeight
  }
};
td.prototype.clear = function() {
  this.l.innerHTML = ""
};
function ud(a) {
  var b = t(a);
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
;function vd(a, b) {
  this.Ca = a;
  this.ya = b
}
vd.prototype.o = function(a) {
  return a instanceof vd && this.Ca == a.Ca && this.ya.join(",") == a.ya
};
vd.prototype.n = function(a, b) {
  a.push("new SACK(", String(this.Ca), ", ");
  N(this.ya, a, b);
  a.push(")")
};
function wd() {
  this.A = new Q
}
r = wd.prototype;
r.Ea = -1;
r.oa = 0;
r.append = function(a) {
  var b = ud(a);
  this.A.set(this.Ea + 1, [a, b]);
  this.Ea += 1;
  this.oa += b
};
r.extend = function(a) {
  for(var b = 0;b < a.length;b++) {
    this.append(a[b])
  }
};
r.n = function(a) {
  a.push("<Queue with ", String(this.A.G()), " item(s), counter=#", String(this.Ea), ", size=", String(this.oa), ">")
};
function xd(a) {
  Vc(a.A);
  nb(a.A.g);
  return a.A.g
}
function yd() {
  this.qa = new Q
}
yd.prototype.Ja = -1;
yd.prototype.oa = 0;
function zd(a) {
  var b = a.qa.ga();
  nb(b);
  return new vd(a.Ja, b)
}
var Ad = {};
function Bd(a, b) {
  switch(t(b)) {
    case "string":
      a.push("<string>", F(b), "</string>");
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
        a.push('<property id="', d, '">'), Bd(a, b[d]), a.push("</property>")
      }
      a.push("</array>");
      break;
    case "object":
      if(typeof b.getFullYear == "function") {
        a.push("<date>", b.valueOf(), "</date>")
      }else {
        a.push("<object>");
        for(c in b) {
          Object.prototype.hasOwnProperty.call(b, c) && t(b[c]) != "function" && (a.push('<property id="', F(c), '">'), Bd(a, b[c]), a.push("</property>"))
        }
        a.push("</object>")
      }
      break;
    default:
      a.push("<null/>")
  }
}
function Cd(a, b) {
  var c = ['<invoke name="', a, '" returntype="javascript">'], d = c, e = arguments;
  d.push("<arguments>");
  for(var f = e.length, h = 1;h < f;h++) {
    Bd(d, e[h])
  }
  d.push("</arguments>");
  c.push("</invoke>");
  return c.join("")
}
;function Dd() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ ma()).toString(36)
}
function Ed(a) {
  return a.substr(0, a.length - 1)
}
var Fd = /^(0|[1-9]\d*)$/, Gd = /^(0|\-?[1-9]\d*)$/;
function Hd(a) {
  var b = Id;
  return Fd.test(a) && (a = parseInt(a, 10), a <= b) ? a : k
}
;function Jd(a, b) {
  this.U = "_" + Dd();
  this.Ub = a;
  this.ka = b;
  this.pa = a.pa
}
D(Jd, I);
r = Jd.prototype;
r.Ma = j;
r.fc = n;
r.a = T("cw.net.FlashSocket");
r.n = function(a) {
  a.push("<FlashSocket id='");
  a.push(this.U);
  a.push("'>")
};
function Kd(a, b, c) {
  b == "frames" ? (a = a.ka, Ld(a.v), Md(a.v, c)) : b == "stillreceiving" ? (c = a.ka, c.a.p("onstillreceiving"), Ld(c.v)) : b == "connect" ? (c = a.ka, c.a.info("onconnect"), Ld(c.v), a = c.Va, c.Va = k, a.length && (c.a.p("onconnect: Writing " + a.length + " buffered frame(s)."), c.Qb.ub(a))) : b == "close" ? (a.Ma = n, a.b()) : b == "ioerror" ? (a.Ma = n, b = a.ka, b.a.D("onioerror: " + O(c)), Nd(b.v, n), a.b()) : b == "securityerror" ? (a.Ma = n, b = a.ka, b.a.D("onsecurityerror: " + O(c)), Nd(b.v, 
  n), a.b()) : g(Error("bad event: " + b))
}
function Od(a) {
  a.fc = j;
  a.Ma = n;
  a.b()
}
r.cc = function(a, b) {
  try {
    var c = this.pa.CallFunction(Cd("__FC_connect", this.U, a, b, "<int32/>\n"))
  }catch(d) {
    return this.a.K("connect: could not call __FC_connect; Flash probably crashed. Disposing now. Error was: " + d.message), Od(this)
  }
  c != '"OK"' && g(Error("__FC_connect failed? ret: " + c))
};
r.ub = function(a) {
  try {
    var b = this.pa.CallFunction(Cd("__FC_writeFrames", this.U, a))
  }catch(c) {
    return this.a.K("writeFrames: could not call __FC_writeFrames; Flash probably crashed. Disposing now. Error was: " + c.message), Od(this)
  }
  b != '"OK"' && (b == '"no such instance"' ? (this.a.D("Flash no longer knows of " + this.U + "; disposing."), this.b()) : g(Error("__FC_writeFrames failed? ret: " + b)))
};
r.c = function() {
  this.a.info("in disposeInternal, needToCallClose_=" + this.Ma);
  Jd.k.c.call(this);
  var a = this.pa;
  delete this.pa;
  if(this.Ma) {
    try {
      this.a.info("disposeInternal: __FC_close ret: " + a.CallFunction(Cd("__FC_close", this.U)))
    }catch(b) {
      this.a.K("disposeInternal: could not call __FC_close; Flash probably crashed. Error was: " + b.message), this.fc = j
    }
  }
  if(this.fc) {
    a = this.ka, a.a.D("oncrash"), Nd(a.v, j)
  }else {
    this.ka.onclose()
  }
  delete this.ka;
  delete this.Ub.Ha[this.U]
};
function Pd(a, b) {
  this.u = a;
  this.pa = b;
  this.Ha = {};
  this.bc = "__FST_" + Dd();
  s[this.bc] = z(this.me, this);
  var c = b.CallFunction(Cd("__FC_setCallbackFunc", this.bc));
  c != '"OK"' && g(Error("__FC_setCallbackFunc failed? ret: " + c))
}
D(Pd, I);
r = Pd.prototype;
r.a = T("cw.net.FlashSocketTracker");
r.n = function(a, b) {
  a.push("<FlashSocketTracker instances=");
  N(this.Ha, a, b);
  a.push(">")
};
r.gc = function(a) {
  a = new Jd(this, a);
  return this.Ha[a.U] = a
};
r.ke = function(a, b, c, d) {
  var e = this.Ha[a];
  e ? b == "frames" && d ? (Kd(e, "ioerror", "FlashConnector hadError while handling data."), e.b()) : Kd(e, b, c) : this.a.D("Cannot dispatch because we have no instance: " + O([a, b, c, d]))
};
r.me = function(a, b, c, d) {
  try {
    lc(this.u, this.ke, this, [a, b, c, d])
  }catch(e) {
    s.window.setTimeout(function() {
      g(e)
    }, 0)
  }
};
r.c = function() {
  Pd.k.c.call(this);
  for(var a = Za(this.Ha);a.length;) {
    a.pop().b()
  }
  delete this.Ha;
  delete this.pa;
  s[this.bc] = i
};
function Qd(a) {
  this.v = a;
  this.Va = []
}
D(Qd, I);
r = Qd.prototype;
r.a = T("cw.net.FlashSocketConduit");
r.ub = function(a) {
  this.Va ? (this.a.p("writeFrames: Not connected, can't write " + a.length + " frame(s) yet."), this.Va.push.apply(this.Va, a)) : (this.a.p("writeFrames: Writing " + a.length + " frame(s)."), this.Qb.ub(a))
};
r.cc = function(a, b) {
  this.Qb.cc(a, b)
};
r.onclose = function() {
  this.a.info("onclose");
  Nd(this.v, n)
};
r.c = function() {
  this.a.info("in disposeInternal.");
  Qd.k.c.call(this);
  this.Qb.b();
  delete this.v
};
function Rd() {
  var a = Math.pow(10, 9);
  return a + Math.random() * (Math.pow(10, 10) - a)
}
;var Id = Math.pow(2, 53);
var Sd = {Yd:ba("<cw.eq.Wildcard>")};
function Td(a) {
  return a == "boolean" || a == "number" || a == "null" || a == "undefined" || a == "string"
}
function Ud(a, b, c) {
  var d = t(a), e = t(b);
  if(a == Sd || b == Sd) {
    return j
  }else {
    if(a != k && typeof a.o == "function") {
      return c && c.push("running custom equals function on left object"), a.o(b, c)
    }else {
      if(b != k && typeof b.o == "function") {
        return c && c.push("running custom equals function on right object"), b.o(a, c)
      }else {
        if(Td(d) || Td(e)) {
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
                    c && c.push("array length mismatch: " + a.length + ", " + b.length), a = n
                  }else {
                    d = 0;
                    for(e = a.length;d < e;d++) {
                      if(!Ud(a[d], b[d], c)) {
                        c && c.push("earlier comparisons indicate mismatch at array item #" + d);
                        a = n;
                        break a
                      }
                    }
                    c && c.push("ascending from array");
                    a = j
                  }
                }
              }else {
                if(a.Xd == Ba && b.Xd == Ba) {
                  a: {
                    c && c.push("descending into object");
                    for(var f in a) {
                      if(!(f in b)) {
                        c && c.push("property " + f + " missing on right object");
                        a = n;
                        break a
                      }
                      if(!Ud(a[f], b[f], c)) {
                        c && c.push("earlier comparisons indicate mismatch at property " + f);
                        a = n;
                        break a
                      }
                    }
                    for(f in b) {
                      if(!(f in a)) {
                        c && c.push("property " + f + " missing on left object");
                        a = n;
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
    }
  }
}
;function V(a) {
  E.call(this, a)
}
D(V, E);
V.prototype.name = "cw.net.InvalidFrame";
function W() {
  var a = [];
  this.N(a);
  return a.join("")
}
function Vd() {
}
Vd.prototype.o = function(a, b) {
  return!(a instanceof Vd) ? n : Ud(Wd(this), Wd(a), b)
};
Vd.prototype.n = function(a, b) {
  a.push("<HelloFrame properties=");
  N(Wd(this), a, b);
  a.push(">")
};
function Wd(a) {
  return[a.Sa, a.Gd, a.nd, a.Kd, a.rb, a.Lc, a.Ad, a.yd, a.yc, a.wd, a.Vd, a.Rd, a.Q, a.Ib]
}
Vd.prototype.F = W;
Vd.prototype.N = function(a) {
  var b = {};
  b.tnum = this.Sa;
  b.ver = this.Gd;
  b.format = this.nd;
  b["new"] = this.Kd;
  b.id = this.rb;
  b.ming = this.Lc;
  b.pad = this.Ad;
  b.maxb = this.yd;
  if(this.yc !== i) {
    b.maxt = this.yc
  }
  b.maxia = this.wd;
  b.tcpack = this.Vd;
  b.eeds = this.Rd;
  b.sack = this.Q instanceof vd ? Ed((new X(this.Q)).F()) : this.Q;
  b.seenack = this.Ib instanceof vd ? Ed((new X(this.Ib)).F()) : this.Ib;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(pc(b), "H")
};
function Xd(a) {
  this.Ra = a
}
Xd.prototype.o = function(a) {
  return a instanceof Xd && this.Ra == a.Ra
};
Xd.prototype.n = function(a, b) {
  a.push("new StringFrame(");
  N(this.Ra, a, b);
  a.push(")")
};
Xd.prototype.F = W;
Xd.prototype.N = function(a) {
  a.push(this.Ra, " ")
};
function Yd(a) {
  this.yb = a
}
Yd.prototype.o = function(a) {
  return a instanceof Yd && this.yb == a.yb
};
Yd.prototype.n = function(a, b) {
  a.push("new CommentFrame(");
  N(this.yb, a, b);
  a.push(")")
};
Yd.prototype.F = W;
Yd.prototype.N = function(a) {
  a.push(this.yb, "^")
};
function Zd(a) {
  this.pb = a
}
Zd.prototype.o = function(a) {
  return a instanceof Zd && this.pb == a.pb
};
Zd.prototype.n = function(a) {
  a.push("new SeqNumFrame(", String(this.pb), ")")
};
Zd.prototype.F = W;
Zd.prototype.N = function(a) {
  a.push(String(this.pb), "N")
};
function $d(a) {
  var b = a.split("|");
  if(b.length != 2) {
    return k
  }
  a: {
    var c = b[1], a = Id;
    if(Gd.test(c) && (c = parseInt(c, 10), c >= -1 && c <= a)) {
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
      var f = Hd(b[d]);
      if(f == k) {
        return k
      }
      c.push(f)
    }
  }
  return new vd(a, c)
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
  a.push(b.ya.join(","), "|", String(b.Ca));
  a.push("A")
};
function ae(a) {
  this.gb = a
}
ae.prototype.o = function(a, b) {
  return a instanceof ae && this.gb.o(a.gb, b)
};
ae.prototype.n = function(a, b) {
  a.push("new StreamStatusFrame(");
  N(this.gb, a, b);
  a.push(")")
};
ae.prototype.F = W;
ae.prototype.N = function(a) {
  var b = this.gb;
  a.push(b.ya.join(","), "|", String(b.Ca));
  a.push("T")
};
function be() {
}
be.prototype.n = function(a) {
  a.push("new StreamCreatedFrame()")
};
be.prototype.o = function(a) {
  return a instanceof be
};
be.prototype.F = W;
be.prototype.N = function(a) {
  a.push("C")
};
function ce() {
}
ce.prototype.n = function(a) {
  a.push("new YouCloseItFrame()")
};
ce.prototype.o = function(a) {
  return a instanceof ce
};
ce.prototype.F = W;
ce.prototype.N = function(a) {
  a.push("Y")
};
function de(a, b) {
  this.lb = a;
  this.Ua = b
}
de.prototype.o = function(a) {
  return a instanceof de && this.lb == a.lb && this.Ua == a.Ua
};
de.prototype.n = function(a, b) {
  a.push("new ResetFrame(");
  N(this.lb, a, b);
  a.push(", ", String(this.Ua), ")")
};
de.prototype.F = W;
de.prototype.N = function(a) {
  a.push(this.lb, "|", String(Number(this.Ua)), "!")
};
var ee = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function fe(a) {
  this.reason = a
}
fe.prototype.o = function(a) {
  return a instanceof fe && this.reason == a.reason
};
fe.prototype.n = function(a, b) {
  a.push("new TransportKillFrame(");
  N(this.reason, a, b);
  a.push(")")
};
fe.prototype.F = W;
fe.prototype.N = function(a) {
  a.push(this.reason, "K")
};
function ge(a) {
  a || g(new V("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(b == " ") {
    return new Xd(a.substr(0, a.length - 1))
  }else {
    if(b == "A") {
      return a = $d(Ed(a)), a == k && g(new V("bad sack")), new X(a)
    }else {
      if(b == "N") {
        return a = Hd(Ed(a)), a == k && g(new V("bad seqNum")), new Zd(a)
      }else {
        if(b == "T") {
          return a = $d(Ed(a)), a == k && g(new V("bad lastSackSeen")), new ae(a)
        }else {
          if(b == "Y") {
            return a.length != 1 && g(new V("leading garbage")), new ce
          }else {
            if(b == "^") {
              return new Yd(a.substr(0, a.length - 1))
            }else {
              if(b == "C") {
                return a.length != 1 && g(new V("leading garbage")), new be
              }else {
                if(b == "!") {
                  return b = a.substr(0, a.length - 3), (b.length > 255 || !/^([ -~]*)$/.test(b)) && g(new V("bad reasonString")), a = {"|0":n, "|1":j}[a.substr(a.length - 3, 2)], a == k && g(new V("bad applicationLevel")), new de(b, a)
                }else {
                  if(b == "K") {
                    return a = a.substr(0, a.length - 1), a = ee[a], a == k && g(new V("unknown kill reason: " + a)), new fe(a)
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
;var he = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function ie(a, b) {
  var c = a.match(he), d = b.match(he);
  return c[3] == d[3] && c[1] == d[1] && c[4] == d[4]
}
;function je(a, b) {
  var c;
  a instanceof je ? (this.Qa(b == k ? a.V : b), ke(this, a.R), le(this, a.Ba), me(this, a.M), ne(this, a.ia), oe(this, a.I), pe(this, a.J.L()), qe(this, a.sa)) : a && (c = String(a).match(he)) ? (this.Qa(!!b), ke(this, c[1] || "", j), le(this, c[2] || "", j), me(this, c[3] || "", j), ne(this, c[4]), oe(this, c[5] || "", j), pe(this, c[6] || "", j), qe(this, c[7] || "", j)) : (this.Qa(!!b), this.J = new re(k, this, this.V))
}
r = je.prototype;
r.R = "";
r.Ba = "";
r.M = "";
r.ia = k;
r.I = "";
r.sa = "";
r.ze = n;
r.V = n;
r.toString = function() {
  if(this.S) {
    return this.S
  }
  var a = [];
  this.R && a.push(se(this.R, te), ":");
  this.M && (a.push("//"), this.Ba && a.push(se(this.Ba, te), "@"), a.push(w(this.M) ? encodeURIComponent(this.M) : k), this.ia != k && a.push(":", String(this.ia)));
  this.I && (this.M && this.I.charAt(0) != "/" && a.push("/"), a.push(se(this.I, this.I.charAt(0) == "/" ? ue : ve)));
  var b = String(this.J);
  b && a.push("?", b);
  this.sa && a.push("#", se(this.sa, we));
  return this.S = a.join("")
};
r.L = function() {
  var a = this.R, b = this.Ba, c = this.M, d = this.ia, e = this.I, f = this.J.L(), h = this.sa, l = new je(k, this.V);
  a && ke(l, a);
  b && le(l, b);
  c && me(l, c);
  d && ne(l, d);
  e && oe(l, e);
  f && pe(l, f);
  h && qe(l, h);
  return l
};
function ke(a, b, c) {
  xe(a);
  delete a.S;
  a.R = c ? b ? decodeURIComponent(b) : "" : b;
  if(a.R) {
    a.R = a.R.replace(/:$/, "")
  }
}
function le(a, b, c) {
  xe(a);
  delete a.S;
  a.Ba = c ? b ? decodeURIComponent(b) : "" : b
}
function me(a, b, c) {
  xe(a);
  delete a.S;
  a.M = c ? b ? decodeURIComponent(b) : "" : b
}
function ne(a, b) {
  xe(a);
  delete a.S;
  b ? (b = Number(b), (isNaN(b) || b < 0) && g(Error("Bad port number " + b)), a.ia = b) : a.ia = k
}
function oe(a, b, c) {
  xe(a);
  delete a.S;
  a.I = c ? b ? decodeURIComponent(b) : "" : b
}
function pe(a, b, c) {
  xe(a);
  delete a.S;
  b instanceof re ? (a.J = b, a.J.Qc = a, a.J.Qa(a.V)) : (c || (b = se(b, ye)), a.J = new re(b, a, a.V))
}
function qe(a, b, c) {
  xe(a);
  delete a.S;
  a.sa = c ? b ? decodeURIComponent(b) : "" : b
}
function xe(a) {
  a.ze && g(Error("Tried to modify a read-only Uri"))
}
r.Qa = function(a) {
  this.V = a;
  this.J && this.J.Qa(a);
  return this
};
function ze(a) {
  return a instanceof je ? a.L() : new je(a, i)
}
var Ae = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
function se(a, b) {
  var c = k;
  w(a) && (c = a, Ae.test(c) || (c = encodeURI(a)), c.search(b) >= 0 && (c = c.replace(b, Ce)));
  return c
}
function Ce(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var te = /[#\/\?@]/g, ve = /[\#\?:]/g, ue = /[\#\?]/g, ye = /[\#\?@]/g, we = /#/g;
function re(a, b, c) {
  this.Z = a || k;
  this.Qc = b || k;
  this.V = !!c
}
function Y(a) {
  if(!a.h && (a.h = new Q, a.d = 0, a.Z)) {
    for(var b = a.Z.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), e = k, f = k;
      d >= 0 ? (e = b[c].substring(0, d), f = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = De(a, e);
      a.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
    }
  }
}
r = re.prototype;
r.h = k;
r.d = k;
r.G = function() {
  Y(this);
  return this.d
};
r.add = function(a, b) {
  Y(this);
  Ee(this);
  a = De(this, a);
  if(this.T(a)) {
    var c = this.h.get(a);
    u(c) ? c.push(b) : this.h.set(a, [c, b])
  }else {
    this.h.set(a, b)
  }
  this.d++;
  return this
};
r.remove = function(a) {
  Y(this);
  a = De(this, a);
  if(this.h.T(a)) {
    Ee(this);
    var b = this.h.get(a);
    u(b) ? this.d -= b.length : this.d--;
    return this.h.remove(a)
  }
  return n
};
r.clear = function() {
  Ee(this);
  this.h && this.h.clear();
  this.d = 0
};
r.cb = function() {
  Y(this);
  return this.d == 0
};
r.T = function(a) {
  Y(this);
  a = De(this, a);
  return this.h.T(a)
};
r.dc = function(a) {
  var b = this.H();
  return db(b, a) >= 0
};
r.ga = function() {
  Y(this);
  for(var a = this.h.H(), b = this.h.ga(), c = [], d = 0;d < b.length;d++) {
    var e = a[d];
    if(u(e)) {
      for(var f = 0;f < e.length;f++) {
        c.push(b[d])
      }
    }else {
      c.push(b[d])
    }
  }
  return c
};
r.H = function(a) {
  Y(this);
  if(a) {
    if(a = De(this, a), this.T(a)) {
      var b = this.h.get(a);
      if(u(b)) {
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
      u(d) ? lb(a, d) : a.push(d)
    }
  }
  return a
};
r.set = function(a, b) {
  Y(this);
  Ee(this);
  a = De(this, a);
  if(this.T(a)) {
    var c = this.h.get(a);
    u(c) ? this.d -= c.length : this.d--
  }
  this.h.set(a, b);
  this.d++;
  return this
};
r.get = function(a, b) {
  Y(this);
  a = De(this, a);
  if(this.T(a)) {
    var c = this.h.get(a);
    return u(c) ? c[0] : c
  }else {
    return b
  }
};
r.toString = function() {
  if(this.Z) {
    return this.Z
  }
  if(!this.h) {
    return""
  }
  for(var a = [], b = 0, c = this.h.ga(), d = 0;d < c.length;d++) {
    var e = c[d], f = pa(e), e = this.h.get(e);
    if(u(e)) {
      for(var h = 0;h < e.length;h++) {
        b > 0 && a.push("&"), a.push(f), e[h] !== "" && a.push("=", pa(e[h])), b++
      }
    }else {
      b > 0 && a.push("&"), a.push(f), e !== "" && a.push("=", pa(e)), b++
    }
  }
  return this.Z = a.join("")
};
function Ee(a) {
  delete a.Fa;
  delete a.Z;
  a.Qc && delete a.Qc.S
}
r.L = function() {
  var a = new re;
  if(this.Fa) {
    a.Fa = this.Fa
  }
  if(this.Z) {
    a.Z = this.Z
  }
  if(this.h) {
    a.h = this.h.L()
  }
  return a
};
function De(a, b) {
  var c = String(b);
  a.V && (c = c.toLowerCase());
  return c
}
r.Qa = function(a) {
  a && !this.V && (Y(this), Ee(this), Tc(this.h, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.add(d, a))
  }, this));
  this.V = a
};
r.extend = function(a) {
  for(var b = 0;b < arguments.length;b++) {
    Tc(arguments[b], function(a, b) {
      this.add(b, a)
    }, this)
  }
};
function Fe(a, b, c, d) {
  this.contentWindow = a;
  this.Cb = b;
  this.Mc = c;
  this.se = d
}
Fe.prototype.n = function(a, b) {
  a.push("<XDRFrame frameId=");
  N(this.se, a, b);
  a.push(", expandedUrl=");
  N(this.Cb, a, b);
  a.push(", streams=");
  N(this.Mc, a, b);
  a.push(">")
};
function Ge() {
  this.frames = [];
  this.wc = new Q
}
Ge.prototype.a = T("cw.net.XDRTracker");
function He(a) {
  return a.replace(/%random%/g, function() {
    return"ml" + String(Math.floor(Rd())) + String(Math.floor(Rd()))
  })
}
function Ie(a, b) {
  for(var c = Je, d = 0;d < c.frames.length;d++) {
    var e = c.frames[d], f;
    if(f = e.Mc.length == 0) {
      f = e.Cb;
      var h = String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace(/%random%/g, "ml" + Array(21).join("\\d"));
      f = RegExp("^" + h + "$").test(f)
    }
    if(f) {
      return c.a.info("Giving " + O(b) + " existing frame " + O(e)), ic(e)
    }
  }
  d = Dd() + Dd();
  e = He(a);
  f = s.location;
  f instanceof je || (f = ze(f));
  e instanceof je || (e = ze(e));
  var l = f;
  f = l.L();
  (h = !!e.R) ? ke(f, e.R) : h = !!e.Ba;
  h ? le(f, e.Ba) : h = !!e.M;
  h ? me(f, e.M) : h = e.ia != k;
  var m = e.I;
  if(h) {
    ne(f, e.ia)
  }else {
    if(h = !!e.I) {
      if(m.charAt(0) != "/" && (l.M && !l.I ? m = "/" + m : (l = f.I.lastIndexOf("/"), l != -1 && (m = f.I.substr(0, l + 1) + m))), m == ".." || m == ".") {
        m = ""
      }else {
        if(!(m.indexOf("./") == -1 && m.indexOf("/.") == -1)) {
          for(var l = m.lastIndexOf("/", 0) == 0, m = m.split("/"), p = [], B = 0;B < m.length;) {
            var q = m[B++];
            q == "." ? l && B == m.length && p.push("") : q == ".." ? ((p.length > 1 || p.length == 1 && p[0] != "") && p.pop(), l && B == m.length && p.push("")) : (p.push(q), l = j)
          }
          m = p.join("/")
        }
      }
    }
  }
  h ? oe(f, m) : h = e.J.toString() !== "";
  if(h) {
    l = e.J;
    if(!l.Fa) {
      l.Fa = l.toString() ? decodeURIComponent(l.toString()) : ""
    }
    pe(f, l.Fa, i)
  }else {
    h = !!e.sa
  }
  h && qe(f, e.sa);
  e = f.toString();
  f = String(s.location).match(he)[3] || k;
  h = e.match(he)[3] || k;
  f == h ? (c.a.info("No need to make a real XDRFrame for " + O(b)), c = ic(new Fe(s, e, [b], k))) : (f = P("minerva-elements"), h = new M, c.wc.set(d, [h, e, b]), c.a.info("Creating new XDRFrame " + O(d) + "for " + O(b)), c = Jc("iframe", {id:"minerva-xdrframe-" + d, style:"visibility: hidden; height: 0; width: 0; border: 0; margin: 0;", src:e + "xdrframe/?domain=" + document.domain + "&id=" + d}), f.appendChild(c), c = h);
  return c
}
Ge.prototype.bf = function(a) {
  var b = this.wc.get(a);
  b || g(Error("Unknown frameId " + O(a)));
  this.wc.remove(b);
  var c = b[0], a = new Fe(P("minerva-xdrframe-" + a).contentWindow || (Ka ? P("minerva-xdrframe-" + a).document || P("minerva-xdrframe-" + a).contentWindow.document : P("minerva-xdrframe-" + a).contentDocument || P("minerva-xdrframe-" + a).contentWindow.document).parentWindow || (Ka ? P("minerva-xdrframe-" + a).document || P("minerva-xdrframe-" + a).contentWindow.document : P("minerva-xdrframe-" + a).contentDocument || P("minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], 
  a);
  this.frames.push(a);
  fc(c, a)
};
var Je = new Ge;
s.__XHRTracker_xdrFrameLoaded = z(Je.bf, Je);
var Ke;
Ke = n;
var Le = Ga();
Le && (Le.indexOf("Firefox") != -1 || Le.indexOf("Camino") != -1 || Le.indexOf("iPhone") != -1 || Le.indexOf("iPod") != -1 || Le.indexOf("iPad") != -1 || Le.indexOf("Android") != -1 || Le.indexOf("Chrome") != -1 && (Ke = j));
var Me = Ke;
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function Ne(a, b, c, d, e, f) {
  M.call(this, e, f);
  this.ud = a;
  this.hc = [];
  this.ed = !!b;
  this.qe = !!c;
  this.ge = !!d;
  for(b = 0;b < a.length;b++) {
    gc(a[b], z(this.ld, this, b, j), z(this.ld, this, b, n))
  }
  a.length == 0 && !this.ed && fc(this, this.hc)
}
D(Ne, M);
Ne.prototype.Cd = 0;
Ne.prototype.ld = function(a, b, c) {
  this.Cd++;
  this.hc[a] = [b, c];
  this.fa || (this.ed && b ? fc(this, [a, c]) : this.qe && !b ? this.Za(c) : this.Cd == this.ud.length && fc(this, this.hc));
  this.ge && !b && (c = k);
  return c
};
Ne.prototype.Za = function(a) {
  Ne.k.Za.call(this, a);
  eb(this.ud, function(a) {
    a.cancel()
  })
};
function Oe(a) {
  a = new Ne(a, n, j);
  a.vb(function(a) {
    return fb(a, function(a) {
      return a[1]
    })
  });
  return a
}
;function Pe(a, b) {
  this.af = a;
  this.xd = b
}
Pe.prototype.vc = 0;
Pe.prototype.Lb = 0;
Pe.prototype.nc = n;
function Qe(a) {
  var b = [];
  if(a.nc) {
    return[b, 2]
  }
  var c = a.vc, d = a.af.responseText;
  for(a.vc = d.length;;) {
    c = d.indexOf("\n", c);
    if(c == -1) {
      break
    }
    var e = d.substr(a.Lb, c - a.Lb), e = e.replace(/\r$/, "");
    if(e.length > a.xd) {
      return a.nc = j, [b, 2]
    }
    b.push(e);
    a.Lb = c += 1
  }
  return a.vc - a.Lb - 1 > a.xd ? (a.nc = j, [b, 2]) : [b, 1]
}
;function Re(a, b, c) {
  this.v = b;
  this.P = a;
  this.ec = c
}
D(Re, I);
r = Re.prototype;
r.a = T("cw.net.XHRMaster");
r.ma = -1;
r.xc = function(a, b, c) {
  this.ec.__XHRSlave_makeRequest(this.P, a, b, c)
};
r.ha = o("ma");
r.Ac = function(a, b) {
  b != 1 && this.a.K(O(this.P) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  Ld(this.v);
  Md(this.v, a)
};
r.Bc = function(a) {
  this.a.i("ongotheaders_: " + O(a));
  var b = k;
  "Content-Length" in a && (b = Hd(a["Content-Length"]));
  a = this.v;
  a.a.i(a.q() + " got Content-Length: " + b);
  a.W == Se && (b == k && (a.a.D("Expected to receive a valid Content-Length, but did not."), b = 5E5), Te(a, 2E3 + b / 3072 * 1E3))
};
r.Cc = function(a) {
  a != 1 && this.a.i(this.v.q() + "'s XHR's readyState is " + a);
  this.ma = a;
  this.ma >= 2 && Ld(this.v)
};
r.zc = function() {
  this.v.b()
};
r.c = function() {
  Re.k.c.call(this);
  delete Z.aa[this.P];
  this.ec.__XHRSlave_dispose(this.P);
  delete this.ec
};
function Ue() {
  this.aa = {}
}
D(Ue, I);
r = Ue.prototype;
r.a = T("cw.net.XHRMasterTracker");
r.gc = function(a, b) {
  var c = "_" + Dd(), d = new Re(c, a, b);
  return this.aa[c] = d
};
r.Ac = function(a, b, c) {
  var b = jb(b), d = this.aa[a];
  d ? d.Ac(b, c) : this.a.K("onframes_: no master for " + O(a))
};
r.Bc = function(a, b) {
  var c = this.aa[a];
  c ? c.Bc(b) : this.a.K("ongotheaders_: no master for " + O(a))
};
r.Cc = function(a, b) {
  var c = this.aa[a];
  c ? c.Cc(b) : this.a.K("onreadystatechange_: no master for " + O(a))
};
r.zc = function(a) {
  var b = this.aa[a];
  b ? (delete this.aa[b.P], b.zc()) : this.a.K("oncomplete_: no master for " + O(a))
};
r.c = function() {
  Ue.k.c.call(this);
  for(var a = Za(this.aa);a.length;) {
    a.pop().b()
  }
  delete this.aa
};
var Z = new Ue;
s.__XHRMaster_onframes = z(Z.Ac, Z);
s.__XHRMaster_oncomplete = z(Z.zc, Z);
s.__XHRMaster_ongotheaders = z(Z.Bc, Z);
s.__XHRMaster_onreadystatechange = z(Z.Cc, Z);
function Ve(a, b, c) {
  this.host = a;
  this.port = b;
  this.We = c
}
function We(a, b) {
  b || (b = a);
  this.ja = a;
  this.na = b
}
We.prototype.n = function(a, b) {
  a.push("<HttpEndpoint primaryUrl=");
  N(this.ja, a, b);
  a.push(", secondaryUrl=");
  N(this.na, a, b);
  a.push(">")
};
function Xe(a, b, c, d) {
  this.ja = a;
  this.Fd = b;
  this.na = c;
  this.Od = d;
  (!(this.ja.indexOf("http://") == 0 || this.ja.indexOf("https://") == 0) || !(this.na.indexOf("http://") == 0 || this.na.indexOf("https://") == 0)) && g(Error("primaryUrl and secondUrl must be absolute URLs with http or https scheme"));
  a = this.Fd.location.href;
  ie(this.ja, a) || g(Error("primaryWindow not same origin as primaryUrl: " + a));
  a = this.Od.location.href;
  ie(this.na, a) || g(Error("secondaryWindow not same origin as secondaryUrl: " + a))
}
Xe.prototype.n = function(a, b) {
  a.push("<ExpandedHttpEndpoint_ primaryUrl=");
  N(this.ja, a, b);
  a.push(", secondaryUrl=");
  N(this.na, a, b);
  a.push(">")
};
var Ye = new Yd(";)]}");
function Ze() {
}
function $e(a) {
  this.Te = a
}
$e.prototype.n = function(a, b) {
  a.push("<UserContext for ");
  N(this.Te, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.z = a;
  this.fg = b ? b : new Ze;
  this.u = c ? c : mc;
  this.sb = new Zc;
  this.rb = Dd() + Dd();
  this.la = new wd;
  this.uc = new yd;
  this.tb = k;
  this.Vb = [];
  this.Aa = new $e(this);
  if(Ka) {
    this.tb = Qb(s, "load", this.Ke, n, this)
  }
}
D($, I);
r = $.prototype;
r.a = T("cw.net.ClientStream");
r.sd = new vd(-1, []);
r.td = new vd(-1, []);
r.maxUndeliveredStrings = 50;
r.maxUndeliveredBytes = 1048576;
r.onstring = k;
r.onreset = k;
r.ondisconnect = k;
r.Jc = n;
r.Fc = n;
r.w = 1;
r.Td = -1;
r.f = k;
r.r = k;
r.mb = k;
r.Kc = 0;
r.Ed = 0;
r.Nd = 0;
r.n = function(a, b) {
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
r.ue = o("Aa");
r.be = function(a) {
  this.onstring = z(a.stringReceived, a);
  this.onreset = z(a.streamReset, a)
};
function af(a) {
  var b = [-1];
  a.f && b.push(a.f.Na);
  a.r && b.push(a.r.Na);
  return Math.max.apply(Math.max, b)
}
function bf(a) {
  if(a.w != 1) {
    var b = a.la.A.G() != 0, c = zd(a.uc), d = !c.o(a.td) && !(a.f && c.o(a.f.Ka) || a.r && c.o(a.r.Ka)), e = af(a);
    if((b = b && e < a.la.Ea) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      if(a.f.Wa) {
        a.a.p("tryToSend_: writing " + f + " to primary");
        if(d && (d = a.f, c != d.Ka)) {
          !d.ba && !d.s.length && cf(d), d.s.push(new X(c)), d.Ka = c
        }
        b && df(a.f, a.la, e + 1);
        a.f.$()
      }else {
        a.r == k ? a.Jc ? (a.a.p("tryToSend_: creating secondary to send " + f), a.r = ef(a, n), b && df(a.r, a.la, e + 1), a.r.$()) : (a.a.p("tryToSend_: not creating a secondary because stream might not exist on server"), a.Fc = j) : a.a.p("tryToSend_: need to send " + f + ", but can't right now")
      }
    }
  }
}
r.Ke = function() {
  this.tb = k;
  if(this.f && this.f.Ia()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.f;
    a.Yb = j;
    a.b()
  }
  if(this.r && this.r.Ia()) {
    this.a.info("restartHttpRequests_: aborting secondary"), a = this.r, a.Yb = j, a.b()
  }
};
r.Me = function(a, b) {
  b !== i || (b = j);
  this.w > 3 && g(Error("sendStrings: Can't send strings in state " + this.w));
  if(a.length) {
    if(b) {
      for(var c = 0;c < a.length;c++) {
        var d = a[c];
        /^([ -~]*)$/.test(d) || g(Error("sendStrings: string #" + c + " has illegal chars: " + O(d)))
      }
    }
    this.la.extend(a);
    bf(this)
  }
};
function ef(a, b) {
  var c;
  a.z instanceof Xe ? c = Se : a.z instanceof Ve ? c = ff : g(Error("Don't support endpoint " + O(a.z)));
  a.Td += 1;
  c = new gf(a.u, a, a.Td, c, a.z, b);
  a.a.p("Created: " + c.q());
  a.sb.add(c);
  return c
}
function hf(a, b, c) {
  var d = new jf(a.u, a, b, c);
  a.a.p("Created: " + d.q() + ", delay=" + b + ", times=" + c);
  a.sb.add(d);
  return d
}
function kf(a, b) {
  a.sb.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  a.a.i("Offline: " + b.q());
  b.kb ? a.Kc += b.kb : a.Kc = 0;
  a.Kc >= 1 && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.Aa, "stream penalty reached limit", n), a.b());
  if(a.w > 3) {
    a.w == 4 && b.Wd ? (a.a.i("Disposing because resettingTransport_ is done."), a.b()) : a.a.i("Not creating a transport because ClientStream is in state " + a.w)
  }else {
    var c;
    var d;
    c = b instanceof jf;
    if(!c && b.Yb) {
      var e = Ka ? Me ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      a.a.p("getDelayForNextTransport_: " + O({delay:c, times:d}))
    }else {
      d = b.Wc();
      if(b == a.f) {
        if(d) {
          e = ++a.Ed
        }else {
          if(!c) {
            e = a.Ed = 0
          }
        }
      }else {
        if(d) {
          e = ++a.Nd
        }else {
          if(!c) {
            e = a.Nd = 0
          }
        }
      }
      if(c || !e) {
        d = c = 0, a.a.p("getDelayForNextTransport_: " + O({count:e, delay:c, times:d}))
      }else {
        var f = 2E3 * Math.min(e, 3), h = Math.floor(Math.random() * 4E3) - 2E3, l = Math.max(0, b.Ud - b.Oc);
        d = (c = Math.max(0, f + h - l)) ? 1 : 0;
        a.a.p("getDelayForNextTransport_: " + O({count:e, base:f, variance:h, oldDuration:l, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    if(b == a.f) {
      a.f = k, c ? a.f = hf(a, e, c) : (e = af(a), a.f = ef(a, j), df(a.f, a.la, e + 1)), a.f.$()
    }else {
      if(b == a.r) {
        a.r = k, c ? (a.r = hf(a, e, c), a.r.$()) : bf(a)
      }
    }
  }
}
r.reset = function(a) {
  this.w > 3 && g(Error("reset: Can't send reset in state " + this.w));
  this.w = 4;
  this.f && this.f.Wa ? (this.a.info("reset: Sending ResetFrame over existing primary."), lf(this.f, a), this.f.$()) : (this.f && (this.a.i("reset: Disposing primary before sending ResetFrame."), this.f.b()), this.r && (this.a.i("reset: Disposing secondary before sending ResetFrame."), this.r.b()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.mb = ef(this, n), lf(this.mb, a), this.mb.$());
  this.onreset && this.onreset.call(this.Aa, a, j)
};
function mf(a, b, c, d) {
  var e;
  e = a.uc;
  for(var f = a.maxUndeliveredStrings, h = a.maxUndeliveredBytes, l = [], m = n, p = 0, B = c.length;p < B;p++) {
    var q = c[p], y = q[0], q = q[1];
    if(y == e.Ja + 1) {
      e.Ja += 1;
      for(l.push(q);;) {
        y = e.Ja + 1;
        q = e.qa.get(y, Ad);
        if(q === Ad) {
          break
        }
        l.push(q[0]);
        e.qa.remove(y);
        e.oa -= q[1];
        e.Ja = y
      }
    }else {
      if(!(y <= e.Ja)) {
        if(f != k && e.qa.G() >= f) {
          m = j;
          break
        }
        var C = ud(q);
        if(h != k && e.oa + C > h) {
          m = j;
          break
        }
        e.qa.set(y, [q, C]);
        e.oa += C
      }
    }
  }
  e.qa.cb() && e.qa.clear();
  e = [l, m];
  c = e[0];
  e = e[1];
  if(c) {
    for(f = 0;f < c.length;f++) {
      if(h = c[f], a.onstring && a.onstring.call(a.Aa, h), a.w == 4 || a.Y) {
        return
      }
    }
  }
  d || bf(a);
  if(!(a.w == 4 || a.Y) && e) {
    b.a.K(b.q() + "'s peer caused rwin overflow."), b.b()
  }
}
r.start = function() {
  this.onmessage && g(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  this.w != 1 && g(Error("ClientStream.start: " + O(this) + " already started"));
  this.w = 2;
  if(this.z instanceof We) {
    var a = Ie(this.z.ja, this), b = Ie(this.z.na, this);
    Oe([a, b]).vb(z(this.oe, this))
  }else {
    nf(this)
  }
};
r.oe = function(a) {
  var b = a[0].contentWindow, c = a[1].contentWindow, d = a[0].Cb, e = a[1].Cb;
  this.Vb.push(a[0]);
  this.Vb.push(a[1]);
  this.z = new Xe(d, b, e, c);
  nf(this)
};
function nf(a) {
  a.w = 3;
  a.f = ef(a, j);
  df(a.f, a.la, k);
  a.f.$()
}
r.c = function() {
  this.a.info(O(this) + " in disposeInternal.");
  this.w = 5;
  for(var a = this.sb.H(), b = 0;b < a.length;b++) {
    a[b].b()
  }
  for(a = 0;a < this.Vb.length;a++) {
    ib(this.Vb[a].Mc, this)
  }
  if(Ka && this.tb) {
    Sb(this.tb), this.tb = k
  }
  this.ondisconnect && this.ondisconnect.call(this.Aa);
  delete this.sb;
  delete this.f;
  delete this.r;
  delete this.mb;
  delete this.Aa;
  $.k.c.call(this)
};
var Se = 1, ff = 3;
function gf(a, b, c, d, e, f) {
  this.u = a;
  this.B = b;
  this.Sa = c;
  this.W = d;
  this.z = e;
  this.s = [];
  this.Da = f;
  this.Wa = !this.Ia();
  this.Pa = this.W != Se;
  this.ce = z(this.Ue, this)
}
D(gf, I);
r = gf.prototype;
r.a = T("cw.net.ClientTransport");
r.m = k;
r.Oc = k;
r.Ud = k;
r.Nb = k;
r.ba = n;
r.Rb = n;
r.Ka = k;
r.oc = 0;
r.Na = -1;
r.Dc = -1;
r.Wd = n;
r.Yb = n;
r.kb = 0;
r.bb = n;
r.n = function(a) {
  a.push("<ClientTransport #", String(this.Sa), ", becomePrimary=", String(this.Da), ">")
};
r.q = function() {
  return(this.Da ? "Prim. T#" : "Sec. T#") + this.Sa
};
r.Wc = function() {
  return!(!this.bb && this.oc)
};
r.Ia = function() {
  return this.W == Se || this.W == 2
};
function of(a, b) {
  nb(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  mf(a.B, a, b, !a.Pa)
}
function pf(a, b, c) {
  try {
    var d = ge(b);
    a.oc += 1;
    a.a.i(a.q() + " RECV " + O(d));
    var e;
    a.oc == 1 && !d.o(Ye) && a.Ia() ? (a.a.D(a.q() + " is closing soon because got bad preamble: " + O(d)), e = j) : e = n;
    if(e) {
      return j
    }
    if(d instanceof Xd) {
      if(!/^([ -~]*)$/.test(d.Ra)) {
        return a.bb = j
      }
      a.Dc += 1;
      c.push([a.Dc, d.Ra])
    }else {
      if(d instanceof X) {
        var f = a.B, h = d.Q;
        f.sd = h;
        var l = f.la, m = h.Ca, c = n;
        m > l.Ea && (c = j);
        for(var p = xd(l).concat(), d = 0;d < p.length;d++) {
          var B = p[d];
          if(B > m) {
            break
          }
          var q = l.A.j[B][1];
          l.A.remove(B);
          l.oa -= q
        }
        for(d = 0;d < h.ya.length;d++) {
          var y = h.ya[d];
          y > l.Ea && (c = j);
          l.A.T(y) && (q = l.A.j[y][1], l.A.remove(y), l.oa -= q)
        }
        l.A.cb() && l.A.clear();
        if(c) {
          return a.a.D(a.q() + " is closing soon because got bad SackFrame"), a.bb = j
        }
      }else {
        if(d instanceof Zd) {
          a.Dc = d.pb - 1
        }else {
          if(d instanceof ae) {
            a.B.td = d.gb
          }else {
            if(d instanceof ce) {
              return a.a.p(a.q() + " is closing soon because got YouCloseItFrame"), j
            }else {
              if(d instanceof fe) {
                return a.bb = j, d.reason == "stream_attach_failure" ? a.kb += 1 : d.reason == "acked_unsent_strings" && (a.kb += 0.5), a.a.p(a.q() + " is closing soon because got " + O(d)), j
              }else {
                if(!(d instanceof Yd)) {
                  if(d instanceof be) {
                    var C = a.B, $f = !a.Pa;
                    C.a.p("Stream is now confirmed to exist at server.");
                    C.Jc = j;
                    if(C.Fc && !$f) {
                      C.Fc = n, bf(C)
                    }
                  }else {
                    if(c.length) {
                      of(a, c);
                      if(!u(c)) {
                        for(var jd = c.length - 1;jd >= 0;jd--) {
                          delete c[jd]
                        }
                      }
                      c.length = 0
                    }
                    if(d instanceof de) {
                      var Yb = a.B;
                      Yb.onreset && Yb.onreset.call(Yb.Aa, d.lb, d.Ua);
                      Yb.b();
                      return j
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
  }catch(Be) {
    return Be instanceof V || g(Be), a.a.D(a.q() + " is closing soon because got InvalidFrame: " + O(b)), a.bb = j
  }
  return n
}
function Md(a, b) {
  a.Rb = j;
  try {
    for(var c = n, d = [], e = 0, f = b.length;e < f;e++) {
      if(a.Y) {
        a.a.info(a.q() + " returning from loop because we're disposed.");
        return
      }
      if(c = pf(a, b[e], d)) {
        break
      }
    }
    d.length && of(a, d);
    a.Rb = n;
    a.s.length && a.$();
    c && (a.a.p(a.q() + " closeSoon is true.  Frames were: " + O(b)), a.b())
  }finally {
    a.Rb = n
  }
}
r.Ue = function() {
  this.a.D(this.q() + " timed out due to lack of connection or no data being received.");
  this.b()
};
function qf(a) {
  if(a.Nb != k) {
    a.u.C.clearTimeout(a.Nb), a.Nb = k
  }
}
function Te(a, b) {
  qf(a);
  b = Math.round(b);
  a.Nb = a.u.C.setTimeout(a.ce, b);
  a.a.i(a.q() + "'s receive timeout set to " + b + " ms.")
}
function Ld(a) {
  a.W != Se && (a.W == ff || a.W == 2 ? Te(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.W)))
}
function cf(a) {
  var b = new Vd;
  b.Sa = a.Sa;
  b.Gd = 2;
  b.nd = 2;
  if(!a.B.Jc) {
    b.Kd = j
  }
  b.rb = a.B.rb;
  b.Lc = a.Pa;
  if(b.Lc) {
    b.Ad = 4096
  }
  b.yd = 3E5;
  b.wd = a.Pa ? Math.floor(10) : 0;
  b.Vd = n;
  if(a.Da) {
    b.Rd = k, b.yc = Math.floor((a.Pa ? 358E4 : 25E3) / 1E3)
  }
  b.Q = zd(a.B.uc);
  b.Ib = a.B.sd;
  a.s.push(b);
  a.Ka = b.Q
}
function Nd(a, b) {
  b && (a.kb += 0.5);
  a.b()
}
r.$ = function() {
  this.ba && !this.Wa && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.Rb) {
    this.a.p(this.q() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.ba;
    this.ba = j;
    !a && !this.s.length && cf(this);
    for(a = 0;a < this.s.length;a++) {
      this.a.i(this.q() + " SEND " + O(this.s[a]))
    }
    if(this.Ia()) {
      for(var a = [], b = 0, c = this.s.length;b < c;b++) {
        this.s[b].N(a), a.push("\n")
      }
      this.s = [];
      a = a.join("");
      b = this.Da ? this.z.ja : this.z.na;
      this.m = Z.gc(this, this.Da ? this.z.Fd : this.z.Od);
      this.Oc = this.u.C === $b ? ma() : this.u.C.getTime();
      this.m.xc(b, "POST", a);
      Te(this, 3E3 * (1.5 + (b.indexOf("https://") == 0 ? 3 : 1)) + 4E3 + (this.Pa ? 0 : this.Da ? 25E3 : 0))
    }else {
      if(this.W == ff) {
        a = [];
        b = 0;
        for(c = this.s.length;b < c;b++) {
          a.push(this.s[b].F())
        }
        this.s = [];
        this.m ? this.m.ub(a) : (b = this.z, this.m = new Qd(this), this.m.Qb = b.We.gc(this.m), this.Oc = this.u.C === $b ? ma() : this.u.C.getTime(), this.m.cc(b.host, b.port), this.m.Y || (this.m.ub(a), this.m.Y || Te(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.W))
      }
    }
  }
};
function df(a, b, c) {
  !a.ba && !a.s.length && cf(a);
  for(var d = Math.max(c, a.Na + 1), e = xd(b), c = [], f = 0;f < e.length;f++) {
    var h = e[f];
    (d == k || h >= d) && c.push([h, b.A.j[h][0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (a.Na == -1 || a.Na + 1 != e) && a.s.push(new Zd(e)), a.s.push(new Xd(f)), a.Na = e
  }
}
r.c = function() {
  this.a.info(this.q() + " in disposeInternal.");
  gf.k.c.call(this);
  this.Ud = this.u.C === $b ? ma() : this.u.C.getTime();
  this.s = [];
  qf(this);
  this.m && this.m.b();
  var a = this.B;
  this.B = k;
  kf(a, this)
};
function lf(a, b) {
  !a.ba && !a.s.length && cf(a);
  a.s.push(new de(b, j));
  a.Wd = j
}
function jf(a, b, c, d) {
  this.u = a;
  this.B = b;
  this.bd = c;
  this.Yc = d
}
D(jf, I);
r = jf.prototype;
r.ba = n;
r.Wa = n;
r.Eb = k;
r.Ka = k;
r.a = T("cw.net.DoNothingTransport");
function rf(a) {
  a.Eb = a.u.C.setTimeout(function() {
    a.Eb = k;
    a.Yc--;
    a.Yc ? rf(a) : a.b()
  }, a.bd)
}
r.$ = function() {
  this.ba && !this.Wa && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.ba = j;
  rf(this)
};
r.n = function(a) {
  a.push("<DoNothingTransport delay=", String(this.bd), ">")
};
r.Ia = ba(n);
r.q = ba("Wast. T");
r.Wc = ba(n);
r.c = function() {
  this.a.info(this.q() + " in disposeInternal.");
  jf.k.c.call(this);
  this.Eb != k && this.u.C.clearTimeout(this.Eb);
  var a = this.B;
  this.B = k;
  kf(a, this)
};
var sf;
(function() {
  function a(a) {
    a = a.match(/[\d]+/g);
    a.length = 3;
    return a.join(".")
  }
  var b = n, c = "";
  if(navigator.plugins && navigator.plugins.length) {
    var d = navigator.plugins["Shockwave Flash"];
    d && (b = j, d.description && (c = a(d.description)));
    navigator.plugins["Shockwave Flash 2.0"] && (b = j, c = "2.0.0.11")
  }else {
    if(navigator.mimeTypes && navigator.mimeTypes.length) {
      (b = (d = navigator.mimeTypes["application/x-shockwave-flash"]) && d.enabledPlugin) && (c = a(d.enabledPlugin.description))
    }else {
      try {
        d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), b = j, c = a(d.GetVariable("$version"))
      }catch(e) {
        try {
          d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), b = j, c = "6.0.21"
        }catch(f) {
          try {
            d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), b = j, c = a(d.GetVariable("$version"))
          }catch(h) {
          }
        }
      }
    }
  }
  sf = c
})();
function tf(a) {
  this.ve = a;
  this.g = []
}
D(tf, I);
var uf = [];
tf.prototype.Ec = function() {
  eb(this.g, Sb);
  this.g.length = 0
};
tf.prototype.c = function() {
  tf.k.c.call(this);
  this.Ec()
};
tf.prototype.handleEvent = function() {
  g(Error("EventHandler.handleEvent not implemented"))
};
function vf() {
}
(function(a) {
  a.hd = function() {
    return a.ye || (a.ye = new a)
  }
})(vf);
vf.prototype.Fe = 0;
vf.hd();
function wf(a) {
  this.ic = a || Ec();
  this.Le = xf
}
D(wf, Zb);
wf.prototype.xe = vf.hd();
var xf = k;
r = wf.prototype;
r.U = k;
r.wa = n;
r.l = k;
r.Le = k;
r.De = k;
r.t = k;
r.da = k;
r.Xa = k;
r.Ye = n;
function yf(a) {
  return a.U || (a.U = ":" + (a.xe.Fe++).toString(36))
}
r.ua = o("l");
r.getParent = o("t");
r.Hc = function(a) {
  this.t && this.t != a && g(Error("Method not supported"));
  wf.k.Hc.call(this, a)
};
r.gd = o("ic");
r.Ya = function() {
  this.l = this.ic.createElement("div")
};
function zf(a, b) {
  a.wa && g(Error("Component already rendered"));
  a.l || a.Ya();
  b ? b.insertBefore(a.l, k) : a.ic.ea.body.appendChild(a.l);
  (!a.t || a.t.wa) && a.Ab()
}
r.Ab = function() {
  this.wa = j;
  Af(this, function(a) {
    !a.wa && a.ua() && a.Ab()
  })
};
function Bf(a) {
  Af(a, function(a) {
    a.wa && Bf(a)
  });
  a.Fb && a.Fb.Ec();
  a.wa = n
}
r.c = function() {
  wf.k.c.call(this);
  this.wa && Bf(this);
  this.Fb && (this.Fb.b(), delete this.Fb);
  Af(this, function(a) {
    a.b()
  });
  !this.Ye && this.l && Nc(this.l);
  this.t = this.De = this.l = this.Xa = this.da = k
};
function Af(a, b) {
  a.da && eb(a.da, b, i)
}
r.removeChild = function(a, b) {
  if(a) {
    var c = w(a) ? a : yf(a), a = this.Xa && c ? (c in this.Xa ? this.Xa[c] : i) || k : k;
    if(c && a) {
      var d = this.Xa;
      c in d && delete d[c];
      ib(this.da, a);
      b && (Bf(a), a.l && Nc(a.l));
      c = a;
      c == k && g(Error("Unable to set parent component"));
      c.t = k;
      wf.k.Hc.call(c, k)
    }
  }
  a || g(Error("Child is not in parent component"));
  return a
};
function Cf(a, b) {
  wf.call(this, b);
  this.re = a;
  this.kc = new tf(this);
  this.Db = new Q
}
D(Cf, wf);
r = Cf.prototype;
r.a = T("goog.ui.media.FlashObject");
r.$e = "window";
r.Uc = "#000000";
r.ae = "sameDomain";
function Df(a, b, c) {
  a.Sc = w(b) ? b : Math.round(b) + "px";
  a.rc = w(c) ? c : Math.round(c) + "px";
  if(a.ua()) {
    b = a.ua() ? a.ua().firstChild : k, c = a.rc, c == i && g(Error("missing height argument")), b.style.width = Oc(a.Sc), b.style.height = Oc(c)
  }
}
r.Ab = function() {
  Cf.k.Ab.call(this);
  var a = this.ua(), b;
  b = G ? '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="%s" name="%s" class="%s"><param name="movie" value="%s"/><param name="quality" value="high"/><param name="FlashVars" value="%s"/><param name="bgcolor" value="%s"/><param name="AllowScriptAccess" value="%s"/><param name="allowFullScreen" value="true"/><param name="SeamlessTabbing" value="false"/>%s</object>' : '<embed quality="high" id="%s" name="%s" class="%s" src="%s" FlashVars="%s" bgcolor="%s" AllowScriptAccess="%s" allowFullScreen="true" SeamlessTabbing="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" %s></embed>';
  for(var c = G ? '<param name="wmode" value="%s"/>' : "wmode=%s", c = na(c, this.$e), d = this.Db.ga(), e = this.Db.H(), f = [], h = 0;h < d.length;h++) {
    var l = pa(d[h]), m = pa(e[h]);
    f.push(l + "=" + m)
  }
  b = na(b, yf(this), yf(this), "goog-ui-media-flash-object", F(this.re), F(f.join("&")), this.Uc, this.ae, c);
  a.innerHTML = b;
  this.Sc && this.rc && Df(this, this.Sc, this.rc);
  a = this.kc;
  b = this.ua();
  c = Za(pb);
  u(c) || (uf[0] = c, c = uf);
  for(d = 0;d < c.length;d++) {
    a.g.push(Pb(b, c[d], rb || a, n, a.ve || a))
  }
};
r.Ya = function() {
  this.Ld != k && !(xa(sf, this.Ld) >= 0) && (this.a.D("Required flash version not found:" + this.Ld), g(Error("Method not supported")));
  var a = this.gd().createElement("div");
  a.className = "goog-ui-media-flash";
  this.l = a
};
r.c = function() {
  Cf.k.c.call(this);
  this.Db = k;
  this.kc.b();
  this.kc = k
};
function Ef(a) {
  E.call(this, a)
}
D(Ef, E);
Ef.prototype.name = "cw.loadflash.FlashLoadFailed";
s.__loadFlashObject_callbacks = {};
function Ff(a, b, c) {
  function d() {
    e && delete s.__loadFlashObject_callbacks[e]
  }
  var e;
  if(Ja && !Va("1.8.1.20")) {
    return jc(new Ef("Flash corrupts Error hierarchy in Firefox 2.0.0.0; disabled for all < 2.0.0.20"))
  }
  if(!(xa(sf, "9") >= 0)) {
    return b = sf, jc(new Ef("Need Flash Player 9+; had " + (b ? b : "none")))
  }
  var f;
  e = "_" + Dd();
  var h = new M(d);
  s.__loadFlashObject_callbacks[e] = function() {
    a.setTimeout(function() {
      d();
      fc(h, P(f))
    }, 0)
  };
  b.Db.set("onloadcallback", '__loadFlashObject_callbacks["' + e + '"]()');
  f = yf(b);
  zf(b, c);
  return h
}
function Gf(a, b, c) {
  var d = Ff(a, b, c), e = a.setTimeout(function() {
    d.cancel()
  }, 8E3);
  d.Tc(function(b) {
    a.clearTimeout(e);
    return b
  });
  return d
}
;function Hf() {
  if(Ja) {
    this.ra = {}, this.Xb = {}, this.Sb = []
  }
}
Hf.prototype.a = T("goog.net.xhrMonitor");
Hf.prototype.zb = Ja;
function If(a) {
  var b = Jf;
  if(b.zb) {
    var c = w(a) ? a : ga(a) ? x(a) : "";
    b.a.p("Pushing context: " + a + " (" + c + ")");
    b.Sb.push(c)
  }
}
function Kf() {
  var a = Jf;
  if(a.zb) {
    var b = a.Sb.pop();
    a.a.p("Popping context: " + b);
    Lf(a, b)
  }
}
function Mf(a) {
  var b = Jf;
  if(b.zb) {
    a = x(a);
    b.a.i("Opening XHR : " + a);
    for(var c = 0;c < b.Sb.length;c++) {
      var d = b.Sb[c];
      Nf(b.ra, d, a);
      Nf(b.Xb, a, d)
    }
  }
}
function Lf(a, b) {
  var c = a.Xb[b], d = a.ra[b];
  c && d && (a.a.p("Updating dependent contexts"), eb(c, function(a) {
    eb(d, function(b) {
      Nf(this.ra, a, b);
      Nf(this.Xb, b, a)
    }, this)
  }, a))
}
function Nf(a, b, c) {
  a[b] || (a[b] = []);
  db(a[b], c) >= 0 || a[b].push(c)
}
var Jf = new Hf;
function Of() {
}
Of.prototype.wb = k;
var Pf;
function Qf() {
}
D(Qf, Of);
function Rf(a) {
  return(a = Sf(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function Tf(a) {
  var b = {};
  Sf(a) && (b[0] = j, b[1] = j);
  return b
}
Qf.prototype.sc = k;
function Sf(a) {
  if(!a.sc && typeof XMLHttpRequest == "undefined" && typeof ActiveXObject != "undefined") {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.sc = d
      }catch(e) {
      }
    }
    g(Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"))
  }
  return a.sc
}
Pf = new Qf;
function Uf(a) {
  this.headers = new Q;
  this.Ta = a || k
}
D(Uf, Zb);
Uf.prototype.a = T("goog.net.XhrIo");
var Vf = /^https?:?$/i;
r = Uf.prototype;
r.ca = n;
r.e = k;
r.Wb = k;
r.hb = "";
r.rd = "";
r.eb = 0;
r.fb = "";
r.jc = n;
r.Gb = n;
r.tc = n;
r.va = n;
r.Tb = 0;
r.za = k;
r.Md = "";
r.Ze = n;
r.send = function(a, b, c, d) {
  this.e && g(Error("[goog.net.XhrIo] Object is active with another request"));
  b = b ? b.toUpperCase() : "GET";
  this.hb = a;
  this.fb = "";
  this.eb = 0;
  this.rd = b;
  this.jc = n;
  this.ca = j;
  this.e = this.Ta ? Rf(this.Ta) : Rf(Pf);
  this.Wb = this.Ta ? this.Ta.wb || (this.Ta.wb = Tf(this.Ta)) : Pf.wb || (Pf.wb = Tf(Pf));
  Mf(this.e);
  this.e.onreadystatechange = z(this.Dd, this);
  try {
    this.a.i(Wf(this, "Opening Xhr")), this.tc = j, this.e.open(b, a, j), this.tc = n
  }catch(e) {
    this.a.i(Wf(this, "Error opening Xhr: " + e.message));
    Xf(this, e);
    return
  }
  var a = c || "", f = this.headers.L();
  d && Tc(d, function(a, b) {
    f.set(b, a)
  });
  b == "POST" && !f.T("Content-Type") && f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  Tc(f, function(a, b) {
    this.e.setRequestHeader(b, a)
  }, this);
  if(this.Md) {
    this.e.responseType = this.Md
  }
  if("withCredentials" in this.e) {
    this.e.withCredentials = this.Ze
  }
  try {
    if(this.za) {
      $b.clearTimeout(this.za), this.za = k
    }
    if(this.Tb > 0) {
      this.a.i(Wf(this, "Will abort after " + this.Tb + "ms if incomplete")), this.za = $b.setTimeout(z(this.Ve, this), this.Tb)
    }
    this.a.i(Wf(this, "Sending request"));
    this.Gb = j;
    this.e.send(a);
    this.Gb = n
  }catch(h) {
    this.a.i(Wf(this, "Send error: " + h.message)), Xf(this, h)
  }
};
r.dispatchEvent = function(a) {
  if(this.e) {
    If(this.e);
    try {
      return Uf.k.dispatchEvent.call(this, a)
    }finally {
      Kf()
    }
  }else {
    return Uf.k.dispatchEvent.call(this, a)
  }
};
r.Ve = function() {
  if(typeof ca != "undefined" && this.e) {
    this.fb = "Timed out after " + this.Tb + "ms, aborting", this.eb = 8, this.a.i(Wf(this, this.fb)), this.dispatchEvent("timeout"), this.abort(8)
  }
};
function Xf(a, b) {
  a.ca = n;
  if(a.e) {
    a.va = j, a.e.abort(), a.va = n
  }
  a.fb = b;
  a.eb = 5;
  Yf(a);
  Zf(a)
}
function Yf(a) {
  if(!a.jc) {
    a.jc = j, a.dispatchEvent("complete"), a.dispatchEvent("error")
  }
}
r.abort = function(a) {
  if(this.e && this.ca) {
    this.a.i(Wf(this, "Aborting")), this.ca = n, this.va = j, this.e.abort(), this.va = n, this.eb = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Zf(this)
  }
};
r.c = function() {
  if(this.e) {
    if(this.ca) {
      this.ca = n, this.va = j, this.e.abort(), this.va = n
    }
    Zf(this, j)
  }
  Uf.k.c.call(this)
};
r.Dd = function() {
  !this.tc && !this.Gb && !this.va ? this.Ge() : ag(this)
};
r.Ge = function() {
  ag(this)
};
function ag(a) {
  if(a.ca && typeof ca != "undefined") {
    if(a.Wb[1] && a.ha() == 4 && bg(a) == 2) {
      a.a.i(Wf(a, "Local request error detected and ignored"))
    }else {
      if(a.Gb && a.ha() == 4) {
        $b.setTimeout(z(a.Dd, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), a.ha() == 4) {
          a.a.i(Wf(a, "Request complete"));
          a.ca = n;
          var b;
          a: {
            switch(bg(a)) {
              case 0:
                b = w(a.hb) ? a.hb.match(he)[1] || k : a.hb.R;
                b = !(b ? Vf.test(b) : self.location ? Vf.test(self.location.protocol) : 1);
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
                b = j;
                break a;
              default:
                b = n
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
            a.fb = c + " [" + bg(a) + "]";
            Yf(a)
          }
          Zf(a)
        }
      }
    }
  }
}
function Zf(a, b) {
  if(a.e) {
    var c = a.e, d = a.Wb[0] ? ea : k;
    a.e = k;
    a.Wb = k;
    if(a.za) {
      $b.clearTimeout(a.za), a.za = k
    }
    b || (If(c), a.dispatchEvent("ready"), Kf());
    var e = Jf;
    if(e.zb) {
      var f = x(c);
      e.a.i("Closing XHR : " + f);
      delete e.Xb[f];
      for(var h in e.ra) {
        ib(e.ra[h], f), e.ra[h].length == 0 && delete e.ra[h]
      }
    }
    try {
      c.onreadystatechange = d
    }catch(l) {
      a.a.K("Problem encountered resetting onreadystatechange: " + l.message)
    }
  }
}
r.ha = function() {
  return this.e ? this.e.readyState : 0
};
function bg(a) {
  try {
    return a.ha() > 2 ? a.e.status : -1
  }catch(b) {
    return a.a.D("Can not get status: " + b.message), -1
  }
}
r.getResponseHeader = function(a) {
  return this.e && this.ha() == 4 ? this.e.getResponseHeader(a) : i
};
function Wf(a, b) {
  return b + " [" + a.rd + " " + a.hb + " " + bg(a) + "]"
}
;var cg = !(G || Ka && !Va("420+"));
function dg(a, b) {
  this.Ub = a;
  this.P = b
}
D(dg, I);
r = dg.prototype;
r.m = k;
r.ma = -1;
r.kd = n;
r.md = "Content-Length,Server,Date,Expires,Keep-Alive,Content-Type,Transfer-Encoding,Cache-Control".split(",");
function eg(a) {
  var b = Qe(a.$c), c = b[0], b = b[1], d = s.parent;
  d ? (d.__XHRMaster_onframes(a.P, c, b), b != 1 && a.b()) : a.b()
}
r.we = function() {
  eg(this);
  if(!this.Y) {
    var a = s.parent;
    a && a.__XHRMaster_oncomplete(this.P);
    this.b()
  }
};
r.Je = function() {
  var a = s.parent;
  if(a) {
    this.ma = this.m.ha();
    if(this.ma >= 2 && !this.kd) {
      for(var b = new Q, c = this.md.length;c--;) {
        var d = this.md[c];
        try {
          b.set(d, this.m.e.getResponseHeader(d))
        }catch(e) {
        }
      }
      if(b.G() && (this.kd = j, a.__XHRMaster_ongotheaders(this.P, Yc(b)), this.Y)) {
        return
      }
    }
    a.__XHRMaster_onreadystatechange(this.P, this.ma);
    cg && this.ma == 3 && eg(this)
  }else {
    this.b()
  }
};
r.xc = function(a, b, c) {
  this.m = new Uf;
  Pb(this.m, "readystatechange", z(this.Je, this));
  Pb(this.m, "complete", z(this.we, this));
  this.m.send(a, b, c, {"Content-Type":"application/octet-stream"});
  this.$c = new Pe(this.m.e, 1048576)
};
r.c = function() {
  dg.k.c.call(this);
  delete this.$c;
  this.m && this.m.b();
  delete this.Ub.qb[this.P];
  delete this.Ub
};
function fg() {
  this.qb = {}
}
D(fg, I);
fg.prototype.Ce = function(a, b, c, d) {
  var e = new dg(this, a);
  this.qb[a] = e;
  e.xc(b, c, d)
};
fg.prototype.le = function(a) {
  (a = this.qb[a]) && a.b()
};
fg.prototype.c = function() {
  fg.k.c.call(this);
  for(var a = Za(this.qb);a.length;) {
    a.pop().b()
  }
  delete this.qb
};
var gg = new fg;
s.__XHRSlave_makeRequest = z(gg.Ce, gg);
s.__XHRSlave_dispose = z(gg.le, gg);
function hg(a) {
  var b = new Cf("/compiled_client/FlashConnector.swf?cb=4bdfc178fc0e508c0cd5efc3fdb09920");
  b.Uc = "#777777";
  Df(b, 300, 30);
  var c = P("FlashConnectorSwf");
  c || g(Error("no FlashConnectorSwf?"));
  return Gf(a.C, b, c)
}
function ig(a, b, c) {
  var d = new je(document.location);
  if(c) {
    var e = d.M, f = s.__demo_mainSocketPort, d = hg(a);
    d.vb(function(b) {
      b = new Pd(a, b);
      return new Ve(e, f, b)
    });
    return d
  }else {
    return b ? (b = s.__demo_shared_domain, d = d.L(), me(d, "_____random_____." + b)) : d = d.L(), oe(d, "/httpface/"), pe(d, "", i), d = new We(d.toString().replace("_____random_____", "%random%")), ic(d)
  }
}
;A("Minerva.HttpEndpoint", We);
A("Minerva.SocketEndpoint", Ve);
A("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.ue;
$.prototype.bindToProtocol = $.prototype.be;
$.prototype.start = $.prototype.start;
$.prototype.sendStrings = $.prototype.Me;
$.prototype.reset = $.prototype.reset;
A("Minerva.Logger", R);
R.Level = S;
R.getLogger = T;
R.prototype.setLevel = R.prototype.Gc;
R.prototype.shout = R.prototype.Pe;
R.prototype.severe = R.prototype.K;
R.prototype.warning = R.prototype.D;
R.prototype.info = R.prototype.info;
R.prototype.config = R.prototype.fe;
R.prototype.fine = R.prototype.i;
R.prototype.finer = R.prototype.pe;
R.prototype.finest = R.prototype.p;
S.OFF = hd;
S.SHOUT = id;
S.SEVERE = kd;
S.WARNING = ld;
S.INFO = md;
S.CONFIG = nd;
S.FINE = od;
S.FINER = pd;
S.FINEST = qd;
S.ALL = rd;
A("Minerva.LogManager", U);
U.getRoot = U.pc;
A("Minerva.DivConsole", td);
td.prototype.setCapturing = td.prototype.Oe;
A("Minerva.bind", z);
A("Minerva.repr", O);
A("Minerva.theCallQueue", mc);
A("Minerva.getEndpointByQueryArgs", function(a) {
  var b;
  b = (new je(document.location)).J;
  var c = b.get("mode") != "http";
  b = Boolean(Number(b.get("useSub", "1")));
  return ig(a, b, c)
});
M.prototype.addCallback = M.prototype.vb;
M.prototype.addErrback = M.prototype.Zd;
M.prototype.addBoth = M.prototype.Tc;
})();
