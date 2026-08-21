import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
const imageSrc = require('./assets/placeholder.jpg'); // Use require for local images

export default function App() {
  return (
    <View style={styles.container}>
      <Text>haha funny app go brrrrrr</Text>
      <Image source={imageSrc} style={{ width: 200, height: 200 }} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
