import "dotenv/config"
import{migrate} from "drizzle-orm/node-postgres/migrator";

import db, {client} from "./db";
async function migration() {
    console.log("======== Migrations started ========")
    await migrate(db,{migrationsFolder : __dirname + "/migrations"})
    console.log("======== Migrations ended ========")
    
}

migration() .catch((err)  => {
    console.error(err)
    process.exit(0)
}) 
