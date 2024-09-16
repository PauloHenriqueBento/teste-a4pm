import * as Crypto from 'expo-crypto';
import { openDatabase } from "@/database/openDatabase";

const loginExists = async (login: string): Promise<any | null> => {
    try {
        const db = await openDatabase();
        const result = await db.getFirstAsync('SELECT * FROM usuarios WHERE login = ?', [login]);
        return result;
    } catch (error) {
        console.error('Erro ao verificar se o login existe:', error);
        return null;
    }
};


export const authService = {
    register: async(
        {
            nome,
            login,
            senha
        } : {
            nome: string;
            login: string;
            senha: string;
        }) => {
            const db = await openDatabase();
    
            const exists = await loginExists(login);
            if (exists) {
                throw new Error('O login já está em uso');
            }
        
            const hashedPassword = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                senha
            );
            
            const result = await db.runAsync(
                `INSERT INTO usuarios (nome, login, senha, criado_em, alterado_em) VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
                [nome, login, hashedPassword]
            );
            
            const userId = result.lastInsertRowId;
            return {
                id: userId,
                nome,
                login,
            };
    },
    login: async (login: string, senha: string) => {
        const user = await loginExists(login);
        const errorMessage = 'Impossível fazer login novamente, valide credenciais ou crie uma conta';

        if (!user) {
            throw new Error(errorMessage);
        }

        const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            senha
        );

        if (user.senha !== hashedPassword) {
            throw new Error(errorMessage);
        }

        return user
    }
}