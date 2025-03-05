// ** React Imports
import { ReactElement, useEffect } from 'react'

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
import useDashboardStore, { Dashboard } from 'src/features/dashboard/dashboard.service'

const renderStats = () => {  

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}
const { dashboardSummary, getSummary } = useDashboardStore();
useEffect(() => {
  getSummary();
}, []);


const salesData: DataType[] = [
  {
    stats: dashboardSummary.total_user?.toString() || '0',
    title: 'Total Users',
    color: 'primary',
    icon: <Icon icon='mdi:account-outline' />
  },
  {
    stats: dashboardSummary.total_qr?.toString() || '0',
    title: 'Total QR',
    color: 'success',
    icon: <Icon icon='mdi:trending-up' />
  },
  {
    stats: dashboardSummary.total_rewards?.toString() || '0',
    color: 'warning',
    title: 'Total Rewards',
    icon: <Icon icon='mdi:cellphone-link' />
  },
]

  return salesData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={4} key={index}>
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
    </Grid>
  ))
}

const AnalyticsTransactionsCard = () => {
  return (
    <Card>
      <CardHeader
        title='Dashboard'
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsTransactionsCard
