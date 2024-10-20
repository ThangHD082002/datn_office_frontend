import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';


const cx = classNames.bind(styles)
function DefaultLayout({children}) {
    return (
        <div>
            <Header />
            <div className={cx('container')} >
                <Sidebar />
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DefaultLayout;