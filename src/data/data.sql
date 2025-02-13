BEGIN;

DROP TABLE IF EXISTS "tasks","categories" CASCADE;

CREATE TABLE "categories" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL default(now()),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "tasks" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "text" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "category_id" INT NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL default(now()),
    "updated_at" TIMESTAMPTZ
);

COMMIT;