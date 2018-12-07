import React from "react";
import { StyleSheet,View, Image, Text, TouchableOpacity, AsyncStorage, ActivityIndicator } from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import axios from "axios";

// Settings Tab Area
export default class SettingsScreen extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        isLoading: true,
        data: [],
      };
    }

  componentDidMount () {
    AsyncStorage.getItem('id_token').then((token) => {
      axios.defaults.headers.common['Authorization'] = "Bearer " + token
      axios.post("http://62.75.141.240:9001/profile", {
      })
        .then((response) => {
          this.setState({
            isLoading: false,
            data: response.data
          });
        })
        .catch((error) => {
          console.log(error)
        });
    });
  }

  async userLogout () {
    try {
      await AsyncStorage.removeItem('id_token');
      this.props.navigation.navigate({routeName: 'login'});
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  userChangePw () {
    this.props.navigation.navigate({ routeName: "changepassword" });
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
        <View style={styles.headerContainer}>
        </View>
        <View style={{justifyContent: "center", alignItems: "center"}}>
          <Image
            style={styles.avatarImage}
            source={{ uri: 'http://www.danilomongelli.it/pgb/assets/img/avatarTest.png' }}
          />
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>
            {this.state.data.user_id}
          </Text>
          <Text style={styles.dataText}>
            Name: {this.state.data.name}
          </Text>
          <Text style={styles.dataText}>
            Lastname: {this.state.data.lastname}
          </Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
          <TouchableOpacity style={styles.changepw}
            onPress={() => this.userChangePw()}
          >
          <Text style={{color: "#FFFFFF", fontWeight: "bold"}}>
            Change Password
          </Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
          <TouchableOpacity style={styles.logout}
            onPress={() => this.userLogout()}
          >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
            Logout
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
      marginTop: getStatusBarHeight() + 10,
      margin: 10,
      borderRadius: 5,
      elevation: 3
    },
    headerContainer: {
      width: "100%",
      height: 130,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#191A1D"
    },
    avatarImage: {
      width: 120,
      height: 120,
      zIndex: 10,
      marginTop: 50,
      position: "absolute",
      borderRadius: 120 / 2,
      borderWidth: 4,
      borderColor: "#FFFFFF"
    },
    dataContainer: {
      flex: 1,
      paddingTop: 100,
      paddingLeft: 40,
      paddingRight: 40,
      backgroundColor: "#FFFFFF"
    },
    dataText: {
      marginBottom: 5
    },
    changepw: {
      width: "50%",
      height: 50,
      padding: 10,
      margin: 10,
      backgroundColor: "green",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5
    },
    logout: {
      width: "50%",
      height: 50,
      padding: 10,
      marginBottom: 10,
      backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5
    }
  });
