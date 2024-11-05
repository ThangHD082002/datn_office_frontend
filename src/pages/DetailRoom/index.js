import classNames from "classnames/bind";
import styles from "./DetailRoom.module.scss";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFloor from "~/components/Layout/component/ButtonFloor";
import { useParams } from "react-router-dom";
import { Link, Route, useNavigate  } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
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
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import about_one from "~/assets/image/about-us-img-1.jpeg";
import about_two from "~/assets/image/about-us-img-2.jpeg";
import about_three from "~/assets/image/about-us-img-3.jpeg";
import about_four from "~/assets/image/about-us-img-4.jpeg";
import React, { useRef, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { faAirbnb, faLine } from "@fortawesome/free-brands-svg-icons";
import Button from "@mui/material/Button";

const cx = classNames.bind(styles);

function DetailRoom() {
  const navigate = useNavigate();
  const { rid } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [room, setRoom] = useState({});

  const leftTabRef = useRef(null);
  const rightTabRef = useRef(null);

  const leftPaneRef = useRef(null);
  const rightPaneRef = useRef(null);

  const [alertStateBook, setAlertStateBook] = useState("");
  const [alertText, setAlertText] = useState("");
  const [open, setOpen] = React.useState(false);

  const inputRefs = useRef({});
  const labelRefs = useRef({});
  const [valueInputs, setValueInputs] = useState({});

  const [selectedIds, setSelectedIds] = useState([]);

  const seatRef = useRef(null);
  const labelRef = useRef(null);

  const showListFloor = useRef(null);
  const showListFloorMain = useRef(null);

  const listFloorOrder = useState([]);

  const [infor, setInfor] = useState({});

  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzMwNjQzNzg5LCJleHAiOjE3MzA3MzAxODl9.F1BPfLZnDCwWoiN2GQlDHG0TuscAuBpa6K3KPelRzqqJfHem3kNsG2vy9rJzXndSwI2epfHSRl_00vn1P14QLQ";

  function decodeToken(token) {
    try {
      const decodedData = jwtDecode(token);
      console.log("decodedData"); // Kiểm tra dữ liệu trong token

      console.log(decodedData); // Kiểm tra dữ liệu trong token
      setInfor(decodedData);
      return decodedData;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

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

  // const checkBookedOffice = () => {
  //   if (seatRef.current.classList.value == false) {
  //     labelRef.current.classList.add(styles["booked"]);
  //   }

  // };

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

  function handleOfficeDTOS(response) {
    if (response.data.officeDTOS) {
      response.data.officeDTOS.forEach((item) => {
        // Tạo hoặc cập nhật giá trị trong state valueInputs dựa trên item.status
        setValueInputs((prevValues) => ({
          ...prevValues,
          [`valueInput${item.id}`]: item.status === 0,
        }));

        // Tạo ref cho input nếu chưa tồn tại
        if (!inputRefs.current[`inputRef${item.id}`]) {
          inputRefs.current[`inputRef${item.id}`] = React.createRef();
        }
        if (!labelRefs.current[`labelRef${item.id}`]) {
          labelRefs.current[`labelRef${item.id}`] = React.createRef();
        }

        console.log(labelRefs.current[`labelRef${item.id}`]);

        const inputRef = inputRefs.current[`inputRef${item.id}`];
        const labelRef = labelRefs.current[`labelRef${item.id}`];

        // Kiểm tra sự tồn tại của các ref và thực hiện logic
        if (labelRef.current && inputRef.current) {
          if (inputRef.current.value === "false") {
            labelRef.current.classList.add(styles["booked"]);
            console.log("success");
          } else {
            labelRef.current.classList.remove(styles["booked"]);
          }
        } else {
          console.log(
            `Ref cho input hoặc label của item ${item.id} bị undefined`
          );
        }
      });
    } else {
      console.log("officeDTOS is undefined or not an array");
    }
  }

  useEffect(() => {
    // Thay thế YOUR_BEARER_TOKEN_HERE bằng token của bạn

    decodeToken(token);

    axios
      .get(`https://datnbe.up.railway.app/api/buildings/${rid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        // setRoom((prev) => ({ ...prev, ...response.data }));
        setRoom(response.data);

        // Tạo 2 mảng useRef để lưu theo id

        handleOfficeDTOS(response);
        // kiểm tra nếu inputRef tại id nào bằng false thì add class booked
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

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
  const handleClick = () => {
    if (showListFloor.current) {
      // Lấy computed style của phần tử
      const computedStyle = window.getComputedStyle(showListFloor.current);
      const computedStyleMain = window.getComputedStyle(
        showListFloorMain.current
      );

      // Kiểm tra nếu class "booked" có visibility: hidden
      if (computedStyle.visibility === "hidden") {
        // Xóa thuộc tính "visibility: hidden"
        showListFloor.current.style.visibility = "visible"; // hoặc 'inherit' tùy thuộc vào ý định của bạn
      }

      // Thêm class "booked"
      showListFloor.current.classList.add(styles["center"]);
    }
  };

  const hanleHidePopup = () => {
    if (showListFloor.current) {
      // Lấy computed style của phần tử
      const computedStyle = window.getComputedStyle(showListFloor.current);
      const computedStyleMain = window.getComputedStyle(
        showListFloorMain.current
      );

      // Kiểm tra nếu class "booked" có visibility: hidden
      if (computedStyle.visibility === "visible") {
        // Xóa thuộc tính "visibility: hidden"
        showListFloor.current.style.visibility = "hidden"; // hoặc 'inherit' tùy thuộc vào ý định của bạn
      }

      // Thêm class "booked"
      showListFloor.current.classList.add(styles["center"]);
    }
  };

  const handleChosseFloor = () => {};

  function changeInput(id) {
    setValueInputs((prev) => {
      const currentValue = prev[`valueInput${id}`];

      // Cập nhật selectedIds dựa trên giá trị hiện tại
      setSelectedIds((prevSelectedIds) => {
        if (currentValue) {
          // Nếu valueInput${id} là true, thêm id vào mảng nếu chưa có
          if (!prevSelectedIds.includes(id)) {
            return [...prevSelectedIds, id];
          }
        } else {
          // Nếu valueInput${id} là false, xóa id khỏi mảng nếu có
          return prevSelectedIds.filter((selectedId) => selectedId !== id);
        }
        return prevSelectedIds;
      });

      console.log(selectedIds);

      // Đảo ngược giá trị của valueInput${id}
      return {
        ...prev,
        [`valueInput${id}`]: !currentValue,
      };
    });
  }
  const handleClickk = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const BookFloor = () => {
    const user = parseInt(infor.sub);
    console.log("user");
    console.log(user);
    console.log(selectedIds);

    if (selectedIds.length == 0) {
      setAlertStateBook("warning");
      setAlertText("Bạn cần chọn tối thiếu một phòng !");
      handleClickk();
    } else {
      axios
        .post(
          "https://datnbe.up.railway.app/api/requests",
          {
            userId: user,
            note: "Tôi muốn xem văn phòng",
            officeIds: selectedIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(function (response) {
          console.log("STATE REQUEST");
          console.log(response);
          setAlertStateBook("success");
          setAlertText("Bạn đã đặt phòng thành công !");
          

        })
        .catch(function (error) {
          console.log(error);
          setAlertStateBook("error");
          setAlertText("Hệ thống đang gặp lỗi, vui lòng load lại trang !");
        })
        .finally(function () {
        });
    }
  };

  useEffect(() => {
    if (alertText !== "" && alertText === "Bạn đã đặt phòng thành công !" ) {
        handleClickk();

        // Đặt timeout 4 giây trước khi reload trang
        const timer = setTimeout(() => {
            window.location.reload();
        }, 2300);

        // Hủy bỏ timer nếu `alertText` thay đổi trước khi 4 giây hoàn thành
        return () => clearTimeout(timer);
    }
}, [alertText]);

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
                    <p className={cx("value-location")}> {room.address}</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-building")}>
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Số tầng</span>
                    </label>
                    <p className={cx("value-location")}>{room.numberOfFloor}</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-height")}>
                      <FontAwesomeIcon
                        icon={faLine}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>
                        Chiều cao mỗi tầng
                      </span>
                    </label>
                    <p className={cx("value-location")}>{room.floorHeight}</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-dientich")}>
                      <FontAwesomeIcon
                        icon={faSliders}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Diện tích</span>
                    </label>
                    <p className={cx("value-location")}>{room.floorArea} m2</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-evalator")}>
                      <FontAwesomeIcon
                        icon={faElevator}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Số tầng hầm</span>
                    </label>
                    <p className={cx("value-location")}>3</p>
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
                      <span className={cx("title-location")}>Giá thuê/m2</span>
                    </label>
                    <p className={cx("value-location")}>{room.pricePerM2}$</p>
                  </li>
                  <li className={cx("item-location")}>
                    <label className={cx("label-building")}>
                      <FontAwesomeIcon
                        icon={faCar}
                        className={cx("item-icon-location")}
                      />
                      <span className={cx("title-location")}>Phí gửi ô tô</span>
                    </label>
                    <p className={cx("value-location")}>
                      {room.carParkingFee}$ / tháng
                    </p>
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
                    <p className={cx("value-location")}>
                      {room.motorbikeParkingFee}$ / tháng
                    </p>
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
                    <p className={cx("value-location")}>
                      {room.securityFee}$ / tháng
                    </p>
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
              <ButtonFloor onClick={handleClick}>CHỌN TẦNG</ButtonFloor>
            </div>
          </Col>
        </Row>
      </div>

      <div className={cx("center")} ref={showListFloor}>
        <div className={cx("tickets")} ref={showListFloorMain}>
          <div className={cx("ticket-selector")}>
            <div className={cx("head")}>
              <div className={cx("title")}>
                DANH SÁCH CÁC TẦNG THUỘC TÒA{" "}
                {room && room.name ? room.name.toUpperCase() : ""}
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faXmark}
                  className={cx("icon-hide-popup")}
                  onClick={hanleHidePopup}
                />
              </div>
            </div>
            <div className={cx("seats")}>
              <div className={cx("status")}>
                <div className={cx("item")}>Available</div>
                <div className={cx("item")}>Booked</div>
                <div className={cx("item")}>Selected</div>
              </div>
              <div className={cx("all-seats")}>
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
                      <label
                        ref={labelRefs.current[`labelRef${f.id}`]}
                        htmlFor={f.id}
                        className={cx("seat")}
                      >
                        <span className={cx("value-label")}>{f.id}</span>
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className={cx("price")}>
            <div className={cx("total")}>
              <span className={cx("title-count")}>
                {" "}
                <span className={cx("count")}>{selectedIds.length}</span> Floors
                selected{" "}
              </span>
              <div className={cx("amount")}>0</div>
            </div>
            <Button onClick={BookFloor} variant="contained">
              Book
            </Button>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity={alertStateBook}
                variant="filled"
                sx={{
                  width: "100%",
                  fontSize: "1.5rem", // Tăng kích thước chữ
                  padding: "20px",
                }}
              >
                {alertText}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailRoom;
