const httpMocks = require("node-mocks-http");
const { finalisasiByCamabaActive } = require("../../src/modules/camaba/controller");
const { Role, UserRole, Camaba } = require("../../models");

jest.mock("../../models");

describe("finalisasiByCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    req.user = { id: 1, username: "user123" }; // Mock user data
    req.body = { finalisasi: true }; // Mock request body
    jest.clearAllMocks();
  });

  it("should return 400 if finalisasi is not provided", async () => {
    req.body = {}; // Set request body to empty

    await finalisasiByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "finalisasi is required" });
  });

  it("should return 404 if Role Camaba not found", async () => {
    Role.findOne.mockResolvedValue(null);

    await finalisasiByCamabaActive(req, res, next);

    expect(Role.findOne).toHaveBeenCalledWith({
      where: { nama_role: "camaba" }
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Role Camaba not found"
    });
  });

  it("should update finalisasi and return 200 when successful", async () => {
    const mockCamaba = { id: 1, nomor_daftar: "user123", finalisasi: false, save: jest.fn() };

    Role.findOne.mockResolvedValue({ id: 1, nama_role: "camaba" });
    UserRole.findOne.mockResolvedValue({ id: 1, id_user: req.user.id, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba);

    await finalisasiByCamabaActive(req, res, next);

    expect(Camaba.findOne).toHaveBeenCalledWith({
      where: { nomor_daftar: req.user.username }
    });
    expect(mockCamaba.finalisasi).toBe(true);
    expect(mockCamaba.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);

    // Membuat salinan objek tanpa properti 'save'
    const { save, ...camabaWithoutSave } = mockCamaba;

    expect(res._getJSONData()).toEqual({
      message: "<===== Finalisasi Camaba Active Success:",
      data: camabaWithoutSave
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Role.findOne.mockRejectedValue(error);

    await finalisasiByCamabaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
