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
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const Customer_1 = require("../models/Customer");
const CustomerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInput, {
        validationError: { target: false },
    });
    if (inputErrors) {
        return res.status(400).json({ errors: inputErrors });
    }
    const { email, phone, password } = customerInput;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.generateOTP)();
    const otp_expiry = new Date();
    const result = yield Customer_1.Customer.create({
        email,
        phone,
        password: userPassword,
        salt,
        otp,
        otp_expiry,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0,
    });
    if (result) {
        // send OTP to user
        yield (0, utility_1.onRequestOTP)(otp, phone);
        // genertate the signature
        const signature = (0, utility_1.GenerateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified,
        });
        // send the result to client
        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email,
            phone: result.phone,
            id: result.id,
        });
    }
    return res.status(500).json({ message: "Error creating user" });
});
exports.CustomerSignup = CustomerSignup;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToInstance)(Customer_dto_1.UserLoginInputs, req.body);
    const lgoinErrors = yield (0, class_validator_1.validate)(loginInputs, {
        validationError: { target: false },
    });
    if (lgoinErrors.length) {
        return res.status(400).json({ errors: lgoinErrors });
    }
    const { email, password } = loginInputs;
    const customer = yield Customer_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified,
            });
            // send the result to client
            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email,
                phone: customer.phone,
                id: customer.id,
            });
        }
        else {
            return res.status(500).json({ message: "Password and email not valid" });
        }
    }
    return res.status(500).json({ message: "Loggin error" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry > new Date()) {
                profile.verified = true;
                const result = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: profile.id,
                    email: profile.email,
                    verified: profile.verified,
                });
                return res.status(201).json({
                    signature: signature,
                    verified: result.verified,
                    email: result.email,
                    phone: result.phone,
                });
            }
            return res.status(500).json({ message: "OTP is not valid" });
        }
        return res.status(404).json({ message: "User not found" });
    }
});
exports.CustomerVerify = CustomerVerify;
const RequestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.generateOTP)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.onRequestOTP)(otp, profile.phone);
            return res
                .status(201)
                .json({ message: "OTP sent to registered phone number" });
        }
    }
    return res.status(404).json({ message: "Error with OTP request" });
});
exports.RequestOTP = RequestOTP;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(404).json({ message: "User not found" });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToInstance)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, {
        validationError: { target: false },
    });
    if (!profileErrors.length) {
        return res.status(400).json({ errors: profileErrors });
    }
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            const { firstName, lastName, address } = profile;
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map