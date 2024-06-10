import { pgTable, serial, text, integer, varchar, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// State Table
export const State = pgTable('state', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 10 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
});

export const StateRelations = relations(State, ({ one, many }) => ({
  cities: many(City),
}));

// City Table
export const City = pgTable('city', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  zipcode: integer('zipcode').notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  state_id: integer('state_id').references(() => State.id).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
});

export const CityRelations = relations(City, ({ one, many }) => ({
  state: one(State, {
    fields: [City.state_id],
    references: [State.id],
  }),
  addresses: many(Address),
  restaurants: many(Restaurant),
}));

// Address Table
export const Address = pgTable('address', {
  id: serial('id').primaryKey(),
  street_address: varchar('street_address', { length: 255 }).notNull(),
  city_id: integer('city_id').references(() => City.id).notNull(),
  postal_code: integer('postal_code').notNull(),
  updated_at: timestamp('updated_at').notNull(),
  created_at: timestamp('created_at').notNull(),
});

export const AddressRelations = relations(Address, ({ one, many }) => ({
  city: one(City, {
    fields: [Address.city_id],
    references: [City.id],
  }),
  restaurants: many(Restaurant),
  users: many(User),
}));

// Restaurant Table
export const Restaurant = pgTable('restaurant', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  street_address: varchar('street_adress', { length: 255 }).notNull(),
  address_id: integer('address_id').references(() => Address.id).notNull(),
  city_id: integer('city_id').references(() => City.id).notNull(),
  updated_at: timestamp('updated_at').notNull(),
  created_at: timestamp('created_at').notNull(),
});

export const RestaurantRelations = relations(Restaurant, ({ one, many }) => ({
  address: one(Address, {
    fields: [Restaurant.address_id],
    references: [Address.id],
  }),
  city: one(City, {
    fields: [Restaurant.city_id],
    references: [City.id],
  }),
  owners: many(RestaurantOwner),
  menu_items: many(MenuItem),
}));

// User Table
export const User = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contact_phone: varchar('contact_phone', { length: 255 }).notNull(),
  personal_email: varchar('personal_email', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  email_verified_at: timestamp('email_verified_at'),
  password: varchar('password', { length: 255 }).notNull(),
  updated_at: timestamp('updated_at').notNull(),
  created_at: timestamp('created_at').notNull(),
  address_id: integer('address_id').references(() => Address.id).notNull(),
});

export const UserRelations = relations(User, ({ one, many }) => ({
  address: one(Address, {
    fields: [User.address_id],
    references: [Address.id],
  }),
  comments: many(Comment),
}));

// RestaurantOwner Table
export const RestaurantOwner = pgTable('restaurant_owner', {
  id: serial('id').primaryKey(),
  restaurant_id: integer('restaurant_id').references(() => Restaurant.id).notNull(),
  owner_id: integer('owner_id').references(() => User.id).notNull(),
});

export const RestaurantOwnerRelations = relations(RestaurantOwner, ({ one }) => ({
  restaurant: one(Restaurant, {
    fields: [RestaurantOwner.restaurant_id],
    references: [Restaurant.id],
  }),
  owner: one(User, {
    fields: [RestaurantOwner.owner_id],
    references: [User.id],
  }),
}));

// Category Table
export const Category = pgTable('category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const CategoryRelations = relations(Category, ({ many }) => ({
  menu_items: many(MenuItem),
}));

// MenuItem Table
export const MenuItem = pgTable('menu_item', {
  id: serial('id').primaryKey(),
  restaurant_id: integer('restaurant_id').references(() => Restaurant.id).notNull(),
  category_id: integer('category_id').references(() => Category.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  ingredients: text('ingredients').notNull(),
  price: integer('price').notNull(),
  updated_at: timestamp('updated_at').notNull(),
  created_at: timestamp('created_at').notNull(),
});

export const MenuItemRelations = relations(MenuItem, ({ one, many }) => ({
  restaurant: one(Restaurant, {
    fields: [MenuItem.restaurant_id],
    references: [Restaurant.id],
  }),
  category: one(Category, {
    fields: [MenuItem.category_id],
    references: [Category.id],
  }),
  order_items: many(OrderMenuItem),
  comments: many(Comment),
}));

// OrderStatus Table
export const OrderStatus = pgTable('order_status', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 255 }).notNull(),
});

export const OrderStatusRelations = relations(OrderStatus, ({ one, many }) => ({
  orders: many(Orders),
}));

// Orders Table
export const Orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  order_date: timestamp('order_date').notNull(),
  estimated_delivery_time: timestamp('estimated_delivery_time').notNull(),
  actual_delivery_time: timestamp('actual_delivery_time'),
  status_id: integer('status_id').references(() => OrderStatus.id).notNull(),
  price: integer('price').notNull(),
  address_id: integer('address_id').references(() => Address.id).notNull(),
  user_id: integer('user_id').references(() => User.id).notNull(),
  restaurant_id: integer('restaurant_id').references(() => Restaurant.id).notNull(),
});

export const OrdersRelations = relations(Orders, ({ one, many }) => ({
  address: one(Address, {
    fields: [Orders.address_id],
    references: [Address.id],
  }),
  user: one(User, {
    fields: [Orders.user_id],
    references: [User.id],
  }),
  restaurant: one(Restaurant, {
    fields: [Orders.restaurant_id],
    references: [Restaurant.id],
  }),
  order_items: many(OrderMenuItem),
  status: one(OrderStatus, {
    fields: [Orders.status_id],
    references: [OrderStatus.id],
  }),
}));

// OrderMenuItem Table
export const OrderMenuItem = pgTable('order_menu_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => Orders.id).notNull(),
  menu_item_id: integer('menu_item_id').references(() => MenuItem.id).notNull(),
  quantity: integer('quantity').notNull(),
});

export const OrderMenuItemRelations = relations(OrderMenuItem, ({ one }) => ({
  order: one(Orders, {
    fields: [OrderMenuItem.order_id],
    references: [Orders.id],
  }),
  menu_item: one(MenuItem, {
    fields: [OrderMenuItem.menu_item_id],
    references: [MenuItem.id],
  }),
}));

// Comment Table
export const Comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  body: text('body').notNull(),
  user_id: integer('user_id').references(() => User.id).notNull(),
  menu_item_id: integer('menu_item_id').references(() => MenuItem.id).notNull(),
  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});

export const CommentRelations = relations(Comment, ({ one }) => ({
  user: one(User, {
    fields: [Comment.user_id],
    references: [User.id],
  }),
  menu_item: one(MenuItem, {
    fields: [Comment.menu_item_id],
    references: [MenuItem.id],
  }),
}));

// StatusCatalog Table
export const StatusCatalog = pgTable('status_catalog', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const StatusCatalogRelations = relations(StatusCatalog, ({ many }) => ({
  order_status_relations: many(OrderStatusRelation),
}));

// OrderStatusRelation Table
export const OrderStatusRelation = pgTable('order_status_relation', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => Orders.id).notNull(),
  status_catalog_id: integer('status_catalog_id').references(() => StatusCatalog.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const OrderStatusRelationRelations = relations(OrderStatusRelation, ({ one }) => ({
  order: one(Orders, {
    fields: [OrderStatusRelation.order_id],
    references: [Orders.id],
  }),
  status_catalog: one(StatusCatalog, {
    fields: [OrderStatusRelation.status_catalog_id],
    references: [StatusCatalog.id],
  }),
}));
