/**
 * @param file A javascript File object from an input element
 * @returns The ID of the uploaded file in Google Drive
 */
export async function UploadFileToGDrive(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  return await fetch('http://localhost:3005/gdrive/upload', {
    method: 'POST',
    body: formData
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error. status: ${res.status}`);
      }

      const { fileId } = await res.json();
      return fileId;
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Failed to upload file to Google Drive');
    });
}

/**
 * Get a file from Google Drive in Blob format. Used for downloading.
 * @param fileID The ID of the file in google drive
 */
export async function GetFileFromGDrive(fileID: string): Promise<Blob> {
  return await fetch(`http://localhost:3005/gdrive/download/${fileID}`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error. status: ${res.status}`);
      }

      return await res.blob();
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Failed to download file from Google Drive');
    });
}
