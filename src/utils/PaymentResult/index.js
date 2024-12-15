import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const PaymentResult = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const responseCode = searchParams.get('vnp_ResponseCode')
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [alertSeverity, setAlertSeverity] = React.useState('info')
  const [alertText, setAlertText] = React.useState('')

  useEffect(() => {
    if (responseCode) {
      if (responseCode === '00') {
        setAlertSeverity('success')
        setAlertText('Thanh toán thành công!')
      } else {
        setAlertSeverity('error')
        setAlertText('Thanh toán thất bại. Vui lòng thử lại.')
      }

      // Mở popup thông báo
      setSnackbarOpen(true)

      // Lấy URL trước khi thanh toán từ Local Storage
      const previousPage = localStorage.getItem('previousPage')
      if (previousPage) {
        // Quay lại trang trước đó sau 2 giây
        setTimeout(() => {
          localStorage.removeItem('previousPage') // Xóa thông tin
          window.location.href = previousPage // Quay lại trang trước
        }, 3000)
      }
    }
  }, [responseCode, navigate])

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alertSeverity} onClose={() => setSnackbarOpen(false)}>
          {alertText}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PaymentResult
