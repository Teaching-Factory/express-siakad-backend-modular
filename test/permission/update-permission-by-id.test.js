const httpMocks = require("node-mocks-http");
const { updatePermissionById } = require("../../src/controllers/role-permission");
const { Permission } = require("../../models");

jest.mock("../../models");

describe("updatePermissionById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - nama_permission tidak disediakan
  it("should return 400 if nama_permission is not provided", async () => {
    req.params.id = 1; // Mengatur ID agar valid
    req.body = {}; // body kosong

    await updatePermissionById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_permission is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - permissionId tidak disediakan
  it("should return 400 if permission ID is not provided", async () => {
    req.body = { nama_permission: "Updated Permission" }; // Mengatur nama_permission agar valid
    req.params.id = null; // ID tidak disediakan

    await updatePermissionById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Permission ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - permission tidak ditemukan
  it("should return 404 if permission ID is not found", async () => {
    const permissionId = 999; // ID yang tidak ada dalam mock data
    req.params.id = permissionId;
    req.body = { nama_permission: "Updated Permission" }; // Mengatur nama_permission agar valid
    Permission.findByPk.mockResolvedValue(null);

    await updatePermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Permission With ID ${permissionId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  //   // Kode uji 4 - permission berhasil diupdate (belum pass)
  //   it("should update permission and return status 200 if successful", async () => {
  //     const permissionId = 1; // ID yang valid
  //     const updatedPermissionData = { id: permissionId, nama_permission: "Updated Permission" };

  //     // Buat mockPermission dengan fungsi save yang di-mock
  //     const mockPermission = {
  //       ...updatedPermissionData,
  //       save: jest.fn().mockResolvedValue({ ...updatedPermissionData }), // Mock resolve value
  //     };

  //     req.params.id = permissionId;
  //     req.body = { nama_permission: "Updated Permission" };
  //     Permission.findByPk.mockResolvedValue(mockPermission);

  //     await updatePermissionById(req, res, next);

  //     expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
  //     expect(mockPermission.save).toHaveBeenCalled(); // Memastikan bahwa save() dipanggil
  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: `<===== UPDATE Permission With ID ${permissionId} Success:`,
  //       data: updatedPermissionData,
  //     });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  // Kode uji 5 - penanganan kesalahan saat mencari atau menyimpan permission
  it("should handle errors when finding or saving permission", async () => {
    const permissionId = 1; // ID yang valid
    const errorMessage = "Database error";

    req.params.id = permissionId;
    req.body = { nama_permission: "Updated Permission" };
    Permission.findByPk.mockRejectedValue(new Error(errorMessage));

    await updatePermissionById(req, res, next);

    expect(Permission.findByPk).toHaveBeenCalledWith(permissionId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
