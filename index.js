/** @format */
import React from 'react'
import {AppRegistry} from 'react-native';
import manuh from 'manuh'

import TrackPlayer, { STATE_PAUSED, STATE_STOPPED, STATE_BUFFERING, STATE_PLAYING } from 'react-native-track-player'

import App from './App';
import Player from './components/Player'
import {name as appName} from './app.json';
import topics from './config/topics'

import { View } from 'react-native'
import Loading from './components/Loading';

const Main = () => (
    <View style={{flex: 1}}>
        <App />
        <Player />
        <Loading />
    </View>
)

AppRegistry.registerComponent(appName, () => Main);

let bufferHandler = null
TrackPlayer.registerEventHandler(async event => {
    setTimeout(async() => { //put a bit of delay to prevent showing unecessary loading signals

        // stop/paused
        if (event.state === STATE_PAUSED || event.state === STATE_STOPPED) {
            clearInterval(bufferHandler)
            manuh.publish(topics.player.runtime.play.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )
            manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )

        // buffering
        }else if ((event.state === STATE_BUFFERING || event.state === STATE_PLAYING) && await TrackPlayer.getBufferedPosition() === 0) {
            manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 1} )    
            clearInterval(bufferHandler)
            bufferHandler = setInterval(async () =>  {
                if (await TrackPlayer.getState() === STATE_PLAYING && await TrackPlayer.getBufferedPosition() > 0) {
                    manuh.publish(topics.player.runtime.play.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 1} )
                    manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )
                    clearInterval(bufferHandler)
                }
            }, 500)        
            
        // playing
        }else if (event.state === STATE_PLAYING && await TrackPlayer.getBufferedPosition() > 0) {
            manuh.publish(topics.player.runtime.play.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 1} )
            manuh.publish(topics.player.runtime.buffer.set, { trackId: await TrackPlayer.getCurrentTrack(), value: 0} )
        }
        
    }, 150)
})