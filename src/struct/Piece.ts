/** Can be loaded by Stores. */
export class Piece<O extends Piece.Options = Piece.Options> {
  /** The name of this {@link Piece}. */
  readonly name: O['name']
  /** Whether or not this {@link Piece} is enabled. */
  enabled: O['enabled']
  /** The path where this {@link Piece} was loaded from. */
  readonly path: O['path']
  /** The options provided to this {@link Piece}. */
  readonly options: O

  constructor(options: O) {
    this.name = options.name
    this.path = options.path
    this.enabled = options.enabled
    this.options = options
  }
}

export namespace Piece {
  /** The options passed to the {@link Piece} */
  export interface Options {
    readonly name: string
    readonly path: string
    readonly enabled: boolean
  }
}