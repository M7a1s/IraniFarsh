import  { createContext, useState, type ReactNode, useCallback } from "react";

type Status = "success" | "error" | "warning" | "info";

interface DialogData {
  Title: string;
  Open: boolean;
  Status: Status;
}

interface SnackBarContextType {
  Info: DialogData;
  showDialog: (title: string, status?: Status) => void;
  closeDialog: () => void;
}

export const SnackBarContext = createContext<SnackBarContextType | undefined>(undefined);

export const SnackBarProvider = ({ children }: { children: ReactNode }) => {
  const [Info, setInfo] = useState<DialogData>({
    Title: "",
    Open: false,
    Status: "success",
  });

  const showDialog = useCallback((title: string, status: Status = "success") => {
    setInfo({ Title: title, Open: true, Status: status });
  }, []);

  const closeDialog = useCallback(() => {
    setInfo((prev) => ({ ...prev, Open: false }));
  }, []);

  return <SnackBarContext.Provider value={{ Info, showDialog, closeDialog }}>{children}</SnackBarContext.Provider>;
};


