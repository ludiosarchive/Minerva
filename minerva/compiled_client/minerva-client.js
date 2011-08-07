(function(){function g(a) {
  throw a;
}
var i = void 0, l = null;
function aa(a) {
  return function() {
    return a
  }
}
var m, q = this;
function ba(a, b) {
  var c = a.split("."), d = q;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && b !== i ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
function ca(a) {
  for(var a = a.split("."), b = q, c;c = a.shift();) {
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
  var b = r(a);
  return b == "array" || b == "object" && typeof a.length == "number"
}
function fa(a) {
  return ga(a) && typeof a.getFullYear == "function"
}
function t(a) {
  return typeof a == "string"
}
function v(a) {
  return r(a) == "function"
}
function ga(a) {
  a = r(a);
  return a == "object" || a == "array" || a == "function"
}
function ha(a) {
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
function w(a, b, c) {
  w = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? ka : la;
  return w.apply(l, arguments)
}
var ma = Date.now || function() {
  return+new Date
};
function x(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.I = b.prototype;
  a.prototype = new c
}
;function na(a) {
  return v(a) || typeof a == "object" && v(a.call) && v(a.apply)
}
;function oa(a) {
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
function ra() {
}
function sa(a) {
  var b = [];
  ta(new ra, a, b);
  return b.join("")
}
function ta(a, b, c) {
  switch(typeof b) {
    case "string":
      ua(b, c);
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
          c.push(e), ta(a, b[f], c), e = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(e in b) {
        Object.prototype.hasOwnProperty.call(b, e) && (f = b[e], typeof f != "function" && (c.push(d), ua(e, c), c.push(":"), ta(a, f, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      g(Error("Unknown type: " + typeof b))
  }
}
var va = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"}, wa = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function ua(a, b) {
  b.push('"', a.replace(wa, function(a) {
    if(a in va) {
      return va[a]
    }
    var b = a.charCodeAt(0), e = "\\u";
    b < 16 ? e += "000" : b < 256 ? e += "00" : b < 4096 && (e += "0");
    return va[a] = e + b.toString(16)
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
function xa(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
}
function ya(a) {
  if(!za.test(a)) {
    return a
  }
  a.indexOf("&") != -1 && (a = a.replace(Aa, "&amp;"));
  a.indexOf("<") != -1 && (a = a.replace(Ba, "&lt;"));
  a.indexOf(">") != -1 && (a = a.replace(Ca, "&gt;"));
  a.indexOf('"') != -1 && (a = a.replace(Da, "&quot;"));
  return a
}
var Aa = /&/g, Ba = /</g, Ca = />/g, Da = /\"/g, za = /[&<>\"]/;
function Ea(a, b) {
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;c == 0 && h < f;h++) {
    var j = d[h] || "", n = e[h] || "", o = RegExp("(\\d*)(\\D*)", "g"), u = RegExp("(\\d*)(\\D*)", "g");
    do {
      var k = o.exec(j) || ["", "", ""], p = u.exec(n) || ["", "", ""];
      if(k[0].length == 0 && p[0].length == 0) {
        break
      }
      c = Fa(k[1].length == 0 ? 0 : parseInt(k[1], 10), p[1].length == 0 ? 0 : parseInt(p[1], 10)) || Fa(k[2].length == 0, p[2].length == 0) || Fa(k[2], p[2])
    }while(c == 0)
  }
  return c
}
function Fa(a, b) {
  if(a < b) {
    return-1
  }else {
    if(a > b) {
      return 1
    }
  }
  return 0
}
;function Ga(a, b) {
  b.unshift(a);
  y.call(this, xa.apply(l, b));
  b.shift();
  this.qc = a
}
x(Ga, y);
Ga.prototype.name = "AssertionError";
function Ha(a, b) {
  g(new Ga("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
}
;var z = Array.prototype, Ia = z.indexOf ? function(a, b, c) {
  return z.indexOf.call(a, b, c)
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
}, Ja = z.some ? function(a, b, c) {
  return z.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = t(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
}, Ka = z.every ? function(a, b, c) {
  return z.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = t(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
function La(a) {
  return z.concat.apply(z, arguments)
}
function Ma(a, b) {
  z.sort.call(a, b || Na)
}
function Na(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
;function Oa(a, b, c) {
  var d = Ia(c, a);
  if(d != -1) {
    b.push("#CYCLETO:" + (c.length - d) + "#")
  }else {
    c.push(a);
    d = r(a);
    if(d == "boolean" || d == "number" || d == "null" || d == "undefined") {
      b.push(String(a))
    }else {
      if(d == "string") {
        ua(a, b)
      }else {
        if(na(a.l)) {
          a.l(b, c)
        }else {
          if(na(a.Nb)) {
            b.push("<cw.eq.Wildcard>")
          }else {
            if(a instanceof RegExp) {
              b.push(a.toString())
            }else {
              if(d == "array") {
                d = a.length;
                b.push("[");
                for(var e = "", f = 0;f < d;f++) {
                  b.push(e), Oa(a[f], b, c), e = ", "
                }
                b.push("]")
              }else {
                if(d == "object") {
                  if(fa(a) && typeof a.valueOf == "function") {
                    b.push("new Date(", String(a.valueOf()), ")")
                  }else {
                    for(var d = pa(a).concat(qa), e = {}, h = f = 0;h < d.length;) {
                      var j = d[h++], n = ga(j) ? "o" + ha(j) : (typeof j).charAt(0) + j;
                      Object.prototype.hasOwnProperty.call(e, n) || (e[n] = !0, d[f++] = j)
                    }
                    d.length = f;
                    b.push("{");
                    e = "";
                    for(h = 0;h < d.length;h++) {
                      f = d[h], Object.prototype.hasOwnProperty.call(a, f) && (j = a[f], b.push(e), ua(f, b), b.push(": "), Oa(j, b, c), e = ", ")
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
  Oa(a, b, c)
}
function B(a, b) {
  var c = [];
  A(a, c, b);
  return c.join("")
}
;function Pa(a) {
  if(typeof a.v == "function") {
    a = a.v()
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
function Qa(a) {
  if(typeof a.M == "function") {
    return a.M()
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
function Ra(a, b) {
  if(typeof a.every == "function") {
    return a.every(b, i)
  }
  if(ea(a) || t(a)) {
    return Ka(a, b, i)
  }
  var c;
  if(typeof a.ma == "function") {
    c = a.ma()
  }else {
    if(typeof a.M != "function") {
      if(ea(a) || t(a)) {
        c = [];
        for(var d = a.length, e = 0;e < d;e++) {
          c.push(e)
        }
      }else {
        c = pa(a)
      }
    }else {
      c = i
    }
  }
  for(var d = Qa(a), e = d.length, f = 0;f < e;f++) {
    if(!b.call(i, d[f], c && c[f], a)) {
      return!1
    }
  }
  return!0
}
;function Sa(a, b) {
  this.c = {};
  this.g = [];
  var c = arguments.length;
  if(c > 1) {
    c % 2 && g(Error("Uneven number of arguments"));
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.za(a)
  }
}
m = Sa.prototype;
m.j = 0;
m.Ya = 0;
m.v = function() {
  return this.j
};
m.M = function() {
  Ta(this);
  for(var a = [], b = 0;b < this.g.length;b++) {
    a.push(this.c[this.g[b]])
  }
  return a
};
m.ma = function() {
  Ta(this);
  return this.g.concat()
};
m.$a = function(a) {
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
  if(this.j != a.v()) {
    return!1
  }
  var c = b || Ua;
  Ta(this);
  for(var d, e = 0;d = this.g[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
function Ua(a, b) {
  return a === b
}
m.qa = function() {
  return this.j == 0
};
m.clear = function() {
  this.c = {};
  this.Ya = this.j = this.g.length = 0
};
m.remove = function(a) {
  return C(this.c, a) ? (delete this.c[a], this.j--, this.Ya++, this.g.length > 2 * this.j && Ta(this), !0) : !1
};
function Ta(a) {
  if(a.j != a.g.length) {
    for(var b = 0, c = 0;b < a.g.length;) {
      var d = a.g[b];
      C(a.c, d) && (a.g[c++] = d);
      b++
    }
    a.g.length = c
  }
  if(a.j != a.g.length) {
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
  C(this.c, a) || (this.j++, this.g.push(a), this.Ya++);
  this.c[a] = b
};
m.za = function(a) {
  var b;
  a instanceof Sa ? (b = a.ma(), a = a.M()) : (b = pa(a), a = oa(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
function C(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function Va(a) {
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
  this.P = a;
  this.O = b
}
D.prototype.e = function(a) {
  return a instanceof D && this.P == a.P && this.O.join(",") == a.O
};
D.prototype.l = function(a, b) {
  a.push("new SACK(", String(this.P), ", ");
  A(this.O, a, b);
  a.push(")")
};
function Wa() {
  this.o = new Sa
}
m = Wa.prototype;
m.R = -1;
m.H = 0;
m.append = function(a) {
  var b = Va(a);
  this.o.set(this.R + 1, [a, b]);
  this.R += 1;
  this.H += b
};
m.extend = function(a) {
  for(var b = 0;b < a.length;b++) {
    this.append(a[b])
  }
};
m.l = function(a) {
  a.push("<Queue with ", String(this.o.v()), " item(s), counter=#", String(this.R), ", size=", String(this.H), ">")
};
function Xa(a) {
  Ta(a.o);
  Ma(a.o.g);
  return a.o.g
}
function Ya() {
  this.J = new Sa
}
Ya.prototype.T = -1;
Ya.prototype.H = 0;
function Za(a) {
  var b = a.J.ma();
  Ma(b);
  return new D(a.T, b)
}
var $a = {};
function ab() {
  return!0
}
;var bb, cb, db, eb;
function fb() {
  return q.navigator ? q.navigator.userAgent : l
}
eb = db = cb = bb = !1;
var gb;
if(gb = fb()) {
  var hb = q.navigator;
  bb = gb.indexOf("Opera") == 0;
  cb = !bb && gb.indexOf("MSIE") != -1;
  db = !bb && gb.indexOf("WebKit") != -1;
  eb = !bb && !db && hb.product == "Gecko"
}
var E = cb, ib = eb, jb = db, kb = q.navigator, lb = (kb && kb.platform || "").indexOf("Mac") != -1, mb;
a: {
  var nb = "", ob;
  if(bb && q.opera) {
    var pb = q.opera.version, nb = typeof pb == "function" ? pb() : pb
  }else {
    if(ib ? ob = /rv\:([^\);]+)(\)|;)/ : E ? ob = /MSIE\s+([^\);]+)(\)|;)/ : jb && (ob = /WebKit\/(\S+)/), ob) {
      var qb = ob.exec(fb()), nb = qb ? qb[1] : ""
    }
  }
  if(E) {
    var rb, sb = q.document;
    rb = sb ? sb.documentMode : i;
    if(rb > parseFloat(nb)) {
      mb = String(rb);
      break a
    }
  }
  mb = nb
}
var tb = {};
function ub(a) {
  tb[a] || (tb[a] = Ea(mb, a) >= 0)
}
var vb = {};
function wb() {
  return vb[9] || (vb[9] = E && document.documentMode && document.documentMode >= 9)
}
;var xb;
!E || wb();
E && ub("8");
function F() {
}
F.prototype.K = !1;
F.prototype.d = function() {
  if(!this.K) {
    this.K = !0, this.k()
  }
};
F.prototype.k = function() {
  this.Rb && yb.apply(l, this.Rb)
};
function yb(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    ea(d) ? yb.apply(l, d) : d && typeof d.d == "function" && d.d()
  }
}
;function zb(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
x(zb, F);
zb.prototype.k = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
zb.prototype.Pa = !1;
zb.prototype.$b = !0;
var Ab = new Function("a", "return a");
function Bb(a, b) {
  a && this.pa(a, b)
}
x(Bb, zb);
m = Bb.prototype;
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
m.Xb = !1;
m.fb = l;
m.pa = function(a, b) {
  var c = this.type = a.type;
  zb.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(ib) {
      var e;
      a: {
        try {
          Ab(d.nodeName);
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
  this.Xb = lb ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.fb = a;
  delete this.$b;
  delete this.Pa
};
m.k = function() {
  Bb.I.k.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.fb = l
};
function Cb() {
}
var Db = 0;
m = Cb.prototype;
m.key = 0;
m.X = !1;
m.Ba = !1;
m.pa = function(a, b, c, d, e, f) {
  v(a) ? this.lb = !0 : a && a.handleEvent && v(a.handleEvent) ? this.lb = !1 : g(Error("Invalid listener argument"));
  this.sa = a;
  this.Ab = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.ib = f;
  this.Ba = !1;
  this.key = ++Db;
  this.X = !1
};
m.handleEvent = function(a) {
  return this.lb ? this.sa.call(this.ib || this.src, a) : this.sa.handleEvent.call(this.sa, a)
};
var Eb, Fb = (Eb = "ScriptEngine" in q && q.ScriptEngine() == "JScript") ? q.ScriptEngineMajorVersion() + "." + q.ScriptEngineMinorVersion() + "." + q.ScriptEngineBuildVersion() : "0";
function G(a, b) {
  this.pb = b;
  this.L = [];
  a > this.pb && g(Error("[goog.structs.SimplePool] Initial cannot be greater than max"));
  for(var c = 0;c < a;c++) {
    this.L.push(this.z ? this.z() : {})
  }
}
x(G, F);
G.prototype.z = l;
G.prototype.cb = l;
G.prototype.getObject = function() {
  return this.L.length ? this.L.pop() : this.z ? this.z() : {}
};
function Hb(a, b) {
  a.L.length < a.pb ? a.L.push(b) : Ib(a, b)
}
function Ib(a, b) {
  if(a.cb) {
    a.cb(b)
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
G.prototype.k = function() {
  G.I.k.call(this);
  for(var a = this.L;a.length;) {
    Ib(this, a.pop())
  }
  delete this.L
};
var Jb, Kb, Lb, Mb, Nb, Ob, Pb, Qb, Rb, Sb, Tb;
(function() {
  function a() {
    return{j:0, W:0}
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
    return new Cb
  }
  function e() {
    return new Bb
  }
  var f = Eb && !(Ea(Fb, "5.7") >= 0), h;
  Ob = function(a) {
    h = a
  };
  if(f) {
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
    Qb = function() {
      return u.getObject()
    };
    Rb = function(a) {
      Hb(u, a)
    };
    Sb = function() {
      return k.getObject()
    };
    Tb = function(a) {
      Hb(k, a)
    };
    var j = new G(0, 600);
    j.z = a;
    var n = new G(0, 600);
    n.z = b;
    var o = new G(0, 600);
    o.z = c;
    var u = new G(0, 600);
    u.z = d;
    var k = new G(0, 600);
    k.z = e
  }else {
    Jb = a, Kb = da, Lb = b, Mb = da, Nb = c, Pb = da, Qb = d, Rb = da, Sb = e, Tb = da
  }
})();
var H = {}, I = {}, Ub = {}, Vb = {};
function Wb(a, b, c, d, e) {
  if(b) {
    if(r(b) == "array") {
      for(var f = 0;f < b.length;f++) {
        Wb(a, b[f], c, d, e)
      }
      return l
    }else {
      var d = !!d, h = I;
      b in h || (h[b] = Jb());
      h = h[b];
      d in h || (h[d] = Jb(), h.j++);
      var h = h[d], j = ha(a), n;
      h.W++;
      if(h[j]) {
        n = h[j];
        for(f = 0;f < n.length;f++) {
          if(h = n[f], h.sa == c && h.ib == e) {
            if(h.X) {
              break
            }
            return n[f].key
          }
        }
      }else {
        n = h[j] = Lb(), h.j++
      }
      f = Nb();
      f.src = a;
      h = Qb();
      h.pa(c, f, a, b, d, e);
      c = h.key;
      f.key = c;
      n.push(h);
      H[c] = h;
      Ub[j] || (Ub[j] = Lb());
      Ub[j].push(h);
      a.addEventListener ? (a == q || !a.Qb) && a.addEventListener(b, f, d) : a.attachEvent(b in Vb ? Vb[b] : Vb[b] = "on" + b, f);
      return c
    }
  }else {
    g(Error("Invalid event type"))
  }
}
function Xb(a, b, c, d, e) {
  if(r(b) == "array") {
    for(var f = 0;f < b.length;f++) {
      Xb(a, b[f], c, d, e)
    }
    return l
  }
  a = Wb(a, b, c, d, e);
  H[a].Ba = !0;
  return a
}
function Yb(a) {
  if(H[a]) {
    var b = H[a];
    if(!b.X) {
      var c = b.src, d = b.type, e = b.Ab, f = b.capture;
      c.removeEventListener ? (c == q || !c.Qb) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(d in Vb ? Vb[d] : Vb[d] = "on" + d, e);
      c = ha(c);
      e = I[d][f][c];
      if(Ub[c]) {
        var h = Ub[c], j = Ia(h, b);
        j >= 0 && z.splice.call(h, j, 1);
        h.length == 0 && delete Ub[c]
      }
      b.X = !0;
      e.vb = !0;
      Zb(d, f, c, e);
      delete H[a]
    }
  }
}
function Zb(a, b, c, d) {
  if(!d.ta && d.vb) {
    for(var e = 0, f = 0;e < d.length;e++) {
      if(d[e].X) {
        var h = d[e].Ab;
        h.src = l;
        Pb(h);
        Rb(d[e])
      }else {
        e != f && (d[f] = d[e]), f++
      }
    }
    d.length = f;
    d.vb = !1;
    f == 0 && (Mb(d), delete I[a][b][c], I[a][b].j--, I[a][b].j == 0 && (Kb(I[a][b]), delete I[a][b], I[a].j--), I[a].j == 0 && (Kb(I[a]), delete I[a]))
  }
}
function $b(a, b, c, d, e) {
  var f = 1, b = ha(b);
  if(a[b]) {
    a.W--;
    a = a[b];
    a.ta ? a.ta++ : a.ta = 1;
    try {
      for(var h = a.length, j = 0;j < h;j++) {
        var n = a[j];
        n && !n.X && (f &= ac(n, e) !== !1)
      }
    }finally {
      a.ta--, Zb(c, d, b, a)
    }
  }
  return Boolean(f)
}
function ac(a, b) {
  var c = a.handleEvent(b);
  a.Ba && Yb(a.key);
  return c
}
Ob(function(a, b) {
  if(!H[a]) {
    return!0
  }
  var c = H[a], d = c.type, e = I;
  if(!(d in e)) {
    return!0
  }
  var e = e[d], f, h;
  xb === i && (xb = E && !q.addEventListener);
  if(xb) {
    f = b || ca("window.event");
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
          }catch(u) {
            o = !0
          }
        }
        if(o || f.returnValue == i) {
          f.returnValue = !0
        }
      }
    }
    o = Sb();
    o.pa(f, this);
    f = !0;
    try {
      if(j) {
        for(var k = Lb(), p = o.currentTarget;p;p = p.parentNode) {
          k.push(p)
        }
        h = e[!0];
        h.W = h.j;
        for(var s = k.length - 1;!o.Pa && s >= 0 && h.W;s--) {
          o.currentTarget = k[s], f &= $b(h, k[s], d, !0, o)
        }
        if(n) {
          h = e[!1];
          h.W = h.j;
          for(s = 0;!o.Pa && s < k.length && h.W;s++) {
            o.currentTarget = k[s], f &= $b(h, k[s], d, !1, o)
          }
        }
      }else {
        f = ac(c, o)
      }
    }finally {
      if(k) {
        k.length = 0, Mb(k)
      }
      o.d();
      Tb(o)
    }
    return f
  }
  d = new Bb(b, this);
  try {
    f = ac(c, d)
  }finally {
    d.d()
  }
  return f
});
var bc = 0;
var cc = q.window;
bc++;
bc++;
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function dc(a, b) {
  if(a.Ga) {
    a.cc || g(new ec(a)), a.cc = !1
  }
  a.Ga = !0;
  a.Qa = b;
  a.oa = !1;
  fc(a)
}
function gc(a, b, c) {
  a.Ca.push([b, c, i]);
  a.Ga && fc(a)
}
function hc(a) {
  return Ja(a.Ca, function(a) {
    return v(a[1])
  })
}
function fc(a) {
  a.Xa && a.Ga && hc(a) && (q.clearTimeout(a.Xa), delete a.Xa);
  a.N && (a.N.jc--, delete a.N);
  for(var b = a.Qa, c = !1, d = !1;a.Ca.length && a.xb == 0;) {
    var e = a.Ca.shift(), f = e[0], h = e[1], e = e[2];
    if(f = a.oa ? h : f) {
      try {
        var j = f.call(e || a.lc, b);
        if(j !== i) {
          a.oa = a.oa && (j == b || j instanceof Error), a.Qa = b = j
        }
      }catch(n) {
        b = n, a.oa = !0, hc(a) || (c = !0)
      }
    }
  }
  a.Qa = b;
  if(d && a.xb) {
    gc(b, w(a.Pb, a, !0), w(a.Pb, a, !1)), b.kc = !0
  }
  if(c) {
    a.Xa = q.setTimeout(function() {
      g(b)
    }, 0)
  }
}
function ec(a) {
  y.call(this);
  this.mc = a
}
x(ec, y);
ec.prototype.message = "Already called";
function ic(a) {
  this.s = a;
  this.Fa = [];
  this.eb = [];
  this.ic = w(this.gc, this)
}
ic.prototype.fc = l;
ic.prototype.gc = function() {
  this.fc = l;
  var a = this.Fa;
  this.Fa = [];
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
  if(this.Fa.length == 0) {
    a = this.eb;
    this.eb = [];
    for(b = 0;b < a.length;b++) {
      dc(a[b], l)
    }
  }
};
new ic(q.window);
function jc() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ ma()).toString(36)
}
function kc(a) {
  return a.substr(0, a.length - 1)
}
var lc = /^(0|[1-9]\d*)$/, mc = /^(0|\-?[1-9]\d*)$/;
function nc(a) {
  var b = oc;
  return lc.test(a) && (a = parseInt(a, 10), a <= b) ? a : l
}
;function pc(a) {
  this.c = new Sa;
  a && this.za(a)
}
function qc(a) {
  var b = typeof a;
  return b == "object" && a || b == "function" ? "o" + ha(a) : b.substr(0, 1) + a
}
m = pc.prototype;
m.v = function() {
  return this.c.v()
};
m.add = function(a) {
  this.c.set(qc(a), a)
};
m.za = function(a) {
  for(var a = Qa(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
m.remove = function(a) {
  return this.c.remove(qc(a))
};
m.clear = function() {
  this.c.clear()
};
m.qa = function() {
  return this.c.qa()
};
m.contains = function(a) {
  a = qc(a);
  return C(this.c.c, a)
};
m.M = function() {
  return this.c.M()
};
m.e = function(a) {
  return this.v() == Pa(a) && rc(this, a)
};
function rc(a, b) {
  var c = Pa(b);
  if(a.v() > c) {
    return!1
  }
  !(b instanceof pc) && c > 5 && (b = new pc(b));
  return Ra(a, function(a) {
    if(typeof b.contains == "function") {
      a = b.contains(a)
    }else {
      if(typeof b.$a == "function") {
        a = b.$a(a)
      }else {
        if(ea(b) || t(b)) {
          a = Ia(b, a) >= 0
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
;function sc(a) {
  return tc(a || arguments.callee.caller, [])
}
function tc(a, b) {
  var c = [];
  if(Ia(b, a) >= 0) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < 50) {
      c.push(uc(a) + "(");
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
            f = (f = uc(f)) ? f : "[fn]";
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
        c.push(tc(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function uc(a) {
  if(vc[a]) {
    return vc[a]
  }
  a = String(a);
  if(!vc[a]) {
    var b = /function ([^\(]+)/.exec(a);
    vc[a] = b ? b[1] : "[Anonymous]"
  }
  return vc[a]
}
var vc = {};
function wc(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
wc.prototype.bc = 0;
wc.prototype.hb = l;
wc.prototype.gb = l;
var xc = 0;
wc.prototype.reset = function(a, b, c, d, e) {
  this.bc = typeof e == "number" ? e : xc++;
  this.vc = d || ma();
  this.da = a;
  this.Vb = b;
  this.pc = c;
  delete this.hb;
  delete this.gb
};
wc.prototype.Eb = function(a) {
  this.da = a
};
function J(a) {
  this.Wb = a
}
J.prototype.N = l;
J.prototype.da = l;
J.prototype.Da = l;
J.prototype.jb = l;
function K(a, b) {
  this.name = a;
  this.value = b
}
K.prototype.toString = function() {
  return this.name
};
var yc = new K("SEVERE", 1E3), zc = new K("WARNING", 900), Ac = new K("INFO", 800), Bc = new K("CONFIG", 700), Cc = new K("FINE", 500), Dc = new K("FINEST", 300);
m = J.prototype;
m.getParent = function() {
  return this.N
};
m.Eb = function(a) {
  this.da = a
};
function Fc(a) {
  if(a.da) {
    return a.da
  }
  if(a.N) {
    return Fc(a.N)
  }
  Ha("Root logger has no level set.");
  return l
}
m.log = function(a, b, c) {
  if(a.value >= Fc(this).value) {
    a = this.Ub(a, b, c);
    b = "log:" + a.Vb;
    q.console && (q.console.timeStamp ? q.console.timeStamp(b) : q.console.markTimeline && q.console.markTimeline(b));
    q.msWriteProfilerMark && q.msWriteProfilerMark(b);
    for(b = this;b;) {
      var c = b, d = a;
      if(c.jb) {
        for(var e = 0, f = i;f = c.jb[e];e++) {
          f(d)
        }
      }
      b = b.getParent()
    }
  }
};
m.Ub = function(a, b, c) {
  var d = new wc(a, String(b), this.Wb);
  if(c) {
    d.hb = c;
    var e;
    var f = arguments.callee.caller;
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
        }catch(p) {
          o = "Not available", u = !0
        }
        h = u || !c.lineNumber || !c.fileName || !c.stack ? {message:c.message, name:c.name, lineNumber:n, fileName:o, stack:c.stack || "Not available"} : c
      }
      e = "Message: " + ya(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + ya(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + ya(sc(f) + "-> ")
    }catch(s) {
      e = "Exception trying to expose exception! You win, we lose. " + s
    }
    d.gb = e
  }
  return d
};
function Gc(a, b) {
  a.log(yc, b, i)
}
function Hc(a, b) {
  a.log(zc, b, i)
}
m.info = function(a, b) {
  this.log(Ac, a, b)
};
function L(a, b) {
  a.log(Cc, b, i)
}
function M(a, b) {
  a.log(Dc, b, i)
}
var Ic = {}, Jc = l;
function N(a) {
  Jc || (Jc = new J(""), Ic[""] = Jc, Jc.Eb(Bc));
  var b;
  if(!(b = Ic[a])) {
    b = new J(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = N(a.substr(0, c));
    if(!c.Da) {
      c.Da = {}
    }
    c.Da[d] = b;
    b.N = c;
    Ic[a] = b
  }
  return b
}
;function Kc(a) {
  this.D = a;
  this.Aa = []
}
x(Kc, F);
Kc.prototype.a = N("cw.net.FlashSocketConduit");
function Lc(a, b) {
  a.Aa ? (M(a.a, "writeFrames: Not connected, can't write " + b.length + " frame(s) yet."), a.Aa.push.apply(a.Aa, b)) : (M(a.a, "writeFrames: Writing " + b.length + " frame(s)."), Lc(a.Sa, b))
}
function Mc(a, b, c) {
  Mc(a.Sa, b, c)
}
Kc.prototype.k = function() {
  this.a.info("in disposeInternal.");
  Kc.I.k.call(this);
  this.Sa.d();
  delete this.D
};
var oc = Math.pow(2, 53);
var Nc = {Nb:aa("<cw.eq.Wildcard>")};
function Oc(a) {
  return a == "boolean" || a == "number" || a == "null" || a == "undefined" || a == "string"
}
function Pc(a, b, c) {
  var d = r(a), e = r(b);
  if(a == Nc || b == Nc) {
    return!0
  }else {
    if(a != l && typeof a.e == "function") {
      return c && c.push("running custom equals function on left object"), a.e(b, c)
    }else {
      if(b != l && typeof b.e == "function") {
        return c && c.push("running custom equals function on right object"), b.e(a, c)
      }else {
        if(Oc(d) || Oc(e)) {
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
                      if(!Pc(a[d], b[d], c)) {
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
                if(a.Mb == ab && b.Mb == ab) {
                  a: {
                    c && c.push("descending into object");
                    for(var f in a) {
                      if(!(f in b)) {
                        c && c.push("property " + f + " missing on right object");
                        a = !1;
                        break a
                      }
                      if(!Pc(a[f], b[f], c)) {
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
function Qc() {
}
Qc.prototype.e = function(a, b) {
  return!(a instanceof Qc) ? !1 : Pc(Rc(this), Rc(a), b)
};
Qc.prototype.l = function(a, b) {
  a.push("<HelloFrame properties=");
  A(Rc(this), a, b);
  a.push(">")
};
function Rc(a) {
  return[a.$, a.zb, a.kb, a.Cb, a.ha, a.Va, a.ub, a.rb, a.Ja, a.qb, a.Jb, a.Gb, a.u, a.ra]
}
Qc.prototype.r = P;
Qc.prototype.t = function(a) {
  var b = {};
  b.tnum = this.$;
  b.ver = this.zb;
  b.format = this.kb;
  b["new"] = this.Cb;
  b.id = this.ha;
  b.ming = this.Va;
  b.pad = this.ub;
  b.maxb = this.rb;
  if(this.Ja !== i) {
    b.maxt = this.Ja
  }
  b.maxia = this.qb;
  b.tcpack = this.Jb;
  b.eeds = this.Gb;
  b.sack = this.u instanceof D ? kc((new Q(this.u)).r()) : this.u;
  b.seenack = this.ra instanceof D ? kc((new Q(this.ra)).r()) : this.ra;
  for(var c in b) {
    b[c] === i && delete b[c]
  }
  a.push(sa(b), "H")
};
function R(a) {
  this.Z = a
}
R.prototype.e = function(a) {
  return a instanceof R && this.Z == a.Z
};
R.prototype.l = function(a, b) {
  a.push("new StringFrame(");
  A(this.Z, a, b);
  a.push(")")
};
R.prototype.r = P;
R.prototype.t = function(a) {
  a.push(this.Z, " ")
};
function S(a) {
  this.la = a
}
S.prototype.e = function(a) {
  return a instanceof S && this.la == a.la
};
S.prototype.l = function(a, b) {
  a.push("new CommentFrame(");
  A(this.la, a, b);
  a.push(")")
};
S.prototype.r = P;
S.prototype.t = function(a) {
  a.push(this.la, "^")
};
function T(a) {
  this.ga = a
}
T.prototype.e = function(a) {
  return a instanceof T && this.ga == a.ga
};
T.prototype.l = function(a) {
  a.push("new SeqNumFrame(", String(this.ga), ")")
};
T.prototype.r = P;
T.prototype.t = function(a) {
  a.push(String(this.ga), "N")
};
function Sc(a) {
  var b = a.split("|");
  if(b.length != 2) {
    return l
  }
  a: {
    var c = b[1], a = oc;
    if(mc.test(c) && (c = parseInt(c, 10), c >= -1 && c <= a)) {
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
      var f = nc(b[d]);
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
Q.prototype.l = function(a, b) {
  a.push("new SackFrame(");
  A(this.u, a, b);
  a.push(")")
};
Q.prototype.r = P;
Q.prototype.t = function(a) {
  var b = this.u;
  a.push(b.O.join(","), "|", String(b.P));
  a.push("A")
};
function U(a) {
  this.ca = a
}
U.prototype.e = function(a, b) {
  return a instanceof U && this.ca.e(a.ca, b)
};
U.prototype.l = function(a, b) {
  a.push("new StreamStatusFrame(");
  A(this.ca, a, b);
  a.push(")")
};
U.prototype.r = P;
U.prototype.t = function(a) {
  var b = this.ca;
  a.push(b.O.join(","), "|", String(b.P));
  a.push("T")
};
function V() {
}
V.prototype.l = function(a) {
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
W.prototype.l = function(a) {
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
  this.va = a;
  this.ka = b
}
X.prototype.e = function(a) {
  return a instanceof X && this.va == a.va && this.ka == a.ka
};
X.prototype.l = function(a, b) {
  a.push("new ResetFrame(");
  A(this.va, a, b);
  a.push(", ", String(this.ka), ")")
};
X.prototype.r = P;
X.prototype.t = function(a) {
  a.push(this.va, "|", String(Number(this.ka)), "!")
};
var Tc = {stream_attach_failure:"stream_attach_failure", acked_unsent_strings:"acked_unsent_strings", invalid_frame_type_or_arguments:"invalid_frame_type_or_arguments", frame_corruption:"frame_corruption", rwin_overflow:"rwin_overflow"};
function Uc(a) {
  this.reason = a
}
Uc.prototype.e = function(a) {
  return a instanceof Uc && this.reason == a.reason
};
Uc.prototype.l = function(a, b) {
  a.push("new TransportKillFrame(");
  A(this.reason, a, b);
  a.push(")")
};
Uc.prototype.r = P;
Uc.prototype.t = function(a) {
  a.push(this.reason, "K")
};
function Vc(a) {
  a || g(new O("0-length frame"));
  var b = a.substr(a.length - 1, 1);
  if(b == " ") {
    return new R(a.substr(0, a.length - 1))
  }else {
    if(b == "A") {
      return a = Sc(kc(a)), a == l && g(new O("bad sack")), new Q(a)
    }else {
      if(b == "N") {
        return a = nc(kc(a)), a == l && g(new O("bad seqNum")), new T(a)
      }else {
        if(b == "T") {
          return a = Sc(kc(a)), a == l && g(new O("bad lastSackSeen")), new U(a)
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
                    return a = a.substr(0, a.length - 1), a = Tc[a], a == l && g(new O("unknown kill reason: " + a)), new Uc(a)
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
;!E || wb();
!ib && !E || E && wb() || ib && ub("1.9.1");
E && ub("9");
function Wc(a, b, c, d) {
  this.contentWindow = a;
  this.Sb = b;
  this.Fb = c;
  this.Tb = d
}
Wc.prototype.l = function(a, b) {
  a.push("<XDRFrame frameId=");
  A(this.Tb, a, b);
  a.push(", expandedUrl=");
  A(this.Sb, a, b);
  a.push(", streams=");
  A(this.Fb, a, b);
  a.push(">")
};
function Xc() {
  this.frames = [];
  this.ob = new Sa
}
Xc.prototype.a = N("cw.net.XDRTracker");
Xc.prototype.hc = function(a) {
  var b = this.ob.get(a);
  b || g(Error("Unknown frameId " + B(a)));
  this.ob.remove(b);
  var c = b[0], a = new Wc((t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow || (jb ? (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + 
  a).contentDocument || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).parentWindow || (jb ? (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).document || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document : (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + 
  a) : "minerva-xdrframe-" + a).contentDocument || (t("minerva-xdrframe-" + a) ? document.getElementById("minerva-xdrframe-" + a) : "minerva-xdrframe-" + a).contentWindow.document).defaultView, b[1], [b[2]], a);
  this.frames.push(a);
  dc(c, a)
};
var Yc = new Xc;
q.__XHRTracker_xdrFrameLoaded = w(Yc.hc, Yc);
var Zc;
Zc = !1;
var Y = fb();
Y && (Y.indexOf("Firefox") != -1 || Y.indexOf("Camino") != -1 || Y.indexOf("iPhone") != -1 || Y.indexOf("iPod") != -1 || Y.indexOf("iPad") != -1 || Y.indexOf("Android") != -1 || Y.indexOf("Chrome") != -1 && (Zc = !0));
var $c = Zc;
/*
 Portions of this code are from MochiKit, received by The Closure
 Library Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Library Authors. All Rights Reserved.
*/
function ad(a, b, c) {
  this.D = b;
  this.ea = a;
  this.Ea = c
}
x(ad, F);
m = ad.prototype;
m.a = N("cw.net.XHRMaster");
m.Bb = -1;
m.La = function(a, b) {
  b != 1 && Gc(this.a, B(this.ea) + " got status != OK: " + b + "; XHRSlave should dispose soon.");
  bd(this.D);
  a: {
    var c = this.D;
    c.xa = !0;
    try {
      for(var d = !1, e = [], f = 0, h = a.length;f < h;f++) {
        if(c.K) {
          c.a.info(c.f() + " returning from loop because we're disposed.");
          break a
        }
        if(d = cd(c, a[f], e)) {
          break
        }
      }
      e.length && dd(c, e);
      c.xa = !1;
      c.i.length && c.A();
      d && (M(c.a, c.f() + " closeSoon is true.  Frames were: " + B(a)), c.d())
    }finally {
      c.xa = !1
    }
  }
};
m.Ma = function(a) {
  L(this.a, "ongotheaders_: " + B(a));
  var b = l;
  "Content-Length" in a && (b = nc(a["Content-Length"]));
  a = this.D;
  L(a.a, a.f() + " got Content-Length: " + b);
  a.w == ed && (b == l && (Hc(a.a, "Expected to receive a valid Content-Length, but did not."), b = 5E5), fd(a, 2E3 + b / 3072 * 1E3))
};
m.Na = function(a) {
  a != 1 && L(this.a, this.D.f() + "'s XHR's readyState is " + a);
  this.Bb = a;
  this.Bb >= 2 && bd(this.D)
};
m.Ka = function() {
  this.D.d()
};
m.k = function() {
  ad.I.k.call(this);
  delete Z.B[this.ea];
  this.Ea.__XHRSlave_dispose(this.ea);
  delete this.Ea
};
function gd() {
  this.B = {}
}
x(gd, F);
m = gd.prototype;
m.a = N("cw.net.XHRMasterTracker");
function hd(a, b, c) {
  var d = "_" + jc(), b = new ad(d, b, c);
  return a.B[d] = b
}
m.La = function(a, b, c) {
  var b = La(b), d = this.B[a];
  d ? d.La(b, c) : Gc(this.a, "onframes_: no master for " + B(a))
};
m.Ma = function(a, b) {
  var c = this.B[a];
  c ? c.Ma(b) : Gc(this.a, "ongotheaders_: no master for " + B(a))
};
m.Na = function(a, b) {
  var c = this.B[a];
  c ? c.Na(b) : Gc(this.a, "onreadystatechange_: no master for " + B(a))
};
m.Ka = function(a) {
  var b = this.B[a];
  b ? (delete this.B[b.ea], b.Ka()) : Gc(this.a, "oncomplete_: no master for " + B(a))
};
m.k = function() {
  gd.I.k.call(this);
  for(var a = oa(this.B);a.length;) {
    a.pop().d()
  }
  delete this.B
};
var Z = new gd;
q.__XHRMaster_onframes = w(Z.La, Z);
q.__XHRMaster_oncomplete = w(Z.Ka, Z);
q.__XHRMaster_ongotheaders = w(Z.Ma, Z);
q.__XHRMaster_onreadystatechange = w(Z.Na, Z);
var id = new S(";)]}");
function $(a, b, c, d) {
  this.n = a;
  this.Yb = b;
  this.F = c;
  this.dc = d;
  this.ia = new pc;
  this.ha = jc() + jc();
  this.G = new Wa;
  this.Ia = new Ya;
  this.ja = l;
  this.Lb = [];
  if(jb) {
    this.ja = Xb(q, "load", this.Zb, !1, this)
  }
}
x($, F);
m = $.prototype;
m.a = N("cw.net.Stream");
m.mb = new D(-1, []);
m.nb = new D(-1, []);
m.tb = 50;
m.sb = 1048576;
m.wb = da;
m.Ta = !1;
m.Ra = !1;
m.m = 1;
m.Hb = -1;
m.b = l;
m.h = l;
m.fa = l;
m.Ua = 0;
m.yb = 0;
m.Db = 0;
m.l = function(a, b) {
  a.push("<Stream id=");
  A(this.ha, a, b);
  a.push(", state=", String(this.m));
  a.push(", primary=");
  A(this.b, a, b);
  a.push(", secondary=");
  A(this.h, a, b);
  a.push(", resetting=");
  A(this.fa, a, b);
  a.push(">")
};
function jd(a) {
  var b = [-1];
  a.b && b.push(a.b.V);
  a.h && b.push(a.h.V);
  return Math.max.apply(Math.max, b)
}
function kd(a) {
  if(a.m != 1) {
    var b = a.G.o.v() != 0, c = Za(a.Ia), d = !c.e(a.nb) && !(a.b && c.e(a.b.U) || a.h && c.e(a.h.U)), e = jd(a);
    if((b = b && e < a.G.R) || d) {
      var f = b && d ? "string(s)+SACK" : b ? "string(s)" : d ? "SACK" : "nothing!?";
      if(a.b.aa) {
        M(a.a, "tryToSend_: writing " + f + " to primary");
        if(d && (d = a.b, c != d.U)) {
          !d.C && !d.i.length && ld(d), d.i.push(new Q(c)), d.U = c
        }
        b && md(a.b, a.G, e + 1);
        a.b.A()
      }else {
        a.h == l ? a.Ta ? (M(a.a, "tryToSend_: creating secondary to send " + f), a.h = nd(a, !1), b && md(a.h, a.G, e + 1), a.h.A()) : (M(a.a, "tryToSend_: not creating a secondary because Stream might not exist on server"), a.Ra = !0) : M(a.a, "tryToSend_: need to send " + f + ", but can't right now")
      }
    }
  }
}
m.Zb = function() {
  this.ja = l;
  if(this.b && this.b.S()) {
    this.a.info("restartHttpRequests_: aborting primary");
    var a = this.b;
    a.ya = !0;
    a.d()
  }
  if(this.h && this.h.S()) {
    this.a.info("restartHttpRequests_: aborting secondary"), a = this.h, a.ya = !0, a.d()
  }
};
m.ac = function(a, b) {
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
    kd(this)
  }
};
function nd(a, b) {
  var c;
  g(Error("Don't support endpoint " + B(a.F)));
  a.Hb += 1;
  c = new od(a.n, a, a.Hb, c, a.F, b);
  M(a.a, "Created: " + c.f());
  a.ia.add(c);
  return c
}
function pd(a, b, c) {
  var d = new qd(a.n, a, b, c);
  M(a.a, "Created: " + d.f() + ", delay=" + b + ", times=" + c);
  a.ia.add(d);
  return d
}
function rd(a, b) {
  a.ia.remove(b) || g(Error("transportOffline_: Transport was not removed?"));
  L(a.a, "Offline: " + b.f());
  b.ua ? a.Ua += b.ua : a.Ua = 0;
  a.Ua >= 1 && (a.a.info("transportOffline_: Doing an internal reset because streamPenalty_ reached limit."), a.d());
  if(a.m > 3) {
    a.m == 4 && b.Kb ? (L(a.a, "Disposing because resettingTransport_ is done."), a.d()) : L(a.a, "Not creating a transport because Stream is in state " + a.m)
  }else {
    var c;
    var d;
    c = b instanceof qd;
    if(!c && b.ya) {
      var e = jb ? $c ? [0, 1] : [9, 20] : [0, 0];
      c = e[0];
      d = e[1];
      M(a.a, "getDelayForNextTransport_: " + B({delay:c, times:d}))
    }else {
      d = b.Za();
      if(b == a.b) {
        if(d) {
          e = ++a.yb
        }else {
          if(!c) {
            e = a.yb = 0
          }
        }
      }else {
        if(d) {
          e = ++a.Db
        }else {
          if(!c) {
            e = a.Db = 0
          }
        }
      }
      if(c || !e) {
        d = c = 0, M(a.a, "getDelayForNextTransport_: " + B({count:e, delay:c, times:d}))
      }else {
        var f = 2E3 * Math.min(e, 3), h = Math.floor(Math.random() * 4E3) - 2E3, j = Math.max(0, b.Ib - b.Wa);
        d = (c = Math.max(0, f + h - j)) ? 1 : 0;
        M(a.a, "getDelayForNextTransport_: " + B({count:e, base:f, variance:h, oldDuration:j, delay:c, times:d}))
      }
    }
    c = [c, d];
    e = c[0];
    c = c[1];
    if(b == a.b) {
      a.b = l, c ? a.b = pd(a, e, c) : (e = jd(a), a.b = nd(a, !0), md(a.b, a.G, e + 1)), a.b.A()
    }else {
      if(b == a.h) {
        a.h = l, c ? (a.h = pd(a, e, c), a.h.A()) : kd(a)
      }
    }
  }
}
m.reset = function(a) {
  this.m > 3 && g(Error("reset: Can't send reset in state " + this.m));
  this.m = 4;
  this.b && this.b.aa ? (this.a.info("reset: Sending ResetFrame over existing primary."), sd(this.b, a), this.b.A()) : (this.b && (L(this.a, "reset: Disposing primary before sending ResetFrame."), this.b.d()), this.h && (L(this.a, "reset: Disposing secondary before sending ResetFrame."), this.h.d()), this.a.info("reset: Creating resettingTransport_ for sending ResetFrame."), this.fa = nd(this, !1), sd(this.fa, a), this.fa.A())
};
function td(a, b, c, d) {
  var e;
  e = a.Ia;
  for(var f = a.tb, h = a.sb, j = [], n = !1, o = 0, u = c.length;o < u;o++) {
    var k = c[o], p = k[0], k = k[1];
    if(p == e.T + 1) {
      e.T += 1;
      for(j.push(k);;) {
        p = e.T + 1;
        k = e.J.get(p, $a);
        if(k === $a) {
          break
        }
        j.push(k[0]);
        e.J.remove(p);
        e.H -= k[1];
        e.T = p
      }
    }else {
      if(!(p <= e.T)) {
        if(f != l && e.J.v() >= f) {
          n = !0;
          break
        }
        var s = Va(k);
        if(h != l && e.H + s > h) {
          n = !0;
          break
        }
        e.J.set(p, [k, s]);
        e.H += s
      }
    }
  }
  e.J.qa() && e.J.clear();
  e = [j, n];
  c = e[0];
  e = e[1];
  if(c) {
    for(f = 0;f < c.length;f++) {
      if(a.m == 4 || a.K) {
        return
      }
    }
  }
  d || kd(a);
  if(!(a.m == 4 || a.K) && e) {
    Gc(b.a, b.f() + "'s peer caused rwin overflow."), b.d()
  }
}
m.start = function() {
  this.m != 1 && g(Error("Stream.start: " + B(this) + " already started"));
  this.m = 2;
  this.m = 3;
  this.b = nd(this, !0);
  md(this.b, this.G, l);
  this.b.A()
};
m.k = function() {
  this.a.info(B(this) + " in disposeInternal.");
  this.m = 5;
  for(var a = this.ia.M(), b = 0;b < a.length;b++) {
    a[b].d()
  }
  for(a = 0;a < this.Lb.length;a++) {
    var b = this.Lb[a].Fb, c = Ia(b, this);
    c >= 0 && z.splice.call(b, c, 1)
  }
  if(jb && this.ja) {
    Yb(this.ja), this.ja = l
  }
  this.wb();
  delete this.ia;
  delete this.b;
  delete this.h;
  delete this.fa;
  delete this.Yb;
  $.I.k.call(this)
};
var ed = 1, ud = 2;
function od(a, b, c, d, e, f) {
  this.n = a;
  this.p = b;
  this.$ = c;
  this.w = d;
  this.F = e;
  this.i = [];
  this.Q = f;
  this.aa = !this.S();
  this.Y = this.w != ed;
  this.Ob = w(this.ec, this)
}
x(od, F);
m = od.prototype;
m.a = N("cw.net.ClientTransport");
m.q = l;
m.Wa = l;
m.Ib = l;
m.wa = l;
m.C = !1;
m.xa = !1;
m.U = l;
m.Ha = 0;
m.V = -1;
m.Oa = -1;
m.Kb = !1;
m.ya = !1;
m.ua = 0;
m.ba = !1;
m.l = function(a) {
  a.push("<ClientTransport #", String(this.$), ", becomePrimary=", String(this.Q), ">")
};
m.f = function() {
  return(this.Q ? "Prim. T#" : "Sec. T#") + this.$
};
m.Za = function() {
  return!(!this.ba && this.Ha)
};
m.S = function() {
  return this.w == ed || this.w == ud
};
function dd(a, b) {
  Ma(b, function(a, b) {
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
  });
  td(a.p, a, b, !a.Y)
}
function cd(a, b, c) {
  try {
    var d = Vc(b);
    a.Ha += 1;
    L(a.a, a.f() + " RECV " + B(d));
    var e;
    a.Ha == 1 && !d.e(id) && a.S() ? (Hc(a.a, a.f() + " is closing soon because got bad preamble: " + B(d)), e = !0) : e = !1;
    if(e) {
      return!0
    }
    if(d instanceof R) {
      if(!/^([ -~]*)$/.test(d.Z)) {
        return a.ba = !0
      }
      a.Oa += 1;
      c.push([a.Oa, d.Z])
    }else {
      if(d instanceof Q) {
        var f = a.p, h = d.u;
        f.mb = h;
        var j = f.G, n = h.P, c = !1;
        n > j.R && (c = !0);
        for(var o = Xa(j).concat(), d = 0;d < o.length;d++) {
          var u = o[d];
          if(u > n) {
            break
          }
          var k = j.o.c[u][1];
          j.o.remove(u);
          j.H -= k
        }
        for(d = 0;d < h.O.length;d++) {
          var p = h.O[d];
          p > j.R && (c = !0);
          C(j.o.c, p) && (k = j.o.c[p][1], j.o.remove(p), j.H -= k)
        }
        j.o.qa() && j.o.clear();
        if(c) {
          return Hc(a.a, a.f() + " is closing soon because got bad SackFrame"), a.ba = !0
        }
      }else {
        if(d instanceof T) {
          a.Oa = d.ga - 1
        }else {
          if(d instanceof U) {
            a.p.nb = d.ca
          }else {
            if(d instanceof W) {
              return M(a.a, a.f() + " is closing soon because got YouCloseItFrame"), !0
            }else {
              if(d instanceof Uc) {
                return a.ba = !0, d.reason == "stream_attach_failure" ? a.ua += 1 : d.reason == "acked_unsent_strings" && (a.ua += 0.5), M(a.a, a.f() + " is closing soon because got " + B(d)), !0
              }else {
                if(!(d instanceof S)) {
                  if(d instanceof V) {
                    var s = a.p, xd = !a.Y;
                    M(s.a, "Stream is now confirmed to exist at server.");
                    s.Ta = !0;
                    if(s.Ra && !xd) {
                      s.Ra = !1, kd(s)
                    }
                  }else {
                    if(c.length) {
                      dd(a, c);
                      if(r(c) != "array") {
                        for(var Gb = c.length - 1;Gb >= 0;Gb--) {
                          delete c[Gb]
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
  }catch(Ec) {
    return Ec instanceof O || g(Ec), Hc(a.a, a.f() + " is closing soon because got InvalidFrame: " + B(b)), a.ba = !0
  }
  return!1
}
m.ec = function() {
  Hc(this.a, this.f() + " timed out due to lack of connection or no data being received.");
  this.d()
};
function vd(a) {
  if(a.wa != l) {
    a.n.s.clearTimeout(a.wa), a.wa = l
  }
}
function fd(a, b) {
  vd(a);
  b = Math.round(b);
  a.wa = a.n.s.setTimeout(a.Ob, b);
  L(a.a, a.f() + "'s receive timeout set to " + b + " ms.")
}
function bd(a) {
  a.w != ed && (a.w == 3 || a.w == ud ? fd(a, 13500) : g(Error("peerStillAlive_: Don't know what to do for this transportType: " + a.w)))
}
function ld(a) {
  var b = new Qc;
  b.$ = a.$;
  b.zb = 2;
  b.kb = 2;
  if(!a.p.Ta) {
    b.Cb = !0
  }
  b.ha = a.p.ha;
  b.Va = a.Y;
  if(b.Va) {
    b.ub = 4096
  }
  b.rb = 3E5;
  b.qb = a.Y ? Math.floor(10) : 0;
  b.Jb = !1;
  if(a.Q) {
    b.Gb = l, b.Ja = Math.floor((a.Y ? 358E4 : 25E3) / 1E3)
  }
  b.u = Za(a.p.Ia);
  b.ra = a.p.mb;
  a.i.push(b);
  a.U = b.u
}
m.A = function() {
  this.C && !this.aa && g(Error("flush_: Can't flush more than once to this transport."));
  if(this.xa) {
    M(this.a, this.f() + " flush_: Returning because spinning right now.")
  }else {
    var a = this.C;
    this.C = !0;
    !a && !this.i.length && ld(this);
    for(a = 0;a < this.i.length;a++) {
      L(this.a, this.f() + " SEND " + B(this.i[a]))
    }
    if(this.S()) {
      for(var a = [], b = 0, c = this.i.length;b < c;b++) {
        this.i[b].t(a), a.push("\n")
      }
      this.i = [];
      a = a.join("");
      b = this.Q ? this.F.rc : this.F.tc;
      this.q = hd(Z, this, this.Q ? this.F.sc : this.F.uc);
      this.Wa = this.n.s === cc ? ma() : this.n.s.getTime();
      c = this.q;
      c.Ea.__XHRSlave_makeRequest(c.ea, b, "POST", a);
      fd(this, 3E3 * (1.5 + (b.indexOf("https://") == 0 ? 3 : 1)) + 4E3 + (this.Y ? 0 : this.Q ? 25E3 : 0))
    }else {
      if(this.w == 3) {
        a = [];
        b = 0;
        for(c = this.i.length;b < c;b++) {
          a.push(this.i[b].r())
        }
        this.i = [];
        this.q ? Lc(this.q, a) : (b = this.F, this.q = new Kc(this), this.q.Sa = hd(b.wc, this.q), this.Wa = this.n.s === cc ? ma() : this.n.s.getTime(), Mc(this.q, b.host, b.port), this.q.K || (Lc(this.q, a), this.q.K || fd(this, 8E3)))
      }else {
        g(Error("flush_: Don't know what to do for this transportType: " + this.w))
      }
    }
  }
};
function md(a, b, c) {
  !a.C && !a.i.length && ld(a);
  for(var d = Math.max(c, a.V + 1), e = Xa(b), c = [], f = 0;f < e.length;f++) {
    var h = e[f];
    (d == l || h >= d) && c.push([h, b.o.c[h][0]])
  }
  b = 0;
  for(d = c.length;b < d;b++) {
    f = c[b], e = f[0], f = f[1], (a.V == -1 || a.V + 1 != e) && a.i.push(new T(e)), a.i.push(new R(f)), a.V = e
  }
}
m.k = function() {
  this.a.info(this.f() + " in disposeInternal.");
  od.I.k.call(this);
  this.Ib = this.n.s === cc ? ma() : this.n.s.getTime();
  this.i = [];
  vd(this);
  this.q && this.q.d();
  var a = this.p;
  this.p = l;
  rd(a, this)
};
function sd(a, b) {
  !a.C && !a.i.length && ld(a);
  a.i.push(new X(b, !0));
  a.Kb = !0
}
function qd(a, b, c, d) {
  this.n = a;
  this.p = b;
  this.bb = c;
  this.ab = d
}
x(qd, F);
m = qd.prototype;
m.C = !1;
m.aa = !1;
m.na = l;
m.U = l;
m.a = N("cw.net.DoNothingTransport");
function wd(a) {
  a.na = a.n.s.setTimeout(function() {
    a.na = l;
    a.ab--;
    a.ab ? wd(a) : a.d()
  }, a.bb)
}
m.A = function() {
  this.C && !this.aa && g(Error("flush_: Can't flush more than once to DoNothingTransport."));
  this.C = !0;
  wd(this)
};
m.l = function(a) {
  a.push("<DoNothingTransport delay=", String(this.bb), ">")
};
m.S = aa(!1);
m.f = aa("Wast. T");
m.Za = aa(!1);
m.k = function() {
  this.a.info(this.f() + " in disposeInternal.");
  qd.I.k.call(this);
  this.na != l && this.n.s.clearTimeout(this.na);
  var a = this.p;
  this.p = l;
  rd(a, this)
};
ba("Minerva.Client.Stream", $);
$.prototype.start = $.prototype.start;
$.prototype.sendStrings = $.prototype.ac;
$.prototype.reset = $.prototype.reset;
$.prototype.maxUndeliveredStrings = $.prototype.tb;
$.prototype.maxUndeliveredBytes = $.prototype.sb;
$.prototype.ondisconnect = $.prototype.wb;
ba("Minerva.repr", B);
})();
