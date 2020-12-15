import React, { useContext, useEffect, useState } from 'react';
import { Box, Fab, Grid, IconButton, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import MixtapeList from '../MixtapeList';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import UserContext from '../../contexts/UserContext';
import { getMyMixtapes } from '../../utils/api';
import { useHistory } from 'react-router-dom';
import CreateMixtapeModal from '../modals/CreateMixtapeModal';

const useStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        bottom: '15%',
        right: '5%',
    },
}));

function MyMixtapesPage(props) {
    const classes = useStyles();

    const { user } = useContext(UserContext);
    const { currentSong } = useContext(CurrentSongContext);

    const history = useHistory();
    const goBack = () => history.goBack();

    if (!user?.isLoggedIn) {
        history.push('/');
    }

    const [mixtapes, setMixtapes] = useState([]);

    const [createMixtapeModalOpen, setCreateMixtapeModalOpen] = useState(false);

    useEffect(() => {
        getMyMixtapes(user._id).then(updatedMixtapes => {
            if (!updatedMixtapes) {
                setMixtapes([]);
            } else {
                setMixtapes(updatedMixtapes);
            }
        });
    }, []);

    if (!mixtapes) {
        return null;
    }

    return (
        <div style={{ color: 'white', left: 0, marginBottom: `${currentSong.playBarHeight}px` }}>
            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>
            <Grid container justify="center">
                <Typography variant="h2">My Mixtapes</Typography>
                <Box style={{
                    maxHeight: '60vh',
                    overflow: 'auto',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    backgroundColor: blueGrey[900],
                    marginRight: '10px',
                    marginBottom: '30px',
                    paddingLeft: '20px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    width: '85%',
                    height: '30%'
                }} boxShadow={3} borderRadius={12}>
                    <Grid container justify="center">
                        <MixtapeList mixtapes={mixtapes} setMixtapes={setMixtapes} />
                    </Grid>
                </Box>
            </Grid>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => setCreateMixtapeModalOpen(true)}>
                <AddIcon />
            </Fab>
            <CreateMixtapeModal open={createMixtapeModalOpen} setOpen={setCreateMixtapeModalOpen} />
        </div>
    )
}

export default MyMixtapesPage;
