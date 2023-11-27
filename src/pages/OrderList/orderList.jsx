import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetOrder } from '../../api/order';
import { ORDER } from "../../constants/order"

import OrderTab from '../../components/OrderTab/OrderTab';
import Helmet from '../../components/shared/Helmet/helmet'
import OrderDetailModal from '../../components/modal/OrderDetailModal/OrderDetailModal';
import ChooseShipperOrder from '../../components/modal/ChooseShipperOrder/ChooseShipperOrder';

const orderType = [
  {
    value: ORDER.ALL.value,
    name: "Đơn đã lưu",
    sign: ORDER.ALL.sign,
  },
  {
    value: ORDER.WAITING.value,
    name: "Đơn đang đợi",
    sign: ORDER.WAITING.sign,
  },
  {
    value: ORDER.ACCEPTED.value,
    name: "Đơn đang lấy",
    sign: ORDER.ACCEPTED.sign,
  },
  {
    value: ORDER.INPROCESS.value,
    name: "Đơn đang giao",
    sign: ORDER.INPROCESS.sign,
  },
  {
    value: ORDER.COMPLETED.value,
    name: "Đơn đã hoàn thành",
    sign: ORDER.COMPLETED.sign,
  },
  {
    value: ORDER.CANCELLED.value,
    name: "Đơn đã hủy",
    sign: ORDER.CANCELLED.sign,
  },
]

const OrderList = () => {

  const [filterValue, setFilterValue] = useState(ORDER.ALL.value)
  const [orderList, setOrderList] = useState([])
  const [orderDetail, setOrderDetail] = useState({})
  const [modalVisible, setModalVisible] = useState({ orderDetail: false, chooseShipper: false })
  const { store, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getOrderList()
    }
  }, [])

  const getOrderList = async () => {
    const data = {
      storeId: store?.id
    }
    const response = await GetOrder(data, token)
    if (response?.status === 200) {
      setOrderList(response?.data)
      setOrderDetail(response?.data[0])
    } else {
      toast.warning('Truy xuất dữ liệu không thành công');
    }
  }

  const handleOpenDetailModal = (order) => {
    setOrderDetail(order)
    setModalVisible({...modalVisible, orderDetail: true})
  }

  const handleModalCancle = () => {
    setModalVisible({...modalVisible, orderDetail: false})
  }

  const handleOpenShipperModal = (order) => {
    setOrderDetail(order)
    setModalVisible({...modalVisible, chooseShipper: true})
  }

  const handleShipperCancle = () => {
    setModalVisible({...modalVisible, chooseShipper: false})
  }

  const handleFilter = (value) => {
    if (value === ORDER.ALL.value) {
      return (
        orderList
      )
    } else {
      return (
        orderList.filter(item => item?.status === value)
      )
    }
  }

  return (
    <Helmet title={"Order List | "}>
      <div className="order_list">
        <div className="header">Danh sách đơn hàng</div>
        <div className="body">
          <div className="title">Đơn hàng của tôi</div>
          <div className="order_status">
            {orderType.map((item, key) => {
              return (
                <div className={`type_button ${filterValue == item.value && "button_active"}`} key={key} onClick={() => { setFilterValue(item.value) }}>{item.name}</div>
              )
            })}
          </div>
          {
            handleFilter(filterValue)?.map((item, key) => {
              return (
                <OrderTab item={item} key={key} setDetail={handleOpenDetailModal} setChooseShipper={handleOpenShipperModal}/>
              )
            })
          }
        </div>
        <OrderDetailModal visible={modalVisible.orderDetail} order={orderDetail} onCancle={handleModalCancle} />
        <ChooseShipperOrder visible={modalVisible.chooseShipper} order={orderDetail} onCancle={handleShipperCancle} />
      </div>
    </Helmet>
  )
}

export default OrderList
