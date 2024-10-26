import { GetUserID } from "./GetUser";
import { UploadFileToGDrive } from "./GoogleDrive";
import { FileID, FolderID } from "./ID";
import supabase from "./supabase-config";
import { TFile, TFileType, TFolder } from "./types";

/**
 * Class for interacting with the Supabase database
 */
export default class Database {
  /**
   * @param folder_id The ID of the folder to get the subfolders of
   */
  public static async GetSubfolders(folder_id: FolderID): Promise<TFolder[]> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await supabase
        .from('Folders')
        .select('*')
        .eq('parent_folder_id', folder_id)
        .eq('user_id', await GetUserID());

      if (error)
        reject(error);
      else
        resolve(data as TFolder[]);
    });
  }

  public static async GetFilesInFolder(folder_id: FolderID): Promise<TFile[]> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await supabase
        .from('Files')
        .select('*')
        .eq('folder_id', folder_id)
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

  /**
   * Upload's a file to Google Drive and saves its information to the supabase database
   * @param local_location The ID of the parent folder
   * @returns The TFile object that has information on the uploaded file
   * @throws Error if the upload failed or if the file is too big
   */
  public static async UploadFile(parent_folder_ID: FolderID, file: File): Promise<TFile> {
    const user_id = await GetUserID();
    
    // Will throw error if the upload failed or if the file is too big
    let gdrive_file_id: string;
    gdrive_file_id = await UploadFileToGDrive(file);
    
    const { data, error } = await supabase
      .from('Files')
      .insert({
        user_id,
        name: file.name,
        type: this.GetFileType(file),
        size: file.size,
        folder_id: parent_folder_ID,
        gdrive_file_id
      }).select();

    if (error) throw error;
    return data[0] as TFile;
  }

  private static GetFileType(file: File): TFileType {
    const mimeType = file.type;
    const extension = file.name.split('.').pop()!.toLowerCase();

    const codeExtensions = [
      'js', 'ts', 'py', 'java', 'cpp', 'c', 'cs', 'rb', 'php', 'html', 'css', 'go', 'rs', 'swift', 
      'kt', 'lua', 'sh', 'bat', 'sql', 'pl', 'r', 'xml', 'json', 'yaml', 'yml', 'toml', 'ini',
      'jsx', 'tsx', 'ejs', 'h', 'hpp', 'html', 'php', 'xaml', 'csproj', 'sln', 'c++', 'h++', 'csv'
    ];

    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (mimeType.startsWith('audio/')) {
      return 'audio';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else if (codeExtensions.includes(extension)) {
      return 'code';
    } else if (mimeType === 'text/plain') {
      return 'text';
    } else {
      return 'other';
    }
  }

  /**
   * Every user is given a root folder when they sign up. This function returns the ID of that folder.
   * Used when the user uploads a file while on the /home page.
   * @returns The ID of the user's root folder
   */
  public static async GetUserRootFolderID(): Promise<FolderID> {
    const { data, error } = await supabase
      .from('Folders')
      .select('id')
      .eq('user_id', await GetUserID())
      .eq('name', '__ROOT__');

    if (error) throw error;

    // If the user does not have a root folder, create one
    if (data!.length === 0) {
      const { data, error } = await supabase
        .from('Folders')
        .insert({ user_id: await GetUserID(), name: '__ROOT__', parent_folder_id: null })
        .select('id');

      if (error) throw error;
      return data![0].id as FolderID;
    }

    else return data![0].id as FolderID;
  }

  public static async CreateFolder(name: string, parent_folder_id: FolderID): Promise<TFolder> {
    const user_id = await GetUserID();
    name = name.length === 0 ? 'New folder' : name;

    const { data, error } = await supabase
      .from('Folders')
      .insert({ user_id, name, parent_folder_id })
      .select();

    if (error) throw error;
    return data[0] as TFolder;
  }

  /**
   * Get a file from the supabase database (not from gdrive)
   */
  public static async GetFile(file_id: FileID): Promise<TFile> {
    const { data, error } = await supabase
      .from('Files')
      .select('*')
      .eq('id', file_id)
      .eq('user_id', await GetUserID());

    if (error) throw error;
    if (data!.length === 0) throw new Error('File does not exist');
    return data![0] as TFile;
  }

  /**
   * Check if the given ID corresponds to a folder.
   * 
   * @param folder_id Check if the folder with this ID exists
   * @returns True if the folder with the given ID exists, false otherwise 
   */
  public static async FolderExists(folder_id: FolderID): Promise<boolean> {
    const { data, error } = await supabase
      .from('Folders')
      .select('id')
      .eq('id', folder_id)
      .eq('user_id', await GetUserID());

    if (error) throw error;
    return data!.length !== 0;
  }

  /**
   * Get an entry from the Folders table in the supabase database
   */
  public static async GetFolder(folder_id: FolderID): Promise<TFolder> {
    const { data, error } = await supabase
      .from('Folders')
      .select('*')
      .eq('id', folder_id)
      .eq('user_id', await GetUserID());

    if (error) throw error;
    return data![0] as TFolder;
  }

  /**
   * @param color Default is '#1976d2' 
   */
  public static async SetFolderColor(folder_id: FolderID, color: string = '#1976d2'): Promise<void> {
    const { error } = await supabase
      .from('Folders')
      .update({ color: color })
      .eq('id', folder_id)
      .eq('user_id', await GetUserID())
      
      if (error) throw error;
  }

  /**
   * @param color Default is '#1976d2'
   */
  public static async SetFileColor(file_id: FileID, color: string = '#1976d2'): Promise<void> {
    const { error } = await supabase
      .from('Files')
      .update({ color: color })
      .eq('id', file_id)
      .eq('user_id', await GetUserID());

    if (error) throw error;
  }

  public static async RenameFile(file_id: FileID, new_name: string): Promise<void> {
    const { error } = await supabase
      .from('Files')
      .update({ name: new_name })
      .eq('id', file_id)
      .eq('user_id', await GetUserID());

    if (error) throw error;
  }

  public static async RenameFolder(folder_id: FolderID, new_name: string): Promise<void> {
    const { error } = await supabase
      .from('Folders')
      .update({ name: new_name })
      .eq('id', folder_id)
      .eq('user_id', await GetUserID());

    if (error) throw error;
  }
}