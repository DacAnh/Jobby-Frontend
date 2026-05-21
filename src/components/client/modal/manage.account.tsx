import { Modal, Table, Tabs, Tag, Form, Row, Col, Input, InputNumber, Select, Button, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchResumeByUser, callUpdateUser } from "@/config/api"; // Đã gộp import
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppSelector, useAppDispatch } from "@/redux/hooks"; // Đã gộp import
import { setUserLoginInfo } from "@/redux/slice/accountSlide";

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
                rowKey="id"
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const user = useAppSelector(state => state.account.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                address: user.address
            });
        }
    }, [user, form]);

    const onFinish = async (values: any) => {
        const { name, age, gender, address } = values;
        setIsSubmit(true);

        const res = await callUpdateUser(user?.id, name, age, gender, address);

        if (res && res.data) {
            message.success("Cập nhật thông tin thành công!");
            dispatch(setUserLoginInfo({
                ...user,
                name: name,
                age: age,
                gender: gender,
                address: address
            }));
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res?.message ? (Array.isArray(res.message) ? res.message[0] : res.message) : "Không thể cập nhật thông tin"
            });
        }

        setIsSubmit(false);
    };

    return (
        <div style={{ padding: '15px 0' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                        >
                            <Input placeholder="Nhập tên hiển thị" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder="Nhập tuổi" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                            <Select
                                placeholder="Chọn giới tính"
                                options={[
                                    { value: 'MALE', label: 'Nam' },
                                    { value: 'FEMALE', label: 'Nữ' },
                                    { value: 'OTHER', label: 'Khác' },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input.TextArea rows={3} placeholder="Nhập địa chỉ hiện tại" />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ textAlign: 'right', marginTop: 10 }}>
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        Cập nhật thông tin
                    </Button>
                </div>
            </Form>
        </div>
    );
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
                width={isMobile ? "100%" : "1000px"}
                style={isMobile ? { top: 10, margin: 0, padding: 0 } : {}}
                bodyStyle={isMobile ? { padding: '10px' } : {}}
            >
                <div style={{ minHeight: isMobile ? 'auto' : 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                        tabPosition="top"
                    />
                </div>
            </Modal>
        </>
    )
}

export default ManageAccount;