import { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Controls from "@/components/controls";
import Form from "@/components/ui/useForm";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { FieldValues, SubmitHandler } from "react-hook-form";
import {  useNavigate } from "react-router";
import { toast } from "sonner";

export function LoginForm({
}: React.HTMLAttributes<HTMLDivElement>) {
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const [login] = useLoginMutation();

    const defaultValues = {
        email: 'minju@myshop.com',
        password: 'Pass@123',
    };

    const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const res = await login(data).unwrap();

            if (res.success) {
                toast.success("Logged in successfully");
                navigate("/");
            }
        } catch (err: any) {
            console.error(err);

            if (err.data.message === "Password does not match") {
                toast.error("Invalid credentials");
            }
        }
    };

    const handleCheckboxChange = () => {
        setRemember((prev) => !prev);
    }; return (

        <Form onSubmit={handleSubmit} defaultValues={defaultValues}>
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid size={12}>
                        <Controls.Input
                            name="email"
                            label="User Name"
                            type="text"
                        />
                    </Grid>

                    <Grid size={12}>
                        <Controls.Input
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                        />
                    </Grid>

                    <Grid size={12} >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            <Grid size={4}>
                                <Controls.Checkbox
                                    name="isRemember"
                                    value={remember}
                                    onChange={handleCheckboxChange}
                                    label="Remember me"

                                />
                            </Grid>
                            <Grid size={4} sx={{ textAlign: "right" }} >
                                <Typography
                                    variant="body1"
                                    sx={{ cursor: "pointer", mt: 1, width: "100%" }}
                                    onClick={() => navigate("/reset-password")}
                                >
                                    Forgot password?
                                </Typography>
                            </Grid>

                        </Stack>
                    </Grid>

                    <Grid size={12} sx={{ ml: "5em", mr: "5em" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                mt: 2,
                                borderRadius: 28,
                                color: "#ffffff",
                                backgroundColor: "#FF9A01",
                                '&:hover': { backgroundColor: '#e88c00' }
                            }}
                        >
                            Sign in
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Form>
    );
}