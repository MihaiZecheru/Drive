import { GetUserID } from "./GetUser";
import { FileID, FolderID } from "./ID";
import supabase from "./supabase-config";
import { TFile, TFolder } from "./types";

export default class Database {
  public static async GetAllFolders(): Promise<TFolder[]> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await supabase
        .from('Folders')
        .select('*')
        .eq('user_id', await GetUserID());

      if (error)
        reject(error);
      else
        resolve(data as TFolder[]);
    });
  }

  public static async GetAllFiles(): Promise<TFile[]> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await supabase
        .from('Files')
        .select('*')
        .eq('user_id', await GetUserID());

      if (error)
        reject(error);
      else
        resolve(data as TFile[]);
    });
  }

  public static async DeleteFolder(folderID: FolderID): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const { error } = await supabase
        .from('Folders')
        .delete()
        .eq('user_id', await GetUserID())
        .eq('id', folderID);

      if (error)
        reject(error);
      else
        resolve();
    });
  }

  public static async DeleteFile(fileID: FileID): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const { error } = await supabase
        .from('Files')
        .delete()
        .eq('user_id', await GetUserID())
        .eq('id', fileID);

      if (error)
        reject(error);
      else
        resolve();
    });
  }

  public static async UploadFile(location: string, file: File): Promise<TFile> {
    // TODO: Upload file to google drive
    return {} as TFile;
  }
}