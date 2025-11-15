import { Typography, Container, Avatar} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import bg from "../assets/images/signin.svg";
import bgimg from "../assets/images/backimg.jpg";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LoginForm } from "@/components/modules/Authentication/LoginForm";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const boxStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: '90%', sm: '75%' },
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
};
const center = {
  position: "relative" as const,
  top: "50%",
  left: "30%",
};


const Login = () => {

  return (
    <div
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        height: "100vh",
        color: "#f5f5f5",
      }}
    >
      <Box sx={boxStyle}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Box
              sx={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                height: "100%",
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Box
              style={{
                backgroundSize: "cover",
                height: "70vh",
                minHeight: "500px",
                backgroundColor: "#3b33d5",
              }}
            >
              <ThemeProvider theme={darkTheme}>
                <Container>
                  <Box height={35} />
                  <Box sx={center}>
                    <Avatar
                      sx={{ ml: "35px", mb: "4px", bgcolor: "#ffffff" }}
                    >
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                      Sign In
                    </Typography>
                  </Box>

                  <LoginForm />
                </Container>
              </ThemeProvider>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Login;
