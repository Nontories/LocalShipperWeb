import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.scss'

import { GetOrderWithoutToken } from '../../api/order';
import { ORDER } from '../../constants/order';
import { formatDate } from '../../utils/utils';
import Helmet from '../../components/shared/Helmet/helmet'

import logo from "../../assets/Logo.svg"
import createIcon from "../../assets/trackingOrder/created.svg"
import createDefaultIcon from "../../assets/trackingOrder/createdDefault.svg"
import foundIcon from "../../assets/trackingOrder/found.svg"
import foundDefaultIcon from "../../assets/trackingOrder/foundDefault.svg"
import gotIcon from "../../assets/trackingOrder/got.svg"
import gotDefaultIcon from "../../assets/trackingOrder/gotDefault.svg"
import inProcessIcon from "../../assets/trackingOrder/inProcess.svg"
import inProcessDefaultIcon from "../../assets/trackingOrder/inProcessDefault.svg"
import successIcon from "../../assets/trackingOrder/success.svg"
import successDefaultIcon from "../../assets/trackingOrder/successDefault.svg"

const trackingImage = [
    {
        img: createIcon,
        imgDefault: createDefaultIcon,
        value: ORDER.IDLE.value
    },
    {
        img: foundIcon,
        imgDefault: foundDefaultIcon,
        value: ORDER.ACCEPTED.value
    },
    {
        img: gotIcon,
        imgDefault: gotDefaultIcon,
        value: ORDER.INPROCESS.value
    },
    {
        img: inProcessIcon,
        imgDefault: inProcessDefaultIcon,
        value: ORDER.INPROCESS.value
    },
    {
        img: successIcon,
        imgDefault: successDefaultIcon,
        value: ORDER.COMPLETED.value
    },
]

const TrackingOrder = () => {

    const [order, setOrder] = useState({})
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');

    useEffect(() => {
        LoadData(orderId)
    }, [orderId]);

    const LoadData = async (orderId) => {
        const response = await GetOrderWithoutToken(orderId)
        if (response?.status === 200) {
            setOrder(response?.data)
        } else {
            toast.warning('Truy xuất dữ liệu không thành công');
        }
    }

    const getTrackingText = (value) => {
        switch (value) {
            case ORDER.IDLE.value:
                return "Đơn Hàng đã được tạo"
            case ORDER.ACCEPTED.value:
                return "Đã tìm được Shipper"
            case ORDER.INPROCESS.value:
                return "Đơn hàng đang được giao"
            case ORDER.COMPLETED.value:
                return "Giao thành công"
            case ORDER.CANCELLED.value:
                return "Đơn hàng đã huỷ"
            default:
                break;
        }
    }

    const getTrackingTime = (value) => {
        switch (value) {
            case ORDER.IDLE.value:
                return order.createTime
            case ORDER.ACCEPTED.value:
                return order.acceptTime
            case ORDER.INPROCESS.value:
                return order.pickupTime
            case ORDER.COMPLETED.value:
                return order.completeTime
            case ORDER.CANCELLED.value:
                return order.createTime
            default:
                break;
        }
    }

    return (
        <Helmet title={"Tracking | "}>
            <div className="tracking_order">
                <div className="header">
                    <img src={logo} alt="" />
                    <div className="header_name">Local Shipper</div>
                </div>
                <div className="tracking_number">
                    MÃ ĐƠN HÀNG: {order?.trackingNumber} | <span className="tracking_text">{getTrackingText(order?.status)}</span>
                </div>
                <div className="tracking_image">
                    {
                        trackingImage.map((item, index) => {
                            return (
                                <div className="phase" key={index}>
                                    {
                                        index != 0 && <div className="dashline" style={{ backgroundColor: index + 1 >= order?.status ? "rgba(0, 0, 0, 0.5)" : "#72AFD3" }}></div>
                                    }
                                    <div className="circle">
                                        <img
                                            src={index + 1 >= order?.status ? item.imgDefault : item.img}
                                            alt=""
                                            style={{ borderColor: index + 1 >= order?.status ? "rgba(0, 0, 0, 0.5)" : "#72AFD3" }}
                                        />
                                        <div className="detail">
                                            <div className="detail_name">{getTrackingText(item.value)}</div>
                                            <div className="detail_time">{getTrackingTime(item.value) ? formatDate(getTrackingTime(item.value)) : ""}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Helmet>
    )
}

export default TrackingOrder
