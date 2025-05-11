import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { RegisterRequest } from '../../interfaces/auth';
import { useNavigation } from 'expo-router';
import { EMAIL_RULE, PASSWORD_RULES } from '../../utils/regexUtils';

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
        <Button title="Register" onPress={handleRegister} />
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
  errorBox: {
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: '#ffcccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
});

export default RegisterScreen;
