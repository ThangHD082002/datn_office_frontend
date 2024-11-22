import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Checkbox,
  Grid,
  Paper,
  Container,
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
  DialogTitle
} from '@mui/material'
import { axiosInstance } from '~/utils/axiosInstance'

const AssignBuilding = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const [buildings, setBuildings] = useState([])
  const [users, setUsers] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [buildingUsers, setBuildingUsers] = useState([])
  const [buildingPage, setBuildingPage] = useState(1)
  const [userPage, setUserPage] = useState(1)

  // Fetch Buildings with Pagination
  const fetchBuildings = async (page) => {
    const response = await axiosInstance.get(`/buildings`)
    const data = await response.data
    setBuildings(data.content)
  }

  // Fetch Users with Pagination
  const fetchUsers = async (page) => {
    const response = await axiosInstance.get(`/admin/managers`)
    const data = await response.data
    setUsers(data)
  }

  // Fetch Assigned Users for the selected Building
  const fetchAssignedUsers = async (buildingId) => {
    const response = await axiosInstance.get(`/admin/manager/by-building/${buildingId}`)
    const data = await response.data
    setBuildingUsers(data) // Set danh sách user đang quản lý tòa nhà
  }

  useEffect(() => {
    fetchBuildings(buildingPage)
    fetchUsers(userPage)
  }, [buildingPage, userPage])

  const handleBuildingChange = async (event) => {
    const buildingId = event.target.value
    setSelectedBuilding(buildingId)
    fetchAssignedUsers(buildingId)
  }

  const handleUserChange = (event) => {
    const selectedIds = event.target.value
    setSelectedUsers(selectedIds)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    try {
      await axiosInstance.delete(`/admin/manager/${userToDelete.id}`) // Gọi API xóa
      setBuildingUsers((prev) => prev.filter((user) => user.id !== userToDelete.id)) // Xóa user khỏi danh sách
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      handleCloseDialog() // Đóng dialog sau khi xóa
    }
  }
  const handleOpenDialog = (user) => {
    setUserToDelete(user) // Lưu thông tin user cần xóa
    setOpenDialog(true) // Mở dialog
  }

  const handleCloseDialog = () => {
    setOpenDialog(false) // Đóng dialog
    setUserToDelete(null) // Xóa thông tin user
  }

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        listUserId: selectedUsers
      }
      await axiosInstance.post(`/admin/assign-users-responsible-by-building-id/${selectedBuilding}`, dataToSubmit)
      fetchAssignedUsers(selectedBuilding) // Cập nhật danh sách sau khi lưu
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ width: '150vh' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontSize: '2rem' }}>
          Gán Tòa Nhà Cho User
        </Typography>

        <Paper sx={{ p: 6, boxShadow: 3 }}>
          <Grid container spacing={4}>
            {/* Chọn Tòa Nhà */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ fontSize: '1.25rem' }}>Tòa Nhà</InputLabel>
                <Select
                  value={selectedBuilding}
                  onChange={handleBuildingChange}
                  sx={{
                    height: 60,
                    fontSize: '1.2rem'
                  }}
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {building.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Địa chỉ: {building.address}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Chọn User */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ fontSize: '1.25rem' }}>Chọn User</InputLabel>
                <Select
                  multiple
                  value={selectedUsers}
                  onChange={handleUserChange}
                  sx={{
                    height: 60,
                    fontSize: '1.2rem'
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) return 'Chọn User' // Khi chưa chọn
                    if (selected.length > 2) {
                      // Khi chọn quá nhiều user
                      return `${selected
                        .slice(0, 2)
                        .map((userId) => {
                          const user = users.find((user) => user.id === userId)
                          return user ? `${user.fullName} (${user.login})` : ''
                        })
                        .join(', ')}... (+${selected.length - 2} người)`
                    }
                    // Khi chọn ít user
                    return selected
                      .map((userId) => {
                        const user = users.find((user) => user.id === userId)
                        return user ? `${user.fullName} (${user.login})` : ''
                      })
                      .join(', ')
                  }}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox checked={selectedUsers.includes(user.id)} />
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {user.fullName} ({user.login})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          SĐT: {user.phoneNumber}, Email: {user.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Bảng danh sách User đang quản lý tòa nhà */}
          {selectedBuilding && (
            <Box mt={4}>
              <Typography variant="h5" gutterBottom sx={{ fontSize: '1.5rem' }}>
                User Đang Quản Lý Tòa Nhà
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>UserName</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>SĐT</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {buildingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.login}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="error" onClick={() => handleOpenDialog(user)}>
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Nút Lưu */}
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                padding: '15px 40px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
              disabled={!selectedBuilding || selectedUsers.length === 0}
            >
              Lưu
            </Button>
          </Box>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắc chắn muốn xóa <strong>{userToDelete?.fullName}</strong> ({userToDelete?.login}) khỏi danh
                sách quản lý tòa nhà không?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Hủy
              </Button>
              <Button onClick={handleDeleteUser} color="error" autoFocus>
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Container>
  )
}

export default AssignBuilding
