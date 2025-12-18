import React from 'react'
import { Link } from 'react-router-dom';
import Header from './Header';

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
     <Header/>
      <div className="relative isolate flex-1 overflow-hidden px-6 pt-24 pb-12 lg:px-8">
        <div
          className="absolute inset-x-0 -top-28 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-56"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-9rem)] aspect-[1155/678] w-[28rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-26rem)] sm:w-[56rem]"
          />
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
          <div className="space-y-4 sm:space-y-5">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Med Path
            </h1>
            <p className="text-lg leading-8 text-gray-600">
                "Your Health Our Priority"
            </p>
            <p className="text-xl leading-8 text-gray-600">
                Your Trusted Partner in Post-Hospitalization Care
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/login?role=nurse"
              className="group relative block w-64 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-3">🩺</div>
              <h3 className="text-xl font-bold text-white">I'm a Nurse</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Access patient records, record vital signs, and send reports
              </p>
              <div className="mt-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                Login as Nurse →
              </div>
            </Link>

            <Link
              to="/login?role=patient"
              className="group relative block w-64 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-center shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-3">🏥</div>
              <h3 className="text-xl font-bold text-white">I'm a Patient</h3>
              <p className="mt-2 text-sm text-emerald-100">
                Log daily health info, track symptoms, and view tips
              </p>
              <div className="mt-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                Login as Patient →
              </div>
            </Link>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-16rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-22rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+2rem)] aspect-[1155/678] w-[30rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+26rem)] sm:w-[56rem]"
          />
        </div>
      </div>
    </div>
  )
}
