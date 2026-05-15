import { productService } from './api/product.service';
import { orderService } from './api/order.service';
import { authService } from './api/auth.service';
import { customerService } from './api/customer.service';
import { adminService } from './api/admin.service';

export const api = {
  ...productService,
  ...orderService,
  ...authService,
  ...customerService,
  ...adminService,
};
