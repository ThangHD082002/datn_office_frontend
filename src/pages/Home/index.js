import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import SearchHome from '~/components/Layout/component/SearchHome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faSearch, faThumbsDown, faUpDown } from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import ButtonS from '~/components/Layout/component/ButtonS'
import Col from 'react-bootstrap/Col'
import about_one from '~/assets/image/about-us-img-1.jpeg'
import about_two from '~/assets/image/about-us-img-2.jpeg'
import about_three from '~/assets/image/about-us-img-3.jpeg'
import about_four from '~/assets/image/about-us-img-4.jpeg'
import { axiosInstance } from '~/utils/axiosInstance'
import { IconButton, Pagination } from '@mui/material'
import room_1 from '~/assets/image/room1.jpeg'
import room_2 from '~/assets/image/room2.jpeg'
import room_3 from '~/assets/image/room3.jpeg'
import room_4 from '~/assets/image/room4.jpeg'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { ArrowUpward } from '@mui/icons-material'

import { Autocomplete, Box, TextField } from '@mui/material'
import ButtonSH from '~/components/Layout/component/ButtonSH'
import { useNavigate } from 'react-router-dom'
import { RefreshRounded } from '@mui/icons-material'

const cx = classNames.bind(styles)

function Home() {
  const [result, setResult] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 4

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchProvince, setSearchProvince] = useState(null)
  const [searchDistrict, setSearchDistrict] = useState(null)
  const [searchWard, setSearchWard] = useState(null)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  let token = localStorage.getItem('authToken')

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Cuộn mượt mà
    })
  }

  useEffect(() => {
    fetchProvinces()
    getData(page)
  }, [page])

  // const handleChangePage = (event, value) => {
  //   setPage(value)
  // }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const inputStyle = {
    width: '200px',
    '& .MuiInputBase-input': {
      fontSize: '1.3rem'
    },
    '& .MuiInputLabel-root': {
      fontSize: '1.3rem'
    },
    '& .MuiAutocomplete-input': {
      fontSize: '1.3rem'
    }
  }

  const autocompleteStyle = {
    ...inputStyle,
    '& .MuiAutocomplete-listbox': {
      '& .MuiAutocomplete-option': {
        fontSize: '1.3rem !important'
      }
    }
  }

  const handleSearch = () => {
    setPage(1) // Reset page to 1 when searching
    getData(page)
  }

  // Update handleReset
  const handleReset = () => {
    setKeyword('')
    setSearchProvince(null)
    setSearchDistrict(null)
    setSearchWard(null)
    setProvinces([])
    setDistricts([])
    setWards([])
    setPage(1)
    getData(page)
  }

  // Add fetch functions
  const fetchProvinces = async () => {
    try {
      const response = await axiosInstance.get('/provinces')
      setProvinces(response.data)
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axiosInstance.get(`/districts?provinceId=${provinceId}`)
      setDistricts(response.data)
      setSearchDistrict(null)
      setWards([])
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const fetchWards = async (districtId) => {
    try {
      const response = await axiosInstance.get(`/wards?districtId=${districtId}`)
      setWards(response.data)
    } catch (error) {
      console.error('Error fetching wards:', error)
    }
  }

  const getData = async (selectedPage) => {
    console.log('Current page: ' + selectedPage)
    setLoading(true)
    try {
      let url = `/buildings?size=4&page=${selectedPage - 1}`
      // Add query params
      if (keyword !== null && keyword.trim() !== '') url += `&keyword=${keyword}`
      if (searchWard?.id) url += `&wardId=${searchWard.id}`
      else if (searchDistrict?.id) url += `&districtId=${searchDistrict.id}`
      else if (searchProvince?.id) url += `&provinceId=${searchProvince.id}`

      const response = await axiosInstance.get(url)
      console.log('DATA SEARCH')
      console.log(response.data.result.content)
      setTotalPages(response.data.result.totalPages)
      setResult(response.data.result.content)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cx('conatiner')}>
      <div className={cx('container-title')}>
        <Box
          sx={{
            height: '465px',
            width: '514px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            margin: '10px 0 0 140px',
            position: 'absolute',
            top: '15%'
          }}
        >
          <h1 className={cx('title-text-main')}>CHO THUÊ VĂN PHÒNG</h1>
          <span className={cx('title-text-extra')}>Rooms giúp doanh nghiệp tiết kiệm tối đa thời gian</span>

          {/* Hàng đầu tiên: TextField và Autocomplete */}
          <Box
            sx={{
              display: 'flex',
              gap: 2
            }}
          >
            <TextField
              size="small"
              placeholder="Tìm kiếm..."
              value={keyword}
              sx={{ flex: 1 }}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Autocomplete
              size="small"
              options={provinces}
              getOptionLabel={(option) => option.name}
              value={searchProvince}
              onChange={(event, newValue) => {
                setSearchProvince(newValue)
                if (newValue) {
                  fetchDistricts(newValue.id)
                } else {
                  setDistricts([])
                  setWards([])
                }
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <span style={{ fontSize: '1.3rem' }}>{option.name}</span>
                </li>
              )}
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} placeholder="Tỉnh/Thành phố" />}
            />
          </Box>

          {/* Hàng thứ hai: Hai Autocomplete */}
          <Box
            sx={{
              display: 'flex',
              gap: 2
            }}
          >
            <Autocomplete
              size="small"
              options={districts}
              getOptionLabel={(option) => option.name}
              value={searchDistrict}
              disabled={!searchProvince}
              onChange={(event, newValue) => {
                setSearchDistrict(newValue)
                if (newValue) {
                  fetchWards(newValue.id)
                } else {
                  setWards([])
                }
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <span style={{ fontSize: '1.3rem' }}>{option.name}</span>
                </li>
              )}
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} placeholder="Quận/Huyện" />}
            />
            <Autocomplete
              size="small"
              options={wards}
              getOptionLabel={(option) => option.name}
              value={searchWard}
              disabled={!searchDistrict}
              onChange={(event, newValue) => {
                setSearchWard(newValue)
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <span style={{ fontSize: '1.3rem' }}>{option.name}</span>
                </li>
              )}
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} placeholder="Phường/Xã" />}
            />
          </Box>

          {/* Hàng thứ ba: IconButton */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <IconButton
              onClick={handleReset}
              title="Làm mới"
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: '2rem'
                }
              }}
            >
              <RefreshRounded />
            </IconButton>
          </Box>

          {/* Hàng cuối: Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ButtonSH submit onClick={handleSearch}>
              Tìm kiếm
            </ButtonSH>
          </Box>
        </Box>
      </div>
      <section className={cx('about-us')}>
        <div className={cx('about-us-content')}>
          <h1 className={cx('about-us-heading')}>About Us</h1>
          <div className={cx('underline')}>
            <div className={cx('small-underline')}></div>
            <div className={cx('big-underline')}></div>
          </div>
          <h3 className={cx('sub-heading')}>ROOMS</h3>
          <p className={cx('about-us-paragraph')}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus accusantium exercitationem qui quis
            perspiciatis totam dolores. Numquam inventore temporibus recusandae? Eos eaque quia eius culpa nulla vitae,
            cumque enim voluptates!
          </p>
          <button className={cx('about-us-btn')}>
            Read More
            <i className={cx('fas fa-angle-double-right btn-arrow')}></i>
          </button>
        </div>

        <div className={cx('about-us-images')}>
          <img src={about_one} className={cx('image', 'image-1')} />
          <img src={about_two} alt="Logo2" className={cx('image', 'image-2')} />
          <img src={about_three} alt="Logo3" className={cx('image', 'image-3')} />
          <img src={about_four} alt="Logo4" className={cx('image', 'image-4')} />
        </div>
      </section>

      <section className={cx('rooms')}>
        <div className={cx('common-header')}>
          <h1 className={cx('common-heading')}>
            {searchProvince !== null ? 'Các tòa nhà tại ' + searchProvince.name : 'Danh sách tất cả các tòa nhà'}
          </h1>
          <div className={cx('underline')}>
            <div className={cx('small-underline')}></div>
            <div className={cx('big-underline')}></div>
          </div>
        </div>

        <div className={cx('rooms-cards-wrapper')}>
          {result && Array.isArray(result) && result.length > 0 ? (
            result.map((r) => (
              <div key={r.id} className={cx('room-card')}>
                <a href={`/detail-room/${r.id}`} className={cx('item')}>
                  <img src={r.images[0].url} className={cx('room-img')} alt="Room" />
                  <div className={cx('room-card-content')}>
                    <h4 className={cx('room-card-heading')}>{r.name}</h4>
                    <p className={cx('room-card-paragraph')}>{r.address}</p>
                    <button className={cx('room-card-btn')}>
                      Book Now
                      <i className={cx('fas fa-angle-double-right btn-arrow')}></i>
                    </button>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <h2 className={cx('no-data-text')}>Không có dữ liệu tòa nhà nào được tìm thấy</h2>
          )}
        </div>
      </section>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      />

      <div className={cx('rooms-btn-wrapper')}></div>

      <IconButton
        onClick={handleScrollToTop}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark'
          }
        }}
      >
        <ArrowUpward />
      </IconButton>
    </div>
  )
}

export default Home
