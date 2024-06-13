const httpMocks = require("node-mocks-http");
const { getPeriodeByProdiIdWithCountMahasiswa } = require("../../src/controllers/status-mahasiswa");
const { Periode, Mahasiswa, Angkatan } = require("../../models");
const Sequelize = require("sequelize");

jest.mock("../../models");

describe("getPeriodeByProdiIdWithCountMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  //   belum pass
  //   it("should return all angkatan with count of mahasiswa and status 200", async () => {
  //     const prodiId = "prodi1";
  //     req.params.id_prodi = prodiId;

  //     const mockPeriodeList = [
  //       { periode_pelaporan: "20201", id_prodi: prodiId },
  //       { periode_pelaporan: "20211", id_prodi: prodiId },
  //     ];

  //     const mockMahasiswaList = [
  //       {
  //         nama_periode_masuk: "20201",
  //         nama_status_mahasiswa: null,
  //         Periode: { periode_pelaporan: "20201" },
  //       },
  //       {
  //         nama_periode_masuk: "20211",
  //         nama_status_mahasiswa: null,
  //         Periode: { periode_pelaporan: "20211" },
  //       },
  //     ];

  //     const mockAngkatanList = [
  //       { tahun: "2020", id: "angkatan1" },
  //       { tahun: "2021", id: "angkatan2" },
  //     ];

  //     Periode.findAll.mockResolvedValue(mockPeriodeList);
  //     Mahasiswa.findAll.mockResolvedValue(mockMahasiswaList);
  //     Angkatan.findAll.mockResolvedValue(mockAngkatanList);

  //     await getPeriodeByProdiIdWithCountMahasiswa(req, res, next);

  //     expect(Periode.findAll).toHaveBeenCalledWith({
  //       where: { id_prodi: prodiId },
  //     });

  //     expect(Mahasiswa.findAll).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         include: [
  //           {
  //             model: Periode,
  //             where: {
  //               periode_pelaporan: {
  //                 [Sequelize.Op.or]: [{ [Sequelize.Op.like]: "2020%" }, { [Sequelize.Op.like]: "2021%" }],
  //               },
  //             },
  //           },
  //         ],
  //       })
  //     );

  //     expect(Angkatan.findAll).toHaveBeenCalledWith({
  //       where: {
  //         tahun: {
  //           [Sequelize.Op.in]: ["2020", "2021"],
  //         },
  //       },
  //     });

  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: `<===== GET All Angkatan By Prodi ID ${prodiId} With Count Mahasiswa Success`,
  //       jumlahData: 2,
  //       data: [
  //         {
  //           id_angkatan: "angkatan1",
  //           tahun: "2020",
  //           jumlahMahasiswa: 1,
  //           jumlahMahasiswaBelumSetSK: 1,
  //         },
  //         {
  //           id_angkatan: "angkatan2",
  //           tahun: "2021",
  //           jumlahMahasiswa: 1,
  //           jumlahMahasiswaBelumSetSK: 1,
  //         },
  //       ],
  //     });
  //   });

  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Periode.findAll.mockRejectedValue(new Error(errorMessage));

    await getPeriodeByProdiIdWithCountMahasiswa(req, res, next);

    expect(Periode.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
