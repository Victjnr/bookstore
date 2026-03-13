import { Outlet } from "react-router-dom";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";

const StoreLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  );
};

export default StoreLayout;
