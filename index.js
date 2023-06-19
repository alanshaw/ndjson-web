/* eslint-env browser */

/**
 * @template O
 * @extends {TransformStream<Uint8Array, O>}
 */
export class Parse extends TransformStream {
  /**
   * @param {QueuingStrategy<Uint8Array>} [writableStrategy]
   * @param {QueuingStrategy<O>} [readableStrategy]
   */
  constructor (writableStrategy, readableStrategy) {
    const matcher = /\r?\n/
    const decoder = new TextDecoder('utf8')
    let buffer = ''
    super({
      transform (chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const parts = buffer.split(matcher)
        buffer = parts.pop() ?? ''
        for (let i = 0; i < parts.length; i++) controller.enqueue(JSON.parse(parts[i]))
      },
      flush (controller) {
        buffer += decoder.decode()
        if (buffer) controller.enqueue(JSON.parse(buffer))
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
   * @param {QueuingStrategy<I>} [writableStrategy]
   * @param {QueuingStrategy<Uint8Array>} [readableStrategy]
   */
  constructor (writableStrategy, readableStrategy) {
    const encoder = new TextEncoder()
    super({
      transform (chunk, controller) {
        controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`))
      }
    }, writableStrategy, readableStrategy)
  }
}
