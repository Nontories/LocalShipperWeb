import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import { SHIPPERSTATUS } from "../../constants/shipper"
import { formatDate, getObjectByValue, getObjectByValueInObj } from '../../utils/utils';

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';


const StoreTab = (props) => {

    const item = props?.item
    const setFocusStore = props?.setFocusStore
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const [modalVisible, setModalVisible] = useState({ dropdown: false })

    const handleDropdownVisible = () => {
        setModalVisible({ ...modalVisible, dropdown: !modalVisible.dropdown })
    }

    const handleViewStore = () => {
        setFocusStore(item)
        setParentModal({ ...parentModal, viewStore: true })
        console.log(`view handleViewStore shipperid=${item.id}`);
    }

    const hanldeEditStore = () => {
        setFocusStore(item)
        setParentModal({ ...parentModal, editStore: true })
    }

    const hanldeDeleteStore = () => {
        setFocusStore(item)
        setParentModal({ ...parentModal, confirmDeactive: true })
    }

    const handleCloseDropdown = () => {
        setModalVisible({ ...modalVisible, dropdown: false })
    }

    const dropdownList = [
        {
            name: "Xem thông tin",
            color: "black",
            action: handleViewStore
        },
        {
            name: "Chỉnh sửa thông tin",
            color: "black",
            action: hanldeEditStore
        },
        {
            name: "Xoá",
            color: "red",
            action: hanldeDeleteStore,
        },
    ]

    return (
        <div className="store_tab">
            <div className="tab_name">{item?.storeName}</div>
            <div className="tab_phone">{item?.storePhone}</div>
            <div className="tab_mail">{item?.storeEmail}</div>
            <div className="tab_address">{item?.storeAddress}</div>
            <div className="tab_time"> Thời gian </div>
            <div className="tab_zone">{item?.zone?.zoneName}</div>
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

export default StoreTab
