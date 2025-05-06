// ** React Imports
import { useState, useEffect } from 'react'
import { UserType } from 'src/constant/constant'
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
import useRewardStore, { QR } from 'src/features/reward/reward.service'
import { format } from 'date-fns'
import { getPublicUrl } from 'src/helpers/common'
import EditableDatePicker from 'src/views/components/pickers/EditableDatePicker'

interface CellType {
  row: QR
}
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof QR }
const fileUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("<<<<<<",fileUrl);

const defaultColumns: PlanListColumn[] = [

  {
    flex: 0.1,
    field: 'image',
    minWidth: 80,
    headerName: 'image',
    renderCell: ({ row }: CellType) => (

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {row?.image?.length ? (
        <CustomAvatar
          src={`${fileUrl}/public/images/${row?.image}`}
          sx={{ mr: 3, width: 50, height: 50 }}
        />
      ) : null}
    </Box>

    )
  },

  // {
  //   flex: 0.2,
  //   minWidth: 90,
  //   field: 'qr',
  //   headerName: 'qr',
  //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.qr}</Typography>
  // },
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
    field: 'points',
    headerName: 'points',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.points}</Typography>
  },

  {
    flex: 0.2,
    minWidth: 90,
    field: 'user_types',
    headerName: 'user types',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.user_types.join(" & ")}</Typography>
  }
]

const schema = yup.object().shape({
  title: yup.string().label("Title").meta({}).required(),
  label: yup.string().label("Label").meta({}).required(),
  details: yup.string().label("Details").meta({}).required(),
  tnc: yup.string().label("T&C").meta({}).required(),
  expire_at: yup.date().label('Expire At').nullable().optional().default(null),
  image: yup
    .mixed().label("Image")
    .meta({ type: 'file', attr: { accept: 'image/x-png,image/gif,image/jpeg' } })
    .required(),
  // qr: yup
  //   .mixed().label("QR")
  //   .meta({ type: 'file', attr: { accept: 'image/x-png,image/gif,image/jpeg' } })
  //   .required(),
  points: yup.number().label('Points').meta({}).required(),
  user_types: yup.array().required().min(1).max(2).of(yup.string().required()).label("User Types").meta({ type: 'select', multiple: true, key: "USER_TYPES" }).default([]),
});


const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = ({ read, write, update, del }: GlobalProps) => {
  const page_title = 'Reward'

  // ** State
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  // ** Hooks
  const store = useRewardStore()

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

  const [benefits, setBenefits] = useState([""])
  const handleBenefitSize = (type: "add" | "remove", index?: number) => {
    if (type == "add") {
      setBenefits(prev => ([...prev, ""]))
    } else if (type == "remove") {
      setBenefits(prev => prev.filter((_, i) => index != i))
    }
  }
  const handleBenefitChange = (value: string, index: number) => {
    setBenefits(prev => prev.map((_, i) => index === i ? value : _))
  }

  useEffect(() => {
    const init = async () => {
      store.get.paginate({ size: 10, page: 0 })
    }
    init()
  }, [])

  const [filterValue, setFilterValue] = useState('');
  const [filteredRows, setFilteredRows] = useState(store.reward.list);

  const handleFilter = (val: string) => {
    setFilterValue(val);

    const filtered = store.reward.list.filter(row =>
      row.title?.toLowerCase().includes(val.toLowerCase())
    );

    setFilteredRows(filtered);
  };

  useEffect(() => {
    // Reset when filter is cleared or new data comes from API
    if (filterValue === '') {
      setFilteredRows(store.reward.list);
    }
  }, [filterValue, store.reward.list]);


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
                  setBenefits(row.benefits || [""])
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

          {write && (
            <Tooltip title={`Copy ${page_title}`}>
              <IconButton
                size='small'
                onClick={() => {
                  for (const key in defaultValues) {
                    setValue(key as any, row[key])
                  }
                  setBenefits(row.benefits || [""])
                  handleEditClickOpen()
                }}
              >
                <Icon icon='mdi:content-copy' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  const onSubmit = async () => {
    const bodyData = getValues() as any

    let _benefits = benefits.filter(f => f)

    if(bodyData.expire_at == null)
      {
        bodyData.expire_at = '';
      }

      
    if (!_benefits.length) {
      _benefits = []
    }
    if (typeof bodyData.image == "string") {
      delete bodyData.image;
    }
    bodyData.benefits = JSON.stringify(benefits);
    bodyData.user_types = JSON.stringify(bodyData.user_types);
    console.log("🚀 ~ onSubmit ~ bodyData:", bodyData)

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
          <h3>List Reward</h3>

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
                    placeholder={`Search by Title`}
                    onChange={e => handleFilter(e.target.value)}
                  />
                  <Button
                    sx={{ mb: 2 }}
                    variant='contained'
                    onClick={() => {
                      setBenefits([""])
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
              rows={filteredRows}
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
                if (page === store.reward.page && pageSize === store.reward.size) return;
                store.get.paginate({ page, size: pageSize });
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
                      if (field.meta?.key == 'GENDERS') {
                        field.oneOf = ['MALE', 'FEMALE'].map(item => ({
                          value: item,
                          label: item
                        }))
                      }

                      if (field.meta?.key == 'USER_TYPES') {
                        field.oneOf = [UserType.normal,UserType.distributor_architect,UserType.dealer,UserType.retailer,UserType.carpenter]
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

                  {
                    benefits.map((value, index) => {
                      return (
                        <Grid item xs={12} sm={12} display={"flex"} justifyContent={"space-between"}  >
                          <Grid item xs={9} sm={9}>


                            <TextField
                              value={value}
                              label={"Benefits"}
                              type={"type"}
                              fullWidth
                              onChange={(e) => {
                                handleBenefitChange(e.target.value, index)
                              }}
                            />
                          </Grid>


                          <Grid item xs={2} sm={2}>

                            {
                              index == (benefits.length - 1)
                                ?
                                <Button fullWidth sx={{ height: "100%" }} variant='outlined' onClick={() => handleBenefitSize("add")}  >
                                  <Icon icon={"mdi:add"} />
                                </Button>
                                :
                                <Button fullWidth sx={{ height: "100%" }} variant='outlined' onClick={() => handleBenefitSize("remove", index)}  >
                                  <Icon icon={"mdi:remove"} />
                                </Button>

                            }

                          </Grid>
                        </Grid>
                      )
                    })
                  }

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


