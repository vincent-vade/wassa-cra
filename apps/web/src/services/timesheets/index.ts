import { client, Timesheet } from "~/lib/client";

export const getTimesheets = async () => {
    const { data } = await client.GET("/api/rest/timesheets");
    return data?.timesheets as Timesheet[];
};

export const getTimesheetById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/timesheets/${id}`);
    return data?.timesheet as Timesheet;
};