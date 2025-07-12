export interface IProduct {
  vendorId: string; // reference to Vendor._id
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string; // pcs, kg, meter, etc.
  stock: number;
  images?: string; // array of image URLs
  specifications?: Record<string, any>; // flexible object for product specs
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface IProductCreate {
  vendorId: string; // reference to Vendor._id
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string; // pcs, kg, meter, etc.
  stock: number;
  images?: string; // array of image URLs
  specifications?: Record<string, any>; // flexible object for product specs
}

export interface IProductUpdate {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  unit?: string; // pcs, kg, meter, etc.
  stock?: number;
  images?: string; // array of image URLs
  specifications?: Record<string, any>; // flexible object for product specs
  status?: "active" | "inactive";
}
