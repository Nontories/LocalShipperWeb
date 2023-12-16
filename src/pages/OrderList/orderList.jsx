import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetOrder, DeleteOrder, InteractOrder, GetTypeList } from '../../api/order';
import { ORDER } from "../../constants/order"

import OrderTab from '../../components/OrderTab/OrderTab';
import Helmet from '../../components/shared/Helmet/helmet'
import OrderDetailModal from '../../components/modal/OrderDetailModal/OrderDetailModal';
import ChooseShipperOrder from '../../components/modal/ChooseShipperOrder/ChooseShipperOrder';
import ConfirmModal from '../../components/modal/ConfirmModal/ConfirmModal';
import { UpdateStoreTimeDelivery } from '../../api/store';
import Pagination from '../../components/Pagination/Pagination';
import UpdateOrderModal from '../../components/modal/UpdateOrder/UpdateOrderModal';

const orderType = [
  {
    value: ORDER.ALL.value,
    name: "Đơn đã lưu",
    sign: ORDER.ALL.sign,
  },
  {
    value: ORDER.IDLE.value,
    name: "Đơn chưa giao",
    sign: ORDER.IDLE.sign,
  },
  {
    value: ORDER.ACCEPTED.value,
    name: "Đơn đã nhận",
    sign: ORDER.ACCEPTED.sign,
  },
  {
    value: ORDER.CANCELLED.value,
    name: "Đơn đã hủy",
    sign: ORDER.CANCELLED.sign,
  },
  {
    value: ORDER.COMPLETED.value,
    name: "Đơn đã hoàn thành",
    sign: ORDER.COMPLETED.sign,
  },
]

