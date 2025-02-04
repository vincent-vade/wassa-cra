export const updateArrayByUniqKey = <T extends { [key: string]: unknown }>(
	array: T[],
	newItem: T,
	key: keyof T,
): T[] =>
	array.some((item) => item[key] === newItem[key])
		? array.map((item) => (item[key] === newItem[key] ? newItem : item))
		: [...array, newItem];
