
import React from "react";
import {
  Box,
  AppBar as MuiAppBar,
  Badge,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  //WbSunny as SunIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useSidebarContext } from "@/context/SidebarContext";
import { getPageTitle } from "@/utils/getPageTitle";
import { adminSidebarItems } from "@/routes/adminSidebarItems";

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useSidebarContext();

  // Single source of truth: API query
  const { data: fetchedUser, isFetching } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();

  // Extract user data (handle nested structure)
  const user = fetchedUser?.data || fetchedUser;

  // Profile menu state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
    setAnchorEl(null);
  };

  // Get page title
  const title = getPageTitle(adminSidebarItems, location.pathname) || "Dashboard";

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <PersonIcon sx={{ mr: 1 }} fontSize="small" /> Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <SettingsIcon sx={{ mr: 1 }} fontSize="small" /> Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} fontSize="small" /> Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <Avatar
            alt={user?.name || "User"}
            src={user?.picture || "https://randomuser.me/api/portraits/men/75.jpg"}
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          color: "#222",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          {/* Sidebar toggle */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>

          {/* Page title */}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>

          {/* Desktop Right icons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {/* <Tooltip title="Toggle light/dark theme">
              <IconButton color="inherit">
                <SunIcon />
              </IconButton>
            </Tooltip> */}

            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Avatar & Username */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 1 }}>
                {isFetching ? (
                  <CircularProgress size={36} />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      alt={user?.name || "User"}
                      src={
                        user?.picture ||
                        "https://randomuser.me/api/portraits/men/75.jpg"
                      }
                      sx={{ width: 36, height: 36 }}
                    />
                    <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                      {user?.name || "User"}
                    </Typography>
                  </Box>
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mobile Right icons */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" color="inherit" onClick={handleMobileMenuOpen}>
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </MuiAppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;