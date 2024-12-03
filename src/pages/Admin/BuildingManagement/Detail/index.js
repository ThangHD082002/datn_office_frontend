import { Box, Divider, Grid, IconButton, Modal, Paper, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, ThemeProvider, Typography, createTheme, responsiveFontSizes } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '~/utils/axiosInstance';
import CloseIcon from '@mui/icons-material/Close';

function BuildingManagementDetail() {
    const { bid } = useParams();
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getOfficeStatus = (status) => {
        switch (status) {
            case 0:
                return { text: 'Trống', color: '#4CAF50' };
            case 1:
                return { text: 'Đã thuê', color: '#F44336' };
            default:
                return { text: 'Không xác định', color: '#9E9E9E' };
        }
    };

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                const response = await axiosInstance.get(`/buildings/${bid}`);
                console.log('Building:', response.data.result);
                setBuilding(response.data.result);
            } catch (error) {
                console.error('Error fetching building:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBuilding();
    }, [bid]);

    if (loading) return <Box>Loading...</Box>;
    if (!building) return <Box>Building not found</Box>;

    const LabelValue = ({ label, value, unit }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">
                {value} {unit}
            </Typography>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '1600px', mx: 'auto', p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem', mb: 3 }}>
                    Chi tiết toà nhà
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ mb: 3 }}
                >
                    <Tab label="Thông tin chi tiết" />
                    <Tab label="Danh sách văn phòng" />
                </Tabs>

                {activeTab === 0 ? (
                    <>
                        <Grid container spacing={3}>
                            {/* Left Column - Basic Info */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                        Thông tin cơ bản
                                    </Typography>
                                    <LabelValue label="Tên toà nhà" value={building.name} />
                                    <LabelValue label="Ghi chú" value={building.note || 'Không có'} />
                                </Paper>

                                <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                        Địa chỉ
                                    </Typography>
                                    <LabelValue
                                        label="Địa chỉ đầy đủ"
                                        value={`${building.address}, ${building.ward.name}, ${building.ward.district.name}, ${building.ward.district.province.name}`}
                                    />
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
                                            <LabelValue label="Số tầng" value={building.numberOfFloor} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LabelValue label="Số tầng hầm" value={building.numberOfBasement} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LabelValue label="Giá/m²" value={building.pricePerM2} unit="$" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LabelValue label="Chiều cao tầng" value={building.floorHeight} unit="m" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <LabelValue label="Diện tích sàn" value={building.floorArea} unit="m²" />
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={3} sx={{ p: 4 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                        Phí dịch vụ
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <LabelValue label="Phí gửi ô tô" value={building.carParkingFee} unit="$" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LabelValue label="Phí gửi xe máy" value={building.motorbikeParkingFee} unit="$" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LabelValue label="Phí an ninh" value={building.securityFee} unit="$" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <LabelValue label="Phí vệ sinh" value={building.cleaningFee} unit="$" />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Images Section */}
                            {building.images && building.images.length > 0 && (
                                <Grid item xs={12}>
                                    <Paper elevation={3} sx={{ p: 4 }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                            Hình ảnh
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            {building.images.map((image, index) => (
                                                <img
                                                    key={image.id}
                                                    src={image.url}
                                                    onClick={() => setSelectedImage(image.url)}
                                                    alt={`Building ${index + 1}`}
                                                    style={{
                                                        width: '200px',
                                                        height: '200px',
                                                        objectFit: 'cover',
                                                        border: '2px solid #fff',
                                                        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                        <Modal
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
                    </>) : (
                    <>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                    Danh sách văn phòng
                                </Typography>
                                <Box sx={{
                                    overflowX: 'auto',
                                    '& .MuiTable-root': {
                                        minWidth: 650
                                    }
                                }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Tên</TableCell>
                                                <TableCell align="center">Tầng</TableCell>
                                                <TableCell align="center">Diện tích (m²)</TableCell>
                                                <TableCell align="center">Giá ($/m²)</TableCell>
                                                <TableCell align="center">Ghi chú</TableCell>
                                                <TableCell align="center">Trạng thái</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {building.officeDTOS?.map((office) => (
                                                <TableRow key={office.id}>
                                                    <TableCell align="center">{office.name}</TableCell>
                                                    <TableCell align="center">{office.floor}</TableCell>
                                                    <TableCell align="center">{office.area}</TableCell>
                                                    <TableCell align="center">{office.price}</TableCell>
                                                    <TableCell align="center">{office.note || 'Không có'}</TableCell>
                                                    <TableCell align="center">
                                                        <span style={{
                                                            color: getOfficeStatus(office.status).color,
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            backgroundColor: `${getOfficeStatus(office.status).color}20`
                                                        }}>
                                                            {getOfficeStatus(office.status).text}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Paper>
                        </Grid>
                    </>)}
            </Box>

        </ThemeProvider>
    );
}

export default BuildingManagementDetail;