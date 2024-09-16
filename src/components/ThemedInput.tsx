import { StyleSheet, TextInput, TextInputProps } from "react-native";

export function ThemedInput({ ...rest }: Readonly<TextInputProps>) {
    return <TextInput
        style={[styles.default]}
        {...rest} />
}

const styles = StyleSheet.create({
    default: {
        height: 54,
        borderWidth: 1,
        borderColor: "#E6EBF2",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    }
})