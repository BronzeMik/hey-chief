"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useCart } from "../contexts/cart-context";
import { useRouter, useSearchParams } from "next/navigation";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Prefill from current URL if present
  useEffect(() => {
    const initialQ = searchParams.get("q");
    if (initialQ) setQ(initialQ);
  }, [searchParams]);

  // Focus + scroll lock when search opens
  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [isSearchOpen]);

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });

  const onSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const trimmed = q.trim();
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
            <img src="/hey_chief_logo.png" alt="Hey Chief Logo" className="max-w-[59px]" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">HOME</Link>

          <div
            className="relative"
            onMouseEnter={() => setIsShopDropdownOpen(true)}
            onMouseLeave={() => setIsShopDropdownOpen(false)}
          >
            <button className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors">
              <span>SHOP</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {isShopDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                <div className="w-96 bg-background border rounded-lg shadow-xl p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary mb-3">Shop Categories</h3>
                      <Link href="/products" className="block group">
                        <div className="p-3 rounded-md hover:bg-muted transition-colors">
                          <div className="font-semibold text-sm group-hover:text-primary">SHOP ALL</div>
                          <div className="text-xs text-muted-foreground mt-1">Browse our complete collection</div>
                        </div>
                      </Link>
                      <Link href="/sports" className="block group">
                        <div className="p-3 rounded-md hover:bg-muted transition-colors">
                          <div className="font-semibold text-sm group-hover:text-primary">SPORTS STYLE</div>
                          <div className="text-xs text-muted-foreground mt-1">Team caps and athletic styles</div>
                        </div>
                      </Link>
                      <Link href="/hunting-fishing" className="block group">
                        <div className="p-3 rounded-md hover:bg-muted transition-colors">
                          <div className="font-semibold text-sm group-hover:text-primary">HUNTING & FISHING</div>
                          <div className="text-xs text-muted-foreground mt-1">Outdoor and wilderness gear</div>
                        </div>
                      </Link>
                      <Link href="/navy" className="block group">
                        <div className="p-3 rounded-md hover:bg-muted transition-colors">
                          <div className="font-semibold text-sm group-hover:text-primary">NAVY</div>
                          <div className="text-xs text-muted-foreground mt-1">Military and naval styles</div>
                        </div>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary mb-3">Featured</h3>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-primary" />
                        </div>
                        <div className="font-semibold text-sm mb-1">New Arrivals</div>
                        <div className="text-xs text-muted-foreground mb-3">Check out our latest caps</div>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          View All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">ABOUT</Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors">GALLERY</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">CONTACT</Link>
        </nav>

        {/* Cart / Search / Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Button className="" variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" onClick={toggleCart} aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {state.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {state.totalItems}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 px-4 space-y-4">
            <Link href="/" className="block text-sm font-medium hover:text-primary transition-colors">HOME</Link>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">SHOP</div>
              <Link href="/products" className="block pl-4 text-sm font-medium hover:text-primary transition-colors">SHOP ALL</Link>
              <Link href="/sports" className="block pl-4 text-sm font-medium hover:text-primary transition-colors">SPORTS STYLE</Link>
              <Link href="/hunting-fishing" className="block pl-4 text-sm font-medium hover:text-primary transition-colors">HUNTING & FISHING</Link>
              <Link href="/navy" className="block pl-4 text-sm font-medium hover:text-primary transition-colors">NAVY</Link>
            </div>
            <Link href="/about" className="block text-sm font-medium hover:text-primary transition-colors">ABOUT</Link>
            <Link href="/contact" className="block text-sm font-medium hover:text-primary transition-colors">CONTACT</Link>
          </nav>
        </div>
      )}

      {/* Search modal (center on desktop, bottom sheet on mobile) */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
          onClick={(e) => {
            // close if clicking the dim background, not the panel
            if (e.target === e.currentTarget) setIsSearchOpen(false);
          }}
        >
          {/* Desktop: center; Mobile: bottom sheet */}
          <div className="mx-auto max-w-xl md:flex md:items-center md:justify-center">
            <div className="mt-auto md:mt-0 w-full rounded-t-2xl md:rounded-2xl bg-background p-4 shadow-xl border
                            max-h-[85vh] flex flex-col md:max-h-[70vh]">
              <div className="flex items-center justify-between pb-2 md:pb-3">
                <h3 className="text-base font-semibold">Search</h3>
                <Button className="" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} aria-label="Close search">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search hats…"
                  className="w-full rounded-xl border px-4 py-3 text-base"
                  aria-label="Search hats"
                />
                <Button size="lg" variant={""} type="submit" className="px-4">Search</Button>
              </form>

              {/* Optional: suggestions */}
              <div className="mt-3 text-sm text-muted-foreground">Try “Navy”, “Camo”, “Two-Tone”</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
