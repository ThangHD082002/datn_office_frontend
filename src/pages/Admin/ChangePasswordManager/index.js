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
    IconButton,
    InputAdornment,
    Typography
  } from '@mui/material'
  import { Visibility, VisibilityOff } from '@mui/icons-material'
  import { useState, useEffect } from 'react'
  import { useNavigate, useParams } from 'react-router-dom'
  import { axiosInstance } from '~/utils/axiosInstance'
  import CustomSnackbar from '~/components/Layout/component/CustomSnackbar'
  
  let theme = createTheme()
  theme = responsiveFontSizes(theme)
  
  function ChangePasswordManager() {
    const navigate = useNavigate()
    const { uid } = useParams()
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
  
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
  
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [alertText, setAlertText] = useState('')
    const [alertSeverity, setAlertSeverity] = useState('success')
    const [navigatePath, setNavigatePath] = useState('')
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false)
    }
  
    const handleEdit = () => setIsEditing(true)
  
    const handleSubmit = () => {
      console.log('CUR')
      console.log(currentPassword)
      console.log('NEW')
      console.log(newPassword)
  
      axiosInstance
        .post('/account/change-password', {
          currentPassword: currentPassword,
          newPassword: newPassword
        })
        .then((response) => {
          console.log('INFOR')
          console.log(response)
          setAlertSeverity('success')
          setAlertText(response.data.message)
          setNavigatePath('/') // Đường dẫn chuyển hướng sau khi thành công
        })
        .catch((error) => {
          console.error('Error:', error)
          setAlertSeverity('error')
          setAlertText(error.response.data.message)
        })
        .finally(() => {
          setSnackbarOpen(true)
        })
    }
  
    const handleToggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword)
    const handleToggleNewPassword = () => setShowNewPassword(!showNewPassword)
  
    return (
      <ThemeProvider theme={theme}>
          <Typography variant="h2" gutterBottom sx = {{color: 'black', marginLeft: '390px', marginTop: '20px'}}>
            Thay đổi mật khẩu
          </Typography>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
          <Divider sx={{ mb: 3 }} />
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  disabled={!isEditing}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleToggleCurrentPassword} edge="end">
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  disabled={!isEditing}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleToggleNewPassword} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
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
  
  export default ChangePasswordManager
  