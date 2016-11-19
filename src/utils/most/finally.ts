export function ffinally(f:any, stream:any) : any {
  return new stream.constructor(new Finally(f, stream.source))
}

class Finally {
  f;
  source;

  constructor (f, source) {
    this.f = f
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new FinallySink(this.f, sink), scheduler)
  }
}

class FinallySink {
  f;
  sink;

  constructor (f, sink) {
    this.f = f
    this.sink = sink
  }

  event (t, x) {
    this.sink.event(t, x)
  }

  error (t, e) {
    this.sink.error(t, e)
  }

  end (t, x) {
    const f = this.f
    f(x)
    this.sink.end(t, x)
  }
}
