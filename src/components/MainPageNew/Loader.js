import React from 'react'
import { BallTriangle } from 'react-loader-spinner';

import './Loader.scss'
import Logger from './Logger';

function Loader() {
    return (
        <>
            <div className="loaderOverlay" id="loaderOverlay"></div>

            <div className="loaderContainer" id="loaderContainer">
                <BallTriangle
                    height={100}
                    width={100}
                    radius={5}
                    color="#4fa94d"
                    ariaLabel="ball-triangle-loading"
                    wrapperClass={{}}
                    wrapperStyle=""
                    visible={true}
                />
                {/* <Logger/> */}
            </div>
        </>
    )
}

export default Loader