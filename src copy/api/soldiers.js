const UNIT_USERS_API_URL = '/api/units/1/users';
const IN_UNIT_USERS_API_URL = '/api/units/1/in-unit-users';

const getUserList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.users)) {
    return payload.users;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    ('serviceNumber' in payload || 'service_number' in payload)
  ) {
    return [payload];
  }

  return [];
};

export const toSoldierData = (users) =>
  getUserList(users).map((user) => ({
    user_id: user.userId ?? user.user_id ?? user.id ?? null,
    service_number: user.serviceNumber ?? user.service_number ?? '',
    name: user.name ?? '',
    rank_name: user.rankName ?? user.rank_name ?? '',
    role: user.role ?? '',
    current_status: user.currentStatus ?? user.current_status ?? '',
    phone: user.phone ?? user.phoneNumber ?? user.phone_number ?? '',
  }));

export const fetchSoldierData = async () => {
  const response = await fetch(UNIT_USERS_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch soldiers: ${response.status}`);
  }

  const payload = await response.json();
  return toSoldierData(payload);
};

export const fetchInUnitSoldierData = async () => {
  const response = await fetch(IN_UNIT_USERS_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch in-unit soldiers: ${response.status}`);
  }

  const payload = await response.json();
  return toSoldierData(payload);
};
