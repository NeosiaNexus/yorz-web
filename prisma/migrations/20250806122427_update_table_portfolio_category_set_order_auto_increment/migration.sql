-- AlterTable
CREATE SEQUENCE portfolio_category_order_seq;
ALTER TABLE "portfolio_category" ALTER COLUMN "order" SET DEFAULT nextval('portfolio_category_order_seq');
ALTER SEQUENCE portfolio_category_order_seq OWNED BY "portfolio_category"."order";
