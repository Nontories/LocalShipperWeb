import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import CustomOptionDropdown from '../CustomOptionDropdown/CustomOptionDropdown';
import { formatDate, formatPrice } from '../../utils/utils';


const TransactionTab = (props) => {

    const item = props?.item
    const index = props?.index
    const setFocusTransaction = props?.setFocusTransaction
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const [modalVisible, setModalVisible] = useState({ dropdown: false })

    const handleDropdownVisible = () => {
        setModalVisible({ ...modalVisible, dropdown: !modalVisible.dropdown })
    }

    const handleViewTransaction = () => {
        setFocusTransaction(item)
        setParentModal({ ...parentModal, viewStore: true })
        console.log(`view handleViewStore shipperid=${item.id}`);
    }

    const hanldeDeleteTransaction = () => {
        setFocusTransaction(item)
        setParentModal({ ...parentModal, confirmDelete: true })
    }

    const handleCloseDropdown = () => {
        setModalVisible({ ...modalVisible, dropdown: false })
    }

    const dropdownList = [
        {
            name: "Xem thông tin",
            color: "black",
            action: handleViewTransaction
        },
        {
            name: "Xoá",
            color: "red",
            action: hanldeDeleteTransaction,
        },
    ]

    return (
        <div className="transaction_tab">
            <div className="tab_index">{index + 1}</div>
            <div className="tab_type">{item?.transactionType}</div>
            <div className="tab_sender">{item?.sender}</div>
            <div className="tab_receiver">{item?.receiver}</div>
            <div className="tab_amount">{item?.amount}</div>
            <div className="tab_time">{formatDate(item?.transactionTime)}</div>
            <div className="tab_content">{item?.description}</div>
            {/* <div className="tab_collection"></div> */}
            <div className="tab_button" style={{ display: "none" }} onClick={handleDropdownVisible}>
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

export default TransactionTab
