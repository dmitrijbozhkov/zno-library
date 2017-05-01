export interface UserCreate {
    email: string;
    password: string;
    name: string;
    surname: string;
    lastName: string;
}

export interface LogIn {
    email: string;
    password: string;
    remember_me: boolean;
}

export enum AuthResponse {
    "OK",
    "Email is incorrect",
    "Password is incorrect",
    "Name is incorrect",
    "Surname is incorrect",
    "Last name is incorrect",
    "Remember me is incorrect",
    "User already exists",
    "Password or email is wrong"
}