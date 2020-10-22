import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Drawer, List, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Language as AnonymousMixtapesIcon, Equalizer as AtmosphereSoundsIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Favorite as FavoritedMixtapesIcon, Mail as InboxIcon, PeopleAlt as FollowedUsersIcon } from '@material-ui/icons';
import CassetteTapeIcon from './icons/CassetteTapeIcon';


const drawerWidth = 240;
const drawerBgColor = '#6C8995'

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
}));

function SideBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
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
                    <ListItem button>
                        <ListItemIcon>
                            <CassetteTapeIcon />    
                        </ListItemIcon>
                        <ListItemText primary="My Mixtapes" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <AtmosphereSoundsIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Atmosphere Sounds" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <FollowedUsersIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Followed Users" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <FavoritedMixtapesIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Favorited Mixtapes" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <AnonymousMixtapesIcon />    
                        </ListItemIcon>
                        <ListItemText primary="Anonymous Mixtapes" />
                    </ListItem>
                </List>
            <Divider />
        </Drawer>   
    </div>
  );
}

export default SideBar;
