import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import type { FileItem, FolderItem, Item } from "@/lib/types"

interface DocumentStore {
  items: Item[]
  currentPath: string[]
  selectedFile: FileItem | null
  addFolder: (name: string, path: string[]) => void
  addFiles: (files: Partial<FileItem>[]) => void
  getCurrentItems: () => Item[]
  setCurrentPath: (path: string[]) => void
  moveItem: (item: Item, targetPath: string[]) => void
  selectFile: (file: FileItem | null) => void
}

// Sample PDF content
const licensePdfContent = [
  "FEDERAL COMMUNICATIONS COMMISSION\nWASHINGTON, D.C. 20554\n\nBROADCAST STATION LICENSE\n\nOfficial Mailing Address:\nWXYZ BROADCASTING CORP\n123 BROADCAST WAY\nNEW YORK NY 10001\n\nFacility Id: 12345\nCall Sign: WXYZ-FM\nLicense File Number: BLH-20240215AAA\n\nThis license expires 3:00 a.m.\nlocal time, February 1, 2032.",

  "Authorizing the operation of a Class B FM station on Channel 230, 93.9 MHz,\nwith an effective radiated power of 50 kW.\nAntenna Height Above Average Terrain: 150 meters\nAntenna Supporting Structure Height: 155 meters\n\nTransmitter Location: 40° 45' 23\" N Latitude\n                      73° 59' 11\" W Longitude\n\nPrincipal community to be served: New York, NY",

  "This authorization is subject to the provisions of the Communications Act of 1934,\nas amended, and the rules and regulations of the Federal Communications Commission.\n\nThis license was granted February 15, 2024.\n\n\nFEDERAL COMMUNICATIONS COMMISSION",
]

