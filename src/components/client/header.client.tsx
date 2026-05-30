import { useState, useEffect } from 'react';
import {
    CodeOutlined, ContactsOutlined, FireOutlined, LogoutOutlined,
    MenuFoldOutlined, RiseOutlined, TwitterOutlined, LoginOutlined
} from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    };

    // Xử lý sự kiện click tập trung cho cả Dropdown (PC) và Menu (Mobile)
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        setOpenMobileMenu(false); // Tự động đóng Menu mobile khi click

        if (e.key === 'logout') {
            handleLogout();
        } else if (e.key === 'manage-account') {
            setOpenManageAccount(true);
        }
    };

    // Khai báo itemsDropdown sạch sẽ, không nhúng onClick vào thẻ label
    const itemsDropdown = [
        {
            label: 'Quản lý tài khoản',
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        ...(user?.role?.permissions?.length ? [{
            label: <Link to={"/admin"}>Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />
        }] : []),
        {
            label: 'Đăng xuất',
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    // Tạo mảng Mobile động dựa trên trạng thái xác thực
    const itemsMobiles = isAuthenticated
        ? [...items, ...itemsDropdown]
        : [
            ...items,
            {
                label: <Link to={'/login'}>Đăng Nhập</Link>,
                key: 'login',
                icon: <LoginOutlined />
            }
        ];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }}>
                            <div
                                className="brand"
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => window.location.href = '/'} // Click vào logo để về Trang chủ
                            >
                                <img
                                    src="/Jobby-Logo.png"
                                    alt="Jobby Logo"
                                    style={{ height: '35px', width: 'auto' }}
                                />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#fff',
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >
                                    <Menu
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                        onClick={handleMenuClick}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                        :
                                        <Dropdown
                                            menu={{
                                                items: itemsDropdown,
                                                onClick: handleMenuClick // Truyền hàm xử lý vào Dropdown
                                            }}
                                            trigger={['click']}
                                        >
                                            <Space style={{ cursor: "pointer" }}>
                                                <span>Xin chào {user?.name}</span>
                                                <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                            </Space>
                                        </Dropdown>
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <Link
                                to={'/'}
                                style={{
                                    textDecoration: 'none', // Bỏ gạch chân mặc định của thẻ a
                                    fontSize: '20px',       // Tăng kích cỡ chữ
                                    fontWeight: 'bold',     // In đậm
                                    color: '#1677ff',       // Màu xanh Ant Design (hoặc màu chủ đạo của bạn)
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'              // Khoảng cách nếu bạn chèn thêm icon
                                }}
                            >
                                Jobby
                            </Link>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>

            <Drawer
                // THAY ĐỔI TẠI ĐÂY: Hiển thị tên user trên title nếu đã đăng nhập, nếu chưa thì để "Chức năng"
                title={
                    isAuthenticated ? (
                        <Space style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar size="small" style={{ backgroundColor: '#1677ff' }}>
                                {user?.name?.substring(0, 2)?.toUpperCase()}
                            </Avatar>
                            <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                Xin chào, {user?.name}
                            </span>
                        </Space>
                    ) : (
                        "Chức năng"
                    )
                }
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={handleMenuClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>

            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
};

export default Header;