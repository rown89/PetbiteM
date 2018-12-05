import React from "react";
import { StyleSheet, View, StatusBar} from "react-native";
import { Font } from 'expo';
import HomeStack from "./frontend/screens/navRoutes/HomeStack";

export default class App extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    Font.loadAsync({
      'googlesans-regular': require('./frontend/assets/fonts/GoogleSans-Regular.ttf'),
      'googlesans-bold': require('./frontend/assets/fonts/GoogleSans-Bold.ttf'),
      'googlesans-bolditalic': require('./frontend/assets/fonts/GoogleSans-BoldItalic.ttf'),
      'googlesans-medium': require('./frontend/assets/fonts/GoogleSans-Medium.ttf'),
      'googlesans-mediumitalic': require('./frontend/assets/fonts/GoogleSans-MediumItalic.ttf'),
      'googlesans-italic': require('./frontend/assets/fonts/GoogleSans-Italic.ttf'),
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#33B6C0" barStyle="light-content" hidden={false} />
        <HomeStack />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //fontFamily: "Google Sans"
  }
});
