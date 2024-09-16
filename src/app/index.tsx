import { Link, Redirect, router } from "expo-router";
import { ImageBackground, Text, View } from "react-native"
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/core/ctx";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";

export default function App() {    
    const [appIsReady, setAppIsReady] = useState(false);
    const { session, isLoading } = useSession();
    console.log(session);

    useEffect(() => {
        async function prepare() {
            try {
                if (!isLoading) {
                    if (session) {
                        router.replace("/(auth)");
                    } else {
                        setAppIsReady(true);
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }
    
        prepare();
    }, [isLoading, session]);
    
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
          await SplashScreen.hideAsync();
        }
      }, [appIsReady]);
    
      if (!appIsReady) {
        return null;
      }

    return (
        <ImageBackground source={require('../../assets/images/background_index.png')} style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }} onLayout={onLayoutRootView}>
            <Link href="/login" asChild><ThemedButton onPress={() =>{}} title="Entrar" colorType="dark" /></Link>
            <Link href="/register" style={{marginTop: 16}} asChild>
                <ThemedText style={{textAlign: "center", color: "#FFF", marginBottom: 50}}>Criar uma conta</ThemedText>
            </Link>
        </ImageBackground>
    );
}