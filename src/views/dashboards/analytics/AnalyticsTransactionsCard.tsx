// ** React Imports
import { ReactElement } from 'react'
import { useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import useDashboardStore from 'src/features/dashboard/dashboard.service';

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement,
  url : string
}

const AnalyticsTransactionsCard = () => {
  const { dashboardSummary, getSummary } = useDashboardStore();
  useEffect(() => {
    getSummary();
  }, []);
  const salesData: DataType[] = [
    {
      stats: dashboardSummary?.total_user?.toString() || '0',
      title: 'Total Users',
      color: 'primary',
      icon: <Icon icon='mdi:trending-up'/>,
      url:'/apps/users/list/'
    },
    {
      stats: dashboardSummary?.total_qr?.toString() || '0',
      title: 'Total QR',
      color: 'success',
      icon: <Icon icon='mdi:account-outline' />,
      url:'/apps/qr/list/'

    },
    {
      stats: dashboardSummary?.total_rewards?.toString() || '0',
      color: 'warning',
      title: 'Total Active Rewards',
      icon: <Icon icon='mdi:cellphone-link' />,
      url:'/apps/reward/list/'

    },
    {
      stats: dashboardSummary?.total_promotion?.toString() || '0',
      color: 'info',
      title: 'Total Active Promotion',
      icon: <Icon icon='mdi:currency-usd' />,
      url:'/apps/promotion/list/'

    }
  ]
  return (
    <Card>
      <CardHeader title='Dashboard' />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {salesData.map((item: DataType, index: number) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <a href={item.url} style={{ textDecoration: 'none' }}>
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    variant='rounded'
                    color={item.color}
                    sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
                  >
                    {item.icon}
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='caption'>{item.title}</Typography>
                    <Typography variant='h6'>{item.stats}</Typography>
                  </Box>
                </Box>
              </a>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsTransactionsCard
