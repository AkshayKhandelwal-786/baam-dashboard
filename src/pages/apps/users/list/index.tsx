// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText
} from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { inputType } from 'src/context/types'
import { format } from 'date-fns'
import useUserStore, { User } from 'src/features/user/user.service'
import { getPublicUrl } from 'src/helpers/common'
import DateMonthYearPicker from 'src/views/components/pickers/DateMonthYearPicker'
import EditableDatePicker from 'src/views/components/pickers/EditableDatePicker'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Chip from 'src/@core/components/mui/chip'
import Router from 'next/router'
interface CellType {
  row: User
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

export const PrfileLevelObject: any = {
  4: { color: 'success', text: "Profile completed" },
  3: { color: 'success', text: "Kyc pending" },
  2: { color: 'warning', text: "Bank & KYC pending" },
  1: { color: 'secondary', text: "Professional profile pending" },
  0: { color: 'secondary', text: "pending" }
}

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof User }

const defaultColumns: PlanListColumn[] = [
  {
    flex: 0.1,
    field: '_id',
    minWidth: 40,
    headerName: 'User',
    renderCell: ({ row }: CellType) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {
            row?.photo?.length ?
              <CustomAvatar src={row?.photo} sx={{ mr: 3, width: 30, height: 30 }} />
              :
              <CustomAvatar
                skin='light'
                color={'primary'}
                sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
              >
                {getInitials(row?.name || "")}
              </CustomAvatar>

          }
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href={`#`} onClick={e => e.preventDefault()} >{row?.name}</LinkStyled>
            <Typography noWrap variant='caption'>
              {`${row?.email}`}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  // {
  //   flex: 0.1,
  //   minWidth: 40,
  //   field: 'email',
  //   headerName: 'Email',
  //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.email}</Typography>
  // },
  {
    flex: 0.1,
    minWidth: 40,
    field: 'phone',
    headerName: 'Phone',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.phone}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 40,//
    field: 'type',
    headerName: 'Type',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.type}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 40,//
    field: 'dob',
    headerName: 'Status',
    renderCell: ({ row }: any) => <Typography variant='body2'>{row.active ? "ACTIVE" : "IN-ACTIVE"}</Typography>
  },
  // {
  //   flex: 0.1,
  //   minWidth: 110,
  //   field: 'profile_level',
  //   headerName: 'Status',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <Chip
  //         skin='light'
  //         size='small'
  //         label={PrfileLevelObject[row?.profile_level ?? ""]?.text}
  //         color={PrfileLevelObject[row?.profile_level ?? ""]?.color}
  //         sx={{ textTransform: 'capitalize' }}
  //       />
  //     )
  //   }
  // }, {
  //   flex: 0.1,
  //   minWidth: 110,
  //   field: 'experience',
  //   headerName: 'experience',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <Chip
  //         skin='light'
  //         size='small'
  //         label={(row?.experience ?? 0) + " yr"}
  //         color={"error"}
  //         sx={{ textTransform: 'capitalize' }}
  //       />
  //     )
  //   }
  // },
]

