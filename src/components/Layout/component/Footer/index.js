import classNames from "classnames/bind";
import styles from "./Footer.module.scss";

import gallery_img_1 from "~/assets/image/gallery-img-1.jpeg";
import gallery_img_2 from "~/assets/image/gallery-img-2.jpeg";
import gallery_img_3 from "~/assets/image/gallery-img-3.jpeg";
import gallery_img_4 from "~/assets/image/gallery-img-4.jpeg";
import gallery_img_5 from "~/assets/image/gallery-img-5.jpeg";
import gallery_img_6 from "~/assets/image/gallery-img-6.jpeg";

const cx = classNames.bind(styles);
function Footer() {
    return (
        <footer className={cx("footer")}>
        <div className={cx("main-part")}>
            <div className={cx("footer-list-wrapper")}>
                <h3 className={cx("footer-heading")}>ROOMS</h3>
                <ul className={cx("footer-list")}>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                            support@grandhotel.com
                        </a>
                    </li>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                            New York, Main Street 123
                        </a>
                    </li>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                            Tel: +123 456 789
                        </a>
                    </li>
                </ul>
            </div>

            <div className={cx("footer-list-wrapper")}>
                <h3 className={cx("footer-heading")}>Explore</h3>
                <ul className={cx("footer-list")}>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                            Home
                        </a>
                    </li>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                            About Us
                        </a>
                    </li>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                           Rooms
                        </a>
                    </li>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                           Events
                        </a>
                    </li>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                            Customers
                        </a>
                    </li>
                    <li className={cx("footer-list-item")}>
                        <a href="#" className={cx("footer-list-link")}>
                            Contact
                        </a>
                    </li>
                </ul>
            </div>

            <div className={cx("contact")}>
                <h3 className={cx("footer-heading")}>Contact</h3>
                <p>Sign Up for News</p>
                <form className={cx("footer-form")}>
                    <input type="text" className={cx("footer-input")} placeholder="Your email..." />
                    <button className={cx("footer-btn")}>Sign Up</button>
                </form>
            </div>

            <div className={cx("gallery")}>
                <h3 className={cx("footer-heading")}>Gallery</h3>
                <div className={cx("gallery-images")}>
                    <div className={cx("image-wrapper")}>
                        <img src={gallery_img_1} className={cx("footer-image")} />
                    </div>
                    <div className={cx("image-wrapper")}>
                        <img src={gallery_img_2} className={cx("footer-image")} />
                    </div>
                    <div className={cx("image-wrapper")}>
                        <img src={gallery_img_3} className={cx("footer-image")} />
                    </div>
                    <div className={cx("image-wrapper")}>
                        <img src={gallery_img_4} className={cx("footer-image")} />
                    </div>
                    <div className={cx("image-wrapper")}>
                        <img src={gallery_img_5} className={cx("footer-image")} />
                    </div>
                    <div className={cx("image-wrapper")}>
                        <img src={gallery_img_6} className={cx("footer-image")} />
                    </div>
                </div>
            </div>
        </div>

        <div className={cx("creator-part")}>
            <div className={cx("copyright-text")}>
                ROOMS
            </div>

            <div className={cx("text-right")}>
                THANK FOR VISIT ROOMS! SEE YOU AGAIN
            </div>
        </div>
    </footer>
    );
}

export default Footer;