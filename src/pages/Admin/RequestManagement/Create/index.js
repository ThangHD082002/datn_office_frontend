import { Autocomplete, Box, Button, createTheme, Divider, FormControl, Grid, Paper, responsiveFontSizes, Stack, TextField, ThemeProvider, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import styles from '../RequestManagement.module.scss';
import classNames from 'classnames/bind';
import { axiosInstance } from '~/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

let theme = createTheme();
theme = responsiveFontSizes(theme);

function RequestManagementCreate() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        buildingId: null,
        officeIds: [],
        date: null,
        time: null,
        note: ''
    });
    const [buildings, setBuildings] = useState([]);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('/buildings/all');
                setBuildings(response.data);
            } catch (error) {
                console.error('Error fetching buildings:', error);
                setBuildings([]);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/users');
                const usersData = Array.isArray(response.data) ? response.data : response.data.content;
                setUsers(usersData || []);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };

        fetchBuildings();
        fetchUsers();
    }, []);

    // Fetch offices when building is selected
    const fetchOffices = async (buildingId) => {
        if (!buildingId) {
            setOffices([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/offices?status=0&buildingId=${buildingId}`);
            const officesData = Array.isArray(response.data) ? response.data : response.data.content;
            setOffices(officesData || []);
        } catch (error) {
            console.error('Error fetching offices:', error);
            setOffices([]);
        }
    };

    // Time validation
    const isTimeAllowed = (time) => {
        if (!time) return false;
        const hours = time.hour();
        const minutes = time.minute();
        const totalMinutes = hours * 60 + minutes;
        return totalMinutes >= 480 && totalMinutes <= 990; // 8:00 - 16:30
    };

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
                    <Typography variant="h2" gutterBottom>Tạo Yêu cầu mới</Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} md={8}>
                            {/* Location Section */}
                            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6" gutterBottom>Thông tin địa điểm</Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <Autocomplete
                                        options={buildings || []}
                                        getOptionLabel={(option) => option.name || ''}
                                        onChange={(event, newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                buildingId: newValue?.id || null,
                                                officeIds: []
                                            }));
                                            fetchOffices(newValue?.id);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Chọn toà nhà" />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        multiple
                                        options={offices || []}
                                        getOptionLabel={(option) =>
                                            `${option.name || ''} - Tầng ${option.floor || ''} - ${option.area || ''}m²`
                                        }
                                        disabled={!formData.buildingId}
                                        onChange={(event, newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                officeIds: newValue.map(office => office?.id).filter(Boolean)
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Chọn văn phòng" />
                                        )}
                                    />
                                </FormControl>
                            </Paper>

                            {/* User Section */}
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Thông tin người xem</Typography>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        options={users || []}
                                        getOptionLabel={(option) =>
                                            `${option.firstName || ''} ${option.lastName || ''}`
                                        }
                                        onChange={(event, newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                userId: newValue?.id || null
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Chọn người xem" />
                                        )}
                                    />
                                </FormControl>
                            </Paper>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2 }} >
                                <Typography variant="h6" gutterBottom>Thông tin lịch hẹn</Typography>
                                <DatePicker
                                    label="Ngày xem"
                                    value={formData.date}
                                    onChange={(newValue) => {
                                        setFormData(prev => ({ ...prev, date: newValue }));
                                    }}
                                    minDate={dayjs()}
                                    sx={{ width: '100%', mb: 2 }}
                                />
                                <TimePicker
                                    label="Giờ xem"
                                    value={formData.time}
                                    onChange={(newValue) => {
                                        setFormData(prev => ({ ...prev, time: newValue }));
                                    }}
                                    shouldDisableTime={(value) => !isTimeAllowed(value)}
                                    sx={{ width: '100%', mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Ghi chú"
                                    value={formData.note}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        note: e.target.value
                                    }))}
                                />
                            </Paper>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                sx={{
                                    width: '200px',
                                    color: '#B7272D',
                                    borderColor: '#B7272D',
                                    '&:hover': {
                                        borderColor: '#7A1A1E',
                                        color: '#7A1A1E'
                                    }
                                }}
                                onClick={() => navigate('/admin/requests')}
                            >
                                Quay lại
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    width: '200px',
                                    bgcolor: '#B7272D',
                                    '&:hover': {
                                        bgcolor: '#7A1A1E'
                                    }
                                }}
                                onClick={async () => {
                                    try {
                                        setLoading(true);

                                        const requestBody = {
                                            ...formData,
                                            date: formData.date ? formData.date.format('YYYY-MM-DD') : null,
                                            time: formData.time ? formData.time.format('HH:mm:ss') : null
                                        };
                                        await axiosInstance.post('/requests', requestBody)
                                            // await axios.post('http://localhost:9999/api/requests', requestBody)
                                            .then(() => {
                                                navigate('/admin/requests');
                                            }).catch(error => {
                                                console.error('Error creating request:', error);
                                            });
                                        console.log('formData:', requestBody);
                                    } catch (error) {
                                        console.error('Error creating request:', error);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                            >
                                Tạo yêu cầu
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default RequestManagementCreate;