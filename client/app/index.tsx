import UserOnly from '@/components/auth/UserOnly';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Map from '../components/Map';
import { Ionicons } from '@expo/vector-icons'; // or any other icon library
import { UserContext } from '@/contexts/UserContext';
import { useContext } from 'react';

export default function Index() {
  const userContext = useContext(UserContext);

  return (
    <UserOnly>
      <View style={styles.container}>
        <Map />
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={userContext.userLogout}
        >
          <Ionicons name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    transform: [{ scaleX: -1 }],
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
