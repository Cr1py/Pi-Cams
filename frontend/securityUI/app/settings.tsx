/**
 * @file settings.tsx
 * @brief The settings page for our web application
 * Class: CS3307
 * Date Created: Nov 21, 2023
 * Author: Christine B.
*/

import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Button, Alert } from 'react-native';
import SideNavigationBar from './navbar';

/**
 * @brief Functional component representing the settings screen.
 */
export default function SettingsScreen() {
  const backendBaseUrl = 'http://localhost:8080';

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');

  /**
   * @brief Toggles the state of notifications.
   */
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

    /**
   * @brief Handles changes in the user name input.
   * @param {string} newUserName - The new user name.
   */
  const handleUserNameChange = (newUserName: string) => setUserName(newUserName);

  /**
   * @brief Handles changes in the user password input.
   * @param {string} newUserPassword - The new user password.
   */
  const handleUserPasswordChange = (newUserPassword: string) => setUserPassword(newUserPassword);

  /**
   * @brief Handles changes in the user email input.
   * @param {string} newUserEmail - The new user email.
   */
  const handleUserEmailChange = (newUserEmail: string) => setUserEmail(newUserEmail);

  /**
   * @brief Handles changes in the user mobile input.
   * @param {string} newUserMobile - The new user mobile number.
   */
  const handleUserMobileChange = (newUserMobile: string) => setUserMobile(newUserMobile);

  /**
   * @brief Updates the user account details.
   */
  const updateAccountDetails = () => {
    const response = fetch(`${backendBaseUrl}/users/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        name: userName,
        password: userPassword,
        mobile: userMobile,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Account details updated successfully', data);
        Alert.alert('Success', 'Account details updated successfully');
      })
      .catch((error) => {
        console.error('Error updating account details', error);
        Alert.alert('Error', 'Failed to update account details. Please try again.');
      });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.sidebar}>
        <SideNavigationBar />
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.accountDetailsContainer}>
          <Text style={styles.headerText}>Account Details</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Name</Text>
            <TextInput style={styles.input} value={userName} onChangeText={handleUserNameChange} />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={userPassword}
              onChangeText={handleUserPasswordChange}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={handleUserEmailChange}
              inputMode="email"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Mobile</Text>
            <TextInput
              style={styles.input}
              value={userMobile}
              onChangeText={handleUserMobileChange}
              inputMode="tel"
            />
          </View>
          <Button title="Update Account" onPress={updateAccountDetails} />
        </View>
        <Text style={styles.headerText}>Personalization</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={notificationsEnabled ? 'blue' : 'gray'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    margin: 20,
    marginTop: 40,
  },
  sidebar: {
    width: '12%',
    backgroundColor: '#22354E',
    padding: 10,
  },
  settingsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: '50%',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  accountDetailsContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: 250,
  },
});