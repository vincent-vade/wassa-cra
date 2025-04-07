import {Button, Select, Switch, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";

import {CreateProject, Project} from "~/lib/client";
import {getClients} from "~/services/clients";
import {createProject, updateProject} from "~/services";
import {notifications} from "@mantine/notifications";

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
  start_date: undefined,
  end_date: undefined,
  client_id: "",
  is_active: false
};

export const FormProject = ({project, onSubmitted}: FormProjectProps) => {
  const form = useForm({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues,
    validate: {
      name: (value?: string | null) => value!.length < 4 ? "Name must have at least 4 letters" : null,
    },
  });

  const [clients, setClients] = useState<SelectValue[]>([]);

  useEffect(() => {
    if (project) {
      form.setValues({
        name: project?.name,
        description: project?.description,
        start_date: project?.start_date,
        end_date: project?.end_date,
        is_active: project?.is_active
      });
    }
  }, [project]);

  useEffect(() => {
    getClients().then((clients) => {
      const mappedClients: SelectValue[] = clients?.map((client) => ({
        value: client?.id as string,
        label: client?.name as string
      }))
      setClients(mappedClients ?? []);
    })
  }, [])

  const handleSubmit = form.onSubmit(async (values) => {
    if (project) {
      await updateProject({
        ...values,
        id: project.id,
      } as Project);
      notifications.show({
        title: "Success",
        message: "Project updated successfully",
        color: "green",
        position: "bottom-center",
      });
    } else {
      await createProject(values as Project);
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