import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import bg from "../assets/images/signin.svg";
import bgimg from "../assets/images/backimg.jpg";
//import Controls from "../components/controls/Controls";
//import Form from '../components/useForm';

import { Button, TextField, Typography, Container, Avatar } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
//import Checkbox from "@mui/material/Checkbox";
//import FormControlLabel from "@mui/material/FormControlLabel";
//import { useState } from "react";
//import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
//import MuiAlert, { AlertProps } from "@mui/material/Alert";
//import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";
//import { TransitionProps } from "@mui/material/transitions";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});
const boxstyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    height: "70%",
    bgcolor: "background.paper",
    boxShadow: 24,
};

const center = {
    position: "relative" as const,
    top: "50%",
    left: "30%",
};


const ForgotPassword = () => {
    //const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        //setOpen(true);
        event.preventDefault();
       // const data = new FormData(event.currentTarget);
    };
    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#f5f5f5",
                }}
            >

                <Box sx={boxstyle}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <Box
                                style={{
                                    backgroundImage: `url(${bg})`,
                                    backgroundSize: "cover",
                                    marginTop: "40px",
                                    marginLeft: "15px",
                                    marginRight: "15px",
                                    height: "63vh",
                                    color: "#f5f5f5",
                                }}
                            ></Box>
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
                                                sx={{ ml: "85px", mb: "4px", bgcolor: "#ffffff" }}
                                            >
                                                <LockOutlinedIcon />
                                            </Avatar>
                                            <Typography component="h1" variant="h4">
                                                Reset Password
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleSubmit}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid container spacing={1}>
                                                <Grid size={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email"
                                                        name="email"
                                                        autoComplete="email"
                                                    />
                                                </Grid>
                                                <Grid size={12} sx={{ ml: "5em", mr: "5em" }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth
                                                        size="large"
                                                        sx={{
                                                            mt: "15px",
                                                            mr: "20px",
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            minWidth: "170px",
                                                            backgroundColor: "#FF9A01",
                                                        }}
                                                    >
                                                        Send Reset Link
                                                    </Button>
                                                </Grid>
                                                <Grid size={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography
                                                            variant="body1"
                                                            component="span"
                                                            style={{ marginTop: "10px" }}
                                                        >
                                                            Login to your Account.
                                                            <span
                                                                style={{ color: "#beb4fb", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    navigate("/");
                                                                }}
                                                            >
                                                                {" "}Sign In
                                                            </span>
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Container>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    )
}

export default ForgotPassword
