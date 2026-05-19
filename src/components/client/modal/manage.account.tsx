import { Modal, Table, Tabs, Tag } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchResumeByUser } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: ["job", "company", "name"],
        },
        {
            title: 'Công việc',
            dataIndex: ["job", "name"],
        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
            render: (status: string) => {
                let color = 'default';
                let text = status;

                // Map các giá trị Enum từ Backend sang tiếng Việt và gán màu
                switch (status) {
                    case 'PENDING':
                        color = 'orange';
                        text = 'Chờ xử lý';
                        break;
                    case 'REVIEWING':
                        color = 'blue';
                        text = 'Đang xem xét';
                        break;
                    case 'APPROVED':
                        color = 'green';
                        text = 'Đã chấp nhận';
                        break;
                    case 'REJECTED':
                        color = 'red';
                        text = 'Từ chối';
                        break;
                }

                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                        rel="noreferrer"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
                rowKey="id" // Khai báo rowKey để tránh warning trong console
                // CRITICAL FOR MOBILE: Cho phép bảng vuốt ngang thay vì bóp méo chữ
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    return (
        <div>
            Đang Dev tính năng này
        </div>
    )
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Rải CV`,
            children: <UserResume />,
        },

        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: `Đang Dev tính năng này`,
        },
    ];

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                // Tối ưu Modal cho Mobile: Choán hết chiều ngang màn hình và tinh chỉnh style
                width={isMobile ? "100%" : "1000px"}
                style={isMobile ? { top: 10, margin: 0, padding: 0 } : {}}
                bodyStyle={isMobile ? { padding: '10px' } : {}}
            >
                {/* Trên Mobile nên để minHeight thấp hơn để không bị cuộn trang ảo */}
                <div style={{ minHeight: isMobile ? 'auto' : 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                        // Nếu nội dung tab quá nhiều, cho phép vuốt ngang header của Tabs
                        tabPosition="top"
                    />
                </div>
            </Modal>
        </>
    )
}

export default ManageAccount;