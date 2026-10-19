
// 1. What design principles does this code violate?
// This code violates the Simple design principle
// because the function is complex and difficult to read.

// 2. Refactor the code to improve its design.


function isLowRiskClient(score: number, income: number, authorized: boolean): boolean {
    return (
        score > 700 ||
        (income >= 40000 &&
         income <= 100000 &&
         authorized &&
         score > 500) ||
        income > 100000
    );
}
