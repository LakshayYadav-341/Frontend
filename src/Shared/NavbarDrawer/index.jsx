import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Styles from "./styles.module.scss";
import useSideNavData from "./hooks/useSideNavData";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function NavbarDrawer({
  setIsClosing,
  mobileOpen,
  setMobileOpen,
  selectedNavbar,
  setSelectedNavbar,
  selectedParentIndex,
  setSelectedParentIndex,
}) {
  // const user = useSelector(state => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("userData")).user
  if(!user) {
    return;
  }
  const filteredNavData = useSideNavData(user.userType);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  const handleListItemClick = (event, index, navigateRoute, label) => {
    navigate(navigateRoute);
    setSelectedParentIndex(null);
    setSelectedNavbar(label);
    setOpen(false);
  };

  const handleCollapseListItemClick = (event, index, label, childLabel) => {
    setSelectedParentIndex(`${label}/${childLabel}`);
    setSelectedNavbar(null);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const drawer = (
    <div>
      <div className='flex justify-center items-center flex-col text-center px-3'>
        <div className={Styles.StyledIcon}>
          <img src="/logo.png" alt="img" className="img-fluid rounded-full h-20"/>
        </div>
        <div className={Styles.StyledText}>Agent BuZz</div>
        <div className={Styles.tagLine}>Your Marketing, Your Style!</div>
      </div>
      <List className="mr-3">
        {filteredNavData.map((obj, index) =>
          !obj.child ? (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={selectedNavbar === obj.label}
                onClick={(event) =>
                  handleListItemClick(
                    event,
                    index,
                    obj.navigateRoute,
                    obj.label
                  )
                }
                className={selectedNavbar === obj.label ? Styles.selectedButton : ""}
              >
                <ListItemIcon className={Styles.ListItemIcon}>
                  <obj.icon className={Styles.navbarIcon} />
                </ListItemIcon>
                <div className={Styles.navbarText}>{obj?.label}</div>
              </ListItemButton>
            </ListItem>
          ) : (
            <React.Fragment key={index}>
              <ListItemButton
                onClick={handleClick}
                className={
                  selectedParentIndex !== null ? Styles.selectedButton : ""
                }
              >
                <ListItemIcon className={Styles.ListItemIcon}>
                  <obj.icon />
                  <svg path = {obj.icon}/>
                </ListItemIcon>
                <div className={Styles.navbarText}>{obj.label}</div>
                {open ? (
                  <ExpandLess className={Styles.expandIconStyle} />
                ) : (
                  <ExpandMore className={Styles.expandIconStyle} />
                )}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {obj.child.map((childObj, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        selected={
                          selectedParentIndex ===
                          `${obj.label}/${childObj.label}`
                        }
                        onClick={(event) =>
                          handleCollapseListItemClick(
                            event,
                            index,
                            obj.label,
                            childObj.label
                          )
                        }
                        className={
                          selectedParentIndex ===
                          `${obj.label}/${childObj.label}`
                            ? Styles.selectedButton
                            : ""
                        }
                      >
                        <ListItemIcon className={Styles.ListItemIcon}>
                          <childObj.icon />
                        </ListItemIcon>
                        <div className={Styles.navbarText}>
                          {childObj?.label}
                        </div>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          )
        )}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            boxShadow: "3px 0px 6px #00000014",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </div>
  );
}

export default NavbarDrawer;
