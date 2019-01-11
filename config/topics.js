const charol = require('charol')
let topics = {
    episodes: {
        list: {
            select: {
                set: null
            },
            remove: {
                set: null
            },
            scrolling: {
                set: null
            }
        },
        swipe: {
            opening: {
                set: null
            },
            release: {
                set: null
            }
        },
    },
    shows: {
        list: {
            add: {
                set: null
            },
            select: {
                set: null
            },
            remove: {
                set: null
            },
            scrolling: {
                set: null
            }
        },
        swipe: {
            opening: {
                set: null
            },
            release: {
                set: null
            }
        },
        new: {
            created: {
                set: null
            }
        },
        selected: {
            deleted: {
                set: null
            }
        },
        episodes: {
            deleted: {
                set: null
            },
            loaded: {
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
            },
            seekTo: {
                set: null
            }
        }
    },
    loader: {
        activity: {
            status: {
                set: null
            }
        }
    }
}
topics = charol(topics)

module.exports = topics