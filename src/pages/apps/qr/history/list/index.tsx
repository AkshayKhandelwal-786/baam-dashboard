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
import useRewardStore, { QR } from 'src/features/reward/reward.service'
import { format } from 'date-fns'
import { getPublicUrl } from 'src/helpers/common'
import EditableDatePicker from 'src/views/components/pickers/EditableDatePicker'
import { RewardData } from 'src/api/v3/models'
import useRewardHistoryStore from 'src/features/reward/history.service'
import useUserStore from 'src/features/user/user.service'
import useQrHistoryStore from 'src/features/qr/history.service'
import { useRouter } from 'next/router'

interface CellType {
    row: RewardData['responses']['List']['data'][0]
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
        flex: 0.2,
        field: 'qr',
        minWidth: 90,
        headerName: 'QR Code',
        renderCell: ({ row }: CellType) => (
            <LinkStyled href={getPublicUrl((row.qr as any)?.url, "qr/") + ""} target='_blank'>
                <Avatar alt='' src={'' + getPublicUrl((row.qr as any)?.url, "qr/")} sx={{ mr: 3 }} />
            </LinkStyled>
        ),
    },
    {
        flex: 0.2,
        minWidth: 90,
        field: 'code',
        headerName: 'code',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{(row.qr as any)?.code}</Typography>,
      },
    {
        flex: 0.2,
        field: 'user',
        minWidth: 90,
        headerName: 'User',
        renderCell: ({ row }: CellType) => (row as any)?.user?.name,
    },
    {
        flex: 0.15,
        field: 'points',
        minWidth: 90,
        headerName: 'Points',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{(row.qr as any)?.points}</Typography>,
    },
    {
        flex: 0.2,
        field: 'status',
        minWidth: 150,
        headerName: 'Status',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{(row as any)?.status}</Typography>,
    },
    {
        flex: 0.15,
        field: 'expire_at',
        minWidth: 150,
        headerName: 'Scaned At',
        renderCell: ({ row }: CellType) => (
            <Typography variant='body2'>
                {new Date(row.createdAt).toLocaleDateString()}
            </Typography>
        ),
    },
    // {
    //     flex: 0.2,
    //     field: 'status',
    //     minWidth: 100,
    //     headerName: 'Status',
    //     renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.status}</Typography>,
    // },
];




const PlanList = ({ read, write, update, del }: GlobalProps) => {
    const page_title = 'Reward History'

    // ** State
    const [openEdit, setOpenEdit] = useState<boolean>(false)

    // ** Hooks
    const store = useQrHistoryStore()
    const userStore = useUserStore()


    const handleFilter = (val: string) => {
        store.get.paginate({ search: val })
    }


    const router = useRouter()

    const { user_id } = router.query


    useEffect(() => {
        if (!router?.isReady) return
        const init = async () => {
            store.get.paginate({ size: 10, page: 0, ...(user_id == 'undefined' ? {} : { user_id }) } as any)

            userStore.get.paginate({ size: 10, page: 0 })
        }
        init()
    }, [router?.isReady, user_id])




    const columns: GridColDef[] = [
        ...defaultColumns,

    ]

    // const onSubmit = async () => {
    //     const bodyData = getValues() as any
    //     console.log("🚀 ~ onSubmit ~ bodyData:", bodyData)

    //     let _benefits = benefits.filter(f => f)

    //     if (!_benefits.length) return;
    //     bodyData.benefits = _benefits;

    //     await store.add(bodyData)
    //     handleEditClose()
    // }

    // const [competition_team_ids, set_competition_team_ids] = useState([
    //     {
    //         competition_id: null,
    //         team_id: null
    //     }
    // ])



    return (
        <DatePickerWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <h3>List History QR</h3>

                    <Card>
                        <Box
                            sx={{
                                p: 5,
                                pb: 3,
                                maxWidth: '400px',
                                width: '100%',
                            }}
                        >
                            <Autocomplete
                                size="small"
                                options={userStore.astrologer.list}

                                getOptionLabel={(option) => option.name || ''}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                onChange={(e, value) => {
                                    // store.get.paginate({ user_id: value?._id })
                                    if (value?._id) {
                                        router.push(`/apps/qr/history/list?user_id=${value?._id}`)
                                    } else {
                                        router.push(`/apps/qr/history/list`)

                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Search User" variant="outlined" />
                                )}
                            />
                            {/* {write && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <TextField
                                        size='small'
                                        sx={{ mr: 4, mb: 2 }}
                                        placeholder={`Search ${page_title}`}
                                        onChange={e => handleFilter(e.target.value)}
                                    />

                                </Box>
                            )} */}
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
                                store.get.paginate({ page: page + 1, size: pageSize })
                            }}
                            onColumnOrderChange={e => {
                                console.log('e: ', e)
                            }}
                            rowCount={store.history.total}
                        />
                    </Card>

                </Grid>
            </Grid>
        </DatePickerWrapper>
    )
}
PlanList.moduleId = 6
PlanList.gameIds = [1, 2]
export default PlanList


