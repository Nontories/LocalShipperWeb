import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import Helmet from '../../components/shared/Helmet/helmet'

const StoreList = () => {

    return (
        <Helmet title={"Store list | "}>
            <div className="store_list">
                StoreList
            </div>
        </Helmet>
    )
}

export default StoreList
