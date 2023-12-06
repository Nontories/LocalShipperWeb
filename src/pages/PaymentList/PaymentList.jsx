import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import Helmet from '../../components/shared/Helmet/helmet'

const PaymentList = () => {

    return (
        <Helmet title={"Zone list | "}>
            <div className="zone_list">
                PaymentList
            </div>
        </Helmet>
    )
}

export default PaymentList
