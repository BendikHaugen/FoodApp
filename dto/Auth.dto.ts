import { VandorPayload } from "./Vandor.dto";
import { CustomerPayLoad } from "./Customer.dto";

export type AuthPayload = VandorPayload | CustomerPayLoad;
