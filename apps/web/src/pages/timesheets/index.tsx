import {client, Timesheet} from "~/lib/client";
import Link from "next/link";

export default function Timesheets({timesheets}: {timesheets: Timesheet[]}) {
  return (
    <>
      <Link href={"/timesheets/new"}>new timesheet</Link>
      <h1>Timesheets</h1>
      {timesheets?.map((timesheet) => (
        <li key={timesheet?.id}>
          <Link href={`/timesheets/${timesheet?.id}`}>{timesheet?.id}</Link>
        </li>
      ))}
    </>
  );
}

export async function getServerSideProps() {
  const fetchTimesheets = async () => {
    const { data } = await client.GET('/api/rest/timesheets')
    return data?.timesheets as Timesheet[]
  };

  return {
    props: {
      timesheets: await fetchTimesheets()
    },
  };
}