"use client";

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";

export type UserRole = 
  | "admin" 
  | "pastor" 
  | "treasurer" 
  | "secretary" 
  | "member" 
  | "praise-worship" 
  | "ushering";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  isLoading: boolean;
  clearAuth: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export function RoleProvider({ children }: RoleProviderProps) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
          setUserProfileState(JSON.parse(storedProfile));
        }
        
        // Note: We don't store role in localStorage for security
        // Role is fetched during login and used only for routing
      } catch (error) {
        console.error("Error initializing auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setRole = (newRole: UserRole | null) => {
    setRoleState(newRole);
    // Don't persist role in localStorage for security
    // Role should only exist in memory during the session
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
      localStorage.setItem("userProfile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("userProfile");
    }
  };

  const clearAuth = () => {
    setRoleState(null);
    setUserProfileState(null);
    localStorage.removeItem("userProfile");
    // Note: Don't remove role from state - just clear user data
  };

  return (
    <RoleContext.Provider 
      value={{ 
        role, 
        setRole, 
        userProfile, 
        setUserProfile,
        isLoading,
        clearAuth 
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

// Utility function to get dashboard path based on role
export function getDashboardPath(role: UserRole | null): string {
  if (!role) return "/dashboard";
  
  const paths: Record<UserRole, string> = {
    admin: "/dashboard/admin",
    pastor: "/dashboard/pastor",
    treasurer: "/dashboard/treasurer",
    secretary: "/dashboard/secretary",
    member: "/dashboard/member",
    "praise-worship": "/dashboard/praise-worship",
    ushering: "/dashboard/ushering",
  };
  
  return paths[role] || "/dashboard";
}

// Utility function to get role display name
export function getRoleLabel(role: UserRole | null): string {
  if (!role) return "Member";
  
  const labels: Record<UserRole, string> = {
    admin: "Administrator",
    pastor: "Pastor",
    treasurer: "Treasurer",
    secretary: "Secretary",
    member: "Member",
    "praise-worship": "Praise & Worship Team",
    ushering: "Ushering Team",
  };
  
  return labels[role] || "Member";
}

// Utility function to check if user has admin access
export function isAdmin(role: UserRole | null): boolean {
  return role === "admin";
}

// Utility function to check if user is a team member (not regular member)
export function isTeamMember(role: UserRole | null): boolean {
  if (!role) return false;
  return ["admin", "pastor", "treasurer", "secretary", "praise-worship", "ushering"].includes(role);
}