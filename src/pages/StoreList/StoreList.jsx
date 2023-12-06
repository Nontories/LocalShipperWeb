import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import Helmet from '../../components/shared/Helmet/helmet'

const StoreList = () => {

    return (
        <Helmet title={"Zone list | "}>
            <div className="zone_list">
                StoreList
            </div>
        </Helmet>
    )
}

export default StoreList
