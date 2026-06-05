// APIs
import { getDashboardOverviewServer } from "./services/dashboard.service";

// Components
import { DashboardScreen } from "./components/DashboardScreen";

export default async function DashboardPage() {
  const now = new Date();

  const data = await getDashboardOverviewServer({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  return <DashboardScreen data={data} />;
}
