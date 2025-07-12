import ProductModel from "@/server/models/products";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id") as string
    
    const product = await ProductModel.findVendorProducts(userId);

    return Response.json(product, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
