import { useState } from "react";

type InputNumberProps = {
	disabled?: boolean;
	handleChange?: (value: number) => void;
};

export function NumberInput({ disabled, handleChange }: InputNumberProps) {
	const [value, setValue] = useState(0);

	const handleAdd = () => {
		const newValue = +value + 0.5;
		if (newValue > 1) return;
		setValue(newValue);
		if (handleChange) {
			handleChange(newValue);
		}
	};

	const handleSubtract = () => {
		if (value > 1 || value === 0) return;
		const newValue = +value - 0.5;
		setValue(newValue);
		if (handleChange) {
			handleChange(newValue);
		}
	};

	return (
		<div className="flex flex-col p-2 mb-4">
			<button
				id="increaseButton"
				className=" p-1.5 border border-transparent text-center text-sm transition-all focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
				type="button"
				onClick={handleAdd}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="w-4 h-4"
					title="de"
				>
					<path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
				</svg>
			</button>
			<input
				id="amountInput"
				type="number"
				min="0"
				max="1"
				step="0.5"
				defaultValue={value}
				className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border-none rounded-md py-2  text-center transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
			/>
			<button
				className="p-1.5 border border-transparent text-center transition-allfocus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
				type="button"
				onClick={handleSubtract}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="w-4 h-4"
				>
					<text>i</text>
					<path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
				</svg>
			</button>
		</div>
	);
}
