import React from 'react'
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import FeedScreen from './screens/feed/FeedScreen'
import WaitingScreen from './screens/waiting/WaitingScreen'
import ClipsScreen from './screens/clips/ClipsScreen';
import { bootstrap } from './config/bootstrap';
import { Colors } from './config/theme'
import appStateStore from './data/appStateStore'
import ShowEpisodes from './screens/shows/ShowEpisodes';
import ShowsScreen from './screens/shows/ShowsScreen';

import Icon from 'react-native-vector-icons/Ionicons'
import { ICON_PREFIX } from './config/variables'
import t from './locales'



bootstrap();
appStateStore.startSync()

const TabNavigator = createBottomTabNavigator({
  Feed: FeedScreen,
  Shows: createStackNavigator(
      {
        ShowsScreen: ShowsScreen,
        ShowEpisodes: ShowEpisodes,
      },
      {
        initialRouteName: "ShowsScreen",
        navigationOptions: {
          title: t('shows'),
          tabBarIcon: ({tintColor}) => <Icon name={`${ICON_PREFIX}albums`} color={tintColor} size={25}/>
        },
      }
  ),
  Waiting: WaitingScreen,
  Clips: ClipsScreen,
},
{
  tabBarOptions: {
    activeTintColor: Colors.primary,
    inactiveTintColor: Colors.inactive,
  }
})

export default createAppContainer(TabNavigator);