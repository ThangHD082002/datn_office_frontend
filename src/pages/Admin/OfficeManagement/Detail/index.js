import { Box, Divider, Grid, Paper, ThemeProvider, Typography, createTheme, responsiveFontSizes } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '~/utils/axiosInstance';

function OfficeManagementDetail() {
    const { oid } = useParams();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const getOfficeStatus = (status) => {
        switch (status) {
            case 0:
                return { text: 'Trống', color: '#4CAF50' };
            case 1:
                return { text: 'Đã thuê', color: '#F44336' };
            case 2:
                return { text: 'Không khả dụng', color: '#9E9E9E' };
            default:
                return { text: 'Không xác định', color: '#9E9E9E' };
        }
    };

    useEffect(() => {
        const fetchOffice = async () => {
            try {
                const response = await axiosInstance.get(`/offices/${oid}`);
                setOffice(response.data);
            } catch (error) {
                console.error('Error fetching office:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffice();
    }, [oid]);

    if (loading) return <Box>Loading...</Box>;
    if (!office) return <Box>Office not found</Box>;

    const LabelValue = ({ label, value, unit, isStatus, labelProps, valueProps }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" {...labelProps}>
                {label}
            </Typography>
            {isStatus ? (
                <span style={{
                    color: getOfficeStatus(value).color,
                    padding: '8px 16px',
                    borderRadius: '4px',
                    backgroundColor: `${getOfficeStatus(value).color}20`,
                    fontSize: '1.4rem',
                    display: 'inline-block',
                    marginTop: '8px'
                }}>
                    {getOfficeStatus(value).text}
                </span>
            ) : (
                <Typography variant="body1" {...valueProps}>
                    {value} {unit}
                </Typography>
            )}
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ maxWidth: '100%', mx: 'auto', p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem', mb: 3 }}>
                    Chi tiết văn phòng
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                    {/* Left Column - Office Info */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{
                            p: 4,
                            mb: 3,
                            overflow: 'auto'
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '2rem', mb: 4 }}>
                                Thông tin văn phòng
                            </Typography>
                            <Box sx={{ '& > *': { mb: 4 } }}> {/* Add more spacing between items */}
                                <LabelValue
                                    label="Tên văn phòng"
                                    value={office.name}
                                    labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                    valueProps={{ sx: { fontSize: '1.4rem' } }}
                                />
                                <LabelValue
                                    label="Diện tích"
                                    value={office.area}
                                    unit="m²"
                                    labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                    valueProps={{ sx: { fontSize: '1.4rem' } }}
                                />
                                <LabelValue label="Tầng"
                                    value={office.floor}
                                    labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                    valueProps={{ sx: { fontSize: '1.4rem' } }}
                                />
                                <LabelValue
                                    label="Giá"
                                    value={office.price}
                                    unit="$/m²"
                                    labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                    valueProps={{ sx: { fontSize: '1.4rem' } }}
                                />
                                <LabelValue
                                    label="Ghi chú"
                                    value={office.note || 'Không có'}
                                    labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                    valueProps={{ sx: { fontSize: '1.4rem' } }}
                                />
                                <LabelValue
                                    label="Trạng thái"
                                    value={office.status}
                                    isStatus={true}
                                    labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                    valueProps={{ sx: { fontSize: '1.4rem' } }}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column - Building Info */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '2rem', mb: 3 }}>
                                Thông tin toà nhà
                            </Typography>
                            <LabelValue
                                label="Tên toà nhà"
                                value={office.building.name}
                                labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                valueProps={{ sx: { fontSize: '1.4rem' } }}
                            />
                            <LabelValue
                                label="Địa chỉ"
                                value={`${office.building.address}, ${office.building.ward.name}, ${office.building.ward.district.name}, ${office.building.ward.district.province.name}`}
                                labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                valueProps={{ sx: { fontSize: '1.4rem' } }}
                            />
                            <LabelValue label="Số tầng"
                                value={office.building.numberOfFloor}
                                labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                valueProps={{ sx: { fontSize: '1.4rem' } }}
                            />
                            <LabelValue
                                label="Giá/m²"
                                value={office.building.pricePerM2}
                                unit="$"
                                labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                valueProps={{ sx: { fontSize: '1.4rem' } }}
                            />
                            <LabelValue
                                label="Phí gửi ô tô"
                                value={office.building.carParkingFee}
                                unit="$"
                                labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                valueProps={{ sx: { fontSize: '1.4rem' } }}
                            />
                            <LabelValue
                                label="Phí gửi xe máy"
                                value={office.building.motorbikeParkingFee}
                                unit="$"
                                labelProps={{ sx: { fontSize: '1.8rem', mb: 1 } }}
                                valueProps={{ sx: { fontSize: '1.4rem' } }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default OfficeManagementDetail;