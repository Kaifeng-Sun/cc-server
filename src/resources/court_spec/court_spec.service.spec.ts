import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { CourtSpecService } from "./court_spec.service";
import { CourtSpec } from "./schemas/court_spec.schema";
import { createMock } from "@golevelup/ts-jest";
import { Model, Query } from "mongoose";
import { HttpException } from "@nestjs/common";

const mockCourt = {
  id: 1,
  name: "Court #1",
  length: 10000,
  width: 2000,
  centreCircleRadius: 1800,
  threePointRadius: 6000,
  threePointLine: 2300,
  lengthOfCorner: 2000,
  restrictedAreaLength: 2000,
  restrictedAreaWidth: 2000,
  sideBorderWidth: 2000,
  lineBorderWidth: 50,
  description: "Court #1",
};

const courtArray = [
  {
    id: 1,
    name: "Court #1",
    length: 10000,
    width: 2000,
    centreCircleRadius: 1800,
    threePointRadius: 6000,
    threePointLine: 2300,
    lengthOfCorner: 2000,
    restrictedAreaLength: 2000,
    restrictedAreaWidth: 2000,
    sideBorderWidth: 2000,
    lineBorderWidth: 50,
    description: "Court #1",
  },
  {
    id: 2,
    name: "Court #2",
    length: 10000,
    width: 2000,
    centreCircleRadius: 1800,
    threePointRadius: 6000,
    threePointLine: 2300,
    lengthOfCorner: 2000,
    restrictedAreaLength: 2000,
    restrictedAreaWidth: 2000,
    sideBorderWidth: 2000,
    lineBorderWidth: 50,
    description: "Court #2",
  },
];

describe("CourtSpecService", () => {
  let service: CourtSpecService;
  let model: Model<CourtSpec>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourtSpecService,
        {
          provide: getModelToken(CourtSpec.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockCourt),
            constructor: jest.fn().mockResolvedValue(mockCourt),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CourtSpecService);
    model = module.get<Model<CourtSpec>>(getModelToken(CourtSpec.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all courts", async () => {
    jest.spyOn(model, "find").mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(courtArray),
    } as any);
    const courts = await service.getAllCourtSizes();
    expect(courts).toEqual(courtArray);
  });

  it("should get one court by name", async () => {
    jest.spyOn(model, "findOne").mockReturnValueOnce(
      createMock<Query<any, any>>({
        exec: jest.fn().mockResolvedValueOnce(mockCourt),
      }) as any,
    );
    const courts = await service.getCourtSpecById("1");
    expect(courts).toEqual(mockCourt);
  });

  it("should insert a new court", async () => {
    const foundCourt = jest.spyOn(model, "findOne").mockReturnValueOnce(
      createMock<Query<any, any>>({
        exec: jest.fn().mockResolvedValueOnce(mockCourt),
      }) as any,
    );

    const throwException = () => {
      throw new HttpException(`name already exists, please try another name`, 400);
    };
    if (foundCourt) {
      expect(throwException).toThrow(HttpException);
      expect(throwException).toThrow("name already exists, please try another name");
    }

    jest.spyOn(model, "create").mockImplementationOnce(() => Promise.resolve(mockCourt));
    const newCourt = await service.create(mockCourt);
    expect(newCourt).toEqual(mockCourt);
  });

  it("should update a court successfully", async () => {
    jest.spyOn(model, "findOneAndUpdate").mockReturnValueOnce(
      createMock<Query<any, any>>({
        exec: jest.fn().mockResolvedValueOnce(mockCourt),
      }) as any,
    );
    const updatedCourt = await service.updateCourtSpecById("1", mockCourt);
    expect(updatedCourt).toEqual(mockCourt);
  });

  it("should delete a court successfully", async () => {
    jest.spyOn(model, "remove").mockResolvedValueOnce(true as any);
    expect(await service.removeCourtSpecById("1")).toEqual({ deleted: true });
  });

  it("should not delete a court", async () => {
    jest.spyOn(model, "remove").mockRejectedValueOnce(new Error("Bad delete"));
    expect(await service.removeCourtSpecById("1")).toEqual({
      deleted: false,
      message: "Bad delete",
    });
  });
});