const OrderList = () => {

  const [filterValue, setFilterValue] = useState(ORDER.ALL.value)
  const [orderList, setOrderList] = useState([])
  const [typeList, setTypeList] = useState([]);
  const [orderDetail, setOrderDetail] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [timeAssign, setTimeAssign] = useState(6)
  const [modalVisible, setModalVisible] = useState({ orderDetail: false, chooseShipper: false, confirmDelete: false, updateOrder: false })
  const { store, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getTypeList()
  }, [])

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getOrderList()
    }
  }, [currentPage])

  const getOrderList = async () => {
    const data = {
      storeId: store?.id
    }
    const response = await GetOrder(data, token)
    if (response?.status === 200) {
      const updateList = [...response?.data].reverse();
      setOrderList(updateList)
      setOrderDetail(updateList[0])
    } else {
      toast.warning('Truy xuất dữ liệu không thành công');
    }
  }

  const getTypeList = async () => {
    const response = await GetTypeList(token)
    if (response?.status === 200) {
      setTypeList(response?.data)
    }
  }

  const handleOpenDetailModal = (order) => {
    setOrderDetail(order)
    setModalVisible({ ...modalVisible, orderDetail: true })
  }

  const setOrderFocus = (order) => {
    setOrderDetail(order)
  }

  const handleModalCancle = () => {
    setModalVisible({ ...modalVisible, orderDetail: false })
  }

  const handleOpenShipperModal = (order) => {
    if (timeAssign) {
      setOrderDetail(order)
      setModalVisible({ ...modalVisible, chooseShipper: true })
    } else {
      toast.warning('Chưa chọn thời gian giao hàng');
    }
  }

  const handleShipperCancle = () => {
    setModalVisible({ ...modalVisible, chooseShipper: false })
  }

  const handleFilter = (value) => {
    let filteredOrders = []

    if (value === ORDER.COMPLETED.value) {
      filteredOrders = orderList.filter(item => item?.status === ORDER.COMPLETED.value);
    } else if (value === ORDER.IDLE.value || value === ORDER.WAITING.value || value === ORDER.ASSIGNING.value) {
      filteredOrders = orderList.filter(item =>
        item?.status === ORDER.IDLE.value ||
        item?.status === ORDER.WAITING.value ||
        item?.status === ORDER.ASSIGNING.value
      )
    } else if (value === ORDER.INPROCESS.value || value === ORDER.ACCEPTED.value) {
      filteredOrders = orderList.filter(item =>
        item?.status === ORDER.INPROCESS.value ||
        item?.status === ORDER.ACCEPTED.value
      )
    } else if (value === ORDER.CANCELLED.value || value === ORDER.RETURN.value) {
      filteredOrders = orderList.filter(item =>
        item?.status === ORDER.CANCELLED.value ||
        item?.status === ORDER.RETURN.value
      )
    } else {
      filteredOrders = orderList;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredOrders.slice(startIndex, endIndex);
  }

  const getFilterLength = (value) => {
    const filteredOrders = value === ORDER.ALL.value
      ? orderList
      : orderList.filter(item => item?.status === value);

    return filteredOrders.length;
  }

  const handleSubmitDeleteConfirm = async () => {
    const response = await DeleteOrder(orderDetail.id, token)
    if (response?.status === 200) {
      toast.success('Xoá đơn hàng thành công');
    } else {
      toast.error('Xoá đơn hàng thất bại');
    }
    setModalVisible({ ...modalVisible, confirmDelete: false })
  }

  const handleCloseDeleteConfirm = () => {
    setModalVisible({ ...modalVisible, confirmDelete: false })
  }

  const handleCloseUpdateOrder = () => {
    setModalVisible({ ...modalVisible, updateOrder: false })
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
                <div
                  className={`type_button ${filterValue == item.value && "button_active"}`}
                  key={key}
                  onClick={() => { setFilterValue(item.value); setCurrentPage(1) }}>{item.name}
                </div>
              )
            })}
            <div className="assign_time">
              <label htmlFor="time_value">Giao hàng trong: </label>
              <input
                name="time_value"
                type="number"
                value={timeAssign}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*$/.test(inputValue) || inputValue === '') {
                    setTimeAssign(inputValue);
                  }
                }}
                onBlur={() => UpdateStoreTimeDelivery(store?.id, timeAssign, token)}
                defaultValue={6}
              />
            </div>
          </div>
          <div className="order_list" style={{ marginBottom: handleFilter(filterValue).length < itemsPerPage ? 50 : 0 }}>
            {
              handleFilter(filterValue)?.map((item, key) => {
                return (
                  <OrderTab
                    item={item}
                    timeAssign={timeAssign}
                    setDetail={handleOpenDetailModal}
                    setChooseShipper={handleOpenShipperModal}
                    setOrder={setOrderFocus}
                    parentModal={modalVisible}
                    setParentModal={setModalVisible}
                    setOrderList={setOrderList}
                    orderList={orderList}
                    key={key}
                  />
                )
              })
            }
          </div>
          <Pagination
            itemsPerPage={itemsPerPage}
            positionLength={handleFilter(filterValue).length}
            filterLength={getFilterLength(filterValue)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <OrderDetailModal
          visible={modalVisible.orderDetail}
          order={orderDetail}
          onCancle={handleModalCancle}
          typeList={typeList}
        />
        <ChooseShipperOrder
          visible={modalVisible.chooseShipper}
          order={orderDetail}
          orderList={orderList}
          timeAssign={timeAssign}
          setOrderList={setOrderList}
          onCancle={handleShipperCancle}
        />
        <ConfirmModal
          visible={modalVisible.confirmDelete}
          setVisible={handleCloseDeleteConfirm}
          title={"Xác nhận"}
          content={`Xác nhận xoá đơn hàng #${orderDetail?.trackingNumber}`}
          onConfirm={handleSubmitDeleteConfirm}
          onCancle={handleCloseDeleteConfirm}
        />
        <UpdateOrderModal
          visible={modalVisible.updateOrder}
          onCancle={handleCloseUpdateOrder}
          focusOrder={orderDetail}
          reLoad={getOrderList}
        />
      </div>
    </Helmet>
  )
}

export default OrderList
