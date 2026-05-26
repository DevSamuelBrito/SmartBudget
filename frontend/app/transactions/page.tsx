//apis
import { getTransactionsServer } from "./services/transactions.service";

//components
import TransactionsScreen from "./components/TransactionsScreen";



export default async function TransactionsPage() {
    const inicialTransactions = await getTransactionsServer();

    return <TransactionsScreen initialTransactions={inicialTransactions} />;
}