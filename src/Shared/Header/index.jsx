import { AppBar, Avatar, IconButton, Toolbar, Typography, Box, Button } from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HEADER } from "../../utils/constants";
import { logout } from '../../stores/Action/authActions';

function Header({ handleDrawerToggle, selectedNavbar, selectedParentIndex }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const user = useSelector(state => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("userData"))?.user;

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("user-token");
    sessionStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${HEADER.DRAWER_WIDTH}px)` },
        ml: { md: `${HEADER.DRAWER_WIDTH}px` },
        backgroundColor: HEADER.HEADER_BACKGROUND_COLOR,
        color: HEADER.TEXT_COLOR,
      }}
    >
      <Toolbar className="flex items-center justify-between">
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: HEADER.ICON_COLOR }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap fontWeight={HEADER.HEADING_FONT_WEIGHT}>
            {selectedNavbar}
            {selectedParentIndex}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mr={3}>
          <Box display="flex" alignItems="center">
            <IconButton>
              <Avatar alt={user?.fullName} src={user?.profileImage || "/static/images/avatar/2.jpg"} />
            </IconButton>
            <Box display="flex" flexDirection="column" ml={1}>
              <Typography variant="body1">
                {user?.fullName || "User"}
              </Typography>
            </Box>
          </Box>
          <Box mx={2} />
          <Button
            variant="text"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
