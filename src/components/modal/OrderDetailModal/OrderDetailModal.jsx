import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'

import { ORDER } from "../../../constants/order"
import { formatDate, formatPrice, getObjectByValueInObj } from '../../../utils/utils'

import closeIcon from "../../../assets/close.svg"
import orderIcon from "../../../assets/orderDetailModal/orderIcon.svg"
import sizeIcon from "../../../assets/orderDetailModal/size.svg"
import motorIcon from "../../../assets/orderDetailModal/motorcycle.svg"
import { ACTION } from '../../../constants/action'

const OrderDetailModal = ({ visible, order, onCancle, typeList }) => {

    const getTypeById = (id) => {
        for (const key in typeList) {
            if (typeList[key].id === id) {
                return typeList[key];
            }
        }
        return null;
    };

    const openNewWindow = (event, url) => {
        event.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        visible &&
        <div className="order_detail">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="order_detail_header">
                    <div className="tracking_number">Đơn hàng: <span>#{order?.trackingNumber}</span></div>
                    <div className="status">Trạng thái: <span>{getObjectByValueInObj(ORDER, order?.status).name}</span></div>
                    <div className="close_icon" onClick={onCancle}>
                        <img src={closeIcon} />
                    </div>
                </div>
                <div className="author">
                    <div className="author_content author_custommer">
                        <div className="name">Người nhận</div>
                        <div className="name">{order?.customerName}</div>
                        <div className="detail first">{order?.customerCity + ", " + order?.customerDistrict + ", " + order?.customerCommune}</div>
                        <div className="detail">{order?.customerPhone}</div>
                        <div className="detail">{order?.customerEmail}</div>
                    </div>
                    <div className="author_content">
                        <div className="name">Người gửi</div>
                        <div className="name">{order?.store?.storeName}</div>
                        <div className="detail first">{order?.store?.storeAddress}</div>
                        <div className="detail">{order?.store?.storePhone}</div>
                    </div>
                </div>
                <div className="order_infor">
                    <div className="title">Đơn hàng</div>
                    <div className="detail_header">
                        <div className="detail_flex">
                            <img src={orderIcon} alt="" />
                            <div className="detail">Khối lượng: {order?.packageWeight}kg</div>
                        </div>
                        <div className="detail_flex">
                            <img src={orderIcon} alt="" />
                            <div className="detail">Loại hàng: {getTypeById(order?.typeId).packageType1}</div>
                        </div>
                    </div>
                    <div className="detail_header">
                        <div className="detail_flex">
                            <img src={sizeIcon} alt="" />
                            <div className="detail">{order?.packageHeight} x {order?.packageWidth} x {order?.packageLength}</div>
                        </div>
                        <div className="detail_flex">
                            <img src={motorIcon} alt="" />
                            <div className="detail">Loại dịch vụ: {getObjectByValueInObj(ACTION, order?.actionId)?.name}</div>
                        </div>
                    </div>
                    <div className="dashline"></div>
                    <div className="price_flex">
                        <div className="name">Phí vận chuyển</div>
                        <div className="amount">{formatPrice(order?.totalPrice - order?.cod)}đ</div>
                    </div>
                    <div className="price_flex">
                        <div className="name">Phí phát sinh</div>
                        <div className="amount">{formatPrice(0)}đ</div>
                    </div>
                    <div className="price_flex">
                        <div className="name">Phí thu hộ</div>
                        <div className="amount">{formatPrice(order?.cod)}đ</div>
                    </div>
                    <div className="price_flex total_price">
                        <div className="name">Tổng tiền</div>
                        <div className="amount">{formatPrice(order?.totalPrice)}đ</div>
                    </div>
                </div>
                <div className="order_route">
                    <div className="title">Lộ trình</div>
                    <div className="route_flex">
                        <div className="route_time">Thời gian tạo đơn: {formatDate(order?.createTime)}</div>
                        <div className="route_time">Thời gian nhận đơn: {formatDate(order?.acceptTime)}</div>
                        <div className="route_time">Thời gian lấy hàng: {formatDate(order?.pickupTime)}</div>
                        <div className="route_time">Thời gian hoàn thành: {formatDate(order?.completeTime)}</div>
                        <div className="route_time">Shipper: {order?.shipper ? order?.shipper?.fullName : "Chưa được chỉ định"}</div>
                    </div>
                </div>
                <div className="order_type">
                    <div className="type_flex">
                        <div className="type_name">Hình thức thanh toán</div>
                        <div className="value">{order?.cod !== 0 ? "Thu hộ" : "Người nhận thanh toán"}</div>
                    </div>
                    <div className="type_flex">
                        <div className="type_name">Ghi chú</div>
                        <div className="value">{order?.other}</div>
                    </div>
                    <div className={`type_flex ${(order?.status === ORDER.RETURN.value || order?.status === ORDER.CANCELLED.value || order?.status === ORDER.COMPLETED.value) ? "" : "end"}`}>
                        <div className="type_name">Giao trước</div>
                        <div className="value">{formatDate(order?.orderTime)}</div>
                    </div>
                    {
                        (order?.status === ORDER.RETURN.value || order?.status === ORDER.CANCELLED.value) &&
                        <div className="type_flex end">
                            <div className="type_name">Lý do thất bại</div>
                            <div className="value">{order?.cancelReason}</div>
                        </div>
                    }
                    {
                        (order?.status === ORDER.COMPLETED.value) &&
                        <div className="type_flex end">
                            <div className="type_name">Ảnh bằng chứng</div>
                            <a
                                className="value link"
                                href={order?.evidence}
                                target="_blank" rel="noopener noreferrer"
                                onClick={(e) => openNewWindow(e, order?.evidence)}
                            >
                                Ảnh bằng chứng
                            </a>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default OrderDetailModal
