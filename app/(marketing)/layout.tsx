import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { NavMobile } from "@/components/layout/mobile-nav";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1 flex items-center -mt-20">{children}</main>
      <SiteFooter />
    </div>
  );
}
