export const singularWord = (word: string) => {
	return word.slice(-1) === "s" ? word.slice(0, -1) : word;
};
