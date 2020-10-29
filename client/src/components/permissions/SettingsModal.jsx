import React, { useState } from 'react';
import {
  Backdrop,
  Fade,
  Grid,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Settings as SettingsIcon, Edit as EditIcon, PlayCircleFilledWhite as PlayIcon, Delete as DeleteIcon, AddCircle as AddIcon, Save as SaveIcon } from '@material-ui/icons';
import { getMixtape, getUsername } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

function SettingsModal(props) {
    const classes = useStyles();
    const { mixtape, setMixtape, settingsPopupIsOpen, handleSettingsPopup } = props;

    const [roleSelectOpen, setRoleSelectOpen] = useState(null);

    const handleRoleChange = (event, index) => {
        const newMixtape = { ...mixtape };
        newMixtape.collaborators[index].permissions = event.target.value;
        setMixtape(newMixtape);
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={settingsPopupIsOpen}
            onClose={handleSettingsPopup}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={settingsPopupIsOpen}>
            <Grid container style={{backgroundColor: blueGrey[400], height: '70%', width: '60%'}}>
                <Grid item xs={3} />
                <Grid justify="center" item xs={6} style={{backgrondColor: 'green'}}>
                <Typography align="center" variant="h3">Mixtape Settings</Typography>
                <hr />
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={1} />
                <Grid item xs={4} style={{border: '1px solid black', overflow: 'auto', height: '70%'}}>
                    <Typography align="center" variant="h5">Permissions</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                <StyledTableCell>User</StyledTableCell>
                                <StyledTableCell>Role</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mixtape.collaborators.map((collaborator, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{getUsername(collaborator.user)}</StyledTableCell>
                                    <StyledTableCell>
                                    <Select
                                    open={roleSelectOpen}
                                    onClose={() => setRoleSelectOpen(null)}
                                    onOpen={() => setRoleSelectOpen(index)}
                                    value={collaborator.permissions}
                                    onChange={(e) => handleRoleChange(e, index)}
                                    >
                                    <MenuItem value={'owner'}>Owner</MenuItem>
                                    <MenuItem value={'viewer'}>Viewer</MenuItem>
                                    <MenuItem value={'editor'}>Editor</MenuItem>
                                    </Select>
                                    </StyledTableCell>
                                </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={4} style={{border: '1px solid black'}}>
                    <h1>test</h1>
                </Grid>
                <Grid item xs={1} />
            </Grid>
            </Fade>
        </Modal>

    )
}

export default SettingsModal;
