import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
import { SidebarProvider } from "@/components/ui/sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: HomeLayoutProps) => {
  return <HomeLayout>{children}</HomeLayout>;
};
export default Layout;
