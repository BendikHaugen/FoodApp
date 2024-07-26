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
exports.GetVanodrById = exports.GetVandors = exports.CreateVandor = exports.FindVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const FindVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (id) {
        return yield models_1.Vandor.findById(id);
    }
    return yield models_1.Vandor.findOne({ email: email });
});
exports.FindVandor = FindVandor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, foodType, email, password, ownerName, phone, } = req.body;
    const existingVandor = yield (0, exports.FindVandor)(email);
    if (existingVandor) {
        return res
            .status(400)
            .json({ message: `Vandor with email: ${email} already exists` });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const createdVandor = yield models_1.Vandor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        ownerName: ownerName,
        phone: phone,
        salt: salt,
        serviceAvailable: false,
        coverImages: [],
        rating: 0,
        foods: [],
    });
    return res.json(createdVandor);
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield models_1.Vandor.find();
    if (vandors !== null) {
        return res.json(vandors);
    }
    return res.json({ message: "Vandors data not available" });
});
exports.GetVandors = GetVandors;
const GetVanodrById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorId = req.params.id;
    const vandor = yield (0, exports.FindVandor)(vandorId);
    if (vandor !== null) {
        return res.json(vandor);
    }
    return res.json({ message: "Vandors data not available" });
});
exports.GetVanodrById = GetVanodrById;
//# sourceMappingURL=AdminController.js.map