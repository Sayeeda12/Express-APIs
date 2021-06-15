const { setResponse } = require("../public/js/utils");

//Response objects
let response400 = {status: 400, response: {response: "Test response"}};
let defaultCodeResponse = {status: 200, response: {response: "Test response"}};

//Test for setResponse()
test("Set the right response", () => {
  expect(setResponse("Test response", 400)).toStrictEqual(response400);
});

test("Set the default status code", () => {
    expect(setResponse("Test response")).toStrictEqual(defaultCodeResponse);
});
