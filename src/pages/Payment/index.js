// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Select,
//   MenuItem,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Modal,
//   Pagination,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import axios from "axios";

// const Payment = () => {
//   const [payments, setPayments] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [modalData, setModalData] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     fetchPayments();
//   }, [page]);

//   const fetchPayments = async () => {
//     try {
//       const response = await axios.get(`/list/payment?page=${page}`);
//       setPayments(response.data.payments);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get("/payment/state", {
//         params: { state: selectedState, search: searchTerm },
//       });
//       setPayments(response.data);
//     } catch (error) {
//       console.error("Error searching payments:", error);
//     }
//   };

//   const handleOpenModal = (row) => {
//     setModalData(row);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setModalData(null);
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Công nợ
//       </Typography>

//       <Box display="flex" gap={2} mb={3}>
//         <Select
//           value={selectedState}
//           onChange={(e) => setSelectedState(e.target.value)}
//           displayEmpty
//           fullWidth
//         >
//           <MenuItem value="">Chọn trạng thái</MenuItem>
//           <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
//           <MenuItem value="Chưa thanh toán đủ">Chưa thanh toán đủ</MenuItem>
//           <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
//         </Select>

//         <TextField
//           placeholder="Tìm kiếm"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           fullWidth
//         />

//         <Button variant="contained" color="primary" onClick={handleSearch}>
//           Tìm kiếm
//         </Button>
//       </Box>

//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Mã Hợp đồng</TableCell>
//               <TableCell>Khoản thu</TableCell>
//               <TableCell>Trạng thái</TableCell>
//               <TableCell>Số tiền phải nộp</TableCell>
//               <TableCell>Số tiền đã nộp</TableCell>
//               <TableCell>Thao tác</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {payments.map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.contractCode}</TableCell>
//                 <TableCell>{row.feeType}</TableCell>
//                 <TableCell>{row.state}</TableCell>
//                 <TableCell>{row.amountDue}</TableCell>
//                 <TableCell>{row.amountPaid}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleOpenModal(row)}>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Box display="flex" justifyContent="center" mt={2}>
//         <Pagination
//           count={totalPages}
//           page={page}
//           onChange={(e, value) => setPage(value)}
//           color="primary"
//         />
//       </Box>

//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             p: 4,
//             boxShadow: 24,
//           }}
//         >
//           {modalData && (
//             <>
//               <Typography variant="h6">Chi tiết thanh toán</Typography>
//               <Typography>ID: {modalData.id}</Typography>
//               <Typography>Mã Hợp đồng: {modalData.contractCode}</Typography>
//               <Typography>Khoản thu: {modalData.feeType}</Typography>
//               <Typography>Trạng thái: {modalData.state}</Typography>
//               <Typography>Số tiền phải nộp: {modalData.amountDue}</Typography>
//               <Typography>Số tiền đã nộp: {modalData.amountPaid}</Typography>

//               <Box mt={2} display="flex" justifyContent="space-between">
//                 <Button variant="contained" color="primary">
//                   Thanh toán
//                 </Button>
//                 <Button variant="outlined" onClick={handleCloseModal}>
//                   Đóng
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default Payment;

import React, { useState, useEffect } from 'react'
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

const mockPayments = [
  {
    id: 1,
    contractCode: 'HD001',
    feeType: 'Khoản thu 1',
    state: 'Chưa thanh toán',
    amountDue: 1000000,
    amountPaid: 0
  },
  {
    id: 2,
    contractCode: 'HD002',
    feeType: 'Khoản thu 2',
    state: 'Chưa thanh toán đủ',
    amountDue: 2000000,
    amountPaid: 1500000
  },
  {
    id: 3,
    contractCode: 'HD003',
    feeType: 'Khoản thu 3',
    state: 'Đã thanh toán',
    amountDue: 500000,
    amountPaid: 500000
  },
  {
    id: 4,
    contractCode: 'HD004',
    feeType: 'Khoản thu 4',
    state: 'Chưa thanh toán',
    amountDue: 3000000,
    amountPaid: 0
  },
  {
    id: 5,
    contractCode: 'HD005',
    feeType: 'Khoản thu 5',
    state: 'Đã thanh toán',
    amountDue: 1000000,
    amountPaid: 1000000
  }
]

const Payment = () => {
  const [payments, setPayments] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalData, setModalData] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPayments()
  }, [page])

  const fetchPayments = async () => {
    const paginatedPayments = mockPayments.slice((page - 1) * 5, page * 5)
    setPayments(paginatedPayments)
    setTotalPages(Math.ceil(mockPayments.length / 5))
  }

  const handleSearch = async () => {
    const filteredPayments = mockPayments.filter(
      (payment) =>
        (selectedState === '' || payment.state === selectedState) && payment.contractCode.includes(searchTerm)
    )
    setPayments(filteredPayments)
    setTotalPages(1)
    setPage(1)
  }

  const handleOpenModal = (row) => {
    setModalData(row)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setModalData(null)
  }
  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom sx={{color: 'black'}}>
        Công nợ
      </Typography>

      <Box display="flex" gap={2} mb={3} mt={6}>
        <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} displayEmpty sx={{width: '20%'}}>
          <MenuItem value="">Chọn trạng thái</MenuItem>
          <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
          <MenuItem value="Chưa thanh toán đủ">Chưa thanh toán đủ</MenuItem>
          <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mã Hợp đồng</TableCell>
              <TableCell>Khoản thu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Số tiền phải nộp</TableCell>
              <TableCell>Số tiền đã nộp</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ fontSize: '12px' }}>{row.id}</TableCell>
                <TableCell style={{ fontSize: '12px' }}>{row.contractCode}</TableCell>
                <TableCell style={{ fontSize: '12px' }}>{row.feeType}</TableCell>
                <TableCell style={{ fontSize: '12px' }}>
                  <Box
                    component="span"
                    sx={{
                      backgroundColor:
                        row.state === 'Đã thanh toán'
                          ? '#d4edda'
                          : row.state === 'Chưa thanh toán'
                          ? '#f8d7da'
                          : '#fff3cd',
                      color:
                        row.state === 'Đã thanh toán' ? 'green' : row.state === 'Chưa thanh toán' ? 'red' : 'orange',
                      borderRadius: '4px',
                      padding: '2px 8px', // Căn chỉnh padding cho hợp lý
                      display: 'inline-block' // Đảm bảo kích thước vừa đủ bao quanh text
                    }}
                  >
                    {row.state}
                  </Box>
                </TableCell>
                <TableCell style={{ fontSize: '12px' }}>{row.amountDue} VND</TableCell>
                <TableCell style={{ fontSize: '14px' }}>{row.amountPaid} VND</TableCell>
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
              <Typography style={{ fontSize: '18px' }}>Mã Hợp đồng: {modalData.contractCode}</Typography>
              <Typography style={{ fontSize: '18px' }}>Khoản thu: {modalData.feeType}</Typography>
              <Typography style={{ fontSize: '18px' }}>Trạng thái: {modalData.state}</Typography>
              <Typography style={{ fontSize: '18px' }}>Số tiền phải nộp: {modalData.amountDue} VND</Typography>
              <Typography style={{ fontSize: '18px' }}>Số tiền đã nộp: {modalData.amountPaid} VND</Typography>

              <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" disabled={modalData.state === 'Đã thanh toán'}>
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
    </Box>
  )
}

export default Payment
