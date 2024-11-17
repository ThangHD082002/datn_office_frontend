import React, { useState, useEffect, useCallback } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, ArrowForward, GetApp } from "@mui/icons-material";


pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const PdfViewer = () => {
  const [pdfFile, setPdfFile] = useState(null); // URL PDF
  const [numPages, setNumPages] = useState(null); // Tổng số trang
  const [pageNumber, setPageNumber] = useState(1); // Trang hiện tại
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const { pid } = useParams(); // Lấy ID từ URL params
  const token = localStorage.getItem("authToken"); // Lấy token từ localStorage

  // Hàm fetch PDF với axios
  const fetchPdf = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://office-nest-ohcid.ondigitalocean.app/api/contract/${pid}/export-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Đảm bảo nhận dữ liệu dưới dạng blob cho file
        }
      );

      // Tạo URL blob từ dữ liệu PDF
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      setPdfFile(url); // Lưu URL PDF để hiển thị
    } catch (error) {
      console.error("Error fetching PDF:", error);
    } finally {
      setLoading(false); // Đóng trạng thái loading
    }
  }, [pid, token]);

  // Gọi lại hàm fetchPdf mỗi khi pid thay đổi
  useEffect(() => {
    fetchPdf(); // Gọi hàm fetchPdf khi component mount hoặc pid thay đổi
  }, [pid, fetchPdf]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages); // Lưu số trang PDF
  };

  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1)); // Chuyển sang trang trước
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages)); // Chuyển sang trang tiếp theo
  };

  const handleDownload = () => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.setAttribute("download", "contract.pdf"); // Tên file tải xuống
      document.body.appendChild(link);
      link.click(); // Tải file xuống
      document.body.removeChild(link);
    }
  };

  return (
    <Box>
      {/* Thanh công cụ */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PDF Viewer
          </Typography>
          <Button
            color="inherit"
            startIcon={<GetApp />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Toolbar>
      </AppBar>

      {/* Nội dung PDF */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          pdfFile && (
            <Document
              file={pdfFile}
              onLoadSuccess={onLoadSuccess}
              loading="Loading PDF..."
              noData="No PDF file found"
            >
              <Page pageNumber={pageNumber} width={800} />
            </Document>
          )
        )}
      </Box>

      {/* Thanh điều hướng */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        <IconButton
          color="primary"
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" sx={{ mx: 2 }}>
          Page {pageNumber} of {numPages}
        </Typography>
        <IconButton
          color="primary"
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PdfViewer;
