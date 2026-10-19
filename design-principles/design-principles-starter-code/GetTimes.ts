
// 1. What is the biggest design principle violation in the code below.
// The biggest violation is it repeats the same code multiple times. 
// This violates the DRY principle
// 2. Refactor the code to improve its design.

type Dictionary = {
	[index: string]: string
}

type Times = {
	interval: number;
	duration: number;
	departure: number;
};

function getPositiveNumber(props: Dictionary, key: string): number {
	const valueString = props[key];

	if (!valueString) {
		throw new Error(`missing ${key}`);
	}

	const value = parseInt(valueString, 10);

	if (Number.isNaN(value) || value <= 0) {
		throw new Error(`${key} must be > 0`);
	}

	return value;
}

function getTimes(props: Dictionary): Times {
	const interval = getPositiveNumber(props, "interval");
	const duration = getPositiveNumber(props, "duration");
	const departure = getPositiveNumber(props, "departure");

	if (duration % interval !== 0) {
		throw new Error("duration % interval != 0");
	}

	if (departure % interval !== 0) {
		throw new Error("departure % interval != 0");
	}

	return { interval, duration, departure };
}
