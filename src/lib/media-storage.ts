import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { isVercelRuntime } from '@/lib/runtime-config'

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads')

const sanitizeFileName = (fileName: string) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const ensureDirectory = async (directoryName: string) => {
  const fullDirectory = path.join(UPLOAD_ROOT, directoryName)
  await mkdir(fullDirectory, { recursive: true })
  return fullDirectory
}

const buildPublicPath = (directoryName: string, fileName: string) => `/uploads/${directoryName}/${fileName}`

const toDataUrl = (buffer: Buffer, mimeType: string) =>
  `data:${mimeType || 'application/octet-stream'};base64,${buffer.toString('base64')}`

export const saveUploadedImage = async (file: File, directoryName = 'gallery') => {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (isVercelRuntime()) {
    return toDataUrl(buffer, file.type)
  }

  const targetDirectory = await ensureDirectory(directoryName)
  const safeFileName = sanitizeFileName(file.name || 'image-upload')
  const uniqueFileName = `${Date.now()}-${safeFileName}`
  const outputPath = path.join(targetDirectory, uniqueFileName)

  await writeFile(outputPath, buffer)

  return buildPublicPath(directoryName, uniqueFileName)
}

export const replaceStoredImage = async (
  currentPath: string,
  nextFile: File,
  directoryName = 'gallery',
) => {
  const nextPath = await saveUploadedImage(nextFile, directoryName)

  if (currentPath && currentPath.startsWith('/uploads/') && !isVercelRuntime()) {
    const currentFilePath = path.join(process.cwd(), 'public', currentPath.replace(/^\//, ''))

    try {
      await unlink(currentFilePath)
    } catch {
      // Ignore missing files in demo mode.
    }
  }

  return nextPath
}

export const deleteStoredImage = async (publicPath: string) => {
  if (!publicPath.startsWith('/uploads/') || isVercelRuntime()) {
    return
  }

  const absolutePath = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))

  try {
    await unlink(absolutePath)
  } catch {
    // Ignore missing files in demo mode.
  }
}
