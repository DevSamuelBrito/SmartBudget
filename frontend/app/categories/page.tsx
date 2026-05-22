// apis
import { getCategoriesServer } from "./services/categorias.service";

// components
import { CategoriesScreen } from "./components/CategoriesComponent";

export default async function CategoriesPage() {
    const initialCategories = await getCategoriesServer();

    return <CategoriesScreen initialCategories={initialCategories} />;
}
