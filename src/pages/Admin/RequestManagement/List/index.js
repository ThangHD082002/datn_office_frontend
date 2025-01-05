import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Pagination,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material'
import styles from '../RequestManagement.module.scss'
import classNames from 'classnames/bind'
import { createTheme, responsiveFontSizes, ThemeProvider, Typography } from '@mui/material'
import { axiosInstance } from '~/utils/axiosInstance'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useNavigate } from 'react-router-dom'
import { set } from 'date-fns'
import dayjs from 'dayjs'
import { RefreshRounded } from '@mui/icons-material'

const cx = classNames.bind(styles)

let theme = createTheme()
theme = responsiveFontSizes(theme)

const getStatusInfo = (status) => {
  switch (status) {
    case 0:
      return { text: 'Đang chờ xử lý', color: '#FF9800' }
    case 1:
      return { text: 'Đã chấp thuận', color: '#4CAF50' }
    case 2:
      return { text: 'Đã hoàn thành', color: '#2196F3' }
    case 3:
      return { text: 'Đã từ chối', color: '#F44336' }
    default:
      return { text: 'Huỷ bỏ', color: '#9E9E9E' }
  }
}

const statusOptions = [
  { id: 0, name: 'Đang chờ xử lý', color: '#FF9800' },
  { id: 1, name: 'Đã chấp thuận', color: '#4CAF50' },
  { id: 2, name: 'Đã hoàn thành', color: '#2196F3' },
  { id: 3, name: 'Đã từ chối', color: '#F44336' },
  { id: 4, name: 'Huỷ bỏ', color: '#9E9E9E' }
];

