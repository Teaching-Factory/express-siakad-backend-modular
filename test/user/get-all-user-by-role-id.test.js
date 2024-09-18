const httpMocks = require("node-mocks-http");
const { getAllUserByRoleId } = require("../../src/controllers/user");
const { User, UserRole, Role } = require("../../models");

jest.mock("../../models");

describe("getAllUserByRoleId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if roleId is not provided", async () => {
    req.params = {};

    await getAllUserByRoleId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Role ID is required"
    });
  });

  it("should return 404 if no users are found for the given role ID", async () => {
    req.params = { id_role: 1 };

    User.findAll.mockResolvedValue([]);

    await getAllUserByRoleId(req, res, next);

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ["nama", "username", "email", "hints"],
      include: [
        {
          model: UserRole,
          where: {
            id_role: 1
          },
          include: [{ model: Role }]
        }
      ]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== User Not Found:"
    });
  });

  it("should return users with status 200 for the given role ID", async () => {
    req.params = { id_role: 1 };

    const mockUsers = [
      {
        nama: "User 1",
        username: "user1",
        email: "user1@example.com",
        hints: "Hint 1",
        UserRole: {
          id_role: 1,
          Role: { nama: "Admin" }
        }
      },
      {
        nama: "User 2",
        username: "user2",
        email: "user2@example.com",
        hints: "Hint 2",
        UserRole: {
          id_role: 1,
          Role: { nama: "Admin" }
        }
      }
    ];

    User.findAll.mockResolvedValue(mockUsers);

    await getAllUserByRoleId(req, res, next);

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ["nama", "username", "email", "hints"],
      include: [
        {
          model: UserRole,
          where: {
            id_role: 1
          },
          include: [{ model: Role }]
        }
      ]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All User By Role ID 1 Success",
      jumlahData: mockUsers.length,
      data: mockUsers
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    User.findAll.mockRejectedValue(error);

    await getAllUserByRoleId(req, res, next);
  });
});
