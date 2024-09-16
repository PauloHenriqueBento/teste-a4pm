import { Alert, Button, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ThemedInput } from "@/components/ThemedInput";
import { useRouter } from "expo-router";
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

export default function Create() {
    const { control, handleSubmit, formState: { errors }, reset } = useForm<ReceitaFormData>();
    const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
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

        fetchCategorias();
    }, []);

    const onSubmit = async (data: ReceitaFormData) => {
        try {
            if (!categoriaSelecionada) {
                Alert.alert('Erro', 'Selecione uma categoria.');
                return;
            }
    
            if (!sessionJSON.id) {
                Alert.alert('Erro', 'Usuário não identificado.');
                return;
            }
    
            const receitaData = {
                ...data,
                id_categoria: categoriaSelecionada,
                id_usuario: sessionJSON.id,
                tempo_preparo_minutos: parseInt(data.tempo_preparo_minutos),
                porcoes: parseInt(data.porcoes),
            };
            await receitaService.create(receitaData);
            reset();
            Alert.alert('Sucesso', 'Receita criada com sucesso', [{text: "Ok", onPress: () => router.push('/(auth)')}]);
        } catch (error: any) {
            console.log('Erro', error.message || 'Erro ao criar receita');
        }
    };
    

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
            <ThemedText style={{ marginVertical: 10 }}>Selecione uma Categoria:</ThemedText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
                {categorias.map((categoria) => (
                    <TouchableOpacity
                        key={categoria.id}
                        style={{
                            padding: 10,
                            backgroundColor: categoriaSelecionada === categoria.id ? '#70B9BE' : 'gray',
                            marginRight: 10,
                            marginBottom: 10,
                            borderRadius: 15,
                        }}
                        onPress={() => setCategoriaSelecionada(categoria.id)}
                    >
                        <ThemedText style={{ color: 'white' }}>{categoria.nome}</ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
            {errors.id_categoria && <ThemedText style={{ color: 'red' }}>{errors.id_categoria.message}</ThemedText>}

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

            {/* Botão de Criar Receita */}
            <ThemedButton title="Criar Receita" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
    );
}
