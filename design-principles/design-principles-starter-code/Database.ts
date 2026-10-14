
// 1. What design principle(s) does this code violate?
//This code violates the Single Responsibility Principle
// because the Course class has multiple responsibilities. 
// It represents a course by storing its name and credits, 
// but it also handles database operations, including creating, finding, and updating course records.


// 2. Explain how you would refactor this code to improve its design.
// I would refactor the code by separating the database operations from the Course class.
// I would create a new separate class, that is responsible for handling the database operations 


export class Course {

	name: string;
	credits: number;

	constructor(name: string, credits: number) {
		this.name = name;
		this.credits = credits;
	}

	static async create(name: string, credits: number): Promise<Course> {

		// ... Code to insert a new Course object into the database ...

	}

	static async find(name: string): Promise<Course | undefined> {

		// ... Code to find a Course object in the database ...

	}

	async update(): Promise<void> {

		// ... Code to update a Course object in the database ...

	}

}
