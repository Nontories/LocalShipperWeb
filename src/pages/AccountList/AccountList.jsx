import React, { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { EditAccount, GetAllAccount } from '../../api/account';
import { GetAllRole } from '../../api/role';

import Helmet from '../../components/shared/Helmet/helmet'
import ConfirmModal from '../../components/modal/ConfirmModal/ConfirmModal';
import AccountTab from '../../components/AccountTab/AccountTab';
import Pagination from '../../components/Pagination/Pagination';
import { getObjectByValueInObj } from '../../utils/utils';
import UpdateAccount from '../../components/modal/UpdateAccount/UpdateAccount';
import AccountDetail from '../../components/AccountDetail/AccountDetail';

const AccountList = () => {

  const [accountList, setAccountList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [focusAccount, setFocusAccount] = useState({})
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [modalVisible, setModalVisible] = useState({ viewAccount: false, editAccount: false, confirmDelete: false, confirmActive: false })
  const { store, token } = useContext(UserContext);

  useEffect(() => {
    loadAccountData()
    loadRoleData()
  }, [])

  const loadAccountData = async () => {
    const response = await GetAllAccount(token)
    if (response?.status === 200) {
      setAccountList(response?.data?.reverse())
    } else {
      toast.error("Tải danh sách tài khoản không thành công")
    }
  }

  const loadRoleData = async () => {
    const response = await GetAllRole(token)
    if (response?.status === 200) {
      setRoleList(response?.data?.reverse())
    } else {
      toast.error("Tải danh sách vai trò không thành công")
    }
  }

  const handleFilter = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return accountList.slice(startIndex, endIndex);
  }

  const handleSearch = (list, value) => {
    if (value === "") {
      return list
    } else {
      const newFilteredData = list?.filter(item =>
        item.fullname.toLowerCase().includes(value.toLowerCase()) ||
        item.phone.toLowerCase().includes(value) ||
        item.email.includes(value.toLowerCase()) ||
        getObjectByValueInObj(item?.roleId)?.name.includes(value.toLowerCase())
      );

      return newFilteredData
    }
  }

  const handleDeleteAccount = async () => {
    const data = {
      fullname: focusAccount?.fullname,
      email: focusAccount?.email,
      phone: focusAccount?.phone,
      password: focusAccount?.password,
      roleId: focusAccount?.roleId,
      imageUrl: focusAccount?.imageUrl,
      fcm_token: focusAccount?.fcm_token,
      active: false
    }
    const response = await EditAccount(focusAccount?.id, data, token)
    if (response?.status === 200) {
      await loadAccountData()
      handleCloseDelete()
      toast.success("Vô hiệu hoá tài khoản thành công")
    } else {
      toast.error("Vô hiệu hoá thông tin thất bại")
    }
  }

  const handleActiveAccount = async () => {
    const data = {
      fullname: focusAccount?.fullname,
      email: focusAccount?.email,
      phone: focusAccount?.phone,
      password: focusAccount?.password,
      roleId: focusAccount?.roleId,
      imageUrl: focusAccount?.imageUrl,
      fcm_token: focusAccount?.fcm_token,
      active: true
    }
    console.log(data);
    const response = await EditAccount(focusAccount?.id, data, token)
    if (response?.status === 200) {
      await loadAccountData()
      handleCloseActive()
      toast.success("Kích hoạt tài khoản thành công")
    } else {
      toast.error("Kích hoạt thông tin thất bại")
    }
  }

  const handleCloseView = () => {
    setModalVisible({ ...modalVisible, viewAccount: false })
  }

  const handleCloseEdit = () => {
    setModalVisible({ ...modalVisible, editAccount: false })
  }

  const handleCloseDelete = () => {
    setModalVisible({ ...modalVisible, confirmDelete: false, viewAccount: false })
  }

  const handleCloseActive = () => {
    setModalVisible({ ...modalVisible, confirmActive: false, viewAccount: false })
  }

  return (
    <Helmet title={"Account List | "}>
      <div className="account_list">
        <div className="header">Danh sách tài khoản của hệ thống</div>
        <div className="body">
          <div className="account_status">
            <div className="assign_time">
              <input
                type="text"
                placeholder='Tìm Kiếm...'
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
              />
            </div>
          </div>
          <div className="account_list">
            <div className="account_tab">
              <div className="tab_name">Họ và tên</div>
              <div className="tab_phone">Số điện thoại</div>
              <div className="tab_mail">Email</div>
              <div className="tab_role">Vai trò</div>
              <div className="tab_date">Ngày đăng ký</div>
              <div className="tab_status">Trạng thái</div>
              <div className="tab_button"></div>
            </div>
            {
              handleSearch(handleFilter(), searchValue)?.map((item, key) => {
                return (
                  <AccountTab
                    item={item}
                    setFocusAccount={setFocusAccount}
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
            positionLength={handleFilter().length}
            filterLength={accountList.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <UpdateAccount
          visible={modalVisible.editAccount}
          onCancle={handleCloseEdit}
          focusAccount={focusAccount}
          reLoad={loadAccountData}
          roleList={roleList}
        />
        <AccountDetail
          focusAccount={focusAccount}
          parentModal={modalVisible}
          setParentModal={setModalVisible}
          visible={modalVisible.viewAccount}
          onCancle={handleCloseView}
        />
        <ConfirmModal
          visible={modalVisible.confirmDelete}
          setVisible={handleCloseDelete}
          title="Xác nhận vô hiệu hoá tài khoản"
          content={`Vô hiệu hoá tài khoản ${focusAccount.fullname}`}
          onConfirm={handleDeleteAccount}
          onCancle={handleCloseDelete}
        />
        <ConfirmModal
          visible={modalVisible.confirmActive}
          setVisible={handleCloseActive}
          title="Xác nhận kích hoạt tài khoản"
          content={`Kích hoạt tài khoản ${focusAccount.fullname}`}
          onConfirm={handleActiveAccount}
          onCancle={handleCloseActive}
        />
      </div>
    </Helmet>
  )
}

export default AccountList
