import { useState } from 'react';
// @mui
import {
  Button, TableRow,
  MenuItem,
  TableCell, Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
// @types
import { Case } from '../../@types/user';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import { TableMoreMenu } from 'src/components/table';
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

// ----------------------------------------------------------------------

type Props = {
  row: Case;
  // selected: boolean;
  onEditRow: VoidFunction;
  // onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  onDeleteRow,
  onEditRow,
}: Props) {
  const { title, description, category, status, fid } = row;

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
    await deleteDoc(doc(db, "cases", fid));
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

        <TableCell align="left">{title}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {description}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {category}
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={status === false ? 'error' : 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status === true ? 'Active' : 'Draft'}
          </Label>
        </TableCell>

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
                    onEditRow()
                  }}
                  sx={{ color: 'warning' }}
                >
                  <Iconify icon={'eva:edit-outline'} />
                  Edit
                </MenuItem>
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
