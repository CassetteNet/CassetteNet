import React, { useState } from 'react';
import { Backdrop, Modal, Fade, Grid, Typography, Table, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import { uploadFile } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function MixtapeCoverImageUploadModal(props) {
    const classes = useStyles();
    const { mixtape, open, setOpen } = props;
    const [file, setFile] = useState(null);

    const uploadImage = async () => {
        console.log(file);
        await uploadFile(file, `/mixtape/${mixtape._id}/uploadCoverImage`);
    }

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container justify="center" alignContent="center" style={{ backgroundColor: blueGrey[400], height: '70%', width: '60%' }}>
                    <div style={{margin: '1px'}}>
                        <Typography variant="h3">Upload Mixtape Cover Image</Typography>
                        <br />
                        <DropzoneArea onChange={(file) => setFile(file[0])} filesLimit={1} />
                        <br />
                        <Button onClick={() => uploadImage()} variant="outlined">Upload</Button>
                    </div>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default MixtapeCoverImageUploadModal;
