//apis
import { getTransactionsServer } from "./services/transactions.service";

import { getCategoriesServerCached } from "../categories/services/categorias.service";

//types
import type { TransactionWithCategory } from "./types";

//components
import TransactionsScreen from "./components/TransactionsComponent";


export default async function TransactionsPage() {
    const [transactions, categories] = await Promise.all([
        getTransactionsServer(),
        getCategoriesServerCached(),
    ]);

    const categoryMap = new Map(categories.map((category) => [category.id, category]));

    const initialTransactions: TransactionWithCategory[] = transactions.map((transaction) => ({
        ...transaction,
        category: transaction.transactionCategoryId
            ? categoryMap.get(transaction.transactionCategoryId)
            : undefined,
    }));

    return <TransactionsScreen initialTransactions={initialTransactions} />;
}