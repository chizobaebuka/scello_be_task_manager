export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationOptions {
    offset: number;
    limit: number;
    currentPage: number;
}

export interface PaginatedMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    currentItems: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

export function getPagination({ page = 1, limit = 10 }: PaginationParams): PaginationOptions {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const offset = (safePage - 1) * safeLimit;

    return {
        offset,
        limit: safeLimit,
        currentPage: safePage,
    };
}

export function getPaginationMeta(
    totalItems: number,
    currentPage: number,
    limit: number,
    currentItems: number
): PaginatedMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        totalPages,
        currentPage,
        currentItems,
        limit,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
    };
}

export function getPaginationResponse(
    items: any[],
    totalItems: number,
    paginationOptions: PaginationOptions
): { items: any[]; meta: PaginatedMeta } {
    const { offset, limit, currentPage } = paginationOptions;
    const currentItems = items.length;

    const meta = getPaginationMeta(totalItems, currentPage, limit, currentItems);

    return {
        items,
        meta,
    };
}

export function getPaginatedResponse(
    items: any[],
    totalItems: number,
    paginationParams: PaginationParams
): { items: any[]; meta: PaginatedMeta } {
    const paginationOptions = getPagination(paginationParams);
    return getPaginationResponse(items, totalItems, paginationOptions);
}