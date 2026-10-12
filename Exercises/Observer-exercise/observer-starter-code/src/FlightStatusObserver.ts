import { Observer } from "./Observer";
import { Flight } from "./entity/Flight";

export class FlightStatusObserver implements Observer<Flight | null> {
  public update(flight: Flight | null): void {
    if (flight == null) {
      return;
    }

    console.log("Flight status:");
    console.log(`Transponder ID: ${flight.icao24}`);
    console.log(`Call sign: ${flight.callsign}`);
    console.log(`Country of origin: ${flight.origin_country}`);
    console.log(`Longitude: ${flight.longitude}`);
    console.log(`Latitude: ${flight.latitude}`);
    console.log(`Velocity: ${flight.velocity}`);
    console.log(`Altitude: ${flight.baro_altitude}`);
  }
}