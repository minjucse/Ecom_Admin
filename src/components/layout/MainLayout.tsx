import { CssBaseline, Box, createTheme, ThemeProvider } from "@mui/material";
import { styled } from "@mui/system";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#fff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          transform: "translateZ(0)",
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

const DRAWER_WIDTH_EXPANDED = 260;
const DRAWER_WIDTH_COLLAPSED = 65;

// Styled components with dynamic padding based on sidebar state
const AppMain = styled("div")<{ sidebaropen: boolean; ismobile: boolean }>(
  ({ sidebaropen, ismobile }) => ({
    paddingLeft: ismobile ? 0 : (sidebaropen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED),
    width: "100%",
    transition: "padding-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  })
);

const AppContainer = styled(Box)({
  backgroundColor: "#ECEFF1",
  minHeight: "95vh",
  background:
    "linear-gradient(158deg, rgb(224, 224, 224) 0%, rgb(233, 237, 254) 100%)",
  padding: "1.5rem",
  marginBottom: "3rem",
});

// Inner component to access sidebar context
const LayoutContent = () => {
  const { sidebarOpen, isMobile } = useSidebarContext();

  return (
    <>
      <Sidebar />
      <AppMain sidebaropen={sidebarOpen} ismobile={isMobile}>
        <Header />
        <AppContainer>
          <Outlet />
        </AppContainer>
        <Footer />
      </AppMain>
    </>
  );
};

const MainLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default MainLayout;