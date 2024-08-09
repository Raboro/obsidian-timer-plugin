import { Notice } from 'obsidian';
import { useEffect, useRef, useState } from 'react';
import { notificationUrl } from 'src/notificationSound';
import Timer from 'src/timer/timer';
import ClockUi from './clockUi';
import ControlButtonsUi from './controlButtonsUi';
import TimerButtonsUi from './timerButtonsUi';

interface ITimerUi {
  timerInput: Timer | null;
  updatedSettings: boolean;
  useOsNotification: boolean;
  statusBarItem: HTMLElement;
}

export default function TimerUi({
  timerInput,
  updatedSettings,
  statusBarItem,
  useOsNotification,
}: Readonly<ITimerUi>) {
  const getStartState = (): Timer => {
    let timerValue = null;
    if (!updatedSettings) {
      timerValue = timerInput ?? new Timer();
    }
    return timerValue ?? new Timer();
  };

  const [timer, setTimer] = useState(getStartState());
  const [timerExpired, setTimerExpired] = useState(false);
  const [switchControlButtons, setSwitchControlButtons] = useState(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const updateTimer = (update: string) => {
    timer.updateTimer(update);
    setTimer(new Timer(timer));
  };

  const startTimer = () => {
    if (timer.isFinished()) return false;
    setSwitchControlButtons(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    statusBarItem.setText(timer.toString());
    intervalIdRef.current = setInterval(() => {
      timer.updateTimer('-1s');
      setTimer(new Timer(timer));
      statusBarItem.setText(timer.toString());
      if (timer.isFinished() && intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        setTimerExpired(true);
      }
    }, 1000);
    return true;
  };

  const stopTimer = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const resetTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      setTimer(new Timer());
      setTimerExpired(false);
    }
  };

  useEffect(() => {
    if (!timerInput) startTimer();
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [timerInput]);

  useEffect(() => {
    if (timerExpired) {
      setSwitchControlButtons(true);
      new Audio(notificationUrl).play();
      if (useOsNotification) {
        const notificationSettings: NotificationOptions = {
          body: 'Timer is finished!!',
          requireInteraction: true,
          tag: 'obsidian-timer',
        };
        new Notification('Timer', notificationSettings);
      } else {
        new Notice('Timer is finished!!');
      }
      resetTimer();
    }
  }, [timerExpired]);

  return (
    <>
      <ClockUi timer={timer.access()} />
      <TimerButtonsUi updateTimer={updateTimer} />
      <ControlButtonsUi
        resetTimer={resetTimer}
        startTimer={startTimer}
        stopTimer={stopTimer}
        switchControlButtons={switchControlButtons}
      />
    </>
  );
}
