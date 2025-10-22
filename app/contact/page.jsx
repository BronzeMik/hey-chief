"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // adjust or replace with a plain <button> if not using shadcn

// Contact page wired to Web3Forms
// - Replace process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY with your key
// - The page uses client-side fetch to POST to https://api.web3forms.com/submit
// - Includes a honeypot (botcheck) and a noscript fallback HTML form

export default function ContactPage() {
  const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null, // null | true | false
    message: "",
  });

  const handleChange = (e) =>
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, message: "" });

    // Basic client-side validation
    if (!form.name || !form.email || !form.message) {
      setStatus({ loading: false, success: false, message: "Please complete required fields." });
      return;
    }

    try {
      const payload = new FormData();
      payload.append("access_key", ACCESS_KEY);
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("subject", form.subject || "Contact form submission");
      payload.append("message", form.message);
      payload.append("phone", form.phone || "");
      // honeypot: named botcheck — keep blank in UI, bots may fill it
      payload.append("botcheck", "");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });

      const json = await res.json();

      if (json?.success) {
        setStatus({ loading: false, success: true, message: "Message sent! Thank you — we'll be in touch." });
        setForm({ name: "", email: "", subject: "", message: "", phone: "" });
      } else {
        setStatus({
          loading: false,
          success: false,
          message: json?.body?.message || "Submission failed. Try again later.",
        });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, message: err?.message || "Network error. Try again later." });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-900 antialiased font-sans">
      

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Contact Us</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Have a question about an order, a partnership, or want to share your story? We’re here for you. Fill the form
          below or use the contact details to reach us directly.
        </p>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: contact info + map */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Get in touch</h3>
            <p className="text-gray-700 mb-4">You can also reach us directly using the details below.</p>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <a href="mailto:hello@eyesrightofficial.com" className="text-gray-900 font-medium hover:underline">hello@eyesrightofficial.com</a>
              </div>

              {/* <div>
                <div className="text-xs text-gray-500">Phone</div>
                <a href="tel:+18005551234" className="text-gray-900 font-medium hover:underline">+1 (800) 555-1234</a>
              </div>

              <div>
                <div className="text-xs text-gray-500">Mailing address</div>
                <address className="not-italic text-gray-900">
                  123 Veteran Ave<br/>Anytown, USA 12345
                </address>
              </div> */}

              <div>
                <div className="text-xs text-gray-500">Office hours</div>
                <div className="text-gray-900">Mon — Fri: 9:00 AM — 5:00 PM CT</div>
              </div>
            </div>
          </div>

          

          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-sm">
            <strong>Press & Partnerships</strong>
            <p className="mt-2 text-gray-700">For media inquiries or partnership opportunities, please use the form and select subject 'Partnership'.</p>
          </div>
        </aside>

        {/* Right: form (spans 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold mb-4">Send us a message</h3>
            <p className="text-sm text-gray-600 mb-6">We typically respond within 1-2 business days.</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Full name <span className="text-red-600">*</span></span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-red-700"
                    placeholder="Jane Doe"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Email <span className="text-red-600">*</span></span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-red-700"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Phone (optional)</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    placeholder="(555) 555-5555"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Subject</span>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    placeholder="Order question, partnership, etc."
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Message <span className="text-red-600">*</span></span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-red-700"
                  placeholder="Tell us how we can help..."
                />
              </label>

              {/* Honeypot (hidden) — leave name botcheck so bots fill it, humans won't */}
              <label className="hidden" aria-hidden="true">
                <span>Leave this field blank</span>
                <input name="botcheck" tabIndex={-1} autoComplete="off" />
              </label>

              {/* Buttons & status */}
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  className={`px-6 py-2 rounded ${status.loading ? "opacity-60 pointer-events-none" : ""}`}
                  disabled={status.loading}
                >
                  {status.loading ? "Sending..." : "Send Message"}
                </Button>

                {status.success === true && <div className="text-green-700">{status.message}</div>}
                {status.success === false && <div className="text-red-700">{status.message}</div>}
              </div>
            </form>

            {/* noscript fallback: plain form that posts directly to Web3Forms when JS disabled */}
            <noscript>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm">
                  If you have trouble with the form, please email us at{" "}
                  <a href="mailto:hello@eyesrightofficial.com" className="underline">hello@eyesrightofficial.com</a>.
                </p>
              </div>

              <form action="https://api.web3forms.com/submit" method="POST" className="mt-6 space-y-3">
                <input type="hidden" name="access_key" value={ACCESS_KEY} />
                <input type="text" name="name" placeholder="Name" required className="block w-full rounded-md border px-3 py-2" />
                <input type="email" name="email" placeholder="Email" required className="block w-full rounded-md border px-3 py-2" />
                <input type="text" name="subject" placeholder="Subject" className="block w-full rounded-md border px-3 py-2" />
                <textarea name="message" placeholder="Message" required className="block w-full rounded-md border px-3 py-2" rows="5"></textarea>
                <input type="hidden" name="botcheck" value="" />
                <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded">Send (no JS)</button>
              </form>
            </noscript>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Eyes Right Official — All rights reserved
        </div>
      </footer>
    </main>
  );
}
