import React from "react";
import { useSession } from "@/core/ctx";
import { Redirect, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";


export default function AppLayout() { 
  const { session, isLoading } = useSession();
  
  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{headerTitle: 'App A4PM'}} />
    </GestureHandlerRootView>
  );
}
