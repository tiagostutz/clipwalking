import { RhelenaPresentationModel } from 'rhelena';
import feedService from '../../data/feed';

export default class FeedScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.feedData = []
        feedService.load((result, err) => {
            if (err) {
                return console.error("Erro ao recuperar... panic!");                
            }
            this.feedData = result.items.map(item => {
                let durationSeconds = item.itunes.duration
                if (item.itunes.duration.match(":")) {
                    // handle different duration types
                    let durationArr = item.itunes.duration.split(":")
                    durationSeconds = 0
                    if (durationArr.length == 3) {
                        durationSeconds += parseInt(durationArr[2])
                        durationSeconds += parseInt(durationArr[1])*60
                        durationSeconds += parseInt(durationArr[0])*3600
                    }
                    if (durationArr.length == 2) {
                        durationSeconds += parseInt(durationArr[1])
                        durationSeconds += parseInt(durationArr[0])*60
                    }
                }
                
                item.image = item.itunes.image
                item.duration = durationSeconds
                item.description = item.description.replace(/<[^>]+>/g, '')
                item.showName = result.title
                return item
            })
        })
    }
}