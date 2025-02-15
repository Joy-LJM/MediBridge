// import React from 'react'

import Footer from "../components/Footer";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Dashboard from "./Dashboard";

export default function Home() {
  return (
    <div className="container">
      <Header />
      <Navigation />
      <Dashboard />
      <Footer />
    </div>
  );
}
