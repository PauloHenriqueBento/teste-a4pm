import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, GestureResponderEvent } from 'react-native';

interface ThemedViewCardProps {
  style?: ViewStyle;
  onPress: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
}

export function ThemedViewCard({ style, onPress, children }: ThemedViewCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.default, style]} 
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderColor: '#FBFBFB',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8, 
  },
});
