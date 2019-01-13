import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FeedScreen from './screens/feed/FeedScreen'
import ShowsScreen from './screens/shows/ShowsScreen'
import WaitingScreen from './screens/waiting/WaitingScreen'
import ClipsScreen from './screens/clips/ClipsScreen';
import { bootstrap } from './config/bootstrap';
import { Colors } from './config/theme'
import appStateStore from './data/appStateStore'

bootstrap();
appStateStore.startSync()

const TabNavigator = createBottomTabNavigator({
  Feed: FeedScreen,
  Shows: ShowsScreen,
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