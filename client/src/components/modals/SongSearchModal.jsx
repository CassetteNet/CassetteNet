import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Modal, Fade, Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from 'material-ui-search-bar';
import { songSearch } from '../../utils/api';

const Results = ({ results, addSong }) => {
    const [added, setAdded] = useState({});

    const addSongHandler = (song) => {
        const newAdded = { ...added };
        newAdded[song.id] = true;
        setAdded(newAdded);
        addSong(song);
    }
    return (
        <>
        {results?.map(result => (
            <Box
                style={{
                    margin: "5px",
                    padding: "10px",
                    backgroundColor: blueGrey[700],
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: 6,
                    color: 'white',
                    fontSize: '1em',
                }}
            >
                <Grid container>
                    <Grid item xs={1} align="left" style={{ cursor: 'pointer' }}>
                        <img width="100%" style={{ objectFit: 'contain' }} src={result.coverImage} />
                    </Grid>
                    <Grid item xs={10} align="center">
                        {result.name}
                    </Grid>
                    <Grid item xs={1}>
                        {!added[result.id] ?
                        <AddIcon onClick={() => addSongHandler(result)} />
                        : <span>Added!</span>}
                    </Grid>
                </Grid>
            </Box>
        ))}
        </>
    )
};

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function SongSearchModal({ open, setOpen, addSong }) {
    const classes = useStyles();

    const [results, setResults] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const api = 'youtube';

    const handleSearch = () => {
        setResults(null);
        setLoading(true);
        songSearch(api, searchQuery).then(res => {
            setResults({ 1: res });
            setLoading(false);
        });
    }

    const handleChangePage = (e, page) => {
        setLoading(true);
        if (results[page]) {
            setCurrentPage(page);
            setLoading(false);
        } else {
            songSearch(api, searchQuery, page).then(res => {
                const newResults = { ...results }
                newResults[page] = res;
                setResults(newResults);
                console.log(page);
                console.log(currentPage)
                setCurrentPage(page);
                setLoading(false);
            });
        }
    }

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
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
                <Grid container justify="center" style={{ backgroundColor: blueGrey[400], height: '85%', width: '60%' }}>
                    {/* <div style={{margin: '1px'}}> */}
                    <Grid item xs={12}>
                        <Typography align="center" variant="h3">Add a song</Typography>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <SearchBar
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onRequestSearch={handleSearch}
                            cancelOnEscape={false}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10} justify="center" style={{overflow: 'auto', height: '60%'}}>
                        {
                        !loading ?
                            <Results results={results ? results[currentPage] : []} addSong={addSong} />
                        :
                            <CircularProgress />
                        }
                    </Grid>
                    <Grid item xs={1} />
                    <Pagination count={results ? results[currentPage].length === 0 ? Object.keys(results).length : Object.keys(results).length + 1 : 1} disabled={loading || !results} page={currentPage} onChange={handleChangePage} />
                </Grid>
            </Fade>
        </Modal >
    )
}

export default SongSearchModal;
