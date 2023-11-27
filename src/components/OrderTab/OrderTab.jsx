import React from 'react'
import './styles.scss'

import { ORDER } from "../../constants/order"

import { formatDate, formatPrice } from '../../utils/utils';

import threeDotIcon from "../../assets/three_dots.svg"
import makerIcon from "../../assets/maker.svg"
import addIcon from "../../assets/add.svg"

const OrderTab = (props) => {

    const item = props?.item
    const key = props?.tabIndex
    const setDetail = props?.setDetail
    const setChooseShipper = props?.setChooseShipper

    const hanldeAssign = () => {
        setChooseShipper()
    }

    const hanldeUnAssign = () => {
        // setChooseShipper()
        console.log("unassign");
    }

    return (
        <div className="order_tab" key={key}>
            <div className="tab_header">
                {
                    item?.status === ORDER.WAITING.value &&
                    <div className="shipper_name">Đang chờ {item?.shipper?.fullName}</div>
                }
                <div className="tab_name" onClick={()=>setDetail(item)}>#{item?.trackingNumber}</div>
                <img src={threeDotIcon} className='three_dot_icon' alt="" />
            </div>
            <div className="tab_body">
                <div className="tab_flex_column">
                    <div className="left">
                        <div className="circle"></div>
                        <div className="tab_name tab_store_name">
                            {item?.store?.storeName}
                        </div>
                        <div className="tab_address tab_store_address">
                            {item?.store?.storeAddress}
                        </div>
                    </div>
                    <div className="right">
                        <div className="right_text">{formatDate(item?.createTime)}</div>
                    </div>
                </div>
                <div className="tab_flex_column">
                    <div className="left">
                        <div className="maker"><img src={makerIcon} alt="" /></div>
                        <div className="tab_name tab_customer_name">
                            {item?.customerName}
                        </div>
                        <div className="tab_address tab_customer_address">
                            {item?.customerCommune + ", " + item?.customerDistrict}
                        </div>
                    </div>
                    <div className="right">
                        <div className="right_text">{formatDate(item?.createTime)}</div>
                        <div className="center_dot"></div>
                        <span className="total_price"> {formatPrice(item?.totalPrice)}</span>
                    </div>
                </div>
                {
                    item?.status === ORDER.WAITING.value || item?.status === ORDER.IDLE.value || item?.status === ORDER.ASSIGNING.value ?
                        <div className="assign">
                            {
                                item?.status !== ORDER.WAITING.value ?
                                    <div className="assign_button" onClick={() => { hanldeAssign() }}>
                                        <img src={addIcon} alt="" />
                                        Assign
                                    </div>
                                    :
                                    <div className="assign_button assigned" onClick={() => { hanldeUnAssign() }}>
                                        Unassign
                                    </div>
                            }
                        </div>
                        :
                        ""
                }
            </div>
        </div>
    )
}

export default OrderTab
