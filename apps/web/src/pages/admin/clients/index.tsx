import {Button, Drawer, Group} from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import {type NextRouter, useRouter} from "next/router";

import type {Column} from "~/components/DataTable";
import {deleteModal} from "~/components/DeleteModal";
import {Resources} from "~/components/Resources";
import type {Client} from "~/lib/client";
import {deleteClientById, getClients} from "~/services/clients";
import {useDisclosure} from "@mantine/hooks";
import {useEffect} from "react";
import {FormClient} from "~/components/Form/Client";

export const columns: (routes: NextRouter) => Column<Client>[] = (router) => [
  {
    accessor: "id",
    Header: "ID",
  },
  {
    accessor: "email",
    Header: "Email",
  },
  {
    accessor: "name",
    Header: "Name",
  },
  {
    accessor: "phone",
    Header: "Name",
  },
  {
    accessor: "created_at",
    Header: "Created at",
    Row: ({created_at}) => dayjs(created_at as string).format("DD-MM-YYYY"),
  },
  {
    accessor: "updated_at",
    Header: "Updated at",
    Row: ({updated_at}) => {
      return updated_at
        ? dayjs(updated_at as string).format("DD-MM-YYYY")
        : null;
    },
  },
  {
    accessor: "actions",
    Header: "Actions",
    Row: (data) => (
      <Group>
        <Button
          variant="transparent"
          component={Link}
          href={`/admin/clients/edit/${data.id}`}
        >
          Edit
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={() =>
            deleteModal({
              title: `Delete client ${data.name}`,
              onConfirm: async () => {
                await deleteClientById(data.id);
                await router.push("/admin/clients");
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

export default function Clients({clients}: { clients: Client[] }) {
  const router = useRouter();
  const [opened, {open, close}] = useDisclosure(false);

  const data = clients?.map((client) => ({
    id: client?.id as string,
    name: client?.name,
    email: client?.email,
    phone: client?.phone,
    created_at: client?.created_at,
    updated_at: client?.updated_at,
  }));

  useEffect(() => {
    if (router.asPath === `/admin/clients?action=create`) {
      open();
    }
  }, [open, clients, router.asPath]);

  const handleClose = () => {
    close();
    router.push(`/admin/clients`);
  }

  return (
    <>
      <Resources
        resourceName="clients"
        title="Clients"
        columns={columns(router)}
        data={data}
        onCreateAction={() => {
          router.push(`/admin/clients?action=create`);
          if (router.asPath === `/admin/clients?action=create`) {
            open();
          }
        }}
      />
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Create a Client"
        position="right"
        overlayProps={{backgroundOpacity: 0.5, blur: 3}}
      >
        <FormClient onSubmitted={handleClose}/>
      </Drawer>
    </>

  );
}

export async function getServerSideProps() {
  return {
    props: {
      clients: await getClients(),
    },
  };
}
