import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetFileFromGDrive } from "../database/GoogleDrive";
import useInfoModal from "./base/useInfoModal";
import supabase from "../database/supabase-config";

const ShareFile = () => {
  const { id } = useParams();
  const [downloadFinished, setDownloadFinished] = useState(false);
  const { showInfoModal } = useInfoModal();

  useEffect(() => {
    if (!id) return;

    GetFileFromGDrive(id).then(async (blob: Blob) => {
      const { data, error } = await supabase
        .from('Files')
        .select('name')
        .eq('gdrive_file_id', id)
        .single();

      if (error) {
        console.error(error);
        throw new Error('Failed to download file.');
      }

      return { blob, name: data.name };
    }).then((fileData: { blob: Blob, name: string }) => {
      const url = URL.createObjectURL(fileData.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((err) => {
      console.error(err);
      showInfoModal('Error', 'Failed to download file.');
    }).finally(() => {
      setDownloadFinished(true);
    });
  }, [id, showInfoModal]);

  if (!id) {
    return (
      <div style={{ overflow: 'hidden' }}>
        <h1 style={{ marginLeft: '1rem' }}>File ID not given</h1>
      </div>
    );
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <h1 style={{ marginLeft: '1rem' }}>{downloadFinished ? 'Download finished' : 'Downloading file... please be patient' }</h1>
      {!downloadFinished && <p style={{ marginLeft: '1rem' }}>
        Don't worry if there's no download indicator. It's happening behind the scenes
      </p>}
    </div>
  );
}
 
export default ShareFile;