import {
    Autocomplete,
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    TextField
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
import { RefreshRounded } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
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
    const [keyword, setKeyword] = useState('');
    const [searchProvince, setSearchProvince] = useState(null);
    const [searchDistrict, setSearchDistrict] = useState(null);
    const [searchWard, setSearchWard] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const columns = [
        { id: 'id', name: 'STT', width: 20 },
        { id: 'name', name: 'Tên', width: 200 },
        { id: 'address', name: 'Địa chỉ', width: 300 },
        { id: 'floorArea', name: 'Diện tích sàn', width: 130 },
        { id: 'numberOfFloor', name: 'Số tầng', width: 100 },
        { id: 'numberOfBasement', name: 'Số hầm', width: 100 },
        { id: 'pricePerM2', name: 'Giá/m<sup>2</sup>', width: 100 },
        { id: 'note', name: 'Ghi chú', width: 500 },
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

    const handleSearch = () => {
        setPage(1); // Reset to page 1
        getData(1);
    };

    // Update handleReset
    const handleReset = () => {
        setKeyword('');
        setSearchProvince(null);
        setSearchDistrict(null);
        setSearchWard(null);
        setProvinces([]);
        setDistricts([]);
        setWards([]);
        setPage(1); // Reset to page 1
        getData(1);
    };

    // Add fetch functions
    const fetchProvinces = async () => {
        try {
            const response = await axiosInstance.get('/provinces');
            setProvinces(response.data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axiosInstance.get(`/districts?provinceId=${provinceId}`);
            setDistricts(response.data);
            setSearchDistrict(null);
            setWards([]);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axiosInstance.get(`/wards?districtId=${districtId}`);
            setWards(response.data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    const getData = async (pageNumber) => {
        setLoading(true)
        try {
            let url = `/buildings/manage-list?page=${pageNumber - 1}`;
            // Add query params
            if (keyword !== null && keyword.trim() !== '')
                url += `&keyword=${keyword}`;
            if (searchWard?.id)
                url += `&wardId=${searchWard.id}`;
            else if (searchDistrict?.id)
                url += `&districtId=${searchDistrict.id}`;
            else if (searchProvince?.id)
                url += `&provinceId=${searchProvince.id}`;

            const response = await axiosInstance.get(url);

            setData(response.data.result.content)
            setTotalPages(response.data.result.totalPages)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = async (id) => {
        try {
            setDeleteLoading(true);
            const response = await axiosInstance.delete(`/buildings/${id}`);
            if (response.status === 204) {
                setDeleteDialog(false);
                getData(page); // Refresh current page
            }
        } catch (error) {
            console.error('Error deleting building:', error);
        } finally {
            setDeleteLoading(false);
            setDeletingId(null);
        }
    };
    useEffect(() => {
        fetchProvinces(); // Fetch provinces when the component mounts
        getData(page)   // Fetch data when the component mounts
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
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <TextField
                            size="small"
                            placeholder="Tìm kiếm..."
                            value={keyword}
                            sx={inputStyle}
                            onChange={(e) => setKeyword(e.target.value)}
                        />

                        <Autocomplete
                            size="small"
                            options={provinces}
                            getOptionLabel={(option) => option.name}
                            value={searchProvince}
                            onChange={(event, newValue) => {
                                setSearchProvince(newValue);
                                if (newValue) {
                                    fetchDistricts(newValue.id);
                                } else {
                                    setDistricts([]);
                                    setWards([]);
                                }
                            }}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <span style={{ fontSize: '1.3rem' }}>
                                        {option.name}
                                    </span>
                                </li>
                            )}
                            sx={autocompleteStyle}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Tỉnh/Thành phố" sx={inputStyle} />
                            )}
                        />

                        <Autocomplete
                            size="small"
                            options={districts}
                            getOptionLabel={(option) => option.name}
                            value={searchDistrict}
                            disabled={!searchProvince}
                            onChange={(event, newValue) => {
                                setSearchDistrict(newValue);
                                if (newValue) {
                                    fetchWards(newValue.id);
                                } else {
                                    setWards([]);
                                }
                            }}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <span style={{ fontSize: '1.3rem' }}>
                                        {option.name}
                                    </span>
                                </li>
                            )}
                            sx={autocompleteStyle}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Quận/Huyện" sx={inputStyle} />
                            )}
                        />

                        <Autocomplete
                            size="small"
                            options={wards}
                            getOptionLabel={(option) => option.name}
                            value={searchWard}
                            disabled={!searchDistrict}
                            onChange={(event, newValue) => {
                                setSearchWard(newValue);
                            }}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <span style={{ fontSize: '1.3rem' }}>
                                        {option.name}
                                    </span>
                                </li>
                            )}
                            sx={autocompleteStyle}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Phường/Xã" sx={inputStyle} />
                            )}
                        />

                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            className={cx('btn-search')}
                        >
                            Tìm kiếm
                        </Button>

                        <IconButton onClick={handleReset} title="Làm mới" sx={{
                            '& .MuiSvgIcon-root': {
                                fontSize: '2rem'
                            }
                        }}>
                            <RefreshRounded />
                        </IconButton>
                    </div>
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
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align} width={column.width} className={cx('th')}>
                                            <span dangerouslySetInnerHTML={{ __html: column.name }} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell className={cx('td')}>{index + 1}</TableCell>
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


                                            <IconButton color="success" title="Sửa" onClick={() =>
                                                navigate(`/admin/edit-buildings/${row.id}`)}>
                                                <EditIcon />
                                            </IconButton>


                                            <IconButton
                                                color="error"
                                                title="Xoá"
                                                onClick={() => {
                                                    setDeletingId(row.id);
                                                    setDeleteDialog(true);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <Dialog
                                                open={deleteDialog}
                                                onClose={() => {
                                                    setDeleteDialog(false);
                                                    setDeletingId(null);
                                                }}
                                                PaperProps={{
                                                    style: {
                                                        boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.2)'
                                                    }
                                                }}
                                                sx={{
                                                    '& .MuiBackdrop-root': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                                                }}
                                            >
                                                <DialogTitle>Xác nhận xoá</DialogTitle>
                                                <DialogContent>
                                                    Bạn có chắc chắn muốn xoá toà nhà này?
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button
                                                        onClick={() => {
                                                            setDeleteDialog(false);
                                                            setDeletingId(null);
                                                        }}
                                                    >
                                                        Huỷ
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        onClick={() => handleDelete(deletingId)}
                                                        disabled={deleteLoading}
                                                    >
                                                        {deleteLoading ? 'Đang xoá...' : 'Xoá'}
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
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
