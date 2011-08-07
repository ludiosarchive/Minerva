(function(){function g(a) {
  throw a;
}
var i = void 0, l = null;
function aa(a) {
  return function() {
    return a
  }
}
var m, p = this;
function ba(a) {
  for(var a = a.split("."), b = p, c;c = a.shift();) {
    if(b[c] != l) {
      b = b[c]
    }else {
      return l
    }
  }
  return b
}
function ca() {
}
function s(a) {
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
function da(a) {
  return s(a) == "array"
}
function ea(a) {
  var b = s(a);
  return b == "array" || b == "object" && typeof a.length == "number"
}
function fa(a) {
  return ga(a) && typeof a.getFullYear == "function"
}
function t(a) {
  return typeof a == "string"
}
function v(a) {
  return s(a) == "function"
}
function ga(a) {
  a = s(a);
  return a == "object" || a == "array" || a == "function"
}
function w(a) {
  return a[ha] || (a[ha] = ++ia)
}
var ha = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36), ia = 0;
function ja(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function ka(a, b, c) {
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
  x = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? ja : ka;
  return x.apply(l, arguments)
}
var la = Date.now || function() {
  return+new Date
};
function y(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.F = b.prototype;
  a.prototype = new c
}
;function ma(a) {
  return v(a) || typeof a == "object" && v(a.call) && v(a.apply)
}
;function na(a) {
  var b = z, c;
  for(c in b) {
    a.call(i, b[c], c, b)
  }
}
function oa(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function pa(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var qa = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function ra(a, b) {
  for(var c, d, f = 1;f < arguments.length;f++) {
    d = arguments[f];
    for(c in d) {
      a[c] = d[c]
    }
    for(var e = 0;e < qa.length;e++) {
      c = qa[e], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;function sa() {
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
      if(da(b)) {
        var d = b.length;
        c.push("[");
        for(var f = "", e = 0;e < d;e++) {
          c.push(f), ua(a, b[e], c), f = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(f in b) {
        Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], typeof e != "function" && (c.push(d), va(f, c), c.push(":"), ua(a, e, c), d = ","))
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
    var b = a.charCodeAt(0), f = "\\u";
    b < 16 ? f += "000" : b < 256 ? f += "00" : b < 4096 && (f += "0");
    return wa[a] = f + b.toString(16)
  }), '"')
}
;function A(a) {
  this.stack = Error().stack || "";
  if(a) {
    this.message = String(a)
  }
}
y(A, Error);
A.prototype.name = "CustomError";
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
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = Math.max(d.length, f.length), h = 0;c == 0 && h < e;h++) {
    var j = d[h] || "", n = f[h] || "", o = RegExp("(\\d*)(\\D*)", "g"), u = RegExp("(\\d*)(\\D*)", "g");
    do {
      var k = o.exec(j) || ["", "", ""], q = u.exec(n) || ["", "", ""];
      if(k[0].length == 0 && q[0].length == 0) {
        break
      }
      c = Ga(k[1].length == 0 ? 0 : parseInt(k[1], 10), q[1].length == 0 ? 0 : parseInt(q[1], 10)) || Ga(k[2].length == 0, q[2].length == 0) || Ga(k[2], q[2])
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
  A.call(this, ya.apply(l, b));
  b.shift();
  this.sc = a
}
y(Ha, A);
Ha.prototype.name = "AssertionError";
function Ia(a, b) {
  g(new Ha("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;var B = Array.prototype, Ja = B.indexOf ? function(a, b, c) {
  return B.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == l ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
  if(t(a)) {
    return!t(b) || b.length != 1 ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, Ka = B.some ? function(a, b, c) {
  return B.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = t(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in f && b.call(c, f[e], e, a)) {
      return!0
    }
  }
  return!1
}, La = B.every ? function(a, b, c) {
  return B.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = t(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in f && !b.call(c, f[e], e, a)) {
      return!1
    }
  }
  return!0
};
function Ma(a) {
  return B.concat.apply(B, arguments)
}
function Na(a, b) {
  B.sort.call(a, b || Oa)
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
    d = s(a);
    if(d == "boolean" || d == "number" || d == "null" || d == "undefined") {
      b.push(String(a))
    }else {
      if(d == "string") {
        va(a, b)
      }else {
        if(ma(a.l)) {
          a.l(b, c)
        }else {
          if(ma(a.Nb)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if(d == "array") {
                d = a.length;
                b.push("[");
                for(var f = "", e = 0;e < d;e++) {
                  b.push(f), Pa(a[e], b, c), f = ", "
                }
                b.push("]")
              }else {
                if(d == "object") {
                  if(fa(a) && typeof a.valueOf == "function") {
                    b.push("new Date(", String(a.valueOf()), ")")
                  }else {
                    for(var d = pa(a).concat(qa), f = {}, h = e = 0;h < d.length;) {
                      var j = d[h++], n = ga(j) ? "o" + w(j) : (typeof j).charAt(0) + j;
                      Object.prototype.hasOwnProperty.call(f, n) || (f[n] = !0, d[e++] = j)
                    }
                    d.length = e;
                    b.push("{");
                    f = "";
                    for(h = 0;h < d.length;h++) {
                      e = d[h], Object.prototype.hasOwnProperty.call(a, e) && (j = a[e], b.push(f), va(e, b), b.push(": "), Pa(j, b, c), f = ", ")
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
function C(a, b, c) {
  c || (c = []);
  Pa(a, b, c)
}
function D(a) {
  var b = [];
  C(a, b, i);
  return b.join("")
}
;function Qa(a) {
  if(typeof a.w == "function") {
    a = a.w()
  }else {
    if(ea(a) || t(a)) {
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
  if(typeof a.N == "function") {
    return a.N()
  }
  if(t(a)) {
    return a.split("")
  }
  if(ea(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return oa(a)
}
function Sa(a, b) {
  if(typeof a.every == "function") {
    return a.every(b, i)
  }
  if(ea(a) || t(a)) {
    return La(a, b, i)
  }
  var c;
  if(typeof a.oa == "function") {
    c = a.oa()
  }else {
    if(typeof a.N != "function") {
      if(ea(a) || t(a)) {
        c = [];
        for(var d = a.length, f = 0;f < d;f++) {
          c.push(f)
        }
      }else {
        c = pa(a)
      }
    }else {
      c = i
    }
  }
  for(var d = Ra(a), f = d.length, e = 0;e < f;e++) {
    if(!b.call(i, d[e], c && c[e], a)) {
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
    a && this.Ba(a)
  }
}
m = Ta.prototype;
m.h = 0;
m.ab = 0;
m.w = function() {
  return this.h
};
m.N = function() {
  Ua(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.c[this.g[b]])
  }
  return a
};
m.oa = function() {
  Ua(this);
  return this.g.concat()
};
m.cb = function(a) {
  for(var b = 0;b < this.g.length;b++) {
    var c = this.g[b];
    if(E(this.c, c) && this.c[c] == a) {
      return!0
    }
  }
  return!1
};
m.e = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.h != a.w()) {
    return!1
  }
  var c = b || Va;
  Ua(this);
  for(var d, f = 0;d = this.g[f];f++) {
    if(!c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
function Va(a, b) {
  return a === b
}
m.sa = function() {
  return this.h == 0
};
m.clear = function() {
  this.c = {};
  this.ab = this.h = this.g.length = 0
};
m.remove = function(a) {
  return E(this.c, a) ? (delete this.c[a], this.h--, this.ab++, this.g.length > 2 * this.h && Ua(this), !0) : !1
};
function Ua(a) {
  if(a.h != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      E(a.c, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.h != a.g.length) {
    for(var f = {}, c = b = 0;b < a.g.length;) {
      d = a.g[b], E(f, d) || (a.g[c++] = d, f[d] = 1), b++
    }
    a.g.length = c
  }
}
m.get = function(a, b) {
  return E(this.c, a) ? this.c[a] : b
};
m.set = function(a, b) {
  E(this.c, a) || (this.h++, this.g.push(a), this.ab++);
  this.c[a] = b
};
m.Ba = function(a) {
  var b;
  a instanceof Ta ? (b = a.oa(), a = a.N()) : (b = pa(a), a = oa(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
function E(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function Wa(a) {
  var b = s(a);
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
;var Xa = {};
function F(a, b) {
  this.Q = a;
  this.P = b
}
F.prototype.e = function(a) {
  return a instanceof F && this.Q == a.Q && this.P.join(",") == a.P
};
F.prototype.l = function(a, b) {
  a.push("new SACK(", String(this.Q), ", ");
  C(this.P, a, b);
  a.push(")")
};
function Ya() {
  this.o = new Ta
}
m = Ya.prototype;
m.S = -1;
m.J = 0;
m.append = function(a) {
  var b = Wa(a);
  this.o.set(this.S + 1, [a, b]);
  this.S += 1;
  this.J += b
};
m.extend = function(a) {
  for(var b = 0;b < a.length;b++) {
    this.append(a[b])
  }
};
m.l = function(a) {
  a.push("<Queue with ", String(this.o.w()), " item(s), counter=#", String(this.S), ", size=", String(this.J), ">")
};
function Za(a) {
  Ua(a.o);
  Na(a.o.g);
  return a.o.g
}
function $a() {
  this.K = new Ta
}
$a.prototype.U = -1;
$a.prototype.J = 0;
function ab(a) {
  var b = a.K.oa();
  Na(b);
  return new F(a.U, b)
}
var bb = {};
function cb() {
  return!0
}
;var db, eb, fb, gb;
function hb() {
  return p.navigator ? p.navigator.userAgent : l
}
gb = fb = eb = db = !1;
var ib;
if(ib = hb()) {
  var jb = p.navigator;
  db = ib.indexOf("Opera") == 0;
  eb = !db && ib.indexOf("MSIE") != -1;
  fb = !db && ib.indexOf("WebKit") != -1;
  gb = !db && !fb && jb.product == "Gecko"
}
var G = eb, kb = gb, lb = fb, mb = p.navigator, nb = (mb && mb.platform || "").indexOf("Mac") != -1, ob;
a: {
  var pb = "", qb;
  if(db && p.opera) {
    var rb = p.opera.version, pb = typeof rb == "function" ? rb() : rb
  }else {
    if(kb ? qb = /rv\:([^\);]+)(\)|;)/ : G ? qb = /MSIE\s+([^\);]+)(\)|;)/ : lb && (qb = /WebKit\/(\S+)/), qb) {
      var sb = qb.exec(hb()), pb = sb ? sb[1] : ""
    }
  }
  if(G) {
    var tb, ub = p.document;
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
  return xb[9] || (xb[9] = G && document.documentMode && document.documentMode >= 9)
}
;var zb;
!G || yb();
G && wb("8");
function H() {
}
H.prototype.L = !1;
H.prototype.d = function() {
  if(!this.L) {
    this.L = !0, this.i()
  }
};
H.prototype.i = function() {
  this.Qb && Ab.apply(l, this.Qb)
};
function Ab(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    ea(d) ? Ab.apply(l, d) : d && typeof d.d == "function" && d.d()
  }
}
;function I(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
y(I, H);
I.prototype.i = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
I.prototype.X = !1;
I.prototype.ya = !0;
var Bb = new Function("a", "return a");
function Cb(a, b) {
  a && this.ra(a, b)
}
y(Cb, I);
m = Cb.prototype;
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
m.Yb = !1;
m.jb = l;
m.ra = function(a, b) {
  var c = this.type = a.type;
  I.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(kb) {
      var f;
      a: {
        try {
          Bb(d.nodeName);
          f = !0;
          break a
        }catch(e) {
        }
        f = !1
      }
      f || (d = l)
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
  this.Yb = nb ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.jb = a;
  delete this.ya;
  delete this.X
};
m.i = function() {
  Cb.F.i.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.jb = l
};
function Db() {
}
var Eb = 0;
m = Db.prototype;
m.key = 0;
m.Y = !1;
m.Da = !1;
m.ra = function(a, b, c, d, f, e) {
  v(a) ? this.ob = !0 : a && a.handleEvent && v(a.handleEvent) ? this.ob = !1 : g(Error("Invalid listener argument"));
  this.fa = a;
  this.Ab = b;
  this.src = c;
  this.type = d;
  this.capture = !!f;
  this.Ka = e;
  this.Da = !1;
  this.key = ++Eb;
  this.Y = !1
};
m.handleEvent = function(a) {
  return this.ob ? this.fa.call(this.Ka || this.src, a) : this.fa.handleEvent.call(this.fa, a)
};
var Fb, Gb = (Fb = "ScriptEngine" in p && p.ScriptEngine() == "JScript") ? p.ScriptEngineMajorVersion() + "." + p.ScriptEngineMinorVersion() + "." + p.ScriptEngineBuildVersion() : "0";
function J(a, b) {
  this.sb = b;
  this.M = [];
  a > this.sb && g(Error("[goog.structs.SimplePool] Initial cannot be greater than max"));
  for(var c = 0;c < a;c++) {
    this.M.push(this.A ? this.A() : {})
  }
}
y(J, H);
J.prototype.A = l;
J.prototype.hb = l;
J.prototype.getObject = function() {
  return this.M.length ? this.M.pop() : this.A ? this.A() : {}
};
function Hb(a, b) {
  a.M.length < a.sb ? a.M.push(b) : Ib(a, b)
}
function Ib(a, b) {
  if(a.hb) {
    a.hb(b)
  }else {
    if(ga(b)) {
      if(v(b.d)) {
        b.d()
      }else {
        for(var c in b) {
          delete b[c]
        }
      }
    }
  }
}
J.prototype.i = function() {
  J.F.i.call(this);
  for(var a = this.M;a.length;) {
    Ib(this, a.pop())
  }
  delete this.M
};
var Jb, Kb, Lb, Mb, Nb, Ob, Pb, Rb, Sb, Tb, Ub;
(function() {
  function a() {
    return{h:0, u:0}
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
    return new Db
  }
  function f() {
    return new Cb
  }
  var e = Fb && !(Fa(Gb, "5.7") >= 0), h;
  Ob = function(a) {
    h = a
  };
  if(e) {
    Jb = function() {
      return j.getObject()
    };
    Kb = function(a) {
      Hb(j, a)
    };
    Lb = function() {
      return n.getObject()
    };
    Mb = function(a) {
      Hb(n, a)
    };
    Nb = function() {
      return o.getObject()
    };
    Pb = function() {
      Hb(o, c())
    };
    Rb = function() {
      return u.getObject()
    };
    Sb = function(a) {
      Hb(u, a)
    };
    Tb = function() {
      return k.getObject()
    };
    Ub = function(a) {
      Hb(k, a)
    };
    var j = new J(0, 600);
    j.A = a;
    var n = new J(0, 600);
    n.A = b;
    var o = new J(0, 600);
    o.A = c;
    var u = new J(0, 600);
    u.A = d;
    var k = new J(0, 600);
    k.A = f
  }else {
    Jb = a, Kb = ca, Lb = b, Mb = ca, Nb = c, Pb = ca, Rb = d, Sb = ca, Tb = f, Ub = ca
  }
})();
var K = {}, L = {}, z = {}, Vb = {};
function Wb(a, b, c, d, f) {
  if(b) {
    if(da(b)) {
      for(var e = 0;e < b.length;e++) {
        Wb(a, b[e], c, d, f)
      }
      return l
    }else {
      var d = !!d, h = L;
      b in h || (h[b] = Jb());
      h = h[b];
      d in h || (h[d] = Jb(), h.h++);
      var h = h[d], j = w(a), n;
      h.u++;
      if(h[j]) {
        n = h[j];
        for(e = 0;e < n.length;e++) {
          if(h = n[e], h.fa == c && h.Ka == f) {
            if(h.Y) {
              break
            }
            return n[e].key
          }
        }
      }else {
        n = h[j] = Lb(), h.h++
      }
      e = Nb();
      e.src = a;
      h = Rb();
      h.ra(c, e, a, b, d, f);
      c = h.key;
      e.key = c;
      n.push(h);
      K[c] = h;
      z[j] || (z[j] = Lb());
      z[j].push(h);
      a.addEventListener ? (a == p || !a.fb) && a.addEventListener(b, e, d) : a.attachEvent(b in Vb ? Vb[b] : Vb[b] = "on" + b, e);
      return c
    }
  }else {
    g(Error("Invalid event type"))
  }
}
function Xb(a, b, c, d, f) {
  if(da(b)) {
    for(var e = 0;e < b.length;e++) {
      Xb(a, b[e], c, d, f)
    }
    return l
  }
  a = Wb(a, b, c, d, f);
  K[a].Da = !0;
  return a
}
function Yb(a, b, c, d, f) {
  if(da(b)) {
    for(var e = 0;e < b.length;e++) {
      Yb(a, b[e], c, d, f)
    }
  }else {
    d = !!d;
    a: {
      e = L;
      if(b in e && (e = e[b], d in e && (e = e[d], a = w(a), e[a]))) {
        a = e[a];
        break a
      }
      a = l
    }
    if(a) {
      for(e = 0;e < a.length;e++) {
        if(a[e].fa == c && a[e].capture == d && a[e].Ka == f) {
          Zb(a[e].key);
          break
        }
      }
    }
  }
}
function Zb(a) {
  if(K[a]) {
    var b = K[a];
    if(!b.Y) {
      var c = b.src, d = b.type, f = b.Ab, e = b.capture;
      c.removeEventListener ? (c == p || !c.fb) && c.removeEventListener(d, f, e) : c.detachEvent && c.detachEvent(d in Vb ? Vb[d] : Vb[d] = "on" + d, f);
      c = w(c);
      f = L[d][e][c];
      if(z[c]) {
        var h = z[c], j = Ja(h, b);
        j >= 0 && B.splice.call(h, j, 1);
        h.length == 0 && delete z[c]
      }
      b.Y = !0;
      f.wb = !0;
      $b(d, e, c, f);
      delete K[a]
    }
  }
}
function $b(a, b, c, d) {
  if(!d.ua && d.wb) {
    for(var f = 0, e = 0;f < d.length;f++) {
      if(d[f].Y) {
        var h = d[f].Ab;
        h.src = l;
        Pb(h);
        Sb(d[f])
      }else {
        f != e && (d[e] = d[f]), e++
      }
    }
    d.length = e;
    d.wb = !1;
    e == 0 && (Mb(d), delete L[a][b][c], L[a][b].h--, L[a][b].h == 0 && (Kb(L[a][b]), delete L[a][b], L[a].h--), L[a].h == 0 && (Kb(L[a]), delete L[a]))
  }
}
function ac(a) {
  var b, c = 0, d = b == l;
  b = !!b;
  if(a == l) {
    na(function(a) {
      for(var e = a.length - 1;e >= 0;e--) {
        var f = a[e];
        if(d || b == f.capture) {
          Zb(f.key), c++
        }
      }
    })
  }else {
    if(a = w(a), z[a]) {
      for(var a = z[a], f = a.length - 1;f >= 0;f--) {
        var e = a[f];
        if(d || b == e.capture) {
          Zb(e.key), c++
        }
      }
    }
  }
}
function bc(a, b, c, d, f) {
  var e = 1, b = w(b);
  if(a[b]) {
    a.u--;
    a = a[b];
    a.ua ? a.ua++ : a.ua = 1;
    try {
      for(var h = a.length, j = 0;j < h;j++) {
        var n = a[j];
        n && !n.Y && (e &= cc(n, f) !== !1)
      }
    }finally {
      a.ua--, $b(c, d, b, a)
    }
  }
  return Boolean(e)
}
function cc(a, b) {
  var c = a.handleEvent(b);
  a.Da && Zb(a.key);
  return c
}
Ob(function(a, b) {
  if(!K[a]) {
    return!0
  }
  var c = K[a], d = c.type, f = L;
  if(!(d in f)) {
    return!0
  }
  var f = f[d], e, h;
  zb === i && (zb = G && !p.addEventListener);
  if(zb) {
    e = b || ba("window.event");
    var j = !0 in f, n = !1 in f;
    if(j) {
      if(e.keyCode < 0 || e.returnValue != i) {
        return!0
      }
      a: {
        var o = !1;
        if(e.keyCode == 0) {
          try {
            e.keyCode = -1;
            break a
          }catch(u) {
            o = !0
          }
        }
        if(o || e.returnValue == i) {
          e.returnValue = !0
        }
      }
    }
    o = Tb();
    o.ra(e, this);
    e = !0;
    try {
      if(j) {
        for(var k = Lb(), q = o.currentTarget;q;q = q.parentNode) {
          k.push(q)
        }
        h = f[!0];
        h.u = h.h;
        for(var r = k.length - 1;!o.X && r >= 0 && h.u;r--) {
          o.currentTarget = k[r], e &= bc(h, k[r], d, !0, o)
        }
        if(n) {
          h = f[!1];
          h.u = h.h;
          for(r = 0;!o.X && r < k.length && h.u;r++) {
            o.currentTarget = k[r], e &= bc(h, k[r], d, !1, o)
          }
        }
      }else {
        e = cc(c, o)
      }
    }finally {
      if(k) {
        k.length = 0, Mb(k)
      }
      o.d();
      Ub(o)
    }
    return e
  }
  d = new Cb(b, this);
  try {
    e = cc(c, d)
  }finally {
    d.d()
  }
  return e
});
var dc = 0;
function ec() {
}
y(ec, H);
m = ec.prototype;
m.fb = !0;
m.Ra = l;
m.addEventListener = function(a, b, c, d) {
  Wb(this, a, b, c, d)
};
m.removeEventListener = function(a, b, c, d) {
  Yb(this, a, b, c, d)
};
m.dispatchEvent = function(a) {
  var b = a.type || a, c = L;
  if(b in c) {
    if(t(a)) {
      a = new I(a, this)
    }else {
      if(a instanceof I) {
        a.target = a.target || this
      }else {
        var d = a, a = new I(b, this);
        ra(a, d)
      }
    }
    var d = 1, f, c = c[b], b = !0 in c, e;
    if(b) {
      f = [];
      for(e = this;e;e = e.Ra) {
        f.push(e)
      }
      e = c[!0];
      e.u = e.h;
      for(var h = f.length - 1;!a.X && h >= 0 && e.u;h--) {
        a.currentTarget = f[h], d &= bc(e, f[h], a.type, !0, a) && a.ya != !1
      }
    }
    if(!1 in c) {
      if(e = c[!1], e.u = e.h, b) {
        for(h = 0;!a.X && h < f.length && e.u;h++) {
          a.currentTarget = f[h], d &= bc(e, f[h], a.type, !1, a) && a.ya != !1
        }
      }else {
        for(f = this;!a.X && f && e.u;f = f.Ra) {
          a.currentTarget = f, d &= bc(e, f, a.type, !1, a) && a.ya != !1
        }
      }
    }
    a = Boolean(d)
  }else {
    a = !0
  }
  return a
};
m.i = function() {
  ec.F.i.call(this);
  ac(this);
  this.Ra = l
};
var fc = p.window;
dc++;
dc++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function gc(a, b) {
  if(a.Ia) {
    a.cc || g(new hc(a)), a.cc = !1
  }
  a.Ia = !0;
  a.Ta = b;
  a.qa = !1;
  ic(a)
}
function jc(a, b, c) {
  a.Ea.push([b, c, i]);
  a.Ia && ic(a)
}
function kc(a) {
  return Ka(a.Ea, function(a) {
    return v(a[1])
  })
}
function ic(a) {
  a.$a && a.Ia && kc(a) && (p.clearTimeout(a.$a), delete a.$a);
  a.O && (a.O.lc--, delete a.O);
  for(var b = a.Ta, c = !1, d = !1;a.Ea.length && a.xb == 0;) {
    var f = a.Ea.shift(), e = f[0], h = f[1], f = f[2];
    if(e = a.qa ? h : e) {
      try {
        var j = e.call(f || a.nc, b);
        if(j !== i) {
          a.qa = a.qa && (j == b || j instanceof Error), a.Ta = b = j
        }
      }catch(n) {
        b = n, a.qa = !0, kc(a) || (c = !0)
      }
    }
  }
  a.Ta = b;
  if(d && a.xb) {
    jc(b, x(a.Pb, a, !0), x(a.Pb, a, !1)), b.mc = !0
  }
  if(c) {
    a.$a = p.setTimeout(function() {
      g(b)
    }, 0)
  }
}
function hc(a) {
  A.call(this);
  this.oc = a
}
y(hc, A);
hc.prototype.message = "Already called";
function lc(a) {
  this.s = a;
  this.Ha = [];
  this.ib = [];
  this.kc = x(this.gc, this)
}
lc.prototype.fc = l;
lc.prototype.gc = function() {
  this.fc = l;
  var a = this.Ha;
  this.Ha = [];
  for(var b = 0;b < a.length;b++) {
    var c = a[b], d = c[0], f = c[1], c = c[2];
    try {
      d.apply(f, c)
    }catch(e) {
      this.s.setTimeout(function() {
        g(e)
      }, 0)
    }
  }
  if(this.Ha.length == 0) {
    a = this.ib;
    this.ib = [];
    for(b = 0;b < a.length;b++) {
      gc(a[b], l)
    }
  }
};
new lc(p.window);
function mc() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ la()).toString(36)
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
  a && this.Ba(a)
}
function tc(a) {
  var b = typeof a;
  return b == "object" && a || b == "function" ? "o" + w(a) : b.substr(0, 1) + a
}
m = sc.prototype;
m.w = function() {
  return this.c.w()
};
m.add = function(a) {
  this.c.set(tc(a), a)
};
m.Ba = function(a) {
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
  return E(this.c.c, a)
};
m.N = function() {
  return this.c.N()
};
m.e = function(a) {
  return this.w() == Qa(a) && uc(this, a)
};
function uc(a, b) {
  var c = Qa(b);
  if(a.w() > c) {
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
        if(ea(b) || t(b)) {
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
      for(var d = a.arguments, f = 0;f < d.length;f++) {
        f > 0 && c.push(", ");
        var e;
        e = d[f];
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
            e = (e = xc(e)) ? e : "[fn]";
            break;
          default:
            e = typeof e
        }
        e.length > 40 && (e = e.substr(0, 40) + "...");
        c.push(e)
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
function zc(a, b, c, d, f) {
  this.reset(a, b, c, d, f)
}
zc.prototype.bc = 0;
zc.prototype.lb = l;
zc.prototype.kb = l;
var Ac = 0;
zc.prototype.reset = function(a, b, c, d, f) {
  this.bc = typeof f == "number" ? f : Ac++;
  this.xc = d || la();
  this.ea = a;
  this.Wb = b;
  this.rc = c;
  delete this.lb;
  delete this.kb
};
zc.prototype.Eb = function(a) {
  this.ea = a
};
function M(a) {
  this.Xb = a
}
M.prototype.O = l;
M.prototype.ea = l;
M.prototype.Fa = l;
M.prototype.mb = l;
function Bc(a, b) {
  this.name = a;
  this.value = b
}
Bc.prototype.toString = function() {
  return this.name
};
var Cc = new Bc("SEVERE", 1E3), Dc = new Bc("WARNING", 900), Ec = new Bc("INFO", 800), Fc = new Bc("CONFIG", 700), Gc = new Bc("FINE", 500), Hc = new Bc("FINEST", 300);
m = M.prototype;
m.getParent = function() {
  return this.O
};
m.Eb = function(a) {
  this.ea = a
};
function Ic(a) {
  if(a.ea) {
    return a.ea
  }
  if(a.O) {
    return Ic(a.O)
  }
  Ia("Root logger has no level set.");
  return l
}
m.log = function(a, b, c) {
  if(a.value >= Ic(this).value) {
    a = this.Tb(a, b, c);
    b = "log:" + a.Wb;
    p.console && (p.console.timeStamp ? p.console.timeStamp(b) : p.console.markTimeline && p.console.markTimeline(b));
    p.msWriteProfilerMark && p.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.mb) {
        for(var f = 0, e = i;e = c.mb[f];f++) {
          e(d)
        }
      }
      b = b.getParent()
    }
  }
};
m.Tb = function(a, b, c) {
  var d = new zc(a, String(b), this.Xb);
  if(c) {
    d.lb = c;
    var f;
    var e = arguments.callee.caller;
    try {
      var h;
      var j = ba("window.location.href");
      if(t(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:j, stack:"Not available"}
      }else {
        var n, o, u = !1;
        try {
          n = c.lineNumber || c.qc || "Not available"
        }catch(k) {
          n = "Not available", u = !0
        }
        try {
          o = c.fileName || c.filename || c.sourceURL || j
        }catch(q) {
          o = "Not available", u = !0
        }
        h = u || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:o, stack:c.stack || "Not available"} : c
      }
      f = "Message: " + za(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + za(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + za(vc(e) + "-> ")
    }catch(r) {
      f = "Exception trying to expose exception! You win, we lose. " + r
    }
    d.kb = f
  }
  return d
};
function Jc(a, b) {
  a.log(Cc, b, i)
}
function Lc(a, b) {
  a.log(Dc, b, i)
}
m.info = function(a, b) {
  this.log(Ec, a, b)
};
function N(a, b) {
  a.log(Gc, b, i)
}
function O(a, b) {
  a.log(Hc, b, i)
}
var Mc = {}, Nc = l;
function P(a) {
  Nc || (Nc = new M(""), Mc[""] = Nc, Nc.Eb(Fc));
  var b;
  if(!(b = Mc[a])) {
    b = new M(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = P(a.substr(0, c));
    if(!c.Fa) {
      c.Fa = {}
    }
    c.Fa[d] = b;
    b.O = c;
    Mc[a] = b
  }
  return b
}
;function Oc(a) {
  this.G = a;
  this.Ca = []
}
y(Oc, H);
Oc.prototype.a = P("cw.net.FlashSocketConduit");
function Pc(a, b) {
  a.Ca ? (O(a.a, "writeFrames: Not connected, can't write " + b.length + " frame(s) yet."), a.Ca.push.apply(a.Ca, b)) : (O(a.a, "writeFrames: Writing " + b.length + " frame(s)."), Pc(a.Va, b))
}
function Qc(a, b, c) {
  Qc(a.Va, b, c)
}
Oc.prototype.i = function() {
  this.a.info("in disposeInternal.");
  Oc.F.i.call(this);
  this.Va.d();
  delete this.G
};
var rc = Math.pow(2, 53);
var Rc = {Nb:aa("<cw.eq.Wildcard>")};
function Sc(a) {
  return a == "boolean" || a == "number" || a == "null" || a == "undefined" || a == "string"
}
function Tc(a, b, c) {
  var d = s(a), f = s(b);
  if(a == Rc || b == Rc) {
    return!0
  }else {
    if(a != l && typeof a.e == "function") {
      return c && c.push("running custom equals function on left object"), a.e(b, c)
    }else {
      if(b != l && typeof b.e == "function") {
        return c && c.push("running custom equals function on right object"), b.e(a, c)
      }else {
        if(Sc(d) || Sc(f)) {
          a = a === b
        }else {
          if(a instanceof RegExp && b instanceof RegExp) {
            a = a.toString() === b.toString()
          }else {
            if(fa(a) && fa(b)) {
              a = a.valueOf() === b.valueOf()
            }else {
              if(d == "array" && f == "array") {
                a: {
                  if(c && c.push("descending into array"), a.length != b.length) {
                    c && c.push("array length mismatch: " + a.length + ", " + b.length), a = !1
                  }else {
                    d = 0;
                    for(f = a.length;d < f;d++) {
                      if(!Tc(a[d], b[d], c)) {
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
                if(a.Mb == cb && b.Mb == cb) {
                  a: {
                    c && c.push("descending into object");
                    for(var e in a) {
                      if(!(e in b)) {
                        c && c.push("property " + e + " missing on right object");
                        a = !1;
                        break a
                      }
                      if(!Tc(a[e], b[e], c)) {
                        c && c.push("earlier comparisons indicate mismatch at property " + e);
                        a = !1;
                        break a
                      }
                    }
                    for(e in b) {
                      if(!(e in a)) {
                        c && c.push("property " + e + " missing on left object");
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
;function Q(a) {
  A.call(this, a)
}
y(Q, A);
Q.prototype.name = "cw.net.InvalidFrame";
function R() {
  var a = [];
  this.t(a);
  return a.join("")
}
function Uc() {
}
Uc.prototype.e = function(a, b) {
  return!(a instanceof Uc) ? !1 : Tc(Vc(this), Vc(a), b)
};
Uc.prototype.l = function(a, b) {
  a.push("<HelloFrame properties=");
  C(Vc(this), a, b);
  a.push(">")
};
function Vc(a) {
  return[a.aa, a.zb, a.nb, a.Cb, a.ja, a.Ya, a.vb, a.ub, a.Ma, a.tb, a.Jb, a.Gb, a.v, a.ta]
}
Uc.prototype.r = R;
Uc.prototype.t = function(a) {
  var b = {};
  b.tnum = this.aa;
  b.ver = this.zb;
  b.format = this.nb;
  b["new"] = this.Cb;
  b.id = this.ja;
  b.ming = this.Ya;
  b.pad = this.vb;
  b.maxb = this.ub;
  if(this.Ma !== i) {
    b.maxt = this.Ma
  }
  b.maxia = this.tb;
  b.tcpack = this.Jb;
  b.eeds = this.Gb;
  b.sack = this.v instanceof F ? nc((new S(this.v)).r()) : this.v;
  b.seenack = this.ta instanceof F ? nc((new S(this.ta)).r()) : this.ta;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(ta(b), "H")
};
function T(a) {
  this.$ = a
}
T.prototype.e = function(a) {
  return a instanceof T && this.$ == a.$
};
T.prototype.l = function(a, b) {
  a.push("new StringFrame(");
  C(this.$, a, b);
  a.push(")")
};
T.prototype.r = R;
T.prototype.t = function(a) {
  a.push(this.$, " ")
};
function U(a) {
  this.na = a
}
U.prototype.e = function(a) {
  return a instanceof U && this.na == a.na
};
U.prototype.l = function(a, b) {
  a.push("new CommentFrame(");
  C(this.na, a, b);
  a.push(")")
};
U.prototype.r = R;
U.prototype.t = function(a) {
  a.push(this.na, "^")
};
function V(a) {
  this.ia = a
}
V.prototype.e = function(a) {
  return a instanceof V && this.ia == a.ia
};
V.prototype.l = function(a) {
  a.push("new SeqNumFrame(", String(this.ia), ")")
};
V.prototype.r = R;
V.prototype.t = function(a) {
  a.push(String(this.ia), "N")
};
function Wc(a) {
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
    for(var b = b[0].split(","), d = 0, f = b.length;d < f;d++) {
      var e = qc(b[d]);
      if(e == l) {
        return l
      }
      c.push(e)
    }
  }
  return new F(a, c)
}
function S(a) {
  this.v = a
}
S.prototype.e = function(a, b) {
  return a instanceof S && this.v.e(a.v, b)
};
S.prototype.l = function(a, b) {
  a.push("new SackFrame(");
  C(this.v, a, b);
  a.push(")")
};
S.prototype.r = R;
S.prototype.t = function(a) {
  var b = this.v;
  a.push(b.P.join(","), "|", String(b.Q));
  a.push("A")
};
function Xc(a) {
  this.da = a
}
Xc.prototype.e = function(a, b) {
  return a instanceof Xc && this.da.e(a.da, b)
};
Xc.prototype.l = function(a, b) {
  a.push("new StreamStatusFrame(");
  C(this.da, a, b);
  a.push(")")
};
Xc.prototype.r = R;
Xc.prototype.t = function(a) {
  var b = this.da;
  a.push(b.P.join(","), "|", String(b.Q));
  a.push("T")
};
function Yc() {
}
Yc.prototype.l = function(a) {
  a.push("new StreamCreatedFrame()")
};
Yc.prototype.e = function(a) {
  return a instanceof Yc
};
Yc.prototype.r = R;
Yc.prototype.t = function(a) {
  a.push("C")
};
function Zc() {
}
Zc.prototype.l = function(a) {
  a.push("new YouCloseItFrame()")
};
Zc.prototype.e = function(a) {
  return a instanceof Zc
};
Zc.prototype.r = R;
Zc.prototype.t = function(a) {
  a.push("Y")
};
function W(a, b) {
  this.wa = a;
  this.ma = b
}
W.prototype.e = function(a) {
  return a instanceof W && this.wa == a.wa && this.ma == a.ma
};
W.prototype.l = function(a, b) {
  a.push("new ResetFrame(");
  C(this.wa, a, b);
  a.push(", ", String(this.ma), ")")
};
W.prototype.r = R;
W.prototype.t = function(a) {
  a.push(this.wa, "|", String(Number(this.ma)), "!")
};
var $c = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function ad(a) {
  this.reason = a
}
ad.prototype.e = function(a) {
  return a instanceof ad && this.reason == a.reason
};
ad.prototype.l = function(a, b) {
  a.push("new TransportKillFrame(");
  C(this.reason, a, b);
  a.push(")")
};
ad.prototype.r = R;
ad.prototype.t = function(a) {
  a.push(this.reason, "K")
};
function bd(a) {
  a || g(new Q("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(b == " ") {
    return new T(a.substr(0, a.length - 1))
  }else {
    if(b == "A") {
      return a = Wc(nc(a)), a == l && g(new Q("bad sack")), new S(a)
    }else {
      if(b == "N") {
        return a = qc(nc(a)), a == l && g(new Q("bad seqNum")), new V(a)
      }else {
        if(b == "T") {
          return a = Wc(nc(a)), a == l && g(new Q("bad lastSackSeen")), new Xc(a)
        }else {
          if(b == "Y") {
            return a.length != 1 && g(new Q("leading garbage")), new Zc
          }else {
            if(b == "^") {
              return new U(a.substr(0, a.length - 1))
            }else {
              if(b == "C") {
                return a.length != 1 && g(new Q("leading garbage")), new Yc
              }else {
                if(b == "!") {
                  return b = a.substr(0, a.length - 3), (b.length > 255 || !/^([ -~]*)$/.test(b)) && g(new Q("bad reasonString")), a = {"|0":!1, "|1":!0}[a.substr(a.length - 3, 2)], a == l && g(new Q("bad applicationLevel")), new W(b, a)
                }else {
                  if(b == "K") {
                    return a = a.substr(0, a.length - 1), a = $c[a], a == l && g(new Q("unknown kill reason: " + a)), new ad(a)
                  }else {
                    g(new Q("Invalid frame type " + b))
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
;!G || yb();
!kb && !G || G && yb() || kb && wb("1.9.1");
G && wb("9");
function cd(a, b, c, d) {
  this.contentWindow = a;
  this.Rb = b;
  this.Fb = c;
  this.Sb = d
}
cd.prototype.l = function(a, b) {
  a.push("<XDRFrame frameId=");
  C(this.Sb, a, b);
  a.push(", expandedUrl=");
  C(this.Rb, a, b);
  a.push(", streams=");
  C(this.Fb, a, b);
  a.push(">")
};
function dd() {
  this.frames = [];
  this.rb = new Ta
}
dd.prototype.a = P("cw.net.XDRTracker");
dd.prototype.hc = function(a) {
  var b = this.rb.get(a);
  b || g(Error("Unknown frameId " + D(a)));
  this.rb.remove(b);
  var c = b[0], a = new cd((t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow || (lb ? (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + 
  a).contentDocument || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).parentWindow || (lb ? (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + 
  a) : "minerva-xdrframe-" + a).contentDocument || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  gc(c, a)
};
var ed = new dd;
p.__XHRTracker_xdrFrameLoaded = x(ed.hc, ed);
var fd;
fd = !1;
var X = hb();
X && (X.indexOf("Firefox") != -1 || X.indexOf("Camino") != -1 || X.indexOf("iPhone") != -1 || X.indexOf("iPod") != -1 || X.indexOf("iPad") != -1 || X.indexOf("Android") != -1 || X.indexOf("Chrome") != -1 && (fd = !0));
var gd = fd;
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
P("goog.net.xhrMonitor");
function hd(a, b, c) {
  this.G = b;
  this.ga = a;
  this.Ga = c
}
y(hd, H);
m = hd.prototype;
m.a = P("cw.net.XHRMaster");
m.Bb = -1;
m.Oa = function(a, b) {
  b != Xa.ic.jc && Jc(this.a, D(this.ga) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  id(this.G);
  a: {
    var c = this.G;
    c.za = !0;
    try {
      for(var d = !1, f = [], e = 0, h = a.length;e < h;e++) {
        if(c.L) {
          c.a.info(c.f() + " returning from loop because we're disposed.");
          break a
        }
        if(d = jd(c, a[e], f)) {
          break
        }
      }
      f.length && kd(c, f);
      c.za = !1;
      c.k.length && c.B();
      d && (O(c.a, c.f() + " closeSoon is true.  Frames were: " + D(a)), c.d())
    }finally {
      c.za = !1
    }
  }
};
m.Pa = function(a) {
  N(this.a, "ongotheaders_: " + D(a));
  var b = l;
  "Content-Length" in a && (b = qc(a["Content-Length"]));
  a = this.G;
  N(a.a, a.f() + " got Content-Length: " + b);
  a.z == ld && (b == l && (Lc(a.a, "Expected to receive a valid Content-Length, but did not."), b = 5E5), md(a, 2E3 + b / 3072 * 1E3))
};
m.Qa = function(a) {
  a != 1 && N(this.a, this.G.f() + "'s XHR's readyState is " + a);
  this.Bb = a;
  this.Bb >= 2 && id(this.G)
};
m.Na = function() {
  this.G.d()
};
m.i = function() {
  hd.F.i.call(this);
  delete Y.C[this.ga];
  this.Ga.__XHRSlave_dispose(this.ga);
  delete this.Ga
};
function nd() {
  this.C = {}
}
y(nd, H);
m = nd.prototype;
m.a = P("cw.net.XHRMasterTracker");
function od(a, b, c) {
  var d = "_" + mc(), b = new hd(d, b, c);
  return a.C[d] = b
}
m.Oa = function(a, b, c) {
  var b = Ma(b), d = this.C[a];
  d ? d.Oa(b, c) : Jc(this.a, "onframes_: no master for " + D(a))
};
m.Pa = function(a, b) {
  var c = this.C[a];
  c ? c.Pa(b) : Jc(this.a, "ongotheaders_: no master for " + D(a))
};
m.Qa = function(a, b) {
  var c = this.C[a];
  c ? c.Qa(b) : Jc(this.a, "onreadystatechange_: no master for " + D(a))
};
m.Na = function(a) {
  var b = this.C[a];
  b ? (delete this.C[b.ga], b.Na()) : Jc(this.a, "oncomplete_: no master for " + D(a))
};
m.i = function() {
  nd.F.i.call(this);
  for(var a = oa(this.C);a.length;) {
    a.pop().d()
  }
  delete this.C
};
var Y = new nd;
p.__XHRMaster_onframes = x(Y.Oa, Y);
p.__XHRMaster_oncomplete = x(Y.Na, Y);
p.__XHRMaster_ongotheaders = x(Y.Pa, Y);
p.__XHRMaster_onreadystatechange = x(Y.Qa, Y);
var pd = new U(";)]}"), qd = "disconnected_" + dc++;
function Z(a, b, c, d) {
  this.n = a;
  this.Zb = b;
  this.H = c;
  this.dc = d;
  this.ka = new sc;
  this.ja = mc() + mc();
  this.I = new Ya;
  this.La = new $a;
  this.la = l;
  this.Lb = [];
  if(lb) {
    this.la = Xb(p, "load", this.$b, !1, this)
  }
}
y(Z, ec);
m = Z.prototype;
m.a = P("cw.net.Stream");
m.pb = new F(-1, []);
m.qb = new F(-1, []);
m.Vb = 50;
m.Ub = 1048576;
m.Wa = !1;
m.Ua = !1;
m.m = 1;
m.Hb = -1;
m.b = l;
m.j = l;
m.ha = l;
m.Xa = 0;
m.yb = 0;
m.Db = 0;
m.l = function(a, b) {
  a.push("<Stream id=");
  C(this.ja, a, b);
  a.push(", state=", String(this.m));
  a.push(", primary=");
  C(this.b, a, b);
  a.push(", secondary=");
  C(this.j, a, b);
  a.push(", resetting=");
  C(this.ha, a, b);
  a.push(">")
};
function rd(a) {
  var b = [-1];
  a.b && b.push(a.b.W);
  a.j && b.push(a.j.W);
  return Math.max.apply(Math.max, b)
}
function sd(a) {
  if(a.m != 1) {
    var b = a.I.o.w() != 0, c = ab(a.La), d = !c.e(a.qb) && !(a.b && c.e(a.b.V) || a.j && c.e(a.j.V)), f = rd(a);
    if((b = b && f < a.I.S) || d) {
      var e = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      if(a.b.ba) {
        O(a.a, "tryToSend_: writing " + e + " to primary");
        if(d && (d = a.b, c != d.V)) {
          !d.D && !d.k.length && td(d), d.k.push(new S(c)), d.V = c
        }
        b && ud(a.b, a.I, f + 1);
        a.b.B()
      }else {
        a.j == l ? a.Wa ? (O(a.a, "tryToSend_: creating secondary to send " + e), a.j = vd(a, !1), b && ud(a.j, a.I, f + 1), a.j.B()) : (O(a.a, "tryToSend_: not creating a secondary because Stream might not exist on server"), a.Ua = !0) : O(a.a, "tryToSend_: need to send " + e + ", but can't right now")
      }
    }
  }
}
m.$b = function() {
  this.la = l;
  if(this.b && this.b.T()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.b;
    a.Aa = !0;
    a.d()
  }
  if(this.j && this.j.T()) {
    this.a.info("restartHttpRequests_: aborting secondary"), a = this.j, a.Aa = !0, a.d()
  }
};
m.ac = function(a, b) {
  b !== i || (b = !0);
  this.m > 3 && g(Error("sendStrings: Can't send strings in state " + this.m));
  if(a.length) {
    if(b) {
      for(var c = 0;c < a.length;c++) {
        var d = a[c];
        /^([ -~]*)$/.test(d) || g(Error("sendStrings: string #" + c + " has illegal chars: " + D(d)))
      }
    }
    this.I.extend(a);
    sd(this)
  }
};
function vd(a, b) {
  var c;
  g(Error("Don't support endpoint " + D(a.H)));
  a.Hb += 1;
  c = new wd(a.n, a, a.Hb, c, a.H, b);
  O(a.a, "Created: " + c.f());
  a.ka.add(c);
  return c
}
function xd(a, b, c) {
  var d = new yd(a.n, a, b, c);
  O(a.a, "Created: " + d.f() + ", delay=" + b + ", times=" + c);
  a.ka.add(d);
  return d
}
function zd(a, b) {
  a.ka.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  N(a.a, "Offline: " + b.f());
  b.va ? a.Xa += b.va : a.Xa = 0;
  a.Xa >= 1 && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.d());
  if(a.m > 3) {
    a.m == 4 && b.Kb ? (N(a.a, "Disposing because resettingTransport_ is done."), a.d()) : N(a.a, "Not creating a transport because Stream is in state " + a.m)
  }else {
    var c;
    var d;
    c = b instanceof yd;
    if(!c && b.Aa) {
      var f = lb ? gd ? [0, 1] : [9, 20] : [0, 0];
      c = f[0];
      d = f[1];
      O(a.a, "getDelayForNextTransport_: " + D({delay:c, times:d}))
    }else {
      d = b.bb();
      if(b == a.b) {
        if(d) {
          f = ++a.yb
        }else {
          if(!c) {
            f = a.yb = 0
          }
        }
      }else {
        if(d) {
          f = ++a.Db
        }else {
          if(!c) {
            f = a.Db = 0
          }
        }
      }
      if(c || !f) {
        d = c = 0, O(a.a, "getDelayForNextTransport_: " + D({count:f, delay:c, times:d}))
      }else {
        var e = 2E3 * Math.min(f, 3), h = Math.floor(Math.random() * 4E3) - 2E3, j = Math.max(0, b.Ib - b.Za);
        d = (c = Math.max(0, e + h - j)) ? 1 : 0;
        O(a.a, "getDelayForNextTransport_: " + D({count:f, base:e, variance:h, oldDuration:j, delay:c, times:d}))
      }
    }
    c = [c, d];
    f = c[0];
    c = c[1];
    if(b == a.b) {
      a.b = l, c ? a.b = xd(a, f, c) : (f = rd(a), a.b = vd(a, !0), ud(a.b, a.I, f + 1)), a.b.B()
    }else {
      if(b == a.j) {
        a.j = l, c ? (a.j = xd(a, f, c), a.j.B()) : sd(a)
      }
    }
  }
}
m.reset = function(a) {
  this.m > 3 && g(Error("reset: Can't send reset in state " + this.m));
  this.m = 4;
  this.b && this.b.ba ? (this.a.info("reset: Sending ResetFrame over existing primary."), Ad(this.b, a), this.b.B()) : (this.b && (N(this.a, "reset: Disposing primary before sending ResetFrame."), this.b.d()), this.j && (N(this.a, "reset: Disposing secondary before sending ResetFrame."), this.j.d()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.ha = vd(this, !1), Ad(this.ha, a), this.ha.B())
};
function Bd(a, b, c, d) {
  var f;
  f = a.La;
  for(var e = a.Vb, h = a.Ub, j = [], n = !1, o = 0, u = c.length;o < u;o++) {
    var k = c[o], q = k[0], k = k[1];
    if(q == f.U + 1) {
      f.U += 1;
      for(j.push(k);;) {
        q = f.U + 1;
        k = f.K.get(q, bb);
        if(k === bb) {
          break
        }
        j.push(k[0]);
        f.K.remove(q);
        f.J -= k[1];
        f.U = q
      }
    }else {
      if(!(q <= f.U)) {
        if(e != l && f.K.w() >= e) {
          n = !0;
          break
        }
        var r = Wa(k);
        if(h != l && f.J + r > h) {
          n = !0;
          break
        }
        f.K.set(q, [k, r]);
        f.J += r
      }
    }
  }
  f.K.sa() && f.K.clear();
  f = [j, n];
  c = f[0];
  f = f[1];
  if(c) {
    for(e = 0;e < c.length;e++) {
      if(a.m == 4 || a.L) {
        return
      }
    }
  }
  d || sd(a);
  if(!(a.m == 4 || a.L) && f) {
    Jc(b.a, b.f() + "'s peer caused rwin overflow."), b.d()
  }
}
m.start = function() {
  this.m != 1 && g(Error("Stream.start: " + D(this) + " already started"));
  this.m = 2;
  this.m = 3;
  this.b = vd(this, !0);
  ud(this.b, this.I, l);
  this.b.B()
};
m.i = function() {
  this.a.info(D(this) + " in disposeInternal.");
  this.m = 5;
  for(var a = this.ka.N(), b = 0;b < a.length;b++) {
    a[b].d()
  }
  for(a = 0;a < this.Lb.length;a++) {
    var b = this.Lb[a].Fb, c = Ja(b, this);
    c >= 0 && B.splice.call(b, c, 1)
  }
  if(lb && this.la) {
    Zb(this.la), this.la = l
  }
  this.dispatchEvent({type:qd});
  delete this.ka;
  delete this.b;
  delete this.j;
  delete this.ha;
  delete this.Zb;
  Z.F.i.call(this)
};
var ld = 1, Cd = 2;
function wd(a, b, c, d, f, e) {
  this.n = a;
  this.p = b;
  this.aa = c;
  this.z = d;
  this.H = f;
  this.k = [];
  this.R = e;
  this.ba = !this.T();
  this.Z = this.z != ld;
  this.Ob = x(this.ec, this)
}
y(wd, H);
m = wd.prototype;
m.a = P("cw.net.ClientTransport");
m.q = l;
m.Za = l;
m.Ib = l;
m.xa = l;
m.D = !1;
m.za = !1;
m.V = l;
m.Ja = 0;
m.W = -1;
m.Sa = -1;
m.Kb = !1;
m.Aa = !1;
m.va = 0;
m.ca = !1;
m.l = function(a) {
  a.push("<ClientTransport #", String(this.aa), ", becomePrimary=", String(this.R), ">")
};
m.f = function() {
  return(this.R ? "Prim. T#" : "Sec. T#") + this.aa
};
m.bb = function() {
  return!(!this.ca && this.Ja)
};
m.T = function() {
  return this.z == ld || this.z == Cd
};
function kd(a, b) {
  Na(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Bd(a.p, a, b, !a.Z)
}
function jd(a, b, c) {
  try {
    var d = bd(b);
    a.Ja += 1;
    N(a.a, a.f() + " RECV " + D(d));
    var f;
    a.Ja == 1 && !d.e(pd) && a.T() ? (Lc(a.a, a.f() + " is closing soon because got bad preamble: " + D(d)), f = !0) : f = !1;
    if(f) {
      return!0
    }
    if(d instanceof T) {
      if(!/^([ -~]*)$/.test(d.$)) {
        return a.ca = !0
      }
      a.Sa += 1;
      c.push([a.Sa, d.$])
    }else {
      if(d instanceof S) {
        var e = a.p, h = d.v;
        e.pb = h;
        var j = e.I, n = h.Q, c = !1;
        n > j.S && (c = !0);
        for(var o = Za(j).concat(), d = 0;d < o.length;d++) {
          var u = o[d];
          if(u > n) {
            break
          }
          var k = j.o.c[u][1];
          j.o.remove(u);
          j.J -= k
        }
        for(d = 0;d < h.P.length;d++) {
          var q = h.P[d];
          q > j.S && (c = !0);
          E(j.o.c, q) && (k = j.o.c[q][1], j.o.remove(q), j.J -= k)
        }
        j.o.sa() && j.o.clear();
        if(c) {
          return Lc(a.a, a.f() + " is closing soon because got bad SackFrame"), a.ca = !0
        }
      }else {
        if(d instanceof V) {
          a.Sa = d.ia - 1
        }else {
          if(d instanceof Xc) {
            a.p.qb = d.da
          }else {
            if(d instanceof Zc) {
              return O(a.a, a.f() + " is closing soon because got YouCloseItFrame"), !0
            }else {
              if(d instanceof ad) {
                return a.ca = !0, d.reason == "stream_attach_failure" ? a.va += 1 : d.reason == "acked_unsent_strings" && (a.va += 0.5), O(a.a, a.f() + " is closing soon because got " + D(d)), !0
              }else {
                if(!(d instanceof U)) {
                  if(d instanceof Yc) {
                    var r = a.p, Hd = !a.Z;
                    O(r.a, "Stream is now confirmed to exist at server.");
                    r.Wa = !0;
                    if(r.Ua && !Hd) {
                      r.Ua = !1, sd(r)
                    }
                  }else {
                    if(c.length) {
                      kd(a, c);
                      if(!da(c)) {
                        for(var Qb = c.length - 1;Qb >= 0;Qb--) {
                          delete c[Qb]
                        }
                      }
                      c.length = 0
                    }
                    if(d instanceof W) {
                      return a.p.d(), !0
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
  }catch(Kc) {
    return Kc instanceof Q || g(Kc), Lc(a.a, a.f() + " is closing soon because got InvalidFrame: " + D(b)), a.ca = !0
  }
  return!1
}
m.ec = function() {
  Lc(this.a, this.f() + " timed out due to lack of connection or no data being received.");
  this.d()
};
function Dd(a) {
  if(a.xa != l) {
    a.n.s.clearTimeout(a.xa), a.xa = l
  }
}
function md(a, b) {
  Dd(a);
  b = Math.round(b);
  a.xa = a.n.s.setTimeout(a.Ob, b);
  N(a.a, a.f() + "'s receive timeout set to " + b + " ms.")
}
function id(a) {
  a.z != ld && (a.z == 3 || a.z == Cd ? md(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.z)))
}
function td(a) {
  var b = new Uc;
  b.aa = a.aa;
  b.zb = 2;
  b.nb = 2;
  if(!a.p.Wa) {
    b.Cb = !0
  }
  b.ja = a.p.ja;
  b.Ya = a.Z;
  if(b.Ya) {
    b.vb = 4096
  }
  b.ub = 3E5;
  b.tb = a.Z ? Math.floor(10) : 0;
  b.Jb = !1;
  if(a.R) {
    b.Gb = l, b.Ma = Math.floor((a.Z ? 358E4 : 25E3) / 1E3)
  }
  b.v = ab(a.p.La);
  b.ta = a.p.pb;
  a.k.push(b);
  a.V = b.v
}
m.B = function() {
  this.D && !this.ba && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.za) {
    O(this.a, this.f() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.D;
    this.D = !0;
    !a && !this.k.length && td(this);
    for(a = 0;a < this.k.length;a++) {
      N(this.a, this.f() + " SEND " + D(this.k[a]))
    }
    if(this.T()) {
      for(var a = [], b = 0, c = this.k.length;b < c;b++) {
        this.k[b].t(a), a.push("\n")
      }
      this.k = [];
      a = a.join("");
      b = this.R ? this.H.tc : this.H.vc;
      this.q = od(Y, this, this.R ? this.H.uc : this.H.wc);
      this.Za = this.n.s === fc ? la() : this.n.s.getTime();
      c = this.q;
      c.Ga.__XHRSlave_makeRequest(c.ga, b, "POST", a);
      md(this, 3E3 * (1.5 + (b.indexOf("https://") == 0 ? 3 : 1)) + 4E3 + (this.Z ? 0 : this.R ? 25E3 : 0))
    }else {
      if(this.z == 3) {
        a = [];
        b = 0;
        for(c = this.k.length;b < c;b++) {
          a.push(this.k[b].r())
        }
        this.k = [];
        this.q ? Pc(this.q, a) : (b = this.H, this.q = new Oc(this), this.q.Va = od(b.yc, this.q), this.Za = this.n.s === fc ? la() : this.n.s.getTime(), Qc(this.q, b.host, b.port), this.q.L || (Pc(this.q, a), this.q.L || md(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.z))
      }
    }
  }
};
function ud(a, b, c) {
  !a.D && !a.k.length && td(a);
  for(var d = Math.max(c, a.W + 1), f = Za(b), c = [], e = 0;e < f.length;e++) {
    var h = f[e];
    (d == l || h >= d) && c.push([h, b.o.c[h][0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    e = c[b], f = e[0], e = e[1], (a.W == -1 || a.W + 1 != f) && a.k.push(new V(f)), a.k.push(new T(e)), a.W = f
  }
}
m.i = function() {
  this.a.info(this.f() + " in disposeInternal.");
  wd.F.i.call(this);
  this.Ib = this.n.s === fc ? la() : this.n.s.getTime();
  this.k = [];
  Dd(this);
  this.q && this.q.d();
  var a = this.p;
  this.p = l;
  zd(a, this)
};
function Ad(a, b) {
  !a.D && !a.k.length && td(a);
  a.k.push(new W(b, !0));
  a.Kb = !0
}
function yd(a, b, c, d) {
  this.n = a;
  this.p = b;
  this.gb = c;
  this.eb = d
}
y(yd, H);
m = yd.prototype;
m.D = !1;
m.ba = !1;
m.pa = l;
m.V = l;
m.a = P("cw.net.DoNothingTransport");
function Ed(a) {
  a.pa = a.n.s.setTimeout(function() {
    a.pa = l;
    a.eb--;
    a.eb ? Ed(a) : a.d()
  }, a.gb)
}
m.B = function() {
  this.D && !this.ba && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.D = !0;
  Ed(this)
};
m.l = function(a) {
  a.push("<DoNothingTransport delay=", String(this.gb), ">")
};
m.T = aa(!1);
m.f = aa("Wast. T");
m.bb = aa(!1);
m.i = function() {
  this.a.info(this.f() + " in disposeInternal.");
  yd.F.i.call(this);
  this.pa != l && this.n.s.clearTimeout(this.pa);
  var a = this.p;
  this.p = l;
  zd(a, this)
};
var Fd = "Minerva.Client.Stream".split("."), $ = p;
!(Fd[0] in $) && $.execScript && $.execScript("var " + Fd[0]);
for(var Gd;Fd.length && (Gd = Fd.shift());) {
  !Fd.length && Z !== i ? $[Gd] = Z : $ = $[Gd] ? $[Gd] : $[Gd] = {}
}
Z.prototype.start = Z.prototype.start;
Z.prototype.sendStrings = Z.prototype.ac;
Z.prototype.reset = Z.prototype.reset;
})();
