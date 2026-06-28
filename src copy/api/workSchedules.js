// 개발/미리보기에서는 Vite의 /api 프록시를 사용해 백엔드 CORS 제약을 피합니다.
// 별도 배포 프록시가 있다면 VITE_API_BASE_URL로 경로 또는 주소를 덮어쓸 수 있습니다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      body?.message || body?.error || (typeof body === "string" && body) ||
      `요청에 실패했습니다. (${response.status})`;
    throw new Error(message);
  }

  return body?.data ?? body;
}

export function getSetting(unitId, dutyType) {
  const query = new URLSearchParams({ dutyType });
  return request(`/api/work-schedules/units/${unitId}/setting?${query}`);
}

export function saveSetting(unitId, payload) {
  return request(`/api/work-schedules/units/${unitId}/setting`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function createPreview(payload) {
  return request("/api/work-schedules/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCandidates(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.set(key, value);
    }
  });
  return request(`/api/work-schedules/candidates?${query}`);
}

export function confirmSchedule(payload) {
  return request("/api/work-schedules/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export { BASE_URL };
