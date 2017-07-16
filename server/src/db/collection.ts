
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
  public abstract delete(item: D): Promise<boolean>;
  public abstract findAll (): Promise<D[]>;
  public abstract find (conditions: Object): Promise<D []>;

  public abstract clearCache (): void;
  public abstract refreshCache (): Promise<{[ key: string]: D }>;
  public abstract getCachedDocuments (): { [ key: string]: D };


  protected journalCreate (document: D) {
    if (this._journal && this._journal.create.enabled) {
      this._journal.create('%s:\n%o', this.defaultJournalPrefix(document), document.toObject());
    }
  }

  protected journalDelete (document: D, startedAt?: number) {
    if (this._journal && this._journal.set.enabled) {
      if (startedAt) {
        this._journal.delete('%s: startedAt=%s', this.defaultJournalPrefix(document), startedAt);
      } else {
        this._journal.delete('%s', this.defaultJournalPrefix(document));
      }
    }
  }

  protected journalDone (document: D, startedAt?: number) {
    if (this._journal && this._journal.done.enabled) {
      if (startedAt) {
        this._journal.done('%s: startedAt=%s', this.defaultJournalPrefix(document), startedAt);
      } else {
        this._journal.done('%s', this.defaultJournalPrefix(document));
      }
    }
  }

  protected journalErr (document: D, err: any, startedAt?: number) {
    if (this._journal && this._journal.err.enabled) {
      if (startedAt) {
        this._journal.err('%s: savedAt=%s\n%e', this.defaultJournalPrefix(document), startedAt, err);
      } else {
        this._journal.err('%s\n%e', this.defaultJournalPrefix(document), err);
      }
    }
  }

  protected defaultJournalPrefix (document: D): string {
    return 'id=' + document.id;
  }

}
