import React from 'react'
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'
import Icon from 'react-native-vector-icons/Ionicons'
import manuh from 'manuh'

import FeedScreen from './screens/feed/FeedScreen'
import WaitingScreen from './screens/waiting/WaitingScreen'
import ClipsScreen from './screens/clips/ClipsScreen';
import { bootstrap } from './config/bootstrap';
import { Colors } from './config/theme'
import appStateStore from './data/appStateStore'
import feedData from './data/feed'
import ShowEpisodes from './screens/shows/ShowEpisodes';
import ShowsScreen from './screens/shows/ShowsScreen';
import topics from './config/topics'
import { ICON_PREFIX } from './config/variables'
import t from './locales'


manuh.publish(topics.loader.activity.status.set, { value: 1, text: t('loading')})

const totalModulesToLoad = 2
let readyModules = 0
manuh.subscribe(topics.bootstrap.app.ready.set, "App", ({value}) => {
  readyModules += value
  if (readyModules >= totalModulesToLoad) {
    SplashScreen.hide()
    manuh.publish(topics.loader.activity.status.set, { value: 0 })
  }
})

setTimeout(_ => { 
  SplashScreen.hide()
  manuh.publish(topics.loader.activity.status.set, { value: 0 })
}, 10000)

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