import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { QrService } from 'src/api/AdminApi'
import { Box, Grid, Typography, CircularProgress, Paper } from '@mui/material'
import { getPublicUrl } from 'src/helpers/common'
import { styled } from '@mui/material/styles'
import Link from 'next/link';
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

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
import Icon from 'src/@core/components/icon'

export default function QRViewPage() {
  const router = useRouter()
  const { id } = router.query

  const [qrData, setQrData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const LinkStyled = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.primary.main
  }))
  useEffect(() => {
    if (id) {
      fetchQRDetails(id)
    }
  }, [id])

  const fetchQRDetails = async (_id: string | string[]) => {
    setLoading(true)
    try {
      const res = await QrService.detail({
        query: { id: _id as string }
      });      
      setQrData(res?.data)
    } catch (err: any) {
      console.error('Fetch error:', err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    )
  }

  if (!qrData) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography>No QR data found</Typography>
      </Box>
    )
  }

  const handlePrint = () => {
    // Create a print-friendly content for QR codes
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (printWindow) {
      const content = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .qr-container { display: flex; flex-wrap: wrap; justify-content: space-around; }
              .qr-item { margin: 10px; text-align: center; }
              img { width: 200px; height: auto; border-radius: 8px; }
            </style>
          </head>
          <body>
            <h1 style="text-align:center;">QR Codes</h1>
            <div class="qr-container">
              ${qrData.map((row: any) => `
                <div class="qr-item">
                  <img src="${getPublicUrl(row.url, "qr/")}" alt="${row.code}" />
                  <p>${row.code}</p>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };
  

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        QR Detail View
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Tooltip title={`Print All QR`}>
          <IconButton size="small">
            <Icon icon="mdi:printer" fontSize={50} onClick={handlePrint}/>
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {qrData.map((row:any) => (
          <Grid item xs={12} sm={6} md={4} key={row.id}>
            <Paper elevation={2} style={{ padding: 16 }}>
              <LinkStyled href={getPublicUrl(row.url, "qr/") + ""} target='_blank' onClick={e => { }} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                <img src={getPublicUrl(row.url, "qr/")}
                  alt={row.code}
                  style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                />
              </LinkStyled>
              <Typography variant="subtitle2"
              style={{ fontSize: '30px' }}
              >{row.code}</Typography>
              <Typography></Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
