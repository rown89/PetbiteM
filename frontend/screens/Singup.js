import React from "react";
import { TextInput, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, View, AsyncStorage } from "react-native";
import axios from "axios";
import DatePicker from "react-native-datepicker";
import SwitchSelector from "react-native-switch-selector";

export default class SingupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      lastname: "",
      gender: "f",
      date: "",
      username: "",
      password: "",
      confirmPassword: "",
      errorGender: "",
      errorName: "",
      errorLastname: "",
      errorDate: "",
      errorUsername: "",
      errorPassword: "",
      errorPassword2: ""
    };
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  regPress = () => {
    let _this = this;
    axios.post("http://62.75.141.240:9001/singup", {
      name: this.state.name,
      lastname: this.state.lastname,
      date: this.state.date,
      gender: this.state.gender,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.confirmPassword
    })
      .then((response) => {
        if (response.data.success === true) {
          _this.saveItem('id_token', response.data.token),
          _this.props.navigation.navigate({ routeName: 'hometabs' });
        }
        if (response.data.errors){
          this.setState({
            errorGender: response.data.errors.gender,
            errorName: response.data.errors.name,
            errorLastname: response.data.errors.lastname,
            errorDate: response.data.errors.date,
            errorUsername: response.data.errors.username,
            errorPassword: response.data.errors.password,
            errorPassword2: response.data.errors.password2,
          })
        }
      })
      .catch(error => 
        console.log(error),
      )
      .done();
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.FormLogin} behavior="padding" enabled>
        <View style={{ width: "100%", marginBottom: 10, padding: 0 }}>
          <SwitchSelector
            initial={0}
            fontSize={null}
            textColor={"#32C5CC"}
            selectedColor={"#FFFFFF"}
            buttonColor={"#32C5CC"}
            options={[
              { label: "Female", value: "f" },
              { label: "Male", value: "m" }
            ]}
            onPress={value => this.setState({ gender: value })}
          />
        </View>
        <TextInput style={{ width: "100%", padding: 15 }}
          underlineColorAndroid="#33B6C0"
          placeholder="First Name"
          autoCorrect={false}
          onChangeText={name => this.setState({ name })}
        />
        <View style={styles.errorView}>
          <Text style={styles.errorState}>
            {this.state.errorName}
          </Text>
        </View>
        <TextInput style={{ width: "100%", padding: 15 }}
          underlineColorAndroid="#33B6C0"
          placeholder="Last Name"
          autoCorrect={false}
          onChangeText={lastname => this.setState({ lastname })}
        />
        <View style={styles.errorView}>
          <Text style={styles.errorState}>
            {this.state.errorLastname}
          </Text>
        </View>
        <DatePicker style={{ width: "100%", marginTop: 15, marginBottom: 5 }}
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          date={this.state.date}
          mode="date"
          placeholder="Pick a Birthday Date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={date => {
            this.setState({ date: date });
          }}
        />
        <View style={styles.errorView}>
          <Text style={styles.errorState}>
            {this.state.errorDate}
          </Text>
        </View>
        <TextInput style={styles.LoginTextInput}
          underlineColorAndroid="#33B6C0"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={username => this.setState({ username })}
        />
        <View style={styles.errorView}>
          <Text style={styles.errorState}>
            {this.state.errorUsername}
          </Text>
        </View>
        <TextInput style={styles.LoginTextInput}
          underlineColorAndroid="#33B6C0"
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={password => this.setState({ password })}
        />
        <View style={styles.errorView}>
          <Text style={styles.errorState}>
            {this.state.errorPassword}
          </Text>
        </View>
        <TextInput style={styles.LoginTextInput}
          underlineColorAndroid="#33B6C0"
          placeholder="Retype password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
        />
        <View style={styles.errorView}>
          <Text style={styles.errorState}>
            {this.state.errorPassword2}
          </Text>
        </View>
        <TouchableOpacity style={styles.LoginButton}
          onPress={this.regPress}>
          <Text style={styles.LoginButtonText}>
            Sign-Up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    );
  }
}

const styles = StyleSheet.create({
  FormLogin: {
    flex: 1,
    padding: 20,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 3,
  },
  LoginTextInput: {
    width: "100%",
    padding: 15
  },
  dateBirthButton: {
    width: "100%",
    height: 50,
    padding: 10,
    backgroundColor: "#00F0B3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  },
  errorView:{
    flex: 1,
    paddingLeft: 10
  },
  errorState: {
    fontSize: 12,
    color: "red"
  },
  LoginButton: {
    width: "100%",
    height: 50,
    marginTop: 15,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#283B47",
    justifyContent: "center",
    alignItems: "center"
  },
  LoginButtonText: {
    color: "white",
    fontWeight: "bold"
  }
});