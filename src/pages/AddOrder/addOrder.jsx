import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';
import './styles.scss'

import Helmet from '../../components/shared/Helmet/helmet'

import { UserContext } from '../../context/StoreContext';
import { ACTION } from '../../constants/action'
import { getObjectByValue, formatPhoneNumber, isValidEmail, truncateString } from "../../utils/utils"

import storeIcon from "../../assets/addOrder/storeIcon.svg"
import custommerIcon from "../../assets/addOrder/custommerIcon.svg"
import dropdownArrow from "../../assets/arrow_drop_down.svg"

const formData = {
  name: "",
  phone: "",
  email: "",
  city: undefined,
  district: undefined,
  ward: undefined,
  address: "",
  capacity: "",
  volume: "",
  price: "",
  type: "cash",
  action: 1,
  payment: "",
  other: "",
  date: ""
}

const AddOrder = () => {

  const [formInfor, setFormInfor] = useState(formData)
  const [switchBooleen, setSwitchBooleen] = useState({ button: false })
  const [chooseAddressVisible, setChooseAddressVisible] = useState(false)
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([])
  const [result, setResult] = useState("");
  const [addressSelected, setAddressSelected] = useState({ province: false, district: false });
  const { store, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      apiGetPublicProvinces()
    }
  }, [])

  const handleChangePayment = (event) => {
    const selectedValue = event.target.value;
    setFormInfor({ ...formInfor, type: selectedValue });
  }

  const hanldeChangePhoneNumber = (input) => {
    const phoneNumber = input.value.replace(/\D/g, '');
    if (phoneNumber.length <= 13) {
      setFormInfor({ ...formInfor, phone: phoneNumber });
    }
  };

  const hanldeCreateOrder = () => {
    console.log(formInfor);
  }

  const getHeaderContent = (id) => {
    const obj = getObjectByValue(ACTION, id)
    return (
      <div className="content">
        <div className="img"><img src={obj?.icon} alt="" draggable="false" /></div>
        <div className="name">{obj?.name}</div>
        <div className={switchBooleen.button ? "change_button choosing" : "change_button"} onClick={() => { setSwitchBooleen({ ...switchBooleen, button: !switchBooleen?.button }) }}>
          {!switchBooleen.button ?
            <span className={"default_button"} onClick={() => { setSwitchBooleen({ ...switchBooleen, button: !switchBooleen?.button }) }}>Đổi dịch vụ</span>
            :
            <span className={"choose_button"}>
              {ACTION.map((item, key) => {
                return (
                  <div className='button_choice' key={key} onClick={() => { setFormInfor({ ...formInfor, action: item.value }) }}>
                    <img src={item.icon} alt="" />
                    <div>{item.name}</div>
                  </div>
                )
              })}
            </span>
          }
        </div>
      </div>
    )
  }

  const apiGetPublicProvinces = async () => {
    try {
      const response = await axios.get('https://vapi.vnappmob.com/api/province/')
      setProvincesList(response.data.results)
    } catch (error) {
      console.log(error.message);
    }
  }

  const apiGetPublicDistrict = async (provinceId) => {
    try {
      const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      setDistrictsList(response.data.results)
    } catch (error) {
      console.log(error.message);
    }
  }

  const apiGetPublicWard = async (districtId) => {
    try {
      const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      setWardsList(response.data.results)
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleChooseAddressModal = () => {
    setChooseAddressVisible(!chooseAddressVisible)
    setAddressSelected({ province: false, district: false })
  }

  const handleProvinceChange = (selectedOption) => {
    setFormInfor({ ...formInfor, city: selectedOption?.province_name, district: undefined })
    setAddressSelected({ province: true, district: false })
    setResult(selectedOption?.province_name)
    apiGetPublicDistrict(selectedOption?.province_id)
  }

  const handleDistrictChange = (selectedOption) => {
    if (!formInfor.city) {
      hanldePosition(0)
    } else {
      setFormInfor({ ...formInfor, district: selectedOption?.district_name })
      setAddressSelected({ province: true, district: true })
      setResult(formInfor.city + ", " + selectedOption?.district_name)
      apiGetPublicWard(selectedOption?.district_id)
    }
  }

  const handleWardChange = (selectedOption) => {
    if (!formInfor.district) {
      hanldePosition(1)
    } else {
      setFormInfor({ ...formInfor, ward: selectedOption?.ward_name })
      setResult(formInfor.city + ", " + formInfor.district + ", " + selectedOption?.ward_name)
      handleChooseAddressModal()
    }
  }

  const getPosition = () => {
    let index = 0
    !addressSelected.province ?
      index = 0
      :
      !addressSelected.district ?
        index = 1
        :
        index = 2
    return index
  }

  const hanldePosition = (value) => {
    switch (value) {
      case 0:
        setAddressSelected({ province: false, district: false })
        break;
      case 1:
        if (formInfor.city) {
          setAddressSelected({ province: true, district: false })
        }
        break;
      case 2:
        if (formInfor.district) {
          setAddressSelected({ province: true, district: true })
        }
        break;
      default:
        break;
    }
  }

  function convertToShortForm(inputString) {
    const vietnameseMap = {
      'Thành phố': 'TP.',
      'Huyện': 'H.',
      'Tỉnh': 'T.',
      'Quận': 'Q.',
      'Xã': 'Xã'
    };
    const result = inputString.replace(/Thành phố |Huyện |Tỉnh |Quận |Xã/g, match => vietnameseMap[match.trim()]);
    return result;
  }

  function getCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    return formattedDate;
  }

  function validateMassInput(input) {
    const pattern = /^[0-9,.]*$/;
    if (pattern.test(input.target.value)) {
      setFormInfor({...formInfor, capacity: input.target.value})
    }
  }

  function validateNumber(input) {
    const pattern = /^[0-9]*$/;
    if (pattern.test(input.target.value)) {
      setFormInfor({...formInfor, price: input.target.value})
    }
  }

  return (
    <Helmet title={"Add Order | "}>
      <div className="add_order">
        <div className="header">
          <div className="title">
            Đơn hàng mới
          </div>
          {getHeaderContent(formInfor.action)}
        </div>

        <div className="body">
          <div className="right">

            <div className="title">
              Thông tin người gửi
            </div>
            <div className="store_infor">
              <div className="store_icon">
                <img src={storeIcon} alt="" draggable="false" />
              </div>
              <div className="store_infor_content">
                <span className="store_name">{store?.storeName}</span>
                <span className="store_address">{store?.storeAddress}</span>
                <span className="store_phone">{store?.storePhone} | {store?.storeEmail}</span>
              </div>
            </div>

            <div className="title">
              Thông tin người nhận
            </div>
            <div className="custommer_infor">
              <div className="custommer_icon">
                <img src={custommerIcon} alt="" draggable="false" />
              </div>
              <div className="custommer_infor_content">
                <div className="input_title">BẠN MUỐN GIAO HÀNG ĐẾN ĐÂU?</div>
                <div className="input_box">
                  <input type="text" className="name" placeholder='Nhập họ và tên *' value={formInfor.name} onChange={(e) => setFormInfor({...formInfor, name: e.target.value})} />
                  <input type="tel" className="phone" placeholder='Số điện thoại *' value={formInfor.phone} onChange={(e) => hanldeChangePhoneNumber(e.target)} />
                  <input type="text" className="email" placeholder='Địa chỉ Email *' value={formInfor.email} onChange={(e) => setFormInfor({...formInfor, email: e.target.value})} />
                  <div className="city" style={{ color: formInfor?.city ? "" : "rgba(0,0,0,0.7)" }}>
                    <div className="city_over_layout" onClick={handleChooseAddressModal} />
                    {
                      formInfor.city ?
                        convertToShortForm(result)
                        :
                        "Tỉnh/ Thành phố, Quận / Huyện *"
                    }
                    <img className="dropdown_arrow" src={dropdownArrow} alt="" />
                    {
                      chooseAddressVisible &&
                      <div className="select_modal">
                        <div className="header_modal">
                          <div className="option" onClick={() => { hanldePosition(0) }}>Tỉnh/Thành Phố</div>
                          <div className="option" onClick={() => { hanldePosition(1) }}>Quận/Huyện</div>
                          <div className="option" onClick={() => { hanldePosition(2) }}>Phường/Xã</div>
                          <div className="bottom_border" style={{ left: `${getPosition() * 33.3}%` }} />
                        </div>
                        <div className="body_modal">
                          {
                            !addressSelected.province ?
                              provincesList?.map((item, key) => {
                                return (
                                  <div key={key} className="address_option" onClick={() => handleProvinceChange(item)}>{item.province_name}</div>
                                )
                              })
                              :
                              !addressSelected.district ?
                                districtsList?.map((item, key) => {
                                  return (
                                    <div key={key} className="address_option" onClick={() => handleDistrictChange(item)}>{item.district_name}</div>
                                  )
                                })
                                :
                                wardsList?.map((item, key) => {
                                  return (
                                    <div key={key} className="address_option" onClick={() => handleWardChange(item)}>{item.ward_name}</div>
                                  )
                                })
                          }
                        </div>
                      </div>
                    }
                  </div>
                  <input type="text" className="address" placeholder='Địa chỉ cụ thể *' value={formInfor.address} onChange={(e) => setFormInfor({...formInfor, address: e.target.value})}/>
                </div>
                <div className="input_title">THÔNG TIN GÓI HÀNG</div>
                <div className="input_box">
                  <input type="text" className="name" placeholder='Khối lượng (kg) *' value={formInfor.capacity} onChange={validateMassInput}/>
                  <input type="text" className="address" placeholder='Chiều dài x Chiều rộng x Chiều cao (cm)' value={formInfor.volume} onChange={(e) => setFormInfor({...formInfor, volume: e.target.value})}/>
                  <input type="text" className="city" placeholder='Thu hộ' value={formInfor.price} onChange={validateNumber}/>
                  <input type="text" className="address" placeholder='Loại hàng hóa' value={formInfor.type} onChange={(e) => setFormInfor({...formInfor, type: e.target.value})}/>
                </div>
              </div>
            </div>

          </div>

          <div className="payment">
            <div className="title">
              Thanh toán
            </div>
            <div className="input_Title">
              HÌNH THỨC THANH TOÁN
            </div>
            <select className="select_input" name="type" id='type' onChange={handleChangePayment} value={formInfor.type}>
              <option className="input_option" value="cash">
                Tiền mặt
              </option>
              <option className="input_option" value="transfer">
                Thu hộ
              </option>
            </select>
            <div className="input_Title">
              GHI CHỨ CHO TÀI XẾ
            </div>
            <input type="text" className="input" placeholder='Ghi chú cho tài xế' value={formInfor.other} onChange={(e) => setFormInfor({...formInfor, other: e.target.value})}/>
            <div className="input_Title">
              GIAO TRƯỚC
            </div>
            <input
              type="datetime-local"
              className="input input_date"
              placeholder='Thời gian bắt buộc shipper giao hàng trước (AM/PM)'
              min={getCurrentDateTime()}
              onChange={(e) => setFormInfor({...formInfor, date: e.target.value})}
            />

            <div className="line" />

            <div className="fee">
              <div className="fee_name">Phí vận chuyển</div>
              <div className="fee_price">0 đ</div>
            </div>
            <div className="fee">
              <div className="fee_name">Phí phát sinh</div>
              <div className="fee_price">0 đ</div>
            </div>
            <div className="fee">
              <div className="fee_name">Phí thu hộ</div>
              <div className="fee_price">0 đ</div>
            </div>
            <div className="fee">
              <div className="total_fee_name">Tổng số tiền</div>
              <div className="total_fee_price">0 đ</div>
            </div>

            <div className="button" onClick={hanldeCreateOrder}>Tạo đơn hàng</div>
          </div>

        </div>

      </div>
    </Helmet>
  )
}

export default AddOrder
