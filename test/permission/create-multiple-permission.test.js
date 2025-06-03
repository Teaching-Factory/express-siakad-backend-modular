const httpMocks = require("node-mocks-http");
const { createMultiplePermission } = require("../../src/modules/role-permission/controller");
const { Permission } = require("../../models");

jest.mock("../../models");

describe("createMultiplePermission", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should create multiple permissions and return them with status 201 if successful", async () => {
    const mockPermissions = [{ nama_permission: "login" }, { nama_permission: "dashboard" }];
    const createdPermissions = [
      { id: 1, nama_permission: "login" },
      { id: 2, nama_permission: "dashboard" },
    ];

    Permission.bulkCreate.mockResolvedValue(createdPermissions);

    req.body.permissions = mockPermissions;

    await createMultiplePermission(req, res, next);

    expect(Permission.bulkCreate).toHaveBeenCalledWith(mockPermissions);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Multiple Permissions Success",
      data: createdPermissions,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if permissions array is not provided", async () => {
    req.body.permissions = undefined;

    await createMultiplePermission(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "permissions array is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const mockPermissions = [{ nama_permission: "login" }, { nama_permission: "dashboard" }];
    const errorMessage = "Database error";

    Permission.bulkCreate.mockRejectedValue(new Error(errorMessage));

    req.body.permissions = mockPermissions;

    await createMultiplePermission(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
