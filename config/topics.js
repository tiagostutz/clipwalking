const charol = require('charol')
let topics = {
    episodes: {
        list: {
            select: {
                set: null
            },
            remove: {
                set: null
            }
        }
    },
    waiting: {
        list: {
            add: {
                set: null
            }
        }
    },
    player: {
        runtime: {
            buffer: {
                set: null
            },
            play: {
                set: null
            }
        }
    }
}
topics = charol(topics)

module.exports = topics