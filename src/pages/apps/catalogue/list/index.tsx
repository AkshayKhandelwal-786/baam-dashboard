// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import IconButton from '@mui/material/IconButton'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
    Autocomplete,
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
import useCatalogueStore, { Catalogue } from 'src/features/catalogue/catalogue.service'
import CustomAvatar from 'src/@core/components/mui/avatar'
interface CellType {
    row: Catalogue
}

export const PrfileLevelObject: any = {
    4: { color: 'success', text: "Profile completed" },
    3: { color: 'success', text: "Kyc pending" },
    2: { color: 'warning', text: "Bank & KYC pending" },
    1: { color: 'secondary', text: "Professional profile pending" },
    0: { color: 'secondary', text: "pending" }
}
const fileUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// ** renders client column
type PlanListColumn = Omit<GridColDef, 'field'> & { field: keyof Catalogue }

const defaultColumns: PlanListColumn[] = [
    {
        flex: 0.1,
        field: '_id',
        minWidth: 40,
        headerName: 'Image',
        renderCell: ({ row }: CellType) => {

            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {
                        row?.file?.length ?
                            <CustomAvatar src={`${fileUrl}${row?.file}`} sx={{ mr: 3, width: 50, height: 50 }} />
                            : ''
                    }
                </Box>
            )
        }
    },
]

const schema = yup.object().shape({
    file: yup
        .mixed().label("Image")
        .meta({ type: 'file', attr: { accept: 'image/x-png,image/jpeg' } })
        .required(),
})
const defaultValues = schema.getDefault()
const describedSchema = schema.describe()
const PlanList = ({ read, write, update, del }: GlobalProps) => {
    const page_title = 'Catalogue'

    // ** State
    const [openEdit, setOpenEdit] = useState<boolean>(false)

    // ** Hooks
    const store = useCatalogueStore()

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
            flex: 0.1,
            minWidth: 130,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        console.log(",bodyData", bodyData);

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
