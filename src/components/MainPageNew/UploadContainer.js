import React, { useState, useEffect, memo } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './UploadContainer.scss';
import PopUp from './PopUp';
import { BallTriangle } from 'react-loader-spinner';
import { AiOutlineCloudUpload } from "react-icons/ai";
import Loader from './Loader';
import dummyGif from '../../assets/original.webp'
import moment from 'moment/moment';
import ReactFreezeframe from 'react-freezeframe';
import { FFprobeWorker } from "ffprobe-wasm";
import {
    formatBytes, getFileNameAndExtension, minutesToSeconds,
    secondsToMinutes
} from './UtilityFunctions';

const ffmpeg = createFFmpeg({ log: true });
const worker = new FFprobeWorker();


function VideoToGifIndicatorContainer({ icon, text }) {
    return (<div className="videoIconText">
        <img src={icon} className="icon" alt='icon'></img>
        <div className="text">{text}</div>
    </div>)

}

const TimeInputComponent = memo(({ handleChange = (event) => console.log('TimeInputComponent', event), value = '00' }) => {

    // console.log("TimeInputComponent");

    const handleKeyDown = (event) => {
        const keyCode = event.keyCode || event.which;

        // Allow backspace (keyCode 8), delete (keyCode 46), arrow keys (keyCodes 37-40), numpad number keys (keyCodes 96-105), and tab (keyCode 9)
        if (
            keyCode === 8 ||
            keyCode === 46 ||
            keyCode === 9 ||
            (keyCode >= 37 && keyCode <= 40) ||
            (keyCode >= 96 && keyCode <= 105)
        ) {
            return;
        }

        const keyValue = String.fromCharCode(keyCode);

        // Allow only numbers (0-9)
        if (!/^[0-9]+$/.test(keyValue)) {
            event.preventDefault();
        }
    };

    return (
        <input minLength={0} maxLength={2} size={2} type='text' className="timeInput"
            value={value}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
        />
    )
})

const VideoToGifTimeInput = memo(({ timeInputTitle, minValue = '00', secValue = '00', minHandleChange = (event) => console.log('minHandleChange', event?.target?.value), secHandleChange = (event) => console.log('secHandleChange', event?.target?.value) }) => {





    // console.log("VideoToGifTimeInput");


    return (
        <div className="timeInputMainContainer">
            <div className="timeInputTitle">{timeInputTitle}</div>
            <div className="timeInputContainer">
                <div className="secIndicator">
                    Min
                </div>
                <TimeInputComponent key={'ForMinute'} handleChange={minHandleChange} value={minValue} />
                {/* <input minLength={0} maxLength={2} size={2} type='text' className="timeInput"
                    value={minValue}
                    onKeyDown={handleKeyDown}
                    onChange={minHandleChange}
                /> */}
                <div className="colon">:</div>
                <TimeInputComponent key={'ForSecond'} handleChange={secHandleChange} value={secValue} />
                {/* <input minLength={0} maxLength={2} size={2} type='text' className="timeInput"
                    value={secValue}
                    onKeyDown={handleKeyDown}
                    onChange={secHandleChange}
                /> */}
            </div>
        </div>)

})

const UploadGround = ({ getFile = () => { }, extraCallback = () => { } }) => {

    return (
        <>

            <label htmlFor="file-upload" className="uploadGround">
                <img src={require('../../assets/New/ic_upload.png')} className="uploadIcon">

                </img>
            </label>

            {/* <label htmlFor="file-upload" className="convertNowBtn">
                Convert Now
            </label> */}

            <input accept=".mp4, .mkv" type="file" id='file-upload' onChange={(e) => {
                // getFile(e.target.files?.item(0))
                getFile(e.target.files)
            }} />
        </>
    )
}

