import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { axiosInstance } from '~/utils/axiosInstance'
import CustomSnackbar from '~/components/Layout/component/CustomSnackbar'
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  Pagination
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const options = [
  { value: 'Chưa thanh toán', color: '#fff3cd' }, // Vàng
  { value: 'Đã thanh toán', color: '#32CD32' } // Xanh lá
]

const Payment = () => {
  const [selectedOption, setSelectedOption] = useState('')
  const [allPayments, setAllPayments] = useState([])
  const [payments, setPayments] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalData, setModalData] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  let cid = localStorage.getItem('id_user')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [navigatePath, setNavigatePath] = useState('')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleChange = (event) => {
    setSelectedOption(event.target.value)
  }

  useEffect(() => {
    let mid = localStorage.getItem('id_user')
    axiosInstance
      .post('/contract', {
        pageNumber: 0,
        pageSize: 30,
        filter: [
          {
            operator: '=',
            key: 'tenant',
            value: mid,
            otherValue: null,
            valueSelected: null
          }
        ],
        sortProperty: 'contract.lastModifiedDate',
        sortOrder: 'DESC',
        buildingIds: []
      })
      .then((response) => {
        console.log('PAYMENTSS')
        console.log(response)
        const data = response.data.data
        setAllPayments(data)
        setTotalPages(Math.ceil(data.length / 5)) // Phân trang, mỗi trang 5 dòng
        setPage(1) // Đặt lại trang về 1 khi có dữ liệu mới
        setPayments(data.slice(0, 5)) // Lấy dữ liệu của trang đầu tiên
      })
      .catch((error) => {
        console.error('Error:', error)
        if (error.response && error.response.status === 401) {
          // Chuyển đến trang /error-token nếu   mã lỗi là 401 Unauthorized
          window.location.href = '/error-token'
        }
      })
      .finally(() => {
        console.log('Request completed.')
      })
  }, [])

  useEffect(() => {
    const startIndex = (page - 1) * 5
    const endIndex = page * 5
    setPayments(allPayments.slice(startIndex, endIndex))
  }, [page, allPayments])

  const handleSearch = async () => {
    let x
    if (selectedOption === 'Chưa thanh toán') {
      x = 1
    } else if (selectedOption === 'Đã thanh toán') {
      x = 2
    } else {
      x = null // Hoặc giá trị mặc định
    }
    axiosInstance
      .post(
        '/contract', // Sử dụng đường dẫn tương đối
        {
          pageNumber: 0,
          pageSize: 0,
          filter: [
            {
              operator: '=',
              key: 'tenant',
              value: cid,
              otherValue: null,
              valueSelected: null
            },
            {
              operator: '=',
              key: 'paymentStatus',
              value: x,
              otherValue: null,
              valueSelected: null
            }
          ],
          sortProperty: 'contract.lastModifiedDate',
          sortOrder: 'DESC',
          buildingIds: []
        }
      )
      .then((response) => {
        console.log("SEARCH PAYMENT STATUS");
        console.log(response.data.data)
        const data = response.data.data
        setAllPayments(data)
        setTotalPages(Math.ceil(data.length / 5)) // Phân trang, mỗi trang 5 dòng
        setPage(1) // Đặt lại trang về 1 khi có dữ liệu mới
        setPayments(data.slice(0, 5)) // Lấy dữ liệu của trang đầu tiên
      })
      .catch((error) => {
        console.error('Error:', error)
      })
      .finally(() => {
        console.log('Request completed.')
      })
  }

  const handleOpenModal = (row) => {
    setModalData(row)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setModalData(null)
  }

  const handleVNPayPayment = async (contract_id, bankCode = 'NCB') => {
    try {
      localStorage.setItem('previousPage', window.location.href)
      const response = await axios.get(
        `https://office-nest-ohcid.ondigitalocean.app/api/v1/payment/vn-pay?contract_id=${contract_id}&bankCode=${bankCode}`
      )
      console.log('VNPay payment response:', response.data)
      window.location.href = response.data.result.paymentUrl
    } catch (error) {
      console.error('Error creating VNPay payment:', error)
      setAlertSeverity('error')
      setAlertText('Đã xảy ra lỗi khi tạo thanh toán VNPay')
      setSnackbarOpen(true)
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom sx={{ color: 'black' }}>
        Công nợ
      </Typography>

      <Box display="flex" gap={2} mb={3} mt={6}>
        <Select
          value={selectedOption}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span>Chọn trạng thái</span>
            }

            const option = options.find((opt) => opt.value === selected)
            return (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: option?.color,
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}
              >
                {option?.value}
              </Box>
            )
          }}
          sx={{
            width: '15%',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            height: 50
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: option.color,
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}
                ></span>
                {option.value}
              </Box>
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: '12px' }}>ID</TableCell>
              <TableCell style={{ fontSize: '12px' }}>Mã Hợp đồng</TableCell>
              <TableCell style={{ fontSize: '12px' }}>Tên khách hàng</TableCell>
              <TableCell style={{ fontSize: '12px' }}>Trạng thái</TableCell>
              <TableCell style={{ fontSize: '12px' }}>Số tiền phải nộp</TableCell>
              <TableCell style={{ fontSize: '12px' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ fontSize: '12px' }}>{row.id}</TableCell>
                <TableCell style={{ fontSize: '12px' }}>{row.code}</TableCell>
                <TableCell style={{ fontSize: '12px' }}>{row.tenant.fullName}</TableCell>
                <TableCell style={{ fontSize: '12px' }}>
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: row.paymentStatus === 2 ? '#d4edda' : '#fff3cd',
                      color: row.paymentStatus === 2 ? 'green' :  'orange',
                      borderRadius: '4px',
                      padding: '2px 8px', // Căn chỉnh padding cho hợp lý
                      display: 'inline-block' // Đảm bảo kích thước vừa đủ bao quanh text
                    }}
                  >
                    {row.paymentStatus === 1 ? 'Chưa thanh toán' : 'Đã thanh toán'}
                  </Box>
                </TableCell>
                <TableCell style={{ fontSize: '12px' }}>{row.depositAmount} VND</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            boxShadow: 24
          }}
        >
          {modalData && (
            <>
              <Typography variant="h3" gutterBottom>
                Chi tiết thanh toán
              </Typography>
              <Typography style={{ fontSize: '18px' }}>ID: {modalData.id}</Typography>
              <Typography style={{ fontSize: '18px' }}>Mã hợp đồng: {modalData.code}</Typography>
              <Typography style={{ fontSize: '18px' }}>Tên khách hàng: {modalData.tenant.fullName}</Typography>
              <Typography 
              style={{ 
                fontSize: '18px',
                backgroundColor: modalData.paymentStatus === 2 ? '#d4edda' : '#fff3cd',
                color: modalData.paymentStatus === 2 ? 'green' :  'orange',
                borderRadius: '4px',
                padding: '2px 8px', // Căn chỉnh padding cho hợp lý
                display: 'inline-block' // Đảm bảo kích thước vừa đủ bao quanh text
                }}>Trạng thái: {modalData.paymentStatus=== 1 ? 'Chưa thanh toán' : 'Đã thanh toán'}</Typography>
              <Typography style={{ fontSize: '18px' }}>Số tiền phải nộp: {modalData.depositAmount} VND</Typography>

              <Box mt={2} display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={modalData.paymentStatus === 2}
                  onClick={() => handleVNPayPayment(modalData.id)}
                >
                  Thanh toán
                </Button>
                <Button variant="outlined" onClick={handleCloseModal}>
                  Đóng
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={alertText}
        severity={alertSeverity}
        navigatePath={navigatePath}
      />
    </Box>
  )
}

export default Payment
