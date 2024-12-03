import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const CustomSnackbar = ({ open, onClose, message, severity, navigatePath }) => {
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    onClose(); // Đóng Snackbar ngay lập tức

    if (severity === 'success' && navigatePath) {
      // Đợi 3 giây trước khi chuyển hướng
      setTimeout(() => {
        navigate(navigatePath);
      }, 500);
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          fontSize: '1.5rem', // Tăng kích thước chữ
          padding: '20px',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
