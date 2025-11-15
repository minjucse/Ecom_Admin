import { Button, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

type TButtonProps = {
    color?: 'primary' | 'secondary' | 'success';
    onClick?: () => void;
    children?: any;
    [key: string]: any;
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        margin: theme.spacing(0.5),
    },
    secondary: {
        backgroundColor: theme.palette.secondary.light,
        "& .MuiButton-label": {
            color: theme.palette.secondary.main,
        },
    },
    primary: {
        backgroundColor: theme.palette.primary.light,
        "& .MuiButton-label": {
            color: theme.palette.primary.main,
        },
    },
    success: {
        backgroundColor: theme.palette.success.dark,
        "& .MuiButton-label": {
            color: theme.palette.success.main,
        },
    },
}));

const ActionButton = ({ color = 'primary', onClick, children, ...props }: TButtonProps) => {
    const classes = useStyles();

    return (
        <Button
            className={`${classes.root} ${classes[color]}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </Button>
    );
};

export default ActionButton;
