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

let theme = createTheme()
theme = responsiveFontSizes(theme)

function UserCreate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    imageUrl: '',
    langKey: 'en',
    cccd: '',
    address: '',
    dob: '',
    authorities: []
  })
  const [loading, setLoading] = useState(false)

  // Các quyền (roles) có thể chọn
  const rolesOptions = ['ROLE_MANAGER', 'ROLE_USER']

  // Xử lý sự kiện submit form
  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Chuẩn bị dữ liệu để gửi
      const requestBody = {
        ...formData,
        authorities: formData.authorities.map((role) => role)
      }

      // Gọi API tạo user
      await axiosInstance
        .post('/admin/users', requestBody)
        .then(() => {
          navigate('/admin/users')
        })
        .catch((error) => {
          console.error('Error creating user:', error)
        })
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
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
            {/* Form thông tin người dùng */}
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
                label="Số điện thoại"
                type="tel"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Họ Tên"
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
            <Grid item xs={12}>
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
          </Grid>

          {/* Nút hành động */}
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
    </ThemeProvider>
  )
}

export default UserCreate
