import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import { ICON_PREFIX } from '../../config/variables'
import t from '../../locales'

export default class ShowsScreen extends React.Component {
  
  static navigationOptions = {
    title: t('shows'),
    tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}-albums`} color={tintColor} size={25}/>
  };

  render = () => (

    <View>
    </View>

  )

}