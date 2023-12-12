import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import { UserContext } from '../../../context/StoreContext'

import SpinnerButton from "../../SpinnerButton/SpinnerButton";

import closeIcon from "../../../assets/close.svg"
import { EditAccount } from '../../../api/account';

const formInputDefault = {
    storeName: "",
    storePhone: "",
    openTime: undefined,
    closeTime: undefined,
}

const UpdateAccount = ({ visible, onCancle, focusAccount, reLoad, roleList }) => {

    const [formInput, setFormInput] = useState({
        fullname: focusAccount.fullname,
        phone: focusAccount.phone,
        roleId: focusAccount.roleId,
    })
    const [loading, setLoading] = useState(false)
    const { token } = useContext(UserContext);

    useEffect(() => {
        setFormInput({
            fullname: focusAccount.fullname,
            phone: focusAccount.phone,
            roleId: focusAccount.roleId,
        })
    }, [focusAccount])

    const handleSubmit = async () => {

        const data = {
            fullname: formInput.fullname,
            phone: formInput.phone,
            roleId: formInput.roleId,

            email: focusAccount?.email,
            password: focusAccount?.password,
            imageUrl: focusAccount?.imageUrl,
            fcm_token: focusAccount?.fcm_token,
            active: focusAccount?.active
        }

        console.log(data);

        if (!loading) {
            setLoading(true)
            const response = await EditAccount(focusAccount?.id, data, token)
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
                <div className="title">Sửa thông tin tài khoản {focusAccount?.fullname}</div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Tên cửa tài khoản</label>
                        <input type="text" id='name' className='name' value={formInput.fullname} onChange={(e) => setFormInput({ ...formInput, fullname: e.target.value })} />
                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input type="text" id='phone' className='phone' value={formInput.phone} onChange={(e) => setFormInput({ ...formInput, phone: e.target.value })} />
                    </div>
                </div>
                <div className="input_lable" style={{ maxWidth: "91.8%" }}>
                    <label htmlFor="phone">Vai trò</label>
                    <select
                        type="text"
                        id='mail'
                        className='select_zone'
                        value={formInput.roleId}
                        defaultValue={focusAccount.roleId}
                        onChange={(e) => setFormInput({ ...formInput, roleId: e.target.value })}
                    >
                        {roleList.map((item, key) => {
                            return (
                                <option className="input_option" value={item.id} key={key} selected={item.id === focusAccount.roleId}>
                                    {item.name}
                                </option>
                            )
                        })}
                    </select>
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

export default UpdateAccount
