import { Box, CircularProgress, Divider, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import styles from '../RequestManagement.module.scss';
import classNames from "classnames/bind";
import { createTheme, responsiveFontSizes, ThemeProvider, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import { axiosInstance } from "~/utils/axiosInstance";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';


const cx = classNames.bind(styles);

let theme = createTheme();
theme = responsiveFontSizes(theme);

const getStatusInfo = (status) => {
    switch (status) {
        case 0:
            return { text: 'Đang chờ xử lý', color: '#FF9800' };
        case 1:
            return { text: 'Đã chấp thuận', color: '#4CAF50' };
        case 2:
            return { text: 'Đã từ chối', color: '#F44336' };
        case 3:
            return { text: 'Đã hoàn thành', color: '#2196F3' };
        default:
            return { text: 'Huỷ bỏ', color: '#9E9E9E' };
    }
};

const getUserName = (user) => {
    if (user && user.firstName && user.lastName) {
        return `${user.lastName} ${user.firstName}`;
    }
    return 'Không xác định';
}

function RequestManagementList() {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    const columns = [
        { id: 'id', name: 'ID', width: 170 },
        { id: 'user', name: 'Họ tên', width: 300 },
        { id: 'building', name: 'Tòa nhà', width: 300 },
        { id: 'note', name: 'Ghi chú', width: 300 },
        { id: 'date', name: 'Ngày yêu cầu', width: 200 },
        { id: 'time', name: 'Thời gian yêu cầu', width: 170 },
        { id: 'status', name: 'Trạng thái', width: 170 },
        { id: 'action', name: 'Hành động', width: 170 },
    ]

    const getData = async (pageNumber) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/requests?page=${pageNumber - 1}`);
            setData(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData(page);
    }, [page]);

    const handlePageChange = (event, newPage) => {
        console.log("New page" + newPage);
        setPage(newPage);
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Typography variant="h2" gutterBottom>Danh sách yêu cầu</Typography>
                <Divider />
                <div>
                    <Button variant="primary" className={cx('btn-create')} href="/admin/create-request">
                        Tạo mới &nbsp; <AddIcon />
                    </Button>
                </div>

                <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                    {loading && (<Box sx={{
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
                    }}>
                        <CircularProgress />
                    </Box>)}
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                {columns.map((column) =>
                                    <TableCell key={column.id}
                                        align={column.align}
                                        width={column.width}
                                        className={cx('th')} >
                                        {column.name}
                                    </TableCell>
                                )}
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className={cx('td')}>{row.id}</TableCell>
                                        <TableCell className={cx('td')}>
                                            {getUserName(row.userDTO)}
                                        </TableCell>
                                        <TableCell className={cx('td')}>{row.buildingDTO.name}</TableCell>
                                        <TableCell className={cx('td')}>{row.note}</TableCell>
                                        <TableCell className={cx('td')}>{row.date}</TableCell>
                                        <TableCell className={cx('td')}>{row.time}</TableCell>
                                        <TableCell className={cx('td')}>
                                            <span style={{
                                                color: getStatusInfo(row.status).color,
                                                fontWeight: 500,
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: `${getStatusInfo(row.status).color}20` // 20 is hex for 12% opacity
                                            }}>
                                                {getStatusInfo(row.status).text}
                                            </span>
                                        </TableCell>
                                        <TableCell className={cx('td')}>
                                            <IconButton color="primary" title="Chi tiết">
                                                <VisibilityIcon />
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
                    <div style={{
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            disabled={loading}
                        />
                    </div>
                </Paper>
            </div>
        </ThemeProvider>

    );
}

export default RequestManagementList;