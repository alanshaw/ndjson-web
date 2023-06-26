export interface Stringifier<T> {
  (data: T): string
}

export interface Parser<T> {
  (data: string): T
}

export declare class Parse<O> extends TransformStream<Uint8Array, O> {
  constructor (parse?: Parser<O>, writableStrategy?: QueuingStrategy<Uint8Array>, readableStrategy?: QueuingStrategy<O>)
}
export declare class Stringify<I> extends TransformStream<I, Uint8Array> {
  constructor (stringify?: Stringifier<I>, writableStrategy?: QueuingStrategy<I>, readableStrategy?: QueuingStrategy<Uint8Array>)
}
