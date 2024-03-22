interface IClockElementUi {
    char: string;
}

export default function ClockElementUi({ char }: Readonly<IClockElementUi>) {
    return <div className="clockElement"><h3>{char}</h3></div>;
}