export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    // const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getFileNameAndExtension(fileNameWithExtension) {

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

    const FileExtension = getFileExtension(fileNameWithExtension)

    const fileName = removeLastOccurrence(fileNameWithExtension, "." + FileExtension)

    return { fileName, FileExtension }

}

export function minutesToSeconds(minutes, seconds) {
    return (minutes * 60) + seconds;
}

export function secondsToMinutes(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return { minutes, "seconds": remainingSeconds }
  }
