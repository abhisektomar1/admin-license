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
  Box,
} from '@mui/material';
// @types
import { Case, appointment, category } from '../../@types/user';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { TableMoreMenu } from 'src/components/table';
import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type Props = {
  row: appointment;
  // selected: boolean;
  // onEditRow: VoidFunction;
  // onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  onDeleteRow,
}: Props) {
  const { id, name, email, startDateTime, endDateTime, phone, status, symptoms } = row;


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


  return (
    <>
      <TableRow hover>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        <TableCell align="left">{id}</TableCell>
        <TableCell align="center">{name}</TableCell>
        <TableCell align="center">{phone}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center">{dayjs(startDateTime).format('YYYY-MM-DD HH:MM')}</TableCell>
        {/* <TableCell align="center">{dayjs(endDateTime).format('YYYY-MM-DD HH:MM')}</TableCell> */}
        <TableCell align="center">{symptoms}</TableCell>
        <TableCell align="center"><Box component='div' id="status">
          <Label id='label' color={status ? 'success' : 'error'}>
            {status ? "Close" : "Pending"}
          </Label>
        </Box></TableCell>
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                {status
                  ?
                  <>
                    <MenuItem
                      disabled
                      onClick={() => {

                        onDeleteRow();

                      }}
                      sx={{ color: 'success' }}
                    >
                      <Iconify icon={'eva:checkmark-circle-fill'} />
                      <Label id='label' color={status ? 'success' : 'error'}>
                        {status ? "Already" : "Pending"}
                      </Label>
                    </MenuItem>
                  </>
                  :
                  <>
                    <MenuItem
                      onClick={() => {
                        onDeleteRow()
                      }}
                      sx={{ color: 'success' }}
                    >
                      <Iconify icon={'eva:trash-2-outline'} />
                      <Label id='label' color={status ? 'error' : 'success'}>
                        {status ? "Pending" : "Close"}
                      </Label>
                    </MenuItem>
                  </>
                }
                {/* <MenuItem
                  disabled
                  onClick={() => {

                    handleClickOpen();

                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Delete
                </MenuItem> */}
              </>
            }
          />
        </TableCell>
      </TableRow>
    </>
  );
}
