(function(){function g(a) {
  throw a;
}
var i = void 0, l = null;
function aa(a) {
  return function() {
    return this[a]
  }
}
function ba(a) {
  return function() {
    return a
  }
}
var m, q = this;
function ca(a, b) {
  var c = a.split("."), d = q;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && b !== i ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
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
function fa(a) {
  var b = r(a);
  return b == "array" || b == "object" && typeof a.length == "number"
}
function ga(a) {
  return ha(a) && typeof a.getFullYear == "function"
}
function s(a) {
  return typeof a == "string"
}
function u(a) {
  return r(a) == "function"
}
function ha(a) {
  a = r(a);
  return a == "object" || a == "array" || a == "function"
}
function ia(a) {
  return a[ja] || (a[ja] = ++ka)
}
var ja = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36), ka = 0;
function la(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function ma(a, b, c) {
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
function v(a, b, c) {
  v = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? la : ma;
  return v.apply(l, arguments)
}
var na = Date.now || function() {
  return+new Date
};
function x(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.I = b.prototype;
  a.prototype = new c
}
;function oa(a) {
  return u(a) || typeof a == "object" && u(a.call) && u(a.apply)
}
;function pa(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function qa(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var ra = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function sa() {
}
function ta(a) {
  var b = [];
  ua(new sa, a, b);
  return b.join("")
}
function ua(a, b, c) {
  switch(typeof b) {
    case "string":
      va(b, c);
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
      if(r(b) == "array") {
        var d = b.length;
        c.push("[");
        for(var e = "", f = 0;f < d;f++) {
          c.push(e), ua(a, b[f], c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(e in b) {
        Object.prototype.hasOwnProperty.call(b, e) && (f = b[e], typeof f != "function" && (c.push(d), va(e, c), c.push(":"), ua(a, f, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var wa = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"}, xa = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function va(a, b) {
  b.push('"', a.replace(xa, function(a) {
    if(a in wa) {
      return wa[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    b < 16 ? e += "000" : b < 256 ? e += "00" : b < 4096 && (e += "0");
    return wa[a] = e + b.toString(16)
  }), '"')
}
;function y(a) {
  this.stack = Error().stack || "";
  if(a) {
    this.message = String(a)
  }
}
x(y, Error);
y.prototype.name = "CustomError";
function ya(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
function za(a) {
  if(!Aa.test(a)) {
    return a
  }
  a.indexOf("&") != -1 && (a = a.replace(Ba, "&amp;"));
  a.indexOf("<") != -1 && (a = a.replace(Ca, "&lt;"));
  a.indexOf(">") != -1 && (a = a.replace(Da, "&gt;"));
  a.indexOf('"') != -1 && (a = a.replace(Ea, "&quot;"));
  return a
}
var Ba = /&/g, Ca = /</g, Da = />/g, Ea = /\"/g, Aa = /[&<>\"]/;
function Fa(a, b) {
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;c == 0 && h < f;h++) {
    var j = d[h] || "", n = e[h] || "", o = RegExp("(\\d*)(\\D*)", "g"), w = RegExp("(\\d*)(\\D*)", "g");
    do {
      var k = o.exec(j) || ["", "", ""], p = w.exec(n) || ["", "", ""];
      if(k[0].length == 0 && p[0].length == 0) {
        break
      }
      c = Ga(k[1].length == 0 ? 0 : parseInt(k[1], 10), p[1].length == 0 ? 0 : parseInt(p[1], 10)) || Ga(k[2].length == 0, p[2].length == 0) || Ga(k[2], p[2])
    }while(c == 0)
  }
  return c
}
function Ga(a, b) {
  if(a < b) {
    return-1
  }else {
    if(a > b) {
      return 1
    }
  }
  return 0
}
;function Ha(a, b) {
  b.unshift(a);
  y.call(this, ya.apply(l, b));
  b.shift();
  this.rc = a
}
x(Ha, y);
Ha.prototype.name = "AssertionError";
function Ia(a, b) {
  g(new Ha("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;var z = Array.prototype, Ja = z.indexOf ? function(a, b, c) {
  return z.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == l ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
  if(s(a)) {
    return!s(b) || b.length != 1 ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, Ka = z.some ? function(a, b, c) {
  return z.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = s(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
}, La = z.every ? function(a, b, c) {
  return z.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = s(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
function Ma(a) {
  return z.concat.apply(z, arguments)
}
function Na(a, b) {
  z.sort.call(a, b || Oa)
}
function Oa(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;function Pa(a, b, c) {
  var d = Ja(c, a);
  if(d != -1) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = r(a);
    if(d == "boolean" || d == "number" || d == "null" || d == "undefined") {
      b.push(String(a))
    }else {
      if(d == "string") {
        va(a, b)
      }else {
        if(oa(a.j)) {
          a.j(b, c)
        }else {
          if(oa(a.Pb)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if(d == "array") {
                d = a.length;
                b.push("[");
                for(var e = "", f = 0;f < d;f++) {
                  b.push(e), Pa(a[f], b, c), e = ", "
                }
                b.push("]")
              }else {
                if(d == "object") {
                  if(ga(a) && typeof a.valueOf == "function") {
                    b.push("new Date(", String(a.valueOf()), ")")
                  }else {
                    for(var d = qa(a).concat(ra), e = {}, h = f = 0;h < d.length;) {
                      var j = d[h++], n = ha(j) ? "o" + ia(j) : (typeof j).charAt(0) + j;
                      Object.prototype.hasOwnProperty.call(e, n) || (e[n] = !0, d[f++] = j)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      f = d[h], Object.prototype.hasOwnProperty.call(a, f) && (j = a[f], b.push(e), va(f, b), b.push(": "), Pa(j, b, c), e = ", ")
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
function A(a, b, c) {
  c || (c = []);
  Pa(a, b, c)
}
function B(a, b) {
  var c = [];
  A(a, c, b);
  return c.join("")
}
;function Qa(a) {
  if(typeof a.v == "function") {
    a = a.v()
  }else {
    if(fa(a) || s(a)) {
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
function Ra(a) {
  if(typeof a.M == "function") {
    return a.M()
  }
  if(s(a)) {
    return a.split("")
  }
  if(fa(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return pa(a)
}
function Sa(a, b) {
  if(typeof a.every == "function") {
    return a.every(b, i)
  }
  if(fa(a) || s(a)) {
    return La(a, b, i)
  }
  var c;
  if(typeof a.oa == "function") {
    c = a.oa()
  }else {
    if(typeof a.M != "function") {
      if(fa(a) || s(a)) {
        c = [];
        for(var d = a.length, e = 0;e < d;e++) {
          c.push(e)
        }
      }else {
        c = qa(a)
      }
    }else {
      c = i
    }
  }
  for(var d = Ra(a), e = d.length, f = 0;f < e;f++) {
    if(!b.call(i, d[f], c && c[f], a)) {
      return!1
    }
  }
  return!0
}
;function Ta(a, b) {
  this.c = {};
  this.g = [];
  var c = arguments.length;
  if(c > 1) {
    c % 2 && g(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.Aa(a)
  }
}
m = Ta.prototype;
m.k = 0;
m.ab = 0;
m.v = aa("k");
m.M = function() {
  Va(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.c[this.g[b]])
  }
  return a
};
m.oa = function() {
  Va(this);
  return this.g.concat()
};
m.cb = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(C(this.c, c) && this.c[c] == a) {
      return!0
    }
  }
  return!1
};
m.e = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.k != a.v()) {
    return!1
  }
  var c = b || Wa;
  Va(this);
  for(var d, e = 0;d = this.g[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
function Wa(a, b) {
  return a === b
}
m.sa = function() {
  return this.k == 0
};
m.clear = function() {
  this.c = {};
  this.ab = this.k = this.g.length = 0
};
m.remove = function(a) {
  return C(this.c, a) ? (delete this.c[a], this.k--, this.ab++, this.g.length > 2 * this.k && Va(this), !0) : !1
};
function Va(a) {
  if(a.k != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      C(a.c, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.k != a.g.length) {
    for(var e = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], C(e, d) || (a.g[c++] = d, e[d] = 1), b++
    }
    a.g.length = c
  }
}
m.get = function(a, b) {
  return C(this.c, a) ? this.c[a] : b
};
m.set = function(a, b) {
  C(this.c, a) || (this.k++, this.g.push(a), this.ab++);
  this.c[a] = b
};
m.Aa = function(a) {
  var b;
  a instanceof Ta ? (b = a.oa(), a = a.M()) : (b = qa(a), a = pa(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
function C(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function Xa(a) {
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
;function D(a, b) {
  this.Q = a;
  this.O = b
}
D.prototype.e = function(a) {
  return a instanceof D && this.Q == a.Q && this.O.join(",") == a.O
};
D.prototype.j = function(a, b) {
  a.push("new SACK(", String(this.Q), ", ");
  A(this.O, a, b);
  a.push(")")
};
function Ya() {
  this.o = new Ta
}
m = Ya.prototype;
m.S = -1;
m.H = 0;
m.append = function(a) {
  var b = Xa(a);
  this.o.set(this.S + 1, [a, b]);
  this.S += 1;
  this.H += b
};
m.extend = function(a) {
  for(var b = 0;b < a.length;b++) {
    this.append(a[b])
  }
};
m.j = function(a) {
  a.push("<Queue with ", String(this.o.v()), " item(s), counter=#", String(this.S), ", size=", String(this.H), ">")
};
function Za(a) {
  Va(a.o);
  Na(a.o.g);
  return a.o.g
}
function $a() {
  this.J = new Ta
}
$a.prototype.U = -1;
$a.prototype.H = 0;
function ab(a) {
  var b = a.J.oa();
  Na(b);
  return new D(a.U, b)
}
var bb = {};
function cb() {
  return!0
}
;var db, eb, fb, gb;
function hb() {
  return q.navigator ? q.navigator.userAgent : l
}
gb = fb = eb = db = !1;
var ib;
if(ib = hb()) {
  var jb = q.navigator;
  db = ib.indexOf("Opera") == 0;
  eb = !db && ib.indexOf("MSIE") != -1;
  fb = !db && ib.indexOf("WebKit") != -1;
  gb = !db && !fb && jb.product == "Gecko"
}
var E = eb, kb = gb, lb = fb, mb = q.navigator, nb = (mb && mb.platform || "").indexOf("Mac") != -1, ob;
a: {
  var pb = "", qb;
  if(db && q.opera) {
    var rb = q.opera.version, pb = typeof rb == "function" ? rb() : rb
  }else {
    if(kb ? qb = /rv\:([^\);]+)(\)|;)/ : E ? qb = /MSIE\s+([^\);]+)(\)|;)/ : lb && (qb = /WebKit\/(\S+)/), qb) {
      var sb = qb.exec(hb()), pb = sb ? sb[1] : ""
    }
  }
  if(E) {
    var tb, ub = q.document;
    tb = ub ? ub.documentMode : i;
    if(tb > parseFloat(pb)) {
      ob = String(tb);
      break a
    }
  }
  ob = pb
}
var vb = {};
function wb(a) {
  vb[a] || (vb[a] = Fa(ob, a) >= 0)
}
var xb = {};
function yb() {
  return xb[9] || (xb[9] = E && document.documentMode && document.documentMode >= 9)
}
;var zb;
!E || yb();
E && wb("8");
function F() {
}
F.prototype.K = !1;
F.prototype.d = function() {
  if(!this.K) {
    this.K = !0, this.l()
  }
};
F.prototype.l = function() {
  this.Tb && Ab.apply(l, this.Tb)
};
function Ab(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    fa(d) ? Ab.apply(l, d) : d && typeof d.d == "function" && d.d()
  }
}
;function Bb(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
x(Bb, F);
Bb.prototype.l = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
Bb.prototype.Sa = !1;
Bb.prototype.bc = !0;
var Cb = new Function("a", "return a");
function Db(a, b) {
  a && this.ra(a, b)
}
x(Db, Bb);
m = Db.prototype;
m.target = l;
m.relatedTarget = l;
m.offsetX = 0;
m.offsetY = 0;
m.clientX = 0;
m.clientY = 0;
m.screenX = 0;
m.screenY = 0;
m.button = 0;
m.keyCode = 0;
m.charCode = 0;
m.ctrlKey = !1;
m.altKey = !1;
m.shiftKey = !1;
m.metaKey = !1;
m.$b = !1;
m.ib = l;
m.ra = function(a, b) {
  var c = this.type = a.type;
  Bb.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(kb) {
      var e;
      a: {
        try {
          Cb(d.nodeName);
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
  this.$b = nb ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.ib = a;
  delete this.bc;
  delete this.Sa
};
m.l = function() {
  Db.I.l.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.ib = l
};
function Eb() {
}
var Fb = 0;
m = Eb.prototype;
m.key = 0;
m.Y = !1;
m.Ca = !1;
m.ra = function(a, b, c, d, e, f) {
  u(a) ? this.ob = !0 : a && a.handleEvent && u(a.handleEvent) ? this.ob = !1 : g(Error("Invalid listener argument"));
  this.ua = a;
  this.Cb = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.lb = f;
  this.Ca = !1;
  this.key = ++Fb;
  this.Y = !1
};
m.handleEvent = function(a) {
  return this.ob ? this.ua.call(this.lb || this.src, a) : this.ua.handleEvent.call(this.ua, a)
};
var Gb, Hb = (Gb = "ScriptEngine" in q && q.ScriptEngine() == "JScript") ? q.ScriptEngineMajorVersion() + "." + q.ScriptEngineMinorVersion() + "." + q.ScriptEngineBuildVersion() : "0";
function G(a, b) {
  this.sb = b;
  this.L = [];
  a > this.sb && g(Error("[goog.structs.SimplePool] Initial cannot be greater than max"));
  for(var c = 0;c < a;c++) {
    this.L.push(this.z ? this.z() : {})
  }
}
x(G, F);
G.prototype.z = l;
G.prototype.gb = l;
G.prototype.getObject = function() {
  return this.L.length ? this.L.pop() : this.z ? this.z() : {}
};
function Ib(a, b) {
  a.L.length < a.sb ? a.L.push(b) : Kb(a, b)
}
function Kb(a, b) {
  if(a.gb) {
    a.gb(b)
  }else {
    if(ha(b)) {
      if(u(b.d)) {
        b.d()
      }else {
        for(var c in b) {
          delete b[c]
        }
      }
    }
  }
}
G.prototype.l = function() {
  G.I.l.call(this);
  for(var a = this.L;a.length;) {
    Kb(this, a.pop())
  }
  delete this.L
};
var Lb, Mb, Nb, Ob, Pb, Qb, Rb, Sb, Tb, Ub, Vb;
(function() {
  function a() {
    return{k:0, X:0}
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
    return new Eb
  }
  function e() {
    return new Db
  }
  var f = Gb && !(Fa(Hb, "5.7") >= 0), h;
  Qb = function(a) {
    h = a
  };
  if(f) {
    Lb = function() {
      return j.getObject()
    };
    Mb = function(a) {
      Ib(j, a)
    };
    Nb = function() {
      return n.getObject()
    };
    Ob = function(a) {
      Ib(n, a)
    };
    Pb = function() {
      return o.getObject()
    };
    Rb = function() {
      Ib(o, c())
    };
    Sb = function() {
      return w.getObject()
    };
    Tb = function(a) {
      Ib(w, a)
    };
    Ub = function() {
      return k.getObject()
    };
    Vb = function(a) {
      Ib(k, a)
    };
    var j = new G(0, 600);
    j.z = a;
    var n = new G(0, 600);
    n.z = b;
    var o = new G(0, 600);
    o.z = c;
    var w = new G(0, 600);
    w.z = d;
    var k = new G(0, 600);
    k.z = e
  }else {
    Lb = a, Mb = ea, Nb = b, Ob = ea, Pb = c, Rb = ea, Sb = d, Tb = ea, Ub = e, Vb = ea
  }
})();
var H = {}, I = {}, Wb = {}, Xb = {};
function Yb(a, b, c, d, e) {
  if(b) {
    if(r(b) == "array") {
      for(var f = 0;f < b.length;f++) {
        Yb(a, b[f], c, d, e)
      }
      return l
    }else {
      var d = !!d, h = I;
      b in h || (h[b] = Lb());
      h = h[b];
      d in h || (h[d] = Lb(), h.k++);
      var h = h[d], j = ia(a), n;
      h.X++;
      if(h[j]) {
        n = h[j];
        for(f = 0;f < n.length;f++) {
          if(h = n[f], h.ua == c && h.lb == e) {
            if(h.Y) {
              break
            }
            return n[f].key
          }
        }
      }else {
        n = h[j] = Nb(), h.k++
      }
      f = Pb();
      f.src = a;
      h = Sb();
      h.ra(c, f, a, b, d, e);
      c = h.key;
      f.key = c;
      n.push(h);
      H[c] = h;
      Wb[j] || (Wb[j] = Nb());
      Wb[j].push(h);
      a.addEventListener ? (a == q || !a.Sb) && a.addEventListener(b, f, d) : a.attachEvent(b in Xb ? Xb[b] : Xb[b] = "on" + b, f);
      return c
    }
  }else {
    g(Error("Invalid event type"))
  }
}
function Zb(a, b, c, d, e) {
  if(r(b) == "array") {
    for(var f = 0;f < b.length;f++) {
      Zb(a, b[f], c, d, e)
    }
    return l
  }
  a = Yb(a, b, c, d, e);
  H[a].Ca = !0;
  return a
}
function $b(a) {
  if(H[a]) {
    var b = H[a];
    if(!b.Y) {
      var c = b.src, d = b.type, e = b.Cb, f = b.capture;
      c.removeEventListener ? (c == q || !c.Sb) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in Xb ? Xb[d] : Xb[d] = "on" + d, e);
      c = ia(c);
      e = I[d][f][c];
      if(Wb[c]) {
        var h = Wb[c], j = Ja(h, b);
        j >= 0 && z.splice.call(h, j, 1);
        h.length == 0 && delete Wb[c]
      }
      b.Y = !0;
      e.yb = !0;
      ac(d, f, c, e);
      delete H[a]
    }
  }
}
function ac(a, b, c, d) {
  if(!d.va && d.yb) {
    for(var e = 0, f = 0;e < d.length;e++) {
      if(d[e].Y) {
        var h = d[e].Cb;
        h.src = l;
        Rb(h);
        Tb(d[e])
      }else {
        e != f && (d[f] = d[e]), f++
      }
    }
    d.length = f;
    d.yb = !1;
    f == 0 && (Ob(d), delete I[a][b][c], I[a][b].k--, I[a][b].k == 0 && (Mb(I[a][b]), delete I[a][b], I[a].k--), I[a].k == 0 && (Mb(I[a]), delete I[a]))
  }
}
function bc(a, b, c, d, e) {
  var f = 1, b = ia(b);
  if(a[b]) {
    a.X--;
    a = a[b];
    a.va ? a.va++ : a.va = 1;
    try {
      for(var h = a.length, j = 0;j < h;j++) {
        var n = a[j];
        n && !n.Y && (f &= cc(n, e) !== !1)
      }
    }finally {
      a.va--, ac(c, d, b, a)
    }
  }
  return Boolean(f)
}
function cc(a, b) {
  var c = a.handleEvent(b);
  a.Ca && $b(a.key);
  return c
}
Qb(function(a, b) {
  if(!H[a]) {
    return!0
  }
  var c = H[a], d = c.type, e = I;
  if(!(d in e)) {
    return!0
  }
  var e = e[d], f, h;
  zb === i && (zb = E && !q.addEventListener);
  if(zb) {
    f = b || da("window.event");
    var j = !0 in e, n = !1 in e;
    if(j) {
      if(f.keyCode < 0 || f.returnValue != i) {
        return!0
      }
      a: {
        var o = !1;
        if(f.keyCode == 0) {
          try {
            f.keyCode = -1;
            break a
          }catch(w) {
            o = !0
          }
        }
        if(o || f.returnValue == i) {
          f.returnValue = !0
        }
      }
    }
    o = Ub();
    o.ra(f, this);
    f = !0;
    try {
      if(j) {
        for(var k = Nb(), p = o.currentTarget;p;p = p.parentNode) {
          k.push(p)
        }
        h = e[!0];
        h.X = h.k;
        for(var t = k.length - 1;!o.Sa && t >= 0 && h.X;t--) {
          o.currentTarget = k[t], f &= bc(h, k[t], d, !0, o)
        }
        if(n) {
          h = e[!1];
          h.X = h.k;
          for(t = 0;!o.Sa && t < k.length && h.X;t++) {
            o.currentTarget = k[t], f &= bc(h, k[t], d, !1, o)
          }
        }
      }else {
        f = cc(c, o)
      }
    }finally {
      if(k) {
        k.length = 0, Ob(k)
      }
      o.d();
      Vb(o)
    }
    return f
  }
  d = new Db(b, this);
  try {
    f = cc(c, d)
  }finally {
    d.d()
  }
  return f
});
var dc = 0;
var ec = q.window;
dc++;
dc++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function fc(a, b) {
  if(a.Ha) {
    a.ec || g(new gc(a)), a.ec = !1
  }
  a.Ha = !0;
  a.Ta = b;
  a.qa = !1;
  hc(a)
}
function ic(a, b, c) {
  a.Da.push([b, c, i]);
  a.Ha && hc(a)
}
function jc(a) {
  return Ka(a.Da, function(a) {
    return u(a[1])
  })
}
function hc(a) {
  a.$a && a.Ha && jc(a) && (q.clearTimeout(a.$a), delete a.$a);
  a.N && (a.N.lc--, delete a.N);
  for(var b = a.Ta, c = !1, d = !1;a.Da.length && a.zb == 0;) {
    var e = a.Da.shift(), f = e[0], h = e[1], e = e[2];
    if(f = a.qa ? h : f) {
      try {
        var j = f.call(e || a.nc, b);
        if(j !== i) {
          a.qa = a.qa && (j == b || j instanceof Error), a.Ta = b = j
        }
      }catch(n) {
        b = n, a.qa = !0, jc(a) || (c = !0)
      }
    }
  }
  a.Ta = b;
  if(d && a.zb) {
    ic(b, v(a.Rb, a, !0), v(a.Rb, a, !1)), b.mc = !0
  }
  if(c) {
    a.$a = q.setTimeout(function() {
      g(b)
    }, 0)
  }
}
function gc(a) {
  y.call(this);
  this.oc = a
}
x(gc, y);
gc.prototype.message = "Already called";
function kc(a) {
  this.s = a;
  this.Ga = [];
  this.hb = [];
  this.kc = v(this.ic, this)
}
kc.prototype.hc = l;
kc.prototype.ic = function() {
  this.hc = l;
  var a = this.Ga;
  this.Ga = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], e = c[1], c = c[2];
    try {
      d.apply(e, c)
    }catch(f) {
      this.s.setTimeout(function() {
        g(f)
      }, 0)
    }
  }
  if(this.Ga.length == 0) {
    a = this.hb;
    this.hb = [];
    for(b = 0;b < a.length;b++) {
      fc(a[b], l)
    }
  }
};
var lc = new kc(q.window);
function mc() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ na()).toString(36)
}
function nc(a) {
  return a.substr(0, a.length - 1)
}
var oc = /^(0|[1-9]\d*)$/, pc = /^(0|\-?[1-9]\d*)$/;
function qc(a) {
  var b = rc;
  return oc.test(a) && (a = parseInt(a, 10), a <= b) ? a : l
}
;function sc(a) {
  this.c = new Ta;
  a && this.Aa(a)
}
function tc(a) {
  var b = typeof a;
  return b == "object" && a || b == "function" ? "o" + ia(a) : b.substr(0, 1) + a
}
m = sc.prototype;
m.v = function() {
  return this.c.v()
};
m.add = function(a) {
  this.c.set(tc(a), a)
};
m.Aa = function(a) {
  for(var a = Ra(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
m.remove = function(a) {
  return this.c.remove(tc(a))
};
m.clear = function() {
  this.c.clear()
};
m.sa = function() {
  return this.c.sa()
};
m.contains = function(a) {
  a = tc(a);
  return C(this.c.c, a)
};
m.M = function() {
  return this.c.M()
};
m.e = function(a) {
  return this.v() == Qa(a) && uc(this, a)
};
function uc(a, b) {
  var c = Qa(b);
  if(a.v() > c) {
    return!1
  }
  !(b instanceof sc) && c > 5 && (b = new sc(b));
  return Sa(a, function(a) {
    if(typeof b.contains == "function") {
      a = b.contains(a)
    }else {
      if(typeof b.cb == "function") {
        a = b.cb(a)
      }else {
        if(fa(b) || s(b)) {
          a = Ja(b, a) >= 0
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
;function vc(a) {
  return wc(a || arguments.callee.caller, [])
}
function wc(a, b) {
  var c = [];
  if(Ja(b, a) >= 0) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < 50) {
      c.push(xc(a) + "(");
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
            f = (f = xc(f)) ? f : "[fn]";
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
        c.push(wc(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function xc(a) {
  if(yc[a]) {
    return yc[a]
  }
  a = String(a);
  if(!yc[a]) {
    var b = /function ([^\(]+)/.exec(a);
    yc[a] = b ? b[1] : "[Anonymous]"
  }
  return yc[a]
}
var yc = {};
function zc(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
zc.prototype.dc = 0;
zc.prototype.kb = l;
zc.prototype.jb = l;
var Ac = 0;
zc.prototype.reset = function(a, b, c, d, e) {
  this.dc = typeof e == "number" ? e : Ac++;
  this.xc = d || na();
  this.fa = a;
  this.Yb = b;
  this.qc = c;
  delete this.kb;
  delete this.jb
};
zc.prototype.Gb = function(a) {
  this.fa = a
};
function J(a) {
  this.Zb = a
}
J.prototype.N = l;
J.prototype.fa = l;
J.prototype.Ea = l;
J.prototype.mb = l;
function K(a, b) {
  this.name = a;
  this.value = b
}
K.prototype.toString = aa("name");
var Bc = new K("SEVERE", 1E3), Cc = new K("WARNING", 900), Dc = new K("INFO", 800), Ec = new K("CONFIG", 700), Fc = new K("FINE", 500), Hc = new K("FINEST", 300);
m = J.prototype;
m.getParent = aa("N");
m.Gb = function(a) {
  this.fa = a
};
function Ic(a) {
  if(a.fa) {
    return a.fa
  }
  if(a.N) {
    return Ic(a.N)
  }
  Ia("Root logger has no level set.");
  return l
}
m.log = function(a, b, c) {
  if(a.value >= Ic(this).value) {
    a = this.Wb(a, b, c);
    b = "log:" + a.Yb;
    q.console && (q.console.timeStamp ? q.console.timeStamp(b) : q.console.markTimeline && q.console.markTimeline(b));
    q.msWriteProfilerMark && q.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.mb) {
        for(var e = 0, f = i;f = c.mb[e];e++) {
          f(d)
        }
      }
      b = b.getParent()
    }
  }
};
m.Wb = function(a, b, c) {
  var d = new zc(a, String(b), this.Zb);
  if(c) {
    d.kb = c;
    var e;
    var f = arguments.callee.caller;
    try {
      var h;
      var j = da("window.location.href");
      if(s(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:j, stack:"Not available"}
      }else {
        var n, o, w = !1;
        try {
          n = c.lineNumber || c.pc || "Not available"
        }catch(k) {
          n = "Not available", w = !0
        }
        try {
          o = c.fileName || c.filename || c.sourceURL || j
        }catch(p) {
          o = "Not available", w = !0
        }
        h = w || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:o, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + za(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + za(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + za(vc(f) + "-> ")
    }catch(t) {
      e = "Exception trying to expose exception! You win, we lose. " + t
    }
    d.jb = e
  }
  return d
};
function Jc(a, b) {
  a.log(Bc, b, i)
}
function Kc(a, b) {
  a.log(Cc, b, i)
}
m.info = function(a, b) {
  this.log(Dc, a, b)
};
function L(a, b) {
  a.log(Fc, b, i)
}
function M(a, b) {
  a.log(Hc, b, i)
}
var Lc = {}, Mc = l;
function N(a) {
  Mc || (Mc = new J(""), Lc[""] = Mc, Mc.Gb(Ec));
  var b;
  if(!(b = Lc[a])) {
    b = new J(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = N(a.substr(0, c));
    if(!c.Ea) {
      c.Ea = {}
    }
    c.Ea[d] = b;
    b.N = c;
    Lc[a] = b
  }
  return b
}
;function Nc(a) {
  this.D = a;
  this.Ba = []
}
x(Nc, F);
Nc.prototype.a = N("cw.net.FlashSocketConduit");
function Oc(a, b) {
  a.Ba ? (M(a.a, "writeFrames: Not connected, can't write " + b.length + " frame(s) yet."), a.Ba.push.apply(a.Ba, b)) : (M(a.a, "writeFrames: Writing " + b.length + " frame(s)."), Oc(a.Va, b))
}
function Pc(a, b, c) {
  Pc(a.Va, b, c)
}
Nc.prototype.l = function() {
  this.a.info("in disposeInternal.");
  Nc.I.l.call(this);
  this.Va.d();
  delete this.D
};
var rc = Math.pow(2, 53);
var Qc = {Pb:ba("<cw.eq.Wildcard>")};
function Rc(a) {
  return a == "boolean" || a == "number" || a == "null" || a == "undefined" || a == "string"
}
function Sc(a, b, c) {
  var d = r(a), e = r(b);
  if(a == Qc || b == Qc) {
    return!0
  }else {
    if(a != l && typeof a.e == "function") {
      return c && c.push("running custom equals function on left object"), a.e(b, c)
    }else {
      if(b != l && typeof b.e == "function") {
        return c && c.push("running custom equals function on right object"), b.e(a, c)
      }else {
        if(Rc(d) || Rc(e)) {
          a = a === b
        }else {
          if(a instanceof RegExp && b instanceof RegExp) {
            a = a.toString() === b.toString()
          }else {
            if(ga(a) && ga(b)) {
              a = a.valueOf() === b.valueOf()
            }else {
              if(d == "array" && e == "array") {
                a: {
                  if(c && c.push("descending into array"), a.length != b.length) {
                    c && c.push("array length mismatch: " + a.length + ", " + b.length), a = !1
                  }else {
                    d = 0;
                    for(e = a.length;d < e;d++) {
                      if(!Sc(a[d], b[d], c)) {
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
                if(a.Ob == cb && b.Ob == cb) {
                  a: {
                    c && c.push("descending into object");
                    for(var f in a) {
                      if(!(f in b)) {
                        c && c.push("property " + f + " missing on right object");
                        a = !1;
                        break a
                      }
                      if(!Sc(a[f], b[f], c)) {
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
;function O(a) {
  y.call(this, a)
}
x(O, y);
O.prototype.name = "cw.net.InvalidFrame";
function P() {
  var a = [];
  this.t(a);
  return a.join("")
}
function Tc() {
}
Tc.prototype.e = function(a, b) {
  return!(a instanceof Tc) ? !1 : Sc(Uc(this), Uc(a), b)
};
Tc.prototype.j = function(a, b) {
  a.push("<HelloFrame properties=");
  A(Uc(this), a, b);
  a.push(">")
};
function Uc(a) {
  return[a.aa, a.Bb, a.nb, a.Eb, a.ka, a.Ya, a.xb, a.ub, a.Ka, a.tb, a.Lb, a.Ib, a.u, a.ta]
}
Tc.prototype.r = P;
Tc.prototype.t = function(a) {
  var b = {};
  b.tnum = this.aa;
  b.ver = this.Bb;
  b.format = this.nb;
  b["new"] = this.Eb;
  b.id = this.ka;
  b.ming = this.Ya;
  b.pad = this.xb;
  b.maxb = this.ub;
  if(this.Ka !== i) {
    b.maxt = this.Ka
  }
  b.maxia = this.tb;
  b.tcpack = this.Lb;
  b.eeds = this.Ib;
  b.sack = this.u instanceof D ? nc((new Q(this.u)).r()) : this.u;
  b.seenack = this.ta instanceof D ? nc((new Q(this.ta)).r()) : this.ta;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(ta(b), "H")
};
function R(a) {
  this.$ = a
}
R.prototype.e = function(a) {
  return a instanceof R && this.$ == a.$
};
R.prototype.j = function(a, b) {
  a.push("new StringFrame(");
  A(this.$, a, b);
  a.push(")")
};
R.prototype.r = P;
R.prototype.t = function(a) {
  a.push(this.$, " ")
};
function S(a) {
  this.na = a
}
S.prototype.e = function(a) {
  return a instanceof S && this.na == a.na
};
S.prototype.j = function(a, b) {
  a.push("new CommentFrame(");
  A(this.na, a, b);
  a.push(")")
};
S.prototype.r = P;
S.prototype.t = function(a) {
  a.push(this.na, "^")
};
function T(a) {
  this.ja = a
}
T.prototype.e = function(a) {
  return a instanceof T && this.ja == a.ja
};
T.prototype.j = function(a) {
  a.push("new SeqNumFrame(", String(this.ja), ")")
};
T.prototype.r = P;
T.prototype.t = function(a) {
  a.push(String(this.ja), "N")
};
function Vc(a) {
  var b = a.split("|");
  if(b.length != 2) {
    return l
  }
  a: {
    var c = b[1], a = rc;
    if(pc.test(c) && (c = parseInt(c, 10), c >= -1 && c <= a)) {
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
      var f = qc(b[d]);
      if(f == l) {
        return l
      }
      c.push(f)
    }
  }
  return new D(a, c)
}
function Q(a) {
  this.u = a
}
Q.prototype.e = function(a, b) {
  return a instanceof Q && this.u.e(a.u, b)
};
Q.prototype.j = function(a, b) {
  a.push("new SackFrame(");
  A(this.u, a, b);
  a.push(")")
};
Q.prototype.r = P;
Q.prototype.t = function(a) {
  var b = this.u;
  a.push(b.O.join(","), "|", String(b.Q));
  a.push("A")
};
function U(a) {
  this.ea = a
}
U.prototype.e = function(a, b) {
  return a instanceof U && this.ea.e(a.ea, b)
};
U.prototype.j = function(a, b) {
  a.push("new StreamStatusFrame(");
  A(this.ea, a, b);
  a.push(")")
};
U.prototype.r = P;
U.prototype.t = function(a) {
  var b = this.ea;
  a.push(b.O.join(","), "|", String(b.Q));
  a.push("T")
};
function V() {
}
V.prototype.j = function(a) {
  a.push("new StreamCreatedFrame()")
};
V.prototype.e = function(a) {
  return a instanceof V
};
V.prototype.r = P;
V.prototype.t = function(a) {
  a.push("C")
};
function W() {
}
W.prototype.j = function(a) {
  a.push("new YouCloseItFrame()")
};
W.prototype.e = function(a) {
  return a instanceof W
};
W.prototype.r = P;
W.prototype.t = function(a) {
  a.push("Y")
};
function X(a, b) {
  this.ga = a;
  this.ba = b
}
X.prototype.e = function(a) {
  return a instanceof X && this.ga == a.ga && this.ba == a.ba
};
X.prototype.j = function(a, b) {
  a.push("new ResetFrame(");
  A(this.ga, a, b);
  a.push(", ", String(this.ba), ")")
};
X.prototype.r = P;
X.prototype.t = function(a) {
  a.push(this.ga, "|", String(Number(this.ba)), "!")
};
var Wc = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Xc(a) {
  this.reason = a
}
Xc.prototype.e = function(a) {
  return a instanceof Xc && this.reason == a.reason
};
Xc.prototype.j = function(a, b) {
  a.push("new TransportKillFrame(");
  A(this.reason, a, b);
  a.push(")")
};
Xc.prototype.r = P;
Xc.prototype.t = function(a) {
  a.push(this.reason, "K")
};
function Yc(a) {
  a || g(new O("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(b == " ") {
    return new R(a.substr(0, a.length - 1))
  }else {
    if(b == "A") {
      return a = Vc(nc(a)), a == l && g(new O("bad sack")), new Q(a)
    }else {
      if(b == "N") {
        return a = qc(nc(a)), a == l && g(new O("bad seqNum")), new T(a)
      }else {
        if(b == "T") {
          return a = Vc(nc(a)), a == l && g(new O("bad lastSackSeen")), new U(a)
        }else {
          if(b == "Y") {
            return a.length != 1 && g(new O("leading garbage")), new W
          }else {
            if(b == "^") {
              return new S(a.substr(0, a.length - 1))
            }else {
              if(b == "C") {
                return a.length != 1 && g(new O("leading garbage")), new V
              }else {
                if(b == "!") {
                  return b = a.substr(0, a.length - 3), (b.length > 255 || !/^([ -~]*)$/.test(b)) && g(new O("bad reasonString")), a = {"|0":!1, "|1":!0}[a.substr(a.length - 3, 2)], a == l && g(new O("bad applicationLevel")), new X(b, a)
                }else {
                  if(b == "K") {
                    return a = a.substr(0, a.length - 1), a = Wc[a], a == l && g(new O("unknown kill reason: " + a)), new Xc(a)
                  }else {
                    g(new O("Invalid frame type " + b))
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
;!E || yb();
!kb && !E || E && yb() || kb && wb("1.9.1");
E && wb("9");
function Zc(a, b, c, d) {
  this.contentWindow = a;
  this.Ub = b;
  this.Hb = c;
  this.Vb = d
}
Zc.prototype.j = function(a, b) {
  a.push("<XDRFrame frameId=");
  A(this.Vb, a, b);
  a.push(", expandedUrl=");
  A(this.Ub, a, b);
  a.push(", streams=");
  A(this.Hb, a, b);
  a.push(">")
};
function $c() {
  this.frames = [];
  this.rb = new Ta
}
$c.prototype.a = N("cw.net.XDRTracker");
$c.prototype.jc = function(a) {
  var b = this.rb.get(a);
  b || g(Error("Unknown frameId " + B(a)));
  this.rb.remove(b);
  var c = b[0], a = new Zc((s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow || (lb ? (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + 
  a).contentDocument || (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).parentWindow || (lb ? (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + 
  a) : "minerva-xdrframe-" + a).contentDocument || (s("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  fc(c, a)
};
var ad = new $c;
q.__XHRTracker_xdrFrameLoaded = v(ad.jc, ad);
var bd;
bd = !1;
var Y = hb();
Y && (Y.indexOf("Firefox") != -1 || Y.indexOf("Camino") != -1 || Y.indexOf("iPhone") != -1 || Y.indexOf("iPod") != -1 || Y.indexOf("iPad") != -1 || Y.indexOf("Android") != -1 || Y.indexOf("Chrome") != -1 && (bd = !0));
var cd = bd;
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function dd(a, b, c) {
  this.D = b;
  this.ha = a;
  this.Fa = c
}
x(dd, F);
m = dd.prototype;
m.a = N("cw.net.XHRMaster");
m.Db = -1;
m.Na = function(a, b) {
  b != 1 && Jc(this.a, B(this.ha) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  ed(this.D);
  a: {
    var c = this.D;
    c.ya = !0;
    try {
      for(var d = !1, e = [], f = 0, h = a.length;f < h;f++) {
        if(c.K) {
          c.a.info(c.f() + " returning from loop because we're disposed.");
          break a
        }
        if(d = fd(c, a[f], e)) {
          break
        }
      }
      e.length && gd(c, e);
      c.ya = !1;
      c.i.length && c.A();
      d && (M(c.a, c.f() + " closeSoon is true.  Frames were: " + B(a)), c.d())
    }finally {
      c.ya = !1
    }
  }
};
m.Oa = function(a) {
  L(this.a, "ongotheaders_: " + B(a));
  var b = l;
  "Content-Length" in a && (b = qc(a["Content-Length"]));
  a = this.D;
  L(a.a, a.f() + " got Content-Length: " + b);
  a.w == hd && (b == l && (Kc(a.a, "Expected to receive a valid Content-Length, but did not."), b = 5E5), id(a, 2E3 + b / 3072 * 1E3))
};
m.Pa = function(a) {
  a != 1 && L(this.a, this.D.f() + "'s XHR's readyState is " + a);
  this.Db = a;
  this.Db >= 2 && ed(this.D)
};
m.La = function() {
  this.D.d()
};
m.l = function() {
  dd.I.l.call(this);
  delete Z.B[this.ha];
  this.Fa.__XHRSlave_dispose(this.ha);
  delete this.Fa
};
function jd() {
  this.B = {}
}
x(jd, F);
m = jd.prototype;
m.a = N("cw.net.XHRMasterTracker");
function kd(a, b, c) {
  var d = "_" + mc(), b = new dd(d, b, c);
  return a.B[d] = b
}
m.Na = function(a, b, c) {
  var b = Ma(b), d = this.B[a];
  d ? d.Na(b, c) : Jc(this.a, "onframes_: no master for " + B(a))
};
m.Oa = function(a, b) {
  var c = this.B[a];
  c ? c.Oa(b) : Jc(this.a, "ongotheaders_: no master for " + B(a))
};
m.Pa = function(a, b) {
  var c = this.B[a];
  c ? c.Pa(b) : Jc(this.a, "onreadystatechange_: no master for " + B(a))
};
m.La = function(a) {
  var b = this.B[a];
  b ? (delete this.B[b.ha], b.La()) : Jc(this.a, "oncomplete_: no master for " + B(a))
};
m.l = function() {
  jd.I.l.call(this);
  for(var a = pa(this.B);a.length;) {
    a.pop().d()
  }
  delete this.B
};
var Z = new jd;
q.__XHRMaster_onframes = v(Z.Na, Z);
q.__XHRMaster_oncomplete = v(Z.La, Z);
q.__XHRMaster_ongotheaders = v(Z.Oa, Z);
q.__XHRMaster_onreadystatechange = v(Z.Pa, Z);
var ld = new S(";)]}");
function md() {
}
function nd(a) {
  this.fc = a
}
nd.prototype.j = function(a, b) {
  a.push("<UserContext for ");
  A(this.fc, a, b);
  a.push(">")
};
function $(a, b, c) {
  this.F = a;
  this.wc = b ? b : new md;
  this.n = c ? c : lc;
  this.la = new sc;
  this.ka = mc() + mc();
  this.G = new Ya;
  this.Ja = new $a;
  this.ma = l;
  this.Nb = [];
  this.P = new nd(this);
  if(lb) {
    this.ma = Zb(q, "load", this.ac, !1, this)
  }
}
x($, F);
m = $.prototype;
m.a = N("cw.net.ClientStream");
m.pb = new D(-1, []);
m.qb = new D(-1, []);
m.wb = 50;
m.vb = 1048576;
m.Qa = l;
m.onreset = l;
m.Ma = l;
m.Wa = !1;
m.Ua = !1;
m.m = 1;
m.Jb = -1;
m.b = l;
m.h = l;
m.ia = l;
m.Xa = 0;
m.Ab = 0;
m.Fb = 0;
m.j = function(a, b) {
  a.push("<ClientStream id=");
  A(this.ka, a, b);
  a.push(", state=", String(this.m));
  a.push(", primary=");
  A(this.b, a, b);
  a.push(", secondary=");
  A(this.h, a, b);
  a.push(", resetting=");
  A(this.ia, a, b);
  a.push(">")
};
m.Xb = aa("P");
function od(a) {
  var b = [-1];
  a.b && b.push(a.b.W);
  a.h && b.push(a.h.W);
  return Math.max.apply(Math.max, b)
}
function pd(a) {
  if(a.m != 1) {
    var b = a.G.o.v() != 0, c = ab(a.Ja), d = !c.e(a.qb) && !(a.b && c.e(a.b.V) || a.h && c.e(a.h.V)), e = od(a);
    if((b = b && e < a.G.S) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      if(a.b.ca) {
        M(a.a, "tryToSend_: writing " + f + " to primary");
        if(d && (d = a.b, c != d.V)) {
          !d.C && !d.i.length && qd(d), d.i.push(new Q(c)), d.V = c
        }
        b && rd(a.b, a.G, e + 1);
        a.b.A()
      }else {
        a.h == l ? a.Wa ? (M(a.a, "tryToSend_: creating secondary to send " + f), a.h = sd(a, !1), b && rd(a.h, a.G, e + 1), a.h.A()) : (M(a.a, "tryToSend_: not creating a secondary because stream might not exist on server"), a.Ua = !0) : M(a.a, "tryToSend_: need to send " + f + ", but can't right now")
      }
    }
  }
}
m.ac = function() {
  this.ma = l;
  if(this.b && this.b.T()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.b;
    a.za = !0;
    a.d()
  }
  if(this.h && this.h.T()) {
    this.a.info("restartHttpRequests_: aborting secondary"), a = this.h, a.za = !0, a.d()
  }
};
m.cc = function(a, b) {
  b !== i || (b = !0);
  this.m > 3 && g(Error("sendStrings: Can't send strings in state " + this.m));
  if(a.length) {
    if(b) {
      for(var c = 0;c < a.length;c++) {
        var d = a[c];
        /^([ -~]*)$/.test(d) || g(Error("sendStrings: string #" + c + " has illegal chars: " + B(d)))
      }
    }
    this.G.extend(a);
    pd(this)
  }
};
function sd(a, b) {
  var c;
  g(Error("Don't support endpoint " + B(a.F)));
  a.Jb += 1;
  c = new td(a.n, a, a.Jb, c, a.F, b);
  M(a.a, "Created: " + c.f());
  a.la.add(c);
  return c
}
function ud(a, b, c) {
  var d = new vd(a.n, a, b, c);
  M(a.a, "Created: " + d.f() + ", delay=" + b + ", times=" + c);
  a.la.add(d);
  return d
}
function wd(a, b) {
  a.la.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  L(a.a, "Offline: " + b.f());
  b.wa ? a.Xa += b.wa : a.Xa = 0;
  a.Xa >= 1 && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.onreset && a.onreset.call(a.P, "stream penalty reached limit", !1), a.d());
  if(a.m > 3) {
    a.m == 4 && b.Mb ? (L(a.a, "Disposing because resettingTransport_ is done."), a.d()) : L(a.a, "Not creating a transport because ClientStream is in state " + a.m)
  }else {
    var c;
    var d;
    c = b instanceof vd;
    if(!c && b.za) {
      var e = lb ? cd ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      M(a.a, "getDelayForNextTransport_: " + B({delay:c, times:d}))
    }else {
      d = b.bb();
      if(b == a.b) {
        if(d) {
          e = ++a.Ab
        }else {
          if(!c) {
            e = a.Ab = 0
          }
        }
      }else {
        if(d) {
          e = ++a.Fb
        }else {
          if(!c) {
            e = a.Fb = 0
          }
        }
      }
      if(c || !e) {
        d = c = 0, M(a.a, "getDelayForNextTransport_: " + B({count:e, delay:c, times:d}))
      }else {
        var f = 2E3 * Math.min(e, 3), h = Math.floor(Math.random() * 4E3) - 2E3, j = Math.max(0, b.Kb - b.Za);
        d = (c = Math.max(0, f + h - j)) ? 1 : 0;
        M(a.a, "getDelayForNextTransport_: " + B({count:e, base:f, variance:h, oldDuration:j, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    if(b == a.b) {
      a.b = l, c ? a.b = ud(a, e, c) : (e = od(a), a.b = sd(a, !0), rd(a.b, a.G, e + 1)), a.b.A()
    }else {
      if(b == a.h) {
        a.h = l, c ? (a.h = ud(a, e, c), a.h.A()) : pd(a)
      }
    }
  }
}
m.reset = function(a) {
  this.m > 3 && g(Error("reset: Can't send reset in state " + this.m));
  this.m = 4;
  this.b && this.b.ca ? (this.a.info("reset: Sending ResetFrame over existing primary."), xd(this.b, a), this.b.A()) : (this.b && (L(this.a, "reset: Disposing primary before sending ResetFrame."), this.b.d()), this.h && (L(this.a, "reset: Disposing secondary before sending ResetFrame."), this.h.d()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.ia = sd(this, !1), xd(this.ia, a), this.ia.A());
  this.onreset && this.onreset.call(this.P, a, !0)
};
function yd(a, b, c, d) {
  var e;
  e = a.Ja;
  for(var f = a.wb, h = a.vb, j = [], n = !1, o = 0, w = c.length;o < w;o++) {
    var k = c[o], p = k[0], k = k[1];
    if(p == e.U + 1) {
      e.U += 1;
      for(j.push(k);;) {
        p = e.U + 1;
        k = e.J.get(p, bb);
        if(k === bb) {
          break
        }
        j.push(k[0]);
        e.J.remove(p);
        e.H -= k[1];
        e.U = p
      }
    }else {
      if(!(p <= e.U)) {
        if(f != l && e.J.v() >= f) {
          n = !0;
          break
        }
        var t = Xa(k);
        if(h != l && e.H + t > h) {
          n = !0;
          break
        }
        e.J.set(p, [k, t]);
        e.H += t
      }
    }
  }
  e.J.sa() && e.J.clear();
  e = [j, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(f = 0;f < c.length;f++) {
      if(h = c[f], a.Qa && a.Qa.call(a.P, h), a.m == 4 || a.K) {
        return
      }
    }
  }
  d || pd(a);
  if(!(a.m == 4 || a.K) && e) {
    Jc(b.a, b.f() + "'s peer caused rwin overflow."), b.d()
  }
}
m.start = function() {
  this.onmessage && g(Error("ClientStream.start: Hey, you! It's `onstring`, not `onmessage`! Refusing to start."));
  this.m != 1 && g(Error("ClientStream.start: " + B(this) + " already started"));
  this.m = 2;
  this.m = 3;
  this.b = sd(this, !0);
  rd(this.b, this.G, l);
  this.b.A()
};
m.l = function() {
  this.a.info(B(this) + " in disposeInternal.");
  this.m = 5;
  for(var a = this.la.M(), b = 0;b < a.length;b++) {
    a[b].d()
  }
  for(a = 0;a < this.Nb.length;a++) {
    var b = this.Nb[a].Hb, c = Ja(b, this);
    c >= 0 && z.splice.call(b, c, 1)
  }
  if(lb && this.ma) {
    $b(this.ma), this.ma = l
  }
  this.Ma && this.Ma.call(this.P);
  delete this.la;
  delete this.b;
  delete this.h;
  delete this.ia;
  delete this.P;
  $.I.l.call(this)
};
var hd = 1;
function td(a, b, c, d, e, f) {
  this.n = a;
  this.p = b;
  this.aa = c;
  this.w = d;
  this.F = e;
  this.i = [];
  this.R = f;
  this.ca = !this.T();
  this.Z = this.w != hd;
  this.Qb = v(this.gc, this)
}
x(td, F);
m = td.prototype;
m.a = N("cw.net.ClientTransport");
m.q = l;
m.Za = l;
m.Kb = l;
m.xa = l;
m.C = !1;
m.ya = !1;
m.V = l;
m.Ia = 0;
m.W = -1;
m.Ra = -1;
m.Mb = !1;
m.za = !1;
m.wa = 0;
m.da = !1;
m.j = function(a) {
  a.push("<ClientTransport #", String(this.aa), ", becomePrimary=", String(this.R), ">")
};
m.f = function() {
  return(this.R ? "Prim. T#" : "Sec. T#") + this.aa
};
m.bb = function() {
  return!(!this.da && this.Ia)
};
m.T = function() {
  return this.w == hd || this.w == 2
};
function gd(a, b) {
  Na(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  yd(a.p, a, b, !a.Z)
}
function fd(a, b, c) {
  try {
    var d = Yc(b);
    a.Ia += 1;
    L(a.a, a.f() + " RECV " + B(d));
    var e;
    a.Ia == 1 && !d.e(ld) && a.T() ? (Kc(a.a, a.f() + " is closing soon because got bad preamble: " + B(d)), e = !0) : e = !1;
    if(e) {
      return!0
    }
    if(d instanceof R) {
      if(!/^([ -~]*)$/.test(d.$)) {
        return a.da = !0
      }
      a.Ra += 1;
      c.push([a.Ra, d.$])
    }else {
      if(d instanceof Q) {
        var f = a.p, h = d.u;
        f.pb = h;
        var j = f.G, n = h.Q, c = !1;
        n > j.S && (c = !0);
        for(var o = Za(j).concat(), d = 0;d < o.length;d++) {
          var w = o[d];
          if(w > n) {
            break
          }
          var k = j.o.c[w][1];
          j.o.remove(w);
          j.H -= k
        }
        for(d = 0;d < h.O.length;d++) {
          var p = h.O[d];
          p > j.S && (c = !0);
          C(j.o.c, p) && (k = j.o.c[p][1], j.o.remove(p), j.H -= k)
        }
        j.o.sa() && j.o.clear();
        if(c) {
          return Kc(a.a, a.f() + " is closing soon because got bad SackFrame"), a.da = !0
        }
      }else {
        if(d instanceof T) {
          a.Ra = d.ja - 1
        }else {
          if(d instanceof U) {
            a.p.qb = d.ea
          }else {
            if(d instanceof W) {
              return M(a.a, a.f() + " is closing soon because got YouCloseItFrame"), !0
            }else {
              if(d instanceof Xc) {
                return a.da = !0, d.reason == "stream_attach_failure" ? a.wa += 1 : d.reason == "acked_unsent_strings" && (a.wa += 0.5), M(a.a, a.f() + " is closing soon because got " + B(d)), !0
              }else {
                if(!(d instanceof S)) {
                  if(d instanceof V) {
                    var t = a.p, Bd = !a.Z;
                    M(t.a, "Stream is now confirmed to exist at server.");
                    t.Wa = !0;
                    if(t.Ua && !Bd) {
                      t.Ua = !1, pd(t)
                    }
                  }else {
                    if(c.length) {
                      gd(a, c);
                      if(r(c) != "array") {
                        for(var Jb = c.length - 1;Jb >= 0;Jb--) {
                          delete c[Jb]
                        }
                      }
                      c.length = 0
                    }
                    if(d instanceof X) {
                      var Ua = a.p;
                      Ua.onreset && Ua.onreset.call(Ua.P, d.ga, d.ba);
                      Ua.d();
                      return!0
                    }else {
                      g(Error(a.f() + " had unexpected state in framesReceived_."))
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }catch(Gc) {
    return Gc instanceof O || g(Gc), Kc(a.a, a.f() + " is closing soon because got InvalidFrame: " + B(b)), a.da = !0
  }
  return!1
}
m.gc = function() {
  Kc(this.a, this.f() + " timed out due to lack of connection or no data being received.");
  this.d()
};
function zd(a) {
  if(a.xa != l) {
    a.n.s.clearTimeout(a.xa), a.xa = l
  }
}
function id(a, b) {
  zd(a);
  b = Math.round(b);
  a.xa = a.n.s.setTimeout(a.Qb, b);
  L(a.a, a.f() + "'s receive timeout set to " + b + " ms.")
}
function ed(a) {
  a.w != hd && (a.w == 3 || a.w == 2 ? id(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.w)))
}
function qd(a) {
  var b = new Tc;
  b.aa = a.aa;
  b.Bb = 2;
  b.nb = 2;
  if(!a.p.Wa) {
    b.Eb = !0
  }
  b.ka = a.p.ka;
  b.Ya = a.Z;
  if(b.Ya) {
    b.xb = 4096
  }
  b.ub = 3E5;
  b.tb = a.Z ? Math.floor(10) : 0;
  b.Lb = !1;
  if(a.R) {
    b.Ib = l, b.Ka = Math.floor((a.Z ? 358E4 : 25E3) / 1E3)
  }
  b.u = ab(a.p.Ja);
  b.ta = a.p.pb;
  a.i.push(b);
  a.V = b.u
}
m.A = function() {
  this.C && !this.ca && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.ya) {
    M(this.a, this.f() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.C;
    this.C = !0;
    !a && !this.i.length && qd(this);
    for(a = 0;a < this.i.length;a++) {
      L(this.a, this.f() + " SEND " + B(this.i[a]))
    }
    if(this.T()) {
      for(var a = [], b = 0, c = this.i.length;b < c;b++) {
        this.i[b].t(a), a.push("\n")
      }
      this.i = [];
      a = a.join("");
      b = this.R ? this.F.sc : this.F.uc;
      this.q = kd(Z, this, this.R ? this.F.tc : this.F.vc);
      this.Za = this.n.s === ec ? na() : this.n.s.getTime();
      c = this.q;
      c.Fa.__XHRSlave_makeRequest(c.ha, b, "POST", a);
      id(this, 3E3 * (1.5 + (b.indexOf("https://") == 0 ? 3 : 1)) + 4E3 + (this.Z ? 0 : this.R ? 25E3 : 0))
    }else {
      if(this.w == 3) {
        a = [];
        b = 0;
        for(c = this.i.length;b < c;b++) {
          a.push(this.i[b].r())
        }
        this.i = [];
        this.q ? Oc(this.q, a) : (b = this.F, this.q = new Nc(this), this.q.Va = kd(b.yc, this.q), this.Za = this.n.s === ec ? na() : this.n.s.getTime(), Pc(this.q, b.host, b.port), this.q.K || (Oc(this.q, a), this.q.K || id(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.w))
      }
    }
  }
};
function rd(a, b, c) {
  !a.C && !a.i.length && qd(a);
  for(var d = Math.max(c, a.W + 1), e = Za(b), c = [], f = 0;f < e.length;f++) {
    var h = e[f];
    (d == l || h >= d) && c.push([h, b.o.c[h][0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (a.W == -1 || a.W + 1 != e) && a.i.push(new T(e)), a.i.push(new R(f)), a.W = e
  }
}
m.l = function() {
  this.a.info(this.f() + " in disposeInternal.");
  td.I.l.call(this);
  this.Kb = this.n.s === ec ? na() : this.n.s.getTime();
  this.i = [];
  zd(this);
  this.q && this.q.d();
  var a = this.p;
  this.p = l;
  wd(a, this)
};
function xd(a, b) {
  !a.C && !a.i.length && qd(a);
  a.i.push(new X(b, !0));
  a.Mb = !0
}
function vd(a, b, c, d) {
  this.n = a;
  this.p = b;
  this.fb = c;
  this.eb = d
}
x(vd, F);
m = vd.prototype;
m.C = !1;
m.ca = !1;
m.pa = l;
m.V = l;
m.a = N("cw.net.DoNothingTransport");
function Ad(a) {
  a.pa = a.n.s.setTimeout(function() {
    a.pa = l;
    a.eb--;
    a.eb ? Ad(a) : a.d()
  }, a.fb)
}
m.A = function() {
  this.C && !this.ca && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.C = !0;
  Ad(this)
};
m.j = function(a) {
  a.push("<DoNothingTransport delay=", String(this.fb), ">")
};
m.T = ba(!1);
m.f = ba("Wast. T");
m.bb = ba(!1);
m.l = function() {
  this.a.info(this.f() + " in disposeInternal.");
  vd.I.l.call(this);
  this.pa != l && this.n.s.clearTimeout(this.pa);
  var a = this.p;
  this.p = l;
  wd(a, this)
};
ca("Minerva.ClientStream", $);
$.prototype.getUserContext = $.prototype.Xb;
$.prototype.start = $.prototype.start;
$.prototype.sendStrings = $.prototype.cc;
$.prototype.reset = $.prototype.reset;
$.prototype.maxUndeliveredStrings = $.prototype.wb;
$.prototype.maxUndeliveredBytes = $.prototype.vb;
$.prototype.onstring = $.prototype.Qa;
$.prototype.onreset = $.prototype.onreset;
$.prototype.ondisconnect = $.prototype.Ma;
ca("Minerva.bind", v);
ca("Minerva.repr", B);
})();
