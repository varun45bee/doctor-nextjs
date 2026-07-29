"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
  ];

  let currentPath = "";
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({ label, href: currentPath });
  }

  return (
    <nav className="flex items-center gap-2 text-sm py-4 px-4 max-w-7xl mx-auto" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index === 0 ? (
              <Link href={item.href} className="flex items-center gap-1 text-sage-600 hover:text-sage-800 transition-colors">
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-sage-400" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-sage-900 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="text-sage-600 hover:text-sage-800 transition-colors">
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
