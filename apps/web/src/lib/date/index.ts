import dayjs, { type Dayjs } from 'dayjs';

export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const dayOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type Day = {
	currDate: string;
	dayOfWeek: DayOfWeekIndex;
	dayOfWeekLabel: string;
	day: Dayjs;
};
export type Days = Day[];

export function createDateRange(startDate: Dayjs, endDate: Dayjs) {
	const start = dayjs(startDate);
	const end = dayjs(endDate);
	const daysDiff = end.diff(start, 'day');

	return Array.from({ length: daysDiff + 1 }, (_, i) => ({
		currDate: start.add(i, 'day').format('DD'),
		dayOfWeek: start.add(i, 'day').day(),
		dayOfWeekLabel: dayOfWeekLabels[start.add(i, 'day').day()],
		day: start.add(i, 'day'),
	}));
}

export const getAllDaysInCurrentMonth = (month: number): Days => {
	const now = dayjs().month(month - 1);
	const startOfMonth = now.startOf('month');
	const endOfMonth = now.endOf('month');

	return createDateRange(startOfMonth, endOfMonth);
};

export function getCurrentMonth(num: number) {
	return dayjs()
		.month(num - 1)
		.format('MMMM');
}

export function isWeekendDay(day: DayOfWeekIndex) {
	return day === 0 || day === 6;
}
