import { useState } from 'react';

interface IControlButtonsUi {
    resetTimer: () => void;
}

export default function ControlButtonsUi({ resetTimer }: IControlButtonsUi) {
    const [startDisplay, setStartDisplay] = useState(true);
    const [resetDisplay, setResetDisplay] = useState(true);
    const [cancelDisplay, setCancelDisplay] = useState(false);
    const [pauseDisplay, setPauseDisplay] = useState(false);
    const [pauseName, setPauseName] = useState('Pause');

    function switchDisplay() {
        setStartDisplay(prevDisplay => !prevDisplay);
        setResetDisplay(prevDisplay => !prevDisplay);
        setCancelDisplay(prevDisplay => !prevDisplay);
        setPauseDisplay(prevDisplay => !prevDisplay); 
    }

    function start() {
        switchDisplay();
        setPauseName('Pause');
        // TODO trigger ClockUi here
    }

    function reset() {
        resetTimer();
    }

    function cancel() {
        switchDisplay();
        // TODO trigger ClockUi here
    }

    function pause() {
        setPauseName(name => name == 'Pause' ? 'Resume' : 'Pause');
    }

    return <div className="controlButtonsContainer">
        {startDisplay && <button onClick={start}>Start</button>}
        {resetDisplay && <button onClick={reset}>Reset</button>}
        {cancelDisplay && <button onClick={cancel}>Cancel</button>}
        {pauseDisplay && <button onClick={pause}>{pauseName}</button>}
    </div>;
}