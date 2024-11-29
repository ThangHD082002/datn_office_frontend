import React, { useState, useEffect, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './PreviewContract.module.scss'
import classNames from 'classnames/bind'
import { AppBar, Toolbar, IconButton, Button, Box, Typography, CircularProgress } from '@mui/material'
import { Clear } from '@mui/icons-material'
import { ArrowBack, ArrowForward, GetApp } from '@mui/icons-material'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const cx = classNames.bind(styles)

const PdfViewer = () => {
  const [pdfFile, setPdfFile] = useState(null) // URL PDF
  const [numPages, setNumPages] = useState(null) // Tổng số trang
  const [pageNumber, setPageNumber] = useState(1) // Trang hiện tại
  const [loading, setLoading] = useState(false) // Trạng thái tải
  const { pid } = useParams() // Lấy ID từ URL params
  const token = localStorage.getItem('authToken') // Lấy token từ localStorage
  const [signaturePlaced, setSignaturePlaced] = useState(false) // Trạng thái xác định chữ ký đã đặt đúng vị trí chưa
  const [signaturePositionB, setSignaturePositionB] = useState({ x: 100, y: 500, width: 300, height: 150 }) // Vị trí và kích thước vùng ký
  const [signaturePositionA, setSignaturePositionA] = useState({ x: 400, y: 500, width: 300, height: 150 }) // Vị trí và kích thước vùng ký

  const [image, setImage] = useState(null) // State để lưu ảnh đã upload
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 }) // State để lưu vị trí ảnh
  const [dragging, setDragging] = useState(false) // Trạng thái kéo ảnh

  // Hàm kiểm tra nếu chữ ký nằm trong vùng ký
  const checkSignaturePosition = (x, y) => {
    // check role manager thì hiển thị ô kí bên A, client thì hiển thị ô kí bên B
    const { x: minX, y: minY, width, height } = signaturePositionA
    const maxX = minX + width
    const maxY = minY + height

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      setSignaturePlaced(true)
    } else {
      setSignaturePlaced(false)
    }
  }

  // Hàm xử lý kéo ảnh
  const handleDragStart = (e) => {
    setDragging(true)
    const offsetX = e.clientX - imagePosition.x
    const offsetY = e.clientY - imagePosition.y

    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = e.clientX - offsetX
        const newY = e.clientY - offsetY
        setImagePosition({ x: newX, y: newY })
        checkSignaturePosition(newX, newY) // Kiểm tra vị trí khi kéo
      }
    }

    const handleMouseUp = () => {
      setDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

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
    if (pageNumber + 1 === numPages) {
      // check role manager thì hiển thị ô kí bên A, client thì hiển thị ô kí bên B
      document.getElementById('signature-boxA').style.display = 'block'
      // document.getElementById('signature-boxB').style.display = 'block'
    }
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

  const handleDeleteImage = () => {
    setImage(null) // Xóa ảnh
  }

  // Hàm xử lý khi lưu chữ ký
  const handleSave = () => {
    if (signaturePlaced) {
      alert('Chữ ký đã được lưu thành công!')
      // call api to save signature
    } else {
      alert('Vui lòng đặt chữ ký vào vùng chỉ định trước khi lưu!')
    }
  }

  return (
    <div className={cx('container')}>
      <Box>
        {/* Thanh công cụ */}
        <AppBar position="static" color="primary">
          {/* ... */}
        </AppBar>

        {/* Nội dung PDF */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, border: '1px solid #333' }}>
          {loading ? (
            <CircularProgress />
          ) : pdfFile ? (
            <Document file={pdfFile} onLoadSuccess={onLoadSuccess} loading="Loading PDF..." noData="No PDF file found">
              <Page
                pageNumber={pageNumber}
                width={800}
                onRenderSuccess={() => {
                  const pageElement = document.querySelector('.react-pdf__Page')
                  if (pageElement) {
                    const others = pageElement.querySelectorAll(
                      '.react-pdf__Page__textContent, .react-pdf__Page__annotations'
                    )
                    others.forEach((el) => {
                      el.style.display = 'none'
                    })
                  }
                }}
              >
                {/* Thêm vùng ký được chỉ định */}
                <Box
                  id="signature-boxB"
                  sx={{
                    position: 'absolute',
                    top: `${signaturePositionB.y}px`,
                    left: `${signaturePositionB.x}px`,
                    width: `${signaturePositionB.width}px`,
                    height: `${signaturePositionB.height}px`,
                    border: '2px dashed red',
                    zIndex: 5,
                    pointerEvents: 'none'
                  }}
                  display="none"
                >
                  <Typography variant="body2" style={{ color: 'red', textAlign: 'center' }}>
                    Ký vào đây
                  </Typography>
                </Box>
                {/* Thêm vùng ký được chỉ định */}
                <Box
                  id="signature-boxA"
                  sx={{
                    position: 'absolute',
                    top: `${signaturePositionA.y}px`,
                    left: `${signaturePositionA.x}px`,
                    width: `${signaturePositionA.width}px`,
                    height: `${signaturePositionA.height}px`,
                    border: '2px dashed red',
                    zIndex: 5,
                    pointerEvents: 'none'
                  }}
                  display="none"
                >
                  <Typography variant="body2" style={{ color: 'red', textAlign: 'center' }}>
                    Ký vào đây
                  </Typography>
                </Box>
              </Page>
            </Document>
          ) : null}
        </Box>

        {/* Thanh điều hướng */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <IconButton color="primary" onClick={goToPreviousPage} disabled={pageNumber <= 1} sx={{ fontSize: '25px' }}>
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

      {/* Phần chữ ký */}
      <div className={cx('signature')}>
        <div>
          <label htmlFor="image-upload" className={cx('label-upload')}>
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
              onMouseDown={handleDragStart}
            >
              <img
                src={image}
                alt="Uploaded"
                style={{
                  width: '200px',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
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
            sx={{
              marginLeft: '60px',
              whiteSpace: 'nowrap',
              fontSize: '15px',
              width: '100px',
              height: '45px',
              backgroundColor: signaturePlaced ? 'green' : 'red',
              color: '#fff'
            }}
            disabled={!image}
            onClick={() => handleSave()}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PdfViewer
