export default async function UploadFileToGDrive(file: File): Promise<string> {
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