const eeoReportContent = [
  "ANNUAL EEO PUBLIC FILE REPORT\nWXYZ BROADCASTING CORP\nWXYZ-FM\nReporting Period: January 1, 2023 to December 31, 2023\n\nNo. of Full-time Employees: 25\nSmall Market Exemption: No",

  "INITIATIVES\n\n1. Participation in at least four job fairs by station personnel who have substantial responsibility in the making of hiring decisions.\n\n   • March 15, 2023: New York Media Job Fair\n   • May 22, 2023: Columbia University Career Day\n   • September 8, 2023: National Association of Broadcasters Career Fair\n   • November 12, 2023: Diversity in Broadcasting Job Fair",

  "2. Establishment of an internship program designed to assist members of the community to acquire skills needed for broadcast employment.\n\n   • Summer 2023: Hosted 4 interns in News, Production, and Engineering departments\n   • Fall 2023: Hosted 3 interns in Marketing and Programming departments",

  "3. Participation in general outreach efforts through media trade groups and educational institutions.\n\n   • Monthly presentations at local high schools about careers in broadcasting\n   • Quarterly workshops on broadcast technology at community colleges\n   • Sponsorship of broadcasting scholarship at New York University",

  "RECRUITMENT INITIATIVES\n\nPosition: Morning Show Producer\nRecruitment Sources: Indeed.com, LinkedIn, NAB Job Board, Employee Referrals\nHiring Source: LinkedIn\n\nPosition: Account Executive\nRecruitment Sources: Indeed.com, LinkedIn, Radio Advertising Bureau, Employee Referrals\nHiring Source: Employee Referral",
]

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  items: [
    {
      id: "1",
      name: "Licenses",
      type: "folder",
      modified: new Date().toISOString(),
      path: ["Home"],
      children: [
        {
          id: uuidv4(),
          name: "Station_License_WXYZ_2024.pdf",
          type: "file",
          modified: new Date("2024-02-15").toISOString(),
          size: "3.2 MB",
          path: ["Home", "Licenses"],
          content: licensePdfContent,
        },
      ],
    },
    {
      id: "2",
      name: "Compliance",
      type: "folder",
      modified: new Date().toISOString(),
      path: ["Home"],
      children: [
        {
          id: uuidv4(),
          name: "Annual_EEO_Report_2023.pdf",
          type: "file",
          modified: new Date("2024-01-20").toISOString(),
          size: "2.8 MB",
          path: ["Home", "Compliance"],
          content: eeoReportContent,
        },
      ],
    },
    {
      id: "3",
      name: "Technical",
      type: "folder",
      modified: new Date().toISOString(),
      path: ["Home"],
      children: [],
    },
  ],
  currentPath: ["Home"],
  selectedFile: null,

  addFolder: (name: string, path: string[]) => {
    const newFolder: FolderItem = {
      id: uuidv4(),
      name,
      type: "folder",
      modified: new Date().toISOString(),
      path,
      children: [],
    }

    set((state) => {
      const newItems = [...state.items]
      let target = newItems

      // Navigate to the correct path
      for (const segment of path.slice(1)) {
        const folder = target.find((item) => item.type === "folder" && item.name === segment) as FolderItem
        if (folder && folder.children) {
          target = folder.children
        }
      }

      target.push(newFolder)
      return { items: newItems }
    })
  },

  addFiles: (files: Partial<FileItem>[]) => {
    const newFiles: FileItem[] = files.map((file) => ({
      id: uuidv4(),
      name: file.name || "Unnamed File",
      type: "file",
      modified: file.modified || new Date().toISOString(),
      size: file.size || "0 KB",
      path: file.path || [...get().currentPath],
      content: file.content,
      file: file.file,
      url: file.url,
    }))

    set((state) => {
      const newItems = [...state.items]
      let target = newItems

      // Navigate to the correct path
      for (const segment of get().currentPath.slice(1)) {
        const folder = target.find((item) => item.type === "folder" && item.name === segment) as FolderItem
        if (folder && folder.children) {
          target = folder.children
        }
      }

      target.push(...newFiles)
      return { items: newItems }
    })
  },

  getCurrentItems: () => {
    const state = get()
    let items = state.items

    // Navigate to the current path
    for (const segment of state.currentPath.slice(1)) {
      const folder = items.find((item) => item.type === "folder" && item.name === segment) as FolderItem
      if (folder && folder.children) {
        items = folder.children
      }
    }

    return items
  },

  setCurrentPath: (path: string[]) => set({ currentPath: path }),

  moveItem: (item: Item, targetPath: string[]) => {
    set((state) => {
      // Create a deep copy of the items array
      const newItems = JSON.parse(JSON.stringify(state.items))

      // Helper function to find an item by path
      const findItemByPath = (items: Item[], path: string[], index = 1): Item | null => {
        if (index >= path.length) return null

        const segment = path[index]
        const folder = items.find((i) => i.type === "folder" && i.name === segment) as FolderItem | undefined

        if (!folder) return null

        if (index === path.length - 1) {
          return folder
        }

        if (folder.children) {
          return findItemByPath(folder.children, path, index + 1)
        }

        return null
      }

      // Helper function to remove item from its current location
      const removeItem = (items: Item[], itemToRemove: Item): boolean => {
        const index = items.findIndex((i) => i.id === itemToRemove.id)

        if (index !== -1) {
          items.splice(index, 1)
          return true
        }

        for (const i of items) {
          if (i.type === "folder" && i.children) {
            if (removeItem(i.children, itemToRemove)) {
              return true
            }
          }
        }

        return false
      }

      // Create a copy of the item with updated path
      const updatedItem = JSON.parse(JSON.stringify(item))
      updatedItem.path = [...targetPath]

      // Remove the item from its current location
      removeItem(newItems, item)

      // Add the item to the target location
      if (targetPath.length === 1) {
        // Adding to root
        newItems.push(updatedItem)
      } else {
        // Find the target folder
        const targetFolder = findItemByPath(newItems, targetPath)

        if (targetFolder && targetFolder.type === "folder") {
          if (!targetFolder.children) {
            targetFolder.children = []
          }
          targetFolder.children.push(updatedItem)
        }
      }

      return { items: newItems }
    })
  },

  selectFile: (file: FileItem | null) => set({ selectedFile: file }),
}))

