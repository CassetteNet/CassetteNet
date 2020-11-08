import React, { useEffect, useState } from 'react';
import { Button, Box, Checkbox, Fab, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import Mixtape from '../Mixtape';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import { getMixtape, getUsername } from '../../utils/api';
import { Comment as CommentIcon, Share as ShareIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import MixtapeCoverImageUploadModal from '../modals/MixtapeCoverImageUploadModal';

function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    const [mixtape, setMixtape] = useState({
        name: '',
        collaborators: [],
        songs: [],
    });
    console.log(props.match.params.id)
    useEffect(() => {
        async function updateMixtape() {
            const updatedMixtape = await getMixtape(props.match.params.id);
            setMixtape(updatedMixtape);
        }
        updateMixtape();
    }, []);
    const owner = mixtape.collaborators.filter(c => c.permissions === 'owner').map(c => c.username)[0];

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(false);

    const [uploadCoverImagePopup, setUploadCoverImagePopup] = useState(true);

    return (
        <div>
            <MixtapeCoverImageUploadModal mixtape={mixtape} open={uploadCoverImagePopup} setOpen={setUploadCoverImagePopup} />
            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>
            <br />

            <br />

            <Paper style={{ height: '7em', padding: '1%', marginLeft: '5%', marginBottom: '2%', width: '70%' }}>
                {/* {isEditing ? <TextField value={mixtape.name} /> : <h1>{mixtape.name || 'Mixtape Title'}</h1>} */}
                <Grid style={{height: '100%', width: '100%'}} container>
                    <Grid style={{height: '100%', width: '100%'}} xs={1} item>
                        <img style={{width: '80%', height: '100%', objectFit: 'contain'}} src="https://media.istockphoto.com/vectors/cassette-with-retro-label-as-vintage-object-for-80s-revival-mix-tape-vector-id1034671212?k=6&m=1034671212&s=612x612&w=0&h=IeD4uDiHPMlgafytixF-B3F-rdDXwCJ_DMnlR5fkuXg=" />
                    </Grid>
                    <Grid xs={10} item>
                        <Typography variant="h4">{mixtape.name}</Typography>
                        <br />
                        <Typography variant="h7" style={{ display: 'inline-block' }}>{`Created by ${owner} ${mixtape.songs.length} songs, XX mins`}</Typography>
                    </Grid>
                    <Grid xs={1} item>
                        <Button startIcon={<EditIcon />} style={{ position: 'absolute' }} variant="contained">Change Mixtape Name</Button>
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
