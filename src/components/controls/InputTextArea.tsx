import { TextField, TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type TInputTextAreaProps = {
  name: string;
  label: string;
  rows?: number;
  disabled?: boolean;
} & Omit<TextFieldProps, "name" | "label">;

const InputTextArea = ({
  name,
  label,
  rows = 3,
  disabled,
  ...other
}: TInputTextAreaProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          variant="outlined"
          label={label}
          multiline
          rows={rows}
          error={!!errors[name]}
          helperText={(errors[name]?.message as string) || ""}
          disabled={disabled}
          fullWidth
          size="small"
          {...other}
        />
      )}
    />
  );
};

export default InputTextArea;
