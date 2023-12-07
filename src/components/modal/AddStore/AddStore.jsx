import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import { UserContext } from '../../../context/StoreContext'
import { CreateShipper } from '../../../api/shipper';
import { checkMail } from '../../../api/auth';

import SpinnerButton from "../../SpinnerButton/SpinnerButton";

import closeIcon from "../../../assets/close.svg"



const AddStore = ({ visible, onCancle, zoneList }) => {

    const formInputDefault = {
        name: "",
        phone: "",
        email: "",
        address: "",
        openTime: undefined,
        closeTime: undefined,
        zone: zoneList[0]?.id,
        password: "",
        rePassword: "",
    }

    const [formInput, setFormInput] = useState(formInputDefault)
    const [valid, setValid] = useState(false)
    const [loading, setLoading] = useState(false)
    const { store, token } = useContext(UserContext);

    const handleSubmit = async () => {
        if (!loading) {
            setLoading(true)
            if (
                formInput?.name !== "" &&
                formInput?.phone !== "" &&
                formInput?.email !== "" &&
                formInput?.address !== "" &&
                formInput?.openTime &&
                formInput?.closeTime &&
                formInput?.password !== "" &&
                formInput?.rePassword !== ""
            ) {
                if (formInput?.password !== formInput?.rePassword) {
                    toast.warning("Mật khẩu không đúng")
                } else {
                    if (valid) {
                        const data = {
                            fullName: formInput?.name,
                            email: formInput?.email,
                            phone: formInput?.phone,
                            password: formInput?.shipperPassword,
                            confirmPassword: formInput?.rePassword,
                        }
                        // const response = await CreateShipper(store?.id, data, token)
                        // if (response?.status === 200) {
                        //     toast.success('Thêm shipper thành công');
                        //     onCancle()
                        // } else {
                        //     toast.error(`Thêm shipper thất bại : ${response?.response?.data}`);
                        // }
                    } else {
                        toast.warning('Mail đã được đăng ký');
                    }
                }

            } else {
                toast.warning('Thông tin chưa đủ');
            }
            setLoading(false)
        }
    }

    const handleCheckMailValid = async (mail) => {
        setLoading(true)
        const response = await checkMail(mail, token)
        if (response?.data === "Valid") {
            setValid(true)
        } else {
            setValid(false)
        }
        setLoading(false)
    }

    return (
        visible &&
        <div className="add_shipper">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="title">Thêm Shipper của cửa hàng</div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Họ và tên *</label>
                        <input type="text" id='name' className='name' value={formInput.name} onChange={(e) => setFormInput({ ...formInput, name: e.target.value })} />
                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Số điện thoại *</label>
                        <input type="text" id='phone' className='phone' value={formInput.phone} onChange={(e) => setFormInput({ ...formInput, phone: e.target.value })} />
                    </div>
                </div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="mail">Email *</label>
                        <input
                            type="text"
                            id='mail'
                            className='mail'
                            value={formInput.email}
                            onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
                            onBlur={(e) => handleCheckMailValid(e.target.value)}
                        />
                        {
                            formInput.email !== "" ?
                                !valid &&
                                <div className="error_message">Email đã được đăng ký</div>
                                :
                                ""
                        }
                    </div>
                    <div className="input_lable">
                        <label htmlFor="address">Địa chỉ *</label>
                        <input type="text" id='address' className='address' value={formInput.address} onChange={(e) => setFormInput({ ...formInput, address: e.target.value })} />
                    </div>
                </div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Thời gian đóng mở/cửa</label>
                        <div className="flex_column" style={{ width: "120%"}}>
                            <input
                                type="date"
                                id='name'
                                className='name'
                                value={formInput.openTime}
                                onChange={(e) => setFormInput({ ...formInput, openTime: e.target.value })}
                            />
                            <input
                                type="datetime-local"
                                id='name'
                                className='name'
                                value={formInput.closeTime}
                                onChange={(e) => setFormInput({ ...formInput, closeTime: e.target.value })}
                                style={{marginLeft: 10}}
                            />
                        </div>

                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Khu vực</label>
                        <select
                            type="text"
                            id='mail'
                            className='select_zone'
                            value={formInput.zone}
                            onChange={(e) => setFormInput({ ...formInput, zone: e.target.value })}
                        >
                            {zoneList.map((item, key) => {
                                return (
                                    <option className="input_option" value={item.id} key={key}>
                                        {item.zoneName}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>

                <div className="input_lable">
                    <label htmlFor="shipper_password">Mật khẩu tạm thời</label>
                    <input type="password" id='shipper_password' className='shipper_password' value={formInput.shipperPassword} onChange={(e) => setFormInput({ ...formInput, shipperPassword: e.target.value })} />
                </div>
                <div className="input_lable">
                    <label htmlFor="repassword">Nhập lại mật khẩu</label>
                    <input type="password" id='repassword' className='repassword' value={formInput.rePassword} onChange={(e) => setFormInput({ ...formInput, rePassword: e.target.value })} />
                </div>
                <div className="button_pack">
                    <div className="cancle_button" onClick={onCancle}>Hủy</div>
                    <div className="add_button" onClick={handleSubmit}>
                        <SpinnerButton isLoading={loading} content={"Thêm"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStore
