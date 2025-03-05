import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { DashboardService } from 'src/api/AdminApi'
import { DashboardData } from 'src/api/v3/models'
import { getBase64 } from 'src/helpers/common'
export type Dashboard = DashboardData['responses']['Detail']['data']

let timeOut: any

const useDashboardStore = create(
    combine(
      {
        dashboardSummary: {
          total_user: 0,
          total_rewards: 0,
          total_qr: 0,
        }
      },
      (set) => ({
        getSummary: async () => {
          try {
            const response = await DashboardService.list({});
            set({ dashboardSummary : response?.data || {} });
          } catch (error) {
            toast.error("Failed to fetch dashboard summary");
          }
        }
      })
    )
  );
  

export default useDashboardStore
