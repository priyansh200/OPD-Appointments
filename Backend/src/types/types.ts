export interface NewUserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender: "Male" | "Female" | "Non-Binary";
  dob: Date;
  role: "Admin" | "Patient" | "Doctor" | "Lab";
}

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

export interface NewProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export interface NewOrderRequestBody {
  shippingInfo: {};
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  total: number;
  orderItems: OrderItemType[];
}
