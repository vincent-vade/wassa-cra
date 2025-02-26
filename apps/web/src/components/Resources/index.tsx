import { Anchor, Breadcrumbs, Button, Group, Title } from "@mantine/core";
import Link from "next/link";

import { useRouter } from "next/router";
import {
	type Column,
	type ColumnRequireProps,
	DataTable,
} from "~/components/DataTable";
import { Layout } from "~/components/layout";
import { singularWord } from "~/lib/string/singular";

type ResourcesProps<T extends Record<keyof T, unknown>> = {
	title: string;
	resourceName: string;
	columns: Column<T>[];
	data: ColumnRequireProps<T>[];
};

const items = [
	{ title: "Home", href: "/" },
	{ title: "Mantine hooks", href: "#" },
	{ title: "use-id", href: "#" },
].map((item) => (
	<Anchor href={item.href} key={item.href}>
		{item.title}
	</Anchor>
));

export const Resources = <T extends Record<keyof T, unknown>>({
	title,
	columns,
	data,
	resourceName = "resource",
}: ResourcesProps<T>) => {
	const router = useRouter();

	console.log(router.asPath, router.pathname);

	if (data.length === 0) {
		return (
			<Layout>
				<Title order={2}>No data</Title>
			</Layout>
		);
	}

	const resourceNameLowercase = resourceName.toLowerCase();

	return (
		<Layout>
			<Group align="center" justify="space-between" mb="lg" mt="md">
				<Title order={2}>{title}</Title>
				<Button component={Link} href={`/admin/${resourceNameLowercase}/new`}>
					Create a new {singularWord(resourceNameLowercase)}
				</Button>
			</Group>
			<DataTable<T> columns={columns} data={data} />
		</Layout>
	);
};
