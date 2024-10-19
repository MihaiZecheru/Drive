import IconButton from "@mui/material/IconButton";
import { FileID, FolderID } from "../database/ID";
import useInfoModal from "./base/useInfoModal";
import Database from "../database/Database";

interface Props {
  itemID: FolderID | FileID;
  itemType: "folder" | "file";
  removeItemCallback: (itemID: FolderID | FileID) => void;
}

const DeleteItemButton = ({ itemID, itemType, removeItemCallback }: Props) => {
  const { showInfoModal } = useInfoModal();
  
  const deleteItem = async (itemID: FolderID | FileID) => {
    let promise: Promise<void>;
    if (itemType === "folder") {
      promise = Database.DeleteFolder(itemID);
    } else {
      promise = Database.DeleteFile(itemID as FileID);
    }

    promise
      .then(() => removeItemCallback(itemID))
      .catch((error) => {
        showInfoModal("Failed to delete folder", error.message);
      });
  };
  
  return (
    <IconButton size="small" onClick={() => deleteItem(itemID)}>Delete</IconButton>
  );
}
 
export default DeleteItemButton;