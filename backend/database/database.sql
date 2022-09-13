CREATE DATABASE georgianRailway;

CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    name_ka varchar(255),
    name_en varchar(255),
    name_ru varchar(255),
    flag_image_path varchar(255),
    country_phone_code varchar(255)
);