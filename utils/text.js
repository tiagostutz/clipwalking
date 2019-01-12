module.exports.formatDuration    = (seconds) => {
    var hours = Math.floor((seconds / 3600));
    var minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 ) {
        if (minutes > 0) {
            return `${hours}h${new String(minutes).padStart(2, '0')}min`
        }else{
            return `${hours}h`
        }
    }else{
        return `${minutes}min`
    }
}

module.exports.formatElapsed = (seconds) => {
    var hours = Math.floor((seconds / 3600));
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = Math.floor(seconds-minutes*60-hours*3600)
    if (hours > 0 ) {
        return `${new String(hours).padStart(2, '0')}:${new String(minutes).padStart(2, '0')}:${new String(remainingSeconds).padStart(2, '0')}`
    }else{
        return `${new String(minutes).padStart(2, '0')}:${new String(remainingSeconds).padStart(2, '0')}`
    }
}

module.exports.httpsURL = (url) => {
    if (url && !url.match("file:") && !url.match("https:")) {
        if (url.match("http:")) {
            return url.replace("http:", "https:")
        }else{
            return "https://"+url
        }
    }
    return url
}