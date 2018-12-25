import rssParser from 'react-native-rss-parser';
 
const feedData = {
    load: (callback) => {
        fetch('https://www.npr.org/rss/podcast.php?id=510313')
        .then(response => response.text())
        .then(responseData => rssParser.parse(responseData))
        .then((rss, err) => {
            if (err) {
                return callback(null, err)
            }
            return callback(rss)
        });

    }
}

export default feedData