
export interface Observer<T> {
    update(value: T): void;
}

export abstract class Subject<T> {
    private observers: Observer<T>[] = [];

    public addObserver(observer: Observer<T>): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer<T>): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    public notifyObservers(value: T): void {
        for (const observer of this.observers) {
            observer.update(value);
        }
    }
}