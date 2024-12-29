import styles from './ForgotPassword.module.scss'
import classNames from 'classnames/bind'

import { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Typography,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import CustomSnackbar from '~/components/Layout/component/CustomSnackbar'
import { axiosInstance } from '~/utils/axiosInstance'
const cx = classNames.bind(styles)

const steps = [
  {
    label: 'Nhập email bạn đã đăng kí',
    description: `Vui lòng nhập email bạn đã sử dụng để đăng ký tài khoản.`
  },
  {
    label: 'Nhập mã OTP gửi về email của bạn',
    description: 'Nhập mã OTP được gửi qua email của bạn để xác thực.'
  },
  {
    label: 'Thực hiện tạo mật khẩu mới',
    description: `Vui lòng nhập mật khẩu mới cho tài khoản của bạn.`
  }
]

function ForgotPassword() {
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [navigatePath, setNavigatePath] = useState('')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleNext = () => {
    if (activeStep == 0) {
      axiosInstance
        .post('/account/reset-password/init', {
          mail: email
        })
        .then((response) => {
          console.log('INFOR')
          console.log(response)
          setAlertSeverity('success')
          setAlertText(response.data.message)
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
        })
        .catch((error) => {
          console.error('Error:', error)
          setAlertSeverity('error')
          setAlertText(error.response.data.message)
        })
        .finally(() => {
          setSnackbarOpen(true)
        })
    } else if (activeStep == 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    } else {
      axiosInstance
        .post('/account/reset-password/finish', {
          key: otp,
          newPassword: password
        })
        .then((response) => {
          console.log('INFOR')
          console.log(response)
          setAlertSeverity('success')
          setAlertText(response.data.message)
          setNavigatePath('/login')
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
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
  }
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)
  const handleReset = () => {
    setActiveStep(0)
    setEmail('')
    setOtp('')
    setPassword('')
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className={cx('modal')}>
      <div className={cx('login-container')}>
        <Typography variant="h4" gutterBottom sx={{ marginLeft: '40px', marginTop: '20px', fontWeight: 'bold' }}>
          Thực hiện theo hướng dẫn để lấy lại mật khẩu
        </Typography>
        <Box sx={{ maxWidth: 500, marginLeft: '60px', marginTop: '20px' }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={index === steps.length - 1 ? <Typography variant="caption">Last step</Typography> : null}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {index === 0 && (
                      <TextField
                        label="Email"
                        type="text"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                    {index === 1 && (
                      <TextField
                        label="OTP"
                        type="text"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    )}
                    {index === 2 && (
                      <TextField
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          )
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                      {index === steps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
                    </Button>
                    <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Trở lại
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </Box>
      </div>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={alertText}
        severity={alertSeverity}
        navigatePath={navigatePath}
      />
    </div>
  )
}

export default ForgotPassword
