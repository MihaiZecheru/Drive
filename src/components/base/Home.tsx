import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import '../../styles/Home.css';
import Folder from '../FolderCard';
import File from '../FileCard';
import { CircularProgress, Paper, Skeleton, Tooltip } from '@mui/material';
import Database from '../../database/Database';
import { TFile, TFolder } from '../../database/types';
import { useEffect, useState } from 'react';
import useInfoModal from './useInfoModal';
import { FolderID } from '../../database/ID';
import CreateFolderModal from '../FormDialog';
import useWindowSize from '../useWindowSize';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FolderGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1rem',
  padding: '1rem',
  placeItems: 'center',
});

const Home = () => {
  const { showInfoModal } = useInfoModal();
  const [createFolderModalIsOpen, setCreateFolderModalIsOpen] = useState<boolean>(false);
  const [rootFolderID, setRootFolderID] = useState<FolderID>(null as unknown as FolderID);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [folders, setFolders] = useState<TFolder[]>([]);
  const [files, setFiles] = useState<TFile[]>([]);
  const { width } = useWindowSize();

  // Card height + 1rem
  const skeletonHeight = 136;
  // Card width + 1rem
  const skeletonWidth = 316;
  // Screen height - Navbar height, which is 6rem
  const folderGridHeight = window.innerHeight - (6 * 16);
  // Screen width - 2rem padding
  const folderGridWidth = window.innerWidth - (2 * 16);
  // Dynamically calculate how many skeletons to render
  const skeletonCount = Math.ceil(folderGridHeight / skeletonHeight) * Math.ceil(folderGridWidth / skeletonWidth);

  const removeFolder = (folderID: FolderID) => {
    setFolders(folders.filter((folder) => folder.id !== folderID));
  };

  const removeFile = (fileID: string) => {
    setFiles(files.filter((file) => file.id !== fileID));
  };

  const uploadFiles = (_files: File[]) => {
    setUploadingCount(_files.length);
    // any file uploaded on this page goes in the root folder
    const filePromises = _files.map(async (file: File) => Database.UploadFile(rootFolderID, file));
    
    Promise.all(filePromises)
      .then((_files: TFile[]) => {
        setFiles([...files, ..._files]);
        setUploadingCount(0);
      })
      .catch((error) => {
        console.error(error);
        showInfoModal("Failed to upload files", error.message);
        setUploadingCount(0);
      });
  };

  // 1.5 seconds min loading time
  const minimum_load_time: number = 1500;

  useEffect(() => {
    const start = new Date().getTime();
    Database.GetAllFolders()
      .then((folders: TFolder[]) => {
        setFolders(folders.filter((folder) => folder.name !== '__ROOT__'));
      })
      .catch((error) => {
        console.error(error);
        showInfoModal("Failed to load folders", error.message);
      });

    Database.GetUserRootFolderID()
      .then((folderID: FolderID) => setRootFolderID(folderID));

    Database.GetAllFiles()
      .then((files: TFile[]) => {
        setFiles(files);
        const end = new Date().getTime();
        if (end - start < minimum_load_time) {
          setTimeout(() => setLoading(false), minimum_load_time - (end - start));
        } else setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showInfoModal("Failed to load files", error.message);
      });
  }, [showInfoModal]);

  const launchCreateFolderPopup = () => {
    setCreateFolderModalIsOpen(true);
  };

  const createFolder = (folder_name: string) => {
    Database.CreateFolder(folder_name, rootFolderID)
      .then((folder: TFolder) => {
        setFolders([...folders, folder]);
        setCreateFolderModalIsOpen(false);
      })
      .catch((error: Error) => {
        console.error(error);
        showInfoModal("Failed to create folder", error.message);
      });
  };
  
  return (
    <div className="home" style={{
      overflow: 'hidden',
    }}>
      <CreateFolderModal
        _open={createFolderModalIsOpen}
        _setOpen={setCreateFolderModalIsOpen}
        onFolderNameSubmit={(folder_name: string) => createFolder(folder_name)}
      />

      <Paper elevation={24} sx={{
        width: 'auto',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowY: 'hidden',
        backgroundColor: '#1976d2',
      }}>
        <Tooltip title="Currently viewing the root folder" placement='left-end'>
          <h1 style={{ 'margin': 0, color: 'white' }} className="no-highlight">Saved Documents</h1>
        </Tooltip>
        <div className="header-buttons">
          <Paper elevation={3} sx={{ marginRight: '1rem' }}>
            <Button
              component="label"
              role='button'
              variant="contained"
              tabIndex={-1}
              startIcon={<CreateNewFolderIcon />}
              onClick={launchCreateFolderPopup}
              style={{
                backgroundColor: '#6A7F98',
                color: 'white',
              }}
            >
              { width > 705 ? 'Create Folder' : '' }
            </Button>
          </Paper>
          <Paper elevation={3}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{
                backgroundColor: '#6A7F98',
                color: 'white'
              }}
            >
              <span style={uploadingCount > 0 ? { marginRight: '.5rem' } : undefined}>
                { width > 705 ? 'Upload Files' : '' }
              </span>
              { uploadingCount > 0 && <CircularProgress size={20} color='inherit'/> }
              <VisuallyHiddenInput
                type="file"
                onChange={(event: any) => uploadFiles(Array.from(event.target.files))}
                multiple
                disabled={uploadingCount > 0}
              />
            </Button>
          </Paper>
        </div>
      </Paper>

      <FolderGrid className="folder-grid">
        {
          loading && 
          // Render enough Skeletons to fill the screen
          Array(skeletonCount).fill(0).map((_, index) => (
            <Skeleton 
              key={index}
              variant="rectangular" 
              width={300} 
              height={120} 
              sx={{ borderRadius: '.5rem' }} 
            />
          ))
        }

        {
          !loading && folders.length === 0 && files.length === 0 && (
            <h2>No folders or files found</h2>
          )
        }

        {
          !loading && folders.map((folder: TFolder, index: number) => {
            return <Folder
              key={index}
              name={folder.name}
              folderID={folder.id}
              removeItemCallback={removeFolder}
            />
          })
        }

        {
          !loading && files.map((file: TFile, index: number) => {
            return <File
              key={index}
              file={file}
              removeItemCallback={removeFile}
            />
          })
        }

        {
          uploadingCount > 0 && new Array(uploadingCount).fill(0).map((_, index) => (
            <Tooltip title={`Uploading file${uploadingCount === 0 ? '' : 's'}... please be patient`} placement='top' key={`tooltip-${index}`}>
              <Skeleton
                key={`skeleton-${index}`}
                variant="rectangular" 
                width={300} 
                height={120} 
                sx={{ borderRadius: '.5rem' }}
              />
            </Tooltip>
          ))
        }
      </FolderGrid>

    </div>
  );
}
 
export default Home;