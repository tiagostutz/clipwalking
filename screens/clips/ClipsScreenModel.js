import { RhelenaPresentationModel } from 'rhelena';
import clipService from '../../data/clips'

export default class ClipsScreenModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.clipData = []
        clipService.getAll((result, err) => {
            console.log('+++=== CLIPS', JSON.stringify(result))
            
            if (err) {
                return console.error(err)                
            }
            this.clipData = result
        })
    }

    clean() {}
}