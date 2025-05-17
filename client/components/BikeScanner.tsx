import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CameraView, BarcodeScanningResult } from 'expo-camera';

interface BikeScannerProps {
  onScanSuccess: (data: string) => void;
  onScanCancel: () => void;
}

export default function BikeScanner({
  onScanSuccess,
  onScanCancel,
}: BikeScannerProps) {
  const [, setCameraReady] = useState(false);

  const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanningResult.data) {
      onScanSuccess(scanningResult.data);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.scanningOverlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanningText}>Scanning for QR code...</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={onScanCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  scanningOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 5,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 12,
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});
