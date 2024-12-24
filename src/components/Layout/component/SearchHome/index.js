import classNames from 'classnames/bind'
import styles from './SearchHome.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { faAngleDown, faSearch, faThumbsDown, faUpDown } from '@fortawesome/free-solid-svg-icons'
import {
  Autocomplete,
  Box,
  IconButton,
  TextField
} from '@mui/material'
import { axiosInstance } from '~/utils/axiosInstance'
import Button from 'react-bootstrap/Button'
import ButtonSH from '~/components/Layout/component/ButtonSH'
import { useNavigate } from 'react-router-dom'
import { RefreshRounded } from '@mui/icons-material';
const cx = classNames.bind(styles)

function SearchHome() {
  const navigate = useNavigate()
      const [loading, setLoading] = useState(false)
      const [data, setData] = useState([])
      const [keyword, setKeyword] = useState('')
      const [searchProvince, setSearchProvince] = useState(null)
      const [searchDistrict, setSearchDistrict] = useState(null)
      const [searchWard, setSearchWard] = useState(null)
      const [provinces, setProvinces] = useState([])
      const [districts, setDistricts] = useState([])
      const [wards, setWards] = useState([])

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
    getData()
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
    getData()
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

  useEffect(() => {
    fetchProvinces(); // Fetch provinces when the component mounts
    getData()   // Fetch data when the component mounts
}, [])

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

  const getData = async () => {
    setLoading(true)
    try {
      let url = `/buildings?page=0`
      // Add query params
      if (keyword !== null && keyword.trim() !== '') url += `&keyword=${keyword}`
      if (searchWard?.id) url += `&wardId=${searchWard.id}`
      else if (searchDistrict?.id) url += `&districtId=${searchDistrict.id}`
      else if (searchProvince?.id) url += `&provinceId=${searchProvince.id}`

      const response = await axiosInstance.get(url)
      console.log('DATA SEARCH')
      console.log(response.data.result.content)
      setData(response.data.result.content)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
      
  return (
<Box
  sx={{
    height: '514px',
    width: '514px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    margin: '10px 0 0 140px',
    position: 'absolute',
    top: '15%',
  }}
>
  <h1 className={cx('title-text-main')}>CHO THUÊ VĂN PHÒNG</h1>
  <span className={cx('title-text-extra')}>Rooms giúp doanh nghiệp tiết kiệm tối đa thời gian</span>

  {/* Hàng đầu tiên: TextField và Autocomplete */}
  <Box
    sx={{
      display: 'flex',
      gap: 2,
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
        setSearchProvince(newValue);
        if (newValue) {
          fetchDistricts(newValue.id);
        } else {
          setDistricts([]);
          setWards([]);
        }
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <span style={{ fontSize: '1.3rem' }}>{option.name}</span>
        </li>
      )}
      sx={{ flex: 1 }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Tỉnh/Thành phố" />
      )}
    />
  </Box>

  {/* Hàng thứ hai: Hai Autocomplete */}
  <Box
    sx={{
      display: 'flex',
      gap: 2,
    }}
  >
    <Autocomplete
      size="small"
      options={districts}
      getOptionLabel={(option) => option.name}
      value={searchDistrict}
      disabled={!searchProvince}
      onChange={(event, newValue) => {
        setSearchDistrict(newValue);
        if (newValue) {
          fetchWards(newValue.id);
        } else {
          setWards([]);
        }
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <span style={{ fontSize: '1.3rem' }}>{option.name}</span>
        </li>
      )}
      sx={{ flex: 1 }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Quận/Huyện" />
      )}
    />
    <Autocomplete
      size="small"
      options={wards}
      getOptionLabel={(option) => option.name}
      value={searchWard}
      disabled={!searchDistrict}
      onChange={(event, newValue) => {
        setSearchWard(newValue);
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <span style={{ fontSize: '1.3rem' }}>{option.name}</span>
        </li>
      )}
      sx={{ flex: 1 }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Phường/Xã" />
      )}
    />
  </Box>

  {/* Hàng thứ ba: IconButton */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <IconButton
      onClick={handleReset}
      title="Làm mới"
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: '2rem',
        },
      }}
    >
      <RefreshRounded />
    </IconButton>
  </Box>

  {/* Hàng cuối: Button */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <ButtonSH submit onClick={handleSearch} >Tìm kiếm</ButtonSH>
  </Box>
</Box>
  )
}

export default SearchHome
