// APIs
import { getDashboardOverviewServer, getDashboardConfigServer } from "./services/dashboard.service";

// Components
import { DashboardScreen } from "./components/DashboardScreen";

export default async function DashboardPage() {
  const now = new Date();

  const [data, config] = await Promise.all([
    getDashboardOverviewServer({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    }),
    getDashboardConfigServer(),
  ]);

  return <DashboardScreen data={data} initialConfig={config} />;
}
