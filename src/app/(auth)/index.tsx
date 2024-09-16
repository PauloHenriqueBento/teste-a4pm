import { HomeActionButtons } from "@/components/HomeActionButtons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedViewCard } from "@/components/ThemedViewCard";
import { receitaService } from "@/service/receitaService";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";

type Receita = {
    id: number;
    nome: string;
    categoria: string;
    tempo_preparo_minutos: number;
    porcoes: number;
};

export default function Home() {
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [loading, setLoading] = useState(true);
  
    const fetchReceitas = async () => {
        console.log("Fetching receitas...");
        try {
            const data = await receitaService.getAll();
            console.log("Receitas fetched:", data);
            setReceitas(data);
        } catch (error) {
            console.error("Erro ao buscar receitas:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
      useCallback(() => {
          fetchReceitas();
      }, [])
    );
  
    const renderReceita = ({ item }: { item: Receita }) => (
    <ThemedViewCard onPress={() => router.push({pathname: "/(auth)/details", params: {receitaId: item.id}})}>
        <ThemedText type="subtitle">{item.nome}</ThemedText>
        <ThemedText><ThemedText type="defaultSemiBold">Categoria:</ThemedText> {item.categoria}</ThemedText>
      </ThemedViewCard>
    );
  
    if (loading) {
      return (
        <View>
          <ThemedText>Carregando receitas...</ThemedText>
        </View>
      );
    }
  
    if (receitas.length === 0) {
      return (
        <View style={styles.container}>
          <ThemedText>Não há receitas disponíveis no momento.</ThemedText>
          <HomeActionButtons />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReceita}
        />
          <HomeActionButtons />
      </View>
    );
}
  
const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingVertical: 20,
      justifyContent: 'space-between', 
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});