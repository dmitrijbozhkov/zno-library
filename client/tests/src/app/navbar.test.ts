import * as assert from "assert";
import { navpanel_button_handle, navbar_button_handle, navbar_state, PanelStates, navbar_intent } from "../../../../client/navbar-component/navbar-component";
import { navbar_shadow } from "../../../../client/navbar-component/navbar-view";
import { Stream } from "xstream";
import { div } from "@cycle/dom";
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
            },
            compose: function(e) {
                return this;
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
    it("navpanel_button_handle should return a stream that starts with 'nav-close'", () => {
        let clicks$ = Stream.never();
        clicks$
        .compose(navpanel_button_handle)
        .addListener({
            next: (panelState: string) => {
                assert.deepEqual(panelState, PanelStates[1]);
            }
        });
    });
    it("navpanel_button_handle should return a stream that after event returns 'nav-open'", () => {
        let clicks$ = Stream.of({});
        clicks$
        .compose(navpanel_button_handle)
        .drop(1)
        .addListener({
            next: (panelState: string) => {
                assert.deepEqual(panelState, PanelStates[0]);
            }
        });
    });
    it("navpanel_button_handle should return a stream that after two events returns 'nav-close'", () => {
        let clicks$ = Stream.of({}, {});
        clicks$
        .compose(navpanel_button_handle)
        .drop(2)
        .addListener({
            next: (panelState: string) => {
                assert.deepEqual(panelState, PanelStates[1]);
            }
        });
    });
    it("navbar_button_handle should map every event to 'nav-close'", () => {
        let clicks$ = Stream.of({});
        clicks$
        .compose(navbar_button_handle)
        .addListener({
            next: (panelState: string) => {
                assert.deepEqual(panelState, PanelStates[1]);
            }
        });
    });
    it("navbar_state should merge two streams of navbar states", () => {
        let toggler$ = Stream.of(PanelStates[0]);
        let button$ = Stream.of(PanelStates[1]);
        let message = 1;
        navbar_state(toggler$ as any, button$ as any)
        .addListener({
            next: (panelState: string) => {
                if (message === 2) {
                    assert.deepEqual(panelState, PanelStates[1]);
                }
                if (message === 1) {
                    assert.deepEqual(panelState, PanelStates[0]);
                    message += 1;
                }
            }
        });
    });
    it("navbar_shadow should map should map panelState to div with id navbar-shadow and attribute data-state with panelState", () => {
        let state$ = Stream.of(PanelStates[1]);
        let expected = div("#navbar-shadow", { attrs: { "data-state": PanelStates[1] } });
        state$
        .compose(navbar_shadow)
        .addListener({
            next: (view) => {
                assert.deepEqual(view, expected);
            }
        });
    });
});