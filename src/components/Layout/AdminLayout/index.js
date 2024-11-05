import { useState } from 'react';
import SidebarAdmin from '../component/ComponentAdmin/SidebarAdmin';
import styles from "./AdminLayout.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function AdminLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return <div style={{ position: 'relative', display: 'flex' }}>
        <SidebarAdmin onToggle={setSidebarOpen} />
        <div className={cx("container")}>
            {children}
        </div>
        {sidebarOpen && (
            <div className={cx("overlay")} />
        )}
    </div>
}

export default AdminLayout;