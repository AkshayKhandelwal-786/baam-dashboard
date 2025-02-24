// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import { Theme } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ToggleButton from '@mui/material/ToggleButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import Prism from 'prismjs'
import toast from 'react-hot-toast'

// ** Types
import { CardSnippetProps } from './types'

// ** Hooks
import useClipboard from 'src/@core/hooks/useClipboard'
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from '@mui/material'
import { getPublicUrl } from 'src/helpers/common'
import useConstantStore from 'src/features/constants/constants.service'

const CardPreSquad = (props: CardSnippetProps) => {
  // ** Props
  const { id, sx, code, title, children, className } = props

  // ** States
  const [showCode, setShowCode] = useState<boolean>(false)
  const [tabValue, setTabValue] = useState<'tsx' | 'jsx'>(code.tsx !== null ? 'tsx' : 'jsx')

  // ** Player selection state
  const [playing11s, setPlaying11s] = useState<Array<number>>([])
  const [substitutes, setSubstitutes] = useState<Array<number>>([])
  const [changedPlayers, setChangedPlayers] = useState<
    Array<{
      player_id: number
      role: string
      price: number
      [key: string]: any
    }>
  >(() => [])

  useEffect(() => {
    setChangedPlayers(
      props?.team?.players?.length
        ? (props?.team?.players.map(p => {
          const find = props?.lineUp?.find(f => f?.player_id == p.id)
          return {
            ...p,
            player_id: p.id,
            role: find?.role || p.playing_role,
            price: find?.price || p.credit,
            team_id: props?.team?.id
          }
        }) as any)
        : []
    )
  }, [props?.team?.players?.length, props.lineUp?.length])

  // ** Hooks
  const clipboard = useClipboard()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { BKB_ROLES } = useConstantStore()

  // ** Highlight code on mount
  useEffect(() => {
    Prism.highlightAll()
  }, [showCode, tabValue])

  const codeToCopy = () => {
    if (code.tsx !== null && tabValue === 'tsx') {
      return code.tsx.props.children.props.children
    } else if (code.jsx !== null && tabValue === 'jsx') {
      return code.jsx.props.children.props.children
    } else {
      return ''
    }
  }

  const handleClick = () => {
    clipboard.copy(codeToCopy())
    toast.success('The source code has been copied to your clipboard.', {
      duration: 2000
    })
  }

  const renderCode = () => {
    if (code[tabValue] !== null) {
      return code[tabValue]
    } else {
      return null
    }
  }

  const handlePlaying11Select = (playerId: number, type: 'ROLE' | 'PRICE', value: any) => {
    console.log('value: ', value)
    // const selected = playing11s.includes(playerId)

    // setPlaying11s(prev =>
    //   selected ? [...new Set(playing11s.filter(f => f != playerId))] : [...new Set([...prev, playerId])]
    // )
    // if (selected) {
    //   setSubstitutes(substitutes.filter(f => f != playerId))
    // }
    let found = false
    for (let p of changedPlayers) {
      if (p.player_id == playerId) {
        found = true
        if (type == 'ROLE') {
          p.role = value
        } else {
          p.price = value
        }
      }
    }

    if (!found) {
      changedPlayers.push({
        player_id: playerId,
        ...(type == 'ROLE' && {
          role: value
        }),

        ...(type == 'PRICE' && {
          price: value
        })
      } as any)
    }

    setChangedPlayers([...changedPlayers])
  }

  const handleSubstituteSelect = (playerId: number) => {
    const selected = substitutes.includes(playerId)

    setSubstitutes(prev =>
      selected ? [...new Set(substitutes.filter(f => f != playerId))] : [...new Set([...prev, playerId])]
    )
  }

  useEffect(() => {
    // const list = changedPlayers.map(id => {
    //   return {
    //     team_id: props?.team?.id,
    //     player_id: id,

    //   }
    // })
    props.getList(changedPlayers)
  }, [changedPlayers])

  useEffect(() => {
    if (!props.lineUp?.length) return

    setSubstitutes(props.lineUp?.filter(f => f.is_substitute).map(item => item.player_id))
    setPlaying11s(props.lineUp?.filter(f => f.playing5).map(item => item.player_id))
  }, [props.lineUp])

  return (
    <Card
      className={className}
      sx={{ '& .MuiCardHeader-action': { lineHeight: 0.8 }, ...sx }}
      id={id || `card-snippet--${title.toLowerCase().replace(/ /g, '-')}`}
    >
      <CardHeader
        title={title}
        {...(hidden
          ? {}
          : {
            action: (
              <IconButton /** onClick={() => setShowCode(!showCode)} */>
                <Icon icon='mdi:info' fontSize={20} />
              </IconButton>
            )
          })}
      />
      <CardContent>
        <List
          sx={{
            position: 'relative',
            overflow: 'auto',
            maxHeight: 500
          }}
        >
          <ListSubheader sx={{ padding: 'unset' }}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar src='' alt={'P'} sx={{ height: 32, width: 32 }} />
              </ListItemAvatar>
              <ListItemText id='checkbox-list-label-0' primary={'Player Name'} />
              <ListItemSecondaryAction tabIndex={10} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2'>Role</Typography>
                <div style={{ width: '120px' }}></div>
                <Typography variant='body2'>Credit</Typography>
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListSubheader>
          <Divider />
          {changedPlayers?.length ? (
            changedPlayers.map(player => {
              return (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={(e: any) => {
                      const subBtnId = e.target?.farthestViewportElement?.id || e.target?.id
                      const isSubBtn = subBtnId == 'matchLineUpSubBtnID'
                      if (isSubBtn) {
                        return
                      }
                      // handlePlaying11Select(player.id)
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={getPublicUrl(player?.image) || '/images/avatars/1.png'}
                        alt={player?.name?.toUpperCase()}
                        sx={{ height: 32, width: 32 }}
                      />
                    </ListItemAvatar>
                    <ListItemText id='checkbox-list-label-0' primary={player?.name} secondary={player.playing_role} />
                    <ListItemSecondaryAction
                      tabIndex={10}
                      sx={{ width: '50%', alignItems: 'end', display: 'flex', flexDirection: 'row' }}
                    >
                      {/* <Checkbox
                        edge='end'
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': 'checkbox-list-label-0' }}
                        onChange={() => handlePlaying11Select(player.id)}
                        checked={playing11s.includes(player.id)}
                      /> */}

                      {BKB_ROLES.map((role: string) => {
                        return (
                          <IconButton
                            onClick={e => {
                              handlePlaying11Select(player?.player_id, 'ROLE', role)
                            }}
                            size='medium'
                            color={player?.role == role ? 'primary' : 'default'}
                            sx={{ opacity: player?.role == role ? 1 : 0.7, height: 60, width: 60 }}
                          >

                            <p style={{ fontSize: 12 }}>{role!.slice(0, 6)}</p>
                          </IconButton>
                        )
                      })}


                      <TextField
                        sx={{ width: 70 }}
                        label={'Credit'}
                        value={player?.price}
                        onChange={e => {
                          handlePlaying11Select(player?.player_id, 'PRICE', parseInt(e.target.value))
                        }}
                        type={'number'}
                      />
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              )
            })
          ) : (
            <></>
          )}
        </List>
      </CardContent>
      {hidden ? null : (
        <Collapse in={showCode}>
          <Divider sx={{ my: '0 !important' }} />

          <CardContent sx={{ position: 'relative', '& pre': { m: '0 !important', maxHeight: 500 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <ToggleButtonGroup
                exclusive
                size='small'
                color='primary'
                value={tabValue}
                onChange={(e, newValue) => (newValue !== null ? setTabValue(newValue) : null)}
              >
                {code.tsx !== null ? (
                  <ToggleButton value='tsx'>
                    <Icon icon='mdi:language-typescript' fontSize={20} />
                  </ToggleButton>
                ) : null}
                {code.jsx !== null ? (
                  <ToggleButton value='jsx'>
                    <Icon icon='mdi:language-javascript' fontSize={20} />
                  </ToggleButton>
                ) : null}
              </ToggleButtonGroup>
            </Box>
            <Tooltip title='Copy the source' placement='top'>
              <IconButton
                onClick={handleClick}
                sx={{
                  top: '5rem',
                  color: 'grey.100',
                  right: '2.5625rem',
                  position: 'absolute'
                }}
              >
                <Icon icon='mdi:content-copy' fontSize={20} />
              </IconButton>
            </Tooltip>
            <div>{renderCode()}</div>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}

export default CardPreSquad
