/**
 * @file index.tsx
 * @brief The landing page of our web application; acts as the login page
 * Class: CS3307
 * Date Created: Nov 2, 2023
 * Author: Christine B.
*/

import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

/**
 * @brief Functional component representing the login screen.
 */
export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const backendBaseUrl = 'http://localhost:8080';

  /**
   * @brief Handles the login process.
   */
  const handleLogin = async () => {
    try {
      console.log('Starting handleLogin');

      const response = await fetch(`${backendBaseUrl}/users/get?email=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetch request completed');

      const result = await response.json();

      console.log('Response JSON parsed');

      if (response.ok) {
        setLoginError(false);
        setLoggedIn(true);
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logolarge.png')}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        {loginError && <Text style={styles.errorText}>Invalid username or password</Text>}
        {loggedIn ? (
          <Link href="/home">
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                { backgroundColor: pressed ? 'lightgray' : 'white' },
              ]}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </Link>
        ) : (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                { width: '100%', backgroundColor: pressed ? 'lightgray' : 'white' },
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Link href="/signup">
              <Pressable
                style={({ pressed }) => [
                  styles.signupButton,
                  { width: '100%', backgroundColor: pressed ? 'lightgray' : 'white' },
                ]}
              >
                <Text style={styles.buttonText2}>Sign Up</Text>
              </Pressable>
            </Link>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#22354E', 
    padding: 20,
  },
  contentContainer: {
    marginRight: '6%', 
    padding: 20, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    height: '80%',
    width: '40%'
  },
  image: {
    aspectRatio: 1,
    width: '50%', 
    height: 'auto', 
  },
  header: {
    fontSize: 24,
    marginBottom: "15%",
    marginTop: "15%",
    alignSelf: 'center', 
  },
  headerText: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center', 
  },
  input: {
    width: '60%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    alignSelf: 'center', 
  },
  loginButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignSelf: 'center', 
  },
  signupButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center', 
  },
  buttonText: {
    color: 'blue',
    textAlign: 'center',
  },
  buttonText2: {
    color: 'blue',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
