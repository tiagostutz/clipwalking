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
import SplashScreen from 'react-native-splash-screen'

import { listScreenStyle } from '../../config/styles'

import EpisodeItem from '../../components/EpisodeItem'
import t from '../../locales'

import ClipsScreenModel from './ClipsScreenModel'


export default class ClipsScreen extends React.Component {

  static navigationOptions = {
    title: t('my clips'),
    tabBarIcon: ({tintColor}) => <Icon name="ios-cut" color={tintColor} size={25}/>
  };

  componentWillMount() {
    attachModelToView(new ClipsScreenModel(), this)
  }

  componentWillUnmount() {
    this.viewModel.clean()
  }


  componentDidMount() {
    SplashScreen.hide()    
    setTimeout(()=>SplashScreen.hide(), 3000)
  }


  render = () => (
    <View style={listScreenStyle.screen}>
      <View style={listScreenStyle.content}>
        <RkText style={listScreenStyle.title} rkType='header0'>{t('my clips')}</RkText>
        { this.state.clipsData && this.state.clipsData.length > 0 && 
          <FlatList
            data={this.state.clipsData}
            renderItem={({ item }) => <EpisodeItem episode={item} displayShowName />}
            keyExtractor={(item) => `${item.id}`}
            style={listScreenStyle.listContainer}
          />
        } 
      </View>
      
    </View>
  )
}