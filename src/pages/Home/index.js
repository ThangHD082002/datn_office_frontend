import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import SearchHome from "~/components/Layout/component/SearchHome";
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
import about_one from "~/assets/image/about-us-img-1.jpeg";
import about_two from "~/assets/image/about-us-img-2.jpeg";
import about_three from "~/assets/image/about-us-img-3.jpeg";
import about_four from "~/assets/image/about-us-img-4.jpeg";

import room_1 from "~/assets/image/room1.jpeg";
import room_2 from "~/assets/image/room2.jpeg";
import room_3 from "~/assets/image/room3.jpeg";
import room_4 from "~/assets/image/room4.jpeg";

const cx = classNames.bind(styles);



function Home() {
  return (
    <div className={cx('conatiner')}>
      <div className={cx('container-title')}>
      <SearchHome />
      </div>
      <section className={cx('about-us')}>
      <div className={cx("about-us-content")}>
            <h1 className={cx("about-us-heading")}>About Us</h1>
            <div className={cx("underline")}>
                <div className={cx("small-underline")}></div>
                <div className={cx("big-underline")}></div>
            </div>
            <h3 className={cx("sub-heading")}>ROOMS</h3>
            <p className={cx("about-us-paragraph")}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus accusantium exercitationem qui quis perspiciatis totam dolores. Numquam inventore temporibus recusandae? Eos eaque quia eius culpa nulla vitae, cumque enim voluptates!</p>
            <button className={cx("about-us-btn")}>
                Read More
                <i className={cx("fas fa-angle-double-right btn-arrow")}></i>
            </button>
        </div>

        <div className={cx("about-us-images")}>
            <img src={about_one} className={cx('image', 'image-1')} />
            <img src={about_two} alt="Logo2" className={cx('image','image-2')} />
            <img src={about_three} alt="Logo3" className={cx('image','image-3')} />
            <img src={about_four} alt="Logo4" className={cx('image','image-4')} />
        </div>
      </section>

      <section className={cx("rooms")}>
          <div className={cx("common-header")}>
                <h1 className={cx("common-heading")}>Service In The Rooms</h1>
                <div className={cx("underline")}>
                    <div className={cx("small-underline")}></div>
                    <div className={cx("big-underline")}></div>
                </div>
          </div>

          <div className={cx("rooms-cards-wrapper")}>
            <div className={cx("room-card")}>
                <img src={room_1} className={cx("room-img")} />
                <div className={cx("room-card-content")}>
                    <h4 className={cx("room-card-heading")}>Single Room</h4>
                    <p className={cx("room-card-paragraph")}>Lorem ipsum dolor sit amet.</p>
                    <p className={cx("room-price")}>$99.00</p>
                    <button className={cx("room-card-btn")}>
                        Book Now
                        <i className={cx("fas fa-angle-double-right btn-arrow")}></i>
                    </button>
                </div>
            </div>
            <div className={cx("room-card")}>
                <img src={room_1} className={cx("room-img")} />
                <div className={cx("room-card-content")}>
                    <h4 className={cx("room-card-heading")}>Single Room</h4>
                    <p className={cx("room-card-paragraph")}>Lorem ipsum dolor sit amet.</p>
                    <p className={cx("room-price")}>$99.00</p>
                    <button className={cx("room-card-btn")}>
                        Book Now
                        <i className={cx("fas fa-angle-double-right btn-arrow")}></i>
                    </button>
                </div>
            </div>
            <div className={cx("room-card")}>
                <img src={room_1} className={cx("room-img")} />
                <div className={cx("room-card-content")}>
                    <h4 className={cx("room-card-heading")}>Single Room</h4>
                    <p className={cx("room-card-paragraph")}>Lorem ipsum dolor sit amet.</p>
                    <p className={cx("room-price")}>$99.00</p>
                    <button className={cx("room-card-btn")}>
                        Book Now
                        <i className={cx("fas fa-angle-double-right btn-arrow")}></i>
                    </button>
                </div>
            </div>
            <div className={cx("room-card")}>
                <img src={room_2} className={cx("room-img")} />
                <div className={cx("room-card-content")}>
                    <h4 className={cx("room-card-heading")}>Double Room</h4>
                    <p className={cx("room-card-paragraph")}>Lorem ipsum dolor sit amet.</p>
                    <p className={cx("room-price")}>$199.00</p>
                    <button className={cx("room-card-btn")}>
                        Book Now
                        <i className={cx("fas fa-angle-double-right btn-arrow")}></i>
                    </button>
                </div>
            </div>
            <div className={cx("room-card")}>
                <img src={room_3} className={cx("room-img")} />
                <div className={cx("room-card-content")}>
                    <h4 className={cx("room-card-heading")}>Lux</h4>
                    <p className={cx("room-card-paragraph")}>Lorem ipsum dolor sit amet.</p>
                    <p className={cx("room-price")}>$299.00</p>
                    <button className={cx("room-card-btn")}>
                        Book Now
                        <i className={cx("fas fa-angle-double-right btn-arrow")}></i>
                    </button>
                </div>
            </div>
            <div className={cx("room-card")}>
                <img src={room_4} className={cx("room-img")} />
                <div className={cx("room-card-content")}>
                    <h4 className={cx("room-card-heading")}>VIP</h4>
                    <p className={cx("room-card-paragraph")}>Lorem ipsum dolor sit amet.</p>
                    <p className={cx("room-price")}>$399.00</p>
                    <button className={cx("room-card-btn")}>
                        Book Now
                        <i className={cx("fas fa-angle-double-right btn-arrow")}></i>
                    </button>
                </div>
            </div>
        </div>

      </section>
      
      <div className={cx("rooms-btn-wrapper")}>
            <button className={cx("rooms-btn")}>Check All Rooms</button>
        </div>

    </div>
  );
}

export default Home;
