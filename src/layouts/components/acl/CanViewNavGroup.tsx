// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types'
import { _buildAbilityFor } from 'src/configs/acl'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild =
      item.children &&
      item.children.some((i: NavLink) => _buildAbilityFor(ability.role, i?.moduleId as any, i?.gameIds as any))

    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild
    }

    return ability
  }

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  }
}

export default CanViewNavGroup
