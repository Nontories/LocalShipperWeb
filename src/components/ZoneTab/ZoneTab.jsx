import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import { SHIPPERSTATUS } from "../../constants/shipper"
import { formatDate, getObjectByValue, getObjectByValueInObj } from '../../utils/utils';

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';

const ZoneTab = (props) => {

    const item = props?.item
    const setFocusZone = props?.setFocusZone
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const [modalVisible, setModalVisible] = useState({ dropdown: false })

    const handleDropdownVisible = () => {
        setModalVisible({ ...modalVisible, dropdown: !modalVisible.dropdown })
    }

    const hanldeDeactiveShipper = () => {
        setFocusZone(item)
        setParentModal({ ...parentModal, confirmDeactive: true })
    }

    const hanldeActiveShipper = () => {
        setFocusZone(item)
        setParentModal({ ...parentModal, confirmActive: true })
    }

    const handleCloseDropdown = () => {
        setModalVisible({ ...modalVisible, dropdown: false })
    }

    const dropdownList = [
        {
            name: !item?.active ? "Kích hoạt" : "Vô hiệu hóa",
            color: !item?.active ? "#6DD605" : "#FF0000",
            action: !item?.active ? hanldeActiveShipper : hanldeDeactiveShipper
        },
    ]

    return (
        <div className="zone_tab">
            <div className="tab_name">{item?.zoneName}</div>
            <div className="tab_descrip">{item?.zoneDescription}</div>
            <div className="tab_create-date">{formatDate(item?.createdAt)}</div>
            <div className="tab_edit-date">{formatDate(item?.updateAt)}</div>
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

export default ZoneTab
