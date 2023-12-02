import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { SHIPPERSTATUS } from "../../constants/shipper"
import { VEHICLETYPE } from '../../constants/vehicle';
import { GetShipper, CreateShipper, DeleteShipper } from "../../api/shipper"
import { getObjectByValue, getObjectByValueInObj } from '../../utils/utils';

import Helmet from '../../components/shared/Helmet/helmet'
import ShipperTab from '../../components/ShipperTab/ShipperTab';
import ConfirmModal from "../../components/modal/ConfirmModal/ConfirmModal"
import AddShipper from '../../components/modal/AddShipper/AddShipper';
import ChangePassword from '../../components/modal/ChangePassword/ChangePassword';

import searchIcon from "../../assets/search.svg"
import addIcon from "../../assets/add.svg"

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
  const [modalVisible, setModalVisible] = useState({ confirmDelete: false, addShipper: false, changePassword: false })
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

    console.log(response?.data);
  }

  const addShipperModal = () => {
    setModalVisible({ ...modalVisible, addShipper: true })
  }

  const handleSubmitDeleteConfirm = async () => {
    const response = await DeleteShipper(focusShipper?.id, token)
    if (response?.status === 200) {
      toast.success('Xoá shipper thành công');
    } else {
      toast.error('Xoá shipper thất bại');
    }
    setModalVisible({ ...modalVisible, confirmDelete: false })
  }

  const handleCloseDeleteConfirm = () => {
    console.log("cancle delete");
    setModalVisible({ ...modalVisible, confirmDelete: false })
  }

  const handleFilter = (value) => {
    // if (value === ORDER.ALL.value) {
    //   return (
    //     orderList
    //   )
    // } else {
      return (
        shipperList.filter(item => item?.status === value)
      )
    // }
  }

  const handleSearch = (e) => {
    const selectedValue = e.target.value;
    setSearchValue(selectedValue);
  }

  return (
    <Helmet title={"Shipper | "}>
      <div className="shipper">
        <div className="header">Danh sách Shipper của cửa hàng</div>
        <div className="body">
          <div className="title">Shipper của cửa hàng</div>
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
              <input className="search_field" type="text" value={searchValue} onChange={handleSearch} />
              <div className="add_button" onClick={addShipperModal}>
                <img src={addIcon} alt="" />
                Shipper
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
              handleFilter(filterValue)?.map((item, key) => {
                return (
                  <ShipperTab item={item} setFocusShipper={setFocusShipper} parentModal={modalVisible} setParentModal={setModalVisible} key={key} />
                )
              })
            }
          </div>
        </div>
        <ChangePassword visible={modalVisible.changePassword} shipper={focusShipper} onCancle={() => setModalVisible({ ...modalVisible, changePassword: false })} />
        <AddShipper visible={modalVisible.addShipper} onCancle={() => setModalVisible({ ...modalVisible, addShipper: false })} />
        <ConfirmModal visible={modalVisible.confirmDelete} setVisible={handleCloseDeleteConfirm} title={"Xác nhận"} content={`Xác nhận xoá shipper ${focusShipper?.fullName}`} onConfirm={handleSubmitDeleteConfirm} onCancle={handleCloseDeleteConfirm} />
      </div>
    </Helmet>
  )
}

export default Shipper
