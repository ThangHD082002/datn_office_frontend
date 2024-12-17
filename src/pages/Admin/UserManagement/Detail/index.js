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
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '~/utils/axiosInstance'

let theme = createTheme()
theme = responsiveFontSizes(theme)

function UserDetail() {
  const navigate = useNavigate()
  const { uid } = useParams()
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
    imageDigitalSignature: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false) // Trạng thái chỉnh sửa
  const rolesOptions = ['ROLE_MANAGER', 'ROLE_USER']

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(`admin/users/${uid}`)
        const userData = response.data
        console.log("DETAIL-USER")
        console.log(response.data)
        setFormData({
          login: userData.login,
          fullName: userData.fullName,
          email: userData.email,
          langKey: userData.langKey || 'en',
          cccd: userData.cccd || '',
          address: userData.address || '',
          dob: userData.dob || '',
          phoneNumber: userData.phoneNumber || '',
          authorities: userData.authorities || [],
          signImage: userData.signImage || null
        })
        // Nếu user có ảnh chữ ký (URL), hiển thị preview
        if (userData.signImage) {
          setImagePreview(userData.signImage)
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetail()
  }, [uid])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      setFormData({ ...formData, imageDigitalSignature: file })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

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
        data.append('imageDigitalSignature', formData.imageDigitalSignature)
      }

      await axiosInstance.put(`/admin/users/${uid}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('User details updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user details:', error)
      alert('Failed to update user details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Typography variant="h2" gutterBottom>
          {isEditing ? 'Edit User Details' : 'User Details'}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Tên đăng nhập" fullWidth value={formData.login} disabled={!isEditing} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ Tên"
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CCCD"
                fullWidth
                value={formData.cccd}
                onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Địa chỉ"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={rolesOptions}
                getOptionLabel={(option) => option}
                value={formData.authorities}
                onChange={(event, newValue) => setFormData({ ...formData, authorities: newValue })}
                renderInput={(params) => <TextField {...params} label="Chọn quyền" />}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={12} container justifyContent="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <label htmlFor="raised-button-file">
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleImageUpload}
                    disabled={!isEditing}
                  />
                  <Button variant="contained" component="span" disabled={!isEditing}>
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
              {isEditing ? (
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
                  Lưu
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    width: '150px',
                    bgcolor: '#B7272D',
                    '&:hover': {
                      bgcolor: '#7A1A1E'
                    }
                  }}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}

export default UserDetail
