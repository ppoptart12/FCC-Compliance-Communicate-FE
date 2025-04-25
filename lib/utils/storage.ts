import { ScannedDocument } from '../api/documentService'

const STORAGE_KEY = 'fcc_scanned_documents'

export const storage = {
  saveScannedDocuments: (documents: ScannedDocument[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents))
    } catch (error) {
      console.error('Error saving scanned documents:', error)
    }
  },

  getScannedDocuments: (): ScannedDocument[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error retrieving scanned documents:', error)
      return []
    }
  },

  clearScannedDocuments: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing scanned documents:', error)
    }
  },

  removeScannedDocument: (documentId: string) => {
    try {
      const documents = storage.getScannedDocuments()
      const updatedDocuments = documents.filter(doc => doc.id !== documentId)
      storage.saveScannedDocuments(updatedDocuments)
      return updatedDocuments
    } catch (error) {
      console.error('Error removing scanned document:', error)
      return []
    }
  }
} 