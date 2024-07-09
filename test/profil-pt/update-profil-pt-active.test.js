const httpMocks = require("node-mocks-http");
const { updateProfilPTActive } = require("../../src/controllers/profil-pt");
const { ProfilPT, PerguruanTinggi } = require("../../models");

jest.mock("../../models");

describe("updateProfilPTActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = {};

    await updateProfilPTActive(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_perguruan_tinggi is required" });
  });
});
