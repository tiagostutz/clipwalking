import { globalState } from 'rhelena'
import RNFetchBlob from 'react-native-fetch-blob'
import PouchDB from 'pouchdb-react-native'

import manuh from 'manuh'
import topics from '../config/topics'
import { reportError } from '../utils/reporter'

import { DB_AUDIO_FILE_PATH } from '../config/variables'
import t from '../locales';
import { httpsURL } from '../utils/text'

module.exports.storeAudio = async (url, callback) => {
    const urlNormalized = httpsURL(url)

    const downloadFile = (urlParam, callbackParam) => {                          

        const urlDownload = httpsURL(urlParam)

        manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('downloading episode') })

        globalState["fetchProm"] = RNFetchBlob.config({
            fileCache : true,
            appendExt : 'mp3'
        }).fetch('GET', urlDownload)

        globalState["fetchProm"].progress({ interval : 100 }, (received, total) => {
            manuh.publish(topics.loader.activity.status.set, { value: 1, cancelHandler: "fetchProm", text: t('downloading episode') + " \n " +Math.floor(received/total*100) + '%'})
        }).then(res => {          
            const originalPath = res.path()
            const audioPath = "file://"+originalPath
            dbAudioFilePath.put({
                "_id": urlDownload,
                "audioPath": audioPath,
                "originalPath": originalPath
            })

            manuh.publish(topics.loader.activity.status.set, { value: 0 })
            callbackParam({audioPath, originalPath})
        }).catch(err =>  {
            manuh.publish(topics.loader.activity.status.set, { value: 0 })            
            if (err && err.toString && err.toString().indexOf("cancelled") == -1) {
                reportError("[dbAudioFilePath][put]:: " + err)
            }
            callbackParam(null, err)
        })
    }
    
    // ** TEST PORPUSE ONLY
    // await new PouchDB(DB_AUDIO_FILE_PATH).destroy()
    // -- ** TEST PORPUSE ONLY

    const dbAudioFilePath = new PouchDB(DB_AUDIO_FILE_PATH)    

    try {
        
        const audio = await dbAudioFilePath.get(urlNormalized)
        
        if(!await RNFetchBlob.fs.exists(audio.originalPath)) {
            await dbAudioFilePath.remove(audio)
            return downloadFile(urlNormalized, callback)
        }else{
            callback(audio)
        }
    } catch (error) {
        if (error.toString().indexOf("cancelled") !== -1) {
            return
        }
        if (error.status === 404) {
            return downloadFile(urlNormalized, callback)
        }else{
            reportError("[assets][storeAudio]:: " + error)        
        }
    }
}


module.exports.getAudioFileByTrackURL = async (url) => {
    const urlNormalized = httpsURL(url)
    const dbAudioFilePath = new PouchDB(DB_AUDIO_FILE_PATH)    

    try {        
        const audio = await dbAudioFilePath.get(urlNormalized)
        
        if(!await RNFetchBlob.fs.exists(audio.originalPath)) {
            return null
        }else{
            return audio
        }
    } catch (error) {
        if (error.status === 404) {
            return null
        }else{
            reportError("[assets][storeAudio]:: " + error)        
        }
    }
}