const schema = yup.object().shape({
  name: yup.string().label('Name').meta({}).required()
})
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = ({ read, write, update, del }: GlobalProps) => {
  const page_title = 'User'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  // ** Hooks
  const store = useUserStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const init = async () => {
      store.get.paginate({ size: 10, page: 0 })
    }
    init()
  }, [])

  const handleFilter = (val: string) => {
    store.get.paginate({ search: val })
  }

  // ** Handle Edit dialog
  const handleEditClickOpen = async (doReset?: boolean) => {
    if (doReset) {
      set_competition_team_ids([
        {
          competition_id: null,
          team_id: null
        }
      ])
      reset()
      store.select(null)
    }

    setOpenEdit(true)
  }

  const handleEditClose = () => {
    set_competition_team_ids([
      {
        competition_id: null,
        team_id: null
      }
    ])
    setOpenEdit(false)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.2,
      minWidth: 200,
      sortable: false,
      field: 'actions',
      headerName: 'Distributor Details',
      headerAlign: "center",
      renderCell: ({ row }: any) => ((row?.company_name && row?.gst_number) ?
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
            >
              {getInitials(row?.company_name || "")}
            </CustomAvatar>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href={`#`} onClick={e => e.preventDefault()} >{row?.company_name || ""}</LinkStyled>
              <Typography noWrap variant='caption'>
                {`${row?.gst_number || ""}`}
              </Typography>
            </Box>
          </Box>
          {
            !row?.active ?
              <>

                <Box sx={{ width: 10 }} ></Box>
                <Button variant='contained' size='small' onClick={() => store.approveDistributor(row?._id)} >Approve</Button>
              </>
              : <></>
          }
        </Box> : "NA"
      )
    }
  ]

  const onSubmit = async () => {
    const bodyData = getValues() as any
    await store.add(bodyData)
    handleEditClose()
  }

  const [competition_team_ids, set_competition_team_ids] = useState([
    {
      competition_id: null,
      team_id: null
    }
  ])

  function handleUpdateCompetition(comp: any, id: number, isComp: boolean) {
    set_competition_team_ids(prevCompetitionTeamIds => {
      return prevCompetitionTeamIds.map((playerComp, index) => {
        if (index == id) {
          if (isComp === true) {
            return {
              ...playerComp,
              competition_id: comp
            }
          } else {
            return {
              ...playerComp,
              team_id: comp
            }
          }
        }
        return playerComp
      })
    })
  }

  function handleAddNewCompTeam() {
    const newCompTeam = {
      competition_id: null,
      team_id: null
    }

    set_competition_team_ids([...competition_team_ids, newCompTeam])
  }

  function handleRemoveTeam(idToRemove: any) {
    const comp = competition_team_ids.filter((item, index) => index !== idToRemove)
    set_competition_team_ids(comp)
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box
              sx={{
                p: 5,
                pb: 3,
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >

              {write && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    size='small'
                    sx={{ mr: 4, mb: 2 }}
                    placeholder={`Search ${page_title}`}
                    onChange={e => handleFilter(e.target.value)}
                  />
                  {/* <Button
                    sx={{ mb: 2 }}
                    variant='contained'
                    onClick={() => {
                      handleEditClickOpen(true)
                    }}
                  >
                    Create {page_title}
                  </Button> */}
                </Box>
              )}
            </Box>
            <DataGrid
              autoHeight
              pagination
              rows={store.astrologer.list}
              columns={columns}
              getRowId={row => row?._id}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.astrologer.page,
                pageSize: store.astrologer.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.astrologer.page && pageSize == store.astrologer.size) return
                store.get.paginate({ page: page, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.astrologer.total}
            />
          </Card>
          {/* Add/Edit Dialog */}
          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='user-view-edit'
            aria-describedby='user-view-edit-description'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle
              id='user-view-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              {store.astrologer?.id ? 'Edit' : 'Add'} {page_title}
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText
                variant='body2'
                id='user-view-edit-description'
                sx={{ textAlign: 'center', mb: 7 }}
              ></DialogContentText>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6}>
                  {Object.keys(describedSchema.fields).map(fieldName => {
                    const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
                    if (field?.meta?.hidden) {
                      return <></>
                    }

                    let label = field.label
                    if (!label) {
                      label = fieldName.replaceAll('_', ' ')
                      label = label.charAt(0).toUpperCase() + label.slice(1)
                    }
                    let type = inputType[field.type]

                    if (field.meta?.type === 'file') {
                      type = field.meta?.type
                    }

                    if (field.meta?.type == 'select') {
                      if (field.meta?.key == 'GENDERS') {
                        field.oneOf = ['MALE', 'FEMALE'].map(item => ({
                          value: item,
                          label: item
                        }))
                      }
                    }

                    if (field.type == 'boolean') {
                      field.oneOf = [
                        {
                          value: 1,
                          label: 'YES'
                        },
                        {
                          value: 0,
                          label: 'NO'
                        }
                      ]
                    }

                    return (
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name={fieldName as any}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => {
                              if (type == 'file') {
                                return (
                                  <>
                                    <Button variant='outlined' fullWidth size='large' color='secondary'>
                                      <label
                                        htmlFor={`user-view-${fieldName}`}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          display: 'flex',
                                          justifyContent: 'start',
                                          alignItems: 'center',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Icon icon={'mdi:cloud-upload-outline'} />
                                        <p
                                          style={{
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            margin: '0 0 0 5px'
                                          }}
                                        >
                                          {value?.name || label}
                                        </p>
                                      </label>
                                    </Button>

                                    <input
                                      type='file'
                                      id={`user-view-${fieldName}`}
                                      hidden
                                      onChange={e => {
                                        let file = e.target.files?.[0]
                                        if (file) {
                                          setValue(fieldName as any, file)
                                        }
                                      }}
                                      {...field?.meta?.attr}
                                    />
                                  </>
                                )
                              }
                              try {
                                if (field.oneOf.length) {
                                  return (
                                    <Autocomplete
                                      options={[...field.oneOf]}
                                      onChange={(e, value: any) => {
                                        setValue(
                                          fieldName as any,
                                          (typeof value === 'object' ? value?.value : value) as any
                                        )
                                      }}
                                      getOptionLabel={(option: any) =>
                                        typeof option == 'object' ? option.label : option
                                      }
                                      value={
                                        field.oneOf.find((f: any) => {
                                          return f.value == value
                                        }) || value
                                      }
                                      renderInput={params => {
                                        return <TextField {...params} label={label} />
                                      }}
                                    />
                                  )
                                }

                                if (type === 'date') {
                                  return (
                                    <EditableDatePicker
                                      label={label}
                                      value={value}
                                      onChange={(date: Date) => {
                                        setValue(fieldName as any, format(new Date(date), 'yyyy-MM-dd'))
                                      }}
                                    />
                                  )
                                }
                              } catch (e) {
                                console.error(fieldName)
                                return <></>
                              }
                              // if (field.oneOf.length) {
                              //   return (
                              //     <>
                              //       <InputLabel id={`user-view-${fieldName}`}>{label}</InputLabel>

                              //       <Select
                              //         value={value}
                              //         label={label}
                              //         onChange={onChange}
                              //         error={Boolean((errors as any)[fieldName])}
                              //         labelId={`user-view-${fieldName}`}
                              //       >
                              //         {field.oneOf.map((item: any) => {
                              //           if (typeof item === 'object') {
                              //             return <MenuItem value={item?.value}>{item?.label}</MenuItem>
                              //           }
                              //           return <MenuItem value={item}>{item}</MenuItem>
                              //         })}
                              //       </Select>
                              //     </>
                              //   )
                              // }
                              return (
                                <TextField
                                  value={value}
                                  label={label}
                                  onChange={onChange}
                                  type={type}
                                  error={Boolean((errors as any)[fieldName])}
                                />
                              )
                            }}
                          />
                          {(errors as any)[fieldName] && (
                            <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-first-name'>
                              {(errors as any)[fieldName]?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )
                  })}
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
PlanList.moduleId = 6
PlanList.gameIds = [1, 2]
export default PlanList

const TeamPlayer = (data: any) => {
  return (
    <>
      <Grid container className='more-team-player-container' spacing={2}>
        <Grid item xs={5}>
          <Autocomplete
            options={data.compList}
            onChange={(e, value: any) => {
              data.handleUpdateCompetition(value.id, data.id, true)
            }}
            getOptionLabel={(option: any) => (typeof option == 'object' ? option.name : option)}
            value={data.compList.find((comp: any) => comp.id === data.player.competition_id)}
            renderInput={params => {
              return <TextField {...params} label='Competition Name' />
            }}
          />
        </Grid>
        <Grid item xs={5.4}>
          <Autocomplete
            options={data.teamList}
            onChange={(e, value: any) => {
              data.handleUpdateCompetition(value.id, data.id, false)
            }}
            getOptionLabel={(option: any) => (typeof option == 'object' ? option.name : option)}
            value={data.teamList.find((comp: any) => comp.id === data.player.team_id)}
            renderInput={params => {
              return <TextField {...params} label='Team Name' />
            }}
          />
        </Grid>

        <Grid item xs={1}>
          <Icon icon={'mdi:delete-outline'} onClick={() => data.handleRemoveTeam(data.id)} />
        </Grid>
      </Grid>
    </>
  )
}
