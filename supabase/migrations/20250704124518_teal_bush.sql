/*
  # Fix trimestre and semestre column types

  1. Changes
    - Change `trimestre` column from text to integer
    - Change `semestre` column from text to integer

  2. Notes
    - This fixes the type mismatch between the database schema and TypeScript interface
    - Ensures consistency with the application's data processing logic
*/

-- Change trimestre column from text to integer
ALTER TABLE sales_records ALTER COLUMN trimestre TYPE integer USING trimestre::integer;

-- Change semestre column from text to integer  
ALTER TABLE sales_records ALTER COLUMN semestre TYPE integer USING semestre::integer;