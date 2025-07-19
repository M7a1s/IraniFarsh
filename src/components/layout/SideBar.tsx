import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useLocation } from "react-router-dom";

import { navHeader } from "@/utils/utils";

type SideBarPropsType = {
  openSideBar: boolean;
  toggleSideBar: (open: boolean) => void;
};

const SideBar: React.FC<SideBarPropsType> = ({ openSideBar, toggleSideBar }) => {
  const matches2 = useMediaQuery("(min-width: 780px)");
  const location = useLocation();

  React.useEffect(() => {
    toggleSideBar(false);
  }, [location.pathname, toggleSideBar]);

  if (location.pathname.startsWith("/auth") || matches2) {
    return null;
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List dir="rtl">
        {navHeader.map((e, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              to={e.path}
              sx={{
                columnGap: "10px",
                ...(location.pathname === e.path && {
                  color: "var(--color-primary)",
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: "fit-content !important" }}>
                <e.icon className="size-6 stroke-primary" />
              </ListItemIcon>

              <ListItemText
                primary={e.label}
                sx={{
                  ".MuiTypography-root": {
                    textAlign: "start",
                    width: "fit-content",
                  },
                }}
              />

              {openSideBar && location.pathname === e.path && <div className="w-2 h-2 rounded-full bg-primary"></div>}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer component="aside" anchor="right" open={openSideBar} onClose={() => toggleSideBar(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default SideBar;
