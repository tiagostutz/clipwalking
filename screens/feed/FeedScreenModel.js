import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import feedData from '../../data/feed';
import topics from '../../config/topics'
import appStateStore from '../../data/appStateStore'
import t from '../../locales'

export default class FeedScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.feedData = []
        this.playerActive = globalState.playerOpened

        manuh.subscribe(topics.episodes.list.select.set, "FeedScreenModel", _ => {
            this.playerActive = true
        })

        manuh.subscribe(topics.shows.new.created.set, "FeedScreenModel", async ({value, showRSS}) => {
            if (value === 1) {
                manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('loading show feeds') })
                await feedData.loadShowFeedItems(showRSS) 
                manuh.publish(topics.loader.activity.status.set, { value: 0 })
            }
        })

        manuh.subscribe(topics.shows.selected.deleted.set, "FeedScreenModel", async ({value, showRSS}) => {
            if (value === 1) {
                manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('deleting show feeds') })
                await feedData.deleteShowFeedItems(showRSS) 
                manuh.publish(topics.loader.activity.status.set, { value: 0 })
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

        manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('loading') })
        appStateStore.getLastOpenedTrack(async state => {
            if (state) {
                this.playerActive = true
                manuh.publish(topics.loader.activity.status.set, { value: 0 })
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

    async updateFeed() {
        manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('loading feeds') })
        await feedData.getLastUpdate((result, err) => {
            if (err) {
                manuh.publish(topics.loader.activity.status.set, { value: 0 })
                return reportError(err)                
            }
            this.feedData = result
            manuh.publish(topics.loader.activity.status.set, { value: 0 })
        })

    }
}