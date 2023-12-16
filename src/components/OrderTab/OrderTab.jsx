import React, { useState, useContext } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';

import { UserContext } from '../../context/StoreContext';
import { ORDER } from "../../constants/order"
import { InteractOrder } from '../../api/order';
import { formatDate, formatPrice, getObjectByValueInObj } from '../../utils/utils';

import threeDotIcon from "../../assets/three_dots.svg"
import makerIcon from "../../assets/maker.svg"
import addIcon from "../../assets/add.svg"

const modalVisibleDefault = {
    dropdown: false
}

const OrderTab = (props) => {

    const item = props?.item
    const key = props?.tabIndex
    const timeAssign = props?.timeAssign
    const setOrder = props?.setOrder
    const setDetail = props?.setDetail
    const setChooseShipper = props?.setChooseShipper
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const setOrderList = props?.setOrderList
    const orderList = props?.orderList
    const [modalVisible, setModalVisible] = useState(modalVisibleDefault)
    const { store, token } = useContext(UserContext);

    function findOrderIndexById(orderList, targetId) {
        for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].id === targetId) {
                return i;
            }
        }
        return -1;
    }

    const hanldeAssign = (item) => {
        setChooseShipper(item)
    }

    const hanldeUnAssign = async () => {
        console.log(item?.id);
        const data = {
            id: item?.id,
            shipperId: item?.shipper?.id,
            status: ORDER.IDLE.value
        }
        const response = await InteractOrder(data, token)
        if (response?.status === 200) {
            const index = findOrderIndexById(orderList, item?.id)
            const updateList = [...orderList]
            updateList[index].status = ORDER.IDLE.value
            setOrderList(updateList)
        }
    }

    const hanldePublic = async (item) => {
        if (timeAssign) {
            const data = {
                id: item?.id,
                shipperId: 0,
                status: ORDER.ASSIGNING.value
            }
            const response = await InteractOrder(data, token)
            if (response?.status === 200) {
                const index = findOrderIndexById(orderList, item?.id)
                const updateList = [...orderList]
                updateList[index].status = ORDER.ASSIGNING.value
                setOrderList(updateList)
            }
        } else {
            toast.warning('Chưa chọn thời gian giao hàng');
        }
    }

    const handleDropdownVisible = () => {
        setModalVisible({ ...modalVisible, dropdown: !modalVisible.dropdown })
    }

    const handleEditOrder = () => {
        setOrder(item)
        setParentModal({ ...parentModal, updateOrder: true })
    }

    const hanldeDeleteOrder = () => {
        setOrder(item)
        setParentModal({ ...parentModal, confirmDelete: true })
    }

    const handleCloseDropdown = () => {
        setModalVisible({ ...modalVisible, dropdown: false })
    }

    const renderOrderButton = () => {
        switch (item?.status) {
            case ORDER.IDLE.value:
                return (
                    <div className="assign">
                        <div className="assign_button" style={{ marginRight: 20 }} onClick={() => { hanldePublic(item) }}>
                            {/* <img src={addIcon} alt="" /> */}
                            Công Khai
                        </div>
                        <div className="assign_button" onClick={() => { hanldeAssign(item) }}>
                            <img src={addIcon} alt="" />
                            Chọn Tài Xế
                        </div>
                    </div>
                )
            case ORDER.WAITING.value:
                return (
                    <div className="assign">
                        <div className="assign_button assigned" onClick={() => { hanldeUnAssign() }}>
                            Bỏ Chọn
                        </div>
                    </div>
                )
            case ORDER.ASSIGNING.value:
                return (
                    <div className="assign">
                        <div className="assign_button assigned" onClick={() => { hanldeUnAssign() }}>
                            Huỷ Công Khai
                        </div>
                    </div>
                )
            case ORDER.CANCELLED.value:
                return (
                    <div className="assign">
                        <div className="assign_button" style={{ marginRight: 20 }} onClick={() => { hanldePublic(item) }}>
                            Công Khai
                        </div>
                        <div className="assign_button" onClick={() => { hanldeAssign(item) }}>
                            <img src={addIcon} alt="" />
                            Chọn Tài Xế
                        </div>
                    </div>
                )
            default:
                break;
        }
    }

    const dropdownList = [
        {
            name: "Chỉnh sửa đơn hàng",
            color: "black",
            action: handleEditOrder
        },
        {
            name: "Xoá đơn hàng",
            color: "red",
            action: hanldeDeleteOrder
        },
    ]

    const renderOrderStatus = (status) => {
        switch (status) {
            case ORDER.WAITING.value:
                return <div className="shipper_name">Đang chờ {item?.shipper?.fullName ? item?.shipper?.fullName : "shipper"} Nhận đơn</div>
            case ORDER.ASSIGNING.value:
                return <div className="shipper_name" style={{ background: "rgba(8, 191, 138, 0.25)", color: "#08BF8A" }}>{getObjectByValueInObj(ORDER, status)?.name}</div>
            case ORDER.CANCELLED.value:
                return <div className="shipper_name" style={{ background: "rgba(255, 3, 3, 0.25)", color: "rgba(255, 0, 0, 0.5)" }}>{getObjectByValueInObj(ORDER, status)?.name}</div>
            case ORDER.RETURN.value:
                return <div className="shipper_name" style={{ background: "rgba(255, 3, 3, 0.25)", color: "rgba(255, 0, 0, 0.5)" }}>{getObjectByValueInObj(ORDER, status)?.name}</div>
            case ORDER.COMPLETED.value:
                return <div className="shipper_name" style={{ background: "#08BF8A", color: "white" }}>{getObjectByValueInObj(ORDER, status)?.name}</div>
            default:
                return <div className="shipper_name" style={{ background: "#72AFD3", color: "white" }}>{getObjectByValueInObj(ORDER, status)?.name}</div>
        }
    }

    return (
        <div className="order_tab" key={key}>
            <div className="tab_header">
                <div className="tab_name" style={{ cursor: 'pointer' }} onClick={() => setDetail(item)}>#{item?.trackingNumber}</div>
                {renderOrderStatus(item?.status)}
                <div className="dropdown_list" onClick={handleDropdownVisible}>
                    <img src={threeDotIcon} className='three_dot_icon' alt="" />
                    <CustomOptionDropdown visible={modalVisible.dropdown} onCancle={handleCloseDropdown} dropdownList={dropdownList} />
                </div>

            </div>
            <div className="tab_body">
                <div className="tab_flex_column">
                    <div className="left">
                        <div className="circle"></div>
                        <div className="tab_name tab_store_name">
                            {item?.store?.storeName}
                        </div>
                        <div className="tab_address tab_store_address">
                            {item?.store?.storeAddress}
                        </div>
                    </div>
                    <div className="right">
                        <div className="right_text">{formatDate(item?.createTime)}</div>
                    </div>
                </div>
                <div className="tab_flex_column">
                    <div className="left">
                        <div className="maker"><img src={makerIcon} alt="" /></div>
                        <div className="tab_name tab_customer_name">
                            {item?.customerName}
                        </div>
                        <div className="tab_address tab_customer_address">
                            {item?.customerCommune + ", " + item?.customerDistrict}
                        </div>
                    </div>
                    <div className="right">
                        <div className="right_text">{formatDate(item?.createTime)}</div>
                        <div className="center_dot"></div>
                        <span className="total_price"> {formatPrice(item?.distancePrice + item?.subtotalPrice + item?.cod)} đ</span>
                    </div>
                </div>
                {renderOrderButton()}
            </div>
        </div>
    )
}

export default OrderTab
