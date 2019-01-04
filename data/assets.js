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
            const originalPath = res.path()
            const audioPath = "file://"+originalPath
            dbAudioFilePath.put({
                "_id": urlParam,
                "audioPath": audioPath,
                "originalPath": originalPath
            })
            callbackParam({audioPath, originalPath})
        })
    }
    
    // ** TEST PORPUSE ONLY
    // await new PouchDB(DB_AUDIO_FILE_PATH).destroy()
    // -- ** TEST PORPUSE ONLY

    const dbAudioFilePath = new PouchDB(DB_AUDIO_FILE_PATH)    

    try {
        const audio = await dbAudioFilePath.get(url)
        console.log('+++=== FILE PATH',audio.originalPath);
        
        if(!await RNFetchBlob.fs.exists(audio.originalPath)) {
            await dbAudioFilePath.remove(audio)
            downloadFile(url, callback)
        }else{
            callback(audio)
        }
    } catch (error) {
        if (error.status === 404) {
            downloadFile(url, callback)
        }else{
            console.error(error)        
        }
    }
}
