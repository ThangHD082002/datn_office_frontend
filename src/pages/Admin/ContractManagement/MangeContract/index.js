import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import classNames from 'classnames/bind'
import TextField from '@mui/material/TextField'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { axiosInstance } from '~/utils/axiosInstance'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import axios from 'axios'
import styles from './ManageContract.module.scss'

function ManageContract() {
  let token = localStorage.getItem('authToken')

  const [filteredArray, setFilteredArray] = useState([])
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [valueSearch, setValueSearch] = useState('')
  const [loading, setLoading] = useState(false) // Trạng thái loading
  const [progress, setProgress] = useState(0) // Tiến trình tải
  useEffect(() => {
    // axios
    //   .post(
    //     "https://office-nest-ohcid.ondigitalocean.app/api/contract",
    //     {
    //       pageNumber: 0,
    //       pageSize: 10,
    //       filter: [],
    //       sortProperty: "contract.lastModifiedDate",
    //       sortOrder: "DESC",
    //       buildingIds: [],
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    //   .then(function (response) {
    //     const newArray = response.data.data.map((item) => ({
    //       id: item.id,
    //       code: item.code,
    //       startDate: item.startDate,
    //       rentalPurpose: item.rentalPurpose,
    //       status: item.status,
    //     }));
    //     setRows(newArray);
    //   })
    //   .catch(function (error) {
    //     console.error("Error:", error);
    //     if (error.response && error.response.status === 401) {
    //       // Chuyển đến trang /error-token nếu mã lỗi là 401 Unauthorized
    //       window.location.href = "/error-token";
    //     }
    //   })
    //   .finally(function () {
    //     console.log("Request completed.");
    //   });

    axiosInstance
      .post('/contract', {
        pageNumber: 0,
        pageSize: 10,
        filter: [],
        sortProperty: 'contract.lastModifiedDate',
        sortOrder: 'DESC',
        buildingIds: []
      })
      .then((response) => {
        const newArray = response.data.data.map((item) => ({
          id: item.id,
          code: item.code,
          startDate: item.startDate,
          rentalPurpose: item.rentalPurpose,
          status: item.status
        }))
        setRows(newArray)
      })
      .catch((error) => {
        console.error('Error:', error)
        if (error.response && error.response.status === 401) {
          // Chuyển đến trang /error-token nếu mã lỗi là 401 Unauthorized
          window.location.href = '/error-token'
        }
      })
      .finally(() => {
        console.log('Request completed.')
      })
  }, [])

  // console.log(filteredArray);

  const cx = classNames.bind(styles)

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Id'
    },
    {
      id: 'calories',
      numeric: true,
      disablePadding: false,
      label: 'Mã HỢP ĐỒNG'
    },
    {
      id: 'fat',
      numeric: true,
      disablePadding: false,
      label: 'NGÀY KÍ'
    },
    {
      id: 'carbs',
      numeric: true,
      disablePadding: false,
      label: 'MỤC ĐÍCH THUÊ'
    },
    {
      id: 'protein',
      numeric: true,
      disablePadding: false,
      label: 'TRẠNG THÁI'
    }
  ]

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property)
    }

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts'
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ fontSize: '12px' }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  }

  function EnhancedTableToolbar(props) {
    const { numSelected } = props
    return (
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 }
          },
          numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          }
        ]}
      >
        {numSelected > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            Nutrition
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    )
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  }

  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const listFloorOrder = React.useState([])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = React.useMemo(
    () => [...rows].sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  )

  const handleExport = () => {
    setLoading(true)
    setProgress(0)
    console.log(selected)
    const id = Number(selected[0])
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 1 : prev)) // Tăng đến 95%
    }, 100) // Mỗi 100ms tăng 1%
    // axios
    //   .get(`https://office-nest-ohcid.ondigitalocean.app/api/contract/${id}/export-pdf`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //     },
    //     responseType: 'blob', // Đảm bảo nhận dữ liệu dưới dạng blob cho file
    //     onDownloadProgress: (progressEvent) => {
    //       if (progressEvent.total) {
    //         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //         setProgress(percentCompleted) // Cập nhật tiến trình thực tế từ API
    //       }
    //     }
    //   })
    //   .then(function (response) {
    //     // Tạo URL blob từ dữ liệu PDF
    //     const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    //     const link = document.createElement('a')
    //     link.href = url
    //     link.setAttribute('download', 'contract.pdf') // Tên file tải xuống
    //     document.body.appendChild(link)
    //     link.click() // Bắt đầu tải file
    //     document.body.removeChild(link) // Xóa link sau khi tải xong
    //   })
    //   .catch(function (error) {
    //     console.log('Error downloading file:', error)
    //   })
    //   .finally(function () {
    //     console.log('Request completed.')
    //     clearInterval(progressInterval) // Ngừng tăng dần tiến trình
    //     setProgress(100) // Đặt tiến trình là 100% khi hoàn tất
    //     setTimeout(() => setLoading(false), 500) // Đóng loading sau khi đạt 100%
    //   })

    axiosInstance
      .get(`/contract/${id}/export-pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob', // Đảm bảo nhận dữ liệu dưới dạng blob cho file
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(percentCompleted) // Cập nhật tiến trình thực tế từ API
          }
        }
      })
      .then((response) => {
        // Tạo URL blob từ dữ liệu PDF
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'contract.pdf') // Tên file tải xuống
        document.body.appendChild(link)
        link.click() // Bắt đầu tải file
        document.body.removeChild(link) // Xóa link sau khi tải xong
      })
      .catch((error) => {
        console.log('Error downloading file:', error)
      })
      .finally(() => {
        console.log('Request completed.')
        clearInterval(progressInterval) // Ngừng tăng dần tiến trình
        setProgress(100) // Đặt tiến trình là 100% khi hoàn tất
        setTimeout(() => setLoading(false), 500) // Đóng loading sau khi đạt 100%
      })
  }

  const handleChangeValueSearch = (e) => {
    setValueSearch(e.target.value)
  }

  const handleSubmitSearch = () => {
    // axios
    //   .post(
    //     'https://office-nest-ohcid.ondigitalocean.app/api/contract',
    //     {
    //       pageNumber: 0,
    //       pageSize: 10,
    //       filter: [
    //         {
    //           operator: 'contain',
    //           key: 'code',
    //           value: valueSearch,
    //           otherValue: null,
    //           valueSelected: null
    //         }
    //       ],
    //       sortProperty: 'contract.lastModifiedDate',
    //       sortOrder: 'DESC',
    //       buildingIds: []
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     }
    //   )
    //   .then(function (response) {
    //     const newArray = response.data.data.map((item) => ({
    //       id: item.id,
    //       code: item.code,
    //       startDate: item.startDate,
    //       rentalPurpose: item.rentalPurpose,
    //       status: item.status
    //     }))
    //     setRows(newArray)
    //   })
    //   .catch(function (error) {
    //     console.error('Error:', error)
    //   })
    //   .finally(function () {
    //     console.log('Request completed.')
    //   })

    axiosInstance
      .post(
        '/contract', // Sử dụng đường dẫn tương đối
        {
          pageNumber: 0,
          pageSize: 10,
          filter: [
            {
              operator: 'contain',
              key: 'code',
              value: valueSearch,
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
        const newArray = response.data.data.map((item) => ({
          id: item.id,
          code: item.code,
          startDate: item.startDate,
          rentalPurpose: item.rentalPurpose,
          status: item.status
        }))
        setRows(newArray)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
      .finally(() => {
        console.log('Request completed.')
      })
  }

  const HandlePreviewContract = () => {
    const id = Number(selected[0])
    // navigate('/admin/create-contract')
    navigate(`/admin/preview-contract/${id}`);
  }

  return (
    <div className={cx('container')}>
      <h1>Manage Contracts</h1>

      <Box display="flex" alignItems="center" gap={2} sx={{ marginTop: 6 }}>
        <TextField
          onChange={handleChangeValueSearch}
          value={valueSearch}
          variant="outlined"
          placeholder="Search by code"
          sx={{
            width: '30%'
          }}
        />
        <Button
          onClick={handleSubmitSearch}
          variant="contained"
          // color="primary"
          sx={{
            whiteSpace: 'nowrap',
            fontSize: '15px',
            backgroundColor: '#c781f6',
            color: '#fff'
          }}
        >
          Search
        </Button>
      </Box>

      <Box sx={{ width: '100%', marginTop: '30px' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table sx={{ minWidth: 1200 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.map((row, index) => {
                  const isItemSelected = selected.includes(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ fontSize: '15px' }}>
                        {row.id}
                      </TableCell>
                      <TableCell sx={{ fontSize: '15px' }} align="right">
                        {row.code}
                      </TableCell>
                      <TableCell sx={{ fontSize: '15px' }} align="right">
                        {row.startDate}
                      </TableCell>
                      <TableCell sx={{ fontSize: '15px' }} align="right">
                        {row.rentalPurpose}
                      </TableCell>
                      <TableCell sx={{ fontSize: '15px' }} align="right">
                        {row.status === 1 ? (
                          <Box
                            component="span"
                            sx={{
                              backgroundColor: '#e9f5e9',
                              color: '#65af50',
                              borderRadius: '4px',
                              padding: '2px 6px', // khoảng cách xung quanh chữ
                              display: 'inline-block' // đảm bảo nền chỉ bao quanh chữ
                            }}
                          >
                            đã xử lí
                          </Box>
                        ) : (
                          row.status
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
      </Box>
      <Stack
        spacing={2}
        direction="row"
        sx={{
          position: 'absolute',
          right: '0',
          height: '35px',
          fontSize: '15px',
          bottom: '10px'
        }}
      >
        <Button
          variant="contained"
          sx={{
            fontSize: '15px',
            backgroundColor: '#b7272d'
          }}
          onClick={HandlePreviewContract}
          disabled={selected.length === 0}
        >
          PREVIEW
        </Button>

        <Button
          variant="contained"
          sx={{
            fontSize: '15px',
            backgroundColor: 'green'
          }}
          disabled={selected.length === 0}
        >
          EDIT
        </Button>

        <Button
          variant="contained"
          onClick={handleExport}
          sx={{
            fontSize: '15px'
          }}
          disabled={selected.length === 0}
        >
          Export
        </Button>
      </Stack>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress variant="determinate" value={progress} size={60} thickness={4} />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          {progress}%
        </Typography>
      </Backdrop>
    </div>
  )
}

export default ManageContract
