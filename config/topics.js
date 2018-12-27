const charol = require('charol')
let topics = {
    episodes: {
        list: {
            select: {
                set: null
            }
        }
    },
    player: {
        actionBar: {
            play: {
                set: null
            }
        }
    }
}
topics = charol(topics)

module.exports = topics