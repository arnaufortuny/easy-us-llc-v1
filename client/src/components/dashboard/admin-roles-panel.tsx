import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shield, Key, Users, Plus, Edit, Trash2, X, CheckCircle, Loader2, Search } from "@/components/icons";
import type { StaffRole, StaffPermission } from "@shared/schema";

interface StaffUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isAdmin: boolean;
  isSupport: boolean;
  staffRoleId: number | null;
  userType: string | null;
  accountStatus: string | null;
}

const PERMISSION_CATEGORIES: Record<string, { labelKey: string; permissions: string[] }> = {
  accounting: {
    labelKey: "dashboard.admin.roles.permissions.accounting",
    permissions: ["accounting.view", "accounting.manage"],
  },
  consultations: {
    labelKey: "dashboard.admin.roles.permissions.consultations",
    permissions: ["consultations.view", "consultations.manage"],
  },
  documents: {
    labelKey: "dashboard.admin.roles.permissions.documents",
    permissions: ["documents.view", "documents.upload"],
  },
  support: {
    labelKey: "dashboard.admin.roles.permissions.support",
    permissions: ["support.view", "support.respond"],
  },
  users: {
    labelKey: "dashboard.admin.roles.permissions.users",
    permissions: ["users.view"],
  },
  orders: {
    labelKey: "dashboard.admin.roles.permissions.orders",
    permissions: ["orders.view", "orders.manage"],
  },
};

function getPermissionLabel(perm: string): string {
  const parts = perm.split(".");
  const action = parts[1];
  return action.charAt(0).toUpperCase() + action.slice(1);
}

