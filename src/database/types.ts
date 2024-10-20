import { FileID, FolderID, UserID } from "./ID";

export type TFileType = "image" | "pdf" | "code" | "audio" | "video" | "other";

export type TFolder = {
  user_id: UserID;
  id: FolderID;
  name: string;
  createdAt: Date;
}

export type TFile = {
  user_id: UserID;
  id: FileID;
  name: string;
  type: TFileType;
  size: number;
  local_folder_id: FolderID;
  gdrive_file_id: string;
  createdAt: Date;
}