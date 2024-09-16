import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ThemedInput } from "@/components/ThemedInput";
import { useRouter, useLocalSearchParams } from "expo-router";
import { categoriasService } from "@/service/categoriasService";
import { receitaService } from "@/service/receitaService";
import { useSession } from "@/core/ctx";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

type ReceitaFormData = {
    nome: string;
    id_categoria: number;
    tempo_preparo_minutos: string;
    porcoes: string;
    ingredientes: string;
    modo_preparo: string;
};

export default function Edit() {
    const { receitaId } = useLocalSearchParams();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<ReceitaFormData>();
    const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const { session } = useSession();
    const sessionJSON = JSON.parse(session);
    const router = useRouter();

    useEffect(() => {
        async function fetchCategorias() {
            try {
                const categoriasData = await categoriasService.getCategorias();
                setCategorias(categoriasData);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar as categorias.");
            }
        }

        async function fetchReceita() {
            try {
                if (receitaId) {
                    const receitaData = await receitaService.getById(parseInt(receitaId as string));
                    reset({
                        nome: receitaData.nome,
                        id_categoria: receitaData.id_categorias,
                        tempo_preparo_minutos: receitaData.tempo_preparo_minutos.toString(),
                        porcoes: receitaData.porcoes.toString(),
                        ingredientes: receitaData.ingredientes,
                        modo_preparo: receitaData.modo_preparo,
                    });
                    setCategoriaSelecionada(receitaData.id_categorias);
                }
            } catch (error) {
                console.error("Erro ao buscar receita:", error);
                Alert.alert("Erro", "Não foi possível carregar a receita.");
            } finally {
                setLoading(false);
            }
        }

        fetchCategorias();
        fetchReceita();
    }, [receitaId]);

    const onSubmit = async (data: ReceitaFormData) => {
        try {
            if (!categoriaSelecionada) {
                Alert.alert('Erro', 'Selecione uma categoria.');
                return;
            }

            const receitaData = {
                id: receitaId,
                id_categoria: categoriaSelecionada,
                id_usuario: sessionJSON.id,
                nome: data.nome,
                tempo_preparo_minutos: parseInt(data.tempo_preparo_minutos, 10),
                porcoes: parseInt(data.porcoes, 10),
                modo_preparo: data.modo_preparo, 
                ingredientes: data.ingredientes
            };
            const result = await receitaService.update(receitaData);
            Alert.alert('Sucesso', 'Receita atualizada com sucesso', [{ text: "Ok", onPress: () => router.push('/(auth)') }]);
        } catch (error: any) {
            console.log('Erro', error.message || 'Erro ao atualizar receita');
        }
    };

    if (loading) {
        return (
            <View>
                <ThemedText>Carregando...</ThemedText>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Nome da Receita */}
            <Controller
                control={control}
                name="nome"
                rules={{ required: 'O nome da receita é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                        placeholder="Nome da Receita"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.nome && <ThemedText style={{ color: 'red' }}>{errors.nome.message}</ThemedText>}

            {/* Seleção de Categoria */}
            <Text style={{ marginVertical: 10 }}>Selecione uma Categoria:</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
                {categorias.map((categoria) => (
                    <TouchableOpacity
                        key={categoria.id}
                        style={{
                            padding: 10,
                            backgroundColor: categoriaSelecionada === categoria.id ? 'blue' : 'gray',
                            marginRight: 10,
                            marginBottom: 10,
                        }}
                        onPress={() => setCategoriaSelecionada(categoria.id)}
                    >
                        <ThemedText style={{ color: 'white' }}>{categoria.nome}</ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tempo de Preparo */}
            <Controller
                control={control}
                name="tempo_preparo_minutos"
                rules={{ required: 'O tempo de preparo é obrigatório', pattern: { value: /^[0-9]+$/, message: 'Digite um número válido' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                        placeholder="Tempo de Preparo (minutos)"
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.tempo_preparo_minutos && <ThemedText style={{ color: 'red' }}>{errors.tempo_preparo_minutos.message}</ThemedText>}

            {/* Porções */}
            <Controller
                control={control}
                name="porcoes"
                rules={{ required: 'O número de porções é obrigatório', pattern: { value: /^[0-9]+$/, message: 'Digite um número válido' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                        placeholder="Porções"
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.porcoes && <ThemedText style={{ color: 'red' }}>{errors.porcoes.message}</ThemedText>}

            {/* Ingredientes */}
            <Controller
                control={control}
                name="ingredientes"
                rules={{ required: 'Os ingredientes são obrigatórios' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                        placeholder="Ingredientes"
                        multiline
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={{ height: 80 }}
                    />
                )}
            />
            {errors.ingredientes && <ThemedText style={{ color: 'red' }}>{errors.ingredientes.message}</ThemedText>}

            {/* Modo de Preparo */}
            <Controller
                control={control}
                name="modo_preparo"
                rules={{ required: 'O modo de preparo é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                        placeholder="Modo de Preparo"
                        multiline
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={{ height: 120 }}
                    />
                )}
            />
            {errors.modo_preparo && <ThemedText style={{ color: 'red' }}>{errors.modo_preparo.message}</ThemedText>}

            {/* Botão de Atualizar Receita */}
            <ThemedButton title="Atualizar Receita" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
    );
}
