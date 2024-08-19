import { expect, test } from "bun:test";
import Timer from "../timer";

test("Timer constructor without arguments should produce init timer with only zeros", () => {
	const timer = new Timer();
	expect(timer.toString()).toEqual("00:00:00");
});

test("Init timer with chars", () => {
    const timer = Timer.set("10h 10m 1s");
	expect(timer.toString()).toEqual("10:10:01");
});