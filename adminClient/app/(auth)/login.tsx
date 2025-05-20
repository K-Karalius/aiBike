import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  Text,
  Image,
  Pressable,
} from 'react-native';
import { LoginRequest } from '../../interfaces/auth';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from 'expo-router';
import styles from '../../styles/authStyles';

const LoginScreen = () => {
  const userContext = useContext(UserContext);
  const isFocused = useNavigation().isFocused();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
      setEmail('');
      setPassword('');
    }
  }, [isFocused]);

  const handleLogin = async () => {
    setIsLoading(true);
    const requestData: LoginRequest = { email, password };
    await userContext.userLogin(requestData);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/bike-icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>{"aiBike"}</Text>
      <Text style={styles.header}>Admin log in</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default LoginScreen;
