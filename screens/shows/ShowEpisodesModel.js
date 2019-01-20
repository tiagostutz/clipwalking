import { RhelenaPresentationModel, globalState } from 'rhelena';
import feedData from '../../data/feed'

export default class ShowEpisodesModel extends RhelenaPresentationModel {
    constructor() {
        super();

        this.show = globalState.currenShow
        this.episodes = []
        this.loading = false
        feedData.getAllItensByShow(this.show, showFeedList => {
            this.episodes = showFeedList    
            this.loading = false
        })
        setTimeout(() => !this.episodesLoaded && (this.loading = true), 500)
        
    }

}