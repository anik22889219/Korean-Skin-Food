import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DiscountPopup } from '../components/DiscountPopup';

import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { ProductDetail } from '../pages/ProductDetail';
import { CartPage } from '../pages/CartPage';
import { Checkout } from '../pages/Checkout';
import { Account } from '../pages/Account';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { TrackOrder } from '../pages/TrackOrder';
import { OrderConfirmation } from '../pages/OrderConfirmation';
import { NotFound } from '../pages/NotFound';

export const PublicRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/shop"               element={<Shop />} />
        <Route path="/search"             element={<Shop />} />
        <Route path="/offers"             element={<Shop isOffersOnly />} />
        <Route path="/product/:id"        element={<ProductDetail />} />
        <Route path="/category/:slug"     element={<Shop />} />
        <Route path="/cart"               element={<CartPage />} />
        <Route path="/checkout"           element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/track-order"        element={<TrackOrder />} />
        <Route path="/account"            element={<Account />} />
        <Route path="/account/*"          element={<Account />} />
        <Route path="/about"              element={<About />} />
        <Route path="/contact"            element={<Contact />} />
        <Route path="*"                   element={<NotFound />} />
      </Routes>
      <DiscountPopup />
    </Layout>
  );
};
