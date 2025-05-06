// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Avatar } from '@mui/material'
import useDashboardStore from 'src/features/dashboard/dashboard.service';
import { useEffect } from 'react'

interface DataType {
  _id: string
  title: string
  label: string
  image: string
  points: string
  status: string
}


const AnalyticsSalesByCountries = () => {
  const { dashboardSummary, getSummary } = useDashboardStore();

  useEffect(() => {
    getSummary();
  }, []);


  return (
    <Card>
      <CardHeader
        title='Active Reward'
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.primary' } }}
          />
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        {dashboardSummary.reward.map((user: DataType, index) => (
             <Box
             key={user._id as any}
             sx={{ display: 'flex', alignItems: 'center', mb: index !== dashboardSummary.users.length - 1 ? 6 : 0 }}
           >
             <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
               <Avatar
                 alt={user.title}
                 src={user.image}
                 sx={{ width: 40, height: 40 }}
               />
             </Box>
             <Box
               sx={{
                 ml: 4,
                 width: '100%',
                 display: 'flex',
                 flexWrap: 'wrap',
                 alignItems: 'center',
                 justifyContent: 'space-between'
               }}
             >
               <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column' }}>
                 <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.title}</Typography>
                 <Typography variant='caption'>{user.label}</Typography>
               </Box>
               <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                 {user.points} Points
               </Typography>
             </Box>
           </Box>
          ))}
      </CardContent>
    </Card>
  )
}

export default AnalyticsSalesByCountries
