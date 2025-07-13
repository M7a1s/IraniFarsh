import { useContext, type ReactElement, type SyntheticEvent } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SnackBarContext } from "@/context/SnackBarProvider";

export const SnackbarComp = (): ReactElement => {
  const SnackBar = useContext(SnackBarContext);

  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    SnackBar?.closeDialog();
  };

  return (
    <Snackbar
      sx={{
        "@media (min-width:600px)": {
          left: "auto !important",
          right: 24,
        },
        "@media (min-width:450px)": {
          left: "auto !important",
          right: 10,
        },
      }}
      open={SnackBar?.Info.Open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={SnackBar?.Info.Status || "success"}
        className="!py-2 !w-full m-[env(safe-area-inset-bottom)]"
        variant="filled"
        sx={{
          padding: "0.75rem",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "0.5rem",
          borderRadius: "0.75rem",
          ".MuiAlert-icon": {
            padding: 0,
            margin: 0,
            justifyContent: "center",
            alignItems: "center",
          },
          ".MuiAlert-action": {
            padding: 0,
            margin: 0,
            justifyContent: "center",
            alignItems: "center",
            marginRight: "auto",
          },
          svg: {
            fill: "white",
          },
        }}
      >
        <span className="text-white text-sm font-[550]" dir="rtl">
          {SnackBar?.Info?.Title}
        </span>
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComp;
