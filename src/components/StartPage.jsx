import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import logo from '../images/logo.png';

function StartPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
        loginButton: '#115628',
        signUpButton: '#561111',
        guestButton: '#6B6B6B',
    }
    return (
        <div style={{color: 'white'}}>
            <div style={{margin: 'auto', width: '50%'}}>
                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={logo} />
                <Typography align="center" variant="h4">Mix freely.</Typography>
                <Typography align="center" variant="h4">Connect and collaborate.</Typography>
                <Typography align="center" variant="h4">Press play.</Typography>
            </div>
            <br />
            <div style={{backgroundColor: 'blue', left: '25%', width: '50%', margin: 'auto'}}>
                <Grid container justify="center" style={{padding: '5%', backgroundColor: colors.buttonContainer}}>
                        <Button style={{margin: '1em', backgroundColor: colors.loginButton}} fullWidth variant="contained">LOGIN</Button>
                        <Button style={{margin: '1em', backgroundColor: colors.signUpButton}} fullWidth variant="contained">SIGN UP</Button>
                        <Button style={{margin: '1em', backgroundColor: colors.guestButton}} fullWidth variant="contained">CONTINUE AS GUEST</Button>
                </Grid>
            </div>
        </div>
    );
}

export default StartPage;
