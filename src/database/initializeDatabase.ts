import { type SQLiteDatabase } from "expo-sqlite";

interface CategoryCount {
    total: number;
}

type CategoryCountResult = CategoryCount | null;

export async function initializeDatabase(database: SQLiteDatabase) {
    const transactions = [
        `CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            login TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            criado_em DATETIME NOT NULL,
            alterado_em DATETIME NOT NULL
        );`,

        `CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE
        );`,

        `CREATE TABLE IF NOT EXISTS receitas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuarios INTEGER NOT NULL,
            id_categorias INTEGER,
            nome TEXT,
            tempo_preparo_minutos INTEGER,
            porcoes INTEGER,
            modo_preparo TEXT NOT NULL,
            ingredientes TEXT,
            criado_em DATETIME NOT NULL,
            alterado_em DATETIME NOT NULL,
            FOREIGN KEY (id_usuarios) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            FOREIGN KEY (id_categorias) REFERENCES categorias(id) ON DELETE CASCADE ON UPDATE CASCADE
        );`,
    ];
    for (const transaction of transactions) {
        await database.execAsync(transaction);
    }

    const hasCategories: CategoryCountResult = await database.getFirstAsync('SELECT COUNT(*)  AS total FROM categorias');
    if (hasCategories && hasCategories.total === 0) {
        const categories = [
            { id: 1, nome: 'Bolos e tortas doces' },
            { id: 2, nome: 'Carnes' },
            { id: 3, nome: 'Aves' },
            { id: 4, nome: 'Peixes e frutos do mar' },
            { id: 5, nome: 'Saladas, molhos e acompanhamentos' },
            { id: 6, nome: 'Sopas' },
            { id: 7, nome: 'Massas' },
            { id: 8, nome: 'Bebidas' },
            { id: 9, nome: 'Doces e sobremesas' },
            { id: 10, nome: 'Lanches' },
            { id: 11, nome: 'Prato Único' },
            { id: 12, nome: 'Light' },
            { id: 13, nome: 'Alimentação Saudável' }
        ];

        for (const category of categories) {
            await database.runAsync(
                'INSERT INTO categorias (id, nome) VALUES (?, ?)',
                category.id,
                category.nome
            );
        }
        console.log('Categorias inseridas com sucesso!');
    } else {
        console.log('Categorias já existem.');
    }
}