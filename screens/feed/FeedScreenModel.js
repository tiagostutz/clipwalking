import { RhelenaPresentationModel, globalState } from 'rhelena';
import feedData from '../../data/feed';
import manuh from 'manuh'
import topics from '../../config/topics'

export default class FeedScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.feedData = []
        this.playerActive = globalState.playerOpened

        manuh.subscribe(topics.episodes.list.select.set, "FeedScreenModel", _ => {
            this.playerActive = true
        })

        manuh.subscribe(topics.shows.new.created.set, "FeedScreenModel", ({value, showRSS}) => {
            if (value === 1) {
                feedData.loadShowFeedItems(showRSS) 
            }
        })

        manuh.subscribe(topics.shows.selected.deleted.set, "FeedScreenModel", ({value, showRSS}) => {
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

    clean() {
        manuh.unsubscribe(topics.episodes.list.select.set, "FeedScreenModel")
        manuh.unsubscribe(topics.shows.new.created.set, "FeedScreenModel")
        manuh.unsubscribe(topics.shows.selected.deleted.set, "FeedScreenModel")
        manuh.unsubscribe(topics.shows.episodes.deleted.set, "FeedScreenModel")
        manuh.unsubscribe(topics.shows.episodes.loaded.set, "FeedScreenModel")
    }

    updateFeed() {
        feedData.getLastUpdate((result, err) => {
            if (err) {
                return reportError(err)                
            }
            this.feedData = result
        })

    }
}