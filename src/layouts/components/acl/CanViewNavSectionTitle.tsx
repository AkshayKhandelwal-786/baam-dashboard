// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'
import { _buildAbilityFor } from 'src/configs/acl'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else {
    return _buildAbilityFor(ability.role, navTitle?.moduleId as any, navTitle?.gameIds as any) ? <>{children}</> : null
  }
}

export default CanViewNavSectionTitle
