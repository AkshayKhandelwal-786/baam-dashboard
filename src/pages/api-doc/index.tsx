// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsTable from 'src/views/dashboards/analytics/AnalyticsTable'
import AnalyticsTrophy from 'src/views/dashboards/analytics/AnalyticsTrophy'
import AnalyticsSessions from 'src/views/dashboards/analytics/AnalyticsSessions'
import AnalyticsTotalProfit from 'src/views/dashboards/analytics/AnalyticsTotalProfit'
import AnalyticsPerformance from 'src/views/dashboards/analytics/AnalyticsPerformance'
import AnalyticsTotalEarning from 'src/views/dashboards/analytics/AnalyticsTotalEarning'
import AnalyticsWeeklyOverview from 'src/views/dashboards/analytics/AnalyticsWeeklyOverview'
import AnalyticsDepositWithdraw from 'src/views/dashboards/analytics/AnalyticsDepositWithdraw'
import AnalyticsSalesByCountries from 'src/views/dashboards/analytics/AnalyticsSalesByCountries'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

import { API } from '@stoplight/elements'
import '@stoplight/elements/styles.min.css'
import api from 'src/configs/api'

const AnalyticsDashboard = () => {
  // return (
  //   <API apiDescriptionUrl='https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml' />
  // )

  return <API apiDescriptionUrl={api.baseUrl?.replace('/admin', '/swagger/json') ?? ''} />
}

AnalyticsDashboard.getLayout = (children: any) => <> {children} </>

AnalyticsDashboard.moduleId = 2
AnalyticsDashboard.gameIds = [1, 2]

export default AnalyticsDashboard
