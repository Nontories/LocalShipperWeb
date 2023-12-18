import React, { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { GetShipper } from '../../../api/shipper'
import { InteractOrder } from '../../../api/order';
import { UserContext } from '../../../context/StoreContext'

import ConfirmModal from '../ConfirmModal/ConfirmModal';

import { ORDER } from "../../../constants/order"
import { VEHICLETYPE } from '../../../constants/vehicle';
import { SHIPPERSTATUS } from '../../../constants/shipper';
import { getObjectByValueInObj, getObjectByValue } from '../../../utils/utils'

import closeIcon from "../../../assets/close.svg"

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

const ChooseShipperOrder = ({ visible, order, onCancle, orderList, setOrderList, timeAssign }) => {

    const [shipperList, setShipperList] = useState([])
    const [shipper, setShipper] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadShipperList()
    }, [])

    function findOrderIndexById(orderList, targetId) {
        for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].id === targetId) {
                return i;
            }
        }
        return -1;
    }

    const loadShipperList = async () => {

        const data = {
            storeId: store?.id,
        }

        const response = await GetShipper(data, token)
        if (response?.status === 200) {
            let sortedArray = response?.data?.filter(item => item.status !== SHIPPERSTATUS.DEACTIVE.value)
            sortedArray = sortedArray.sort((a, b) => (a.status === SHIPPERSTATUS.ONLINE.value ? -1 : b.status === SHIPPERSTATUS.ONLINE.value ? 1 : 0));
            setShipperList(sortedArray)
        } else {
            toast.warning('Cập nhật tài xế thất bại');
        }
    }

    const handleChooseShipper = (shipper) => {
        setShipper(shipper)
        if (shipper.status !== SHIPPERSTATUS.ONLINE.value) {
            toast.warning('Tài xế không sẵn sàng');
        } else {
            setConfirmModal(true)
        }
    }

    const handleConfirm = async () => {
        const data = {
            id: order?.id,
            shipperId: shipper?.id,
            status: ORDER.WAITING.value
        }
        console.log(data);
        const response = await InteractOrder(data, token)
        if (response?.status === 200) {
            const index = findOrderIndexById(orderList, order?.id)
            const updateList = [...orderList]
            updateList[index] = { ...updateList[index], status: ORDER.WAITING.value, shipper: { fullName: shipper?.fullName, id: shipper?.id } }
            setOrderList(updateList)
            setConfirmModal(false)
            onCancle()
        }
    }

    const handleCancle = async () => {
        setConfirmModal(false)
    }

    return (
        visible &&
        <div className="choose_shipper">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="choose_shipper_header">
                    <div className="tracking_number">Chọn tài xế giao đơn hàng</div>
                    <div className="close" onClick={onCancle} >
                        <img src={closeIcon} alt="" />
                    </div>
                </div>
                <div className="table">
                    <div className="column column_head">
                        <div className="index column_head">#</div>
                        <div className="name column_head">Tài xế</div>
                        <div className="type column_head">Loại xe</div>
                        <div className="status column_head">Trạng thái</div>
                    </div>
                    {
                        shipperList?.map((item, index) => {
                            return (
                                <div className="column" key={index} onClick={() => handleChooseShipper(item)}>
                                    <div className="index">{index + 1}</div>
                                    <div className="name">{item.fullName}</div>
                                    <div className="type">{item?.transport?.typeId ? getObjectByValueInObj(VEHICLETYPE, item?.transport?.typeId)?.name : "Xe máy"}</div>
                                    <div className="status">{getObjectByValue(shipperType, item?.status)?.name}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} title={"Xác nhận"} content={`xác nhận chọn ${shipper?.fullName} giao đơn #${order?.trackingNumber}`} onConfirm={handleConfirm} onCancle={handleCancle} />
        </div>
    )
}

export default ChooseShipperOrder
