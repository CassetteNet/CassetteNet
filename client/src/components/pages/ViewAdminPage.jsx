import React, { useContext, useState } from 'react';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
import {
    alpha,
    ThemeProvider,
    withStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { getUsername } from '../../utils/api';
import { users } from '../../testData/users.json'
import pfp from '../../images/bottle_pfp.jpg';
import fb from '../../images/facebook.png';
import twitter from '../../images/twitter.jpg';
import ReactRoundedImage from "react-rounded-image";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  var favorites = [
    {
        name: 'Evening Acoustic',
        collaborators: 'purplefish313, brownmeercat530',
        favorites: 106
    },
    {
        name: 'Rock Classics',
        collaborators: 'silverbutterfly863, brownmeercat530',
        favorites: 93,
    },       
    ];

    var theirMixtapes = [
        {
            name: 'Calm Vibes',
            collaborators: 'biglion179',
            favorites: 15
        },
        {
            name: 'Acoustic Soul',
            collaborators: 'lazykoala317, tinygoose218',
            favorites: 48,
        },       
        ];

    const MixtapeRows = ({mixtapes}) => (
    <>
      {mixtapes.map(mixtape => (
        <Box style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: blueGrey[700],
            display: "flex", 
            flexDirection: "row",
            borderRadius: 6,
            fontSize: 12,
        }}>
            <Box style={{ width: "33%", display: 'flex', justifyContent: "center"}}> {mixtape.name} </Box>
            <Box style={{ width: "33%", display: 'flex', justifyContent: "center"}}> {mixtape.collaborators} </Box>
            <Box style={{ width: "33%", display: 'flex', justifyContent: "center"}}> {mixtape.favorites} </Box>

        </Box>
      ))}
    </>
    ); 

  //var favorites = users[1].favoritedMixtapes;

  

function ViewAccountPage(props) {
      const useStyles = makeStyles((theme) => ({
        margin: {
            margin: theme.spacing(1),
          },
        TextStyle:{
            color:"white",
        }
      }));

    const classes = useStyles();

    const colors = {
        namePfpContainer: blueGrey[900],
        tabsContainer: blueGrey[900],
        mixtapeRowColor: blueGrey[800]
    }

    const dummyUser = users[1];
    console.log(dummyUser);

    const history = useHistory();
    const goBack = () => { history.push('/') }

    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <div  style={{ color: 'white', left:0 }}>
      
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
            <div >
               
                
                <Box style={{display: 'inline-flex', 
                            flexDirection: 'row', 
                            backgroundColor: colors.namePfpContainer, 
                            marginRight: '10px',
                            marginBottom: '30px',
                            marginLeft:'100px',
                            paddingLeft: '20px',
                            paddingTop: '20px',  
                            paddingBottom: '30px',
                            width: '85%', 
                            height: '30%'}} boxShadow={3} borderRadius={12}>
                    <Grid container>
                        <Grid item xs={3}>
                        <ReactRoundedImage image={pfp} roundedSize="1" imageWidth="300" imageHeight="300" />
                        </Grid>
                        <Grid item xs={6}>
                        <div style={{display: 'inline-flex', flexDirection: 'column', paddingLeft: '30px', }}>
                        <span style={{display: 'inline-flex', flexDirection: 'row', paddingTop: '30px', paddingBottom: '30px', height: '25%',}}>
                            <Typography style={{ fontSize: '40px'}} variant="h3">beautifulfrog735</Typography>
                            <Typography style={{ fontSize: '20px'}} variant="h3">#0001</Typography>
                        </span>
                        <Typography style={{ fontSize: '20px'}} variant="h3">User since: 9/22/20</Typography>
                        <Typography style={{ fontSize: '20px'}} variant="h3">Last seen: 10/29/20</Typography>
                        <Typography style={{ fontSize: '20px'}} variant="h3">Followers: 203</Typography>
                        
                        </div>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    
                    
                    
                   
                    <Button variant="outlined" style={{ marginLeft:'50px',marginTop: '10px', height: '40px', width: '200px', backgroundColor: blueGrey[600], color: 'white'}}>Change Picture</Button>
                    </Grid>
                </Box>
                <Typography style={{ marginLeft:'100px',fontSize: '40px'}} variant="h2">Add Social Media Authentication</Typography>
                <Box style={{display: 'inline-flex', 
                            flexDirection: 'row', 
                            backgroundColor: colors.namePfpContainer, 
                            marginRight: '10px',
                            marginBottom: '20px',
                            marginLeft:'100px',
                            paddingLeft: '20px',
                            paddingTop: '20px',  
                            paddingBottom: '30px',
                            width: '85%', 
                            height: '30%'}} boxShadow={3} borderRadius={12}>
                    <Grid container>
                        <Grid item xs={1}>
                            </Grid>
                        <Grid item xs={2}>
                        <ReactRoundedImage image={fb} roundedSize="1" imageWidth="100" imageHeight="100" />
                        </Grid>
                        <Grid item xs={6}>
                        <Button variant="outlined" style={{ marginLeft:'0px',marginTop: '10px', height: '100px', width: '500px', backgroundColor: blueGrey[600], color: 'white'}}>Link Facebook Account</Button>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    
                    </Grid>
                </Box>
                <Box style={{display: 'inline-flex', 
                            flexDirection: 'row', 
                            backgroundColor: colors.namePfpContainer, 
                            marginRight: '10px',
                            marginBottom: '20px',
                            paddingLeft: '20px',
                            marginLeft:'100px',
                            paddingTop: '20px',  
                            paddingBottom: '30px',
                            width: '85%', 
                            height: '30%'}} boxShadow={3} borderRadius={12}>
                    <Grid container>
                        <Grid item xs={1}>
                            </Grid>
                        <Grid item xs={2}>
                        <ReactRoundedImage image={twitter} roundedSize="1" imageWidth="100" imageHeight="100" />
                        </Grid>
                        <Grid item xs={6}>
                        <Button variant="outlined" style={{ marginLeft:'0px',marginTop: '10px', height: '100px', width: '500px', backgroundColor: blueGrey[600], color: 'white'}}>Link Twitter Account</Button>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    
                    </Grid>
                </Box>
                <Grid container>
                    <Grid item xs={2}>
                        <Button variant="outlined" style={{ marginLeft:'100px',marginTop: '10px', height: '70px', width: '300px', backgroundColor: blueGrey[600], color: 'white'}}>Change Password</Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="outlined" style={{ marginLeft:'200px',marginTop: '10px', height: '70px', width: '300px', backgroundColor: blueGrey[600], color: 'white'}}>Admin Screen</Button>
                    </Grid>
                </Grid>
                
            </div>
        </div>
  );
}

export default ViewAccountPage;
