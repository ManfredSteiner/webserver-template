import { Journal } from './journal';

export abstract class Document<T> {

  protected _journal: Journal;

  constructor (journal: Journal) {
    this._journal = journal;
  }

  public abstract get id (): string;
  public abstract toObject(): T;
  public abstract save (): Promise<boolean>;


  protected journalSet (attributeName: string, oldValue: any, newValue: any) {
    if (this._journal && this._journal.set.enabled) {
      if (typeof(oldValue) === 'object' || typeof(newValue) === 'object') {
        this._journal.set('%s, %s: %o -> %o', this.defaultJournalPrefix(), attributeName, oldValue, newValue);
      } else {
        this._journal.set('%s, %s: %s -> %s', this.defaultJournalPrefix(), attributeName, oldValue, newValue);
      }
    }
  }

  protected journalSave (savedAt?: number) {
    if (this._journal && this._journal.save.enabled) {
      if (savedAt) {
        this._journal.save('%s: savedAt=%s', this.defaultJournalPrefix(), savedAt);
      } else {
        this._journal.save('%s', this.defaultJournalPrefix());
      }
    }
  }

  protected journalDone (savedAt?: number, prefix?: string) {
    if (this._journal && this._journal.done.enabled) {
      if (savedAt) {
        this._journal.done('%s: savedAt=%s', this.defaultJournalPrefix(), savedAt);
      } else {
        this._journal.done('%s', this.defaultJournalPrefix());
      }
    }
  }

  protected journalErr (err: any, savedAt?: number, prefix?: string) {
    if (this._journal && this._journal.err.enabled) {
      if (savedAt) {
        this._journal.err('%s: savedAt=%s\n%e', this.defaultJournalPrefix(), savedAt, err);
      } else {
        this._journal.err('%s\n%e', this.defaultJournalPrefix(), err);
      }
    }
  }

  protected defaultJournalPrefix (): string {
    return 'id=' + this.id;
  }


}
