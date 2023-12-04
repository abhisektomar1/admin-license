import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
// @types
import { Case, category } from '../../@types/user';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { TableMoreMenu } from 'src/components/table';
import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";

// ----------------------------------------------------------------------

type Props = {
  row: category;
  // selected: boolean;
  // onEditRow: VoidFunction;
  // onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  onDeleteRow,
}: Props) {
  const { id, title, fid } = row;
  

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };


  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
      setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
      setOpenMenuActions(null);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const db = getFirestore()


   const toYes = async () => {
    await deleteDoc(doc(db, "category", fid));
      onDeleteRow();
      handleCloseMenu();
      setOpen(false);
      
  };
  return (
    <>
      <TableRow hover>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
      <TableCell align="left">{id}</TableCell>
        <TableCell align="center">{title}</TableCell>

        
   
        {/* <TableCell align="left">
          <Label
            variant="soft"
            color={status === false ? 'error' : 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status === true ? 'Active' : 'Draft' }
          </Label>
        </TableCell> */}

        <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Are you sure to delete this case?'}
          </DialogTitle>
          <DialogActions>
            <Button variant="contained" onClick={toYes}>
              Yes
            </Button>
            <Button variant="contained" onClick={handleClose} autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </>
        <TableCell align="right">
                <TableMoreMenu
                    open={openMenu}
                    onOpen={handleOpenMenu}
                    onClose={handleCloseMenu}
                    actions={
                        <>
                            <MenuItem
                                onClick={() => {
                                  
                                  handleClickOpen();
                            
                                }}
                                sx={{ color: 'error.main' }}
                            >
                                <Iconify icon={'eva:trash-2-outline'} />
                                Delete
                            </MenuItem>
                        </>
                    }
                />
            </TableCell>
      </TableRow>
    </>
  );
}
