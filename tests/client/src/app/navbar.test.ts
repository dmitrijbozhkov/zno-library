import * as assert from "assert";
import { navbar_intent } from "../../../../client/main/main";

describe("tests for navbar_component", () => {
    function createDomSinkMock(selector, event) {
        return {
            selector: selector,
            event: event,
            select: function(s) {
                return createDomSinkMock(s, this.event);
            },
            events: function(e) {
                return createDomSinkMock(this.selector, e);
            }
        };
    }
    let domSinkMock;
    beforeEach(() => {
        domSinkMock = createDomSinkMock("", "");
    });
    it("navbar_intent should take DOMSource and return toggleClicks$ stream of clicks on element with #nav-toggle", () => {
        let intent = navbar_intent(domSinkMock);
        assert.deepEqual((intent.toggleClicks$ as any).selector, "#nav-toggle");
        assert.deepEqual((intent.toggleClicks$ as any).event, "click");
    });
    it("navbar_intent should take DOMSource and return toggleButton$ stream of clicks on element with .nav-button", () => {
        let intent = navbar_intent(domSinkMock);
        assert.deepEqual((intent.toggleButton$ as any).selector, ".nav-button");
        assert.deepEqual((intent.toggleButton$ as any).event, "click");
    });
});