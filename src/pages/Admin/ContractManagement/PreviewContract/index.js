import React, { useState, useEffect, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './PreviewContract.module.scss'
import classNames from 'classnames/bind'
import { AppBar, Toolbar, IconButton, Button, Box, Typography, CircularProgress } from '@mui/material'
import { Clear } from '@mui/icons-material'
import { ArrowBack, ArrowForward, GetApp } from '@mui/icons-material'
// import Button from '@mui/material/Button'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const cx = classNames.bind(styles)
const PdfViewer = () => {
  const [pdfFile, setPdfFile] = useState(null) // URL PDF
  const [numPages, setNumPages] = useState(null) // Tổng số trang
  const [pageNumber, setPageNumber] = useState(1) // Trang hiện tại
  const [loading, setLoading] = useState(false) // Trạng thái tải
  const { pid } = useParams() // Lấy ID từ URL params
  const token = localStorage.getItem('authToken') // Lấy token từ localStorage

  // Hàm fetch PDF với axios
  const fetchPdf = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://office-nest-ohcid.ondigitalocean.app/api/contract/${pid}/export-pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob' // Đảm bảo nhận dữ liệu dưới dạng blob cho file
      })

      // Tạo URL blob từ dữ liệu PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      setPdfFile(url) // Lưu URL PDF để hiển thị
    } catch (error) {
      console.error('Error fetching PDF:', error)
    } finally {
      setLoading(false) // Đóng trạng thái loading
    }
  }, [pid, token])

  // Gọi lại hàm fetchPdf mỗi khi pid thay đổi
  useEffect(() => {
    fetchPdf() // Gọi hàm fetchPdf khi component mount hoặc pid thay đổi
  }, [pid, fetchPdf])

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages) // Lưu số trang PDF
  }

  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1)) // Chuyển sang trang trước
  }

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages)) // Chuyển sang trang tiếp theo
  }

  const handleDownload = () => {
    if (pdfFile) {
      const link = document.createElement('a')
      link.href = pdfFile
      link.setAttribute('download', 'contract.pdf') // Tên file tải xuống
      document.body.appendChild(link)
      link.click() // Tải file xuống
      document.body.removeChild(link)
    }
  }

  const [image, setImage] = useState(null) // State để lưu ảnh đã upload
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 }) // State để lưu vị trí ảnh
  const [dragging, setDragging] = useState(false) // Trạng thái kéo ảnh

  // Hàm upload file ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result) // Đọc và lưu dữ liệu ảnh vào state
      }
      reader.readAsDataURL(file)
    }
  }

  // Hàm bắt đầu kéo ảnh
  const handleDragStart = (e) => {
    setDragging(true)
    const offsetX = e.clientX - imagePosition.x
    const offsetY = e.clientY - imagePosition.y
    const handleMouseMove = (e) => {
      if (dragging) {
        setImagePosition({
          x: e.clientX - offsetX,
          y: e.clientY - offsetY
        })
      }
    }

    // Dừng sự kiện kéo khi thả chuột
    const handleMouseUp = () => {
      setDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleDeleteImage = () => {
    setImage(null) // Xóa ảnh
  }

  return (
    <div className={cx('container')}>
      <Box>
        {/* Thanh công cụ */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              PDF Viewer
            </Typography>
            <Button color="inherit" startIcon={<GetApp />} onClick={handleDownload}>
              Download
            </Button>
          </Toolbar>
        </AppBar>

        {/* Nội dung PDF */}
        {/* <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 , border: '1px solid #333',}}>
        {loading ? (
          <CircularProgress />
        ) : (
          pdfFile && (
            <Document file={pdfFile} onLoadSuccess={onLoadSuccess} loading="Loading PDF..." noData="No PDF file found">
              <Page pageNumber={pageNumber} width={800} />
            </Document>
          )
        )}
      </Box> */}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
            border: '1px solid #333'
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : pdfFile ? (
            <Document file={pdfFile} onLoadSuccess={onLoadSuccess} loading="Loading PDF..." noData="No PDF file found">
              <Page
                pageNumber={pageNumber}
                width={800}
                onRenderSuccess={() => {
                  // Tìm tất cả thẻ canvas trong trang PDF
                  const pageElement = document.querySelector('.react-pdf__Page')
                  if (pageElement) {
                    const canvases = pageElement.querySelectorAll('canvas')
                    const others = pageElement.querySelectorAll(
                      '.react-pdf__Page__textContent, .react-pdf__Page__annotations'
                    )

                    // Ẩn các lớp khác ngoài thẻ canvas đầu tiên
                    others.forEach((el) => {
                      el.style.display = 'none'
                    })
                  }
                }}
              />
            </Document>
          ) : null}
        </Box>

        {/* Thanh điều hướng */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2
          }}
        >
          <IconButton
            color="primary"
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            sx={{
              fontSize: '25px'
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 2, fontSize: '20px' }}>
            Page {pageNumber} of {numPages}
          </Typography>
          <IconButton color="primary" onClick={goToNextPage} disabled={pageNumber >= numPages}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>
      <div className={cx('signature')}>
        <div>
          <label for="image-upload" className={cx('label-upload')}>
            Chọn chữ kí
          </label>
          <input type="file" id="image-upload" name="image" accept="image/*" onChange={handleImageUpload} />
          {image && (
            <div
              style={{
                position: 'absolute',
                left: imagePosition.x,
                top: imagePosition.y,
                cursor: 'move',
                zIndex: 10,
                userSelect: 'none'
              }}
              onMouseDown={handleDragStart} // Khi nhấn chuột vào ảnh, sẽ bắt đầu kéo
            >
              <img
                src={image}
                alt="Uploaded"
                style={{
                  width: '200px', // Thay đổi kích thước ảnh nếu cần
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
              {/* Icon Xóa ảnh */}
              <IconButton
                onClick={handleDeleteImage}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  color: 'red',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%'
                }}
              >
                <Clear />
              </IconButton>
            </div>
          )}
        </div>
        <div>
          <Button  
          variant="contained"
          // color="primary"
          sx={{
            marginLeft: '60px',
            whiteSpace: 'nowrap',
            fontSize: '15px',
            width: '100px',
            height:  '45px',
            backgroundColor: 'red',
            color: '#fff'
          }}
          disabled={image === null}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PdfViewer
