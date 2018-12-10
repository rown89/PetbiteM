import React from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";

export default class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      updatePassword : false
    };
  }

  changePass = () => {
    axios.defaults.headers.common['Authorization'] = "Bearer " + token
    axios.put("http://62.75.141.240:9001/changePassword", {
      password: this.state.password,
      password2: this.state.confirmPassword
    })
      .then(response => {
        if (response.data.success === 200) {
          Alert.alert("Password changed correctly")
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.FormLogin}>
          <TextInput style={styles.LoginTextInput}
            underlineColorAndroid="#33B6C0"
            placeholder="New Password" secureTextEntry
            autoCapitalize="none" autoCorrect={false}
            onChangeText={password => this.setState({ password })}
          />
          <TextInput style={styles.LoginTextInput}
            underlineColorAndroid="#33B6C0"
            placeholder="Confirm Password" secureTextEntry
            autoCapitalize="none" autoCorrect={false}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
          />
          <TouchableOpacity style={styles.LoginButton}
            onPress={() => this.changePass }>
            <Text style={{ color: "white" }}>
              Change Password
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