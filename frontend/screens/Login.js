import React from "react";
import { TextInput,Text,StyleSheet,View,TouchableOpacity,KeyboardAvoidingView, Image, AsyncStorage, Platform, Linking  } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";
//import { NavigationNavigator } from 'react-navigation'
import { NavigationActions } from 'react-navigation';
import axios from "axios";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorUsername: "",
      errorPassword: ""
    };
    const { navigate } = this.props.navigation;
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL()
      .then(url => {
        const siteUrl = url.slice(0, 39);
        const token = url.slice(46)
        console.log("SiteUrl: ", siteUrl, "\nToken: ", token);

        if(siteUrl === "exp://192.168.1.197:19000/--/apppwreset"){
          this.props.navigation.navigate({ routeName: 'resetpassword', params: {token: token}});
        }
      });
    } else {
        Linking.addEventListener('url', this.handleOpenURL);
      }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }
  
  async _handleOpenURL(event) {
    try {
      const siteUrl = event.url.slice(0, 39);
      const token = event.url.slice(46)
      console.log("SiteUrl: ", siteUrl, "\nToken: ", token);

      if(siteUrl === "exp://192.168.1.197:19000/--/apppwreset"){
        this.props.navigation.navigate({ routeName: 'resetpassword', params: token});
      }
    } catch (error) {
      console.error(error);
    }
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  loginPress = () => {
    let _this = this;
    axios.post('http://62.75.141.240:9001/login', {
      username: this.state.username,
      password: this.state.password,
    })
    .then( (response) => {
      if (response.data.success === true){
        _this.saveItem('id_token', response.data.token)
        _this.props.navigation.navigate({routeName: 'hometabs'});
      } else {
        this.setState({
          errorUsername: response.data.errors.username,
          errorPassword: response.data.errors.password
        })
        console.log("errors:", response.data)
      }
    })
    .catch(error => 
      console.log(error),
    )
    .done();
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.LoginContainer} behavior="padding">
        <View style={styles.LogoContainer}>
          <Image
            style={{ width: 280, height: 84 }}
            source={ require("../assets/img/logo.png") }
          />
        </View>
        <View style={styles.FormLogin}>
          <TextInput style={styles.LoginTextInput}
            underlineColorAndroid="#33B6C0"
            placeholder="Email" keyboardType="email-address"
            autoCapitalize="none" autoCorrect={false}
            onChangeText={username => this.setState({ username })}
          />
          <View style={styles.errorView}>
            <Text style={styles.errorState}>
              {this.state.errorUsername}
            </Text>
          </View>
          <TextInput style={styles.LoginTextInput}
            underlineColorAndroid="#33B6C0"
            placeholder="Password" secureTextEntry
            autoCapitalize="none" autoCorrect={false}
            onChangeText={password => this.setState({ password })}
          />
          <View style={styles.errorView}>
            <Text style={styles.errorState}>
              {this.state.errorPassword}
            </Text>
          </View>
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.LoginButton} onPress={this.loginPress}>
              <Text style={{ color: "white" }}>
                Sign-in
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", marginTop: 30, marginBottom: 5 }}>
            <Text style={{ color: "#FFFFFF" }}>
              Don't you have an account?
            </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("singup")}>
              <Text style={{ marginLeft: 5, color: "#33B6C0" }}>
                Register!
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={ ()=> this.props.navigation.navigate({routeName: 'passwordrecovery'} )}>
            <Text style={styles.forgetPassword}>
              Forget your password?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  LoginContainer: {
    flex: 1,
    backgroundColor: "#191A1D",
  },
  LogoContainer:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  FormLogin: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  LoginTextInput: {
    width: "90%",
    height: 50,
    paddingLeft: 15,
    marginBottom: 15,
    color: "white"
  },
  forgetPassword: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 20,
    color: "#A2A2A2"
  },
  errorView:{
    width: "90%",
    paddingLeft: 15
  },
  errorState: {
    fontSize: 12,
    color: "red"
  },
  LoginButton: {
    width: "90%",
    height: 50,
    padding: 10,
    marginTop: 30,
    backgroundColor: "#283B47",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  }
});