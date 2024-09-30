function optimizeBookings(bookings) {
    var _a;
    if (bookings.length === 0)
        return [];
    // Sort bookings based on the start time
    var sortedbookings = bookings.slice().sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    var _b = sortedbookings[0], currentStart = _b[0], currentEnd = _b[1];
    for (var i = 1; i < sortedbookings.length; i++) {
        var _c = sortedbookings[i], nextStart = _c[0], nextEnd = _c[1];
        if (nextStart <= currentEnd) {
            // Overlapping bookings, merge them by updating the end
            currentEnd = Math.max(currentEnd, nextEnd);
        }
        else {
            // No overlap, push the current interval and move to the next
            merged.push([currentStart, currentEnd]);
            _a = sortedbookings[i], currentStart = _a[0], currentEnd = _a[1];
        }
    }
    // Push the last interval
    merged.push([currentStart, currentEnd]);
    return merged;
}
// Generating a random test case
var testCase1 = [];
var ops = 1000;
while (ops--) {
    var start = Math.floor(Math.random() * 20);
    var end = start + Math.floor(Math.random() * 10);
    testCase1.push([start, end]);
}
// Non-overlapping bookings test case
var testCase2 = [
    [1, 11],
    [15, 28],
    [40, 53],
    [54, 60],
    [71, 83],
];
// Consecutive bookings that just touch each other end-to-start test case
var testCase3 = [
    [2, 4],
    [6, 10],
    [12, 15],
    [18, 22],
    [24, 28],
];
// Bookings that are already merged
var testCase4 = [
    [1, 5],
    [3, 7],
    [6, 10],
    [11, 14],
    [13, 17],
];
// Empty bookings
var testCase5 = [];
// Grouping all test cases together for easy execution
var testCases = [
    { description: "Random 1000 bookings", bookings: testCase1 },
    { description: "Non-overlapping bookings", bookings: testCase2 },
    { description: "Consecutive Touching bookings", bookings: testCase3 },
    { description: "Already Merged bookings", bookings: testCase4 },
    { description: "Empty bookings", bookings: testCase5 },
];
// Running all test cases
testCases.forEach(function (test, index) {
    console.log("\nTest Case ".concat(index + 1, ": ").concat(test.description));
    var result = optimizeBookings(test.bookings);
    console.log(result);
});
