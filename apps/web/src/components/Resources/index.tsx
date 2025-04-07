import {Button, Group, Title} from "@mantine/core";

import {type Column, type ColumnRequireProps, DataTable,} from "~/components/DataTable";
import {Layout} from "~/components/layout";
import {singularWord} from "~/lib/string/singular";

type ResourcesProps<T extends Record<keyof T, unknown>> = {
  title: string;
  resourceName: string;
  columns: Column<T>[];
  data: ColumnRequireProps<T>[];
  onCreateAction: () => void
};

export const Resources = <T extends Record<keyof T, unknown>>({
                                                                title,
                                                                columns,
                                                                data,
                                                                resourceName = "resource",
                                                                onCreateAction
                                                              }: ResourcesProps<T>) => {
  const resourceNameLowercase = resourceName.toLowerCase();


  if (data.length === 0) {
    return (
      <Layout>
        <Title order={2}>No data</Title>
      </Layout>
    );
  }


  return (
    <Layout>
      <Group align="center" justify="space-between" mb="lg" mt="md">
        <Title order={2}>{title}</Title>
        <Button onClick={onCreateAction}>
          Create a new {singularWord(resourceNameLowercase)}
        </Button>
      </Group>
      <DataTable<T> columns={columns} data={data}/>
    </Layout>
  );
};
