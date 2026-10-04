"use client";

import { useMemo, useState } from "react";

export function usePagination<T>(items: T[], initialPageSize = 8) {
  const [requestedPage, setRequestedPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  function changePageSize(size: number) {
    setPageSize(size);
    setRequestedPage(1);
  }

  return { page, pageCount, pageItems, pageSize, setPage: setRequestedPage, setPageSize: changePageSize };
}
