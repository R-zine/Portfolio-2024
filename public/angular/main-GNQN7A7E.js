var Zl = Object.defineProperty,
  Yl = Object.defineProperties;
var Ql = Object.getOwnPropertyDescriptors;
var Cs = Object.getOwnPropertySymbols;
var Kl = Object.prototype.hasOwnProperty,
  Jl = Object.prototype.propertyIsEnumerable;
var ws = (t, e, n) =>
    e in t
      ? Zl(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  F = (t, e) => {
    for (var n in (e ||= {})) Kl.call(e, n) && ws(t, n, e[n]);
    if (Cs) for (var n of Cs(e)) Jl.call(e, n) && ws(t, n, e[n]);
    return t;
  },
  B = (t, e) => Yl(t, Ql(e));
var Es = null;
var Br = 1;
function Z(t) {
  let e = Es;
  return (Es = t), e;
}
var Is = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Xl(t) {
  if (!(Gr(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Br)) {
    if (!t.producerMustRecompute(t) && !Ur(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Br);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Br);
  }
}
function bs(t) {
  return t && (t.nextProducerIndex = 0), Z(t);
}
function Ms(t, e) {
  if (
    (Z(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Gr(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        Hr(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Ur(t) {
  dn(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (Xl(n), r !== n.version)) return !0;
  }
  return !1;
}
function _s(t) {
  if ((dn(t), Gr(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Hr(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Hr(t, e) {
  if ((ed(t), dn(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      Hr(t.producerNode[r], t.producerIndexOfThis[r]);
  let n = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[n]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let r = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    dn(i), (i.producerIndexOfThis[r] = e);
  }
}
function Gr(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function dn(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function ed(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function td() {
  throw new Error();
}
var nd = td;
function Ss(t) {
  nd = t;
}
function w(t) {
  return typeof t == "function";
}
function fn(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var hn = fn(
  (t) =>
    function (n) {
      t(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function Ft(t, e) {
  if (t) {
    let n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var U = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let o of n) o.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (w(r))
        try {
          r();
        } catch (o) {
          e = o instanceof hn ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            xs(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof hn ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new hn(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) xs(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: n } = this;
    return n === e || (Array.isArray(n) && n.includes(e));
  }
  _addParent(e) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }
  _removeParent(e) {
    let { _parentage: n } = this;
    n === e ? (this._parentage = null) : Array.isArray(n) && Ft(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && Ft(n, e), e instanceof t && e._removeParent(this);
  }
};
U.EMPTY = (() => {
  let t = new U();
  return (t.closed = !0), t;
})();
var zr = U.EMPTY;
function pn(t) {
  return (
    t instanceof U ||
    (t && "closed" in t && w(t.remove) && w(t.add) && w(t.unsubscribe))
  );
}
function xs(t) {
  w(t) ? t() : t.unsubscribe();
}
var ne = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var ot = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = ot;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = ot;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function gn(t) {
  ot.setTimeout(() => {
    let { onUnhandledError: e } = ne;
    if (e) e(t);
    else throw t;
  });
}
function Wr() {}
var Ts = (() => qr("C", void 0, void 0))();
function As(t) {
  return qr("E", void 0, t);
}
function Ns(t) {
  return qr("N", t, void 0);
}
function qr(t, e, n) {
  return { kind: t, value: e, error: n };
}
var Ue = null;
function st(t) {
  if (ne.useDeprecatedSynchronousErrorHandling) {
    let e = !Ue;
    if ((e && (Ue = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = Ue;
      if (((Ue = null), n)) throw r;
    }
  } else t();
}
function Os(t) {
  ne.useDeprecatedSynchronousErrorHandling &&
    Ue &&
    ((Ue.errorThrown = !0), (Ue.error = t));
}
var He = class extends U {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), pn(e) && e.add(this))
          : (this.destination = od);
    }
    static create(e, n, r) {
      return new Ee(e, n, r);
    }
    next(e) {
      this.isStopped ? Yr(Ns(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Yr(As(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Yr(Ts, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  rd = Function.prototype.bind;
function Zr(t, e) {
  return rd.call(t, e);
}
var Qr = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          mn(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          mn(r);
        }
      else mn(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          mn(n);
        }
    }
  },
  Ee = class extends He {
    constructor(e, n, r) {
      super();
      let i;
      if (w(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let o;
        this && ne.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Zr(e.next, o),
              error: e.error && Zr(e.error, o),
              complete: e.complete && Zr(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Qr(i);
    }
  };
function mn(t) {
  ne.useDeprecatedSynchronousErrorHandling ? Os(t) : gn(t);
}
function id(t) {
  throw t;
}
function Yr(t, e) {
  let { onStoppedNotification: n } = ne;
  n && ot.setTimeout(() => n(t, e));
}
var od = { closed: !0, next: Wr, error: id, complete: Wr };
var at = (() =>
  (typeof Symbol == "function" && Symbol.observable) || "@@observable")();
function ut(t) {
  return t;
}
function Rs(t) {
  return t.length === 0
    ? ut
    : t.length === 1
    ? t[0]
    : function (n) {
        return t.reduce((r, i) => i(r), n);
      };
}
var S = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new t();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let o = ad(n) ? n : new Ee(n, r, i);
      return (
        st(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Fs(r)),
        new r((i, o) => {
          let s = new Ee({
            next: (a) => {
              try {
                n(a);
              } catch (u) {
                o(u), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [at]() {
      return this;
    }
    pipe(...n) {
      return Rs(n)(this);
    }
    toPromise(n) {
      return (
        (n = Fs(n)),
        new n((r, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => r(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Fs(t) {
  var e;
  return (e = t ?? ne.Promise) !== null && e !== void 0 ? e : Promise;
}
function sd(t) {
  return t && w(t.next) && w(t.error) && w(t.complete);
}
function ad(t) {
  return (t && t instanceof He) || (sd(t) && pn(t));
}
function ud(t) {
  return w(t?.lift);
}
function H(t) {
  return (e) => {
    if (ud(e))
      return e.lift(function (n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function G(t, e, n, r, i) {
  return new Kr(t, e, n, r, i);
}
var Kr = class extends He {
  constructor(e, n, r, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (u) {
              e.error(u);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (u) {
              e.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
var Ps = fn(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var Ie = (() => {
    class t extends S {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new vn(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Ps();
      }
      next(n) {
        st(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        st(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        st(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: o } = this;
        return r || i
          ? zr
          : ((this.currentObservers = null),
            o.push(n),
            new U(() => {
              (this.currentObservers = null), Ft(o, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: o } = this;
        r ? n.error(i) : o && n.complete();
      }
      asObservable() {
        let n = new S();
        return (n.source = this), n;
      }
    }
    return (t.create = (e, n) => new vn(e, n)), t;
  })(),
  vn = class extends Ie {
    constructor(e, n) {
      super(), (this.destination = e), (this.source = n);
    }
    next(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    error(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    complete() {
      var e, n;
      (n =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        n === void 0 ||
        n.call(e);
    }
    _subscribe(e) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(e)) !== null && r !== void 0
        ? r
        : zr;
    }
  };
var ct = class extends Ie {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let n = super._subscribe(e);
    return !n.closed && e.next(this._value), n;
  }
  getValue() {
    let { hasError: e, thrownError: n, _value: r } = this;
    if (e) throw n;
    return this._throwIfClosed(), r;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Jr = new S((t) => t.complete());
function ks(t) {
  return t && w(t.schedule);
}
function Xr(t) {
  return t[t.length - 1];
}
function Ls(t) {
  return w(Xr(t)) ? t.pop() : void 0;
}
function yn(t) {
  return ks(Xr(t)) ? t.pop() : void 0;
}
function Vs(t, e) {
  return typeof Xr(t) == "number" ? t.pop() : e;
}
function $s(t, e, n, r) {
  function i(o) {
    return o instanceof n
      ? o
      : new n(function (s) {
          s(o);
        });
  }
  return new (n || (n = Promise))(function (o, s) {
    function a(l) {
      try {
        c(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? o(l.value) : i(l.value).then(a, u);
    }
    c((r = r.apply(t, e || [])).next());
  });
}
function js(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Ge(t) {
  return this instanceof Ge ? ((this.v = t), this) : new Ge(t);
}
function Bs(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    r[f] &&
      (i[f] = function (h) {
        return new Promise(function (p, y) {
          o.push([f, h, p, y]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      u(r[f](h));
    } catch (p) {
      d(o[0][3], p);
    }
  }
  function u(f) {
    f.value instanceof Ge
      ? Promise.resolve(f.value.v).then(c, l)
      : d(o[0][2], f);
  }
  function c(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function Us(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof js == "function" ? js(t) : t[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(o) {
    n[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = t[o](s)), i(a, u, s.done, s.value);
        });
      };
  }
  function i(o, s, a, u) {
    Promise.resolve(u).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var Dn = (t) => t && typeof t.length == "number" && typeof t != "function";
function Cn(t) {
  return w(t?.then);
}
function wn(t) {
  return w(t[at]);
}
function En(t) {
  return Symbol.asyncIterator && w(t?.[Symbol.asyncIterator]);
}
function In(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function cd() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var bn = cd();
function Mn(t) {
  return w(t?.[bn]);
}
function _n(t) {
  return Bs(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield Ge(n.read());
        if (i) return yield Ge(void 0);
        yield yield Ge(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Sn(t) {
  return w(t?.getReader);
}
function O(t) {
  if (t instanceof S) return t;
  if (t != null) {
    if (wn(t)) return ld(t);
    if (Dn(t)) return dd(t);
    if (Cn(t)) return fd(t);
    if (En(t)) return Hs(t);
    if (Mn(t)) return hd(t);
    if (Sn(t)) return pd(t);
  }
  throw In(t);
}
function ld(t) {
  return new S((e) => {
    let n = t[at]();
    if (w(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function dd(t) {
  return new S((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function fd(t) {
  return new S((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n)
    ).then(null, gn);
  });
}
function hd(t) {
  return new S((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function Hs(t) {
  return new S((e) => {
    gd(t, e).catch((n) => e.error(n));
  });
}
function pd(t) {
  return Hs(_n(t));
}
function gd(t, e) {
  var n, r, i, o;
  return $s(this, void 0, void 0, function* () {
    try {
      for (n = Us(t); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        r && !r.done && (o = n.return) && (yield o.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Q(t, e, n, r = 0, i = !1) {
  let o = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(o), !i)) return o;
}
function xn(t, e = 0) {
  return H((n, r) => {
    n.subscribe(
      G(
        r,
        (i) => Q(r, t, () => r.next(i), e),
        () => Q(r, t, () => r.complete(), e),
        (i) => Q(r, t, () => r.error(i), e)
      )
    );
  });
}
function Tn(t, e = 0) {
  return H((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function Gs(t, e) {
  return O(t).pipe(Tn(e), xn(e));
}
function zs(t, e) {
  return O(t).pipe(Tn(e), xn(e));
}
function Ws(t, e) {
  return new S((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function qs(t, e) {
  return new S((n) => {
    let r;
    return (
      Q(n, e, () => {
        (r = t[bn]()),
          Q(
            n,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              o ? n.complete() : n.next(i);
            },
            0,
            !0
          );
      }),
      () => w(r?.return) && r.return()
    );
  });
}
function An(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new S((n) => {
    Q(n, e, () => {
      let r = t[Symbol.asyncIterator]();
      Q(
        n,
        e,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Zs(t, e) {
  return An(_n(t), e);
}
function Ys(t, e) {
  if (t != null) {
    if (wn(t)) return Gs(t, e);
    if (Dn(t)) return Ws(t, e);
    if (Cn(t)) return zs(t, e);
    if (En(t)) return An(t, e);
    if (Mn(t)) return qs(t, e);
    if (Sn(t)) return Zs(t, e);
  }
  throw In(t);
}
function Ae(t, e) {
  return e ? Ys(t, e) : O(t);
}
function Pt(...t) {
  let e = yn(t);
  return Ae(t, e);
}
function re(t, e) {
  return H((n, r) => {
    let i = 0;
    n.subscribe(
      G(r, (o) => {
        r.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: md } = Array;
function vd(t, e) {
  return md(e) ? t(...e) : t(e);
}
function Qs(t) {
  return re((e) => vd(t, e));
}
var { isArray: yd } = Array,
  { getPrototypeOf: Dd, prototype: Cd, keys: wd } = Object;
function Ks(t) {
  if (t.length === 1) {
    let e = t[0];
    if (yd(e)) return { args: e, keys: null };
    if (Ed(e)) {
      let n = wd(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function Ed(t) {
  return t && typeof t == "object" && Dd(t) === Cd;
}
function Js(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function Xs(t, e, n, r, i, o, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && e.complete();
    },
    h = (y) => (c < r ? p(y) : u.push(y)),
    p = (y) => {
      o && e.next(y), c++;
      let N = !1;
      O(n(y, l++)).subscribe(
        G(
          e,
          (b) => {
            i?.(b), o ? h(b) : e.next(b);
          },
          () => {
            N = !0;
          },
          void 0,
          () => {
            if (N)
              try {
                for (c--; u.length && c < r; ) {
                  let b = u.shift();
                  s ? Q(e, s, () => p(b)) : p(b);
                }
                f();
              } catch (b) {
                e.error(b);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      G(e, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Nn(t, e, n = 1 / 0) {
  return w(e)
    ? Nn((r, i) => re((o, s) => e(r, o, i, s))(O(t(r, i))), n)
    : (typeof e == "number" && (n = e), H((r, i) => Xs(r, i, t, n)));
}
function ei(t = 1 / 0) {
  return Nn(ut, t);
}
function ti(...t) {
  let e = Ls(t),
    { args: n, keys: r } = Ks(t),
    i = new S((o) => {
      let { length: s } = n;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        u = s,
        c = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        O(n[l]).subscribe(
          G(
            o,
            (f) => {
              d || ((d = !0), c--), (a[l] = f);
            },
            () => u--,
            void 0,
            () => {
              (!u || !d) && (c || o.next(r ? Js(r, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(Qs(e)) : i;
}
function ni(...t) {
  let e = yn(t),
    n = Vs(t, 1 / 0),
    r = t;
  return r.length ? (r.length === 1 ? O(r[0]) : ei(n)(Ae(r, e))) : Jr;
}
function ri(t, e = ut) {
  return (
    (t = t ?? Id),
    H((n, r) => {
      let i,
        o = !0;
      n.subscribe(
        G(r, (s) => {
          let a = e(s);
          (o || !t(i, a)) && ((o = !1), (i = a), r.next(s));
        })
      );
    })
  );
}
function Id(t, e) {
  return t === e;
}
function oi(t = {}) {
  let {
    connector: e = () => new Ie(),
    resetOnError: n = !0,
    resetOnComplete: r = !0,
    resetOnRefCountZero: i = !0,
  } = t;
  return (o) => {
    let s,
      a,
      u,
      c = 0,
      l = !1,
      d = !1,
      f = () => {
        a?.unsubscribe(), (a = void 0);
      },
      h = () => {
        f(), (s = u = void 0), (l = d = !1);
      },
      p = () => {
        let y = s;
        h(), y?.unsubscribe();
      };
    return H((y, N) => {
      c++, !d && !l && f();
      let b = (u = u ?? e());
      N.add(() => {
        c--, c === 0 && !d && !l && (a = ii(p, i));
      }),
        b.subscribe(N),
        !s &&
          c > 0 &&
          ((s = new Ee({
            next: (Y) => b.next(Y),
            error: (Y) => {
              (d = !0), f(), (a = ii(h, n, Y)), b.error(Y);
            },
            complete: () => {
              (l = !0), f(), (a = ii(h, r)), b.complete();
            },
          })),
          O(y).subscribe(s));
    })(o);
  };
}
function ii(t, e, ...n) {
  if (e === !0) {
    t();
    return;
  }
  if (e === !1) return;
  let r = new Ee({
    next: () => {
      r.unsubscribe(), t();
    },
  });
  return O(e(...n)).subscribe(r);
}
function On(t, e) {
  return H((n, r) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && r.complete();
    n.subscribe(
      G(
        r,
        (u) => {
          i?.unsubscribe();
          let c = 0,
            l = o++;
          O(t(u, l)).subscribe(
            (i = G(
              r,
              (d) => r.next(e ? e(u, d, l, c++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function _(t) {
  for (let e in t) if (t[e] === _) return e;
  throw Error("Could not find renamed property on target object.");
}
function Rn(t, e) {
  for (let n in e) e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n]);
}
function W(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(W).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let n = e.indexOf(`
`);
  return n === -1 ? e : e.substring(0, n);
}
function wi(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var Md = _({ __forward_ref__: _ });
function bt(t) {
  return (
    (t.__forward_ref__ = bt),
    (t.toString = function () {
      return W(this());
    }),
    t
  );
}
function V(t) {
  return ka(t) ? t() : t;
}
function ka(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(Md) && t.__forward_ref__ === bt
  );
}
function La(t) {
  return t && !!t.ɵproviders;
}
var _d = "https://g.co/ng/security#xss",
  m = class extends Error {
    constructor(e, n) {
      super(ao(e, n)), (this.code = e);
    }
  };
function ao(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var Sd = _({ ɵcmp: _ }),
  xd = _({ ɵdir: _ }),
  Td = _({ ɵpipe: _ });
var Un = _({ ɵfac: _ }),
  kt = _({ __NG_ELEMENT_ID__: _ }),
  ea = _({ __NG_ENV_ID__: _ });
function Ad(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function Nd(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : Ad(t);
}
function Od(t, e) {
  let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new m(-200, `Circular dependency in DI detected for ${t}${n}`);
}
function uo(t, e) {
  let n = e ? ` in ${e}` : "";
  throw new m(-201, !1);
}
function Rd(t, e) {
  t == null && Fd(e, t, null, "!=");
}
function Fd(t, e, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (r == null ? "" : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
  );
}
function x(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function Fe(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function co(t) {
  return ta(t, Va) || ta(t, ja);
}
function ta(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function Pd(t) {
  let e = t && (t[Va] || t[ja]);
  return e || null;
}
function na(t) {
  return t && (t.hasOwnProperty(ra) || t.hasOwnProperty(kd)) ? t[ra] : null;
}
var Va = _({ ɵprov: _ }),
  ra = _({ ɵinj: _ }),
  ja = _({ ngInjectableDef: _ }),
  kd = _({ ngInjectorDef: _ }),
  D = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(D || {}),
  Ei;
function Ld() {
  return Ei;
}
function ge(t) {
  let e = Ei;
  return (Ei = t), e;
}
function $a(t, e, n) {
  let r = co(t);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & D.Optional) return null;
  if (e !== void 0) return e;
  uo(W(t), "Injector");
}
var Lt = globalThis;
var E = class {
  constructor(e, n) {
    (this._desc = e),
      (this.ngMetadataName = "InjectionToken"),
      (this.ɵprov = void 0),
      typeof n == "number"
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = x({
            token: this,
            providedIn: n.providedIn || "root",
            factory: n.factory,
          }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var Vd = {},
  $t = Vd,
  Ii = "__NG_DI_FLAG__",
  Hn = "ngTempTokenPath",
  jd = "ngTokenPath",
  $d = /\n/gm,
  Bd = "\u0275",
  ia = "__source",
  Vt;
function lt(t) {
  let e = Vt;
  return (Vt = t), e;
}
function Ud(t, e = D.Default) {
  if (Vt === void 0) throw new m(-203, !1);
  return Vt === null
    ? $a(t, void 0, e)
    : Vt.get(t, e & D.Optional ? null : void 0, e);
}
function I(t, e = D.Default) {
  return (Ld() || Ud)(V(t), e);
}
function T(t, e = D.Default) {
  return I(t, ur(e));
}
function ur(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function bi(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = V(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new m(900, !1);
      let i,
        o = D.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = Hd(a);
        typeof u == "number" ? (u === -1 ? (i = a.token) : (o |= u)) : (i = a);
      }
      e.push(I(i, o));
    } else e.push(I(r));
  }
  return e;
}
function Ba(t, e) {
  return (t[Ii] = e), (t.prototype[Ii] = e), t;
}
function Hd(t) {
  return t[Ii];
}
function Gd(t, e, n, r) {
  let i = t[Hn];
  throw (
    (e[ia] && i.unshift(e[ia]),
    (t.message = zd(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[jd] = i),
    (t[Hn] = null),
    t)
  );
}
function zd(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == Bd
      ? t.slice(2)
      : t;
  let i = W(e);
  if (Array.isArray(e)) i = e.map(W).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : W(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${t.replace(
    $d,
    `
  `
  )}`;
}
function Zt(t) {
  return { toString: t }.toString();
}
var Ua = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Ua || {}),
  ye = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(ye || {}),
  gt = {},
  z = [];
function Ha(t, e, n) {
  let r = t.length;
  for (;;) {
    let i = t.indexOf(e, n);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === r || t.charCodeAt(i + o) <= 32) return i;
    }
    n = i + 1;
  }
}
function Mi(t, e, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == "number") {
      if (i !== 0) break;
      r++;
      let o = n[r++],
        s = n[r++],
        a = n[r++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = n[++r];
      qd(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), r++;
    }
  }
  return r;
}
function Wd(t) {
  return t === 3 || t === 4 || t === 6;
}
function qd(t) {
  return t.charCodeAt(0) === 64;
}
function Bt(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let n = -1;
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        typeof i == "number"
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? oa(t, n, i, null, e[++r])
              : oa(t, n, i, null, null));
      }
    }
  return t;
}
function oa(t, e, n, r, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (r === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, r !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, n),
    r !== null && t.splice(o++, 0, r),
    i !== null && t.splice(o++, 0, i);
}
var Ga = "ng-template";
function Zd(t, e, n) {
  let r = 0,
    i = !0;
  for (; r < t.length; ) {
    let o = t[r++];
    if (typeof o == "string" && i) {
      let s = t[r++];
      if (n && o === "class" && Ha(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; r < t.length && typeof (o = t[r++]) == "string"; )
        if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == "number" && (i = !1);
  }
  return !1;
}
function za(t) {
  return t.type === 4 && t.value !== Ga;
}
function Yd(t, e, n) {
  let r = t.type === 4 && !n ? Ga : t.value;
  return e === r;
}
function Qd(t, e, n) {
  let r = 4,
    i = t.attrs || [],
    o = Xd(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let u = e[a];
    if (typeof u == "number") {
      if (!s && !ie(r) && !ie(u)) return !1;
      if (s && ie(u)) continue;
      (s = !1), (r = u | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== "" && !Yd(t, u, n)) || (u === "" && e.length === 1))
        ) {
          if (ie(r)) return !1;
          s = !0;
        }
      } else {
        let c = r & 8 ? u : e[++a];
        if (r & 8 && t.attrs !== null) {
          if (!Zd(t.attrs, c, n)) {
            if (ie(r)) return !1;
            s = !0;
          }
          continue;
        }
        let l = r & 8 ? "class" : u,
          d = Kd(l, i, za(t), n);
        if (d === -1) {
          if (ie(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let f;
          d > o ? (f = "") : (f = i[d + 1].toLowerCase());
          let h = r & 8 ? f : null;
          if ((h && Ha(h, c, 0) !== -1) || (r & 2 && c !== f)) {
            if (ie(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return ie(r) || s;
}
function ie(t) {
  return (t & 1) === 0;
}
function Kd(t, e, n, r) {
  if (e === null) return -1;
  let i = 0;
  if (r || !n) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return ef(e, t);
}
function Jd(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (Qd(t, e[r], n)) return !0;
  return !1;
}
function Xd(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (Wd(n)) return e;
  }
  return t.length;
}
function ef(t, e) {
  let n = t.indexOf(4);
  if (n > -1)
    for (n++; n < t.length; ) {
      let r = t[n];
      if (typeof r == "number") return -1;
      if (r === e) return n;
      n++;
    }
  return -1;
}
function sa(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function tf(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = "",
    o = !1;
  for (; n < t.length; ) {
    let s = t[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = t[++n];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (i += "." + s) : r & 4 && (i += " " + s);
    else
      i !== "" && !ie(s) && ((e += sa(o, i)), (i = "")),
        (r = s),
        (o = o || !ie(r));
    n++;
  }
  return i !== "" && (e += sa(o, i)), e;
}
function nf(t) {
  return t.map(tf).join(",");
}
function rf(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++r]) : i === 8 && n.push(o);
    else {
      if (!ie(i)) break;
      i = o;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function lo(t) {
  return Zt(() => {
    let e = Ya(t),
      n = B(F({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Ua.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || ye.Emulated,
        styles: t.styles || z,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Qa(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = ua(r, !1)), (n.pipeDefs = ua(r, !0)), (n.id = af(n)), n
    );
  });
}
function of(t) {
  return mt(t) || Wa(t);
}
function sf(t) {
  return t !== null;
}
function Pe(t) {
  return Zt(() => ({
    type: t.type,
    bootstrap: t.bootstrap || z,
    declarations: t.declarations || z,
    imports: t.imports || z,
    exports: t.exports || z,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function aa(t, e) {
  if (t == null) return gt;
  let n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        o = i;
      Array.isArray(i) && ((o = i[1]), (i = i[0])), (n[i] = r), e && (e[i] = o);
    }
  return n;
}
function q(t) {
  return Zt(() => {
    let e = Ya(t);
    return Qa(e), e;
  });
}
function mt(t) {
  return t[Sd] || null;
}
function Wa(t) {
  return t[xd] || null;
}
function qa(t) {
  return t[Td] || null;
}
function Za(t) {
  let e = mt(t) || Wa(t) || qa(t);
  return e !== null ? e.standalone : !1;
}
function Ya(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || gt,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || z,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: aa(t.inputs, e),
    outputs: aa(t.outputs),
    debugInfo: null,
  };
}
function Qa(t) {
  t.features?.forEach((e) => e(t));
}
function ua(t, e) {
  if (!t) return null;
  let n = e ? qa : of;
  return () => (typeof t == "function" ? t() : t).map((r) => n(r)).filter(sf);
}
function af(t) {
  let e = 0,
    n = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483647 + 1), "c" + e;
}
var _e = 0,
  C = 1,
  g = 2,
  R = 3,
  se = 4,
  le = 5,
  Gn = 6,
  Ut = 7,
  ae = 8,
  vt = 9,
  Ht = 10,
  k = 11,
  Gt = 12,
  ca = 13,
  Mt = 14,
  De = 15,
  cr = 16,
  dt = 17,
  zt = 18,
  lr = 19,
  Ka = 20,
  jt = 21,
  si = 22,
  We = 23,
  Oe = 25,
  Ja = 1;
var qe = 7,
  zn = 8,
  Wn = 9,
  K = 10,
  yt = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      (t[(t.HasChildViewsToRefresh = 4)] = "HasChildViewsToRefresh"),
      t
    );
  })(yt || {});
function Ne(t) {
  return Array.isArray(t) && typeof t[Ja] == "object";
}
function ue(t) {
  return Array.isArray(t) && t[Ja] === !0;
}
function Xa(t) {
  return (t.flags & 4) !== 0;
}
function dr(t) {
  return t.componentOffset > -1;
}
function fo(t) {
  return (t.flags & 1) === 1;
}
function Re(t) {
  return !!t.template;
}
function uf(t) {
  return (t[g] & 512) !== 0;
}
function Dt(t, e) {
  let n = t.hasOwnProperty(Un);
  return n ? t[Un] : null;
}
var _i = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function et() {
  return eu;
}
function eu(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = lf), cf;
}
et.ngInherit = !0;
function cf() {
  let t = nu(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === gt) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function lf(t, e, n, r) {
  let i = this.declaredInputs[n],
    o = nu(t) || df(t, { previous: gt, current: null }),
    s = o.current || (o.current = {}),
    a = o.previous,
    u = a[i];
  (s[i] = new _i(u && u.currentValue, e, a === gt)), (t[r] = e);
}
var tu = "__ngSimpleChanges__";
function nu(t) {
  return t[tu] || null;
}
function df(t, e) {
  return (t[tu] = e);
}
var la = null;
var me = function (t, e, n) {
    la?.(t, e, n);
  },
  ru = "svg",
  ff = "math";
function Ce(t) {
  for (; Array.isArray(t); ) t = t[_e];
  return t;
}
function hf(t, e) {
  return Ce(e[t]);
}
function de(t, e) {
  return Ce(e[t.index]);
}
function iu(t, e) {
  return t.data[e];
}
function ke(t, e) {
  let n = e[t];
  return Ne(n) ? n : n[_e];
}
function ho(t) {
  return (t[g] & 128) === 128;
}
function pf(t) {
  return ue(t[R]);
}
function qn(t, e) {
  return e == null ? null : t[e];
}
function ou(t) {
  t[dt] = 0;
}
function gf(t) {
  t[g] & 1024 || ((t[g] |= 1024), ho(t) && fr(t));
}
function mf(t, e) {
  for (; t > 0; ) (e = e[Mt]), t--;
  return e;
}
function su(t) {
  return t[g] & 9216 || t[We]?.dirty;
}
function au(t) {
  su(t) && fr(t);
}
function fr(t) {
  let e = t[R];
  for (
    ;
    e !== null &&
    !((ue(e) && e[g] & yt.HasChildViewsToRefresh) || (Ne(e) && e[g] & 8192));

  ) {
    if (ue(e)) e[g] |= yt.HasChildViewsToRefresh;
    else if (((e[g] |= 8192), !ho(e))) break;
    e = e[R];
  }
}
function vf(t, e) {
  if ((t[g] & 256) === 256) throw new m(911, !1);
  t[jt] === null && (t[jt] = []), t[jt].push(e);
}
var v = { lFrame: vu(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function yf() {
  return v.lFrame.elementDepthCount;
}
function Df() {
  v.lFrame.elementDepthCount++;
}
function Cf() {
  v.lFrame.elementDepthCount--;
}
function uu() {
  return v.bindingsEnabled;
}
function wf() {
  return v.skipHydrationRootTNode !== null;
}
function Ef(t) {
  return v.skipHydrationRootTNode === t;
}
function If() {
  v.skipHydrationRootTNode = null;
}
function A() {
  return v.lFrame.lView;
}
function fe() {
  return v.lFrame.tView;
}
function cu(t) {
  return (v.lFrame.contextLView = t), t[ae];
}
function lu(t) {
  return (v.lFrame.contextLView = null), t;
}
function J() {
  let t = du();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function du() {
  return v.lFrame.currentTNode;
}
function bf() {
  let t = v.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Yt(t, e) {
  let n = v.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function fu() {
  return v.lFrame.isParent;
}
function Mf() {
  v.lFrame.isParent = !1;
}
function _f() {
  let t = v.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function Sf(t) {
  return (v.lFrame.bindingIndex = t);
}
function xf() {
  return v.lFrame.bindingIndex++;
}
function hu(t) {
  let e = v.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function Tf() {
  return v.lFrame.inI18n;
}
function Af(t, e) {
  let n = v.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), Si(e);
}
function Nf() {
  return v.lFrame.currentDirectiveIndex;
}
function Si(t) {
  v.lFrame.currentDirectiveIndex = t;
}
function Of(t) {
  let e = v.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function pu(t) {
  v.lFrame.currentQueryIndex = t;
}
function Rf(t) {
  let e = t[C];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[le] : null;
}
function gu(t, e, n) {
  if (n & D.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(n & D.Host); )
      if (((i = Rf(o)), i === null || ((o = o[Mt]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let r = (v.lFrame = mu());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function po(t) {
  let e = mu(),
    n = t[C];
  (v.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function mu() {
  let t = v.lFrame,
    e = t === null ? null : t.child;
  return e === null ? vu(t) : e;
}
function vu(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function yu() {
  let t = v.lFrame;
  return (v.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var Du = yu;
function go() {
  let t = yu();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function Ff(t) {
  return (v.lFrame.contextLView = mf(t, v.lFrame.contextLView))[ae];
}
function _t() {
  return v.lFrame.selectedIndex;
}
function Ze(t) {
  v.lFrame.selectedIndex = t;
}
function Pf() {
  let t = v.lFrame;
  return iu(t.tView, t.selectedIndex);
}
function mo() {
  v.lFrame.currentNamespace = ru;
}
function vo() {
  kf();
}
function kf() {
  v.lFrame.currentNamespace = null;
}
function Lf() {
  return v.lFrame.currentNamespace;
}
var Cu = !0;
function yo() {
  return Cu;
}
function Do(t) {
  Cu = t;
}
function Vf(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (r) {
    let s = eu(e);
    (n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o));
}
function Co(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let o = t.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = o;
    s && (t.contentHooks ??= []).push(-n, s),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      u && (t.viewHooks ??= []).push(-n, u),
      c &&
        ((t.viewHooks ??= []).push(n, c), (t.viewCheckHooks ??= []).push(n, c)),
      l != null && (t.destroyHooks ??= []).push(n, l);
  }
}
function Ln(t, e, n) {
  wu(t, e, 3, n);
}
function Vn(t, e, n, r) {
  (t[g] & 3) === n && wu(t, e, n, r);
}
function ai(t, e) {
  let n = t[g];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[g] = n));
}
function wu(t, e, n, r) {
  let i = r !== void 0 ? t[dt] & 65535 : 0,
    o = r ?? -1,
    s = e.length - 1,
    a = 0;
  for (let u = i; u < s; u++)
    if (typeof e[u + 1] == "number") {
      if (((a = e[u]), r != null && a >= r)) break;
    } else
      e[u] < 0 && (t[dt] += 65536),
        (a < o || o == -1) &&
          (jf(t, n, e, u), (t[dt] = (t[dt] & 4294901760) + u + 2)),
        u++;
}
function da(t, e) {
  me(4, t, e);
  let n = Z(null);
  try {
    e.call(t);
  } finally {
    Z(n), me(5, t, e);
  }
}
function jf(t, e, n, r) {
  let i = n[r] < 0,
    o = n[r + 1],
    s = i ? -n[r] : n[r],
    a = t[s];
  i
    ? t[g] >> 14 < t[dt] >> 16 &&
      (t[g] & 3) === e &&
      ((t[g] += 16384), da(a, o))
    : da(a, o);
}
var pt = -1,
  Ye = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function $f(t) {
  return t instanceof Ye;
}
function Bf(t) {
  return (t.flags & 8) !== 0;
}
function Uf(t) {
  return (t.flags & 16) !== 0;
}
function Eu(t) {
  return t !== pt;
}
function Zn(t) {
  let e = t & 32767;
  return t & 32767;
}
function Hf(t) {
  return t >> 16;
}
function Yn(t, e) {
  let n = Hf(t),
    r = e;
  for (; n > 0; ) (r = r[Mt]), n--;
  return r;
}
var xi = !0;
function fa(t) {
  let e = xi;
  return (xi = t), e;
}
var Gf = 256,
  Iu = Gf - 1,
  bu = 5,
  zf = 0,
  ve = {};
function Wf(t, e, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(kt) && (r = n[kt]),
    r == null && (r = n[kt] = zf++);
  let i = r & Iu,
    o = 1 << i;
  e.data[t + (i >> bu)] |= o;
}
function Qn(t, e) {
  let n = Mu(t, e);
  if (n !== -1) return n;
  let r = e[C];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    ui(r.data, t),
    ui(e, null),
    ui(r.blueprint, null));
  let i = wo(t, e),
    o = t.injectorIndex;
  if (Eu(i)) {
    let s = Zn(i),
      a = Yn(i, e),
      u = a[C].data;
    for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | u[s + c];
  }
  return (e[o + 8] = i), o;
}
function ui(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Mu(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function wo(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = Au(i)), r === null)) return pt;
    if ((n++, (i = i[Mt]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return pt;
}
function Ti(t, e, n) {
  Wf(t, e, n);
}
function _u(t, e, n) {
  if (n & D.Optional || t !== void 0) return t;
  uo(e, "NodeInjector");
}
function Su(t, e, n, r) {
  if (
    (n & D.Optional && r === void 0 && (r = null), !(n & (D.Self | D.Host)))
  ) {
    let i = t[vt],
      o = ge(void 0);
    try {
      return i ? i.get(e, r, n & D.Optional) : $a(e, r, n & D.Optional);
    } finally {
      ge(o);
    }
  }
  return _u(r, e, n);
}
function xu(t, e, n, r = D.Default, i) {
  if (t !== null) {
    if (e[g] & 2048 && !(r & D.Self)) {
      let s = Kf(t, e, n, r, ve);
      if (s !== ve) return s;
    }
    let o = Tu(t, e, n, r, ve);
    if (o !== ve) return o;
  }
  return Su(e, n, r, i);
}
function Tu(t, e, n, r, i) {
  let o = Yf(n);
  if (typeof o == "function") {
    if (!gu(e, t, r)) return r & D.Host ? _u(i, n, r) : Su(e, n, r, i);
    try {
      let s;
      if (((s = o(r)), s == null && !(r & D.Optional))) uo(n);
      else return s;
    } finally {
      Du();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = Mu(t, e),
      u = pt,
      c = r & D.Host ? e[De][le] : null;
    for (
      (a === -1 || r & D.SkipSelf) &&
      ((u = a === -1 ? wo(t, e) : e[a + 8]),
      u === pt || !pa(r, !1)
        ? (a = -1)
        : ((s = e[C]), (a = Zn(u)), (e = Yn(u, e))));
      a !== -1;

    ) {
      let l = e[C];
      if (ha(o, a, l.data)) {
        let d = qf(a, e, n, s, r, c);
        if (d !== ve) return d;
      }
      (u = e[a + 8]),
        u !== pt && pa(r, e[C].data[a + 8] === c) && ha(o, a, e)
          ? ((s = l), (a = Zn(u)), (e = Yn(u, e)))
          : (a = -1);
    }
  }
  return i;
}
function qf(t, e, n, r, i, o) {
  let s = e[C],
    a = s.data[t + 8],
    u = r == null ? dr(a) && xi : r != s && (a.type & 3) !== 0,
    c = i & D.Host && o === a,
    l = Zf(a, s, n, u, c);
  return l !== null ? Ct(e, s, l, a) : ve;
}
function Zf(t, e, n, r, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    u = t.directiveStart,
    c = t.directiveEnd,
    l = o >> 20,
    d = r ? a : a + l,
    f = i ? a + l : c;
  for (let h = d; h < f; h++) {
    let p = s[h];
    if ((h < u && n === p) || (h >= u && p.type === n)) return h;
  }
  if (i) {
    let h = s[u];
    if (h && Re(h) && h.type === n) return u;
  }
  return null;
}
function Ct(t, e, n, r) {
  let i = t[n],
    o = e.data;
  if ($f(i)) {
    let s = i;
    s.resolving && Od(Nd(o[n]));
    let a = fa(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? ge(s.injectImpl) : null,
      l = gu(t, r, D.Default);
    try {
      (i = t[n] = s.factory(void 0, o, t, r)),
        e.firstCreatePass && n >= r.directiveStart && Vf(n, o[n], e);
    } finally {
      c !== null && ge(c), fa(a), (s.resolving = !1), Du();
    }
  }
  return i;
}
function Yf(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(kt) ? t[kt] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Iu : Qf) : e;
}
function ha(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> bu)] & r);
}
function pa(t, e) {
  return !(t & D.Self) && !(t & D.Host && e);
}
var ze = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return xu(this._tNode, this._lView, e, ur(r), n);
  }
};
function Qf() {
  return new ze(J(), A());
}
function Eo(t) {
  return Zt(() => {
    let e = t.prototype.constructor,
      n = e[Un] || Ai(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let o = i[Un] || Ai(i);
      if (o && o !== n) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Ai(t) {
  return ka(t)
    ? () => {
        let e = Ai(V(t));
        return e && e();
      }
    : Dt(t);
}
function Kf(t, e, n, r, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[g] & 2048 && !(s[g] & 512); ) {
    let a = Tu(o, s, n, r | D.Self, ve);
    if (a !== ve) return a;
    let u = o.parent;
    if (!u) {
      let c = s[Ka];
      if (c) {
        let l = c.get(n, ve, r);
        if (l !== ve) return l;
      }
      (u = Au(s)), (s = s[Mt]);
    }
    o = u;
  }
  return i;
}
function Au(t) {
  let e = t[C],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[le] : null;
}
var Fn = "__parameters__";
function Jf(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function Nu(t, e, n) {
  return Zt(() => {
    let r = Jf(e);
    function i(...o) {
      if (this instanceof i) return r.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(u, c, l) {
        let d = u.hasOwnProperty(Fn)
          ? u[Fn]
          : Object.defineProperty(u, Fn, { value: [] })[Fn];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), u;
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
function Xf(t) {
  return typeof t == "function";
}
function Io(t, e) {
  t.forEach((n) => (Array.isArray(n) ? Io(n, e) : e(n)));
}
function Ou(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function Kn(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function eh(t, e) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(e);
  return n;
}
function th(t, e, n, r) {
  let i = t.length;
  if (i == e) t.push(n, r);
  else if (i === 1) t.push(r, t[0]), (t[0] = n);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = n), (t[e + 1] = r);
  }
}
function bo(t, e, n) {
  let r = Qt(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), th(t, r, e, n)), r;
}
function ci(t, e) {
  let n = Qt(t, e);
  if (n >= 0) return t[n | 1];
}
function Qt(t, e) {
  return nh(t, e, 1);
}
function nh(t, e, n) {
  let r = 0,
    i = t.length >> n;
  for (; i !== r; ) {
    let o = r + ((i - r) >> 1),
      s = t[o << n];
    if (e === s) return o << n;
    s > e ? (i = o) : (r = o + 1);
  }
  return ~(i << n);
}
var hr = Ba(Nu("Optional"), 8);
var Mo = Ba(Nu("SkipSelf"), 4);
var Kt = new E("ENVIRONMENT_INITIALIZER"),
  Ru = new E("INJECTOR", -1),
  Fu = new E("INJECTOR_DEF_TYPES"),
  Jn = class {
    get(e, n = $t) {
      if (n === $t) {
        let r = new Error(`NullInjectorError: No provider for ${W(e)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  };
function _o(t) {
  return { ɵproviders: t };
}
function rh(...t) {
  return { ɵproviders: Pu(!0, t), ɵfromNgModule: !0 };
}
function Pu(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    o = (s) => {
      n.push(s);
    };
  return (
    Io(e, (s) => {
      let a = s;
      Ni(a, o, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && ku(i, o),
    n
  );
}
function ku(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    So(i, (o) => {
      e(o, r);
    });
  }
}
function Ni(t, e, n, r) {
  if (((t = V(t)), !t)) return !1;
  let i = null,
    o = na(t),
    s = !o && mt(t);
  if (!o && !s) {
    let u = t.ngModule;
    if (((o = na(u)), o)) i = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = r.has(i);
  if (s) {
    if (a) return !1;
    if ((r.add(i), s.dependencies)) {
      let u =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of u) Ni(c, e, n, r);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      r.add(i);
      let c;
      try {
        Io(o.imports, (l) => {
          Ni(l, e, n, r) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && ku(c, e);
    }
    if (!a) {
      let c = Dt(i) || (() => new i());
      e({ provide: i, useFactory: c, deps: z }, i),
        e({ provide: Fu, useValue: i, multi: !0 }, i),
        e({ provide: Kt, useValue: () => I(i), multi: !0 }, i);
    }
    let u = o.providers;
    if (u != null && !a) {
      let c = t;
      So(u, (l) => {
        e(l, c);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function So(t, e) {
  for (let n of t)
    La(n) && (n = n.ɵproviders), Array.isArray(n) ? So(n, e) : e(n);
}
var ih = _({ provide: String, useValue: _ });
function Lu(t) {
  return t !== null && typeof t == "object" && ih in t;
}
function oh(t) {
  return !!(t && t.useExisting);
}
function sh(t) {
  return !!(t && t.useFactory);
}
function wt(t) {
  return typeof t == "function";
}
function ah(t) {
  return !!t.useClass;
}
var pr = new E("Set Injector scope."),
  jn = {},
  uh = {},
  li;
function xo() {
  return li === void 0 && (li = new Jn()), li;
}
var ce = class {},
  Xn = class extends ce {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Ri(e, (s) => this.processProvider(s)),
        this.records.set(Ru, ft(void 0, this)),
        i.has("environment") && this.records.set(ce, ft(void 0, this));
      let o = this.records.get(pr);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Fu, z, D.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of e) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let n = lt(this),
        r = ge(void 0),
        i;
      try {
        return e();
      } finally {
        lt(n), ge(r);
      }
    }
    get(e, n = $t, r = D.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(ea))) return e[ea](this);
      r = ur(r);
      let i,
        o = lt(this),
        s = ge(void 0);
      try {
        if (!(r & D.SkipSelf)) {
          let u = this.records.get(e);
          if (u === void 0) {
            let c = hh(e) && co(e);
            c && this.injectableDefInScope(c)
              ? (u = ft(Oi(e), jn))
              : (u = null),
              this.records.set(e, u);
          }
          if (u != null) return this.hydrate(e, u);
        }
        let a = r & D.Self ? xo() : this.parent;
        return (n = r & D.Optional && n === $t ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Hn] = a[Hn] || []).unshift(W(e)), o)) throw a;
          return Gd(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ge(s), lt(o);
      }
    }
    resolveInjectorInitializers() {
      let e = lt(this),
        n = ge(void 0),
        r;
      try {
        let i = this.get(Kt, z, D.Self);
        for (let o of i) o();
      } finally {
        lt(e), ge(n);
      }
    }
    toString() {
      let e = [],
        n = this.records;
      for (let r of n.keys()) e.push(W(r));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new m(205, !1);
    }
    processProvider(e) {
      e = V(e);
      let n = wt(e) ? e : V(e && e.provide),
        r = lh(e);
      if (!wt(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = ft(void 0, jn, !0)),
          (i.factory = () => bi(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e);
      } else {
        let i = this.records.get(n);
      }
      this.records.set(n, r);
    }
    hydrate(e, n) {
      return (
        n.value === jn && ((n.value = uh), (n.value = n.factory())),
        typeof n.value == "object" &&
          n.value &&
          fh(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let n = V(e.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Oi(t) {
  let e = co(t),
    n = e !== null ? e.factory : Dt(t);
  if (n !== null) return n;
  if (t instanceof E) throw new m(204, !1);
  if (t instanceof Function) return ch(t);
  throw new m(204, !1);
}
function ch(t) {
  let e = t.length;
  if (e > 0) {
    let r = eh(e, "?");
    throw new m(204, !1);
  }
  let n = Pd(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function lh(t) {
  if (Lu(t)) return ft(void 0, t.useValue);
  {
    let e = Vu(t);
    return ft(e, jn);
  }
}
function Vu(t, e, n) {
  let r;
  if (wt(t)) {
    let i = V(t);
    return Dt(i) || Oi(i);
  } else if (Lu(t)) r = () => V(t.useValue);
  else if (sh(t)) r = () => t.useFactory(...bi(t.deps || []));
  else if (oh(t)) r = () => I(V(t.useExisting));
  else {
    let i = V(t && (t.useClass || t.provide));
    if (dh(t)) r = () => new i(...bi(t.deps));
    else return Dt(i) || Oi(i);
  }
  return r;
}
function ft(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function dh(t) {
  return !!t.deps;
}
function fh(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function hh(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof E);
}
function Ri(t, e) {
  for (let n of t)
    Array.isArray(n) ? Ri(n, e) : n && La(n) ? Ri(n.ɵproviders, e) : e(n);
}
function ga(t, e = null, n = null, r) {
  let i = ph(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function ph(t, e = null, n = null, r, i = new Set()) {
  let o = [n || z, rh(t)];
  return (
    (r = r || (typeof t == "object" ? void 0 : W(t))),
    new Xn(o, e || xo(), r || null, i)
  );
}
var St = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return ga({ name: "" }, i, r, "");
      {
        let o = r.name ?? "";
        return ga({ name: o }, r.parent, r.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = $t),
    (e.NULL = new Jn()),
    (e.ɵprov = x({ token: e, providedIn: "any", factory: () => I(Ru) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var Fi;
function ju(t) {
  Fi = t;
}
function gh() {
  if (Fi !== void 0) return Fi;
  if (typeof document < "u") return document;
  throw new m(210, !1);
}
var To = new E("AppId", { providedIn: "root", factory: () => mh }),
  mh = "ng",
  Ao = new E("Platform Initializer"),
  xt = new E("Platform ID", {
    providedIn: "platform",
    factory: () => "unknown",
  });
var No = new E("CSP nonce", {
  providedIn: "root",
  factory: () =>
    gh().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
function $u(t) {
  return (t.flags & 128) === 128;
}
var be = (function (t) {
  return (
    (t[(t.Important = 1)] = "Important"), (t[(t.DashCase = 2)] = "DashCase"), t
  );
})(be || {});
var Bu = new Map(),
  vh = 0;
function yh() {
  return vh++;
}
function Dh(t) {
  Bu.set(t[lr], t);
}
function Ch(t) {
  Bu.delete(t[lr]);
}
var ma = "__ngContext__";
function Qe(t, e) {
  Ne(e) ? ((t[ma] = e[lr]), Dh(e)) : (t[ma] = e);
}
var wh;
function Oo(t, e) {
  return wh(t, e);
}
function Ro(t) {
  let e = t[R];
  return ue(e) ? e[R] : e;
}
function Uu(t) {
  return Gu(t[Gt]);
}
function Hu(t) {
  return Gu(t[se]);
}
function Gu(t) {
  for (; t !== null && !ue(t); ) t = t[se];
  return t;
}
function ht(t, e, n, r, i) {
  if (r != null) {
    let o,
      s = !1;
    ue(r) ? (o = r) : Ne(r) && ((s = !0), (r = r[_e]));
    let a = Ce(r);
    t === 0 && n !== null
      ? i == null
        ? Zu(e, n, a)
        : er(e, n, a, i || null, !0)
      : t === 1 && n !== null
      ? er(e, n, a, i || null, !0)
      : t === 2
      ? Vh(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && $h(e, t, o, n, i);
  }
}
function Eh(t, e) {
  return t.createText(e);
}
function zu(t, e, n) {
  return t.createElement(e, n);
}
function Ih(t, e) {
  let n = e[k];
  Jt(t, e, n, 2, null, null), (e[_e] = null), (e[le] = null);
}
function bh(t, e, n, r, i, o) {
  (r[_e] = i), (r[le] = e), Jt(t, r, n, 1, i, o);
}
function Mh(t, e) {
  Jt(t, e, e[k], 2, null, null);
}
function _h(t) {
  let e = t[Gt];
  if (!e) return di(t[C], t);
  for (; e; ) {
    let n = null;
    if (Ne(e)) n = e[Gt];
    else {
      let r = e[K];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[se] && e !== t; ) Ne(e) && di(e[C], e), (e = e[R]);
      e === null && (e = t), Ne(e) && di(e[C], e), (n = e && e[se]);
    }
    e = n;
  }
}
function Sh(t, e, n, r) {
  let i = K + r,
    o = n.length;
  r > 0 && (n[i - 1][se] = e),
    r < o - K ? ((e[se] = n[i]), Ou(n, K + r, e)) : (n.push(e), (e[se] = null)),
    (e[R] = n);
  let s = e[cr];
  s !== null && n !== s && xh(s, e);
  let a = e[zt];
  a !== null && a.insertView(t), au(e), (e[g] |= 128);
}
function xh(t, e) {
  let n = t[Wn],
    i = e[R][R][De];
  e[De] !== i && (t[g] |= yt.HasTransplantedViews),
    n === null ? (t[Wn] = [e]) : n.push(e);
}
function Wu(t, e) {
  let n = t[Wn],
    r = n.indexOf(e),
    i = e[R];
  n.splice(r, 1);
}
function Pi(t, e) {
  if (t.length <= K) return;
  let n = K + e,
    r = t[n];
  if (r) {
    let i = r[cr];
    i !== null && i !== t && Wu(i, r), e > 0 && (t[n - 1][se] = r[se]);
    let o = Kn(t, K + e);
    Ih(r[C], r);
    let s = o[zt];
    s !== null && s.detachView(o[C]),
      (r[R] = null),
      (r[se] = null),
      (r[g] &= -129);
  }
  return r;
}
function qu(t, e) {
  if (!(e[g] & 256)) {
    let n = e[k];
    n.destroyNode && Jt(t, e, n, 3, null, null), _h(e);
  }
}
function di(t, e) {
  if (!(e[g] & 256)) {
    (e[g] &= -129),
      (e[g] |= 256),
      e[We] && _s(e[We]),
      Ah(t, e),
      Th(t, e),
      e[C].type === 1 && e[k].destroy();
    let n = e[cr];
    if (n !== null && ue(e[R])) {
      n !== e[R] && Wu(n, e);
      let r = e[zt];
      r !== null && r.detachView(t);
    }
    Ch(e);
  }
}
function Th(t, e) {
  let n = t.cleanup,
    r = e[Ut];
  if (n !== null)
    for (let o = 0; o < n.length - 1; o += 2)
      if (typeof n[o] == "string") {
        let s = n[o + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
      } else {
        let s = r[n[o + 1]];
        n[o].call(s);
      }
  r !== null && (e[Ut] = null);
  let i = e[jt];
  if (i !== null) {
    e[jt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Ah(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof Ye)) {
        let o = n[r + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              u = o[s + 1];
            me(4, a, u);
            try {
              u.call(a);
            } finally {
              me(5, a, u);
            }
          }
        else {
          me(4, i, o);
          try {
            o.call(i);
          } finally {
            me(5, i, o);
          }
        }
      }
    }
}
function Nh(t, e, n) {
  return Oh(t, e.parent, n);
}
function Oh(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[_e];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: o } = t.data[r.directiveStart + i];
      if (o === ye.None || o === ye.Emulated) return null;
    }
    return de(r, n);
  }
}
function er(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function Zu(t, e, n) {
  t.appendChild(e, n);
}
function va(t, e, n, r, i) {
  r !== null ? er(t, e, n, r, i) : Zu(t, e, n);
}
function Rh(t, e, n, r) {
  t.removeChild(e, n, r);
}
function Fo(t, e) {
  return t.parentNode(e);
}
function Fh(t, e) {
  return t.nextSibling(e);
}
function Ph(t, e, n) {
  return Lh(t, e, n);
}
function kh(t, e, n) {
  return t.type & 40 ? de(t, n) : null;
}
var Lh = kh,
  ya;
function Po(t, e, n, r) {
  let i = Nh(t, r, e),
    o = e[k],
    s = r.parent || e[le],
    a = Ph(s, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) va(o, i, n[u], a, !1);
    else va(o, i, n, a, !1);
  ya !== void 0 && ya(o, r, e, n, i);
}
function $n(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return de(e, t);
    if (n & 4) return ki(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return $n(t, r);
      {
        let i = t[e.index];
        return ue(i) ? ki(-1, i) : Ce(i);
      }
    } else {
      if (n & 32) return Oo(e, t)() || Ce(t[e.index]);
      {
        let r = Yu(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = Ro(t[De]);
          return $n(i, r);
        } else return $n(t, e.next);
      }
    }
  }
  return null;
}
function Yu(t, e) {
  if (e !== null) {
    let r = t[De][le],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function ki(t, e) {
  let n = K + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[C].firstChild;
    if (i !== null) return $n(r, i);
  }
  return e[qe];
}
function Vh(t, e, n) {
  let r = Fo(t, e);
  r && Rh(t, r, e, n);
}
function ko(t, e, n, r, i, o, s) {
  for (; n != null; ) {
    let a = r[n.index],
      u = n.type;
    if (
      (s && e === 0 && (a && Qe(Ce(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) ko(t, e, n.child, r, i, o, !1), ht(e, t, i, a, o);
      else if (u & 32) {
        let c = Oo(n, r),
          l;
        for (; (l = c()); ) ht(e, t, i, l, o);
        ht(e, t, i, a, o);
      } else u & 16 ? jh(t, e, r, n, i, o) : ht(e, t, i, a, o);
    n = s ? n.projectionNext : n.next;
  }
}
function Jt(t, e, n, r, i, o) {
  ko(n, r, t.firstChild, e, i, o, !1);
}
function jh(t, e, n, r, i, o) {
  let s = n[De],
    u = s[le].projection[r.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      ht(e, t, i, l, o);
    }
  else {
    let c = u,
      l = s[R];
    $u(r) && (c.flags |= 128), ko(t, e, c, l, i, o, !0);
  }
}
function $h(t, e, n, r, i) {
  let o = n[qe],
    s = Ce(n);
  o !== s && ht(e, t, r, o, i);
  for (let a = K; a < n.length; a++) {
    let u = n[a];
    Jt(u[C], u, t, e, r, o);
  }
}
function Bh(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let o = r.indexOf("-") === -1 ? void 0 : be.DashCase;
    i == null
      ? t.removeStyle(n, r, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= be.Important)),
        t.setStyle(n, r, i, o));
  }
}
function Uh(t, e, n) {
  t.setAttribute(e, "style", n);
}
function Qu(t, e, n) {
  n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n);
}
function Ku(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: o } = n;
  r !== null && Mi(t, e, r),
    i !== null && Qu(t, e, i),
    o !== null && Uh(t, e, o);
}
var Li = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${_d})`;
  }
};
function gr(t) {
  return t instanceof Li ? t.changingThisBreaksApplicationSecurity : t;
}
var Hh = "h",
  Gh = "b";
var zh = (t, e, n) => null;
function Lo(t, e, n = !1) {
  return zh(t, e, n);
}
var Vi = class {},
  tr = class {};
function Wh(t) {
  let e = Error(`No component factory found for ${W(t)}.`);
  return (e[qh] = t), e;
}
var qh = "ngComponent";
var ji = class {
    resolveComponentFactory(e) {
      throw Wh(e);
    }
  },
  Vo = (() => {
    let e = class e {};
    e.NULL = new ji();
    let t = e;
    return t;
  })();
function Zh() {
  return mr(J(), A());
}
function mr(t, e) {
  return new Le(de(t, e));
}
var Le = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = Zh;
  let t = e;
  return t;
})();
var Wt = class {},
  tt = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => Yh();
    let t = e;
    return t;
  })();
function Yh() {
  let t = A(),
    e = J(),
    n = ke(e.index, t);
  return (Ne(n) ? n : t)[k];
}
var Qh = (() => {
    let e = class e {};
    e.ɵprov = x({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  Ke = class {
    constructor(e) {
      (this.full = e),
        (this.major = e.split(".")[0]),
        (this.minor = e.split(".")[1]),
        (this.patch = e.split(".").slice(2).join("."));
    }
  },
  Kh = new Ke("17.0.7"),
  fi = {};
function Ju(t) {
  return jo(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function Jh(t, e) {
  if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]);
  else {
    let n = t[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) e(r.value);
  }
}
function jo(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
var $i = class {
    constructor() {}
    supports(e) {
      return Ju(e);
    }
    create(e) {
      return new Bi(e);
    }
  },
  Xh = (t, e) => e,
  Bi = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || Xh);
    }
    forEachItem(e) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) e(n);
    }
    forEachOperation(e) {
      let n = this._itHead,
        r = this._removalsHead,
        i = 0,
        o = null;
      for (; n || r; ) {
        let s = !r || (n && n.currentIndex < Da(r, i, o)) ? n : r,
          a = Da(s, i, o),
          u = s.currentIndex;
        if (s === r) i--, (r = r._nextRemoved);
        else if (((n = n._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let c = a - i,
            l = u - i;
          if (c != l) {
            for (let f = 0; f < c; f++) {
              let h = f < o.length ? o[f] : (o[f] = 0),
                p = h + f;
              l <= p && p < c && (o[f] = h + 1);
            }
            let d = s.previousIndex;
            o[d] = l - c;
          }
        }
        a !== u && e(s, a, u);
      }
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachMovedItem(e) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    forEachIdentityChange(e) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        e(n);
    }
    diff(e) {
      if ((e == null && (e = []), !Ju(e))) throw new m(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._itHead,
        r = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, o, s, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, o, s, a)),
                Object.is(n.item, o) || this._addIdentityChange(n, o)),
            (n = n._next);
      } else
        (i = 0),
          Jh(e, (a) => {
            (s = this._trackByFn(i, a)),
              n === null || !Object.is(n.trackById, s)
                ? ((n = this._mismatch(n, a, s, i)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, s, i)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(n), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, n, r, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        e !== null
          ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, i)),
            e !== null
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Ui(n, r), o, i))),
        e
      );
    }
    _verifyReinsertion(e, n, r, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let n = e._next;
        this._addToRemovals(this._unlink(e)), (e = n);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, n, r),
        this._addToMoves(e, r),
        e
      );
    }
    _moveAfter(e, n, r) {
      return (
        this._unlink(e), this._insertAfter(e, n, r), this._addToMoves(e, r), e
      );
    }
    _addAfter(e, n, r) {
      return (
        this._insertAfter(e, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, n, r) {
      let i = n === null ? this._itHead : n._next;
      return (
        (e._next = i),
        (e._prev = n),
        i === null ? (this._itTail = e) : (i._prev = e),
        n === null ? (this._itHead = e) : (n._next = e),
        this._linkedRecords === null && (this._linkedRecords = new nr()),
        this._linkedRecords.put(e),
        (e.currentIndex = r),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let n = e._prev,
        r = e._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        e
      );
    }
    _addToMoves(e, n) {
      return (
        e.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new nr()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, n) {
      return (
        (e.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Ui = class {
    constructor(e, n) {
      (this.item = e),
        (this.trackById = n),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Hi = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, e))
          return r;
      return null;
    }
    remove(e) {
      let n = e._prevDup,
        r = e._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  nr = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let n = e.trackById,
        r = this.map.get(n);
      r || ((r = new Hi()), this.map.set(n, r)), r.add(e);
    }
    get(e, n) {
      let r = e,
        i = this.map.get(r);
      return i ? i.get(e, n) : null;
    }
    remove(e) {
      let n = e.trackById;
      return this.map.get(n).remove(e) && this.map.delete(n), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Da(t, e, n) {
  let r = t.previousIndex;
  if (r === null) return r;
  let i = 0;
  return n && r < n.length && (i = n[r]), r + e + i;
}
var Gi = class {
    constructor() {}
    supports(e) {
      return e instanceof Map || jo(e);
    }
    create() {
      return new zi();
    }
  },
  zi = class {
    constructor() {
      (this._records = new Map()),
        (this._mapHead = null),
        (this._appendAfter = null),
        (this._previousMapHead = null),
        (this._changesHead = null),
        (this._changesTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(e) {
      let n;
      for (n = this._mapHead; n !== null; n = n._next) e(n);
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousMapHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachChangedItem(e) {
      let n;
      for (n = this._changesHead; n !== null; n = n._nextChanged) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    diff(e) {
      if (!e) e = new Map();
      else if (!(e instanceof Map || jo(e))) throw new m(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(e, (r, i) => {
          if (n && n.key === i)
            this._maybeAddToChanges(n, r),
              (this._appendAfter = n),
              (n = n._next);
          else {
            let o = this._getOrCreateRecordForKey(i, r);
            n = this._insertBeforeOrAppend(n, o);
          }
        }),
        n)
      ) {
        n._prev && (n._prev._next = null), (this._removalsHead = n);
        for (let r = n; r !== null; r = r._nextRemoved)
          r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null);
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(e, n) {
      if (e) {
        let r = e._prev;
        return (
          (n._next = e),
          (n._prev = r),
          (e._prev = n),
          r && (r._next = n),
          e === this._mapHead && (this._mapHead = n),
          (this._appendAfter = e),
          e
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
          : (this._mapHead = n),
        (this._appendAfter = n),
        null
      );
    }
    _getOrCreateRecordForKey(e, n) {
      if (this._records.has(e)) {
        let i = this._records.get(e);
        this._maybeAddToChanges(i, n);
        let o = i._prev,
          s = i._next;
        return (
          o && (o._next = s),
          s && (s._prev = o),
          (i._next = null),
          (i._prev = null),
          i
        );
      }
      let r = new Wi(e);
      return (
        this._records.set(e, r),
        (r.currentValue = n),
        this._addToAdditions(r),
        r
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (
          this._previousMapHead = this._mapHead, e = this._previousMapHead;
          e !== null;
          e = e._next
        )
          e._nextPrevious = e._next;
        for (e = this._changesHead; e !== null; e = e._nextChanged)
          e.previousValue = e.currentValue;
        for (e = this._additionsHead; e != null; e = e._nextAdded)
          e.previousValue = e.currentValue;
        (this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null);
      }
    }
    _maybeAddToChanges(e, n) {
      Object.is(n, e.currentValue) ||
        ((e.previousValue = e.currentValue),
        (e.currentValue = n),
        this._addToChanges(e));
    }
    _addToAdditions(e) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = e)
        : ((this._additionsTail._nextAdded = e), (this._additionsTail = e));
    }
    _addToChanges(e) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = e)
        : ((this._changesTail._nextChanged = e), (this._changesTail = e));
    }
    _forEach(e, n) {
      e instanceof Map
        ? e.forEach(n)
        : Object.keys(e).forEach((r) => n(e[r], r));
    }
  },
  Wi = class {
    constructor(e) {
      (this.key = e),
        (this.previousValue = null),
        (this.currentValue = null),
        (this._nextPrevious = null),
        (this._next = null),
        (this._prev = null),
        (this._nextAdded = null),
        (this._nextRemoved = null),
        (this._nextChanged = null);
    }
  };
function Ca() {
  return new $o([new $i()]);
}
var $o = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i != null) {
        let o = i.factories.slice();
        r = r.concat(o);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || Ca()),
        deps: [[e, new Mo(), new hr()]],
      };
    }
    find(r) {
      let i = this.factories.find((o) => o.supports(r));
      if (i != null) return i;
      throw new m(901, !1);
    }
  };
  e.ɵprov = x({ token: e, providedIn: "root", factory: Ca });
  let t = e;
  return t;
})();
function wa() {
  return new Bo([new Gi()]);
}
var Bo = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i) {
        let o = i.factories.slice();
        r = r.concat(o);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || wa()),
        deps: [[e, new Mo(), new hr()]],
      };
    }
    find(r) {
      let i = this.factories.find((o) => o.supports(r));
      if (i) return i;
      throw new m(901, !1);
    }
  };
  e.ɵprov = x({ token: e, providedIn: "root", factory: wa });
  let t = e;
  return t;
})();
function rr(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let o = e[n.index];
    o !== null && r.push(Ce(o)), ue(o) && ep(o, r);
    let s = n.type;
    if (s & 8) rr(t, e, n.child, r);
    else if (s & 32) {
      let a = Oo(n, e),
        u;
      for (; (u = a()); ) r.push(u);
    } else if (s & 16) {
      let a = Yu(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let u = Ro(e[De]);
        rr(u[C], u, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function ep(t, e) {
  for (let n = K; n < t.length; n++) {
    let r = t[n],
      i = r[C].firstChild;
    i !== null && rr(r[C], r, i, e);
  }
  t[qe] !== t[_e] && e.push(t[qe]);
}
var Xu = [];
function tp(t) {
  return t[We] ?? np(t);
}
function np(t) {
  let e = Xu.pop() ?? Object.create(ip);
  return (e.lView = t), e;
}
function rp(t) {
  t.lView[We] !== t && ((t.lView = null), Xu.push(t));
}
var ip = B(F({}, Is), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      fr(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[We] = this;
    },
  }),
  op = "ngOriginalError";
function hi(t) {
  return t[op];
}
var Me = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error("ERROR", e),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(e) {
      let n = e && hi(e);
      for (; n && hi(n); ) n = hi(n);
      return n || null;
    }
  },
  ec = new E("", {
    providedIn: "root",
    factory: () => T(Me).handleError.bind(void 0),
  });
var tc = !1,
  sp = new E("", { providedIn: "root", factory: () => tc });
var nt = {};
function Se(t) {
  nc(fe(), A(), _t() + t, !1);
}
function nc(t, e, n, r) {
  if (!r)
    if ((e[g] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && Ln(e, o, n);
    } else {
      let o = t.preOrderHooks;
      o !== null && Vn(e, o, 0, n);
    }
  Ze(n);
}
function M(t, e = D.Default) {
  let n = A();
  if (n === null) return I(t, e);
  let r = J();
  return xu(r, n, V(t), e);
}
function ap(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) Ze(~i);
        else {
          let o = i,
            s = n[++r],
            a = n[++r];
          Af(s, o);
          let u = e[o];
          a(2, u);
        }
      }
    } finally {
      Ze(-1);
    }
}
function vr(t, e, n, r, i, o, s, a, u, c, l) {
  let d = e.blueprint.slice();
  return (
    (d[_e] = i),
    (d[g] = r | 4 | 128 | 8),
    (c !== null || (t && t[g] & 2048)) && (d[g] |= 2048),
    ou(d),
    (d[R] = d[Mt] = t),
    (d[ae] = n),
    (d[Ht] = s || (t && t[Ht])),
    (d[k] = a || (t && t[k])),
    (d[vt] = u || (t && t[vt]) || null),
    (d[le] = o),
    (d[lr] = yh()),
    (d[Gn] = l),
    (d[Ka] = c),
    (d[De] = e.type == 2 ? t[De] : d),
    d
  );
}
function yr(t, e, n, r, i) {
  let o = t.data[e];
  if (o === null) (o = up(t, e, n, r, i)), Tf() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = n), (o.value = r), (o.attrs = i);
    let s = bf();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Yt(o, !0), o;
}
function up(t, e, n, r, i) {
  let o = du(),
    s = fu(),
    a = s ? o : o && o.parent,
    u = (t.data[e] = hp(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = u),
    o !== null &&
      (s
        ? o.child == null && u.parent !== null && (o.child = u)
        : o.next === null && ((o.next = u), (u.prev = o))),
    u
  );
}
function rc(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let o = 0; o < n; o++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function ic(t, e, n, r, i) {
  let o = _t(),
    s = r & 2;
  try {
    Ze(-1), s && e.length > Oe && nc(t, e, Oe, !1), me(s ? 2 : 0, i), n(r, i);
  } finally {
    Ze(o), me(s ? 3 : 1, i);
  }
}
function oc(t, e, n) {
  if (Xa(e)) {
    let r = Z(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        a.contentQueries && a.contentQueries(1, n[s], s);
      }
    } finally {
      Z(r);
    }
  }
}
function sc(t, e, n) {
  uu() && (Cp(t, e, n, de(n, e)), (n.flags & 64) === 64 && dc(t, e, n));
}
function ac(t, e, n = de) {
  let r = e.localNames;
  if (r !== null) {
    let i = e.index + 1;
    for (let o = 0; o < r.length; o += 2) {
      let s = r[o + 1],
        a = s === -1 ? n(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function uc(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Uo(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function Uo(t, e, n, r, i, o, s, a, u, c, l) {
  let d = Oe + r,
    f = d + i,
    h = cp(d, f),
    p = typeof c == "function" ? c() : c;
  return (h[C] = {
    type: t,
    blueprint: h,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: u,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function cp(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : nt);
  return n;
}
function lp(t, e, n, r) {
  let o = r.get(sp, tc) || n === ye.ShadowDom,
    s = t.selectRootElement(e, o);
  return dp(s), s;
}
function dp(t) {
  fp(t);
}
var fp = (t) => null;
function hp(t, e, n, r, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    wf() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Ea(t, e, n, r) {
  for (let i in t)
    if (t.hasOwnProperty(i)) {
      n = n === null ? {} : n;
      let o = t[i];
      r === null ? Ia(n, e, i, o) : r.hasOwnProperty(i) && Ia(n, e, r[i], o);
    }
  return n;
}
function Ia(t, e, n, r) {
  t.hasOwnProperty(n) ? t[n].push(e, r) : (t[n] = [e, r]);
}
function pp(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = r; l < i; l++) {
    let d = o[l],
      f = n ? n.get(d) : null,
      h = f ? f.inputs : null,
      p = f ? f.outputs : null;
    (u = Ea(d.inputs, l, u, h)), (c = Ea(d.outputs, l, c, p));
    let y = u !== null && s !== null && !za(e) ? Tp(u, l, s) : null;
    a.push(y);
  }
  u !== null &&
    (u.hasOwnProperty("class") && (e.flags |= 8),
    u.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = u),
    (e.outputs = c);
}
function gp(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function mp(t, e, n, r, i, o, s, a) {
  let u = de(e, n),
    c = e.inputs,
    l;
  !a && c != null && (l = c[r])
    ? (Ho(t, n, l, r, i), dr(e) && vp(n, e.index))
    : e.type & 3
    ? ((r = gp(r)),
      (i = s != null ? s(i, e.value || "", r) : i),
      o.setProperty(u, r, i))
    : e.type & 12;
}
function vp(t, e) {
  let n = ke(e, t);
  n[g] & 16 || (n[g] |= 64);
}
function cc(t, e, n, r) {
  if (uu()) {
    let i = r === null ? null : { "": -1 },
      o = Ep(t, n),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && lc(t, e, n, s, i, a),
      i && Ip(n, r, i);
  }
  n.mergedAttrs = Bt(n.mergedAttrs, n.attrs);
}
function lc(t, e, n, r, i, o) {
  for (let c = 0; c < r.length; c++) Ti(Qn(n, e), t, r[c].type);
  Mp(n, t.data.length, r.length);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = rc(t, e, r.length, null);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    (n.mergedAttrs = Bt(n.mergedAttrs, l.hostAttrs)),
      _p(t, n, e, u, l),
      bp(u, l, i),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      u++;
  }
  pp(t, n, o);
}
function yp(t, e, n, r, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    Dp(s) != a && s.push(a), s.push(n, r, o);
  }
}
function Dp(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function Cp(t, e, n, r) {
  let i = n.directiveStart,
    o = n.directiveEnd;
  dr(n) && Sp(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || Qn(n, e),
    Qe(r, e);
  let s = n.initialInputs;
  for (let a = i; a < o; a++) {
    let u = t.data[a],
      c = Ct(e, t, a, n);
    if ((Qe(c, e), s !== null && xp(e, a - i, c, u, n, s), Re(u))) {
      let l = ke(n.index, e);
      l[ae] = Ct(e, t, a, n);
    }
  }
}
function dc(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    o = n.index,
    s = Nf();
  try {
    Ze(o);
    for (let a = r; a < i; a++) {
      let u = t.data[a],
        c = e[a];
      Si(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          wp(u, c);
    }
  } finally {
    Ze(-1), Si(s);
  }
}
function wp(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function Ep(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      if (Jd(e, s.selectors, !1))
        if ((r || (r = []), Re(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              r.unshift(...a, s);
            let u = a.length;
            qi(t, e, u);
          } else r.unshift(s), qi(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s);
    }
  return r === null ? null : [r, i];
}
function qi(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function Ip(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = n[e[i + 1]];
      if (o == null) throw new m(-301, !1);
      r.push(e[i], o);
    }
  }
}
function bp(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    Re(e) && (n[""] = t);
  }
}
function Mp(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function _p(t, e, n, r, i) {
  t.data[r] = i;
  let o = i.factory || (i.factory = Dt(i.type, !0)),
    s = new Ye(o, Re(i), M);
  (t.blueprint[r] = s), (n[r] = s), yp(t, e, r, rc(t, n, i.hostVars, nt), i);
}
function Sp(t, e, n) {
  let r = de(e, t),
    i = uc(n),
    o = t[Ht].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = Dr(
    t,
    vr(t, i, null, s, r, e, null, o.createRenderer(r, n), null, null, null)
  );
  t[e.index] = a;
}
function xp(t, e, n, r, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++];
      fc(r, n, u, c, l);
    }
}
function fc(t, e, n, r, i) {
  let o = Z(null);
  try {
    let s = t.inputTransforms;
    s !== null && s.hasOwnProperty(r) && (i = s[r].call(e, i)),
      t.setInput !== null ? t.setInput(e, i, n, r) : (e[r] = i);
  } finally {
    Z(o);
  }
}
function Tp(t, e, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      r === null && (r = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 2)
        if (s[a] === e) {
          r.push(o, s[a + 1], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function hc(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function pc(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = Z(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let o = n[i],
          s = n[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          pu(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      Z(r);
    }
  }
}
function Dr(t, e) {
  return t[Gt] ? (t[ca][se] = e) : (t[Gt] = e), (t[ca] = e), e;
}
function Zi(t, e, n) {
  pu(0);
  let r = Z(null);
  try {
    e(t, n);
  } finally {
    Z(r);
  }
}
function Ap(t) {
  return t[Ut] || (t[Ut] = []);
}
function Np(t) {
  return t.cleanup || (t.cleanup = []);
}
function gc(t, e) {
  let n = t[vt],
    r = n ? n.get(Me, null) : null;
  r && r.handleError(e);
}
function Ho(t, e, n, r, i) {
  for (let o = 0; o < n.length; ) {
    let s = n[o++],
      a = n[o++],
      u = e[s],
      c = t.data[s];
    fc(c, u, r, a, i);
  }
}
var Op = 100;
function Rp(t, e = !0) {
  let n = t[Ht],
    r = n.rendererFactory,
    i = n.afterRenderEventManager,
    o = !1;
  o || (r.begin?.(), i?.begin());
  try {
    Fp(t);
  } catch (s) {
    throw (e && gc(t, s), s);
  } finally {
    o || (r.end?.(), n.inlineEffectRunner?.flush(), i?.end());
  }
}
function Fp(t) {
  Yi(t, 0);
  let e = 0;
  for (; su(t); ) {
    if (e === Op) throw new m(103, !1);
    e++, Yi(t, 1);
  }
}
function Pp(t, e, n, r) {
  let i = e[g];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[Ht].inlineEffectRunner?.flush(), po(e);
  let s = null,
    a = null;
  !o && kp(t) && ((a = tp(e)), (s = bs(a)));
  try {
    ou(e), Sf(t.bindingStartIndex), n !== null && ic(t, e, n, 2, r);
    let u = (i & 3) === 3;
    if (!o)
      if (u) {
        let d = t.preOrderCheckHooks;
        d !== null && Ln(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && Vn(e, d, 0, null), ai(e, 0);
      }
    if ((Lp(e), mc(e, 0), t.contentQueries !== null && pc(t, e), !o))
      if (u) {
        let d = t.contentCheckHooks;
        d !== null && Ln(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && Vn(e, d, 1), ai(e, 1);
      }
    ap(t, e);
    let c = t.components;
    c !== null && yc(e, c, 0);
    let l = t.viewQuery;
    if ((l !== null && Zi(2, l, r), !o))
      if (u) {
        let d = t.viewCheckHooks;
        d !== null && Ln(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && Vn(e, d, 2), ai(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[si])) {
      for (let d of e[si]) d();
      e[si] = null;
    }
    o || (e[g] &= -73);
  } catch (u) {
    throw (fr(e), u);
  } finally {
    a !== null && (Ms(a, s), rp(a)), go();
  }
}
function kp(t) {
  return t.type !== 2;
}
function mc(t, e) {
  for (let n = Uu(t); n !== null; n = Hu(n)) {
    n[g] &= ~yt.HasChildViewsToRefresh;
    for (let r = K; r < n.length; r++) {
      let i = n[r];
      vc(i, e);
    }
  }
}
function Lp(t) {
  for (let e = Uu(t); e !== null; e = Hu(e)) {
    if (!(e[g] & yt.HasTransplantedViews)) continue;
    let n = e[Wn];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        o = i[R];
      gf(i);
    }
  }
}
function Vp(t, e, n) {
  let r = ke(e, t);
  vc(r, n);
}
function vc(t, e) {
  ho(t) && Yi(t, e);
}
function Yi(t, e) {
  let r = t[C],
    i = t[g],
    o = t[We],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && Ur(o))),
    o && (o.dirty = !1),
    (t[g] &= -9217),
    s)
  )
    Pp(r, t, r.template, t[ae]);
  else if (i & 8192) {
    mc(t, 1);
    let a = r.components;
    a !== null && yc(t, a, 1);
  }
}
function yc(t, e, n) {
  for (let r = 0; r < e.length; r++) Vp(t, e[r], n);
}
function Go(t) {
  for (; t; ) {
    t[g] |= 64;
    let e = Ro(t);
    if (uf(t) && !e) return t;
    t = e;
  }
  return null;
}
var Je = class {
    get rootNodes() {
      let e = this._lView,
        n = e[C];
      return rr(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[ae];
    }
    set context(e) {
      this._lView[ae] = e;
    }
    get destroyed() {
      return (this._lView[g] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[R];
        if (ue(e)) {
          let n = e[zn],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (Pi(e, r), Kn(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      qu(this._lView[C], this._lView);
    }
    onDestroy(e) {
      vf(this._lView, e);
    }
    markForCheck() {
      Go(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[g] &= -129;
    }
    reattach() {
      au(this._lView), (this._lView[g] |= 128);
    }
    detectChanges() {
      (this._lView[g] |= 1024), Rp(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new m(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Mh(this._lView[C], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new m(902, !1);
      this._appRef = e;
    }
  },
  Xt = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = jp;
    let t = e;
    return t;
  })();
function jp(t) {
  return $p(J(), A(), (t & 16) === 16);
}
function $p(t, e, n) {
  if (dr(t) && !n) {
    let r = ke(t.index, e);
    return new Je(r, r);
  } else if (t.type & 47) {
    let r = e[De];
    return new Je(r, e);
  }
  return null;
}
var ba = new Set();
function Dc(t) {
  ba.has(t) ||
    (ba.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var Qi = class extends Ie {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, n, r) {
    let i = e,
      o = n || (() => null),
      s = r;
    if (e && typeof e == "object") {
      let u = e;
      (i = u.next?.bind(u)), (o = u.error?.bind(u)), (s = u.complete?.bind(u));
    }
    this.__isAsync && ((o = pi(o)), i && (i = pi(i)), s && (s = pi(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof U && e.add(a), a;
  }
};
function pi(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var j = Qi;
function Ma(...t) {}
function Bp() {
  let t = typeof Lt.requestAnimationFrame == "function",
    e = Lt[t ? "requestAnimationFrame" : "setTimeout"],
    n = Lt[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && n) {
    let r = e[Zone.__symbol__("OriginalDelegate")];
    r && (e = r);
    let i = n[Zone.__symbol__("OriginalDelegate")];
    i && (n = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
}
var P = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new j(!1)),
        (this.onMicrotaskEmpty = new j(!1)),
        (this.onStable = new j(!1)),
        (this.onError = new j(!1)),
        typeof Zone > "u")
      )
        throw new m(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = Bp().nativeRequestAnimationFrame),
        Gp(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new m(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new m(909, !1);
    }
    run(e, n, r) {
      return this._inner.run(e, n, r);
    }
    runTask(e, n, r, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, Up, Ma, Ma);
      try {
        return o.runTask(s, n, r);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  Up = {};
function zo(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function Hp(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Lt,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Ki(t),
                (t.isCheckStableRunning = !0),
                zo(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Ki(t));
}
function Gp(t) {
  let e = () => {
    Hp(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, o, s, a) => {
      if (zp(a)) return n.invokeTask(i, o, s, a);
      try {
        return _a(t), n.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Sa(t);
      }
    },
    onInvoke: (n, r, i, o, s, a, u) => {
      try {
        return _a(t), n.invoke(i, o, s, a, u);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Sa(t);
      }
    },
    onHasTask: (n, r, i, o) => {
      n.hasTask(i, o),
        r === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), Ki(t), zo(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (n, r, i, o) => (
      n.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function Ki(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function _a(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function Sa(t) {
  t._nesting--, zo(t);
}
var Cc = new E("", { providedIn: "root", factory: wc });
function wc() {
  let t = T(P),
    e = !0,
    n = new S((i) => {
      (e = t.isStable && !t.hasPendingMacrotasks && !t.hasPendingMicrotasks),
        t.runOutsideAngular(() => {
          i.next(e), i.complete();
        });
    }),
    r = new S((i) => {
      let o;
      t.runOutsideAngular(() => {
        o = t.onStable.subscribe(() => {
          P.assertNotInAngularZone(),
            queueMicrotask(() => {
              !e &&
                !t.hasPendingMacrotasks &&
                !t.hasPendingMicrotasks &&
                ((e = !0), i.next(!0));
            });
        });
      });
      let s = t.onUnstable.subscribe(() => {
        P.assertInAngularZone(),
          e &&
            ((e = !1),
            t.runOutsideAngular(() => {
              i.next(!1);
            }));
      });
      return () => {
        o.unsubscribe(), s.unsubscribe();
      };
    });
  return ni(n, r.pipe(oi()));
}
function zp(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
var Wp = (() => {
  let e = class e {
    constructor() {
      (this.renderDepth = 0),
        (this.handler = null),
        (this.internalCallbacks = []);
    }
    begin() {
      this.handler?.validateBegin(), this.renderDepth++;
    }
    end() {
      if ((this.renderDepth--, this.renderDepth === 0)) {
        for (let r of this.internalCallbacks) r();
        (this.internalCallbacks.length = 0), this.handler?.execute();
      }
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  e.ɵprov = x({ token: e, providedIn: "root", factory: () => new e() });
  let t = e;
  return t;
})();
function qp(t, e) {
  let n = ke(e, t),
    r = n[C];
  Zp(r, n);
  let i = n[_e];
  i !== null && n[Gn] === null && (n[Gn] = Lo(i, n[vt])), Wo(r, n, n[ae]);
}
function Zp(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function Wo(t, e, n) {
  po(e);
  try {
    let r = t.viewQuery;
    r !== null && Zi(1, r, n);
    let i = t.template;
    i !== null && ic(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && pc(t, e),
      t.staticViewQueries && Zi(2, t.viewQuery, n);
    let o = t.components;
    o !== null && Yp(e, o);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[g] &= -5), go();
  }
}
function Yp(t, e) {
  for (let n = 0; n < e.length; n++) qp(t, e[n]);
}
function Ji(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = wi(i, a);
      else if (o == 2) {
        let u = a,
          c = e[++s];
        r = wi(r, u + ": " + c + ";");
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var Xi = class extends Vo {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = mt(e);
    return new ir(n, this.ngModule);
  }
};
function xa(t) {
  let e = [];
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let r = t[n];
      e.push({ propName: r, templateName: n });
    }
  return e;
}
function Qp(t) {
  let e = t.toLowerCase();
  return e === "svg" ? ru : e === "math" ? ff : null;
}
var eo = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = ur(r);
      let i = this.injector.get(e, fi, r);
      return i !== fi || n === fi ? i : this.parentInjector.get(e, n, r);
    }
  },
  ir = class extends tr {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = xa(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return xa(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = nf(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      i = i || this.ngModule;
      let o = i instanceof ce ? i : i?.injector;
      o &&
        this.componentDef.getStandaloneInjector !== null &&
        (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new eo(e, o) : e,
        a = s.get(Wt, null);
      if (a === null) throw new m(407, !1);
      let u = s.get(Qh, null),
        c = s.get(Wp, null),
        l = {
          rendererFactory: a,
          sanitizer: u,
          inlineEffectRunner: null,
          afterRenderEventManager: c,
        },
        d = a.createRenderer(null, this.componentDef),
        f = this.componentDef.selectors[0][0] || "div",
        h = r ? lp(d, r, this.componentDef.encapsulation, s) : zu(d, f, Qp(f)),
        p = 4608,
        y = this.componentDef.onPush ? 576 : 528,
        N = this.componentDef.signals ? p : y,
        b = null;
      h !== null && (b = Lo(h, s, !0));
      let Y = Uo(0, null, null, 1, 0, null, null, null, null, null, null),
        $ = vr(null, Y, null, N, null, null, l, d, s, null, b);
      po($);
      let we, rt;
      try {
        let te = this.componentDef,
          it,
          $r = null;
        te.findHostDirectiveDefs
          ? ((it = []),
            ($r = new Map()),
            te.findHostDirectiveDefs(te, it, $r),
            it.push(te))
          : (it = [te]);
        let Wl = Kp($, h),
          ql = Jp(Wl, h, te, it, $, l, d);
        (rt = iu(Y, Oe)),
          h && tg(d, te, h, r),
          n !== void 0 && ng(rt, this.ngContentSelectors, n),
          (we = eg(ql, te, it, $r, $, [rg])),
          Wo(Y, $, null);
      } finally {
        go();
      }
      return new to(this.componentType, we, mr(rt, $), $, rt);
    }
  },
  to = class extends Vi {
    constructor(e, n, r, i, o) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Je(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, n) {
      let r = this._tNode.inputs,
        i;
      if (r !== null && (i = r[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), n))
        )
          return;
        let o = this._rootLView;
        Ho(o[C], o, i, e, n), this.previousInputValues.set(e, n);
        let s = ke(this._tNode.index, o);
        Go(s);
      }
    }
    get injector() {
      return new ze(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function Kp(t, e) {
  let n = t[C],
    r = Oe;
  return (t[r] = e), yr(n, r, 2, "#host", null);
}
function Jp(t, e, n, r, i, o, s) {
  let a = i[C];
  Xp(r, t, e, s);
  let u = null;
  e !== null && (u = Lo(e, i[vt]));
  let c = o.rendererFactory.createRenderer(e, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = vr(i, uc(n), null, l, i[t.index], t, o, c, null, null, u);
  return (
    a.firstCreatePass && qi(a, t, r.length - 1), Dr(i, d), (i[t.index] = d)
  );
}
function Xp(t, e, n, r) {
  for (let i of t) e.mergedAttrs = Bt(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Ji(e, e.mergedAttrs, !0), n !== null && Ku(r, n, e));
}
function eg(t, e, n, r, i, o) {
  let s = J(),
    a = i[C],
    u = de(s, i);
  lc(a, i, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      f = Ct(i, a, d, s);
    Qe(f, i);
  }
  dc(a, i, s), u && Qe(u, i);
  let c = Ct(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[ae] = i[ae] = c), o !== null)) for (let l of o) l(c, e);
  return oc(a, s, t), c;
}
function tg(t, e, n, r) {
  if (r) Mi(t, n, ["ng-version", Kh.full]);
  else {
    let { attrs: i, classes: o } = rf(e.selectors[0]);
    i && Mi(t, n, i), o && o.length > 0 && Qu(t, n, o.join(" "));
  }
}
function ng(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = n[i];
    r.push(o != null ? Array.from(o) : null);
  }
}
function rg() {
  let t = J();
  Co(A()[C], t);
}
function ig(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Ve(t) {
  let e = ig(t.type),
    n = !0,
    r = [t];
  for (; e; ) {
    let i;
    if (Re(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new m(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (n) {
        r.push(i);
        let s = t;
        (s.inputs = Pn(t.inputs)),
          (s.inputTransforms = Pn(t.inputTransforms)),
          (s.declaredInputs = Pn(t.declaredInputs)),
          (s.outputs = Pn(t.outputs));
        let a = i.hostBindings;
        a && ug(t, a);
        let u = i.viewQuery,
          c = i.contentQueries;
        if (
          (u && sg(t, u),
          c && ag(t, c),
          Rn(t.inputs, i.inputs),
          Rn(t.declaredInputs, i.declaredInputs),
          Rn(t.outputs, i.outputs),
          i.inputTransforms !== null &&
            (s.inputTransforms === null && (s.inputTransforms = {}),
            Rn(s.inputTransforms, i.inputTransforms)),
          Re(i) && i.data.animation)
        ) {
          let l = t.data;
          l.animation = (l.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Ve && (n = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  og(r);
}
function og(t) {
  let e = 0,
    n = null;
  for (let r = t.length - 1; r >= 0; r--) {
    let i = t[r];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = Bt(i.hostAttrs, (n = Bt(n, i.hostAttrs))));
  }
}
function Pn(t) {
  return t === gt ? {} : t === z ? [] : t;
}
function sg(t, e) {
  let n = t.viewQuery;
  n
    ? (t.viewQuery = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.viewQuery = e);
}
function ag(t, e) {
  let n = t.contentQueries;
  n
    ? (t.contentQueries = (r, i, o) => {
        e(r, i, o), n(r, i, o);
      })
    : (t.contentQueries = e);
}
function ug(t, e) {
  let n = t.hostBindings;
  n
    ? (t.hostBindings = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.hostBindings = e);
}
function cg(t, e, n) {
  return (t[e] = n);
}
function Cr(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function kn(t, e) {
  return (t << 17) | (e << 2);
}
function Xe(t) {
  return (t >> 17) & 32767;
}
function lg(t) {
  return (t & 2) == 2;
}
function dg(t, e) {
  return (t & 131071) | (e << 17);
}
function no(t) {
  return t | 2;
}
function Et(t) {
  return (t & 131068) >> 2;
}
function gi(t, e) {
  return (t & -131069) | (e << 2);
}
function fg(t) {
  return (t & 1) === 1;
}
function ro(t) {
  return t | 1;
}
function hg(t, e, n, r, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = Xe(s),
    u = Et(s);
  t[r] = n;
  let c = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || Qt(d, l) > 0) && (c = !0);
  } else l = n;
  if (i)
    if (u !== 0) {
      let f = Xe(t[a + 1]);
      (t[r + 1] = kn(f, a)),
        f !== 0 && (t[f + 1] = gi(t[f + 1], r)),
        (t[a + 1] = dg(t[a + 1], r));
    } else
      (t[r + 1] = kn(a, 0)), a !== 0 && (t[a + 1] = gi(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = kn(u, 0)),
      a === 0 ? (a = r) : (t[u + 1] = gi(t[u + 1], r)),
      (u = r);
  c && (t[r + 1] = no(t[r + 1])),
    Ta(t, l, r, !0, o),
    Ta(t, l, r, !1, o),
    pg(e, l, t, r, o),
    (s = kn(a, u)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function pg(t, e, n, r, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Qt(o, e) >= 0 &&
    (n[r + 1] = ro(n[r + 1]));
}
function Ta(t, e, n, r, i) {
  let o = t[n + 1],
    s = e === null,
    a = r ? Xe(o) : Et(o),
    u = !1;
  for (; a !== 0 && (u === !1 || s); ) {
    let c = t[a],
      l = t[a + 1];
    gg(c, e) && ((u = !0), (t[a + 1] = r ? ro(l) : no(l))),
      (a = r ? Xe(l) : Et(l));
  }
  u && (t[n + 1] = r ? no(o) : ro(o));
}
function gg(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Qt(t, e) >= 0
    : !1;
}
var oe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function mg(t) {
  return t.substring(oe.key, oe.keyEnd);
}
function vg(t) {
  return yg(t), Ec(t, Ic(t, 0, oe.textEnd));
}
function Ec(t, e) {
  let n = oe.textEnd;
  return n === e ? -1 : ((e = oe.keyEnd = Dg(t, (oe.key = e), n)), Ic(t, e, n));
}
function yg(t) {
  (oe.key = 0),
    (oe.keyEnd = 0),
    (oe.value = 0),
    (oe.valueEnd = 0),
    (oe.textEnd = t.length);
}
function Ic(t, e, n) {
  for (; e < n && t.charCodeAt(e) <= 32; ) e++;
  return e;
}
function Dg(t, e, n) {
  for (; e < n && t.charCodeAt(e) > 32; ) e++;
  return e;
}
function he(t, e, n) {
  let r = A(),
    i = xf();
  if (Cr(r, i, e)) {
    let o = fe(),
      s = Pf();
    mp(o, s, r, t, e, r[k], n, !1);
  }
  return he;
}
function io(t, e, n, r, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  Ho(t, n, o[s], s, r);
}
function wr(t, e) {
  return wg(t, e, null, !0), wr;
}
function bc(t) {
  Eg(xg, Cg, t, !0);
}
function Cg(t, e) {
  for (let n = vg(e); n >= 0; n = Ec(e, n)) bo(t, mg(e), !0);
}
function wg(t, e, n, r) {
  let i = A(),
    o = fe(),
    s = hu(2);
  if ((o.firstUpdatePass && _c(o, t, s, r), e !== nt && Cr(i, s, e))) {
    let a = o.data[_t()];
    Sc(o, a, i, i[k], t, (i[s + 1] = Ag(e, n)), r, s);
  }
}
function Eg(t, e, n, r) {
  let i = fe(),
    o = hu(2);
  i.firstUpdatePass && _c(i, null, o, r);
  let s = A();
  if (n !== nt && Cr(s, o, n)) {
    let a = i.data[_t()];
    if (xc(a, r) && !Mc(i, o)) {
      let u = r ? a.classesWithoutHost : a.stylesWithoutHost;
      u !== null && (n = wi(u, n || "")), io(i, a, s, n, r);
    } else Tg(i, a, s, s[k], s[o + 1], (s[o + 1] = Sg(t, e, n)), r, o);
  }
}
function Mc(t, e) {
  return e >= t.expandoStartIndex;
}
function _c(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let o = i[_t()],
      s = Mc(t, n);
    xc(o, r) && e === null && !s && (e = !1),
      (e = Ig(i, o, e, r)),
      hg(i, o, e, n, s, r);
  }
}
function Ig(t, e, n, r) {
  let i = Of(t),
    o = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = mi(null, t, e, n, r)), (n = qt(n, e.attrs, r)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((n = mi(i, t, e, n, r)), o === null)) {
        let u = bg(t, e, r);
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = mi(null, t, e, u[1], r)),
          (u = qt(u, e.attrs, r)),
          Mg(t, e, r, u));
      } else o = _g(t, e, r);
  }
  return (
    o !== void 0 && (r ? (e.residualClasses = o) : (e.residualStyles = o)), n
  );
}
function bg(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (Et(r) !== 0) return t[Xe(r)];
}
function Mg(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[Xe(i)] = r;
}
function _g(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    r = qt(r, s, n);
  }
  return qt(r, e.attrs, n);
}
function mi(t, e, n, r, i) {
  let o = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((o = e[a]), (r = qt(r, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function qt(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          bo(t, s, n ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function Sg(t, e, n) {
  if (n == null || n === "") return z;
  let r = [],
    i = gr(n);
  if (Array.isArray(i)) for (let o = 0; o < i.length; o++) t(r, i[o], !0);
  else if (typeof i == "object")
    for (let o in i) i.hasOwnProperty(o) && t(r, o, i[o]);
  else typeof i == "string" && e(r, i);
  return r;
}
function xg(t, e, n) {
  let r = String(e);
  r !== "" && !r.includes(" ") && bo(t, r, n);
}
function Tg(t, e, n, r, i, o, s, a) {
  i === nt && (i = z);
  let u = 0,
    c = 0,
    l = 0 < i.length ? i[0] : null,
    d = 0 < o.length ? o[0] : null;
  for (; l !== null || d !== null; ) {
    let f = u < i.length ? i[u + 1] : void 0,
      h = c < o.length ? o[c + 1] : void 0,
      p = null,
      y;
    l === d
      ? ((u += 2), (c += 2), f !== h && ((p = d), (y = h)))
      : d === null || (l !== null && l < d)
      ? ((u += 2), (p = l))
      : ((c += 2), (p = d), (y = h)),
      p !== null && Sc(t, e, n, r, p, y, s, a),
      (l = u < i.length ? i[u] : null),
      (d = c < o.length ? o[c] : null);
  }
}
function Sc(t, e, n, r, i, o, s, a) {
  if (!(e.type & 3)) return;
  let u = t.data,
    c = u[a + 1],
    l = fg(c) ? Aa(u, e, n, i, Et(c), s) : void 0;
  if (!or(l)) {
    or(o) || (lg(c) && (o = Aa(u, null, n, i, a, s)));
    let d = hf(_t(), n);
    Bh(r, s, d, i, o);
  }
}
function Aa(t, e, n, r, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let u = t[i],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = n[i + 1];
    f === nt && (f = d ? z : void 0);
    let h = d ? ci(f, r) : l === r ? f : void 0;
    if ((c && !or(h) && (h = ci(u, r)), or(h) && ((a = h), s))) return a;
    let p = t[i + 1];
    i = s ? Xe(p) : Et(p);
  }
  if (e !== null) {
    let u = o ? e.residualClasses : e.residualStyles;
    u != null && (a = ci(u, r));
  }
  return a;
}
function or(t) {
  return t !== void 0;
}
function Ag(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = W(gr(t)))),
    t
  );
}
function xc(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var Fw = new RegExp(`^(\\d+)*(${Gh}|${Hh})*(.*)`);
var Ng = (t, e) => null;
function Na(t, e) {
  return Ng(t, e);
}
function Og(t, e, n, r) {
  let i = e.tView,
    s = t[g] & 4096 ? 4096 : 16,
    a = vr(
      t,
      i,
      n,
      s,
      null,
      e,
      null,
      null,
      null,
      r?.injector ?? null,
      r?.dehydratedView ?? null
    ),
    u = t[e.index];
  a[cr] = u;
  let c = t[zt];
  return c !== null && (a[zt] = c.createEmbeddedView(i)), Wo(i, a, n), a;
}
function Oa(t, e) {
  return !e || e.firstChild === null || $u(t);
}
function Rg(t, e, n, r = !0) {
  let i = e[C];
  if ((Sh(i, e, t, n), r)) {
    let s = ki(n, t),
      a = e[k],
      u = Fo(a, t[qe]);
    u !== null && bh(i, t[le], a, e, u, s);
  }
  let o = e[Gn];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
var en = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = Fg;
  let t = e;
  return t;
})();
function Fg() {
  let t = J();
  return kg(t, A());
}
var Pg = en,
  Tc = class extends Pg {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return mr(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new ze(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = wo(this._hostTNode, this._hostLView);
      if (Eu(e)) {
        let n = Yn(e, this._hostLView),
          r = Zn(e),
          i = n[C].data[r + 8];
        return new ze(i, n);
      } else return new ze(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = Ra(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - K;
    }
    createEmbeddedView(e, n, r) {
      let i, o;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (o = r.injector));
      let s = Na(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, o, s);
      return this.insertImpl(a, i, Oa(this._hostTNode, s)), a;
    }
    createComponent(e, n, r, i, o) {
      let s = e && !Xf(e),
        a;
      if (s) a = n;
      else {
        let p = n || {};
        (a = p.index),
          (r = p.injector),
          (i = p.projectableNodes),
          (o = p.environmentInjector || p.ngModuleRef);
      }
      let u = s ? e : new ir(mt(e)),
        c = r || this.parentInjector;
      if (!o && u.ngModule == null) {
        let y = (s ? c : this.parentInjector).get(ce, null);
        y && (o = y);
      }
      let l = mt(u.componentType ?? {}),
        d = Na(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = u.create(c, i, f, o);
      return this.insertImpl(h.hostView, a, Oa(this._hostTNode, d)), h;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (pf(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let u = i[R],
            c = new Tc(u, u[le], u[R]);
          c.detach(c.indexOf(e));
        }
      }
      let o = this._adjustIndex(n),
        s = this._lContainer;
      return Rg(s, i, o, r), e.attachToViewContainerRef(), Ou(vi(s), o, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = Ra(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = Pi(this._lContainer, n);
      r && (Kn(vi(this._lContainer), n), qu(r[C], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = Pi(this._lContainer, n);
      return r && Kn(vi(this._lContainer), n) != null ? new Je(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function Ra(t) {
  return t[zn];
}
function vi(t) {
  return t[zn] || (t[zn] = []);
}
function kg(t, e) {
  let n,
    r = e[t.index];
  return (
    ue(r) ? (n = r) : ((n = hc(r, e, null, t)), (e[t.index] = n), Dr(e, n)),
    Vg(n, e, t, r),
    new Tc(n, t, e)
  );
}
function Lg(t, e) {
  let n = t[k],
    r = n.createComment(""),
    i = de(e, t),
    o = Fo(n, i);
  return er(n, o, r, Fh(n, i), !1), r;
}
var Vg = Bg,
  jg = (t, e, n) => !1;
function $g(t, e, n) {
  return jg(t, e, n);
}
function Bg(t, e, n, r) {
  if (t[qe]) return;
  let i;
  n.type & 8 ? (i = Ce(r)) : (i = Lg(e, n)), (t[qe] = i);
}
function Ug(t, e, n, r, i, o, s, a, u) {
  let c = e.consts,
    l = yr(e, t, 4, s || null, qn(c, a));
  cc(e, n, l, qn(c, u)), Co(e, l);
  let d = (l.tView = Uo(
    2,
    l,
    r,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    c,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  );
}
function qo(t, e, n, r, i, o, s, a) {
  let u = A(),
    c = fe(),
    l = t + Oe,
    d = c.firstCreatePass ? Ug(l, c, u, e, n, r, i, o, s) : c.data[l];
  Yt(d, !1);
  let f = Hg(c, u, d, t);
  yo() && Po(c, u, f, d), Qe(f, u);
  let h = hc(f, u, f, d);
  return (
    (u[l] = h),
    Dr(u, h),
    $g(h, d, u),
    fo(d) && sc(c, u, d),
    s != null && ac(u, d, a),
    qo
  );
}
var Hg = Gg;
function Gg(t, e, n, r) {
  return Do(!0), e[k].createComment("");
}
function zg(t, e, n, r, i, o) {
  let s = e.consts,
    a = qn(s, i),
    u = yr(e, t, 2, r, a);
  return (
    cc(e, n, u, qn(s, o)),
    u.attrs !== null && Ji(u, u.attrs, !1),
    u.mergedAttrs !== null && Ji(u, u.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, u),
    u
  );
}
function L(t, e, n, r) {
  let i = A(),
    o = fe(),
    s = Oe + t,
    a = i[k],
    u = o.firstCreatePass ? zg(s, o, i, e, n, r) : o.data[s],
    c = Wg(o, i, u, a, e, t);
  i[s] = c;
  let l = fo(u);
  return (
    Yt(u, !0),
    Ku(a, c, u),
    (u.flags & 32) !== 32 && yo() && Po(o, i, c, u),
    yf() === 0 && Qe(c, i),
    Df(),
    l && (sc(o, i, u), oc(o, u, i)),
    r !== null && ac(i, u),
    L
  );
}
function X() {
  let t = J();
  fu() ? Mf() : ((t = t.parent), Yt(t, !1));
  let e = t;
  Ef(e) && If(), Cf();
  let n = fe();
  return (
    n.firstCreatePass && (Co(n, t), Xa(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      Bf(e) &&
      io(n, e, A(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      Uf(e) &&
      io(n, e, A(), e.stylesWithoutHost, !1),
    X
  );
}
function ee(t, e, n, r) {
  return L(t, e, n, r), X(), ee;
}
var Wg = (t, e, n, r, i, o) => (Do(!0), zu(r, i, Lf()));
function Ac() {
  return A();
}
var sr = "en-US";
var qg = sr;
function Zg(t) {
  Rd(t, "Expected localeId to be defined"),
    typeof t == "string" && (qg = t.toLowerCase().replace(/_/g, "-"));
}
function Tt(t) {
  return !!t && typeof t.then == "function";
}
function Nc(t) {
  return !!t && typeof t.subscribe == "function";
}
function xe(t, e, n, r) {
  let i = A(),
    o = fe(),
    s = J();
  return Qg(o, i, i[k], s, t, e, r), xe;
}
function Yg(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === n && i[o + 1] === r) {
        let a = e[Ut],
          u = i[o + 2];
        return a.length > u ? a[u] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function Qg(t, e, n, r, i, o, s) {
  let a = fo(r),
    c = t.firstCreatePass && Np(t),
    l = e[ae],
    d = Ap(e),
    f = !0;
  if (r.type & 3 || s) {
    let y = de(r, e),
      N = s ? s(y) : y,
      b = d.length,
      Y = s ? (we) => s(Ce(we[r.index])) : r.index,
      $ = null;
    if ((!s && a && ($ = Yg(t, e, i, r.index)), $ !== null)) {
      let we = $.__ngLastListenerFn__ || $;
      (we.__ngNextListenerFn__ = o), ($.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Pa(r, e, l, o, !1);
      let we = n.listen(N, i, o);
      d.push(o, we), c && c.push(i, Y, b, b + 1);
    }
  } else o = Pa(r, e, l, o, !1);
  let h = r.outputs,
    p;
  if (f && h !== null && (p = h[i])) {
    let y = p.length;
    if (y)
      for (let N = 0; N < y; N += 2) {
        let b = p[N],
          Y = p[N + 1],
          rt = e[b][Y].subscribe(o),
          te = d.length;
        d.push(o, rt), c && c.push(i, r.index, te, -(te + 1));
      }
  }
}
function Fa(t, e, n, r) {
  try {
    return me(6, e, n), n(r) !== !1;
  } catch (i) {
    return gc(t, i), !1;
  } finally {
    me(7, e, n);
  }
}
function Pa(t, e, n, r, i) {
  return function o(s) {
    if (s === Function) return r;
    let a = t.componentOffset > -1 ? ke(t.index, e) : e;
    Go(a);
    let u = Fa(e, n, r, s),
      c = o.__ngNextListenerFn__;
    for (; c; ) (u = Fa(e, n, c, s) && u), (c = c.__ngNextListenerFn__);
    return i && u === !1 && s.preventDefault(), u;
  };
}
function Zo(t = 1) {
  return Ff(t);
}
function Oc(t, e = "") {
  let n = A(),
    r = fe(),
    i = t + Oe,
    o = r.firstCreatePass ? yr(r, i, 1, e, null) : r.data[i],
    s = Kg(r, n, o, e, t);
  (n[i] = s), yo() && Po(r, n, s, o), Yt(o, !1);
}
var Kg = (t, e, n, r, i) => (Do(!0), Eh(e[k], r));
function Jg(t, e, n) {
  let r = fe();
  if (r.firstCreatePass) {
    let i = Re(t);
    oo(n, r.data, r.blueprint, i, !0), oo(e, r.data, r.blueprint, i, !1);
  }
}
function oo(t, e, n, r, i) {
  if (((t = V(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) oo(t[o], e, n, r, i);
  else {
    let o = fe(),
      s = A(),
      a = J(),
      u = wt(t) ? t : V(t.provide),
      c = Vu(t),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (wt(t) || !t.multi) {
      let h = new Ye(c, i, M),
        p = Di(u, e, i ? l : l + f, d);
      p === -1
        ? (Ti(Qn(a, s), o, u),
          yi(o, t, e.length),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(h),
          s.push(h))
        : ((n[p] = h), (s[p] = h));
    } else {
      let h = Di(u, e, l + f, d),
        p = Di(u, e, l, l + f),
        y = h >= 0 && n[h],
        N = p >= 0 && n[p];
      if ((i && !N) || (!i && !y)) {
        Ti(Qn(a, s), o, u);
        let b = tm(i ? em : Xg, n.length, i, r, c);
        !i && N && (n[p].providerFactory = b),
          yi(o, t, e.length, 0),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(b),
          s.push(b);
      } else {
        let b = Rc(n[i ? p : h], c, !i && r);
        yi(o, t, h > -1 ? h : p, b);
      }
      !i && r && N && n[p].componentProviders++;
    }
  }
}
function yi(t, e, n, r) {
  let i = wt(e),
    o = ah(e);
  if (i || o) {
    let u = (o ? V(e.useClass) : e).prototype.ngOnDestroy;
    if (u) {
      let c = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let l = c.indexOf(n);
        l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u);
      } else c.push(n, u);
    }
  }
}
function Rc(t, e, n) {
  return n && t.componentProviders++, t.multi.push(e) - 1;
}
function Di(t, e, n, r) {
  for (let i = n; i < r; i++) if (e[i] === t) return i;
  return -1;
}
function Xg(t, e, n, r) {
  return so(this.multi, []);
}
function em(t, e, n, r) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Ct(n, n[C], this.providerFactory.index, r);
    (o = a.slice(0, s)), so(i, o);
    for (let u = s; u < a.length; u++) o.push(a[u]);
  } else (o = []), so(i, o);
  return o;
}
function so(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    e.push(r());
  }
  return e;
}
function tm(t, e, n, r, i) {
  let o = new Ye(t, n, M);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    Rc(o, i, r && !n),
    o
  );
}
function Er(t, e = []) {
  return (n) => {
    n.providersResolver = (r, i) => Jg(r, i ? i(t) : t, e);
  };
}
var It = class {};
var ar = class extends It {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Xi(this)),
      (this.instance = null);
    let n = new Xn(
      [
        ...e.providers,
        { provide: It, useValue: this },
        { provide: Vo, useValue: this.componentFactoryResolver },
      ],
      e.parent || xo(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      e.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function Fc(t, e, n = null) {
  return new ar({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var nm = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = Pu(!1, r.type),
          o =
            i.length > 0
              ? Fc([i], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, o);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = x({
    token: e,
    providedIn: "environment",
    factory: () => new e(I(ce)),
  });
  let t = e;
  return t;
})();
function Yo(t) {
  Dc("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(nm).getOrCreateStandaloneInjector(t));
}
function je(t, e, n, r) {
  return im(A(), _f(), t, e, n, r);
}
function rm(t, e) {
  let n = t[e];
  return n === nt ? void 0 : n;
}
function im(t, e, n, r, i, o) {
  let s = e + n;
  return Cr(t, s, i) ? cg(t, s + 1, o ? r.call(o, i) : r(i)) : rm(t, s + 1);
}
var Qo = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = am;
    let t = e;
    return t;
  })(),
  om = Qo,
  sm = class extends om {
    constructor(e, n, r) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, n) {
      return this.createEmbeddedViewImpl(e, n);
    }
    createEmbeddedViewImpl(e, n, r) {
      let i = Og(this._declarationLView, this._declarationTContainer, e, {
        injector: n,
        dehydratedView: r,
      });
      return new Je(i);
    }
  };
function am() {
  return um(J(), A());
}
function um(t, e) {
  return t.type & 4 ? new sm(e, t, mr(t, e)) : null;
}
var Pc = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ct(!1));
    }
    add() {
      this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 && this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var kc = new E("");
var Lc = new E("Application Initializer"),
  Vc = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = T(Lc, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let o of this.appInits) {
          let s = o();
          if (Tt(s)) r.push(s);
          else if (Nc(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c });
            });
            r.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          r.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  jc = new E("appBootstrapListener");
function cm() {
  Ss(() => {
    throw new m(600, !1);
  });
}
function lm(t) {
  return t.isBoundToModule;
}
function dm(t, e, n) {
  try {
    let r = n();
    return Tt(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
var Ir = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = T(ec)),
        (this.zoneIsStable = T(Cc)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = T(Pc).hasPendingTasks.pipe(
          On((r) => (r ? Pt(!1) : this.zoneIsStable)),
          ri()
        )),
        (this._injector = T(ce));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let o = r instanceof tr;
      if (!this._injector.get(Vc).done) {
        let p =
          "Cannot bootstrap as there are still asynchronous initializers running." +
          (!o && Za(r)
            ? ""
            : " Bootstrap components in the `ngDoBootstrap` method of the root module.");
        throw new m(405, !1);
      }
      let a;
      o ? (a = r) : (a = this._injector.get(Vo).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let u = lm(a) ? void 0 : this._injector.get(It),
        c = i || a.selector,
        l = a.create(St.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(kc, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Ci(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      if (this._runningTick) throw new m(101, !1);
      try {
        this._runningTick = !0;
        for (let r of this._views) r.detectChanges();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        this._runningTick = !1;
      }
    }
    attachView(r) {
      let i = r;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(r) {
      let i = r;
      Ci(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(jc, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => Ci(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new m(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Ci(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
var fm = (() => {
  let e = class e {
    constructor() {
      (this.zone = T(P)), (this.applicationRef = T(Ir));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function hm(t) {
  return [
    { provide: P, useFactory: t },
    {
      provide: Kt,
      multi: !0,
      useFactory: () => {
        let e = T(fm, { optional: !0 });
        return () => e.initialize();
      },
    },
    { provide: ec, useFactory: pm },
    { provide: Cc, useFactory: wc },
  ];
}
function pm() {
  let t = T(P),
    e = T(Me);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function gm(t) {
  let e = hm(() => new P(mm(t)));
  return _o([[], e]);
}
function mm(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
function vm() {
  return (typeof $localize < "u" && $localize.locale) || sr;
}
var Ko = new E("LocaleId", {
  providedIn: "root",
  factory: () => T(Ko, D.Optional | D.SkipSelf) || vm(),
});
var $c = new E("PlatformDestroyListeners");
var Bn = null;
function ym(t = [], e) {
  return St.create({
    name: e,
    providers: [
      { provide: pr, useValue: "platform" },
      { provide: $c, useValue: new Set([() => (Bn = null)]) },
      ...t,
    ],
  });
}
function Dm(t = []) {
  if (Bn) return Bn;
  let e = ym(t);
  return (Bn = e), cm(), Cm(e), e;
}
function Cm(t) {
  t.get(Ao, null)?.forEach((n) => n());
}
function Bc(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = Dm(r),
      o = [gm(), ...(n || [])],
      a = new ar({
        providers: o,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      u = a.get(P);
    return u.run(() => {
      a.resolveInjectorInitializers();
      let c = a.get(Me, null),
        l;
      u.runOutsideAngular(() => {
        l = u.onError.subscribe({
          next: (h) => {
            c.handleError(h);
          },
        });
      });
      let d = () => a.destroy(),
        f = i.get($c);
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d);
        }),
        dm(c, u, () => {
          let h = a.get(Vc);
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let p = a.get(Ko, sr);
              Zg(p || sr);
              let y = a.get(Ir);
              return e !== void 0 && y.bootstrap(e), y;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
var Xo = null;
function At() {
  return Xo;
}
function zc(t) {
  Xo || (Xo = t);
}
var br = class {},
  $e = new E("DocumentToken");
function Wc(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(";")) {
    let r = n.indexOf("="),
      [i, o] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Jo = /\s+/,
  Uc = [],
  qc = (() => {
    let e = class e {
      constructor(r, i, o, s) {
        (this._iterableDiffers = r),
          (this._keyValueDiffers = i),
          (this._ngEl = o),
          (this._renderer = s),
          (this.initialClasses = Uc),
          (this.stateMap = new Map());
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(Jo) : Uc;
      }
      set ngClass(r) {
        this.rawClass = typeof r == "string" ? r.trim().split(Jo) : r;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let r = this.rawClass;
        if (Array.isArray(r) || r instanceof Set)
          for (let i of r) this._updateState(i, !0);
        else if (r != null)
          for (let i of Object.keys(r)) this._updateState(i, !!r[i]);
        this._applyStateDiff();
      }
      _updateState(r, i) {
        let o = this.stateMap.get(r);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(r, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let r of this.stateMap) {
          let i = r[0],
            o = r[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(r, i) {
        (r = r.trim()),
          r.length > 0 &&
            r.split(Jo).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M($o), M(Bo), M(Le), M(tt));
    }),
      (e.ɵdir = q({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var Zc = (() => {
    let e = class e {
      constructor(r, i) {
        (this._viewContainer = r),
          (this._context = new es()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(r) {
        (this._context.$implicit = this._context.ngIf = r), this._updateView();
      }
      set ngIfThen(r) {
        Hc("ngIfThen", r),
          (this._thenTemplateRef = r),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(r) {
        Hc("ngIfElse", r),
          (this._elseTemplateRef = r),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(en), M(Qo));
    }),
      (e.ɵdir = q({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  es = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function Hc(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${W(e)}'.`);
}
var ts = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Pe({ type: e })),
      (e.ɵinj = Fe({}));
    let t = e;
    return t;
  })(),
  Yc = "browser",
  Im = "server";
function ns(t) {
  return t === Im;
}
var Mr = class {};
var os = class extends br {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  ss = class t extends os {
    static makeCurrent() {
      zc(new t());
    }
    onAndCancel(e, n, r) {
      return (
        e.addEventListener(n, r),
        () => {
          e.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? window
        : n === "document"
        ? e
        : n === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let n = Mm();
      return n == null ? null : _m(n);
    }
    resetBaseElement() {
      nn = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Wc(document.cookie, e);
    }
  },
  nn = null;
function Mm() {
  return (
    (nn = nn || document.querySelector("base")),
    nn ? nn.getAttribute("href") : null
  );
}
function _m(t) {
  return new URL(t, document.baseURI).pathname;
}
var Sm = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  as = new E("EventManagerPlugins"),
  el = (() => {
    let e = class e {
      constructor(r, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, i, o) {
        return this._findPluginFor(i).addEventListener(r, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(r))), !i))
          throw new m(5101, !1);
        return this._eventNameToPlugin.set(r, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(I(as), I(P));
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  _r = class {
    constructor(e) {
      this._doc = e;
    }
  },
  rs = "ng-app-id",
  tl = (() => {
    let e = class e {
      constructor(r, i, o, s = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ns(s)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((i) => i.remove()), r.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r);
      }
      onStyleRemoved(r) {
        let i = this.styleRef;
        i.get(r)?.elements?.forEach((o) => o.remove()), i.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${rs}="${this.appId}"]`);
        if (r?.length) {
          let i = new Map();
          return (
            r.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(r, i) {
        let o = this.styleRef;
        if (o.has(r)) {
          let s = o.get(r);
          return (s.usage += i), s.usage;
        }
        return o.set(r, { usage: i, elements: [] }), i;
      }
      getStyleElement(r, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === r) return o.delete(i), s.removeAttribute(rs), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(rs, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, i) {
        let o = this.getStyleElement(r, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(I($e), I(To), I(No, 8), I(xt));
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  is = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  cs = /%COMP%/g,
  nl = "%COMP%",
  xm = `_nghost-${nl}`,
  Tm = `_ngcontent-${nl}`,
  Am = !0,
  Nm = new E("RemoveStylesOnCompDestroy", {
    providedIn: "root",
    factory: () => Am,
  });
function Om(t) {
  return Tm.replace(cs, t);
}
function Rm(t) {
  return xm.replace(cs, t);
}
function rl(t, e) {
  return e.map((n) => n.replace(cs, t));
}
var Qc = (() => {
    let e = class e {
      constructor(r, i, o, s, a, u, c, l = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ns(u)),
          (this.defaultRenderer = new rn(r, a, c, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === ye.ShadowDom &&
          (i = B(F({}, i), { encapsulation: ye.Emulated }));
        let o = this.getOrCreateRenderer(r, i);
        return (
          o instanceof Sr
            ? o.applyToHost(r)
            : o instanceof on && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(r, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case ye.Emulated:
              s = new Sr(c, l, i, this.appId, d, a, u, f);
              break;
            case ye.ShadowDom:
              return new us(c, l, r, i, a, u, this.nonce, f);
            default:
              s = new on(c, l, i, d, a, u, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        I(el),
        I(tl),
        I(To),
        I(Nm),
        I($e),
        I(xt),
        I(P),
        I(No)
      );
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  rn = class {
    constructor(e, n, r, i) {
      (this.eventManager = e),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, n) {
      return n
        ? this.doc.createElementNS(is[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (Kc(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (Kc(e) ? e.content : e).insertBefore(n, r);
    }
    removeChild(e, n) {
      e && e.removeChild(n);
    }
    selectRootElement(e, n) {
      let r = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!r) throw new m(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, n, r, i) {
      if (i) {
        n = i + ":" + n;
        let o = is[i];
        o ? e.setAttributeNS(o, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = is[r];
        i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`);
      } else e.removeAttribute(n);
    }
    addClass(e, n) {
      e.classList.add(n);
    }
    removeClass(e, n) {
      e.classList.remove(n);
    }
    setStyle(e, n, r, i) {
      i & (be.DashCase | be.Important)
        ? e.style.setProperty(n, r, i & be.Important ? "important" : "")
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & be.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
    }
    setProperty(e, n, r) {
      e != null && (e[n] = r);
    }
    setValue(e, n) {
      e.nodeValue = n;
    }
    listen(e, n, r) {
      if (
        typeof e == "string" &&
        ((e = At().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${n}`);
      return this.eventManager.addEventListener(
        e,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(e) {
      return (n) => {
        if (n === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function Kc(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var us = class extends rn {
    constructor(e, n, r, i, o, s, a, u) {
      super(e, o, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = rl(i.id, i.styles);
      for (let l of c) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, n) {
      return super.appendChild(this.nodeOrShadowRoot(e), n);
    }
    insertBefore(e, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
    }
    removeChild(e, n) {
      return super.removeChild(this.nodeOrShadowRoot(e), n);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  on = class extends rn {
    constructor(e, n, r, i, o, s, a, u) {
      super(e, o, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = u ? rl(u, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Sr = class extends on {
    constructor(e, n, r, i, o, s, a, u) {
      let c = i + "-" + r.id;
      super(e, n, r, o, s, a, u, c),
        (this.contentAttr = Om(c)),
        (this.hostAttr = Rm(c));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Fm = (() => {
    let e = class e extends _r {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, o) {
        return (
          r.addEventListener(i, o, !1), () => this.removeEventListener(r, i, o)
        );
      }
      removeEventListener(r, i, o) {
        return r.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(I($e));
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Jc = ["alt", "control", "meta", "shift"],
  Pm = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  km = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  Lm = (() => {
    let e = class e extends _r {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return e.parseEventName(r) != null;
      }
      addEventListener(r, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => At().onAndCancel(r, s.domEventName, a));
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          u = i.indexOf("code");
        if (
          (u > -1 && (i.splice(u, 1), (a = "code.")),
          Jc.forEach((l) => {
            let d = i.indexOf(l);
            d > -1 && (i.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(r, i) {
        let o = Pm[r.key] || r.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = r.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Jc.forEach((a) => {
                if (a !== o) {
                  let u = km[a];
                  u(r) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(r, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, r) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(I($e));
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function il(t, e) {
  return Bc(F({ rootComponent: t }, Vm(e)));
}
function Vm(t) {
  return {
    appProviders: [...Hm, ...(t?.providers ?? [])],
    platformProviders: Um,
  };
}
function jm() {
  ss.makeCurrent();
}
function $m() {
  return new Me();
}
function Bm() {
  return ju(document), document;
}
var Um = [
  { provide: xt, useValue: Yc },
  { provide: Ao, useValue: jm, multi: !0 },
  { provide: $e, useFactory: Bm, deps: [] },
];
var Hm = [
  { provide: pr, useValue: "root" },
  { provide: Me, useFactory: $m, deps: [] },
  { provide: as, useClass: Fm, multi: !0, deps: [$e, P, xt] },
  { provide: as, useClass: Lm, multi: !0, deps: [$e] },
  Qc,
  tl,
  el,
  { provide: Wt, useExisting: Qc },
  { provide: Mr, useClass: Sm, deps: [] },
  [],
];
var ol = { providers: [] };
var Wm = "primary",
  qm = Symbol("RouteTitle"),
  ls = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function sl(t) {
  return new ls(t);
}
var ds = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new ps()),
        (this.attachRef = null);
    }
  },
  ps = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(r, i) {
        let o = this.getOrCreateContext(r);
        (o.outlet = i), this.contexts.set(r, o);
      }
      onChildOutletDestroyed(r) {
        let i = this.getContext(r);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let r = this.contexts;
        return (this.contexts = new Map()), r;
      }
      onOutletReAttached(r) {
        this.contexts = r;
      }
      getOrCreateContext(r) {
        let i = this.getContext(r);
        return i || ((i = new ds()), this.contexts.set(r, i)), i;
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var fs = class {
  constructor(e, n, r, i, o, s, a, u) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(re((c) => c[qm])) ?? Pt(void 0)),
      (this.url = e),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      this._paramMap || (this._paramMap = this.params.pipe(re((e) => sl(e)))),
      this._paramMap
    );
  }
  get queryParamMap() {
    return (
      this._queryParamMap ||
        (this._queryParamMap = this.queryParams.pipe(re((e) => sl(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
var al = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = Wm),
          (this.activateEvents = new j()),
          (this.deactivateEvents = new j()),
          (this.attachEvents = new j()),
          (this.detachEvents = new j()),
          (this.parentContexts = T(ps)),
          (this.location = T(en)),
          (this.changeDetector = T(Xt)),
          (this.environmentInjector = T(ce)),
          (this.inputBinder = T(Zm, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: o } = r.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let r = this.parentContexts.getContext(this.name);
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new m(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new m(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new m(4012, !1);
        this.location.detach();
        let r = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        );
      }
      attach(r, i) {
        (this.activated = r),
          (this._activatedRoute = i),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance);
      }
      deactivate() {
        if (this.activated) {
          let r = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r);
        }
      }
      activateWith(r, i) {
        if (this.isActivated) throw new m(4013, !1);
        this._activatedRoute = r;
        let o = this.location,
          a = r.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new hs(r, u, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = q({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [et],
      }));
    let t = e;
    return t;
  })(),
  hs = class {
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === fs
        ? this.route
        : e === ps
        ? this.childContexts
        : this.parent.get(e, n);
    }
  },
  Zm = new E("");
var gl = (() => {
    let e = class e {
      constructor(r, i) {
        (this._renderer = r),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(r, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, r, i);
      }
      registerOnTouched(r) {
        this.onTouched = r;
      }
      registerOnChange(r) {
        this.onChange = r;
      }
      setDisabledState(r) {
        this.setProperty("disabled", r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(tt), M(Le));
    }),
      (e.ɵdir = q({ type: e }));
    let t = e;
    return t;
  })(),
  Ym = (() => {
    let e = class e extends gl {};
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = Eo(e)))(o || e);
      };
    })()),
      (e.ɵdir = q({ type: e, features: [Ve] }));
    let t = e;
    return t;
  })(),
  ml = new E("NgValueAccessor");
var Qm = { provide: ml, useExisting: bt(() => kr), multi: !0 };
function Km() {
  let t = At() ? At().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var Jm = new E("CompositionEventMode"),
  kr = (() => {
    let e = class e extends gl {
      constructor(r, i, o) {
        super(r, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !Km());
      }
      writeValue(r) {
        let i = r ?? "";
        this.setProperty("value", i);
      }
      _handleInput(r) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(r);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(r) {
        (this._composing = !1), this._compositionMode && this.onChange(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(tt), M(Le), M(Jm, 8));
    }),
      (e.ɵdir = q({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            xe("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [Er([Qm]), Ve],
      }));
    let t = e;
    return t;
  })();
function Be(t) {
  return (
    t == null || ((typeof t == "string" || Array.isArray(t)) && t.length === 0)
  );
}
function vl(t) {
  return t != null && typeof t.length == "number";
}
var yl = new E("NgValidators"),
  Dl = new E("NgAsyncValidators"),
  Xm =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  pe = class {
    static min(e) {
      return ev(e);
    }
    static max(e) {
      return tv(e);
    }
    static required(e) {
      return nv(e);
    }
    static requiredTrue(e) {
      return rv(e);
    }
    static email(e) {
      return iv(e);
    }
    static minLength(e) {
      return ov(e);
    }
    static maxLength(e) {
      return sv(e);
    }
    static pattern(e) {
      return av(e);
    }
    static nullValidator(e) {
      return Cl(e);
    }
    static compose(e) {
      return _l(e);
    }
    static composeAsync(e) {
      return xl(e);
    }
  };
function ev(t) {
  return (e) => {
    if (Be(e.value) || Be(t)) return null;
    let n = parseFloat(e.value);
    return !isNaN(n) && n < t ? { min: { min: t, actual: e.value } } : null;
  };
}
function tv(t) {
  return (e) => {
    if (Be(e.value) || Be(t)) return null;
    let n = parseFloat(e.value);
    return !isNaN(n) && n > t ? { max: { max: t, actual: e.value } } : null;
  };
}
function nv(t) {
  return Be(t.value) ? { required: !0 } : null;
}
function rv(t) {
  return t.value === !0 ? null : { required: !0 };
}
function iv(t) {
  return Be(t.value) || Xm.test(t.value) ? null : { email: !0 };
}
function ov(t) {
  return (e) =>
    Be(e.value) || !vl(e.value)
      ? null
      : e.value.length < t
      ? { minlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function sv(t) {
  return (e) =>
    vl(e.value) && e.value.length > t
      ? { maxlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function av(t) {
  if (!t) return Cl;
  let e, n;
  return (
    typeof t == "string"
      ? ((n = ""),
        t.charAt(0) !== "^" && (n += "^"),
        (n += t),
        t.charAt(t.length - 1) !== "$" && (n += "$"),
        (e = new RegExp(n)))
      : ((n = t.toString()), (e = t)),
    (r) => {
      if (Be(r.value)) return null;
      let i = r.value;
      return e.test(i)
        ? null
        : { pattern: { requiredPattern: n, actualValue: i } };
    }
  );
}
function Cl(t) {
  return null;
}
function wl(t) {
  return t != null;
}
function El(t) {
  return Tt(t) ? Ae(t) : t;
}
function Il(t) {
  let e = {};
  return (
    t.forEach((n) => {
      e = n != null ? F(F({}, e), n) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function bl(t, e) {
  return e.map((n) => n(t));
}
function uv(t) {
  return !t.validate;
}
function Ml(t) {
  return t.map((e) => (uv(e) ? e : (n) => e.validate(n)));
}
function _l(t) {
  if (!t) return null;
  let e = t.filter(wl);
  return e.length == 0
    ? null
    : function (n) {
        return Il(bl(n, e));
      };
}
function Sl(t) {
  return t != null ? _l(Ml(t)) : null;
}
function xl(t) {
  if (!t) return null;
  let e = t.filter(wl);
  return e.length == 0
    ? null
    : function (n) {
        let r = bl(n, e).map(El);
        return ti(r).pipe(re(Il));
      };
}
function Tl(t) {
  return t != null ? xl(Ml(t)) : null;
}
function ul(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function Al(t) {
  return t._rawValidators;
}
function Nl(t) {
  return t._rawAsyncValidators;
}
function gs(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Tr(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function cl(t, e) {
  let n = gs(e);
  return (
    gs(t).forEach((i) => {
      Tr(n, i) || n.push(i);
    }),
    n
  );
}
function ll(t, e) {
  return gs(e).filter((n) => !Tr(t, n));
}
var Ar = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = Sl(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = Tl(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, n) {
      return this.control ? this.control.hasError(e, n) : !1;
    }
    getError(e, n) {
      return this.control ? this.control.getError(e, n) : null;
    }
  },
  Ot = class extends Ar {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  un = class extends Ar {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  Nr = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  cv = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  qI = B(F({}, cv), { "[class.ng-submitted]": "isSubmitted" }),
  Ol = (() => {
    let e = class e extends Nr {
      constructor(r) {
        super(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(un, 2));
    }),
      (e.ɵdir = q({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            wr("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [Ve],
      }));
    let t = e;
    return t;
  })(),
  Rl = (() => {
    let e = class e extends Nr {
      constructor(r) {
        super(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(Ot, 10));
    }),
      (e.ɵdir = q({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (i, o) {
          i & 2 &&
            wr("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        features: [Ve],
      }));
    let t = e;
    return t;
  })();
var sn = "VALID",
  xr = "INVALID",
  Nt = "PENDING",
  an = "DISABLED";
function Fl(t) {
  return (Lr(t) ? t.validators : t) || null;
}
function lv(t) {
  return Array.isArray(t) ? Sl(t) : t || null;
}
function Pl(t, e) {
  return (Lr(e) ? e.asyncValidators : t) || null;
}
function dv(t) {
  return Array.isArray(t) ? Tl(t) : t || null;
}
function Lr(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
function fv(t, e, n) {
  let r = t.controls;
  if (!(e ? Object.keys(r) : r).length) throw new m(1e3, "");
  if (!r[n]) throw new m(1001, "");
}
function hv(t, e, n) {
  t._forEachChild((r, i) => {
    if (n[i] === void 0) throw new m(1002, "");
  });
}
var Or = class {
    constructor(e, n) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(n);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === sn;
    }
    get invalid() {
      return this.status === xr;
    }
    get pending() {
      return this.status == Nt;
    }
    get disabled() {
      return this.status === an;
    }
    get enabled() {
      return this.status !== an;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(e) {
      this._assignValidators(e);
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e);
    }
    addValidators(e) {
      this.setValidators(cl(e, this._rawValidators));
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(cl(e, this._rawAsyncValidators));
    }
    removeValidators(e) {
      this.setValidators(ll(e, this._rawValidators));
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(ll(e, this._rawAsyncValidators));
    }
    hasValidator(e) {
      return Tr(this._rawValidators, e);
    }
    hasAsyncValidator(e) {
      return Tr(this._rawAsyncValidators, e);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(e = {}) {
      (this.touched = !0),
        this._parent && !e.onlySelf && this._parent.markAsTouched(e);
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }),
        this._forEachChild((e) => e.markAllAsTouched());
    }
    markAsUntouched(e = {}) {
      (this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild((n) => {
          n.markAsUntouched({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    markAsDirty(e = {}) {
      (this.pristine = !1),
        this._parent && !e.onlySelf && this._parent.markAsDirty(e);
    }
    markAsPristine(e = {}) {
      (this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild((n) => {
          n.markAsPristine({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    markAsPending(e = {}) {
      (this.status = Nt),
        e.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !e.onlySelf && this._parent.markAsPending(e);
    }
    disable(e = {}) {
      let n = this._parentMarkedDirty(e.onlySelf);
      (this.status = an),
        (this.errors = null),
        this._forEachChild((r) => {
          r.disable(B(F({}, e), { onlySelf: !0 }));
        }),
        this._updateValue(),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._updateAncestors(B(F({}, e), { skipPristineCheck: n })),
        this._onDisabledChange.forEach((r) => r(!0));
    }
    enable(e = {}) {
      let n = this._parentMarkedDirty(e.onlySelf);
      (this.status = sn),
        this._forEachChild((r) => {
          r.enable(B(F({}, e), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors(B(F({}, e), { skipPristineCheck: n })),
        this._onDisabledChange.forEach((r) => r(!1));
    }
    _updateAncestors(e) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e),
        e.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched());
    }
    setParent(e) {
      this._parent = e;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(e = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === sn || this.status === Nt) &&
            this._runAsyncValidator(e.emitEvent)),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild((n) => n._updateTreeValidity(e)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? an : sn;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(e) {
      if (this.asyncValidator) {
        (this.status = Nt), (this._hasOwnPendingAsyncValidator = !0);
        let n = El(this.asyncValidator(this));
        this._asyncValidationSubscription = n.subscribe((r) => {
          (this._hasOwnPendingAsyncValidator = !1),
            this.setErrors(r, { emitEvent: e });
        });
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription &&
        (this._asyncValidationSubscription.unsubscribe(),
        (this._hasOwnPendingAsyncValidator = !1));
    }
    setErrors(e, n = {}) {
      (this.errors = e), this._updateControlsErrors(n.emitEvent !== !1);
    }
    get(e) {
      let n = e;
      return n == null ||
        (Array.isArray(n) || (n = n.split(".")), n.length === 0)
        ? null
        : n.reduce((r, i) => r && r._find(i), this);
    }
    getError(e, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[e] : null;
    }
    hasError(e, n) {
      return !!this.getError(e, n);
    }
    get root() {
      let e = this;
      for (; e._parent; ) e = e._parent;
      return e;
    }
    _updateControlsErrors(e) {
      (this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(e);
    }
    _initObservables() {
      (this.valueChanges = new j()), (this.statusChanges = new j());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? an
        : this.errors
        ? xr
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Nt)
        ? Nt
        : this._anyControlsHaveStatus(xr)
        ? xr
        : sn;
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls((n) => n.status === e);
    }
    _anyControlsDirty() {
      return this._anyControls((e) => e.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((e) => e.touched);
    }
    _updatePristine(e = {}) {
      (this.pristine = !this._anyControlsDirty()),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    _updateTouched(e = {}) {
      (this.touched = this._anyControlsTouched()),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e;
    }
    _setUpdateStrategy(e) {
      Lr(e) && e.updateOn != null && (this._updateOn = e.updateOn);
    }
    _parentMarkedDirty(e) {
      let n = this._parent && this._parent.dirty;
      return !e && !!n && !this._parent._anyControlsDirty();
    }
    _find(e) {
      return null;
    }
    _assignValidators(e) {
      (this._rawValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedValidatorFn = lv(this._rawValidators));
    }
    _assignAsyncValidators(e) {
      (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedAsyncValidatorFn = dv(this._rawAsyncValidators));
    }
  },
  Rr = class extends Or {
    constructor(e, n, r) {
      super(Fl(n), Pl(r, n)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(e, n) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(e, n, r = {}) {
      this.registerControl(e, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(e, n = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    setControl(e, n, r = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        n && this.registerControl(e, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
    }
    setValue(e, n = {}) {
      hv(this, !0, e),
        Object.keys(e).forEach((r) => {
          fv(this, !0, r),
            this.controls[r].setValue(e[r], {
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(e, n = {}) {
      e != null &&
        (Object.keys(e).forEach((r) => {
          let i = this.controls[r];
          i && i.patchValue(e[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(e = {}, n = {}) {
      this._forEachChild((r, i) => {
        r.reset(e ? e[i] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n),
        this._updateTouched(n),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (e, n, r) => ((e[r] = n.getRawValue()), e)
      );
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (n, r) =>
        r._syncPendingControls() ? !0 : n
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && e(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((e) => {
        e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(e) {
      for (let [n, r] of Object.entries(this.controls))
        if (this.contains(n) && e(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let e = {};
      return this._reduceChildren(
        e,
        (n, r, i) => ((r.enabled || this.disabled) && (n[i] = r.value), n)
      );
    }
    _reduceChildren(e, n) {
      let r = e;
      return (
        this._forEachChild((i, o) => {
          r = n(r, i, o);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls))
        if (this.controls[e].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
    }
  };
var kl = new E("CallSetDisabledState", {
    providedIn: "root",
    factory: () => ms,
  }),
  ms = "always";
function pv(t, e) {
  return [...e.path, t];
}
function dl(t, e, n = ms) {
  vs(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || n === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    mv(t, e),
    yv(t, e),
    vv(t, e),
    gv(t, e);
}
function fl(t, e, n = !0) {
  let r = () => {};
  e.valueAccessor &&
    (e.valueAccessor.registerOnChange(r), e.valueAccessor.registerOnTouched(r)),
    Pr(t, e),
    t &&
      (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function Fr(t, e) {
  t.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(e);
  });
}
function gv(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let n = (r) => {
      e.valueAccessor.setDisabledState(r);
    };
    t.registerOnDisabledChange(n),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(n);
      });
  }
}
function vs(t, e) {
  let n = Al(t);
  e.validator !== null
    ? t.setValidators(ul(n, e.validator))
    : typeof n == "function" && t.setValidators([n]);
  let r = Nl(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(ul(r, e.asyncValidator))
    : typeof r == "function" && t.setAsyncValidators([r]);
  let i = () => t.updateValueAndValidity();
  Fr(e._rawValidators, i), Fr(e._rawAsyncValidators, i);
}
function Pr(t, e) {
  let n = !1;
  if (t !== null) {
    if (e.validator !== null) {
      let i = Al(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.validator);
        o.length !== i.length && ((n = !0), t.setValidators(o));
      }
    }
    if (e.asyncValidator !== null) {
      let i = Nl(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.asyncValidator);
        o.length !== i.length && ((n = !0), t.setAsyncValidators(o));
      }
    }
  }
  let r = () => {};
  return Fr(e._rawValidators, r), Fr(e._rawAsyncValidators, r), n;
}
function mv(t, e) {
  e.valueAccessor.registerOnChange((n) => {
    (t._pendingValue = n),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && Ll(t, e);
  });
}
function vv(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && Ll(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function Ll(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function yv(t, e) {
  let n = (r, i) => {
    e.valueAccessor.writeValue(r), i && e.viewToModelUpdate(r);
  };
  t.registerOnChange(n),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(n);
    });
}
function Dv(t, e) {
  t == null, vs(t, e);
}
function Cv(t, e) {
  return Pr(t, e);
}
function wv(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let n = t.model;
  return n.isFirstChange() ? !0 : !Object.is(e, n.currentValue);
}
function Ev(t) {
  return Object.getPrototypeOf(t.constructor) === Ym;
}
function Iv(t, e) {
  t._syncPendingControls(),
    e.forEach((n) => {
      let r = n.control;
      r.updateOn === "submit" &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    });
}
function bv(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let n, r, i;
  return (
    e.forEach((o) => {
      o.constructor === kr ? (n = o) : Ev(o) ? (r = o) : (i = o);
    }),
    i || r || n || null
  );
}
function Mv(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
function hl(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
function pl(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var Rt = class extends Or {
  constructor(e = null, n, r) {
    super(Fl(n), Pl(r, n)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Lr(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (pl(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, n = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) =>
          r(this.value, n.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(n);
  }
  patchValue(e, n = {}) {
    this.setValue(e, n);
  }
  reset(e = this.defaultValue, n = {}) {
    this._applyFormState(e),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    hl(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    hl(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    pl(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var _v = (t) => t instanceof Rt;
var Vl = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵdir = q({
      type: e,
      selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
      hostAttrs: ["novalidate", ""],
    }));
  let t = e;
  return t;
})();
var Sv = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Pe({ type: e })),
    (e.ɵinj = Fe({}));
  let t = e;
  return t;
})();
var jl = new E("NgModelWithFormControlWarning");
var xv = { provide: Ot, useExisting: bt(() => ys) },
  ys = (() => {
    let e = class e extends Ot {
      constructor(r, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new j()),
          this._setValidators(r),
          this._setAsyncValidators(i);
      }
      ngOnChanges(r) {
        this._checkFormPresent(),
          r.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Pr(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(r) {
        let i = this.form.get(r.path);
        return (
          dl(i, r, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(r),
          i
        );
      }
      getControl(r) {
        return this.form.get(r.path);
      }
      removeControl(r) {
        fl(r.control || null, r, !1), Mv(this.directives, r);
      }
      addFormGroup(r) {
        this._setUpFormContainer(r);
      }
      removeFormGroup(r) {
        this._cleanUpFormContainer(r);
      }
      getFormGroup(r) {
        return this.form.get(r.path);
      }
      addFormArray(r) {
        this._setUpFormContainer(r);
      }
      removeFormArray(r) {
        this._cleanUpFormContainer(r);
      }
      getFormArray(r) {
        return this.form.get(r.path);
      }
      updateModel(r, i) {
        this.form.get(r.path).setValue(i);
      }
      onSubmit(r) {
        return (
          (this.submitted = !0),
          Iv(this.form, this.directives),
          this.ngSubmit.emit(r),
          r?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(r = void 0) {
        this.form.reset(r), (this.submitted = !1);
      }
      _updateDomValue() {
        this.directives.forEach((r) => {
          let i = r.control,
            o = this.form.get(r.path);
          i !== o &&
            (fl(i || null, r),
            _v(o) && (dl(o, r, this.callSetDisabledState), (r.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(r) {
        let i = this.form.get(r.path);
        Dv(i, r), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(r) {
        if (this.form) {
          let i = this.form.get(r.path);
          i && Cv(i, r) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        vs(this.form, this), this._oldForm && Pr(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(yl, 10), M(Dl, 10), M(kl, 8));
    }),
      (e.ɵdir = q({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (i, o) {
          i & 1 &&
            xe("submit", function (a) {
              return o.onSubmit(a);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { form: ["formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [Er([xv]), Ve, et],
      }));
    let t = e;
    return t;
  })();
var Tv = { provide: un, useExisting: bt(() => Ds) },
  Ds = (() => {
    let e = class e extends un {
      set isDisabled(r) {}
      constructor(r, i, o, s, a) {
        super(),
          (this._ngModelWarningConfig = a),
          (this._added = !1),
          (this.name = null),
          (this.update = new j()),
          (this._ngModelWarningSent = !1),
          (this._parent = r),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = bv(this, s));
      }
      ngOnChanges(r) {
        this._added || this._setUpControl(),
          wv(r, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(r) {
        (this.viewModel = r), this.update.emit(r);
      }
      get path() {
        return pv(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
    };
    (e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (i) {
        return new (i || e)(
          M(Ot, 13),
          M(yl, 10),
          M(Dl, 10),
          M(ml, 10),
          M(jl, 8)
        );
      }),
      (e.ɵdir = q({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: ["formControlName", "name"],
          isDisabled: ["disabled", "isDisabled"],
          model: ["ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        features: [Er([Tv]), Ve, et],
      }));
    let t = e;
    return t;
  })();
var Av = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Pe({ type: e })),
    (e.ɵinj = Fe({ imports: [Sv] }));
  let t = e;
  return t;
})();
var $l = (() => {
  let e = class e {
    static withConfig(r) {
      return {
        ngModule: e,
        providers: [
          { provide: jl, useValue: r.warnOnNgModelWithFormControl ?? "always" },
          { provide: kl, useValue: r.callSetDisabledState ?? ms },
        ],
      };
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Pe({ type: e })),
    (e.ɵinj = Fe({ imports: [Av] }));
  let t = e;
  return t;
})();
var Te = { _origin: "https://api.emailjs.com" };
var Bl = (t, e = "https://api.emailjs.com") => {
  (Te._userID = t), (Te._origin = e);
};
var Vr = (t, e, n) => {
  if (!t)
    throw "The public key is required. Visit https://dashboard.emailjs.com/admin/account";
  if (!e)
    throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
  if (!n)
    throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";
  return !0;
};
var cn = class {
  constructor(e) {
    (this.status = e ? e.status : 0),
      (this.text = e ? e.responseText : "Network Error");
  }
};
var jr = (t, e, n = {}) =>
  new Promise((r, i) => {
    let o = new XMLHttpRequest();
    o.addEventListener("load", ({ target: s }) => {
      let a = new cn(s);
      a.status === 200 || a.text === "OK" ? r(a) : i(a);
    }),
      o.addEventListener("error", ({ target: s }) => {
        i(new cn(s));
      }),
      o.open("POST", Te._origin + t, !0),
      Object.keys(n).forEach((s) => {
        o.setRequestHeader(s, n[s]);
      }),
      o.send(e);
  });
var Ul = (t, e, n, r) => {
  let i = r || Te._userID;
  return (
    Vr(i, t, e),
    jr(
      "/api/v1.0/email/send",
      JSON.stringify({
        lib_version: "3.11.0",
        user_id: i,
        service_id: t,
        template_id: e,
        template_params: n,
      }),
      { "Content-type": "application/json" }
    )
  );
};
var Ov = (t) => {
    let e;
    if (
      (typeof t == "string" ? (e = document.querySelector(t)) : (e = t),
      !e || e.nodeName !== "FORM")
    )
      throw "The 3rd parameter is expected to be the HTML form element or the style selector of form";
    return e;
  },
  Hl = (t, e, n, r) => {
    let i = r || Te._userID,
      o = Ov(n);
    Vr(i, t, e);
    let s = new FormData(o);
    return (
      s.append("lib_version", "3.11.0"),
      s.append("service_id", t),
      s.append("template_id", e),
      s.append("user_id", i),
      jr("/api/v1.0/email/send-form", s)
    );
  };
var Gl = { init: Bl, send: Ul, sendForm: Hl };
var ln = (t) => ({ "submit-active": t }),
  Rv = (t) => ({ "send-btn": !0, button: !0, disabled: t });
function Fv(t, e) {
  if (t & 1) {
    let n = Ac();
    L(0, "form", 8),
      xe("submit", function () {
        cu(n);
        let i = Zo();
        return lu(i.sendEmail(i.contactForm.value));
      }),
      L(1, "div"),
      ee(2, "div", 9)(3, "input", 10),
      X(),
      L(4, "div"),
      ee(5, "div", 9)(6, "input", 11),
      X(),
      L(7, "div"),
      ee(8, "div", 9)(9, "input", 12),
      X(),
      L(10, "div"),
      ee(11, "div", 9)(12, "textarea", 13),
      X(),
      L(13, "div"),
      ee(14, "div", 9)(15, "input", 14),
      X()();
  }
  if (t & 2) {
    let n = Zo();
    he("formGroup", n.contactForm),
      Se(2),
      he("ngClass", je(7, ln, n.contactForm.controls.name.valid)),
      Se(3),
      he("ngClass", je(9, ln, n.contactForm.controls.email.valid)),
      Se(3),
      he("ngClass", je(11, ln, n.contactForm.controls.subject.valid)),
      Se(3),
      he("ngClass", je(13, ln, n.contactForm.controls.message.valid)),
      Se(3),
      he("ngClass", je(15, ln, n.contactForm.valid)),
      Se(1),
      he("ngClass", je(17, Rv, !n.contactForm.valid));
  }
}
function Pv(t, e) {
  t & 1 && (L(0, "section", 15)(1, "div"), Oc(2, "Email sent"), X()());
}
var kv = (t) => ({ content: !0, faded: t }),
  zl = (() => {
    let e = class e {
      constructor() {
        (this.isFaded = !0),
          (this.isEmailSent = !1),
          (this.contactForm = new Rr({
            name: new Rt("", pe.required),
            email: new Rt("", pe.compose([pe.required, pe.email])),
            subject: new Rt("", pe.required),
            message: new Rt("", pe.compose([pe.required, pe.minLength(30)])),
          }));
      }
      ngOnInit() {
        let r = document.querySelector(".spinner");
        r && (r.style.display = "none"), (this.isFaded = !1);
      }
      sendEmail(r) {
        Gl.send("service_0lnz0ab", "template_dw76dor", r, "D0ctY-SwJYajvmMel"),
          (this.isEmailSent = !0);
      }
      openURL(r) {
        window.open(r, "_blank");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵcmp = lo({
        type: e,
        selectors: [["app-root"]],
        standalone: !0,
        features: [Yo],
        decls: 16,
        vars: 6,
        consts: [
          ["class", "form", 3, "formGroup", "submit", 4, "ngIf"],
          ["class", "sent", 4, "ngIf"],
          [1, "socials"],
          [1, "ng-button", "button", 3, "click"],
          [
            "xmlns",
            "http://www.w3.org/2000/svg",
            "height",
            "16",
            "width",
            "15.5",
            "viewBox",
            "0 0 496 512",
          ],
          [
            "d",
            "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z",
          ],
          [
            "xmlns",
            "http://www.w3.org/2000/svg",
            "height",
            "16",
            "width",
            "14",
            "viewBox",
            "0 0 448 512",
          ],
          [
            "d",
            "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z",
          ],
          [1, "form", 3, "formGroup", "submit"],
          [3, "ngClass"],
          ["placeholder", "Name", "type", "text", "formControlName", "name"],
          ["placeholder", "Email", "type", "email", "formControlName", "email"],
          ["placeholder", "Subject", "formControlName", "subject"],
          ["placeholder", "Message", "formControlName", "message"],
          ["value", "Send", "type", "submit", 3, "ngClass"],
          [1, "sent"],
        ],
        template: function (i, o) {
          i & 1 &&
            (L(0, "div"),
            qo(1, Fv, 16, 19, "form", 0)(2, Pv, 3, 0, "section", 1),
            L(3, "div"),
            ee(4, "div")(5, "div")(6, "div")(7, "div"),
            X(),
            L(8, "section", 2)(9, "div", 3),
            xe("click", function () {
              return o.openURL("https://github.com/R-zine");
            }),
            mo(),
            L(10, "svg", 4),
            ee(11, "path", 5),
            X()(),
            vo(),
            L(12, "div", 3),
            xe("click", function () {
              return o.openURL("https://www.linkedin.com/in/ivan-radev/");
            }),
            mo(),
            L(13, "svg", 6),
            ee(14, "path", 7),
            X()()()(),
            vo(),
            ee(15, "router-outlet")),
            i & 2 &&
              (bc(je(4, kv, o.isFaded)),
              Se(1),
              he("ngIf", !o.isEmailSent),
              Se(1),
              he("ngIf", o.isEmailSent));
        },
        dependencies: [ts, qc, Zc, al, $l, Vl, kr, Ol, Rl, ys, Ds],
        styles: [
          '@import"https://fonts.googleapis.com/css2?family=Poiret+One&display=swap";.faded[_ngcontent-%COMP%]{opacity:0}.content[_ngcontent-%COMP%]{display:flex;justify-content:space-evenly;align-items:center;background-color:#000;color:#fff;height:100vh;font-family:Poiret One,sans-serif;transition:opacity 1.2s;justify-content:center!important;gap:10vw}.content[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{width:0;background-color:#fff;height:50%;border:2px solid white;position:relative}.content[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:nth-child(1){content:"";position:absolute;width:10px;height:7px;left:20px;top:25%;background-color:#fff;box-shadow:0 0 5px 5px #fff;transform:perspective(10.5px) rotateY(-45deg)}.content[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:nth-child(2){content:"";position:absolute;width:10px;height:7px;left:20px;bottom:25%;background-color:#fff;box-shadow:0 0 5px 5px #fff;transform:perspective(10.5px) rotateY(-45deg)}.content[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:nth-child(3){content:"";position:absolute;width:10px;height:7px;left:-30px;top:25%;background-color:#fff;box-shadow:0 0 5px 5px #fff;transform:perspective(10.5px) rotateY(45deg)}.content[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:nth-child(4){content:"";position:absolute;width:10px;height:7px;left:-30px;bottom:25%;background-color:#fff;box-shadow:0 0 5px 5px #fff;transform:perspective(10.5px) rotateY(45deg)}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]{min-width:25%;max-width:25%;width:25%;display:flex;justify-content:space-evenly;align-items:center;flex-direction:column;gap:3vh}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{display:flex;justify-content:space-evenly;align-items:center;gap:2vh}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{border:1px solid white;border-radius:50%;width:1.2vh;height:1.2vh;transition:.9s}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > input[_ngcontent-%COMP%], .content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > textarea[_ngcontent-%COMP%]{background-color:#000;border:2px solid white;border-radius:5px;height:3vh;width:15vw;text-align:center;font-size:1.5vh;color:#fff;transition:.5s;font-family:Poiret One,sans-serif}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > input[_ngcontent-%COMP%]::placeholder, .content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > textarea[_ngcontent-%COMP%]::placeholder{color:#fffc}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > input[_ngcontent-%COMP%]:focus-within, .content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > textarea[_ngcontent-%COMP%]:focus-within{box-shadow:0 0 15px 2px #fff;border-color:#000}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > input[_ngcontent-%COMP%]:focus-within::placeholder, .content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > textarea[_ngcontent-%COMP%]:focus-within::placeholder{opacity:0}.content[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > textarea[_ngcontent-%COMP%]{height:15vh}.socials[_ngcontent-%COMP%]{display:flex;justify-content:space-evenly;align-items:center;min-width:25%;max-width:25%;width:25%;flex-direction:column;gap:3vh}.ng-button[_ngcontent-%COMP%]{display:flex;justify-content:space-evenly;align-items:center;width:5vh;height:5vh;border:2px solid white;border-radius:50%;transition:box-shadow .4s,background-color 1.2s}.ng-button[_ngcontent-%COMP%] > svg[_ngcontent-%COMP%]{filter:invert(100%);width:60%;height:60%;transition:1.4s}.ng-button[_ngcontent-%COMP%]:hover{box-shadow:0 0 15px inset #fff,0 0 15px #fff,0 0 30px #fff;background-color:#fff}.ng-button[_ngcontent-%COMP%]:hover > svg[_ngcontent-%COMP%]{filter:invert(0)}.send-btn[_ngcontent-%COMP%]{display:flex;justify-content:space-evenly;align-items:center;width:15vh;height:3vh!important;width:15vw!important;border-width:2px!important;border-radius:5px!important;transition:box-shadow .4s,background-color 1.2s,color 1.4s,opacity .5s}.send-btn[_ngcontent-%COMP%]:hover{box-shadow:0 0 15px inset #fff,0 0 15px #fff,0 0 30px #fff;background-color:#fff;color:#000}.disabled[_ngcontent-%COMP%]{pointer-events:none;opacity:.5}.submit-active[_ngcontent-%COMP%]{box-shadow:0 0 15px inset #fff,0 0 15px #fff,0 0 30px #fff;background-color:#fff}.sent[_ngcontent-%COMP%]{display:flex;justify-content:space-evenly;align-items:center;min-width:25%;max-width:25%;width:25%;text-align:center}.sent[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{border:2px solid white;border-radius:50%;width:20vh;height:20vh;display:flex;justify-content:space-evenly;align-items:center}',
        ],
      }));
    let t = e;
    return t;
  })();
il(zl, ol).catch((t) => console.error(t));
