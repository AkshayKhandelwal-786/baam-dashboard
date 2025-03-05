// ** React Imports
import { ReactElement } from 'react'

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

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const salesData: DataType[] = [
  {
    stats: '245k',
    title: 'Total Users',
    color: 'primary',
    icon: <Icon icon='mdi:account-outline' />
  },
  {
    stats: '12.5k',
    title: 'Total Slider',
    color: 'success',
    icon: <Icon icon='mdi:trending-up' />
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Total Catalogue',
    icon: <Icon icon='mdi:cellphone-link' />
  },
  {
    stats: '$88k',
    color: 'info',
    title: 'Total QR',
    icon: <Icon icon='mdi:currency-usd' />
  }
]

const renderStats = () => {
  return salesData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
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
