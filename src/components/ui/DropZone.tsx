'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, Music, Image, X, Loader2 } from 'lucide-react'

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  isUploading?: boolean
}

interface FileWithPreview extends File {
  preview?: string
}

export function DropZone({
  onFilesSelected,
  accept = '.pdf,.doc,.docx,.mp3,.wav,.m4a,.jpg,.jpeg,.png',
  multiple = true,
  maxFiles = 20,
  maxSize = 50,
  isUploading = false,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [error, setError] = useState<string | null>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const getFileTypeLabel = (type: string) => {
    if (type === 'application/pdf') return 'PDF'
    if (type.includes('word')) return 'Word'
    if (type.startsWith('audio/')) return 'Audio'
    if (type.startsWith('image/')) return 'Image'
    return 'Fichier'
  }

  const validateFiles = (fileList: File[]): File[] => {
    setError(null)
    
    const validFiles: File[] = []
    
    for (const file of fileList) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`${file.name} est trop volumineux (max ${maxSize}MB)`)
        continue
      }
      
      validFiles.push(file)
    }

    // Check total file count
    if (files.length + validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} fichiers autorisés`)
      return validFiles.slice(0, maxFiles - files.length)
    }

    return validFiles
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      const validFiles = validateFiles(droppedFiles)
      
      if (validFiles.length > 0) {
        const newFiles = [...files, ...validFiles]
        setFiles(newFiles)
        onFilesSelected(newFiles)
      }
    },
    [files, maxFiles, maxSize, onFilesSelected]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = validateFiles(selectedFiles)
      
      if (validFiles.length > 0) {
        const newFiles = [...files, ...validFiles]
        setFiles(newFiles)
        onFilesSelected(newFiles)
      }
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          drop-zone relative p-8 text-center
          ${isDragging ? 'drag-over border-indigo-500 bg-indigo-500/10' : ''}
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
          )}
          
          <div>
            <p className="text-lg font-medium">
              {isUploading ? 'Upload en cours...' : 'Glissez vos fichiers ici'}
            </p>
            <p className="text-sm text-white/50 mt-1">
              ou cliquez pour sélectionner
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">PDF</span>
            <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">Word</span>
            <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">Audio</span>
            <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">Images</span>
          </div>
          
          <p className="text-xs text-white/30">
            Max {maxFiles} fichiers • {maxSize}MB par fichier
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/70">
            {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/70">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-white/40">
                    {getFileTypeLabel(file.type)} • {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
