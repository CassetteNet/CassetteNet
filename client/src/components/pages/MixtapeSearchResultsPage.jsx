import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Paper, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { blueGrey } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import UserContext from '../../contexts/UserContext';
import { mixtapeSearch, getMixtapeCoverImageUrl, getUserProfilePictureUrl } from '../../utils/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import ShareMixtapeModal from '../modals/ShareMixtapeModal';

function MixtapeSearchResultsPage(props) {
    let { user } = useContext(UserContext);
    if (!user.isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }

    const [mixtapes, setMixtapes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const [mixtapeToShare, setMixtapeToShare] = useState(null);

    const [shareModalOpen, setShareModalOpen] = useState(false);

    useEffect(() => {
        mixtapeSearch(new URLSearchParams(props.location.search).get('query'), currentPage)
        .then(res => {
            setMixtapes(res.results);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
            setTotalResults(res.totalResults);
        });
    }, [props.location.search, currentPage]);

    const history = useHistory();
    const goBack = () => history.goBack();

    const clickUserHandler = (e, userId) => {
        e.stopPropagation();
        history.push(`/user/${userId}`);
    }

    const shareMixtapeHandler = (mixtape) => {
        console.log(mixtape);
        setMixtapeToShare(mixtape);
        setShareModalOpen(true);
    }

    const changePageHandler = (event, pageNumber) => {
        setCurrentPage(pageNumber)
    };

    const MixtapeRows = ({ mixtapes }) => (
        <>

            {mixtapes.map(mixtape => (
                <Box
                    style={{
                        margin: "5px",
                        padding: "10px",
                        backgroundColor: blueGrey[700],
                        display: "flex",
                        flexDirection: "row",
                        borderRadius: 6,
                        fontSize: '1.5em',
                    }}
                >
                    <Grid container style={{ height: '10vh' }}>
                        <Grid item xs={1} align="left" onClick={() => history.push(`/mixtape/${mixtape._id}`)} style={{cursor: 'pointer'}}>
                            <img width={'50%'} style={{ objectFit: 'contain' }} src={getMixtapeCoverImageUrl(mixtape._id)} />
                        </Grid>
                        <Grid item xs={2} align="center" onClick={() => history.push(`/mixtape/${mixtape._id}`)} style={{cursor: 'pointer'}}>
                            {mixtape.name}
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={4} align="center" style={{ maxHeight: '100%', overflow: 'auto' }}>
                            <div style={{ borderRadius: '5px', backgroundColor: blueGrey[400] }}>
                                {mixtape.collaborators.map(c => (
                                    <Grid container style={{ cursor: 'pointer' }} onClick={(e) => clickUserHandler(e, c.user)}>
                                        <Grid item xs={2}>
                                            <img width={'50%'} style={{ objectFit: 'contain' }} src={getUserProfilePictureUrl(c.user)} />
                                        </Grid>
                                        <Grid item xs={10} align="left">
                                            {c.username}
                                        </Grid>
                                    </Grid>
                                ))}
                            </div>
                        </Grid>
                        <Grid item xs={4} align="center">
                            <FavoriteMixtapeButton id={mixtape._id} />
                            <ShareIcon style={{cursor: 'pointer'}}  onClick={() => shareMixtapeHandler(mixtape)} />
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </>
    );
    return (
        <div style={{ color: 'white', left: 0 }}>
            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>
            <ShareMixtapeModal open={shareModalOpen} setOpen={setShareModalOpen} mixtape={mixtapeToShare} />
            <br />
            <br />
            <br />
            <Typography style={{ marginLeft: '100px', textAlign: "left" }} variant="h4">Search results for "{new URLSearchParams(props.location.search).get('query')}" ({totalResults}):</Typography>
            <Paper style={{display: 'inline-block'}}>
                    <Pagination count={totalPages} page={currentPage} onChange={changePageHandler} />
            </Paper>
            <Grid container >
                <Box style={{
                    maxHeight: '60vh',
                    overflow: 'auto',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    backgroundColor: blueGrey[900],
                    marginRight: '10px',
                    marginBottom: '30px',
                    marginLeft: '100px',
                    paddingLeft: '20px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    width: '80%',
                    height: '30%'
                }} boxShadow={3} borderRadius={12}>
                    <Box style={{
                        backgroundColor: blueGrey[900],
                        width: "33%",
                        textAlign: "center",
                        boxShadow: "3",
                        borderRadius: 6
                    }}>
                        Name
            </Box>
                    <Box style={{
                        backgroundColor: blueGrey[900],
                        width: "33%",
                        textAlign: "center",
                        boxShadow: 3,
                        borderRadius: 6
                    }}>
                        Collaborators
            </Box>
                    <Box style={{
                        backgroundColor: blueGrey[900],
                        width: "34%",
                        textAlign: "center",
                        boxShadow: "3",
                        borderRadius: 6
                    }}>
                        Favorites
            </Box>
                </Box>
                <Box style={{
                    marginLeft: "100px",
                    marginTop: '5px',
                    marginRight: '10px',
                    padding: '10px',
                    borderRadius: 6,
                    backgroundColor: blueGrey[900],
                    width: '80%'
                }}>
                    <MixtapeRows mixtapes={mixtapes} />
                </Box>
            <Paper style={{display: 'inline-block'}}>
                <Pagination count={totalPages} page={currentPage} onChange={changePageHandler} />
            </Paper>
            </Grid>
        </div>
    )
}

export default MixtapeSearchResultsPage;
