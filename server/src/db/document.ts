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
    if (this._journal && this._journal.save.enabled) {
      this._journal.set('id=%s, %s: %s -> %s', this.id, attributeName, oldValue, newValue);
    }
  }

  protected journalSave () {
    if (this._journal && this._journal.save.enabled) {
      this._journal.save('id=%s', this.id);
    }
  }

  protected journalDone () {
    if (this._journal && this._journal.done.enabled) {
      this._journal.done('id=%s', this.id);
    }
  }

  protected journalErr (err: any) {
    if (this._journal && this._journal.err.enabled) {
      this._journal.err('id=%s\n%e', this.id, err);
    }
  }

}
