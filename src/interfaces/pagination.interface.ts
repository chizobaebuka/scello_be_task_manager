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

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export function getPagination({ page = 1, limit = DEFAULT_LIMIT }: PaginationParams): PaginationOptions {
    const safePage = Math.max(1, Number(page) || 1);
    const requestedLimit = Number(limit) || DEFAULT_LIMIT;
    // Capped so a client can't force an unbounded table scan / huge payload via ?limit=.
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, requestedLimit));
    const offset = (safePage - 1) * safeLimit;

    return {
        offset,
        limit: safeLimit,
        currentPage: safePage,
    };
}

export interface SortParams {
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
}

// Only allows sorting on a known-safe column list, since sortBy/sortOrder are
// otherwise passed straight into a Sequelize ORDER BY clause.
export function resolveSort(
    query: { sortBy?: unknown; sortOrder?: unknown },
    allowedFields: readonly string[],
    defaultField: string
): SortParams {
    const requested = typeof query.sortBy === 'string' ? query.sortBy : undefined;
    const sortBy = requested && allowedFields.includes(requested) ? requested : defaultField;
    const sortOrder: 'ASC' | 'DESC' = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    return { sortBy, sortOrder };
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