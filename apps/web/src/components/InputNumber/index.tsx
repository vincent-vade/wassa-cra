import { useState } from "react";

type InputNumberProps = {
	taskId: string;
	idx: number;
	disabled?: boolean;
	handleChange: (val: number, taskId: string, idx: number) => void;
	val: number;
	defaultValue: number;
};

const MIN_VALUE = 0;
const MAX_VALUE = 1;
const STEP = 0.5;

const increment = (val: number) => (val < MAX_VALUE ? val + STEP : MAX_VALUE);
const decrement = (val: number) => (val > MIN_VALUE ? val - STEP : MIN_VALUE);

export function NumberInput({
	taskId,
	idx,
	disabled,
	handleChange,
	defaultValue,
}: InputNumberProps) {
	const [value, setValue] = useState(defaultValue ?? 0);

	const handleAdd = (taskId, idx) => () => {
		const newValue = increment(value);

		setValue(newValue);

		if (handleChange) {
			handleChange(newValue, taskId, idx);
		}
	};
	const handleSubtract = (taskId, idx) => () => {
		const newValue = decrement(value);

		setValue(newValue);

		if (handleChange) {
			handleChange(newValue, taskId, idx);
		}
	};

	return (
		<div className="p-1 mr-2" style={{ display: "flex", minWidth: "50px" }}>
			<input
				key={`amountInput-${taskId}-${idx}`}
				type="number"
				min="0"
				max="1"
				step="0.5"
				disabled={disabled}
				value={value}
			/>
			<div>
				<button
					id="increaseButton"
					className=" border border-transparent text-center text-sm transition-all focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
					type="button"
					disabled={disabled}
					onClick={handleAdd(taskId, idx)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="w-4 h-4"
					>
						<path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
					</svg>
				</button>
				<button
					className="border border-transparent text-center transition-allfocus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
					type="button"
					disabled={disabled}
					onClick={handleSubtract(taskId, idx)}
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
		</div>
	);
}
