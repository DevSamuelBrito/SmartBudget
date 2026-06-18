// apis
import { getCategoriesServer } from "./services/categorias.service";

import { getBudgetsByPeriodServerCached } from "./services/budgets.service";

// components
import { CategoriesScreen } from "./components/CategoriesComponent";

export default async function CategoriesPage() {
    const now = new Date();
    const initialMonth = now.getMonth() + 1;
    const initialYear = now.getFullYear();

    const [initialCategories, initialBudgets] = await Promise.all([
        getCategoriesServer({ page: 1, pageSize: 10 }),
        getBudgetsByPeriodServerCached({
            month: initialMonth,
            year: initialYear,
        }),
    ]);

    return (
        <CategoriesScreen
            initialCategories={initialCategories}
            initialBudgets={initialBudgets}
            initialMonth={initialMonth}
            initialYear={initialYear}
        />
    );
}
