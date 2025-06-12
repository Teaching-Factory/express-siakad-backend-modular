const httpMocks = require("node-mocks-http");
const { GetKRSMahasiswaByMahasiswaSemester } = require("../../src/modules/krs-mahasiswa/controller");
const { TahunAjaran, Semester, KRSMahasiswa } = require("../../models");

jest.mock("../../models");

describe("GetKRSMahasiswaByMahasiswaSemester", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all KRS Mahasiswa by Mahasiswa Semester with status 200 if successful", async () => {
    const mockMahasiswaId = 1;
    const mockKRSMahasiswas = [{ id: 1 }, { id: 2 }];

    TahunAjaran.findOne.mockResolvedValue({ id_tahun_ajaran: 1, nama_tahun_ajaran: "2023/2024" });
    Semester.findAll.mockResolvedValue([{ id_semester: 1 }, { id_semester: 2 }]);
    KRSMahasiswa.findAll.mockResolvedValue(mockKRSMahasiswas);

    req.params.id_registrasi_mahasiswa = mockMahasiswaId;

    await GetKRSMahasiswaByMahasiswaSemester(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All KRS Mahasiswa By Mahasiswa Semester Success",
      jumlahData: mockKRSMahasiswas.length,
      data: mockKRSMahasiswas,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if ID Registrasi Mahasiswa is not provided", async () => {
    req.params.id_registrasi_mahasiswa = undefined;

    await GetKRSMahasiswaByMahasiswaSemester(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "ID Registrasi Mahasiswa is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    TahunAjaran.findOne.mockRejectedValue(new Error(errorMessage));

    req.params.id_registrasi_mahasiswa = 1;

    await GetKRSMahasiswaByMahasiswaSemester(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
