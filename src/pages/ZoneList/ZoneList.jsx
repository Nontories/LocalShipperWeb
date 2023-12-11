import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetAllZone, UpdateZoneStatus } from '../../api/zone';

import Helmet from '../../components/shared/Helmet/helmet'
import ZoneTab from '../../components/ZoneTab/ZoneTab';
import ConfirmModal from "../../components/modal/ConfirmModal/ConfirmModal"
import Pagination from '../../components/Pagination/Pagination';

const ZoneList = () => {

    const [zoneList, setZoneList] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [focusZone, setFocusZone] = useState({})
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [modalVisible, setModalVisible] = useState({ confirmDeactive: false, confirmActive: false })
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const response = await GetAllZone(token)
        if (response?.status === 200) {
            setZoneList(response?.data)
        } else {
            toast.warning('Tải thông tin khu vực thất bại');
        }
    }

    const handleSearch = (list, value) => {
        if (value === "") {
            return list
        } else {
            const newFilteredData = list?.filter(item =>
                item.zoneName.toLowerCase().includes(value)
            );

            return newFilteredData
        }
    }

    const handleFilter = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return zoneList.slice(startIndex, endIndex);
    }

    const handleCloseDeactiveConfirm = () => {
        setModalVisible({ ...modalVisible, confirmDeactive: false })
    }

    const handleCloseActiveConfirm = () => {
        setModalVisible({ ...modalVisible, confirmActive: false })
    }

    const handleSubmitDeactiveConfirm = async () => {
        const response = await UpdateZoneStatus(focusZone?.id, false, token)
        if (response?.status === 200) {
            toast.success(`Vô hiệu hoá khu vực ${focusZone?.zoneName} thành công`);
            await loadData()
        } else {
            toast.error(`Vô hiệu hoá khu vực thất bại`);
        }
    }

    const handleSubmitActiveConfirm = async () => {
        const response = await UpdateZoneStatus(focusZone?.id, true, token)
        if (response?.status === 200) {
            toast.success(`Kích hoạt khu vực ${focusZone?.zoneName} thành công`);
            await loadData()
        } else {
            toast.error(`Kích hoạt khu vực thất bại`);
        }
    }

    return (
        <Helmet title={"Zone list | "}>
            <div className="zone_list">
                <div className="header">Danh sách khu vực của hệ thống</div>
                <div className="body">
                    <div className="zone_status">
                        <div className="assign_time">
                            <input
                                type="text"
                                placeholder='Tìm kiếm...'
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="zone_list">
                        <div className="zone_tab">
                            <div className="tab_name">Tên khu vực</div>
                            <div className="tab_descrip">Mô tả</div>
                            <div className="tab_create-date">Ngày tạo</div>
                            <div className="tab_edit-date">Ngày chỉnh sửa</div>
                            <div className="tab_status">Trạng thái</div>
                            <div className="tab_button"></div>
                        </div>
                        {
                            handleSearch(zoneList, searchValue)?.map((item, key) => {
                                return (
                                    <ZoneTab
                                        item={item}
                                        setFocusZone={setFocusZone}
                                        parentModal={modalVisible}
                                        setParentModal={setModalVisible}
                                        key={key}
                                    />
                                )
                            })
                        }
                    </div>
                    <Pagination
                        itemsPerPageitemsPerPage
                        positionLength={handleFilter().length}
                        filterLength={zoneList.length}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <ConfirmModal
                    visible={modalVisible.confirmDeactive}
                    setVisible={handleCloseDeactiveConfirm}
                    title={"Xác nhận"}
                    content={`Xác nhận vô hiệu hoá ${focusZone?.zoneName}`}
                    onConfirm={handleSubmitDeactiveConfirm}
                    onCancle={handleCloseDeactiveConfirm}
                />
                <ConfirmModal
                    visible={modalVisible.confirmActive}
                    setVisible={handleCloseActiveConfirm}
                    title={"Xác nhận"}
                    content={`Xác nhận hiệu hoá ${focusZone?.zoneName}`}
                    onConfirm={handleSubmitActiveConfirm}
                    onCancle={handleCloseActiveConfirm}
                />
            </div>
        </Helmet>
    )
}

export default ZoneList
