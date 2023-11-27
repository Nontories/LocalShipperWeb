import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { SHIPPERSTATUS } from "../../constants/shipper"
import { VEHICLETYPE } from '../../constants/vehicle';
import { GetShipper } from "../../api/shipper"
import { getObjectByValue, getObjectByValueInObj } from '../../utils/utils';

import Helmet from '../../components/shared/Helmet/helmet'

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
    console.log("addShipper");
  }

  const hanldeAddShipper = () => {
    console.log("addShipper");
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
              shipperList?.map((item, key) => {
                return (
                  <div className="shipper_tab" key={key}>
                    <div className="tab_name">{item?.fullName}</div>
                    <div className="tab_phone">{item?.phoneShipper}</div>
                    <div className="tab_mail">{item?.emailShipper}</div>
                    <div className="tab_address">{item?.addressShipper}</div>
                    <div className="tab_vehicle">{getObjectByValueInObj(VEHICLETYPE ,item?.transport?.typeId)?.name}</div>
                    <div className="tab_status">{getObjectByValue(shipperType ,item?.status)?.name}</div>
                    <div className="tab_button">
                      <div className="button">
                        <div className="button_circle"></div>
                        <div className="button_circle"></div>
                        <div className="button_circle"></div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Helmet>
  )
}

export default Shipper