function RequestManagementList() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildings, setBuildings] = useState([]);


  const columns = [
    { id: 'order', name: 'STT', width: 100 },
    { id: 'id', name: 'Mã yêu cầu', width: 170 },
    { id: 'user', name: 'Khách hàng', width: 300 },
    { id: 'building', name: 'Tòa nhà', width: 300 },
    { id: 'createdDate', name: 'Thời gian tạo', width: 240 },
    { id: 'actionDate', name: 'Thời gian thực hiện', width: 240 },
    { id: 'status', name: 'Trạng thái', width: 170 },
    { id: 'action', name: 'Hành động', width: 170 }
  ]

  const inputStyle = {
    width: '200px',
    '& .MuiInputBase-input': {
      fontSize: '1.3rem'
    },
    '& .MuiInputLabel-root': {
      fontSize: '1.3rem'
    },
    '& .MuiAutocomplete-input': {
      fontSize: '1.3rem'
    }
  };

  const autocompleteStyle = {
    ...inputStyle,
    '& .MuiAutocomplete-listbox': {
      '& .MuiAutocomplete-option': {
        fontSize: '1.3rem !important'
      }
    }
  };

  const buildingSelectStyle = {
    width: '300px',
    '& .MuiOutlinedInput-root': {
      width: '300px',
      height: '40px',
      padding: '0 8px'
    },
    '& .MuiAutocomplete-input': {
      width: '300px !important',
      padding: '0'
    },
    '& .MuiAutocomplete-endAdornment': {
      position: 'absolute',
      right: '8px'
    },
    '& .MuiInputBase-root': {
      fontSize: '1.3rem'
    }
  };

  const buttonStyle = {
    textTransform: 'none',
    fontSize: '1.3rem'
  };


  const getData = async (pageNumber) => {
    setLoading(true)
    try {
      let url = `/requests/manage-list?page=${pageNumber - 1}`;
      if (selectedStatus !== null)
        url += `&status=${selectedStatus.id}`;
      if (selectedBuilding !== null)
        url += `&buildingId=${selectedBuilding.id}`;
      const response = await axiosInstance.get(url);
      setData(response.data.content);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchBuildings = async () => {
    try {
      const response = await axiosInstance.get('/buildings/all');
      setBuildings(response.data.result);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    getData(1);
  };

  const handleReset = () => {
    setSelectedStatus(null);
    setSelectedBuilding(null);

    setPage(1);
    getData(1);
  };

  const getUserName = (user) => {
    if (user && user.fullName) {
      return `${user.fullName}`
    }
    return 'Không xác định'
  }

  const formatDateTime = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const formatDateTime2 = (date, time) => {
    if (!date) return 'Chưa đặt';
    const timeStr = time ? time.substring(0, 5) : '';
    return `${dayjs(date).format('DD/MM/YYYY')} ${timeStr}`;
  };

  const open = Boolean(anchorEl);
  const id = open ? 'user-popper' : undefined;

  const handleUserHover = async (event, userId) => {
    setUserData(null);
    setAnchorEl(event.currentTarget);
    setUserLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/customer/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setUserLoading(false);
    }
  }

  const getBuildingName = (building) => {
    if (building) {
      return building.name;
    }
    return 'Không xác định';
  }

  useEffect(() => {
    fetchBuildings();
    getData(page)
  }, [page])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleUserLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setAnchorEl(null);
      // setUserData(null);
    }
  };

  const handleDelete = (id) => {
    setSelectedRequestId(id);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/requests/${selectedRequestId}`);
      // Handle success (e.g., update UI, show notification)
    } catch (error) {
      console.error('Error deleting request:', error);
      // Handle error (e.g., show error notification)
    } finally {
      setConfirmModalOpen(false);
      window.location.reload();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography variant="h2" gutterBottom>
          Danh sách yêu cầu
        </Typography>
        <Divider />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Autocomplete
              size="small"
              options={buildings}
              getOptionLabel={(option) => option.name}
              value={selectedBuilding}
              onChange={(event, newValue) => {
                setSelectedBuilding(newValue);
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <span style={{ fontSize: '1.3rem' }}>
                    {option.name}
                  </span>
                </li>
              )}
              sx={buildingSelectStyle}
              renderInput={(params) => (
                <TextField {...params} placeholder="Chọn toà nhà" sx={inputStyle} />
              )}
            />
            <Autocomplete
              size="small"
              options={statusOptions}
              getOptionLabel={(option) => option.name}
              value={selectedStatus}
              onChange={(event, newValue) => {
                setSelectedStatus(newValue);
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <span style={{
                    color: option.color,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: `${option.color}20`,
                    fontSize: '1.3rem'
                  }}>
                    {option.name}
                  </span>
                </li>
              )}
              sx={autocompleteStyle}
              renderInput={(params) => (
                <TextField {...params} placeholder="Trạng thái" sx={inputStyle} />
              )}
            />

            <Button
              variant="contained"
              onClick={() => handleSearch()}
              sx={buttonStyle}
              className={cx('btn-search')}
            >
              Tìm kiếm
            </Button>

            <IconButton
              onClick={handleReset}
              title="Làm mới"
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: '2rem'
                }
              }}
            >
              <RefreshRounded />
            </IconButton>
          </div>

          <Button
            variant="primary"
            sx={buttonStyle}
            className={cx('btn-create')}
            href="/admin/create-request"
          >
            Tạo mới&nbsp; <AddIcon />
          </Button>
        </div>

        <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 999
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <tr>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} width={column.width} className={cx('th')}>
                      {column.name}
                    </TableCell>
                  ))}
                </tr>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell className={cx('td')}>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell className={cx('td')}>{row.id}</TableCell>
                    <TableCell className={cx('td')}>
                      <span
                        onMouseEnter={(event) => handleUserHover(event, row.userId)}
                        onMouseLeave={handleUserLeave}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {getUserName(row.userDTO)}
                      </span>
                    </TableCell>
                    <TableCell className={cx('td')}>{getBuildingName(row.buildingDTO)}</TableCell>
                    <TableCell className={cx('td')}>
                      {formatDateTime(row.createdDate)}
                    </TableCell>
                    <TableCell className={cx('td')}>
                      {formatDateTime2(row.date, row.time)}
                    </TableCell>
                    <TableCell className={cx('td')}>
                      <span
                        style={{
                          color: getStatusInfo(row.status).color,
                          fontWeight: 500,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: `${getStatusInfo(row.status).color}20` // 20 is hex for 12% opacity
                        }}
                      >
                        {getStatusInfo(row.status).text}
                      </span>
                    </TableCell>
                    <TableCell className={cx('td')}>
                      <IconButton color="primary" title="Chi tiết"
                        onClick={() => navigate(`/admin/requests/${row.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        title={row.status === 2 ? "Tạo hợp đồng" :
                          "Yêu cầu phải được hoàn thành trước khi tạo hợp đồng"}
                        disabled={row.status !== 2}
                        style={{
                          pointerEvents: 'auto'
                        }}
                        onClick={() => navigate(`/admin/create-contract/${row.id}`)}
                      >
                        <AssignmentIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        style={{
                          pointerEvents: 'auto'
                        }}
                        title={(row.status === 3 || row.status === 4) ? "Xoá" :
                          "Chỉ có thể xoá hợp đồng bị Từ chối hoặc Huỷ bỏ"
                        }
                        disabled={row.status !== 3 && row.status !== 4}
                        onClick={() => handleDelete(row.id)} >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Pagination count={totalPages} page={page} onChange={handlePageChange} disabled={loading} />
          </div>
        </Paper>
      </div>

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="right-start"
        disablePortal
        onMouseEnter={() => setAnchorEl(anchorEl)}
        onMouseLeave={handleUserLeave}
      >
        <Box sx={{
          p: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          width: 300
        }}>
          {userLoading ? (
            <CircularProgress />
          ) : (
            userData && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={userData.imageAvatar}
                    alt={userData.fullName}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                  <Typography id="user-modal-title" variant="h6" component="h2">
                    {userData.fullName}
                  </Typography>
                </Box>
                <Typography id="user-modal-description" sx={{ mt: 2 }}>
                  <strong>Email:</strong> {userData.email}
                </Typography>
                <Typography id="user-modal-description" sx={{ mt: 2 }}>
                  <strong>Phone:</strong> {userData.phoneNumber}
                </Typography>
                {/* Add more user info as needed */}
              </>
            )
          )}
        </Box>
      </Popper>

      {/* Delete confirmation modal */}
      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography id="confirm-modal-title" variant="h6" component="h2">
            Xác nhận
          </Typography>
          <Typography id="confirm-modal-description">
            Bạn có chắc chắn muốn xoá yêu cầu này không?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" onClick={() => setConfirmModalOpen(false)}>
              Huỷ bỏ
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>

  )
}

export default RequestManagementList
