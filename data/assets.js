import RNFetchBlob from 'react-native-fetch-blob'
import PouchDB from 'pouchdb-react-native'
import { DB_AUDIO_FILE_PATH } from '../config/variables'

module.exports.storeAudio = async (url, callback) => {

    const downloadFile = (urlParam, callbackParam) => {        
        RNFetchBlob.config({
            fileCache : true,
            appendExt : 'mp3'
        })
        .fetch('GET', urlParam)
        .then(res => {          
            const filePath = "file://"+res.path()
            dbAudioFilePath.put({
                "_id": urlParam,
                "filePath": filePath
            })
            callbackParam(filePath)
        })
    }

    const dbAudioFilePath = new PouchDB(DB_AUDIO_FILE_PATH)
    try {
        const audio = await dbAudioFilePath.get(url)
        // console.log('+++=== FILE PATH',audio.filePath.replace("file://", ""));
        
        if(!await RNFetchBlob.fs.exists(audio.filePath.replace("file://", ""))) {
            await dbAudioFilePath.remove(audio)
            downloadFile(url, callback)
        }else{
            callback(audio.filePath)
        }
    } catch (error) {
        if (error.status === 404) {
            downloadFile(url, callback)
        }else{
            console.error(error)        
        }
    }
}
