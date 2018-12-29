/** @format */

import {AppRegistry} from 'react-native';
import manuh from 'manuh'
import TrackPlayer, { STATE_PAUSED, STATE_STOPPED, STATE_BUFFERING, STATE_PLAYING } from 'react-native-track-player'

import App from './App';
import {name as appName} from './app.json';
import topics from './config/topics'

AppRegistry.registerComponent(appName, () => App);

let bufferHandler = null
TrackPlayer.registerEventHandler(async event => {
    // stop/paused
    if (event.state === STATE_PAUSED || event.state === STATE_STOPPED) {
        clearInterval(bufferHandler)
        manuh.publish(topics.player.runtime.play.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )
        manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )

    // buffering
    }else if (event.state === STATE_BUFFERING && await TrackPlayer.getBufferedPosition() === 0) {
        manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 1} )    
        clearInterval(bufferHandler)
        bufferHandler = setInterval(async () =>  {
            if (await TrackPlayer.getState() === STATE_PLAYING && await TrackPlayer.getBufferedPosition() > 0) {
                manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )
                manuh.publish(topics.player.runtime.play.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 1} )
                clearInterval(bufferHandler)
            }
        }, 1000)        
        
    // playing
    }else if (event.state === STATE_PLAYING && await TrackPlayer.getBufferedPosition() > 0) {
        manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )
        manuh.publish(topics.player.runtime.play.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 1} )
    }
})