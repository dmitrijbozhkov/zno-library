export function createDomSinkMock(selector, event, returns, shouldReturn) {
        return {
            selector: selector,
            event: event,
            returns: returns,
            select: function(s) {
                return createDomSinkMock(s, this.event, this.returns, shouldReturn);
            },
            events: function(e) {
                if (shouldReturn) {
                    return this.returns;
                } else {
                    return createDomSinkMock(this.selector, e, this.returns, shouldReturn);
                }
            },
            compose: function(e) {
                return this;
            }
        };
    }
export function createHistoryMock(pathname?: string, search?: string, hash?: string, state?: string, key?: string) {
    return {
        pathname: pathname ? pathname : "/",
        search: search ? search : "",
        hash: hash ? hash : "",
        state: state,
        key: key
    };
}