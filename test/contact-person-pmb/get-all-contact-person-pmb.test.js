const httpMocks = require("node-mocks-http");
const { getAllContactPersonPMB } = require("../../src/modules/contact-person-pmb/controller");
const { ContactPersonPMB } = require("../../models");

jest.mock("../../models");

describe("getAllContactPersonPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all contact person PMB and return 200 if data is found", async () => {
    const mockContactPersonPMB = [
      {
        id: 1,
        nama: "John Doe",
        no_telepon: "08123456789",
        email: "john@example.com",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      },
      {
        id: 2,
        nama: "Jane Doe",
        no_telepon: "08123456790",
        email: "jane@example.com",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      }
    ];

    ContactPersonPMB.findAll.mockResolvedValue(mockContactPersonPMB);

    await getAllContactPersonPMB(req, res, next);

    expect(ContactPersonPMB.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Contact Person PMB Success",
      jumlahData: mockContactPersonPMB.length,
      data: mockContactPersonPMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    ContactPersonPMB.findAll.mockRejectedValue(error);

    await getAllContactPersonPMB(req, res, next);

    expect(ContactPersonPMB.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
