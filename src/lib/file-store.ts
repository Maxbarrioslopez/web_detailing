import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

const STORE_DIRECTORY = path.join(process.cwd(), 'content', 'garage-demo')

const ensureStoreDirectory = async () => {
  await mkdir(STORE_DIRECTORY, { recursive: true })
}

const getStoreFilePath = (fileName: string) => path.join(STORE_DIRECTORY, fileName)

export const readStoreFile = async <T>(fileName: string, fallback: T): Promise<T> => {
  await ensureStoreDirectory()

  const filePath = getStoreFilePath(fileName)

  try {
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    await writeStoreFile(fileName, fallback)
    return fallback
  }
}

export const writeStoreFile = async <T>(fileName: string, data: T) => {
  await ensureStoreDirectory()

  const filePath = getStoreFilePath(fileName)
  const tempPath = `${filePath}.${process.pid}.${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`

  await writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

export const getStoreDirectory = () => STORE_DIRECTORY
