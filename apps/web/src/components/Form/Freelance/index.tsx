import {Button, NumberInput, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {useEffect} from "react";

import {CreateFreelance, Freelance} from "~/lib/client";
import {createFreelance, updateProject} from "~/services";

type FormProjectProps = {
  freelance?: Freelance;
  onSubmitted?: () => void
};

const initialValues: CreateFreelance['object'] = {
  email: null,
  daily_rate: null,
};

export const FormFreelance = ({freelance, onSubmitted}: FormProjectProps) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: {
      daily_rate: (value: string) => value && value.length < 2 ? "Name must have at least 2 letters" : undefined
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.setValues({
      email: freelance?.email,
      daily_rate: freelance?.daily_rate,
    });
  }, [freelance]);

  console.log(form.errors)

  const handleSubmit = form.onSubmit(async (values) => {
    if (freelance) {
      await updateProject({
        ...values,
        id: freelance.id,
      });
      notifications.show({
        title: "Success",
        message: "Freelance updated successfully",
        color: "green",
        position: "bottom-center",
      });
    } else {
      await createFreelance(values as Freelance);
      notifications.show({
        title: "Success",
        message: "Freelance created successfully",
        color: "green",
        position: "bottom-center",
      });
    }
    onSubmitted?.()
  }, (errors) => {
    const firstErrorPath = Object.keys(errors)[0];
    form.getInputNode(firstErrorPath)?.focus();
  });

  console.log(form.isValid())

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Email"
        mb="sm"
        withAsterisk
        key={form.key("email")}
        type="email"
        {...form.getInputProps("email")}
      />
      <NumberInput
        label="Daily rate"
        mb="sm"
        withAsterisk
        key={form.key("daily_rate")}
        {...form.getInputProps("daily_rate")}
      />
      <Button mt="md" type="submit" disabled={!form.isValid()}>
        {freelance?.id ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};