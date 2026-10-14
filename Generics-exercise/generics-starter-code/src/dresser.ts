type Socks = { style: string; color: string };
type Shirt = { style: string; size: string };
type Pants = { waist: number; length: number };

class Drawer<T> {
  private items: T[] = [];

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(): T | undefined {
    return this.items.pop();
  }

  removeAll(): T[] {
    const removed = this.items;
    this.items = [];
    return removed;
  }
}

class Dresser<TTop, TMiddle, TBottom> {
  public top: Drawer<TTop> = new Drawer<TTop>();
  public middle: Drawer<TMiddle> = new Drawer<TMiddle>();
  public bottom: Drawer<TBottom> = new Drawer<TBottom>();
}

function demonstrateDresser(): void {
  const dresser = new Dresser<Socks, Shirt, Pants>();
  console.log("Is top drawer empty?", dresser.top.isEmpty);
  console.log("Is middle drawer empty?", dresser.middle.isEmpty);
  console.log("Is bottom drawer empty?", dresser.bottom.isEmpty);
  dresser.top.addItem({ style: "ankle", color: "white" });
  dresser.top.addItem({ style: "crew", color: "black" });
  dresser.middle.addItem({ style: "t-shirt", size: "M" });
  dresser.middle.addItem({ style: "polo", size: "L" });
  dresser.middle.addItem({ style: "button-up", size: "M" });
  dresser.bottom.addItem({ waist: 32, length: 30 });
  console.log("Is top drawer empty after adding?", dresser.top.isEmpty);
  console.log("Removed from top:", dresser.top.removeItem());
  console.log("Removed from middle:", dresser.middle.removeItem());
  console.log("Remove all from middle:", dresser.middle.removeAll());
  console.log(
    "Is middle drawer empty after removeAll?",
    dresser.middle.isEmpty,
  );
  console.log("Remove from empty middle:", dresser.middle.removeItem());
  console.log("Remove all from bottom:", dresser.bottom.removeAll());
  console.log("Is bottom drawer empty?", dresser.bottom.isEmpty);
}

demonstrateDresser();
