import React from "react";
import {createBottomTabNavigator} from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../Home";
import SearchScreen from "../Search";
import SettingsScreen from "../Settings";
import CompositionScreen from "../Composition";

const TabsStack = createBottomTabNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={22} />
        )
      }
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search" color={tintColor} size={22} />
        )
      }
    },
    Composition: {
      screen: CompositionScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-restaurant" color={tintColor} size={22} />
        )
      }
    },
    Profile: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-settings" color={tintColor} size={22} />
        )
      }
    }
},{
  tabBarOptions: {
    tabBarPosition: "bottom",
    activeTintColor: '#32C5CC',
    inactiveTintColor: 'grey',
    style: { borderTopWidth: 1, borderColor: "#f7f2f1" },
    labelStyle: { marginBottom: 5, fontSize: 10, }
  }
});

export default TabsStack;