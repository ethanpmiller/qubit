export const shapes = [
  [[1,1,1,1]], // I
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]], // L
  [[1,1],[1,1]], // O
  [[0,1,1],[1,1,0]], // S
  [[0,1,0],[1,1,1]], // T
  [[1,1,0],[0,1,1]], // Z
];

export function getShape(index) {
  return shapes[index];
}
