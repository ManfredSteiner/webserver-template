
import * as debugsx from 'debug-sx';
import { Database } from './database';
import { Document } from './document';
import { Journal } from './journal';


export abstract class Collection<T, D extends Document<T>> {
  protected _journal: Journal;

  constructor(name: string) {
    this._journal = new Journal(name);
  }

  public abstract create(item: T): Promise<D>;
  public abstract findAll (): Promise<D[]>;
  public abstract find (conditions: Object): Promise<D []>;

  public abstract clearCache (): void;
  public abstract refreshCache (): Promise<{[ key: string]: D }>;
  public abstract getCachedDocuments (): { [ key: string]: D };

  protected journalCreate (document: D) {
    if (this._journal.create.enabled) {
      this._journal.create('id=%s\n%o', document.id, document.toObject());
    }
  }

}
