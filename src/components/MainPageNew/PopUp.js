import React from 'react'

import './PopUp.scss'

import errImg from '../../assets/New/error-graphic.svg'


function PopUp({ onClosePopUp = () => { }, errorPopup = false }) {
    return (

        <>

            <div onClick={onClosePopUp} className="popup-overlay" id="popupOverlay"></div>

            <div className="popup" id="popup">
                {!errorPopup ?
                    <>
                        <img src={require('../../assets/New/successful-graphic.png')} alt="popUpImg" className="popUpImg" />
                        <h2>Download Successful</h2>
                    </>
                    :
                    <><img src={errImg} alt="popUpImg" className="popUpImg" />
                        <h2 className='errorText'>Sorry, Webassembly is Not Supported by Your Browser! <br /> This App Needs Webassembly To Work.</h2></>
                }



                <button onClick={onClosePopUp} style={{ border: 'none', textAlign: 'center', textDecoration: 'none', backgroundColor: 'white', cursor: 'pointer', marginTop: 10 }} id="closeBtn">
                    <img src={require('../../assets/New/ic_close.png')} alt="closePopupIcon" className="closePopupIcon" /></button>
            </div >

        </>

    )
}

export default PopUp