import {
    RkStyleSheet
} from 'react-native-ui-kitten';

module.exports.listScreenStyle = RkStyleSheet.create(theme => ({
    screen: {
        marginTop: 40,
        marginBottom: 120,
        height: "100%",
        flexDirection: "column"
    },
    content: {
        paddingHorizontal: 14,
    },
    listContainer: {
        backgroundColor: theme.colors.screen.scroll,
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
            height: 45, 
            width: "100%",
            alignItems: 'flex-start', 
            justifyContent: 'flex-start', 
            left: 0, 
            bottom: 40, 
            backgroundColor: '#F7F7F7', 
            elevation: 8,
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
    }))
}