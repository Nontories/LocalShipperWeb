import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import { SHIPPERSTATUS } from "../../constants/shipper"
import { formatDate, getObjectByValue, getObjectByValueInObj } from '../../utils/utils';

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';

const shipperType = [
    {
        value: SHIPPERSTATUS.ONLINE.value,
        name: "Đã kích hoạt",
    },
    {
        value: SHIPPERSTATUS.OFFLINE.value,
        name: "Đã kích hoạt",
    },
    {
        value: SHIPPERSTATUS.DELIVERING.value,
        name: "Đã kích hoạt",
    },
    {
        value: SHIPPERSTATUS.DEACTIVE.value,
        name: "Chưa kích hoạt",
    }
]

const ShipperStaffTab = (props) => {

    const item = props?.item
    const setFocusShipper = props?.setFocusShipper
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const [modalVisible, setModalVisible] = useState({ dropdown: false })

    const handleDropdownVisible = () => {
        setModalVisible({ ...modalVisible, dropdown: !modalVisible.dropdown })
    }

    const handleViewShipper = () => {
        setFocusShipper(item)
        setParentModal({ ...parentModal, viewShipper: true })
        console.log(`view shipper shipperid=${item.id}`);
    }

    const hanldeActiveShipper = () => {
        setFocusShipper(item)
        setParentModal({ ...parentModal, chooseZone: true })
    }

    const hanldeDeactiveShipper = () => {
        setFocusShipper(item)
        setParentModal({ ...parentModal, confirmDeactive: true })
    }

    const handleCloseDropdown = () => {
        setModalVisible({ ...modalVisible, dropdown: false })
    }

    const dropdownList = [
        {
            name: "Xem thông tin",
            color: "black",
            action: handleViewShipper
        },
        {
            name: !item.active ? "Kích hoạt tài khoản" : "Vô hiệu hoá",
            color: !item.active ? "#80D828" : "red",
            action: !item.active ? hanldeActiveShipper : hanldeDeactiveShipper,
        },
    ]

    return (
        <div className="shipper_staff_tab">
            <div className="tab_name">{item?.fullname}</div>
            <div className="tab_phone">{item?.phone}</div>
            <div className="tab_mail">{item?.email}</div>
            <div className="tab_date_assign">{formatDate(item?.createDate)}</div>
            <div className="tab_status" style={{ color: item?.active ? "#6DD605" : "#FF0000" }}>{item?.active ? "Đã kích hoạt" : "Chưa kích hoạt"}</div>
            <div className="tab_button" onClick={handleDropdownVisible}>
                <div className="button">
                    <div className="button_circle"></div>
                    <div className="button_circle"></div>
                    <div className="button_circle"></div>
                </div>
                <CustomOptionDropdown visible={modalVisible.dropdown} onCancle={handleCloseDropdown} dropdownList={dropdownList} />
            </div>
        </div>
    )
}

export default ShipperStaffTab
