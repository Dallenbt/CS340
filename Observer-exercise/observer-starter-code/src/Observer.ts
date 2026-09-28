
interface Observer {
    update(): void;
}

abstract class Subject {
    private observers: Observer[] = [];

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    public notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update();
        }
    }
}