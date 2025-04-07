import {Button, Select, Switch, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {useEffect, useState} from "react";

import {CreateProject, Project} from "~/lib/client";
import {createProject, updateProject} from "~/services/projects";
import {getClients} from "~/services/clients";

type FormProjectProps = {
  project?: Project;
  onSubmitted?: () => void
};

type SelectValue = {
  value: string;
  label: string
}

const initialValues: CreateProject['object'] = {
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  client_id: "",
  is_active: true
};


export const FormProject = ({project, onSubmitted}: FormProjectProps) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: {
      name: (value?: string) =>
        value && value.length < 2 ? "Name must have at least 2 letters" : undefined,
    },
  });

  const [clients, setClients] = useState<SelectValue[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getClients().then((clients) => {
      const mappedClients: SelectValue[] = clients?.map((client) => ({
        value: client?.id as string,
        label: client?.name as string
      }))
      setClients(mappedClients ?? []);
    })
    form.setValues({
      name: project?.name,
      description: project?.description,
      start_date: project?.start_date,
      end_date: project?.end_date,
    });
  }, [project]);

  const handleSubmit = form.onSubmit(async (values) => {
    if (project) {
      await updateProject({
        ...values,
        id: project.id,
      });
      notifications.show({
        title: "Success",
        message: "Project updated successfully",
        color: "green",
        position: "bottom-center",
      });
    } else {
      console.log(values)
      await createProject(values);
      notifications.show({
        title: "Success",
        message: "Project created successfully",
        color: "green",
        position: "bottom-center",
      });
    }
    onSubmitted?.()
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Name"
        mb="sm"
        withAsterisk
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <Select
        label="Client"
        mb="sm"
        key={form.key("client_id")}
        data={clients}
        {...form.getInputProps("client_id")}
      />
      <TextInput
        label="Description"
        mb="sm"
        key={form.key("description")}
        {...form.getInputProps("description")}
      />
      <TextInput
        label="Start Date"
        mb="sm"
        key={form.key("start_date")}
        {...form.getInputProps("start_date")}
      />
      <TextInput
        label="End Date"
        mb="sm"
        key={form.key("end_date")}
        {...form.getInputProps("end_date")}
      />
      <Switch
        // checked={form.values.is_active}
        label="Active"
        mb="sm"
        size="sm"
        key={form.key("is_active")}
        {...form.getInputProps("is_active")}
      />
      <Button type="submit" disabled={!form.isValid()}>Submit</Button>
    </form>
  );
};