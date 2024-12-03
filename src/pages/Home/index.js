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
import {IconButton} from '@mui/material'
import room_1 from '~/assets/image/room1.jpeg'
import room_2 from '~/assets/image/room2.jpeg'
import room_3 from '~/assets/image/room3.jpeg'
import room_4 from '~/assets/image/room4.jpeg'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { ArrowUpward } from '@mui/icons-material'
const cx = classNames.bind(styles)

function Home() {
  const [result, setResult] = useState([])

  let token = localStorage.getItem('authToken')

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Cuộn mượt mà
    })
  }

  useEffect(() => {
    // axios
    //   .get("https://office-nest-ohcid.ondigitalocean.app/api/buildings", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then(function (response) {
    //     // handle success
    //     console.log(response.data.content);
    //     setResult(response.data.content);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //     if (error.response && error.response.status === 401) {
    //       // Chuyển đến trang /error-token nếu mã lỗi là 401 Unauthorized
    //       window.location.href = '/error-token';
    //     }
    //   })
    //   .finally(function () {
    //     // always executed
    //   });
    axiosInstance
      .get('/buildings')
      .then(function (response) {
        // handle success
        console.log(response.data.content)
        setResult(response.data.content)
      })
      .catch(function (error) {
        // handle error
        console.log(error)
        if (error.response && error.response.status === 401) {
          // Chuyển đến trang /error-token nếu mã lỗi là 401 Unauthorized
          window.location.href = '/error-token'
        }
      })
      .finally(function () {
        // always executed
      })
  }, [])

  console.log(result)

  return (
    <div className={cx('conatiner')}>
      <div className={cx('container-title')}>
        <SearchHome />
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
          <h1 className={cx('common-heading')}>Service In The Rooms</h1>
          <div className={cx('underline')}>
            <div className={cx('small-underline')}></div>
            <div className={cx('big-underline')}></div>
          </div>
        </div>

        <div className={cx('rooms-cards-wrapper')}>
          {result.map((r) => (
            <div key={r.id} className={cx('room-card')}>
              <a href={`/detail-room/${r.id}`} className={cx('item')}>
                <img src={r.imageUrls[0]} className={cx('room-img')} />
                <div className={cx('room-card-content')}>
                  <h4 className={cx('room-card-heading')}>{r.name}</h4>
                  <p className={cx('room-card-paragraph')}>{r.address}</p>
                  <p className={cx('room-price')}>$99.00</p>
                  <button className={cx('room-card-btn')}>
                    Book Now
                    <i className={cx('fas fa-angle-double-right btn-arrow')}></i>
                  </button>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className={cx('rooms-btn-wrapper')}>
        <button className={cx('rooms-btn')}>Check All Rooms</button>
      </div>
      <IconButton
        onClick={handleScrollToTop}
        sx={{
          position: 'fixed',
          bottom: '20px', // Đặt vị trí của nút ở dưới cùng
          right: '20px', // Đặt nút ở góc phải
          backgroundColor: 'primary.main', // Màu nền của nút
          color: 'white', // Màu icon
          '&:hover': {
            backgroundColor: 'primary.dark', // Màu khi hover
          },
        }}
      >
        <ArrowUpward />
      </IconButton>
    </div>
  )
}

export default Home
