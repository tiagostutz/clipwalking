import { RhelenaPresentationModel } from 'rhelena';
import feedData from '../../data/feed';
import manuh from 'manuh'
import topics from '../../config/topics'

export default class FeedScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.feedData = []

        manuh.subscribe(topics.shows.new.created.set, "FeedScreenModel", ({value, showRSS}) => {
            if (value === 1) {
                feedData.loadShowFeedItems(showRSS) 
            }
        })

        manuh.subscribe(topics.shows.selected.deleted.set, "FeedScreenModel", ({value, showRSS}) => {
            console.log('++...',topics.shows.selected.deleted.set);
            
            if (value === 1) {
                feedData.deleteShowFeedItems(showRSS) 
            }
        })

        manuh.subscribe(topics.shows.episodes.deleted.set, "FeedScreenModel", ({value, showRSS}) => {
            if (value === 1) {
                this.updateFeed()
            }
        })

        manuh.subscribe(topics.shows.episodes.loaded.set, "FeedScreenModel", ({value, showRSS}) => {
            if (value === 1) {
                this.updateFeed()
            }
        })

        this.updateFeed();
    }

    updateFeed() {
        feedData.getLastUpdate((result, err) => {
            if (err) {
                return console.error(err)                
            }
            this.feedData = result
        })

    }
}