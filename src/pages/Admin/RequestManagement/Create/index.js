import { Autocomplete, Box, Button, createTheme, Divider, FormControl, responsiveFontSizes, TextField, ThemeProvider, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import styles from '../RequestManagement.module.scss';
import classNames from 'classnames/bind';
import { axiosInstance } from '~/utils/axiosInstance';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

let theme = createTheme();
theme = responsiveFontSizes(theme);

function RequestManagementCreate() {
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
        fetchBuildings();
    }, []);

    // Fetch offices when building is selected
    const fetchOffices = async (buildingId) => {
        if (!buildingId) {
            setOffices([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/offices?buildingId=${buildingId}`);
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
                <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
                    <Typography variant="h2" gutterBottom>Tạo Yêu cầu mới</Typography>
                    <Divider sx={{ mb: 3 }} />

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

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Autocomplete
                            multiple
                            options={offices || []}
                            getOptionLabel={(option) =>
                                option ? `${option.name || ''} - Tầng ${option.floor || ''} - ${option.area || ''}m²` : ''
                            }
                            disabled={!formData.buildingId}
                            value={offices.filter(office => formData.officeIds.includes(office.id))}
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

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <DatePicker
                            label="Ngày xem"
                            value={formData.date}
                            onChange={(newValue) => {
                                setFormData(prev => ({ ...prev, date: newValue }));
                            }}
                            minDate={dayjs()}
                            sx={{ flex: 1 }}
                        />

                        <TimePicker
                            label="Giờ xem"
                            value={formData.time}
                            onChange={(newValue) => {
                                setFormData(prev => ({ ...prev, time: newValue }));
                            }}
                            shouldDisableTime={(value) => !isTimeAllowed(value)}
                            sx={{ flex: 1 }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Ghi chú"
                        value={formData.note}
                        onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={async () => {
                            try {
                                setLoading(true);
                                await axiosInstance.post('/requests', formData);
                                // Handle success (redirect or show message)
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
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default RequestManagementCreate;