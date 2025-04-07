import {Button, NumberInput, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {useEffect} from "react";

import {CreateFreelance, Freelance} from "~/lib/client";
import {createFreelance, updateFreelance} from "~/services";
import {validateEmail} from "~/lib/valiator/email";

type FormProjectProps = {
  freelance?: Freelance;
  onSubmitted?: () => void
};

const initialValues: CreateFreelance['object'] = {
  email: '',
  daily_rate: 0
}

export const FormFreelance = ({freelance, onSubmitted}: FormProjectProps) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validateInputOnChange: true,
    validate: {
      email: (value?: string | null) => value && validateEmail(value) ? null : 'Invalid email',
      daily_rate: (value: number) => value < 100 ? 'Invalid daily rate' : null
    },
  });

  useEffect(() => {
    if (freelance) {
      form.setValues({
        email: freelance?.email ?? 'dede',
        daily_rate: freelance?.daily_rate ?? 0,
      });
    }
  }, [freelance]);

  const handleSubmit = form.onSubmit(async (values) => {
    if (freelance) {
      await updateFreelance({
        ...values,
        id: freelance.id,
      } as Freelance);
      notifications.show({
        title: "Success",
        message: "Freelance updated successfully",
        color: "green",
        position: "bottom-center",
      });
    } else {
      const {data} = await createFreelance(values as Freelance);
      if (data) {
        notifications.show({
          title: "Success",
          message: "Freelance created successfully",
          color: "green",
          position: "bottom-center",
        });
      }
    }
    onSubmitted?.()
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Email"
        mb="sm"
        withAsterisk
        key={form.key("email")}
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