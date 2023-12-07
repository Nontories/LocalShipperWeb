import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'

const CustomOptionDropdown = ({ visible, onCancle, dropdownList }) => {
    return (
        visible &&
        <>
            <div className="layout" onClick={onCancle}/>
            <div className="custom_option_dropdown">
                {
                    dropdownList?.map((item, index) => {
                        return (
                            <div className="option" key={index} onClick={item.action}>
                                <div className="name" style={{ color: item.color }}>{item.name}</div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default CustomOptionDropdown
