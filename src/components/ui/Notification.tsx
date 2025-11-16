import React from 'react';
import { makeStyles } from "@mui/styles";
import { Snackbar, Alert, Theme, SnackbarCloseReason } from "@mui/material";

type NotificationType = "success" | "error" | "info" | "warning";

type TNotify = {
    isOpen: boolean;
    type: NotificationType;
    message: string;
};

interface NotificationProps {
    notify: TNotify;
    setNotify: React.Dispatch<React.SetStateAction<TNotify>>;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        top: theme.spacing(9),
    },
}));

const Notification = ({ notify, setNotify }: NotificationProps) => {
    const classes = useStyles();

    const handleClose = (
         _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === "clickaway") return;
        setNotify({ ...notify, isOpen: false });
    };

    return (
        <Snackbar
            className={classes.root}
            open={notify.isOpen}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={handleClose}
        >
            <Alert severity={notify.type} onClose={handleClose}>
                {notify.message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
