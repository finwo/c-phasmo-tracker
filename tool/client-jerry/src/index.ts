const g = (new Function('return this;'))();
if ('function' !== typeof Buffer) {
  g.Buffer = require('buffer').Buffer;
}

type Listener = (body: any) => void;

class Client {
  constructor(private endpoint: string) {
    this.listeners = [];

    (async function retryer(_: Client, delayIdx: number, delays: number[]) {
      try {
        const response = await fetch(_.endpoint);
        console.log({ response });
        const reader   = response?.body?.getReader();
        console.log({ reader });
        if (!reader) throw new Error('Invalid Response');
        console.log('dinges');
        let buffer = Buffer.alloc(0);
        console.log({ buffer });
        delayIdx = 0;

        for(;;) {
          const { value, done } = await reader.read();
          if (done) break;
          console.log({ value });
          buffer = Buffer.concat([ buffer, Buffer.from(value) ]);
          let idx = buffer.indexOf('\n');
          while(idx >= 0) {
            const chunk = buffer.subarray(0, idx + 1);
            buffer      = buffer.subarray(idx + 1);
            idx         = buffer.indexOf('\n');
            try {
              const data = JSON.parse(chunk.toString());
              console.log({ data });
              for(const listener of _.listeners) {
                try {
                  listener(data);
                } catch {
                  // We don't care the client died
                }
              }
            } catch(e) {
              // Invalid json, skip this chunk
            }
          }
        }

        // Nicely closed
        setTimeout(() => retryer(_, 0, delays), delays[delayIdx]);
      } catch(e) {
        // Died
        const newIdx = Math.min(delayIdx + 1, delays.length - 1);
        setTimeout(() => retryer(_, newIdx, delays), delays[delayIdx]);
      }
    })(this, 0, [1000, 2000, 5000, 10000, 15000]);
  }

  addListener(fn: Listener): Client {
    this.removeListener(fn);
    this.listeners.push(fn);
    return this;
  }

  removeListener(fn: Listener): Client {
    this.listeners = this.listeners.filter(listener => listener !== fn);
    return this;
  }

  emit(data: string | any): Client {
    if ('string' !== typeof data) {
      data = JSON.stringify(data);
    }
    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    });
    return this;
  }

}

if ('undefined' !== typeof module) {
  module.exports.Client = Client;
} else if('undefined' !== typeof window) {
  window.JerryClient = Client;
}
