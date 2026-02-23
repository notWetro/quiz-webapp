/**
 * Returns the points deducted for a wrong answer (half the available points, rounded up).
 * @param {number} points - Full point value of the question
 * @returns {number}
 */
export function halfDeduction(points) {
  return Math.ceil(points / 2);
}
