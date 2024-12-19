import classNames from 'classnames/bind'
import styles from './CreateContract.module.scss'

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { axiosInstance } from '~/utils/axiosInstance'
import { Grid,Autocomplete, FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material'

import CustomSnackbar from '~/components/Layout/component/CustomSnackbar'

const cx = classNames.bind(styles)

function CreateContract() {
  const { cid } = useParams()
  const [codeContract, setCodeContract] = useState('')
  const [listOffice, setListOffice] = useState([])
  const [tenantId, setTenantId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [duration, setDuration] = useState('')
  const [depositAmount, setDepositAmount] = useState()
  const [paymentFrequency, setPaymentFrequency] = useState()
  const [handoverDate, setHandoverDate] = useState('')
  const [rentalPurpose, setRentalPurpose] = useState('')
  const navigate = useNavigate()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [navigatePath, setNavigatePath] = useState('')

  const [typeContract, setTypeContract] = useState('')
  const [orderRooms, setOrderRooms] = useState([])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  let token = localStorage.getItem('authToken')
  useEffect(() => {
    axiosInstance
      .get(`/requests/${cid}`)
      .then((response) => {
        console.log(response)
        const ids = response.data.officeDTOs.map((office) => office.id)
        setListOffice(ids)
        setTenantId(response.data.userId)
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Chuyển đến trang /error-token nếu mã lỗi là 401 Unauthorized
          window.location.href = '/error-token'
        }
      })
      .finally(() => {
        // Always executed
      })
  }, [])

  console.log(listOffice)

  const [age, setAge] = useState('')

  // const handleChange = (event) => {
  //   setAge(event.target.value)
  // }

  const handleChangeContractCodeChange = (event) => {
    setCodeContract(event.target.value)
  }
  const handleChangeDuration = (event) => {
    setDuration(event.target.value)
  }
  const handleChangeRentalPurpose = (event) => {
    setRentalPurpose(event.target.value)
  }
  const handleChangePaymentFrequency = (event) => {
    setPaymentFrequency(event.target.value)
  }
  const handleChangeTypeContract = (event) => {
    setTypeContract(event.target.value)
  }

  const handleChangeStartDate = (newDate) => {
    setStartDate(dayjs(newDate).format('YYYY-MM-DD')) // Định dạng lại theo ý muốn, ví dụ 'YYYY-MM-DD'
  }
  const handleChangeEndDate = (newDate) => {
    setEndDate(dayjs(newDate).format('YYYY-MM-DD')) // Định dạng lại theo ý muốn, ví dụ 'YYYY-MM-DD'
  }
  const handleChangeHandOverDate = (newDate) => {
    setHandoverDate(dayjs(newDate).format('YYYY-MM-DD')) // Định dạng lại theo ý muốn, ví dụ 'YYYY-MM-DD'
  }

  const handleChangeDepositAmount = (event) => {
    setDepositAmount(event.target.value)
  }

  const SubmitCreateContract = () => {
    const typeContractInt = parseInt(typeContract, 10)
    console.log('TypeINT')
    console.log(typeContractInt)
    axiosInstance
      .post('/contract/save', {
        request: {
          offices: orderRooms,
          tenantId: tenantId
        },
        startDate: startDate, // ngày bắt đầu thuê
        endDate: endDate, // ngày kết thúc
        duration: duration, // thời hạn
        depositAmount: depositAmount, // tiền đặt cọc
        paymentFrequency: paymentFrequency, // chu kỳ đóng tiền
        contractType: typeContractInt, // loại hợp đồng
        handoverDate: handoverDate, // ngày bàn giao mặt bằng
        rentalPurpose: rentalPurpose // mục đích thuê
      })
      .then((response) => {
        console.log('STATE REQUEST')
        console.log(response)
        setAlertSeverity('success')
        setAlertText('Tạo hợp đồng thành công')
        setNavigatePath('/admin/contracts') // Đường dẫn chuyển hướng sau khi thành công
        // navigate("/admin/contracts");
      })
      .catch((error) => {
        console.error('Error:', error)
        setAlertSeverity('error')
        setAlertText('Hệ thống đang bị lỗi')
      })
      .finally(() => {
        console.log('Request completed.')
        setSnackbarOpen(true)
      })
  }

  console.log('orderRooms')
  console.log(orderRooms)
  return (
<div className={cx('container-create')}>
  <div className={cx('header')}>
    <h1 className={cx('j')}>Create Contract</h1>
  </div>
  <div className={cx('body')}>
    <Box
      component="form"
      sx={{
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: 3, // Khoảng cách giữa nội dung và viền
        borderRadius: 2, // Bo góc cho box
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow cho box
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container spacing={2} sx={{ justifyContent: 'center', width: '100%' }}>
        {/* Phần Chọn Phòng */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            multiple
            options={listOffice}
            value={orderRooms}
            onChange={(event, newValue) => setOrderRooms(newValue)}
            renderInput={(params) => <TextField {...params} label="Chọn phòng" sx={{ width: '100%' }} />}
          />
        </Grid>
        
        {/* Phần Chọn Thời Hạn */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="duration-select-label">Chọn thời hạn</InputLabel>
            <Select
              labelId="duration-select-label"
              id="duration-select"
              value={typeContract}
              onChange={handleChangeTypeContract}
              label="Chọn thời hạn"
              sx={{ width: '100%' }}
            >
              <MenuItem value="2">Ngắn hạn</MenuItem>
              <MenuItem value="1">Dài hạn</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Phần Chọn Ngày */}
      <Grid container spacing={2} sx={{ justifyContent: 'center', width: '100%', marginTop: 4 }}>
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={startDate ? dayjs(startDate) : null}
              onChange={handleChangeStartDate}
              label="Thời gian bắt đầu"
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={endDate ? dayjs(endDate) : null}
              onChange={handleChangeEndDate}
              label="Thời gian kết thúc"
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={handoverDate ? dayjs(handoverDate) : null}
              onChange={handleChangeHandOverDate}
              label="Thời gian bàn giao"
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Phần Nhập Thông Tin Hợp Đồng */}
      <Grid container spacing={2} sx={{ justifyContent: 'center', width: '100%', marginTop: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Thời hạn"
            onChange={handleChangeDuration}
            value={duration}
            sx={{ width: '100%' }} // Điều chỉnh chiều rộng của ô input
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Tiền đặt cọc"
            onChange={handleChangeDepositAmount}
            value={depositAmount}
            sx={{ width: '100%' }} // Điều chỉnh chiều rộng của ô input
          />
        </Grid>
      </Grid>

      {/* Phần Mục Đích và Chu Kỳ */}
      <Grid container spacing={2} sx={{ justifyContent: 'center', width: '100%', marginTop: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Mục đích thuê"
            onChange={handleChangeRentalPurpose}
            value={rentalPurpose}
            sx={{ width: '100%' }} // Điều chỉnh chiều rộng của ô input
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Chu kì đóng tiền"
            onChange={handleChangePaymentFrequency}
            value={paymentFrequency}
            sx={{ width: '100%' }} // Điều chỉnh chiều rộng của ô input
          />
        </Grid>
      </Grid>

      {/* Nút Submit */}
      <Button
        onClick={SubmitCreateContract}
        variant="contained"
        sx={{
          fontSize: '16px',
          padding: '10px 20px',
          width: '170px',
          height: '40px',
          marginTop: 4
        }}
      >
        TẠO HỢP ĐỒNG
      </Button>
    </Box>

    <CustomSnackbar
      open={snackbarOpen}
      onClose={handleSnackbarClose}
      message={alertText}
      severity={alertSeverity}
      navigatePath={navigatePath}
    />
  </div>
</div>
  )
}

export default CreateContract
