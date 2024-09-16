import * as SQLite from 'expo-sqlite';


export const openDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('teste_receitas_rg_sistemas.db');
    return db;
  };