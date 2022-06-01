export const range = (start: number, end: number): number[] =>
	Array.from({ length: end - start + 1 }, (x, i) => i + start)
