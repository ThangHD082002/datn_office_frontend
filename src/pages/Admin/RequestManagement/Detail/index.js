import { Box, Divider, Grid, Paper, ThemeProvider, Typography, createTheme, responsiveFontSizes } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '~/utils/axiosInstance';
import dayjs from 'dayjs';

function RequestManagementDetail() {
    const { rid } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const getRequestStatus = (status) => {
        switch (status) {
            case 0:
                return { text: 'Chờ duyệt', color: '#FF9800' };
            case 1:
                return { text: 'Đã duyệt', color: '#4CAF50' };
            case 2:
                return { text: 'Từ chối', color: '#F44336' };
            default:
                return { text: 'Không xác định', color: '#9E9E9E' };
        }
    };

    const LabelValue = ({ label, value, unit }) => (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ fontSize: '1.4rem', mb: 1 }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{ fontSize: '1.6rem' }}
            >
                {value || 'Không có'} {unit}
            </Typography>
        </Box>
    );

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await axiosInstance.get(`/requests/${rid}`);
                setRequest(response.data);
            } catch (error) {
                console.error('Error fetching request:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [rid]);

    if (loading) return <Box>Loading...</Box>;
    if (!request) return <Box>Request not found</Box>;

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                width: '100vw',
                minWidth: '100%',
                margin: '-12px',  // Offset default MUI container padding
                padding: '24px',
                boxSizing: 'border-box'
            }}>
                <Typography variant="h2" gutterBottom>Chi tiết yêu cầu</Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                    sx={{
                        width: '80%',
                        margin: 0,
                        '& > .MuiGrid-item': {
                            paddingTop: 0
                        }
                    }}
                >
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{
                            p: 4,
                            mb: 3,
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Thông tin địa điểm
                            </Typography>
                            <LabelValue
                                label="Toà nhà"
                                value={request.buildingDTO?.name}
                            />
                            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.4rem', mb: 1 }}>
                                Văn phòng đăng ký xem:
                            </Typography>
                            {request.officeDTOs?.map((office, index) => (
                                <Box key={office.id} sx={{ ml: 2, mb: 2 }}>
                                    <Typography sx={{ fontSize: '1.4rem' }}>
                                        {`${index + 1}. ${office.name} - Tầng ${office.floor} - ${office.area}m²`}
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>

                        {/* User Section */}
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Thông tin người xem
                            </Typography>
                            <LabelValue
                                label="Người xem"
                                value={request.userDTO?.fullName}
                            />
                        </Paper>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={4} sx={{ width: '100%' }}>
                        <Paper elevation={3} sx={{
                            p: 4,
                            width: '100%'
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                                Thông tin lịch hẹn
                            </Typography>
                            <LabelValue
                                label="Ngày xem"
                                value={request.date ? dayjs(request.date).format('DD/MM/YYYY') : 'Chưa đặt'}
                            />
                            <LabelValue
                                label="Giờ xem"
                                value={request.time || 'Chưa đặt'}
                            />
                            <LabelValue
                                label="Ghi chú"
                                value={request.note || 'Không có'}
                            />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.4rem', mb: 1 }}>
                                    Trạng thái
                                </Typography>
                                <span style={{
                                    color: getRequestStatus(request.status).color,
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    backgroundColor: `${getRequestStatus(request.status).color}20`,
                                    fontSize: '1.4rem'
                                }}>
                                    {getRequestStatus(request.status).text}
                                </span>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default RequestManagementDetail;