import {
  Box,
  Button,
  createTheme,
  Divider,
  Grid,
  Paper,
  responsiveFontSizes,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  Autocomplete
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '~/utils/axiosInstance'
import CustomSnackbar from '~/components/Layout/component/CustomSnackbar'

let theme = createTheme()
theme = responsiveFontSizes(theme)

function UserCreate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    login: '',
    fullName: '',
    email: '',
    langKey: 'en',
    cccd: '',
    address: '',
    dob: '',
    phoneNumber: '',
    authorities: [],
    imageDigitalSignature: null // Chỉ lưu file, không lưu base64
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const rolesOptions = ['ROLE_MANAGER', 'ROLE_USER']

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [navigatePath, setNavigatePath] = useState('')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file)) // Tạo URL để preview ảnh
      setFormData({ ...formData, imageDigitalSignature: file }) // Lưu file vào formData
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Chuẩn bị FormData
      const data = new FormData()
      data.append('login', formData.login)
      data.append('fullName', formData.fullName)
      data.append('email', formData.email)
      data.append('langKey', formData.langKey)
      data.append('cccd', formData.cccd)
      data.append('address', formData.address)
      data.append('dob', formData.dob)
      data.append('phoneNumber', formData.phoneNumber)
      formData.authorities.forEach((role) => data.append('authorities', role))
      if (formData.imageDigitalSignature) {
        data.append('imageDigitalSignature', formData.imageDigitalSignature) // Đính kèm file
      }

      // Gửi API
      await axiosInstance
        .post('/admin/users', data, {
          headers: {
            'Content-Type': 'multipart/form-data' // Cần header này để gửi FormData
          }
        })
        .then(() => {
          setAlertSeverity('success')
          setAlertText('Tạo tài khoản thành công')
          setNavigatePath('/admin/users') // Đường dẫn chuyển hướng sau khi thành công
        })
        .catch((error) => {
          setAlertSeverity('error')
          setAlertText(error.response.data.fieldErrors[0].message)
          console.error('Error creating user:', error.response)
        })
    } catch (error) {
      setAlertSeverity('error')
      // setAlertText(error)
      console.error('Error creating user:', error.response)
    } finally {
      setSnackbarOpen(true)
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Typography variant="h2" gutterBottom>
          Tạo Người Dùng Mới
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên đăng nhập"
                fullWidth
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ Tên"
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                type="tel"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CCCD"
                fullWidth
                value={formData.cccd}
                onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Địa chỉ"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày sinh"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={rolesOptions}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, authorities: newValue })
                }}
                renderInput={(params) => <TextField {...params} label="Chọn quyền" />}
              />
            </Grid>
            <Grid item xs={12} sm={12} container justifyContent="center">
              {/* <Typography variant="subtitle1" gutterBottom>
                Tải chữ kí dạng ảnh
              </Typography> */}
              <Stack direction="row" spacing={2} alignItems="center">
                <label htmlFor="raised-button-file">
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <Button variant="contained" component="span">
                    Chọn chữ kí
                  </Button>
                </label>
                {imagePreview && (
                  <Box
                    component="img"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover'
                    }}
                    src={imagePreview}
                    alt="Chữ kí"
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                sx={{
                  width: '150px',
                  color: '#B7272D',
                  borderColor: '#B7272D',
                  '&:hover': {
                    borderColor: '#7A1A1E',
                    color: '#7A1A1E'
                  }
                }}
                onClick={() => navigate('/admin/users')}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                sx={{
                  width: '150px',
                  bgcolor: '#B7272D',
                  '&:hover': {
                    bgcolor: '#7A1A1E'
                  }
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                Tạo người dùng
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={alertText}
        severity={alertSeverity}
        navigatePath={navigatePath}
      />
    </ThemeProvider>
  )
}

export default UserCreate
