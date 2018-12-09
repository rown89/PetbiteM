import React from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";

export default class ForgotPasswordScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: "",
      errorUsername: ""
    };
  }

  async recoveryPress () {
    try {
      await axios.post('http://62.75.141.240:9001/passRecovery', {
        username: this.state.username,
      })
        .then((response) => {
          if (response.data.errors) {
            this.setState({
              errorUsername: response.data.errors.username
            });
          }
          if (response.data.success === true) {
            Alert.alert(
              "Recovery successful, check your Email",
              [{ text: 'OK', onPress: () => this.props.navigation.navigate('login') }],
              { cancelable: false }
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
    }
  }

  render () {
    return (
      <View styles={styles.mainContainer}>
        <View style={styles.FormLogin}>
          <TextInput style={styles.LoginTextInput}
           underlineColorAndroid="#33B6C0"
            placeholder="Email" keyboardType="email-address"
            autoCapitalize="none" autoCorrect={false}
            onChangeText={(username) => this.setState({ username })}
          />
          <View style={styles.errorView}>
            <Text style={styles.errorState}>
              {this.state.errorUsername}
            </Text>
          </View>
          <TouchableOpacity style={styles.LoginButton}
            onPress={() => {
              this.recoveryPress();
              }}>
            <Text style={{ color: "white" }}>
              Reset Password
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white"
  },
  FormLogin: {
    flex: 1,
    marginTop: 15,
    flexDirection: "column",
    alignItems: "center"
  },
  LoginTextInput: {
    width: "90%",
    height: 50,
    paddingLeft: 15,
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
