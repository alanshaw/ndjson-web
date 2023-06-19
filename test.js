/* eslint-env browser */
/* global TextDecoderStream */
import { Parse, Stringify } from './index.js'

/**
 * @param {string[]} items
 * @returns {ReadableStream<Uint8Array>}
 */
const toParseSource = items => new ReadableStream({
  pull (controller) {
    const item = items.shift()
    return item ? controller.enqueue(new TextEncoder().encode(item)) : controller.close()
  }
})

/** @type {Record<string, import('entail').Test>} */
export const test = {
  'should split 1 item from 1 chunk': async assert => {
    const source = toParseSource(['{ "id": 1 }\n'])
    const results = []

    await source.pipeThrough(new Parse()).pipeTo(new WritableStream({
      write: (item) => { results.push(item) }
    }))

    assert.deepEqual(results, [{ id: 1 }])
  },

  'should split 1 item from 2 chunks': async assert => {
    const source = toParseSource(['{ "id', '": 1 }\n'])
    const results = []

    await source.pipeThrough(new Parse()).pipeTo(new WritableStream({
      write: (item) => { results.push(item) }
    }))

    assert.deepEqual(results, [{ id: 1 }])
  },

  'should split 2 items from 2 chunks': async assert => {
    const source = toParseSource(['{ "id": 1 }\n', '{ "id": 2 }'])
    const results = []

    await source.pipeThrough(new Parse()).pipeTo(new WritableStream({
      write: (item) => { results.push(item) }
    }))

    assert.deepEqual(results, [{ id: 1 }, { id: 2 }])
  },

  'should split 2 items from 1 chunk': async assert => {
    const source = toParseSource(['{ "id": 1 }\n{ "id": 2 }'])
    const results = []

    await source.pipeThrough(new Parse()).pipeTo(new WritableStream({
      write: (item) => { results.push(item) }
    }))

    assert.deepEqual(results, [{ id: 1 }, { id: 2 }])
  },

  'should split 3 items from 2 chunks': async assert => {
    const source = toParseSource(['{ "id": 1 }\n{ "i', 'd": 2 }', '\n{"id":3}'])
    const results = []

    await source.pipeThrough(new Parse()).pipeTo(new WritableStream({
      write: (item) => { results.push(item) }
    }))

    assert.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
  },

  'should round trip': async assert => {
    const input = '{"id":1}\n{"id":2}\n{"id":3}\n'
    const source = toParseSource([input])
    const results = []

    await source
      .pipeThrough(new Parse())
      .pipeThrough(new Stringify())
      .pipeThrough(new TextDecoderStream())
      .pipeTo(new WritableStream({ write: (item) => { results.push(item) } }))

    assert.equal(results.join(''), input)
  }
}
