import { relations } from "drizzle-orm";
import { pgTable, integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const categoryTable = pgTable("category", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productTable),
}));

export const productTable = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid("category_id").notNull().references(() => categoryTable.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const prodcutRelations = relations(productTable, (params) => {
  return {
    category: params.one(categoryTable, {
      fields: [productTable.categoryId],
      references: [categoryTable.id],
    }),
    variants: params.many(productVariantTable),
  };
});

export const productVariantTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id),
  name: text().notNull(),
  color: text().notNull(),
  slug: text().notNull().unique(),
  priceInCents: integer("price_in_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantRelations = relations(
  productVariantTable,
  (params) => {
    return {
      product: params.one(productTable, {
        fields: [productVariantTable.productId],
        references: [productTable.id],
      }),
    };
  },
);

