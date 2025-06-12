const httpMocks = require("node-mocks-http");
const { updateContactPersonPMBAktif } = require("../../src/modules/contact-person-pmb/controller");
const { ContactPersonPMB } = require("../../models");

jest.mock("../../models");

describe("updateContactPersonPMBAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_cp_pmb is missing", async () => {
    req.body = {
      no_wa_cp_pmb: "08123456789"
    };

    await updateContactPersonPMBAktif(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_cp_pmb is required" });
  });

  it("should return 400 if no_wa_cp_pmb is missing", async () => {
    req.body = {
      nama_cp_pmb: "John Doe"
    };

    await updateContactPersonPMBAktif(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "no_wa_cp_pmb is required" });
  });

  it("should return 404 if no active contact person PMB is found", async () => {
    req.body = {
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789"
    };

    ContactPersonPMB.findOne.mockResolvedValue(null);

    await updateContactPersonPMBAktif(req, res, next);

    expect(ContactPersonPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Contact Person PMB Not Found:`
    });
  });

  it("should update contact person PMB and return 200 if successful", async () => {
    const mockContactPersonPMB = {
      id: 1,
      nama_cp_pmb: "Old Name",
      no_wa_cp_pmb: "08123456789",
      status: true,
      save: jest.fn().mockResolvedValue() // Perbaikan metode save
    };

    req.body = {
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789"
    };

    ContactPersonPMB.findOne.mockResolvedValue(mockContactPersonPMB);

    await updateContactPersonPMBAktif(req, res, next);

    expect(ContactPersonPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(mockContactPersonPMB.nama_cp_pmb).toBe("John Doe");
    expect(mockContactPersonPMB.no_wa_cp_pmb).toBe("08123456789");
    expect(mockContactPersonPMB.save).toHaveBeenCalled();

    // Buat salinan objek tanpa properti save
    const { save, ...expectedData } = mockContactPersonPMB;

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Contact Person PMB Success:`,
      data: expectedData // Bandingkan objek tanpa properti save
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      nama_cp_pmb: "John Doe",
      no_wa_cp_pmb: "08123456789"
    };

    ContactPersonPMB.findOne.mockRejectedValue(error);

    await updateContactPersonPMBAktif(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
