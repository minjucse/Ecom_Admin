import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#3D4955",
        color: "#f1f1f2",
        position: "fixed",
        bottom: 0,
        width: "calc(100% - 260px)",
        py: 2, // vertical padding (theme.spacing(2))
        px: 3, // horizontal padding (theme.spacing(3))
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          fontWeight: 300,
        }}
      >
        <Typography variant="body2">
          Copyright &copy; {new Date().getFullYear()} yourlogoname. All rights reserved.
        </Typography>
        <Typography variant="body2">
          <Box component="span" sx={{ mr: 0.5 }}>
            Terms & Conditions |
          </Box>
          Privacy Policy
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
