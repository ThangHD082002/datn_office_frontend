import classNames from "classnames/bind";
import styles from "./Search.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSearch,
  faThumbsDown,
  faUpDown,
} from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonS from "~/components/Layout/component/ButtonS";
import Col from "react-bootstrap/Col";
import { axiosInstance } from '~/utils/axiosInstance'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  IconButton,
  TextField
} from '@mui/material'
import ButtonSH from '~/components/Layout/component/ButtonSH'
import { RefreshRounded } from '@mui/icons-material';
const cx = classNames.bind(styles);

function Search() {

    const navigate = useNavigate();

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
        fetchProvinces() // Fetch provinces when the component mounts
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
          navigate('/search-building', { state: response.data.result.content });
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }

  return (
      <Box
  sx={{
    height: 'auto',
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    margin: '10px auto',
    alignItems: 'center',
    position: 'relative',
  }}
>
  {/* TextField và Autocomplete */}
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
    renderInput={(params) => <TextField {...params} placeholder="Tỉnh/Thành phố" />}
  />
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
    renderInput={(params) => <TextField {...params} placeholder="Quận/Huyện" />}
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
    renderInput={(params) => <TextField {...params} placeholder="Phường/Xã" />}
  />

  {/* IconButton */}
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

  {/* Button */}
  <ButtonSH submit onClick={handleSearch}>
    Tìm kiếm
  </ButtonSH>
</Box>
  );
}

export default Search;
