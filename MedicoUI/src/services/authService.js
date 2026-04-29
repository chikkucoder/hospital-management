import { users } from "./mockData";

export const authService = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check mock users
    let user = users.find(u => (u.email === credentials.email || u.id === credentials.email) && u.password === credentials.password);
    
    // Check registered users in localStorage
    if (!user) {
      const registeredUsers = JSON.parse(localStorage.getItem("medico_registered_users") || "[]");
      user = registeredUsers.find(u => (u.email === credentials.email || u.id === credentials.email) && u.password === credentials.password);
    }

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const userData = {
      id: user.id || user.email,
      name: user.name,
      email: user.email,
      role: user.role,
      specializations: user.specializations,
      degrees: user.degrees,
      medals: user.medals,
      history: user.history
    };

    localStorage.setItem("medico_session", JSON.stringify(userData));
    return { user: userData };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const registeredUsers = JSON.parse(localStorage.getItem("medico_registered_users") || "[]");
    
    const newUser = {
      ...userData,
      id: `REG-${Date.now().toString().slice(-4)}`,
    };

    registeredUsers.push(newUser);
    localStorage.setItem("medico_registered_users", JSON.stringify(registeredUsers));
    return { user: newUser };
  },

  logout: async () => {
    localStorage.removeItem("medico_session");
    return { message: "Logged out" };
  },

  getMe: async () => {
    const session = localStorage.getItem("medico_session");
    if (!session) throw new Error("Unauthorized");
    return { user: JSON.parse(session) };
  },
};
