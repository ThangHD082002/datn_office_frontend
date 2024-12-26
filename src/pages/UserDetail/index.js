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
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '~/utils/axiosInstance'
import CustomSnackbar from '~/components/Layout/component/CustomSnackbar'

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
    imageSign: null,
    imageAvatar: null
  })
  const [imageSignPreview, setImageSignPreview] = useState(null)
  const [imageAvatarPreview, setImageAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [navigatePath, setNavigatePath] = useState('')

  const handleSnackbarClose = () => setSnackbarOpen(false)

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/account`)
        const userData = response.data
        setFormData({
          login: userData.result.login,
          fullName: userData.result.fullName,
          email: userData.result.email,
          langKey: userData.result.langKey || 'en',
          cccd: userData.result.cccd || '',
          address: userData.result.address || '',
          dob: userData.result.dob || '',
          phoneNumber: userData.result.phoneNumber || '',
          imageSign: userData.result.signImage || null,
          imageAvatar: userData.result.imageAvatar || null
        })
        if (userData.result.signImage) setImageSignPreview(userData.result.signImage)
        if (userData.result.imageAvatar) setImageAvatarPreview(userData.result.imageAvatar)
      } catch (error) {
        console.error('Error fetching user details:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserDetail()
  }, [uid])

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      if (type === 'imageSign') {
        setImageSignPreview(URL.createObjectURL(file))
        setFormData({ ...formData, imageSign: file })
      } else if (type === 'imageAvatar') {
        setImageAvatarPreview(URL.createObjectURL(file))
        setFormData({ ...formData, imageAvatar: file })
      }
    }
  }

  const handleEdit = () => setIsEditing(true)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const data = new FormData()
      data.append('id', localStorage.getItem('id_user'))
      data.append('login', formData.login)
      data.append('fullName', formData.fullName)
      data.append('email', formData.email)
      data.append('langKey', formData.langKey)
      data.append('cccd', formData.cccd)
      data.append('address', formData.address)
      data.append('dob', formData.dob)
      data.append('phoneNumber', formData.phoneNumber)
      if (formData.imageSign) data.append('imageSign', formData.imageSign)
      if (formData.imageAvatar) data.append('imageAvatar', formData.imageAvatar)

      await axiosInstance.put(`/account/update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setAlertSeverity('success')
      setAlertText('Cập nhật thông tin thành công')
      setNavigatePath(`/user-infor/${uid}`)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user details:', error)
      setAlertSeverity('error')
      setAlertText(error.response?.data?.message || 'Cập nhật thông tin thất bại')
    } finally {
      setSnackbarOpen(true)
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Typography variant="h2" gutterBottom>
          {isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin người dùng'}
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
                fullWidth
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
                label="Ngày sinh"
                type="date"
                fullWidth
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Địa chỉ"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                justifyContent="center"
                sx={{
                  mt: 2,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  bgcolor: '#f9f9f9'
                }}
              >
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Chữ ký điện tử
                  </Typography>
                  <label htmlFor="sign-upload">
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="sign-upload"
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'imageSign')}
                      disabled={!isEditing}
                    />
                    <Button variant="contained" component="span" disabled={!isEditing}>
                      Chọn chữ ký
                    </Button>
                  </label>
                  {imageSignPreview && (
                    <Box
                      component="img"
                      src={imageSignPreview}
                      alt="Chữ ký"
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '8px',
                        objectFit: 'cover',
                        mt: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  )}
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Ảnh đại diện
                  </Typography>
                  <label htmlFor="avatar-upload">
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="avatar-upload"
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'imageAvatar')}
                      disabled={!isEditing}
                    />
                    <Button variant="contained" component="span" disabled={!isEditing}>
                      Thay đổi ảnh
                    </Button>
                  </label>
                  {imageAvatarPreview && (
                    <Box
                      component="img"
                      src={imageAvatarPreview}
                      alt="Ảnh đại diện"
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        mt: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  )}
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/user-infor/${uid}`)}
              sx={{
                color: '#B7272D',
                borderColor: '#B7272D',
                '&:hover': { color: '#7A1A1E', borderColor: '#7A1A1E' }
              }}
            >
              Quay lại
            </Button>
            {isEditing ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ bgcolor: '#B7272D', '&:hover': { bgcolor: '#7A1A1E' } }}
              >
                Lưu
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleEdit}
                sx={{ bgcolor: '#B7272D', '&:hover': { bgcolor: '#7A1A1E' } }}
              >
                Chỉnh sửa
              </Button>
            )}
          </Stack>
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

export default UserDetail
