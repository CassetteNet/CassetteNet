import React, { useEffect, useState } from 'react';
import {
    Button, 
    Box, 
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, 
    Fab, 
    Grid, 
    IconButton, 
    Paper, 
    TextField, 
    Typography,

 } from '@material-ui/core';
import Mixtape from '../Mixtape';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import { getMixtape, getMixtapeCoverImageUrl, updateMixtape } from '../../utils/api';
import { Comment as CommentIcon, Share as ShareIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import MixtapeCoverImageUploadModal from '../modals/MixtapeCoverImageUploadModal';
import humanizeDuration from 'humanize-duration';

function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    const [mixtape, setMixtape] = useState({
        name: '',
        collaborators: [],
        songs: [],
        duration: 0,
    });

    const [open, setOpen] = React.useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        saveName();
        setOpen(false);
    };

    const owner = mixtape.collaborators.filter(c => c.permissions === 'owner').map(c => c.username)[0];

    const [isEditing, setIsEditing] = useState(false);

    const [uploadCoverImagePopup, setUploadCoverImagePopup] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState(null);

    const [changeMixtapeNamePopupIsOpen, setchangeMixtapeNamePopupIsOpen] = useState(false); // whether add song popup is open

    useEffect(() => {
        async function updateMixtape() {
            const updatedMixtape = await getMixtape(props.match.params.id);
            if (updatedMixtape.songs.length > 0) {
                updatedMixtape.duration = updatedMixtape.songs.map(song => song.duration).reduce((mixtapeDuration, songDuration) => mixtapeDuration + songDuration);
            } else {
                updatedMixtape.duration = 0;
            }
            
            setMixtape(updatedMixtape);
            setCoverImageUrl(getMixtapeCoverImageUrl(updatedMixtape._id));
        }
        updateMixtape();
    }, [mixtape.songs.length]);

    

    const handleChangeMixtapeNamePopup = () => {
        setchangeMixtapeNamePopupIsOpen(!changeMixtapeNamePopupIsOpen);
    };

    const handleChangeName = (e) => {
        console.log("Text field value:" + e.target.value);
        mixtape.name = e.target.value
    }

    const saveName = async () => {
        updateMixtape(mixtape);
    }

    return (
        <div>
            <MixtapeCoverImageUploadModal coverImageUrl={coverImageUrl} setCoverImageUrl={setCoverImageUrl} mixtape={mixtape} setMixtape={setMixtape} open={uploadCoverImagePopup} setOpen={setUploadCoverImagePopup} />
            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>
            <br/>
                
            <br/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Mixtape Name</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the new name:
                        </DialogContentText>
                        <TextField
                            onChange={handleChangeName}
                            defaultValue={mixtape.name}
                            variant="filled"
                            InputProps={{ style: { fontSize: '1.5em' }, disableUnderline: false, type: 'search' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button align="center" onClick={handleClose} color="primary">
                            Save
                        </Button>
                    </DialogActions>
            </Dialog>

            <br />
            <br />

            <Paper style={{ height: '10em', padding: '1%', marginLeft: '5%', marginBottom: '2%', width: '70%' }}>
                {/* {isEditing ? <TextField value={mixtape.name} /> : <h1>{mixtape.name || 'Mixtape Title'}</h1>} */}
                <Grid style={{height: '100%', width: '100%'}} container>
                    <Grid style={{height: '100%', width: '100%'}} xs={1} item>
                        <img onClick={() => isEditing ? setUploadCoverImagePopup(true) : undefined} style={{cursor: isEditing ? 'pointer' : '', width: '80%', height: '100%', objectFit: 'contain'}} src={coverImageUrl ? coverImageUrl : ''} />
                    </Grid>
                <Grid sz={1}>

                    <Button onClick={handleChangeMixtapeNamePopup} startIcon={<EditIcon />}  style={{float: 'right'}} variant="contained">Change Mixtape Name</Button>
                    <Grid xs={10} item>
                        <Typography variant="h4">{mixtape.name}</Typography>
                        <br />
                        <Typography variant="h7" style={{ display: 'inline-block' }}>{`Created by ${owner} ${mixtape.songs.length} songs, ${humanizeDuration(mixtape.duration * 1000).replaceAll(',', '')}`}</Typography>
                    </Grid>
                    <Grid xs={1} item></Grid>
                </Grid>
                </Grid>

                <div>
                    <div style={{ display: 'inline-block', float: 'right' }}>
                        <FavoriteMixtapeButton id={props.match.params.id} style={{ margin: '7px' }} />
                        <CommentIcon style={{ margin: '10px' }} />
                        <ShareIcon style={{ margin: '10px' }} />
                    </div>
                </div>
            </Paper>
            <Grid container justify="center">
                <Mixtape enableEditing={true} isEditing={isEditing} setIsEditing={setIsEditing} mixtape={mixtape} setMixtape={setMixtape} />
            </Grid>
        </div>
    )
}

export default ViewMixtapePage;
