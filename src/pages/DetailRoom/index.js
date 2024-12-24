import classNames from 'classnames/bind'
import styles from './DetailRoom.module.scss'
import $ from 'jquery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ButtonFloor from '~/components/Layout/component/ButtonFloor'
import { useParams } from 'react-router-dom'
import { Link, Route, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import ModalOrderRoom from './ModalOrderRoom'
import {
  faAngleLeft,
  faAngleRight,
  faBiking,
  faBroom,
  faBroomBall,
  faBuilding,
  faCancel,
  faCar,
  faDollarSign,
  faElevator,
  faLocation,
  faLocationDot,
  faShield,
  faSliders,
  faTimeline,
  faXmark,
  faXmarkCircle
} from '@fortawesome/free-solid-svg-icons'
import about_one from '~/assets/image/about-us-img-1.jpeg'
import about_two from '~/assets/image/about-us-img-2.jpeg'
import about_three from '~/assets/image/about-us-img-3.jpeg'
import about_four from '~/assets/image/about-us-img-4.jpeg'
import React, { useRef, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { faAirbnb, faLine } from '@fortawesome/free-brands-svg-icons'
import Button from '@mui/material/Button'
import { axiosInstance } from '~/utils/axiosInstance'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Pagination,
  IconButton,
  Modal
} from '@mui/material'
const cx = classNames.bind(styles)

const steps = ['Chọn phòng yêu cầu', 'Chọn quản lí tòa nhà', 'Xác nhận yêu cầu']

function DetailRoom() {
  const navigate = useNavigate()
  const { rid } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [room, setRoom] = useState({})

  const leftTabRef = useRef(null)
  const rightTabRef = useRef(null)

  const leftPaneRef = useRef(null)
  const rightPaneRef = useRef(null)

  const [alertStateBook, setAlertStateBook] = useState('')
  const [alertText, setAlertText] = useState('')
  const [open, setOpen] = React.useState(false)

  const inputRefs = useRef({})
  const labelRefs = useRef({})
  const [valueInputs, setValueInputs] = useState({})

  const [selectedIds, setSelectedIds] = useState([])
  const [response, setResponse] = useState()

  const seatRef = useRef(null)
  const labelRef = useRef(null)

  const showListFloor = useRef(null)
  const showListFloorMain = useRef(null)

  const listFloorOrder = useState([])
  const [managers, setManagers] = useState([])

  const [bid, setBid] = useState()

  const [infor, setInfor] = useState({})

  let token = localStorage.getItem('authToken')

  function decodeToken(token) {
    try {
      const decodedData = jwtDecode(token)
      console.log('decodedData') // Kiểm tra dữ liệu trong token

      console.log(decodedData) // Kiểm tra dữ liệu trong token
      setInfor(decodedData)
      return decodedData
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }

  const fetchData = async () => {
    try {
      // Giả sử API hỗ trợ phân trang qua query params ?page= và ?size=
      const response = await axiosInstance.get(`/admin/managers/by-building/${rid}`, {
        params: {
          page: 0, // Backend thường bắt đầu từ 0
          size: 100
        }
      })
      setManagers(response.data.content)
      console.log('MANAGERS')
      console.log(response.data.content)
    } catch (error) {
      console.error('Error fetching data Managers:', error)
    } finally {
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleActiveLeftTab = () => {
    if (leftTabRef.current) {
      // Kiểm tra nếu có class "active" thì xóa, nếu chưa có thì thêm vào
      if (leftTabRef.current.classList.contains(styles['active-tab'])) {
      } else {
        leftTabRef.current.classList.add(styles['active-tab'])
        if (rightTabRef.current.classList.contains(styles['active-tab'])) {
          rightTabRef.current.classList.remove(styles['active-tab'])
        }
        if (leftPaneRef.current.classList.contains(styles['show-pane'])) {
        } else {
          leftPaneRef.current.classList.add(styles['show-pane'])
          if (rightPaneRef.current.classList.contains(styles['show-pane'])) {
            rightPaneRef.current.classList.remove(styles['show-pane'])
          }
        }
      }
    }
  }

  const handleToggleActiveRightTab = () => {
    if (rightTabRef.current) {
      // Kiểm tra nếu có class "active" thì xóa, nếu chưa có thì thêm vào
      if (rightTabRef.current.classList.contains(styles['active-tab'])) {
      } else {
        rightTabRef.current.classList.add(styles['active-tab'])
        if (leftTabRef.current.classList.contains(styles['active-tab'])) {
          leftTabRef.current.classList.remove(styles['active-tab'])
        }

        if (rightPaneRef.current.classList.contains(styles['show-pane'])) {
        } else {
          rightPaneRef.current.classList.add(styles['show-pane'])
          if (leftPaneRef.current.classList.contains(styles['show-pane'])) {
            leftPaneRef.current.classList.remove(styles['show-pane'])
          }
        }
      }
    }
  }

  function handleOfficeDTOS(response) {
    console.log(response.data.result.officeDTOS)
    if (response.data.result.officeDTOS) {
      response.data.result.officeDTOS.forEach((item) => {
        // Tạo hoặc cập nhật giá trị trong state valueInputs dựa trên item.status
        setValueInputs((prevValues) => ({
          ...prevValues,
          [`valueInput${item.id}`]: item.status === 0
        }))

        // Tạo ref cho input nếu chưa tồn tại
        if (!inputRefs.current[`inputRef${item.id}`]) {
          inputRefs.current[`inputRef${item.id}`] = React.createRef()
        }
        if (!labelRefs.current[`labelRef${item.id}`]) {
          labelRefs.current[`labelRef${item.id}`] = React.createRef()
        }

        console.log(labelRefs.current[`labelRef${item.id}`])

        const inputRef = inputRefs.current[`inputRef${item.id}`]
        const labelRef = labelRefs.current[`labelRef${item.id}`]

        // Kiểm tra sự tồn tại của các ref và thực hiện logic
        if (labelRef.current && inputRef.current) {
          if (inputRef.current.value === 'false') {
            labelRef.current.classList.add(styles['booked'])
            console.log('success')
          } else {
            labelRef.current.classList.remove(styles['booked'])
          }
        } else {
          console.log(`Ref cho input hoặc label của item ${item.id} bị undefined`)
        }
      })
    } else {
      console.log('officeDTOS is undefined or not an array')
    }
  }

  useEffect(() => {
    decodeToken(token)
    axiosInstance
      .get(`/buildings/${rid}`)
      .then(function (response) {
        // setRoom((prev) => ({ ...prev, ...response.data }));
        setRoom(response.data.result)
        setBid(response.data.result.id)
        // Tạo 2 mảng useRef để lưu theo id
        setResponse(response)
        handleOfficeDTOS(response)

        // kiểm tra nếu inputRef tại id nào bằng false thì add class booked
      })
      .catch(function (error) {
        if (error.response && error.response.status === 401) {
          // Chuyển đến trang /error-token nếu mã lỗi là 401 Unauthorized
          window.location.href = '/error-token'
        }
      })
      .finally(function () {
        // always executed
      })

    // Tìm element có class 'list-image' khi component render xong
    const listImageElement = document.querySelector(`.${styles['list-image']}`)
    const ele = document.querySelector(`.${styles['index-item-0']}`)
    // console.log("ele");
    // console.log(ele);

    var menuItems = $('.left-tab')
    console.log('menuItems')
    console.log(menuItems)

    if (listImageElement) {
      // Thực hiện các thao tác khác nếu cần
      const imgs = document.querySelectorAll('img.image-slide')
      const btnLeft = document.querySelector(`.${styles['btn-left']}`)
      const btnRight = document.querySelector(`.${styles['btn-right']}`)
      const length = imgs.length
      let current = 0

      const handleChangeSlide = () => {
        if (current == length - 1) {
          current = 0
          let width = imgs[0].offsetWidth
          listImageElement.style.transform = `translateX(${width * -1 * current}px)`
          // document.querySelector(`.${styles['active']}`).classList.remove('active');
          // document.querySelector(`.${styles['index-item']}-${current}`).classList.add('active');
        } else {
          current++
          let width = imgs[0].offsetWidth
          listImageElement.style.transform = `translateX(${width * -1 * current}px)`
          // document.querySelector(`.${styles['active']}`).classList.remove('active');
          // document.querySelector(`.${styles['index-item']}-${current}`).classList.add('active');
        }
      }
      let handleEventChangeSilde = setInterval(handleChangeSlide, 4000)

      btnRight.addEventListener('click', () => {
        clearInterval(handleEventChangeSilde)
        handleChangeSlide()
        handleEventChangeSilde = setInterval(handleChangeSlide, 4000)
      })
      btnLeft.addEventListener('click', () => {
        clearInterval(handleEventChangeSilde)
        if (current == 0) {
          current = length - 1
          let width = imgs[0].offsetWidth
          listImageElement.style.transform = `translateX(${width * -1 * current}px)`
          //     document.querySelector(`.${styles['active']}`).classList.remove('active');
          //     document.querySelector(`.${styles['index-item-' + current]}`).classList.add('active');
        } else {
          current--
          let width = imgs[0].offsetWidth
          listImageElement.style.transform = `translateX(${width * -1 * current}px)`
          // document.querySelector(`.${styles['active']}`).classList.remove('active');
          // document.querySelector(`.${styles['index-item-' + current]}`).classList.add('active');
        }
        handleEventChangeSilde = setInterval(handleChangeSlide, 4000)
      })
    }
  }, []) // Mảng rỗng để chỉ chạy một lần sau khi component mount
  const handleClick = () => {
    if (showListFloor.current) {
      // Lấy computed style của phần tử
      const computedStyle = window.getComputedStyle(showListFloor.current)
      const computedStyleMain = window.getComputedStyle(showListFloorMain.current)

      // Kiểm tra nếu class "booked" có visibility: hidden
      if (computedStyle.visibility === 'hidden') {
        // Xóa thuộc tính "visibility: hidden"
        showListFloor.current.style.visibility = 'visible' // hoặc 'inherit' tùy thuộc vào ý định của bạn
      }

      // Thêm class "booked"
      showListFloor.current.classList.add(styles['center'])
    }
  }

  const hanleHidePopup = () => {
    if (showListFloor.current) {
      // Lấy computed style của phần tử
      const computedStyle = window.getComputedStyle(showListFloor.current)
      const computedStyleMain = window.getComputedStyle(showListFloorMain.current)

      // Kiểm tra nếu class "booked" có visibility: hidden
      if (computedStyle.visibility === 'visible') {
        // Xóa thuộc tính "visibility: hidden"
        showListFloor.current.style.visibility = 'hidden' // hoặc 'inherit' tùy thuộc vào ý định của bạn
      }

      // Thêm class "booked"
      showListFloor.current.classList.add(styles['center'])
    }
  }

  const handleChosseFloor = () => { }

  function changeInput(id) {
    setValueInputs((prev) => {
      const currentValue = prev[`valueInput${id}`]

      // Cập nhật selectedIds dựa trên giá trị hiện tại
      setSelectedIds((prevSelectedIds) => {
        if (currentValue) {
          // Nếu valueInput${id} là true, thêm id vào mảng nếu chưa có
          if (!prevSelectedIds.includes(id)) {
            return [...prevSelectedIds, id]
          }
        } else {
          // Nếu valueInput${id} là false, xóa id khỏi mảng nếu có
          return prevSelectedIds.filter((selectedId) => selectedId !== id)
        }
        return prevSelectedIds
      })

      console.log(selectedIds)

      // Đảo ngược giá trị của valueInput${id}
      return {
        ...prev,
        [`valueInput${id}`]: !currentValue
      }
    })
  }
  const handleClickk = () => {
    setOpen(true)
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const BookFloor = () => {
    const user = parseInt(infor.sub)
    console.log('user')
    console.log(user)
    console.log(selectedIds)

    if (selectedIds.length == 0) {
      setAlertStateBook('warning')
      setAlertText('Bạn cần chọn tối thiếu một phòng !')
      handleClickk()
    } else {
      axiosInstance
        .post('/requests', {
          userId: user,
          note: 'Tôi muốn xem văn phòng',
          officeIds: selectedIds,
          buildingId: bid
        })
        .then((response) => {
          console.log('STATE REQUEST')
          console.log(response)
          setAlertStateBook('success')
          setAlertText('Bạn đã đặt phòng thành công!')
        })
        .catch((error) => {
          console.error('Request Error:', error)
          setAlertStateBook('error')
          setAlertText('Hệ thống đang gặp lỗi, vui lòng load lại trang!')
        })
        .finally(() => {
          console.log('Request completed')
        })
    }
  }

  const handleFinish = () => {
    const user = parseInt(infor.sub)
    console.log('user')
    console.log(user)
    console.log(selectedIds)

    if (selectedIds.length == 0) {
      setAlertStateBook('warning')
      setAlertText('Bạn cần chọn tối thiếu một phòng !')
      handleClickk()
    } else {
      axiosInstance
        .post('/requests', {
          userId: user,
          note: 'Tôi muốn xem văn phòng',
          officeIds: selectedIds,
          buildingId: bid,
          managerId: confirmManager
        })
        .then((response) => {
          console.log('STATE REQUEST')
          console.log(response)
          setAlertStateBook('success')
          setAlertText('Bạn đã đặt phòng thành công!')
        })
        .catch((error) => {
          console.error('Request Error:', error)
          setAlertStateBook('error')
          setAlertText('Hệ thống đang gặp lỗi, vui lòng load lại trang!')
        })
        .finally(() => {
          console.log('Request completed')
        })
    }
  }

  useEffect(() => {
    if (alertText === 'Bạn đã đặt phòng thành công!') {
      handleClickk()

      // Đặt timeout 2.3 giây trước khi reload trang
      const timer = setTimeout(() => {
        window.location.reload()
      }, 2300)

      // Cleanup timer nếu `alertText` thay đổi
      return () => clearTimeout(timer)
    }
  }, [alertText])

  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const isStepOptional = (step) => {
    return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    console.log(activeStep)
    if (selectedIds.length == 0) {
      setAlertStateBook('warning')
      setAlertText('Bạn cần chọn tối thiếu một phòng !')
      handleClickk()
    } else {
      if (activeStep + 1 == 3) {
      }
      let newSkipped = skipped
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values())
        newSkipped.delete(activeStep)
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
      setSkipped(newSkipped)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const [page, setPage] = useState(1) // Trang hiện tại
  const itemsPerPage = 4 // Số phần tử mỗi trang

  // Tính toán danh sách managers cần hiển thị cho trang hiện tại
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentManagers = managers.slice(startIndex, endIndex)

  // Hàm thay đổi trang
  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const [selectedManager, setSelectedManager] = useState(null) // Manager đang được chọn
  const [isModalOpen, setModalOpen] = useState(false) // Trạng thái modal

  // Hàm mở modal với manager được chọn
  const handleOpenModal = (manager) => {
    setSelectedManager(manager)
    setModalOpen(true)
  }

  // Hàm đóng modal
  const handleCloseModal = () => {
    setSelectedManager(null)
    setModalOpen(false)
  }

  const [confirmManager, setConfirmManager] = useState(null) // Trạng thái lưu radio được chọn
  const [confirmManagerItem, setConfirmManagerItem] = useState(null) // Trạng thái lưu radio được chọn

  const handleRadioChange = (id) => {
    setConfirmManager(id) // Cập nhật trạng thái với ID của radio được chọn
    managers.forEach((manager) => {
      if (manager.id === id) {
        setConfirmManagerItem(manager) // Gán confirm cho phần tử có id === id1
      }
    })
  }

  return (
    <div className={cx('container')}>
      <div className={cx('main-content')}>
        <Row className={cx('row-main')}>
          <Col sm={7} className={cx('col-left-main')}>
            <div className={cx('slide-show')}>
              <div className={cx('list-image')}>
                <img src={about_one} className={cx('image-slide', 'image-1')} />
                <img src={about_two} alt="Logo2" className={cx('image-slide', 'image-2')} />
                <img src={about_three} alt="Logo3" className={cx('image-slide', 'image-3')} />
                <img src={about_four} alt="Logo4" className={cx('image-slide', 'image-4')} />
              </div>
              <div className={cx('btns')}>
                <div className={cx('btn-left', 'btn')}>
                  <FontAwesomeIcon icon={faAngleLeft} className={cx('icon-left')} />
                </div>
                <div className={cx('btn-right', 'btn')}>
                  <FontAwesomeIcon icon={faAngleRight} className={cx('icon-right')} />
                </div>
              </div>
              <div className={cx('index-images')}>
                <div className={cx('index-item', 'index-item-0', 'active')}></div>
                <div className={cx('index-item', 'index-item-1')}></div>
                <div className={cx('index-item', 'index-item-2')}></div>
                <div className={cx('index-item', 'index-item-3')}></div>
              </div>
            </div>
            <div className={cx('contain-sub-images')}>
              <img src={about_one} className={cx('sub-image')} />
              <img src={about_two} alt="Logo2" className={cx('sub-image')} />
              <img src={about_three} alt="Logo3" className={cx('sub-image')} />
              <img src={about_four} alt="Logo4" className={cx('sub-image')} />
            </div>
          </Col>
          <Col sm={5} className={cx('col-right-main')}>
            <div className={cx('infor-content-main')}>
              <div className={cx('infor-tab')}>
                <ul className={cx('list-tab')}>
                  <li className={cx('left-tab', 'active-tab')} ref={leftTabRef} onClick={handleToggleActiveLeftTab}>
                    <span className={cx('text-left-tab')}>CẤU TRÚC</span>
                  </li>
                  <li className={cx('right-tab')} ref={rightTabRef} onClick={handleToggleActiveRightTab}>
                    <span className={cx('text-right-tab')}>CHI TIẾT GIÁ</span>
                  </li>
                </ul>
              </div>
              <div ref={leftPaneRef} className={cx('pane-left-tab', 'show-pane')}>
                <ul className={cx('list-pane-left')}>
                  <li className={cx('item-location')}>
                    <label className={cx('label-location')}>
                      <FontAwesomeIcon icon={faLocationDot} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Vị trí</span>
                    </label>
                    <p className={cx('value-location')}> {room.address}</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-building')}>
                      <FontAwesomeIcon icon={faBuilding} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Số tầng</span>
                    </label>
                    <p className={cx('value-location')}>{room.numberOfFloor}</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-height')}>
                      <FontAwesomeIcon icon={faLine} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Chiều cao mỗi tầng</span>
                    </label>
                    <p className={cx('value-location')}>{room.floorHeight}</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-dientich')}>
                      <FontAwesomeIcon icon={faSliders} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Diện tích</span>
                    </label>
                    <p className={cx('value-location')}>{room.floorArea} m2</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-evalator')}>
                      <FontAwesomeIcon icon={faElevator} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Số tầng hầm</span>
                    </label>
                    <p className={cx('value-location')}>3</p>
                  </li>
                </ul>
              </div>

              <div ref={rightPaneRef} className={cx('pane-right-tab')}>
                <ul className={cx('list-pane-left')}>
                  <li className={cx('item-location')}>
                    <label className={cx('label-location')}>
                      <FontAwesomeIcon icon={faDollarSign} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Giá thuê/m2</span>
                    </label>
                    <p className={cx('value-location')}>{room.pricePerM2}$</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-building')}>
                      <FontAwesomeIcon icon={faCar} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Phí gửi ô tô</span>
                    </label>
                    <p className={cx('value-location')}>{room.carParkingFee}$ / tháng</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-height')}>
                      <FontAwesomeIcon icon={faBiking} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Phí gửi xe máy</span>
                    </label>
                    <p className={cx('value-location')}>{room.motorbikeParkingFee}$ / tháng</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-evalator')}>
                      <FontAwesomeIcon icon={faShield} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Dịch vụ bảo vệ 24/24</span>
                    </label>
                    <p className={cx('value-location')}>{room.securityFee}$ / tháng</p>
                  </li>
                  <li className={cx('item-location')}>
                    <label className={cx('label-air-conditional')}>
                      <FontAwesomeIcon icon={faBroomBall} className={cx('item-icon-location')} />
                      <span className={cx('title-location')}>Dọn vệ sinh</span>
                    </label>
                    <p className={cx('value-location')}>20$/tháng</p>
                  </li>
                </ul>
              </div>
              <ButtonFloor onClick={handleClick}>CHỌN PHÒNG</ButtonFloor>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <div className={cx('center')} ref={showListFloor}>
          <div className={cx('tickets')} ref={showListFloorMain}>
            <Box sx={{ width: '100%' }}>
              <Stepper
                activeStep={activeStep}
                sx={{ height: '50px', padding: '10px 0' }} // Tăng chiều cao và padding của Stepper
              >
                {steps.map((label, index) => {
                  const stepProps = {}
                  const labelProps = {}
                  if (isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
                        Optional
                      </Typography>
                    ) // Tăng kích thước chữ cho phần "Optional"
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps} sx={{ fontSize: '1.2rem', padding: '8px' }}>
                        {label}
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1, fontSize: '1.1rem' }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset} sx={{ fontSize: '1rem' }}>
                      Reset
                    </Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1, fontSize: '1.1rem' }}>Step {activeStep + 1}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{
                        mr: 1,
                        fontSize: '1rem',
                        padding: '8px 16px',
                        color: 'black' // Màu chữ trắng
                      }}
                    >
                      Trở lại
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                      <Button
                        color="inherit"
                        onClick={handleSkip}
                        sx={{ mr: 1, fontSize: '1rem', padding: '8px 16px' }} // Tăng kích thước nút Skip
                      >
                        Skip
                      </Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        sx={{ fontSize: '1rem', padding: '8px 16px' }} // Tăng kích thước nút Next
                      >
                        Tiếp tục
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFinish}
                        sx={{ fontSize: '1rem', padding: '8px 16px', marginLeft: '10px' }} // Tăng kích thước nút Finish
                      >
                        Hoàn thành
                      </Button>
                    )}
                  </Box>
                </React.Fragment>
              )}
            </Box>
            {
              <div className={cx('ticket-selector', { hidden: activeStep !== 0 })}>
                <div className={cx('head')}>
                  <div className={cx('title')}>
                    DANH SÁCH CÁC PHÒNG THUỘC TÒA {room && room.name ? room.name.toUpperCase() : ''}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faXmark} className={cx('icon-hide-popup')} onClick={hanleHidePopup} />
                  </div>
                </div>
                <div className={cx('seats')}>
                  <div className={cx('status')}>
                    <div className={cx('item')}>Available</div>
                    <div className={cx('item')}>Booked</div>
                    <div className={cx('item')}>Selected</div>
                  </div>
                  <div className={cx('all-seats')}>
                    {room.officeDTOS &&
                      room.officeDTOS.map((f) => (
                        <div key={f.id}>
                          <input
                            ref={inputRefs.current[`inputRef${f.id}`]}
                            type="checkbox"
                            name="tickets"
                            id={f.id}
                            value={valueInputs[`valueInput${f.id}`]}
                            onChange={() => changeInput(f.id)}
                          />
                          <label ref={labelRefs.current[`labelRef${f.id}`]} htmlFor={f.id} className={cx('seat')}>
                            <span className={cx('value-label')}>{f.id}</span>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
                <div className={cx('total')}>
                  <span className={cx('title-count')}>
                    {' '}
                    <span className={cx('count')}>{selectedIds.length}</span> Floors selected{' '}
                  </span>
                  <div className={cx('amount')}>0</div>
                </div>
              </div>
            }
            {
              <div className={cx('ticket-selector-manager', { hidden: activeStep !== 1 })}>
                <div className={cx('title-manager')}>
                  DANH SÁCH QUẢN LÍ TÒA NHÀ {room && room.name ? room.name.toUpperCase() : ''}
                </div>
                <div className={cx('head')}>
                  <div>
                    <FontAwesomeIcon icon={faXmark} className={cx('icon-hide-popup')} onClick={hanleHidePopup} />
                  </div>
                  <div>
                    <Grid container spacing={2}>
                      {currentManagers.map((item) => {
                        const mdValue =
                          currentManagers.length === 4
                            ? 3
                            : currentManagers.length === 3
                              ? 4
                              : currentManagers.length === 2
                                ? 6
                                : 12

                        return (
                          <Grid item xs={12} sm={6} md={mdValue} key={item.id}>
                            <Card sx={{ height: '100%' }}>
                              {/* Hàng 1: Hình ảnh */}
                              <CardMedia
                                component="img"
                                height="150"
                                image={item.imageAvatar}
                                alt={item.text}
                                sx={{
                                  height: 100,
                                  width: 100,
                                  borderRadius: '50%',
                                  margin: '16px auto'
                                }}
                              />

                              {/* Hàng 2: Văn bản */}
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {item.fullName}
                                </Typography>

                                {/* Hàng 3: Radio */}
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="managerSelection"
                                    value={confirmManager} // Liên kết giá trị đã chọn với trạng thái
                                    onChange={() => handleRadioChange(item.id)} // Cập nhật trạng thái khi radio thay đổi
                                  >
                                    <FormControlLabel
                                      value={item.id}
                                      control={<Radio color="primary" />}
                                      label="Chọn"
                                    />
                                  </RadioGroup>
                                </FormControl>

                                {/* Hàng 4: Nút */}
                                <Button
                                  variant="contained"
                                  fullWidth
                                  onClick={() => handleOpenModal(item)}
                                  sx={{
                                    backgroundColor: 'red',
                                    '&:hover': { backgroundColor: 'darkred' },
                                    color: 'white'
                                  }}
                                >
                                  Xem chi tiết
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                      })}
                    </Grid>

                    {/* Pagination */}
                    <Pagination
                      count={Math.ceil(managers.length / itemsPerPage)} // Tổng số trang
                      page={page} // Trang hiện tại
                      onChange={handlePageChange} // Hàm thay đổi trang
                      sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }} // Căn giữa
                    />
                  </div>
                </div>
                <Modal open={isModalOpen} onClose={handleCloseModal}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2
                    }}
                  >
                    {/* Tiêu đề modal */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      <Typography variant="h6" component="h2">
                        Chi tiết Manager
                      </Typography>
                      <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    {/* Nội dung chi tiết */}
                    {selectedManager && (
                      <Grid container spacing={2}>
                        {/* Hình ảnh bên trái */}
                        <Grid item xs={4}>
                          <CardMedia
                            component="img"
                            image={selectedManager.imageAvatar}
                            alt={selectedManager.fullName}
                            sx={{
                              height: 100,
                              width: 100,
                              borderRadius: '50%',
                              margin: 'auto'
                            }}
                          />
                        </Grid>

                        {/* Thông tin bên phải */}
                        <Grid item xs={8}>
                          <Typography variant="subtitle1">
                            <strong>Tên:</strong> {selectedManager.fullName}
                          </Typography>
                          <Typography variant="subtitle1">
                            <strong>Email:</strong> {selectedManager.email}
                          </Typography>
                          <Typography variant="subtitle1">
                            <strong>Ngày sinh:</strong> {selectedManager.dob || 'Chưa cập nhật'}
                          </Typography>
                          <Typography variant="subtitle1">
                            <strong>Số điện thoại:</strong> {selectedManager.phoneNumber || 'Chưa cập nhật'}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </Modal>
              </div>
            }
            {
              <div className={cx('ticket-selector-manager', { hidden: activeStep !== 2 })}>
                <div className={cx('title-manager')}>
                  XÁC NHẬN YÊU CẦU ĐẶT PHÒNG TẠI {room && room.name ? room.name.toUpperCase() : ''}
                </div>
                <div className={cx('head')}>
                  <div>
                    <FontAwesomeIcon icon={faXmark} className={cx('icon-hide-popup')} onClick={hanleHidePopup} />
                  </div>
                </div>
                <div>
                  <Box>
                    {/* Tiêu đề Modal */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}
                    ></Box>

                    {/* Nội dung Modal */}
                    <Grid container spacing={3}>
                      {/* Phần bên trái: Thông tin Manager */}
                      <Grid item xs={6}>
                        <Typography variant="h6" component="h2" sx={{ color: 'black' }}>
                          Quản lí tòa nhà bạn đã chọn
                        </Typography>
                        {confirmManagerItem && (
                          <Grid container spacing={2}>
                            {/* Hình ảnh bên trái */}
                            <Grid item xs={4}>
                              <CardMedia
                                component="img"
                                image={confirmManagerItem.imageAvatar}
                                alt={confirmManagerItem.fullName}
                                sx={{
                                  height: 100,
                                  width: 100,
                                  borderRadius: '50%',
                                  margin: 'auto'
                                }}
                              />
                            </Grid>

                            {/* Thông tin bên phải */}
                            <Grid item xs={8}>
                              <Typography variant="subtitle1" sx={{ color: 'black' }}>
                                <strong>Tên:</strong> {confirmManagerItem.fullName}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ color: 'black' }}>
                                <strong>Email:</strong> {confirmManagerItem.email}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ color: 'black' }}>
                                <strong>Ngày sinh:</strong> {confirmManagerItem.dob || 'Chưa cập nhật'}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ color: 'black' }}>
                                <strong>Số điện thoại:</strong> {confirmManagerItem.phoneNumber || 'Chưa cập nhật'}
                              </Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>

                      {/* Phần bên phải: Danh sách các phòng đã đặt */}
                      <Grid item xs={6}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
                          Danh sách phòng
                        </Typography>
                        <Box
                          sx={{
                            maxHeight: 200,
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: 2,
                            p: 2
                          }}
                        >
                          {selectedIds && selectedIds.length > 0 ? (
                            selectedIds.map((room, index) => (
                              <Typography key={index} variant="body1" sx={{ color: 'black' }}>
                                Phòng: {room}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="body1" sx={{ color: 'black' }}>
                              Chưa có phòng nào được đặt.
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertStateBook}
          variant="filled"
          sx={{
            width: '100%',
            fontSize: '1.5rem', // Tăng kích thước chữ
            padding: '20px'
          }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default DetailRoom
