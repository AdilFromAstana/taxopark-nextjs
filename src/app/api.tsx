interface FetchDataParams {
  apiEndpoint: string;
  page?: number;
  limit?: number;
  sort?: { key: string | string[] | null; order: "asc" | "desc" | null };
  filters?: Record<string, any>;
}

export const fetchDataAPI = async <T,>({
  apiEndpoint,
  page = 1,
  limit = 10,
  sort = { key: null, order: null },
  filters = {},
}: FetchDataParams): Promise<{ data: T[]; total: number }> => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (sort.key) {
      params.append(
        "sortField",
        Array.isArray(sort.key) ? sort.key.join(".") : sort.key
      );
      params.append("sortOrder", sort.order ?? "");
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${apiEndpoint}?${params.toString()}`);
    console.log("apiEndpoint: ", apiEndpoint);
    console.log("result: ", response);
    if (!response.ok) throw new Error("Ошибка загрузки данных");

    const result = await response.json();

    return {
      data: result.data || result.items || result.forms || [],
      total: result.totalPages || result.total || 0,
    };
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    return { data: [], total: 0 };
  }
};
