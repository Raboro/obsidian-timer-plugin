import { useContext } from 'react';
import { TimerButtonsSettingsContext } from 'src/views/view';

interface ITimerButtonsUi {
    updateTimer: (update: string) => void;
}

export default function TimerButtonsUi({ updateTimer }: ITimerButtonsUi) {
    const timerButtonsSettings = useContext(TimerButtonsSettingsContext);
    const handleButtonClick = (value: string) => updateTimer(value);

    return (
        <div className="timerButtonsContainer">
            <button onClick={() => handleButtonClick(`-${timerButtonsSettings.fourth}`)}>
                -{timerButtonsSettings.fourth}
            </button>
            <button onClick={() => handleButtonClick(`-${timerButtonsSettings.third}`)}>
                -{timerButtonsSettings.third}
            </button>
            <button onClick={() => handleButtonClick(`-${timerButtonsSettings.second}`)}>
                -{timerButtonsSettings.second}
            </button>
            <button onClick={() => handleButtonClick(`-${timerButtonsSettings.first}`)}>
                -{timerButtonsSettings.first}
            </button>
            <button onClick={() => handleButtonClick(`+${timerButtonsSettings.first}`)}>
                +{timerButtonsSettings.first}
            </button>
            <button onClick={() => handleButtonClick(`+${timerButtonsSettings.second}`)}>
                +{timerButtonsSettings.second}
            </button>
            <button onClick={() => handleButtonClick(`+${timerButtonsSettings.third}`)}>
                +{timerButtonsSettings.third}
            </button>
            <button onClick={() => handleButtonClick(`+${timerButtonsSettings.fourth}`)}>
                +{timerButtonsSettings.fourth}
            </button>
        </div>
    );
}