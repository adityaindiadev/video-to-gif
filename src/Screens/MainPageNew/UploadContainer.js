import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './UploadContainer.scss';
import PopUp from './PopUp';
import { BallTriangle } from 'react-loader-spinner';
import { AiOutlineCloudUpload } from "react-icons/ai";
import Loader from './Loader';
import dummyGif from '../../assets/original.webp'
import moment from 'moment/moment';
import ReactFreezeframe from 'react-freezeframe';
const ffmpeg = createFFmpeg({ log: true });

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    // const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function VideoToGifIndicatorContainer({ icon, text }) {
    return (<div className="videoIconText">
        <img src={icon} className="icon" alt='icon'></img>
        <div className="text">{text}</div>
    </div>)

}

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

            <input accept='video/mp4' type="file" id='file-upload' onChange={(e) => {
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
    const [dateTimeSize, setdateTimeSize] = useState('')
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
        await ffmpeg.run('-i', 'test.mp4', '-t', '5', '-ss', '3', '-f', 'gif', 'out.gif');

        

        // Read the result
        const data = ffmpeg.FS('readFile', 'out.gif');

        // Create a URL
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
        // setReady(true);
        setGif(url)
    }

    function cancelAction(params) {

        // ffmpeg.exit()
        
    }

    function removeLastOccurrence(inputString, textToRemove) {
        // Find the index of the last occurrence of the text
        const lastIndex = inputString.lastIndexOf(textToRemove);

        // If the text is not found, return the original string
        if (lastIndex === -1) {
            return inputString;
        }

        // Remove the last occurrence using slice
        const modifiedString = inputString.slice(0, lastIndex) + inputString.slice(lastIndex + textToRemove.length);

        return modifiedString;
    }

    function getFileExtension(fileName) {
        var re = /(?:\.([^.]+))?$/;

        return re.exec(fileName)[1];
    }

    function getFileNameAndExtension(fileNameWithExtension) {

        const FileExtension = getFileExtension(fileNameWithExtension)

        const fileName = removeLastOccurrence(fileNameWithExtension, "." + FileExtension)

        return { fileName, FileExtension }

    }



    function getFileFromUser(files) {

        setGif(null)

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



        setdateTimeSize(moment(filesArray[0].lastModifiedDate).format('DD/MM/YYYY') + ', ' + moment(filesArray[0].lastModifiedDate).format('h:mm:ss A') + ' . ' + formatBytes(filesArray[0].size))

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


            <div style={(video || gif) && { height: '28vw' }} className="uploadContainer">

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
                            <img className='previewGif' src={gif}  />
                            {/* <div className='previewGif'>
                                <ReactFreezeframe options={{
                                    // trigger: false,
                                    // overlay: true,
                                    responsive: true
                                }} src={gif} />
                            </div> */}
                        </>
                        :

                        <VideoDetailsCard title={videoName} dateTimeSize={dateTimeSize} cancel={cancelVideo} />
                }

                {/* {gif ? <img className='previewGif' src={gif} width="500" /> :
                    <></>
                } */}



                <div className="videoToGifIndicatorContainer">
                    <VideoToGifIndicatorContainer icon={require('../../assets/New/ic_video.png')} text={'Video'} />

                    <img src={require('../../assets/New/ic_arrow.png')} alt="arrowImg" className="arrowImg" />
                    <VideoToGifIndicatorContainer icon={require('../../assets/New/ic_gif.png')} text={'Gif'} />
                </div>



                {video && <div className="progressBarContainer">

                    <progress className='progressBar' value={progress} max={100} />

                    <div className="progressValue">
                        {`${progress} %`}
                    </div>

                </div>
                }

                {gif ? <Button downloadURL={gif} downloadBtn={true} onClick={() => {
                    setshowPopUp(true)
                    console.log(gif);
                    // convertToGif()
                }}
                    title={'Download'}
                /> :
                    (video && isprogressStart == false) ?

                        <Button onClick={() => {

                            convertToGif()

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