function VideoDetailsCard({ title = '', dateTimeSize = '', cancel = () => { } }) {
    return (
        <div className="videoDetailsCard">
            <div className="iconFileDetailsContainer">
                <img src={require('../../assets/New/ic_file_video.png')} alt="videoDetailsIcon" className="videoDetailsIcon" />
                <div className="fileNameDateContainer">
                    <div className="fileName">
                        {title}
                    </div>
                    <div className="dateTimeSize">
                        {dateTimeSize}
                    </div>
                </div>
            </div>
            <button onClick={cancel} style={{ border: 'none', textAlign: 'center', textDecoration: 'none', backgroundColor: 'white', cursor: 'pointer', marginRight: 15, zIndex: 1 }} >
                <img src={require('../../assets/New/ic_close.png')} alt="closeIcon" className="closeIcon" />
            </button>
        </div>
    )
}


function Button({ title, onClick, downloadBtn = false, downloadURL, cancelBtn = false }) {

    return (
        <>
            {downloadBtn ?
                <a onClick={onClick} className='convertNowBtn' style={{ textDecoration: 'none', color: 'white' }} href={downloadURL} download >
                    {title}

                </a>
                :
                <>
                    <button onClick={() => {
                        onClick(true)
                        // convertToGif()
                    }} className={cancelBtn ? 'cancelBtn' : 'convertNowBtn'}>

                        {title}
                    </button>

                </>
            }

        </>
    )
}

