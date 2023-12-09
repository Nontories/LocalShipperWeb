import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetOrder, DeleteOrder, InteractOrder } from '../../api/order';
import { ORDER } from "../../constants/order"

import OrderTab from '../../components/OrderTab/OrderTab';
import Helmet from '../../components/shared/Helmet/helmet'
import OrderDetailModal from '../../components/modal/OrderDetailModal/OrderDetailModal';
import ChooseShipperOrder from '../../components/modal/ChooseShipperOrder/ChooseShipperOrder';
import ConfirmModal from '../../components/modal/ConfirmModal/ConfirmModal';
import { UpdateStoreTimeDelivery } from '../../api/store';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [timeAssign, setTimeAssign] = useState(undefined)
  const [modalVisible, setModalVisible] = useState({ orderDetail: false, chooseShipper: false, confirmDelete: false })
  const { store, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getOrderList()
    }
  }, [currentPage])

  useEffect(() => {
    UpdateStoreTimeDelivery(store?.id, timeAssign, token)
  }, [timeAssign])

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
    const filteredOrders = value === ORDER.ALL.value
      ? orderList
      : orderList.filter(item => item?.status === value);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(getFilterLength(filterValue) / itemsPerPage);

    return Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={currentPage === page ? 'pagination_button active' : 'pagination_button'}
      >
        {page}
      </button>
    ));
  };

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

  function getCurrentDateTime() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setDate(now.getDate() + 1);
    const formattedDate = now.toISOString().slice(0, 16);
    return formattedDate;
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
                <div className={`type_button ${filterValue == item.value && "button_active"}`} key={key} onClick={() => { setFilterValue(item.value); handlePageChange(1) }}>{item.name}</div>
              )
            })}
            <div className="assign_time">
              <input
                type="number"
                value={timeAssign}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^[1-9]\d*$/.test(inputValue) || inputValue === '') {
                    setTimeAssign(inputValue);
                  }
                }}
                defaultValue={6}
              ></input>
            </div>
          </div>
          <div className="order_list">
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
          <div className="pagination-buttons">
            {renderPaginationButtons()}
          </div>
        </div>
        <OrderDetailModal visible={modalVisible.orderDetail} order={orderDetail} onCancle={handleModalCancle} />
        <ChooseShipperOrder visible={modalVisible.chooseShipper} order={orderDetail} orderList={orderList} timeAssign={timeAssign} setOrderList={setOrderList} onCancle={handleShipperCancle} />
        <ConfirmModal visible={modalVisible.confirmDelete} setVisible={handleCloseDeleteConfirm} title={"Xác nhận"} content={`Xác nhận xoá đơn hàng #${orderDetail?.trackingNumber}`} onConfirm={handleSubmitDeleteConfirm} onCancle={handleCloseDeleteConfirm} />
      </div>
    </Helmet>
  )
}

export default OrderList
