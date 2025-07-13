import UserModel from "@/server/models/users";


export async function GET (req:Request) {
    const id = req.headers.get("x-user-id");
    if (!id) {
        return new Response(JSON.stringify({ message: "User ID not provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    const user = await UserModel.userById(id)

    return Response.json(user)
}