import EditableDatePicker from 'src/views/components/pickers/EditableDatePicker'
import { inputType } from 'src/context/types'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { RedeemRequestData } from 'src/api/v3/models'
import useRedeemRequestStore from 'src/features/redeem-requests/redeem-requests.service'
import { useRouter } from 'next/router'
import MenuItem from '@mui/material/MenuItem'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns'

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
    FormHelperText,
    InputLabel,
    Select
  } from '@mui/material'
interface CellType {
    row: RedeemRequestData['responses']['List']['data'][0]
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.primary.main
}))

// ** renders client column

interface PlanListColumn {
    flex: number;
    field: string;
    minWidth: number;
    headerName: string;
    renderCell: (params: CellType) => JSX.Element;
}



const defaultColumns: PlanListColumn[] = [
    {
        flex: 0.15,
        field: 'title',
        minWidth: 100,
        headerName: 'Reward Title',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.reward?.title ?? '-'}</Typography>,
    },  
    {
        flex: 0.15,
        field: 'name',
        minWidth: 100,
        headerName: 'Name',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.user?.name ?? '-'}</Typography>,
    },
    {
        flex: 0.15,
        field: 'email',
        minWidth: 100,
        headerName: 'Email',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.user?.email ?? '-'}</Typography>,
    },
    {
        flex: 0.15,
        field: 'phone',
        minWidth: 100,
        headerName: 'Mobile Number',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.user?.phone_code} {row.user?.phone ?? '-'}</Typography>,
    },
    {
        flex: 0.2,
        field: 'status',
        minWidth: 150,
        headerName: 'Type',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.status}</Typography>,
    },
    {
        flex: 0.15,
        field: 'points',
        minWidth: 90,
        headerName: 'Points',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.points}</Typography>,
    },
    {
        flex: 0.2,
        field: 'type',
        minWidth: 150,
        headerName: 'Status',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.type}</Typography>,
    },
];


const schema = yup.object().shape({
    type: yup.string().label("Status").meta({ type: 'select', key: "STATUS" }).required(),
    
    // description: yup.string().when("type", {
    //     is: "In Progress",
    //     then: (schema) => schema.required("Description is required"),
    //     otherwise: (schema) => schema.notRequired(),
    //   }),
    
});
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()

const PlanList = ({ read, write, update, del }: GlobalProps) => {
    const page_title = 'Redeem Request Status'
    const router = useRouter()

      // ** State
      const [openEdit, setOpenEdit] = useState<boolean>(false)
    
      // ** Hooks
      const store = useRedeemRequestStore()
    
      const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        reset,
        watch
      } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
      })
    
      const selectedStatus = watch("type"); // Watch the selected value

      const { keyword } = router.query


  
      const handleFilter = (val: string) => {
          store.get.paginate({ search: val })
      }
  
          
      useEffect(() => {
          if (!router?.isReady) return
          const init = async () => {
              store.get.paginate({ size: 10, page: 0, ...(keyword == 'undefined' ? {} : { keyword }) } as any)
              store.get.paginate({ size: 10, page: 0 })
          }
          init()
      }, [router?.isReady, keyword])
  
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
                {row.type === "Completed" ? (
                    <Typography variant="body2" color="textSecondary">-</Typography>
                ) : (
                    update && (
                        <Tooltip title={`Update ${page_title}`}>
                        <IconButton
                            size='small'
                            onClick={() => {
                                store.select(row?._id); // Ensure ID is selected
                                for (let key in defaultValues) {
                                setValue(key as any, row[key]); // Set values from row
                                }
                                setValue("description" as any, row?.description);
                                setValue("_id" as any, row?._id);
                                handleEditClickOpen()
                            }}
                        >
                            <Icon icon='mdi:edit-outline' fontSize={20} />
                        </IconButton>
                        </Tooltip>
                    )
                )}
            </Box>
          )
        }
      ]

      const onSubmit = async () => {
        const bodyData = getValues() as any;

        console.log("<<<<<<<<",bodyData);
        
    
        await store.add(bodyData)
        handleEditClose()
      }
      const [competition_team_ids, set_competition_team_ids] = useState([
        {
          competition_id: null,
          team_id: null
        }
      ])
    
    return (
        <DatePickerWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <h3>List Redeem Request</h3>
                    <Card>
                        <Box
                            sx={{
                                p: 5,
                                pb: 3,
                                maxWidth: '400px',
                                width: '100%',
                            }}
                        >
                            {write && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <TextField
                                    size='small'
                                    sx={{ mr: 4, mb: 2 }}
                                    placeholder='Search by Title'
                                    onChange={(e) => {
                                        const searchValue = e.target.value
                                        if (searchValue) {
                                        router.push(`/apps/redeem-requests/list/?keyword=${encodeURIComponent(searchValue)}`)
                                        } else {
                                        router.push(`/apps/redeem-requests/list/`)
                                        }
                                    }}
                                    />
                                </Box>
                            )}
                        </Box>
                        <DataGrid
                            autoHeight
                            pagination
                            rows={store.history.list}
                            columns={columns}
                            getRowId={row => row?._id}
                            // checkboxSelection
                            disableRowSelectionOnClick
                            pageSizeOptions={[10, 25, 50]}
                            paginationMode='server'
                            paginationModel={{
                                page: store.history.page,
                                pageSize: store.history.size
                            }}
                            onPaginationModelChange={({ page, pageSize }) => {
                                if (page == store.history.page && pageSize == store.history.size) return
                                store.get.paginate({ page: page, size: pageSize })
                            }}
                            onColumnOrderChange={e => {
                                console.log('e: ', e)
                            }}
                            rowCount={store.history.total}
                        />
                    </Card>
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
                        {store.history?.id ? 'Edit' : 'Add'} {page_title}
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
                            return (
                                <Grid item xs={12} sm={field?.meta?.sm || 12}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="type"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <InputLabel id="status-label">Status</InputLabel>
                                                    <Select
                                                        {...field}
                                                        labelId="status-label"
                                                        error={Boolean(errors.type)}
                                                    >
                                                        {["New", "In Progress", "Completed"].map((item) => (
                                                            <MenuItem key={item} value={item}>
                                                                {item}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                            )
                            })}

                            {selectedStatus === "In Progress" && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                    <TextField
                                        {...field} // Ensures value and onChange are properly handled
                                        label="Description"
                                        multiline
                                        rows={3}
                                        fullWidth
                                    />
                                    )}
                                />
                                </FormControl>
                            </Grid>
                            )}
      
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


