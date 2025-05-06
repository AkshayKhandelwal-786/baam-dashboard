// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'
import dayjs from 'dayjs'

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
        flex: 0.1,
        field: 'image',
        minWidth: 80,
        headerName: 'Image',
        renderCell: ({ row }: CellType) => (
            <LinkStyled href={getPublicUrl(row.image) + ""} target='_blank'>
                <Avatar alt='' src={'' + getPublicUrl(row.image)} sx={{ mr: 3 }} />
            </LinkStyled>
        ),
    },
    // {
    //     flex: 0.2,
    //     field: 'qr',
    //     minWidth: 90,
    //     headerName: 'QR Code',
    //     renderCell: ({ row }: CellType) => (
    //         <LinkStyled href={getPublicUrl(row.qr) + ""} target='_blank'>
    //             <Avatar alt='' src={'' + getPublicUrl(row.qr)} sx={{ mr: 3 }} />
    //         </LinkStyled>
    //     ),
    // },
    {
        flex: 0.15,
        field: 'title',
        minWidth: 100,
        headerName: 'Title',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.reward?.title}</Typography>,
    },
    {
        flex: 0.15,
        field: 'label',
        minWidth: 100,
        headerName: 'Label',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.reward?.label}</Typography>,
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
        field: 'details',
        minWidth: 150,
        headerName: 'Details',
        renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.reward?.details}</Typography>,
    },
    {
        flex: 0.15,
        field: 'createdAt',
        minWidth: 150,
        headerName: 'Expires At',
        renderCell: ({ row }: CellType) => (
            <Typography variant='body2'>
              {dayjs(row.createdAt).format('DD MMM YYYY')}
            </Typography>
        )
    },
    {
        flex: 0.2,
        field: 'status',
        minWidth: 100,
        headerName: 'Status',
        renderCell: ({ row }: any) => <Typography variant='body2'>{row?.status}</Typography>,
    },
];




const PlanList = ({ read, write, update, del }: GlobalProps) => {
    const page_title = 'Reward History'

    // ** State
    const [openEdit, setOpenEdit] = useState<boolean>(false)

    // ** Hooks
    const store = useRewardHistoryStore()
    const userStore = useUserStore()

    const router = useRouter()
    const { keyword } = router.query

    useEffect(() => {
        if (!router?.isReady) return
        const init = async () => {
            store.get.paginate({ size: 10, page: 0, ...(keyword == 'undefined' ? {} : { keyword }) } as any)
            store.get.paginate({ size: 10, page: 0 })
        }
        init()
    }, [router?.isReady, keyword])

    const columns: GridColDef[] = [
        ...defaultColumns,

    ]


    return (
        <DatePickerWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <h3>List Reward History</h3>
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
                                            router.push(`/apps/reward/history/list/?keyword=${encodeURIComponent(searchValue)}`)
                                            } else {
                                            router.push(`/apps/reward/history/list/`)
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

                </Grid>
            </Grid>
        </DatePickerWrapper>
    )
}
PlanList.moduleId = 6
PlanList.gameIds = [1, 2]
export default PlanList


