import { openDatabase } from "@/database/openDatabase";

export const receitaService = {
    create: async ({
        id_usuario,
        id_categoria,
        nome,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes
    }: {
        id_usuario: number;
        id_categoria: number;
        nome: string;
        tempo_preparo_minutos: number;
        porcoes: number;
        modo_preparo: string;
        ingredientes: string;
    }) => {
        const db = await openDatabase();
        
        // Verifique a existência dos campos 'criado_em' e 'alterado_em' na tabela 'receitas'
        const result = await db.runAsync(
            `INSERT INTO receitas 
                (id_usuarios, id_categorias, nome, tempo_preparo_minutos, porcoes, modo_preparo, ingredientes, criado_em, alterado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [id_usuario, id_categoria, nome, tempo_preparo_minutos, porcoes, modo_preparo, ingredientes]
        );

        return {
            id: result.lastInsertRowId,
            id_usuario,
            id_categoria,
            nome,
            tempo_preparo_minutos,
            porcoes,
            modo_preparo,
            ingredientes
        };
    },

    getById: async (id: number) => {
        const db = await openDatabase();
        const receita = await db.getFirstAsync(`SELECT receitas.*, categorias.nome AS categoria, usuarios.nome AS nome_usuario
        FROM receitas
        JOIN categorias ON receitas.id_categorias = categorias.id
        JOIN usuarios ON receitas.id_usuarios = usuarios.id
        WHERE receitas.id = ?`, [id]);

        if (!receita) {
            throw new Error(`Receita com id ${id} não encontrada`);
        }
        return receita;
    },

    getAll: async () => {
        const db = await openDatabase();
        const receitas = await db.getAllAsync(`
            SELECT receitas.id, receitas.nome, receitas.tempo_preparo_minutos, receitas.porcoes, categorias.nome AS categoria
            FROM receitas
            JOIN categorias ON receitas.id_categorias = categorias.id
        `);
        return receitas;
    },

    update: async ({
        id,
        id_usuario,
        id_categoria,
        nome,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes
    }: {
        id: number;
        id_usuario?: number;
        id_categoria?: number;
        nome?: string;
        tempo_preparo_minutos?: number;
        porcoes?: number;
        modo_preparo?: string;
        ingredientes?: string;
    }) => {
        const db = await openDatabase();
        
        const updates: string[] = [];
        const values: (number | string)[] = [];
        
        if (id_usuario !== undefined) {
            updates.push('id_usuarios = ?');
            values.push(id_usuario);
        }
        if (id_categoria !== undefined) {
            updates.push('id_categorias = ?');
            values.push(id_categoria);
        }
        if (nome !== undefined) {
            updates.push('nome = ?');
            values.push(nome);
        }
        if (tempo_preparo_minutos !== undefined) {
            updates.push('tempo_preparo_minutos = ?');
            values.push(tempo_preparo_minutos);
        }
        if (porcoes !== undefined) {
            updates.push('porcoes = ?');
            values.push(porcoes);
        }
        if (modo_preparo !== undefined) {
            updates.push('modo_preparo = ?');
            values.push(modo_preparo);
        }
        if (ingredientes !== undefined) {
            updates.push('ingredientes = ?');
            values.push(ingredientes);
        }
        
        updates.push('alterado_em = datetime("now")');
        
        if (updates.length === 0) {
            throw new Error(`Nenhum campo para atualizar`);
        }
        
        const result = await db.runAsync(
            `UPDATE receitas SET ${updates.join(', ')} WHERE id = ?`,
            [...values, id]
        );
        
        if (result.changes === 0) {
            throw new Error(`Receita com id ${id} não encontrada ou não houve alterações`);
        }
    },

    delete: async (id: number) => {
        const db = await openDatabase();
        await db.runAsync(`DELETE FROM receitas WHERE id = ?`, [id]);
        return true;
    }
};
