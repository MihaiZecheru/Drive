import { FileID, FolderID, UserID } from "./ID";

export type TFileType = "image" | "pdf" | "code" | "text" | "audio" | "video" | "other";

/**
 * Represents an entry in the Folders table of the supabase database.
 */
export type TFolder = {
  user_id: UserID;
  id: FolderID;
  name: string;
  color: string; // hex
  createdAt: Date;
  parent_folder_id: FolderID | null;
}

/**
 * Represents an entry in the Files table of the supabase database.
 */
export type TFile = {
  user_id: UserID;
  id: FileID;
  name: string;
  type: TFileType;
  color: string; // hex
  size: number;
  folder_id: FolderID;
  gdrive_file_id: string;
  createdAt: Date;
}