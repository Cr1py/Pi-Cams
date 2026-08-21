/**
 * @file home.tsx
 * @brief The homepage file for our web application
 * Class: CS3307
 * Date Created: Nov 2, 2023
 * Author: Christine B.
*/

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';

import SideNavigationBar from './navbar'; 

/**
 * @brief Functional component representing the home screen.
 */
export default function HomeScreen() {
  const [cameraFeedback, setCameraFeedback] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Address for the Raspberry Pi camera (change when the address to the Pi is added)
  const ADDRESS = 'http://192.168.2.254:5000/'; // EDIT ME

  // Placeholder until we get the database running fully
  const connectedDevices = [
    { id: 1, name: 'Device 1' },
  ];

  /**
   * @brief Gets feedback from the Raspberry Pi to display.
   */
  const captureFeedback = () => {
    const feedbackData = ADDRESS; 
    setCameraFeedback(feedbackData);
  };

  /**
   * @brief Opens the camera view on the webpage.
   */
  const viewFeedback = () => {
    console.log('Viewing camera');
    openCamera();
  };

  /**
   * @brief Opens the camera modal.
   */
  const openCamera = () => {
    setIsCameraOpen(true);
  };

  /**
   * @brief Closes the camera modal.
   */
  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.sidebar}>
        <SideNavigationBar />
      </View>
      <Modal animationType="slide" transparent={false} visible={isCameraOpen}>
        <View style={styles.fullScreenCameraContainer}>
          {Platform.OS === 'web' ? (
            <iframe src={ADDRESS} height={'100%'} width={'100%'} />
          ) : (
            <WebView source={{ uri: ADDRESS }} />
          )}
          <TouchableOpacity onPress={() => closeCamera()} style={styles.closeCameraButton}>
            <Text style={styles.closeCameraButtonText}>Esc</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.componentContainer}>
        <View style={styles.cameraContainer}>
          <View style={styles.cameraFeedbackContainer}>
            {Platform.OS === 'web' ? (
              <iframe src={ADDRESS} style={{ flex: 1, width: '100%', height: 'auto' }} />
            ) : (
              <>
                {cameraFeedback ? (
                  <Image source={{ uri: cameraFeedback }} style={styles.cameraFeedbackImage} />
                ) : (
                  <Text style={styles.workInProgressText}>No Feed</Text>
                )}
              </>
            )}
          </View>
          <View style={styles.viewButtonContainer}>
            <Button title="View" onPress={() => viewFeedback()} />
          </View>
        </View>
        <View style={styles.connectedDevicesContainer}>
          <Text style={styles.connectedDevicesHeader}>Connected Devices</Text>
          <FlatList
            data={connectedDevices}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.connectedDeviceItem}>{item.name}</Text>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  screenContainer: {
    width: '100%',
    height: windowHeight,
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
  componentContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    marginLeft: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  cameraFeedbackContainer: {
    width: '100%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraFeedbackImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  workInProgressText: {
    fontSize: 16,
    color: 'gray',
  },
  connectedDevicesContainer: {
    width: '20%',
    padding: 10,
    marginLeft: 10,
    justifyContent: 'flex-start',
  },
  connectedDevicesHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  connectedDeviceItem: {
    fontSize: 12,
    marginVertical: 3,
  },
  fullScreenCameraContainer: {
    width: '100%',
    height: windowHeight,
  },
  closeCameraButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  closeCameraButtonText: {
    color: 'white',
    fontSize: 12,
    padding: 2,
  },
  viewButtonContainer: {
    marginTop: 20,
    width: '10%',
    height: '20%',
    padding: 8,
  },
});