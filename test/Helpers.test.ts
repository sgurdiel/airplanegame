import {expect, jest, test} from "@jest/globals";
import { asyncDelay } from "../src/Helpers"
jest.spyOn(global, "setTimeout")

test("Async delay", async () => {
    await new Promise(done => {
        asyncDelay(5000)
        done(true)
    }).then(() => {
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000)
    })
})
