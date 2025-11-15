import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import Controls from "@/components/controls";

type TPopupProps ={
  title: string;
  children: React.ReactNode;
  openPopup: boolean;
  setOpenPopup: (isOpen: boolean) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  dialogWrapper: {
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(5),
  },
  dialogTitle: {
    paddingRight: "0px",
  },
}));

const Popup = ({ title, children, openPopup, setOpenPopup }: TPopupProps) => {
  const classes = useStyles();

  return (
    <Dialog
      open={openPopup}
      maxWidth="md"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Controls.ActionButton
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default Popup;
