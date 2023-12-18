import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'
import { formatDate, formatPrice } from '../../utils/utils'

const PaymentTab = (props) => {

    const item = props?.item
    const index = props?.index

    return (
        <div className="payment_tab">
            <div className="tab_id">{index + 1}</div>
            <div className="tab_transfer">{item?.sender}</div>
            <div className="tab_receive">{item?.receiver}</div>
            <div className="tab_level">{formatPrice(item?.amount)} đ</div>
            <div className="tab_time">{formatDate(item?.transactionTime)}</div>
            <div className="tab_content">{item?.description}</div>
        </div>
    )
}

export default PaymentTab
