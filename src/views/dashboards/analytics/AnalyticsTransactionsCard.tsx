import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Icon from 'src/@core/components/icon';
import CustomAvatar from 'src/@core/components/mui/avatar';
import useDashboardStore from 'src/features/dashboard/dashboard.service';

interface User {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  total_points_earned: number;
  total_orders: number;
  createdAt: string;
}

const AnalyticsTransactionsCard = () => {
  const { dashboardSummary, getSummary } = useDashboardStore();

  useEffect(() => {
    getSummary();
  }, []);
  
  const salesData = [
    {
      stats: dashboardSummary?.total_user?.toString() || '0',
      title: 'Total Users',
      color: 'primary',
      icon: <Icon icon='mdi:account-outline' />,
    },
    {
      stats: dashboardSummary?.total_qr?.toString() || '0',
      title: 'Total QR',
      color: 'success',
      icon: <Icon icon='mdi:trending-up' />,
    },
    {
      stats: dashboardSummary?.total_rewards?.toString() || '0',
      color: 'warning',
      title: 'Total Active Rewards',
      icon: <Icon icon='mdi:cellphone-link' />,
    },
    {
      stats: dashboardSummary?.total_promotion?.toString() || '0',
      color: 'warning',
      title: 'Total Active Promotion',
      icon: <Icon icon='mdi:cellphone-link' />,
    },
  ];

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'total_points_earned', headerName: 'Total Points', flex: 1 },
    { field: 'total_orders', headerName: 'Total Orders', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 1 },
  ];

  return (
    <Card>
      <CardHeader title='Dashboard' />
      <CardContent>
        <Grid container spacing={3}>
          {salesData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar
                  variant='rounded'
                  color={item.color as any}
                  sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
                >
                  {item.icon}
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='caption'>{item.title}</Typography>
                  <Typography variant='h6'>{item.stats}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ height: 500, width: '100%', mt: 5 }}>
          <DataGrid
            rows={dashboardSummary?.users || []}
            columns={columns}
            getRowId={(row) => row._id}
            pageSizeOptions={[5, 10, 20]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTransactionsCard;