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
import ClipListItem from './ClipListItem'

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
        <View><RkText>Not yet implemented. Sorry... 🐒</RkText></View>
        { false && this.state.clipData && this.state.clipData.length > 0 && 
          <FlatList
            data={this.state.clipData}
            renderItem={({ item }) => <ClipListItem key={item._id} trackInfo={item.trackInfo} filePath={item.filePath} />}
            keyExtractor={(item) => `${item.id}`}
            style={listScreenStyle.listContainer}
          />
        } 
      </View>
      
    </View>
  )
}