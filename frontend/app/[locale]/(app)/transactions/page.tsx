//apis
import { getTransactionsServer } from "./services/transactions.service";

//types
import type { PagedResult } from "@/types/pagination";

import type { TransactionApi } from "./types";

//components
import TransactionsScreen from "./components/TransactionsComponent";


export default async function TransactionsPage() {
    const initialTransactions: PagedResult<TransactionApi> = await getTransactionsServer({
        page: 1,
        pageSize: 10,
    });

    return <TransactionsScreen initialTransactions={initialTransactions} />;
}