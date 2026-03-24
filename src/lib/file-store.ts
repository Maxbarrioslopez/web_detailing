import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { isVercelRuntime } from '@/lib/runtime-config'

const LOCAL_STORE_DIRECTORY = path.join(process.cwd(), 'content', 'garage-demo')
const EPHEMERAL_STORE_DIRECTORY = path.join(tmpdir(), 'garage-demo')

const getStoreDirectories = () => {
  const orderedDirectories = isVercelRuntime()
    ? [EPHEMERAL_STORE_DIRECTORY, LOCAL_STORE_DIRECTORY]
    : [LOCAL_STORE_DIRECTORY, EPHEMERAL_STORE_DIRECTORY]

  return [...new Set(orderedDirectories)]
}

const ensureStoreDirectory = async (directory: string) => {
  await mkdir(directory, { recursive: true })
}

const getStoreFilePath = (directory: string, fileName: string) => path.join(directory, fileName)

const writeJsonAtomically = async <T>(filePath: string, data: T) => {
  const tempPath = `${filePath}.${process.pid}.${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`

  await writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

export const readStoreFile = async <T>(fileName: string, fallback: T): Promise<T> => {
  let lastError: unknown = null

  for (const directory of getStoreDirectories()) {
    try {
      await ensureStoreDirectory(directory)

      const filePath = getStoreFilePath(directory, fileName)

      try {
        const raw = await readFile(filePath, 'utf8')
        return JSON.parse(raw) as T
      } catch {
        await writeJsonAtomically(filePath, fallback)
        return fallback
      }
    } catch (error) {
      lastError = error
    }
  }

  if (lastError) {
    console.error('Demo store fallback failed, using in-memory data:', lastError)
  }

  return fallback
}

export const writeStoreFile = async <T>(fileName: string, data: T) => {
  let lastError: unknown = null

  for (const directory of getStoreDirectories()) {
    try {
      await ensureStoreDirectory(directory)

      const filePath = getStoreFilePath(directory, fileName)
      await writeJsonAtomically(filePath, data)
      return
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('No pudimos escribir en el almacenamiento demo.')
}

export const getStoreDirectory = () => getStoreDirectories()[0]
