import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "./Navbar";

const ContactUs = () => {
  // --- BRAND COLORS ---
  const BRAND_DARK = "#2e2e3c";
  const ACCENT_LIGHT = "text-gray-300";

  // FIX: Define companyName, which was missing and caused a ReferenceError in the footer.
  const companyName = "Bazario";

  // --- STATE FOR FORM HANDLING ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for actual form submission logic (e.g., API call)
    setStatus("Sending...");

    // Simulate API delay
    setTimeout(() => {
      setStatus("Message Sent Successfully! We will respond shortly.");
      setFormData({ name: "", email: "", message: "" });
      // Clear status message after a few seconds
      setTimeout(() => setStatus(""), 5000);
    }, 2000);
  };

  // --- CONTACT INFORMATION ---
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Address",
      detail: "support@bazario.com",
      href: "mailto:support@bazario.com",
    },
    {
      icon: Phone,
      title: "Phone Number",
      detail: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Our HQ Location",
      detail: "100 Innovation Drive, Suite 200, Metropolis, USA",
      href: "#",
    },
  ];

  return (
    <>
      <Navbar />
      // Added pt-24 here too, assuming a fixed Navbar is used
      <div className="min-h-screen bg-gray-50 antialiased font-sans pt-24">
        {/* Assuming Navbar component is defined and imported */}
        {/* <Navbar /> */}

        {/* Hero Section */}
        <header className="bg-[#fff] shadow-lg rounded-xl overflow-hidden max-w-7xl mx-auto mb-16">
          <div className="py-16 px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Get In Touch
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
              We're here to help! Whether you have a question about products,
              orders, or partnership opportunities.
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form Section (2/3 width on desktop) */}
            <div className="lg:col-span-2 bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e2e3c] focus:border-[#2e2e3c] transition duration-150"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e2e3c] focus:border-[#2e2e3c] transition duration-150"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e2e3c] focus:border-[#2e2e3c] transition duration-150"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                {/* Submission Status */}
                {status && (
                  <div
                    className={`p-3 rounded-lg text-sm font-medium ${
                      status.includes("Successfully")
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-[#2e2e3c] hover:bg-gray-800 transition duration-300 transform hover:scale-[1.01]"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Inquiry
                </button>
              </form>
            </div>

            {/* Contact Details & Map (1/3 width on desktop) */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Details Cards */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                  Reach Out Directly
                </h3>
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start group"
                  >
                    <div className="p-3 rounded-full bg-gray-100 text-[#2e2e3c] flex-shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {item.title}
                      </p>
                      <p className="text-lg text-gray-900 font-medium group-hover:text-[#2e2e3c] transition duration-150">
                        {item.detail}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

            
              
            </div>
          </div>
        </main>

        {/* Footer (simple placeholder) */}
        <footer className="bg-gray-800 text-white text-center py-8 mt-12">
          <p>
            &copy; {new Date().getFullYear()} {companyName}. All rights
            reserved. | Bazario.
          </p>
        </footer>
      </div>
    </>
  );
};

export default ContactUs;
