import * as assert from "assert";
import { dummyFunc } from "../../../server/app/init";

describe("Dummy tests", function() {
    it("Should pass", () => {
        assert.ok(dummyFunc());
    });
})