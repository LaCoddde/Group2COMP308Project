import React, { useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import logo from '../images/logo.jpg';

export default function SignIn() {
    const [searchParams] = useSearchParams();
    const roleFromUrl = searchParams.get("role");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const selectedRole = roleFromUrl === "patient" ? "patient" : "nurse";
    const { setLogin, loginData } = useContext(AuthContext);
    const isAuthed = Boolean(localStorage.getItem("token"));
    const role = loginData?.roleId;
    const logoTarget = isAuthed ? (role === "patient" ? "/patient-dashboard" : "/nurse-dashboard") : "/";

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/auth/login`, {
                email,
                password
            });
            if (response && response.data) {
                localStorage.setItem('token', response.data.token);
                setLogin(response.data);
            }
            const { roleId } = response.data;
            switch (roleId) {
                case "nurse":
                    navigate("/nurse-dashboard");
                    break;
                case "patient":
                    navigate("/patient-dashboard");
                    break;
                default:
                    console.error("Invalid role ID:", roleId);
            }
        } catch (error) {
            // Handle login error
            console.error("Login error:", error.response.data.message);
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Link to={logoTarget}>
                        <img
                            className="mx-auto h-20 w-auto"
                            src={logo}
                            alt="Med Path"
                        />
                    </Link>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <div className="mt-6 flex justify-center">
                        <span
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                                selectedRole === "nurse"
                                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                        >
                            {selectedRole === "nurse" ? "🩺 Nurse portal" : "🏥 Patient portal"}
                        </span>
                    </div>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                    selectedRole === "nurse"
                                        ? "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
                                        : "bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600"
                                }`}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Haven't registered yet?{' '}
                        <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign Up here
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
