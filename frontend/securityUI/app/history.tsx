/**
 * @file history.tsx
 * @brief The history page for our web application
 * Class: CS3307
 * Date Created: Nov 20 2023
 * Author: Christine.B
*/

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import SideNavigationBar from './navbar';
import { WebView } from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

interface HistoryItem {
  id: number;
  link: string;
  status: string;
  timestamp: string;
}

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedHistory: HistoryItem[] = [
        { id: 1, link: 'http://192.168.2.254:5000/', status: 'Uploaded', timestamp: getCurrentTimestamp() }
      ];

      // Update the timestamp every second
      const intervalId = setInterval(() => {
        const updatedHistory = fetchedHistory.map(item => ({
          ...item,
          timestamp: getCurrentTimestamp(),
        }));
        setHistoryData(updatedHistory);
      }, 1000);

      setHistoryData(fetchedHistory);

      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    };

    const getCurrentTimestamp = () => {
      const now = new Date();
      const formattedTimestamp = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
      return formattedTimestamp;
    };

    const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    fetchData(); 
  }, []);

  const openModal = (item: HistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderHistoryItemText = () => (
    <View style={styles.textContainer}>
      <Text>Status: {selectedItem?.status}</Text>
      <Text>Timestamp: {selectedItem?.timestamp}</Text>
    </View>
  );
  
  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.historyItemContainer}>
        {Platform.OS === 'web' ? (
          <iframe src={item.link} height={'100%'} width={'100%'} />
        ) : (
          <Image source={{ uri: item.link }} style={styles.historyItemImage} />
        )}
        {(!isModalOpen || Platform.OS === 'web') && (
          <View style={styles.textContainer}>
            <Text>Status: {item.status}</Text>
            <Text>Timestamp: {item.timestamp}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.sidebar}>
        <SideNavigationBar />
      </View>
      <View style={styles.historyContainer}>
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHistoryItem}
        />
      </View>
      {isModalOpen && (
        <Modal animationType="slide" transparent={false} visible={isModalOpen}>
          <View style={styles.modalContainer}>
            {Platform.OS === 'web' ? (
              <iframe src={selectedItem?.link} height={'100%'} width={'100%'} />
            ) : (
              <>
                <Image source={{ uri: selectedItem?.link }} style={styles.webView} />
                <View style={{ marginTop: 10 }}>
                  <Text>Status: {selectedItem?.status}</Text>
                  <Text>Timestamp: {selectedItem?.timestamp}</Text>
                </View>
              </>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};


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
  historyContainer: {
    flex: 1,
    padding: 20,
    width: '60%', 
    height: '100%', 
  },
  historyItemContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    width: '60%',  
    flexDirection: 'column', 
    alignItems: 'center', 
  },
  historyItemImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    marginBottom: 10,
  },
  textContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 12,
    padding: 2,
  },
});

export default HistoryScreen;
