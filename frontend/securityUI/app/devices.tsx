/**
 * @file devices.tsx
 * @brief The device list page for our web application
 * Class: CS3307
 * Date Created: Nov 23
 * Author: Christine.B
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Platform } from 'react-native';
import SideNavigationBar from './navbar';
import { WebView } from 'react-native-webview';
import fetchJsonp from 'fetch-jsonp';

fetchJsonp('http://localhost:8080/')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


// Define the type for a device
interface Device {
  id: number;
  name: string;
  link: string;
  online: boolean;
}

// Functional component representing the list of connected devices
const DeviceListScreen = () => {
  // State to hold the list of devices
  const [devices, setDevices] = useState<Device[]>([]);

  const isLinkOnline = async (link: string): Promise<boolean> => {
    try {
      const response = await fetch(link, { method: 'HEAD' });
      console.log(`Response for ${link}:`, response);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  

  // Dummy data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      const initialDevices: Device[] = [
        { id: 1, name: 'Device 1', link: 'http://192.168.2.254:5000/', online: false },
        { id: 2, name: 'Device 2', link: 'http://localhost:8088/', online: false },
      ];

      const updatedDevices = await Promise.all(
        initialDevices.map(async (device) => ({
          ...device,
          online: await isLinkOnline(device.link),
        }))
      );

      setDevices(updatedDevices);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.sidebar}>
        <SideNavigationBar />
      </View>
      <View style={styles.devicesContainer}>
        <Text style={styles.headerText}>Connected Devices</Text>
        <FlatList
          data={devices}
          keyExtractor={(device) => device.id.toString()}
          renderItem={({ item: device }) => (
            <View style={styles.deviceItemContainer}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={[styles.statusText, { color: device.online ? 'green' : 'red' }]}>
                {device.online ? 'Online' : 'Offline'}
              </Text>
              {device.online && (
                <View style={styles.linkFeedContainer}>
                  {Platform.OS === 'web' ? (
                    <iframe src={device.link} style={styles.linkFeedWebView} />
                  ) : (
                    <Image source={{ uri: device.link }} style={styles.linkFeedImage} />
                  )}
                </View>
              )}
            </View>
          )}
        />
        {devices.every((device) => !device.online) && (
          <Text style={styles.offlineText}>All devices are offline.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
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
  devicesContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 30,
    padding: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  deviceItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  deviceName: {
    fontSize: 18,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  linkFeedContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linkFeedWebView: {
    flex: 1,
  },
  linkFeedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  offlineText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    alignSelf: 'flex-start',
  },
});

export default DeviceListScreen;
