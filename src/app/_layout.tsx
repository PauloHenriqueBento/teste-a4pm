import { SessionProvider } from "@/core/ctx"
import { initializeDatabase } from "@/database/initializeDatabase"
import { Slot } from "expo-router"
import { SQLiteProvider } from "expo-sqlite"

export default function Root() {

    return (
        <SQLiteProvider
            databaseName="teste_receitas_rg_sistemas.db"
            onInit={initializeDatabase}>
            <SessionProvider>
                <Slot />
            </SessionProvider>
        </SQLiteProvider>
    )
}