import { Collection } from '@discordjs/collection'
import { Piece } from './.Piece'

/** Stores {@link Piece | Pieces}. */
export class Store<T extends Piece = Piece> extends Collection<string, T> {
  /** The constructor of the stored {@link Piece} */
  readonly Constructor: abstract new (options: T['options']) => T

  constructor(options: { Constructor: abstract new (options: T['options']) => T }) {
    super()
    this.Constructor = options.Constructor
  }

  /**
   * Registers a {@link Piece} in this {@link Collection}.
   * @param piece The {@link Piece} to be registered.
   */
  async register(piece: T): Promise<T> {
    this.set(piece.name, piece)
    await piece.register()
    if (!piece.enabled) await this.deregister(piece)
    return piece
  }

  /**
   * Deregisters a {@link Piece} from this {@link Collection}.
   * @param piece The {@link Piece} to be deregistered.
   */
  async deregister(piece: T): Promise<T> {
    piece.enabled = false
    await piece.deregister()
    return piece
  }
}
