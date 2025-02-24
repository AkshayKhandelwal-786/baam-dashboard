// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import Autocomplete1 from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown, {
  NotificationsType
} from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown, { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'
import { Autocomplete, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { gameRoutes } from 'src/navigation/vertical'
// import { width } from '@mui/system'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const notifications: NotificationsType[] = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

const shortcuts: ShortcutsType[] = [
  {
    title: 'Calendar',
    url: '/apps/calendar',
    subtitle: 'Appointments',
    icon: 'mdi:calendar-month-outline'
  },
  {
    title: 'Invoice App',
    url: '/apps/invoice/list',
    subtitle: 'Manage Accounts',
    icon: 'mdi:receipt-text-outline'
  },
  {
    title: 'Users',
    url: '/apps/user/list',
    subtitle: 'Manage Users',
    icon: 'mdi:account-outline'
  },
  {
    url: '/apps/roles',
    title: 'Role Management',
    subtitle: 'Permissions',
    icon: 'mdi:shield-check-outline'
  },
  {
    url: '/',
    title: 'Dashboard',
    icon: 'mdi:chart-pie',
    subtitle: 'User Dashboard'
  },
  {
    title: 'Settings',
    icon: 'mdi:cog-outline',
    subtitle: 'Account Settings',
    url: '/pages/account-settings/account'
  },
  {
    title: 'Help Center',
    subtitle: 'FAQs & Articles',
    icon: 'mdi:help-circle-outline',
    url: '/pages/help-center'
  },
  {
    title: 'Dialogs',
    subtitle: 'Useful Dialogs',
    icon: 'mdi:window-maximize',
    url: '/pages/dialog-examples'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props


  // console.log(`appUtils.games: ${appUtils.games}`)

  const router = useRouter()

  // ** Hook
  const auth = useAuth()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
        {auth.user && <Autocomplete1 hidden={hidden} settings={settings} />}
      </Box>
      {/* <Autocomplete
        options={appUtils.games}
        sx={{ maxWidth: '400px', width: '100%' }}

        value={appUtils.game}
        getOptionLabel={(option: any) => (typeof option === 'object' ? option?.title : option)}
        onChange={(e, value: {
          title: string
          path: string
          value: string
        }, ...otherprops) => {
          try {
            const currentRoute = router.pathname;
            const gameRoute = (gameRoutes as any)[value.value];
            // console.log(gameRoute)
            const paths = gameRoute.map((item: any) => item.path);

            let replacedRoute = currentRoute.replace(appUtils.game.path == "/" ? "" : appUtils.game.path, value.path);
            if (replacedRoute.startsWith("//")) {
              replacedRoute = replacedRoute.replace("//", "/");
            }

            if (paths.includes(replacedRoute)) {
              router.replace(replacedRoute);
            } else {
              const defaultPath = gameRoute.find((f: any) => f?.path)?.path;
              // console.log(defaultPath)
              router.replace(defaultPath);
            }

            appUtils.handleGameChange(value);

          } catch (e) {
            console.log(e)
          }


        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            {option.title}
          </li>
        )}
        renderInput={params => <TextField {...params} size='small' />}
      /> */}

      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <LanguageDropdown settings={settings} saveSettings={saveSettings} />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {auth.user && (
          <>
            <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
            <NotificationDropdown settings={settings} notifications={notifications} />
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent

// const currentRoute = router.pathname;

// const a = (gameRoutes as any)[value.value];
// // console.log(a)
// const b = a.map((item: any) => item.path)
// // console.log(b)
// console.log(currentRoute)
// let replacedRoute = currentRoute.replace(appUtils.game.path == "/" ? "" : appUtils.game.path, value.path);
// if (replacedRoute.startsWith("//")) {
//   replacedRoute = replacedRoute.replace("//", "/")
// }

// console.log(replacedRoute)
// const d = b.includes(replacedRoute)
// // console.log(d)

// if (d) {
//   router.replace(replacedRoute)
// } else {
//   // console.log(a.find((f: any) => f?.path))
//   router.replace(a.find((f: any) => f?.path)?.path)
// }
// appUtils.handleGameChange(value)
