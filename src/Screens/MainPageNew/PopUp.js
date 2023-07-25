import React from 'react'

import './PopUp.scss'


function PopUp({ onClosePopUp = () => { } }) {
    return (

        <>

            <div onClick={onClosePopUp} className="popup-overlay" id="popupOverlay"></div>

            <div className="popup" id="popup">
                <img src={require('../../assets/New/successful-graphic.png')} alt="popUpImg" className="popUpImg" />
                <h2>Download Successful</h2>

                <button onClick={onClosePopUp} style={{ border: 'none', textAlign: 'center', textDecoration: 'none', backgroundColor: 'white', cursor: 'pointer' }} id="closeBtn">
                    <img src={require('../../assets/New/ic_close.png')} alt="closePopupIcon" className="closePopupIcon" /></button>
            </div>

        </>

    )
}

export default PopUp