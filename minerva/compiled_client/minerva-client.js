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
function ba(a, b) {
  var c = a.split("."), d = p;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var f;c.length && (f = c.shift());) {
    !c.length && b !== i ? d[f] = b : d = d[f] ? d[f] : d[f] = {}
  }
}
function ca(a) {
  for(var a = a.split("."), b = p, c;c = a.shift();) {
    if(b[c] != l) {
      b = b[c]
    }else {
      return l
    }
  }
  return b
}
function da() {
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
function ea(a) {
  return r(a) == "array"
}
function fa(a) {
  var b = r(a);
  return b == "array" || b == "object" && typeof a.length == "number"
}
function ga(a) {
  return ha(a) && typeof a.getFullYear == "function"
}
function t(a) {
  return typeof a == "string"
}
function v(a) {
  return r(a) == "function"
}
function ha(a) {
  a = r(a);
  return a == "object" || a == "array" || a == "function"
}
function w(a) {
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
  function c() {
  }
  c.prototype = b.prototype;
  a.F = b.prototype;
  a.prototype = new c
}
;function na(a) {
  return v(a) || typeof a == "object" && v(a.call) && v(a.apply)
}
;function oa(a) {
  var b = z, c;
  for(c in b) {
    a.call(i, b[c], c, b)
  }
}
function pa(a) {
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
function sa(a, b) {
  for(var c, d, f = 1;f < arguments.length;f++) {
    d = arguments[f];
    for(c in d) {
      a[c] = d[c]
    }
    for(var e = 0;e < ra.length;e++) {
      c = ra[e], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;function ta() {
}
function ua(a) {
  var b = [];
  va(new ta, a, b);
  return b.join("")
}
function va(a, b, c) {
  switch(typeof b) {
    case "string":
      wa(b, c);
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
      if(ea(b)) {
        var d = b.length;
        c.push("[");
        for(var f = "", e = 0;e < d;e++) {
          c.push(f), va(a, b[e], c), f = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(f in b) {
        Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], typeof e != "function" && (c.push(d), wa(f, c), c.push(":"), va(a, e, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var xa = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"}, ya = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function wa(a, b) {
  b.push('"', a.replace(ya, function(a) {
    if(a in xa) {
      return xa[a]
    }
    var b = a.charCodeAt(0), f = "\\u";
    b < 16 ? f += "000" : b < 256 ? f += "00" : b < 4096 && (f += "0");
    return xa[a] = f + b.toString(16)
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
function za(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
function Aa(a) {
  if(!Ba.test(a)) {
    return a
  }
  a.indexOf("&") != -1 && (a = a.replace(Ca, "&amp;"));
  a.indexOf("<") != -1 && (a = a.replace(Da, "&lt;"));
  a.indexOf(">") != -1 && (a = a.replace(Ea, "&gt;"));
  a.indexOf('"') != -1 && (a = a.replace(Fa, "&quot;"));
  return a
}
var Ca = /&/g, Da = /</g, Ea = />/g, Fa = /\"/g, Ba = /[&<>\"]/;
function Ga(a, b) {
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = Math.max(d.length, f.length), h = 0;c == 0 && h < e;h++) {
    var j = d[h] || "", n = f[h] || "", o = RegExp("(\\d*)(\\D*)", "g"), u = RegExp("(\\d*)(\\D*)", "g");
    do {
      var k = o.exec(j) || ["", "", ""], q = u.exec(n) || ["", "", ""];
      if(k[0].length == 0 && q[0].length == 0) {
        break
      }
      c = Ha(k[1].length == 0 ? 0 : parseInt(k[1], 10), q[1].length == 0 ? 0 : parseInt(q[1], 10)) || Ha(k[2].length == 0, q[2].length == 0) || Ha(k[2], q[2])
    }while(c == 0)
  }
  return c
}
function Ha(a, b) {
  if(a < b) {
    return-1
  }else {
    if(a > b) {
      return 1
    }
  }
  return 0
}
;function Ia(a, b) {
  b.unshift(a);
  A.call(this, za.apply(l, b));
  b.shift();
  this.qc = a
}
y(Ia, A);
Ia.prototype.name = "AssertionError";
function Ja(a, b) {
  g(new Ia("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;var B = Array.prototype, Ka = B.indexOf ? function(a, b, c) {
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
}, La = B.some ? function(a, b, c) {
  return B.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = t(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in f && b.call(c, f[e], e, a)) {
      return!0
    }
  }
  return!1
}, Ma = B.every ? function(a, b, c) {
  return B.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = t(a) ? a.split("") : a, e = 0;e < d;e++) {
    if(e in f && !b.call(c, f[e], e, a)) {
      return!1
    }
  }
  return!0
};
function Na(a) {
  return B.concat.apply(B, arguments)
}
function Oa(a, b) {
  B.sort.call(a, b || Pa)
}
function Pa(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;function Qa(a, b, c) {
  var d = Ka(c, a);
  if(d != -1) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = r(a);
    if(d == "boolean" || d == "number" || d == "null" || d == "undefined") {
      b.push(String(a))
    }else {
      if(d == "string") {
        wa(a, b)
      }else {
        if(na(a.l)) {
          a.l(b, c)
        }else {
          if(na(a.Pb)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if(d == "array") {
                d = a.length;
                b.push("[");
                for(var f = "", e = 0;e < d;e++) {
                  b.push(f), Qa(a[e], b, c), f = ", "
                }
                b.push("]")
              }else {
                if(d == "object") {
                  if(ga(a) && typeof a.valueOf == "function") {
                    b.push("new Date(", String(a.valueOf()), ")")
                  }else {
                    for(var d = qa(a).concat(ra), f = {}, h = e = 0;h < d.length;) {
                      var j = d[h++], n = ha(j) ? "o" + w(j) : (typeof j).charAt(0) + j;
                      Object.prototype.hasOwnProperty.call(f, n) || (f[n] = !0, d[e++] = j)
                    }
                    d.length = e;
                    b.push("{");
                    f = "";
                    for(h = 0;h < d.length;h++) {
                      e = d[h], Object.prototype.hasOwnProperty.call(a, e) && (j = a[e], b.push(f), wa(e, b), b.push(": "), Qa(j, b, c), f = ", ")
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
  Qa(a, b, c)
}
function D(a, b) {
  var c = [];
  C(a, c, b);
  return c.join("")
}
;function Ra(a) {
  if(typeof a.w == "function") {
    a = a.w()
  }else {
    if(fa(a) || t(a)) {
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
function Sa(a) {
  if(typeof a.N == "function") {
    return a.N()
  }
  if(t(a)) {
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
function Ta(a, b) {
  if(typeof a.every == "function") {
    return a.every(b, i)
  }
  if(fa(a) || t(a)) {
    return Ma(a, b, i)
  }
  var c;
  if(typeof a.oa == "function") {
    c = a.oa()
  }else {
    if(typeof a.N != "function") {
      if(fa(a) || t(a)) {
        c = [];
        for(var d = a.length, f = 0;f < d;f++) {
          c.push(f)
        }
      }else {
        c = qa(a)
      }
    }else {
      c = i
    }
  }
  for(var d = Sa(a), f = d.length, e = 0;e < f;e++) {
    if(!b.call(i, d[e], c && c[e], a)) {
      return!1
    }
  }
  return!0
}
;function Ua(a, b) {
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
m = Ua.prototype;
m.h = 0;
m.ab = 0;
m.w = function() {
  return this.h
};
m.N = function() {
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
  var c = b || Wa;
  Va(this);
  for(var d, f = 0;d = this.g[f];f++) {
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
  return this.h == 0
};
m.clear = function() {
  this.c = {};
  this.ab = this.h = this.g.length = 0
};
m.remove = function(a) {
  return E(this.c, a) ? (delete this.c[a], this.h--, this.ab++, this.g.length > 2 * this.h && Va(this), !0) : !1
};
function Va(a) {
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
  a instanceof Ua ? (b = a.oa(), a = a.N()) : (b = qa(a), a = pa(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
function E(a, b) {
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
;function F(a, b) {
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
  this.o = new Ua
}
m = Ya.prototype;
m.S = -1;
m.J = 0;
m.append = function(a) {
  var b = Xa(a);
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
  Va(a.o);
  Oa(a.o.g);
  return a.o.g
}
function $a() {
  this.K = new Ua
}
$a.prototype.U = -1;
$a.prototype.J = 0;
function ab(a) {
  var b = a.K.oa();
  Oa(b);
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
  vb[a] || (vb[a] = Ga(ob, a) >= 0)
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
  this.Sb && Ab.apply(l, this.Sb)
};
function Ab(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    fa(d) ? Ab.apply(l, d) : d && typeof d.d == "function" && d.d()
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
  this.Cb = b;
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
    if(ha(b)) {
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
var Jb, Kb, Lb, Mb, Ob, Pb, Qb, Rb, Sb, Tb, Ub;
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
  var e = Fb && !(Ga(Gb, "5.7") >= 0), h;
  Pb = function(a) {
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
    Ob = function() {
      return o.getObject()
    };
    Qb = function() {
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
    Jb = a, Kb = da, Lb = b, Mb = da, Ob = c, Qb = da, Rb = d, Sb = da, Tb = f, Ub = da
  }
})();
var K = {}, L = {}, z = {}, Vb = {};
function Wb(a, b, c, d, f) {
  if(b) {
    if(ea(b)) {
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
      e = Ob();
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
  if(ea(b)) {
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
  if(ea(b)) {
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
      var c = b.src, d = b.type, f = b.Cb, e = b.capture;
      c.removeEventListener ? (c == p || !c.fb) && c.removeEventListener(d, f, e) : c.detachEvent && c.detachEvent(d in Vb ? Vb[d] : Vb[d] = "on" + d, f);
      c = w(c);
      f = L[d][e][c];
      if(z[c]) {
        var h = z[c], j = Ka(h, b);
        j >= 0 && B.splice.call(h, j, 1);
        h.length == 0 && delete z[c]
      }
      b.Y = !0;
      f.yb = !0;
      $b(d, e, c, f);
      delete K[a]
    }
  }
}
function $b(a, b, c, d) {
  if(!d.ua && d.yb) {
    for(var f = 0, e = 0;f < d.length;f++) {
      if(d[f].Y) {
        var h = d[f].Cb;
        h.src = l;
        Qb(h);
        Sb(d[f])
      }else {
        f != e && (d[e] = d[f]), e++
      }
    }
    d.length = e;
    d.yb = !1;
    e == 0 && (Mb(d), delete L[a][b][c], L[a][b].h--, L[a][b].h == 0 && (Kb(L[a][b]), delete L[a][b], L[a].h--), L[a].h == 0 && (Kb(L[a]), delete L[a]))
  }
}
function ac(a) {
  var b, c = 0, d = b == l;
  b = !!b;
  if(a == l) {
    oa(function(a) {
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
Pb(function(a, b) {
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
    e = b || ca("window.event");
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
        for(var s = k.length - 1;!o.X && s >= 0 && h.u;s--) {
          o.currentTarget = k[s], e &= bc(h, k[s], d, !0, o)
        }
        if(n) {
          h = f[!1];
          h.u = h.h;
          for(s = 0;!o.X && s < k.length && h.u;s++) {
            o.currentTarget = k[s], e &= bc(h, k[s], d, !1, o)
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
        sa(a, d)
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
  return La(a.Ea, function(a) {
    return v(a[1])
  })
}
function ic(a) {
  a.$a && a.Ia && kc(a) && (p.clearTimeout(a.$a), delete a.$a);
  a.O && (a.O.jc--, delete a.O);
  for(var b = a.Ta, c = !1, d = !1;a.Ea.length && a.zb == 0;) {
    var f = a.Ea.shift(), e = f[0], h = f[1], f = f[2];
    if(e = a.qa ? h : e) {
      try {
        var j = e.call(f || a.lc, b);
        if(j !== i) {
          a.qa = a.qa && (j == b || j instanceof Error), a.Ta = b = j
        }
      }catch(n) {
        b = n, a.qa = !0, kc(a) || (c = !0)
      }
    }
  }
  a.Ta = b;
  if(d && a.zb) {
    jc(b, x(a.Rb, a, !0), x(a.Rb, a, !1)), b.kc = !0
  }
  if(c) {
    a.$a = p.setTimeout(function() {
      g(b)
    }, 0)
  }
}
function hc(a) {
  A.call(this);
  this.mc = a
}
y(hc, A);
hc.prototype.message = "Already called";
function lc(a) {
  this.s = a;
  this.Ha = [];
  this.ib = [];
  this.ic = x(this.gc, this)
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
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ ma()).toString(36)
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
  this.c = new Ua;
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
  for(var a = Sa(a), b = a.length, c = 0;c < b;c++) {
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
  return this.w() == Ra(a) && uc(this, a)
};
function uc(a, b) {
  var c = Ra(b);
  if(a.w() > c) {
    return!1
  }
  !(b instanceof sc) && c > 5 && (b = new sc(b));
  return Ta(a, function(a) {
    if(typeof b.contains == "function") {
      a = b.contains(a)
    }else {
      if(typeof b.cb == "function") {
        a = b.cb(a)
      }else {
        if(fa(b) || t(b)) {
          a = Ka(b, a) >= 0
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
  if(Ka(b, a) >= 0) {
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
  this.vc = d || ma();
  this.ea = a;
  this.Wb = b;
  this.pc = c;
  delete this.lb;
  delete this.kb
};
zc.prototype.Gb = function(a) {
  this.ea = a
};
function M(a) {
  this.Xb = a
}
M.prototype.O = l;
M.prototype.ea = l;
M.prototype.Fa = l;
M.prototype.mb = l;
function N(a, b) {
  this.name = a;
  this.value = b
}
N.prototype.toString = function() {
  return this.name
};
var Bc = new N("SEVERE", 1E3), Cc = new N("WARNING", 900), Dc = new N("INFO", 800), Ec = new N("CONFIG", 700), Fc = new N("FINE", 500), Gc = new N("FINEST", 300);
m = M.prototype;
m.getParent = function() {
  return this.O
};
m.Gb = function(a) {
  this.ea = a
};
function Hc(a) {
  if(a.ea) {
    return a.ea
  }
  if(a.O) {
    return Hc(a.O)
  }
  Ja("Root logger has no level set.");
  return l
}
m.log = function(a, b, c) {
  if(a.value >= Hc(this).value) {
    a = this.Vb(a, b, c);
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
m.Vb = function(a, b, c) {
  var d = new zc(a, String(b), this.Xb);
  if(c) {
    d.lb = c;
    var f;
    var e = arguments.callee.caller;
    try {
      var h;
      var j = ca("window.location.href");
      if(t(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:j, stack:"Not available"}
      }else {
        var n, o, u = !1;
        try {
          n = c.lineNumber || c.oc || "Not available"
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
      f = "Message: " + Aa(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + Aa(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + Aa(vc(e) + "-> ")
    }catch(s) {
      f = "Exception trying to expose exception! You win, we lose. " + s
    }
    d.kb = f
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
function O(a, b) {
  a.log(Fc, b, i)
}
function P(a, b) {
  a.log(Gc, b, i)
}
var Lc = {}, Mc = l;
function Q(a) {
  Mc || (Mc = new M(""), Lc[""] = Mc, Mc.Gb(Ec));
  var b;
  if(!(b = Lc[a])) {
    b = new M(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = Q(a.substr(0, c));
    if(!c.Fa) {
      c.Fa = {}
    }
    c.Fa[d] = b;
    b.O = c;
    Lc[a] = b
  }
  return b
}
;function Nc(a) {
  this.G = a;
  this.Ca = []
}
y(Nc, H);
Nc.prototype.a = Q("cw.net.FlashSocketConduit");
function Oc(a, b) {
  a.Ca ? (P(a.a, "writeFrames: Not connected, can't write " + b.length + " frame(s) yet."), a.Ca.push.apply(a.Ca, b)) : (P(a.a, "writeFrames: Writing " + b.length + " frame(s)."), Oc(a.Va, b))
}
function Pc(a, b, c) {
  Pc(a.Va, b, c)
}
Nc.prototype.i = function() {
  this.a.info("in disposeInternal.");
  Nc.F.i.call(this);
  this.Va.d();
  delete this.G
};
var rc = Math.pow(2, 53);
var Qc = {Pb:aa("<cw.eq.Wildcard>")};
function Rc(a) {
  return a == "boolean" || a == "number" || a == "null" || a == "undefined" || a == "string"
}
function Sc(a, b, c) {
  var d = r(a), f = r(b);
  if(a == Qc || b == Qc) {
    return!0
  }else {
    if(a != l && typeof a.e == "function") {
      return c && c.push("running custom equals function on left object"), a.e(b, c)
    }else {
      if(b != l && typeof b.e == "function") {
        return c && c.push("running custom equals function on right object"), b.e(a, c)
      }else {
        if(Rc(d) || Rc(f)) {
          a = a === b
        }else {
          if(a instanceof RegExp && b instanceof RegExp) {
            a = a.toString() === b.toString()
          }else {
            if(ga(a) && ga(b)) {
              a = a.valueOf() === b.valueOf()
            }else {
              if(d == "array" && f == "array") {
                a: {
                  if(c && c.push("descending into array"), a.length != b.length) {
                    c && c.push("array length mismatch: " + a.length + ", " + b.length), a = !1
                  }else {
                    d = 0;
                    for(f = a.length;d < f;d++) {
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
                    for(var e in a) {
                      if(!(e in b)) {
                        c && c.push("property " + e + " missing on right object");
                        a = !1;
                        break a
                      }
                      if(!Sc(a[e], b[e], c)) {
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
;function R(a) {
  A.call(this, a)
}
y(R, A);
R.prototype.name = "cw.net.InvalidFrame";
function S() {
  var a = [];
  this.t(a);
  return a.join("")
}
function Tc() {
}
Tc.prototype.e = function(a, b) {
  return!(a instanceof Tc) ? !1 : Sc(Uc(this), Uc(a), b)
};
Tc.prototype.l = function(a, b) {
  a.push("<HelloFrame properties=");
  C(Uc(this), a, b);
  a.push(">")
};
function Uc(a) {
  return[a.aa, a.Bb, a.nb, a.Eb, a.ja, a.Ya, a.xb, a.ub, a.Ma, a.tb, a.Lb, a.Ib, a.v, a.ta]
}
Tc.prototype.r = S;
Tc.prototype.t = function(a) {
  var b = {};
  b.tnum = this.aa;
  b.ver = this.Bb;
  b.format = this.nb;
  b["new"] = this.Eb;
  b.id = this.ja;
  b.ming = this.Ya;
  b.pad = this.xb;
  b.maxb = this.ub;
  if(this.Ma !== i) {
    b.maxt = this.Ma
  }
  b.maxia = this.tb;
  b.tcpack = this.Lb;
  b.eeds = this.Ib;
  b.sack = this.v instanceof F ? nc((new T(this.v)).r()) : this.v;
  b.seenack = this.ta instanceof F ? nc((new T(this.ta)).r()) : this.ta;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(ua(b), "H")
};
function U(a) {
  this.$ = a
}
U.prototype.e = function(a) {
  return a instanceof U && this.$ == a.$
};
U.prototype.l = function(a, b) {
  a.push("new StringFrame(");
  C(this.$, a, b);
  a.push(")")
};
U.prototype.r = S;
U.prototype.t = function(a) {
  a.push(this.$, " ")
};
function V(a) {
  this.na = a
}
V.prototype.e = function(a) {
  return a instanceof V && this.na == a.na
};
V.prototype.l = function(a, b) {
  a.push("new CommentFrame(");
  C(this.na, a, b);
  a.push(")")
};
V.prototype.r = S;
V.prototype.t = function(a) {
  a.push(this.na, "^")
};
function W(a) {
  this.ia = a
}
W.prototype.e = function(a) {
  return a instanceof W && this.ia == a.ia
};
W.prototype.l = function(a) {
  a.push("new SeqNumFrame(", String(this.ia), ")")
};
W.prototype.r = S;
W.prototype.t = function(a) {
  a.push(String(this.ia), "N")
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
function T(a) {
  this.v = a
}
T.prototype.e = function(a, b) {
  return a instanceof T && this.v.e(a.v, b)
};
T.prototype.l = function(a, b) {
  a.push("new SackFrame(");
  C(this.v, a, b);
  a.push(")")
};
T.prototype.r = S;
T.prototype.t = function(a) {
  var b = this.v;
  a.push(b.P.join(","), "|", String(b.Q));
  a.push("A")
};
function Wc(a) {
  this.da = a
}
Wc.prototype.e = function(a, b) {
  return a instanceof Wc && this.da.e(a.da, b)
};
Wc.prototype.l = function(a, b) {
  a.push("new StreamStatusFrame(");
  C(this.da, a, b);
  a.push(")")
};
Wc.prototype.r = S;
Wc.prototype.t = function(a) {
  var b = this.da;
  a.push(b.P.join(","), "|", String(b.Q));
  a.push("T")
};
function Xc() {
}
Xc.prototype.l = function(a) {
  a.push("new StreamCreatedFrame()")
};
Xc.prototype.e = function(a) {
  return a instanceof Xc
};
Xc.prototype.r = S;
Xc.prototype.t = function(a) {
  a.push("C")
};
function Yc() {
}
Yc.prototype.l = function(a) {
  a.push("new YouCloseItFrame()")
};
Yc.prototype.e = function(a) {
  return a instanceof Yc
};
Yc.prototype.r = S;
Yc.prototype.t = function(a) {
  a.push("Y")
};
function X(a, b) {
  this.wa = a;
  this.ma = b
}
X.prototype.e = function(a) {
  return a instanceof X && this.wa == a.wa && this.ma == a.ma
};
X.prototype.l = function(a, b) {
  a.push("new ResetFrame(");
  C(this.wa, a, b);
  a.push(", ", String(this.ma), ")")
};
X.prototype.r = S;
X.prototype.t = function(a) {
  a.push(this.wa, "|", String(Number(this.ma)), "!")
};
var Zc = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function $c(a) {
  this.reason = a
}
$c.prototype.e = function(a) {
  return a instanceof $c && this.reason == a.reason
};
$c.prototype.l = function(a, b) {
  a.push("new TransportKillFrame(");
  C(this.reason, a, b);
  a.push(")")
};
$c.prototype.r = S;
$c.prototype.t = function(a) {
  a.push(this.reason, "K")
};
function ad(a) {
  a || g(new R("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(b == " ") {
    return new U(a.substr(0, a.length - 1))
  }else {
    if(b == "A") {
      return a = Vc(nc(a)), a == l && g(new R("bad sack")), new T(a)
    }else {
      if(b == "N") {
        return a = qc(nc(a)), a == l && g(new R("bad seqNum")), new W(a)
      }else {
        if(b == "T") {
          return a = Vc(nc(a)), a == l && g(new R("bad lastSackSeen")), new Wc(a)
        }else {
          if(b == "Y") {
            return a.length != 1 && g(new R("leading garbage")), new Yc
          }else {
            if(b == "^") {
              return new V(a.substr(0, a.length - 1))
            }else {
              if(b == "C") {
                return a.length != 1 && g(new R("leading garbage")), new Xc
              }else {
                if(b == "!") {
                  return b = a.substr(0, a.length - 3), (b.length > 255 || !/^([ -~]*)$/.test(b)) && g(new R("bad reasonString")), a = {"|0":!1, "|1":!0}[a.substr(a.length - 3, 2)], a == l && g(new R("bad applicationLevel")), new X(b, a)
                }else {
                  if(b == "K") {
                    return a = a.substr(0, a.length - 1), a = Zc[a], a == l && g(new R("unknown kill reason: " + a)), new $c(a)
                  }else {
                    g(new R("Invalid frame type " + b))
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
function bd(a, b, c, d) {
  this.contentWindow = a;
  this.Tb = b;
  this.Hb = c;
  this.Ub = d
}
bd.prototype.l = function(a, b) {
  a.push("<XDRFrame frameId=");
  C(this.Ub, a, b);
  a.push(", expandedUrl=");
  C(this.Tb, a, b);
  a.push(", streams=");
  C(this.Hb, a, b);
  a.push(">")
};
function cd() {
  this.frames = [];
  this.rb = new Ua
}
cd.prototype.a = Q("cw.net.XDRTracker");
cd.prototype.hc = function(a) {
  var b = this.rb.get(a);
  b || g(Error("Unknown frameId " + D(a)));
  this.rb.remove(b);
  var c = b[0], a = new bd((t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow || (lb ? (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + 
  a).contentDocument || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).parentWindow || (lb ? (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + 
  a) : "minerva-xdrframe-" + a).contentDocument || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  gc(c, a)
};
var dd = new cd;
p.__XHRTracker_xdrFrameLoaded = x(dd.hc, dd);
var ed;
ed = !1;
var Y = hb();
Y && (Y.indexOf("Firefox") != -1 || Y.indexOf("Camino") != -1 || Y.indexOf("iPhone") != -1 || Y.indexOf("iPod") != -1 || Y.indexOf("iPad") != -1 || Y.indexOf("Android") != -1 || Y.indexOf("Chrome") != -1 && (ed = !0));
var fd = ed;
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
Q("goog.net.xhrMonitor");
function gd(a, b, c) {
  this.G = b;
  this.ga = a;
  this.Ga = c
}
y(gd, H);
m = gd.prototype;
m.a = Q("cw.net.XHRMaster");
m.Db = -1;
m.Oa = function(a, b) {
  b != 1 && Jc(this.a, D(this.ga) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  hd(this.G);
  a: {
    var c = this.G;
    c.za = !0;
    try {
      for(var d = !1, f = [], e = 0, h = a.length;e < h;e++) {
        if(c.L) {
          c.a.info(c.f() + " returning from loop because we're disposed.");
          break a
        }
        if(d = id(c, a[e], f)) {
          break
        }
      }
      f.length && jd(c, f);
      c.za = !1;
      c.k.length && c.B();
      d && (P(c.a, c.f() + " closeSoon is true.  Frames were: " + D(a)), c.d())
    }finally {
      c.za = !1
    }
  }
};
m.Pa = function(a) {
  O(this.a, "ongotheaders_: " + D(a));
  var b = l;
  "Content-Length" in a && (b = qc(a["Content-Length"]));
  a = this.G;
  O(a.a, a.f() + " got Content-Length: " + b);
  a.z == kd && (b == l && (Kc(a.a, "Expected to receive a valid Content-Length, but did not."), b = 5E5), ld(a, 2E3 + b / 3072 * 1E3))
};
m.Qa = function(a) {
  a != 1 && O(this.a, this.G.f() + "'s XHR's readyState is " + a);
  this.Db = a;
  this.Db >= 2 && hd(this.G)
};
m.Na = function() {
  this.G.d()
};
m.i = function() {
  gd.F.i.call(this);
  delete Z.C[this.ga];
  this.Ga.__XHRSlave_dispose(this.ga);
  delete this.Ga
};
function md() {
  this.C = {}
}
y(md, H);
m = md.prototype;
m.a = Q("cw.net.XHRMasterTracker");
function nd(a, b, c) {
  var d = "_" + mc(), b = new gd(d, b, c);
  return a.C[d] = b
}
m.Oa = function(a, b, c) {
  var b = Na(b), d = this.C[a];
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
  md.F.i.call(this);
  for(var a = pa(this.C);a.length;) {
    a.pop().d()
  }
  delete this.C
};
var Z = new md;
p.__XHRMaster_onframes = x(Z.Oa, Z);
p.__XHRMaster_oncomplete = x(Z.Na, Z);
p.__XHRMaster_ongotheaders = x(Z.Pa, Z);
p.__XHRMaster_onreadystatechange = x(Z.Qa, Z);
var od = new V(";)]}"), pd = "disconnected_" + dc++;
function $(a, b, c, d) {
  this.n = a;
  this.Zb = b;
  this.H = c;
  this.dc = d;
  this.ka = new sc;
  this.ja = mc() + mc();
  this.I = new Ya;
  this.La = new $a;
  this.la = l;
  this.Nb = [];
  if(lb) {
    this.la = Xb(p, "load", this.$b, !1, this)
  }
}
y($, ec);
m = $.prototype;
m.a = Q("cw.net.Stream");
m.pb = new F(-1, []);
m.qb = new F(-1, []);
m.wb = 50;
m.vb = 1048576;
m.Wa = !1;
m.Ua = !1;
m.m = 1;
m.Jb = -1;
m.b = l;
m.j = l;
m.ha = l;
m.Xa = 0;
m.Ab = 0;
m.Fb = 0;
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
function qd(a) {
  var b = [-1];
  a.b && b.push(a.b.W);
  a.j && b.push(a.j.W);
  return Math.max.apply(Math.max, b)
}
function rd(a) {
  if(a.m != 1) {
    var b = a.I.o.w() != 0, c = ab(a.La), d = !c.e(a.qb) && !(a.b && c.e(a.b.V) || a.j && c.e(a.j.V)), f = qd(a);
    if((b = b && f < a.I.S) || d) {
      var e = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      if(a.b.ba) {
        P(a.a, "tryToSend_: writing " + e + " to primary");
        if(d && (d = a.b, c != d.V)) {
          !d.D && !d.k.length && sd(d), d.k.push(new T(c)), d.V = c
        }
        b && td(a.b, a.I, f + 1);
        a.b.B()
      }else {
        a.j == l ? a.Wa ? (P(a.a, "tryToSend_: creating secondary to send " + e), a.j = ud(a, !1), b && td(a.j, a.I, f + 1), a.j.B()) : (P(a.a, "tryToSend_: not creating a secondary because Stream might not exist on server"), a.Ua = !0) : P(a.a, "tryToSend_: need to send " + e + ", but can't right now")
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
    rd(this)
  }
};
function ud(a, b) {
  var c;
  g(Error("Don't support endpoint " + D(a.H)));
  a.Jb += 1;
  c = new vd(a.n, a, a.Jb, c, a.H, b);
  P(a.a, "Created: " + c.f());
  a.ka.add(c);
  return c
}
function wd(a, b, c) {
  var d = new xd(a.n, a, b, c);
  P(a.a, "Created: " + d.f() + ", delay=" + b + ", times=" + c);
  a.ka.add(d);
  return d
}
function yd(a, b) {
  a.ka.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  O(a.a, "Offline: " + b.f());
  b.va ? a.Xa += b.va : a.Xa = 0;
  a.Xa >= 1 && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.d());
  if(a.m > 3) {
    a.m == 4 && b.Mb ? (O(a.a, "Disposing because resettingTransport_ is done."), a.d()) : O(a.a, "Not creating a transport because Stream is in state " + a.m)
  }else {
    var c;
    var d;
    c = b instanceof xd;
    if(!c && b.Aa) {
      var f = lb ? fd ? [0, 1] : [9, 20] : [0, 0];
      c = f[0];
      d = f[1];
      P(a.a, "getDelayForNextTransport_: " + D({delay:c, times:d}))
    }else {
      d = b.bb();
      if(b == a.b) {
        if(d) {
          f = ++a.Ab
        }else {
          if(!c) {
            f = a.Ab = 0
          }
        }
      }else {
        if(d) {
          f = ++a.Fb
        }else {
          if(!c) {
            f = a.Fb = 0
          }
        }
      }
      if(c || !f) {
        d = c = 0, P(a.a, "getDelayForNextTransport_: " + D({count:f, delay:c, times:d}))
      }else {
        var e = 2E3 * Math.min(f, 3), h = Math.floor(Math.random() * 4E3) - 2E3, j = Math.max(0, b.Kb - b.Za);
        d = (c = Math.max(0, e + h - j)) ? 1 : 0;
        P(a.a, "getDelayForNextTransport_: " + D({count:f, base:e, variance:h, oldDuration:j, delay:c, times:d}))
      }
    }
    c = [c, d];
    f = c[0];
    c = c[1];
    if(b == a.b) {
      a.b = l, c ? a.b = wd(a, f, c) : (f = qd(a), a.b = ud(a, !0), td(a.b, a.I, f + 1)), a.b.B()
    }else {
      if(b == a.j) {
        a.j = l, c ? (a.j = wd(a, f, c), a.j.B()) : rd(a)
      }
    }
  }
}
m.reset = function(a) {
  this.m > 3 && g(Error("reset: Can't send reset in state " + this.m));
  this.m = 4;
  this.b && this.b.ba ? (this.a.info("reset: Sending ResetFrame over existing primary."), zd(this.b, a), this.b.B()) : (this.b && (O(this.a, "reset: Disposing primary before sending ResetFrame."), this.b.d()), this.j && (O(this.a, "reset: Disposing secondary before sending ResetFrame."), this.j.d()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.ha = ud(this, !1), zd(this.ha, a), this.ha.B())
};
function Ad(a, b, c, d) {
  var f;
  f = a.La;
  for(var e = a.wb, h = a.vb, j = [], n = !1, o = 0, u = c.length;o < u;o++) {
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
        var s = Xa(k);
        if(h != l && f.J + s > h) {
          n = !0;
          break
        }
        f.K.set(q, [k, s]);
        f.J += s
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
  d || rd(a);
  if(!(a.m == 4 || a.L) && f) {
    Jc(b.a, b.f() + "'s peer caused rwin overflow."), b.d()
  }
}
m.start = function() {
  this.m != 1 && g(Error("Stream.start: " + D(this) + " already started"));
  this.m = 2;
  this.m = 3;
  this.b = ud(this, !0);
  td(this.b, this.I, l);
  this.b.B()
};
m.i = function() {
  this.a.info(D(this) + " in disposeInternal.");
  this.m = 5;
  for(var a = this.ka.N(), b = 0;b < a.length;b++) {
    a[b].d()
  }
  for(a = 0;a < this.Nb.length;a++) {
    var b = this.Nb[a].Hb, c = Ka(b, this);
    c >= 0 && B.splice.call(b, c, 1)
  }
  if(lb && this.la) {
    Zb(this.la), this.la = l
  }
  this.dispatchEvent({type:pd});
  delete this.ka;
  delete this.b;
  delete this.j;
  delete this.ha;
  delete this.Zb;
  $.F.i.call(this)
};
var kd = 1, Bd = 2;
function vd(a, b, c, d, f, e) {
  this.n = a;
  this.p = b;
  this.aa = c;
  this.z = d;
  this.H = f;
  this.k = [];
  this.R = e;
  this.ba = !this.T();
  this.Z = this.z != kd;
  this.Qb = x(this.ec, this)
}
y(vd, H);
m = vd.prototype;
m.a = Q("cw.net.ClientTransport");
m.q = l;
m.Za = l;
m.Kb = l;
m.xa = l;
m.D = !1;
m.za = !1;
m.V = l;
m.Ja = 0;
m.W = -1;
m.Sa = -1;
m.Mb = !1;
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
  return this.z == kd || this.z == Bd
};
function jd(a, b) {
  Oa(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  Ad(a.p, a, b, !a.Z)
}
function id(a, b, c) {
  try {
    var d = ad(b);
    a.Ja += 1;
    O(a.a, a.f() + " RECV " + D(d));
    var f;
    a.Ja == 1 && !d.e(od) && a.T() ? (Kc(a.a, a.f() + " is closing soon because got bad preamble: " + D(d)), f = !0) : f = !1;
    if(f) {
      return!0
    }
    if(d instanceof U) {
      if(!/^([ -~]*)$/.test(d.$)) {
        return a.ca = !0
      }
      a.Sa += 1;
      c.push([a.Sa, d.$])
    }else {
      if(d instanceof T) {
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
          return Kc(a.a, a.f() + " is closing soon because got bad SackFrame"), a.ca = !0
        }
      }else {
        if(d instanceof W) {
          a.Sa = d.ia - 1
        }else {
          if(d instanceof Wc) {
            a.p.qb = d.da
          }else {
            if(d instanceof Yc) {
              return P(a.a, a.f() + " is closing soon because got YouCloseItFrame"), !0
            }else {
              if(d instanceof $c) {
                return a.ca = !0, d.reason == "stream_attach_failure" ? a.va += 1 : d.reason == "acked_unsent_strings" && (a.va += 0.5), P(a.a, a.f() + " is closing soon because got " + D(d)), !0
              }else {
                if(!(d instanceof V)) {
                  if(d instanceof Xc) {
                    var s = a.p, Ed = !a.Z;
                    P(s.a, "Stream is now confirmed to exist at server.");
                    s.Wa = !0;
                    if(s.Ua && !Ed) {
                      s.Ua = !1, rd(s)
                    }
                  }else {
                    if(c.length) {
                      jd(a, c);
                      if(!ea(c)) {
                        for(var Nb = c.length - 1;Nb >= 0;Nb--) {
                          delete c[Nb]
                        }
                      }
                      c.length = 0
                    }
                    if(d instanceof X) {
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
  }catch(Ic) {
    return Ic instanceof R || g(Ic), Kc(a.a, a.f() + " is closing soon because got InvalidFrame: " + D(b)), a.ca = !0
  }
  return!1
}
m.ec = function() {
  Kc(this.a, this.f() + " timed out due to lack of connection or no data being received.");
  this.d()
};
function Cd(a) {
  if(a.xa != l) {
    a.n.s.clearTimeout(a.xa), a.xa = l
  }
}
function ld(a, b) {
  Cd(a);
  b = Math.round(b);
  a.xa = a.n.s.setTimeout(a.Qb, b);
  O(a.a, a.f() + "'s receive timeout set to " + b + " ms.")
}
function hd(a) {
  a.z != kd && (a.z == 3 || a.z == Bd ? ld(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.z)))
}
function sd(a) {
  var b = new Tc;
  b.aa = a.aa;
  b.Bb = 2;
  b.nb = 2;
  if(!a.p.Wa) {
    b.Eb = !0
  }
  b.ja = a.p.ja;
  b.Ya = a.Z;
  if(b.Ya) {
    b.xb = 4096
  }
  b.ub = 3E5;
  b.tb = a.Z ? Math.floor(10) : 0;
  b.Lb = !1;
  if(a.R) {
    b.Ib = l, b.Ma = Math.floor((a.Z ? 358E4 : 25E3) / 1E3)
  }
  b.v = ab(a.p.La);
  b.ta = a.p.pb;
  a.k.push(b);
  a.V = b.v
}
m.B = function() {
  this.D && !this.ba && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.za) {
    P(this.a, this.f() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.D;
    this.D = !0;
    !a && !this.k.length && sd(this);
    for(a = 0;a < this.k.length;a++) {
      O(this.a, this.f() + " SEND " + D(this.k[a]))
    }
    if(this.T()) {
      for(var a = [], b = 0, c = this.k.length;b < c;b++) {
        this.k[b].t(a), a.push("\n")
      }
      this.k = [];
      a = a.join("");
      b = this.R ? this.H.rc : this.H.tc;
      this.q = nd(Z, this, this.R ? this.H.sc : this.H.uc);
      this.Za = this.n.s === fc ? ma() : this.n.s.getTime();
      c = this.q;
      c.Ga.__XHRSlave_makeRequest(c.ga, b, "POST", a);
      ld(this, 3E3 * (1.5 + (b.indexOf("https://") == 0 ? 3 : 1)) + 4E3 + (this.Z ? 0 : this.R ? 25E3 : 0))
    }else {
      if(this.z == 3) {
        a = [];
        b = 0;
        for(c = this.k.length;b < c;b++) {
          a.push(this.k[b].r())
        }
        this.k = [];
        this.q ? Oc(this.q, a) : (b = this.H, this.q = new Nc(this), this.q.Va = nd(b.wc, this.q), this.Za = this.n.s === fc ? ma() : this.n.s.getTime(), Pc(this.q, b.host, b.port), this.q.L || (Oc(this.q, a), this.q.L || ld(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.z))
      }
    }
  }
};
function td(a, b, c) {
  !a.D && !a.k.length && sd(a);
  for(var d = Math.max(c, a.W + 1), f = Za(b), c = [], e = 0;e < f.length;e++) {
    var h = f[e];
    (d == l || h >= d) && c.push([h, b.o.c[h][0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    e = c[b], f = e[0], e = e[1], (a.W == -1 || a.W + 1 != f) && a.k.push(new W(f)), a.k.push(new U(e)), a.W = f
  }
}
m.i = function() {
  this.a.info(this.f() + " in disposeInternal.");
  vd.F.i.call(this);
  this.Kb = this.n.s === fc ? ma() : this.n.s.getTime();
  this.k = [];
  Cd(this);
  this.q && this.q.d();
  var a = this.p;
  this.p = l;
  yd(a, this)
};
function zd(a, b) {
  !a.D && !a.k.length && sd(a);
  a.k.push(new X(b, !0));
  a.Mb = !0
}
function xd(a, b, c, d) {
  this.n = a;
  this.p = b;
  this.gb = c;
  this.eb = d
}
y(xd, H);
m = xd.prototype;
m.D = !1;
m.ba = !1;
m.pa = l;
m.V = l;
m.a = Q("cw.net.DoNothingTransport");
function Dd(a) {
  a.pa = a.n.s.setTimeout(function() {
    a.pa = l;
    a.eb--;
    a.eb ? Dd(a) : a.d()
  }, a.gb)
}
m.B = function() {
  this.D && !this.ba && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.D = !0;
  Dd(this)
};
m.l = function(a) {
  a.push("<DoNothingTransport delay=", String(this.gb), ">")
};
m.T = aa(!1);
m.f = aa("Wast. T");
m.bb = aa(!1);
m.i = function() {
  this.a.info(this.f() + " in disposeInternal.");
  xd.F.i.call(this);
  this.pa != l && this.n.s.clearTimeout(this.pa);
  var a = this.p;
  this.p = l;
  yd(a, this)
};
ba("Minerva.Client.Stream", $);
$.prototype.start = $.prototype.start;
$.prototype.sendStrings = $.prototype.ac;
$.prototype.reset = $.prototype.reset;
$.prototype.maxUndeliveredStrings = $.prototype.wb;
$.prototype.maxUndeliveredBytes = $.prototype.vb;
ba("Minerva.repr", D);
})();
