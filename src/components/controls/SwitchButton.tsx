
import { Switch} from '@mui/material'; 

type SwitchButtonProps = {
  name: string;
  value: boolean; 
  onChange: (event: { target: { name: string; value: boolean } }) => void; 
};

const SwitchButton = ({ name, value, onChange }: SwitchButtonProps) => {
  const handleChange = (event: { target: { checked: boolean } }) => {
    onChange({
      target: {
        name,
        value: event.target.checked, 
      },
    });
  };

  return (
    <Switch
      checked={value}
      onChange={handleChange}
      name={name}
      color="primary"
    />
  );
};

export default SwitchButton;
