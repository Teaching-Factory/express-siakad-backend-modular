const httpMocks = require("node-mocks-http");
const { createUserGuidePMB } = require("../../src/controllers/user-guide-pmb");
const { UserGuidePMB } = require("../../models");

jest.mock("../../models");

describe("createUserGuidePMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if type is missing", async () => {
    req.body = { status: true };

    await createUserGuidePMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "type is required" });
  });

  it("should return 400 if status is missing", async () => {
    req.body = { type: "pdf" };

    await createUserGuidePMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "status is required" });
  });

  it("should return 400 if no file is uploaded", async () => {
    req.body = { type: "pdf", status: true };

    await createUserGuidePMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "No file uploaded" });
  });

  it("should return 400 if uploaded file is not a PDF", async () => {
    req.body = { type: "pdf", status: true };
    req.file = { mimetype: "image/jpeg", filename: "sample.jpeg" };

    await createUserGuidePMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "File type not supported" });
  });

  it("should return 201 and create a new user guide PMB if valid", async () => {
    req.body = { type: "pdf", status: true };
    req.file = { mimetype: "application/pdf", filename: "sample.pdf" };

    const mockFileUrl = `${process.env.PROTOCOL || "http"}://${process.env.HOST || "localhost"}:${process.env.PORT || 4000}/src/storage/userguide-pmb/sample.pdf`;
    const mockUserGuidePMB = {
      id: 1,
      type: "pdf",
      file: mockFileUrl,
      status: true
      //   createdAt: new Date(),
      //   updatedAt: new Date()
    };

    UserGuidePMB.create.mockResolvedValue(mockUserGuidePMB);

    await createUserGuidePMB(req, res, next);

    expect(UserGuidePMB.create).toHaveBeenCalledWith({
      type: "pdf",
      file: mockFileUrl,
      status: true
    });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE User Guide PMB Success =====>",
      data: mockUserGuidePMB
    });
  });

  it("should handle errors", async () => {
    req.body = { type: "pdf", status: true };
    req.file = { mimetype: "application/pdf", filename: "sample.pdf" };
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    UserGuidePMB.create.mockRejectedValue(error);

    await createUserGuidePMB(req, res, next);

    expect(UserGuidePMB.create).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
