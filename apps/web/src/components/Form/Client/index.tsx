import {Button, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {useEffect} from "react";

import type {Client} from "~/lib/client";
import {createClient, updateClient} from "~/services/clients";

type FormClientProps = {
  client?: Client;
  onSubmitted?: () => void
};

const initialValues = {
  name: "",
  email: "",
  phone: "",
};

export const FormClient = ({client, onSubmitted}: FormClientProps) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: {
      name: (value?: string) =>
        value && value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value?: string) =>
        value && /^\S+@\S+$/.test(value) ? null : "Invalid email",
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.setValues({
      name: client?.name,
      email: client?.email,
      phone: client?.phone,
    });
  }, [client]);

  const handleSubmit = form.onSubmit(async (values) => {
    if (client) {
      await updateClient({
        ...values,
        id: client.id,
      });
      notifications.show({
        title: "Success",
        message: "Le client a bien ete modifie",
        color: "green",
        position: "bottom-center",
      });
    } else {
      await createClient(values);
      notifications.show({
        title: "Success",
        message: "Le client a bien ete ajoute",
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
        key={form.key("name")}
        mb="sm"
        withAsterisk
        {...form.getInputProps("name")}
      />
      <TextInput
        label="Email"
        key={form.key("email")}
        mb="sm"
        withAsterisk
        {...form.getInputProps("email")}
      />
      <TextInput
        label="Phone"
        key={form.key("phone")}
        mb="sm"
        {...form.getInputProps("phone")}
      />
      <Button mt="md" type="submit" disabled={!form.isValid()}>
        {client?.id ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
