import React, { useEffect, useState } from 'react';
import { Spring } from 'react-spring/renderprops';
import { getSpotifyAudioAnalysis } from '../../utils/api';

function setExactInterval(handler, time) {
    var startTime = Date.now();
    setTimeout(function () {
        while (true) {
            var currentTime = Date.now();
            var diff = currentTime - startTime;
            if (diff >= time) {
                setExactInterval(handler, time);
                return handler();
            }
        }
    }, time - 50);
}

const BOX_WIDTH = 25; // width of animated boxes in pixels

function RhythmGame({ xStart, xEnd, listeningRoom }) {
    const [bpm, setBpm] = useState(-1);
    const bps = bpm / 60; // beats per second
    const beatDuration = 1 / bps; // how long a square should take to get from the beginning of screen to middle

    const [firstBeatDone, setFirstBeatDone] = useState(false);

    const [startNewAnimation, setStartNewAnimation] = useState(false);

    const onAnimationEnd = (a) => {
        setStartNewAnimation(true)
        setFirstBeatDone(true);
    }

    useEffect(() => {
        getSpotifyAudioAnalysis(listeningRoom._id, listeningRoom.currentSong)
            .then(newBpm => {
                setBpm(newBpm);
            });
    }, []);

    if (!xStart || !xEnd || bpm < 0) {
        return null;
    }

    return (
        <div>
            <Spring
                from={{ position: 'absolute', left: xStart }}
                to={{ position: 'absolute', left: ((xEnd + xStart) / 2) - (BOX_WIDTH / 2) }}
                config={{ duration: beatDuration * 1000 }}
                reset={startNewAnimation}
                onRest={onAnimationEnd}
                onStart={() => setStartNewAnimation(false)}
            >
                {props => (
                    <div style={props}>
                        <div style={{ position: 'absolute', left: `${props.x}px`, ...c1Style }} />
                    </div>
                )}
            </Spring>
            {firstBeatDone ?
                <Spring
                    from={{ position: 'absolute', left: ((xEnd + xStart) / 2) - (BOX_WIDTH / 2) }}
                    to={{ position: 'absolute', left: xEnd - BOX_WIDTH }}
                    config={{ duration: beatDuration * 1000 }}
                    reset={startNewAnimation}
                >
                    {props => (
                        <div style={props}>
                            <div style={{ position: 'absolute', left: `${props.x}px`, ...c1Style }} />
                        </div>
                    )}
                </Spring>
                : undefined}
        </div>
    )
}

const c1Style = {
    background: 'steelblue',
    color: 'white',
    height: '100px',
    width: `${BOX_WIDTH}px`,
}

export default RhythmGame;
