import { Title } from "@mantine/core";
import {
	type Column,
	type ColumnRequireProps,
	DataTable,
} from "~/components/DataTable";
import { Layout } from "~/components/layout";

export const Resources = <T extends Record<keyof T, unknown>>({
	title,
	columns,
	data,
}: { title: string; columns: Column<T>[]; data: ColumnRequireProps<T>[] }) => {
	if (data.length === 0) {
		return (
			<Layout>
				<Title order={2}>No data</Title>
			</Layout>
		);
	}

	return (
		<Layout>
			<Title order={2} mb="md">
				{title}
			</Title>
			<DataTable<T> columns={columns} data={data} />
		</Layout>
	);
};
