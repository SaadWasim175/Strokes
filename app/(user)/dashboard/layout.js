import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Strokes Dashboard",
  description: "View and create artwork",
};

export default function DashboardLayout({ children }) {
  
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">{children}</div>
    </div>
  );
}
