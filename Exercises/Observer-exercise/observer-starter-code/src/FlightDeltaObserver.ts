import { Observer } from "./Observer";
import { Flight } from "./entity/Flight";

export class FlightDeltaObserver implements Observer<Flight | null> {
  private previousFlight: Flight | null = null;

  public update(flight: Flight | null): void {
    if (flight == null) {
      return;
    }

    if (this.previousFlight == null) {
      console.log("Flight changes: no previous status available.");
    } else {
      console.log("Flight changes since previous status:");
      console.log(`Longitude: ${flight.longitude - this.previousFlight.longitude}`);
      console.log(`Latitude: ${flight.latitude - this.previousFlight.latitude}`);
      console.log(`Velocity: ${flight.velocity - this.previousFlight.velocity}`);
      console.log(`Altitude: ${flight.baro_altitude - this.previousFlight.baro_altitude}`);
    }

    this.previousFlight = flight;
  }
}