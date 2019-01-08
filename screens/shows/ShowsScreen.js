import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  AlertIOS,
  FlatList,
  Clipboard
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import SplashScreen from 'react-native-splash-screen'
import { attachModelToView } from 'rhelena'
import {
  RkText
} from 'react-native-ui-kitten';
 
import ShowsScreenModel from './ShowsScreenModel'
import { listScreenStyle } from '../../config/styles'

import { ICON_PREFIX } from '../../config/variables'
import t from '../../locales'
import { Colors } from '../../config/theme';
import ShowListItem from './ShowListItem';

export default class ShowsScreen extends React.Component {
  

  constructor() {
    super()
  }

  static navigationOptions = {
    title: t('shows'),
    tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}albums`} color={tintColor} size={25}/>
  }

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

  handleAddPress = async() => {

    const promptForInput = () => {
      AlertIOS.prompt(t('add a show'), t('paste the podcast RSS URL'), showURL => this.viewModel.addNewShow(showURL))
    }

    const clipboardText = await Clipboard.getString()
    if (clipboardText.match(/[rss|feed]/g)) {
      AlertIOS.alert(t('add a show'), `${t('add')} ${clipboardText}?`,[
        {
          text: 'No',
          onPress: () => promptForInput(),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.viewModel.addNewShow(clipboardText),
        },
      ])  
    }else{
      promptForInput()
    }
  } 

  render = () => (
    <View style={listScreenStyle.screen}>
      <View style={listScreenStyle.content}>
        <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
          <TouchableWithoutFeedback style={{width: 36, flexDirection: "row", justifyContent: "center", alignItems:"center", height: 30}} 
            onPress={this.handleAddPress}>
            <Icon name={`${ICON_PREFIX}add`} color={Colors.primary} size={36}/>
          </TouchableWithoutFeedback>
        </View>
        <RkText style={listScreenStyle.title} rkType='header0'>{t('shows')}</RkText>
        { this.state.shows && this.state.shows.length > 0 && 
          <FlatList
            data={this.state.shows}
            renderItem={({ item }) => <ShowListItem show={item} />}
            keyExtractor={(item) => `${item.id}`}
            style={listScreenStyle.listContainer}
          />
        }
      </View>
      
      
    </View>
  )

}