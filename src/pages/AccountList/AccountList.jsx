import React, { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import Helmet from '../../components/shared/Helmet/helmet'

const AccountList = () => {

  return (
    <Helmet title={"Account List | "}>
      <div className="account_list">
        Account List
      </div>
    </Helmet>
  )
}

export default AccountList
