const isEmpty = stream =>
    new stream.constructor(new IsEmpty(stream.source))

class IsEmptySink {
    constructor(sink) {
        this.sink = sink
        this.isEmpty = true
    }

    event(t, x) {
        this.isEmpty = false
        this.sink.event(t, false)
        this.sink.end(t, x)
    }

    error(t, e) {
        this.sink.error(t, e)
    }

    end(t, x) {
        if (this.isEmpty) {
            this.sink.event(t, true)
            this.sink.end(t, x)
        }
    }
}

export default class isEmpty {
    constructor(source) {
        this.source = source
    }

    run(sink, scheduler) {
        return this.source.run(new IsEmptySink(sink), scheduler)
    }
}


