import ProductModel from "@/server/models/products";

type detail = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, { params }: detail) {
  try {
    const { id } = await params;
    const product = await ProductModel.findById(id);

    return Response.json({ product }, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: detail) {
  try {
    const { id } = await params;
    const body = await req.json();

    const product = await ProductModel.updateVendor(body, id);

    return Response.json({ product }, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
}


export async function DELETE (req: Request, { params }: detail) {
  try {
    const { id } = await params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Assuming a delete method exists in ProductModel
    await ProductModel.deleteProduct(id);

    return Response.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}