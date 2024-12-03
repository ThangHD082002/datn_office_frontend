import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    Paper,
    Autocomplete,
    FormControl,
    ThemeProvider,
    createTheme,
    responsiveFontSizes,
    Modal,
    IconButton,
    Divider,
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { axiosInstance } from '~/utils/axiosInstance';
import classNames from 'classnames/bind';
import styles from '../BuildingManagement.module.scss';

const cx = classNames.bind(styles);
let theme = createTheme();
theme = responsiveFontSizes(theme);

function BuildingManagementEdit() {
    const { bid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        wardId: null,
        address: '',
        numberOfFloor: '',
        numberOfBasement: '',
        pricePerM2: '',
        floorHeight: '',
        floorArea: '',
        carParkingFee: '',
        motorbikeParkingFee: '',
        securityFee: '',
        cleaningFee: '',
        note: ''
    });

    // Same states as Create component
    const [selectedImage, setSelectedImage] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [oldImages, setOldImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [errors, setErrors] = useState({
        name: false,
        address: false,
        wardId: false,
        numberOfFloor: false,
        numberOfBasement: false,
        pricePerM2: false,
        floorHeight: false,
        floorArea: false,
        carParkingFee: false,
        motorbikeParkingFee: false,
        securityFee: false,
        cleaningFee: false
    });

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axiosInstance.get(`/districts?provinceId=${provinceId}`);
            setDistricts(response.data);
            setSelectedDistrict(null);
            setWards([]);
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
        }
    };

    const handleImageAdded = (event) => {
        const files = Array.from(event.target.files);

        // Add new files to newImages array
        setNewImages(prev => [...prev, ...files]);

        // Create preview URLs for new files
        const previews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...previews]);

        // Reset input
        event.target.value = '';
    };

    // Handle deleting existing images
    const handleDeleteOldImage = (imageId) => {
        setOldImages(prev => prev.filter(img => img.id !== imageId));
        setDeletedImageIds(prev => [...prev, imageId]);
    };

    // Handle deleting new images
    const handleDeleteNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axiosInstance.get(`/wards?districtId=${districtId}`);
            setWards(response.data);
        } catch (error) {
            console.error('Error fetching wards:', error);
            setWards([]);
        }
    };

    // Add form validation
    const validateForm = () => {
        const newErrors = {
            name: !formData.name,
            address: !formData.address,
            wardId: !formData.wardId,
            numberOfFloor: !formData.numberOfFloor,
            numberOfBasement: !formData.numberOfBasement,
            pricePerM2: !formData.pricePerM2,
            floorHeight: !formData.floorHeight,
            floorArea: !formData.floorArea,
            carParkingFee: !formData.carParkingFee,
            motorbikeParkingFee: !formData.motorbikeParkingFee,
            securityFee: !formData.securityFee,
            cleaningFee: !formData.cleaningFee
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    // Fetch building data on mount
    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/buildings/${bid}`);
                const building = response.data.result;
                console.log(building);
                // Set form data
                setFormData({
                    id: building.id,
                    name: building.name,
                    wardId: building.wardId,
                    address: building.address,
                    numberOfFloor: building.numberOfFloor,
                    numberOfBasement: building.numberOfBasement,
                    pricePerM2: building.pricePerM2,
                    floorHeight: building.floorHeight,
                    floorArea: building.floorArea,
                    carParkingFee: building.carParkingFee,
                    motorbikeParkingFee: building.motorbikeParkingFee,
                    securityFee: building.securityFee,
                    cleaningFee: building.cleaningFee,
                    note: building.note || ''
                });

                // Set location data
                const province = building.ward.district.province;
                const district = building.ward.district;
                const ward = building.ward;

                setSelectedProvince(province);
                await fetchDistricts(province.id);
                setSelectedDistrict(district);
                await fetchWards(district.id);
                setSelectedWard(ward);

                // Set images
                if (building.images) {
                    setOldImages(building.images);
                }

            } catch (error) {
                console.error('Error fetching building:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBuilding();
    }, [bid]);

    // Same validation and other helper functions as Create

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            setLoading(true);

            const formDataToSend = new FormData();

            const dataToSend = {
                ...formData,
                deletedImages: deletedImageIds
            };

            formDataToSend.append('data', new Blob([JSON.stringify(dataToSend)], {
                type: 'application/json'
            }));

            newImages.forEach(image => {
                formDataToSend.append('newImages', image);
            });

            await axiosInstance.put(`/buildings`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/admin/buildings');
        } catch (error) {
            console.error('Error updating building:', error);
        } finally {
            setLoading(false);
        }
    };

    // Rest of the component (JSX) is identical to Create component
    // Just change the title and button text
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ maxWidth: '100%', mx: 'auto', p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem', mb: 3 }}>
                    Chỉnh sửa Toà nhà
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                    {/* Left Column - Basic Info */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Thông tin cơ bản
                            </Typography>
                            <TextField
                                fullWidth
                                label="Tên toà nhà"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, name: e.target.value }));
                                    setErrors(prev => ({ ...prev, name: false }));
                                }}
                                error={errors.name}
                                helperText={errors.name ? "Vui lòng nhập tên toà nhà" : ""}
                                sx={{ mb: 3 }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Ghi chú"
                                value={formData.note}
                                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                                sx={{ mb: 3 }}
                            />
                        </Paper>

                        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Địa chỉ
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            options={provinces}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedProvince}
                                            onChange={(event, newValue) => {
                                                setSelectedProvince(newValue);
                                                setFormData(prev => ({ ...prev, wardId: null }));
                                                if (newValue) {
                                                    fetchDistricts(newValue.id);
                                                } else {
                                                    setDistricts([]);
                                                    setWards([]);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Tỉnh/Thành phố" />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            options={districts}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedDistrict}
                                            disabled={!selectedProvince}
                                            onChange={(event, newValue) => {
                                                setSelectedDistrict(newValue);
                                                setFormData(prev => ({ ...prev, wardId: null }));
                                                if (newValue) {
                                                    fetchWards(newValue.id);
                                                } else {
                                                    setWards([]);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Quận/Huyện" />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            required
                                            options={wards}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedWard}
                                            disabled={!selectedDistrict}
                                            onChange={(event, newValue) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    wardId: newValue ? newValue.id : null
                                                }));
                                                setErrors(prev => ({ ...prev, wardId: false }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Xã/Phường"
                                                    error={errors.wardId}
                                                    helperText={errors.wardId ? "Vui lòng chọn phường/xã" : ""}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Địa chỉ"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Right Column - Building Details */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Thông tin chi tiết
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Số tầng"
                                        type="number"
                                        value={formData.numberOfFloor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, numberOfFloor: Number(e.target.value) }))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Số tầng hầm"
                                        type="number"
                                        value={formData.numberOfBasement}
                                        onChange={(e) => setFormData(prev => ({ ...prev, numberOfBasement: Number(e.target.value) }))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Giá/m²"
                                        type="number"
                                        value={formData.pricePerM2}
                                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerM2: Number(e.target.value) }))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Chiều cao tầng (m)"
                                        type="number"
                                        value={formData.floorHeight}
                                        onChange={(e) => setFormData(prev => ({ ...prev, floorHeight: Number(e.target.value) }))}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Diện tích sàn (m²)"
                                        type="number"
                                        value={formData.floorArea}
                                        onChange={(e) => setFormData(prev => ({ ...prev, floorArea: Number(e.target.value) }))}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Phí dịch vụ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Phí gửi ô tô"
                                        type="number"
                                        value={formData.carParkingFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, carParkingFee: Number(e.target.value) }))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Phí gửi xe máy"
                                        type="number"
                                        value={formData.motorbikeParkingFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, motorbikeParkingFee: Number(e.target.value) }))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Phí an ninh"
                                        type="number"
                                        value={formData.securityFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, securityFee: Number(e.target.value) }))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Phí vệ sinh"
                                        type="number"
                                        value={formData.cleaningFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, cleaningFee: Number(e.target.value) }))}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Images Section - Full Width */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Hình ảnh
                            </Typography>
                            <input
                                accept="image/*"
                                type='file'
                                multiple
                                onChange={handleImageAdded}
                                id='raised-button-file'
                                style={{ marginBottom: '20px' }}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="outlined" component="span">
                                    Tải lên
                                </Button>
                            </label>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 2 }}>
                                {oldImages?.map((image) => (
                                    <Box
                                        key={image.id}
                                        sx={{
                                            position: 'relative',
                                            '&:hover .delete-btn': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <IconButton
                                            className="delete-btn"
                                            onClick={() => handleDeleteOldImage(image.id)}
                                            sx={{
                                                position: 'absolute',
                                                right: -10,
                                                top: -10,
                                                backgroundColor: 'white',
                                                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                }
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                        <img
                                            src={image.url}
                                            alt={`Building ${image.id}`}
                                            onClick={() => setSelectedImage(image.url)}
                                            title={image.url}
                                            style={{
                                                width: '200px',
                                                height: '200px',
                                                objectFit: 'cover',
                                                border: '2px solid #fff',
                                                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                                {/* New images preview */}
                                {newImagePreviews.map((url, index) => (
                                    <Box key={index} sx={{ position: 'relative' }}>
                                        <IconButton
                                            onClick={() => handleDeleteNewImage(index)}
                                            sx={{
                                                position: 'absolute',
                                                right: -10,
                                                top: -10,
                                                backgroundColor: 'white',
                                                '&:hover': { backgroundColor: 'white' }
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <img
                                            src={url}
                                            alt={`New preview ${index + 1}`}
                                            style={{
                                                width: '200px',
                                                height: '200px',
                                                objectFit: 'cover',
                                                border: '2px solid #fff',
                                                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>

                            {/* Image Viewer Modal */}
                            <Modal Modal
                                open={!!selectedImage}
                                onClose={() => setSelectedImage(null)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box sx={{
                                    position: 'relative',
                                    maxWidth: '90vw',
                                    maxHeight: '90vh',
                                }}>
                                    <IconButton
                                        onClick={() => setSelectedImage(null)}
                                        sx={{
                                            position: 'absolute',
                                            right: -40,
                                            top: -40,
                                            color: 'white'
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <img
                                        src={selectedImage}
                                        alt="Full size preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '90vh',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                            </Modal>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
                            onClick={() => navigate('/admin/buildings')}
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
                            Cập nhật
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default BuildingManagementEdit;