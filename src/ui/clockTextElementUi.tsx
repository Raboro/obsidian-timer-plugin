interface IClockTextElementUi {
    text: string;
}

export default function ClockTextElementUi({text}: IClockTextElementUi) {
    return <h3>{text}</h3>;
}