import React from "react";
import { AsyncStorage } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";
import { NavigationActions } from 'react-navigation';
import LoginScreen from "../Login";
import SingupScreen from "../Singup";
import TabsStack from "../navRoutes/tabs.routes";
import ProductsScreen from "../ProductsList";
import ProductDetailScreen from "../ProductDetail";
import ProductsSelectedCompositionScreen from "../ProductsCompositionList";
import ProductsMostUsedScreen from "../ProductsMostUsedList";
import ForgotPasswordScreen from "../ForgetPassword";
import ResetForgottenPasswordScreen from "../ResetForgottenPassword";
import ChangePasswordScreen from "../ChangePassword";

const HomeStack = createStackNavigator({
    login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    singup: {
      screen: SingupScreen,
      navigationOptions: {
        title: "Register an account",
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
    passwordrecovery: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        title: "Forgotten Password",
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
    resetpassword: {
      screen: ResetForgottenPasswordScreen,
      navigationOptions: {
        title: "Reset forgotten Password",
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
    changepassword: {
      screen: ChangePasswordScreen,
      navigationOptions: {
        title: "Change Password",
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
    hometabs: {
      screen: TabsStack,
        navigationOptions: {
          header: null
        }
    },
    products: {
      screen: ProductsScreen,
      navigationOptions: {
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
    productdetail: {
      screen: ProductDetailScreen,
      navigationOptions: {
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
    productscompositionlist: {
      screen: ProductsSelectedCompositionScreen,
      navigationOptions: {
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
    productsmostusedlist: {
      screen: ProductsMostUsedScreen,
      navigationOptions: {
        headerTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: "#191A1D"
        }
      }
    },
  },{
    headerMode: 'screen',
    animationEnabled: true,
  });

export default HomeStack;
