import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FeedScreen from './screens/FeedScreen'
import LibraryScreen from './screens/LibraryScreen'


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