import {
	client,
	CreateTimesheet,
	Timesheet,
	TimesheetByProjectTaskIdAndPeriod,
	TimesheetsByPeriod,
	UpdateTimesheetByPeriod,
} from '~/lib/client';

export const getTimesheets = async () => {
	const response = await client.GET('/api/rest/timesheets');
	return response.data?.timesheets as Timesheet[];
};

export const updateTimesheetByPeriod = async (
	freelanceId: string,
	period: string,
	projectTaskId: string,
	working_durations: number[]
) => {
	const response = await client.PUT(`/api/rest/timesheets/period/{period}`, {
		params: {
			path: {
				period,
			},
		},
		body: {
			freelance_id: freelanceId,
			project_task_id: projectTaskId,
			newData: {
				working_durations,
			},
		},
	});

	return response as UpdateTimesheetByPeriod;
};

export const getTimesheetsByPeriod = async (
	freelanceId: string | undefined,
	period: string
) => {
	if (!freelanceId || !period) return [];

	const response = await client.GET(`/api/rest/timesheets/period/{period}`, {
		params: {
			path: {
				period,
			},
			query: {
				freelance_id: freelanceId,
			},
		},
	});
	return response.data?.timesheets as TimesheetsByPeriod[];
};

export const getTimesheetsByProjectTaskIdAndPeriod = async (
	freelanceId: string | undefined,
	period: string,
	projectTaskId: string
) => {
	if (!freelanceId || !period || !projectTaskId) return [];

	const response = await client.GET(
		'/api/rest/timesheets/project-task/{project_task_id}/period/{period}',
		{
			params: {
				path: {
					project_task_id: projectTaskId,
					period,
				},
				query: {
					freelance_id: freelanceId,
				},
			},
		}
	);

	return response.data?.timesheets as TimesheetByProjectTaskIdAndPeriod[];
};

export const getTimesheetById = async (id: string) => {
	const { data } = await client.GET(`/api/rest/timesheets/{id}`, {
		params: {
			path: {
				id,
			},
		},
	});
	return data?.timesheets_by_pk as Timesheet;
};

export const createTimesheet = async (timesheet: CreateTimesheet) => {
	try {
		const result = await client.POST('/api/rest/timesheets', {
			body: timesheet,
		});
		return result;
	} catch (e: unknown) {
		throw new Error('Error creating timesheet', e);
	}
	// return []; //data?.timesheet as Timesheet;
};
