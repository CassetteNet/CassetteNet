import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Badge, Typography, InputBase, Divider, Drawer, List, IconButton, ListItem, ListItemIcon, ListItemText, Toolbar, Button } from '@material-ui/core';
import { Search as SearchIcon, Language as AnonymousMixtapesIcon, Equalizer as AtmosphereSoundsIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Favorite as FavoritedMixtapesIcon, Mail as InboxIcon, PeopleAlt as FollowedUsersIcon, PersonAdd as SignUpIcon, MoodBad as NotFoundIcon } from '@material-ui/icons';
import Autosuggest from 'react-autosuggest';
import { useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import CassetteTapeIcon from './icons/CassetteTapeIcon';
import UserContext from '../contexts/UserContext';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';


const drawerWidth = 240;
const drawerBgColor = '#6C8995';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    backgroundColor: drawerBgColor,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  container: {
    position: 'absolute',
    left: theme.spacing(12),
  },
  navbar: {
    backgroundColor: '#404A54',
    position: 'relative',
    top: '0',
    left: theme.spacing(7),
    width: `calc(100% - ${theme.spacing(7)}px)`,
    marginBotton: '100px'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    position: 'absolute',
    left: drawerWidth + 20,
  },
  search: {
    position: 'absolute',
    right: '5%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

  ////////////////////////////////////////////

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  },
];
 
// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  value = String(value.value);
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
 
  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;
 
// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);
  //////////////////////////////////////////////



function PageFrame(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  // TODO: add setUser to destructuring when needed
    // Removed for now to avoid build warnings
  const { user, setUser } = useContext(UserContext);

  const logout = () => {setUser({ isLoggedIn: false }); history.push('/');}

  const { currentSong } = useContext(CurrentSongContext);

  const { playing, setPlaying } = useContext(PlayingSongContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  ////////////////////////////////////////////////
const [value, setValue] = useState('');
const [suggestions, setSuggestions] = useState([]);

function onChange(newValue) {
  newValue = newValue.nativeEvent.data
  setValue(newValue);
}

const inputProps = {
  placeholder: 'Type a programming language',
  value,
  onChange: onChange
};

// Autosuggest will call this function every time you need to update suggestions.
// You already implemented this logic above, so just use it.
function onSuggestionsFetchRequested(value) {
  console.log("onSuggestoinsFetchRequested value: ", value.value);
  setSuggestions(getSuggestions(value.value));
}

// Autosuggest will call this function every time you need to clear suggestions.
function onSuggestionsClearRequested() {
  console.log("onSuggestionsClearRequested");
  setSuggestions([]);
}
//////////////////////////////////////////////

  if (props.invisible) {
    return (<div />);
  }
  return (
    <div style={{position: 'relative'}}>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            {user.username} {/* TODO: get from dummy data */ }
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
          <Button onClick={() => logout()} style={{margin: '1em', backgroundColor: '#4f7aa1', align: 'right'}} variant="contained">Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
        })}
        classes={{
        paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
            [classes.paper]: true,
        }),
        }}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
                <List>
                    <ListItem onClick={() => history.push('/mymixtapes')} button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <CassetteTapeIcon />    
                      </ListItemIcon>
                      <ListItemText primary="My Mixtapes" />
                    </ListItem>
                    <ListItem onClick={() => history.push('/atmosphere')} button>
                        <ListItemIcon>
                            <AtmosphereSoundsIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Atmosphere Sounds" />
                    </ListItem>
                    <ListItem onClick={() => history.push('/NotFound')} button>
                        <ListItemIcon>
                            <NotFoundIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Page Not Found" />
                    </ListItem>
                    <ListItem onClick={() => history.push('/SignUp')} button>
                        <ListItemIcon>
                            <SignUpIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Sign Up" />
                    </ListItem>
                  <ListItem button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <FollowedUsersIcon />    
                      </ListItemIcon>
                      <ListItemText primary="Followed Users" />
                  </ListItem>
                  <ListItem button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <FavoritedMixtapesIcon />    
                      </ListItemIcon>
                      <ListItemText primary="Favorited Mixtapes" />
                  </ListItem>
                  <ListItem onClick={() => history.push('/inbox')} button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          {/* TODO: get actual number of messages in inbox */}
                          <Badge badgeContent={4} color="error">
                            <InboxIcon />
                          </Badge>
                      </ListItemIcon>
                      <ListItemText primary="Inbox" />
                  </ListItem>
                  <ListItem button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <AnonymousMixtapesIcon />    
                      </ListItemIcon>
                      <ListItemText primary="Anonymous Mixtapes" />
                  </ListItem>
                </List>
            <Divider />
        </Drawer>
        <AppBar style={{display: currentSong ? '' : 'none', top: 'auto', bottom: 0,}}>
          <Toolbar>
            <ReactPlayer playing={playing} style={{display: 'none'}} url={`https://www.youtube.com/watch?v=${currentSong ? currentSong.song : ''}`} />
            
          </Toolbar>
        </AppBar>
        
    </div>
  );
}

export default PageFrame;
