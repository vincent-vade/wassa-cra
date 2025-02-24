import classes from "./DataTable.module.css";

import { ScrollArea, Table } from "@mantine/core";
import { type ReactNode, useState } from "react";

export type ColumnRequireProps<T> = {
	id: string;
} & T;

export type Column<T> = {
	accessor?: keyof T | string;
	Header: ((data: unknown) => ReactNode) | string;
	Row?: (data: ColumnRequireProps<T>) => ReactNode | string;
	Actions?: (data: ColumnRequireProps<T>) => ReactNode;
};

type DataTableProps<T> = {
	columns: Column<T>[];
	data: ColumnRequireProps<T>[];
};

export const DataTable = <T extends Record<keyof T, unknown>>({
	columns,
	data,
}: DataTableProps<T>) => {
	const [scrolled, setScrolled] = useState(false);

	const findColumn = (accessor: string) =>
		columns.find((column) => column.accessor === accessor);

	return (
		<ScrollArea
			h={300}
			onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
		>
			<Table
				miw={700}
				verticalSpacing="sm"
				striped
				highlightOnHover
				withTableBorder
			>
				<Table.Thead className={classes.header}>
					<Table.Tr>
						{columns.map((column) => (
							<Table.Th key={column.accessor as string}>
								{typeof column.Header === "function"
									? column.Header(column)
									: column.Header}
							</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data?.map((row) => (
						<Table.Tr key={row.id}>
							{Object.entries(row).map(([key, value]) => (
								<Table.Td key={key}>
									{findColumn(key)?.Row?.(row) ?? value}
								</Table.Td>
							))}
							{findColumn("actions") && (
								<Table.Td>{findColumn("actions")?.Row?.(row)}</Table.Td>
							)}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</ScrollArea>
	);
};
