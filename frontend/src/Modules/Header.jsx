import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Dialog } from "@headlessui/react";
import logo from '../images/logo.jpg';
import { AuthContext } from "../Context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);
  const isAuthed = Boolean(localStorage.getItem("token"));
  const role = loginData?.roleId;
  const dashboardPath = role === "patient" ? "/patient-dashboard" : "/nurse-dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header className="relative inset-x-0 top-0 z-50 bg-gradient-to-r from-[#fffbff] via-[#f7f3ff] to-[#fff7ff] bg-opacity-90 backdrop-blur-md border-b border-white/60">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            to={isAuthed ? dashboardPath : "/"}
            className="-m-1.5 p-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">MedCare</span>
            <img
              className="h-20 w-auto"
              src={logo}
              alt=""
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {localStorage.getItem("token") ? (
            <button
              className="text-md font-semibold leading-6 text-gray-900 mx-1"
              onClick={handleLogout}
            >
              Logout <span aria-hidden="true">&rarr;</span>
            </button>
          ) : (
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff80b5] to-[#9089fc] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign Up
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-br from-[#fffbff] via-white to-[#f6f0ff] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              to={isAuthed ? dashboardPath : "/"}
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">MedCare</span>
              <img
                className="h-10 w-auto"
                src={logo}
                alt="MedCare"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {!localStorage.getItem("token") && (
                <div className="py-6">
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-white bg-gradient-to-r from-[#ff80b5] to-[#9089fc] shadow-lg hover:scale-[1.01] active:scale-[0.99] transition"
                  >
                    Sign Up →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
