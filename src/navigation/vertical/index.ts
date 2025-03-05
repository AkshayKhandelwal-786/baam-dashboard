import { useRouter } from 'next/router'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const can = (moduleId: number, gameIds: number[]) => ({ moduleId, gameIds })

export const commonRoutes = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    path: '/dashboards/analytics',
    gameIds: [1, 2],
    moduleId: 1
  },
  // {
  //   title: 'Dashboards',
  //   icon: 'mdi:home-outline',
  //   badgeContent: 'new',
  //   badgeColor: 'error',
  //   subject: 'acl-page',

  //   ...can(2, [1, 2]),
  //   children: [
  //     {
  //       title: 'CRM',
  //       path: '/dashboards/crm',
  //       ...can(1, [1, 2])
  //     },
  //     {
  //       title: 'Analytics',
  //       path: '/dashboards/analytics',
  //       ...can(2, [1, 2])
  //     },
  //     {
  //       title: 'eCommerce',
  //       path: '/dashboards/ecommerce',
  //       ...can(1, [1, 2])
  //     }
  //   ]
  // },

  {
    title: 'Roles & Permissions',
    icon: 'mdi:shield-outline',
    gameIds: [1, 2],
    moduleId: 1,
    children: [
      {
        title: 'Roles',
        path: '/apps/roles',
        ...can(1, [1, 2])
      }
    ]
  },
  {
    title: 'QRs',
    icon: 'mdi:qrcode',
    gameIds: [1, 2],
    moduleId: 1,
    children: [
      {
        title: 'Qr List',
        path: '/apps/qr/list',
        ...can(1, [1, 2])
      },
      {
        title: 'History List',
        path: '/apps/qr/history/list',
        ...can(1, [1, 2])
      }
    ]
  },
  {
    title: 'Rewards',
    icon: 'mdi:prize',
    gameIds: [1, 2],
    moduleId: 1,
    children: [
      {
        title: 'Reward List',
        path: '/apps/reward/list',
        ...can(1, [1, 2])
      },
      {
        title: 'History List',
        path: '/apps/reward/history/list',
        ...can(1, [1, 2])
      }
    ]
  },


  // {
  //   title: 'Rewards',
  //   icon: 'mdi:prize',
  //   path: '/apps/reward/list',
  //   gameIds: [1, 2],
  //   moduleId: 1
  // },
  {
    title: 'Users',
    icon: 'mdi:user',
    path: '/apps/users/list',
    gameIds: [1, 2],
    moduleId: 1
  },
  {
    title: 'Slider',
    icon: 'mdi:slider',
    path: '/apps/slider/list',
    gameIds: [1, 2],
    moduleId: 1
  },
  {
    title: 'Catalogues',
    icon: 'mdi:slider',
    path: '/apps/catalogues/list',
    gameIds: [1, 2],
    moduleId: 1
  },
  {
    title: 'About us',
    icon: 'mdi:slider',
    path: '/apps/about-us/list',
    gameIds: [1, 2],
    moduleId: 1
  },

  // {
  //   sectionTitle: 'App',
  //   ...can(1, [1, 2])
  // },
  // {
  //   title: 'Games',
  //   icon: 'mdi:torch',
  //   path: '/apps/games/list',
  //   gameIds: [1, 2],
  //   moduleId: 1
  // },

  // {
  //   title: 'Features',
  //   icon: 'mdi:view-module',
  //   path: '/apps/modules/list',
  //   gameIds: [1, 2],
  //   moduleId: 1
  // },

  // {
  //   sectionTitle: 'Plans',
  //   ...can(9, [1, 2])
  // },
  // {
  //   title: 'Plans',
  //   icon: 'mdi:list-box-outline',
  //   path: '/apps/plans/list',
  //   gameIds: [1, 2],
  //   moduleId: 9
  // },
  // {
  //   title: 'Subscriptions',
  //   icon: 'mdi:list-box-outline',
  //   path: '/apps/subscriptions/list',
  //   gameIds: [1, 2],
  //   moduleId: 9
  // },
]
export const gameRoutes = {
  cricket: [],
  kabaddi: [
    {
      sectionTitle: 'Seasons',
      ...can(2, [1, 2])
    },
    {
      title: 'Seasons',
      icon: 'mdi:calendar-range-outline',
      path: `/kabaddi/apps/season/list`,
      ...can(2, [1, 2])
    },

    {
      sectionTitle: 'Competitions',
      ...can(3, [1, 2])
    },
    {
      title: 'Competitions',
      icon: 'mdi:tournament',
      path: '/kabaddi/apps/competitions/list',
      ...can(3, [1, 2])
    },
    {
      title: 'Rounds',
      icon: 'mdi:reload',
      path: '/kabaddi/apps/rounds/list',
      ...can(4, [1, 2])
    },
    {
      sectionTitle: 'Match',
      ...can(5, [1, 2])
    },
    {
      title: 'Matches',
      icon: 'mdi:fencing',
      path: '/kabaddi/apps/matches/list',
      ...can(5, [1, 2])
    },
    {
      sectionTitle: 'Player & Teams',
      ...can(6, [1, 2])
    },

    {
      title: 'Players',
      icon: 'mdi:account-outline',
      path: '/kabaddi/apps/players/list',
      ...can(6, [1, 2])
    },
    {
      title: 'Teams',
      icon: 'mdi:account-group-outline',
      path: '/kabaddi/apps/teams/list',
      ...can(7, [1, 2])
    },
    {
      title: 'Comp. Team Players',
      icon: 'mdi:tournament',
      path: '/kabaddi/apps/comp-team-players/list',
      ...can(10, [1, 2])
    }
  ],
  basketball: [
    {
      sectionTitle: 'Seasons',
      ...can(2, [1, 2])
    },
    {
      title: 'Seasons',
      icon: 'mdi:calendar-range-outline',
      path: `/basketball/apps/season/list`,
      ...can(2, [1, 2])
    },

    {
      sectionTitle: 'Competitions',
      ...can(3, [1, 2])
    },
    {
      title: 'Competitions',
      icon: 'mdi:tournament',
      path: '/basketball/apps/competitions/list',
      ...can(3, [1, 2])
    },
    {
      title: 'Rounds',
      icon: 'mdi:reload',
      path: '/basketball/apps/rounds/list',
      ...can(4, [1, 2])
    },
    {
      sectionTitle: 'Match',
      ...can(5, [1, 2])
    },
    {
      title: 'Matches',
      icon: 'mdi:fencing',
      path: '/basketball/apps/matches/list',
      ...can(5, [1, 2])
    },
    {
      sectionTitle: 'Player & Teams',
      ...can(6, [1, 2])
    },

    {
      title: 'Players',
      icon: 'mdi:account-outline',
      path: '/basketball/apps/players/list',
      ...can(6, [1, 2])
    },
    {
      title: 'Teams',
      icon: 'mdi:account-group-outline',
      path: '/basketball/apps/teams/list',
      ...can(7, [1, 2])
    },
    {
      title: 'Comp. Team Players',
      icon: 'mdi:tournament',
      path: '/basketball/apps/comp-team-players/list',
      ...can(10, [1, 2])
    }
  ]
}

