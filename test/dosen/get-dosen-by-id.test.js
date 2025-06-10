const httpMocks = require("node-mocks-http");
const { getDosenById } = require("../../src/modules/dosen/controller");
const { Dosen, Agama, StatusKeaktifanPegawai } = require("../../models");

jest.mock("../../models");

describe("getDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji dengan memasukkan data id dosen yang valid
  it("should return dosen data with status 200 if found", async () => {
    const dosenId = "094bea97-87bf-43ee-961b-7635abf7dd8a";
    const mockDosen = {
      id: dosenId,
      nama_dosen: "Dosen 1",
      Agama: { nama: "Agama 1" },
      StatusKeaktifanPegawai: { status: "Aktif" },
    };

    Dosen.findByPk.mockResolvedValue(mockDosen);

    req.params.id = dosenId;

    await getDosenById(req, res, next);

    expect(Dosen.findByPk).toHaveBeenCalledWith(dosenId, {
      include: [{ model: Agama }, { model: StatusKeaktifanPegawai }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Dosen By ID ${dosenId} Success:`,
      data: mockDosen,
    });
  });

  // Kode uji 2 - menguji dengan memasukkan data id dosen yang tidak valid
  it("should return 404 if dosen is not found", async () => {
    const dosenId = "s"; // ID yang tidak ada
    const errorMessage = `<===== Dosen With ID ${dosenId} Not Found:`;

    Dosen.findByPk.mockResolvedValue(null);

    req.params.id = dosenId;

    await getDosenById(req, res, next);

    expect(Dosen.findByPk).toHaveBeenCalledWith(dosenId, {
      include: [{ model: Agama }, { model: StatusKeaktifanPegawai }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  // Kode uji 3 - tidak memasukkan id dosen pada parameter
  it("should return error response when id dosen is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID dosen dalam parameter

    await getDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Dosen ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const dosenId = 1;
    const errorMessage = "Database error";

    Dosen.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = dosenId;

    await getDosenById(req, res, next);

    expect(Dosen.findByPk).toHaveBeenCalledWith(dosenId, {
      include: [{ model: Agama }, { model: StatusKeaktifanPegawai }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
