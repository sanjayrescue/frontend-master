// // src/utils/impersonation.js
// export const backToPreviousRole = (navigate) => {
//     let stack = JSON.parse(localStorage.getItem("impersonation_stack") || "[]");
  
//     if (stack.length > 0) {
//       // Remove current impersonation
//       const current = stack.pop();
//       localStorage.setItem("impersonation_stack", JSON.stringify(stack));
  
//       // Clear impersonated token/user
//       localStorage.removeItem(`${current.role.toLowerCase()}_token`);
//       localStorage.removeItem(`${current.role.toLowerCase()}_user`);
  
//       if (stack.length > 0) {
//         // Restore previous impersonated role in localStorage
//         const prev = stack[stack.length - 1];
//         localStorage.setItem(`${prev.role.toLowerCase()}_token`, prev.token);
//         localStorage.setItem(`${prev.role.toLowerCase()}_user`, JSON.stringify(prev.user));
  
//         // Navigate to previous role dashboard
//         navigate(`/${prev.role.toLowerCase()}`);
//       } else {
//         // If no impersonation left, go back to super admin
//         const superAdminToken = localStorage.getItem("super_admin_token");
//         const superAdminUser = localStorage.getItem("super_admin_user");
//         if (superAdminToken && superAdminUser) {
//           navigate("/admin");
//         } else {
//           navigate("/LoginPage");
//         }
//       }
//     } else {
//       // If stack empty, fallback
//       navigate("/admin");
//     }
//   };
  

// src/utils/impersonation.js
export const backToPreviousRole = (navigate) => {
    let stack = JSON.parse(localStorage.getItem("impersonation_stack") || "[]");
  
    if (stack.length > 0) {
      // Remove current impersonation
      const current = stack.pop();
      localStorage.setItem("impersonation_stack", JSON.stringify(stack));
  
      // Clear impersonated token/user
      localStorage.removeItem(`${current.role.toLowerCase()}_token`);
      localStorage.removeItem(`${current.role.toLowerCase()}_user`);
  
      if (stack.length > 0) {
        // Restore previous impersonated role in localStorage
        const prev = stack[stack.length - 1];
        localStorage.setItem(`${prev.role.toLowerCase()}_token`, prev.token);
        localStorage.setItem(`${prev.role.toLowerCase()}_user`, JSON.stringify(prev.user));
  
        // Navigate to previous role dashboard
        const routeMap = {
          SUPER_ADMIN: "/admin",
          ASM: "/asm",
          RM: "/rm",
          PARTNER: "/partner",
          CUSTOMER: "/customer",
        };
        navigate(routeMap[prev.role] || "/LoginPage");
      } else {
        // If stack empty, fallback to original role
        const roles = ["super_admin", "asm", "rm", "partner", "customer"];
        for (let role of roles) {
          const token = localStorage.getItem(`${role}_token`);
          if (token) {
            const routeMap = {
              super_admin: "/admin",
              asm: "/asm",
              rm: "/rm",
              partner: "/partner",
              customer: "/customer",
            };
            navigate(routeMap[role]);
            return;
          }
        }
        // No valid token, go login
        navigate("/LoginPage");
      }
    } else {
      // If stack empty, fallback to first valid token
      const roles = ["super_admin", "asm", "rm", "partner", "customer"];
      for (let role of roles) {
        const token = localStorage.getItem(`${role}_token`);
        if (token) {
          const routeMap = {
            super_admin: "/admin",
            asm: "/asm",
            rm: "/rm",
            partner: "/partner",
            customer: "/customer",
          };
          navigate(routeMap[role]);
          return;
        }
      }
      navigate("/LoginPage");
    }
  };
  