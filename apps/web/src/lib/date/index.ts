import dayjs, { type Dayjs } from "dayjs";

export type DAYS = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function createDateRange(startDate: Dayjs, endDate: Dayjs) {
	const start = dayjs(startDate);
	const end = dayjs(endDate);
	const daysDiff = end.diff(start, "day");

	return Array.from({ length: daysDiff + 1 }, (_, i) => ({
		currDate: start.add(i, "day").format("DD"),
		dayOfWeek: start.add(i, "day").day(),
		day: start.add(i, "day"),
	}));
}

export function getAllDaysInCurrentMonth(month: number) {
	const now = dayjs().month(month - 1);
	const startOfMonth = now.startOf("month");
	const endOfMonth = now.endOf("month");

	return createDateRange(startOfMonth, endOfMonth);
}

export function getCurrentMonth(number: number) {
	return dayjs()
		.month(number - 1)
		.format("MMMM");
}

export function isWeekDay(day: DAYS) {
	return day === 0 || day === 6;
}
