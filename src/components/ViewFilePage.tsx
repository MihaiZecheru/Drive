import { Box, Button, Paper, Popper, Skeleton, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Database from "../database/Database";
import { TFile } from "../database/types";
import useInfoModal from './base/useInfoModal';
import { FileID, FolderID } from "../database/ID";
import FileDetailsCard from "./FileDetailsCard";
import { GetFileFromGDrive } from "../database/GoogleDrive";

const ViewFilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showInfoModal } = useInfoModal();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<TFile | null>(null);
  const [fileDoesntExist, setFileDoesntExist] = useState(false);
  const [contentBlob, setContentBlob] = useState<Blob | null>(null);
  const [userRootFolderID, setUserRootFolderID] = useState<FolderID | null>(null);

  const popperAnchor = useRef<HTMLButtonElement | null>(null);
  const [popperOpen, setPopperOpen] = useState(false);

  useEffect(() => {
    const min_loading_time = 1500;
    const start_ms = Date.now();

    Database.GetFile(id as FileID)
      .then((_file: TFile) => {
        if (Date.now() - start_ms < min_loading_time) {
          setTimeout(() => setLoading(false), min_loading_time - (Date.now() - start_ms));
        }

        setFile(_file);
        GetFileFromGDrive(_file.gdrive_file_id)
          .then((blob: Blob) => setContentBlob(blob));
        Database.GetUserRootFolderID()
          .then((folderID: FolderID) => setUserRootFolderID(folderID));
      })
      .catch((error: Error) => {
        if (error.message === 'File does not exist') {
          setFileDoesntExist(true);
        } else {
          showInfoModal('Error', 'Internal server error.');
        }
        
        if (Date.now() - start_ms < min_loading_time) {
          setTimeout(() => setLoading(false), min_loading_time - (Date.now() - start_ms));
        }
      });
  }, [id, showInfoModal, navigate]);


  if (!id || id.length === 0) {
    return (
      <div className="viewFilePage" style={{ overflow: 'hidden', width: '100vw', height: '100vh' }}>
        <h1 style={{ marginLeft: '1rem',  }}>Invalid file ID</h1>
      </div>
    );
  }

  return (
    <div style={{ overflow: 'hidden', width: '100vw', height: '100vh' }}>
    {
      fileDoesntExist && !loading
      ? <div className="viewFilePage" style={{ overflow: 'none' }}>
          <h1 style={{ marginLeft: '1rem' }}>File does not exist</h1>
        </div>
      :
        <Box
          className="viewFilePage"
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100vw"
        >
          <div>
            {
              loading &&
              <Skeleton 
                variant="rectangular" 
                width={300} 
                height={120} 
                sx={{ borderRadius: '.5rem' }} 
              />
            }

            { !loading &&
              <FileDetailsCard
                file={file as TFile}
                width={contentBlob ? '100%' : '300px'}
                userRootFolderID={userRootFolderID}
              />
            }

            {
              !loading && (file!.type === 'image' || file!.type === 'video') && !contentBlob &&
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Skeleton variant="rectangular" width={300} height={300} />
              </div>
            }

            {
              !loading && (file!.type === 'image' || file!.type === 'video') && contentBlob &&
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                
                <img
                  src={URL.createObjectURL(contentBlob)}
                  alt={file!.name}
                  style={{ maxWidth: '100%', maxHeight: '50vh' }}
                />
              </div>
            }
          </div>
        </Box>
      }

      <div style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Tooltip title="Go to the home page" placement="top">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/home')}
            sx={{ marginRight: '1rem' }}
          >
            Home
          </Button>
        </Tooltip>
        {
          !fileDoesntExist && !loading &&
          <div>
            <Tooltip title="Open the folder this file is in" placement="top">
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: '1rem' }}
                onClick={() => {
                  if (userRootFolderID && file?.folder_id === userRootFolderID)
                    navigate('/home');
                  else
                    navigate(`/folder/${file?.folder_id}`)
                }}
              >
                Open Folder
              </Button>
            </Tooltip>

            <Tooltip title="Share this file with a friend" placement="top">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `drive.mzecheru.com/share/${file!.gdrive_file_id}`
                  );
                  setPopperOpen(true);
                  setTimeout(() => setPopperOpen(false), 2000);
                }}
                ref={popperAnchor}
              >
                Copy Download Link
              </Button>
            </Tooltip>

            <Popper
              open={popperOpen}
              anchorEl={popperAnchor.current}
              placement="right-end"
            >
              <Paper sx={{ marginLeft: '1rem', backgroundColor: '#4caf50' }}>
                <Typography sx={{ p: 2 }}>Copied</Typography>
              </Paper>
            </Popper>
          </div>
        }
      </div>
    </div>
  );
}
 
export default ViewFilePage;