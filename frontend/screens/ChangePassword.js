import React from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { NavigationActions } from 'react-navigation';
import axios from "axios";

export default class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      errorPassword: "",
      errorPassword2: ""

    };
  }

  changePass = () => {
    // axios.defaults.headers.common['Authorization'] = "Bearer " + token
    axios.put("http://62.75.141.240:9001/changePassword", {
      password: this.state.password,
      password2: this.state.confirmPassword
    })
      .then(response => {
        console.log(response.data)
        if (response.data.success === true) {
          Alert.alert(
            'Ok',
            "Password changed correctly",
            [
              { text: 'OK', onPress: () => this.props.navigation.navigate('login') }
            ],
            { cancelable: false }
          )
        } else {
          this.setState({
            errorPassword: response.data.errors.password,
            errorPassword2: response.data.errors.password2,
          })
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
          <Text style={styles.errorState}>
            {this.state.errorPassword}
          </Text>
          <TextInput style={styles.LoginTextInput}
            underlineColorAndroid="#33B6C0"
            placeholder="Confirm Password" secureTextEntry
            autoCapitalize="none" autoCorrect={false}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
          />
          <Text style={styles.errorState}>
            {this.state.errorPassword2}
          </Text>
          <TouchableOpacity style={styles.LoginButton}
            onPress={() => this.changePass() }>
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