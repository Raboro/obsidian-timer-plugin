import { useState } from 'react';

export default function ControlButtonsUi() {
    const [startDisplay, setStartDisplay] = useState(true);
    const [cancelDisplay, setCancelDisplay] = useState(false);
    const [pauseDisplay, setPauseDisplay] = useState(false);

    function switchDisplay() {
        setStartDisplay(prevDisplay => !prevDisplay);
        setCancelDisplay(prevDisplay => !prevDisplay);
        setPauseDisplay(prevDisplay => !prevDisplay); 
    }

    function start() {
        switchDisplay();
        // TODO trigger ClockUi here
    }

    function cancel() {
        switchDisplay();
        // TODO trigger ClockUi here
    }

    function pause() {
        // TODO trigger ClockUi here
    }

    return <div className="controlButtonsContainer">
        {startDisplay && <button onClick={start}>Start</button>}
        {cancelDisplay && <button onClick={cancel}>Cancel</button>}
        {pauseDisplay && <button onClick={pause}>Pause</button>}
    </div>;
}