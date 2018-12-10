import React from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";
import _ from "lodash";

export default class ResetForgottenPasswordScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: true,
      token: "",
      username: "",
      password: "",
      confirmPassword: "",
    };
  }

  async componentDidMount () {
    _this = this;
    console.log("token arrived to reset page:", this.props.navigation.state.params.token);
    try {
      await axios.get("http://62.75.141.240:9001/apppwreset?token=" + this.props.navigation.state.params.token, {
      })
        .then((response) => {
          if (response.data.success === true) {
            this.setState({
              isLoading: false,
              username: response.data.username,
              token: this.props.navigation.state.params.token
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
    }
  }

  changePass = () => {
    axios.put("http://62.75.141.240:9001/apppwchange", {
      username: this.state.username,
      password: this.state.password,
      password2: this.state.confirmPassword,
      token: this.state.token
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.success === true) {
          Alert.alert(
            'Reset Done',
            "Password changed correctly",
            [
              { text: 'OK', onPress: () => this.props.navigation.navigate('login') }
            ],
            { cancelable: false }
          )
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render () {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.mainContainer}>
        <View style={styles.FormLogin}>
          <TextInput style={styles.LoginTextInput}
            underlineColorAndroid="#33B6C0"
            placeholder="New Password" keyboardType="visible-password"
            autoCapitalize="none" autoCorrect={false}
            onChangeText={(password) => this.setState({ password })}
          />
          <TextInput style={styles.LoginTextInput}
            underlineColorAndroid="#33B6C0"
            placeholder="Confirm Password" keyboardType="visible-password"
            autoCapitalize="none" autoCorrect={false}
            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
          />
          <TouchableOpacity style={styles.LoginButton}
            onPress={() => this.changePass() }>
            <Text style={{ color: "white" }}>
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: "#FFFFFF"
  },
  FormLogin: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  LoginTextInput: {
    width: "90%",
    height: 50,
    paddingLeft: 15
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
