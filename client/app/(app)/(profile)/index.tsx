import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import UserOnly from '@/components/auth/UserOnly';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const user = userContext.user;

  const initials = user?.email?.[0]?.toUpperCase() || 'User';

  return (
    <UserOnly>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{initials}</Text>
          </View>
          <Text style={styles.emailText}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/history')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="bicycle-outline" size={24} color="#007bff" />
              <Text style={styles.menuText}>My Rides</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => userContext.userLogout()}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  profileSection: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInitial: {
    fontSize: 36,
    color: 'white',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    fontWeight: '500',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});
