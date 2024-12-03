import { Box, Button, Divider, FormControl, Grid, Paper, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '~/utils/axiosInstance';

function OfficeManagementCreate() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        area: '',
        floor: '',
        price: '',
        note: '',
        buildingId: null
    });
    const [errors, setErrors] = useState({});

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    useEffect(() => {
        fetchBuildings();
    }, []);

    const fetchBuildings = async () => {
        try {
            const response = await axiosInstance.get('/buildings/all');
            setBuildings(response.data.result);
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {
            name: !formData.name,
            area: !formData.area,
            floor: !formData.floor,
            price: !formData.price,
            buildingId: !formData.buildingId
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            await axiosInstance.post('/offices', formData);
            navigate('/admin/offices');
        } catch (error) {
            console.error('Error creating office:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ maxWidth: '100%', mx: 'auto', p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem', mb: 3 }}>
                    Tạo Văn phòng mới
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Paper elevation={3} sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    options={buildings}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedBuilding}
                                    onChange={(event, newValue) => {
                                        setSelectedBuilding(newValue);
                                        setFormData(prev => ({
                                            ...prev,
                                            buildingId: newValue?.id || null
                                        }));
                                        setErrors(prev => ({ ...prev, buildingId: false }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Chọn toà nhà"
                                            required
                                            error={errors.buildingId}
                                            helperText={errors.buildingId ? "Vui lòng chọn toà nhà" : ""}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Tên văn phòng"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, name: e.target.value }));
                                    setErrors(prev => ({ ...prev, name: false }));
                                }}
                                error={errors.name}
                                helperText={errors.name ? "Vui lòng nhập tên văn phòng" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Diện tích (m²)"
                                type="number"
                                value={formData.area}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, area: e.target.value }));
                                    setErrors(prev => ({ ...prev, area: false }));
                                }}
                                error={errors.area}
                                helperText={errors.area ? "Vui lòng nhập diện tích" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Tầng"
                                type="number"
                                value={formData.floor}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, floor: e.target.value }));
                                    setErrors(prev => ({ ...prev, floor: false }));
                                }}
                                error={errors.floor}
                                helperText={errors.floor ? "Vui lòng nhập tầng" : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Giá ($/m²)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, price: e.target.value }));
                                    setErrors(prev => ({ ...prev, price: false }));
                                }}
                                error={errors.price}
                                helperText={errors.price ? "Vui lòng nhập giá" : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Ghi chú"
                                value={formData.note}
                                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
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
                                onClick={() => navigate('/admin/offices')}
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
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Tạo văn phòng
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default OfficeManagementCreate;