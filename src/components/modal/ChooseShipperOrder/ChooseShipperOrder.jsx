import React, { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { GetShipper } from '../../../api/shipper'
import { UserContext } from '../../../context/StoreContext'

import { ORDER } from "../../../constants/order"
import { VEHICLETYPE } from '../../../constants/vehicle';
import { SHIPPERSTATUS } from '../../../constants/shipper';
import { getObjectByValueInObj, getObjectByValue } from '../../../utils/utils'

const shipperType = [
    {
        value: SHIPPERSTATUS.ONLINE.value,
        name: "Online",
    },
    {
        value: SHIPPERSTATUS.OFFLINE.value,
        name: "Offline",
    },
    {
        value: SHIPPERSTATUS.DELIVERING.value,
        name: "Đang giao",
    }
]

const ChooseShipperOrder = ({ visible, order, onCancle }) => {

    const [shipperList, setShipperList] = useState([])
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadShipperList()
    }, [])

    const loadShipperList = async () => {

        const data = {
            storeId: store?.id
        }

        const response = await GetShipper(data, token)
        if (response?.status === 200) {
            setShipperList(response?.data)
        } else {
            toast.warning('Cập nhật shipper thất bại');
        }
    }

    const handleChooseShipper = async () => {

    }

    return (
        visible &&
        <div className="choose_shipper">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="choose_shipper_header">
                    <div className="tracking_number">Chọn Shipper giao đơn hàng</div>
                    <div className="close" onClick={onCancle} ></div>
                </div>
                <div className="table">
                    <div className="column">
                        <div className="index">#</div>
                        <div className="name">Shipper</div>
                        <div className="type">Loại xe</div>
                        <div className="status">Trạng thái</div>
                    </div>
                    {
                        shipperList?.map((item, index) => {
                            <div className="column" key={index}>
                                <div className="index">{index + 1}</div>
                                <div className="name">{item.fullName}</div>
                                <div className="type">{getObjectByValueInObj(VEHICLETYPE, item?.transport?.typeId)?.name}</div>
                                <div className="status">{getObjectByValue(shipperType, item?.status)?.name}</div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ChooseShipperOrder
