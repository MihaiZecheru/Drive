import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export interface InfoModalState {
  open: boolean;
  title: string;
  message: string;
}

interface InfoModalProps {
  /**
   * If null, the modal will be closed
   */
  state: InfoModalState | null;
  /**
   * If there is a hook keeping track of whether the modal is opened or closed,
   * this function should be called to close the modal.
   */
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ state, onClose } : InfoModalProps) => {
  return (
    <Dialog
      open={state?.open || false}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          minWidth: 'min(425px, 80vw)'
        },
      }}
    >
      <DialogTitle id="error-dialog-title">{state?.title || ''}</DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description">
          {state?.message || ''}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
