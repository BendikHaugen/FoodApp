import express, { Request, Response, NextFunction } from "express";
import { Food, Vandor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "No available restaurants found" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "No available restaurants found" });
};

export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rationg", "descending"]])
    .populate("foods");

  if (result.length) {
    // FIND THE RELEVANT FOODS
    const availableFoodItems = await Food.aggregate([
      {
        $match: {
          readyTime: {
            $lte: 30,
          },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
        },
      },
      {
        $match: {
          $and: [
            { "vendor.pinCode": pincode },
            {
              "vendor.serviceAvailable": {
                $eq: true,
              },
            },
          ],
        },
      },
      // TODO: Remove and add fields based on the requirement
      // {
      //   $set: {
      //     pinCode: pinCode,
      //   },
      // },
      // {
      //   $unset: 'vendor',
      // },
    ]);
    return res.status(200).json(availableFoodItems);
  }

  return res.status(400).json({ message: "No available restaurants found" });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;
  // QUERY IS UNCECKED
  const result = await Food.aggregate([
    {
      $lookup: {
        from: "vendors",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $unwind: {
        path: "$vendor",
      },
    },
    {
      $match: {
        $and: [
          { "vendor.pinCode": pincode },
          {
            "vendor.serviceAvailable": {
              $eq: true,
            },
          },
        ],
      },
    },
    // TODO: Remove and add fields based on the requirement
    // {
    //   $set: {
    //     pinCode: pinCode,
    //   },
    // },
    // {
    //   $unset: 'vendor',
    // },
  ]);

  if (result.length) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "No available restaurants found" });
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.params;
  const result = await Vandor.findById(_id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "No such resturant exists" });
};
