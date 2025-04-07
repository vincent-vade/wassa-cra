import {Button, Drawer, Group, NumberFormatter, Stack} from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import {type NextRouter, useRouter} from "next/router";

import type {Column} from "~/components/DataTable";
import {deleteModal} from "~/components/DeleteModal";
import {Resources} from "~/components/Resources";
import type {Freelance} from "~/lib/client";
import {deleteFreelanceById, getFreelances} from "~/services/freelances";
import {useEffect} from "react";
import {useDisclosure} from "@mantine/hooks";
import {FormFreelance} from "~/components/Form/Freelance";

export const columns: (router: NextRouter) => Column<Freelance>[] = (
  router,
) => [
  {
    accessor: "id",
    Header: "Id",
  },
  {
    accessor: "email",
    Header: "Email",
  },
  {
    accessor: "daily_rate",
    Header: "Daily rate",
    Row: ({daily_rate}) => (
      <NumberFormatter
        prefix="€ "
        value={daily_rate as number}
        thousandSeparator
      />
    ),
  },
  {
    accessor: "created_at",
    Header: "Created at",
    Row: ({created_at}) => dayjs(created_at as string).format("DD-MM-YYYY"),
  },
  {
    accessor: "updated_at",
    Header: "Updated at",
    Row: ({updated_at}) =>
      updated_at ? dayjs(updated_at as string).format("DD-MM-YYYY") : null,
  },
  {
    accessor: "actions",
    Header: "Actions",
    Row: (data) => (
      <Group>
        <Button
          variant="transparent"
          component={Link}
          href={`/admin/freelances/edit/${data.id}`}
        >
          Edit
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={() =>
            deleteModal({
              title: `Delete freelance ${data.email}`,
              onConfirm: async () => {
                await deleteFreelanceById(data.id);
                await router.push("/admin/freelances");
              },
            })
          }
        >
          Delete
        </Button>
      </Group>
    ),
  },
];

export default function Freelances({
                                     freelances,
                                   }: { freelances: Freelance[] }) {
  const router = useRouter();
  const [opened, {open, close}] = useDisclosure(false);

  const data = freelances?.map((freelance) => ({
    id: freelance?.id as string,
    email: freelance?.email,
    daily_rate: freelance?.daily_rate,
    created_at: freelance?.created_at,
    updated_at: freelance?.updated_at,
  }));

  useEffect(() => {
    if (router.asPath === `/admin/freelances?action=create`) {
      open();
    }
  }, [open, router.asPath]);

  const handleClose = () => {
    close();
    router.push(`/admin/freelances`);
  }

  return (
    <>
      <Resources
        resourceName="freelances"
        title="Freelances"
        columns={columns(router)}
        data={data}
        onCreateAction={() => {
          router.push(`/admin/freelances?action=create`);
          if (router.asPath === `/admin/freelances?action=create`) {
            open();
          }
        }}
      />
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Create a freelance"
        position="right"
        size="lg"
        overlayProps={{backgroundOpacity: 0.5, blur: 3}}
      >
        <Stack p="md">
          <FormFreelance onSubmitted={handleClose}/>
        </Stack>
      </Drawer>
    </>

  );
}

export async function getServerSideProps() {
  return {
    props: {
      freelances: await getFreelances(),
    },
  };
}
