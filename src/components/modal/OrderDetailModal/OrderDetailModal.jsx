import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'

import { ORDER } from "../../../constants/order"
import { getObjectByValueInObj } from '../../../utils/utils'

const OrderDetailModal = ({ visible, order, onCancle }) => {

    return (
        visible &&
        <div className="order_detail">
            <div className="layout" onClick={onCancle} />
            <div className="content">   
                <div className="order_detail_header">
                    <div className="tracking_number">Đơn hàng : #{order?.trackingNumber}</div>
                    <div className="status">Status: {getObjectByValueInObj(ORDER, order?.status).name}</div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailModal
