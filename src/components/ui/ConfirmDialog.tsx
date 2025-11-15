import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import Controls from "@/components/controls";

type ConfirmDialogProps = {
  confirmDialog: {
    isOpen: boolean;
    title: string;
    subTitle: string;
    onConfirm: () => void;
  };
  setConfirmDialog: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      subTitle: string;
      onConfirm: () => void;
    }>
  >;
};

const ConfirmDialog = ({ confirmDialog, setConfirmDialog }: ConfirmDialogProps) => {
  return (
    <Dialog
      open={confirmDialog.isOpen}
      PaperProps={{
        sx: { p: 2, position: "absolute", top: 40 }, // theme.spacing(5) → 40px
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        <IconButton
          disableRipple
          sx={{
            backgroundColor: (theme) => theme.palette.secondary.light,
            color: (theme) => theme.palette.secondary.main,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.secondary.light,
              cursor: "default",
            },
            "& .MuiSvgIcon-root": {
              fontSize: "8rem",
            },
          }}
        >
          <NotListedLocationIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Controls.Button
          text="No"
          color="primary"
          onClick={() =>
            setConfirmDialog({ ...confirmDialog, isOpen: false })
          }
        />
        <Controls.Button
          text="Yes"
          color="secondary"
          onClick={confirmDialog.onConfirm}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
