const httpMocks = require("node-mocks-http");
const { getContectPersonPMBById } = require("../../src/controllers/contact-person-pmb");
const { ContactPersonPMB } = require("../../models");

jest.mock("../../models");

describe("getContectPersonPMBById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if Contact Person PMB ID is not provided", async () => {
    req.params.id = undefined;

    await getContectPersonPMBById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Contact Person PMB ID is required"
    });
  });

  it("should return 404 if Contact Person PMB is not found", async () => {
    req.params.id = 1;

    ContactPersonPMB.findByPk.mockResolvedValue(null);

    await getContectPersonPMBById(req, res, next);

    expect(ContactPersonPMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Contact Person PMB With ID 1 Not Found:"
    });
  });

  it("should return 200 and the contact person PMB data if found", async () => {
    const mockContactPersonPMB = {
      id: 1,
      nama: "John Doe",
      no_telepon: "08123456789",
      email: "john@example.com",
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.params.id = 1;
    ContactPersonPMB.findByPk.mockResolvedValue(mockContactPersonPMB);

    await getContectPersonPMBById(req, res, next);

    expect(ContactPersonPMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Contact Person PMB By ID 1 Success:",
      data: mockContactPersonPMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    ContactPersonPMB.findByPk.mockRejectedValue(error);

    await getContectPersonPMBById(req, res, next);

    expect(ContactPersonPMB.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
