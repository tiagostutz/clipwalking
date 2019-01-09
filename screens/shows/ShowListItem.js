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
import { SwipeRow } from 'react-native-swipe-list-view'

import t from '../../locales'
import ShowListItemModel from './ShowListItemModel'
import { ICON_PREFIX } from '../../config/variables'
import { Colors } from '../../config/theme';
const CacheableImage = imageCacheHoc(Image);


export default class ShowListItem extends Component {

    constructor(props) {
        super(props)
        this.isRowOpened = false
    }

    componentWillMount() {
        attachModelToView(new ShowListItemModel(this.props), this)
    }


    onCardPress = () => {         
        if (!this.isRowOpened)  {
            this.viewModel.selectShow()
        } 
    }

    render() {

        if (!this.state.show) {
            return <View></View>
        }

        return this.state.show &&  (
            <SwipeRow
                onRowDidOpen={() => this.isRowOpened = true}
                onRowDidClose={() => this.isRowOpened = false}
                rightOpenValue={-75}
                previewOpenDelay={3000}
                disableRightSwipe={true}
                preview={false}
                directionalDistanceChangeThreshold={0}
                swipeToOpenPercent={20}
            >
                <View style={styles.rowBack}>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => this.viewModel.removeShow()}>
                        <Icon name={`${ICON_PREFIX}trash`} size={25} color="white" />
                        <RkText style={styles.backRightBtnLabel}>{t('delete')}</RkText>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <View style={{padding: 3, paddingBottom: 10}}>
                        <TouchableHighlight
                            delayPressIn={70}
                            activeOpacity={0.8}
                            onPress={this.onCardPress}
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
            </SwipeRow>
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 10,
        flex: 1
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0
    },
    backRightBtnLabel: {
        textAlign: "center", 
        margin:10, 
        marginTop: 0, 
        color: "white", 
        fontSize: 12
      },
  }));