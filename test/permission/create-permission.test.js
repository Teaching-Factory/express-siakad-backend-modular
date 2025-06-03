const httpMocks = require("node-mocks-http");
const { createPermission } = require("../../src/modules/role-permission/controller");
const { Permission } = require("../../models");

jest.mock("../../models");

describe("createPermission", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - nama_permission tidak disediakan
  it("should return 400 if nama_permission is not provided", async () => {
    req.body = {}; // body kosong

    await createPermission(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_permission is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - permission berhasil dibuat
  it("should create permission and return status 201 if successful", async () => {
    const newPermissionData = { nama_permission: "Permission 1" };
    const mockCreatedPermission = { id: 1, ...newPermissionData };

    req.body = newPermissionData;
    Permission.create.mockResolvedValue(mockCreatedPermission);

    await createPermission(req, res, next);

    expect(Permission.create).toHaveBeenCalledWith(newPermissionData);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Permission Success",
      data: mockCreatedPermission,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - penanganan kesalahan saat mencoba membuat permission baru
  it("should handle errors when creating permission", async () => {
    const errorMessage = "Database error";

    req.body = { nama_permission: "Permission 1" };
    Permission.create.mockRejectedValue(new Error(errorMessage));

    await createPermission(req, res, next);

    expect(Permission.create).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
