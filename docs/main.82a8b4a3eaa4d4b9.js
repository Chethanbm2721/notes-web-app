"use strict";
(self.webpackChunknotes = self.webpackChunknotes || []).push([
  [179],
  {
    709: () => {
      function K(e) {
        return "function" == typeof e;
      }
      function Eo(e) {
        const t = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (t.prototype = Object.create(Error.prototype)),
          (t.prototype.constructor = t),
          t
        );
      }
      const ns = Eo(
        (e) =>
          function (t) {
            e(this),
              (this.message = t
                ? `${t.length} errors occurred during unsubscription:\n${t
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = t);
          }
      );
      function bo(e, n) {
        if (e) {
          const t = e.indexOf(n);
          0 <= t && e.splice(t, 1);
        }
      }
      class et {
        constructor(n) {
          (this.initialTeardown = n),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let n;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: t } = this;
            if (t)
              if (((this._parentage = null), Array.isArray(t)))
                for (const i of t) i.remove(this);
              else t.remove(this);
            const { initialTeardown: r } = this;
            if (K(r))
              try {
                r();
              } catch (i) {
                n = i instanceof ns ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  Xf(i);
                } catch (s) {
                  (n = n ?? []),
                    s instanceof ns ? (n = [...n, ...s.errors]) : n.push(s);
                }
            }
            if (n) throw new ns(n);
          }
        }
        add(n) {
          var t;
          if (n && n !== this)
            if (this.closed) Xf(n);
            else {
              if (n instanceof et) {
                if (n.closed || n._hasParent(this)) return;
                n._addParent(this);
              }
              (this._finalizers =
                null !== (t = this._finalizers) && void 0 !== t ? t : []).push(
                n
              );
            }
        }
        _hasParent(n) {
          const { _parentage: t } = this;
          return t === n || (Array.isArray(t) && t.includes(n));
        }
        _addParent(n) {
          const { _parentage: t } = this;
          this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
        }
        _removeParent(n) {
          const { _parentage: t } = this;
          t === n ? (this._parentage = null) : Array.isArray(t) && bo(t, n);
        }
        remove(n) {
          const { _finalizers: t } = this;
          t && bo(t, n), n instanceof et && n._removeParent(this);
        }
      }
      et.EMPTY = (() => {
        const e = new et();
        return (e.closed = !0), e;
      })();
      const Qf = et.EMPTY;
      function Kf(e) {
        return (
          e instanceof et ||
          (e && "closed" in e && K(e.remove) && K(e.add) && K(e.unsubscribe))
        );
      }
      function Xf(e) {
        K(e) ? e() : e.unsubscribe();
      }
      const Gn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        rs = {
          setTimeout(e, n, ...t) {
            const { delegate: r } = rs;
            return r?.setTimeout
              ? r.setTimeout(e, n, ...t)
              : setTimeout(e, n, ...t);
          },
          clearTimeout(e) {
            const { delegate: n } = rs;
            return (n?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Jf(e) {
        rs.setTimeout(() => {
          const { onUnhandledError: n } = Gn;
          if (!n) throw e;
          n(e);
        });
      }
      function Mu() {}
      const PE = Su("C", void 0, void 0);
      function Su(e, n, t) {
        return { kind: e, value: n, error: t };
      }
      let zn = null;
      function os(e) {
        if (Gn.useDeprecatedSynchronousErrorHandling) {
          const n = !zn;
          if ((n && (zn = { errorThrown: !1, error: null }), e(), n)) {
            const { errorThrown: t, error: r } = zn;
            if (((zn = null), t)) throw r;
          }
        } else e();
      }
      class Au extends et {
        constructor(n) {
          super(),
            (this.isStopped = !1),
            n
              ? ((this.destination = n), Kf(n) && n.add(this))
              : (this.destination = $E);
        }
        static create(n, t, r) {
          return new Io(n, t, r);
        }
        next(n) {
          this.isStopped
            ? Nu(
                (function kE(e) {
                  return Su("N", e, void 0);
                })(n),
                this
              )
            : this._next(n);
        }
        error(n) {
          this.isStopped
            ? Nu(
                (function FE(e) {
                  return Su("E", void 0, e);
                })(n),
                this
              )
            : ((this.isStopped = !0), this._error(n));
        }
        complete() {
          this.isStopped
            ? Nu(PE, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(n) {
          this.destination.next(n);
        }
        _error(n) {
          try {
            this.destination.error(n);
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
      }
      const VE = Function.prototype.bind;
      function Tu(e, n) {
        return VE.call(e, n);
      }
      class jE {
        constructor(n) {
          this.partialObserver = n;
        }
        next(n) {
          const { partialObserver: t } = this;
          if (t.next)
            try {
              t.next(n);
            } catch (r) {
              is(r);
            }
        }
        error(n) {
          const { partialObserver: t } = this;
          if (t.error)
            try {
              t.error(n);
            } catch (r) {
              is(r);
            }
          else is(n);
        }
        complete() {
          const { partialObserver: n } = this;
          if (n.complete)
            try {
              n.complete();
            } catch (t) {
              is(t);
            }
        }
      }
      class Io extends Au {
        constructor(n, t, r) {
          let o;
          if ((super(), K(n) || !n))
            o = {
              next: n ?? void 0,
              error: t ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && Gn.useDeprecatedNextContext
              ? ((i = Object.create(n)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: n.next && Tu(n.next, i),
                  error: n.error && Tu(n.error, i),
                  complete: n.complete && Tu(n.complete, i),
                }))
              : (o = n);
          }
          this.destination = new jE(o);
        }
      }
      function is(e) {
        Gn.useDeprecatedSynchronousErrorHandling
          ? (function LE(e) {
              Gn.useDeprecatedSynchronousErrorHandling &&
                zn &&
                ((zn.errorThrown = !0), (zn.error = e));
            })(e)
          : Jf(e);
      }
      function Nu(e, n) {
        const { onStoppedNotification: t } = Gn;
        t && rs.setTimeout(() => t(e, n));
      }
      const $E = {
          closed: !0,
          next: Mu,
          error: function BE(e) {
            throw e;
          },
          complete: Mu,
        },
        xu =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function bn(e) {
        return e;
      }
      function eh(e) {
        return 0 === e.length
          ? bn
          : 1 === e.length
          ? e[0]
          : function (t) {
              return e.reduce((r, o) => o(r), t);
            };
      }
      let ye = (() => {
        class e {
          constructor(t) {
            t && (this._subscribe = t);
          }
          lift(t) {
            const r = new e();
            return (r.source = this), (r.operator = t), r;
          }
          subscribe(t, r, o) {
            const i = (function GE(e) {
              return (
                (e && e instanceof Au) ||
                ((function UE(e) {
                  return e && K(e.next) && K(e.error) && K(e.complete);
                })(e) &&
                  Kf(e))
              );
            })(t)
              ? t
              : new Io(t, r, o);
            return (
              os(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t);
            } catch (r) {
              t.error(r);
            }
          }
          forEach(t, r) {
            return new (r = th(r))((o, i) => {
              const s = new Io({
                next: (a) => {
                  try {
                    t(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(t) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(t);
          }
          [xu]() {
            return this;
          }
          pipe(...t) {
            return eh(t)(this);
          }
          toPromise(t) {
            return new (t = th(t))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (n) => new e(n)), e;
      })();
      function th(e) {
        var n;
        return null !== (n = e ?? Gn.Promise) && void 0 !== n ? n : Promise;
      }
      const zE = Eo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let bt = (() => {
        class e extends ye {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(t) {
            const r = new nh(this, this);
            return (r.operator = t), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new zE();
          }
          next(t) {
            os(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(t);
              }
            });
          }
          error(t) {
            os(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = t);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(t);
              }
            });
          }
          complete() {
            os(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: t } = this;
                for (; t.length; ) t.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var t;
            return (
              (null === (t = this.observers) || void 0 === t
                ? void 0
                : t.length) > 0
            );
          }
          _trySubscribe(t) {
            return this._throwIfClosed(), super._trySubscribe(t);
          }
          _subscribe(t) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(t),
              this._innerSubscribe(t)
            );
          }
          _innerSubscribe(t) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? Qf
              : ((this.currentObservers = null),
                i.push(t),
                new et(() => {
                  (this.currentObservers = null), bo(i, t);
                }));
          }
          _checkFinalizedStatuses(t) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? t.error(o) : i && t.complete();
          }
          asObservable() {
            const t = new ye();
            return (t.source = this), t;
          }
        }
        return (e.create = (n, t) => new nh(n, t)), e;
      })();
      class nh extends bt {
        constructor(n, t) {
          super(), (this.destination = n), (this.source = t);
        }
        next(n) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.next) ||
            void 0 === r ||
            r.call(t, n);
        }
        error(n) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.error) ||
            void 0 === r ||
            r.call(t, n);
        }
        complete() {
          var n, t;
          null ===
            (t =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.complete) ||
            void 0 === t ||
            t.call(n);
        }
        _subscribe(n) {
          var t, r;
          return null !==
            (r =
              null === (t = this.source) || void 0 === t
                ? void 0
                : t.subscribe(n)) && void 0 !== r
            ? r
            : Qf;
        }
      }
      function rh(e) {
        return K(e?.lift);
      }
      function Ce(e) {
        return (n) => {
          if (rh(n))
            return n.lift(function (t) {
              try {
                return e(t, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function De(e, n, t, r, o) {
        return new qE(e, n, t, r, o);
      }
      class qE extends Au {
        constructor(n, t, r, o, i, s) {
          super(n),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = t
              ? function (a) {
                  try {
                    t(a);
                  } catch (u) {
                    n.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    n.error(u);
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
                    n.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var n;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: t } = this;
            super.unsubscribe(),
              !t &&
                (null === (n = this.onFinalize) ||
                  void 0 === n ||
                  n.call(this));
          }
        }
      }
      function X(e, n) {
        return Ce((t, r) => {
          let o = 0;
          t.subscribe(
            De(r, (i) => {
              r.next(e.call(n, i, o++));
            })
          );
        });
      }
      function In(e) {
        return this instanceof In ? ((this.v = e), this) : new In(e);
      }
      function ah(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t,
          n = e[Symbol.asyncIterator];
        return n
          ? n.call(e)
          : ((e = (function Fu(e) {
              var n = "function" == typeof Symbol && Symbol.iterator,
                t = n && e[n],
                r = 0;
              if (t) return t.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                n
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (t = {}),
            r("next"),
            r("throw"),
            r("return"),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function r(i) {
          t[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (c) {
                    i({ value: c, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const uh = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function ch(e) {
        return K(e?.then);
      }
      function lh(e) {
        return K(e[xu]);
      }
      function dh(e) {
        return Symbol.asyncIterator && K(e?.[Symbol.asyncIterator]);
      }
      function fh(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const hh = (function pb() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function ph(e) {
        return K(e?.[hh]);
      }
      function gh(e) {
        return (function sh(e, n, t) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = t.apply(e, n || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function u(f) {
                f.value instanceof In
                  ? Promise.resolve(f.value.v).then(c, l)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function c(f) {
            a("next", f);
          }
          function l(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const t = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield In(t.read());
              if (o) return yield In(void 0);
              yield yield In(r);
            }
          } finally {
            t.releaseLock();
          }
        });
      }
      function mh(e) {
        return K(e?.getReader);
      }
      function tt(e) {
        if (e instanceof ye) return e;
        if (null != e) {
          if (lh(e))
            return (function gb(e) {
              return new ye((n) => {
                const t = e[xu]();
                if (K(t.subscribe)) return t.subscribe(n);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (uh(e))
            return (function mb(e) {
              return new ye((n) => {
                for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
                n.complete();
              });
            })(e);
          if (ch(e))
            return (function vb(e) {
              return new ye((n) => {
                e.then(
                  (t) => {
                    n.closed || (n.next(t), n.complete());
                  },
                  (t) => n.error(t)
                ).then(null, Jf);
              });
            })(e);
          if (dh(e)) return vh(e);
          if (ph(e))
            return (function yb(e) {
              return new ye((n) => {
                for (const t of e) if ((n.next(t), n.closed)) return;
                n.complete();
              });
            })(e);
          if (mh(e))
            return (function Db(e) {
              return vh(gh(e));
            })(e);
        }
        throw fh(e);
      }
      function vh(e) {
        return new ye((n) => {
          (function _b(e, n) {
            var t, r, o, i;
            return (function oh(e, n, t, r) {
              return new (t || (t = Promise))(function (i, s) {
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
                  l.done
                    ? i(l.value)
                    : (function o(i) {
                        return i instanceof t
                          ? i
                          : new t(function (s) {
                              s(i);
                            });
                      })(l.value).then(a, u);
                }
                c((r = r.apply(e, n || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (t = ah(e); !(r = yield t.next()).done; )
                  if ((n.next(r.value), n.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = t.return) && (yield i.call(t));
                } finally {
                  if (o) throw o.error;
                }
              }
              n.complete();
            });
          })(e, n).catch((t) => n.error(t));
        });
      }
      function on(e, n, t, r = 0, o = !1) {
        const i = n.schedule(function () {
          t(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Me(e, n, t = 1 / 0) {
        return K(n)
          ? Me((r, o) => X((i, s) => n(r, i, o, s))(tt(e(r, o))), t)
          : ("number" == typeof n && (t = n),
            Ce((r, o) =>
              (function Cb(e, n, t, r, o, i, s, a) {
                const u = [];
                let c = 0,
                  l = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !c && n.complete();
                  },
                  h = (g) => (c < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && n.next(g), c++;
                    let y = !1;
                    tt(t(g, l++)).subscribe(
                      De(
                        n,
                        (C) => {
                          o?.(C), i ? h(C) : n.next(C);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (c--; u.length && c < r; ) {
                                const C = u.shift();
                                s ? on(n, s, () => p(C)) : p(C);
                              }
                              f();
                            } catch (C) {
                              n.error(C);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    De(n, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, t)
            ));
      }
      function fr(e = 1 / 0) {
        return Me(bn, e);
      }
      const Bt = new ye((e) => e.complete());
      function ku(e) {
        return e[e.length - 1];
      }
      function yh(e) {
        return K(ku(e)) ? e.pop() : void 0;
      }
      function Mo(e) {
        return (function Eb(e) {
          return e && K(e.schedule);
        })(ku(e))
          ? e.pop()
          : void 0;
      }
      function Dh(e, n = 0) {
        return Ce((t, r) => {
          t.subscribe(
            De(
              r,
              (o) => on(r, e, () => r.next(o), n),
              () => on(r, e, () => r.complete(), n),
              (o) => on(r, e, () => r.error(o), n)
            )
          );
        });
      }
      function _h(e, n = 0) {
        return Ce((t, r) => {
          r.add(e.schedule(() => t.subscribe(r), n));
        });
      }
      function Ch(e, n) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ye((t) => {
          on(t, n, () => {
            const r = e[Symbol.asyncIterator]();
            on(
              t,
              n,
              () => {
                r.next().then((o) => {
                  o.done ? t.complete() : t.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Ie(e, n) {
        return n
          ? (function Nb(e, n) {
              if (null != e) {
                if (lh(e))
                  return (function Ib(e, n) {
                    return tt(e).pipe(_h(n), Dh(n));
                  })(e, n);
                if (uh(e))
                  return (function Sb(e, n) {
                    return new ye((t) => {
                      let r = 0;
                      return n.schedule(function () {
                        r === e.length
                          ? t.complete()
                          : (t.next(e[r++]), t.closed || this.schedule());
                      });
                    });
                  })(e, n);
                if (ch(e))
                  return (function Mb(e, n) {
                    return tt(e).pipe(_h(n), Dh(n));
                  })(e, n);
                if (dh(e)) return Ch(e, n);
                if (ph(e))
                  return (function Ab(e, n) {
                    return new ye((t) => {
                      let r;
                      return (
                        on(t, n, () => {
                          (r = e[hh]()),
                            on(
                              t,
                              n,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void t.error(s);
                                }
                                i ? t.complete() : t.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => K(r?.return) && r.return()
                      );
                    });
                  })(e, n);
                if (mh(e))
                  return (function Tb(e, n) {
                    return Ch(gh(e), n);
                  })(e, n);
              }
              throw fh(e);
            })(e, n)
          : tt(e);
      }
      class nt extends bt {
        constructor(n) {
          super(), (this._value = n);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(n) {
          const t = super._subscribe(n);
          return !t.closed && n.next(this._value), t;
        }
        getValue() {
          const { hasError: n, thrownError: t, _value: r } = this;
          if (n) throw t;
          return this._throwIfClosed(), r;
        }
        next(n) {
          super.next((this._value = n));
        }
      }
      function O(...e) {
        return Ie(e, Mo(e));
      }
      function wh(e = {}) {
        const {
          connector: n = () => new bt(),
          resetOnError: t = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: o = !0,
        } = e;
        return (i) => {
          let s,
            a,
            u,
            c = 0,
            l = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = u = void 0), (l = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return Ce((g, y) => {
            c++, !d && !l && f();
            const C = (u = u ?? n());
            y.add(() => {
              c--, 0 === c && !d && !l && (a = Lu(p, o));
            }),
              C.subscribe(y),
              !s &&
                c > 0 &&
                ((s = new Io({
                  next: (m) => C.next(m),
                  error: (m) => {
                    (d = !0), f(), (a = Lu(h, t, m)), C.error(m);
                  },
                  complete: () => {
                    (l = !0), f(), (a = Lu(h, r)), C.complete();
                  },
                })),
                tt(g).subscribe(s));
          })(i);
        };
      }
      function Lu(e, n, ...t) {
        if (!0 === n) return void e();
        if (!1 === n) return;
        const r = new Io({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return tt(n(...t)).subscribe(r);
      }
      function $t(e, n) {
        return Ce((t, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          t.subscribe(
            De(
              r,
              (u) => {
                o?.unsubscribe();
                let c = 0;
                const l = i++;
                tt(e(u, l)).subscribe(
                  (o = De(
                    r,
                    (d) => r.next(n ? n(u, d, l, c++) : d),
                    () => {
                      (o = null), a();
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
      function Ob(e, n) {
        return e === n;
      }
      function Z(e) {
        for (let n in e) if (e[n] === Z) return n;
        throw Error("Could not find renamed property on target object.");
      }
      function ss(e, n) {
        for (const t in n)
          n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
      }
      function we(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(we).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const n = e.toString();
        if (null == n) return "" + n;
        const t = n.indexOf("\n");
        return -1 === t ? n : n.substring(0, t);
      }
      function Vu(e, n) {
        return null == e || "" === e
          ? null === n
            ? ""
            : n
          : null == n || "" === n
          ? e
          : e + " " + n;
      }
      const Pb = Z({ __forward_ref__: Z });
      function te(e) {
        return (
          (e.__forward_ref__ = te),
          (e.toString = function () {
            return we(this());
          }),
          e
        );
      }
      function x(e) {
        return ju(e) ? e() : e;
      }
      function ju(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(Pb) &&
          e.__forward_ref__ === te
        );
      }
      function Bu(e) {
        return e && !!e.ɵproviders;
      }
      class D extends Error {
        constructor(n, t) {
          super(
            (function as(e, n) {
              return `NG0${Math.abs(e)}${n ? ": " + n : ""}`;
            })(n, t)
          ),
            (this.code = n);
        }
      }
      function P(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function $u(e, n) {
        throw new D(-201, !1);
      }
      function dt(e, n) {
        null == e &&
          (function A(e, n, t, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`)
            );
          })(n, e, null, "!=");
      }
      function M(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function ft(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function us(e) {
        return bh(e, ls) || bh(e, Ih);
      }
      function bh(e, n) {
        return e.hasOwnProperty(n) ? e[n] : null;
      }
      function cs(e) {
        return e && (e.hasOwnProperty(Hu) || e.hasOwnProperty(Hb))
          ? e[Hu]
          : null;
      }
      const ls = Z({ ɵprov: Z }),
        Hu = Z({ ɵinj: Z }),
        Ih = Z({ ngInjectableDef: Z }),
        Hb = Z({ ngInjectorDef: Z });
      var j = (function (e) {
        return (
          (e[(e.Default = 0)] = "Default"),
          (e[(e.Host = 1)] = "Host"),
          (e[(e.Self = 2)] = "Self"),
          (e[(e.SkipSelf = 4)] = "SkipSelf"),
          (e[(e.Optional = 8)] = "Optional"),
          e
        );
      })(j || {});
      let Uu;
      function qe(e) {
        const n = Uu;
        return (Uu = e), n;
      }
      function Sh(e, n, t) {
        const r = us(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : t & j.Optional
          ? null
          : void 0 !== n
          ? n
          : void $u(we(e));
      }
      const ne = globalThis;
      class b {
        constructor(n, t) {
          (this._desc = n),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof t
              ? (this.__NG_ELEMENT_ID__ = t)
              : void 0 !== t &&
                (this.ɵprov = M({
                  token: this,
                  providedIn: t.providedIn || "root",
                  factory: t.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const So = {},
        Zu = "__NG_DI_FLAG__",
        ds = "ngTempTokenPath",
        zb = /\n/gm,
        Th = "__source";
      let hr;
      function Mn(e) {
        const n = hr;
        return (hr = e), n;
      }
      function Zb(e, n = j.Default) {
        if (void 0 === hr) throw new D(-203, !1);
        return null === hr
          ? Sh(e, void 0, n)
          : hr.get(e, n & j.Optional ? null : void 0, n);
      }
      function S(e, n = j.Default) {
        return (
          (function Mh() {
            return Uu;
          })() || Zb
        )(x(e), n);
      }
      function E(e, n = j.Default) {
        return S(e, fs(n));
      }
      function fs(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Yu(e) {
        const n = [];
        for (let t = 0; t < e.length; t++) {
          const r = x(e[t]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new D(900, !1);
            let o,
              i = j.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = Yb(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            n.push(S(o, i));
          } else n.push(S(r));
        }
        return n;
      }
      function Ao(e, n) {
        return (e[Zu] = n), (e.prototype[Zu] = n), e;
      }
      function Yb(e) {
        return e[Zu];
      }
      function sn(e) {
        return { toString: e }.toString();
      }
      var hs = (function (e) {
          return (
            (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
          );
        })(hs || {}),
        It = (function (e) {
          return (
            (e[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            e
          );
        })(It || {});
      const Ht = {},
        G = [],
        ps = Z({ ɵcmp: Z }),
        Qu = Z({ ɵdir: Z }),
        Ku = Z({ ɵpipe: Z }),
        xh = Z({ ɵmod: Z }),
        an = Z({ ɵfac: Z }),
        To = Z({ __NG_ELEMENT_ID__: Z }),
        Rh = Z({ __NG_ENV_ID__: Z });
      function Oh(e, n, t) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(n, t);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = n.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          t = o + 1;
        }
      }
      function Xu(e, n, t) {
        let r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = t[r++],
              s = t[r++],
              a = t[r++];
            e.setAttribute(n, s, a, i);
          } else {
            const i = o,
              s = t[++r];
            Fh(i) ? e.setProperty(n, i, s) : e.setAttribute(n, i, s), r++;
          }
        }
        return r;
      }
      function Ph(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Fh(e) {
        return 64 === e.charCodeAt(0);
      }
      function No(e, n) {
        if (null !== n && 0 !== n.length)
          if (null === e || 0 === e.length) e = n.slice();
          else {
            let t = -1;
            for (let r = 0; r < n.length; r++) {
              const o = n[r];
              "number" == typeof o
                ? (t = o)
                : 0 === t ||
                  kh(e, t, o, null, -1 === t || 2 === t ? n[++r] : null);
            }
          }
        return e;
      }
      function kh(e, n, t, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === n) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === n) {
                s = -1;
                break;
              }
              if (a > n) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === t) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, n), (i = s + 1)),
          e.splice(i++, 0, t),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      const Lh = "ng-template";
      function Xb(e, n, t) {
        let r = 0,
          o = !0;
        for (; r < e.length; ) {
          let i = e[r++];
          if ("string" == typeof i && o) {
            const s = e[r++];
            if (t && "class" === i && -1 !== Oh(s.toLowerCase(), n, 0))
              return !0;
          } else {
            if (1 === i) {
              for (; r < e.length && "string" == typeof (i = e[r++]); )
                if (i.toLowerCase() === n) return !0;
              return !1;
            }
            "number" == typeof i && (o = !1);
          }
        }
        return !1;
      }
      function Vh(e) {
        return 4 === e.type && e.value !== Lh;
      }
      function Jb(e, n, t) {
        return n === (4 !== e.type || t ? e.value : Lh);
      }
      function eI(e, n, t) {
        let r = 4;
        const o = e.attrs || [],
          i = (function rI(e) {
            for (let n = 0; n < e.length; n++) if (Ph(e[n])) return n;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < n.length; a++) {
          const u = n[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !Jb(e, u, t)) || ("" === u && 1 === n.length))
                ) {
                  if (Mt(r)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & r ? u : n[++a];
                if (8 & r && null !== e.attrs) {
                  if (!Xb(e.attrs, c, t)) {
                    if (Mt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = tI(8 & r ? "class" : u, o, Vh(e), t);
                if (-1 === d) {
                  if (Mt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== c) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Oh(h, c, 0)) || (2 & r && c !== f)) {
                    if (Mt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Mt(r) && !Mt(u)) return !1;
            if (s && Mt(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return Mt(r) || s;
      }
      function Mt(e) {
        return 0 == (1 & e);
      }
      function tI(e, n, t, r) {
        if (null === n) return -1;
        let o = 0;
        if (r || !t) {
          let i = !1;
          for (; o < n.length; ) {
            const s = n[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = n[++o];
                for (; "string" == typeof a; ) a = n[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function oI(e, n) {
          let t = e.indexOf(4);
          if (t > -1)
            for (t++; t < e.length; ) {
              const r = e[t];
              if ("number" == typeof r) return -1;
              if (r === n) return t;
              t++;
            }
          return -1;
        })(n, e);
      }
      function jh(e, n, t = !1) {
        for (let r = 0; r < n.length; r++) if (eI(e, n[r], t)) return !0;
        return !1;
      }
      function Bh(e, n) {
        return e ? ":not(" + n.trim() + ")" : n;
      }
      function sI(e) {
        let n = e[0],
          t = 1,
          r = 2,
          o = "",
          i = !1;
        for (; t < e.length; ) {
          let s = e[t];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++t];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Mt(s) && ((n += Bh(i, o)), (o = "")),
              (r = s),
              (i = i || !Mt(r));
          t++;
        }
        return "" !== o && (n += Bh(i, o)), n;
      }
      function gs(e) {
        return sn(() => {
          const n = Hh(e),
            t = {
              ...n,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === hs.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (n.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || It.Emulated,
              styles: e.styles || G,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          Uh(t);
          const r = e.dependencies;
          return (
            (t.directiveDefs = ms(r, !1)),
            (t.pipeDefs = ms(r, !0)),
            (t.id = (function pI(e) {
              let n = 0;
              const t = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.signals,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const o of t) n = (Math.imul(31, n) + o.charCodeAt(0)) << 0;
              return (n += 2147483648), "c" + n;
            })(t)),
            t
          );
        });
      }
      function lI(e) {
        return H(e) || Se(e);
      }
      function dI(e) {
        return null !== e;
      }
      function St(e) {
        return sn(() => ({
          type: e.type,
          bootstrap: e.bootstrap || G,
          declarations: e.declarations || G,
          imports: e.imports || G,
          exports: e.exports || G,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function $h(e, n) {
        if (null == e) return Ht;
        const t = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (t[o] = r),
              n && (n[o] = i);
          }
        return t;
      }
      function R(e) {
        return sn(() => {
          const n = Hh(e);
          return Uh(n), n;
        });
      }
      function We(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          standalone: !0 === e.standalone,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function H(e) {
        return e[ps] || null;
      }
      function Se(e) {
        return e[Qu] || null;
      }
      function Le(e) {
        return e[Ku] || null;
      }
      function ot(e, n) {
        const t = e[xh] || null;
        if (!t && !0 === n)
          throw new Error(`Type ${we(e)} does not have '\u0275mod' property.`);
        return t;
      }
      function Hh(e) {
        const n = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: n,
          inputTransforms: null,
          inputConfig: e.inputs || Ht,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || G,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: $h(e.inputs, n),
          outputs: $h(e.outputs),
        };
      }
      function Uh(e) {
        e.features?.forEach((n) => n(e));
      }
      function ms(e, n) {
        if (!e) return null;
        const t = n ? Le : lI;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => t(r)).filter(dI);
      }
      const fe = 0,
        w = 1,
        L = 2,
        ue = 3,
        At = 4,
        xo = 5,
        Re = 6,
        gr = 7,
        ge = 8,
        Sn = 9,
        mr = 10,
        F = 11,
        Ro = 12,
        Gh = 13,
        vr = 14,
        me = 15,
        Oo = 16,
        yr = 17,
        Ut = 18,
        Po = 19,
        zh = 20,
        An = 21,
        un = 22,
        Fo = 23,
        ko = 24,
        B = 25,
        Ju = 1,
        qh = 2,
        Gt = 7,
        Dr = 9,
        Ae = 11;
      function Ze(e) {
        return Array.isArray(e) && "object" == typeof e[Ju];
      }
      function Ve(e) {
        return Array.isArray(e) && !0 === e[Ju];
      }
      function ec(e) {
        return 0 != (4 & e.flags);
      }
      function Wn(e) {
        return e.componentOffset > -1;
      }
      function ys(e) {
        return 1 == (1 & e.flags);
      }
      function Tt(e) {
        return !!e.template;
      }
      function tc(e) {
        return 0 != (512 & e[L]);
      }
      function Zn(e, n) {
        return e.hasOwnProperty(an) ? e[an] : null;
      }
      let Te = null,
        Ds = !1;
      function ht(e) {
        const n = Te;
        return (Te = e), n;
      }
      const Yh = {
        version: 0,
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
      };
      function Kh(e) {
        if (!Vo(e) || e.dirty) {
          if (!e.producerMustRecompute(e) && !ep(e)) return void (e.dirty = !1);
          e.producerRecomputeValue(e), (e.dirty = !1);
        }
      }
      function Jh(e) {
        (e.dirty = !0),
          (function Xh(e) {
            if (void 0 === e.liveConsumerNode) return;
            const n = Ds;
            Ds = !0;
            try {
              for (const t of e.liveConsumerNode) t.dirty || Jh(t);
            } finally {
              Ds = n;
            }
          })(e),
          e.consumerMarkedDirty?.(e);
      }
      function rc(e) {
        return e && (e.nextProducerIndex = 0), ht(e);
      }
      function oc(e, n) {
        if (
          (ht(n),
          e &&
            void 0 !== e.producerNode &&
            void 0 !== e.producerIndexOfThis &&
            void 0 !== e.producerLastReadVersion)
        ) {
          if (Vo(e))
            for (let t = e.nextProducerIndex; t < e.producerNode.length; t++)
              _s(e.producerNode[t], e.producerIndexOfThis[t]);
          for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
              e.producerLastReadVersion.pop(),
              e.producerIndexOfThis.pop();
        }
      }
      function ep(e) {
        _r(e);
        for (let n = 0; n < e.producerNode.length; n++) {
          const t = e.producerNode[n],
            r = e.producerLastReadVersion[n];
          if (r !== t.version || (Kh(t), r !== t.version)) return !0;
        }
        return !1;
      }
      function tp(e) {
        if ((_r(e), Vo(e)))
          for (let n = 0; n < e.producerNode.length; n++)
            _s(e.producerNode[n], e.producerIndexOfThis[n]);
        (e.producerNode.length =
          e.producerLastReadVersion.length =
          e.producerIndexOfThis.length =
            0),
          e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
      }
      function _s(e, n) {
        if (
          ((function rp(e) {
            (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
          })(e),
          _r(e),
          1 === e.liveConsumerNode.length)
        )
          for (let r = 0; r < e.producerNode.length; r++)
            _s(e.producerNode[r], e.producerIndexOfThis[r]);
        const t = e.liveConsumerNode.length - 1;
        if (
          ((e.liveConsumerNode[n] = e.liveConsumerNode[t]),
          (e.liveConsumerIndexOfThis[n] = e.liveConsumerIndexOfThis[t]),
          e.liveConsumerNode.length--,
          e.liveConsumerIndexOfThis.length--,
          n < e.liveConsumerNode.length)
        ) {
          const r = e.liveConsumerIndexOfThis[n],
            o = e.liveConsumerNode[n];
          _r(o), (o.producerIndexOfThis[r] = n);
        }
      }
      function Vo(e) {
        return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
      }
      function _r(e) {
        (e.producerNode ??= []),
          (e.producerIndexOfThis ??= []),
          (e.producerLastReadVersion ??= []);
      }
      let op = null;
      const up = () => {},
        SI = (() => ({
          ...Yh,
          consumerIsAlwaysLive: !0,
          consumerAllowSignalWrites: !1,
          consumerMarkedDirty: (e) => {
            e.schedule(e.ref);
          },
          hasRun: !1,
          cleanupFn: up,
        }))();
      class AI {
        constructor(n, t, r) {
          (this.previousValue = n),
            (this.currentValue = t),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function pt() {
        return cp;
      }
      function cp(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = NI), TI;
      }
      function TI() {
        const e = dp(this),
          n = e?.current;
        if (n) {
          const t = e.previous;
          if (t === Ht) e.previous = n;
          else for (let r in n) t[r] = n[r];
          (e.current = null), this.ngOnChanges(n);
        }
      }
      function NI(e, n, t, r) {
        const o = this.declaredInputs[t],
          i =
            dp(e) ||
            (function xI(e, n) {
              return (e[lp] = n);
            })(e, { previous: Ht, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new AI(u && u.currentValue, n, a === Ht)), (e[r] = n);
      }
      pt.ngInherit = !0;
      const lp = "__ngSimpleChanges__";
      function dp(e) {
        return e[lp] || null;
      }
      const zt = function (e, n, t) {};
      function re(e) {
        for (; Array.isArray(e); ) e = e[fe];
        return e;
      }
      function Cs(e, n) {
        return re(n[e]);
      }
      function Ye(e, n) {
        return re(n[e.index]);
      }
      function pp(e, n) {
        return e.data[n];
      }
      function Cr(e, n) {
        return e[n];
      }
      function it(e, n) {
        const t = n[e];
        return Ze(t) ? t : t[fe];
      }
      function Nn(e, n) {
        return null == n ? null : e[n];
      }
      function gp(e) {
        e[yr] = 0;
      }
      function LI(e) {
        1024 & e[L] || ((e[L] |= 1024), vp(e, 1));
      }
      function mp(e) {
        1024 & e[L] && ((e[L] &= -1025), vp(e, -1));
      }
      function vp(e, n) {
        let t = e[ue];
        if (null === t) return;
        t[xo] += n;
        let r = t;
        for (
          t = t[ue];
          null !== t && ((1 === n && 1 === r[xo]) || (-1 === n && 0 === r[xo]));

        )
          (t[xo] += n), (r = t), (t = t[ue]);
      }
      const T = {
        lFrame: Ap(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function _p() {
        return T.bindingsEnabled;
      }
      function v() {
        return T.lFrame.lView;
      }
      function U() {
        return T.lFrame.tView;
      }
      function Nt(e) {
        return (T.lFrame.contextLView = e), e[ge];
      }
      function xt(e) {
        return (T.lFrame.contextLView = null), e;
      }
      function Ne() {
        let e = Cp();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Cp() {
        return T.lFrame.currentTNode;
      }
      function qt(e, n) {
        const t = T.lFrame;
        (t.currentTNode = e), (t.isParent = n);
      }
      function cc() {
        return T.lFrame.isParent;
      }
      function je() {
        const e = T.lFrame;
        let n = e.bindingRootIndex;
        return (
          -1 === n && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n
        );
      }
      function Er() {
        return T.lFrame.bindingIndex++;
      }
      function YI(e, n) {
        const t = T.lFrame;
        (t.bindingIndex = t.bindingRootIndex = e), dc(n);
      }
      function dc(e) {
        T.lFrame.currentDirectiveIndex = e;
      }
      function hc(e) {
        T.lFrame.currentQueryIndex = e;
      }
      function KI(e) {
        const n = e[w];
        return 2 === n.type ? n.declTNode : 1 === n.type ? e[Re] : null;
      }
      function Mp(e, n, t) {
        if (t & j.SkipSelf) {
          let o = n,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              t & j.Host ||
              ((o = KI(i)), null === o || ((i = i[vr]), 10 & o.type)));

          );
          if (null === o) return !1;
          (n = o), (e = i);
        }
        const r = (T.lFrame = Sp());
        return (r.currentTNode = n), (r.lView = e), !0;
      }
      function pc(e) {
        const n = Sp(),
          t = e[w];
        (T.lFrame = n),
          (n.currentTNode = t.firstChild),
          (n.lView = e),
          (n.tView = t),
          (n.contextLView = e),
          (n.bindingIndex = t.bindingStartIndex),
          (n.inI18n = !1);
      }
      function Sp() {
        const e = T.lFrame,
          n = null === e ? null : e.child;
        return null === n ? Ap(e) : n;
      }
      function Ap(e) {
        const n = {
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
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = n), n;
      }
      function Tp() {
        const e = T.lFrame;
        return (
          (T.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Np = Tp;
      function gc() {
        const e = Tp();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Be() {
        return T.lFrame.selectedIndex;
      }
      function Yn(e) {
        T.lFrame.selectedIndex = e;
      }
      let Rp = !0;
      function ws() {
        return Rp;
      }
      function xn(e) {
        Rp = e;
      }
      function Es(e, n) {
        for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
          const i = e.data[t].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: c,
              ngOnDestroy: l,
            } = i;
          s && (e.contentHooks ??= []).push(-t, s),
            a &&
              ((e.contentHooks ??= []).push(t, a),
              (e.contentCheckHooks ??= []).push(t, a)),
            u && (e.viewHooks ??= []).push(-t, u),
            c &&
              ((e.viewHooks ??= []).push(t, c),
              (e.viewCheckHooks ??= []).push(t, c)),
            null != l && (e.destroyHooks ??= []).push(t, l);
        }
      }
      function bs(e, n, t) {
        Op(e, n, 3, t);
      }
      function Is(e, n, t, r) {
        (3 & e[L]) === t && Op(e, n, t, r);
      }
      function mc(e, n) {
        let t = e[L];
        (3 & t) === n && ((t &= 8191), (t += 1), (e[L] = t));
      }
      function Op(e, n, t, r) {
        const i = r ?? -1,
          s = n.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[yr] : 0; u < s; u++)
          if ("number" == typeof n[u + 1]) {
            if (((a = n[u]), null != r && a >= r)) break;
          } else
            n[u] < 0 && (e[yr] += 65536),
              (a < i || -1 == i) &&
                (iM(e, t, n, u), (e[yr] = (4294901760 & e[yr]) + u + 2)),
              u++;
      }
      function Pp(e, n) {
        zt(4, e, n);
        const t = ht(null);
        try {
          n.call(e);
        } finally {
          ht(t), zt(5, e, n);
        }
      }
      function iM(e, n, t, r) {
        const o = t[r] < 0,
          i = t[r + 1],
          a = e[o ? -t[r] : t[r]];
        o
          ? e[L] >> 13 < e[yr] >> 16 &&
            (3 & e[L]) === n &&
            ((e[L] += 8192), Pp(a, i))
          : Pp(a, i);
      }
      const br = -1;
      class Bo {
        constructor(n, t, r) {
          (this.factory = n),
            (this.resolving = !1),
            (this.canSeeViewProviders = t),
            (this.injectImpl = r);
        }
      }
      function yc(e) {
        return e !== br;
      }
      function $o(e) {
        return 32767 & e;
      }
      function Ho(e, n) {
        let t = (function cM(e) {
            return e >> 16;
          })(e),
          r = n;
        for (; t > 0; ) (r = r[vr]), t--;
        return r;
      }
      let Dc = !0;
      function Ms(e) {
        const n = Dc;
        return (Dc = e), n;
      }
      const Fp = 255,
        kp = 5;
      let lM = 0;
      const Wt = {};
      function Ss(e, n) {
        const t = Lp(e, n);
        if (-1 !== t) return t;
        const r = n[w];
        r.firstCreatePass &&
          ((e.injectorIndex = n.length),
          _c(r.data, e),
          _c(n, null),
          _c(r.blueprint, null));
        const o = As(e, n),
          i = e.injectorIndex;
        if (yc(o)) {
          const s = $o(o),
            a = Ho(o, n),
            u = a[w].data;
          for (let c = 0; c < 8; c++) n[i + c] = a[s + c] | u[s + c];
        }
        return (n[i + 8] = o), i;
      }
      function _c(e, n) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
      }
      function Lp(e, n) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === n[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function As(e, n) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let t = 0,
          r = null,
          o = n;
        for (; null !== o; ) {
          if (((r = Gp(o)), null === r)) return br;
          if ((t++, (o = o[vr]), -1 !== r.injectorIndex))
            return r.injectorIndex | (t << 16);
        }
        return br;
      }
      function Cc(e, n, t) {
        !(function dM(e, n, t) {
          let r;
          "string" == typeof t
            ? (r = t.charCodeAt(0) || 0)
            : t.hasOwnProperty(To) && (r = t[To]),
            null == r && (r = t[To] = lM++);
          const o = r & Fp;
          n.data[e + (o >> kp)] |= 1 << o;
        })(e, n, t);
      }
      function Vp(e, n, t) {
        if (t & j.Optional || void 0 !== e) return e;
        $u();
      }
      function jp(e, n, t, r) {
        if (
          (t & j.Optional && void 0 === r && (r = null),
          !(t & (j.Self | j.Host)))
        ) {
          const o = e[Sn],
            i = qe(void 0);
          try {
            return o ? o.get(n, r, t & j.Optional) : Sh(n, r, t & j.Optional);
          } finally {
            qe(i);
          }
        }
        return Vp(r, 0, t);
      }
      function Bp(e, n, t, r = j.Default, o) {
        if (null !== e) {
          if (2048 & n[L] && !(r & j.Self)) {
            const s = (function vM(e, n, t, r, o) {
              let i = e,
                s = n;
              for (
                ;
                null !== i && null !== s && 2048 & s[L] && !(512 & s[L]);

              ) {
                const a = $p(i, s, t, r | j.Self, Wt);
                if (a !== Wt) return a;
                let u = i.parent;
                if (!u) {
                  const c = s[zh];
                  if (c) {
                    const l = c.get(t, Wt, r);
                    if (l !== Wt) return l;
                  }
                  (u = Gp(s)), (s = s[vr]);
                }
                i = u;
              }
              return o;
            })(e, n, t, r, Wt);
            if (s !== Wt) return s;
          }
          const i = $p(e, n, t, r, Wt);
          if (i !== Wt) return i;
        }
        return jp(n, t, r, o);
      }
      function $p(e, n, t, r, o) {
        const i = (function pM(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const n = e.hasOwnProperty(To) ? e[To] : void 0;
          return "number" == typeof n ? (n >= 0 ? n & Fp : mM) : n;
        })(t);
        if ("function" == typeof i) {
          if (!Mp(n, e, r)) return r & j.Host ? Vp(o, 0, r) : jp(n, t, r, o);
          try {
            let s;
            if (((s = i(r)), null != s || r & j.Optional)) return s;
            $u();
          } finally {
            Np();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = Lp(e, n),
            u = br,
            c = r & j.Host ? n[me][Re] : null;
          for (
            (-1 === a || r & j.SkipSelf) &&
            ((u = -1 === a ? As(e, n) : n[a + 8]),
            u !== br && Up(r, !1)
              ? ((s = n[w]), (a = $o(u)), (n = Ho(u, n)))
              : (a = -1));
            -1 !== a;

          ) {
            const l = n[w];
            if (Hp(i, a, l.data)) {
              const d = hM(a, n, t, s, r, c);
              if (d !== Wt) return d;
            }
            (u = n[a + 8]),
              u !== br && Up(r, n[w].data[a + 8] === c) && Hp(i, a, n)
                ? ((s = l), (a = $o(u)), (n = Ho(u, n)))
                : (a = -1);
          }
        }
        return o;
      }
      function hM(e, n, t, r, o, i) {
        const s = n[w],
          a = s.data[e + 8],
          l = (function Ts(e, n, t, r, o) {
            const i = e.providerIndexes,
              s = n.data,
              a = 1048575 & i,
              u = e.directiveStart,
              l = i >> 20,
              f = o ? a + l : e.directiveEnd;
            for (let h = r ? a : a + l; h < f; h++) {
              const p = s[h];
              if ((h < u && t === p) || (h >= u && p.type === t)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && Tt(h) && h.type === t) return u;
            }
            return null;
          })(
            a,
            s,
            t,
            null == r ? Wn(a) && Dc : r != s && 0 != (3 & a.type),
            o & j.Host && i === a
          );
        return null !== l ? Qn(n, s, l, a) : Wt;
      }
      function Qn(e, n, t, r) {
        let o = e[t];
        const i = n.data;
        if (
          (function sM(e) {
            return e instanceof Bo;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function Fb(e, n) {
              const t = n ? `. Dependency path: ${n.join(" > ")} > ${e}` : "";
              throw new D(
                -200,
                `Circular dependency in DI detected for ${e}${t}`
              );
            })(
              (function W(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : P(e);
              })(i[t])
            );
          const a = Ms(s.canSeeViewProviders);
          s.resolving = !0;
          const c = s.injectImpl ? qe(s.injectImpl) : null;
          Mp(e, r, j.Default);
          try {
            (o = e[t] = s.factory(void 0, i, e, r)),
              n.firstCreatePass &&
                t >= r.directiveStart &&
                (function oM(e, n, t) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = n.type.prototype;
                  if (r) {
                    const s = cp(n);
                    (t.preOrderHooks ??= []).push(e, s),
                      (t.preOrderCheckHooks ??= []).push(e, s);
                  }
                  o && (t.preOrderHooks ??= []).push(0 - e, o),
                    i &&
                      ((t.preOrderHooks ??= []).push(e, i),
                      (t.preOrderCheckHooks ??= []).push(e, i));
                })(t, i[t], n);
          } finally {
            null !== c && qe(c), Ms(a), (s.resolving = !1), Np();
          }
        }
        return o;
      }
      function Hp(e, n, t) {
        return !!(t[n + (e >> kp)] & (1 << e));
      }
      function Up(e, n) {
        return !(e & j.Self || (e & j.Host && n));
      }
      class $e {
        constructor(n, t) {
          (this._tNode = n), (this._lView = t);
        }
        get(n, t, r) {
          return Bp(this._tNode, this._lView, n, fs(r), t);
        }
      }
      function mM() {
        return new $e(Ne(), v());
      }
      function xe(e) {
        return sn(() => {
          const n = e.prototype.constructor,
            t = n[an] || wc(n),
            r = Object.prototype;
          let o = Object.getPrototypeOf(e.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[an] || wc(o);
            if (i && i !== t) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function wc(e) {
        return ju(e)
          ? () => {
              const n = wc(x(e));
              return n && n();
            }
          : Zn(e);
      }
      function Gp(e) {
        const n = e[w],
          t = n.type;
        return 2 === t ? n.declTNode : 1 === t ? e[Re] : null;
      }
      const Mr = "__parameters__";
      function Ar(e, n, t) {
        return sn(() => {
          const r = (function Ec(e) {
            return function (...t) {
              if (e) {
                const r = e(...t);
                for (const o in r) this[o] = r[o];
              }
            };
          })(n);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, c, l) {
              const d = u.hasOwnProperty(Mr)
                ? u[Mr]
                : Object.defineProperty(u, Mr, { value: [] })[Mr];
              for (; d.length <= l; ) d.push(null);
              return (d[l] = d[l] || []).push(s), u;
            }
          }
          return (
            t && (o.prototype = Object.create(t.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      function Nr(e, n) {
        e.forEach((t) => (Array.isArray(t) ? Nr(t, n) : n(t)));
      }
      function qp(e, n, t) {
        n >= e.length ? e.push(t) : e.splice(n, 0, t);
      }
      function xs(e, n) {
        return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
      }
      function st(e, n, t) {
        let r = xr(e, n);
        return (
          r >= 0
            ? (e[1 | r] = t)
            : ((r = ~r),
              (function bM(e, n, t, r) {
                let o = e.length;
                if (o == n) e.push(t, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = t);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > n; )
                    (e[o] = e[o - 2]), o--;
                  (e[n] = t), (e[n + 1] = r);
                }
              })(e, r, n, t)),
          r
        );
      }
      function bc(e, n) {
        const t = xr(e, n);
        if (t >= 0) return e[1 | t];
      }
      function xr(e, n) {
        return (function Wp(e, n, t) {
          let r = 0,
            o = e.length >> t;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << t];
            if (n === s) return i << t;
            s > n ? (o = i) : (r = i + 1);
          }
          return ~(o << t);
        })(e, n, 1);
      }
      const Os = Ao(Ar("Optional"), 8),
        Ps = Ao(Ar("SkipSelf"), 4);
      function js(e) {
        return 128 == (128 & e.flags);
      }
      var Rn = (function (e) {
        return (
          (e[(e.Important = 1)] = "Important"),
          (e[(e.DashCase = 2)] = "DashCase"),
          e
        );
      })(Rn || {});
      const Tc = new Map();
      let ZM = 0;
      const xc = "__ngContext__";
      function Oe(e, n) {
        Ze(n)
          ? ((e[xc] = n[Po]),
            (function QM(e) {
              Tc.set(e[Po], e);
            })(n))
          : (e[xc] = n);
      }
      let Rc;
      function Oc(e, n) {
        return Rc(e, n);
      }
      function Zo(e) {
        const n = e[ue];
        return Ve(n) ? n[ue] : n;
      }
      function hg(e) {
        return gg(e[Ro]);
      }
      function pg(e) {
        return gg(e[At]);
      }
      function gg(e) {
        for (; null !== e && !Ve(e); ) e = e[At];
        return e;
      }
      function Pr(e, n, t, r, o) {
        if (null != r) {
          let i,
            s = !1;
          Ve(r) ? (i = r) : Ze(r) && ((s = !0), (r = r[fe]));
          const a = re(r);
          0 === e && null !== t
            ? null == o
              ? Dg(n, t, a)
              : Kn(n, t, a, o || null, !0)
            : 1 === e && null !== t
            ? Kn(n, t, a, o || null, !0)
            : 2 === e
            ? (function qs(e, n, t) {
                const r = Gs(e, n);
                r &&
                  (function m0(e, n, t, r) {
                    e.removeChild(n, t, r);
                  })(e, r, n, t);
              })(n, a, s)
            : 3 === e && n.destroyNode(a),
            null != i &&
              (function D0(e, n, t, r, o) {
                const i = t[Gt];
                i !== re(t) && Pr(n, e, r, i, o);
                for (let a = Ae; a < t.length; a++) {
                  const u = t[a];
                  Qo(u[w], u, e, n, r, i);
                }
              })(n, e, i, t, o);
        }
      }
      function Hs(e, n, t) {
        return e.createElement(n, t);
      }
      function vg(e, n) {
        const t = e[Dr],
          r = t.indexOf(n);
        mp(n), t.splice(r, 1);
      }
      function Us(e, n) {
        if (e.length <= Ae) return;
        const t = Ae + n,
          r = e[t];
        if (r) {
          const o = r[Oo];
          null !== o && o !== e && vg(o, r), n > 0 && (e[t - 1][At] = r[At]);
          const i = xs(e, Ae + n);
          !(function u0(e, n) {
            Qo(e, n, n[F], 2, null, null), (n[fe] = null), (n[Re] = null);
          })(r[w], r);
          const s = i[Ut];
          null !== s && s.detachView(i[w]),
            (r[ue] = null),
            (r[At] = null),
            (r[L] &= -129);
        }
        return r;
      }
      function Fc(e, n) {
        if (!(256 & n[L])) {
          const t = n[F];
          n[Fo] && tp(n[Fo]),
            n[ko] && tp(n[ko]),
            t.destroyNode && Qo(e, n, t, 3, null, null),
            (function d0(e) {
              let n = e[Ro];
              if (!n) return kc(e[w], e);
              for (; n; ) {
                let t = null;
                if (Ze(n)) t = n[Ro];
                else {
                  const r = n[Ae];
                  r && (t = r);
                }
                if (!t) {
                  for (; n && !n[At] && n !== e; )
                    Ze(n) && kc(n[w], n), (n = n[ue]);
                  null === n && (n = e), Ze(n) && kc(n[w], n), (t = n && n[At]);
                }
                n = t;
              }
            })(n);
        }
      }
      function kc(e, n) {
        if (!(256 & n[L])) {
          (n[L] &= -129),
            (n[L] |= 256),
            (function g0(e, n) {
              let t;
              if (null != e && null != (t = e.destroyHooks))
                for (let r = 0; r < t.length; r += 2) {
                  const o = n[t[r]];
                  if (!(o instanceof Bo)) {
                    const i = t[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        zt(4, a, u);
                        try {
                          u.call(a);
                        } finally {
                          zt(5, a, u);
                        }
                      }
                    else {
                      zt(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        zt(5, o, i);
                      }
                    }
                  }
                }
            })(e, n),
            (function p0(e, n) {
              const t = e.cleanup,
                r = n[gr];
              if (null !== t)
                for (let i = 0; i < t.length - 1; i += 2)
                  if ("string" == typeof t[i]) {
                    const s = t[i + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
                  } else t[i].call(r[t[i + 1]]);
              null !== r && (n[gr] = null);
              const o = n[An];
              if (null !== o) {
                n[An] = null;
                for (let i = 0; i < o.length; i++) (0, o[i])();
              }
            })(e, n),
            1 === n[w].type && n[F].destroy();
          const t = n[Oo];
          if (null !== t && Ve(n[ue])) {
            t !== n[ue] && vg(t, n);
            const r = n[Ut];
            null !== r && r.detachView(e);
          }
          !(function KM(e) {
            Tc.delete(e[Po]);
          })(n);
        }
      }
      function Lc(e, n, t) {
        return (function yg(e, n, t) {
          let r = n;
          for (; null !== r && 40 & r.type; ) r = (n = r).parent;
          if (null === r) return t[fe];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === It.None || i === It.Emulated) return null;
            }
            return Ye(r, t);
          }
        })(e, n.parent, t);
      }
      function Kn(e, n, t, r, o) {
        e.insertBefore(n, t, r, o);
      }
      function Dg(e, n, t) {
        e.appendChild(n, t);
      }
      function _g(e, n, t, r, o) {
        null !== r ? Kn(e, n, t, r, o) : Dg(e, n, t);
      }
      function Gs(e, n) {
        return e.parentNode(n);
      }
      let Vc,
        Hc,
        Eg = function wg(e, n, t) {
          return 40 & e.type ? Ye(e, t) : null;
        };
      function zs(e, n, t, r) {
        const o = Lc(e, r, n),
          i = n[F],
          a = (function Cg(e, n, t) {
            return Eg(e, n, t);
          })(r.parent || n[Re], r, n);
        if (null != o)
          if (Array.isArray(t))
            for (let u = 0; u < t.length; u++) _g(i, o, t[u], a, !1);
          else _g(i, o, t, a, !1);
        void 0 !== Vc && Vc(i, r, n, t, o);
      }
      function Yo(e, n) {
        if (null !== n) {
          const t = n.type;
          if (3 & t) return Ye(n, e);
          if (4 & t) return jc(-1, e[n.index]);
          if (8 & t) {
            const r = n.child;
            if (null !== r) return Yo(e, r);
            {
              const o = e[n.index];
              return Ve(o) ? jc(-1, o) : re(o);
            }
          }
          if (32 & t) return Oc(n, e)() || re(e[n.index]);
          {
            const r = Ig(e, n);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : Yo(Zo(e[me]), r)
              : Yo(e, n.next);
          }
        }
        return null;
      }
      function Ig(e, n) {
        return null !== n ? e[me][Re].projection[n.projection] : null;
      }
      function jc(e, n) {
        const t = Ae + e + 1;
        if (t < n.length) {
          const r = n[t],
            o = r[w].firstChild;
          if (null !== o) return Yo(r, o);
        }
        return n[Gt];
      }
      function Bc(e, n, t, r, o, i, s) {
        for (; null != t; ) {
          const a = r[t.index],
            u = t.type;
          if (
            (s && 0 === n && (a && Oe(re(a), r), (t.flags |= 2)),
            32 != (32 & t.flags))
          )
            if (8 & u) Bc(e, n, t.child, r, o, i, !1), Pr(n, e, o, a, i);
            else if (32 & u) {
              const c = Oc(t, r);
              let l;
              for (; (l = c()); ) Pr(n, e, o, l, i);
              Pr(n, e, o, a, i);
            } else 16 & u ? Sg(e, n, r, t, o, i) : Pr(n, e, o, a, i);
          t = s ? t.projectionNext : t.next;
        }
      }
      function Qo(e, n, t, r, o, i) {
        Bc(t, r, e.firstChild, n, o, i, !1);
      }
      function Sg(e, n, t, r, o, i) {
        const s = t[me],
          u = s[Re].projection[r.projection];
        if (Array.isArray(u))
          for (let c = 0; c < u.length; c++) Pr(n, e, o, u[c], i);
        else {
          let c = u;
          const l = s[ue];
          js(r) && (c.flags |= 128), Bc(e, n, c, l, o, i, !0);
        }
      }
      function Ag(e, n, t) {
        "" === t
          ? e.removeAttribute(n, "class")
          : e.setAttribute(n, "class", t);
      }
      function Tg(e, n, t) {
        const { mergedAttrs: r, classes: o, styles: i } = t;
        null !== r && Xu(e, n, r),
          null !== o && Ag(e, n, o),
          null !== i &&
            (function C0(e, n, t) {
              e.setAttribute(n, "style", t);
            })(e, n, i);
      }
      class Og {
        constructor(n) {
          this.changingThisBreaksApplicationSecurity = n;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      const ei = new b("ENVIRONMENT_INITIALIZER"),
        Ug = new b("INJECTOR", -1),
        Gg = new b("INJECTOR_DEF_TYPES");
      class Zc {
        get(n, t = So) {
          if (t === So) {
            const r = new Error(`NullInjectorError: No provider for ${we(n)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return t;
        }
      }
      function Z0(...e) {
        return { ɵproviders: qg(0, e), ɵfromNgModule: !0 };
      }
      function qg(e, ...n) {
        const t = [],
          r = new Set();
        let o;
        const i = (s) => {
          t.push(s);
        };
        return (
          Nr(n, (s) => {
            const a = s;
            Qs(a, i, [], r) && ((o ||= []), o.push(a));
          }),
          void 0 !== o && Wg(o, i),
          t
        );
      }
      function Wg(e, n) {
        for (let t = 0; t < e.length; t++) {
          const { ngModule: r, providers: o } = e[t];
          Yc(o, (i) => {
            n(i, r);
          });
        }
      }
      function Qs(e, n, t, r) {
        if (!(e = x(e))) return !1;
        let o = null,
          i = cs(e);
        const s = !i && H(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = cs(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const c of u) Qs(c, n, t, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let c;
              r.add(o);
              try {
                Nr(i.imports, (l) => {
                  Qs(l, n, t, r) && ((c ||= []), c.push(l));
                });
              } finally {
              }
              void 0 !== c && Wg(c, n);
            }
            if (!a) {
              const c = Zn(o) || (() => new o());
              n({ provide: o, useFactory: c, deps: G }, o),
                n({ provide: Gg, useValue: o, multi: !0 }, o),
                n({ provide: ei, useValue: () => S(o), multi: !0 }, o);
            }
            const u = i.providers;
            if (null != u && !a) {
              const c = e;
              Yc(u, (l) => {
                n(l, c);
              });
            }
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function Yc(e, n) {
        for (let t of e)
          Bu(t) && (t = t.ɵproviders), Array.isArray(t) ? Yc(t, n) : n(t);
      }
      const Y0 = Z({ provide: String, useValue: Z });
      function Qc(e) {
        return null !== e && "object" == typeof e && Y0 in e;
      }
      function Xn(e) {
        return "function" == typeof e;
      }
      const Kc = new b("Set Injector scope."),
        Ks = {},
        K0 = {};
      let Xc;
      function Xs() {
        return void 0 === Xc && (Xc = new Zc()), Xc;
      }
      class mt {}
      class Vr extends mt {
        get destroyed() {
          return this._destroyed;
        }
        constructor(n, t, r, o) {
          super(),
            (this.parent = t),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            el(n, (s) => this.processProvider(s)),
            this.records.set(Ug, jr(void 0, this)),
            o.has("environment") && this.records.set(mt, jr(void 0, this));
          const i = this.records.get(Kc);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(Gg.multi, G, j.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            const n = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const t of n) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(n) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(n),
            () => this.removeOnDestroy(n)
          );
        }
        runInContext(n) {
          this.assertNotDestroyed();
          const t = Mn(this),
            r = qe(void 0);
          try {
            return n();
          } finally {
            Mn(t), qe(r);
          }
        }
        get(n, t = So, r = j.Default) {
          if ((this.assertNotDestroyed(), n.hasOwnProperty(Rh)))
            return n[Rh](this);
          r = fs(r);
          const i = Mn(this),
            s = qe(void 0);
          try {
            if (!(r & j.SkipSelf)) {
              let u = this.records.get(n);
              if (void 0 === u) {
                const c =
                  (function nS(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof b)
                    );
                  })(n) && us(n);
                (u = c && this.injectableDefInScope(c) ? jr(Jc(n), Ks) : null),
                  this.records.set(n, u);
              }
              if (null != u) return this.hydrate(n, u);
            }
            return (r & j.Self ? Xs() : this.parent).get(
              n,
              (t = r & j.Optional && t === So ? null : t)
            );
          } catch (a) {
            if ("NullInjectorError" === a.name) {
              if (((a[ds] = a[ds] || []).unshift(we(n)), i)) throw a;
              return (function Qb(e, n, t, r) {
                const o = e[ds];
                throw (
                  (n[Th] && o.unshift(n[Th]),
                  (e.message = (function Kb(e, n, t, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = we(n);
                    if (Array.isArray(n)) o = n.map(we).join(" -> ");
                    else if ("object" == typeof n) {
                      let i = [];
                      for (let s in n)
                        if (n.hasOwnProperty(s)) {
                          let a = n[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : we(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${t}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      zb,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, t, r)),
                  (e.ngTokenPath = o),
                  (e[ds] = null),
                  e)
                );
              })(a, n, "R3InjectorError", this.source);
            }
            throw a;
          } finally {
            qe(s), Mn(i);
          }
        }
        resolveInjectorInitializers() {
          const n = Mn(this),
            t = qe(void 0);
          try {
            const o = this.get(ei.multi, G, j.Self);
            for (const i of o) i();
          } finally {
            Mn(n), qe(t);
          }
        }
        toString() {
          const n = [],
            t = this.records;
          for (const r of t.keys()) n.push(we(r));
          return `R3Injector[${n.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new D(205, !1);
        }
        processProvider(n) {
          let t = Xn((n = x(n))) ? n : x(n && n.provide);
          const r = (function J0(e) {
            return Qc(e) ? jr(void 0, e.useValue) : jr(Qg(e), Ks);
          })(n);
          if (Xn(n) || !0 !== n.multi) this.records.get(t);
          else {
            let o = this.records.get(t);
            o ||
              ((o = jr(void 0, Ks, !0)),
              (o.factory = () => Yu(o.multi)),
              this.records.set(t, o)),
              (t = n),
              o.multi.push(n);
          }
          this.records.set(t, r);
        }
        hydrate(n, t) {
          return (
            t.value === Ks && ((t.value = K0), (t.value = t.factory())),
            "object" == typeof t.value &&
              t.value &&
              (function tS(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(t.value) &&
              this._ngOnDestroyHooks.add(t.value),
            t.value
          );
        }
        injectableDefInScope(n) {
          if (!n.providedIn) return !1;
          const t = x(n.providedIn);
          return "string" == typeof t
            ? "any" === t || this.scopes.has(t)
            : this.injectorDefTypes.has(t);
        }
        removeOnDestroy(n) {
          const t = this._onDestroyHooks.indexOf(n);
          -1 !== t && this._onDestroyHooks.splice(t, 1);
        }
      }
      function Jc(e) {
        const n = us(e),
          t = null !== n ? n.factory : Zn(e);
        if (null !== t) return t;
        if (e instanceof b) throw new D(204, !1);
        if (e instanceof Function)
          return (function X0(e) {
            const n = e.length;
            if (n > 0)
              throw (
                ((function zo(e, n) {
                  const t = [];
                  for (let r = 0; r < e; r++) t.push(n);
                  return t;
                })(n, "?"),
                new D(204, !1))
              );
            const t = (function $b(e) {
              return (e && (e[ls] || e[Ih])) || null;
            })(e);
            return null !== t ? () => t.factory(e) : () => new e();
          })(e);
        throw new D(204, !1);
      }
      function Qg(e, n, t) {
        let r;
        if (Xn(e)) {
          const o = x(e);
          return Zn(o) || Jc(o);
        }
        if (Qc(e)) r = () => x(e.useValue);
        else if (
          (function Yg(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...Yu(e.deps || []));
        else if (
          (function Zg(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => S(x(e.useExisting));
        else {
          const o = x(e && (e.useClass || e.provide));
          if (
            !(function eS(e) {
              return !!e.deps;
            })(e)
          )
            return Zn(o) || Jc(o);
          r = () => new o(...Yu(e.deps));
        }
        return r;
      }
      function jr(e, n, t = !1) {
        return { factory: e, value: n, multi: t ? [] : void 0 };
      }
      function el(e, n) {
        for (const t of e)
          Array.isArray(t) ? el(t, n) : t && Bu(t) ? el(t.ɵproviders, n) : n(t);
      }
      const Js = new b("AppId", { providedIn: "root", factory: () => rS }),
        rS = "ng",
        Kg = new b("Platform Initializer"),
        Br = new b("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        Xg = new b("CSP nonce", {
          providedIn: "root",
          factory: () =>
            (function kr() {
              if (void 0 !== Hc) return Hc;
              if (typeof document < "u") return document;
              throw new D(210, !1);
            })()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let Jg = (e, n, t) => null;
      function ul(e, n, t = !1) {
        return Jg(e, n, t);
      }
      class hS {}
      class nm {}
      class gS {
        resolveComponentFactory(n) {
          throw (function pS(e) {
            const n = Error(`No component factory found for ${we(e)}.`);
            return (n.ngComponent = e), n;
          })(n);
        }
      }
      let ia = (() => {
        class e {
          static #e = (this.NULL = new gS());
        }
        return e;
      })();
      function mS() {
        return Ur(Ne(), v());
      }
      function Ur(e, n) {
        return new at(Ye(e, n));
      }
      let at = (() => {
        class e {
          constructor(t) {
            this.nativeElement = t;
          }
          static #e = (this.__NG_ELEMENT_ID__ = mS);
        }
        return e;
      })();
      class om {}
      let fn = (() => {
          class e {
            constructor() {
              this.destroyNode = null;
            }
            static #e = (this.__NG_ELEMENT_ID__ = () =>
              (function yS() {
                const e = v(),
                  t = it(Ne().index, e);
                return (Ze(t) ? t : e)[F];
              })());
          }
          return e;
        })(),
        DS = (() => {
          class e {
            static #e = (this.ɵprov = M({
              token: e,
              providedIn: "root",
              factory: () => null,
            }));
          }
          return e;
        })();
      class ri {
        constructor(n) {
          (this.full = n),
            (this.major = n.split(".")[0]),
            (this.minor = n.split(".")[1]),
            (this.patch = n.split(".").slice(2).join("."));
        }
      }
      const _S = new ri("16.2.12"),
        dl = {};
      function um(e, n = null, t = null, r) {
        const o = cm(e, n, t, r);
        return o.resolveInjectorInitializers(), o;
      }
      function cm(e, n = null, t = null, r, o = new Set()) {
        const i = [t || G, Z0(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : we(e))),
          new Vr(i, n || Xs(), r || null, o)
        );
      }
      let ut = (() => {
        class e {
          static #e = (this.THROW_IF_NOT_FOUND = So);
          static #t = (this.NULL = new Zc());
          static create(t, r) {
            if (Array.isArray(t)) return um({ name: "" }, r, t, "");
            {
              const o = t.name ?? "";
              return um({ name: o }, t.parent, t.providers, o);
            }
          }
          static #n = (this.ɵprov = M({
            token: e,
            providedIn: "any",
            factory: () => S(Ug),
          }));
          static #r = (this.__NG_ELEMENT_ID__ = -1);
        }
        return e;
      })();
      function hl(e) {
        return e.ngOriginalError;
      }
      class hn {
        constructor() {
          this._console = console;
        }
        handleError(n) {
          const t = this._findOriginalError(n);
          this._console.error("ERROR", n),
            t && this._console.error("ORIGINAL ERROR", t);
        }
        _findOriginalError(n) {
          let t = n && hl(n);
          for (; t && hl(t); ) t = hl(t);
          return t || null;
        }
      }
      function gl(e) {
        return (n) => {
          setTimeout(e, void 0, n);
        };
      }
      const he = class SS extends bt {
        constructor(n = !1) {
          super(), (this.__isAsync = n);
        }
        emit(n) {
          super.next(n);
        }
        subscribe(n, t, r) {
          let o = n,
            i = t || (() => null),
            s = r;
          if (n && "object" == typeof n) {
            const u = n;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = gl(i)), o && (o = gl(o)), s && (s = gl(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return n instanceof et && n.add(a), a;
        }
      };
      function dm(...e) {}
      class oe {
        constructor({
          enableLongStackTrace: n = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new he(!1)),
            (this.onMicrotaskEmpty = new he(!1)),
            (this.onStable = new he(!1)),
            (this.onError = new he(!1)),
            typeof Zone > "u")
          )
            throw new D(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            n &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && t),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function AS() {
              const e = "function" == typeof ne.requestAnimationFrame;
              let n = ne[e ? "requestAnimationFrame" : "setTimeout"],
                t = ne[e ? "cancelAnimationFrame" : "clearTimeout"];
              if (typeof Zone < "u" && n && t) {
                const r = n[Zone.__symbol__("OriginalDelegate")];
                r && (n = r);
                const o = t[Zone.__symbol__("OriginalDelegate")];
                o && (t = o);
              }
              return {
                nativeRequestAnimationFrame: n,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function xS(e) {
              const n = () => {
                !(function NS(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(ne, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                vl(e),
                                (e.isCheckStableRunning = !0),
                                ml(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    vl(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (t, r, o, i, s, a) => {
                  if (
                    (function OS(e) {
                      return (
                        !(!Array.isArray(e) || 1 !== e.length) &&
                        !0 === e[0].data?.__ignore_ng_zone__
                      );
                    })(a)
                  )
                    return t.invokeTask(o, i, s, a);
                  try {
                    return fm(e), t.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      n(),
                      hm(e);
                  }
                },
                onInvoke: (t, r, o, i, s, a, u) => {
                  try {
                    return fm(e), t.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && n(), hm(e);
                  }
                },
                onHasTask: (t, r, o, i) => {
                  t.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          vl(e),
                          ml(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (t, r, o, i) => (
                  t.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!oe.isInAngularZone()) throw new D(909, !1);
        }
        static assertNotInAngularZone() {
          if (oe.isInAngularZone()) throw new D(909, !1);
        }
        run(n, t, r) {
          return this._inner.run(n, t, r);
        }
        runTask(n, t, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, n, TS, dm, dm);
          try {
            return i.runTask(s, t, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(n, t, r) {
          return this._inner.runGuarded(n, t, r);
        }
        runOutsideAngular(n) {
          return this._outer.run(n);
        }
      }
      const TS = {};
      function ml(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function vl(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function fm(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function hm(e) {
        e._nesting--, ml(e);
      }
      class RS {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new he()),
            (this.onMicrotaskEmpty = new he()),
            (this.onStable = new he()),
            (this.onError = new he());
        }
        run(n, t, r) {
          return n.apply(t, r);
        }
        runGuarded(n, t, r) {
          return n.apply(t, r);
        }
        runOutsideAngular(n) {
          return n();
        }
        runTask(n, t, r, o) {
          return n.apply(t, r);
        }
      }
      const pm = new b("", { providedIn: "root", factory: gm });
      function gm() {
        const e = E(oe);
        let n = !0;
        return (function xb(...e) {
          const n = Mo(e),
            t = (function bb(e, n) {
              return "number" == typeof ku(e) ? e.pop() : n;
            })(e, 1 / 0),
            r = e;
          return r.length ? (1 === r.length ? tt(r[0]) : fr(t)(Ie(r, n))) : Bt;
        })(
          new ye((o) => {
            (n =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                o.next(n), o.complete();
              });
          }),
          new ye((o) => {
            let i;
            e.runOutsideAngular(() => {
              i = e.onStable.subscribe(() => {
                oe.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    !n &&
                      !e.hasPendingMacrotasks &&
                      !e.hasPendingMicrotasks &&
                      ((n = !0), o.next(!0));
                  });
              });
            });
            const s = e.onUnstable.subscribe(() => {
              oe.assertInAngularZone(),
                n &&
                  ((n = !1),
                  e.runOutsideAngular(() => {
                    o.next(!1);
                  }));
            });
            return () => {
              i.unsubscribe(), s.unsubscribe();
            };
          }).pipe(wh())
        );
      }
      function pn(e) {
        return e instanceof Function ? e() : e;
      }
      let yl = (() => {
        class e {
          constructor() {
            (this.renderDepth = 0), (this.handler = null);
          }
          begin() {
            this.handler?.validateBegin(), this.renderDepth++;
          }
          end() {
            this.renderDepth--,
              0 === this.renderDepth && this.handler?.execute();
          }
          ngOnDestroy() {
            this.handler?.destroy(), (this.handler = null);
          }
          static #e = (this.ɵprov = M({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function oi(e) {
        for (; e; ) {
          e[L] |= 64;
          const n = Zo(e);
          if (tc(e) && !n) return e;
          e = n;
        }
        return null;
      }
      const _m = new b("", { providedIn: "root", factory: () => !1 });
      let aa = null;
      function bm(e, n) {
        return e[n] ?? Sm();
      }
      function Im(e, n) {
        const t = Sm();
        t.producerNode?.length && ((e[n] = aa), (t.lView = e), (aa = Mm()));
      }
      const US = {
        ...Yh,
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: (e) => {
          oi(e.lView);
        },
        lView: null,
      };
      function Mm() {
        return Object.create(US);
      }
      function Sm() {
        return (aa ??= Mm()), aa;
      }
      const k = {};
      function Rt(e) {
        Am(U(), v(), Be() + e, !1);
      }
      function Am(e, n, t, r) {
        if (!r)
          if (3 == (3 & n[L])) {
            const i = e.preOrderCheckHooks;
            null !== i && bs(n, i, t);
          } else {
            const i = e.preOrderHooks;
            null !== i && Is(n, i, 0, t);
          }
        Yn(t);
      }
      function _(e, n = j.Default) {
        const t = v();
        return null === t ? S(e, n) : Bp(Ne(), t, x(e), n);
      }
      function ua(e, n, t, r, o, i, s, a, u, c, l) {
        const d = n.blueprint.slice();
        return (
          (d[fe] = o),
          (d[L] = 140 | r),
          (null !== c || (e && 2048 & e[L])) && (d[L] |= 2048),
          gp(d),
          (d[ue] = d[vr] = e),
          (d[ge] = t),
          (d[mr] = s || (e && e[mr])),
          (d[F] = a || (e && e[F])),
          (d[Sn] = u || (e && e[Sn]) || null),
          (d[Re] = i),
          (d[Po] = (function YM() {
            return ZM++;
          })()),
          (d[un] = l),
          (d[zh] = c),
          (d[me] = 2 == n.type ? e[me] : d),
          d
        );
      }
      function qr(e, n, t, r, o) {
        let i = e.data[n];
        if (null === i)
          (i = (function Dl(e, n, t, r, o) {
            const i = Cp(),
              s = cc(),
              u = (e.data[n] = (function KS(e, n, t, r, o, i) {
                let s = n ? n.injectorIndex : -1,
                  a = 0;
                return (
                  (function wr() {
                    return null !== T.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: t,
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
                    value: o,
                    attrs: i,
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
                    parent: n,
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
              })(0, s ? i : i && i.parent, t, n, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && ((i.next = u), (u.prev = i))),
              u
            );
          })(e, n, t, r, o)),
            (function ZI() {
              return T.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = t), (i.value = r), (i.attrs = o);
          const s = (function jo() {
            const e = T.lFrame,
              n = e.currentTNode;
            return e.isParent ? n : n.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return qt(i, !0), i;
      }
      function ii(e, n, t, r) {
        if (0 === t) return -1;
        const o = n.length;
        for (let i = 0; i < t; i++)
          n.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Nm(e, n, t, r, o) {
        const i = bm(n, Fo),
          s = Be(),
          a = 2 & r;
        try {
          Yn(-1), a && n.length > B && Am(e, n, B, !1), zt(a ? 2 : 0, o);
          const c = a ? i : null,
            l = rc(c);
          try {
            null !== c && (c.dirty = !1), t(r, o);
          } finally {
            oc(c, l);
          }
        } finally {
          a && null === n[Fo] && Im(n, Fo), Yn(s), zt(a ? 3 : 1, o);
        }
      }
      function _l(e, n, t) {
        if (ec(n)) {
          const r = ht(null);
          try {
            const i = n.directiveEnd;
            for (let s = n.directiveStart; s < i; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, t[s], s);
            }
          } finally {
            ht(r);
          }
        }
      }
      function Cl(e, n, t) {
        _p() &&
          ((function oA(e, n, t, r) {
            const o = t.directiveStart,
              i = t.directiveEnd;
            Wn(t) &&
              (function dA(e, n, t) {
                const r = Ye(n, e),
                  o = xm(t);
                let s = 16;
                t.signals ? (s = 4096) : t.onPush && (s = 64);
                const a = ca(
                  e,
                  ua(
                    e,
                    o,
                    null,
                    s,
                    r,
                    n,
                    null,
                    e[mr].rendererFactory.createRenderer(r, t),
                    null,
                    null,
                    null
                  )
                );
                e[n.index] = a;
              })(n, t, e.data[o + t.componentOffset]),
              e.firstCreatePass || Ss(t, n),
              Oe(r, n);
            const s = t.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                c = Qn(n, e, a, t);
              Oe(c, n),
                null !== s && fA(0, a - o, c, u, 0, s),
                Tt(u) && (it(t.index, n)[ge] = Qn(n, e, a, t));
            }
          })(e, n, t, Ye(t, n)),
          64 == (64 & t.flags) && km(e, n, t));
      }
      function wl(e, n, t = Ye) {
        const r = n.localNames;
        if (null !== r) {
          let o = n.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? t(n, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function xm(e) {
        const n = e.tView;
        return null === n || n.incompleteFirstPass
          ? (e.tView = El(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
            ))
          : n;
      }
      function El(e, n, t, r, o, i, s, a, u, c, l) {
        const d = B + r,
          f = d + o,
          h = (function zS(e, n) {
            const t = [];
            for (let r = 0; r < n; r++) t.push(r < e ? null : k);
            return t;
          })(d, f),
          p = "function" == typeof c ? c() : c;
        return (h[w] = {
          type: e,
          blueprint: h,
          template: t,
          queries: null,
          viewQuery: a,
          declTNode: n,
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
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: l,
        });
      }
      let Rm = (e) => null;
      function Om(e, n, t, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            t = null === t ? {} : t;
            const i = e[o];
            null === r
              ? Pm(t, n, o, i)
              : r.hasOwnProperty(o) && Pm(t, n, r[o], i);
          }
        return t;
      }
      function Pm(e, n, t, r) {
        e.hasOwnProperty(t) ? e[t].push(n, r) : (e[t] = [n, r]);
      }
      function bl(e, n, t, r) {
        if (_p()) {
          const o = null === r ? null : { "": -1 },
            i = (function sA(e, n) {
              const t = e.directiveRegistry;
              let r = null,
                o = null;
              if (t)
                for (let i = 0; i < t.length; i++) {
                  const s = t[i];
                  if (jh(n, s.selectors, !1))
                    if ((r || (r = []), Tt(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          Il(e, n, a.length);
                      } else r.unshift(s), Il(e, n, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, t);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && Fm(e, n, t, s, o, a),
            o &&
              (function aA(e, n, t) {
                if (n) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < n.length; o += 2) {
                    const i = t[n[o + 1]];
                    if (null == i) throw new D(-301, !1);
                    r.push(n[o], i);
                  }
                }
              })(t, r, o);
        }
        t.mergedAttrs = No(t.mergedAttrs, t.attrs);
      }
      function Fm(e, n, t, r, o, i) {
        for (let c = 0; c < r.length; c++) Cc(Ss(t, n), e, r[c].type);
        !(function cA(e, n, t) {
          (e.flags |= 1),
            (e.directiveStart = n),
            (e.directiveEnd = n + t),
            (e.providerIndexes = n);
        })(t, e.data.length, r.length);
        for (let c = 0; c < r.length; c++) {
          const l = r[c];
          l.providersResolver && l.providersResolver(l);
        }
        let s = !1,
          a = !1,
          u = ii(e, n, r.length, null);
        for (let c = 0; c < r.length; c++) {
          const l = r[c];
          (t.mergedAttrs = No(t.mergedAttrs, l.hostAttrs)),
            lA(e, t, n, u, l),
            uA(u, l, o),
            null !== l.contentQueries && (t.flags |= 4),
            (null !== l.hostBindings ||
              null !== l.hostAttrs ||
              0 !== l.hostVars) &&
              (t.flags |= 64);
          const d = l.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(t.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ??= []).push(t.index), (a = !0)),
            u++;
        }
        !(function XS(e, n, t) {
          const o = n.directiveEnd,
            i = e.data,
            s = n.attrs,
            a = [];
          let u = null,
            c = null;
          for (let l = n.directiveStart; l < o; l++) {
            const d = i[l],
              f = t ? t.get(d) : null,
              p = f ? f.outputs : null;
            (u = Om(d.inputs, l, u, f ? f.inputs : null)),
              (c = Om(d.outputs, l, c, p));
            const g = null === u || null === s || Vh(n) ? null : hA(u, l, s);
            a.push(g);
          }
          null !== u &&
            (u.hasOwnProperty("class") && (n.flags |= 8),
            u.hasOwnProperty("style") && (n.flags |= 16)),
            (n.initialInputs = a),
            (n.inputs = u),
            (n.outputs = c);
        })(e, t, i);
      }
      function km(e, n, t) {
        const r = t.directiveStart,
          o = t.directiveEnd,
          i = t.index,
          s = (function QI() {
            return T.lFrame.currentDirectiveIndex;
          })();
        try {
          Yn(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              c = n[a];
            dc(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                iA(u, c);
          }
        } finally {
          Yn(-1), dc(s);
        }
      }
      function iA(e, n) {
        null !== e.hostBindings && e.hostBindings(1, n);
      }
      function Il(e, n, t) {
        (n.componentOffset = t), (e.components ??= []).push(n.index);
      }
      function uA(e, n, t) {
        if (t) {
          if (n.exportAs)
            for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
          Tt(n) && (t[""] = e);
        }
      }
      function lA(e, n, t, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = Zn(o.type)),
          s = new Bo(i, Tt(o), _);
        (e.blueprint[r] = s),
          (t[r] = s),
          (function nA(e, n, t, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~n.index;
              (function rA(e) {
                let n = e.length;
                for (; n > 0; ) {
                  const t = e[--n];
                  if ("number" == typeof t && t < 0) return t;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(t, r, i);
            }
          })(e, n, r, ii(e, t, o.hostVars, k), o);
      }
      function fA(e, n, t, r, o, i) {
        const s = i[n];
        if (null !== s)
          for (let a = 0; a < s.length; ) Lm(r, t, s[a++], s[a++], s[a++]);
      }
      function Lm(e, n, t, r, o) {
        const i = ht(null);
        try {
          const s = e.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (o = s[r].call(n, o)),
            null !== e.setInput ? e.setInput(n, o, t, r) : (n[r] = o);
        } finally {
          ht(i);
        }
      }
      function hA(e, n, t) {
        let r = null,
          o = 0;
        for (; o < t.length; ) {
          const i = t[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === n) {
                    r.push(i, s[a + 1], t[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function Vm(e, n, t, r) {
        return [e, !0, !1, n, null, 0, r, t, null, null, null];
      }
      function jm(e, n) {
        const t = e.contentQueries;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) {
            const i = t[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              hc(t[r]), s.contentQueries(2, n[i], i);
            }
          }
      }
      function ca(e, n) {
        return e[Ro] ? (e[Gh][At] = n) : (e[Ro] = n), (e[Gh] = n), n;
      }
      function Sl(e, n, t) {
        hc(0);
        const r = ht(null);
        try {
          n(e, t);
        } finally {
          ht(r);
        }
      }
      function Um(e, n) {
        const t = e[Sn],
          r = t ? t.get(hn, null) : null;
        r && r.handleError(n);
      }
      function Al(e, n, t, r, o) {
        for (let i = 0; i < t.length; ) {
          const s = t[i++],
            a = t[i++];
          Lm(e.data[s], n[s], r, a, o);
        }
      }
      function pA(e, n) {
        const t = it(n, e),
          r = t[w];
        !(function gA(e, n) {
          for (let t = n.length; t < e.blueprint.length; t++)
            n.push(e.blueprint[t]);
        })(r, t);
        const o = t[fe];
        null !== o && null === t[un] && (t[un] = ul(o, t[Sn])), Tl(r, t, t[ge]);
      }
      function Tl(e, n, t) {
        pc(n);
        try {
          const r = e.viewQuery;
          null !== r && Sl(1, r, t);
          const o = e.template;
          null !== o && Nm(e, n, o, 1, t),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && jm(e, n),
            e.staticViewQueries && Sl(2, e.viewQuery, t);
          const i = e.components;
          null !== i &&
            (function mA(e, n) {
              for (let t = 0; t < n.length; t++) pA(e, n[t]);
            })(n, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (n[L] &= -5), gc();
        }
      }
      let Gm = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(t, r, o) {
            const i = typeof Zone > "u" ? null : Zone.current,
              s = (function MI(e, n, t) {
                const r = Object.create(SI);
                t && (r.consumerAllowSignalWrites = !0),
                  (r.fn = e),
                  (r.schedule = n);
                const o = (s) => {
                  r.cleanupFn = s;
                };
                return (
                  (r.ref = {
                    notify: () => Jh(r),
                    run: () => {
                      if (((r.dirty = !1), r.hasRun && !ep(r))) return;
                      r.hasRun = !0;
                      const s = rc(r);
                      try {
                        r.cleanupFn(), (r.cleanupFn = up), r.fn(o);
                      } finally {
                        oc(r, s);
                      }
                    },
                    cleanup: () => r.cleanupFn(),
                  }),
                  r.ref
                );
              })(
                t,
                (c) => {
                  this.all.has(c) && this.queue.set(c, i);
                },
                o
              );
            let a;
            this.all.add(s), s.notify();
            const u = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(u)), { destroy: u };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [t, r] of this.queue)
                this.queue.delete(t), r ? r.run(() => t.run()) : t.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
          static #e = (this.ɵprov = M({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function la(e, n, t) {
        let r = t ? e.styles : null,
          o = t ? e.classes : null,
          i = 0;
        if (null !== n)
          for (let s = 0; s < n.length; s++) {
            const a = n[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = Vu(o, a))
              : 2 == i && (r = Vu(r, a + ": " + n[++s] + ";"));
          }
        t ? (e.styles = r) : (e.stylesWithoutHost = r),
          t ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function si(e, n, t, r, o = !1) {
        for (; null !== t; ) {
          const i = n[t.index];
          null !== i && r.push(re(i)), Ve(i) && zm(i, r);
          const s = t.type;
          if (8 & s) si(e, n, t.child, r);
          else if (32 & s) {
            const a = Oc(t, n);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = Ig(n, t);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = Zo(n[me]);
              si(u[w], u, a, r, !0);
            }
          }
          t = o ? t.projectionNext : t.next;
        }
        return r;
      }
      function zm(e, n) {
        for (let t = Ae; t < e.length; t++) {
          const r = e[t],
            o = r[w].firstChild;
          null !== o && si(r[w], r, o, n);
        }
        e[Gt] !== e[fe] && n.push(e[Gt]);
      }
      function da(e, n, t, r = !0) {
        const o = n[mr],
          i = o.rendererFactory,
          s = o.afterRenderEventManager;
        i.begin?.(), s?.begin();
        try {
          qm(e, n, e.template, t);
        } catch (u) {
          throw (r && Um(n, u), u);
        } finally {
          i.end?.(), o.effectManager?.flush(), s?.end();
        }
      }
      function qm(e, n, t, r) {
        const o = n[L];
        if (256 != (256 & o)) {
          n[mr].effectManager?.flush(), pc(n);
          try {
            gp(n),
              (function Ep(e) {
                return (T.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== t && Nm(e, n, t, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && bs(n, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && Is(n, c, 0, null), mc(n, 0);
            }
            if (
              ((function DA(e) {
                for (let n = hg(e); null !== n; n = pg(n)) {
                  if (!n[qh]) continue;
                  const t = n[Dr];
                  for (let r = 0; r < t.length; r++) {
                    LI(t[r]);
                  }
                }
              })(n),
              Wm(n, 2),
              null !== e.contentQueries && jm(e, n),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && bs(n, c);
            } else {
              const c = e.contentHooks;
              null !== c && Is(n, c, 1), mc(n, 1);
            }
            !(function GS(e, n) {
              const t = e.hostBindingOpCodes;
              if (null === t) return;
              const r = bm(n, ko);
              try {
                for (let o = 0; o < t.length; o++) {
                  const i = t[o];
                  if (i < 0) Yn(~i);
                  else {
                    const s = i,
                      a = t[++o],
                      u = t[++o];
                    YI(a, s), (r.dirty = !1);
                    const c = rc(r);
                    try {
                      u(2, n[s]);
                    } finally {
                      oc(r, c);
                    }
                  }
                }
              } finally {
                null === n[ko] && Im(n, ko), Yn(-1);
              }
            })(e, n);
            const a = e.components;
            null !== a && Ym(n, a, 0);
            const u = e.viewQuery;
            if ((null !== u && Sl(2, u, r), s)) {
              const c = e.viewCheckHooks;
              null !== c && bs(n, c);
            } else {
              const c = e.viewHooks;
              null !== c && Is(n, c, 2), mc(n, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (n[L] &= -73),
              mp(n);
          } finally {
            gc();
          }
        }
      }
      function Wm(e, n) {
        for (let t = hg(e); null !== t; t = pg(t))
          for (let r = Ae; r < t.length; r++) Zm(t[r], n);
      }
      function _A(e, n, t) {
        Zm(it(n, e), t);
      }
      function Zm(e, n) {
        if (
          !(function FI(e) {
            return 128 == (128 & e[L]);
          })(e)
        )
          return;
        const t = e[w],
          r = e[L];
        if ((80 & r && 0 === n) || 1024 & r || 2 === n)
          qm(t, e, t.template, e[ge]);
        else if (e[xo] > 0) {
          Wm(e, 1);
          const o = t.components;
          null !== o && Ym(e, o, 1);
        }
      }
      function Ym(e, n, t) {
        for (let r = 0; r < n.length; r++) _A(e, n[r], t);
      }
      class ai {
        get rootNodes() {
          const n = this._lView,
            t = n[w];
          return si(t, n, t.firstChild, []);
        }
        constructor(n, t) {
          (this._lView = n),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[ge];
        }
        set context(n) {
          this._lView[ge] = n;
        }
        get destroyed() {
          return 256 == (256 & this._lView[L]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const n = this._lView[ue];
            if (Ve(n)) {
              const t = n[8],
                r = t ? t.indexOf(this) : -1;
              r > -1 && (Us(n, r), xs(t, r));
            }
            this._attachedToViewContainer = !1;
          }
          Fc(this._lView[w], this._lView);
        }
        onDestroy(n) {
          !(function yp(e, n) {
            if (256 == (256 & e[L])) throw new D(911, !1);
            null === e[An] && (e[An] = []), e[An].push(n);
          })(this._lView, n);
        }
        markForCheck() {
          oi(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[L] &= -129;
        }
        reattach() {
          this._lView[L] |= 128;
        }
        detectChanges() {
          da(this._lView[w], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new D(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function l0(e, n) {
              Qo(e, n, n[F], 2, null, null);
            })(this._lView[w], this._lView);
        }
        attachToAppRef(n) {
          if (this._attachedToViewContainer) throw new D(902, !1);
          this._appRef = n;
        }
      }
      class CA extends ai {
        constructor(n) {
          super(n), (this._view = n);
        }
        detectChanges() {
          const n = this._view;
          da(n[w], n, n[ge], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Qm extends ia {
        constructor(n) {
          super(), (this.ngModule = n);
        }
        resolveComponentFactory(n) {
          const t = H(n);
          return new ui(t, this.ngModule);
        }
      }
      function Km(e) {
        const n = [];
        for (let t in e)
          e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
        return n;
      }
      class EA {
        constructor(n, t) {
          (this.injector = n), (this.parentInjector = t);
        }
        get(n, t, r) {
          r = fs(r);
          const o = this.injector.get(n, dl, r);
          return o !== dl || t === dl ? o : this.parentInjector.get(n, t, r);
        }
      }
      class ui extends nm {
        get inputs() {
          const n = this.componentDef,
            t = n.inputTransforms,
            r = Km(n.inputs);
          if (null !== t)
            for (const o of r)
              t.hasOwnProperty(o.propName) && (o.transform = t[o.propName]);
          return r;
        }
        get outputs() {
          return Km(this.componentDef.outputs);
        }
        constructor(n, t) {
          super(),
            (this.componentDef = n),
            (this.ngModule = t),
            (this.componentType = n.type),
            (this.selector = (function aI(e) {
              return e.map(sI).join(",");
            })(n.selectors)),
            (this.ngContentSelectors = n.ngContentSelectors
              ? n.ngContentSelectors
              : []),
            (this.isBoundToModule = !!t);
        }
        create(n, t, r, o) {
          let i = (o = o || this.ngModule) instanceof mt ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new EA(n, i) : n,
            a = s.get(om, null);
          if (null === a) throw new D(407, !1);
          const d = {
              rendererFactory: a,
              sanitizer: s.get(DS, null),
              effectManager: s.get(Gm, null),
              afterRenderEventManager: s.get(yl, null),
            },
            f = a.createRenderer(null, this.componentDef),
            h = this.componentDef.selectors[0][0] || "div",
            p = r
              ? (function qS(e, n, t, r) {
                  const i = r.get(_m, !1) || t === It.ShadowDom,
                    s = e.selectRootElement(n, i);
                  return (
                    (function WS(e) {
                      Rm(e);
                    })(s),
                    s
                  );
                })(f, r, this.componentDef.encapsulation, s)
              : Hs(
                  f,
                  h,
                  (function wA(e) {
                    const n = e.toLowerCase();
                    return "svg" === n ? "svg" : "math" === n ? "math" : null;
                  })(h)
                ),
            C = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528;
          let m = null;
          null !== p && (m = ul(p, s, !0));
          const I = El(0, null, null, 1, 0, null, null, null, null, null, null),
            N = ua(null, I, null, C, null, null, d, f, s, null, m);
          let $, Je;
          pc(N);
          try {
            const En = this.componentDef;
            let wo,
              Yf = null;
            En.findHostDirectiveDefs
              ? ((wo = []),
                (Yf = new Map()),
                En.findHostDirectiveDefs(En, wo, Yf),
                wo.push(En))
              : (wo = [En]);
            const zV = (function IA(e, n) {
                const t = e[w],
                  r = B;
                return (e[r] = n), qr(t, r, 2, "#host", null);
              })(N, p),
              qV = (function MA(e, n, t, r, o, i, s) {
                const a = o[w];
                !(function SA(e, n, t, r) {
                  for (const o of e)
                    n.mergedAttrs = No(n.mergedAttrs, o.hostAttrs);
                  null !== n.mergedAttrs &&
                    (la(n, n.mergedAttrs, !0), null !== t && Tg(r, t, n));
                })(r, e, n, s);
                let u = null;
                null !== n && (u = ul(n, o[Sn]));
                const c = i.rendererFactory.createRenderer(n, t);
                let l = 16;
                t.signals ? (l = 4096) : t.onPush && (l = 64);
                const d = ua(
                  o,
                  xm(t),
                  null,
                  l,
                  o[e.index],
                  e,
                  i,
                  c,
                  null,
                  null,
                  u
                );
                return (
                  a.firstCreatePass && Il(a, e, r.length - 1),
                  ca(o, d),
                  (o[e.index] = d)
                );
              })(zV, p, En, wo, N, d, f);
            (Je = pp(I, B)),
              p &&
                (function TA(e, n, t, r) {
                  if (r) Xu(e, t, ["ng-version", _S.full]);
                  else {
                    const { attrs: o, classes: i } = (function uI(e) {
                      const n = [],
                        t = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && n.push(i, e[++r])
                            : 8 === o && t.push(i);
                        else {
                          if (!Mt(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: n, classes: t };
                    })(n.selectors[0]);
                    o && Xu(e, t, o),
                      i && i.length > 0 && Ag(e, t, i.join(" "));
                  }
                })(f, En, p, r),
              void 0 !== t &&
                (function NA(e, n, t) {
                  const r = (e.projection = []);
                  for (let o = 0; o < n.length; o++) {
                    const i = t[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(Je, this.ngContentSelectors, t),
              ($ = (function AA(e, n, t, r, o, i) {
                const s = Ne(),
                  a = o[w],
                  u = Ye(s, o);
                Fm(a, o, s, t, null, r);
                for (let l = 0; l < t.length; l++)
                  Oe(Qn(o, a, s.directiveStart + l, s), o);
                km(a, o, s), u && Oe(u, o);
                const c = Qn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[ge] = o[ge] = c), null !== i))
                  for (const l of i) l(c, n);
                return _l(a, s, e), c;
              })(qV, En, wo, Yf, N, [xA])),
              Tl(I, N, null);
          } finally {
            gc();
          }
          return new bA(this.componentType, $, Ur(Je, N), N, Je);
        }
      }
      class bA extends hS {
        constructor(n, t, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new CA(o)),
            (this.componentType = n);
        }
        setInput(n, t) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[n])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(n) &&
                Object.is(this.previousInputValues.get(n), t))
            )
              return;
            const i = this._rootLView;
            Al(i[w], i, o, n, t),
              this.previousInputValues.set(n, t),
              oi(it(this._tNode.index, i));
          }
        }
        get injector() {
          return new $e(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(n) {
          this.hostView.onDestroy(n);
        }
      }
      function xA() {
        const e = Ne();
        Es(v()[w], e);
      }
      function Y(e) {
        let n = (function Xm(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          t = !0;
        const r = [e];
        for (; n; ) {
          let o;
          if (Tt(e)) o = n.ɵcmp || n.ɵdir;
          else {
            if (n.ɵcmp) throw new D(903, !1);
            o = n.ɵdir;
          }
          if (o) {
            if (t) {
              r.push(o);
              const s = e;
              (s.inputs = fa(e.inputs)),
                (s.inputTransforms = fa(e.inputTransforms)),
                (s.declaredInputs = fa(e.declaredInputs)),
                (s.outputs = fa(e.outputs));
              const a = o.hostBindings;
              a && FA(e, a);
              const u = o.viewQuery,
                c = o.contentQueries;
              if (
                (u && OA(e, u),
                c && PA(e, c),
                ss(e.inputs, o.inputs),
                ss(e.declaredInputs, o.declaredInputs),
                ss(e.outputs, o.outputs),
                null !== o.inputTransforms &&
                  (null === s.inputTransforms && (s.inputTransforms = {}),
                  ss(s.inputTransforms, o.inputTransforms)),
                Tt(o) && o.data.animation)
              ) {
                const l = e.data;
                l.animation = (l.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === Y && (t = !1);
              }
          }
          n = Object.getPrototypeOf(n);
        }
        !(function RA(e) {
          let n = 0,
            t = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = n += o.hostVars),
              (o.hostAttrs = No(o.hostAttrs, (t = No(t, o.hostAttrs))));
          }
        })(r);
      }
      function fa(e) {
        return e === Ht ? {} : e === G ? [] : e;
      }
      function OA(e, n) {
        const t = e.viewQuery;
        e.viewQuery = t
          ? (r, o) => {
              n(r, o), t(r, o);
            }
          : n;
      }
      function PA(e, n) {
        const t = e.contentQueries;
        e.contentQueries = t
          ? (r, o, i) => {
              n(r, o, i), t(r, o, i);
            }
          : n;
      }
      function FA(e, n) {
        const t = e.hostBindings;
        e.hostBindings = t
          ? (r, o) => {
              n(r, o), t(r, o);
            }
          : n;
      }
      function ha(e) {
        return (
          !!Nl(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function Nl(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function Yt(e, n, t) {
        return (e[n] = t);
      }
      function Pe(e, n, t) {
        return !Object.is(e[n], t) && ((e[n] = t), !0);
      }
      function Kt(e, n, t, r, o, i, s, a) {
        const u = v(),
          c = U(),
          l = e + B,
          d = c.firstCreatePass
            ? (function sT(e, n, t, r, o, i, s, a, u) {
                const c = n.consts,
                  l = qr(n, e, 4, s || null, Nn(c, a));
                bl(n, t, l, Nn(c, u)), Es(n, l);
                const d = (l.tView = El(
                  2,
                  l,
                  r,
                  o,
                  i,
                  n.directiveRegistry,
                  n.pipeRegistry,
                  null,
                  n.schemas,
                  c,
                  null
                ));
                return (
                  null !== n.queries &&
                    (n.queries.template(n, l),
                    (d.queries = n.queries.embeddedTView(l))),
                  l
                );
              })(l, c, u, n, t, r, o, i, s)
            : c.data[l];
        qt(d, !1);
        const f = gv(c, u, d, e);
        ws() && zs(c, u, f, d),
          Oe(f, u),
          ca(u, (u[l] = Vm(f, u, f, d))),
          ys(d) && Cl(c, u, d),
          null != s && wl(u, d, a);
      }
      let gv = function mv(e, n, t, r) {
        return xn(!0), n[F].createComment("");
      };
      function hi(e) {
        return Cr(
          (function WI() {
            return T.lFrame.contextLView;
          })(),
          B + e
        );
      }
      function Xt(e, n, t) {
        const r = v();
        return (
          Pe(r, Er(), n) &&
            (function ct(e, n, t, r, o, i, s, a) {
              const u = Ye(n, t);
              let l,
                c = n.inputs;
              !a && null != c && (l = c[r])
                ? (Al(e, t, l, r, o),
                  Wn(n) &&
                    (function eA(e, n) {
                      const t = it(n, e);
                      16 & t[L] || (t[L] |= 64);
                    })(t, n.index))
                : 3 & n.type &&
                  ((r = (function JS(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, n.value || "", r) : o),
                  i.setProperty(u, r, o));
            })(
              U(),
              (function le() {
                const e = T.lFrame;
                return pp(e.tView, e.selectedIndex);
              })(),
              r,
              e,
              n,
              r[F],
              t,
              !1
            ),
          Xt
        );
      }
      function kl(e, n, t, r, o) {
        const s = o ? "class" : "style";
        Al(e, t, n.inputs[s], s, r);
      }
      function ie(e, n, t, r) {
        const o = v(),
          i = U(),
          s = B + e,
          a = o[F],
          u = i.firstCreatePass
            ? (function lT(e, n, t, r, o, i) {
                const s = n.consts,
                  u = qr(n, e, 2, r, Nn(s, o));
                return (
                  bl(n, t, u, Nn(s, i)),
                  null !== u.attrs && la(u, u.attrs, !1),
                  null !== u.mergedAttrs && la(u, u.mergedAttrs, !0),
                  null !== n.queries && n.queries.elementStart(n, u),
                  u
                );
              })(s, i, o, n, t, r)
            : i.data[s],
          c = vv(i, o, u, a, n, e);
        o[s] = c;
        const l = ys(u);
        return (
          qt(u, !0),
          Tg(a, c, u),
          32 != (32 & u.flags) && ws() && zs(i, o, c, u),
          0 ===
            (function jI() {
              return T.lFrame.elementDepthCount;
            })() && Oe(c, o),
          (function BI() {
            T.lFrame.elementDepthCount++;
          })(),
          l && (Cl(i, o, u), _l(i, u, o)),
          null !== r && wl(o, u),
          ie
        );
      }
      function J() {
        let e = Ne();
        cc()
          ? (function lc() {
              T.lFrame.isParent = !1;
            })()
          : ((e = e.parent), qt(e, !1));
        const n = e;
        (function HI(e) {
          return T.skipHydrationRootTNode === e;
        })(n) &&
          (function qI() {
            T.skipHydrationRootTNode = null;
          })(),
          (function $I() {
            T.lFrame.elementDepthCount--;
          })();
        const t = U();
        return (
          t.firstCreatePass && (Es(t, e), ec(e) && t.queries.elementEnd(e)),
          null != n.classesWithoutHost &&
            (function aM(e) {
              return 0 != (8 & e.flags);
            })(n) &&
            kl(t, n, v(), n.classesWithoutHost, !0),
          null != n.stylesWithoutHost &&
            (function uM(e) {
              return 0 != (16 & e.flags);
            })(n) &&
            kl(t, n, v(), n.stylesWithoutHost, !1),
          J
        );
      }
      function Ot(e, n, t, r) {
        return ie(e, n, t, r), J(), Ot;
      }
      let vv = (e, n, t, r, o, i) => (
        xn(!0),
        Hs(
          r,
          o,
          (function xp() {
            return T.lFrame.currentNamespace;
          })()
        )
      );
      function ya() {
        return v();
      }
      function pi(e) {
        return !!e && "function" == typeof e.then;
      }
      function _v(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function de(e, n, t, r) {
        const o = v(),
          i = U(),
          s = Ne();
        return (
          (function wv(e, n, t, r, o, i, s) {
            const a = ys(r),
              c =
                e.firstCreatePass &&
                (function $m(e) {
                  return e.cleanup || (e.cleanup = []);
                })(e),
              l = n[ge],
              d = (function Bm(e) {
                return e[gr] || (e[gr] = []);
              })(n);
            let f = !0;
            if (3 & r.type || s) {
              const g = Ye(r, n),
                y = s ? s(g) : g,
                C = d.length,
                m = s ? (N) => s(re(N[r.index])) : r.index;
              let I = null;
              if (
                (!s &&
                  a &&
                  (I = (function mT(e, n, t, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === t && o[i + 1] === r) {
                          const a = n[gr],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, n, o, r.index)),
                null !== I)
              )
                ((I.__ngLastListenerFn__ || I).__ngNextListenerFn__ = i),
                  (I.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = bv(r, n, l, i, !1);
                const N = t.listen(y, o, i);
                d.push(i, N), c && c.push(o, m, C, C + 1);
              }
            } else i = bv(r, n, l, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let y = 0; y < g; y += 2) {
                  const $ = n[p[y]][p[y + 1]].subscribe(i),
                    Je = d.length;
                  d.push(i, $), c && c.push(o, r.index, Je, -(Je + 1));
                }
            }
          })(i, o, o[F], s, e, n, r),
          de
        );
      }
      function Ev(e, n, t, r) {
        try {
          return zt(6, n, t), !1 !== t(r);
        } catch (o) {
          return Um(e, o), !1;
        } finally {
          zt(7, n, t);
        }
      }
      function bv(e, n, t, r, o) {
        return function i(s) {
          if (s === Function) return r;
          oi(e.componentOffset > -1 ? it(e.index, n) : n);
          let u = Ev(n, t, r, s),
            c = i.__ngNextListenerFn__;
          for (; c; ) (u = Ev(n, t, c, s) && u), (c = c.__ngNextListenerFn__);
          return o && !1 === u && s.preventDefault(), u;
        };
      }
      function yt(e = 1) {
        return (function XI(e) {
          return (T.lFrame.contextLView = (function JI(e, n) {
            for (; e > 0; ) (n = n[vr]), e--;
            return n;
          })(e, T.lFrame.contextLView))[ge];
        })(e);
      }
      function Da(e, n) {
        return (e << 17) | (n << 2);
      }
      function Pn(e) {
        return (e >> 17) & 32767;
      }
      function Bl(e) {
        return 2 | e;
      }
      function er(e) {
        return (131068 & e) >> 2;
      }
      function $l(e, n) {
        return (-131069 & e) | (n << 2);
      }
      function Hl(e) {
        return 1 | e;
      }
      function Pv(e, n, t, r, o) {
        const i = e[t + 1],
          s = null === n;
        let a = r ? Pn(i) : er(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const l = e[a + 1];
          IT(e[a], n) && ((u = !0), (e[a + 1] = r ? Hl(l) : Bl(l))),
            (a = r ? Pn(l) : er(l));
        }
        u && (e[t + 1] = r ? Bl(i) : Hl(i));
      }
      function IT(e, n) {
        return (
          null === e ||
          null == n ||
          (Array.isArray(e) ? e[1] : e) === n ||
          (!(!Array.isArray(e) || "string" != typeof n) && xr(e, n) >= 0)
        );
      }
      function _a(e, n) {
        return (
          (function Pt(e, n, t, r) {
            const o = v(),
              i = U(),
              s = (function ln(e) {
                const n = T.lFrame,
                  t = n.bindingIndex;
                return (n.bindingIndex = n.bindingIndex + e), t;
              })(2);
            i.firstUpdatePass &&
              (function Uv(e, n, t, r) {
                const o = e.data;
                if (null === o[t + 1]) {
                  const i = o[Be()],
                    s = (function Hv(e, n) {
                      return n >= e.expandoStartIndex;
                    })(e, t);
                  (function Wv(e, n) {
                    return 0 != (e.flags & (n ? 8 : 16));
                  })(i, r) &&
                    null === n &&
                    !s &&
                    (n = !1),
                    (n = (function PT(e, n, t, r) {
                      const o = (function fc(e) {
                        const n = T.lFrame.currentDirectiveIndex;
                        return -1 === n ? null : e[n];
                      })(e);
                      let i = r ? n.residualClasses : n.residualStyles;
                      if (null === o)
                        0 === (r ? n.classBindings : n.styleBindings) &&
                          ((t = gi((t = Ul(null, e, n, t, r)), n.attrs, r)),
                          (i = null));
                      else {
                        const s = n.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((t = Ul(o, e, n, t, r)), null === i)) {
                            let u = (function FT(e, n, t) {
                              const r = t ? n.classBindings : n.styleBindings;
                              if (0 !== er(r)) return e[Pn(r)];
                            })(e, n, r);
                            void 0 !== u &&
                              Array.isArray(u) &&
                              ((u = Ul(null, e, n, u[1], r)),
                              (u = gi(u, n.attrs, r)),
                              (function kT(e, n, t, r) {
                                e[Pn(t ? n.classBindings : n.styleBindings)] =
                                  r;
                              })(e, n, r, u));
                          } else
                            i = (function LT(e, n, t) {
                              let r;
                              const o = n.directiveEnd;
                              for (
                                let i = 1 + n.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = gi(r, e[i].hostAttrs, t);
                              return gi(r, n.attrs, t);
                            })(e, n, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (n.residualClasses = i)
                            : (n.residualStyles = i)),
                        t
                      );
                    })(o, i, n, r)),
                    (function ET(e, n, t, r, o, i) {
                      let s = i ? n.classBindings : n.styleBindings,
                        a = Pn(s),
                        u = er(s);
                      e[r] = t;
                      let l,
                        c = !1;
                      if (
                        (Array.isArray(t)
                          ? ((l = t[1]),
                            (null === l || xr(t, l) > 0) && (c = !0))
                          : (l = t),
                        o)
                      )
                        if (0 !== u) {
                          const f = Pn(e[a + 1]);
                          (e[r + 1] = Da(f, a)),
                            0 !== f && (e[f + 1] = $l(e[f + 1], r)),
                            (e[a + 1] = (function CT(e, n) {
                              return (131071 & e) | (n << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = Da(a, 0)),
                            0 !== a && (e[a + 1] = $l(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = Da(u, 0)),
                          0 === a ? (a = r) : (e[u + 1] = $l(e[u + 1], r)),
                          (u = r);
                      c && (e[r + 1] = Bl(e[r + 1])),
                        Pv(e, l, r, !0),
                        Pv(e, l, r, !1),
                        (function bT(e, n, t, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof n &&
                            xr(i, n) >= 0 &&
                            (t[r + 1] = Hl(t[r + 1]));
                        })(n, l, e, r, i),
                        (s = Da(a, u)),
                        i ? (n.classBindings = s) : (n.styleBindings = s);
                    })(o, i, n, t, s, r);
                }
              })(i, e, s, r),
              n !== k &&
                Pe(o, s, n) &&
                (function zv(e, n, t, r, o, i, s, a) {
                  if (!(3 & n.type)) return;
                  const u = e.data,
                    c = u[a + 1],
                    l = (function wT(e) {
                      return 1 == (1 & e);
                    })(c)
                      ? qv(u, n, t, o, er(c), s)
                      : void 0;
                  Ca(l) ||
                    (Ca(i) ||
                      ((function _T(e) {
                        return 2 == (2 & e);
                      })(c) &&
                        (i = qv(u, null, t, o, a, s))),
                    (function _0(e, n, t, r, o) {
                      if (n) o ? e.addClass(t, r) : e.removeClass(t, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : Rn.DashCase;
                        null == o
                          ? e.removeStyle(t, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= Rn.Important)),
                            e.setStyle(t, r, o, i));
                      }
                    })(r, s, Cs(Be(), t), o, i));
                })(
                  i,
                  i.data[Be()],
                  o,
                  o[F],
                  e,
                  (o[s + 1] = (function $T(e, n) {
                    return (
                      null == e ||
                        "" === e ||
                        ("string" == typeof n
                          ? (e += n)
                          : "object" == typeof e &&
                            (e = we(
                              (function On(e) {
                                return e instanceof Og
                                  ? e.changingThisBreaksApplicationSecurity
                                  : e;
                              })(e)
                            ))),
                      e
                    );
                  })(n, t)),
                  r,
                  s
                );
          })(e, n, null, !0),
          _a
        );
      }
      function Ul(e, n, t, r, o) {
        let i = null;
        const s = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (
          -1 === a ? (a = t.directiveStart) : a++;
          a < s && ((i = n[a]), (r = gi(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (t.directiveStylingLast = a), r;
      }
      function gi(e, n, t) {
        const r = t ? 1 : 2;
        let o = -1;
        if (null !== n)
          for (let i = 0; i < n.length; i++) {
            const s = n[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                st(e, s, !!t || n[++i]));
          }
        return void 0 === e ? null : e;
      }
      function qv(e, n, t, r, o, i) {
        const s = null === n;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            c = Array.isArray(u),
            l = c ? u[1] : u,
            d = null === l;
          let f = t[o + 1];
          f === k && (f = d ? G : void 0);
          let h = d ? bc(f, r) : l === r ? f : void 0;
          if ((c && !Ca(h) && (h = bc(u, r)), Ca(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? Pn(p) : er(p);
        }
        if (null !== n) {
          let u = i ? n.residualClasses : n.residualStyles;
          null != u && (a = bc(u, r));
        }
        return a;
      }
      function Ca(e) {
        return void 0 !== e;
      }
      function Dt(e, n = "") {
        const t = v(),
          r = U(),
          o = e + B,
          i = r.firstCreatePass ? qr(r, o, 1, n, null) : r.data[o],
          s = Zv(r, t, i, n, e);
        (t[o] = s), ws() && zs(r, t, s, i), qt(i, !1);
      }
      let Zv = (e, n, t, r, o) => (
        xn(!0),
        (function $s(e, n) {
          return e.createText(n);
        })(n[F], r)
      );
      function Gl(e) {
        return mi("", e, ""), Gl;
      }
      function mi(e, n, t) {
        const r = v(),
          o = (function Zr(e, n, t, r) {
            return Pe(e, Er(), t) ? n + P(t) + r : k;
          })(r, e, n, t);
        return (
          o !== k &&
            (function gn(e, n, t) {
              const r = Cs(n, e);
              !(function mg(e, n, t) {
                e.setValue(n, t);
              })(e[F], r, t);
            })(r, Be(), o),
          mi
        );
      }
      const tr = void 0;
      var cN = [
        "en",
        [["a", "p"], ["AM", "PM"], tr],
        [["AM", "PM"], tr, tr],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        tr,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        tr,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", tr, "{1} 'at' {0}", tr],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function uN(e) {
          const t = Math.floor(Math.abs(e)),
            r = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === t && 0 === r ? 1 : 5;
        },
      ];
      let ro = {};
      function He(e) {
        const n = (function lN(e) {
          return e.toLowerCase().replace(/_/g, "-");
        })(e);
        let t = gy(n);
        if (t) return t;
        const r = n.split("-")[0];
        if (((t = gy(r)), t)) return t;
        if ("en" === r) return cN;
        throw new D(701, !1);
      }
      function gy(e) {
        return (
          e in ro ||
            (ro[e] =
              ne.ng &&
              ne.ng.common &&
              ne.ng.common.locales &&
              ne.ng.common.locales[e]),
          ro[e]
        );
      }
      var se = (function (e) {
        return (
          (e[(e.LocaleId = 0)] = "LocaleId"),
          (e[(e.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
          (e[(e.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
          (e[(e.DaysFormat = 3)] = "DaysFormat"),
          (e[(e.DaysStandalone = 4)] = "DaysStandalone"),
          (e[(e.MonthsFormat = 5)] = "MonthsFormat"),
          (e[(e.MonthsStandalone = 6)] = "MonthsStandalone"),
          (e[(e.Eras = 7)] = "Eras"),
          (e[(e.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
          (e[(e.WeekendRange = 9)] = "WeekendRange"),
          (e[(e.DateFormat = 10)] = "DateFormat"),
          (e[(e.TimeFormat = 11)] = "TimeFormat"),
          (e[(e.DateTimeFormat = 12)] = "DateTimeFormat"),
          (e[(e.NumberSymbols = 13)] = "NumberSymbols"),
          (e[(e.NumberFormats = 14)] = "NumberFormats"),
          (e[(e.CurrencyCode = 15)] = "CurrencyCode"),
          (e[(e.CurrencySymbol = 16)] = "CurrencySymbol"),
          (e[(e.CurrencyName = 17)] = "CurrencyName"),
          (e[(e.Currencies = 18)] = "Currencies"),
          (e[(e.Directionality = 19)] = "Directionality"),
          (e[(e.PluralCase = 20)] = "PluralCase"),
          (e[(e.ExtraData = 21)] = "ExtraData"),
          e
        );
      })(se || {});
      const oo = "en-US";
      let my = oo;
      function Wl(e, n, t, r, o) {
        if (((e = x(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) Wl(e[i], n, t, r, o);
        else {
          const i = U(),
            s = v(),
            a = Ne();
          let u = Xn(e) ? e : x(e.provide);
          const c = Qg(e),
            l = 1048575 & a.providerIndexes,
            d = a.directiveStart,
            f = a.providerIndexes >> 20;
          if (Xn(e) || !e.multi) {
            const h = new Bo(c, o, _),
              p = Yl(u, n, o ? l : l + f, d);
            -1 === p
              ? (Cc(Ss(a, s), i, u),
                Zl(i, e, n.length),
                n.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                t.push(h),
                s.push(h))
              : ((t[p] = h), (s[p] = h));
          } else {
            const h = Yl(u, n, l + f, d),
              p = Yl(u, n, l, l + f),
              y = p >= 0 && t[p];
            if ((o && !y) || (!o && !(h >= 0 && t[h]))) {
              Cc(Ss(a, s), i, u);
              const C = (function ux(e, n, t, r, o) {
                const i = new Bo(e, t, _);
                return (
                  (i.multi = []),
                  (i.index = n),
                  (i.componentProviders = 0),
                  $y(i, o, r && !t),
                  i
                );
              })(o ? ax : sx, t.length, o, r, c);
              !o && y && (t[p].providerFactory = C),
                Zl(i, e, n.length, 0),
                n.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                t.push(C),
                s.push(C);
            } else Zl(i, e, h > -1 ? h : p, $y(t[o ? p : h], c, !o && r));
            !o && r && y && t[p].componentProviders++;
          }
        }
      }
      function Zl(e, n, t, r) {
        const o = Xn(n),
          i = (function Q0(e) {
            return !!e.useClass;
          })(n);
        if (o || i) {
          const u = (i ? x(n.useClass) : n).prototype.ngOnDestroy;
          if (u) {
            const c = e.destroyHooks || (e.destroyHooks = []);
            if (!o && n.multi) {
              const l = c.indexOf(t);
              -1 === l ? c.push(t, [r, u]) : c[l + 1].push(r, u);
            } else c.push(t, u);
          }
        }
      }
      function $y(e, n, t) {
        return t && e.componentProviders++, e.multi.push(n) - 1;
      }
      function Yl(e, n, t, r) {
        for (let o = t; o < r; o++) if (n[o] === e) return o;
        return -1;
      }
      function sx(e, n, t, r) {
        return Ql(this.multi, []);
      }
      function ax(e, n, t, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = Qn(t, t[w], this.providerFactory.index, r);
          (i = a.slice(0, s)), Ql(o, i);
          for (let u = s; u < a.length; u++) i.push(a[u]);
        } else (i = []), Ql(o, i);
        return i;
      }
      function Ql(e, n) {
        for (let t = 0; t < e.length; t++) n.push((0, e[t])());
        return n;
      }
      function ce(e, n = []) {
        return (t) => {
          t.providersResolver = (r, o) =>
            (function ix(e, n, t) {
              const r = U();
              if (r.firstCreatePass) {
                const o = Tt(e);
                Wl(t, r.data, r.blueprint, o, !0),
                  Wl(n, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, n);
        };
      }
      class nr {}
      class Hy {}
      class Kl extends nr {
        constructor(n, t, r) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Qm(this));
          const o = ot(n);
          (this._bootstrapComponents = pn(o.bootstrap)),
            (this._r3Injector = cm(
              n,
              t,
              [
                { provide: nr, useValue: this },
                { provide: ia, useValue: this.componentFactoryResolver },
                ...r,
              ],
              we(n),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(n));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const n = this._r3Injector;
          !n.destroyed && n.destroy(),
            this.destroyCbs.forEach((t) => t()),
            (this.destroyCbs = null);
        }
        onDestroy(n) {
          this.destroyCbs.push(n);
        }
      }
      class Xl extends Hy {
        constructor(n) {
          super(), (this.moduleType = n);
        }
        create(n) {
          return new Kl(this.moduleType, n, []);
        }
      }
      class Uy extends nr {
        constructor(n) {
          super(),
            (this.componentFactoryResolver = new Qm(this)),
            (this.instance = null);
          const t = new Vr(
            [
              ...n.providers,
              { provide: nr, useValue: this },
              { provide: ia, useValue: this.componentFactoryResolver },
            ],
            n.parent || Xs(),
            n.debugName,
            new Set(["environment"])
          );
          (this.injector = t),
            n.runEnvironmentInitializers && t.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(n) {
          this.injector.onDestroy(n);
        }
      }
      function Jl(e, n, t = null) {
        return new Uy({
          providers: e,
          parent: n,
          debugName: t,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let dx = (() => {
        class e {
          constructor(t) {
            (this._injector = t), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(t) {
            if (!t.standalone) return null;
            if (!this.cachedInjectors.has(t)) {
              const r = qg(0, t.type),
                o =
                  r.length > 0
                    ? Jl([r], this._injector, `Standalone[${t.type.name}]`)
                    : null;
              this.cachedInjectors.set(t, o);
            }
            return this.cachedInjectors.get(t);
          }
          ngOnDestroy() {
            try {
              for (const t of this.cachedInjectors.values())
                null !== t && t.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
          static #e = (this.ɵprov = M({
            token: e,
            providedIn: "environment",
            factory: () => new e(S(mt)),
          }));
        }
        return e;
      })();
      function Gy(e) {
        e.getStandaloneInjector = (n) =>
          n.get(dx).getOrCreateStandaloneInjector(e);
      }
      function Ky(e, n, t, r) {
        return (function Jy(e, n, t, r, o, i) {
          const s = n + t;
          return Pe(e, s, o)
            ? Yt(e, s + 1, i ? r.call(i, o) : r(o))
            : wi(e, s + 1);
        })(v(), je(), e, n, t, r);
      }
      function wi(e, n) {
        const t = e[n];
        return t === k ? void 0 : t;
      }
      function eD(e, n, t, r, o, i, s) {
        const a = n + t;
        return (function Jn(e, n, t, r) {
          const o = Pe(e, n, t);
          return Pe(e, n + 1, r) || o;
        })(e, a, o, i)
          ? Yt(e, a + 2, s ? r.call(s, o, i) : r(o, i))
          : wi(e, a + 2);
      }
      function iD(e, n, t, r) {
        const o = e + B,
          i = v(),
          s = Cr(i, o);
        return (function Ei(e, n) {
          return e[w].data[n].pure;
        })(i, o)
          ? eD(i, je(), n, s.transform, t, r, s)
          : s.transform(t, r);
      }
      function Fx(e, n, t, r = !0) {
        const o = n[w];
        if (
          ((function f0(e, n, t, r) {
            const o = Ae + r,
              i = t.length;
            r > 0 && (t[o - 1][At] = n),
              r < i - Ae
                ? ((n[At] = t[o]), qp(t, Ae + r, n))
                : (t.push(n), (n[At] = null)),
              (n[ue] = t);
            const s = n[Oo];
            null !== s &&
              t !== s &&
              (function h0(e, n) {
                const t = e[Dr];
                n[me] !== n[ue][ue][me] && (e[qh] = !0),
                  null === t ? (e[Dr] = [n]) : t.push(n);
              })(s, n);
            const a = n[Ut];
            null !== a && a.insertView(e), (n[L] |= 128);
          })(o, n, e, t),
          r)
        ) {
          const i = jc(t, e),
            s = n[F],
            a = Gs(s, e[Gt]);
          null !== a &&
            (function c0(e, n, t, r, o, i) {
              (r[fe] = o), (r[Re] = n), Qo(e, r, t, 1, o, i);
            })(o, e[Re], s, n, a, i);
        }
      }
      Symbol;
      let mn = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = Vx);
        }
        return e;
      })();
      const kx = mn,
        Lx = class extends kx {
          constructor(n, t, r) {
            super(),
              (this._declarationLView = n),
              (this._declarationTContainer = t),
              (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(n, t) {
            return this.createEmbeddedViewImpl(n, t);
          }
          createEmbeddedViewImpl(n, t, r) {
            const o = (function Px(e, n, t, r) {
              const o = n.tView,
                a = ua(
                  e,
                  o,
                  t,
                  4096 & e[L] ? 4096 : 16,
                  null,
                  n,
                  null,
                  null,
                  null,
                  r?.injector ?? null,
                  r?.hydrationInfo ?? null
                );
              a[Oo] = e[n.index];
              const c = e[Ut];
              return (
                null !== c && (a[Ut] = c.createEmbeddedView(o)), Tl(o, a, t), a
              );
            })(this._declarationLView, this._declarationTContainer, n, {
              injector: t,
              hydrationInfo: r,
            });
            return new ai(o);
          }
        };
      function Vx() {
        return Ma(Ne(), v());
      }
      function Ma(e, n) {
        return 4 & e.type ? new Lx(n, e, Ur(e, n)) : null;
      }
      let kt = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = Gx);
        }
        return e;
      })();
      function Gx() {
        return (function fD(e, n) {
          let t;
          const r = n[e.index];
          return (
            Ve(r)
              ? (t = r)
              : ((t = Vm(r, n, null, e)), (n[e.index] = t), ca(n, t)),
            hD(t, n, e, r),
            new lD(t, e, n)
          );
        })(Ne(), v());
      }
      const zx = kt,
        lD = class extends zx {
          constructor(n, t, r) {
            super(),
              (this._lContainer = n),
              (this._hostTNode = t),
              (this._hostLView = r);
          }
          get element() {
            return Ur(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new $e(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const n = As(this._hostTNode, this._hostLView);
            if (yc(n)) {
              const t = Ho(n, this._hostLView),
                r = $o(n);
              return new $e(t[w].data[r + 8], t);
            }
            return new $e(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(n) {
            const t = dD(this._lContainer);
            return (null !== t && t[n]) || null;
          }
          get length() {
            return this._lContainer.length - Ae;
          }
          createEmbeddedView(n, t, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const a = n.createEmbeddedViewImpl(t || {}, i, null);
            return this.insertImpl(a, o, false), a;
          }
          createComponent(n, t, r, o, i) {
            const s =
              n &&
              !(function Go(e) {
                return "function" == typeof e;
              })(n);
            let a;
            if (s) a = t;
            else {
              const g = t || {};
              (a = g.index),
                (r = g.injector),
                (o = g.projectableNodes),
                (i = g.environmentInjector || g.ngModuleRef);
            }
            const u = s ? n : new ui(H(n)),
              c = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const y = (s ? c : this.parentInjector).get(mt, null);
              y && (i = y);
            }
            H(u.componentType ?? {});
            const h = u.create(c, o, null, i);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(n, t) {
            return this.insertImpl(n, t, !1);
          }
          insertImpl(n, t, r) {
            const o = n._lView;
            if (
              (function kI(e) {
                return Ve(e[ue]);
              })(o)
            ) {
              const u = this.indexOf(n);
              if (-1 !== u) this.detach(u);
              else {
                const c = o[ue],
                  l = new lD(c, c[Re], c[ue]);
                l.detach(l.indexOf(n));
              }
            }
            const s = this._adjustIndex(t),
              a = this._lContainer;
            return (
              Fx(a, o, s, !r), n.attachToViewContainerRef(), qp(nd(a), s, n), n
            );
          }
          move(n, t) {
            return this.insert(n, t);
          }
          indexOf(n) {
            const t = dD(this._lContainer);
            return null !== t ? t.indexOf(n) : -1;
          }
          remove(n) {
            const t = this._adjustIndex(n, -1),
              r = Us(this._lContainer, t);
            r && (xs(nd(this._lContainer), t), Fc(r[w], r));
          }
          detach(n) {
            const t = this._adjustIndex(n, -1),
              r = Us(this._lContainer, t);
            return r && null != xs(nd(this._lContainer), t) ? new ai(r) : null;
          }
          _adjustIndex(n, t = 0) {
            return n ?? this.length + t;
          }
        };
      function dD(e) {
        return e[8];
      }
      function nd(e) {
        return e[8] || (e[8] = []);
      }
      let hD = function pD(e, n, t, r) {
        if (e[Gt]) return;
        let o;
        (o =
          8 & t.type
            ? re(r)
            : (function qx(e, n) {
                const t = e[F],
                  r = t.createComment(""),
                  o = Ye(n, e);
                return (
                  Kn(
                    t,
                    Gs(t, o),
                    r,
                    (function v0(e, n) {
                      return e.nextSibling(n);
                    })(t, o),
                    !1
                  ),
                  r
                );
              })(n, t)),
          (e[Gt] = o);
      };
      function bi(e, n) {
        return Ma(e, n);
      }
      const hd = new b("Application Initializer");
      let pd = (() => {
          class e {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((t, r) => {
                  (this.resolve = t), (this.reject = r);
                })),
                (this.appInits = E(hd, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const t = [];
              for (const o of this.appInits) {
                const i = o();
                if (pi(i)) t.push(i);
                else if (_v(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  t.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(t)
                .then(() => {
                  r();
                })
                .catch((o) => {
                  this.reject(o);
                }),
                0 === t.length && r(),
                (this.initialized = !0);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        jD = (() => {
          class e {
            log(t) {
              console.log(t);
            }
            warn(t) {
              console.warn(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })();
      const vn = new b("LocaleId", {
        providedIn: "root",
        factory: () =>
          E(vn, j.Optional | j.SkipSelf) ||
          (function wR() {
            return (typeof $localize < "u" && $localize.locale) || oo;
          })(),
      });
      let BD = (() => {
        class e {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new nt(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const t = this.taskId++;
            return this.pendingTasks.add(t), t;
          }
          remove(t) {
            this.pendingTasks.delete(t),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      class IR {
        constructor(n, t) {
          (this.ngModuleFactory = n), (this.componentFactories = t);
        }
      }
      let $D = (() => {
        class e {
          compileModuleSync(t) {
            return new Xl(t);
          }
          compileModuleAsync(t) {
            return Promise.resolve(this.compileModuleSync(t));
          }
          compileModuleAndAllComponentsSync(t) {
            const r = this.compileModuleSync(t),
              i = pn(ot(t).declarations).reduce((s, a) => {
                const u = H(a);
                return u && s.push(new ui(u)), s;
              }, []);
            return new IR(r, i);
          }
          compileModuleAndAllComponentsAsync(t) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
          }
          clearCache() {}
          clearCacheFor(t) {}
          getModuleId(t) {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const zD = new b(""),
        Na = new b("");
      let Dd,
        vd = (() => {
          class e {
            constructor(t, r, o) {
              (this._ngZone = t),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Dd ||
                  ((function WR(e) {
                    Dd = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                t.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      oe.assertNotInAngularZone(),
                        queueMicrotask(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                queueMicrotask(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop();
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let t = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(t) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((t) => ({
                    source: t.source,
                    creationLocation: t.creationLocation,
                    data: t.data,
                  }))
                : [];
            }
            addCallback(t, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    t(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: t, timeoutId: i, updateCb: o });
            }
            whenStable(t, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(t, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(t) {
              this.registry.registerApplication(t, this);
            }
            unregisterApplication(t) {
              this.registry.unregisterApplication(t);
            }
            findProviders(t, r, o) {
              return [];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(oe), S(yd), S(Na));
            });
            static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        yd = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(t, r) {
              this._applications.set(t, r);
            }
            unregisterApplication(t) {
              this._applications.delete(t);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(t) {
              return this._applications.get(t) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(t, r = !0) {
              return Dd?.findTestabilityInTree(this, t, r) ?? null;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })(),
        Fn = null;
      const qD = new b("AllowMultipleToken"),
        _d = new b("PlatformDestroyListeners"),
        Cd = new b("appBootstrapListener");
      class ZD {
        constructor(n, t) {
          (this.name = n), (this.token = t);
        }
      }
      function QD(e, n, t = []) {
        const r = `Platform: ${n}`,
          o = new b(r);
        return (i = []) => {
          let s = wd();
          if (!s || s.injector.get(qD, !1)) {
            const a = [...t, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function QR(e) {
                  if (Fn && !Fn.get(qD, !1)) throw new D(400, !1);
                  (function WD() {
                    !(function CI(e) {
                      op = e;
                    })(() => {
                      throw new D(600, !1);
                    });
                  })(),
                    (Fn = e);
                  const n = e.get(XD);
                  (function YD(e) {
                    e.get(Kg, null)?.forEach((t) => t());
                  })(e);
                })(
                  (function KD(e = [], n) {
                    return ut.create({
                      name: n,
                      providers: [
                        { provide: Kc, useValue: "platform" },
                        { provide: _d, useValue: new Set([() => (Fn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function XR(e) {
            const n = wd();
            if (!n) throw new D(401, !1);
            return n;
          })();
        };
      }
      function wd() {
        return Fn?.get(XD) ?? null;
      }
      let XD = (() => {
        class e {
          constructor(t) {
            (this._injector = t),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(t, r) {
            const o = (function JR(e = "zone.js", n) {
              return "noop" === e ? new RS() : "zone.js" === e ? new oe(n) : e;
            })(
              r?.ngZone,
              (function JD(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              })
            );
            return o.run(() => {
              const i = (function lx(e, n, t) {
                  return new Kl(e, n, t);
                })(
                  t.moduleType,
                  this.injector,
                  (function o_(e) {
                    return [
                      { provide: oe, useFactory: e },
                      {
                        provide: ei,
                        multi: !0,
                        useFactory: () => {
                          const n = E(tO, { optional: !0 });
                          return () => n.initialize();
                        },
                      },
                      { provide: r_, useFactory: eO },
                      { provide: pm, useFactory: gm },
                    ];
                  })(() => o)
                ),
                s = i.injector.get(hn, null);
              return (
                o.runOutsideAngular(() => {
                  const a = o.onError.subscribe({
                    next: (u) => {
                      s.handleError(u);
                    },
                  });
                  i.onDestroy(() => {
                    xa(this._modules, i), a.unsubscribe();
                  });
                }),
                (function e_(e, n, t) {
                  try {
                    const r = t();
                    return pi(r)
                      ? r.catch((o) => {
                          throw (
                            (n.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (n.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(s, o, () => {
                  const a = i.injector.get(pd);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function vy(e) {
                          dt(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (my = e.toLowerCase().replace(/_/g, "-"));
                        })(i.injector.get(vn, oo) || oo),
                        this._moduleDoBootstrap(i),
                        i
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(t, r = []) {
            const o = t_({}, r);
            return (function ZR(e, n, t) {
              const r = new Xl(t);
              return Promise.resolve(r);
            })(0, 0, t).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(t) {
            const r = t.injector.get(ao);
            if (t._bootstrapComponents.length > 0)
              t._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!t.instance.ngDoBootstrap) throw new D(-403, !1);
              t.instance.ngDoBootstrap(r);
            }
            this._modules.push(t);
          }
          onDestroy(t) {
            this._destroyListeners.push(t);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new D(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const t = this._injector.get(_d, null);
            t && (t.forEach((r) => r()), t.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(ut));
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function t_(e, n) {
        return Array.isArray(n) ? n.reduce(t_, e) : { ...e, ...n };
      }
      let ao = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = E(r_)),
              (this.zoneIsStable = E(pm)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = E(BD).hasPendingTasks.pipe(
                $t((t) => (t ? O(!1) : this.zoneIsStable)),
                (function Rb(e, n = bn) {
                  return (
                    (e = e ?? Ob),
                    Ce((t, r) => {
                      let o,
                        i = !0;
                      t.subscribe(
                        De(r, (s) => {
                          const a = n(s);
                          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
                        })
                      );
                    })
                  );
                })(),
                wh()
              )),
              (this._injector = E(mt));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(t, r) {
            const o = t instanceof nm;
            if (!this._injector.get(pd).done)
              throw (
                (!o &&
                  (function pr(e) {
                    const n = H(e) || Se(e) || Le(e);
                    return null !== n && n.standalone;
                  })(t),
                new D(405, !1))
              );
            let s;
            (s = o ? t : this._injector.get(ia).resolveComponentFactory(t)),
              this.componentTypes.push(s.componentType);
            const a = (function YR(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(nr),
              c = s.create(ut.NULL, [], r || s.selector, a),
              l = c.location.nativeElement,
              d = c.injector.get(zD, null);
            return (
              d?.registerApplication(l),
              c.onDestroy(() => {
                this.detachView(c.hostView),
                  xa(this.components, c),
                  d?.unregisterApplication(l);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new D(101, !1);
            try {
              this._runningTick = !0;
              for (let t of this._views) t.detectChanges();
            } catch (t) {
              this.internalErrorHandler(t);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(t) {
            const r = t;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(t) {
            const r = t;
            xa(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(t) {
            this.attachView(t.hostView), this.tick(), this.components.push(t);
            const r = this._injector.get(Cd, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(t));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((t) => t()),
                  this._views.slice().forEach((t) => t.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(t) {
            return (
              this._destroyListeners.push(t),
              () => xa(this._destroyListeners, t)
            );
          }
          destroy() {
            if (this._destroyed) throw new D(406, !1);
            const t = this._injector;
            t.destroy && !t.destroyed && t.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function xa(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      const r_ = new b("", {
        providedIn: "root",
        factory: () => E(hn).handleError.bind(void 0),
      });
      function eO() {
        const e = E(oe),
          n = E(hn);
        return (t) => e.runOutsideAngular(() => n.handleError(t));
      }
      let tO = (() => {
        class e {
          constructor() {
            (this.zone = E(oe)), (this.applicationRef = E(ao));
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
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      let Ra = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = rO);
        }
        return e;
      })();
      function rO(e) {
        return (function oO(e, n, t) {
          if (Wn(e) && !t) {
            const r = it(e.index, n);
            return new ai(r, r);
          }
          return 47 & e.type ? new ai(n[me], n) : null;
        })(Ne(), v(), 16 == (16 & e));
      }
      class u_ {
        constructor() {}
        supports(n) {
          return ha(n);
        }
        create(n) {
          return new lO(n);
        }
      }
      const cO = (e, n) => n;
      class lO {
        constructor(n) {
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
            (this._trackByFn = n || cO);
        }
        forEachItem(n) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) n(t);
        }
        forEachOperation(n) {
          let t = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; t || r; ) {
            const s = !r || (t && t.currentIndex < l_(r, o, i)) ? t : r,
              a = l_(s, o, i),
              u = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((t = t._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const c = a - o,
                l = u - o;
              if (c != l) {
                for (let f = 0; f < c; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  l <= p && p < c && (i[f] = h + 1);
                }
                i[s.previousIndex] = l - c;
              }
            }
            a !== u && n(s, a, u);
          }
        }
        forEachPreviousItem(n) {
          let t;
          for (t = this._previousItHead; null !== t; t = t._nextPrevious) n(t);
        }
        forEachAddedItem(n) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
        }
        forEachMovedItem(n) {
          let t;
          for (t = this._movesHead; null !== t; t = t._nextMoved) n(t);
        }
        forEachRemovedItem(n) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
        }
        forEachIdentityChange(n) {
          let t;
          for (
            t = this._identityChangesHead;
            null !== t;
            t = t._nextIdentityChange
          )
            n(t);
        }
        diff(n) {
          if ((null == n && (n = []), !ha(n))) throw new D(900, !1);
          return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
          this._reset();
          let o,
            i,
            s,
            t = this._itHead,
            r = !1;
          if (Array.isArray(n)) {
            this.length = n.length;
            for (let a = 0; a < this.length; a++)
              (i = n[a]),
                (s = this._trackByFn(a, i)),
                null !== t && Object.is(t.trackById, s)
                  ? (r && (t = this._verifyReinsertion(t, i, s, a)),
                    Object.is(t.item, i) || this._addIdentityChange(t, i))
                  : ((t = this._mismatch(t, i, s, a)), (r = !0)),
                (t = t._next);
          } else
            (o = 0),
              (function HA(e, n) {
                if (Array.isArray(e))
                  for (let t = 0; t < e.length; t++) n(e[t]);
                else {
                  const t = e[Symbol.iterator]();
                  let r;
                  for (; !(r = t.next()).done; ) n(r.value);
                }
              })(n, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== t && Object.is(t.trackById, s)
                    ? (r && (t = this._verifyReinsertion(t, a, s, o)),
                      Object.is(t.item, a) || this._addIdentityChange(t, a))
                    : ((t = this._mismatch(t, a, s, o)), (r = !0)),
                  (t = t._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(t), (this.collection = n), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let n;
            for (
              n = this._previousItHead = this._itHead;
              null !== n;
              n = n._next
            )
              n._nextPrevious = n._next;
            for (n = this._additionsHead; null !== n; n = n._nextAdded)
              n.previousIndex = n.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                n = this._movesHead;
              null !== n;
              n = n._nextMoved
            )
              n.previousIndex = n.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(n, t, r, o) {
          let i;
          return (
            null === n ? (i = this._itTail) : ((i = n._prev), this._remove(n)),
            null !==
            (n =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                this._reinsertAfter(n, i, o))
              : null !==
                (n =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                this._moveAfter(n, i, o))
              : (n = this._addAfter(new dO(t, r), i, o)),
            n
          );
        }
        _verifyReinsertion(n, t, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (n = this._reinsertAfter(i, n._prev, o))
              : n.currentIndex != o &&
                ((n.currentIndex = o), this._addToMoves(n, o)),
            n
          );
        }
        _truncate(n) {
          for (; null !== n; ) {
            const t = n._next;
            this._addToRemovals(this._unlink(n)), (n = t);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(n, t, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
          const o = n._prevRemoved,
            i = n._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(n, t, r),
            this._addToMoves(n, r),
            n
          );
        }
        _moveAfter(n, t, r) {
          return (
            this._unlink(n),
            this._insertAfter(n, t, r),
            this._addToMoves(n, r),
            n
          );
        }
        _addAfter(n, t, r) {
          return (
            this._insertAfter(n, t, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = n)
                : (this._additionsTail._nextAdded = n)),
            n
          );
        }
        _insertAfter(n, t, r) {
          const o = null === t ? this._itHead : t._next;
          return (
            (n._next = o),
            (n._prev = t),
            null === o ? (this._itTail = n) : (o._prev = n),
            null === t ? (this._itHead = n) : (t._next = n),
            null === this._linkedRecords && (this._linkedRecords = new c_()),
            this._linkedRecords.put(n),
            (n.currentIndex = r),
            n
          );
        }
        _remove(n) {
          return this._addToRemovals(this._unlink(n));
        }
        _unlink(n) {
          null !== this._linkedRecords && this._linkedRecords.remove(n);
          const t = n._prev,
            r = n._next;
          return (
            null === t ? (this._itHead = r) : (t._next = r),
            null === r ? (this._itTail = t) : (r._prev = t),
            n
          );
        }
        _addToMoves(n, t) {
          return (
            n.previousIndex === t ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = n)
                  : (this._movesTail._nextMoved = n)),
            n
          );
        }
        _addToRemovals(n) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new c_()),
            this._unlinkedRecords.put(n),
            (n.currentIndex = null),
            (n._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = n),
                (n._prevRemoved = null))
              : ((n._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = n)),
            n
          );
        }
        _addIdentityChange(n, t) {
          return (
            (n.item = t),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = n)
                : (this._identityChangesTail._nextIdentityChange = n)),
            n
          );
        }
      }
      class dO {
        constructor(n, t) {
          (this.item = n),
            (this.trackById = t),
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
      }
      class fO {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(n) {
          null === this._head
            ? ((this._head = this._tail = n),
              (n._nextDup = null),
              (n._prevDup = null))
            : ((this._tail._nextDup = n),
              (n._prevDup = this._tail),
              (n._nextDup = null),
              (this._tail = n));
        }
        get(n, t) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === t || t <= r.currentIndex) &&
              Object.is(r.trackById, n)
            )
              return r;
          return null;
        }
        remove(n) {
          const t = n._prevDup,
            r = n._nextDup;
          return (
            null === t ? (this._head = r) : (t._nextDup = r),
            null === r ? (this._tail = t) : (r._prevDup = t),
            null === this._head
          );
        }
      }
      class c_ {
        constructor() {
          this.map = new Map();
        }
        put(n) {
          const t = n.trackById;
          let r = this.map.get(t);
          r || ((r = new fO()), this.map.set(t, r)), r.add(n);
        }
        get(n, t) {
          const o = this.map.get(n);
          return o ? o.get(n, t) : null;
        }
        remove(n) {
          const t = n.trackById;
          return this.map.get(t).remove(n) && this.map.delete(t), n;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function l_(e, n, t) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return t && r < t.length && (o = t[r]), r + n + o;
      }
      class d_ {
        constructor() {}
        supports(n) {
          return n instanceof Map || Nl(n);
        }
        create() {
          return new hO();
        }
      }
      class hO {
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
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(n) {
          let t;
          for (t = this._mapHead; null !== t; t = t._next) n(t);
        }
        forEachPreviousItem(n) {
          let t;
          for (t = this._previousMapHead; null !== t; t = t._nextPrevious) n(t);
        }
        forEachChangedItem(n) {
          let t;
          for (t = this._changesHead; null !== t; t = t._nextChanged) n(t);
        }
        forEachAddedItem(n) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
        }
        forEachRemovedItem(n) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
        }
        diff(n) {
          if (n) {
            if (!(n instanceof Map || Nl(n))) throw new D(900, !1);
          } else n = new Map();
          return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
          this._reset();
          let t = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(n, (r, o) => {
              if (t && t.key === o)
                this._maybeAddToChanges(t, r),
                  (this._appendAfter = t),
                  (t = t._next);
              else {
                const i = this._getOrCreateRecordForKey(o, r);
                t = this._insertBeforeOrAppend(t, i);
              }
            }),
            t)
          ) {
            t._prev && (t._prev._next = null), (this._removalsHead = t);
            for (let r = t; null !== r; r = r._nextRemoved)
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
        _insertBeforeOrAppend(n, t) {
          if (n) {
            const r = n._prev;
            return (
              (t._next = n),
              (t._prev = r),
              (n._prev = t),
              r && (r._next = t),
              n === this._mapHead && (this._mapHead = t),
              (this._appendAfter = n),
              n
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = t), (t._prev = this._appendAfter))
              : (this._mapHead = t),
            (this._appendAfter = t),
            null
          );
        }
        _getOrCreateRecordForKey(n, t) {
          if (this._records.has(n)) {
            const o = this._records.get(n);
            this._maybeAddToChanges(o, t);
            const i = o._prev,
              s = o._next;
            return (
              i && (i._next = s),
              s && (s._prev = i),
              (o._next = null),
              (o._prev = null),
              o
            );
          }
          const r = new pO(n);
          return (
            this._records.set(n, r),
            (r.currentValue = t),
            this._addToAdditions(r),
            r
          );
        }
        _reset() {
          if (this.isDirty) {
            let n;
            for (
              this._previousMapHead = this._mapHead, n = this._previousMapHead;
              null !== n;
              n = n._next
            )
              n._nextPrevious = n._next;
            for (n = this._changesHead; null !== n; n = n._nextChanged)
              n.previousValue = n.currentValue;
            for (n = this._additionsHead; null != n; n = n._nextAdded)
              n.previousValue = n.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(n, t) {
          Object.is(t, n.currentValue) ||
            ((n.previousValue = n.currentValue),
            (n.currentValue = t),
            this._addToChanges(n));
        }
        _addToAdditions(n) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = n)
            : ((this._additionsTail._nextAdded = n), (this._additionsTail = n));
        }
        _addToChanges(n) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = n)
            : ((this._changesTail._nextChanged = n), (this._changesTail = n));
        }
        _forEach(n, t) {
          n instanceof Map
            ? n.forEach(t)
            : Object.keys(n).forEach((r) => t(n[r], r));
        }
      }
      class pO {
        constructor(n) {
          (this.key = n),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function f_() {
        return new Fa([new u_()]);
      }
      let Fa = (() => {
        class e {
          static #e = (this.ɵprov = M({
            token: e,
            providedIn: "root",
            factory: f_,
          }));
          constructor(t) {
            this.factories = t;
          }
          static create(t, r) {
            if (null != r) {
              const o = r.factories.slice();
              t = t.concat(o);
            }
            return new e(t);
          }
          static extend(t) {
            return {
              provide: e,
              useFactory: (r) => e.create(t, r || f_()),
              deps: [[e, new Ps(), new Os()]],
            };
          }
          find(t) {
            const r = this.factories.find((o) => o.supports(t));
            if (null != r) return r;
            throw new D(901, !1);
          }
        }
        return e;
      })();
      function h_() {
        return new Si([new d_()]);
      }
      let Si = (() => {
        class e {
          static #e = (this.ɵprov = M({
            token: e,
            providedIn: "root",
            factory: h_,
          }));
          constructor(t) {
            this.factories = t;
          }
          static create(t, r) {
            if (r) {
              const o = r.factories.slice();
              t = t.concat(o);
            }
            return new e(t);
          }
          static extend(t) {
            return {
              provide: e,
              useFactory: (r) => e.create(t, r || h_()),
              deps: [[e, new Ps(), new Os()]],
            };
          }
          find(t) {
            const r = this.factories.find((o) => o.supports(t));
            if (r) return r;
            throw new D(901, !1);
          }
        }
        return e;
      })();
      const vO = QD(null, "core", []);
      let yO = (() => {
          class e {
            constructor(t) {}
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(ao));
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({}));
          }
          return e;
        })(),
        Ad = null;
      function kn() {
        return Ad;
      }
      class RO {}
      const _t = new b("DocumentToken");
      let Td = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: function () {
              return E(PO);
            },
            providedIn: "platform",
          }));
        }
        return e;
      })();
      const OO = new b("Location Initialized");
      let PO = (() => {
        class e extends Td {
          constructor() {
            super(),
              (this._doc = E(_t)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return kn().getBaseHref(this._doc);
          }
          onPopState(t) {
            const r = kn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", t, !1),
              () => r.removeEventListener("popstate", t)
            );
          }
          onHashChange(t) {
            const r = kn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", t, !1),
              () => r.removeEventListener("hashchange", t)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(t) {
            this._location.pathname = t;
          }
          pushState(t, r, o) {
            this._history.pushState(t, r, o);
          }
          replaceState(t, r, o) {
            this._history.replaceState(t, r, o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(t = 0) {
            this._history.go(t);
          }
          getState() {
            return this._history.state;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: function () {
              return new e();
            },
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function Nd(e, n) {
        if (0 == e.length) return n;
        if (0 == n.length) return e;
        let t = 0;
        return (
          e.endsWith("/") && t++,
          n.startsWith("/") && t++,
          2 == t ? e + n.substring(1) : 1 == t ? e + n : e + "/" + n
        );
      }
      function w_(e) {
        const n = e.match(/#|\?|$/),
          t = (n && n.index) || e.length;
        return e.slice(0, t - ("/" === e[t - 1] ? 1 : 0)) + e.slice(t);
      }
      function yn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let or = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: function () {
              return E(b_);
            },
            providedIn: "root",
          }));
        }
        return e;
      })();
      const E_ = new b("appBaseHref");
      let b_ = (() => {
          class e extends or {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  E(_t).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(t) {
              return Nd(this._baseHref, t);
            }
            path(t = !1) {
              const r =
                  this._platformLocation.pathname +
                  yn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && t ? `${r}${o}` : r;
            }
            pushState(t, r, o, i) {
              const s = this.prepareExternalUrl(o + yn(i));
              this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, o, i) {
              const s = this.prepareExternalUrl(o + yn(i));
              this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(Td), S(E_, 8));
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        FO = (() => {
          class e extends or {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(t = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(t) {
              const r = Nd(this._baseHref, t);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(t, r, o, i) {
              let s = this.prepareExternalUrl(o + yn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, o, i) {
              let s = this.prepareExternalUrl(o + yn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(Td), S(E_, 8));
            });
            static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        xd = (() => {
          class e {
            constructor(t) {
              (this._subject = new he()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = t);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function VO(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, t] = e.split(/\/\/[^\/]+/);
                  return t;
                }
                return e;
              })(w_(I_(r)))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(t = !1) {
              return this.normalize(this._locationStrategy.path(t));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(t, r = "") {
              return this.path() == this.normalize(t + yn(r));
            }
            normalize(t) {
              return e.stripTrailingSlash(
                (function LO(e, n) {
                  if (!e || !n.startsWith(e)) return n;
                  const t = n.substring(e.length);
                  return "" === t || ["/", ";", "?", "#"].includes(t[0])
                    ? t
                    : n;
                })(this._basePath, I_(t))
              );
            }
            prepareExternalUrl(t) {
              return (
                t && "/" !== t[0] && (t = "/" + t),
                this._locationStrategy.prepareExternalUrl(t)
              );
            }
            go(t, r = "", o = null) {
              this._locationStrategy.pushState(o, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + yn(r)),
                  o
                );
            }
            replaceState(t, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + yn(r)),
                  o
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(t = 0) {
              this._locationStrategy.historyGo?.(t);
            }
            onUrlChange(t) {
              return (
                this._urlChangeListeners.push(t),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(t);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(t = "", r) {
              this._urlChangeListeners.forEach((o) => o(t, r));
            }
            subscribe(t, r, o) {
              return this._subject.subscribe({
                next: t,
                error: r,
                complete: o,
              });
            }
            static #e = (this.normalizeQueryParams = yn);
            static #t = (this.joinWithSlash = Nd);
            static #n = (this.stripTrailingSlash = w_);
            static #r = (this.ɵfac = function (r) {
              return new (r || e)(S(or));
            });
            static #o = (this.ɵprov = M({
              token: e,
              factory: function () {
                return (function kO() {
                  return new xd(S(or));
                })();
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      function I_(e) {
        return e.replace(/\/index.html$/, "");
      }
      var Ge = (function (e) {
          return (
            (e[(e.Format = 0)] = "Format"),
            (e[(e.Standalone = 1)] = "Standalone"),
            e
          );
        })(Ge || {}),
        ee = (function (e) {
          return (
            (e[(e.Narrow = 0)] = "Narrow"),
            (e[(e.Abbreviated = 1)] = "Abbreviated"),
            (e[(e.Wide = 2)] = "Wide"),
            (e[(e.Short = 3)] = "Short"),
            e
          );
        })(ee || {}),
        lt = (function (e) {
          return (
            (e[(e.Short = 0)] = "Short"),
            (e[(e.Medium = 1)] = "Medium"),
            (e[(e.Long = 2)] = "Long"),
            (e[(e.Full = 3)] = "Full"),
            e
          );
        })(lt || {}),
        ve = (function (e) {
          return (
            (e[(e.Decimal = 0)] = "Decimal"),
            (e[(e.Group = 1)] = "Group"),
            (e[(e.List = 2)] = "List"),
            (e[(e.PercentSign = 3)] = "PercentSign"),
            (e[(e.PlusSign = 4)] = "PlusSign"),
            (e[(e.MinusSign = 5)] = "MinusSign"),
            (e[(e.Exponential = 6)] = "Exponential"),
            (e[(e.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
            (e[(e.PerMille = 8)] = "PerMille"),
            (e[(e.Infinity = 9)] = "Infinity"),
            (e[(e.NaN = 10)] = "NaN"),
            (e[(e.TimeSeparator = 11)] = "TimeSeparator"),
            (e[(e.CurrencyDecimal = 12)] = "CurrencyDecimal"),
            (e[(e.CurrencyGroup = 13)] = "CurrencyGroup"),
            e
          );
        })(ve || {});
      function Va(e, n) {
        return wt(He(e)[se.DateFormat], n);
      }
      function ja(e, n) {
        return wt(He(e)[se.TimeFormat], n);
      }
      function Ba(e, n) {
        return wt(He(e)[se.DateTimeFormat], n);
      }
      function Ct(e, n) {
        const t = He(e),
          r = t[se.NumberSymbols][n];
        if (typeof r > "u") {
          if (n === ve.CurrencyDecimal) return t[se.NumberSymbols][ve.Decimal];
          if (n === ve.CurrencyGroup) return t[se.NumberSymbols][ve.Group];
        }
        return r;
      }
      function S_(e) {
        if (!e[se.ExtraData])
          throw new Error(
            `Missing extra locale data for the locale "${
              e[se.LocaleId]
            }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
          );
      }
      function wt(e, n) {
        for (let t = n; t > -1; t--) if (typeof e[t] < "u") return e[t];
        throw new Error("Locale data API: locale data undefined");
      }
      function Od(e) {
        const [n, t] = e.split(":");
        return { hours: +n, minutes: +t };
      }
      const XO =
          /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
        Ai = {},
        JO =
          /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
      var Dn = (function (e) {
          return (
            (e[(e.Short = 0)] = "Short"),
            (e[(e.ShortGMT = 1)] = "ShortGMT"),
            (e[(e.Long = 2)] = "Long"),
            (e[(e.Extended = 3)] = "Extended"),
            e
          );
        })(Dn || {}),
        z = (function (e) {
          return (
            (e[(e.FullYear = 0)] = "FullYear"),
            (e[(e.Month = 1)] = "Month"),
            (e[(e.Date = 2)] = "Date"),
            (e[(e.Hours = 3)] = "Hours"),
            (e[(e.Minutes = 4)] = "Minutes"),
            (e[(e.Seconds = 5)] = "Seconds"),
            (e[(e.FractionalSeconds = 6)] = "FractionalSeconds"),
            (e[(e.Day = 7)] = "Day"),
            e
          );
        })(z || {}),
        q = (function (e) {
          return (
            (e[(e.DayPeriods = 0)] = "DayPeriods"),
            (e[(e.Days = 1)] = "Days"),
            (e[(e.Months = 2)] = "Months"),
            (e[(e.Eras = 3)] = "Eras"),
            e
          );
        })(q || {});
      function e1(e, n, t, r) {
        let o = (function c1(e) {
          if (N_(e)) return e;
          if ("number" == typeof e && !isNaN(e)) return new Date(e);
          if ("string" == typeof e) {
            if (((e = e.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(e))) {
              const [o, i = 1, s = 1] = e.split("-").map((a) => +a);
              return $a(o, i - 1, s);
            }
            const t = parseFloat(e);
            if (!isNaN(e - t)) return new Date(t);
            let r;
            if ((r = e.match(XO)))
              return (function l1(e) {
                const n = new Date(0);
                let t = 0,
                  r = 0;
                const o = e[8] ? n.setUTCFullYear : n.setFullYear,
                  i = e[8] ? n.setUTCHours : n.setHours;
                e[9] &&
                  ((t = Number(e[9] + e[10])), (r = Number(e[9] + e[11]))),
                  o.call(n, Number(e[1]), Number(e[2]) - 1, Number(e[3]));
                const s = Number(e[4] || 0) - t,
                  a = Number(e[5] || 0) - r,
                  u = Number(e[6] || 0),
                  c = Math.floor(1e3 * parseFloat("0." + (e[7] || 0)));
                return i.call(n, s, a, u, c), n;
              })(r);
          }
          const n = new Date(e);
          if (!N_(n)) throw new Error(`Unable to convert "${e}" into a date`);
          return n;
        })(e);
        n = _n(t, n) || n;
        let a,
          s = [];
        for (; n; ) {
          if (((a = JO.exec(n)), !a)) {
            s.push(n);
            break;
          }
          {
            s = s.concat(a.slice(1));
            const l = s.pop();
            if (!l) break;
            n = l;
          }
        }
        let u = o.getTimezoneOffset();
        r &&
          ((u = T_(r, u)),
          (o = (function u1(e, n, t) {
            const r = t ? -1 : 1,
              o = e.getTimezoneOffset();
            return (function a1(e, n) {
              return (
                (e = new Date(e.getTime())).setMinutes(e.getMinutes() + n), e
              );
            })(e, r * (T_(n, o) - o));
          })(o, r, !0)));
        let c = "";
        return (
          s.forEach((l) => {
            const d = (function s1(e) {
              if (Fd[e]) return Fd[e];
              let n;
              switch (e) {
                case "G":
                case "GG":
                case "GGG":
                  n = ae(q.Eras, ee.Abbreviated);
                  break;
                case "GGGG":
                  n = ae(q.Eras, ee.Wide);
                  break;
                case "GGGGG":
                  n = ae(q.Eras, ee.Narrow);
                  break;
                case "y":
                  n = _e(z.FullYear, 1, 0, !1, !0);
                  break;
                case "yy":
                  n = _e(z.FullYear, 2, 0, !0, !0);
                  break;
                case "yyy":
                  n = _e(z.FullYear, 3, 0, !1, !0);
                  break;
                case "yyyy":
                  n = _e(z.FullYear, 4, 0, !1, !0);
                  break;
                case "Y":
                  n = za(1);
                  break;
                case "YY":
                  n = za(2, !0);
                  break;
                case "YYY":
                  n = za(3);
                  break;
                case "YYYY":
                  n = za(4);
                  break;
                case "M":
                case "L":
                  n = _e(z.Month, 1, 1);
                  break;
                case "MM":
                case "LL":
                  n = _e(z.Month, 2, 1);
                  break;
                case "MMM":
                  n = ae(q.Months, ee.Abbreviated);
                  break;
                case "MMMM":
                  n = ae(q.Months, ee.Wide);
                  break;
                case "MMMMM":
                  n = ae(q.Months, ee.Narrow);
                  break;
                case "LLL":
                  n = ae(q.Months, ee.Abbreviated, Ge.Standalone);
                  break;
                case "LLLL":
                  n = ae(q.Months, ee.Wide, Ge.Standalone);
                  break;
                case "LLLLL":
                  n = ae(q.Months, ee.Narrow, Ge.Standalone);
                  break;
                case "w":
                  n = Pd(1);
                  break;
                case "ww":
                  n = Pd(2);
                  break;
                case "W":
                  n = Pd(1, !0);
                  break;
                case "d":
                  n = _e(z.Date, 1);
                  break;
                case "dd":
                  n = _e(z.Date, 2);
                  break;
                case "c":
                case "cc":
                  n = _e(z.Day, 1);
                  break;
                case "ccc":
                  n = ae(q.Days, ee.Abbreviated, Ge.Standalone);
                  break;
                case "cccc":
                  n = ae(q.Days, ee.Wide, Ge.Standalone);
                  break;
                case "ccccc":
                  n = ae(q.Days, ee.Narrow, Ge.Standalone);
                  break;
                case "cccccc":
                  n = ae(q.Days, ee.Short, Ge.Standalone);
                  break;
                case "E":
                case "EE":
                case "EEE":
                  n = ae(q.Days, ee.Abbreviated);
                  break;
                case "EEEE":
                  n = ae(q.Days, ee.Wide);
                  break;
                case "EEEEE":
                  n = ae(q.Days, ee.Narrow);
                  break;
                case "EEEEEE":
                  n = ae(q.Days, ee.Short);
                  break;
                case "a":
                case "aa":
                case "aaa":
                  n = ae(q.DayPeriods, ee.Abbreviated);
                  break;
                case "aaaa":
                  n = ae(q.DayPeriods, ee.Wide);
                  break;
                case "aaaaa":
                  n = ae(q.DayPeriods, ee.Narrow);
                  break;
                case "b":
                case "bb":
                case "bbb":
                  n = ae(q.DayPeriods, ee.Abbreviated, Ge.Standalone, !0);
                  break;
                case "bbbb":
                  n = ae(q.DayPeriods, ee.Wide, Ge.Standalone, !0);
                  break;
                case "bbbbb":
                  n = ae(q.DayPeriods, ee.Narrow, Ge.Standalone, !0);
                  break;
                case "B":
                case "BB":
                case "BBB":
                  n = ae(q.DayPeriods, ee.Abbreviated, Ge.Format, !0);
                  break;
                case "BBBB":
                  n = ae(q.DayPeriods, ee.Wide, Ge.Format, !0);
                  break;
                case "BBBBB":
                  n = ae(q.DayPeriods, ee.Narrow, Ge.Format, !0);
                  break;
                case "h":
                  n = _e(z.Hours, 1, -12);
                  break;
                case "hh":
                  n = _e(z.Hours, 2, -12);
                  break;
                case "H":
                  n = _e(z.Hours, 1);
                  break;
                case "HH":
                  n = _e(z.Hours, 2);
                  break;
                case "m":
                  n = _e(z.Minutes, 1);
                  break;
                case "mm":
                  n = _e(z.Minutes, 2);
                  break;
                case "s":
                  n = _e(z.Seconds, 1);
                  break;
                case "ss":
                  n = _e(z.Seconds, 2);
                  break;
                case "S":
                  n = _e(z.FractionalSeconds, 1);
                  break;
                case "SS":
                  n = _e(z.FractionalSeconds, 2);
                  break;
                case "SSS":
                  n = _e(z.FractionalSeconds, 3);
                  break;
                case "Z":
                case "ZZ":
                case "ZZZ":
                  n = Ua(Dn.Short);
                  break;
                case "ZZZZZ":
                  n = Ua(Dn.Extended);
                  break;
                case "O":
                case "OO":
                case "OOO":
                case "z":
                case "zz":
                case "zzz":
                  n = Ua(Dn.ShortGMT);
                  break;
                case "OOOO":
                case "ZZZZ":
                case "zzzz":
                  n = Ua(Dn.Long);
                  break;
                default:
                  return null;
              }
              return (Fd[e] = n), n;
            })(l);
            c += d
              ? d(o, t, u)
              : "''" === l
              ? "'"
              : l.replace(/(^'|'$)/g, "").replace(/''/g, "'");
          }),
          c
        );
      }
      function $a(e, n, t) {
        const r = new Date(0);
        return r.setFullYear(e, n, t), r.setHours(0, 0, 0), r;
      }
      function _n(e, n) {
        const t = (function BO(e) {
          return He(e)[se.LocaleId];
        })(e);
        if (((Ai[t] = Ai[t] || {}), Ai[t][n])) return Ai[t][n];
        let r = "";
        switch (n) {
          case "shortDate":
            r = Va(e, lt.Short);
            break;
          case "mediumDate":
            r = Va(e, lt.Medium);
            break;
          case "longDate":
            r = Va(e, lt.Long);
            break;
          case "fullDate":
            r = Va(e, lt.Full);
            break;
          case "shortTime":
            r = ja(e, lt.Short);
            break;
          case "mediumTime":
            r = ja(e, lt.Medium);
            break;
          case "longTime":
            r = ja(e, lt.Long);
            break;
          case "fullTime":
            r = ja(e, lt.Full);
            break;
          case "short":
            const o = _n(e, "shortTime"),
              i = _n(e, "shortDate");
            r = Ha(Ba(e, lt.Short), [o, i]);
            break;
          case "medium":
            const s = _n(e, "mediumTime"),
              a = _n(e, "mediumDate");
            r = Ha(Ba(e, lt.Medium), [s, a]);
            break;
          case "long":
            const u = _n(e, "longTime"),
              c = _n(e, "longDate");
            r = Ha(Ba(e, lt.Long), [u, c]);
            break;
          case "full":
            const l = _n(e, "fullTime"),
              d = _n(e, "fullDate");
            r = Ha(Ba(e, lt.Full), [l, d]);
        }
        return r && (Ai[t][n] = r), r;
      }
      function Ha(e, n) {
        return (
          n &&
            (e = e.replace(/\{([^}]+)}/g, function (t, r) {
              return null != n && r in n ? n[r] : t;
            })),
          e
        );
      }
      function Lt(e, n, t = "-", r, o) {
        let i = "";
        (e < 0 || (o && e <= 0)) && (o ? (e = 1 - e) : ((e = -e), (i = t)));
        let s = String(e);
        for (; s.length < n; ) s = "0" + s;
        return r && (s = s.slice(s.length - n)), i + s;
      }
      function _e(e, n, t = 0, r = !1, o = !1) {
        return function (i, s) {
          let a = (function n1(e, n) {
            switch (e) {
              case z.FullYear:
                return n.getFullYear();
              case z.Month:
                return n.getMonth();
              case z.Date:
                return n.getDate();
              case z.Hours:
                return n.getHours();
              case z.Minutes:
                return n.getMinutes();
              case z.Seconds:
                return n.getSeconds();
              case z.FractionalSeconds:
                return n.getMilliseconds();
              case z.Day:
                return n.getDay();
              default:
                throw new Error(`Unknown DateType value "${e}".`);
            }
          })(e, i);
          if (((t > 0 || a > -t) && (a += t), e === z.Hours))
            0 === a && -12 === t && (a = 12);
          else if (e === z.FractionalSeconds)
            return (function t1(e, n) {
              return Lt(e, 3).substring(0, n);
            })(a, n);
          const u = Ct(s, ve.MinusSign);
          return Lt(a, n, u, r, o);
        };
      }
      function ae(e, n, t = Ge.Format, r = !1) {
        return function (o, i) {
          return (function r1(e, n, t, r, o, i) {
            switch (t) {
              case q.Months:
                return (function UO(e, n, t) {
                  const r = He(e),
                    i = wt([r[se.MonthsFormat], r[se.MonthsStandalone]], n);
                  return wt(i, t);
                })(n, o, r)[e.getMonth()];
              case q.Days:
                return (function HO(e, n, t) {
                  const r = He(e),
                    i = wt([r[se.DaysFormat], r[se.DaysStandalone]], n);
                  return wt(i, t);
                })(n, o, r)[e.getDay()];
              case q.DayPeriods:
                const s = e.getHours(),
                  a = e.getMinutes();
                if (i) {
                  const c = (function WO(e) {
                      const n = He(e);
                      return (
                        S_(n),
                        (n[se.ExtraData][2] || []).map((r) =>
                          "string" == typeof r ? Od(r) : [Od(r[0]), Od(r[1])]
                        )
                      );
                    })(n),
                    l = (function ZO(e, n, t) {
                      const r = He(e);
                      S_(r);
                      const i =
                        wt([r[se.ExtraData][0], r[se.ExtraData][1]], n) || [];
                      return wt(i, t) || [];
                    })(n, o, r),
                    d = c.findIndex((f) => {
                      if (Array.isArray(f)) {
                        const [h, p] = f,
                          g = s >= h.hours && a >= h.minutes,
                          y = s < p.hours || (s === p.hours && a < p.minutes);
                        if (h.hours < p.hours) {
                          if (g && y) return !0;
                        } else if (g || y) return !0;
                      } else if (f.hours === s && f.minutes === a) return !0;
                      return !1;
                    });
                  if (-1 !== d) return l[d];
                }
                return (function $O(e, n, t) {
                  const r = He(e),
                    i = wt(
                      [r[se.DayPeriodsFormat], r[se.DayPeriodsStandalone]],
                      n
                    );
                  return wt(i, t);
                })(n, o, r)[s < 12 ? 0 : 1];
              case q.Eras:
                return (function GO(e, n) {
                  return wt(He(e)[se.Eras], n);
                })(n, r)[e.getFullYear() <= 0 ? 0 : 1];
              default:
                throw new Error(`unexpected translation type ${t}`);
            }
          })(o, i, e, n, t, r);
        };
      }
      function Ua(e) {
        return function (n, t, r) {
          const o = -1 * r,
            i = Ct(t, ve.MinusSign),
            s = o > 0 ? Math.floor(o / 60) : Math.ceil(o / 60);
          switch (e) {
            case Dn.Short:
              return (
                (o >= 0 ? "+" : "") + Lt(s, 2, i) + Lt(Math.abs(o % 60), 2, i)
              );
            case Dn.ShortGMT:
              return "GMT" + (o >= 0 ? "+" : "") + Lt(s, 1, i);
            case Dn.Long:
              return (
                "GMT" +
                (o >= 0 ? "+" : "") +
                Lt(s, 2, i) +
                ":" +
                Lt(Math.abs(o % 60), 2, i)
              );
            case Dn.Extended:
              return 0 === r
                ? "Z"
                : (o >= 0 ? "+" : "") +
                    Lt(s, 2, i) +
                    ":" +
                    Lt(Math.abs(o % 60), 2, i);
            default:
              throw new Error(`Unknown zone width "${e}"`);
          }
        };
      }
      const o1 = 0,
        Ga = 4;
      function A_(e) {
        return $a(
          e.getFullYear(),
          e.getMonth(),
          e.getDate() + (Ga - e.getDay())
        );
      }
      function Pd(e, n = !1) {
        return function (t, r) {
          let o;
          if (n) {
            const i = new Date(t.getFullYear(), t.getMonth(), 1).getDay() - 1,
              s = t.getDate();
            o = 1 + Math.floor((s + i) / 7);
          } else {
            const i = A_(t),
              s = (function i1(e) {
                const n = $a(e, o1, 1).getDay();
                return $a(e, 0, 1 + (n <= Ga ? Ga : Ga + 7) - n);
              })(i.getFullYear()),
              a = i.getTime() - s.getTime();
            o = 1 + Math.round(a / 6048e5);
          }
          return Lt(o, e, Ct(r, ve.MinusSign));
        };
      }
      function za(e, n = !1) {
        return function (t, r) {
          return Lt(A_(t).getFullYear(), e, Ct(r, ve.MinusSign), n);
        };
      }
      const Fd = {};
      function T_(e, n) {
        e = e.replace(/:/g, "");
        const t = Date.parse("Jan 01, 1970 00:00:00 " + e) / 6e4;
        return isNaN(t) ? n : t;
      }
      function N_(e) {
        return e instanceof Date && !isNaN(e.valueOf());
      }
      class I1 {
        constructor(n, t, r, o) {
          (this.$implicit = n),
            (this.ngForOf = t),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let k_ = (() => {
        class e {
          set ngForOf(t) {
            (this._ngForOf = t), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(t) {
            this._trackByFn = t;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(t, r, o) {
            (this._viewContainer = t),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(t) {
            t && (this._template = t);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const t = this._ngForOf;
              !this._differ &&
                t &&
                (this._differ = this._differs
                  .find(t)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const t = this._differ.diff(this._ngForOf);
              t && this._applyChanges(t);
            }
          }
          _applyChanges(t) {
            const r = this._viewContainer;
            t.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new I1(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), L_(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            t.forEachIdentityChange((o) => {
              L_(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(kt), _(mn), _(Fa));
          });
          static #t = (this.ɵdir = R({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      function L_(e, n) {
        e.context.$implicit = n.item;
      }
      let V_ = (() => {
        class e {
          constructor(t, r) {
            (this._viewContainer = t),
              (this._context = new M1()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(t) {
            (this._context.$implicit = this._context.ngIf = t),
              this._updateView();
          }
          set ngIfThen(t) {
            j_("ngIfThen", t),
              (this._thenTemplateRef = t),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(t) {
            j_("ngIfElse", t),
              (this._elseTemplateRef = t),
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
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(kt), _(mn));
          });
          static #t = (this.ɵdir = R({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      class M1 {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function j_(e, n) {
        if (n && !n.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${we(n)}'.`
          );
      }
      let $_ = (() => {
        class e {
          constructor(t, r, o) {
            (this._ngEl = t),
              (this._differs = r),
              (this._renderer = o),
              (this._ngStyle = null),
              (this._differ = null);
          }
          set ngStyle(t) {
            (this._ngStyle = t),
              !this._differ &&
                t &&
                (this._differ = this._differs.find(t).create());
          }
          ngDoCheck() {
            if (this._differ) {
              const t = this._differ.diff(this._ngStyle);
              t && this._applyChanges(t);
            }
          }
          _setStyle(t, r) {
            const [o, i] = t.split("."),
              s = -1 === o.indexOf("-") ? void 0 : Rn.DashCase;
            null != r
              ? this._renderer.setStyle(
                  this._ngEl.nativeElement,
                  o,
                  i ? `${r}${i}` : r,
                  s
                )
              : this._renderer.removeStyle(this._ngEl.nativeElement, o, s);
          }
          _applyChanges(t) {
            t.forEachRemovedItem((r) => this._setStyle(r.key, null)),
              t.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
              t.forEachChangedItem((r) =>
                this._setStyle(r.key, r.currentValue)
              );
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(at), _(Si), _(fn));
          });
          static #t = (this.ɵdir = R({
            type: e,
            selectors: [["", "ngStyle", ""]],
            inputs: { ngStyle: "ngStyle" },
            standalone: !0,
          }));
        }
        return e;
      })();
      const B1 = new b("DATE_PIPE_DEFAULT_TIMEZONE"),
        $1 = new b("DATE_PIPE_DEFAULT_OPTIONS");
      let H_ = (() => {
          class e {
            constructor(t, r, o) {
              (this.locale = t),
                (this.defaultTimezone = r),
                (this.defaultOptions = o);
            }
            transform(t, r, o, i) {
              if (null == t || "" === t || t != t) return null;
              try {
                return e1(
                  t,
                  r ?? this.defaultOptions?.dateFormat ?? "mediumDate",
                  i || this.locale,
                  o ??
                    this.defaultOptions?.timezone ??
                    this.defaultTimezone ??
                    void 0
                );
              } catch (s) {
                throw (function Vt(e, n) {
                  return new D(2100, !1);
                })();
              }
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(vn, 16), _(B1, 24), _($1, 24));
            });
            static #t = (this.ɵpipe = We({
              name: "date",
              type: e,
              pure: !0,
              standalone: !0,
            }));
          }
          return e;
        })(),
        K1 = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({}));
          }
          return e;
        })();
      function z_(e) {
        return "server" === e;
      }
      let tP = (() => {
        class e {
          static #e = (this.ɵprov = M({
            token: e,
            providedIn: "root",
            factory: () => new nP(S(_t), window),
          }));
        }
        return e;
      })();
      class nP {
        constructor(n, t) {
          (this.document = n), (this.window = t), (this.offset = () => [0, 0]);
        }
        setOffset(n) {
          this.offset = Array.isArray(n) ? () => n : n;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(n) {
          this.supportsScrolling() && this.window.scrollTo(n[0], n[1]);
        }
        scrollToAnchor(n) {
          if (!this.supportsScrolling()) return;
          const t = (function rP(e, n) {
            const t = e.getElementById(n) || e.getElementsByName(n)[0];
            if (t) return t;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              "function" == typeof e.body.attachShadow
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(n) || i.querySelector(`[name="${n}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, n);
          t && (this.scrollToElement(t), t.focus());
        }
        setHistoryScrollRestoration(n) {
          this.supportsScrolling() &&
            (this.window.history.scrollRestoration = n);
        }
        scrollToElement(n) {
          const t = n.getBoundingClientRect(),
            r = t.left + this.window.pageXOffset,
            o = t.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      class SP extends RO {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Zd extends SP {
        static makeCurrent() {
          !(function xO(e) {
            Ad || (Ad = e);
          })(new Zd());
        }
        onAndCancel(n, t, r) {
          return (
            n.addEventListener(t, r),
            () => {
              n.removeEventListener(t, r);
            }
          );
        }
        dispatchEvent(n, t) {
          n.dispatchEvent(t);
        }
        remove(n) {
          n.parentNode && n.parentNode.removeChild(n);
        }
        createElement(n, t) {
          return (t = t || this.getDefaultDocument()).createElement(n);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(n) {
          return n.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(n) {
          return n instanceof DocumentFragment;
        }
        getGlobalEventTarget(n, t) {
          return "window" === t
            ? window
            : "document" === t
            ? n
            : "body" === t
            ? n.body
            : null;
        }
        getBaseHref(n) {
          const t = (function AP() {
            return (
              (xi = xi || document.querySelector("base")),
              xi ? xi.getAttribute("href") : null
            );
          })();
          return null == t
            ? null
            : (function TP(e) {
                (Ya = Ya || document.createElement("a")),
                  Ya.setAttribute("href", e);
                const n = Ya.pathname;
                return "/" === n.charAt(0) ? n : `/${n}`;
              })(t);
        }
        resetBaseElement() {
          xi = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(n) {
          return (function w1(e, n) {
            n = encodeURIComponent(n);
            for (const t of e.split(";")) {
              const r = t.indexOf("="),
                [o, i] = -1 == r ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
              if (o.trim() === n) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, n);
        }
      }
      let Ya,
        xi = null,
        xP = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
          }
          return e;
        })();
      const Yd = new b("EventManagerPlugins");
      let Q_ = (() => {
        class e {
          constructor(t, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              t.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = t.slice().reverse());
          }
          addEventListener(t, r, o) {
            return this._findPluginFor(r).addEventListener(t, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(t) {
            let r = this._eventNameToPlugin.get(t);
            if (r) return r;
            if (((r = this._plugins.find((i) => i.supports(t))), !r))
              throw new D(5101, !1);
            return this._eventNameToPlugin.set(t, r), r;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(Yd), S(oe));
          });
          static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class K_ {
        constructor(n) {
          this._doc = n;
        }
      }
      const Qd = "ng-app-id";
      let X_ = (() => {
        class e {
          constructor(t, r, o, i = {}) {
            (this.doc = t),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = z_(i)),
              this.resetHostNodes();
          }
          addStyles(t) {
            for (const r of t)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(t) {
            for (const r of t)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const t = this.styleNodesInDOM;
            t && (t.forEach((r) => r.remove()), t.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(t) {
            this.hostNodes.add(t);
            for (const r of this.getAllStyles()) this.addStyleToHost(t, r);
          }
          removeHost(t) {
            this.hostNodes.delete(t);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(t) {
            for (const r of this.hostNodes) this.addStyleToHost(r, t);
          }
          onStyleRemoved(t) {
            const r = this.styleRef;
            r.get(t)?.elements?.forEach((o) => o.remove()), r.delete(t);
          }
          collectServerRenderedStyles() {
            const t = this.doc.head?.querySelectorAll(
              `style[${Qd}="${this.appId}"]`
            );
            if (t?.length) {
              const r = new Map();
              return (
                t.forEach((o) => {
                  null != o.textContent && r.set(o.textContent, o);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(t, r) {
            const o = this.styleRef;
            if (o.has(t)) {
              const i = o.get(t);
              return (i.usage += r), i.usage;
            }
            return o.set(t, { usage: r, elements: [] }), r;
          }
          getStyleElement(t, r) {
            const o = this.styleNodesInDOM,
              i = o?.get(r);
            if (i?.parentNode === t)
              return o.delete(r), i.removeAttribute(Qd), i;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(Qd, this.appId),
                s
              );
            }
          }
          addStyleToHost(t, r) {
            const o = this.getStyleElement(t, r);
            t.appendChild(o);
            const i = this.styleRef,
              s = i.get(r)?.elements;
            s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
          }
          resetHostNodes() {
            const t = this.hostNodes;
            t.clear(), t.add(this.doc.head);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(_t), S(Js), S(Xg, 8), S(Br));
          });
          static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const Kd = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Xd = /%COMP%/g,
        FP = new b("RemoveStylesOnCompDestroy", {
          providedIn: "root",
          factory: () => !1,
        });
      function eC(e, n) {
        return n.map((t) => t.replace(Xd, e));
      }
      let tC = (() => {
        class e {
          constructor(t, r, o, i, s, a, u, c = null) {
            (this.eventManager = t),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestroy = i),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = u),
              (this.nonce = c),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = z_(a)),
              (this.defaultRenderer = new Jd(t, s, u, this.platformIsServer));
          }
          createRenderer(t, r) {
            if (!t || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === It.ShadowDom &&
              (r = { ...r, encapsulation: It.Emulated });
            const o = this.getOrCreateRenderer(t, r);
            return (
              o instanceof rC
                ? o.applyToHost(t)
                : o instanceof ef && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(t, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.doc,
                a = this.ngZone,
                u = this.eventManager,
                c = this.sharedStylesHost,
                l = this.removeStylesOnCompDestroy,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case It.Emulated:
                  i = new rC(u, c, r, this.appId, l, s, a, d);
                  break;
                case It.ShadowDom:
                  return new jP(u, c, t, r, s, a, this.nonce, d);
                default:
                  i = new ef(u, c, r, l, s, a, d);
              }
              o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(
              S(Q_),
              S(X_),
              S(Js),
              S(FP),
              S(_t),
              S(Br),
              S(oe),
              S(Xg)
            );
          });
          static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class Jd {
        constructor(n, t, r, o) {
          (this.eventManager = n),
            (this.doc = t),
            (this.ngZone = r),
            (this.platformIsServer = o),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(n, t) {
          return t
            ? this.doc.createElementNS(Kd[t] || t, n)
            : this.doc.createElement(n);
        }
        createComment(n) {
          return this.doc.createComment(n);
        }
        createText(n) {
          return this.doc.createTextNode(n);
        }
        appendChild(n, t) {
          (nC(n) ? n.content : n).appendChild(t);
        }
        insertBefore(n, t, r) {
          n && (nC(n) ? n.content : n).insertBefore(t, r);
        }
        removeChild(n, t) {
          n && n.removeChild(t);
        }
        selectRootElement(n, t) {
          let r = "string" == typeof n ? this.doc.querySelector(n) : n;
          if (!r) throw new D(-5104, !1);
          return t || (r.textContent = ""), r;
        }
        parentNode(n) {
          return n.parentNode;
        }
        nextSibling(n) {
          return n.nextSibling;
        }
        setAttribute(n, t, r, o) {
          if (o) {
            t = o + ":" + t;
            const i = Kd[o];
            i ? n.setAttributeNS(i, t, r) : n.setAttribute(t, r);
          } else n.setAttribute(t, r);
        }
        removeAttribute(n, t, r) {
          if (r) {
            const o = Kd[r];
            o ? n.removeAttributeNS(o, t) : n.removeAttribute(`${r}:${t}`);
          } else n.removeAttribute(t);
        }
        addClass(n, t) {
          n.classList.add(t);
        }
        removeClass(n, t) {
          n.classList.remove(t);
        }
        setStyle(n, t, r, o) {
          o & (Rn.DashCase | Rn.Important)
            ? n.style.setProperty(t, r, o & Rn.Important ? "important" : "")
            : (n.style[t] = r);
        }
        removeStyle(n, t, r) {
          r & Rn.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
        }
        setProperty(n, t, r) {
          n[t] = r;
        }
        setValue(n, t) {
          n.nodeValue = t;
        }
        listen(n, t, r) {
          if (
            "string" == typeof n &&
            !(n = kn().getGlobalEventTarget(this.doc, n))
          )
            throw new Error(`Unsupported event target ${n} for event ${t}`);
          return this.eventManager.addEventListener(
            n,
            t,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(n) {
          return (t) => {
            if ("__ngUnwrap__" === t) return n;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => n(t))
                : n(t)) && t.preventDefault();
          };
        }
      }
      function nC(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class jP extends Jd {
        constructor(n, t, r, o, i, s, a, u) {
          super(n, i, s, u),
            (this.sharedStylesHost = t),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const c = eC(o.id, o.styles);
          for (const l of c) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = l),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(n) {
          return n === this.hostEl ? this.shadowRoot : n;
        }
        appendChild(n, t) {
          return super.appendChild(this.nodeOrShadowRoot(n), t);
        }
        insertBefore(n, t, r) {
          return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
        }
        removeChild(n, t) {
          return super.removeChild(this.nodeOrShadowRoot(n), t);
        }
        parentNode(n) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(n))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class ef extends Jd {
        constructor(n, t, r, o, i, s, a, u) {
          super(n, i, s, a),
            (this.sharedStylesHost = t),
            (this.removeStylesOnCompDestroy = o),
            (this.styles = u ? eC(u, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }
      class rC extends ef {
        constructor(n, t, r, o, i, s, a, u) {
          const c = o + "-" + r.id;
          super(n, t, r, i, s, a, u, c),
            (this.contentAttr = (function kP(e) {
              return "_ngcontent-%COMP%".replace(Xd, e);
            })(c)),
            (this.hostAttr = (function LP(e) {
              return "_nghost-%COMP%".replace(Xd, e);
            })(c));
        }
        applyToHost(n) {
          this.applyStyles(), this.setAttribute(n, this.hostAttr, "");
        }
        createElement(n, t) {
          const r = super.createElement(n, t);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let BP = (() => {
        class e extends K_ {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return !0;
          }
          addEventListener(t, r, o) {
            return (
              t.addEventListener(r, o, !1),
              () => this.removeEventListener(t, r, o)
            );
          }
          removeEventListener(t, r, o) {
            return t.removeEventListener(r, o);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(_t));
          });
          static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const oC = ["alt", "control", "meta", "shift"],
        $P = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
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
        HP = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let UP = (() => {
        class e extends K_ {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return null != e.parseEventName(t);
          }
          addEventListener(t, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => kn().onAndCancel(t, i.domEventName, s));
          }
          static parseEventName(t) {
            const r = t.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              oC.forEach((c) => {
                const l = r.indexOf(c);
                l > -1 && (r.splice(l, 1), (s += c + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(t, r) {
            let o = $P[t.key] || t.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = t.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                oC.forEach((s) => {
                  s !== o && (0, HP[s])(t) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(t, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, t) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(t) {
            return "esc" === t ? "escape" : t;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(_t));
          });
          static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const WP = QD(vO, "browser", [
          { provide: Br, useValue: "browser" },
          {
            provide: Kg,
            useValue: function GP() {
              Zd.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: _t,
            useFactory: function qP() {
              return (
                (function I0(e) {
                  Hc = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        ZP = new b(""),
        aC = [
          {
            provide: Na,
            useClass: class NP {
              addToWindow(n) {
                (ne.getAngularTestability = (r, o = !0) => {
                  const i = n.findTestabilityInTree(r, o);
                  if (null == i) throw new D(5103, !1);
                  return i;
                }),
                  (ne.getAllAngularTestabilities = () =>
                    n.getAllTestabilities()),
                  (ne.getAllAngularRootElements = () => n.getAllRootElements()),
                  ne.frameworkStabilizers || (ne.frameworkStabilizers = []),
                  ne.frameworkStabilizers.push((r) => {
                    const o = ne.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach((u) => {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(n, t, r) {
                return null == t
                  ? null
                  : n.getTestability(t) ??
                      (r
                        ? kn().isShadowRoot(t)
                          ? this.findTestabilityInTree(n, t.host, !0)
                          : this.findTestabilityInTree(n, t.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: zD, useClass: vd, deps: [oe, yd, Na] },
          { provide: vd, useClass: vd, deps: [oe, yd, Na] },
        ],
        uC = [
          { provide: Kc, useValue: "root" },
          {
            provide: hn,
            useFactory: function zP() {
              return new hn();
            },
            deps: [],
          },
          { provide: Yd, useClass: BP, multi: !0, deps: [_t, oe, Br] },
          { provide: Yd, useClass: UP, multi: !0, deps: [_t] },
          tC,
          X_,
          Q_,
          { provide: om, useExisting: tC },
          { provide: class oP {}, useClass: xP, deps: [] },
          [],
        ];
      let YP = (() => {
          class e {
            constructor(t) {}
            static withServerTransition(t) {
              return {
                ngModule: e,
                providers: [{ provide: Js, useValue: t.appId }],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(ZP, 12));
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({
              providers: [...uC, ...aC],
              imports: [K1, yO],
            }));
          }
          return e;
        })(),
        cC = (() => {
          class e {
            constructor(t) {
              this._doc = t;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(t) {
              this._doc.title = t || "";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(_t));
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: function (r) {
                let o = null;
                return (
                  (o = r
                    ? new r()
                    : (function KP() {
                        return new cC(S(_t));
                      })()),
                  o
                );
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      typeof window < "u" && window;
      const { isArray: rF } = Array,
        { getPrototypeOf: oF, prototype: iF, keys: sF } = Object;
      function hC(e) {
        if (1 === e.length) {
          const n = e[0];
          if (rF(n)) return { args: n, keys: null };
          if (
            (function aF(e) {
              return e && "object" == typeof e && oF(e) === iF;
            })(n)
          ) {
            const t = sF(n);
            return { args: t.map((r) => n[r]), keys: t };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: uF } = Array;
      function pC(e) {
        return X((n) =>
          (function cF(e, n) {
            return uF(n) ? e(...n) : e(n);
          })(e, n)
        );
      }
      function gC(e, n) {
        return e.reduce((t, r, o) => ((t[r] = n[o]), t), {});
      }
      function nf(...e) {
        const n = Mo(e),
          t = yh(e),
          { args: r, keys: o } = hC(e);
        if (0 === r.length) return Ie([], n);
        const i = new ye(
          (function lF(e, n, t = bn) {
            return (r) => {
              mC(
                n,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let u = 0; u < o; u++)
                    mC(
                      n,
                      () => {
                        const c = Ie(e[u], n);
                        let l = !1;
                        c.subscribe(
                          De(
                            r,
                            (d) => {
                              (i[u] = d),
                                l || ((l = !0), a--),
                                a || r.next(t(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, n, o ? (s) => gC(o, s) : bn)
        );
        return t ? i.pipe(pC(t)) : i;
      }
      function mC(e, n, t) {
        e ? on(t, e, n) : n();
      }
      const Qa = Eo(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function rf(...e) {
        return (function dF() {
          return fr(1);
        })()(Ie(e, Mo(e)));
      }
      function vC(e) {
        return new ye((n) => {
          tt(e()).subscribe(n);
        });
      }
      function Ri(e, n) {
        const t = K(e) ? e : () => e,
          r = (o) => o.error(t());
        return new ye(n ? (o) => n.schedule(r, 0, o) : r);
      }
      function sf() {
        return Ce((e, n) => {
          let t = null;
          e._refCount++;
          const r = De(n, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (t = null);
            const o = e._connection,
              i = t;
            (t = null),
              o && (!i || o === i) && o.unsubscribe(),
              n.unsubscribe();
          });
          e.subscribe(r), r.closed || (t = e.connect());
        });
      }
      class yC extends ye {
        constructor(n, t) {
          super(),
            (this.source = n),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            rh(n) && (this.lift = n.lift);
        }
        _subscribe(n) {
          return this.getSubject().subscribe(n);
        }
        getSubject() {
          const n = this._subject;
          return (
            (!n || n.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: n } = this;
          (this._subject = this._connection = null), n?.unsubscribe();
        }
        connect() {
          let n = this._connection;
          if (!n) {
            n = this._connection = new et();
            const t = this.getSubject();
            n.add(
              this.source.subscribe(
                De(
                  t,
                  void 0,
                  () => {
                    this._teardown(), t.complete();
                  },
                  (r) => {
                    this._teardown(), t.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              n.closed && ((this._connection = null), (n = et.EMPTY));
          }
          return n;
        }
        refCount() {
          return sf()(this);
        }
      }
      function lo(e) {
        return e <= 0
          ? () => Bt
          : Ce((n, t) => {
              let r = 0;
              n.subscribe(
                De(t, (o) => {
                  ++r <= e && (t.next(o), e <= r && t.complete());
                })
              );
            });
      }
      function Vn(e, n) {
        return Ce((t, r) => {
          let o = 0;
          t.subscribe(De(r, (i) => e.call(n, i, o++) && r.next(i)));
        });
      }
      function Ka(e) {
        return Ce((n, t) => {
          let r = !1;
          n.subscribe(
            De(
              t,
              (o) => {
                (r = !0), t.next(o);
              },
              () => {
                r || t.next(e), t.complete();
              }
            )
          );
        });
      }
      function DC(e = hF) {
        return Ce((n, t) => {
          let r = !1;
          n.subscribe(
            De(
              t,
              (o) => {
                (r = !0), t.next(o);
              },
              () => (r ? t.complete() : t.error(e()))
            )
          );
        });
      }
      function hF() {
        return new Qa();
      }
      function ir(e, n) {
        const t = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? Vn((o, i) => e(o, i, r)) : bn,
            lo(1),
            t ? Ka(n) : DC(() => new Qa())
          );
      }
      function Oi(e, n) {
        return K(n) ? Me(e, n, 1) : Me(e, 1);
      }
      function Fe(e, n, t) {
        const r = K(e) || n || t ? { next: e, error: n, complete: t } : e;
        return r
          ? Ce((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                De(
                  i,
                  (u) => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, u),
                      i.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      i.complete();
                  },
                  (u) => {
                    var c;
                    (a = !1),
                      null === (c = r.error) || void 0 === c || c.call(r, u),
                      i.error(u);
                  },
                  () => {
                    var u, c;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (c = r.finalize) || void 0 === c || c.call(r);
                  }
                )
              );
            })
          : bn;
      }
      function sr(e) {
        return Ce((n, t) => {
          let i,
            r = null,
            o = !1;
          (r = n.subscribe(
            De(t, void 0, void 0, (s) => {
              (i = tt(e(s, sr(e)(n)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(t)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(t));
        });
      }
      function af(e) {
        return e <= 0
          ? () => Bt
          : Ce((n, t) => {
              let r = [];
              n.subscribe(
                De(
                  t,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) t.next(o);
                    t.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function uf(e) {
        return Ce((n, t) => {
          try {
            n.subscribe(t);
          } finally {
            t.add(e);
          }
        });
      }
      const V = "primary",
        Pi = Symbol("RouteTitle");
      class DF {
        constructor(n) {
          this.params = n || {};
        }
        has(n) {
          return Object.prototype.hasOwnProperty.call(this.params, n);
        }
        get(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t[0] : t;
          }
          return null;
        }
        getAll(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t : [t];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function fo(e) {
        return new DF(e);
      }
      function _F(e, n, t) {
        const r = t.path.split("/");
        if (
          r.length > e.length ||
          ("full" === t.pathMatch && (n.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function tn(e, n) {
        const t = e ? Object.keys(e) : void 0,
          r = n ? Object.keys(n) : void 0;
        if (!t || !r || t.length != r.length) return !1;
        let o;
        for (let i = 0; i < t.length; i++)
          if (((o = t[i]), !_C(e[o], n[o]))) return !1;
        return !0;
      }
      function _C(e, n) {
        if (Array.isArray(e) && Array.isArray(n)) {
          if (e.length !== n.length) return !1;
          const t = [...e].sort(),
            r = [...n].sort();
          return t.every((o, i) => r[i] === o);
        }
        return e === n;
      }
      function CC(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function jn(e) {
        return (function nF(e) {
          return !!e && (e instanceof ye || (K(e.lift) && K(e.subscribe)));
        })(e)
          ? e
          : pi(e)
          ? Ie(Promise.resolve(e))
          : O(e);
      }
      const wF = {
          exact: function bC(e, n, t) {
            if (
              !ar(e.segments, n.segments) ||
              !Xa(e.segments, n.segments, t) ||
              e.numberOfChildren !== n.numberOfChildren
            )
              return !1;
            for (const r in n.children)
              if (!e.children[r] || !bC(e.children[r], n.children[r], t))
                return !1;
            return !0;
          },
          subset: IC,
        },
        wC = {
          exact: function EF(e, n) {
            return tn(e, n);
          },
          subset: function bF(e, n) {
            return (
              Object.keys(n).length <= Object.keys(e).length &&
              Object.keys(n).every((t) => _C(e[t], n[t]))
            );
          },
          ignored: () => !0,
        };
      function EC(e, n, t) {
        return (
          wF[t.paths](e.root, n.root, t.matrixParams) &&
          wC[t.queryParams](e.queryParams, n.queryParams) &&
          !("exact" === t.fragment && e.fragment !== n.fragment)
        );
      }
      function IC(e, n, t) {
        return MC(e, n, n.segments, t);
      }
      function MC(e, n, t, r) {
        if (e.segments.length > t.length) {
          const o = e.segments.slice(0, t.length);
          return !(!ar(o, t) || n.hasChildren() || !Xa(o, t, r));
        }
        if (e.segments.length === t.length) {
          if (!ar(e.segments, t) || !Xa(e.segments, t, r)) return !1;
          for (const o in n.children)
            if (!e.children[o] || !IC(e.children[o], n.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = t.slice(0, e.segments.length),
            i = t.slice(e.segments.length);
          return (
            !!(ar(e.segments, o) && Xa(e.segments, o, r) && e.children[V]) &&
            MC(e.children[V], n, i, r)
          );
        }
      }
      function Xa(e, n, t) {
        return n.every((r, o) => wC[t](e[o].parameters, r.parameters));
      }
      class ho {
        constructor(n = new Q([], {}), t = {}, r = null) {
          (this.root = n), (this.queryParams = t), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = fo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return SF.serialize(this);
        }
      }
      class Q {
        constructor(n, t) {
          (this.segments = n),
            (this.children = t),
            (this.parent = null),
            Object.values(t).forEach((r) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Ja(this);
        }
      }
      class Fi {
        constructor(n, t) {
          (this.path = n), (this.parameters = t);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = fo(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return TC(this);
        }
      }
      function ar(e, n) {
        return e.length === n.length && e.every((t, r) => t.path === n[r].path);
      }
      let ki = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: function () {
              return new cf();
            },
            providedIn: "root",
          }));
        }
        return e;
      })();
      class cf {
        parse(n) {
          const t = new VF(n);
          return new ho(
            t.parseRootSegment(),
            t.parseQueryParams(),
            t.parseFragment()
          );
        }
        serialize(n) {
          const t = `/${Li(n.root, !0)}`,
            r = (function NF(e) {
              const n = Object.keys(e)
                .map((t) => {
                  const r = e[t];
                  return Array.isArray(r)
                    ? r.map((o) => `${eu(t)}=${eu(o)}`).join("&")
                    : `${eu(t)}=${eu(r)}`;
                })
                .filter((t) => !!t);
              return n.length ? `?${n.join("&")}` : "";
            })(n.queryParams);
          return `${t}${r}${
            "string" == typeof n.fragment
              ? `#${(function AF(e) {
                  return encodeURI(e);
                })(n.fragment)}`
              : ""
          }`;
        }
      }
      const SF = new cf();
      function Ja(e) {
        return e.segments.map((n) => TC(n)).join("/");
      }
      function Li(e, n) {
        if (!e.hasChildren()) return Ja(e);
        if (n) {
          const t = e.children[V] ? Li(e.children[V], !1) : "",
            r = [];
          return (
            Object.entries(e.children).forEach(([o, i]) => {
              o !== V && r.push(`${o}:${Li(i, !1)}`);
            }),
            r.length > 0 ? `${t}(${r.join("//")})` : t
          );
        }
        {
          const t = (function MF(e, n) {
            let t = [];
            return (
              Object.entries(e.children).forEach(([r, o]) => {
                r === V && (t = t.concat(n(o, r)));
              }),
              Object.entries(e.children).forEach(([r, o]) => {
                r !== V && (t = t.concat(n(o, r)));
              }),
              t
            );
          })(e, (r, o) =>
            o === V ? [Li(e.children[V], !1)] : [`${o}:${Li(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[V]
            ? `${Ja(e)}/${t[0]}`
            : `${Ja(e)}/(${t.join("//")})`;
        }
      }
      function SC(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function eu(e) {
        return SC(e).replace(/%3B/gi, ";");
      }
      function lf(e) {
        return SC(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function tu(e) {
        return decodeURIComponent(e);
      }
      function AC(e) {
        return tu(e.replace(/\+/g, "%20"));
      }
      function TC(e) {
        return `${lf(e.path)}${(function TF(e) {
          return Object.keys(e)
            .map((n) => `;${lf(n)}=${lf(e[n])}`)
            .join("");
        })(e.parameters)}`;
      }
      const xF = /^[^\/()?;#]+/;
      function df(e) {
        const n = e.match(xF);
        return n ? n[0] : "";
      }
      const RF = /^[^\/()?;=#]+/,
        PF = /^[^=?&#]+/,
        kF = /^[^&#]+/;
      class VF {
        constructor(n) {
          (this.url = n), (this.remaining = n);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new Q([], {})
              : new Q([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const n = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(n);
            } while (this.consumeOptional("&"));
          return n;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const n = [];
          for (
            this.peekStartsWith("(") || n.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), n.push(this.parseSegment());
          let t = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (t = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (n.length > 0 || Object.keys(t).length > 0) && (r[V] = new Q(n, t)),
            r
          );
        }
        parseSegment() {
          const n = df(this.remaining);
          if ("" === n && this.peekStartsWith(";")) throw new D(4009, !1);
          return this.capture(n), new Fi(tu(n), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const n = {};
          for (; this.consumeOptional(";"); ) this.parseParam(n);
          return n;
        }
        parseParam(n) {
          const t = (function OF(e) {
            const n = e.match(RF);
            return n ? n[0] : "";
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = df(this.remaining);
            o && ((r = o), this.capture(r));
          }
          n[tu(t)] = tu(r);
        }
        parseQueryParam(n) {
          const t = (function FF(e) {
            const n = e.match(PF);
            return n ? n[0] : "";
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function LF(e) {
              const n = e.match(kF);
              return n ? n[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = AC(t),
            i = AC(r);
          if (n.hasOwnProperty(o)) {
            let s = n[o];
            Array.isArray(s) || ((s = [s]), (n[o] = s)), s.push(i);
          } else n[o] = i;
        }
        parseParens(n) {
          const t = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = df(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new D(4010, !1);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : n && (i = V);
            const s = this.parseChildren();
            (t[i] = 1 === Object.keys(s).length ? s[V] : new Q([], s)),
              this.consumeOptional("//");
          }
          return t;
        }
        peekStartsWith(n) {
          return this.remaining.startsWith(n);
        }
        consumeOptional(n) {
          return (
            !!this.peekStartsWith(n) &&
            ((this.remaining = this.remaining.substring(n.length)), !0)
          );
        }
        capture(n) {
          if (!this.consumeOptional(n)) throw new D(4011, !1);
        }
      }
      function NC(e) {
        return e.segments.length > 0 ? new Q([], { [V]: e }) : e;
      }
      function xC(e) {
        const n = {};
        for (const r of Object.keys(e.children)) {
          const i = xC(e.children[r]);
          if (r === V && 0 === i.segments.length && i.hasChildren())
            for (const [s, a] of Object.entries(i.children)) n[s] = a;
          else (i.segments.length > 0 || i.hasChildren()) && (n[r] = i);
        }
        return (function jF(e) {
          if (1 === e.numberOfChildren && e.children[V]) {
            const n = e.children[V];
            return new Q(e.segments.concat(n.segments), n.children);
          }
          return e;
        })(new Q(e.segments, n));
      }
      function ur(e) {
        return e instanceof ho;
      }
      function RC(e) {
        let n;
        const o = NC(
          (function t(i) {
            const s = {};
            for (const u of i.children) {
              const c = t(u);
              s[u.outlet] = c;
            }
            const a = new Q(i.url, s);
            return i === e && (n = a), a;
          })(e.root)
        );
        return n ?? o;
      }
      function OC(e, n, t, r) {
        let o = e;
        for (; o.parent; ) o = o.parent;
        if (0 === n.length) return ff(o, o, o, t, r);
        const i = (function $F(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new FC(!0, 0, e);
          let n = 0,
            t = !1;
          const r = e.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  Object.entries(i.outlets).forEach(([u, c]) => {
                    a[u] = "string" == typeof c ? c.split("/") : c;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, u) => {
                  (0 == u && "." === a) ||
                    (0 == u && "" === a
                      ? (t = !0)
                      : ".." === a
                      ? n++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new FC(t, n, r);
        })(n);
        if (i.toRoot()) return ff(o, o, new Q([], {}), t, r);
        const s = (function HF(e, n, t) {
            if (e.isAbsolute) return new ru(n, !0, 0);
            if (!t) return new ru(n, !1, NaN);
            if (null === t.parent) return new ru(t, !0, 0);
            const r = nu(e.commands[0]) ? 0 : 1;
            return (function UF(e, n, t) {
              let r = e,
                o = n,
                i = t;
              for (; i > o; ) {
                if (((i -= o), (r = r.parent), !r)) throw new D(4005, !1);
                o = r.segments.length;
              }
              return new ru(r, !1, o - i);
            })(t, t.segments.length - 1 + r, e.numberOfDoubleDots);
          })(i, o, e),
          a = s.processChildren
            ? ji(s.segmentGroup, s.index, i.commands)
            : kC(s.segmentGroup, s.index, i.commands);
        return ff(o, s.segmentGroup, a, t, r);
      }
      function nu(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Vi(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function ff(e, n, t, r, o) {
        let s,
          i = {};
        r &&
          Object.entries(r).forEach(([u, c]) => {
            i[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
          }),
          (s = e === n ? t : PC(e, n, t));
        const a = NC(xC(s));
        return new ho(a, i, o);
      }
      function PC(e, n, t) {
        const r = {};
        return (
          Object.entries(e.children).forEach(([o, i]) => {
            r[o] = i === n ? t : PC(i, n, t);
          }),
          new Q(e.segments, r)
        );
      }
      class FC {
        constructor(n, t, r) {
          if (
            ((this.isAbsolute = n),
            (this.numberOfDoubleDots = t),
            (this.commands = r),
            n && r.length > 0 && nu(r[0]))
          )
            throw new D(4003, !1);
          const o = r.find(Vi);
          if (o && o !== CC(r)) throw new D(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class ru {
        constructor(n, t, r) {
          (this.segmentGroup = n), (this.processChildren = t), (this.index = r);
        }
      }
      function kC(e, n, t) {
        if (
          (e || (e = new Q([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return ji(e, n, t);
        const r = (function zF(e, n, t) {
            let r = 0,
              o = n;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= t.length) return i;
              const s = e.segments[o],
                a = t[r];
              if (Vi(a)) break;
              const u = `${a}`,
                c = r < t.length - 1 ? t[r + 1] : null;
              if (o > 0 && void 0 === u) break;
              if (u && c && "object" == typeof c && void 0 === c.outlets) {
                if (!VC(u, c, s)) return i;
                r += 2;
              } else {
                if (!VC(u, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, n, t),
          o = t.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new Q(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[V] = new Q(e.segments.slice(r.pathIndex), e.children)),
            ji(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new Q(e.segments, {})
          : r.match && !e.hasChildren()
          ? hf(e, n, t)
          : r.match
          ? ji(e, 0, o)
          : hf(e, n, t);
      }
      function ji(e, n, t) {
        if (0 === t.length) return new Q(e.segments, {});
        {
          const r = (function GF(e) {
              return Vi(e[0]) ? e[0].outlets : { [V]: e };
            })(t),
            o = {};
          if (
            Object.keys(r).some((i) => i !== V) &&
            e.children[V] &&
            1 === e.numberOfChildren &&
            0 === e.children[V].segments.length
          ) {
            const i = ji(e.children[V], n, t);
            return new Q(e.segments, i.children);
          }
          return (
            Object.entries(r).forEach(([i, s]) => {
              "string" == typeof s && (s = [s]),
                null !== s && (o[i] = kC(e.children[i], n, s));
            }),
            Object.entries(e.children).forEach(([i, s]) => {
              void 0 === r[i] && (o[i] = s);
            }),
            new Q(e.segments, o)
          );
        }
      }
      function hf(e, n, t) {
        const r = e.segments.slice(0, n);
        let o = 0;
        for (; o < t.length; ) {
          const i = t[o];
          if (Vi(i)) {
            const u = qF(i.outlets);
            return new Q(r, u);
          }
          if (0 === o && nu(t[0])) {
            r.push(new Fi(e.segments[n].path, LC(t[0]))), o++;
            continue;
          }
          const s = Vi(i) ? i.outlets[V] : `${i}`,
            a = o < t.length - 1 ? t[o + 1] : null;
          s && a && nu(a)
            ? (r.push(new Fi(s, LC(a))), (o += 2))
            : (r.push(new Fi(s, {})), o++);
        }
        return new Q(r, {});
      }
      function qF(e) {
        const n = {};
        return (
          Object.entries(e).forEach(([t, r]) => {
            "string" == typeof r && (r = [r]),
              null !== r && (n[t] = hf(new Q([], {}), 0, r));
          }),
          n
        );
      }
      function LC(e) {
        const n = {};
        return Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n;
      }
      function VC(e, n, t) {
        return e == t.path && tn(n, t.parameters);
      }
      const Bi = "imperative";
      class nn {
        constructor(n, t) {
          (this.id = n), (this.url = t);
        }
      }
      class ou extends nn {
        constructor(n, t, r = "imperative", o = null) {
          super(n, t),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Bn extends nn {
        constructor(n, t, r) {
          super(n, t), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class $i extends nn {
        constructor(n, t, r, o) {
          super(n, t), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class po extends nn {
        constructor(n, t, r, o) {
          super(n, t), (this.reason = r), (this.code = o), (this.type = 16);
        }
      }
      class iu extends nn {
        constructor(n, t, r, o) {
          super(n, t), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class jC extends nn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class WF extends nn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class ZF extends nn {
        constructor(n, t, r, o, i) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class YF extends nn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class QF extends nn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class KF {
        constructor(n) {
          (this.route = n), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class XF {
        constructor(n) {
          (this.route = n), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class JF {
        constructor(n) {
          (this.snapshot = n), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class ek {
        constructor(n) {
          (this.snapshot = n), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class tk {
        constructor(n) {
          (this.snapshot = n), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class nk {
        constructor(n) {
          (this.snapshot = n), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class BC {
        constructor(n, t, r) {
          (this.routerEvent = n),
            (this.position = t),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class pf {}
      class gf {
        constructor(n) {
          this.url = n;
        }
      }
      class rk {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new Hi()),
            (this.attachRef = null);
        }
      }
      let Hi = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(t, r) {
            const o = this.getOrCreateContext(t);
            (o.outlet = r), this.contexts.set(t, o);
          }
          onChildOutletDestroyed(t) {
            const r = this.getContext(t);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const t = this.contexts;
            return (this.contexts = new Map()), t;
          }
          onOutletReAttached(t) {
            this.contexts = t;
          }
          getOrCreateContext(t) {
            let r = this.getContext(t);
            return r || ((r = new rk()), this.contexts.set(t, r)), r;
          }
          getContext(t) {
            return this.contexts.get(t) || null;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      class $C {
        constructor(n) {
          this._root = n;
        }
        get root() {
          return this._root.value;
        }
        parent(n) {
          const t = this.pathFromRoot(n);
          return t.length > 1 ? t[t.length - 2] : null;
        }
        children(n) {
          const t = mf(n, this._root);
          return t ? t.children.map((r) => r.value) : [];
        }
        firstChild(n) {
          const t = mf(n, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(n) {
          const t = vf(n, this._root);
          return t.length < 2
            ? []
            : t[t.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== n);
        }
        pathFromRoot(n) {
          return vf(n, this._root).map((t) => t.value);
        }
      }
      function mf(e, n) {
        if (e === n.value) return n;
        for (const t of n.children) {
          const r = mf(e, t);
          if (r) return r;
        }
        return null;
      }
      function vf(e, n) {
        if (e === n.value) return [n];
        for (const t of n.children) {
          const r = vf(e, t);
          if (r.length) return r.unshift(n), r;
        }
        return [];
      }
      class Cn {
        constructor(n, t) {
          (this.value = n), (this.children = t);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function go(e) {
        const n = {};
        return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
      }
      class HC extends $C {
        constructor(n, t) {
          super(n), (this.snapshot = t), yf(this, n);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function UC(e, n) {
        const t = (function ok(e, n) {
            const s = new su([], {}, {}, "", {}, V, n, null, {});
            return new zC("", new Cn(s, []));
          })(0, n),
          r = new nt([new Fi("", {})]),
          o = new nt({}),
          i = new nt({}),
          s = new nt({}),
          a = new nt(""),
          u = new mo(r, o, s, a, i, V, n, t.root);
        return (u.snapshot = t.root), new HC(new Cn(u, []), t);
      }
      class mo {
        constructor(n, t, r, o, i, s, a, u) {
          (this.urlSubject = n),
            (this.paramsSubject = t),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = o),
            (this.dataSubject = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = u),
            (this.title = this.dataSubject?.pipe(X((c) => c[Pi])) ?? O(void 0)),
            (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i);
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
            this._paramMap ||
              (this._paramMap = this.params.pipe(X((n) => fo(n)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(X((n) => fo(n)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function GC(e, n = "emptyOnly") {
        const t = e.pathFromRoot;
        let r = 0;
        if ("always" !== n)
          for (r = t.length - 1; r >= 1; ) {
            const o = t[r],
              i = t[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function ik(e) {
          return e.reduce(
            (n, t) => ({
              params: { ...n.params, ...t.params },
              data: { ...n.data, ...t.data },
              resolve: {
                ...t.data,
                ...n.resolve,
                ...t.routeConfig?.data,
                ...t._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(t.slice(r));
      }
      class su {
        get title() {
          return this.data?.[Pi];
        }
        constructor(n, t, r, o, i, s, a, u, c) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = u),
            (this._resolve = c);
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
            this._paramMap || (this._paramMap = fo(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = fo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class zC extends $C {
        constructor(n, t) {
          super(t), (this.url = n), yf(this, t);
        }
        toString() {
          return qC(this._root);
        }
      }
      function yf(e, n) {
        (n.value._routerState = e), n.children.forEach((t) => yf(e, t));
      }
      function qC(e) {
        const n =
          e.children.length > 0 ? ` { ${e.children.map(qC).join(", ")} } ` : "";
        return `${e.value}${n}`;
      }
      function Df(e) {
        if (e.snapshot) {
          const n = e.snapshot,
            t = e._futureSnapshot;
          (e.snapshot = t),
            tn(n.queryParams, t.queryParams) ||
              e.queryParamsSubject.next(t.queryParams),
            n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
            tn(n.params, t.params) || e.paramsSubject.next(t.params),
            (function CF(e, n) {
              if (e.length !== n.length) return !1;
              for (let t = 0; t < e.length; ++t) if (!tn(e[t], n[t])) return !1;
              return !0;
            })(n.url, t.url) || e.urlSubject.next(t.url),
            tn(n.data, t.data) || e.dataSubject.next(t.data);
        } else
          (e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data);
      }
      function _f(e, n) {
        const t =
          tn(e.params, n.params) &&
          (function IF(e, n) {
            return (
              ar(e, n) && e.every((t, r) => tn(t.parameters, n[r].parameters))
            );
          })(e.url, n.url);
        return (
          t &&
          !(!e.parent != !n.parent) &&
          (!e.parent || _f(e.parent, n.parent))
        );
      }
      let WC = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = V),
              (this.activateEvents = new he()),
              (this.deactivateEvents = new he()),
              (this.attachEvents = new he()),
              (this.detachEvents = new he()),
              (this.parentContexts = E(Hi)),
              (this.location = E(kt)),
              (this.changeDetector = E(Ra)),
              (this.environmentInjector = E(mt)),
              (this.inputBinder = E(au, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(t) {
            if (t.name) {
              const { firstChange: r, previousValue: o } = t.name;
              if (r) return;
              this.isTrackedInParentContexts(o) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(t) {
            return this.parentContexts.getContext(t)?.outlet === this;
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
            const t = this.parentContexts.getContext(this.name);
            t?.route &&
              (t.attachRef
                ? this.attach(t.attachRef, t.route)
                : this.activateWith(t.route, t.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new D(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new D(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new D(4012, !1);
            this.location.detach();
            const t = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(t.instance),
              t
            );
          }
          attach(t, r) {
            (this.activated = t),
              (this._activatedRoute = r),
              this.location.insert(t.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(t.instance);
          }
          deactivate() {
            if (this.activated) {
              const t = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(t);
            }
          }
          activateWith(t, r) {
            if (this.isActivated) throw new D(4013, !1);
            this._activatedRoute = t;
            const o = this.location,
              s = t.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new sk(t, a, o.injector);
            (this.activated = o.createComponent(s, {
              index: o.length,
              injector: u,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵdir = R({
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
            features: [pt],
          }));
        }
        return e;
      })();
      class sk {
        constructor(n, t, r) {
          (this.route = n), (this.childContexts = t), (this.parent = r);
        }
        get(n, t) {
          return n === mo
            ? this.route
            : n === Hi
            ? this.childContexts
            : this.parent.get(n, t);
        }
      }
      const au = new b("");
      let ZC = (() => {
        class e {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(t) {
            this.unsubscribeFromRouteData(t), this.subscribeToRouteData(t);
          }
          unsubscribeFromRouteData(t) {
            this.outletDataSubscriptions.get(t)?.unsubscribe(),
              this.outletDataSubscriptions.delete(t);
          }
          subscribeToRouteData(t) {
            const { activatedRoute: r } = t,
              o = nf([r.queryParams, r.params, r.data])
                .pipe(
                  $t(
                    ([i, s, a], u) => (
                      (a = { ...i, ...s, ...a }),
                      0 === u ? O(a) : Promise.resolve(a)
                    )
                  )
                )
                .subscribe((i) => {
                  if (
                    !t.isActivated ||
                    !t.activatedComponentRef ||
                    t.activatedRoute !== r ||
                    null === r.component
                  )
                    return void this.unsubscribeFromRouteData(t);
                  const s = (function NO(e) {
                    const n = H(e);
                    if (!n) return null;
                    const t = new ui(n);
                    return {
                      get selector() {
                        return t.selector;
                      },
                      get type() {
                        return t.componentType;
                      },
                      get inputs() {
                        return t.inputs;
                      },
                      get outputs() {
                        return t.outputs;
                      },
                      get ngContentSelectors() {
                        return t.ngContentSelectors;
                      },
                      get isStandalone() {
                        return n.standalone;
                      },
                      get isSignal() {
                        return n.signals;
                      },
                    };
                  })(r.component);
                  if (s)
                    for (const { templateName: a } of s.inputs)
                      t.activatedComponentRef.setInput(a, i[a]);
                  else this.unsubscribeFromRouteData(t);
                });
            this.outletDataSubscriptions.set(t, o);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function Ui(e, n, t) {
        if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
          const r = t.value;
          r._futureSnapshot = n.value;
          const o = (function uk(e, n, t) {
            return n.children.map((r) => {
              for (const o of t.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return Ui(e, r, o);
              return Ui(e, r);
            });
          })(e, n, t);
          return new Cn(r, o);
        }
        {
          if (e.shouldAttach(n.value)) {
            const i = e.retrieve(n.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = n.value),
                (s.children = n.children.map((a) => Ui(e, a))),
                s
              );
            }
          }
          const r = (function ck(e) {
              return new mo(
                new nt(e.url),
                new nt(e.params),
                new nt(e.queryParams),
                new nt(e.fragment),
                new nt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(n.value),
            o = n.children.map((i) => Ui(e, i));
          return new Cn(r, o);
        }
      }
      const Cf = "ngNavigationCancelingError";
      function YC(e, n) {
        const { redirectTo: t, navigationBehaviorOptions: r } = ur(n)
            ? { redirectTo: n, navigationBehaviorOptions: void 0 }
            : n,
          o = QC(!1, 0, n);
        return (o.url = t), (o.navigationBehaviorOptions = r), o;
      }
      function QC(e, n, t) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Cf] = !0), (r.cancellationCode = n), t && (r.url = t), r;
      }
      function KC(e) {
        return e && e[Cf];
      }
      let XC = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵcmp = gs({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [Gy],
            decls: 1,
            vars: 0,
            template: function (r, o) {
              1 & r && Ot(0, "router-outlet");
            },
            dependencies: [WC],
            encapsulation: 2,
          }));
        }
        return e;
      })();
      function wf(e) {
        const n = e.children && e.children.map(wf),
          t = n ? { ...e, children: n } : { ...e };
        return (
          !t.component &&
            !t.loadComponent &&
            (n || t.loadChildren) &&
            t.outlet &&
            t.outlet !== V &&
            (t.component = XC),
          t
        );
      }
      function jt(e) {
        return e.outlet || V;
      }
      function Gi(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let n = e.parent; n; n = n.parent) {
          const t = n.routeConfig;
          if (t?._loadedInjector) return t._loadedInjector;
          if (t?._injector) return t._injector;
        }
        return null;
      }
      class vk {
        constructor(n, t, r, o, i) {
          (this.routeReuseStrategy = n),
            (this.futureState = t),
            (this.currState = r),
            (this.forwardEvent = o),
            (this.inputBindingEnabled = i);
        }
        activate(n) {
          const t = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, r, n),
            Df(this.futureState.root),
            this.activateChildRoutes(t, r, n);
        }
        deactivateChildRoutes(n, t, r) {
          const o = go(t);
          n.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Object.values(o).forEach((i) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(n, t, r) {
          const o = n.value,
            i = t ? t.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(n, t, s.children);
            } else this.deactivateChildRoutes(n, t, r);
          else i && this.deactivateRouteAndItsChildren(t, r);
        }
        deactivateRouteAndItsChildren(n, t) {
          n.value.component &&
          this.routeReuseStrategy.shouldDetach(n.value.snapshot)
            ? this.detachAndStoreRouteSubtree(n, t)
            : this.deactivateRouteAndOutlet(n, t);
        }
        detachAndStoreRouteSubtree(n, t) {
          const r = t.getContext(n.value.outlet),
            o = r && n.value.component ? r.children : t,
            i = go(n);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(n.value.snapshot, {
              componentRef: s,
              route: n,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(n, t) {
          const r = t.getContext(n.value.outlet),
            o = r && n.value.component ? r.children : t,
            i = go(n);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(n, t, r) {
          const o = go(t);
          n.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new nk(i.value.snapshot));
          }),
            n.children.length && this.forwardEvent(new ek(n.value.snapshot));
        }
        activateRoutes(n, t, r) {
          const o = n.value,
            i = t ? t.value : null;
          if ((Df(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(n, t, s.children);
            } else this.activateChildRoutes(n, t, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Df(a.route.value),
                this.activateChildRoutes(n, null, s.children);
            } else {
              const a = Gi(o.snapshot);
              (s.attachRef = null),
                (s.route = o),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(n, null, s.children);
            }
          } else this.activateChildRoutes(n, null, r);
        }
      }
      class JC {
        constructor(n) {
          (this.path = n), (this.route = this.path[this.path.length - 1]);
        }
      }
      class uu {
        constructor(n, t) {
          (this.component = n), (this.route = t);
        }
      }
      function yk(e, n, t) {
        const r = e._root;
        return zi(r, n ? n._root : null, t, [r.value]);
      }
      function vo(e, n) {
        const t = Symbol(),
          r = n.get(e, t);
        return r === t
          ? "function" != typeof e ||
            (function Bb(e) {
              return null !== us(e);
            })(e)
            ? n.get(e)
            : e
          : r;
      }
      function zi(
        e,
        n,
        t,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = go(n);
        return (
          e.children.forEach((s) => {
            (function _k(
              e,
              n,
              t,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = e.value,
                s = n ? n.value : null,
                a = t ? t.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const u = (function Ck(e, n, t) {
                  if ("function" == typeof t) return t(e, n);
                  switch (t) {
                    case "pathParamsChange":
                      return !ar(e.url, n.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !ar(e.url, n.url) || !tn(e.queryParams, n.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !_f(e, n) || !tn(e.queryParams, n.queryParams);
                    default:
                      return !_f(e, n);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                u
                  ? o.canActivateChecks.push(new JC(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  zi(e, n, i.component ? (a ? a.children : null) : t, r, o),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new uu(a.outlet.component, s));
              } else
                s && qi(n, a, o),
                  o.canActivateChecks.push(new JC(r)),
                  zi(e, null, i.component ? (a ? a.children : null) : t, r, o);
            })(s, i[s.value.outlet], t, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Object.entries(i).forEach(([s, a]) => qi(a, t.getContext(s), o)),
          o
        );
      }
      function qi(e, n, t) {
        const r = go(e),
          o = e.value;
        Object.entries(r).forEach(([i, s]) => {
          qi(s, o.component ? (n ? n.children.getContext(i) : null) : n, t);
        }),
          t.canDeactivateChecks.push(
            new uu(
              o.component && n && n.outlet && n.outlet.isActivated
                ? n.outlet.component
                : null,
              o
            )
          );
      }
      function Wi(e) {
        return "function" == typeof e;
      }
      function ew(e) {
        return e instanceof Qa || "EmptyError" === e?.name;
      }
      const cu = Symbol("INITIAL_VALUE");
      function yo() {
        return $t((e) =>
          nf(
            e.map((n) =>
              n.pipe(
                lo(1),
                (function fF(...e) {
                  const n = Mo(e);
                  return Ce((t, r) => {
                    (n ? rf(e, t, n) : rf(e, t)).subscribe(r);
                  });
                })(cu)
              )
            )
          ).pipe(
            X((n) => {
              for (const t of n)
                if (!0 !== t) {
                  if (t === cu) return cu;
                  if (!1 === t || t instanceof ho) return t;
                }
              return !0;
            }),
            Vn((n) => n !== cu),
            lo(1)
          )
        );
      }
      function tw(e) {
        return (function HE(...e) {
          return eh(e);
        })(
          Fe((n) => {
            if (ur(n)) throw YC(0, n);
          }),
          X((n) => !0 === n)
        );
      }
      class lu {
        constructor(n) {
          this.segmentGroup = n || null;
        }
      }
      class nw {
        constructor(n) {
          this.urlTree = n;
        }
      }
      function Do(e) {
        return Ri(new lu(e));
      }
      function rw(e) {
        return Ri(new nw(e));
      }
      class $k {
        constructor(n, t) {
          (this.urlSerializer = n), (this.urlTree = t);
        }
        noMatchError(n) {
          return new D(4002, !1);
        }
        lineralizeSegments(n, t) {
          let r = [],
            o = t.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return O(r);
            if (o.numberOfChildren > 1 || !o.children[V])
              return Ri(new D(4e3, !1));
            o = o.children[V];
          }
        }
        applyRedirectCommands(n, t, r) {
          return this.applyRedirectCreateUrlTree(
            t,
            this.urlSerializer.parse(t),
            n,
            r
          );
        }
        applyRedirectCreateUrlTree(n, t, r, o) {
          const i = this.createSegmentGroup(n, t.root, r, o);
          return new ho(
            i,
            this.createQueryParams(t.queryParams, this.urlTree.queryParams),
            t.fragment
          );
        }
        createQueryParams(n, t) {
          const r = {};
          return (
            Object.entries(n).forEach(([o, i]) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = t[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(n, t, r, o) {
          const i = this.createSegments(n, t.segments, r, o);
          let s = {};
          return (
            Object.entries(t.children).forEach(([a, u]) => {
              s[a] = this.createSegmentGroup(n, u, r, o);
            }),
            new Q(i, s)
          );
        }
        createSegments(n, t, r, o) {
          return t.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(n, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(n, t, r) {
          const o = r[t.path.substring(1)];
          if (!o) throw new D(4001, !1);
          return o;
        }
        findOrReturn(n, t) {
          let r = 0;
          for (const o of t) {
            if (o.path === n.path) return t.splice(r), o;
            r++;
          }
          return n;
        }
      }
      const Ef = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Hk(e, n, t, r, o) {
        const i = bf(e, n, t);
        return i.matched
          ? ((r = (function dk(e, n) {
              return (
                e.providers &&
                  !e._injector &&
                  (e._injector = Jl(e.providers, n, `Route: ${e.path}`)),
                e._injector ?? n
              );
            })(n, r)),
            (function Vk(e, n, t, r) {
              const o = n.canMatch;
              return o && 0 !== o.length
                ? O(
                    o.map((s) => {
                      const a = vo(s, e);
                      return jn(
                        (function Sk(e) {
                          return e && Wi(e.canMatch);
                        })(a)
                          ? a.canMatch(n, t)
                          : e.runInContext(() => a(n, t))
                      );
                    })
                  ).pipe(yo(), tw())
                : O(!0);
            })(r, n, t).pipe(X((s) => (!0 === s ? i : { ...Ef }))))
          : O(i);
      }
      function bf(e, n, t) {
        if ("" === n.path)
          return "full" === n.pathMatch && (e.hasChildren() || t.length > 0)
            ? { ...Ef }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: t,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (n.matcher || _F)(t, e, n);
        if (!o) return { ...Ef };
        const i = {};
        Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
          i[a] = u.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: t.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function ow(e, n, t, r) {
        return t.length > 0 &&
          (function zk(e, n, t) {
            return t.some((r) => du(e, n, r) && jt(r) !== V);
          })(e, t, r)
          ? {
              segmentGroup: new Q(n, Gk(r, new Q(t, e.children))),
              slicedSegments: [],
            }
          : 0 === t.length &&
            (function qk(e, n, t) {
              return t.some((r) => du(e, n, r));
            })(e, t, r)
          ? {
              segmentGroup: new Q(e.segments, Uk(e, 0, t, r, e.children)),
              slicedSegments: t,
            }
          : { segmentGroup: new Q(e.segments, e.children), slicedSegments: t };
      }
      function Uk(e, n, t, r, o) {
        const i = {};
        for (const s of r)
          if (du(e, t, s) && !o[jt(s)]) {
            const a = new Q([], {});
            i[jt(s)] = a;
          }
        return { ...o, ...i };
      }
      function Gk(e, n) {
        const t = {};
        t[V] = n;
        for (const r of e)
          if ("" === r.path && jt(r) !== V) {
            const o = new Q([], {});
            t[jt(r)] = o;
          }
        return t;
      }
      function du(e, n, t) {
        return (
          (!(e.hasChildren() || n.length > 0) || "full" !== t.pathMatch) &&
          "" === t.path
        );
      }
      class Qk {
        constructor(n, t, r, o, i, s, a) {
          (this.injector = n),
            (this.configLoader = t),
            (this.rootComponentType = r),
            (this.config = o),
            (this.urlTree = i),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new $k(this.urlSerializer, this.urlTree));
        }
        noMatchError(n) {
          return new D(4002, !1);
        }
        recognize() {
          const n = ow(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            n,
            V
          ).pipe(
            sr((t) => {
              if (t instanceof nw)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = t.urlTree),
                  this.match(t.urlTree)
                );
              throw t instanceof lu ? this.noMatchError(t) : t;
            }),
            X((t) => {
              const r = new su(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  V,
                  this.rootComponentType,
                  null,
                  {}
                ),
                o = new Cn(r, t),
                i = new zC("", o),
                s = (function BF(e, n, t = null, r = null) {
                  return OC(RC(e), n, t, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (i.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(i._root),
                { state: i, tree: s }
              );
            })
          );
        }
        match(n) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            n.root,
            V
          ).pipe(
            sr((r) => {
              throw r instanceof lu ? this.noMatchError(r) : r;
            })
          );
        }
        inheritParamsAndData(n) {
          const t = n.value,
            r = GC(t, this.paramsInheritanceStrategy);
          (t.params = Object.freeze(r.params)),
            (t.data = Object.freeze(r.data)),
            n.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(n, t, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(n, t, r)
            : this.processSegment(n, t, r, r.segments, o, !0);
        }
        processChildren(n, t, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return Ie(o).pipe(
            Oi((i) => {
              const s = r.children[i],
                a = (function gk(e, n) {
                  const t = e.filter((r) => jt(r) === n);
                  return t.push(...e.filter((r) => jt(r) !== n)), t;
                })(t, i);
              return this.processSegmentGroup(n, a, s, i);
            }),
            (function gF(e, n) {
              return Ce(
                (function pF(e, n, t, r, o) {
                  return (i, s) => {
                    let a = t,
                      u = n,
                      c = 0;
                    i.subscribe(
                      De(
                        s,
                        (l) => {
                          const d = c++;
                          (u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u);
                        },
                        o &&
                          (() => {
                            a && s.next(u), s.complete();
                          })
                      )
                    );
                  };
                })(e, n, arguments.length >= 2, !0)
              );
            })((i, s) => (i.push(...s), i)),
            Ka(null),
            (function mF(e, n) {
              const t = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? Vn((o, i) => e(o, i, r)) : bn,
                  af(1),
                  t ? Ka(n) : DC(() => new Qa())
                );
            })(),
            Me((i) => {
              if (null === i) return Do(r);
              const s = iw(i);
              return (
                (function Kk(e) {
                  e.sort((n, t) =>
                    n.value.outlet === V
                      ? -1
                      : t.value.outlet === V
                      ? 1
                      : n.value.outlet.localeCompare(t.value.outlet)
                  );
                })(s),
                O(s)
              );
            })
          );
        }
        processSegment(n, t, r, o, i, s) {
          return Ie(t).pipe(
            Oi((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? n,
                t,
                a,
                r,
                o,
                i,
                s
              ).pipe(
                sr((u) => {
                  if (u instanceof lu) return O(null);
                  throw u;
                })
              )
            ),
            ir((a) => !!a),
            sr((a) => {
              if (ew(a))
                return (function Zk(e, n, t) {
                  return 0 === n.length && !e.children[t];
                })(r, o, i)
                  ? O([])
                  : Do(r);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(n, t, r, o, i, s, a) {
          return (function Wk(e, n, t, r) {
            return (
              !!(jt(e) === r || (r !== V && du(n, t, e))) &&
              ("**" === e.path || bf(n, e, t).matched)
            );
          })(r, o, i, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(n, o, r, i, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(n, o, t, r, i, s)
              : Do(o)
            : Do(o);
        }
        expandSegmentAgainstRouteUsingRedirect(n, t, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                n,
                t,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(n, t, r, o) {
          const i = this.applyRedirects.applyRedirectCommands(
            [],
            r.redirectTo,
            {}
          );
          return r.redirectTo.startsWith("/")
            ? rw(i)
            : this.applyRedirects.lineralizeSegments(r, i).pipe(
                Me((s) => {
                  const a = new Q(s, {});
                  return this.processSegment(n, t, a, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(n, t, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: c,
            positionalParamSegments: l,
          } = bf(t, o, i);
          if (!a) return Do(t);
          const d = this.applyRedirects.applyRedirectCommands(
            u,
            o.redirectTo,
            l
          );
          return o.redirectTo.startsWith("/")
            ? rw(d)
            : this.applyRedirects
                .lineralizeSegments(o, d)
                .pipe(
                  Me((f) => this.processSegment(n, r, t, f.concat(c), s, !1))
                );
        }
        matchSegmentAgainstRoute(n, t, r, o, i, s) {
          let a;
          if ("**" === r.path) {
            const u = o.length > 0 ? CC(o).parameters : {};
            (a = O({
              snapshot: new su(
                o,
                u,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                sw(r),
                jt(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                aw(r)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (t.children = {});
          } else
            a = Hk(t, r, o, n).pipe(
              X(
                ({
                  matched: u,
                  consumedSegments: c,
                  remainingSegments: l,
                  parameters: d,
                }) =>
                  u
                    ? {
                        snapshot: new su(
                          c,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          sw(r),
                          jt(r),
                          r.component ?? r._loadedComponent ?? null,
                          r,
                          aw(r)
                        ),
                        consumedSegments: c,
                        remainingSegments: l,
                      }
                    : null
              )
            );
          return a.pipe(
            $t((u) =>
              null === u
                ? Do(t)
                : this.getChildConfig((n = r._injector ?? n), r, o).pipe(
                    $t(({ routes: c }) => {
                      const l = r._loadedInjector ?? n,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = u,
                        { segmentGroup: p, slicedSegments: g } = ow(t, f, h, c);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(l, c, p).pipe(
                          X((C) => (null === C ? null : [new Cn(d, C)]))
                        );
                      if (0 === c.length && 0 === g.length)
                        return O([new Cn(d, [])]);
                      const y = jt(r) === i;
                      return this.processSegment(
                        l,
                        c,
                        p,
                        g,
                        y ? V : i,
                        !0
                      ).pipe(X((C) => [new Cn(d, C)]));
                    })
                  )
            )
          );
        }
        getChildConfig(n, t, r) {
          return t.children
            ? O({ routes: t.children, injector: n })
            : t.loadChildren
            ? void 0 !== t._loadedRoutes
              ? O({ routes: t._loadedRoutes, injector: t._loadedInjector })
              : (function Lk(e, n, t, r) {
                  const o = n.canLoad;
                  return void 0 === o || 0 === o.length
                    ? O(!0)
                    : O(
                        o.map((s) => {
                          const a = vo(s, e);
                          return jn(
                            (function Ek(e) {
                              return e && Wi(e.canLoad);
                            })(a)
                              ? a.canLoad(n, t)
                              : e.runInContext(() => a(n, t))
                          );
                        })
                      ).pipe(yo(), tw());
                })(n, t, r).pipe(
                  Me((o) =>
                    o
                      ? this.configLoader.loadChildren(n, t).pipe(
                          Fe((i) => {
                            (t._loadedRoutes = i.routes),
                              (t._loadedInjector = i.injector);
                          })
                        )
                      : (function Bk(e) {
                          return Ri(QC(!1, 3));
                        })()
                  )
                )
            : O({ routes: [], injector: n });
        }
      }
      function Xk(e) {
        const n = e.value.routeConfig;
        return n && "" === n.path;
      }
      function iw(e) {
        const n = [],
          t = new Set();
        for (const r of e) {
          if (!Xk(r)) {
            n.push(r);
            continue;
          }
          const o = n.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), t.add(o)) : n.push(r);
        }
        for (const r of t) {
          const o = iw(r.children);
          n.push(new Cn(r.value, o));
        }
        return n.filter((r) => !t.has(r));
      }
      function sw(e) {
        return e.data || {};
      }
      function aw(e) {
        return e.resolve || {};
      }
      function uw(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function If(e) {
        return $t((n) => {
          const t = e(n);
          return t ? Ie(t).pipe(X(() => n)) : O(n);
        });
      }
      const _o = new b("ROUTES");
      let Mf = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = E($D));
          }
          loadComponent(t) {
            if (this.componentLoaders.get(t))
              return this.componentLoaders.get(t);
            if (t._loadedComponent) return O(t._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(t);
            const r = jn(t.loadComponent()).pipe(
                X(cw),
                Fe((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(t),
                    (t._loadedComponent = i);
                }),
                uf(() => {
                  this.componentLoaders.delete(t);
                })
              ),
              o = new yC(r, () => new bt()).pipe(sf());
            return this.componentLoaders.set(t, o), o;
          }
          loadChildren(t, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return O({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = (function iL(e, n, t, r) {
                return jn(e.loadChildren()).pipe(
                  X(cw),
                  Me((o) =>
                    o instanceof Hy || Array.isArray(o)
                      ? O(o)
                      : Ie(n.compileModuleAsync(o))
                  ),
                  X((o) => {
                    r && r(e);
                    let i,
                      s,
                      a = !1;
                    return (
                      Array.isArray(o)
                        ? ((s = o), !0)
                        : ((i = o.create(t).injector),
                          (s = i
                            .get(_o, [], { optional: !0, self: !0 })
                            .flat())),
                      { routes: s.map(wf), injector: i }
                    );
                  })
                );
              })(r, this.compiler, t, this.onLoadEndListener).pipe(
                uf(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new yC(i, () => new bt()).pipe(sf());
            return this.childrenLoaders.set(r, s), s;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function cw(e) {
        return (function sL(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let fu = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.currentTransition = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new bt()),
              (this.transitionAbortSubject = new bt()),
              (this.configLoader = E(Mf)),
              (this.environmentInjector = E(mt)),
              (this.urlSerializer = E(ki)),
              (this.rootContexts = E(Hi)),
              (this.inputBindingEnabled = null !== E(au, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => O(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (o) =>
                this.events.next(new XF(o))),
              (this.configLoader.onLoadStartListener = (o) =>
                this.events.next(new KF(o)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(t) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...t, id: r });
          }
          setupNavigations(t, r, o) {
            return (
              (this.transitions = new nt({
                id: 0,
                currentUrlTree: r,
                currentRawUrl: r,
                currentBrowserUrl: r,
                extractedUrl: t.urlHandlingStrategy.extract(r),
                urlAfterRedirects: t.urlHandlingStrategy.extract(r),
                rawUrl: r,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Bi,
                restoredState: null,
                currentSnapshot: o.snapshot,
                targetSnapshot: null,
                currentRouterState: o,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                Vn((i) => 0 !== i.id),
                X((i) => ({
                  ...i,
                  extractedUrl: t.urlHandlingStrategy.extract(i.rawUrl),
                })),
                $t((i) => {
                  this.currentTransition = i;
                  let s = !1,
                    a = !1;
                  return O(i).pipe(
                    Fe((u) => {
                      this.currentNavigation = {
                        id: u.id,
                        initialUrl: u.rawUrl,
                        extractedUrl: u.extractedUrl,
                        trigger: u.source,
                        extras: u.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    $t((u) => {
                      const c = u.currentBrowserUrl.toString(),
                        l =
                          !t.navigated ||
                          u.extractedUrl.toString() !== c ||
                          c !== u.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (u.extras.onSameUrlNavigation ??
                            t.onSameUrlNavigation)
                      ) {
                        const f = "";
                        return (
                          this.events.next(
                            new po(
                              u.id,
                              this.urlSerializer.serialize(u.rawUrl),
                              f,
                              0
                            )
                          ),
                          u.resolve(null),
                          Bt
                        );
                      }
                      if (t.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                        return O(u).pipe(
                          $t((f) => {
                            const h = this.transitions?.getValue();
                            return (
                              this.events.next(
                                new ou(
                                  f.id,
                                  this.urlSerializer.serialize(f.extractedUrl),
                                  f.source,
                                  f.restoredState
                                )
                              ),
                              h !== this.transitions?.getValue()
                                ? Bt
                                : Promise.resolve(f)
                            );
                          }),
                          (function Jk(e, n, t, r, o, i) {
                            return Me((s) =>
                              (function Yk(e, n, t, r, o, i, s = "emptyOnly") {
                                return new Qk(e, n, t, r, o, s, i).recognize();
                              })(e, n, t, r, s.extractedUrl, o, i).pipe(
                                X(({ state: a, tree: u }) => ({
                                  ...s,
                                  targetSnapshot: a,
                                  urlAfterRedirects: u,
                                }))
                              )
                            );
                          })(
                            this.environmentInjector,
                            this.configLoader,
                            this.rootComponentType,
                            t.config,
                            this.urlSerializer,
                            t.paramsInheritanceStrategy
                          ),
                          Fe((f) => {
                            (i.targetSnapshot = f.targetSnapshot),
                              (i.urlAfterRedirects = f.urlAfterRedirects),
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: f.urlAfterRedirects,
                              });
                            const h = new jC(
                              f.id,
                              this.urlSerializer.serialize(f.extractedUrl),
                              this.urlSerializer.serialize(f.urlAfterRedirects),
                              f.targetSnapshot
                            );
                            this.events.next(h);
                          })
                        );
                      if (
                        l &&
                        t.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                      ) {
                        const {
                            id: f,
                            extractedUrl: h,
                            source: p,
                            restoredState: g,
                            extras: y,
                          } = u,
                          C = new ou(f, this.urlSerializer.serialize(h), p, g);
                        this.events.next(C);
                        const m = UC(0, this.rootComponentType).snapshot;
                        return (
                          (this.currentTransition = i =
                            {
                              ...u,
                              targetSnapshot: m,
                              urlAfterRedirects: h,
                              extras: {
                                ...y,
                                skipLocationChange: !1,
                                replaceUrl: !1,
                              },
                            }),
                          O(i)
                        );
                      }
                      {
                        const f = "";
                        return (
                          this.events.next(
                            new po(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              f,
                              1
                            )
                          ),
                          u.resolve(null),
                          Bt
                        );
                      }
                    }),
                    Fe((u) => {
                      const c = new WF(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(c);
                    }),
                    X(
                      (u) => (
                        (this.currentTransition = i =
                          {
                            ...u,
                            guards: yk(
                              u.targetSnapshot,
                              u.currentSnapshot,
                              this.rootContexts
                            ),
                          }),
                        i
                      )
                    ),
                    (function Tk(e, n) {
                      return Me((t) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: o,
                          guards: {
                            canActivateChecks: i,
                            canDeactivateChecks: s,
                          },
                        } = t;
                        return 0 === s.length && 0 === i.length
                          ? O({ ...t, guardsResult: !0 })
                          : (function Nk(e, n, t, r) {
                              return Ie(e).pipe(
                                Me((o) =>
                                  (function kk(e, n, t, r, o) {
                                    const i =
                                      n && n.routeConfig
                                        ? n.routeConfig.canDeactivate
                                        : null;
                                    return i && 0 !== i.length
                                      ? O(
                                          i.map((a) => {
                                            const u = Gi(n) ?? o,
                                              c = vo(a, u);
                                            return jn(
                                              (function Mk(e) {
                                                return e && Wi(e.canDeactivate);
                                              })(c)
                                                ? c.canDeactivate(e, n, t, r)
                                                : u.runInContext(() =>
                                                    c(e, n, t, r)
                                                  )
                                            ).pipe(ir());
                                          })
                                        ).pipe(yo())
                                      : O(!0);
                                  })(o.component, o.route, t, n, r)
                                ),
                                ir((o) => !0 !== o, !0)
                              );
                            })(s, r, o, e).pipe(
                              Me((a) =>
                                a &&
                                (function wk(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function xk(e, n, t, r) {
                                      return Ie(n).pipe(
                                        Oi((o) =>
                                          rf(
                                            (function Ok(e, n) {
                                              return (
                                                null !== e && n && n(new JF(e)),
                                                O(!0)
                                              );
                                            })(o.route.parent, r),
                                            (function Rk(e, n) {
                                              return (
                                                null !== e && n && n(new tk(e)),
                                                O(!0)
                                              );
                                            })(o.route, r),
                                            (function Fk(e, n, t) {
                                              const r = n[n.length - 1],
                                                i = n
                                                  .slice(0, n.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function Dk(e) {
                                                      const n = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return n && 0 !== n.length
                                                        ? { node: e, guards: n }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    vC(() =>
                                                      O(
                                                        s.guards.map((u) => {
                                                          const c =
                                                              Gi(s.node) ?? t,
                                                            l = vo(u, c);
                                                          return jn(
                                                            (function Ik(e) {
                                                              return (
                                                                e &&
                                                                Wi(
                                                                  e.canActivateChild
                                                                )
                                                              );
                                                            })(l)
                                                              ? l.canActivateChild(
                                                                  r,
                                                                  e
                                                                )
                                                              : c.runInContext(
                                                                  () => l(r, e)
                                                                )
                                                          ).pipe(ir());
                                                        })
                                                      ).pipe(yo())
                                                    )
                                                  );
                                              return O(i).pipe(yo());
                                            })(e, o.path, t),
                                            (function Pk(e, n, t) {
                                              const r = n.routeConfig
                                                ? n.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return O(!0);
                                              const o = r.map((i) =>
                                                vC(() => {
                                                  const s = Gi(n) ?? t,
                                                    a = vo(i, s);
                                                  return jn(
                                                    (function bk(e) {
                                                      return (
                                                        e && Wi(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(n, e)
                                                      : s.runInContext(() =>
                                                          a(n, e)
                                                        )
                                                  ).pipe(ir());
                                                })
                                              );
                                              return O(o).pipe(yo());
                                            })(e, o.route, t)
                                          )
                                        ),
                                        ir((o) => !0 !== o, !0)
                                      );
                                    })(r, i, e, n)
                                  : O(a)
                              ),
                              X((a) => ({ ...t, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (u) => this.events.next(u)),
                    Fe((u) => {
                      if (
                        ((i.guardsResult = u.guardsResult), ur(u.guardsResult))
                      )
                        throw YC(0, u.guardsResult);
                      const c = new ZF(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                        !!u.guardsResult
                      );
                      this.events.next(c);
                    }),
                    Vn(
                      (u) =>
                        !!u.guardsResult ||
                        (this.cancelNavigationTransition(u, "", 3), !1)
                    ),
                    If((u) => {
                      if (u.guards.canActivateChecks.length)
                        return O(u).pipe(
                          Fe((c) => {
                            const l = new YF(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              this.urlSerializer.serialize(c.urlAfterRedirects),
                              c.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          $t((c) => {
                            let l = !1;
                            return O(c).pipe(
                              (function eL(e, n) {
                                return Me((t) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: o },
                                  } = t;
                                  if (!o.length) return O(t);
                                  let i = 0;
                                  return Ie(o).pipe(
                                    Oi((s) =>
                                      (function tL(e, n, t, r) {
                                        const o = e.routeConfig,
                                          i = e._resolve;
                                        return (
                                          void 0 !== o?.title &&
                                            !uw(o) &&
                                            (i[Pi] = o.title),
                                          (function nL(e, n, t, r) {
                                            const o = (function rL(e) {
                                              return [
                                                ...Object.keys(e),
                                                ...Object.getOwnPropertySymbols(
                                                  e
                                                ),
                                              ];
                                            })(e);
                                            if (0 === o.length) return O({});
                                            const i = {};
                                            return Ie(o).pipe(
                                              Me((s) =>
                                                (function oL(e, n, t, r) {
                                                  const o = Gi(n) ?? r,
                                                    i = vo(e, o);
                                                  return jn(
                                                    i.resolve
                                                      ? i.resolve(n, t)
                                                      : o.runInContext(() =>
                                                          i(n, t)
                                                        )
                                                  );
                                                })(e[s], n, t, r).pipe(
                                                  ir(),
                                                  Fe((a) => {
                                                    i[s] = a;
                                                  })
                                                )
                                              ),
                                              af(1),
                                              (function vF(e) {
                                                return X(() => e);
                                              })(i),
                                              sr((s) => (ew(s) ? Bt : Ri(s)))
                                            );
                                          })(i, e, n, r).pipe(
                                            X(
                                              (s) => (
                                                (e._resolvedData = s),
                                                (e.data = GC(e, t).resolve),
                                                o &&
                                                  uw(o) &&
                                                  (e.data[Pi] = o.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, e, n)
                                    ),
                                    Fe(() => i++),
                                    af(1),
                                    Me((s) => (i === o.length ? O(t) : Bt))
                                  );
                                });
                              })(
                                t.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              Fe({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    this.cancelNavigationTransition(c, "", 2);
                                },
                              })
                            );
                          }),
                          Fe((c) => {
                            const l = new QF(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              this.urlSerializer.serialize(c.urlAfterRedirects),
                              c.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    If((u) => {
                      const c = (l) => {
                        const d = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          d.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              Fe((f) => {
                                l.component = f;
                              }),
                              X(() => {})
                            )
                          );
                        for (const f of l.children) d.push(...c(f));
                        return d;
                      };
                      return nf(c(u.targetSnapshot.root)).pipe(Ka(), lo(1));
                    }),
                    If(() => this.afterPreactivation()),
                    X((u) => {
                      const c = (function ak(e, n, t) {
                        const r = Ui(e, n._root, t ? t._root : void 0);
                        return new HC(r, n);
                      })(
                        t.routeReuseStrategy,
                        u.targetSnapshot,
                        u.currentRouterState
                      );
                      return (
                        (this.currentTransition = i =
                          { ...u, targetRouterState: c }),
                        i
                      );
                    }),
                    Fe(() => {
                      this.events.next(new pf());
                    }),
                    ((e, n, t, r) =>
                      X(
                        (o) => (
                          new vk(
                            n,
                            o.targetRouterState,
                            o.currentRouterState,
                            t,
                            r
                          ).activate(e),
                          o
                        )
                      ))(
                      this.rootContexts,
                      t.routeReuseStrategy,
                      (u) => this.events.next(u),
                      this.inputBindingEnabled
                    ),
                    lo(1),
                    Fe({
                      next: (u) => {
                        (s = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          this.events.next(
                            new Bn(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              this.urlSerializer.serialize(u.urlAfterRedirects)
                            )
                          ),
                          t.titleStrategy?.updateTitle(
                            u.targetRouterState.snapshot
                          ),
                          u.resolve(!0);
                      },
                      complete: () => {
                        s = !0;
                      },
                    }),
                    (function yF(e) {
                      return Ce((n, t) => {
                        tt(e).subscribe(De(t, () => t.complete(), Mu)),
                          !t.closed && n.subscribe(t);
                      });
                    })(
                      this.transitionAbortSubject.pipe(
                        Fe((u) => {
                          throw u;
                        })
                      )
                    ),
                    uf(() => {
                      s || a || this.cancelNavigationTransition(i, "", 1),
                        this.currentNavigation?.id === i.id &&
                          (this.currentNavigation = null);
                    }),
                    sr((u) => {
                      if (((a = !0), KC(u)))
                        this.events.next(
                          new $i(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            u.message,
                            u.cancellationCode
                          )
                        ),
                          (function lk(e) {
                            return KC(e) && ur(e.url);
                          })(u)
                            ? this.events.next(new gf(u.url))
                            : i.resolve(!1);
                      else {
                        this.events.next(
                          new iu(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            u,
                            i.targetSnapshot ?? void 0
                          )
                        );
                        try {
                          i.resolve(t.errorHandler(u));
                        } catch (c) {
                          i.reject(c);
                        }
                      }
                      return Bt;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(t, r, o) {
            const i = new $i(
              t.id,
              this.urlSerializer.serialize(t.extractedUrl),
              r,
              o
            );
            this.events.next(i), t.resolve(!1);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function lw(e) {
        return e !== Bi;
      }
      let dw = (() => {
          class e {
            buildTitle(t) {
              let r,
                o = t.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === V));
              return r;
            }
            getResolvedTitleForRoute(t) {
              return t.data[Pi];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: function () {
                return E(aL);
              },
              providedIn: "root",
            }));
          }
          return e;
        })(),
        aL = (() => {
          class e extends dw {
            constructor(t) {
              super(), (this.title = t);
            }
            updateTitle(t) {
              const r = this.buildTitle(t);
              void 0 !== r && this.title.setTitle(r);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(cC));
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        uL = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: function () {
                return E(lL);
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      class cL {
        shouldDetach(n) {
          return !1;
        }
        store(n, t) {}
        shouldAttach(n) {
          return !1;
        }
        retrieve(n) {
          return null;
        }
        shouldReuseRoute(n, t) {
          return n.routeConfig === t.routeConfig;
        }
      }
      let lL = (() => {
        class e extends cL {
          static #e = (this.ɵfac = (function () {
            let t;
            return function (o) {
              return (t || (t = xe(e)))(o || e);
            };
          })());
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const hu = new b("", { providedIn: "root", factory: () => ({}) });
      let dL = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: function () {
                return E(fL);
              },
              providedIn: "root",
            }));
          }
          return e;
        })(),
        fL = (() => {
          class e {
            shouldProcessUrl(t) {
              return !0;
            }
            extract(t) {
              return t;
            }
            merge(t, r) {
              return t;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })();
      var Zi = (function (e) {
        return (
          (e[(e.COMPLETE = 0)] = "COMPLETE"),
          (e[(e.FAILED = 1)] = "FAILED"),
          (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
          e
        );
      })(Zi || {});
      function fw(e, n) {
        e.events
          .pipe(
            Vn(
              (t) =>
                t instanceof Bn ||
                t instanceof $i ||
                t instanceof iu ||
                t instanceof po
            ),
            X((t) =>
              t instanceof Bn || t instanceof po
                ? Zi.COMPLETE
                : t instanceof $i && (0 === t.code || 1 === t.code)
                ? Zi.REDIRECTING
                : Zi.FAILED
            ),
            Vn((t) => t !== Zi.REDIRECTING),
            lo(1)
          )
          .subscribe(() => {
            n();
          });
      }
      function hL(e) {
        throw e;
      }
      function pL(e, n, t) {
        return n.parse("/");
      }
      const gL = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        mL = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let Et = (() => {
        class e {
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            return "computed" !== this.canceledNavigationResolution
              ? this.currentPageId
              : this.location.getState()?.ɵrouterPageId ?? this.currentPageId;
          }
          get events() {
            return this._events;
          }
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = E(jD)),
              (this.isNgZoneEnabled = !1),
              (this._events = new bt()),
              (this.options = E(hu, { optional: !0 }) || {}),
              (this.pendingTasks = E(BD)),
              (this.errorHandler = this.options.errorHandler || hL),
              (this.malformedUriErrorHandler =
                this.options.malformedUriErrorHandler || pL),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.urlHandlingStrategy = E(dL)),
              (this.routeReuseStrategy = E(uL)),
              (this.titleStrategy = E(dw)),
              (this.onSameUrlNavigation =
                this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy =
                this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace"),
              (this.config = E(_o, { optional: !0 })?.flat() ?? []),
              (this.navigationTransitions = E(fu)),
              (this.urlSerializer = E(ki)),
              (this.location = E(xd)),
              (this.componentInputBindingEnabled = !!E(au, { optional: !0 })),
              (this.eventsSubscription = new et()),
              (this.isNgZoneEnabled =
                E(oe) instanceof oe && oe.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new ho()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = UC(0, null)),
              this.navigationTransitions
                .setupNavigations(this, this.currentUrlTree, this.routerState)
                .subscribe(
                  (t) => {
                    (this.lastSuccessfulId = t.id),
                      (this.currentPageId = this.browserPageId);
                  },
                  (t) => {
                    this.console.warn(`Unhandled Navigation Error: ${t}`);
                  }
                ),
              this.subscribeToNavigationEvents();
          }
          subscribeToNavigationEvents() {
            const t = this.navigationTransitions.events.subscribe((r) => {
              try {
                const { currentTransition: o } = this.navigationTransitions;
                if (null === o) return void (hw(r) && this._events.next(r));
                if (r instanceof ou)
                  lw(o.source) && (this.browserUrlTree = o.extractedUrl);
                else if (r instanceof po) this.rawUrlTree = o.rawUrl;
                else if (r instanceof jC) {
                  if ("eager" === this.urlUpdateStrategy) {
                    if (!o.extras.skipLocationChange) {
                      const i = this.urlHandlingStrategy.merge(
                        o.urlAfterRedirects,
                        o.rawUrl
                      );
                      this.setBrowserUrl(i, o);
                    }
                    this.browserUrlTree = o.urlAfterRedirects;
                  }
                } else if (r instanceof pf)
                  (this.currentUrlTree = o.urlAfterRedirects),
                    (this.rawUrlTree = this.urlHandlingStrategy.merge(
                      o.urlAfterRedirects,
                      o.rawUrl
                    )),
                    (this.routerState = o.targetRouterState),
                    "deferred" === this.urlUpdateStrategy &&
                      (o.extras.skipLocationChange ||
                        this.setBrowserUrl(this.rawUrlTree, o),
                      (this.browserUrlTree = o.urlAfterRedirects));
                else if (r instanceof $i)
                  0 !== r.code && 1 !== r.code && (this.navigated = !0),
                    (3 === r.code || 2 === r.code) && this.restoreHistory(o);
                else if (r instanceof gf) {
                  const i = this.urlHandlingStrategy.merge(
                      r.url,
                      o.currentRawUrl
                    ),
                    s = {
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        "eager" === this.urlUpdateStrategy || lw(o.source),
                    };
                  this.scheduleNavigation(i, Bi, null, s, {
                    resolve: o.resolve,
                    reject: o.reject,
                    promise: o.promise,
                  });
                }
                r instanceof iu && this.restoreHistory(o, !0),
                  r instanceof Bn && (this.navigated = !0),
                  hw(r) && this._events.next(r);
              } catch (o) {
                this.navigationTransitions.transitionAbortSubject.next(o);
              }
            });
            this.eventsSubscription.add(t);
          }
          resetRootComponentType(t) {
            (this.routerState.root.component = t),
              (this.navigationTransitions.rootComponentType = t);
          }
          initialNavigation() {
            if (
              (this.setUpLocationChangeListener(),
              !this.navigationTransitions.hasRequestedNavigation)
            ) {
              const t = this.location.getState();
              this.navigateToSyncWithBrowser(this.location.path(!0), Bi, t);
            }
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((t) => {
                const r = "popstate" === t.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    this.navigateToSyncWithBrowser(t.url, r, t.state);
                  }, 0);
              }));
          }
          navigateToSyncWithBrowser(t, r, o) {
            const i = { replaceUrl: !0 },
              s = o?.navigationId ? o : null;
            if (o) {
              const u = { ...o };
              delete u.navigationId,
                delete u.ɵrouterPageId,
                0 !== Object.keys(u).length && (i.state = u);
            }
            const a = this.parseUrl(t);
            this.scheduleNavigation(a, r, s, i);
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation;
          }
          resetConfig(t) {
            (this.config = t.map(wf)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0),
              this.eventsSubscription.unsubscribe();
          }
          createUrlTree(t, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              c = u ? this.currentUrlTree.fragment : s;
            let d,
              l = null;
            switch (a) {
              case "merge":
                l = { ...this.currentUrlTree.queryParams, ...i };
                break;
              case "preserve":
                l = this.currentUrlTree.queryParams;
                break;
              default:
                l = i || null;
            }
            null !== l && (l = this.removeEmptyProps(l));
            try {
              d = RC(o ? o.snapshot : this.routerState.snapshot.root);
            } catch {
              ("string" != typeof t[0] || !t[0].startsWith("/")) && (t = []),
                (d = this.currentUrlTree.root);
            }
            return OC(d, t, l, c ?? null);
          }
          navigateByUrl(t, r = { skipLocationChange: !1 }) {
            const o = ur(t) ? t : this.parseUrl(t),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, Bi, null, r);
          }
          navigate(t, r = { skipLocationChange: !1 }) {
            return (
              (function vL(e) {
                for (let n = 0; n < e.length; n++)
                  if (null == e[n]) throw new D(4008, !1);
              })(t),
              this.navigateByUrl(this.createUrlTree(t, r), r)
            );
          }
          serializeUrl(t) {
            return this.urlSerializer.serialize(t);
          }
          parseUrl(t) {
            let r;
            try {
              r = this.urlSerializer.parse(t);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, t);
            }
            return r;
          }
          isActive(t, r) {
            let o;
            if (((o = !0 === r ? { ...gL } : !1 === r ? { ...mL } : r), ur(t)))
              return EC(this.currentUrlTree, t, o);
            const i = this.parseUrl(t);
            return EC(this.currentUrlTree, i, o);
          }
          removeEmptyProps(t) {
            return Object.keys(t).reduce((r, o) => {
              const i = t[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          scheduleNavigation(t, r, o, i, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, u, c;
            s
              ? ((a = s.resolve), (u = s.reject), (c = s.promise))
              : (c = new Promise((d, f) => {
                  (a = d), (u = f);
                }));
            const l = this.pendingTasks.add();
            return (
              fw(this, () => {
                queueMicrotask(() => this.pendingTasks.remove(l));
              }),
              this.navigationTransitions.handleNavigationRequest({
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                currentBrowserUrl: this.browserUrlTree,
                rawUrl: t,
                extras: i,
                resolve: a,
                reject: u,
                promise: c,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              c.catch((d) => Promise.reject(d))
            );
          }
          setBrowserUrl(t, r) {
            const o = this.urlSerializer.serialize(t);
            if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
              const s = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId),
              };
              this.location.replaceState(o, "", s);
            } else {
              const i = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId + 1),
              };
              this.location.go(o, "", i);
            }
          }
          restoreHistory(t, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i = this.currentPageId - this.browserPageId;
              0 !== i
                ? this.location.historyGo(i)
                : this.currentUrlTree ===
                    this.getCurrentNavigation()?.finalUrl &&
                  0 === i &&
                  (this.resetState(t),
                  (this.browserUrlTree = t.currentUrlTree),
                  this.resetUrlToCurrentUrlTree());
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(t), this.resetUrlToCurrentUrlTree());
          }
          resetState(t) {
            (this.routerState = t.currentRouterState),
              (this.currentUrlTree = t.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                t.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          generateNgRouterState(t, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: t, ɵrouterPageId: r }
              : { navigationId: t };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function hw(e) {
        return !(e instanceof pf || e instanceof gf);
      }
      class pw {}
      let _L = (() => {
        class e {
          constructor(t, r, o, i, s) {
            (this.router = t),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Vn((t) => t instanceof Bn),
                Oi(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(t, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = Jl(i.providers, t, `Route: ${i.path}`));
              const s = i._injector ?? t,
                a = i._loadedInjector ?? s;
              ((i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
                (i.loadComponent && !i._loadedComponent)) &&
                o.push(this.preloadConfig(s, i)),
                (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return Ie(o).pipe(fr());
          }
          preloadConfig(t, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(t, r)
                  : O(null);
              const i = o.pipe(
                Me((s) =>
                  null === s
                    ? O(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? t, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? Ie([i, this.loader.loadComponent(r)]).pipe(fr())
                : i;
            });
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(Et), S($D), S(mt), S(pw), S(Mf));
          });
          static #t = (this.ɵprov = M({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const Af = new b("");
      let gw = (() => {
        class e {
          constructor(t, r, o, i, s = {}) {
            (this.urlSerializer = t),
              (this.transitions = r),
              (this.viewportScroller = o),
              (this.zone = i),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof ou
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = t.navigationTrigger),
                  (this.restoredId = t.restoredState
                    ? t.restoredState.navigationId
                    : 0))
                : t instanceof Bn
                ? ((this.lastId = t.id),
                  this.scheduleScrollEvent(
                    t,
                    this.urlSerializer.parse(t.urlAfterRedirects).fragment
                  ))
                : t instanceof po &&
                  0 === t.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    t,
                    this.urlSerializer.parse(t.url).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof BC &&
                (t.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(t.position)
                  : t.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(t.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(t, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new BC(
                      t,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
          static #e = (this.ɵfac = function (r) {
            !(function Tm() {
              throw new Error("invalid");
            })();
          });
          static #t = (this.ɵprov = M({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function wn(e, n) {
        return { ɵkind: e, ɵproviders: n };
      }
      function vw() {
        const e = E(ut);
        return (n) => {
          const t = e.get(ao);
          if (n !== t.components[0]) return;
          const r = e.get(Et),
            o = e.get(yw);
          1 === e.get(Tf) && r.initialNavigation(),
            e.get(Dw, null, j.Optional)?.setUpPreloading(),
            e.get(Af, null, j.Optional)?.init(),
            r.resetRootComponentType(t.componentTypes[0]),
            o.closed || (o.next(), o.complete(), o.unsubscribe());
        };
      }
      const yw = new b("", { factory: () => new bt() }),
        Tf = new b("", { providedIn: "root", factory: () => 1 }),
        Dw = new b("");
      function bL(e) {
        return wn(0, [
          { provide: Dw, useExisting: _L },
          { provide: pw, useExisting: e },
        ]);
      }
      const _w = new b("ROUTER_FORROOT_GUARD"),
        ML = [
          xd,
          { provide: ki, useClass: cf },
          Et,
          Hi,
          {
            provide: mo,
            useFactory: function mw(e) {
              return e.routerState.root;
            },
            deps: [Et],
          },
          Mf,
          [],
        ];
      function SL() {
        return new ZD("Router", Et);
      }
      let Cw = (() => {
        class e {
          constructor(t) {}
          static forRoot(t, r) {
            return {
              ngModule: e,
              providers: [
                ML,
                [],
                { provide: _o, multi: !0, useValue: t },
                {
                  provide: _w,
                  useFactory: xL,
                  deps: [[Et, new Os(), new Ps()]],
                },
                { provide: hu, useValue: r || {} },
                r?.useHash
                  ? { provide: or, useClass: FO }
                  : { provide: or, useClass: b_ },
                {
                  provide: Af,
                  useFactory: () => {
                    const e = E(tP),
                      n = E(oe),
                      t = E(hu),
                      r = E(fu),
                      o = E(ki);
                    return (
                      t.scrollOffset && e.setOffset(t.scrollOffset),
                      new gw(o, r, e, n, t)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? bL(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: ZD, multi: !0, useFactory: SL },
                r?.initialNavigation ? RL(r) : [],
                r?.bindToComponentInputs
                  ? wn(8, [ZC, { provide: au, useExisting: ZC }]).ɵproviders
                  : [],
                [
                  { provide: ww, useFactory: vw },
                  { provide: Cd, multi: !0, useExisting: ww },
                ],
              ],
            };
          }
          static forChild(t) {
            return {
              ngModule: e,
              providers: [{ provide: _o, multi: !0, useValue: t }],
            };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(_w, 8));
          });
          static #t = (this.ɵmod = St({ type: e }));
          static #n = (this.ɵinj = ft({}));
        }
        return e;
      })();
      function xL(e) {
        return "guarded";
      }
      function RL(e) {
        return [
          "disabled" === e.initialNavigation
            ? wn(3, [
                {
                  provide: hd,
                  multi: !0,
                  useFactory: () => {
                    const n = E(Et);
                    return () => {
                      n.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Tf, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? wn(2, [
                { provide: Tf, useValue: 0 },
                {
                  provide: hd,
                  multi: !0,
                  deps: [ut],
                  useFactory: (n) => {
                    const t = n.get(OO, Promise.resolve());
                    return () =>
                      t.then(
                        () =>
                          new Promise((r) => {
                            const o = n.get(Et),
                              i = n.get(yw);
                            fw(o, () => {
                              r(!0);
                            }),
                              (n.get(fu).afterPreactivation = () => (
                                r(!0), i.closed ? O(void 0) : i
                              )),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const ww = new b(""),
        PL = [];
      let FL = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({ imports: [Cw.forRoot(PL), Cw] }));
          }
          return e;
        })(),
        Ew = (() => {
          class e {
            constructor(t, r) {
              (this._renderer = t),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(t, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, t, r);
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            setDisabledState(t) {
              this.setProperty("disabled", t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(fn), _(at));
            });
            static #t = (this.ɵdir = R({ type: e }));
          }
          return e;
        })(),
        cr = (() => {
          class e extends Ew {
            static #e = (this.ɵfac = (function () {
              let t;
              return function (o) {
                return (t || (t = xe(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = R({ type: e, features: [Y] }));
          }
          return e;
        })();
      const rn = new b("NgValueAccessor"),
        VL = { provide: rn, useExisting: te(() => pu), multi: !0 },
        BL = new b("CompositionEventMode");
      let pu = (() => {
        class e extends Ew {
          constructor(t, r, o) {
            super(t, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function jL() {
                  const e = kn() ? kn().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(t) {
            this.setProperty("value", t ?? "");
          }
          _handleInput(t) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(t);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(t) {
            (this._composing = !1), this._compositionMode && this.onChange(t);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(fn), _(at), _(BL, 8));
          });
          static #t = (this.ɵdir = R({
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
            hostBindings: function (r, o) {
              1 & r &&
                de("input", function (s) {
                  return o._handleInput(s.target.value);
                })("blur", function () {
                  return o.onTouched();
                })("compositionstart", function () {
                  return o._compositionStart();
                })("compositionend", function (s) {
                  return o._compositionEnd(s.target.value);
                });
            },
            features: [ce([VL]), Y],
          }));
        }
        return e;
      })();
      function $n(e) {
        return (
          null == e ||
          (("string" == typeof e || Array.isArray(e)) && 0 === e.length)
        );
      }
      function Iw(e) {
        return null != e && "number" == typeof e.length;
      }
      const ke = new b("NgValidators"),
        Hn = new b("NgAsyncValidators"),
        $L =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class Mw {
        static min(n) {
          return (function Sw(e) {
            return (n) => {
              if ($n(n.value) || $n(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t < e
                ? { min: { min: e, actual: n.value } }
                : null;
            };
          })(n);
        }
        static max(n) {
          return (function Aw(e) {
            return (n) => {
              if ($n(n.value) || $n(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t > e
                ? { max: { max: e, actual: n.value } }
                : null;
            };
          })(n);
        }
        static required(n) {
          return (function Tw(e) {
            return $n(e.value) ? { required: !0 } : null;
          })(n);
        }
        static requiredTrue(n) {
          return (function Nw(e) {
            return !0 === e.value ? null : { required: !0 };
          })(n);
        }
        static email(n) {
          return (function xw(e) {
            return $n(e.value) || $L.test(e.value) ? null : { email: !0 };
          })(n);
        }
        static minLength(n) {
          return (function Rw(e) {
            return (n) =>
              $n(n.value) || !Iw(n.value)
                ? null
                : n.value.length < e
                ? {
                    minlength: {
                      requiredLength: e,
                      actualLength: n.value.length,
                    },
                  }
                : null;
          })(n);
        }
        static maxLength(n) {
          return (function Ow(e) {
            return (n) =>
              Iw(n.value) && n.value.length > e
                ? {
                    maxlength: {
                      requiredLength: e,
                      actualLength: n.value.length,
                    },
                  }
                : null;
          })(n);
        }
        static pattern(n) {
          return (function Pw(e) {
            if (!e) return gu;
            let n, t;
            return (
              "string" == typeof e
                ? ((t = ""),
                  "^" !== e.charAt(0) && (t += "^"),
                  (t += e),
                  "$" !== e.charAt(e.length - 1) && (t += "$"),
                  (n = new RegExp(t)))
                : ((t = e.toString()), (n = e)),
              (r) => {
                if ($n(r.value)) return null;
                const o = r.value;
                return n.test(o)
                  ? null
                  : { pattern: { requiredPattern: t, actualValue: o } };
              }
            );
          })(n);
        }
        static nullValidator(n) {
          return null;
        }
        static compose(n) {
          return Bw(n);
        }
        static composeAsync(n) {
          return $w(n);
        }
      }
      function gu(e) {
        return null;
      }
      function Fw(e) {
        return null != e;
      }
      function kw(e) {
        return pi(e) ? Ie(e) : e;
      }
      function Lw(e) {
        let n = {};
        return (
          e.forEach((t) => {
            n = null != t ? { ...n, ...t } : n;
          }),
          0 === Object.keys(n).length ? null : n
        );
      }
      function Vw(e, n) {
        return n.map((t) => t(e));
      }
      function jw(e) {
        return e.map((n) =>
          (function HL(e) {
            return !e.validate;
          })(n)
            ? n
            : (t) => n.validate(t)
        );
      }
      function Bw(e) {
        if (!e) return null;
        const n = e.filter(Fw);
        return 0 == n.length
          ? null
          : function (t) {
              return Lw(Vw(t, n));
            };
      }
      function Nf(e) {
        return null != e ? Bw(jw(e)) : null;
      }
      function $w(e) {
        if (!e) return null;
        const n = e.filter(Fw);
        return 0 == n.length
          ? null
          : function (t) {
              return (function kL(...e) {
                const n = yh(e),
                  { args: t, keys: r } = hC(e),
                  o = new ye((i) => {
                    const { length: s } = t;
                    if (!s) return void i.complete();
                    const a = new Array(s);
                    let u = s,
                      c = s;
                    for (let l = 0; l < s; l++) {
                      let d = !1;
                      tt(t[l]).subscribe(
                        De(
                          i,
                          (f) => {
                            d || ((d = !0), c--), (a[l] = f);
                          },
                          () => u--,
                          void 0,
                          () => {
                            (!u || !d) &&
                              (c || i.next(r ? gC(r, a) : a), i.complete());
                          }
                        )
                      );
                    }
                  });
                return n ? o.pipe(pC(n)) : o;
              })(Vw(t, n).map(kw)).pipe(X(Lw));
            };
      }
      function xf(e) {
        return null != e ? $w(jw(e)) : null;
      }
      function Hw(e, n) {
        return null === e ? [n] : Array.isArray(e) ? [...e, n] : [e, n];
      }
      function Uw(e) {
        return e._rawValidators;
      }
      function Gw(e) {
        return e._rawAsyncValidators;
      }
      function Rf(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function mu(e, n) {
        return Array.isArray(e) ? e.includes(n) : e === n;
      }
      function zw(e, n) {
        const t = Rf(n);
        return (
          Rf(e).forEach((o) => {
            mu(t, o) || t.push(o);
          }),
          t
        );
      }
      function qw(e, n) {
        return Rf(n).filter((t) => !mu(e, t));
      }
      class Ww {
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
        _setValidators(n) {
          (this._rawValidators = n || []),
            (this._composedValidatorFn = Nf(this._rawValidators));
        }
        _setAsyncValidators(n) {
          (this._rawAsyncValidators = n || []),
            (this._composedAsyncValidatorFn = xf(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(n) {
          this._onDestroyCallbacks.push(n);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((n) => n()),
            (this._onDestroyCallbacks = []);
        }
        reset(n = void 0) {
          this.control && this.control.reset(n);
        }
        hasError(n, t) {
          return !!this.control && this.control.hasError(n, t);
        }
        getError(n, t) {
          return this.control ? this.control.getError(n, t) : null;
        }
      }
      class ze extends Ww {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Un extends Ww {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class Zw {
        constructor(n) {
          this._cd = n;
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
      }
      let Yw = (() => {
          class e extends Zw {
            constructor(t) {
              super(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(Un, 2));
            });
            static #t = (this.ɵdir = R({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (r, o) {
                2 & r &&
                  _a("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                    "ng-pristine",
                    o.isPristine
                  )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                    "ng-invalid",
                    o.isInvalid
                  )("ng-pending", o.isPending);
              },
              features: [Y],
            }));
          }
          return e;
        })(),
        Qw = (() => {
          class e extends Zw {
            constructor(t) {
              super(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(ze, 10));
            });
            static #t = (this.ɵdir = R({
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
              hostBindings: function (r, o) {
                2 & r &&
                  _a("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                    "ng-pristine",
                    o.isPristine
                  )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                    "ng-invalid",
                    o.isInvalid
                  )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
              },
              features: [Y],
            }));
          }
          return e;
        })();
      const Yi = "VALID",
        yu = "INVALID",
        Co = "PENDING",
        Qi = "DISABLED";
      function Ff(e) {
        return (Du(e) ? e.validators : e) || null;
      }
      function kf(e, n) {
        return (Du(n) ? n.asyncValidators : e) || null;
      }
      function Du(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      function Xw(e, n, t) {
        const r = e.controls;
        if (!(n ? Object.keys(r) : r).length) throw new D(1e3, "");
        if (!r[t]) throw new D(1001, "");
      }
      function Jw(e, n, t) {
        e._forEachChild((r, o) => {
          if (void 0 === t[o]) throw new D(1002, "");
        });
      }
      class _u {
        constructor(n, t) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(n),
            this._assignAsyncValidators(t);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(n) {
          this._rawValidators = this._composedValidatorFn = n;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(n) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = n;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Yi;
        }
        get invalid() {
          return this.status === yu;
        }
        get pending() {
          return this.status == Co;
        }
        get disabled() {
          return this.status === Qi;
        }
        get enabled() {
          return this.status !== Qi;
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
        setValidators(n) {
          this._assignValidators(n);
        }
        setAsyncValidators(n) {
          this._assignAsyncValidators(n);
        }
        addValidators(n) {
          this.setValidators(zw(n, this._rawValidators));
        }
        addAsyncValidators(n) {
          this.setAsyncValidators(zw(n, this._rawAsyncValidators));
        }
        removeValidators(n) {
          this.setValidators(qw(n, this._rawValidators));
        }
        removeAsyncValidators(n) {
          this.setAsyncValidators(qw(n, this._rawAsyncValidators));
        }
        hasValidator(n) {
          return mu(this._rawValidators, n);
        }
        hasAsyncValidator(n) {
          return mu(this._rawAsyncValidators, n);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(n = {}) {
          (this.touched = !0),
            this._parent && !n.onlySelf && this._parent.markAsTouched(n);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((n) => n.markAllAsTouched());
        }
        markAsUntouched(n = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((t) => {
              t.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        markAsDirty(n = {}) {
          (this.pristine = !1),
            this._parent && !n.onlySelf && this._parent.markAsDirty(n);
        }
        markAsPristine(n = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((t) => {
              t.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        markAsPending(n = {}) {
          (this.status = Co),
            !1 !== n.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !n.onlySelf && this._parent.markAsPending(n);
        }
        disable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = Qi),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...n, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== n.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = Yi),
            this._forEachChild((r) => {
              r.enable({ ...n, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: n.emitEvent,
            }),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(n) {
          this._parent &&
            !n.onlySelf &&
            (this._parent.updateValueAndValidity(n),
            n.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(n) {
          this._parent = n;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(n = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Yi || this.status === Co) &&
                this._runAsyncValidator(n.emitEvent)),
            !1 !== n.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !n.onlySelf &&
              this._parent.updateValueAndValidity(n);
        }
        _updateTreeValidity(n = { emitEvent: !0 }) {
          this._forEachChild((t) => t._updateTreeValidity(n)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Qi : Yi;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(n) {
          if (this.asyncValidator) {
            (this.status = Co), (this._hasOwnPendingAsyncValidator = !0);
            const t = kw(this.asyncValidator(this));
            this._asyncValidationSubscription = t.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: n });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(n, t = {}) {
          (this.errors = n), this._updateControlsErrors(!1 !== t.emitEvent);
        }
        get(n) {
          let t = n;
          return null == t ||
            (Array.isArray(t) || (t = t.split(".")), 0 === t.length)
            ? null
            : t.reduce((r, o) => r && r._find(o), this);
        }
        getError(n, t) {
          const r = t ? this.get(t) : this;
          return r && r.errors ? r.errors[n] : null;
        }
        hasError(n, t) {
          return !!this.getError(n, t);
        }
        get root() {
          let n = this;
          for (; n._parent; ) n = n._parent;
          return n;
        }
        _updateControlsErrors(n) {
          (this.status = this._calculateStatus()),
            n && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(n);
        }
        _initObservables() {
          (this.valueChanges = new he()), (this.statusChanges = new he());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Qi
            : this.errors
            ? yu
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Co)
            ? Co
            : this._anyControlsHaveStatus(yu)
            ? yu
            : Yi;
        }
        _anyControlsHaveStatus(n) {
          return this._anyControls((t) => t.status === n);
        }
        _anyControlsDirty() {
          return this._anyControls((n) => n.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((n) => n.touched);
        }
        _updatePristine(n = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        _updateTouched(n = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        _registerOnCollectionChange(n) {
          this._onCollectionChange = n;
        }
        _setUpdateStrategy(n) {
          Du(n) && null != n.updateOn && (this._updateOn = n.updateOn);
        }
        _parentMarkedDirty(n) {
          return (
            !n &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(n) {
          return null;
        }
        _assignValidators(n) {
          (this._rawValidators = Array.isArray(n) ? n.slice() : n),
            (this._composedValidatorFn = (function qL(e) {
              return Array.isArray(e) ? Nf(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(n) {
          (this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n),
            (this._composedAsyncValidatorFn = (function WL(e) {
              return Array.isArray(e) ? xf(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      class Ki extends _u {
        constructor(n, t, r) {
          super(Ff(t), kf(r, t)),
            (this.controls = n),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(n, t) {
          return this.controls[n]
            ? this.controls[n]
            : ((this.controls[n] = t),
              t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange),
              t);
        }
        addControl(n, t, r = {}) {
          this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(n, t = {}) {
          this.controls[n] &&
            this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        setControl(n, t, r = {}) {
          this.controls[n] &&
            this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            t && this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(n) {
          return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
        }
        setValue(n, t = {}) {
          Jw(this, 0, n),
            Object.keys(n).forEach((r) => {
              Xw(this, !0, r),
                this.controls[r].setValue(n[r], {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (Object.keys(n).forEach((r) => {
              const o = this.controls[r];
              o && o.patchValue(n[r], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = {}, t = {}) {
          this._forEachChild((r, o) => {
            r.reset(n ? n[o] : null, { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (n, t, r) => ((n[r] = t.getRawValue()), n)
          );
        }
        _syncPendingControls() {
          let n = this._reduceChildren(
            !1,
            (t, r) => !!r._syncPendingControls() || t
          );
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          Object.keys(this.controls).forEach((t) => {
            const r = this.controls[t];
            r && n(r, t);
          });
        }
        _setUpControls() {
          this._forEachChild((n) => {
            n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(n) {
          for (const [t, r] of Object.entries(this.controls))
            if (this.contains(t) && n(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (t, r, o) => ((r.enabled || this.disabled) && (t[o] = r.value), t)
          );
        }
        _reduceChildren(n, t) {
          let r = n;
          return (
            this._forEachChild((o, i) => {
              r = t(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const n of Object.keys(this.controls))
            if (this.controls[n].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(n) {
          return this.controls.hasOwnProperty(n) ? this.controls[n] : null;
        }
      }
      class eE extends Ki {}
      const lr = new b("CallSetDisabledState", {
          providedIn: "root",
          factory: () => Xi,
        }),
        Xi = "always";
      function Ji(e, n, t = Xi) {
        Lf(e, n),
          n.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === t) &&
            n.valueAccessor.setDisabledState?.(e.disabled),
          (function YL(e, n) {
            n.valueAccessor.registerOnChange((t) => {
              (e._pendingValue = t),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && tE(e, n);
            });
          })(e, n),
          (function KL(e, n) {
            const t = (r, o) => {
              n.valueAccessor.writeValue(r), o && n.viewToModelUpdate(r);
            };
            e.registerOnChange(t),
              n._registerOnDestroy(() => {
                e._unregisterOnChange(t);
              });
          })(e, n),
          (function QL(e, n) {
            n.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && tE(e, n),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, n),
          (function ZL(e, n) {
            if (n.valueAccessor.setDisabledState) {
              const t = (r) => {
                n.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(t),
                n._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(t);
                });
            }
          })(e, n);
      }
      function wu(e, n, t = !0) {
        const r = () => {};
        n.valueAccessor &&
          (n.valueAccessor.registerOnChange(r),
          n.valueAccessor.registerOnTouched(r)),
          bu(e, n),
          e &&
            (n._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => {}));
      }
      function Eu(e, n) {
        e.forEach((t) => {
          t.registerOnValidatorChange && t.registerOnValidatorChange(n);
        });
      }
      function Lf(e, n) {
        const t = Uw(e);
        null !== n.validator
          ? e.setValidators(Hw(t, n.validator))
          : "function" == typeof t && e.setValidators([t]);
        const r = Gw(e);
        null !== n.asyncValidator
          ? e.setAsyncValidators(Hw(r, n.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const o = () => e.updateValueAndValidity();
        Eu(n._rawValidators, o), Eu(n._rawAsyncValidators, o);
      }
      function bu(e, n) {
        let t = !1;
        if (null !== e) {
          if (null !== n.validator) {
            const o = Uw(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== n.validator);
              i.length !== o.length && ((t = !0), e.setValidators(i));
            }
          }
          if (null !== n.asyncValidator) {
            const o = Gw(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== n.asyncValidator);
              i.length !== o.length && ((t = !0), e.setAsyncValidators(i));
            }
          }
        }
        const r = () => {};
        return Eu(n._rawValidators, r), Eu(n._rawAsyncValidators, r), t;
      }
      function tE(e, n) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          n.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function oE(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      function iE(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const ts = class extends _u {
        constructor(n = null, t, r) {
          super(Ff(t), kf(r, t)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(n),
            this._setUpdateStrategy(t),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            Du(t) &&
              (t.nonNullable || t.initialValueIsDefault) &&
              (this.defaultValue = iE(n) ? n.value : n);
        }
        setValue(n, t = {}) {
          (this.value = this._pendingValue = n),
            this._onChange.length &&
              !1 !== t.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== t.emitViewToModelChange)
              ),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          this.setValue(n, t);
        }
        reset(n = this.defaultValue, t = {}) {
          this._applyFormState(n),
            this.markAsPristine(t),
            this.markAsUntouched(t),
            this.setValue(this.value, t),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(n) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(n) {
          this._onChange.push(n);
        }
        _unregisterOnChange(n) {
          oE(this._onChange, n);
        }
        registerOnDisabledChange(n) {
          this._onDisabledChange.push(n);
        }
        _unregisterOnDisabledChange(n) {
          oE(this._onDisabledChange, n);
        }
        _forEachChild(n) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(n) {
          iE(n)
            ? ((this.value = this._pendingValue = n.value),
              n.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = n);
        }
      };
      let lE = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵdir = R({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            }));
          }
          return e;
        })(),
        fE = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({}));
          }
          return e;
        })();
      const Hf = new b("NgModelWithFormControlWarning"),
        dV = { provide: ze, useExisting: te(() => Iu) };
      let Iu = (() => {
        class e extends ze {
          constructor(t, r, o) {
            super(),
              (this.callSetDisabledState = o),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new he()),
              this._setValidators(t),
              this._setAsyncValidators(r);
          }
          ngOnChanges(t) {
            this._checkFormPresent(),
              t.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (bu(this.form, this),
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
          addControl(t) {
            const r = this.form.get(t.path);
            return (
              Ji(r, t, this.callSetDisabledState),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(t),
              r
            );
          }
          getControl(t) {
            return this.form.get(t.path);
          }
          removeControl(t) {
            wu(t.control || null, t, !1),
              (function tV(e, n) {
                const t = e.indexOf(n);
                t > -1 && e.splice(t, 1);
              })(this.directives, t);
          }
          addFormGroup(t) {
            this._setUpFormContainer(t);
          }
          removeFormGroup(t) {
            this._cleanUpFormContainer(t);
          }
          getFormGroup(t) {
            return this.form.get(t.path);
          }
          addFormArray(t) {
            this._setUpFormContainer(t);
          }
          removeFormArray(t) {
            this._cleanUpFormContainer(t);
          }
          getFormArray(t) {
            return this.form.get(t.path);
          }
          updateModel(t, r) {
            this.form.get(t.path).setValue(r);
          }
          onSubmit(t) {
            return (
              (this.submitted = !0),
              (function rE(e, n) {
                e._syncPendingControls(),
                  n.forEach((t) => {
                    const r = t.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (t.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(t),
              "dialog" === t?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(t = void 0) {
            this.form.reset(t), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((t) => {
              const r = t.control,
                o = this.form.get(t.path);
              r !== o &&
                (wu(r || null, t),
                ((e) => e instanceof ts)(o) &&
                  (Ji(o, t, this.callSetDisabledState), (t.control = o)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(t) {
            const r = this.form.get(t.path);
            (function nE(e, n) {
              Lf(e, n);
            })(r, t),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(t) {
            if (this.form) {
              const r = this.form.get(t.path);
              r &&
                (function XL(e, n) {
                  return bu(e, n);
                })(r, t) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            Lf(this.form, this), this._oldForm && bu(this._oldForm, this);
          }
          _checkFormPresent() {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(ke, 10), _(Hn, 10), _(lr, 8));
          });
          static #t = (this.ɵdir = R({
            type: e,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (r, o) {
              1 & r &&
                de("submit", function (s) {
                  return o.onSubmit(s);
                })("reset", function () {
                  return o.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [ce([dV]), Y, pt],
          }));
        }
        return e;
      })();
      const pV = { provide: Un, useExisting: te(() => zf) };
      let zf = (() => {
          class e extends Un {
            set isDisabled(t) {}
            static #e = (this._ngModelWarningSentOnce = !1);
            constructor(t, r, o, i, s) {
              super(),
                (this._ngModelWarningConfig = s),
                (this._added = !1),
                (this.name = null),
                (this.update = new he()),
                (this._ngModelWarningSent = !1),
                (this._parent = t),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function Bf(e, n) {
                  if (!n) return null;
                  let t, r, o;
                  return (
                    Array.isArray(n),
                    n.forEach((i) => {
                      i.constructor === pu
                        ? (t = i)
                        : (function eV(e) {
                            return Object.getPrototypeOf(e.constructor) === cr;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || t || null
                  );
                })(0, i));
            }
            ngOnChanges(t) {
              this._added || this._setUpControl(),
                (function jf(e, n) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const t = e.model;
                  return !!t.isFirstChange() || !Object.is(n, t.currentValue);
                })(t, this.viewModel) &&
                  ((this.viewModel = this.model),
                  this.formDirective.updateModel(this, this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            viewToModelUpdate(t) {
              (this.viewModel = t), this.update.emit(t);
            }
            get path() {
              return (function Cu(e, n) {
                return [...n.path, e];
              })(
                null == this.name ? this.name : this.name.toString(),
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
            static #t = (this.ɵfac = function (r) {
              return new (r || e)(
                _(ze, 13),
                _(ke, 10),
                _(Hn, 10),
                _(rn, 10),
                _(Hf, 8)
              );
            });
            static #n = (this.ɵdir = R({
              type: e,
              selectors: [["", "formControlName", ""]],
              inputs: {
                name: ["formControlName", "name"],
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
              },
              outputs: { update: "ngModelChange" },
              features: [ce([pV]), Y, pt],
            }));
          }
          return e;
        })(),
        AE = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({ imports: [fE] }));
          }
          return e;
        })();
      class TE extends _u {
        constructor(n, t, r) {
          super(Ff(t), kf(r, t)),
            (this.controls = n),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(n) {
          return this.controls[this._adjustIndex(n)];
        }
        push(n, t = {}) {
          this.controls.push(n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        insert(n, t, r = {}) {
          this.controls.splice(n, 0, t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(n, t = {}) {
          let r = this._adjustIndex(n);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: t.emitEvent });
        }
        setControl(n, t, r = {}) {
          let o = this._adjustIndex(n);
          o < 0 && (o = 0),
            this.controls[o] &&
              this.controls[o]._registerOnCollectionChange(() => {}),
            this.controls.splice(o, 1),
            t && (this.controls.splice(o, 0, t), this._registerControl(t)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(n, t = {}) {
          Jw(this, 0, n),
            n.forEach((r, o) => {
              Xw(this, !1, o),
                this.at(o).setValue(r, {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (n.forEach((r, o) => {
              this.at(o) &&
                this.at(o).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = [], t = {}) {
          this._forEachChild((r, o) => {
            r.reset(n[o], { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this.controls.map((n) => n.getRawValue());
        }
        clear(n = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((t) => t._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }));
        }
        _adjustIndex(n) {
          return n < 0 ? n + this.length : n;
        }
        _syncPendingControls() {
          let n = this.controls.reduce(
            (t, r) => !!r._syncPendingControls() || t,
            !1
          );
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          this.controls.forEach((t, r) => {
            n(t, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((n) => n.enabled || this.disabled)
            .map((n) => n.value);
        }
        _anyControls(n) {
          return this.controls.some((t) => t.enabled && n(t));
        }
        _setUpControls() {
          this._forEachChild((n) => this._registerControl(n));
        }
        _allControlsDisabled() {
          for (const n of this.controls) if (n.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(n) {
          n.setParent(this),
            n._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(n) {
          return this.at(n) ?? null;
        }
      }
      function NE(e) {
        return (
          !!e &&
          (void 0 !== e.asyncValidators ||
            void 0 !== e.validators ||
            void 0 !== e.updateOn)
        );
      }
      let xE = (() => {
          class e {
            constructor() {
              this.useNonNullable = !1;
            }
            get nonNullable() {
              const t = new e();
              return (t.useNonNullable = !0), t;
            }
            group(t, r = null) {
              const o = this._reduceControls(t);
              let i = {};
              return (
                NE(r)
                  ? (i = r)
                  : null !== r &&
                    ((i.validators = r.validator),
                    (i.asyncValidators = r.asyncValidator)),
                new Ki(o, i)
              );
            }
            record(t, r = null) {
              const o = this._reduceControls(t);
              return new eE(o, r);
            }
            control(t, r, o) {
              let i = {};
              return this.useNonNullable
                ? (NE(r)
                    ? (i = r)
                    : ((i.validators = r), (i.asyncValidators = o)),
                  new ts(t, { ...i, nonNullable: !0 }))
                : new ts(t, r, o);
            }
            array(t, r, o) {
              const i = t.map((s) => this._createControl(s));
              return new TE(i, r, o);
            }
            _reduceControls(t) {
              const r = {};
              return (
                Object.keys(t).forEach((o) => {
                  r[o] = this._createControl(t[o]);
                }),
                r
              );
            }
            _createControl(t) {
              return t instanceof ts || t instanceof _u
                ? t
                : Array.isArray(t)
                ? this.control(
                    t[0],
                    t.length > 1 ? t[1] : null,
                    t.length > 2 ? t[2] : null
                  )
                : this.control(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        TV = (() => {
          class e {
            static withConfig(t) {
              return {
                ngModule: e,
                providers: [
                  { provide: lr, useValue: t.callSetDisabledState ?? Xi },
                ],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({ imports: [AE] }));
          }
          return e;
        })(),
        NV = (() => {
          class e {
            static withConfig(t) {
              return {
                ngModule: e,
                providers: [
                  {
                    provide: Hf,
                    useValue: t.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: lr, useValue: t.callSetDisabledState ?? Xi },
                ],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = St({ type: e }));
            static #n = (this.ɵinj = ft({ imports: [AE] }));
          }
          return e;
        })(),
        RE = (() => {
          class e {
            constructor(t) {
              (this.formBuilder = t),
                (this.popup = new nt(!1)),
                (this.openPopup = this.popup.asObservable()),
                (this.notesForm = t.group({ notes: t.array([]) }));
            }
            get notesFormArray() {
              return this.notesForm.get("notes");
            }
            addNote(t) {
              const r = t.value;
              return console.log("newnote", r), r;
            }
            openPopupBox() {
              this.popup.next(!0);
            }
            closePopupBox() {
              this.popup.next(!1);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(xE));
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        OE = (() => {
          class e {
            constructor() {
              (this.generatedId = 0),
                (this.generatedId = +localStorage.getItem("id"));
            }
            getId() {
              return (
                this.generatedId++,
                this.setId(this.generatedId),
                this.generatedId
              );
            }
            setId(t) {
              localStorage.setItem("id", t.toString());
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = M({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })();
      function xV(e, n) {}
      function RV(e, n) {
        1 & e && Dt(0, " \xd7 ");
      }
      function OV(e, n) {
        1 & e && Dt(0, " + ");
      }
      function PV(e, n) {
        if (1 & e) {
          const t = ya();
          ie(0, "div", 18)(1, "div", 19),
            de("click", function () {
              return Nt(t), xt(yt().openPopupBox("#fdff7d"));
            }),
            J(),
            ie(2, "div", 20),
            de("click", function () {
              return Nt(t), xt(yt().openPopupBox("#ffea75"));
            }),
            J(),
            ie(3, "div", 21),
            de("click", function () {
              return Nt(t), xt(yt().openPopupBox("#e5c8ff"));
            }),
            J(),
            ie(4, "div", 22),
            de("click", function () {
              return Nt(t), xt(yt().openPopupBox("#bef2ff"));
            }),
            J(),
            ie(5, "div", 23),
            de("click", function () {
              return Nt(t), xt(yt().openPopupBox("#c9ffb4"));
            }),
            J()();
        }
      }
      function FV(e, n) {}
      function kV(e, n) {
        1 & e && Ot(0, "img", 35);
      }
      function LV(e, n) {
        1 & e && Ot(0, "img", 36);
      }
      const VV = function (e, n) {
        return { "background-color": e, "box-shadow": n };
      };
      function jV(e, n) {
        if (1 & e) {
          const t = ya();
          ie(0, "div", 24)(1, "div", 25)(2, "div", 26),
            Dt(3),
            J(),
            ie(4, "div", 27),
            de("click", function () {
              const i = Nt(t).index;
              return xt(yt().addToFavourite(i));
            }),
            Kt(5, FV, 0, 0, "ng-template", 4),
            J(),
            Kt(6, kV, 1, 0, "ng-template", null, 5, bi),
            Kt(8, LV, 1, 0, "ng-template", null, 6, bi),
            J(),
            ie(10, "div", 28),
            Dt(11),
            J(),
            ie(12, "div", 29)(13, "div", 30),
            Dt(14),
            (function oD(e, n) {
              const t = U();
              let r;
              const o = e + B;
              t.firstCreatePass
                ? ((r = (function Ax(e, n) {
                    if (n)
                      for (let t = n.length - 1; t >= 0; t--) {
                        const r = n[t];
                        if (e === r.name) return r;
                      }
                  })(n, t.pipeRegistry)),
                  (t.data[o] = r),
                  r.onDestroy && (t.destroyHooks ??= []).push(o, r.onDestroy))
                : (r = t.data[o]);
              const i = r.factory || (r.factory = Zn(r.type)),
                a = qe(_);
              try {
                const u = Ms(!1),
                  c = i();
                return (
                  Ms(u),
                  (function cT(e, n, t, r) {
                    t >= e.data.length &&
                      ((e.data[t] = null), (e.blueprint[t] = null)),
                      (n[t] = r);
                  })(t, v(), o, c),
                  c
                );
              } finally {
                qe(a);
              }
            })(15, "date"),
            J(),
            ie(16, "div", 31)(17, "div", 32),
            de("click", function () {
              const i = Nt(t).$implicit;
              return xt(yt().openPopupBox(i.color, i.id));
            }),
            Ot(18, "img", 33),
            J(),
            ie(19, "div", 32),
            de("click", function () {
              const i = Nt(t).$implicit;
              return xt(yt().deleteNote(i.id));
            }),
            Ot(20, "img", 34),
            J()()()();
        }
        if (2 & e) {
          const t = n.$implicit,
            r = hi(7),
            o = hi(9);
          Xt(
            "ngStyle",
            (function Xy(e, n, t, r, o) {
              return eD(v(), je(), e, n, t, r, o);
            })(10, VV, t.color, "0 0 20px 10px " + t.color + "3f")
          ),
            Rt(3),
            Gl(t.title),
            Rt(2),
            Xt("ngIf", t.isFavourite)("ngIfThen", r)("ngIfElse", o),
            Rt(6),
            mi(" ", t.description, " "),
            Rt(3),
            mi(" ", iD(15, 7, t.date, "MMM dd, yyyy"), " ");
        }
      }
      const BV = function (e) {
        return { "background-color": e };
      };
      function $V(e, n) {
        if (1 & e) {
          const t = ya();
          ie(0, "div", 37)(1, "div", 38)(2, "div", 39),
            Dt(3, "New Note"),
            J(),
            ie(4, "div", 40)(5, "form", 41),
            de("ngSubmit", function () {
              return Nt(t), xt(yt().updateNote());
            }),
            ie(6, "div", 42)(7, "div"),
            Ot(8, "input", 43),
            J(),
            ie(9, "div")(10, "textarea", 44),
            Dt(11, "            "),
            J()(),
            ie(12, "div", 45)(13, "button", 46),
            Dt(14, "Save"),
            J(),
            ie(15, "button", 47),
            de("click", function () {
              return Nt(t), xt(yt().closePopupBox());
            }),
            Dt(16, "Cancel"),
            J()()()()()()();
        }
        if (2 & e) {
          const t = yt();
          Rt(1),
            Xt("ngStyle", Ky(2, BV, t.noteColor)),
            Rt(4),
            Xt("formGroup", t.noteForm);
        }
      }
      let HV = (() => {
          class e {
            addToFavourite(t) {
              (this.notes[t].isFavourite = !this.notes[t].isFavourite),
                this.savetoLocalStorage();
            }
            savetoLocalStorage() {
              localStorage.setItem("notes", JSON.stringify(this.notes));
            }
            showColorList() {
              this.isShowColorList = !this.isShowColorList;
            }
            constructor(t, r, o) {
              (this.notesService = t),
                (this.formBuilder = r),
                (this.idGeneratorService = o),
                (this.isFavourite = !1),
                (this.openPopUp = !1),
                (this.notes = []),
                (this.remove = !0),
                (this.imageUrl =
                  "./assets/icon-images/favourite-icon-before.png"),
                (this.isShowColorList = !1),
                localStorage.getItem("notes") &&
                  (console.log("constructor"),
                  (this.notes = JSON.parse(localStorage.getItem("notes"))),
                  console.log("parsed", this.notes)),
                (this.currentDate = new Date()),
                (this.noteForm = this.formBuilder.group({
                  id: [""],
                  title: ["", Mw.required],
                  description: ["", Mw.required],
                  isFavourite: [this.isFavourite],
                  color: ["#FFFFFF"],
                  date: [""],
                })),
                t.openPopup.subscribe((i) => {
                  this.openPopUp = i;
                });
            }
            ngOnInit() {}
            updateNote() {
              null != this.id ? this.editNote() : this.addNote();
            }
            editNote() {
              console.log(this.notes);
              const t = this.notes.findIndex((r) => r.id === this.id);
              console.log(t),
                (this.notes[t] = {
                  id: this.id,
                  title: this.noteForm.get("title").value,
                  description: this.noteForm.get("description").value,
                  isFavourite: this.notes[t].isFavourite,
                  date: this.currentDate,
                  color: this.notes[t].color,
                }),
                this.savetoLocalStorage(),
                this.notesService.closePopupBox(),
                (this.id = null);
            }
            openPopupBox(t, r) {
              if ((this.noteForm.reset(), console.log("open", r), null != r)) {
                this.noteColor = t;
                let o = this.notes.findIndex((i) => i.id === r);
                this.noteForm.get("title").setValue(this.notes[o].title),
                  this.noteForm
                    .get("description")
                    .setValue(this.notes[o].description),
                  (this.id = r),
                  console.log("id setted");
              } else (this.noteColor = t), console.log("color setted");
              this.notesService.openPopupBox();
            }
            closePopupBox() {
              this.noteForm.reset(), this.notesService.closePopupBox();
            }
            deleteNote(t) {
              let r = this.notes.findIndex((o) => o.id === t);
              console.log("delete", r),
                this.notes.splice(r, 1),
                this.savetoLocalStorage();
            }
            addNote() {
              this.noteForm.get("date").setValue(this.currentDate),
                this.noteForm
                  .get("id")
                  .setValue(this.idGeneratorService.getId()),
                this.noteForm.get("color").setValue(this.noteColor);
              const t = this.notesService.addNote(this.noteForm);
              this.notes.push(t),
                this.savetoLocalStorage(),
                this.notesService.closePopupBox();
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(RE), _(xE), _(OE));
            });
            static #t = (this.ɵcmp = gs({
              type: e,
              selectors: [["home"]],
              decls: 22,
              vars: 6,
              consts: [
                [1, "container"],
                [1, "sidebar"],
                [1, "app-name"],
                [1, "add-button", 3, "click"],
                [3, "ngIf", "ngIfThen", "ngIfElse"],
                ["thenBlock1", ""],
                ["elseBlock2", ""],
                ["class", "color-container", 4, "ngIf"],
                [1, "mainbar"],
                [1, "search-box"],
                [1, "search-icon"],
                [
                  "src",
                  "./assets/icon-images/search-icon.png",
                  "height",
                  "20px",
                  "width",
                  "20px",
                ],
                [1, "input-tag"],
                ["type", "text", "placeholder", "Search"],
                [1, "title"],
                [1, "notes-container"],
                ["class", "notes", 3, "ngStyle", 4, "ngFor", "ngForOf"],
                ["class", "popup-overlay", 4, "ngIf"],
                [1, "color-container"],
                [1, "color-item", 2, "background-color", "#fdff7d", 3, "click"],
                [1, "color-item", 2, "background-color", "#ffea75", 3, "click"],
                [1, "color-item", 2, "background-color", "#e5c8ff", 3, "click"],
                [1, "color-item", 2, "background-color", "#bef2ff", 3, "click"],
                [1, "color-item", 2, "background-color", "#c9ffb4", 3, "click"],
                [1, "notes", 3, "ngStyle"],
                [1, "notes-header"],
                [1, "notes-title"],
                [1, "favourite-button", 3, "click"],
                [1, "notes-content"],
                [1, "notes-footer"],
                [1, "created-date"],
                [1, "modify-box"],
                [1, "edit-button", 3, "click"],
                [
                  "src",
                  "./assets/icon-images/edit-icon.png",
                  "height",
                  "15px",
                  "width",
                  "15px",
                ],
                [
                  "src",
                  "./assets/icon-images/delete-icon.png",
                  "height",
                  "15px",
                  "width",
                  "15px",
                ],
                [
                  "src",
                  "./assets/icon-images/favourite-icon-after.png",
                  "height",
                  "10px",
                  "width",
                  "10px",
                ],
                [
                  "src",
                  "./assets/icon-images/favourite-icon-before.png",
                  "height",
                  "10px",
                  "width",
                  "10px",
                ],
                [1, "popup-overlay"],
                [1, "popup-container", 3, "ngStyle"],
                [2, "justify-content", "center", "display", "flex"],
                [2, "width", "100%"],
                [3, "formGroup", "ngSubmit"],
                [1, "form-container"],
                [
                  "type",
                  "text",
                  "placeholder",
                  "Title",
                  "formControlName",
                  "title",
                ],
                [
                  "placeholder",
                  "Description....",
                  "rows",
                  "8",
                  "formControlName",
                  "description",
                ],
                [1, "popup-footer"],
                ["type", "submit"],
                ["type", "button", 3, "click"],
              ],
              template: function (r, o) {
                if (
                  (1 & r &&
                    (ie(0, "div", 0)(1, "div", 1)(2, "div", 2),
                    Dt(3, "Notes"),
                    J(),
                    ie(4, "div", 3),
                    de("click", function () {
                      return o.showColorList();
                    }),
                    Kt(5, xV, 0, 0, "ng-template", 4),
                    J(),
                    Kt(6, RV, 1, 0, "ng-template", null, 5, bi),
                    Kt(8, OV, 1, 0, "ng-template", null, 6, bi),
                    Kt(10, PV, 6, 0, "div", 7),
                    J(),
                    ie(11, "div", 8)(12, "div", 9)(13, "div", 10),
                    Ot(14, "img", 11),
                    J(),
                    ie(15, "div", 12),
                    Ot(16, "input", 13),
                    J()(),
                    ie(17, "div", 14),
                    Dt(18, "Notes"),
                    J(),
                    ie(19, "div", 15),
                    Kt(20, jV, 21, 13, "div", 16),
                    J()()(),
                    Kt(21, $V, 17, 4, "div", 17)),
                  2 & r)
                ) {
                  const i = hi(7),
                    s = hi(9);
                  Rt(5),
                    Xt("ngIf", o.isShowColorList)("ngIfThen", i)("ngIfElse", s),
                    Rt(5),
                    Xt("ngIf", o.isShowColorList),
                    Rt(10),
                    Xt("ngForOf", o.notes),
                    Rt(1),
                    Xt("ngIf", o.openPopUp);
                }
              },
              dependencies: [k_, V_, $_, lE, pu, Yw, Qw, Iu, zf, H_],
              styles: [
                ".container[_ngcontent-%COMP%]{width:100%;height:100%;background-color:#fff;overflow-y:auto;display:flex;flex-direction:row}.sidebar[_ngcontent-%COMP%]{display:flex;width:10%;height:100%;position:fixed;background-color:#fff;flex-direction:column;row-gap:20px;align-items:center;border-right:1px solid #ddd}.app-name[_ngcontent-%COMP%]{margin-top:20px;font-weight:700}button[_ngcontent-%COMP%]{background:none;color:#fff;border:none;display:block;width:40%;height:40px;column-gap:20px;background-color:#000;border-radius:8px;box-shadow:0 16px 48px #0000002d}.add-button[_ngcontent-%COMP%]{margin-top:40px;padding:12px 18px;border:none;color:#fff;background-color:#000;border-radius:50%}.color-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;row-gap:15px;width:100%;height:100%;background-color:#fff;align-items:center;padding-top:20px}@keyframes _ngcontent-%COMP%_fadeInUp{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}.color-item[_ngcontent-%COMP%]{background-color:red;padding:8px;border-radius:50%;animation:_ngcontent-%COMP%_fadeIn .5s ease-out forwards;transform:translateY(-20px) scaleY(0)}@keyframes _ngcontent-%COMP%_fadeIn{0%{opacity:0;transform:translateY(-20px) scaleY(0)}to{opacity:1;transform:translateY(0) scaleY(1)}}.color-item[_ngcontent-%COMP%]:nth-child(1){animation-delay:.2s}.color-item[_ngcontent-%COMP%]:nth-child(2){animation-delay:.4s}.color-item[_ngcontent-%COMP%]:nth-child(3){animation-delay:.6s}.color-item[_ngcontent-%COMP%]:nth-child(4){animation-delay:.8s}.color-item[_ngcontent-%COMP%]:nth-child(5){animation-delay:1s}.mainbar[_ngcontent-%COMP%]{display:flex;flex-direction:column;row-gap:50px;padding:20px 20px 20px 40px;background-color:#fff;width:90%;height:100%;margin-left:10%}.search-box[_ngcontent-%COMP%]{display:flex;flex-direction:row;column-gap:10px;width:100%;height:max-content;background-color:#fff;border-radius:5px}input[_ngcontent-%COMP%]{width:100%;height:100%;padding:10px;display:block;border:none;outline:none;background-color:inherit}input[_ngcontent-%COMP%]::placeholder, textarea[_ngcontent-%COMP%]::placeholder{color:#000}input[_ngcontent-%COMP%]:focus, input[_ngcontent-%COMP%]:active, input[_ngcontent-%COMP%]:not(:placeholder-shown){border-color:#3498db}.input-tag[_ngcontent-%COMP%]{width:100%;border:none}.search-icon[_ngcontent-%COMP%]{margin-top:12px;margin-left:10px}.title[_ngcontent-%COMP%]{font-size:2em;font-weight:700}.notes-container[_ngcontent-%COMP%]{width:100%;height:100%;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:40px}.notes[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:10px;justify-content:space-between;border-radius:8px;background-color:#fff;flex-grow:1;height:350px}.notes-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;padding:10px;align-items:center;justify-content:space-between}.notes-title[_ngcontent-%COMP%]{font-size:1.2em;font-weight:700}.favourite-button[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:10px;border:none;color:#fff;background-color:#000;border-radius:50%;transition:background-color .2s ease;cursor:pointer}.favourite-button[_ngcontent-%COMP%]:active{background-color:#fff}.notes-content[_ngcontent-%COMP%]{padding:10px;font-size:1em;font-weight:500;flex-grow:1;overflow-y:auto;max-height:100%;text-align:justify;overflow-wrap:break-word}.notes-footer[_ngcontent-%COMP%]{display:flex;flex-direction:row;padding:10px;align-items:center;justify-content:space-between}.modify-box[_ngcontent-%COMP%]{display:flex;flex-direction:row;column-gap:10px}.edit-button[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:10px;border:none;color:#fff;background-color:#000;border-radius:50%}.created-date[_ngcontent-%COMP%]{font-size:1em;font-weight:500;color:#000000c6;flex-grow:.5}.popup-overlay[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center}.popup-container[_ngcontent-%COMP%]{background-color:#ffe089;width:30%;height:70%;padding:20px;border-radius:8px;box-shadow:0 0 10px #0003;display:flex;flex-direction:column;row-gap:20px}.form-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;row-gap:20px}.popup-footer[_ngcontent-%COMP%]{display:flex;flex-direction:row;width:100%;align-items:center;justify-content:space-between}textarea[_ngcontent-%COMP%]{background-color:inherit;width:100%;height:100%;padding:10px;display:block;border:none;outline:none;resize:none}[_ngcontent-%COMP%]::-webkit-scrollbar{width:12px}[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background-color:#555;border-radius:8px}[_ngcontent-%COMP%]::-webkit-scrollbar-track{background-color:#eee}[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover{background-color:#333}",
              ],
            }));
          }
          return e;
        })(),
        UV = (() => {
          class e {
            constructor() {
              this.title = "notes";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = gs({
              type: e,
              selectors: [["app-root"]],
              decls: 1,
              vars: 0,
              template: function (r, o) {
                1 & r && Ot(0, "home");
              },
              dependencies: [HV],
            }));
          }
          return e;
        })(),
        GV = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = St({ type: e, bootstrap: [UV] }));
            static #n = (this.ɵinj = ft({
              providers: [RE, OE],
              imports: [YP, FL, NV, TV],
            }));
          }
          return e;
        })();
      WP()
        .bootstrapModule(GV)
        .catch((e) => console.error(e));
    },
  },
  (K) => {
    K((K.s = 709));
  },
]);
