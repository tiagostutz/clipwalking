import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import {
    View,
    FlatList
  } from 'react-native';
  
  import {
    RkText,
  } from 'react-native-ui-kitten';
  

import ClipListItemModel from './ClipListItemModel'

export default class ClipListItem extends Component {

    componentWillMount() {
        attachModelToView(new ClipListItemModel(this.props), this)
    }

    render() {
        return (
            <View><RkText>Not yet implemented. Sorry... 🐒</RkText></View>
        )
    }
}