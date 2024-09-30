function optimizeBookings(bookings: number[][]): number[][] {
    if (bookings.length === 0) return [];
  
    // Sort bookings based on the start time
    const sortedbookings = bookings.slice().sort((a, b) => a[0] - b[0]);
  
    const merged: number[][] = [];
    let [currentStart, currentEnd] = sortedbookings[0];
  
    for (let i = 1; i < sortedbookings.length; i++) {
      const [nextStart, nextEnd] = sortedbookings[i];
  
      if (nextStart <= currentEnd) {
        // Overlapping bookings, merge them by updating the end
        currentEnd = Math.max(currentEnd, nextEnd);
      } else {
        // No overlap, push the current interval and move to the next
        merged.push([currentStart, currentEnd]);
        [currentStart, currentEnd] = sortedbookings[i];
      }
    }
  
    // Push the last interval
    merged.push([currentStart, currentEnd]);
  
    return merged;
  }
// Generating a random test case
let testCase1: number[][] = [];
let ops = 1000;
while (ops--) {
  const start = Math.floor(Math.random() * 20);
  const end = start + Math.floor(Math.random() * 10);
  testCase1.push([start, end]);
}

// Non-overlapping bookings test case
const testCase2: number[][] = [
  [1, 11],
  [15, 28],
  [40, 53],
  [54, 60],
  [71, 83],
];

// Consecutive bookings that just touch each other end-to-start test case
const testCase3: number[][] = [
  [2, 4],
  [6, 10],
  [12, 15],
  [18, 22],
  [24, 28],
];

// Bookings that are already merged
const testCase4: number[][] = [
  [1, 5],
  [3, 7],
  [6, 10],
  [11, 14],
  [13, 17],
];

// Empty bookings
const testCase5: number[][] = [];

// Grouping all test cases together for easy execution
const testCases = [
  { description: "Random 1000 bookings", bookings: testCase1 },
  { description: "Non-overlapping bookings", bookings: testCase2 },
  { description: "Consecutive Touching bookings", bookings: testCase3 },
  { description: "Already Merged bookings", bookings: testCase4 },
  { description: "Empty bookings", bookings: testCase5 },
];

// Running all test cases
testCases.forEach((test, index) => {
  console.log(`\nTest Case ${index + 1}: ${test.description}`);
  const result = optimizeBookings(test.bookings);
  console.log(result);
});
  