export default function AdminRolesPanel() {
  const { t } = useTranslation();
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<"roles" | "assign">("roles");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<StaffRole | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true,
  });
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState<StaffUser | null>(null);
  const [selectedRoleForAssign, setSelectedRoleForAssign] = useState<number | null>(null);

  useEffect(() => {
    if (formMessage) {
      const timer = setTimeout(() => setFormMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [formMessage]);

  const { data: roles = [], isLoading: rolesLoading } = useQuery<StaffRole[]>({
    queryKey: ["/api/admin/roles"],
  });

  const { data: staffUsers = [], isLoading: staffLoading } = useQuery<StaffUser[]>({
    queryKey: ["/api/admin/staff-users"],
  });

  const { data: allUsers = [] } = useQuery<StaffUser[]>({
    queryKey: ["/api/admin/users"],
    select: (data: any[]) =>
      data.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        isAdmin: u.isAdmin,
        isSupport: u.isSupport,
        staffRoleId: u.staffRoleId,
        userType: u.userType,
        accountStatus: u.accountStatus,
      })),
  });

  const createRoleMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; permissions: string[] }) => {
      const res = await apiRequest("POST", "/api/admin/roles", data);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || t("dashboard.admin.roles.errorCreating"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roles"] });
      setFormMessage({ type: "success", text: t("dashboard.admin.roles.created") });
      closeRoleDialog();
    },
    onError: (err: any) => {
      setFormMessage({ type: "error", text: err.message || t("dashboard.admin.roles.errorCreating") });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{ name: string; description: string | null; permissions: string[]; isActive: boolean }> }) => {
      const res = await apiRequest("PATCH", `/api/admin/roles/${id}`, data);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || t("dashboard.admin.roles.errorUpdating"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roles"] });
      setFormMessage({ type: "success", text: t("dashboard.admin.roles.updated") });
      closeRoleDialog();
    },
    onError: (err: any) => {
      setFormMessage({ type: "error", text: err.message || t("dashboard.admin.roles.errorUpdating") });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/roles/${id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || t("dashboard.admin.roles.errorDeleting"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roles"] });
      setFormMessage({ type: "success", text: t("dashboard.admin.roles.deleted") });
    },
    onError: (err: any) => {
      setFormMessage({ type: "error", text: err.message || t("dashboard.admin.roles.errorDeleting") });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, staffRoleId }: { userId: string; staffRoleId: number | null }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/assign-role`, { staffRoleId });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || t("dashboard.admin.roles.errorAssigning"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setFormMessage({ type: "success", text: t("dashboard.admin.roles.assigned") });
      setAssignDialogOpen(false);
      setAssigningUser(null);
    },
    onError: (err: any) => {
      setFormMessage({ type: "error", text: err.message || t("dashboard.admin.roles.errorAssigning") });
    },
  });

  const closeRoleDialog = () => {
    setRoleDialogOpen(false);
    setEditingRole(null);
    setRoleForm({ name: "", description: "", permissions: [], isActive: true });
  };

  const openCreateDialog = () => {
    setEditingRole(null);
    setRoleForm({ name: "", description: "", permissions: [], isActive: true });
    setRoleDialogOpen(true);
  };

  const openEditDialog = (role: StaffRole) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description || "",
      permissions: (role.permissions as string[]) || [],
      isActive: role.isActive,
    });
    setRoleDialogOpen(true);
  };

  const handlePermissionToggle = (perm: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSaveRole = () => {
    if (!roleForm.name.trim()) {
      setFormMessage({ type: "error", text: t("dashboard.admin.roles.nameRequired") });
      return;
    }
    if (roleForm.permissions.length === 0) {
      setFormMessage({ type: "error", text: t("dashboard.admin.roles.permissionRequired") });
      return;
    }
    if (editingRole) {
      updateRoleMutation.mutate({
        id: editingRole.id,
        data: {
          name: roleForm.name,
          description: roleForm.description || null,
          permissions: roleForm.permissions,
          isActive: roleForm.isActive,
        },
      });
    } else {
      createRoleMutation.mutate({
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
      });
    }
  };

  const handleDeleteRole = (role: StaffRole) => {
    deleteRoleMutation.mutate(role.id);
  };

  const openAssignDialog = (user: StaffUser) => {
    setAssigningUser(user);
    setSelectedRoleForAssign(user.staffRoleId);
    setAssignDialogOpen(true);
  };

  const handleAssignRole = () => {
    if (!assigningUser) return;
    assignRoleMutation.mutate({
      userId: assigningUser.id,
      staffRoleId: selectedRoleForAssign,
    });
  };

  const getRoleName = (roleId: number | null) => {
    if (!roleId) return null;
    const role = roles.find((r) => r.id === roleId);
    return role?.name || null;
  };

  const getUserCountForRole = (roleId: number) => {
    return allUsers.filter((u) => u.staffRoleId === roleId).length;
  };

  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return allUsers;
    const q = userSearchQuery.toLowerCase().trim();
    return allUsers.filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [allUsers, userSearchQuery]);

  const isMutating = createRoleMutation.isPending || updateRoleMutation.isPending;

  return (
    <div className="space-y-6">
      {formMessage && (
        <div
          className={`mb-4 p-3 rounded-xl text-center text-sm font-medium ${
            formMessage.type === "error"
              ? "bg-destructive/10 border border-destructive/20 text-destructive"
              : "bg-accent/10 border border-accent/20 text-accent"
          }`}
          data-testid="form-message"
        >
          {formMessage.text}
        </div>
      )}

      <div className="flex flex-row flex-wrap justify-between items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={activeSection === "roles" ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs"
            onClick={() => setActiveSection("roles")}
            data-testid="button-section-roles"
          >
            <Shield className="w-3 h-3 mr-1" />
            {t("dashboard.admin.roles.title")}
          </Button>
          <Button
            variant={activeSection === "assign" ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs"
            onClick={() => setActiveSection("assign")}
            data-testid="button-section-assign"
          >
            <Users className="w-3 h-3 mr-1" />
            {t("dashboard.admin.roles.userAssignments")}
          </Button>
        </div>
        {activeSection === "roles" && (
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("dashboard.admin.roles.newRolePlaceholder")}
              value={roleForm.name}
              onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
              className="rounded-full text-xs w-40 sm:w-48"
              data-testid="input-quick-role-name"
            />
            <Button
              size="sm"
              className="rounded-full text-xs bg-accent text-accent-foreground shrink-0"
              onClick={openCreateDialog}
              data-testid="button-create-role"
            >
              <Plus className="w-3 h-3 mr-1" />
              {t("dashboard.admin.roles.createRole")}
            </Button>
          </div>
        )}
      </div>

      {activeSection === "roles" && (
        <div className="space-y-4">
          {rolesLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : roles.length === 0 ? (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">{t("dashboard.admin.roles.noRoles")}</p>
                <Button
                  size="sm"
                  className="mt-4 rounded-full bg-accent text-accent-foreground"
                  onClick={openCreateDialog}
                  data-testid="button-create-role-empty"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {t("dashboard.admin.roles.createFirst")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            roles.map((role) => {
              const userCount = getUserCountForRole(role.id);
              return (
                <Card key={role.id} className="rounded-2xl shadow-sm" data-testid={`card-role-${role.id}`}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-black text-foreground">{role.name}</h3>
                          <Badge variant={role.isActive ? "default" : "secondary"} className="text-[10px]">
                            {role.isActive ? t("dashboard.admin.roles.active") : t("dashboard.admin.roles.inactive")}
                          </Badge>
                          {userCount > 0 && (
                            <Badge variant="outline" className="text-[10px]">
                              <Users className="w-3 h-3 mr-1" />
                              {userCount} {userCount === 1 ? t("dashboard.admin.roles.user") : t("dashboard.admin.roles.usersLabel")}
                            </Badge>
                          )}
                        </div>
                        {role.description && (
                          <p className="text-xs text-muted-foreground mb-3">{role.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {((role.permissions as string[]) || []).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-[9px] font-mono">
                              <Key className="w-2.5 h-2.5 mr-0.5" />
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(role)}
                          data-testid={`button-edit-role-${role.id}`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteRole(role)}
                          disabled={userCount > 0 || deleteRoleMutation.isPending}
                          data-testid={`button-delete-role-${role.id}`}
                        >
                          {deleteRoleMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeSection === "assign" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.admin.roles.searchUsers")}
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
              data-testid="input-search-users"
            />
          </div>

          {staffLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : (
            <>
              {staffUsers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-foreground">{t("dashboard.admin.roles.currentStaff")}</h4>
                  <Card className="rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y">
                      {staffUsers.map((user) => {
                        const roleName = getRoleName(user.staffRoleId);
                        return (
                          <div
                            key={user.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                            data-testid={`staff-user-${user.id}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm">
                                  {user.firstName} {user.lastName}
                                </span>
                                {user.isAdmin && (
                                  <Badge variant="default" className="text-[9px]">
                                    Admin
                                  </Badge>
                                )}
                                {roleName && (
                                  <Badge variant="outline" className="text-[9px]">
                                    <Shield className="w-2.5 h-2.5 mr-0.5" />
                                    {roleName}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs"
                              onClick={() => openAssignDialog(user)}
                              data-testid={`button-assign-staff-${user.id}`}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              {t("dashboard.admin.roles.changeRole")}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">{t("dashboard.admin.roles.allUsers")}</h4>
                <Card className="rounded-2xl shadow-sm overflow-hidden">
                  <div className="divide-y max-h-[400px] overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground text-sm">
                        {t("dashboard.admin.roles.noUsersFound")}
                      </div>
                    ) : (
                      filteredUsers.slice(0, 50).map((user) => {
                        const roleName = getRoleName(user.staffRoleId);
                        return (
                          <div
                            key={user.id}
                            className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                            data-testid={`user-row-${user.id}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium">
                                  {user.firstName || ""} {user.lastName || ""}
                                </span>
                                {user.isAdmin && (
                                  <Badge variant="default" className="text-[9px]">
                                    Admin
                                  </Badge>
                                )}
                                {roleName && (
                                  <Badge variant="outline" className="text-[9px]">
                                    <Shield className="w-2.5 h-2.5 mr-0.5" />
                                    {roleName}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs shrink-0"
                              onClick={() => openAssignDialog(user)}
                              data-testid={`button-assign-user-${user.id}`}
                            >
                              {user.staffRoleId ? t("dashboard.admin.roles.changeRole") : t("dashboard.admin.roles.assignRole")}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
                {filteredUsers.length > 50 && (
                  <p className="text-xs text-muted-foreground text-center">
                    {t("dashboard.admin.roles.showingUsers", { count: 50, total: filteredUsers.length })}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <Dialog open={roleDialogOpen} onOpenChange={(open) => { if (!open) closeRoleDialog(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRole ? t("dashboard.admin.roles.editRole") : t("dashboard.admin.roles.createRole")}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? t("dashboard.admin.roles.editRoleDesc")
                : t("dashboard.admin.roles.createRoleDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{t("dashboard.admin.roles.roleName")}</Label>
              <Input
                value={roleForm.name}
                onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t("dashboard.admin.roles.roleNamePlaceholder")}
                className="rounded-full"
                data-testid="input-role-name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{t("dashboard.admin.roles.description")}</Label>
              <Input
                value={roleForm.description}
                onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={t("dashboard.admin.roles.descriptionPlaceholder")}
                className="rounded-full"
                data-testid="input-role-description"
              />
            </div>
            {editingRole && (
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={roleForm.isActive}
                  onCheckedChange={(checked) =>
                    setRoleForm((prev) => ({ ...prev, isActive: checked === true }))
                  }
                  data-testid="checkbox-role-active"
                />
                <Label className="text-sm">{t("dashboard.admin.roles.active")}</Label>
              </div>
            )}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                {t("dashboard.admin.roles.permissionsLabel")}
              </Label>
              <div className="space-y-4">
                {Object.entries(PERMISSION_CATEGORIES).map(([catKey, cat]) => (
                  <div key={catKey} className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t(cat.labelKey)}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.permissions.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 cursor-pointer text-sm"
                          data-testid={`checkbox-perm-${perm}`}
                        >
                          <Checkbox
                            checked={roleForm.permissions.includes(perm)}
                            onCheckedChange={() => handlePermissionToggle(perm)}
                          />
                          <span>{getPermissionLabel(perm)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {roleForm.permissions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                  {roleForm.permissions.map((perm) => (
                    <Badge
                      key={perm}
                      variant="outline"
                      className="text-[9px] font-mono cursor-pointer"
                      onClick={() => handlePermissionToggle(perm)}
                      data-testid={`badge-selected-perm-${perm}`}
                    >
                      {perm}
                      <X className="w-2.5 h-2.5 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={closeRoleDialog} data-testid="button-cancel-role">
              {t("common.cancel")}
            </Button>
            <Button
              className="rounded-full bg-accent text-accent-foreground"
              onClick={handleSaveRole}
              disabled={isMutating}
              data-testid="button-save-role"
            >
              {isMutating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {editingRole ? t("dashboard.admin.roles.saveChanges") : t("dashboard.admin.roles.createRole")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={(open) => { if (!open) { setAssignDialogOpen(false); setAssigningUser(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("dashboard.admin.roles.assignRole")}</DialogTitle>
            <DialogDescription>
              {t("dashboard.admin.roles.selectRoleFor")}{" "}
              <span className="font-semibold">
                {assigningUser?.firstName} {assigningUser?.lastName}
              </span>{" "}
              ({assigningUser?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-md border cursor-pointer ${
                selectedRoleForAssign === null
                  ? "border-accent bg-accent/5"
                  : "border-border"
              }`}
              onClick={() => setSelectedRoleForAssign(null)}
              data-testid="option-no-role"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedRoleForAssign === null ? "border-accent" : "border-muted-foreground/30"
                  }`}
                >
                  {selectedRoleForAssign === null && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <span className="text-sm font-medium">{t("dashboard.admin.roles.noRoleClient")}</span>
              </div>
            </div>
            {roles
              .filter((r) => r.isActive)
              .map((role) => (
                <div
                  key={role.id}
                  className={`p-3 rounded-md border cursor-pointer ${
                    selectedRoleForAssign === role.id
                      ? "border-accent bg-accent/5"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedRoleForAssign(role.id)}
                  data-testid={`option-role-${role.id}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedRoleForAssign === role.id ? "border-accent" : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedRoleForAssign === role.id && (
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{role.name}</span>
                      {role.description && (
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => { setAssignDialogOpen(false); setAssigningUser(null); }}
              data-testid="button-cancel-assign"
            >
              {t("common.cancel")}
            </Button>
            <Button
              className="rounded-full bg-accent text-accent-foreground"
              onClick={handleAssignRole}
              disabled={assignRoleMutation.isPending}
              data-testid="button-confirm-assign"
            >
              {assignRoleMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("dashboard.admin.roles.assign")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
