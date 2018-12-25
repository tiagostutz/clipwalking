module.exports.formatDuration    = (seconds) => {
    var hours = Math.floor((seconds / 3600));
    var minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 ) {
        if (minutes > 0) {
            return `${hours}h${minutes}min`
        }else{
            return `${hours}h`
        }
    }else{
        return `${minutes}min`
    }
}