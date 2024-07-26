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
exports.UpdateVandorCoverImage = exports.getFoods = exports.addFood = exports.VandorLogin = exports.UpdateVandorService = exports.UpdateVandorProfile = exports.GetVandorProfile = void 0;
const utility_1 = require("../utility");
const AdminController_1 = require("./AdminController");
const models_1 = require("../models");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, AdminController_1.FindVandor)(undefined, email);
    if (existingVandor) {
        const valid = yield (0, utility_1.ValidatePassword)(password, existingVandor.password, existingVandor.salt);
        if (valid) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodtypes: existingVandor.foodType,
                name: existingVandor.name,
            });
            return res.json(signature);
        }
        return res.json({ message: "Password is not valid" });
    }
    return res.json({ message: "Login credentials not valid" });
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.FindVandor)(user._id);
        return res.json(existingVandor);
    }
    return res.json({ message: "Vandor information not found" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodTypes, name, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (existingVandor) {
            existingVandor.name = name;
            existingVandor.foodType = foodTypes;
            existingVandor.address = address;
            existingVandor.phone = phone;
            const savedResult = existingVandor.save();
            return res.json(savedResult);
        }
    }
    return res.json({ message: "Vandor information not found" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (existingVandor) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const savedResult = existingVandor.save();
            return res.json(savedResult);
        }
    }
    return res.json({ message: "Vandor information not found" });
});
exports.UpdateVandorService = UpdateVandorService;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        // prettier-ignore
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (vandor) {
            const files = req.files;
            const images = files.map((file) => file.path);
            const createdFood = yield models_1.Food.create({
                vandorId: vandor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
            });
            vandor.foods.push(createdFood);
            const result = yield vandor.save();
            return res.json(result);
        }
    }
});
exports.addFood = addFood;
const UpdateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (vandor) {
            const files = req.files;
            const images = files.map((file) => file.path);
            vandor.coverImages.push(...images);
            const result = yield vandor.save();
            return res.json(result);
        }
    }
});
exports.UpdateVandorCoverImage = UpdateVandorCoverImage;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vandorId: user._id });
        if (foods) {
            return res.json(foods);
        }
        return res.json({ message: "Food information not found" });
    }
});
exports.getFoods = getFoods;
//# sourceMappingURL=VandorController.js.map