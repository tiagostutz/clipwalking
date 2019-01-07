import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import {
    View,
    TouchableOpacity,
    Image
  } from 'react-native';
import {
    RkText,
    RkCard, RkStyleSheet
  } from 'react-native-ui-kitten';

import ShowListItemModel from './ShowListItemModel'

import imageCacheHoc from 'react-native-image-cache-hoc';
import t from '../../locales';
import { Colors } from '../../config/theme';
const CacheableImage = imageCacheHoc(Image);


const moment = require('moment');


export default class ShowListItem extends Component {

    componentWillMount() {
        attachModelToView(new ShowListItemModel(), this)
    }

    render() {
        return (
            <TouchableOpacity
                delayPressIn={70}
                activeOpacity={0.8}
                onPress={() => this.onItemPressed(this.props.show)}
            >
                <View style={{borderWidth: 4, margin: 3, borderColor: Colors.background,
shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,

elevation: 5,
                    }}>
                    <RkCard>
                        <CacheableImage rkCardImg source={{uri:this.props.show.imageURL}}  />
                    </RkCard>
                </View>
            </TouchableOpacity>
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
  }));