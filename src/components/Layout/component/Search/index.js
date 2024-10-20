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
const cx = classNames.bind(styles);

function Search() {
  return (
    <Container className={cx('container')}>
      <Row className={cx('search-contain')}>
        <Col sm={2}>
          <div className={cx('search-inline', 'search-input-contain','search-border')}>
              <input  className={cx('input-search')} type="text" placeholder="Tìm kiếm từ khóa"/>
              <div className={cx("icon-face")}>
                <FontAwesomeIcon className={cx('icon-search-input')} icon={faSearch} />
            </div>
          </div>
        </Col>
        <Col sm={2}>
          <div className={cx('search-inline', 'search-border')}>
            <span className={cx('text-search')}>Chọn khu vực</span>
            <div>
              <FontAwesomeIcon className={cx('icon-search')} icon={faAngleDown} />
            </div>
          </div>
        </Col>
        <Col Col sm={2}>
        <div className={cx('search-inline', 'search-border')}>
            <span className={cx('text-search')}>Chọn loại</span>
            <div>
              <FontAwesomeIcon className={cx('icon-search')} icon={faAngleDown} />
            </div>
          </div>
        </Col>
        <Col Col sm={2}>
        <div className={cx('search-inline', 'search-border')}>
            <span className={cx('text-search')}>Chọn diện tích</span>
            <div>
              <FontAwesomeIcon className={cx('icon-search')} icon={faAngleDown} />
            </div>
          </div>
        </Col>
        <Col Col sm={2}>
        <div className={cx('search-inline', 'search-border')}>
            <span className={cx('text-search')}>Chọn khoảng giá</span>
            <div>
              <FontAwesomeIcon className={cx('icon-search')} icon={faAngleDown} />
            </div>
          </div>
        </Col>
        <Col Col sm={2}>
        <ButtonS submit>Tìm kiếm</ButtonS>
        </Col>
      </Row>
    </Container>
  );
}

export default Search;
