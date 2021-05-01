import { action, computed, observable, onBecomeUnobserved } from 'mobx';

export class ReadApiState<T, E, P extends any[]> {
  @observable
  protected _data: T | undefined = undefined;

  @observable
  protected _isLoading = false;

  @observable
  protected _error: E | undefined = undefined;

  /** Computed read state to be used for showing loader for the first time when data is undefined */
  @computed
  public get isInitializing(): boolean {
    return this._isLoading && this._data === undefined;
  }

  public get data(): T | undefined {
    return this._data;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get error(): E | undefined {
    return this._error;
  }

  public constructor(private promiseFn: PromiseFn<T, E, P>) {
    const thisContext = this;
    onBecomeUnobserved(this, '_data', () => {
      // When there is no more observer on the _data observable value, reset the current ReadApiState
      // so that on a next mount of a component that uses the same ReadApiState, the component will get a fresh state
      thisContext.resetState();
    });
  }

  @action
  public resetState(): void {
    this._isLoading = false;
    this._error = undefined;
    this._data = undefined;
  }

  @action
  protected setLoading(): void {
    this._isLoading = true;
    this._error = undefined;
  }

  @action
  protected setData(data: T): void {
    this._isLoading = false;
    this._error = undefined;
    this._data = data;
  }

  @action
  protected setError(error: E): void {
    this._isLoading = false;
    this._error = error;
  }

  public call(...args: P): void {
    this.setLoading();

    this.promiseFn(...args)
      .then((data) => this.setData(data))
      .catch((error) => this.setError(error));
  }
}

type PromiseFn<T, E, P extends any[]> = {
  (...args: P): Promise<T>;
};

