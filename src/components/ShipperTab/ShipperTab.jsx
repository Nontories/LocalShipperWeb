import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import { SHIPPERSTATUS } from "../../constants/shipper"
import { VEHICLETYPE } from '../../constants/vehicle';
import { getObjectByValue, getObjectByValueInObj } from '../../utils/utils';

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';

const shipperType = [
    {
        value: SHIPPERSTATUS.ONLINE.value,
        name: "Online",
    },
    {
        value: SHIPPERSTATUS.OFFLINE.value,
        name: "Offline",
    },
    {
        value: SHIPPERSTATUS.DELIVERING.value,
        name: "Đang giao",
    }
]

const ShipperTab = (props) => {

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
    }

    const handleChangePassword = () => {
        setFocusShipper(item)
        setParentModal({ ...parentModal, changePassword: true })
    }

    const handleDeleteShipper = () => {
        setFocusShipper(item)
        setParentModal({ ...parentModal, confirmDeactive: true})
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
            name: "Đặt lại mật khẩu",
            color: "black",
            action: handleChangePassword
        },
        {
            name: "Xóa tài xế",
            color: "red",
            action: handleDeleteShipper
        },
    ]

    return (
        <div className="shipper_tab">
            <div className="tab_name">{item?.fullName}</div>
            <div className="tab_phone">{item?.phoneShipper}</div>
            <div className="tab_mail">{item?.emailShipper}</div>
            <div className="tab_address">{item?.addressShipper}</div>
            <div className="tab_vehicle">{item?.transport?.typeId ? getObjectByValueInObj(VEHICLETYPE, item?.transport?.typeId)?.name : "Xe máy"}</div>
            <div className="tab_status">{getObjectByValue(shipperType, item?.status)?.name}</div>
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

export default ShipperTab
