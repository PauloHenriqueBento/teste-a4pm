import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSession } from "@/core/ctx";

export const HomeActionButtons = () => {
    const { signOut } = useSession();

    return (
        <View>
            <Pressable
                style={[styles.floatingButton]}
                onPress={() => router.push('/(auth)/create')}
            >
                <ThemedText style={styles.buttonText}>+</ThemedText>
            </Pressable>
            <Pressable
                style={[styles.floatingButton, styles.floatingLeft]}
                onPress={() => {
                    router.replace('/login');
                    signOut();
                }}
            >
                <ThemedText style={styles.buttonText}>{'<'}</ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 0,
        right: 30,
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#70B9BE',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    floatingLeft: {
        right: 0,
        left: 30,
        backgroundColor: '#E3371E'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
});
