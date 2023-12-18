import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import { UserContext } from '../../../context/StoreContext'
import { CreateShipper } from '../../../api/shipper';
import { checkMail } from '../../../api/auth';

import SpinnerButton from "../../SpinnerButton/SpinnerButton";

import closeIcon from "../../../assets/close.svg"
import { UpdateStoreInfor } from '../../../api/store';

const formInputDefault = {
    storeName: "",
    storePhone: "",
    openTime: undefined,
    closeTime: undefined,
}

const UpdateStoreModal = ({ visible, onCancle, focusStore, reLoad }) => {

    const [formInput, setFormInput] = useState({
        storeName: focusStore?.storeName,
        storePhone: focusStore?.storePhone,
        openTime: focusStore?.openTime,
        closeTime: focusStore?.closeTime,
    })
    const [loading, setLoading] = useState(false)
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        setFormInput(
            {
                storeName: focusStore.storeName,
                storePhone: focusStore.storePhone,
                openTime: focusStore.openTime,
                closeTime: focusStore.closeTime,
            }
        )
    }, [focusStore])

    function convertTimeFormat(timeString) {
        if (timeString) {
            const parts = timeString?.split(":");
            if (parts.length === 2) {
                return `${parts[0]}:${parts[1]}:00`;
            } else if (parts.length === 3) {
                return timeString;
            } else {
                return timeString;
            }
        } else {
            return null
        }
    }

    const handleSubmit = async () => {

        const data = {
            storeName: formInput.storeName,
            storePhone: formInput.storePhone,
            openTime: convertTimeFormat(formInput.openTime),
            closeTime: convertTimeFormat(formInput.closeTime),
        }

        console.log(data);

        if (!loading) {
            setLoading(true)
            const response = await UpdateStoreInfor(focusStore?.id, data, token)
            if (response?.status === 200) {
                toast.success('Thay đổi thông tin thành công');
                await reLoad()
                onCancle()
            } else {
                toast.error(`Thay đổi thông tin thất bại`);
            }
            setLoading(false)
        }
    }

    return (
        visible &&
        <div className="update_store">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="title">Sửa thông tin cửa hàng</div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Tên cửa hàng</label>
                        <input type="text" id='name' className='name' value={formInput.storeName} onChange={(e) => setFormInput({ ...formInput, storeName: e.target.value })} />
                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input type="text" id='phone' className='phone' value={formInput.storePhone} onChange={(e) => setFormInput({ ...formInput, storePhone: e.target.value })} />
                    </div>
                </div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Thời gian mở cửa</label>
                        <input type="time" id='name' className='name' value={formInput.openTime} onChange={(e) => setFormInput({ ...formInput, openTime: e.target.value })} />
                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Thời gian đóng cửa</label>
                        <input type="time" id='phone' className='phone' value={formInput.closeTime} onChange={(e) => setFormInput({ ...formInput, closeTime: e.target.value })} />
                    </div>
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

export default UpdateStoreModal
