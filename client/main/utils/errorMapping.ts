import { Response } from "@angular/http";

export const BACKEND_ERROR_MAPPING = {
    "Email is incorrect": "Неправельный формат емейла",
    "Password is incorrect": "Неправельный формат пароля",
    "Name is incorrect": "Неправельный формат имени",
    "Surname is incorrect": "Неправельный формат фамилии",
    "Last name is incorrect": "Неправельный формат отчества",
    "Email was already used": "Емейл уже использован",
    "Password or email is wrong": "Пароль или емейл неправельный"
};

export const BACKEND_AUTH_FIELDS = {
    "email": "емейл",
    "password": "пароль",
    "name": "имя",
    "surname": "фамилия",
    "lastName": "отчество"
};

export const DATABASE_ERRORS = {
    "not_found": "Не найдено"
};