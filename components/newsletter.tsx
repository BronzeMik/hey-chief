"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    // Add your newsletter signup logic here
    setEmail("")
  }

  return (
    <section className="py-16 px-4 bg-black text-white">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">STAY IN THE LOOP</h2>
        <p className="text-gray-300 text-lg mb-8">
          Get the latest drops, exclusive releases, and street culture updates delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400"
          />
          <Button variant="contained" size={"lg"} type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8">
            SUBSCRIBE
          </Button>
        </form>

        <p className="text-sm text-gray-400 mt-4">
          No spam, just the freshest street style updates. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
