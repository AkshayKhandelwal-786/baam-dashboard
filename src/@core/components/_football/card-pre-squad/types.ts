// ** React Imports
import { ReactNode, ReactElement } from 'react'

// ** ateMUI Imports
import { CardProps } from '@mui/material/Card'
// import { Player } from 'src/features/players/player.service'
import { Team } from 'src/features/_football/teams/team.service'
import { TeamLineup } from 'src/features/_football/matches/match.service'

export type CardSnippetProps = CardProps & {
  id?: string
  title: string
  children?: ReactNode
  code: {
    tsx: ReactElement | null
    jsx: ReactElement | null
  }
  className?: string
  team?: Team
  getList: (item: any) => void
  lineUp?: TeamLineup[]
}
