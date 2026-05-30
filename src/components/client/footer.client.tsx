import React from 'react';
import { HeartTwoTone } from '@ant-design/icons';

const Footer = () => {
    // Tự động lấy năm hiện tại để không bao giờ phải sửa code khi sang năm mới
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            padding: '24px 15px',
            textAlign: "center",
            backgroundColor: '#222831', // Tone màu tối đồng bộ với Header
            color: '#a7a7a7',
            marginTop: 'auto' // Đẩy footer xuống sát đáy màn hình
        }}>
            {/* 1. Phần Bản quyền (Copyright) */}
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ffffff', marginBottom: '8px' }}>
                Copyright © {currentYear} AnhSP. All rights reserved.
            </div>

            {/* 3. Phần Lưu ý (Disclaimer) của bạn */}
            <div style={{
                fontSize: '12px',
                opacity: 0.7,
                borderTop: '1px solid #393E46', // Đường kẻ ngang phân cách tinh tế
                paddingTop: '16px',
                maxWidth: '600px', // Bóp chiều rộng lại để chữ không bị tràn dài sang 2 bên
                margin: '0 auto',  // Căn giữa khối
                lineHeight: '1.6'
            }}>
                Lưu ý: Website này được xây dựng phục vụ mục đích học tập và nghiên cứu cá nhân.<br />
                Mọi thông tin được nhập trên trang đều không được sử dụng vào bất kỳ hoạt động thương mại nào.
            </div>
        </footer>
    );
}

export default Footer;