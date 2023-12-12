import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import defaultAvt from "../../assets/defaultAvt.svg"
import closeIcon from "../../assets/close.svg"

const StoreDetail = (props) => {

    const focusStore = props?.focusStore
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const visible = props?.visible
    const onCancle = props?.onCancle

    const handleDelete = () => {
        setParentModal({ ...parentModal, confirmDeactive: true })
    }

    function getTimeWithoutSeconds(timeString) {
        if (!timeString) {
            return ""
        } else {
            return timeString?.substring(0, 5);
        }
    }

    return (
        visible &&
        <div className="store_detail">
            <div className="content">
                <div className="close_icon" onClick={onCancle}>
                    <img src={closeIcon} alt="" />
                </div>
                <div className="left">
                    <div className="avt">
                        <img src={defaultAvt} alt="" />
                        <div className="name">{focusStore?.storeName}</div>
                    </div>
                </div>
                <div className="right">
                    <div className="column haft_column">
                        <div className="title">Phone</div>
                        <div className="value">{focusStore?.storePhone}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Thời gian đóng/mở cửa</div>
                        <div className="value">{getTimeWithoutSeconds(focusStore?.openTime) + " - " + getTimeWithoutSeconds(focusStore?.closeTime)}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Email</div>
                        <div className="value">{focusStore?.storeEmail}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Mô tả</div>
                        <div className="value">{focusStore?.storeDescription ? focusStore?.storeDescription : "Không có"}</div>
                    </div>
                    <div className="column">
                        <div className="title">Địa chỉ</div>
                        <div className="value">{focusStore?.storeAddress}</div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="button_pack">
                        <div className="cancle" onClick={onCancle}>Hủy</div>
                        <div className="delete" onClick={handleDelete}>Xóa</div>
                    </div>
                </div>
            </div>
            <div className="layout" onClick={onCancle} />
        </div>
    )
}

export default StoreDetail
