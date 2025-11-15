import { Button as MuiButton, styled } from "@mui/material";

type TButtonProps = {
  text?: string;
  size?: "small" | "medium" | "large";
  color?: "inherit" | "primary" | "secondary" | "success";
  variant?: "text" | "outlined" | "contained";
  onClick?: () => void;
  children?: any;
  [key: string]: any;
};

const StyledButton = styled(MuiButton)(({ theme }) => ({
  margin: theme.spacing(0.5), // ✅ works in v7
  textTransform: "none", // ✅ remove uppercase
}));

const Button = ({
  text,
  size = "medium",
  color = "primary",
  variant = "contained",
  onClick,
  children,
  ...props
}: TButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      color={color}
      onClick={onClick}
      {...props}
    >
      {text || children}
    </StyledButton>
  );
};

export default Button;
