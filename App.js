import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FeedScreen from './screens/feed/FeedScreen'
import ShowsScreen from './screens/shows/ShowsScreen'
import { bootstrap } from './config/bootstrap';

bootstrap();

const TabNavigator = createBottomTabNavigator({
  Feed: FeedScreen,
  Shows: ShowsScreen,
},
{
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  }
})

export default createAppContainer(TabNavigator);