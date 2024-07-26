"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantById = exports.SearchFoods = exports.GetFoodsIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    })
        .sort([["rating", "descending"]])
        .populate("foods");
    if (result.length) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "No available restaurants found" });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    })
        .sort([["rating", "descending"]])
        .limit(10);
    if (result.length) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "No available restaurants found" });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodsIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    })
        .sort([["rationg", "descending"]])
        .populate("foods");
    if (result.length) {
        // FIND THE RELEVANT FOODS
        const availableFoodItems = yield models_1.Food.aggregate([
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
});
exports.GetFoodsIn30Min = GetFoodsIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    // QUERY IS UNCECKED
    const result = yield models_1.Food.aggregate([
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
});
exports.SearchFoods = SearchFoods;
const RestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const result = yield models_1.Vandor.findById(_id).populate("foods");
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "No such resturant exists" });
});
exports.RestaurantById = RestaurantById;
//# sourceMappingURL=ShoppingController.js.map