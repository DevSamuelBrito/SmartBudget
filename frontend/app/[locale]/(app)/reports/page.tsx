// apis
import { getMonthlyReportServer } from "./services/reports.service";

// components
import { MonthlyReportCard } from "./components/MonthlyReportCard";

export default async function ReportsPage() {
  const now = new Date();
  const initialMonth = now.getMonth() + 1;
  const initialYear = now.getFullYear();

  const initialData = await getMonthlyReportServer({
    month: initialMonth,
    year: initialYear,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <MonthlyReportCard
        initialData={initialData}
        initialMonth={initialMonth}
        initialYear={initialYear}
      />
    </div>
  );
}
