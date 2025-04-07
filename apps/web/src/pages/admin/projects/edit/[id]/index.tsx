import {Container, Paper, Title} from "@mantine/core";
import type {GetServerSidePropsContext} from "next";
import {Layout} from "~/components/layout";
import type {Project} from "~/lib/client";
import {FormProject} from "~/components/Form/Project";
import {getProjectById} from "~/services/projects";

type ClientDetailsPageProps = {
  project: Project;
};

export default function ClientDetailsPage({project}: ClientDetailsPageProps) {
  return (
    <Layout>
      <Container size="xs">
        <Paper radius="md" p="xl" withBorder>
          <Title order={2}>Edit Client {project?.name}</Title>
          <FormProject project={project}/>
        </Paper>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      project: await getProjectById(ctx.params?.id as string),
    },
  };
}
