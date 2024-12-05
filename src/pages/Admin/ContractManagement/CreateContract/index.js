import classNames from 'classnames/bind'
import styles from './CreateContract.module.scss'

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
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

  const handleChange = (event) => {
    setAge(event.target.value)
  }

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
    const typeContractInt = parseInt(typeContract, 10);
    console.log("TypeINT")
    console.log(typeContractInt)
    axiosInstance
      .post('/contract/save', {
        request: {
          offices: listOffice,
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

  return (
    <div className={cx('container-create')}>
      <div className={cx('header')}>
        <h1 className={cx('j')}>Create Contract</h1>
      </div>
      <div className={cx('body')}>
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 6, ml: 7, width: '50ch' } }}
          noValidate
          autoComplete="off"
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2, // Khoảng cách giữa các FormControl
              marginTop: '50px',
              marginLeft: "60px"
            }}
          >
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel id="demo-simple-select-label">DS Phòng</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="DS Phòng"
                onChange={handleChange}
              >
                {listOffice.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel id="duration-select-label">Chọn thời hạn</InputLabel>
              <Select
                labelId="duration-select-label"
                id="duration-select"
                value={typeContract}
                onChange={handleChangeTypeContract}
                label="Chọn thời hạn"
              >
                <MenuItem value="2">Ngắn hạn</MenuItem>
                <MenuItem value="1">Dài hạn</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          component="form"
          sx={{
            marginLeft: '60px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .MuiTextField-root': { mt: 2 , width: '30ch' }
          }}
          noValidate
          autoComplete="off"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                value={startDate ? dayjs(startDate) : null}
                onChange={handleChangeStartDate}
                label="Thời gian bắt đầu"
                sx={{
                  '& .MuiInputBase-root': { fontSize: '16px' }, // Kích thước chữ của phần input
                  '& .MuiInputLabel-root': { fontSize: '16px' }, // Kích thước chữ của label
                  '& .MuiSvgIcon-root': { fontSize: '20px' } // Kích thước biểu tượng lịch
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                value={endDate ? dayjs(endDate) : null}
                onChange={handleChangeEndDate}
                label="Thời gian kết thúc"
                sx={{
                  '& .MuiInputBase-root': { fontSize: '16px' }, // Kích thước chữ của phần input
                  '& .MuiInputLabel-root': { fontSize: '16px' }, // Kích thước chữ của label
                  '& .MuiSvgIcon-root': { fontSize: '20px' } // Kích thước biểu tượng lịch
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                value={handoverDate ? dayjs(handoverDate) : null}
                onChange={handleChangeHandOverDate}
                label="Thời gian bàn giao"
                sx={{
                  '& .MuiInputBase-root': { fontSize: '16px' }, // Kích thước chữ của phần input
                  '& .MuiInputLabel-root': { fontSize: '16px' }, // Kích thước chữ của label
                  '& .MuiSvgIcon-root': { fontSize: '20px' } // Kích thước biểu tượng lịch
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { mt: 6, ml: 7, width: 'calc(50% - 12px)' }, // Đảm bảo cả 2 TextField chiếm 50% chiều rộng
            display: 'flex', // Sử dụng flex để căn chỉnh các phần tử theo hàng ngang
            justifyContent: 'space-between', // Giữa các TextField có khoảng cách
            gap: 2 // Khoảng cách giữa các TextField
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-required"
            label="Thời hạn"
            onChange={handleChangeDuration}
            value={duration}
            defaultValue=""
            sx={{
              // Điều chỉnh kích thước của thẻ TextField
              width: 'calc(50% - 12px)', // Đảm bảo thẻ chiếm 50% chiều rộng của Box
              // Điều chỉnh kích thước của label
              '& .MuiInputLabel-root': { fontSize: '18px' },
              // Điều chỉnh kích thước của value
              '& .MuiInputBase-input': { fontSize: '16px' },
              height: '0px'
            }}
          />
          <TextField
            id="outlined-required"
            label="Tiền đặt cọc"
            onChange={handleChangeDepositAmount}
            value={depositAmount}
            defaultValue=""
            sx={{
              // Điều chỉnh kích thước của thẻ TextField
              width: 'calc(50% - 12px)', // Đảm bảo thẻ chiếm 50% chiều rộng của Box
              // Điều chỉnh kích thước của label
              '& .MuiInputLabel-root': { fontSize: '18px' },
              // Điều chỉnh kích thước của value
              '& .MuiInputBase-input': { fontSize: '16px' },
              height: '0px'
            }}
          />
        </Box>
        <Box
          component="form"
          sx={{
            display: 'flex', // Để các thẻ TextField nằm ngang
            justifyContent: 'space-between', // Khoảng cách đều giữa các thẻ TextField
            gap: 2, // Khoảng cách giữa các thẻ
            '& .MuiTextField-root': {
              mt: 10,
              ml: 7,
              width: 'calc(50% - 12px)'
            } // Mỗi TextField chiếm 50% chiều rộng của Box
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-required"
            label="Mục đích thuê"
            onChange={handleChangeRentalPurpose}
            value={rentalPurpose}
            defaultValue=""
            sx={{
              // Điều chỉnh kích thước của thẻ TextField
              width: '100%', // Đảm bảo chiếm hết 50% chiều rộng của Box
              // Điều chỉnh kích thước của label
              '& .MuiInputLabel-root': { fontSize: '18px' },
              // Điều chỉnh kích thước của value
              '& .MuiInputBase-input': { fontSize: '16px' },
              marginTop: '50px',
              height: '0px'
            }}
          />
          <TextField
            id="outlined-required"
            label="Chu kì đóng tiền"
            onChange={handleChangePaymentFrequency}
            value={paymentFrequency}
            defaultValue=""
            sx={{
              // Điều chỉnh kích thước của thẻ TextField
              width: '100%', // Đảm bảo chiếm hết 50% chiều rộng của Box
              // Điều chỉnh kích thước của label
              '& .MuiInputLabel-root': { fontSize: '18px' },
              // Điều chỉnh kích thước của value
              '& .MuiInputBase-input': { fontSize: '16px' }
            }}
          />
        </Box>

        <Button
          onClick={SubmitCreateContract}
          variant="contained"
          sx={{
            fontSize: '16px', // Kích thước chữ
            padding: '10px 20px', // Padding cho nút
            width: '170px', // Chiều rộng của nút (tuỳ chọn)
            height: '40px',
            position: 'absolute',
            right: '20px', // Chiều cao của nút (tuỳ chọn)
            bottom: '-50px'
          }}
        >
          TẠO HỢP ĐỒNG
        </Button>
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
