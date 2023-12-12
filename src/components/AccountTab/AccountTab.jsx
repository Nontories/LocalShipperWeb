import React, { useState } from 'react'
import './styles.scss'

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';
import { getObjectByValueInObj, formatDate } from '../../utils/utils';
import { ACCOUNT } from '../../constants/account';

const AccountTab = (props) => {

    const item = props?.item
    const setFocusAccount = props?.setFocusAccount
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const [modalVisible, setModalVisible] = useState({ dropdown: false })

    const handleDropdownVisible = () => {
        setModalVisible({ ...modalVisible, dropdown: !modalVisible.dropdown })
    }

    const handleViewAccount = () => {
        setFocusAccount(item)
        setParentModal({ ...parentModal, viewAccount: true })
    }

    const handleEditAccount = () => {
        setFocusAccount(item)
        setParentModal({ ...parentModal, editAccount: true })
    }

    const handleDeleteAccount = () => {
        setFocusAccount(item)
        setParentModal({ ...parentModal, confirmDelete: true })
    }

    const handleActiveAccount = () => {
        setFocusAccount(item)
        setParentModal({ ...parentModal, confirmActive: true })
    }

    const handleCloseDropdown = () => {
        setModalVisible({ ...modalVisible, dropdown: false })
    }

    const dropdownList = [
        {
            name: "Xem thông tin",
            color: "black",
            action: handleViewAccount
        },
        {
            name: "Chỉnh sửa thông tin",
            color: "black",
            action: handleEditAccount
        },
        {
            name: item?.active ? "Vô hiệu hoá" : "Kích hoạt",
            color: item?.active ? "red" : "#80D828",
            action: item?.active ? handleDeleteAccount : handleActiveAccount
        },
    ]

    return (
        <div className="account_tab">
            <div className="tab_name">{item?.fullname}</div>
            <div className="tab_phone">{item?.phone}</div>
            <div className="tab_mail">{item?.email}</div>
            <div className="tab_role">{getObjectByValueInObj(ACCOUNT ,item?.roleId)?.name}</div>
            <div className="tab_date">{formatDate(item?.createDate)}</div>
            <div className="tab_status">{item?.active ? "Đang hoạt động" : "Ngừng hoạt động"}</div>
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

export default AccountTab
