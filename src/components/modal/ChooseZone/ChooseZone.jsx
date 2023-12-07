import React, { useEffect } from "react";
import "./styles.scss"

const ChooseZone = ({ visible, zone, setZone, zoneList, onSubmit, onCancle }) => {

    useEffect(() => {
        setZone(zoneList[0]?.id)
    }, [visible])

    const handleChangeZone = (event) => {
        setZone(Number(event.target.value))
    }

    return (
        visible &&
        <div className="choose_zone">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="title">Chọn Zone cho Shipper</div>
                <div className="input_lable">
                    <label htmlFor="mail">Chọn zone</label>
                    <select
                        type="text"
                        id='mail'
                        className='mail'
                        value={zone}
                        onChange={handleChangeZone}
                    >
                        {zoneList.map((item, key) => {
                            return (
                                <option className="input_option" value={item.id} key={key}>
                                    {item.zoneName}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className="button_pack">
                    <div className="cancle_button" onClick={onCancle}>Hủy</div>
                    <div className="add_button" onClick={onSubmit}>Xác nhận</div>
                </div>
            </div>
        </div>
    )
}

export default ChooseZone