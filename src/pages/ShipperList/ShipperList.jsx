import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { SHIPPERSTATUS } from '../../constants/shipper';

import Helmet from '../../components/shared/Helmet/helmet'
import ShipperStaffTab from '../../components/ShipperStaffTab/ShipperStaffTab';
import { GetAllShipper } from '../../api/account';

const shipperType = [
    {
        value: true,
        name: "Đã đăng ký",
    },
    {
        value: false,
        name: "Chưa đăng ký",
    }
]

const ShipperList = () => {

    const [shipperList, setShipperList] = useState([])
    const [filterValue, setFilterValue] = useState(true)
    const [focusShipper, setFocusShipper] = useState({})
    const [searchValue, setSearchValue] = useState("")
    const [modalVisible, setModalVisible] = useState({ chooseZone: false, confirmDeactive: false, viewShipper: false })
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const response = await GetAllShipper(token)
        if (response?.status === 200) {
            // console.log(response?.data);
            setShipperList(response?.data)
        } else {
            toast.warning('Tải thông tin thât bại');
        }
    }

    const handleFilter = (value) => {
        return shipperList?.filter(item => item?.active === value)
    }

    const handleSearch = (list, value) => {
        if (value === "") {
            return list
        } else {
            const newFilteredData = list?.filter(item =>
                item?.fullName?.toLowerCase().includes(value) ||
                item?.email?.toLowerCase().includes(value) ||
                String(item?.phone)?.includes(value)
            );
            return newFilteredData
        }
    }

    return (
        <Helmet title={"Shipper list | "}>
            <div className="shipper_list">
                <div className="header">Danh sách tài xế của hệ thống</div>
                <div className="body">
                    <div className="shipper_status">
                        {shipperType.map((item, key) => {
                            return (
                                <div className={`type_button ${filterValue == item.value && "button_active"}`} onClick={() => { setFilterValue(item.value) }} key={key} >{item.name}</div>
                            )
                        })}
                        <div className="assign_time">
                            <input
                                type="text"
                                placeholder='Tìm Kiếm...'
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="shipper_list">
                        <div className="shipper_staff_tab">
                            <div className="tab_name">Họ và tên</div>
                            <div className="tab_phone">Số điện thoại</div>
                            <div className="tab_mail">Email</div>
                            <div className="tab_date_assign">Ngày đăng ký</div>
                            <div className="tab_status">Trạng thái</div>
                            <div className="tab_button"></div>
                        </div>
                        {
                            handleSearch(handleFilter(filterValue), searchValue)?.map((item, key) => {
                                return (
                                    <ShipperStaffTab item={item} setFocusShipper={setFocusShipper} parentModal={modalVisible} setParentModal={setModalVisible} key={key} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Helmet>
    )
}

export default ShipperList
