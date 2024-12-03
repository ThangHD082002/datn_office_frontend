import {
    Autocomplete,
    Box,
    Button,
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
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
    responsiveFontSizes
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '~/utils/axiosInstance';
import styles from '../OfficeManagement.module.scss';
import classNames from 'classnames/bind';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete';
import { RefreshRounded } from '@mui/icons-material';

const cx = classNames.bind(styles);

let theme = createTheme();
theme = responsiveFontSizes(theme);

const getOfficeStatus = (status) => {
    switch (status) {
        case 0:
            return { text: 'Còn trống', color: '#4CAF50' };
        case 1:
            return { text: 'Đã được thuê', color: '#F44336' };
        case 2:
            return { text: 'Không khả dụng', color: '#9E9E9E' };
        default:
            return { text: 'Không xác định', color: '#9E9E9E' };
    }
};

function OfficeManagementList() {
    const navigate = useNavigate();
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const columns = [
        { id: 'id', name: 'STT', width: 70 },
        { id: 'name', name: 'Tên văn phòng', width: 300 },
        { id: 'building', name: 'Toà nhà', width: 300 },
        { id: 'area', name: 'Diện tích (m²)', width: 150 },
        { id: 'floor', name: 'Tầng', width: 100 },
        { id: 'price', name: 'Giá ($/m²)', width: 120 },
        { id: 'note', name: 'Ghi chú', width: 200 },
        { id: 'status', name: 'Trạng thái', width: 150 },
        { id: 'action', name: 'Hành động', width: 120 }
    ];

    const statusOptions = [
        { id: 0, name: 'Còn trống', color: '#4CAF50' },
        { id: 1, name: 'Đã được thuê', color: '#F44336' },
        { id: 2, name: 'Không khả dụng', color: '#9E9E9E' }
    ];

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

    const statusSelectStyle = {
        width: '250px',
        '& .MuiOutlinedInput-root': {
            width: '250px',
            height: '40px',
            padding: '0 8px'
        },
        '& .MuiAutocomplete-input': {
            width: '250px !important',
            padding: '0'
        },
        '& .MuiInputBase-root': {
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center'
        },
        '& .MuiAutocomplete-endAdornment': {
            right: '8px'
        }
    };

    const buttonStyle = {
        textTransform: 'none',
        fontSize: '1.3rem'
    };

    const fetchBuildings = async () => {
        try {
            const response = await axiosInstance.get('/buildings/all');
            setBuildings(response.data.result);
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    };

    const getData = async (pageNumber) => {
        setLoading(true);
        try {
            let url = `/offices?page=${pageNumber - 1}`;
            if (selectedBuilding !== null)
                url += `&buildingId=${selectedBuilding.id}`;
            if (selectedStatus !== null)
                url += `&status=${selectedStatus.id}`;
            const response = await axiosInstance.get(url);
            setData(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedBuilding(null);
        setSelectedStatus(null);
        setPage(1);
        getData(1);
    };

    useEffect(() => {
        fetchBuildings();
        getData(page);
    }, [page]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Typography variant="h2" gutterBottom>
                    Danh sách Văn phòng
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
                            getOptionLabel={(option) => ""}
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
                            sx={statusSelectStyle}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder={selectedStatus ? "" : "Trạng thái"}
                                    sx={inputStyle}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: {
                                            height: '40px',
                                            padding: '0 8px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        startAdornment: selectedStatus ? (
                                            <Box
                                                sx={{
                                                    color: selectedStatus.color,
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: `${selectedStatus.color}20`,
                                                    fontSize: '1.3rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    whiteSpace: 'nowrap',
                                                    marginRight: '8px'
                                                }}
                                            >
                                                {selectedStatus.name}
                                            </Box>
                                        ) : null
                                    }}
                                />
                            )}
                        />

                        <Button
                            variant="contained"
                            onClick={() => getData(1)}
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
                        href="/admin/create-office"
                    >
                        Tạo mới&nbsp; <AddIcon />
                    </Button>
                </div>

                <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                    {loading && (
                        <Box sx={{
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
                        }}>
                            <CircularProgress />
                        </Box>
                    )}
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align="center"
                                            width={column.width}
                                            className={cx('th')}
                                        >
                                            {column.name}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center" className={cx('td')}>{index + 1}</TableCell>
                                        <TableCell align="center" className={cx('td')}>{row.name}</TableCell>
                                        <TableCell align="center" className={cx('td')}
                                        >
                                            {row.building.name}
                                        </TableCell>
                                        <TableCell align="center" className={cx('td')}>{row.area}</TableCell>
                                        <TableCell align="center" className={cx('td')}>{row.floor}</TableCell>
                                        <TableCell align="center" className={cx('td')}>{row.price}</TableCell>
                                        <TableCell align="center" className={cx('td')}>
                                            <div style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: '1.2em',
                                                maxHeight: '2.4em'
                                            }} title={row.note}>
                                                {row.note || 'Không có'}
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" className={cx('td')}>
                                            <span style={{
                                                color: getOfficeStatus(row.status).color,
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: `${getOfficeStatus(row.status).color}20`
                                            }}>
                                                {getOfficeStatus(row.status).text}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center" className={cx('td')}>
                                            <IconButton
                                                color="primary"
                                                title="Chi tiết"
                                                onClick={() => navigate(`/admin/offices/${row.id}`)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                title="Xoá"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            disabled={loading}
                        />
                    </Box>
                </Paper>
            </div>
        </ThemeProvider>
    );
}

export default OfficeManagementList;