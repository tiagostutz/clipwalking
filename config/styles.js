import {
    RkStyleSheet
} from 'react-native-ui-kitten';
import { ifIphoneX } from 'react-native-iphone-x-helper'

module.exports.listScreenStyle = RkStyleSheet.create(theme => ({
    screen: {
        marginTop: 40,
        height: "100%",
        flexDirection: "column",
        ...ifIphoneX({
            paddingBottom: 50
        },{
            paddingBottom: 0
        })
    },
    content: {
        paddingHorizontal: 14,
    },
    listContainer: {
        backgroundColor: theme.colors.screen.scroll,
        marginBottom: 100
    },
    title: {
        marginBottom: 12,
        marginTop: 8,
    }
}))

module.exports.playerStyles = { 
    floating: RkStyleSheet.create(theme => ({

        container: {
            position: 'absolute', 
            height: 55, 
            width: "100%",
            alignItems: 'flex-start', 
            justifyContent: 'flex-start', 
            left: 0, 
            backgroundColor: '#F7F7F7', 
            elevation: 8,
            ...ifIphoneX({
                bottom: 83
            },{
                bottom: 49
            })
        },
        body: {
            flex: 1, 
            paddingHorizontal: 14,
            flexDirection: "row", 
            width: "100%", 
            alignItems: "center", 
            justifyContent: "space-between"
        },
        trackInfo: {
            flex: .8, 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center"
        }
    })),
    maximized: RkStyleSheet.create(theme => ({
        container: {
            position: 'absolute', 
            height: "100%", 
            width: "100%",
            alignItems: 'flex-start', 
            justifyContent: 'flex-start', 
            left: 0, 
            backgroundColor: '#F7F7F7', 
            elevation: 8,
            ...ifIphoneX({
                bottom: 0
            },{
                bottom: 0
            })
        },
        body: {
            flex: 1, 
            paddingHorizontal: 14,
            paddingVertical: 30,
            flexDirection: "column", 
            width: "100%", 
            alignItems: "center", 
            justifyContent: "space-between"
        },
        cover: {
            height: 240,
            width: 420,
            flex: -1
        },
        trackInfo: {
            flex: .8, 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center",
        },
         secondaryActionButton: {
             flexDirection: "column", 
             justifyContent: "center", 
             alignItems:"center"
        }
    }))
}