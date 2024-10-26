import { IconButton } from "@mui/material";
import { GetFileFromGDrive } from "../database/GoogleDrive";
import { TFile } from "../database/types";
import useInfoModal from "./base/useInfoModal";

interface Props {
  file: TFile;
}

const DownloadFileButton = ({ file }: Props) => {
  const showInfoModal = useInfoModal();

  const downloadItem = async () => {
    await GetFileFromGDrive(file.gdrive_file_id).then((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }).catch((err) => {
      console.error(err);
      showInfoModal('Error', 'Failed to download file.');
    });
  };

  return (
    <IconButton size="small" onClick={downloadItem}>Download</IconButton>
  );
}
 
export default DownloadFileButton;