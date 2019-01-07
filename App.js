import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FeedScreen from './screens/feed/FeedScreen'
import ShowsScreen from './screens/shows/ShowsScreen'
import WaitingScreen from './screens/waiting/WaitingScreen'
import ClipsScreen from './screens/clips/ClipsScreen';
import { bootstrap } from './config/bootstrap';

bootstrap();

const TabNavigator = createBottomTabNavigator({
  Feed: FeedScreen,
  Shows: ShowsScreen,
  Waiting: WaitingScreen,
  Clips: ClipsScreen,
},
{
  tabBarOptions: {
    activeTintColor: '#FF4141',
    inactiveTintColor: 'gray',
  }
})

export default createAppContainer(TabNavigator);