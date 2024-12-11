// sharedState.jsx
let count = 0;

export function getCount() {
  console.log(`getCount called, returning: ${count}`);
  return count;
}

export function setCount(newCount) {
  console.log(`setCount called with: ${newCount}`);
  count = newCount;
}