
import {
    FormControl,
    FormControlLabel,
    Checkbox as MuiCheckbox,
} from '@mui/material';

type TCheckboxProps = {
    name: string;
    label: string;
    value: boolean;
    onChange: (event: { target: { name: string; value: boolean } }) => void;
    //sx: any
}

const Checkbox = ({ name, label, value, onChange }: TCheckboxProps) => {
    const convertToDefEventPara = (name: string, value: boolean) => ({
        target: {
            name,
            value,
        },
    });
    return (
        <FormControl>
            <FormControlLabel
                control={
                    <MuiCheckbox
                        name={name}
                        color="primary"
                        checked={value}
                        onChange={(e) =>
                            onChange(convertToDefEventPara(name, e.target.checked))
                        }
                    />
                }
                label={label}
            />
        </FormControl>
    )
}

export default Checkbox
