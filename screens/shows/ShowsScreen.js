import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import SplashScreen from 'react-native-splash-screen'
import { attachModelToView } from 'rhelena'
import {
  RkText,
} from 'react-native-ui-kitten';
 
import ShowsScreenModel from './ShowsScreenModel'
import { listScreenStyle } from '../../config/styles'

import { ICON_PREFIX } from '../../config/variables'
import t from '../../locales'

export default class ShowsScreen extends React.Component {
  
  static navigationOptions = {
    title: t('shows'),
    tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}albums`} color={tintColor} size={25}/>
  };


  componentWillMount() {
    attachModelToView(new ShowsScreenModel(), this)
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

        <RkText style={listScreenStyle.title} rkType='header0'>{t('shows')}</RkText>
        { this.state.showsData && this.state.showsData.length > 0 && 
          <FlatList
            data={this.state.showsData}
            renderItem={({ item }) => <EpisodeItem episode={item} displayShowName disableAddLater />}
            keyExtractor={(item) => `${item.id}`}
            style={listScreenStyle.listContainer}
          />
        }
      </View>
      
      
    </View>
  )

}