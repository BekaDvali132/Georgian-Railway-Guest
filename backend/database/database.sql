CREATE DATABASE georgianRailway;

CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    name_ka varchar(255) NOT NULL,
    name_en varchar(255) NOT NULL,
    name_ru varchar(255) NOT NULL,
    flag_image_path varchar(255) NOT NULL,
    country_phone_code varchar(255) NOT NULL
);

ALTER TABLE countries
ADD created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD completed_at TIMESTAMPTZ;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    role int NOT NULL DEFAULT 1,
    email varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);