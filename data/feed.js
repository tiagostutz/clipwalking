import rssParser from 'react-native-rss-parser';
 
const feedData = {
    fetch: (callback) => {
        fetch('https://www.npr.org/rss/podcast.php?id=510313')
        .then(response => response.text())
        .then(responseData => rssParser.parse(responseData))
        .then((rss, err) => {
            if (err) {
                return callback(null, err)
            }
            const normalizedResult = rss.items.map(item => {
                let durationSeconds = item.itunes.duration
                if (item.itunes.duration.match(":")) {
                    // handle different duration types
                    let durationArr = item.itunes.duration.split(":")
                    durationSeconds = 0
                    if (durationArr.length == 3) {
                        durationSeconds += parseInt(durationArr[2])
                        durationSeconds += parseInt(durationArr[1])*60
                        durationSeconds += parseInt(durationArr[0])*3600
                    }
                    if (durationArr.length == 2) {
                        durationSeconds += parseInt(durationArr[1])
                        durationSeconds += parseInt(durationArr[0])*60
                    }
                }
                
                item.image = item.itunes.image
                item.author = item.itunes.authors.map(a => a.name).join(' ')
                item.url = item.enclosures[0].url
                item.mimeType = item.enclosures[0].mimeType
                item.duration = durationSeconds
                item.description = item.description.replace(/<[^>]+>/g, '')
                item.showName = rss.title
                
                return item
            })
            return callback(normalizedResult)
        });

    }
}

export default feedData