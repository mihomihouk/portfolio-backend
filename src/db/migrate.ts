import {readdir, readFile} from 'fs/promises'
import path from 'path'
import {db} from './index'

async function migrate(){
    const migrationFolder = path.join(__dirname, '../migrations')
    try{
        const filenames = await readdir(migrationFolder)
        const sqlFilenames = filenames.filter((filename)=>filename.endsWith('.sql'))
        const sortedFilenames = sqlFilenames.sort((a, b)=>Number(a.substring(0, 3)) - Number(b.substring(0, 3)))
        for(const filename of sortedFilenames){
            const data = await readFile(path.join(migrationFolder, filename), 'utf8')
            await db.query(data)
        }
        await db.end()
        process.exit(0)
    }catch(err){
        console.error(err)
        await db.end()
        process.exit(1)
    }
}

migrate()