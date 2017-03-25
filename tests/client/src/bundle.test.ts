import * as assert from "assert";
import { dummyFunc } from "../../../client/loader/init";

describe("Dummy tests", function() {
    it("Should pass", function() {
        assert.ok(dummyFunc());
    });
});