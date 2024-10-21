import { IconButton } from "@mui/material";
import { FileID, FolderID } from "../database/ID";
import { useNavigate } from "react-router-dom";

interface Props {
  itemID: FolderID | FileID;
  itemType: 'folder' | 'file';
}

const OpenItemButton = ({ itemID, itemType }: Props) => {
  const navigate = useNavigate();
  
  const openItem = () => {
    navigate(`/${itemType}/${itemID}`);
  };
  
  return (
    <IconButton size="small" onClick={openItem}>{ itemType === 'folder' ? 'Open' : 'View'}</IconButton>
  );
}
 
export default OpenItemButton;