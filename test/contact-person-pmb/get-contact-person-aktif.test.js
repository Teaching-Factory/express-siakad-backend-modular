const httpMocks = require("node-mocks-http");
const { getContactPersonAktif } = require("../../src/controllers/contact-person-pmb");
const { ContactPersonPMB } = require("../../models");

jest.mock("../../models");

describe("getContactPersonAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if no active contact person PMB is found", async () => {
    ContactPersonPMB.findOne.mockResolvedValue(null);

    await getContactPersonAktif(req, res, next);

    expect(ContactPersonPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Contact Person PMB Aktif Not Found:"
    });
  });

  it("should return 200 and the active contact person PMB data if found", async () => {
    const mockContactPersonPMB = {
      id: 1,
      nama: "John Doe",
      no_telepon: "08123456789",
      email: "john@example.com",
      status: true,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    ContactPersonPMB.findOne.mockResolvedValue(mockContactPersonPMB);

    await getContactPersonAktif(req, res, next);

    expect(ContactPersonPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Contact Person PMB Aktif Success:",
      data: mockContactPersonPMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    ContactPersonPMB.findOne.mockRejectedValue(error);

    await getContactPersonAktif(req, res, next);

    expect(ContactPersonPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
