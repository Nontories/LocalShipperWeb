import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { SHIPPERSTATUS } from "../../constants/shipper"
import { VEHICLETYPE } from '../../constants/vehicle';
import { GetShipper, CreateShipper, DeleteShipper, UpdateStatusShipper } from "../../api/shipper"
import { getObjectByValue, getObjectByValueInObj } from '../../utils/utils';

import Helmet from '../../components/shared/Helmet/helmet'
import ShipperTab from '../../components/ShipperTab/ShipperTab';
import ConfirmModal from "../../components/modal/ConfirmModal/ConfirmModal"
import AddShipper from '../../components/modal/AddShipper/AddShipper';
import ChangePassword from '../../components/modal/ChangePassword/ChangePassword';
import Pagination from '../../components/Pagination/Pagination';

import searchIcon from "../../assets/search.svg"
import addIcon from "../../assets/add.svg"
import ShipperDetail from '../../components/ShipperDetail/ShipperDetail';

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

const Shipper = () => {

  const [filterValue, setFilterValue] = useState(SHIPPERSTATUS.ONLINE.value)
  const [searchValue, setSearchValue] = useState("")
  const [shipperList, setShipperList] = useState([])
  const [focusShipper, setFocusShipper] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [modalVisible, setModalVisible] = useState({ confirmDeactive: false, addShipper: false, changePassword: false, viewShipper: false })
  const { store, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      loadData()
    }
  }, [])

  const loadData = async () => {

    const data = {
      storeId: store?.id
    }

    const response = await GetShipper(data, token)
    if (response?.status === 200) {
      setShipperList(response?.data)
    }
  }

  const addShipperModal = () => {
    setModalVisible({ ...modalVisible, addShipper: true })
  }

  const handleSubmitDeleteConfirm = async () => {
    const response = await UpdateStatusShipper(focusShipper?.id, SHIPPERSTATUS.DEACTIVE.value, token)
    if (response?.status === 200) {
      toast.success('Xoá tài xế thành công');
    } else {
      toast.error('Xoá tài xế thất bại');
    }
    setModalVisible({ ...modalVisible, confirmDeactive: false, viewShipper: false })
  }

  const handleCloseDeleteConfirm = () => {
    setModalVisible({ ...modalVisible, confirmDeactive: false })
  }

  const handleFilter = (value) => {
    const filteredOrders = shipperList.filter(item => item?.status === value)

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredOrders.slice(startIndex, endIndex);
  }

  const getFilterLength = (value) => {
    return shipperList.filter(item => item?.status === value)
  }

  const handleSearch = (list, value) => {
    if (value === "") {
      return list
    } else {
      const newFilteredData = list?.filter(item =>
        item?.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        item?.phoneShipper?.toLowerCase().includes(value.toLowerCase()) ||
        item?.emailShipper?.toLowerCase().includes(value.toLowerCase()) ||
        item?.addressShipper?.toLowerCase().includes(value.toLowerCase())
      );
      return newFilteredData
    }
  }

  return (
    <Helmet title={"Shipper | "}>
      <div className="shipper">
        <div className="header">Danh sách tài xế của cửa hàng</div>
        <div className="body">
          {/* <div className="title">tài xế của cửa hàng</div> */}
          <div className="body_header">
            <div className="shipper_status">
              {shipperType.map((item, key) => {
                return (
                  <div className={`type_button ${filterValue == item.value && "button_active"}`} key={key} onClick={() => { setFilterValue(item.value) }}>{item.name}</div>
                )
              })}
            </div>
            <div className="search">
              <img src={searchIcon} alt="" />
              <input className="search_field" type="text" value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} />
              <div className="add_button" onClick={addShipperModal}>
                <img src={addIcon} alt="" />
                Tài xế
              </div>
            </div>
          </div>
          <div className="shipper_list">
            <div className="shipper_tab">
              <div className="tab_name">Họ và tên</div>
              <div className="tab_phone">Số điện thoại</div>
              <div className="tab_mail">Email</div>
              <div className="tab_address">Địa chỉ</div>
              <div className="tab_vehicle">Phương tiện</div>
              <div className="tab_status">Trạng thái</div>
              <div className="tab_button"></div>
            </div>
            {
              handleSearch(handleFilter(filterValue), searchValue)?.map((item, key) => {
                return (
                  <ShipperTab
                    item={item}
                    setFocusShipper={setFocusShipper}
                    parentModal={modalVisible}
                    setParentModal={setModalVisible}
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
        <ShipperDetail
          focusShipper={focusShipper}
          parentModal={modalVisible}
          setParentModal={setModalVisible}
          visible={modalVisible.viewShipper}
          onCancle={() => setModalVisible({ ...modalVisible, viewShipper: false })}
        />
        <ChangePassword
          visible={modalVisible.changePassword}
          shipper={focusShipper}
          onCancle={() => setModalVisible({ ...modalVisible, changePassword: false })}
          parentModal={modalVisible}
          setParentModal={setModalVisible}
        />
        <AddShipper
          visible={modalVisible.addShipper}
          onCancle={() => setModalVisible({ ...modalVisible, addShipper: false })}
          reload={loadData}
        />
        <ConfirmModal
          visible={modalVisible.confirmDeactive}
          setVisible={handleCloseDeleteConfirm}
          title={"Xác nhận"}
          content={`Xác nhận xoá tài xế ${focusShipper?.fullName}`}
          onConfirm={handleSubmitDeleteConfirm}
          onCancle={handleCloseDeleteConfirm}
        />
      </div>
    </Helmet>
  )
}

export default Shipper
