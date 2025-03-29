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
import Select from '@mui/material/Select'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  Autocomplete,
  Avatar,
  Button,
  Chip,
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
import usePromotionStore, { Promotion } from 'src/features/promotion/promotion.service'
import { format } from 'date-fns'
import { getPublicUrl } from 'src/helpers/common'
import EditableDatePicker from 'src/views/components/pickers/EditableDatePicker'
import CustomAvatar from 'src/@core/components/mui/avatar'

interface CellType {
  row: Promotion
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))
const fileUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Promotion }

const defaultColumns: PlanListColumn[] = [

  {
    flex: 0.1,
    field: 'image',
    minWidth: 80,
    headerName: 'image',
    renderCell: ({ row }: CellType) => ( 

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {
            row?.file?.length ?
                <CustomAvatar src={`${fileUrl}${row?.file}`} sx={{ mr: 3, width: 50, height: 50 }} />
                : ''
        }
    </Box>
    )
  },
  {
    flex: 0.2,
    minWidth: 90,
    field: 'title',
    headerName: 'title',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.title}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 90,
    field: 'offer_point',
    headerName: 'offer point',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.offer_point}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 90,
    field: 'offer_status',
    headerName: 'status',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.offer_status}</Typography>
  },

  
]

const schema = yup.object().shape({
  title: yup.string().label("Title").meta({}).required(),
  offer_point: yup.number().label("Offer Point").meta({}).required(),
  offer_status: yup.string().label("Status").meta({ type: 'select', key: "STATUS" }).required(),
  file: yup
          .mixed().label("Image")
          .meta({ type: 'file', attr: { accept: 'image/x-png,image/jpeg' } })
          .required(),

  description: yup.string().label("Description").meta({}).required(),
  expire_at: yup.date().label('Expire At').meta({}).optional(),
});


const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = ({ read, write, update, del }: GlobalProps) => {
  const page_title = 'Promotion'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  // ** Hooks
  const store = usePromotionStore()

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
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {update && (
            <Tooltip title={`Edit ${page_title}`}>
              <IconButton
                size='small'
                onClick={() => {
                  store.select(row?._id)
                  for (let key in defaultValues) {
                    setValue(key as any, row[key])
                  }
                  handleEditClickOpen()
                }}
              >
                <Icon icon='mdi:edit-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
          {del && (
            <Tooltip title={`Delete ${page_title}`}>
              <IconButton
                size='small'
                onClick={() => {
                  store.select(row?._id)
                  store.delete()
                }}
              >
                <Icon icon='mdi:delete-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
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
                  <Button
                    sx={{ mb: 2 }}
                    variant='contained'
                    onClick={() => {
                      handleEditClickOpen(true)
                    }}
                  >
                    Create {page_title}
                  </Button>
                </Box>
              )}
            </Box>
            <DataGrid
              autoHeight
              pagination
              rows={store.reward.list}
              columns={columns}
              getRowId={row => row?._id}
              // checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              paginationModel={{
                page: store.reward.page,
                pageSize: store.reward.size
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                if (page == store.reward.page && pageSize == store.reward.size) return
                store.get.paginate({ page: page, size: pageSize })
              }}
              onColumnOrderChange={e => {
                console.log('e: ', e)
              }}
              rowCount={store.reward.total}
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
              {store.reward?.id ? 'Edit' : 'Add'} {page_title}
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

                      if (field.meta?.key == 'OFFER_STATUS') {
                        field.oneOf = ['ACTIVE', 'INACTIVE']
                      }
                    }
                    return (
                      <Grid item xs={12} sm={field?.meta?.sm || 6}>
                        
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
                                  if (field.meta?.multiple) {
                                    return <Autocomplete
                                      multiple
                                      id='tags-filled'
                                      options={[...field.oneOf] as any}
                                      value={value}
                                      onChange={(e, selectedTeams: any) => {
                                        // console.log(selectedTeams)
                                        setValue(
                                          fieldName as any,
                                          (typeof value === 'object' ? selectedTeams : value) as any
                                        )

                                      }}
                                      getOptionLabel={(option: any) =>
                                        typeof option === 'object' ? option.label : option
                                      }
                                      // freeSolo
                                      renderTags={(value: readonly string[], getTagProps) =>
                                        value.map((option: string, index: number) => (
                                          <Chip variant='outlined' label={option} {...getTagProps({ index })} />
                                        ))
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          size='medium'
                                          variant='outlined'
                                          label={label}
                                          placeholder=''
                                        />
                                      )}
                                    />
                                  }
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


