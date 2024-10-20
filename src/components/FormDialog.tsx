import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  _open: boolean;
  _setOpen: (open: boolean) => void;
  onFolderNameSubmit: (folder_name: string) => void;
}

export default function CreateFolderModal({ _open, _setOpen, onFolderNameSubmit }: Props) {
  const [open, setOpen] = React.useState<boolean>(_open);

  const handleClose = () => {
    setOpen(false);
    _setOpen(false);
  };

  // Use useEffect to sync the open state with the _open prop
  React.useEffect(() => {
    setOpen(_open);
  }, [_open]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          style: { width: '350px' },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const folder_name = formJson.folder_name;

            if (folder_name === '__ROOT__') {
              alert('Cannot create folder with name "__root__"');
              return;
            }

            handleClose();
            onFolderNameSubmit(folder_name.trim());
          },
        }}
      >
        <DialogTitle>Create Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="folder_name"
            label="Folder Name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create Folder</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
