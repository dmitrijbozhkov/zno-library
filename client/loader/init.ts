import "./styles";
export function dummyFunc() {
    return true;
}
if (!window["dummyFunc"]) {
    window["dummyFunc"] = dummyFunc;
}