import classNames from "classnames/bind";
import styles from "./HaNoi.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function HaNoi() {
    return (
        <div className={cx('detail-area')}>
            <div className={cx('contain-title')}>
                <h3 className={cx('text-left')}>Khu vực</h3>
                <div className={cx('contain-reset')}>
                    <FontAwesomeIcon icon={faXmark} className={cx('icon')}/>
                    <h3 className={cx('text-right')}>Đặt lại</h3>
                </div>
            </div>
        </div>
    )
}

export default HaNoi;