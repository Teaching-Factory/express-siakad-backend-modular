const httpMocks = require("node-mocks-http");
const { doLogout } = require("../../src/modules/auth/controller");

describe("doLogout", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should clear the token cookie and send a success message", () => {
    // Mocking the clearCookie method
    res.clearCookie = jest.fn();

    // Call the doLogout function
    doLogout(req, res, next);

    // Verify that the clearCookie method was called
    expect(res.clearCookie).toHaveBeenCalledWith("token");

    // Verify that the response JSON data is correct
    expect(res._getJSONData()).toEqual({ message: "Anda baru saja logout" });
    expect(res.statusCode).toBe(200);

    // Verify that next was not called
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", () => {
    const errorMessage = "Logout error";
    const error = new Error(errorMessage);

    // Mock the clearCookie method to throw an error
    res.clearCookie = jest.fn().mockImplementation(() => {
      throw error;
    });

    // Call the doLogout function
    doLogout(req, res, next);

    // Verify that next was called with the error
    expect(next).toHaveBeenCalledWith(error);
  });
});
