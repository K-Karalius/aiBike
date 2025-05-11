import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

interface ErrorPopupProps {
  errors: string[];
  visible: boolean;
}

const ErrorsPopup = ({ errors, visible }: ErrorPopupProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Errors</Text>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              - {error}
            </Text>
          ))}
          <Button title="Close" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 5,
  },
});

export default ErrorsPopup;
