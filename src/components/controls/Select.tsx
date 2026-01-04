import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type Option = { id?: string; _id?: string; name: string };

type SelectProps = {
  name: string;
  label: string;
  options: Option[];
  disabled?: boolean;
};

const Select = ({ name, label, options, disabled }: SelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          fullWidth
          variant="outlined"
          error={!!errors[name]}
          disabled={disabled}
        >
          <InputLabel>{label}</InputLabel>
          <MuiSelect
            {...field}
            label={label}
            disabled={disabled}
            onChange={(event: SelectChangeEvent<string>) =>
              field.onChange(event.target.value)
            }
            value={field.value ?? ""}
          >
            <MenuItem value="">None</MenuItem>
            {options.map((item) => (
              <MenuItem key={item.id || item._id} value={item.id || item._id}>
                {item.name}
              </MenuItem>
            ))}
          </MuiSelect>
          {errors[name] && (
            <FormHelperText>
              {errors[name]?.message as string}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default Select;
