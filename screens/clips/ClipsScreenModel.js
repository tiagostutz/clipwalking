import { RhelenaPresentationModel } from 'rhelena';
import clipService from '../../data/clips'

export default class ClipsScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.clipData = []
        clipService.getAll((result, err) => {
            if (err) {
                return reportError(err)                
            }
            this.clipData = result
        })
    }

    clean() {}
}