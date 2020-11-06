import React, { useContext, useState } from 'react';
import { Button, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';
import Google from '../../images/Google.png';
import FB from '../../images/facebook.png';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { CardMedia } from '@material-ui/core';
import {
  alpha,
  ThemeProvider,
  withStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { userSignup } from '../../utils/api';

function SignUpPage(props) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [oauthAccount, setOauth] = useState(false);
  

  const handleClickOpen = () => setOpen(true);
  const handleClose = () =>  {
    setOpen(false);
    setPassword(".");
    setOauth(true);
    submit();
  };
  const handleResponseFacebook = (e) => {
    setEmail(e.email);
    handleClickOpen();
  }

  const handleGoogleSignUp = (e) => {
    setEmail(e.profileObj.email);
    handleClickOpen();
  }

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const submit = () => {
    console.log(oauthAccount);
    if(oauthAccount == false && password.length<8){
      alert('Password length cannot be less than 8 characters');
    }
    else{
      userSignup(email, username, password).then(() => alert('Sign up successful!'));
    }
  }; 
  // TODO: better dialog box



  const CssTextField = withStyles({
    root: {
      '& label': {
        color: 'white'
      },
      '& label.Mui-focused': {
        color: 'black',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        },
      },
    },
  })(TextField);


  const colors = {
    buttonContainer: '#0A1941',
    loginButton: '#115628',
    signUpButton: '#561111',
    guestButton: '#6B6B6B',
  }
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    TextStyle: {
      color: "white",
    },
    photo: {
      height: '100px',
      width: '100px',
      marginLeft: '20px',
      marginRight: '20px',
    }
  }));
  const classes = useStyles();
  // TODO: add user to destructuring when needed
  // Removed for now to avoid build warnings
  const { setUser } = useContext(UserContext);

  const loginAsGuest = () => setUser({ username: 'Guest', isGuest: true, isLoggedIn: true });



  const history = useHistory();
  const goBack = () => { history.push('/') }

  //TODO: Possibly re-align fields
  return (
    <div style={{ color: 'white', left: 0 }}>

      <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
        <ArrowBackIcon />
      </IconButton>


      <Typography align="center" variant="h3">
        <br />
          Sign Up
      <br />
        <br />
      </Typography>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Pick a Username!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type your desired Username:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="email"
            fullWidth
            onChange={handleUsername}
            value={username}
          />
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>


      <div className={classes.margin}>
        <Typography align="center" variant="h5">
          You can sign up by connecting
          <br />to your Google or Facebook account:
      <br />
          <br />
        </Typography>
        <Grid container spacing={1} alignItems="center" direction="column">
          <Grid item sz={1}>
          <img src={Google}  className={classes.photo} alt="Google" />
            <img src={FB} className={classes.photo} alt="Google" />
            <br/>
            </Grid>
            <Grid item sz= {12}>
            <GoogleLogin 
            theme="dark"
            clientId="981574880383-1i69fqkdqevp29mavc6oi3hlq878trpl.apps.googleusercontent.com"
            buttonText="Login With google"
            onSuccess={handleGoogleSignUp}
            cookiePolicy={'single_host_origin'}
          />
          </Grid>
          <Grid item sz= {1}>
          <FacebookLogin 
            size = "small"
            appId="667674014139311"
            buttonText="Login With facebook"
            fields="name,email,picture"
            callback={handleResponseFacebook}
          />
          
          </Grid>
          <Typography align="center" variant="h5">
            <br />
          Or sign up the regular way below:
        <br />
          </Typography>
          
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={handleUsername}
              value={username}
              variant="outlined" label="Username" />
          </Grid>
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={handlePassword}
              value={password}
              variant="outlined" type="Password" label="Password" />
          </Grid>
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={handleEmail}
              value={email}
              label="Email"
              variant="outlined"
              id="custom-css-outlined-input"
            />
          </Grid>
          <Button variant="filled" color="inherit" onClick={submit}>
            Create My Account
        </Button>
        </Grid>
      </div>
    </div>
  );
}

export default SignUpPage;
