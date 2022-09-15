CREATE DATABASE georgianRailway;

CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    name_ka varchar(255),
    name_en varchar(255),
    name_ru varchar(255),
    flag_image_path varchar(255),
    country_phone_code varchar(255)
);

ALTER TABLE countries
ADD created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD completed_at TIMESTAMPTZ;

CREATE TABLE files(
    id SERIAL PRIMARY KEY,
    in_use boolean DEFAULT false,
    file_path varchar(255)
);