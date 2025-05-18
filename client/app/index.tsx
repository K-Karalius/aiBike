import UserOnly from '@/components/auth/UserOnly';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Map from '../components/Map';
import { Ionicons } from '@expo/vector-icons'; // or any other icon library
import { UserContext } from '@/contexts/UserContext';
import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const userContext = useContext(UserContext);
  const insets = useSafeAreaInsets();

  return (
    <UserOnly>
      <View style={styles.container}>
        <Map />
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { top: insets.top + 10, left: insets.left + 10 },
          ]}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
