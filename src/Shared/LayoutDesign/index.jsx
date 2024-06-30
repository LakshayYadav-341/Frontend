import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import NavbarDrawer from "../NavbarDrawer";
import Header from "../Header";
import { useLocation } from "react-router-dom";
import useSideNavData from "../NavbarDrawer/hooks/useSideNavData";
import { useSelector } from "react-redux";

const HEADER_HEIGHT = 64;
const drawerWidth = 240;

function ResponsiveDrawer({ showSidebarAndHeader, children }) {
  const location = useLocation();
  const path = location.pathname;
  const parts = path.split("/");
  const defaultRoute = parts[1];

  // const user = useSelector(state => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("userData")).user
  
  const sideNavData = useSideNavData(user.userType);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedNavbar, setSelectedNavbar] = useState("");
  const [selectedParentIndex, setSelectedParentIndex] = useState(null);

  useEffect(() => {
    const getLabelFromPath = (pathData) => {
      for (const item of sideNavData) {
        if (item.navigateRoute && item.navigateRoute === pathData) {
          return item.label;
        }
        if (item.child) {
          for (const childItem of item.child) {
            if (childItem.navigateRoute && childItem.navigateRoute === pathData) {
              return childItem.label;
            }
          }
        }
      }
      return null;
    };

    const label = getLabelFromPath(defaultRoute);
    setSelectedNavbar(label || "");
  }, [defaultRoute, sideNavData]);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      {showSidebarAndHeader && (
        <>
          <Box
            component="nav"
            sx={{
              width: { md: drawerWidth },
              flexShrink: { md: 0 },
            }}
            aria-label="mailbox folders"
          >
            <NavbarDrawer
              setIsClosing={setIsClosing}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              selectedNavbar={selectedNavbar}
              setSelectedNavbar={setSelectedNavbar}
              selectedParentIndex={selectedParentIndex}
              setSelectedParentIndex={setSelectedParentIndex}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "hidden",
              paddingTop: `${HEADER_HEIGHT}px`,
            }}
          >
            <Header
              handleDrawerToggle={handleDrawerToggle}
              selectedNavbar={selectedNavbar}
              selectedParentIndex={selectedParentIndex}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 3,
              }}
            >
              {children}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default ResponsiveDrawer;
