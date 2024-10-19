import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../../styles/Home.css';
import Folder from '../FolderCard';
import File from '../FileCard';
import { Paper, Skeleton } from '@mui/material';
import Database from '../../database/Database';
import { TFile, TFolder } from '../../database/types';
import { useEffect, useState } from 'react';
import useInfoModal from './useInfoModal';
import { FolderID } from '../../database/ID';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [folders, setFolders] = useState<TFolder[]>([]);
  const [files, setFiles] = useState<TFile[]>([]);

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
    // any file uploaded on this page goes in the root folder
    const filePromises = _files.map((file: File) => Database.UploadFile('/', file));
    
    Promise.all(filePromises)
      .then((_files: TFile[]) => {
        setFiles([...files, ..._files]);
      })
      .catch((error) => {
        console.error(error);
        showInfoModal("Failed to upload files", error.message);
      });
  };

  // 1.5 seconds min loading time
  const minimum_load_time: number = 1500;

  useEffect(() => {
    const start = new Date().getTime();
    Database.GetAllFolders()
      .then((folders: TFolder[]) => {
        setFolders(folders);
      })
      .catch((error) => {
        console.error(error);
        showInfoModal("Failed to load folders", error.message);
      });

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

  return (
    <div className="home" style={{
      overflow: 'hidden',
    }}>

      <Paper elevation={24} sx={{
        width: 'auto',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowY: 'hidden',
        backgroundColor: '#1976d2',
      }}>
        <h1 style={{ 'margin': 0, color: 'white' }}>Saved Documents</h1>
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
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={(event: any) => uploadFiles(Array.from(event.target.files))}
              multiple
            />
          </Button>
        </Paper>
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
          !loading && folders.map((folder: TFolder) => {
            return <Folder name={folder.name} folderID={folder.id} removeItemCallback={removeFolder} />
          })
        }

        {
          !loading && files.map((file: TFile) => {
            return <File name={file.name} fileType={file.fileType} fileID={file.id} removeItemCallback={removeFile} />
          })
        }
      </FolderGrid>

    </div>
  );
}
 
export default Home;