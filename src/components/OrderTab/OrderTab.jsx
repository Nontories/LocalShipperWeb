import React, { useState, useContext } from 'react'
import './styles.scss'

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';

import { UserContext } from '../../context/StoreContext';
import { ORDER } from "../../constants/order"
import { InteractOrder } from '../../api/order';
import { formatDate, formatPrice } from '../../utils/utils';

import threeDotIcon from "../../assets/three_dots.svg"
import makerIcon from "../../assets/maker.svg"
import addIcon from "../../assets/add.svg"

const modalVisibleDefault = {
    dropdown: false
}

const OrderTab = (props) => {

    const item = props?.item
    const key = props?.tabIndex
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
        const data = {
            id: item?.id,
            // shipperId: null,
            status: ORDER.ASSIGNING.value
        }
        const response = await InteractOrder(data, token)
        if (response?.status === 200) {
            const index = findOrderIndexById(orderList, item?.id)
            const updateList = [...orderList]
            updateList[index].status = ORDER.ASSIGNING.value
            setOrderList(updateList)
        }
    }

    const handleDropdownVisible = () => {
        setModalVisible({ ...modalVisible, dropdown: !modalVisible.dropdown })
    }

    const handleEditOrder = () => {
        console.log(`edit order id = ${item.id}`);
    }

    const hanldeDeleteOrder = () => {
        setOrder(item)
        setParentModal({ ...parentModal, confirmDelete: true })
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

    return (
        <div className="order_tab" key={key}>
            <div className="tab_header">
                {
                    item?.status === ORDER.WAITING.value &&
                    <div className="shipper_name">Đang chờ {item?.shipper?.fullName}</div>
                }
                <div className="tab_name" onClick={() => setDetail(item)}>#{item?.trackingNumber}</div>
                <div className="dropdown_list" onClick={handleDropdownVisible}>
                    <img src={threeDotIcon} className='three_dot_icon' alt="" />
                    <CustomOptionDropdown visible={modalVisible.dropdown} dropdownList={dropdownList} />
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
                        <span className="total_price"> {formatPrice(item?.totalPrice)} đ</span>
                    </div>
                </div>
                {
                    item?.status === ORDER.WAITING.value || item?.status === ORDER.IDLE.value || item?.status === ORDER.ASSIGNING.value ?
                        <div className="assign">
                            {
                                item?.status !== ORDER.WAITING.value ?
                                    <div className="assign_button" onClick={() => { hanldeAssign(item) }}>
                                        <img src={addIcon} alt="" />
                                        Assign
                                    </div>
                                    :
                                    <div className="assign_button assigned" onClick={() => { hanldeUnAssign() }}>
                                        Unassign
                                    </div>
                            }
                        </div>
                        :
                        ""
                }
            </div>
        </div>
    )
}

export default OrderTab
