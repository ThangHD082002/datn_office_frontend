import classNames from "classnames/bind";
import styles from "./SearchHome.module.scss";
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
import ButtonSH from "~/components/Layout/component/ButtonSH";
import Col from "react-bootstrap/Col";
const cx = classNames.bind(styles);

function SearchHome() {
  return (
    <div className={cx("container")}>
      <h1 className={cx("title-text-main")}>CHO THUÊ VĂN PHÒNG</h1>
      <span className={cx("title-text-extra")}>
        Rooms giúp doanh nghiệp tiết kiệm tối đa thời gian
      </span>
      <div
        className={cx("search-inline", "search-input-contain", "search-border")}
      >
        <input
          className={cx("input-search")}
          type="text"
          placeholder="Tìm kiếm từ khóa"
        />
        <div className={cx("icon-face")}>
          <FontAwesomeIcon
            className={cx("icon-search-input")}
            icon={faSearch}
          />
        </div>
      </div>
      <div className={cx('area-search-one')}>
        <div className={cx("search-inline", "search-border")}>
          <span className={cx("text-search")}>Chọn khu vực</span>
          <div>
            <FontAwesomeIcon className={cx("icon-search")} icon={faAngleDown} />
          </div>
        </div>
        <div className={cx("search-inline", "search-border")}>
          <span className={cx("text-search")}>Chọn loại</span>
          <div>
            <FontAwesomeIcon className={cx("icon-search")} icon={faAngleDown} />
          </div>
        </div>
      </div>
      <div className={cx('area-search-two')}>
        <div className={cx("search-inline", "search-border")}>
          <span className={cx("text-search")}>Chọn diện tích</span>
          <div>
            <FontAwesomeIcon className={cx("icon-search")} icon={faAngleDown} />
          </div>
        </div>
        <div className={cx("search-inline", "search-border")}>
          <span className={cx("text-search")}>Chọn khoảng giá</span>
          <div>
            <FontAwesomeIcon className={cx("icon-search")} icon={faAngleDown} />
          </div>
        </div>
      </div>
      <div className={cx('btn-search')}>
      <ButtonSH submit>Tìm kiếm</ButtonSH>
      </div>
    </div>
  );
}

export default SearchHome;
