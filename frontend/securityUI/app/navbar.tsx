/**
 * @file navbar.tsx
 * @brief The navigation bar for our web application
 * Class: CS3307
 * Date Created: Nov 4, 2023
 * Author: Christine B.
*/

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
 
/**
 * @brief Functional component representing the side navigation bar.
 */
const SideNavigationBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>PiCams</Text>
        <Image
          source={require('../assets/logoclean.png')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.linkGroup}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="ios-home" size={20} color="white" />
            </View>
            <Text style={styles.linkText}>Home</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/devices" asChild>
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="ios-person" size={20} color="white" />
            </View>
            <Text style={styles.linkText}>Devices</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/history" asChild>
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="ios-list" size={20} color="white" />
            </View>
            <Text style={styles.linkText}>History</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="ios-settings" size={20} color="white" />
            </View>
            <Text style={styles.linkText}>Settings</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.logoutGroup}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="ios-log-out" size={20} color="white" />
            </View>
            <Text style={styles.linkText}>Log Out</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22354E', 
    borderBottomWidth: 2, 
    borderBottomColor: '#22354E', 
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    backgroundColor: '#22354E', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', 
  },
  logoImage: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  linkGroup: {
    height: '30%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 200,
  },
  logoutGroup: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 10,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  linkText: {
    fontSize: 16,
    color: 'white', 
  },
});

export default SideNavigationBar;
