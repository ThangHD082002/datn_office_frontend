import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MuiButton
} from '@mui/material'
import styles from '../UserManagement.module.scss'
import classNames from 'classnames/bind'
import { createTheme, responsiveFontSizes, ThemeProvider, Typography } from '@mui/material'
import { Button } from 'react-bootstrap'
import { axiosInstance } from '~/utils/axiosInstance'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'

const cx = classNames.bind(styles)

let theme = createTheme()
theme = responsiveFontSizes(theme)

const getUserStatus = (activated) => {
  return activated ? { text: 'Active', color: '#4CAF50' } : { text: 'Inactive', color: '#F44336' }
}

function UserManagementList() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const columns = [
    { id: 'id', name: 'ID', width: 100 },
    { id: 'login', name: 'Username', width: 150 },
    { id: 'fullName', name: 'Full Name', width: 250 },
    { id: 'email', name: 'Email', width: 250 },
    { id: 'phoneNumber', name: 'Phone Number', width: 150 },
    { id: 'status', name: 'Status', width: 150 },
    { id: 'action', name: 'Action', width: 150 }
  ]

  const fetchData = async (pageNumber) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/admin/managers`)
      setUsers(response.data)
      setTotalPages(10) // Replace with response.data.totalPages if available
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      setLoading(true)
      await axiosInstance.delete(`/admin/users/${selectedUser.id}`)
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id))
      console.log(`User with ID ${selectedUser.id} deleted successfully.`)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user. Please try again.')
    } finally {
      setLoading(false)
      handleCloseDialog()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography variant="h2" gutterBottom>
          User Management
        </Typography>
        <Divider />
        <div>
          {/* Nút thêm user */}
          <Button
            variant="contained"
            href="/admin/create-managers"
            sx={{
              bgcolor: '#0000FF', // Đặt màu nền
              color: '#fff', // Màu chữ
              '&:hover': { bgcolor: '#7B00B5' } // Màu nền khi hover
            }}
          >
            Thêm User Manager &nbsp; <AddIcon />
          </Button>

          {/* Nút gán tòa nhà */}
          <Button
            variant="contained"
            href="/admin/assign-building"
            sx={{
              bgcolor: '#0000FF', // Đặt màu nền
              color: '#fff', // Màu chữ
              '&:hover': { bgcolor: '#006666' } // Màu nền khi hover
            }}
          >
            Gán Tòa Nhà &nbsp; <AddIcon />
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
                zIndex: 1
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <TableContainer>
            <Table stickyHeader aria-label="user table">
              <TableHead>
                {columns.map((column) => (
                  <TableCell key={column.id} align="left" width={column.width} className={cx('th')}>
                    {column.name}
                  </TableCell>
                ))}
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className={cx('td')}>{user.id}</TableCell>
                    <TableCell className={cx('td')}>{user.login}</TableCell>
                    <TableCell className={cx('td')}>{user.fullName}</TableCell>
                    <TableCell className={cx('td')}>{user.email}</TableCell>
                    <TableCell className={cx('td')}>{user.phoneNumber}</TableCell>
                    <TableCell className={cx('td')}>
                      <span
                        style={{
                          color: getUserStatus(user.activated).color,
                          fontWeight: 500,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: `${getUserStatus(user.activated).color}20`
                        }}
                      >
                        {getUserStatus(user.activated).text}
                      </span>
                    </TableCell>
                    <TableCell className={cx('td')}>
                      <IconButton
                        color="primary"
                        title="View Details"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error" title="Delete" onClick={() => handleDeleteClick(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} disabled={loading} />
          </Box>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseDialog} color="primary">
              Cancel
            </MuiButton>
            <MuiButton onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </MuiButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}

export default UserManagementList
