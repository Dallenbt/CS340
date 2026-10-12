import { Animal } from "./abstract/Animal";

export class Dog extends Animal {
  chasesCats: boolean;
  jumpsOnPeople: boolean;

  constructor(
    name: string,
    trainingPriority: number,
    chasesCats: boolean,
    jumpsOnPeople: boolean
  ) {
    super(name, trainingPriority);
    this.chasesCats = chasesCats;
    this.jumpsOnPeople = jumpsOnPeople;
  }

  static getDogsSorted(dogList: Dog[]) {
    return Dog.getAnimalsSorted(dogList);
  }
  static getDogsPriorityList(dogList: Dog[]): string {
    return Dog.getAnimalPriorityList(dogList);
  }

  static getDogsSummary(dogListNotSorted: Dog[]): string {
    let dogList = Dog.getDogsSorted(dogListNotSorted);
    let easiestDog = dogList[0];
    let mostDifficultDog = dogList[dogList.length - 1];
    let easiestDogString =
      easiestDog.name +
      " needs the least training" +
      (easiestDog.chasesCats
        ? ", but will need to be watched closely since it likes to chase cats."
        : ", and does not even chase cats") +
      (easiestDog.jumpsOnPeople
        ? " It is friendly and enjoys jumping on people."
        : " It is well behaved and does not jump on people.");

    let mostDifficultDogString =
      mostDifficultDog.name +
      " needs the most training." +
      (mostDifficultDog.chasesCats
        ? " It chases cats and must be watched closely."
        : " Surprisingly, it does not chase cats.") +
      (mostDifficultDog.jumpsOnPeople
        ? " It jumps at people and sometimes bites."
        : " It does not jump on people but is mean in more subtle ways.");
    let dogTrainingPriorities = this.getDogsPriorityList(dogList);
    return (
      dogTrainingPriorities +
      "\n" +
      easiestDogString +
      "\n" +
      mostDifficultDogString
    );
  }
}
