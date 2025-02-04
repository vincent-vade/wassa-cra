import {Client, client} from "~/lib/client";

export default function ClientPage({ client }: {client: Client}) {
  return (
    <>
      <h1>{client?.name}</h1>
    </>
  );
}

export async function getServerSideProps({params}: { params: { id: string } }) {
  const fetchClient = async (id: string) => {
    const { data } = await client.GET('/api/rest/clients/{id}', {
      params: {
        path: {
          id
        },
        params: {

        }
      }
    })
    return data?.clients_by_pk
  };

  return {
    props: {
      client: await fetchClient(params.id)
    },
  }
}