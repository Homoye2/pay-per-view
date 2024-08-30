import Grid from '@mui/material/Grid';
import TopCards from 'components/sections/dashboard/top-cards';
import WebsiteVisitors from 'components/sections/dashboard/website-visitors';
import RevenueByCustomer from 'components/sections/dashboard/revenue-by-customer';
import OrdersStatus from 'components/sections/dashboard/orders-status';

const Dashboard = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid item xs={12}>
        <TopCards />
      </Grid>

      <Grid container item xs={12} spacing={2.5}>
        <Grid item xs={12} sm={6} xl={4}>
          <WebsiteVisitors />
        </Grid>
        <Grid item xs={12} sm={6} xl={4}>
          <RevenueByCustomer />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <OrdersStatus />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
