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

import { listScreenStyle } from '../../config/styles'

import EpisodeItem from '../../components/EpisodeItem'
import t from '../../locales'
import { ICON_PREFIX } from '../../config/variables'

import FeedScreenModel from './FeedScreenModel'
import SplashScreen from 'react-native-splash-screen'
export default class FeedScreen extends React.Component {

  static navigationOptions = {
    title: t('feed'),
    tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}radio`} color={tintColor} size={25}/>
  };

  componentWillMount() {
    attachModelToView(new FeedScreenModel(), this)
  }

  componentDidMount() {
    SplashScreen.hide()    
    setTimeout(()=>SplashScreen.hide(), 3000)
  }

  render = () => (
    <View style={listScreenStyle.screen}>
      <View style={listScreenStyle.content}>
        <RkText style={listScreenStyle.title} rkType='header0'>{t('feed')}</RkText>
        { this.state.feedData && this.state.feedData.length > 0 && 
          <FlatList
            data={this.state.feedData}
            renderItem={({ item }) => <EpisodeItem episode={item} displayShowName />}
            keyExtractor={(item) => `${item.id}`}
            style={listScreenStyle.listContainer}
          />
        } 
      </View>
      
    </View>
  )
}