import { useContext, type ReactElement } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { Link, Navigate, useLocation } from "react-router-dom";
import DashboardAuth from "@/components/dashboard/DashboardAuth";
import DashboardOrder from "@/components/dashboard/DashboardOrder";
import { ArrowLeft2, User, Card, Logout, Edit } from "iconsax-react";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { setDocumentTitle } from "@/utils/utils";

type DialogType = {
  open: boolean;
  title: string;
  content: string;
  cancleBtn: string;
  agreebtn: string;
  handleClick?: (() => void) | null;
};

const Dashboard = (): ReactElement => {
  const Auth = useContext(AuthContext);
  const location = useLocation();
  const [DialogState, setDialogState] = React.useState<DialogType>({
    open: false,
    title: "",
    content: "",
    cancleBtn: "",
    agreebtn: "",
    handleClick: null,
  });

  const handleClickOpen = (title: string, content: string, cancleBtn: string, agreebtn: string, handleClick: (() => void) | null) => {
    setDialogState({
      open: true,
      title: title,
      content: content,
      cancleBtn: cancleBtn,
      agreebtn: agreebtn,
      handleClick: handleClick ? () => handleClick() : null,
    });
  };

  const handleClose = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const path = [
    {
      icon: User,
      label: "اطلاعات کاربری",
      path: "/dashboard/auth",
      element: <DashboardAuth />,
    },
    {
      icon: Card,
      label: "سفارش",
      path: "/dashboard/order",
      element: <DashboardOrder />,
    },
    {
      icon: Logout,
      label: "خروج",
      onclick: () => handleClickOpen("خروج", "ایا مطمئنید میخواهید خارج شوید ؟", "انصراف", "خروج", Auth?.handleLogOut ?? null),
      element: <DashboardOrder />,
    },
  ];

  const findElem = path.find((e) => e.path === location.pathname);

  React.useEffect(() => {
    if (findElem?.label) {
      setDocumentTitle(findElem.label);
    }
  }, [location.pathname, findElem]);

  const matches = useMediaQuery(`(min-width: ${location.pathname === "/dashboard/order" ? "1100px" : "768px"})`);

  if (!Auth?.isLoading && !Auth?.isLogin) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <React.Fragment>
      <div className={`w-full flex ${matches ? "flex-row" : "flex-col"} items-start BodyPadding gap-6`}>
        <div className={`${matches ? "w-72" : "w-full"} space-y-5`}>
          <div className={`w-full h-23 bg-white shadow-2xl border border-neutral5 rounded-2xl flex justify-start items-center px-6 gap-4 ${Auth.isLoading ? "animate-pulse" : ""}`}>
            {Auth.isLoading ? (
              <>
                <div className="rounded-full w-14 h-14 bg-neutral5"></div>
                <div className="space-y-2">
                  <div className="w-20 h-3 rounded-full bg-neutral5"></div>
                  <div className="w-32 h-2 rounded-full bg-neutral5"></div>
                </div>

                <div className="mr-auto">
                  <Edit className="size-6 stroke-neutral5" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center border rounded-full w-14 h-14 border-primary">
                  <User className="size-7 stroke-primary" />
                </div>
                <p className="font-bold text-right text-neutral-gray-10 line-clamp-1">
                  {Auth.userData?.first_name} {Auth.userData?.last_name}
                </p>

                <Link to="/dashboard/auth" className="mr-auto">
                  <Edit className="size-6 stroke-primary" />
                </Link>
              </>
            )}
          </div>

          <div className="w-full bg-white shadow-2xl border border-neutral5 rounded-2xl flex flex-col overflow-hidden">
            {path.map((e, index) => {
              const isActive = location.pathname === e.path;

              return (
                <Button
                  key={index}
                  component={e.path ? Link : "button"}
                  {...(e.path ? { to: e.path } : { onClick: e.onclick })}
                  className={`flex justify-start items-center gap-x-3 ${!isActive && "group"}`}
                  sx={{
                    borderRadius: "unset",
                    padding: "16px",
                    paddingLeft: "8px",
                    height: "56px",
                    color: `${isActive ? "var(--color-primary)" : "var(--color-black)"}`,
                    backgroundColor: `${isActive ? "color-mix(in oklab, var(--color-primary) 10%, transparent)" : ""}`,
                    "&:hover": {
                      backgroundColor: `${!isActive && "color-mix(in oklab, var(--color-primary) 20%, transparent)"}`,
                    },
                    "& .MuiTouchRipple-root span": {
                      color: "color-mix(in oklab, var(--color-black) 90%, transparent)",
                    },
                  }}
                >
                  <e.icon className={`size-6 transition-all ${isActive ? "stroke-primary" : "stroke-black group-hover:stroke-primary"}`} />
                  <p className={`transition-all ${isActive ? "text-primary" : "group-hover:text-primary"}`}>{e.label}</p>
                  <ArrowLeft2 className={`size-6 transition-all mr-auto ${isActive ? "stroke-primary" : "stroke-black group-hover:stroke-primary"}`} />
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 w-full bg-white shadow-2xl border border-neutral5 rounded-2xl flex flex-col p-6">
          <h1 className="h5 pb-5">{findElem?.label}</h1>

          {findElem?.element}
        </div>
      </div>

      <Dialog open={DialogState.open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ ".css-10d30g3-MuiPaper-root-MuiDialog-paper": { borderRadius: "16px" } }}>
        <DialogTitle id="alert-dialog-title">{DialogState?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{DialogState?.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: "8px",
              color: "var(--color-primary)",
              "&:hover": {
                backgroundColor: "color-mix(in oklab, var(--color-primary) 10%, transparent)",
              },
              "& .MuiTouchRipple-root span": {
                color: "color-mix(in oklab, var(--color-primary) 60%, transparent)",
              },
            }}
          >
            {DialogState?.cancleBtn}
          </Button>
          <Button
            onClick={() => {
              DialogState?.handleClick?.();
            }}
            sx={{
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "color-mix(in oklab, #1976d2 10%, transparent)",
              },
              "& .MuiTouchRipple-root span": {
                color: "color-mix(in oklab, #1976d2 60%, transparent)",
              },
            }}
          >
            {DialogState?.agreebtn}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Dashboard;
