import { FileID, FolderID } from "./ID";

export type TFolder = {
  id: FolderID;
  name: string;
  createdAt: Date;
}

export type TFileType = "image" | "pdf" | "code" | "audio" | "video" | "other";

export type TFile = Omit<TFolder, 'id'> & {
  id: FileID;
  fileType: TFileType;
}