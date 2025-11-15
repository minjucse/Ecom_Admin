
import Grid from '@mui/material/Grid';
import { Stack, Card, CardContent, Typography, Box } from '@mui/material';
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CountUp from 'react-countup';
import "../../index.css";
const AdminDashboard = () => {
 
  return (
    <>
    <Grid container spacing={2}>
        <Grid size={8}>
          <Stack direction="row" spacing={2}>
            <Card className="gradient" sx={{ minWidth: "49%", height: 140 }}>
              <div className="iconstylewhite">
                <CreditCardIcon />
              </div>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: "#f0fcfc" }}>
                  $<CountUp delay={0.2} end={500} duration={0.3} />
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: "#ccd1d1" }}>
                  Total Earning
                </Typography>
              </CardContent>
            </Card>
            <Card className="gradientlight" sx={{ minWidth: "49%", height: 140 }}>
              <div className="iconstylewhite">
                <ShoppingBagIcon />
              </div>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: "#f0fcfc" }}>
                  $<CountUp delay={0.2} end={900} duration={0.4} />
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: "#ccd1d1" }}>
                  Total Order
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid size={4}>
          <Stack spacing={2}>
            <Card className="gradientlight">
              <Stack spacing={2} direction="row">
                <div className="iconstylewhite">
                  <StorefrontIcon />
                </div>
                <div className="paddingall">
                  <span className="pricetitle fontwhite">$203k</span>
                  <br />
                  <span className="pricesubtitle fontlightgrey">Total Income</span>
                </div>
              </Stack>
            </Card>
            <Card>
              <Stack spacing={2} direction="row">
                <div className="iconstyle">
                  <StorefrontIcon />
                </div>
                <div className="paddingall">
                  <span className="pricetitle">$203k</span>
                  <br />
                  <span className="pricesubtitle">Total Income</span>
                </div>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Box height={20} />

      <Grid container spacing={2}>
        <Grid size={8}>
          <Card sx={{ height: "60vh" }}>
            <CardContent>
              {/* <VBarChart /> */}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ height: "60vh" }}>
            <CardContent>
              <div className="paddingall">
                <span className="pricetitle">Popular Products</span>
              </div>
              <Box height={10} />
              {/* <DashAccordion /> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default AdminDashboard
