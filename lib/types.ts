export interface FileItem {
  id: string
  name: string
  type: "file"
  modified: string
  size: string
  path: string[]
  content?: string[] // For simulated PDFs
  file?: File // For actual uploaded files
  url?: string // For blob URLs of uploaded files
}

export interface FolderItem {
  id: string
  name: string
  type: "folder"
  modified: string
  path: string[]
  children?: (FileItem | FolderItem)[]
}

export type Item = FileItem | FolderItem

export type DragItem = {
  id: string
  type: "FILE" | "FOLDER"
  path: string[]
  item: Item
}

