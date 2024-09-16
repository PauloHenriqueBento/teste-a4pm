// src/services/categoriasService.tsimport { openDatabase } from "@/database/openDatabase";
import { openDatabase } from "@/database/openDatabase";


export const categoriasService = {
    async getCategorias() {
        const db = await openDatabase();
        try {
            const data = await db.getAllAsync(`
                SELECT id, nome FROM categorias
            `);
            return data;
        } catch (error) {
            throw new Error("Erro ao buscar categorias: " + error.message);
        }
    }
};
