import { expect, test } from "bun:test";
import Timer from "../timer";

test("Timer constructor without arguments should produce init timer with only zeros", () => {
	const timer = new Timer();
	timerShouldBe(timer, "00:00:00");
});

test("Init timer with chars", () => {
	const timer = Timer.set("10h 10m 1s");
	timerShouldBe(timer, "10:10:01");
});

function timerShouldBe(timer: Timer, actual: string): void {
	expect(timer.toString()).toEqual(actual);
}
