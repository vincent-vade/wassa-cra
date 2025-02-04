import {Client, client} from "~/lib/client";

export default function Clients({clients}: {clients: Client[]}) {
  return (
    <>
      <h1>Clients</h1>
      {clients?.map((client) => (
        <li key={client?.id}>
          <a href={`/clients/${client?.id}`}>{client?.name}</a>
        </li>
      ))}
    </>
  );
}

export async function getServerSideProps() {
  const fetchClients = async () => {
    const { data } = await client.GET('/api/rest/clients')
    return data?.clients as Client[]
  };

  return {
    props: {
      clients: await fetchClients()
    },
  };
}