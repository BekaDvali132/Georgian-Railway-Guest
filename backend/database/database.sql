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

CREATE TABLE physical_customers(
    id SERIAL PRIMARY KEY,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    gender int NOT NULL,
    citizenship int NOT NULL REFERENCES countries(id),
    personal_number varchar(255),
    passport_number varchar(255),
    country_phone_code varchar(255) NOT NULL,
    phone_number varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_types(
    id SERIAL PRIMARY KEY,
    name_ka varchar(255) NOT NULL,
    name_en varchar(255) NOT NULL,
    name_ru varchar(255) NOT NULL
);

CREATE TABLE legal_customers(
    id SERIAL PRIMARY KEY,
    country int NOT NULL REFERENCES countries(id),
    identification_number varchar(255) NOT NULL,
    organization_type_id int NOT NULL REFERENCES organization_types(id),
    organization_name varchar(255) NOT NULL,
    bank_account_number varchar(255) NOT NULL,
    legal_address text NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);