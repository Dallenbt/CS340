
// 1. Explain how this program violates the High-Quality Abstraction principle.
// The RetirementCalculator class violates the High-Quality Abstraction principle 
// because it exposes the internal details of how retirement is calculated, 

// 2. Explain how you would refactor the code to improve its design.
// I would refactor the code by creating a new interface that defines the methods for calculating retirement.

class Employee {
	public employmentStartDate: Date;
	public employmentEndDate: Date;
}

class RetirementCalculator {
	private employee: Employee;

	public constructor(emp: Employee) {
		this.employee = emp;
	}

	public calculateRetirement(payPeriodStart: Date, payPeriodEnd: Date): number { … }

	private getTotalYearsOfService(startDate: Date, endDate: Date): number { … }

	private getMonthsInLastPosition(startDate: Date, endDate: Date): number { … }
	
    ...
}
