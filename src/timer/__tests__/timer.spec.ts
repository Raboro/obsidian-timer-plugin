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

test("Init timer without chars", () => {
	const timer = Timer.set("01:11:58");
	timerShouldBe(timer, "01:11:58");
});

test("Timer constructor with splitted should produce correct timer", () => {
	const timer = new Timer(undefined, ["10", "1", "2"]);
	timerShouldBe(timer, "10:01:02");
});

test("Too big Timer update should produce max timer", () => {
	const timer = new Timer();
	timer.updateTimer("100h");
	timerShouldBe(timer, "99:59:59");
});

test("Update Timer should produce correct update", () => {
	const timer = new Timer();
	timer.updateTimer("1m");
	timerShouldBe(timer, "00:01:00");
	timer.updateTimer("-1h");
	timerShouldBe(timer, "00:00:00");
	timer.updateTimer("59s");
	timerShouldBe(timer, "00:00:59");
	timer.updateTimer("2s");
	timerShouldBe(timer, "00:01:01");
	timer.updateTimer("-1s");
	timerShouldBe(timer, "00:01:00");
	timer.updateTimer("60s");
	timerShouldBe(timer, "00:02:00");
	timer.updateTimer("63m");
	timerShouldBe(timer, "01:05:00");
	expect(timer.isFinished()).toBeFalse();
	timer.updateTimer("-3h");
	expect(timer.isFinished()).toBeTrue();
});

test("Get access to Timer should be DTO", () => {
	const timer = new Timer();
	const dto = timer.access();
	expect(dto.hours).toBe("00");
	expect(dto.minutes).toBe("00");
	expect(dto.seconds).toBe("00");
});

function timerShouldBe(timer: Timer, actual: string): void {
	expect(timer.toString()).toEqual(actual);
}
