import { TextField, TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from 'react-hook-form';

type TInputProps = {
  name: string;
  label: string;
  type: string;
  disabled?: boolean;
} & TextFieldProps;

const Input = ({ name, label, type, disabled }: TInputProps) => {
  const { control, formState: { errors } } = useFormContext();

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
          type={type}
          error={!!errors[name]}
          helperText={errors[name]?.message as string || ''}
          disabled={disabled}
          fullWidth
          size="small"
        />
      )}
    />
  );
};

export default Input;
