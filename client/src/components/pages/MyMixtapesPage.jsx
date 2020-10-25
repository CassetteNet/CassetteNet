import React from 'react';
import { Grid } from '@material-ui/core';
import MixtapeList from '../MixtapeList';

function MyMixtapesPage(props) {
    return (
        <div style={{paddingLeft: '5%'}}>
            <h1>My Mixtapes</h1>
            <Grid container justify="center">
                
                <MixtapeList />
            </Grid>
        </div>
    )
}

export default MyMixtapesPage;
