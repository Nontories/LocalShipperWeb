import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'
import { formatDate } from '../../utils/utils'

const PaymentTab = (props) => {

    const item = props?.item
    const index = props?.index

    return (
        <div className="payment_tab">
            <div className="tab_id">{index}</div>
            <div className="tab_transfer">{item?.sender}</div>
            <div className="tab_receive">{item?.receiver}</div>
            <div className="tab_level">{item?.amount}</div>
            <div className="tab_time">{formatDate(item?.transactionTime)}</div>
            <div className="tab_content">{item?.description}</div>
            <div className="tab_collection"></div>
        </div>
    )
}

export default PaymentTab
