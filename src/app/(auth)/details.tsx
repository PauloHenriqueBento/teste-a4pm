import { router, useLocalSearchParams  } from 'expo-router';
import { useEffect, useState } from "react";
import { View } from "react-native";
import { receitaService } from "@/service/receitaService";
import { useSession } from '@/core/ctx';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';

export default function Detail() {
    const { receitaId } = useLocalSearchParams();
    const [receita, setReceita] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { session } = useSession();
    const sessionJSON = JSON.parse(session);

    useEffect(() => {
        const fetchReceita = async () => {
            try {
                const data = await receitaService.getById(parseInt(receitaId as string));
                setReceita(data);
            } catch (error) {
                console.error("Erro ao buscar receita:", error);
            } finally {
                setLoading(false);
            }
        };

        if (receitaId) {
            fetchReceita();
        }
    }, [receitaId]);

    if (loading) {
        return (
            <View>
                <ThemedText>Carregando detalhes...</ThemedText>
            </View>
        );
    }

    if (!receita) {
        return (
            <View>
                <ThemedText>Receita não encontrada.</ThemedText>
            </View>
        );
    }

    const handleDelete = async () => {
        await receitaService.delete(receita.id);
        router.back();
    }

    return (
        <View style={{ padding: 20 }}>
            <ThemedText><ThemedText type='subtitle'>Nome:</ThemedText> {receita.nome}</ThemedText>
            <ThemedText><ThemedText type='subtitle'>Categoria:</ThemedText> {receita.categoria}</ThemedText>
            <ThemedText><ThemedText type='subtitle'>Tempo de Preparo:</ThemedText> {receita.tempo_preparo_minutos} minutos</ThemedText>
            <ThemedText><ThemedText type='subtitle'>Porções:</ThemedText> {receita.porcoes}</ThemedText>
            <ThemedText><ThemedText type='subtitle'>Ingredientes:</ThemedText> {receita.ingredientes}</ThemedText>
            <ThemedText><ThemedText type='subtitle'>Modo de Preparo:</ThemedText> {receita.modo_preparo}</ThemedText>
            <ThemedText><ThemedText type='subtitle'>Criado por:</ThemedText> {receita.nome_usuario}</ThemedText>
            {receita.id_usuarios === sessionJSON.id && (
                <>
                    <ThemedButton title="Editar" onPress={() => router.push({pathname: '/(auth)/edit', params: {receitaId: receita.id}})} />
                    <ThemedButton style={{backgroundColor: '#E3371E', marginTop: 14}} title="Deletar Receita" onPress={handleDelete} />
                </>
            )}
        </View>
    );
}
