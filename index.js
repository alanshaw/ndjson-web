/* eslint-env browser */

/**
 * @template O
 * @extends {TransformStream<Uint8Array, O>}
 */
export class Parse extends TransformStream {
  /**
   * @param {import('./index').Parser<O>} [parser]
   * @param {QueuingStrategy<Uint8Array>} [writableStrategy]
   * @param {QueuingStrategy<O>} [readableStrategy]
   */
  constructor (parser, writableStrategy, readableStrategy) {
    const parse = parser || JSON.parse
    const matcher = /\r?\n/
    const textDecoder = new TextDecoder('utf8')
    let buffer = ''
    super({
      transform (chunk, controller) {
        buffer += textDecoder.decode(chunk, { stream: true })
        const parts = buffer.split(matcher)
        buffer = parts.pop() ?? ''
        for (let i = 0; i < parts.length; i++) controller.enqueue(parse(parts[i]))
      },
      flush (controller) {
        buffer += textDecoder.decode()
        if (buffer) controller.enqueue(parse(buffer))
      }
    }, writableStrategy, readableStrategy)
  }
}

/**
 * @template I
 * @extends {TransformStream<I, Uint8Array>}
 */
export class Stringify extends TransformStream {
  /**
   * @param {import('./index').Stringifier<I>} [stringifier]
   * @param {QueuingStrategy<I>} [writableStrategy]
   * @param {QueuingStrategy<Uint8Array>} [readableStrategy]
   */
  constructor (stringifier, writableStrategy, readableStrategy) {
    const stringify = stringifier || JSON.stringify
    const encoder = new TextEncoder()
    super({
      transform (chunk, controller) {
        controller.enqueue(encoder.encode(`${stringify(chunk)}\n`))
      }
    }, writableStrategy, readableStrategy)
  }
}
