import { Box, Button, Divider, Grid, Modal, Paper, TextField, ThemeProvider, Typography, createTheme, responsiveFontSizes } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '~/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function RequestManagementDetail() {
    const navigate = useNavigate();

    const { rid } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const getRequestStatus = (status) => {
        switch (status) {
            case 0:
                return { text: 'Đang chờ xử lý', color: '#FF9800' }
            case 1:
                return { text: 'Đã chấp thuận', color: '#4CAF50' }
            case 2:
                return { text: 'Đã hoàn thành', color: '#2196F3' }
            case 3:
                return { text: 'Đã từ chối', color: '#F44336' }
            default:
                return { text: 'Huỷ bỏ', color: '#9E9E9E' }
        }
    };

    //region Status Handlers
    // Handle Accept
    const [modalOpen, setModalOpen] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState(dayjs());
    const [appointmentTime, setAppointmentTime] = useState(dayjs());
    const handleModalClose = () => setModalOpen(false);
    const handleApprove = () => {
        setModalOpen(true);
    };
    const handleConfirmAccept = async () => {
        try {
            const response = await axiosInstance.post(`/requests/handle-accept/${rid}`, {
                date: appointmentDate,
                time: appointmentTime
            });
            // Handle success (e.g., update UI, show notification)
        } catch (error) {
            console.error('Error handling accept:', error);
            // Handle error (e.g., show error notification)
        } finally {
            setModalOpen(false);
            window.location.reload();
        }
    };

    const handleComplete = () => {
        // Handle complete action
        try {
            const response = axiosInstance.post(`/requests/handle-complete/${rid}`);
        } catch (error) {
            console.error('Error handling complete:', error);
        } finally {
            window.location.reload();
        }
    };

    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    // Handle Reject
    const handleReject = () => {
        setConfirmAction('reject');
        setConfirmModalOpen(true);
    };

    const handleCancel = () => {
        setConfirmAction('cancel');
        setConfirmModalOpen(true);
    };

    const handleConfirmAction = async () => {
        try {
            if (confirmAction === 'reject') {
                await axiosInstance.post(`/requests/handle-reject/${rid}`);
            } else if (confirmAction === 'cancel') {
                await axiosInstance.post(`/requests/handle-cancel/${rid}`);
            }
            // Handle success (e.g., update UI, show notification)
        } catch (error) {
            console.error(`Error handling ${confirmAction}:`, error);
            // Handle error (e.g., show error notification)
        } finally {
            setConfirmModalOpen(false);
            window.location.reload();
        }
    };
    //endregion

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
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                {request.status === 0 && (
                                    <>
                                        <Button variant="contained" color="primary" onClick={handleApprove}>
                                            Chấp thuận
                                        </Button>
                                        <Button variant="contained" color="error" onClick={handleReject}>
                                            Từ chối
                                        </Button>
                                    </>
                                )}
                                {request.status === 1 && (
                                    <>
                                        <Button variant="contained" color="primary" onClick={handleComplete}>
                                            Hoàn thành
                                        </Button>
                                        <Button variant="contained" color="error" onClick={handleCancel}>
                                            Huỷ bỏ
                                        </Button>
                                    </>
                                )}
                                {request.status === 2 && (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => navigate(`/admin/create-contract/${request.id}`)}
                                        >
                                            Tạo hợp đồng
                                        </Button>
                                        <Button variant="contained" color="error" onClick={handleCancel}>
                                            Huỷ bỏ
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Accept Modal */}
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="appointment-modal-title"
                aria-describedby="appointment-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Typography id="appointment-modal-title" variant="h6" component="h2">
                        Chọn thời gian hẹn
                    </Typography>
                    <TextField
                        label="Ngày"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Giờ"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        fullWidth
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="outlined" onClick={handleModalClose}>
                            Huỷ bỏ
                        </Button>
                        <Button variant="contained" onClick={handleConfirmAccept}>
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Confirm Modal */}
            <Modal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Typography id="confirm-modal-title" variant="h6" component="h2">
                        Xác nhận
                    </Typography>
                    <Typography id="confirm-modal-description">
                        Bạn có chắc chắn muốn {confirmAction === 'reject' ? 'từ chối' : 'huỷ bỏ'} yêu cầu này không?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="outlined" onClick={() => setConfirmModalOpen(false)}>
                            Huỷ bỏ
                        </Button>
                        <Button variant="contained" onClick={handleConfirmAction}>
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}

export default RequestManagementDetail;