const httpMocks = require("node-mocks-http");
const { createContactPersonPMB } = require("../../src/modules/contact-person-pmb/controller");
const { ContactPersonPMB } = require("../../models");

jest.mock("../../models");

describe("createContactPersonPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_cp_pmb is missing", async () => {
    req.body = {
      no_wa_cp_pmb: "08123456789",
      status: true
    };

    await createContactPersonPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_cp_pmb is required"
    });
  });

  it("should return 400 if no_wa_cp_pmb is missing", async () => {
    req.body = {
      nama_cp_pmb: "John Doe",
      status: true
    };

    await createContactPersonPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "no_wa_cp_pmb is required"
    });
  });

  it("should return 400 if status is missing", async () => {
    req.body = {
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789"
    };

    await createContactPersonPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "status is required"
    });
  });

  it("should create a new contact person PMB and return 201 if successful", async () => {
    const mockContactPersonPMB = {
      id: 1,
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789",
      status: true,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.body = {
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789",
      status: true
    };

    ContactPersonPMB.create.mockResolvedValue(mockContactPersonPMB);

    await createContactPersonPMB(req, res, next);

    expect(ContactPersonPMB.create).toHaveBeenCalledWith({
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789",
      status: true
    });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Contect Person PMB Success",
      data: mockContactPersonPMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789",
      status: true
    };

    ContactPersonPMB.create.mockRejectedValue(error);

    await createContactPersonPMB(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