export const FooterCommonRoute = [
  {
    sectionTitle: 'Others',
    ...can(11, [1, 2])
  },
  {
    title: 'News/Blogs',
    icon: 'mdi:newspaper',
    path: '/apps/blogs/list',
    ...can(11, [1, 2])
  },
  {
    title: 'Upload Videos',
    icon: 'mdi:play-box-outline',
    path: '/apps/videos/list',
    ...can(11, [1, 2])
  },
  {
    title: 'Banners',
    icon: 'mdi:image-area',
    path: '/apps/home-banner/list',
    ...can(11, [1, 2])
  },
  {
    title: 'Countries',
    icon: 'mdi:earth',
    path: '/apps/countries/list',
    ...can(11, [1, 2])
  },
  {
    title: 'Publish Ads',
    icon: 'mdi:advertisements',
    path: '/apps/ads/list',
    ...can(11, [1, 2])
  },
  {
    title: 'Venues',
    icon: 'mdi:stadium-outline',
    path: '/apps/venues/list',
    ...can(12, [1, 2])
  },
  {
    title: 'Officials',
    icon: 'mdi:account',
    path: '/apps/officials/list',
    ...can(13, [1, 2])
  }
]

const navigation = (): VerticalNavItemsType => {
  const router = useRouter()

  // const appUtil = useAppUtils()

  // const currentPath = router.basePath;

  return [...commonRoutes]
}

export default navigation
