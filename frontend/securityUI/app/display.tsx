/**
 * @file display.tsx
 * @brief The display page for our web application
 * Class: CS3307
 * Date Created: Nov 23
 * Author: Christine.B
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import fetchJsonp from 'fetch-jsonp';


// Fetch data from the server
fetchJsonp('http://192.168.2.254:5000/')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

/**
 * Functional component representing the display screen.
 */
const DisplayScreen = () => {
  const [cameraFeedback, setCameraFeedback] = useState<string | null>(null);

  // Address for the Raspberry Pi camera (change when the address to the Pi is added)
  const ADDRESS = 'http://192.168.2.254:5000/'; // EDIT ME

  /**
   * Gets feedback from the Raspberry Pi to display.
   */
  const captureFeedback = () => {
    const feedbackData = ADDRESS; 
    setCameraFeedback(feedbackData);
  };

  // Capture camera feedback when the component mounts
  useEffect(() => {
    captureFeedback();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.cameraFeedbackContainer}>
          <iframe src={ADDRESS} style={styles.cameraFeedbackWebView} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    cameraFeedbackContainer: {
      flex: 1,
      borderWidth: 2,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraFeedbackWebView: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    workInProgressText: {
      fontSize: 16,
      color: 'gray',
    },
  });
  

export default DisplayScreen;
