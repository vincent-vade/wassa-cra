import {Container, Paper, Title} from "@mantine/core";
import type {GetServerSidePropsContext} from "next";
import {Layout} from "~/components/layout";
import type {Freelance} from "~/lib/client";
import {FormFreelance} from "~/components/Form/Freelance";
import {getFreelanceById} from "~/services";

type ClientDetailsPageProps = {
  freelance: Freelance;
};

export default function ClientDetailsPage({freelance}: ClientDetailsPageProps) {
  return (
    <Layout>
      <Container size="xs">
        <Paper radius="md" p="xl" withBorder>
          <Title order={2}>Edit Client {freelance?.email}</Title>
          <FormFreelance freelance={freelance}/>
        </Paper>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      freelance: await getFreelanceById(ctx.params?.id as string),
    },
  };
}
