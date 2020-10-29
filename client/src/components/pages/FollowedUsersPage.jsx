import React, { useContext, useState } from 'react';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { users } from '../../testData/users.json'
import ReactRoundedImage from "react-rounded-image";
import dio_pfp from '../../images/dio_pfp.jpg';
import donna_pfp from '../../images/donna.jpg';
import pepe_pfp from '../../images/pepe_pfp.png';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';



function FollowedUsersPage(props) {
  const colors = {
      followedUserRowColor: blueGrey[900],
      unfollowButtonColor: lightBlue[500],
      searchButtonColor: lightBlue[700],
  }

  var theirFollowedUsers = [
    {
        name: 'purplefish313',
        id: '5469',
        last_seen: '10/1/2020',
        user_since: '9/28/2020',
        followers: '112',
        pfp: dio_pfp
    },
    {
        name: 'biglion179',
        id: '9443',
        last_seen: '10/25/2020',
        user_since: '10/14/2020',
        followers: '32',
        pfp: donna_pfp
    },
    {
        name: 'silverpanda429',
        id: '2201',
        last_seen: '10/27/2020',
        user_since: '9/13/2020',
        followers: '93', 
        pfp: pepe_pfp
    },
]

  const FollowedUserRows = ({followedUsers}) => (
    <>
      {followedUsers.map(user => (
        <Box style={{
            margin: "5px",
            padding: "10px",
            
            backgroundColor: colors.followedUserRowColor,
            display: "flex", 
            flexDirection: "row",
            borderRadius: 6,
            fontSize: 12,
        }} boxShadow={3}>
            <Box style={{ width: "33%", display: 'flex', flexDirection: 'row', marginLeft: '15px'}}>
                <ReactRoundedImage image={user.pfp} roundedSize="1" imageWidth="100" imageHeight="100" />
                <br/>
                <Box style={{ fontSize: '15pt', width: "50%", display: 'flex', justifyContent: "left", marginLeft: '15px'}}> {user.name}#{user.id} </Box>
            </Box>
            
            <Box style={{ fontSize: '12pt', marginLeft: '50px', width: "33%", display: 'flex', flexDirection: 'column'}}> 
                Last seen: {user.last_seen}
                <br/>
                <br/>
                User since: {user.user_since}
                <br/>
                <br/>
                Followers: {user.followers}
            </Box>
            <Box style={{ width: "25%", display: 'flex', justifyContent: "left"}}>
                <br/>
                <Button variant="contained" boxShadow={3} style={{ marginTop: '20px', height: '45px', width: '80px', backgroundColor: colors.unfollowButtonColor}}> Unfollow</Button>
            </Box>
        </Box>
      ))}
    </>
    ); 



  const history = useHistory();
  const goBack = () => { history.push('/') }

  return (
      <div  style={{ color: 'white', left:0 }}>
    
          <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
            <ArrowBackIcon/>
          </IconButton>
          <br/>
          <Typography variant="h3" style={{textAlign: "center"}}> Followed Users </Typography>
          <br/>
          <Box style={{ width: "25%", display: 'flex', paddingLeft: '120px'}}>
                <br/>
                <Button variant="contained" boxShadow={3} style={{ margin:'auto', backgroundColor: colors.searchButtonColor}}> Search for User</Button>
        </Box>
          <div style={{ width: "70%", margin: 'auto'}}>
            <FollowedUserRows followedUsers={theirFollowedUsers} />
          </div>
      </div>
);
}

export default FollowedUsersPage;