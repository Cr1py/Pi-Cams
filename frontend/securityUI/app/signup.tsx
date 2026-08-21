/**
 * @file signup.tsx
 * @brief The sign up page for our web application
 * Class: CS3307
 * Date Created: Nov 21, 2023
 * Author: Christine B.
*/
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

/**
 * @brief Interface representing the expected response data from the server.
 */
interface ResponseData {
  error?: string;
  success?: boolean;
}

/**
 * @brief Functional component representing the sign-up screen.
 */
export default function SignupScreen() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const securitysystem = 'Home'; 
  const [signupError, setSignupError] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const backendBaseUrl = 'http://localhost:8080';

  /**
   * @brief Handles the signup process.
   */
  const handleSignup = async () => {
    try {
      // Check if required fields are empty
      if (!name || !password || !email || !mobile) {
        setSignupError(true);
        return;
      }
  
      const response = await fetch(`${backendBaseUrl}/users/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          password: password,
          email: email,
          mobile: mobile,
          securitysystem: securitysystem,
        }),
      });
  
      const data = await response.json();
      console.log('Server Response:', response);
      console.log('Response Data:', data);
  
      setResponseData(data);
  
      if (response.ok && data.status === 'success') {
        setSignupError(false);
        setSignedUp(true);
      } else {
        setSignupError(true);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setSignupError(true);
    }
  };

  useEffect(() => {
    if (signedUp) {
      console.log('User successfully signed up!');
    }
  }, [signedUp]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Signup</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile"
          onChangeText={(text) => setMobile(text)}
        />
        {signupError && (
          <Text style={styles.errorText}>
            Could not sign up. Please try again.
            {responseData && responseData.error && ` Error: ${responseData.error}`}
          </Text>
        )}
        {signedUp ? (
          <Link href="/home">
            <Pressable
              style={({ pressed }) => [
                styles.signupButton,
                { backgroundColor: pressed ? 'lightgray' : 'white' },
              ]}
            >
              <Text style={styles.buttonText}>Signup</Text>
            </Pressable>
          </Link>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.signupButton,
              { width: '100%', backgroundColor: pressed ? 'lightgray' : 'white' },
            ]}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Signup</Text>
          </Pressable>
        )}
        <Link href="/">
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              { width: '100%', backgroundColor: pressed ? 'lightgray' : 'white' },
            ]}
          >
            <Text style={styles.buttonText}>Have an Account?</Text>
          </Pressable>
        </Link>
      </View>
      <Image
        source={require('../assets/logolargewelcome.png')}
        style={styles.image}
      />
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
    marginLeft: '6%', 
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
  headerText: {
    fontSize: 24,
    marginBottom: "15%",
    marginTop: "15%",
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
  signupButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center', 
  },
  loginButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center', 
  },
  buttonText: {
    color: 'blue',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
