import RNFetchBlob from 'react-native-fetch-blob'
import PouchDB from 'pouchdb-react-native'
import { DB_AUDIO_FILE_PATH } from '../config/variables'

module.exports.storeAudio = async (url, callback) => {
    const dbAudioFilePath = new PouchDB(DB_AUDIO_FILE_PATH)
    try {
        const audio = await dbAudioFilePath.get(url)
        callback(audio.filePath)
    } catch (error) {
        if (error.status === 404) {
            RNFetchBlob.config({
                fileCache : true,
                appendExt : 'mp3'
            })
            .fetch('GET', url)
            .then(res => {          
                const filePath = "file://"+res.path()
                dbAudioFilePath.put({
                    "_id": url,
                    "filePath": filePath
                })
                callback(filePath)
            })
        }else{
            console.error(error)        
        }
    }
}
