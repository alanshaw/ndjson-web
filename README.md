# ndjson-web

[![Build](https://github.com/alanshaw/ndjson-web/actions/workflows/build.yml/badge.svg)](https://github.com/alanshaw/ndjson-web/actions/workflows/build.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

NDJSON parser + serializer using web streams. Zero dependencies.

## Install

```sh
npm i ndjson-web
```

## Usage

### Parse

```js
import { Parse } from 'ndjson-web'

readable
  .pipeThrough(new Parse())
  .pipeTo(new WritableStream({
    write (obj) {
      console.log(obj)
    }
  }))
```

### Serialize

```js
import { Stringify } from 'ndjson-web'

const items = [{ one: 1 }, { two: 2 }, { three: 3 }]
new ReadableStream({
  pull (controller) {
    const item = items.shift()
    return item ? controller.enqueue(item) : controller.close()
  }
}).pipeThrough(new Stringify()).pipeTo(writable)
```

## Contributing

Feel free to join in. All welcome. Please [open an issue](https://github.com/alanshaw/ndjson-web/issues)!

## License

Dual-licensed under [MIT + Apache 2.0](https://github.com/alanshaw/ndjson-web/blob/main/LICENSE.md)
