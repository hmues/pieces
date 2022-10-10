import { Collection } from '@discordjs/collection'
import { basename } from 'path'
import { Loader } from './Loader'
import { Piece } from './Piece'

/** Stores {@link Piece | Pieces}. */
export class Store<T extends Piece = Piece> extends Collection<string, T> {
  /** The constructor of the stored {@link Piece} */
  readonly Constructor: abstract new (options: T['options']) => T
  readonly loader: Loader

  constructor(options: {
    Constructor: abstract new (options: T['options']) => T
    loader?: Loader
  }) {
    super()
    this.Constructor = options.Constructor
    this.loader = options.loader ?? new Loader()
  }

  /**
   * Loads all {@link Piece | Pieces} from a file or directory.
   * @param path The directory or file containing the {@link Piece | Pieces}.
   * @param context Additional context provided to the {@link Piece | Pieces}.
   */
  async load(
    path: string,
    ...context: {} extends Omit<T['options'], Store.LoadContext>
      ? [Omit<T['options'], Store.LoadContext>?]
      : [Omit<T['options'], Store.LoadContext>]
  ): Promise<T[]> {
    const pieces: T[] = []

    for await (const file of this.loader.walk(this.loader.resolve(path))) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const ctx = {
        name: basename(file).replace(this.loader.filter, '').toLowerCase(),
        path: file,
        ...context[0]
      } as Omit<T['options'], Store.Context>
      for await (const Ctor of this.loader.load(this, file))
        pieces.push(await this.register(this.construct(Ctor, ctx)))
    }

    return pieces
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

  /**
   * Creates an instance of the {@link Piece}.
   * @param Ctor The constructor for the {@link Piece}.
   * @param context Additional context provided to the {@link Piece}.
   */
  construct(Ctor: new (options: T['options']) => T, context: Omit<T['options'], Store.Context>): T {
    return new Ctor({
      enabled: true,
      store: this,
      ...context
    })
  }
}

export namespace Store {
  /** Default context provided to a {@link Piece}. */
  export type Context = 'enabled' | 'store'
  /** Default context provided to a {@link Piece} when being loaded. */
  export type LoadContext = Store.Context | 'name' | 'path'
}
