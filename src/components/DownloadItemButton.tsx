import { IconButton } from "@mui/material";
import { GetFileFromGDrive } from "../database/GoogleDrive";
import { TFile } from "../database/types";

interface Props {
  file: TFile;
}

const DownloadFileButton = ({ file }: Props) => {
  // Using the anchor tag method
  const downloadBlob = (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadItem = async () => {
    const blob: Blob = await GetFileFromGDrive(file.gdrive_file_id);
    downloadBlob(blob, file.name);
  };

  return (
    <IconButton size="small" onClick={downloadItem}>Download</IconButton>
  );
}
 
export default DownloadFileButton;