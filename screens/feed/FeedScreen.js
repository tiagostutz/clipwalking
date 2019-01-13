import React from 'react';

import {
  View,
  FlatList
} from 'react-native';

import {
  RkText,
} from 'react-native-ui-kitten';
 
import Icon from 'react-native-vector-icons/Ionicons'
import { attachModelToView } from 'rhelena'
import manuh from 'manuh'
import topics from '../../config/topics'

import { listScreenStyle } from '../../config/styles'

import EpisodeItem from '../../components/EpisodeItem'
import t from '../../locales'
import { ICON_PREFIX } from '../../config/variables'

import FeedScreenModel from './FeedScreenModel'
export default class FeedScreen extends React.Component {

  constructor() {
    super()
  }

  onScroll() {
    manuh.publish(topics.episodes.list.scrolling.set, { value: 1 })
  }

  static navigationOptions = {
    title: t('feed'),
    tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}radio`} color={tintColor} size={25}/>
  };

  componentWillMount() {
    attachModelToView(new FeedScreenModel(), this)
  }

  componentWillUnmount() {
    this.viewModel.clean()
  }

  render() {
    let styleCompiled = [listScreenStyle.listContainer]
    if (this.state.playerActive) {
      styleCompiled.push(listScreenStyle.listContainerFloatPlayerVisible)
    }
    
    return (
      <View style={listScreenStyle.screen}>
        <View style={listScreenStyle.content}>
          <RkText style={listScreenStyle.title} rkType='header0'>{t('feed')}</RkText>
          { this.state.feedData && this.state.feedData.length > 0 && 
            <FlatList
              onScrollBeginDrag={() => this.onScroll()}
              initialNumToRender={10}
              data={this.state.feedData}
              renderItem={({ item }) => <EpisodeItem episode={item} displayShowName />}
              keyExtractor={(item) => `${item.id}`}
              style={styleCompiled}
            />
          } 
        </View>
        
      </View>
    )
  }
}