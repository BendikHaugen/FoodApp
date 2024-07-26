"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.APP_SECRET = exports.MONGO_URI = void 0;
exports.MONGO_URI = process.env.MONGO_URI ||
    "mongodb+srv://bhau:foodapplocal@foodapp.imxuxlo.mongodb.net/?retryWrites=true&w=majority&appName=FoodApp";
/*
mongodb+srv://bhau:foodapplocal@foodapp.imxuxlo.mongodb.net/?retryWrites=true&w=majority&appName=FoodApp
*/
exports.APP_SECRET = "App_secret";
exports.PORT = process.env.PORT || 8000;
//# sourceMappingURL=index.js.map