import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  MoreVert,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { sidebarItemsGenerator } from "../../utils/sidebarItemsGenerator";
import { adminSidebarItems } from "../../routes/adminSidebarItems";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role } from "@/constants/role";
import type { TSidebarItem } from "../../types";
import { useSidebarContext } from "@/context/SidebarContext";

const DRAWER_WIDTH_EXPANDED = 260;
const DRAWER_WIDTH_COLLAPSED = 65;

// Desktop permanent drawer
const DesktopDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: open ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    borderRight: "1px solid",
    borderColor: theme.palette.divider,
  },
}));

// Mobile temporary drawer
const MobileDrawer = styled(Drawer)(() => ({
  "& .MuiDrawer-paper": {
    width: DRAWER_WIDTH_EXPANDED,
    boxSizing: "border-box",
  },
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  minHeight: 64,
}));

const Sidebar = () => {
  const { data: userData } = useUserInfoQuery(undefined);
  const location = useLocation();
  const { sidebarOpen, isMobile, closeSidebar } = useSidebarContext();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [anchorEls, setAnchorEls] = useState<Record<string, HTMLElement | null>>({});

  const user = userData?.data || userData;

  const roleSidebarMap: Record<string, any[]> = {
    [role.superAdmin]: adminSidebarItems,
    [role.admin]: adminSidebarItems,
  };

  const sidebarItems: TSidebarItem[] = user?.role
    ? sidebarItemsGenerator(roleSidebarMap[user.role] || [], user.role)
    : [];

  const hasSidebarItems = sidebarItems.length > 0;

  // Find active path and open parent menus
  const findActiveMenuPath = (
    items: TSidebarItem[],
    parentKeys: string[] = []
  ): string[] | null => {
    for (const item of items) {
      if (item.to && location.pathname === item.to) {
        return parentKeys;
      }
      if (item.children) {
        const result = findActiveMenuPath(item.children, [...parentKeys, item.key]);
        if (result) return result;
      }
    }
    return null;
  };

  // Auto-open active menus on route change and when sidebar items load
  useEffect(() => {
    if (!hasSidebarItems) return;
    
    const activeMenuPath = findActiveMenuPath(sidebarItems);
    if (activeMenuPath && activeMenuPath.length > 0) {
      setOpenMenus((prev) => {
        const newOpenMenus = { ...prev };
        activeMenuPath.forEach((key) => {
          newOpenMenus[key] = true;
        });
        return newOpenMenus;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, hasSidebarItems]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, key: string) => {
    setAnchorEls((prev) => ({ ...prev, [key]: event.currentTarget }));
  };

  const handlePopoverClose = (key: string) => {
    setAnchorEls((prev) => ({ ...prev, [key]: null }));
  };

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  const activeLinkSx = {
    "&.active": {
      backgroundColor: "primary.main",
      color: "primary.contrastText",
      "&:hover": {
        backgroundColor: "primary.dark",
      },
      "& .MuiListItemIcon-root": {
        color: "primary.contrastText",
      },
    },
  };

  // Render menu item with nested support
  const renderMenuItem = (item: TSidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.key] || false;
    //const isActive = item.to && location.pathname === item.to;
    const paddingLeft = (sidebarOpen || isMobile) ? depth * 2 + 2 : 2;

    // Collapsed sidebar with children - show dropdown (desktop only)
    if (!sidebarOpen && hasChildren && depth === 0 && !isMobile) {
      return (
        <div key={item.key}>
          <Tooltip title={item.label} placement="right" arrow>
            <ListItem disablePadding>
              <ListItemButton
                onClick={(e) => handlePopoverOpen(e, item.key)}
                sx={{ justifyContent: "center" }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  {item.icon || <MoreVert />}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
          <Menu
            anchorEl={anchorEls[item.key]}
            open={Boolean(anchorEls[item.key])}
            onClose={() => handlePopoverClose(item.key)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: { sx: { minWidth: 200, ml: 1 } }
            }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle2" fontWeight="bold">
                {item.label}
              </Typography>
            </MenuItem>
            <Divider />
            {item.children?.map((child) => renderDropdownItem(child))}
          </Menu>
        </div>
      );
    }

    // Collapsed sidebar without children - show icon only (desktop only)
    if (!sidebarOpen && !hasChildren && !isMobile) {
      return (
        <Tooltip key={item.key} title={item.label} placement="right" arrow>
          <ListItem disablePadding>
            <ListItemButton
              component={item.to ? NavLink : "div"}
              to={item.to}
              onClick={handleLinkClick}
              sx={{
                ...activeLinkSx,
                justifyContent: "center",
                minHeight: 48,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Tooltip>
      );
    }

    // Expanded sidebar with children OR mobile
    if (hasChildren) {
      return (
        <div key={item.key}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => toggleMenu(item.key)} sx={{ pl: paddingLeft }}>
              {item.icon && (
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText primary={item.label} />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </div>
      );
    }

    // Regular menu item (expanded sidebar OR mobile)
    return (
      <ListItem key={item.key} disablePadding>
        <ListItemButton
          component={NavLink}
          to={item.to!}
          onClick={handleLinkClick}
          sx={{ ...activeLinkSx, pl: paddingLeft }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    );
  };

  // Render dropdown items for collapsed sidebar
  const renderDropdownItem = (item: TSidebarItem) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.key}>
          <MenuItem disabled>
            <Typography variant="body2" fontWeight="medium">
              {item.label}
            </Typography>
          </MenuItem>
          {item.children?.map((child) => renderDropdownItem(child))}
        </div>
      );
    }

    return (
      <MenuItem
        key={item.key}
        component={NavLink}
        to={item.to!}
        onClick={() => {
          handlePopoverClose(item.key);
          handleLinkClick();
        }}
        selected={location.pathname === item.to}
      >
        {item.label}
      </MenuItem>
    );
  };

  // Drawer content
  const drawerContent = (
    <>
      <SidebarHeader>
        
        {(sidebarOpen || isMobile) ? (
          <>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Ashta Soft
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Enterprise
              </Typography>
            </Box>
            {!isMobile && (
              <IconButton  size="small">
                <ChevronLeft />
              </IconButton>
            )}
          </>
        ) : (
          <IconButton  size="small" sx={{ mx: "auto" }}>
            <ChevronRight />
          </IconButton>
        )}
      </SidebarHeader>
      <Divider />
      <List sx={{ pt: 1 }}>
        {sidebarItems.map((item) => renderMenuItem(item))}
      </List>
    </>
  );

  // Return different drawer for mobile vs desktop
  if (isMobile) {
    return (
      <MobileDrawer
        variant="temporary"
        open={sidebarOpen}
        onClose={closeSidebar}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </MobileDrawer>
    );
  }

  return (
    <DesktopDrawer variant="permanent" open={sidebarOpen}>
      {drawerContent}
    </DesktopDrawer>
  );
};

export default Sidebar;