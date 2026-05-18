"use client";

// react
import { useMemo, useState } from "react";

// data
import data from "../data.json";

import type { Category, CategoryTheme } from "../types";

const PAGE_SIZE = 8;

type CreateCategoryPayload = {
  name: string;
  themeId: string;
};

type UpdateCategoryPayload = {
  name: string;
  themeId: string;
};

export function useCategories() {
  const initialCategories = (data.categories as Category[]) ?? [];
  const themes = (data.themes as CategoryTheme[]) ?? [];

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredCategories = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(normalized),
    );
  }, [categories, search]);

  const visibleCategories = useMemo(
    () => filteredCategories.slice(0, page * PAGE_SIZE),
    [filteredCategories, page],
  );

  const hasMore = visibleCategories.length < filteredCategories.length;

  function loadMore() {
    if (!hasMore) {
      return;
    }

    setPage((current) => current + 1);
  }

  function setSearchValue(value: string) {
    setSearch(value);
    setPage(1);
  }

  function createCategory(payload: CreateCategoryPayload) {
    const nextCategory: Category = {
      id: crypto.randomUUID(),
      name: payload.name,
      themeId: payload.themeId,
    };

    setCategories((current) => [nextCategory, ...current]);
  }

  function updateCategory(categoryId: string, payload: UpdateCategoryPayload) {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? { ...category, ...payload } : category,
      ),
    );
  }

  function deleteCategory(categoryId: string) {
    setCategories((current) =>
      current.filter((category) => category.id !== categoryId),
    );
  }

  return {
    categories: visibleCategories,
    hasMore,
    loadMore,
    search,
    setSearch: setSearchValue,
    themes,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
