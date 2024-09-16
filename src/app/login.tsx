import { Alert, Text, View } from "react-native"
import { Controller, useForm } from "react-hook-form";
import { authService } from "@/service/authService";
import { ThemedInput } from "@/components/ThemedInput";
import { Link, router } from "expo-router";
import { useSession } from "@/core/ctx";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";

type LoginFormData = {
    login: string;
    senha: string;
};

export default function Login() {    
    const { signIn } = useSession();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const user = await authService.login(data.login, data.senha);
            signIn({
                id: user.id,
                login: user.login,
                nome: user.nome,
            });
            router.replace('/(auth)');
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao realizar login');
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
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
            {errors.login && <Text style={{ color: 'red' }}>{errors.login.message}</Text>}

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
            {errors.senha && <Text style={{ color: 'red' }}>{errors.senha.message}</Text>}

            {/* Botão de Login */}
            <ThemedButton title="Login" onPress={handleSubmit(onSubmit)} />
            <Link href={"/register"} style={{marginTop: 16, padding: 8}} asChild>
                <ThemedText>Não tem conta? Crie uma clicando aqui</ThemedText>
            </Link>
        </View>
    );
}