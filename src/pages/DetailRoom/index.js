import classNames from "classnames/bind";
import styles from "./DetailRoom.module.scss";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import about_one from "~/assets/image/about-us-img-1.jpeg";
import about_two from "~/assets/image/about-us-img-2.jpeg";
import about_three from "~/assets/image/about-us-img-3.jpeg";
import about_four from "~/assets/image/about-us-img-4.jpeg";
import React, { useRef, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { faAirbnb, faLine } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

function DetailRoom() {
  const leftTabRef = useRef(null);
  const rightTabRef = useRef(null);

  const leftPaneRef = useRef(null);
  const rightPaneRef = useRef(null);

  const seatRef = useRef(null);
  const labelRef = useRef(null);

  const handleToggleActiveLeftTab = () => {
    if (leftTabRef.current) {
      // Kiểm tra nếu có class "active" thì xóa, nếu chưa có thì thêm vào
      if (leftTabRef.current.classList.contains(styles["active-tab"])) {
      } else {
        leftTabRef.current.classList.add(styles["active-tab"]);
        if (rightTabRef.current.classList.contains(styles["active-tab"])) {
          rightTabRef.current.classList.remove(styles["active-tab"]);
        }
        if (leftPaneRef.current.classList.contains(styles["show-pane"])) {
        } else {
          leftPaneRef.current.classList.add(styles["show-pane"]);
          if (rightPaneRef.current.classList.contains(styles["show-pane"])) {
            rightPaneRef.current.classList.remove(styles["show-pane"]);
          }
        }
      }
    }
  };

  const handleToggleActiveRightTab = () => {
    if (rightTabRef.current) {
      // Kiểm tra nếu có class "active" thì xóa, nếu chưa có thì thêm vào
      if (rightTabRef.current.classList.contains(styles["active-tab"])) {
      } else {
        rightTabRef.current.classList.add(styles["active-tab"]);
        if (leftTabRef.current.classList.contains(styles["active-tab"])) {
          leftTabRef.current.classList.remove(styles["active-tab"]);
        }

        if (rightPaneRef.current.classList.contains(styles["show-pane"])) {
        } else {
          rightPaneRef.current.classList.add(styles["show-pane"]);
          if (leftPaneRef.current.classList.contains(styles["show-pane"])) {
            leftPaneRef.current.classList.remove(styles["show-pane"]);
          }
        }
      }
    }
  };

  const checkBookedOffice = () => {
    // if (labelRef.current && labelRef.current.classList.contains("booked")) {
    //   seatRef.current.disabled = true;
    // }

    if(seatRef.current.classList.value == false){
      labelRef.current.classList.add(styles["booked"]);
    }
  };

  useEffect(() => {
    checkBookedOffice();

    // Tìm element có class 'list-image' khi component render xong
    const listImageElement = document.querySelector(`.${styles["list-image"]}`);
    const ele = document.querySelector(`.${styles["index-item-0"]}`);
    // console.log("ele");
    // console.log(ele);

    var menuItems = $(".left-tab");
    console.log("menuItems");
    console.log(menuItems);

    if (listImageElement) {
      // Thực hiện các thao tác khác nếu cần
      const imgs = document.querySelectorAll("img.image-slide");
      const btnLeft = document.querySelector(`.${styles["btn-left"]}`);
      const btnRight = document.querySelector(`.${styles["btn-right"]}`);
      const length = imgs.length;
      let current = 0;

      const handleChangeSlide = () => {
        if (current == length - 1) {
          current = 0;
          let width = imgs[0].offsetWidth;
          listImageElement.style.transform = `translateX(${
            width * -1 * current
          }px)`;
          // document.querySelector(`.${styles['active']}`).classList.remove('active');
          // document.querySelector(`.${styles['index-item']}-${current}`).classList.add('active');
        } else {
          current++;
          let width = imgs[0].offsetWidth;
          listImageElement.style.transform = `translateX(${
            width * -1 * current
          }px)`;
          // document.querySelector(`.${styles['active']}`).classList.remove('active');
          // document.querySelector(`.${styles['index-item']}-${current}`).classList.add('active');
        }
      };
      let handleEventChangeSilde = setInterval(handleChangeSlide, 4000);

      btnRight.addEventListener("click", () => {
        clearInterval(handleEventChangeSilde);
        handleChangeSlide();
        handleEventChangeSilde = setInterval(handleChangeSlide, 4000);
      });
      btnLeft.addEventListener("click", () => {
        clearInterval(handleEventChangeSilde);
        if (current == 0) {
          current = length - 1;
          let width = imgs[0].offsetWidth;
          listImageElement.style.transform = `translateX(${
            width * -1 * current
          }px)`;
          //     document.querySelector(`.${styles['active']}`).classList.remove('active');
          //     document.querySelector(`.${styles['index-item-' + current]}`).classList.add('active');
        } else {
          current--;
          let width = imgs[0].offsetWidth;
          listImageElement.style.transform = `translateX(${
            width * -1 * current
          }px)`;
          // document.querySelector(`.${styles['active']}`).classList.remove('active');
          // document.querySelector(`.${styles['index-item-' + current]}`).classList.add('active');
        }
        handleEventChangeSilde = setInterval(handleChangeSlide, 4000);
      });
    }
  }, []); // Mảng rỗng để chỉ chạy một lần sau khi component mount
  return (
    // <div className={cx('detail-area')}>
    //     <div className={cx('contain-title')}>
    //         <h3 className={cx('text-left')}>Khu vực</h3>
    //         <div className={cx('contain-reset')}>
    //             <FontAwesomeIcon icon={faXmark} className={cx('icon')}/>
    //             <h3 className={cx('text-right')}>Đặt lại</h3>
    //         </div>
    //     </div>
    // </div>

    <div className={cx("container")}>
      <div className={cx("main-content")}>
        <Row className={cx("row-main")}>
          <Col sm={7} className={cx("col-left-main")}>
            <div className={cx("slide-show")}>
              <div className={cx("list-image")}>
                <img src={about_one} className={cx("image-slide", "image-1")} />
                <img
                  src={about_two}
                  alt="Logo2"
                  className={cx("image-slide", "image-2")}
                />
                <img
                  src={about_three}
                  alt="Logo3"
                  className={cx("image-slide", "image-3")}
                />
                <img
                  src={about_four}
                  alt="Logo4"
                  className={cx("image-slide", "image-4")}
                />
              </div>
              <div className={cx("btns")}>
                <div className={cx("btn-left", "btn")}>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className={cx("icon-left")}
                  />
                </div>
                <div className={cx("btn-right", "btn")}>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className={cx("icon-right")}
                  />
                </div>
              </div>
              <div className={cx("index-images")}>
                <div
                  className={cx("index-item", "index-item-0", "active")}
                ></div>
                <div className={cx("index-item", "index-item-1")}></div>
                <div className={cx("index-item", "index-item-2")}></div>
                <div className={cx("index-item", "index-item-3")}></div>
              </div>
            </div>
            <div className={cx("contain-sub-images")}>
              <img src={about_one} className={cx("sub-image")} />
              <img src={about_two} alt="Logo2" className={cx("sub-image")} />
              <img src={about_three} alt="Logo3" className={cx("sub-image")} />
              <img src={about_four} alt="Logo4" className={cx("sub-image")} />
            </div>
          </Col>
          <Col sm={5} className={cx("col-right-main")}>
            <div className={cx("infor-content-main")}>
              <div className={cx("infor-tab")}>
                <ul className={cx("list-tab")}>
                  <li
                    className={cx("left-tab", "active-tab")}
                    ref={leftTabRef}
                    onClick={handleToggleActiveLeftTab}
                  >
                    <span className={cx("text-left-tab")}>CẤU TRÚC</span>
                  </li>
                  <li
                    className={cx("right-tab")}
                    ref={rightTabRef}
                    onClick={handleToggleActiveRightTab}
                  >
                    <span className={cx("text-right-tab")}>CHI TIẾT GIÁ</span>
                  </li>
                </ul>
              </div>
              <div
                ref={leftPaneRef}
                className={cx("pane-left-tab", "show-pane")}
              >
                <ul className={cx("list-pane-left")}>
                  <li className={cx("item-location")}>
                    <label className={cx("label-location")}>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Vị trí</span>
                    </label>
                    <p className={cx("value-location")}> 198 Trần Quang Khải</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-building")}>
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Số tầng</span>
                    </label>
                    <p className={cx("value-location")}>21 tầng nổi + 04 hầm</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-height")}>
                      <FontAwesomeIcon
                        icon={faLine}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Chiều cao</span>
                    </label>
                    <p className={cx("value-location")}>2.7m</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-dientich")}>
                      <FontAwesomeIcon
                        icon={faSliders}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Diện tích</span>
                    </label>
                    <p className={cx("value-location")}>741m2</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-evalator")}>
                      <FontAwesomeIcon
                        icon={faElevator}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Thang máy</span>
                    </label>
                    <p className={cx("value-location")}>Elevators</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-air-conditional")}>
                      <FontAwesomeIcon
                        icon={faAirbnb}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Điều hòa</span>
                    </label>
                    <p className={cx("value-location")}>Chiller</p>
                  </li>
                </ul>
              </div>

              <div ref={rightPaneRef} className={cx("pane-right-tab")}>
                <ul className={cx("list-pane-left")}>
                  <li className={cx("item-location")}>
                    <label className={cx("label-location")}>
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Giá thuê gộp</span>
                    </label>
                    <p className={cx("value-location")}> 45-50$</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-building")}>
                      <FontAwesomeIcon
                        icon={faCar}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Phí gửi ô tô</span>
                    </label>
                    <p className={cx("value-location")}>150 USD/xe/tháng</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-height")}>
                      <FontAwesomeIcon
                        icon={faBiking}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>
                        Phí gửi xe máy
                      </span>
                    </label>
                    <p className={cx("value-location")}>10 USD/xe/tháng</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-dientich")}>
                      <FontAwesomeIcon
                        icon={faTimeline}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>
                        Phí làm ngoài giờ:
                      </span>
                    </label>
                    <p className={cx("value-location")}>Thương lượng</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-evalator")}>
                      <FontAwesomeIcon
                        icon={faShield}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>
                        Dịch vụ bảo vệ 24/24
                      </span>
                    </label>
                    <p className={cx("value-location")}>10$-100$</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-air-conditional")}>
                      <FontAwesomeIcon
                        icon={faBroomBall}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Dọn vệ sinh</span>
                    </label>
                    <p className={cx("value-location")}>20$/tháng</p>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className={cx("center")}>
        <div className={cx("tickets")}>
          <div className={cx("ticket-selector")}>
            <div className={cx("head")}>
              <div className={cx("title")}>
                DANH SÁCH CÁC TẦNG THUỘC TÒA GELEX
              </div>
            </div>
            <div className={cx("seats")}>
              <div className={cx("status")}>
                <div className={cx("item")}>Available</div>
                <div className={cx("item")}>Booked</div>
                <div className={cx("item")}>Selected</div>
              </div>
              <div className={cx("all-seats")}>
                <input type="checkbox" name="tickets" id="s1" ref={seatRef} value={false}/>
                <label ref={labelRef} for="s1" className={cx("seat")}>
                  <span className={cx("value-label")}>1</span>
                </label>

                <input type="checkbox" name="tickets" id="s2" />
                <label for="s2" className={cx("seat")}>
                  <span className={cx("value-label")}>2</span>
                </label>

                <input type="checkbox" name="tickets" id="s3" />
                <label for="s3" className={cx("seat")}>
                  <span className={cx("value-label")}>3</span>
                </label>
              </div>
            </div>
          </div>
          <div className={cx("price")}>
            <div className={cx("total")}>
              <span className={cx("title-count")}>
                {" "}
                <span className={cx("count")}>0</span> Floors selected{" "}
              </span>
              <div className={cx("amount")}>0</div>
            </div>
            <button type="button">Book</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailRoom;
