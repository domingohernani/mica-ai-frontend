import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  createdAt: string;
}

const DepartmentConfigPage = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Engineering", createdAt: new Date().toISOString() },
    { id: "2", name: "Design", createdAt: new Date().toISOString() },
    { id: "3", name: "Marketing", createdAt: new Date().toISOString() },
    { id: "4", name: "Sales", createdAt: new Date().toISOString() },
    { id: "5", name: "Analytics", createdAt: new Date().toISOString() },
    { id: "6", name: "Operations", createdAt: new Date().toISOString() },
    { id: "7", name: "Human Resources", createdAt: new Date().toISOString() },
  ]);
  const [departmentInput, setDepartmentInput] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);

  // Department CRUD Operations
  const handleAddDepartment = () => {
    if (
      departmentInput.trim() &&
      !departments.some((d) => d.name === departmentInput.trim())
    ) {
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: departmentInput.trim(),
        createdAt: new Date().toISOString(),
      };
      setDepartments([...departments, newDepartment]);
      setDepartmentInput("");
    }
  };

  const handleUpdateDepartment = () => {
    if (editingDepartment && departmentInput.trim()) {
      setDepartments(
        departments.map((dept) =>
          dept.id === editingDepartment.id
            ? { ...dept, name: departmentInput.trim() }
            : dept,
        ),
      );
      setEditingDepartment(null);
      setDepartmentInput("");
    }
  };

  const handleDeleteDepartment = () => {
    if (deletingDepartment) {
      setDepartments(
        departments.filter((dept) => dept.id !== deletingDepartment.id),
      );
      setDeletingDepartment(null);
    }
  };

  const startEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentInput(department.name);
  };

  const cancelEditDepartment = () => {
    setEditingDepartment(null);
    setDepartmentInput("");
  };

  const handleDepartmentKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingDepartment) {
        handleUpdateDepartment();
      } else {
        handleAddDepartment();
      }
    }
  };

  return (
    <>
      <TabsContent value="departments" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Department Management
            </CardTitle>
            <CardDescription>
              Add, edit, or remove departments for job postings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add/Edit Department Form */}
            <div className="space-y-2">
              <Label htmlFor="departmentInput">
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="departmentInput"
                  placeholder="e.g., Engineering, Marketing"
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                  onKeyPress={handleDepartmentKeyPress}
                />
                {editingDepartment ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleUpdateDepartment}
                      disabled={!departmentInput.trim()}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditDepartment}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={handleAddDepartment}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>

            {/* Departments Table */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground"
                      >
                        No departments added yet. Add your first department
                        above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">
                          {department.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditDepartment(department)}
                              className="h-8 w-8"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingDepartment(department)}
                              className="h-8 w-8 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Department Count Badge */}
            <div className="flex items-center justify-between pt-2">
              <Badge variant="secondary">
                Total Departments: {departments.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Delete Department Confirmation Dialog */}
      <AlertDialog
        open={!!deletingDepartment}
        onOpenChange={(open) => !open && setDeletingDepartment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingDepartment?.name}"? This
              action cannot be undone and may affect existing job postings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DepartmentConfigPage;
