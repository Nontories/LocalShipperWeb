import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import { UpdateOrder } from '../../../api/order';

import { UserContext } from '../../../context/StoreContext'
import SpinnerButton from "../../SpinnerButton/SpinnerButton";

const UpdateOrderModal = ({ visible, onCancle, focusOrder, reLoad }) => {

    const [formInput, setFormInput] = useState({
        customerPhone: focusOrder.customerPhone,
        customerName: focusOrder.customerName,
        customerEmail: focusOrder.customerEmail,
        orderTime: focusOrder.orderTime,
    })
    const [loading, setLoading] = useState(false)
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        setFormInput(
            {
                customerPhone: focusOrder.customerPhone,
                customerName: focusOrder.customerName,
                customerEmail: focusOrder.customerEmail,
                orderTime: focusOrder.orderTime,
            }
        )
    }, [focusOrder])

    // function convertTimeFormat(timeString) {
    //     if (timeString) {
    //         const parts = timeString?.split(":");
    //         if (parts.length === 2) {
    //             return `${parts[0]}:${parts[1]}:00`;
    //         } else if (parts.length === 3) {
    //             return timeString;
    //         } else {
    //             return timeString;
    //         }
    //     } else {
    //         return null
    //     }
    // }

    const handleSubmit = async () => {

        const data = {
            customerPhone: formInput.customerPhone,
            customerName: formInput.customerName,
            customerEmail: formInput.customerEmail,
            orderTime: formInput.orderTime,
        }

        if (!loading) {
            setLoading(true)
            const response = await UpdateOrder(focusOrder?.id, data, token)
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
                <div className="title">Sửa thông tin đơn hàng</div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Tên khách hàng</label>
                        <input
                            type="text"
                            id='name'
                            className='name'
                            value={formInput.customerName}
                            onChange={(e) => setFormInput({ ...formInput, customerName: e.target.value })}
                        />
                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Email</label>
                        <input
                            type="text"
                            id='phone'
                            className='phone'
                            value={formInput.customerEmail}
                            onChange={(e) => setFormInput({ ...formInput, customerEmail: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Số diện thoại</label>
                        <input
                            type="time"
                            id='name'
                            className='name'
                            value={formInput.customerPhone}
                            onChange={(e) => setFormInput({ ...formInput, customerPhone: e.target.value })}
                        />
                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Thời gian giao hàng</label>
                        <input
                            type="datetime-local"
                            id='phone'
                            className='phone'
                            value={formInput.orderTime}
                            onChange={(e) => setFormInput({ ...formInput, orderTime: e.target.value })}
                        />
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

export default UpdateOrderModal
