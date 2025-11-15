import { createContext, useContext, useState, ReactNode } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

interface SidebarContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: true,
  toggleSidebar: () => {},
  isMobile: false,
  closeSidebar: () => {},
  openSidebar: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar, isMobile, closeSidebar, openSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};