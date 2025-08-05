// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import AppNavigator from './navigation/AppNavigator';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(null);

//   useEffect(() => {
//     const checkLogin = async () => {
//       const user = await AsyncStorage.getItem('user');
//       setIsLoggedIn(!!user);
//     };
//     checkLogin();
//   }, []);
//   if (isLoggedIn === null) return null;
//   return (
//       <AppNavigator isLoggedIn={isLoggedIn} />
//   );
// }
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const user = await AsyncStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    checkStatus();

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Text style={styles.noInternetText}>No Internet Connection</Text>
      </View>
    );
  }

  return <AppNavigator isLoggedIn={isLoggedIn} />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noInternetText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'red',
  },
});
