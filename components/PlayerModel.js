import { RhelenaPresentationModel } from 'rhelena';
import TrackPlayer from 'react-native-track-player';
import PouchDB from 'pouchdb-react-native'
import manuh from 'manuh'

import topics from '../config/topics'
import { DB_TRACK_POSITION } from '../config/variables'

export default class PlayerModel extends RhelenaPresentationModel {
    constructor() {
        super();

        this.currenTrackInfo = null
        this.playerReady = false
        
        // Initialize the player
        TrackPlayer.setupPlayer({playBuffer: 60}).then(async () => {
            this.playerReady = true
        });

        // listen for current track changed event
        manuh.subscribe(topics.tracks.play, "PlayModel", msg => {
            this.currenTrackInfo = msg.track
            const trackToPlay = {
                "id": msg.track.id,
                "url": msg.track.url,
                "title": msg.track.title,
                "artist": msg.track.author ? msg.track.author : "Unknown artist",
                "album": msg.track.showName,
                "artwork": msg.track.image,
                "description": msg.track.description
            }
            console.log('--->>', JSON.stringify(trackToPlay))
            
            this.play([trackToPlay])
        })
    }

    async play(trackList) {
        
        if (!this.playerReady) {
            console.error("The player is not ready yet and hence cannot be used")            
            return
        }
        if (!trackList && !TrackPlayer.getCurrentTrack()) {
            console.error("The `trackList` param cannot be empty. Please spicify a track to be played.")            
            return
        }

        const dbTrackPosition = new PouchDB(DB_TRACK_POSITION)
        
        if (trackList && TrackPlayer.getCurrentTrack() !== trackList[0].id) { //if changed the track being played

            // clear TrackPlayer queue
            TrackPlayer.reset()
            // Adds tracks to the queue
            await TrackPlayer.add(trackList)

            dbTrackPosition.get(trackList[0].id).then(doc => {
                // Starts playing it from the last position
                TrackPlayer.seekTo(doc.position)
                TrackPlayer.play()

            }).catch(err => {
                if (err.status === 404) { //if it is the first time this track is played
                    dbTrackPosition.put({
                        "_id": trackList[0].id,
                        "position": 0
                    })
                    TrackPlayer.play()
                }else{
                    console.error(err);                    
                }
            })

        }else{ //resume an "online play/pause"
            TrackPlayer.play()
        }        

    }

    pause() {
        dbTrackPosition.put({
            "_id": TrackPlayer.getCurrentTrack(),
            "position": TrackPlayer.getPosition()
        })
        TrackPlayer.pause()
    }

    async fastForwardByAmount(amount=15) {
        this.seekTo(await TrackPlayer.getPosition()+amount)
    }
    async fastBackwardByAmount(amount=15) {
        this.seekTo(await TrackPlayer.getPosition()-amount)
    }




    // NOT YET USED

    next() {
        dbTrackPosition.put({
            "_id": TrackPlayer.getCurrentTrack(),
            "position": TrackPlayer.getPosition()
        })
        TrackPlayer.skipToNext()
    }
    previous() {
        dbTrackPosition.put({
            "_id": TrackPlayer.getCurrentTrack(),
            "position": TrackPlayer.getPosition()
        })
        TrackPlayer.skipToPrevious()
    }
    reset() {
        dbTrackPosition.put({
            "_id": TrackPlayer.getCurrentTrack(),
            "position": TrackPlayer.getPosition()
        })
        TrackPlayer.reset()
    }

    seekTo(position) {
        TrackPlayer.seekTo(position)
    }
}