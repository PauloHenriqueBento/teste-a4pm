import { Alert, Button, Text, View } from "react-native"
import { useForm, Controller } from 'react-hook-form';
import { authService } from "@/service/authService";
import { ThemedInput } from "@/components/ThemedInput";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

type SignUpFormData = {
    nome: string;
    login: string;
    senha: string;
    confirmarSenha: string;
};

export default function Register() {    
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignUpFormData>();

    const senha = watch('senha');

    const onSubmit = async (data: SignUpFormData) => {
        if (data.senha !== data.confirmarSenha) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
        }

        try {
            const result = await authService.register({ login: data.login, nome: data.nome, senha: data.senha });
            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
            router.back();
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao registrar usuário');
        }
    };
    
    return (
        <View style={{flex: 1, padding: 20, justifyContent: "center"}}>
            <Controller
                control={control}
                name="nome"
                rules={{ required: 'O nome é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                    placeholder="Nome"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ marginBottom: 10, borderColor: 'gray', borderWidth: 1 }}
                />
                )}
            />
            {errors.nome && <ThemedText style={{ color: 'red' }}>{errors.nome.message}</ThemedText>}

            {/* Login */}
            <Controller
                control={control}
                name="login"
                rules={{ required: 'O login é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                    placeholder="Login"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ marginBottom: 10, borderColor: 'gray', borderWidth: 1 }}
                />
                )}
            />
            {errors.login && <ThemedText style={{ color: 'red' }}>{errors.login.message}</ThemedText>}

            {/* Senha */}
            <Controller
                control={control}
                name="senha"
                rules={{
                required: 'A senha é obrigatória',
                minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                    placeholder="Senha"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    style={{ marginBottom: 10, borderColor: 'gray', borderWidth: 1 }}
                />
                )}
            />
            {errors.senha && <ThemedText style={{ color: 'red' }}>{errors.senha.message}</ThemedText>}

            {/* Confirmar Senha */}
            <Controller
                control={control}
                name="confirmarSenha"
                rules={{
                required: 'A confirmação de senha é obrigatória',
                validate: value => value === senha || 'As senhas não coincidem',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                    placeholder="Confirmar Senha"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    style={{ marginBottom: 10, borderColor: 'gray', borderWidth: 1 }}
                />
                )}
            />
            {errors.confirmarSenha && <ThemedText style={{ color: 'red' }}>{errors.confirmarSenha.message}</ThemedText>}

            {/* Botão de Registro */}
            <ThemedButton title="Registrar" onPress={handleSubmit(onSubmit)} />
        </View>
    );
}