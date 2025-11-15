// src/components/common/DatePicker.tsx
import { Controller, useFormContext } from "react-hook-form";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

type TDatePickerProps = {
  name: string;
  label: string;
};

const DatePicker = ({ name, label }: TDatePickerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MuiDatePicker
            label={label}
            value={field.value || null}
            onChange={(date: Dayjs | null) => field.onChange(date)}
            // ✅ Required for MUI v7 when using TextField
            enableAccessibleFieldDOMStructure={false}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
              },
            }}
            slots={{
              textField: TextField,
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default DatePicker;
