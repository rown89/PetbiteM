import React from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default class ResetForgottenPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: "",
      password: "",
      confirmPassword: "",
    };
  }

  async componentDidMount() {
    _this = this;
    console.log("token arrived to reset page:" ,this.props.navigation.state.params.token)
    try {
      await axios.get("http://62.75.141.240:9001/apppwreset?token=" + this.props.navigation.state.params.token, {
      })
      .then( response => {
        console.log(response)
        if (response.data.success === 200){
          this.setState({
            isLoading: false,
            username: response.data.username,
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
    } catch (e) {
      console.error(e);
    }
  }

  changePass = () => {
    axios.put("http://62.75.141.240:9001/changePassword", {
      username: this.state.username,
      password: this.state.password
    })
      .then(response => {
        console.log(response)
        if (response.data.success === 200 && response.data.message === "password reset link a-ok") {
          Alert.alert("Password changed correctly")
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.mainContainer}>
        <TextInput style={styles.LoginTextInput}
          underlineColorAndroid="#33B6C0"
          placeholder="New Password" keyboardType="visible-password"
          autoCapitalize="none" autoCorrect={false}
          onChangeText={password => this.setState({ password })}
        />
        <TextInput style={styles.LoginTextInput}
          underlineColorAndroid="#33B6C0"
          placeholder="Confirm Password" keyboardType="visible-password"
          autoCapitalize="none" autoCorrect={false}
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
        />
        <TouchableOpacity style={styles.LoginButton}
          onPress={() => this.changePass }>
          <Text style={{ color: "white" }}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: getStatusBarHeight(),
  },
  FormLogin: {
    flex: 1,
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center"
  },
  LoginTextInput: {
    width: "90%",
    height: 60,
    marginTop: 20,
    padding: 15,
    color: "black"
  },
  errorView: {
    flex: 1,
    paddingLeft: 10
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
