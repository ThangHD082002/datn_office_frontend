import React, { useState, useEffect, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './PreviewContract.module.scss'
import classNames from 'classnames/bind'
import { AppBar, Toolbar, IconButton, Button, Box, Typography, CircularProgress } from '@mui/material'
import { Clear } from '@mui/icons-material'
import { ArrowBack, ArrowForward, GetApp } from '@mui/icons-material'
import FormData from 'form-data'
import { axiosInstance } from '~/utils/axiosInstance'
import CustomSnackbar from '~/components/Layout/component/CustomSnackbar'
import { ArrowUpward } from '@mui/icons-material'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { TextField, Stepper, Step, StepLabel, StepContent, Paper } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import forge from 'node-forge'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const cx = classNames.bind(styles)

const steps = [
  {
    label: 'Thực hiện upload chữ kí',
    description: `Upload chữ kí tại đây`
  },
  {
    label: 'Thực hiện upload khóa cá nhân của bạn',
    description: 'Upload khóa cá nhân tại đây'
  },
  {
    label: 'Hoàn tất xác thực chữ kí',
    description: `Nhấn Hoàn thành để hoàn tất`
  }
]

const PdfViewer = () => {
  const [pdfFile, setPdfFile] = useState(null) // URL PDF
  const [numPages, setNumPages] = useState(null) // Tổng số trang
  const [pageNumber, setPageNumber] = useState(1) // Trang hiện tại
  const [loading, setLoading] = useState(false) // Trạng thái tải
  const { pid } = useParams() // Lấy ID từ URL params
  const token = localStorage.getItem('authToken') // Lấy token từ localStorage
  const [signaturePlaced, setSignaturePlaced] = useState(false) // Trạng thái xác định chữ ký đã đặt đúng vị trí chưa
  const [signaturePositionB, setSignaturePositionB] = useState({ x: 210, y: 520, width: 350, height: 170 }) // Vị trí và kích thước vùng ký
  const [signaturePositionA, setSignaturePositionA] = useState({ x: 210, y: 520, width: 350, height: 170 }) // Vị trí và kích thước vùng ký

  const [image, setImage] = useState(null) // State để lưu ảnh đã upload
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 }) // State để lưu vị trí ảnh
  const [dragging, setDragging] = useState(false) // Trạng thái kéo ảnh

  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [fileNamePrivate, setFileNamePrivate] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [filePrivateKeyBase64, setFilePrivateKeyBase64] = useState(null)
  const navigate = useNavigate()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [navigatePath, setNavigatePath] = useState('')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Cuộn mượt mà
    })
  }

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

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = Math.min(prevPageNumber + 1, numPages) // Chuyển sang trang tiếp theo
      if (newPageNumber === numPages) {
        // Khi ở trang cuối cùng, hiển thị ô ký
        var role = localStorage.getItem('role')
        if (role && role.includes('ROLE_USER')) {
          document.getElementById('signature-boxA').style.display = 'block'
          document.getElementById('signature-boxB').style.display = 'none' // Ẩn ô ký bên B
        } else {
          document.getElementById('signature-boxB').style.display = 'block'
          document.getElementById('signature-boxA').style.display = 'none' // Ẩn ô ký bên A
        }
      } else {
        // Khi không phải trang cuối cùng, ẩn ô ký
        document.getElementById('signature-boxA').style.display = 'none'
        document.getElementById('signature-boxB').style.display = 'none'
      }
      return newPageNumber
    })
  }

  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = Math.max(prevPageNumber - 1, 1) // Chuyển sang trang trước và không nhỏ hơn 1
      if (newPageNumber === numPages) {
        // Khi ở trang cuối cùng, hiển thị ô ký
        var role = localStorage.getItem('role')
        if (role && role.includes('ROLE_USER')) {
          document.getElementById('signature-boxA').style.display = 'block'
          document.getElementById('signature-boxB').style.display = 'none' // Ẩn ô ký bên B
        } else {
          document.getElementById('signature-boxB').style.display = 'block'
          document.getElementById('signature-boxA').style.display = 'none' // Ẩn ô ký bên A
        }
      } else {
        // Khi không phải trang cuối cùng, ẩn ô ký
        document.getElementById('signature-boxA').style.display = 'none'
        document.getElementById('signature-boxB').style.display = 'none'
      }
      return newPageNumber
    })
  }
  // Hàm upload file ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file) // Lưu đối tượng File vào state thay vì Data URL
      setImagePosition({
        x: 240, // Vị trí x của ảnh
        y: 530 // Vị trí y của ảnh
      })
    } else {
      alert('Vui lòng chọn một tệp ảnh hợp lệ!')
    }
  }

  const handleImageUploadPrivateKey = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFilePrivateKeyBase64(file)
      setFileNamePrivate(file.name)
    } else {
      setFileNamePrivate('')
      alert('Vui lòng chọn một tệp hợp lệ!')
    }
  }

  const handleDeleteImage = () => {
    setImage(null) // Xóa ảnh
  }

  const handleNext = () => {
    if (activeStep == 0) {
      if (image !== null) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      } else {
        setAlertSeverity('error')
        setAlertText('Vui lòng upload chữ kí của bạn')
        setSnackbarOpen(true)
      }
    } else if (activeStep == 1) {
      if (filePrivateKeyBase64 !== null) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      } else {
        setAlertSeverity('error')
        setAlertText('Vui lòng upload khóa cá nhân của bạn')
        setSnackbarOpen(true)
      }
    } else {
      // const readerImage = new FileReader();
      // const readerPrivateKey = new FileReader();

      // readerImage.onload = function (e) {
      //   const imageContent = e.target.result;

      //   // Hash the image using SHA-256
      //   const md = forge.md.sha256.create();
      //   md.update(imageContent);

      //   const hashHex = md.digest().toHex();

      //   console.log("hashex")
      //   console.log(hashHex)

      //   readerPrivateKey.onload = function (e) {
      //     const privateKeyBase64 = e.target.result;

      //     try {
      //       // Decode the Base64 private key into a byte array
      //       const decodedPrivateKey = forge.util.decode64(privateKeyBase64);  // Use forge to decode Base64

      //       // Convert the decoded key into PEM format
      //       const formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${forge.util.encode64(decodedPrivateKey).match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----`;

      //       // Log the private key to check its structure
      //       console.log('Formatted Private Key:', formattedPrivateKey);

      //       // Load the private key using Forge
      //       const privateKey = forge.pki.privateKeyFromPem(formattedPrivateKey);

      //       // Sign the hash
      //       const signature = privateKey.sign(md);

      //       // Convert signature to base64
      //       const signatureBase64 = forge.util.encode64(signature);

      //       // Prepare data for API request
      //       const formData = new FormData();
      //       formData.append('contractId', pid);
      //       formData.append('signature', signatureBase64);

      //       // Send API request
      //       axiosInstance
      //         .post('/contract/verify-signature-v2', formData)
      //         .then((response) => {
      //           console.log('Chữ ký đã được lưu:', response.data);
      //           setAlertSeverity('success');
      //           setAlertText('Hoàn tất thực hiện kí xác thực');
      //           setNavigatePath('/admin/contracts'); // Đường dẫn chuyển hướng sau khi thành công
      //         })
      //         .catch((error) => {
      //           console.log("ERROR VERIFY" + error)
      //           setAlertSeverity('error');
      //           setAlertText('Đã xảy ra lỗi trong quá trình kí');
      //         })
      //         .finally(function () {
      //           // always executed
      //           setSnackbarOpen(true);
      //         });
      //     } catch (error) {
      //       // Handle invalid Base64 or any other error related to decoding
      //       alert('Đã xảy ra lỗi khi giải mã Base64 của private key. Vui lòng kiểm tra lại file.');
      //       console.error('Lỗi khi giải mã Base64:', error);
      //     }
      //   };

      //   // Make sure the private key is being read as text
      //   readerPrivateKey.readAsText(filePrivateKeyBase64);
      // };

      // // Make sure the image is being read as a data URL
      // readerImage.readAsDataURL(image);

      // const readerPrivateKey = new FileReader()
      // const readerImage = new FileReader()

      // readerImage.onload = function (e) {
      //   const imageContent = e.target.result.split(',')[1] // Loại bỏ prefix của Data URL để chỉ lấy phần dữ liệu Base64

      //   // Decode the Base64 image content into a byte array
      //   const imageBytes = forge.util.decode64(imageContent)

      //   // Hash the image bytes using SHA-256
      //   const md = forge.md.sha256.create()
      //   md.update(imageBytes)

      //   // Get the hashed value and convert it to Base64
      //   const hashBytes = md.digest().bytes()
      //   const hashBase64 = forge.util.encode64(hashBytes)

      //   console.log('Hash of the image (Base64):', hashBase64)

      //   readerPrivateKey.onload = function (e) {
      //     const privateKeyBase64 = e.target.result

      //     try {
      //       // Decode the Base64 private key into a byte array
      //       const decodedPrivateKey = forge.util.decode64(privateKeyBase64)

      //       // Convert the decoded key into PEM format
      //       const formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${forge.util
      //         .encode64(decodedPrivateKey)
      //         .match(/.{1,64}/g)
      //         .join('\n')}\n-----END PRIVATE KEY-----`

      //       console.log('Formatted Private Key:', formattedPrivateKey)

      //       // Load the private key using Forge
      //       const privateKey = forge.pki.privateKeyFromPem(formattedPrivateKey)

      //       // Sign the hash
      //       const signature = privateKey.sign(md)

      //       // Convert signature to base64
      //       const signatureBase64 = forge.util.encode64(signature)

      //       // Prepare data for API request
      //       const formData = new FormData()
      //       formData.append('contractId', pid)
      //       formData.append('signature', signatureBase64)

      //       // Send API request
      //       axiosInstance
      //         .post('/contract/verify-signature-v2', formData)
      //         .then((response) => {
      //           console.log('Chữ ký đã được lưu:', response.data)
      //           setAlertSeverity('success')
      //           setAlertText('Hoàn tất thực hiện kí xác thực')
      //           setNavigatePath('/admin/contracts')
      //         })
      //         .catch((error) => {
      //           console.log('ERROR VERIFY', error)
      //           setAlertSeverity('error')
      //           setAlertText('Đã xảy ra lỗi trong quá trình kí')
      //         })
      //         .finally(function () {
      //           setSnackbarOpen(true)
      //         })
      //     } catch (error) {
      //       alert('Đã xảy ra lỗi khi giải mã Base64 của private key. Vui lòng kiểm tra lại file.')
      //       console.error('Lỗi khi giải mã Base64:', error)
      //     }
      //   }

      //   // Make sure the private key is being read as text
      //   readerPrivateKey.readAsText(filePrivateKeyBase64)
      // }

      // // Make sure the image is being read as a data URL
      // readerImage.readAsDataURL(image)

      // const readerPrivateKey = new FileReader();
      // const readerImage = new FileReader();

      // readerImage.onload = function (e) {
      //     const imageContent = e.target.result.split(',')[1]; // Loại bỏ prefix của Data URL để chỉ lấy phần dữ liệu Base64

      //     // Decode the Base64 image content into a byte array
      //     const imageBytes = forge.util.decode64(imageContent);

      //     // Hash the image bytes using SHA-256
      //     const md = forge.md.sha256.create();
      //     md.update(imageBytes);
      //     const hashBytes = md.digest().bytes();
      //     const hashBase64 = forge.util.encode64(hashBytes);

      //     console.log('Hash of the image (Base64):', hashBase64);

      //     readerPrivateKey.onload = function (e) {
      //         const privateKeyBase64 = e.target.result;

      //         try {
      //             // Decode the Base64 private key
      //             const decodedPrivateKey = forge.util.decode64(privateKeyBase64);

      //             // Convert the decoded key into PEM format (if needed)
      //             const formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${forge.util
      //                 .encode64(decodedPrivateKey)
      //                 .match(/.{1,64}/g)
      //                 .join('\n')}\n-----END PRIVATE KEY-----`;

      //             console.log('Formatted Private Key:', formattedPrivateKey);

      //             // Load the private key using Forge
      //             const privateKey = forge.pki.privateKeyFromPem(formattedPrivateKey);

      //             // Sign the hash (hashBytes)
      //             const signature = privateKey.sign(forge.md.sha256.create().update(hashBytes));

      //             // Convert signature to Base64
      //             const signatureBase64 = forge.util.encode64(signature);

      //             // Prepare data for API request
      //             const formData = new FormData();
      //             formData.append('contractId', pid);
      //             formData.append('signature', signatureBase64);

      //             // Send API request
      //             axiosInstance
      //                 .post('/contract/verify-signature-v2', formData)
      //                 .then((response) => {
      //                     console.log('Chữ ký đã được lưu:', response.data);
      //                     setAlertSeverity('success');
      //                     setAlertText('Hoàn tất thực hiện kí xác thực');
      //                     setNavigatePath('/admin/contracts');
      //                 })
      //                 .catch((error) => {
      //                     console.log('ERROR VERIFY', error);
      //                     setAlertSeverity('error');
      //                     setAlertText('Đã xảy ra lỗi trong quá trình kí');
      //                 })
      //                 .finally(function () {
      //                     setSnackbarOpen(true);
      //                 });
      //         } catch (error) {
      //             alert('Đã xảy ra lỗi khi giải mã Base64 của private key. Vui lòng kiểm tra lại file.');
      //             console.error('Lỗi khi giải mã Base64:', error);
      //         }
      //     };

      //     // Make sure the private key is being read as text
      //     readerPrivateKey.readAsText(filePrivateKeyBase64);
      // };

      // // Make sure the image is being read as a data URL
      // readerImage.readAsDataURL(image);

      const formData = new FormData()
      formData.set('file-img', image)
      formData.set('file-key', filePrivateKeyBase64)

      axiosInstance
        .post(`/contract/${pid}/verify-signature-v2`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Đảm bảo định dạng gửi là multipart/form-data
          }
        })
        .then((response) => {
          console.log('Chữ ký đã được lưu:', response.data)
          setAlertSeverity('success')
          setAlertText('Hoàn tất thực hiện kí xác thực')
          setNavigatePath('/admin/contracts')
        })
        .catch((error) => {
          console.log('ERROR VERIFY', error)
          setAlertSeverity('error')
          setAlertText(error.response.data.message)
        })
        .finally(function () {
          setSnackbarOpen(true)
        })
    }
  }
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)
  const handleReset = () => {
    setActiveStep(0)
    setEmail('')
    setOtp('')
    setPassword('')
  }

  return (
    <div className={cx('container')}>
      <Box>
        {/* Thanh công cụ */}
        <AppBar position="static" color="primary">
          {/* ... */}
        </AppBar>

        {/* Nội dung PDF */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
            border: '1px solid #333',
            maxHeight: 'calc(90vh - 100px)', // Chiều cao tối đa cho phần hiển thị PDF, trừ đi không gian cho footer
            overflowY: 'auto' // Thêm scroll nếu nội dung dài // Tạo không gian cho footer
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
                      src={image ? URL.createObjectURL(image) : ''}
                      alt="Uploaded"
                      style={{
                        width: '300px', // Thay đổi width thành 300px
                        height: '150px',
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
              </Page>
            </Document>
          ) : null}
        </Box>

        {/* Thanh điều hướng */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <IconButton color="primary" onClick={goToPreviousPage} disabled={pageNumber <= 1} sx={{ fontSize: '25px' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 2, fontSize: '20px', color: 'black' }}>
            Page {pageNumber} of {numPages}
          </Typography>
          <IconButton color="primary" onClick={goToNextPage} disabled={pageNumber >= numPages}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>

      {/* Phần chữ ký */}
      <div className={cx('signature')}>
        <div className={cx('login-container')}>
          <Typography variant="h4" gutterBottom sx={{ marginLeft: '40px', marginTop: '20px', fontWeight: 'bold' }}>
            Thực hiện theo hướng dẫn để thực hiện xác thực chữ kí
          </Typography>
          <Box sx={{ maxWidth: 500, marginLeft: '60px', marginTop: '20px' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={index === steps.length - 1 ? <Typography variant="caption">Last step</Typography> : null}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      {index === 0 && (
                        <div>
                          <div>
                            <label htmlFor="image-upload" className={cx('label-upload')}>
                              Chọn chữ kí
                            </label>
                            <input
                              type="file"
                              id="image-upload"
                              name="image"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div>
                          <div>
                            <label htmlFor="private-upload" className={cx('label-upload-private')}>
                              Chọn khóa cá nhân
                            </label>
                            <input
                              type="file"
                              id="private-upload"
                              name="private"
                              onChange={handleImageUploadPrivateKey}
                            />
                            {fileNamePrivate && <div className={cx('file-name')}>{fileNamePrivate}</div>}
                          </div>
                        </div>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                        {index === steps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
                      </Button>
                      <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        Trở lại
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </div>
      </div>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={alertText}
        severity={alertSeverity}
        navigatePath={navigatePath}
      />
      <IconButton
        onClick={handleScrollToTop}
        sx={{
          position: 'fixed',
          bottom: '20px', // Đặt vị trí của nút ở dưới cùng
          right: '20px', // Đặt nút ở góc phải
          backgroundColor: 'primary.main', // Màu nền của nút
          color: 'white', // Màu icon
          '&:hover': {
            backgroundColor: 'primary.dark' // Màu khi hover
          }
        }}
      >
        <ArrowUpward />
      </IconButton>
    </div>
  )
}

export default PdfViewer
