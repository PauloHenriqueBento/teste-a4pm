import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ThemedButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    colorType?: 'default' | 'dark';
}

export function ThemedButton({ title, onPress, style, textStyle, colorType = 'default' }: Readonly<ThemedButtonProps>) {
    const backgroundColor = colorType === 'dark' ? '#042628' : '#70B9BE';
    return (
        <TouchableOpacity style={[styles.default, { backgroundColor }, style]} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    default: {
        height: 54,
        backgroundColor: '#70B9BE',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
