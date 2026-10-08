import { FlightFeed } from "./FlightFeed";
import { FlightDeltaObserver } from "./FlightDeltaObserver";
import { FlightStatusObserver } from "./FlightStatusObserver";

main();

function main() {
  let feed = new FlightFeed();
  feed.addObserver(new FlightStatusObserver());
  feed.addObserver(new FlightDeltaObserver());
  feed.start();
}
