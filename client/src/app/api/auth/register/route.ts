import { IUser, User } from "@/server/interfaces/user";
import UserModel from "@/server/models/users";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const payload: User = await req.json();
    const newUser = await UserModel.registerUser(payload);

    console.log(newUser,"JJJJJ");
    
    return Response.json(newUser, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const issues = err.issues;
      const issue = issues[0];
      return Response.json({ message: issue.message }, { status: 400 });
    } else {
      return Response.json(
        { message: "internal server error" },
        { status: 500 }
      );
    }
  }
}
