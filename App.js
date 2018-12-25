import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FeedScreen from './screens/FeedScreen'
import LibraryScreen from './screens/LibraryScreen'
import { bootstrap } from './config/bootstrap';

bootstrap();

const TabNavigator = createBottomTabNavigator({
  Feed: FeedScreen,
  Library: LibraryScreen,
},
{
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  }
})

export default createAppContainer(TabNavigator);