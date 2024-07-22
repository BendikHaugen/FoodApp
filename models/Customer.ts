import mongoose, { Schema, Document } from "mongoose";

interface CustomerDoc extends Document {
  email: string;
  phone: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
}

const CustomerSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: String, required: true },
    opt_expiry: { type: Date, required: true },
    lat: { type: Number },
    long: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password,
          delete ret.salt,
          delete ret.__v,
          delete ret.createdAt,
          delete ret.updatedAt;
      },
    },
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
