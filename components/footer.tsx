import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export default function Footer() {
  const footerLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="container px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
{/* Copyright */}
<div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Earth. All rights reserved.
          </div>


          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>          
          </div>
      </div>
    </footer>
  )
}