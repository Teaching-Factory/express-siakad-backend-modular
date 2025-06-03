const httpMocks = require("node-mocks-http");
const { getPermissionById } = require("../../src/modules/role-permission/controller");
const { Permission } = require("../../models");

jest.mock("../../models");

describe("getPermissionById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - ID permission tidak disediakan
  it("should return 400 if permission ID is not provided", async () => {
    req.params.id = null; // ID permission tidak disediakan

    await getPermissionById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Permission ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - permission tidak ditemukan berdasarkan ID
  it("should return 404 if permission ID is not found", async () => {
    const permissionId = 999; // ID yang tidak ada dalam mock data
    req.params.id = permissionId;
    Permission.findByPk.mockResolvedValue(null); // Mock resolved value for non-existent permission

    await getPermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Permission With ID ${permissionId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - permission ditemukan berdasarkan ID
  it("should return permission by ID with status 200 if found", async () => {
    const permissionId = 1;
    const mockPermission = { id: permissionId, name: "Permission 1" };

    req.params.id = permissionId;
    Permission.findByPk.mockResolvedValue(mockPermission); // Mock resolved value for existing permission

    await getPermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Permission By ID ${permissionId} Success:`,
      data: mockPermission,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - penanganan kesalahan saat mencari permission
  it("should handle errors when finding permission by ID", async () => {
    const permissionId = 1;
    const errorMessage = "Database error";

    req.params.id = permissionId;
    Permission.findByPk.mockRejectedValue(new Error(errorMessage));

    await getPermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
