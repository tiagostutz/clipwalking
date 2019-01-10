import { RhelenaPresentationModel } from 'rhelena';
import feedData from '../../data/feed';
import manuh from 'manuh'
import topics from '../../config/topics'

export default class FeedScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.feedData = []
        feedData.getLastUpdate((result, err) => {
            if (err) {
                return console.error(err)                
            }
            this.feedData = result
        })

        manuh.subscribe(topics.shows.new.created.set, "FeedScreenModel", ({value, showRSS}) => {
            if (value === 1) {
                feedData.loadShowFeedItems(showRSS) 
            }
        })
    }
}