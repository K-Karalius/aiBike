import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LoginRequest } from '../../interfaces/auth';
import { UserContext } from '../../contexts/UserContext';
import { Link, useNavigation } from 'expo-router';

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
          <Button title="Login" onPress={handleLogin} />
          <Link href="/register" style={styles.link}>
            Go to Register
          </Link>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
