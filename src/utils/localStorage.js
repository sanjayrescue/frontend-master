const parseJson = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${key} from localStorage`, err);
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("super_admin_token");
  localStorage.removeItem("super_admin_user");
  localStorage.removeItem("asm_token");
  localStorage.removeItem("asm_user");
  localStorage.removeItem("rm_token");
  localStorage.removeItem("rm_user");
  localStorage.removeItem("partner_token");
  localStorage.removeItem("partner_user");
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_user");
  localStorage.removeItem("impersonation_stack");
};

export const saveAuthData = (token, user, impersonation = false) => {
  if (!token || !user?.role) {
    console.error("Missing token or user role while saving auth data");
    return;
  }

  const roleKey = user.role.toLowerCase();
  try {
    localStorage.setItem(`${roleKey}_token`, token);
    localStorage.setItem(`${roleKey}_user`, JSON.stringify(user));

    if (impersonation) {
      const stack = parseJson("impersonation_stack") || [];
      stack.push({ role: user.role, token, user });
      localStorage.setItem("impersonation_stack", JSON.stringify(stack));
    }
  } catch (err) {
    console.error("Failed to save auth data:", err);
  }
};

export const getAuthData = () => {
  return {
    adminToken: localStorage.getItem("super_admin_token"),
    adminUser: parseJson("super_admin_user"),
    asmToken: localStorage.getItem("asm_token"),
    asmUser: parseJson("asm_user"),
    rmToken: localStorage.getItem("rm_token"),
    rmUser: parseJson("rm_user"),
    partnerToken: localStorage.getItem("partner_token"),
    partnerUser: parseJson("partner_user"),
    customerToken: localStorage.getItem("customer_token"),
    customerUser: parseJson("customer_user"),
    impersonationStack: parseJson("impersonation_stack") || [],
  };
};

