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
    TableRow
} from '@mui/material'
import styles from '../BuildingManagement.module.scss'
import classNames from 'classnames/bind'
import { createTheme, responsiveFontSizes, ThemeProvider, Typography } from '@mui/material'
import { Button } from 'react-bootstrap'
import { axiosInstance } from '~/utils/axiosInstance'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useNavigate } from 'react-router-dom'

const cx = classNames.bind(styles)

let theme = createTheme()
theme = responsiveFontSizes(theme)

const getAddress = (data) => {
    return `${data.address}, ${data.ward.name}, ${data.ward.district.name}, 
    ${data.ward.district.province.name}`;
}

const formatTwoDigits = (num) => {
    return num.toString().padStart(2, '0');
};

function BuildingManagementList() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const columns = [
        { id: 'id', name: 'ID', width: 20 },
        { id: 'name', name: 'Tên', width: 200 },
        { id: 'address', name: 'Địa chỉ', width: 300 },
        { id: 'floorArea', name: 'Diện tích sàn', width: 130 },
        { id: 'numberOfFloor', name: 'Số tầng', width: 100 },
        { id: 'numberOfBasement', name: 'Số hầm', width: 100 },
        { id: 'pricePerM2', name: 'Giá', width: 100 },
        { id: 'note', name: 'Ghi chú', width: 500 },
        { id: 'action', name: 'Hành động', width: 170 }
    ]

    const getData = async (pageNumber) => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(`/buildings?page=${pageNumber - 1}`)
            setData(response.data.content)
            setTotalPages(response.data.totalPages)
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData(page)
    }, [page])

    const handlePageChange = (event, newPage) => {
        console.log('New page' + newPage)
        setPage(newPage)
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Typography variant="h2" gutterBottom>
                    Danh sách Toà nhà
                </Typography>
                <Divider />
                <div>
                    <Button variant="primary" className={cx('btn-create')} href="/admin/create-building">
                        Tạo mới &nbsp; <AddIcon />
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
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} width={column.width} className={cx('th')}>
                                        {column.name}
                                    </TableCell>
                                ))}
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className={cx('td')}>{row.id}</TableCell>
                                        <TableCell className={cx('td')}>{row.name}</TableCell>
                                        <TableCell className={cx('td')}>{getAddress(row)}</TableCell>
                                        <TableCell className={cx('td')}>{row.floorArea} m<sup>2</sup></TableCell>
                                        <TableCell className={cx('td')}>{formatTwoDigits(row.numberOfFloor)}</TableCell>
                                        <TableCell className={cx('td')}>{row.numberOfBasement}</TableCell>
                                        <TableCell className={cx('td')}>{row.pricePerM2} $</TableCell>
                                        <TableCell className={cx('td')}><div
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: '1.2em',
                                                maxHeight: '2.4em' // 2 lines * 1.2em line-height
                                            }}
                                            title={row.note} // Show full text on hover
                                        >{row.note}</div></TableCell>
                                        <TableCell className={cx('td')}>
                                            <IconButton color="primary" title="Chi tiết" onClick={() =>
                                                navigate(`/admin/buildings/${row.id}`)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="success" title="Danh sách văn phòng">
                                                <AssignmentIcon />
                                            </IconButton>
                                            <IconButton color="error" title="Xoá">
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
        </ThemeProvider>
    )
}

export default BuildingManagementList
