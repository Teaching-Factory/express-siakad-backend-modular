const httpMocks = require("node-mocks-http");
const { createBerita } = require("../../src/controllers/berita");
const { Berita } = require("../../models");

jest.mock("../../models");

describe("createBerita", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new berita and return 201", async () => {
    const newBeritaData = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    const createdBerita = { id: 1, ...newBeritaData, thumbnail: "http://localhost:4000/src/storage/berita/file.jpg" };

    req.body = newBeritaData;
    req.file = { filename: "file.jpg", mimetype: "image/jpeg" }; // Mocking file upload

    Berita.create.mockResolvedValue(createdBerita);

    await createBerita(req, res, next);

    expect(Berita.create).toHaveBeenCalledWith({
      ...newBeritaData,
      thumbnail: "http://localhost:4000/src/storage/berita/file.jpg",
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Berita Success =====>",
      data: createdBerita,
    });
  });

  it("should return 400 if file type is not supported", async () => {
    req.body = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    req.file = { filename: "file.txt", mimetype: "text/plain" }; // Mocking unsupported file upload

    await createBerita(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "File type not supported",
    });
  });

  it("should handle errors", async () => {
    const newBeritaData = {
      judul_berita: "Judul Berita",
      deskripsi_pendek: "Deskripsi Pendek",
      kategori_berita: "Kategori",
      share_public: true,
      konten_berita: "Konten Berita",
    };

    req.body = newBeritaData;
    req.file = { filename: "file.jpg", mimetype: "image/jpeg" }; // Mocking file upload

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Berita.create.mockRejectedValue(error);

    await createBerita(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
