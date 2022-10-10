import { Awaitable } from '../util/types'
import { Store } from './Store'

/** Can be loaded by {@link Store | Stores}. */
export class Piece<O extends Piece.Options = Piece.Options> {
  /** The name of this {@link Piece}. */
  readonly name: O['name']
  /** Whether or not this {@link Piece} is enabled. */
  enabled: O['enabled']
  /** The path where this {@link Piece} was loaded from. */
  readonly path: O['path']
  /** The {@link Store} loading this {@link} piece. */
  readonly store: O['store']
  /** The options provided to this {@link Piece}. */
  readonly options: O

  constructor(options: O) {
    this.name = options.name
    this.path = options.path
    this.enabled = options.enabled
    this.store = options.store
    this.options = options
  }

  /** Gets called when this {@link Piece} is being registered */
  register(): Awaitable<void> {}

  /** Gets called when this {@link Piece} is being deregistered */
  deregister(): Awaitable<void> {}

  /** {@link JSON.stringify | Stringify} this {@link Piece}. */
  toJSON(): Piece.JSON {
    return {
      name: this.name,
      path: this.path,
      enabled: this.enabled
    }
  }
}

export namespace Piece {
  /** The options passed to the {@link Piece} */
  export interface Options {
    readonly name: string
    readonly path: string
    readonly enabled: boolean
    readonly store: Store<any>
  }

  /** The {@link JSON.stringify | stringified} {@link Piece} */
  export interface JSON {
    readonly name: string
    readonly enabled: boolean
    readonly path: string
  }
}
