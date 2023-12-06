import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import Helmet from '../../components/shared/Helmet/helmet'

const ZoneList = () => {

    return (
        <Helmet title={"Zone list | "}>
            <div className="zone_list">
                zone list
            </div>
        </Helmet>
    )
}

export default ZoneList
