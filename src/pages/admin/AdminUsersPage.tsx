"use client";

import { useEffect, useState } from "react";
import { Trash2, Shield, ShieldOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { toast } from "sonner";
import { colors } from "../../theme/colors";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await apiClient(API_ENDPOINTS.adminUsers, {
        token: token ?? undefined,
      });

      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await apiClient(`${API_ENDPOINTS.adminUsers}/${id}`, {
        method: "DELETE",
        token: token ?? undefined,
      });

      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleBlockToggle = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;

      await apiClient(`${API_ENDPOINTS.adminUsers}/${id}`, {
        method: "PATCH",
        token: token ?? undefined,
        body: { isBlocked: newStatus },
      });

      toast.success(`User ${newStatus ? "blocked" : "unblocked"} successfully`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: newStatus } : user,
        ),
      );
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <div className="max-w-[1700px] mx-auto px-6 py-8">
        {/* ================= Header ================= */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-4xl font-bold`}>
            User Management
          </h1>

          <span className="text-sm text-gray-500">
            Total Users: {users.length}
          </span>
        </div>

        {/* ================= Table Card ================= */}
        <div
          className={`rounded-2xl shadow-lg ${colors.card} border ${colors.border}`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              {/* Table Head */}
              <thead className={`border-b ${colors.border}`}>
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Provider</th>
                  <th className="p-4 text-left">Verified</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-b ${colors.border} hover:bg-gray-50 transition`}
                  >
                    {/* Name */}
                    <td className="p-4 font-semibold">{user.name}</td>

                    {/* Email */}
                    <td className="p-4 text-gray-600">{user.email}</td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Provider */}
                    <td className="p-4 capitalize text-gray-600">
                      {user.authProvider}
                    </td>

                    {/* Verified */}
                    <td className="p-4">
                      {user.isVerified ? (
                        <span className="text-green-600 font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Not Verified
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        {/* Block / Unblock */}
                        <button
                          onClick={() =>
                            handleBlockToggle(user._id, user.isBlocked)
                          }
                          className={`p-2 rounded-lg transition ${
                            user.isBlocked
                              ? "hover:bg-green-100 text-green-600"
                              : "hover:bg-red-100 text-red-600"
                          }`}
                        >
                          {user.isBlocked ? (
                            <ShieldOff size={18} /> 
                          ) : (
                            <Shield size={18} /> 
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No users found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
