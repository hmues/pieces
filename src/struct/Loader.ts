import { Piece } from './Piece'
import { Store } from './Store'
import { basename, join, resolve } from 'path'
import { readdir, stat } from 'fs/promises'

/** Parses a path for {@link Piece | Pieces}. */
export class Loader {
  /** The {@link RegExp} to filter filenames with. */
  filter: RegExp = /(.js|(?<!\.d)\.ts)$/

  /**
   * Loads all {@link Piece | Pieces} inside a directory.
   * @param store The {@link Store} that loads the {@link Piece | Pieces}.
   * @param path The directory or file containing the {@link Piece | Pieces}.
   */
  async *load<T extends Piece>(
    store: Store<T>,
    path: string
  ): AsyncIterableIterator<new (options: T['options']) => T> {
    const module = await import(path)

    for (const i in module) //
      if (module[i].prototype instanceof store.Constructor) yield module[i]
  }

  /**
   * Finds all files inside a directory.
   * @param path The file or directory to be scanned.
   */
  async *walk(path: string): AsyncIterableIterator<string> {
    if ((await stat(path)).isDirectory())
      for (const item of await readdir(path)) yield* this.walk(join(path, item))
    else if (this.filter.test(basename(path))) yield path
  }

  /**
   * Resolves a path.
   * @param path The path to be resolved.
   * @returns The resolved absolute path.
   */
  resolve(path: string): string {
    return resolve(require.main?.path ?? '', path)
  }
}
