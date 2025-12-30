"use client"

import Link from "next/link"
import { useState, useEffect } from "react" 
import { Menu, X, Linkedin, Instagram, Music } from "lucide-react"
import SignOutButton from "./auth/SignOutButton"
import { User } from "@supabase/supabase-js"

interface HeaderClientProps {
  user: User | null
}

export default function HeaderClient({ user }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Tracks", href: "/#tracks" },
    { name: "Schedule", href: "/#schedule" },
    { name: "Sponsors", href: "/#sponsors" },
    { name: "FAQ", href: "/#faq" },
  ]

  const socialLinks = [
    { name: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={18} /> },
    { name: "Instagram", href: "https://instagram.com", icon: <Instagram size={18} /> },
    { name: "TikTok", href: "https://tiktok.com", icon: <Music size={18} /> },
  ]

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-[95%] lg:max-w-[1400px] bg-[#ebb8ce] rounded-full px-8 py-1.5 flex items-center justify-between shadow-md border border-[#560700]/10">
        
        <Link href="/" className="font-[family-name:var(--font-heading)] text-[#560700] text-xl md:text-2xl hover:opacity-80 transition-opacity">
          SASEHacks
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-[#560700] hover:opacity-60 transition-opacity uppercase tracking-widest">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-4 mr-2 border-r border-[#560700]/20 pr-4">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="text-[#560700] hover:scale-110 transition-transform">
                {social.icon}
              </a>
            ))}
          </div>

          <Link href="/portal" className="px-5 py-1.5 rounded-full text-xs font-black bg-[#560700] text-[#FFE4B3] hover:opacity-90 transition-opacity uppercase">
            Portal
          </Link>

          {mounted && (
            <>
              {user ? (
                <div className="hidden sm:block">
                  <SignOutButton />
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block px-5 py-1.5 rounded-full text-xs font-black border border-[#560700] text-[#560700] hover:bg-[#560700] hover:text-[#FFE4B3] transition-all uppercase">
                  Login
                </Link>
              )}
            </>
          )}

          <button className="lg:hidden text-[#560700] p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 mx-auto max-w-screen-xl bg-[#ebb8ce] rounded-3xl px-8 py-6 shadow-xl border border-[#560700]/10">
          <nav className="flex flex-col gap-4 text-lg font-bold">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-[#560700] border-b border-[#560700]/5 pb-2" onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            {mounted && !user && (
              <Link href="/login" className="text-[#560700] border-b border-[#560700]/5 pb-2" onClick={() => setMobileMenuOpen(false)}>
                LOGIN
              </Link>
            )}
            <div className="flex items-center gap-6 pt-2">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="text-[#560700]">
                  {social.icon}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}