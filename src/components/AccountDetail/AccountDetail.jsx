import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import defaultAvt from "../../assets/defaultAvt.svg"
import closeIcon from "../../assets/close.svg"
import { VEHICLETYPE } from '../../constants/vehicle'
import { formatDate, getObjectByValueInObj } from '../../utils/utils'

const AccountDetail = (props) => {

    const focusAccount = props?.focusAccount
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const visible = props?.visible
    const onCancle = props?.onCancle

    const handleDelete = () => {
        setParentModal({ ...parentModal, confirmDelete: true })
    }

    const handleActive = () => {
        setParentModal({ ...parentModal, confirmActive: true })
    }

    return (
        visible &&
        <div className="shipper_detail">
            <div className="content">
                <div className="close_icon" onClick={onCancle}>
                    <img src={closeIcon} alt="" />
                </div>
                <div className="left">
                    <div className="avt">
                        <img src={defaultAvt} alt="" />
                        <div className="name">{focusAccount?.fullname}</div>
                    </div>
                </div>
                <div className="right">
                    <div className="column haft_column">
                        <div className="title">Phone</div>
                        <div className="value">{focusAccount?.phone}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Ngày tạo</div>
                        <div className="value">{formatDate(focusAccount?.createDate)}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Email</div>
                        <div className="value">{focusAccount?.email}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Mật khẩu</div>
                        <div className="value">{focusAccount?.password}</div>
                    </div>
                    <div className="column">
                        <div className="title">Vai trò</div>
                        <div className="value">{focusAccount?.role?.name}</div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="button_pack">
                        <div className="cancle" onClick={onCancle}>Hủy</div>
                        {
                            focusAccount.active ?
                                <div className="delete" onClick={handleDelete}>Vô hiệu hoá</div>
                                :
                                <div className="active" onClick={handleActive}>Kích hoạt</div>
                        }
                    </div>
                </div>
            </div>
            <div className="layout" onClick={onCancle} />
        </div>
    )
}

export default AccountDetail
