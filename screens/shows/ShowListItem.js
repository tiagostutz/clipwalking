import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import {
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ImageBackground
  } from 'react-native';
import {
    RkText,
    RkCard, RkStyleSheet
  } from 'react-native-ui-kitten';

import Icon from 'react-native-vector-icons/Ionicons'
import imageCacheHoc from 'react-native-image-cache-hoc';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import manuh from 'manuh'
import topics from '../../config/topics'
import t from '../../locales'
import ShowListItemModel from './ShowListItemModel'
import { ICON_PREFIX } from '../../config/variables'
import { Colors } from '../../config/theme';
const CacheableImage = imageCacheHoc(Image);


export default class ShowListItem extends Component {

    constructor(props) {
        super(props)

        this.swipe = null
        manuh.subscribe(topics.shows.list.scrolling.set, this.props.show.id, ({value}) => {
            if (value === 1) {
                this.closeSwipe()
            }
        })
    }

    componentWillMount() {
        attachModelToView(new ShowListItemModel(this.props), this)
    }

    componentWillUnmount() {
        manuh.unsubscribe(topics.shows.list.scrolling.set, this.props.show.id)
    }

    onCardPress() {         
        if (!this.isRowOpened)  {
            this.viewModel.selectShow()
        } 
    }
    
    closeSwipe() {
        if (this.swipe) {
            this.swipe.close()
        }
    }

    render() {

        if (!this.state.show) {
            return <View></View>
        }

        const rightButtons = [
            <TouchableOpacity key={1} style={[styles.backButton, styles.backDeleteButton]} onPress={() => this.viewModel.removeShow()}>
                <View style={styles.innerButtonView}>
                    <Icon name={`${ICON_PREFIX}trash`} size={25} color="white" />
                    <RkText style={styles.backButtonLabel}>{t('delete')}</RkText>
                </View>
            </TouchableOpacity>
        ]

        const rightButtonsView = (
            <View style={{ width: 64*rightButtons.length, marginTop: 10, marginBottom: 10, flexDirection: 'row' }}>
                { rightButtons }
            </View>
        )
        return this.state.show &&  (
            <Swipeable renderRightActions={() => rightButtonsView} ref={ref => this.swipe = ref}>
                <View style={styles.card}>
                    <View style={{padding: 3, paddingBottom: 10}}>
                        <TouchableHighlight
                            delayPressIn={70}
                            activeOpacity={0.8}
                            onPress={() => this.onCardPress()}
                        >
                            <RkCard style={{borderWidth: 4, borderColor: Colors.background,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 1,
                                    height: 2,
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 4,
                            }}>
                                { this.state.show.imageURL && <CacheableImage rkCardImg source={{uri: this.state.show.imageURL.replace("http://","https://")}}  /> }
                                { !this.state.show.imageURL && 
                                    <View>
                                        <ImageBackground rkCardImg source={require('./cover.png')}>
                                            <RkText style={{padding: 5, color: "white", fontSize: 48}} numberOfLines={3}>{this.state.show.title}</RkText>
                                        </ImageBackground>
                                    </View>
                                 }
                            </RkCard>
                        </TouchableHighlight>
                    </View>
                </View>
            </Swipeable>
        )
    }
}

const styles = RkStyleSheet.create(theme => ({
    root: {
      backgroundColor: theme.colors.screen.base,
    },
    overlay: {
      justifyContent: 'flex-end',
    },
    footer: {
      width: "100%",
    },
    backButton: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    backButtonLabel: {
        color: "white", 
        fontSize: 12,
    },
    innerButtonView: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    backDeleteButton: {
        backgroundColor: 'red',        
    },
    innerButtonView: {
        width: 70, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
  }));