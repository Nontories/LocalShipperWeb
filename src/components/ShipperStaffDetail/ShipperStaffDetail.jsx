import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

import defaultAvt from "../../assets/defaultAvt.svg"
import closeIcon from "../../assets/close.svg"
import { VEHICLETYPE } from '../../constants/vehicle'
import { getObjectByValueInObj } from '../../utils/utils'

const ShipperStaffDetail = (props) => {

    const focusShipper = props?.focusShipper
    const parentModal = props?.parentModal
    const setParentModal = props?.setParentModal
    const visible = props?.visible
    const onCancle = props?.onCancle

    const handleDelete = () => {
        setParentModal({ ...parentModal, confirmDeactive: true })
    }

    const handleActive = () => {
        setParentModal({ ...parentModal, chooseZone: true })
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
                        <div className="name">{focusShipper?.fullname}</div>
                    </div>
                </div>
                <div className="right">
                    <div className="column haft_column">
                        <div className="title">Phone</div>
                        <div className="value">{focusShipper?.phone}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Phương tiện</div>
                        <div className="value">{getObjectByValueInObj(VEHICLETYPE, focusShipper?.transport?.typeId)?.name}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Email</div>
                        <div className="value">{focusShipper?.emailShipper}</div>
                    </div>
                    <div className="column haft_column">
                        <div className="title">Biển số</div>
                        <div className="value">{focusShipper?.transport?.licencePlate}</div>
                    </div>
                    <div className="column">
                        <div className="title">Địa chỉ</div>
                        <div className="value">{focusShipper?.addressShipper}</div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="button_pack">
                        <div className="cancle" onClick={onCancle}>Hủy</div>
                        {
                            focusShipper.active ?
                                <div className="delete" onClick={handleDelete}>Xóa</div>
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

export default ShipperStaffDetail
