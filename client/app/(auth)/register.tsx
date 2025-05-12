import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  Text,
  Image,
  Pressable,
} from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { RegisterRequest } from '../../interfaces/auth';
import { useNavigation, router } from 'expo-router';
import { EMAIL_RULE, PASSWORD_RULES } from '../../utils/regexUtils';
import styles from '../../styles/authStyles';

const RegisterScreen = () => {
  const userContext = useContext(UserContext);
  const isFocused = useNavigation().isFocused();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) {
      setEmail('');
      setPassword('');
    }
  }, [isFocused]);

  const handleRegister = async () => {
    const error = validate();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setIsLoading(true);
    const requestData: RegisterRequest = { email, password };
    await userContext.userRegister(requestData);
    setIsLoading(false);
  };

  const validate = (): string | null => {
    if (email.trim().length === 0) return 'Email is required.';
    if (password.length === 0) return 'Password is required.';

    if (!EMAIL_RULE.test(email)) return EMAIL_RULE.message;
    for (let rule of PASSWORD_RULES) {
      if (!rule.test(password)) {
        return rule.message;
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/bike-icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>aiBike</Text>
      <Text style={styles.header}>Sign up</Text>
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

      {errorMessage && (
        <View style={styles.errorBox}>
          <Text>{errorMessage}</Text>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>
          <Text style={styles.footer}>
            Already a member?{' '}
            <Text style={styles.link} onPress={() => router.replace('/login')}>
              Log in
            </Text>{' '}
            instead
          </Text>
        </>
      )}
    </View>
  );
};

export default RegisterScreen;
