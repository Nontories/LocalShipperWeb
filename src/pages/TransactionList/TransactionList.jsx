import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetTransaction } from '../../api/transaction';

import { formatPrice } from "../../utils/utils"

import Helmet from '../../components/shared/Helmet/helmet'
import TransactionTab from '../../components/TransactionTab/TransactionTab';
import Pagination from '../../components/Pagination/Pagination';

const TransactionList = () => {

    const [transactionList, setTransactionList] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [focusTransaction, setFocusTransaction] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [modalVisible, setModalVisible] = useState()
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadTransactionData()
    }, [])

    const loadTransactionData = async () => {
        const data = {
            id: store?.wallet?.id
        }

        const response = await GetTransaction(data, token)
        if (response?.status === 200) {
            setTransactionList(response?.data)
        } else {
            toast.warning('Tải thông tin giao dịch thất bại');
        }
    }

    const handleFilter = (value) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return transactionList.slice(startIndex, endIndex);
    }

    const handleSearch = (list, value) => {
        if (value === "") {
            return list
        } else {
            const newFilteredData = list?.filter(item =>
                item?.transactionType?.toLowerCase().includes(value.toLowerCase()) ||
                item?.sender?.toLowerCase().includes(value.toLowerCase()) ||
                item?.receiver?.toLowerCase().includes(value.toLowerCase()) ||
                String(item?.amount)?.includes(value.toLowerCase())
            );
            return newFilteredData
        }
    }

    return (
        <Helmet title={"Transaction List | "}>
            <div className="transaction_list">
                <div className="header">Danh sách giao dịch của hệ thống</div>
                <div className="body">
                    <div className="transaction_status">
                        <div className="account_money">
                            <div>Tổng số dư tài khoản</div>
                            {formatPrice(store?.wallet.balance)} đ
                        </div>
                        <div className="assign_time">
                            <input
                                type="text"
                                placeholder='Tìm Kiếm...'
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="transaction_list">
                        <div className="transaction_tab">
                            <div className="tab_index">#</div>
                            <div className="tab_type">Loại giao dịch</div>
                            <div className="tab_sender">Người gửi</div>
                            <div className="tab_receiver">Người nhận</div>
                            <div className="tab_amount">Số tiền</div>
                            <div className="tab_time">Thời gian</div>
                            <div className="tab_content">Nội dung</div>
                            <div className="tab_collection">Thu hộ cho đơn hàng(nếu có)</div>
                            <div className="tab_button"></div>
                        </div>
                        {
                            handleSearch(handleFilter(), searchValue)?.map((item, index) => {
                                return (
                                    <TransactionTab
                                        item={item}
                                        index={index}
                                        setFocusTransaction={setFocusTransaction}
                                        parentModal={modalVisible}
                                        setParentModal={setModalVisible}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    positionLength={handleFilter().length}
                    filterLength={transactionList.length}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </Helmet>
    )
}

export default TransactionList
