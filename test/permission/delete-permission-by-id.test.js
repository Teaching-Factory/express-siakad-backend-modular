const httpMocks = require("node-mocks-http");
const { deletePermissionById } = require("../../src/modules/role-permission/controller");
const { Permission } = require("../../models");

jest.mock("../../models");

describe("deletePermissionById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - permission berhasil dihapus
  it("should delete permission and return status 200 if successful", async () => {
    const permissionId = 1; // ID yang valid
    const mockPermission = { id: permissionId, destroy: jest.fn() };

    req.params.id = permissionId;
    Permission.findByPk.mockResolvedValue(mockPermission);

    await deletePermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(mockPermission.destroy).toHaveBeenCalled(); // Memastikan bahwa destroy() dipanggil
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Permission With ID ${permissionId} Success:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - permission tidak ditemukan
  it("should return 404 if permission ID is not found", async () => {
    const permissionId = 999; // ID yang tidak ada dalam mock data
    req.params.id = permissionId;
    Permission.findByPk.mockResolvedValue(null);

    await deletePermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Permission With ID ${permissionId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - terjadi kesalahan saat menghapus permission
  it("should handle errors when deleting permission", async () => {
    const permissionId = 1;
    const errorMessage = "Database error";

    req.params.id = permissionId;
    Permission.findByPk.mockResolvedValue({ id: permissionId, destroy: jest.fn().mockRejectedValue(new Error(errorMessage)) });

    await deletePermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    // Memastikan bahwa respons tidak dikirim jika terjadi kesalahan
    expect(res._isEndCalled()).toBeFalsy();
  });

  // Kode uji 4 - tidak ada ID yang diberikan
  it("should return 400 if permission ID is not provided", async () => {
    req.params.id = null;

    await deletePermissionById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Permission ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