function UploadContainer() {

    const [showPopUp, setshowPopUp] = useState(false)
    const [showErrorPopUp, setshowErrorPopUp] = useState(false)

    const [ready, setReady] = useState(false);
    const [video, setVideo] = useState();
    const [gif, setGif] = useState();
    const [videoName, setvideoName] = useState('')
    const [videoMetaData, setvideoMetaData] = useState(null
        // {
        //     "filename": "",
        //     "nb_streams": 0,
        //     "nb_programs": 0,
        //     "format_name": "",
        //     "format_long_name": "",
        //     "start_time": "",
        //     "duration": "",
        //     "size": "",
        //     "bit_rate": "",
        //     "probe_score": 0,
        //     "tags": {
        //         "major_brand": "",
        //         "minor_version": "",
        //         "compatible_brands": "",
        //         "creation_time": ""
        //     }
        // }
    )

    const [startTimeMin, setstartTimeMin] = useState("00")
    const [startTimeSec, setstartTimeSec] = useState("00")

    const [endTimeMin, setendTimeMin] = useState("00")
    const [endTimeSec, setendTimeSec] = useState("00")

    const [dateTimeSize, setdateTimeSize] = useState('')
    const [durationSize, setdurationSize] = useState('')
    const [progress, setProgress] = useState(0);
    const [isprogressStart, setisprogressStart] = useState(false);

    const load = async () => {

        try {

            await ffmpeg.load();
            setshowErrorPopUp(false)
            setReady(true);
        }
        catch (error) {
            // Handle any other unexpected errors that might occur during FFmpeg Wasm usage
            console.error("Error while using FFmpeg Wasm:", error);
            setshowErrorPopUp(true)
        }

    }

    useEffect(() => {
        load();
    }, [])


    function checkIfStartTimeIsValid() {
        if (minutesToSeconds(startTimeMin, startTimeSec) > minutesToSeconds(endTimeMin, endTimeSec)) {

            setstartTimeMin('00')
            setstartTimeSec('00')

            return false

        }

        return true
    }

    useEffect(() => {


        checkIfStartTimeIsValid()

    }, [startTimeMin,
        startTimeSec])


    function checkIfValidToConvert() {

        checkIfStartTimeIsValid() && convertToGif()


    }

    const convertToGif = async () => {
        // setReady(false);
        // Write the file to memory 
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

        ffmpeg.setProgress(({ ratio }) => {
            console.log('progress', ratio);
            setProgress(parseFloat(ratio * 100).toFixed(1));
        });
        setisprogressStart(true)
        // Run the FFMpeg command
        // await ffmpeg.run('-i', 'test.mp4', '-t', '1', '-ss', '6', '-f', 'gif', 'out.gif');

        // await ffmpeg.run('-i', 'test.mp4', '-t', duration, '-ss', startTime, '-f', 'gif', 'out.gif');

        const args = [
            '-ss', String(minutesToSeconds(startTimeMin, startTimeSec)), // Start time
            '-i', 'test.mp4',
            '-t', String(minutesToSeconds(endTimeMin, endTimeSec) - minutesToSeconds(startTimeMin, startTimeSec)), // Duration
            // '-vf', 'fps=15,scale=320:-1:flags=lanczos', // Reduce frame rate and scale down
            '-c:v', 'gif', // Use the GIF codec
            '-f', 'gif', 'out.gif',
        ];

        console.log('ffmpeg args', args);

        await ffmpeg.run(...args);

        // Read the result
        const data = ffmpeg.FS('readFile', 'out.gif');

        // Create a URL
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
        // setReady(true);
        setGif(url)
    }

    const startTimeMinHandleChange = (event) => {
        event.preventDefault()
        const value = event?.target?.value
        setstartTimeMin(value)
        console.log('startTimeMinHandleChange', value)
    }

    const startTimeSecHandleChange = (event) => {
        event.preventDefault()
        const value = event?.target?.value
        setstartTimeSec(value)
        console.log('startTimeSecHandleChange', value)
    }

    const endTimeMinHandleChange = (event) => {
        event.preventDefault()
        const value = event?.target?.value
        setendTimeMin(value)
        console.log('endTimeMinHandleChange', value)
    }

    const endTimeSecHandleChange = (event) => {
        event.preventDefault()
        const value = event?.target?.value
        setendTimeSec(value)
        console.log('endTimeSecHandleChange', value)
    }

    async function getVideoInfo(videoFile) {

        setReady(false);

        const fileInfo = await worker.getFileInfo(videoFile);
        console.log('getVideoInfo', fileInfo);

        setvideoMetaData(fileInfo?.format)

        setReady(true);
    };

    useEffect(() => {

        if (videoMetaData) {

            const minutes = secondsToMinutes(videoMetaData?.duration)
            console.log("minutes", minutes);

            let tempMin = minutes.minutes
            let tempSec = String(minutes.seconds).split('.')[0]

            if (String(tempMin).length === 1) {
                tempMin = "0" + String(tempMin)
            }

            if (String(tempSec).length === 1) {
                tempSec = "0" + String(tempSec)
            }

            setendTimeMin(String(tempMin))
            setendTimeSec(String(tempSec))

        }


    }, [videoMetaData])


    function addDurationToDateTimeSize(dateTimeSizeValue = '') {

        if (dateTimeSizeValue == '') {
            return
        }

        console.log('addDurationToDateTimeSize', dateTimeSizeValue);

        setdurationSize(`Duration: ${endTimeMin}:${endTimeSec}, Size: ${dateTimeSizeValue?.split('^')[1]}`)

    }


    useEffect(() => {

        (endTimeMin != '00' || endTimeSec != '00') && (dateTimeSize != '') && addDurationToDateTimeSize(dateTimeSize)


    }, [dateTimeSize, endTimeMin, endTimeSec])



    function getFileFromUser(files) {

        setGif(null)
        getVideoInfo(files?.item(0))

        setVideo(files?.item(0))

        const filesArray = Array.from(files)
        console.log("filesArray:", filesArray[0])
        console.log("filesArray:", moment(filesArray[0].lastModifiedDate).format('DD/MM/YYYY'))
        console.log("filesArray:", moment(filesArray[0].lastModifiedDate).format('h:mm:ss A'))
        console.log("filesArray:", formatBytes(filesArray[0].size))
        console.log("filesArray:", filesArray[0].name)

        const fileNameWithExtension = String(filesArray[0].name)

        // const fileNameArray = fileNameWithExtension.split('.')

        // console.log("filesArray:", fileNameArray[0].length)

        console.log('getFileNameAndExtension()', getFileNameAndExtension(fileNameWithExtension));

        const { fileName,
            FileExtension } = getFileNameAndExtension(fileNameWithExtension)

        if (String(fileName).length > 15) {
            const tempName = String(fileName).slice(0, 20) + '... .' + FileExtension
            setvideoName(tempName)

            console.log("if", tempName);
        }
        else {
            setvideoName(fileNameWithExtension)
            console.log("else");
        }



        setdateTimeSize(moment(filesArray[0].lastModifiedDate).format('DD/MM/YYYY') + ', ' + moment(filesArray[0].lastModifiedDate).format('h:mm:ss A') + '^' + formatBytes(filesArray[0].size))

        // const date = moment(new Date(dateString).toISOString())

        // return moment(date).format('MMMM-YYYY')


    }

    function cancelVideo() {
        setVideo(null)

        console.log("ffff");
    }



    return (


        <>

            {

                !ready ?

                    <Loader />
                    : <></>
            }


            <div style={(video || gif) && { height: '26vw' }} className="uploadContainer">

                {gif ? <></> :

                    <div className="uploadTitle">
                        Upload video file
                    </div>

                }

                {!video ?

                    <UploadGround getFile={getFileFromUser} />
                    :
                    gif ?
                        <>
                            <img className='previewGif' src={gif} />
                            {/* <div className='previewGif'>
                                <ReactFreezeframe options={{
                                    // trigger: false,
                                    // overlay: true,
                                    responsive: true
                                }} src={gif} />
                            </div> */}
                        </>
                        :

                        <VideoDetailsCard title={videoName} dateTimeSize={durationSize} cancel={cancelVideo} />
                }

                {/* {gif ? <img className='previewGif' src={gif} width="500" /> :
                    <></>
                } */}


                {isprogressStart && <div className="progressBarContainer">

                    <progress className='progressBar' value={progress} max={100} />

                    <div className="progressValue">
                        {`${progress} %`}
                    </div>

                </div>
                }

                {!video ?

                    <div className="videoToGifIndicatorContainer">
                        <VideoToGifIndicatorContainer icon={require('../../assets/New/ic_video.png')} text={'Video'} />

                        <img src={require('../../assets/New/ic_arrow.png')} alt="arrowImg" className="arrowImg" />
                        <VideoToGifIndicatorContainer icon={require('../../assets/New/ic_gif.png')} text={'Gif'} />
                    </div>

                    :
                    <div className="videoToGifTimeIndicatorContainer">
                        <VideoToGifTimeInput key={'StartTime'} text={'Video'} timeInputTitle={'Start Time'} minValue={startTimeMin} secValue={startTimeSec} minHandleChange={startTimeMinHandleChange} secHandleChange={startTimeSecHandleChange} />

                        <div className="centerSpace"></div>
                        <VideoToGifTimeInput key={'EndTime'} text={'Gif'} timeInputTitle={'End Time'} minValue={endTimeMin} secValue={endTimeSec} minHandleChange={endTimeMinHandleChange} secHandleChange={endTimeSecHandleChange} />
                    </div>
                }

                {/* <input type="text" value={startTimeMin} onChange={startTimeMinHandleChange} /> */}





                {gif ? <Button downloadURL={gif} downloadBtn={true} onClick={() => {
                    setshowPopUp(true)
                    console.log(gif);
                    // convertToGif()
                }}
                    title={'Download'}
                /> :
                    (video && isprogressStart == false) ?

                        <Button onClick={() => {

                            checkIfValidToConvert()

                        }}
                            title={'Convert Now'}
                        />
                        :
                        // !progress == 0 && <Button cancelBtn onClick={() => {

                        //     // cancelAction()

                        // }}
                        //     title={'Cancel Now'}
                        // />
                        <></>

                }



                {/* <label htmlFor="file-upload" className="convertNowBtn">
                    Convert Now
                </label> */}

                {/* <input type="file" id='file-upload' onChange={(e) => setVideo(e.target.files?.item(0))} /> */}




            </div>

            {showPopUp ?
                <PopUp onClosePopUp={() => {
                    setshowPopUp(false)
                    setGif(null)
                    setVideo(null)
                    setisprogressStart(false)
                }} />

                : <></>}


            {showErrorPopUp ?
                <PopUp errorPopup />

                : <></>}



        </>
    )
}

export default UploadContainer