import { IVendorCreate } from "@/server/interfaces/vendor";
import VendorModel from "@/server/models/vendors";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";

export async function GET(req: Request) {
   try {
        const id = req.headers.get('x-user-id') as string;
        if (!id) {
            return new Response("User ID is required", { status: 400 });
        }
        const vendors = await VendorModel.userVendors(id);
        return Response.json(vendors, { status: 200 });
   } catch (err:unknown) {
        if (err instanceof Error) {
            return new Response(err.message, { status: 400 });
        } else if (err instanceof ZodError) {
            const issues = err.issues;
            const issue = issues[0];
            return Response.json({
                message: issue.message,
            }, { status: 400 });
        } else {
            return new Response("An unexpected error occurred", { status: 500 });
        }
    
   }

}

export async function POST(req: Request) {
    try {
        const id = req.headers.get('x-user-id') as string;
        const payload: IVendorCreate = await req.json();
        const result = await VendorModel.createVendor(payload);
        const vendor =  {
            ...result,
            status: "pending", // default status
            userId: new ObjectId(id) // assuming id is a valid ObjectId
        }
        return Response.json(vendor, { status: 201 });
    } catch (err:unknown) {
        if(err instanceof Error) {
            return new Response(err.message, { status: 400 });
        }
            else if (err instanceof ZodError) {
                const issues = err.issues
                const issue = issues[0]
                return Response.json({
                    message: issue.message,
            } , { status: 400 });
        }  else {
            return new Response("An unexpected error occurred", { status: 500 });
        }
    }
}