// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiDivider, { DividerProps } from '@mui/material/Divider'
import useDashboardStore from 'src/features/dashboard/dashboard.service';
import { useEffect } from 'react'
import { Avatar } from '@mui/material'

interface DataType {
  name: string
  _id: string
  profile_picture: string
  email: string
  points: number
}
interface PromotionDataType {
  _id: string,
  title: string,
  offer_point: string,
  offer_status: string
  file: string
}

// Styled Divider component
const Divider = styled(MuiDivider)<DividerProps>(({ theme }) => ({
  margin: `${theme.spacing(5, 0)} !important`,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const AnalyticsDepositWithdraw = () => {
  const { dashboardSummary, getSummary } = useDashboardStore();

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Active Users'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          {dashboardSummary.users.map((user: DataType, index) => (
            <Box
              key={user._id as any}
              sx={{ display: 'flex', alignItems: 'center', mb: index !== dashboardSummary.users.length - 1 ? 6 : 0 }}
            >
              <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  alt={user.name}
                  src={user.profile_picture}
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
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</Typography>
                  <Typography variant='caption'>{user.email}</Typography>
                </Box>
                <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {user.points} Points
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Box>

      <Divider flexItem />

      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Active Promotion'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          {dashboardSummary.promotion.map((user: PromotionDataType, index) => (
             <Box
             key={user._id as any}
             sx={{ display: 'flex', alignItems: 'center', mb: index !== dashboardSummary.users.length - 1 ? 6 : 0 }}
           >
             <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
               <Avatar
                 alt={user.title}
                 src={user.file}
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
                 <Typography variant='caption'>{user.offer_status}</Typography>
               </Box>
               <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                 {user.offer_point} Points
               </Typography>
             </Box>
           </Box>
          ))}
        </CardContent>
      </Box>
    </Card>
  )
}

export default AnalyticsDepositWithdraw
