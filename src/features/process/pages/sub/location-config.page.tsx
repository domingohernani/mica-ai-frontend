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
import { type Location } from "@/features/orgnanization/interfaces/location.interface";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/stores/use-store";
import { toast } from "sonner";
import { api } from "@/utils/axios";

const LocationConfigPage = () => {
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);
  const currentOrganizationId = useStore(
    (state) => state.currentOrganizationId,
  );

  const fetchLocations = async () => {
    const { data } = await api.get(
      `/organizations/${currentOrganizationId}/locations`,
    );
    return data;
  };

  const addLocation = async (name: string) => {
    const { data } = await api.post(
      `/organizations/${currentOrganizationId}/locations`,
      { name, createdBy: user?.id },
    );
    toast.success("Location added successfully", {
      description: (
        <span>
          <strong>{name}</strong> has been added to the organization.
        </span>
      ),
    });
    return data;
  };

  const updateLocation = async ({ id, name }: { id: string; name: string }) => {
    const { data } = await api.patch(
      `/organizations/${currentOrganizationId}/locations/${id}`,
      { name },
    );
    toast.success("Location updated successfully", {
      description: <span>Location has been updated successfully.</span>,
    });
    return data;
  };

  const deleteLocation = async (id: string) => {
    const { data } = await api.delete(
      `/organizations/${currentOrganizationId}/locations/${id}`,
    );
    toast.success("Location deleted successfully", {
      description: <span>Location has been deleted successfully.</span>,
    });
    return data;
  };

  const {
    data: locations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const addMutation = useMutation({
    mutationFn: addLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setLocationInput("");
    },
    onError: () => {
      toast.error("Failed to add location", {
        description: <span>Something went wrong. Please try again.</span>,
      });
      setLocationInput("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setEditingLocation(null);
      setLocationInput("");
    },
    onError: () => {
      toast.error("Failed to update location", {
        description: <span>Something went wrong. Please try again.</span>,
      });
      setEditingLocation(null);
      setLocationInput("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setDeletingLocation(null);
    },
    onError: () => {
      toast.error("Failed to delete location", {
        description: <span>Something went wrong. Please try again.</span>,
      });
      setDeletingLocation(null);
    },
  });

  const [locationInput, setLocationInput] = useState("");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(
    null,
  );

  const handleAddLocation = () => {
    const trimmed = locationInput.trim();
    if (!trimmed) {
      toast.error("Location name is required", {
        description: (
          <span>Please enter a valid location name before adding.</span>
        ),
      });
      return;
    }
    if (locations.some((l: Location) => l.name === trimmed)) {
      toast.error("Location already exists", {
        description: (
          <span>
            <strong>{trimmed}</strong> is already in the list
          </span>
        ),
      });
      return;
    }
    addMutation.mutate(trimmed);
  };

  const handleUpdateLocation = () => {
    if (editingLocation && locationInput.trim()) {
      updateMutation.mutate({
        id: editingLocation.id,
        name: locationInput.trim(),
      });
    }
  };

  const handleDeleteLocation = () => {
    if (deletingLocation) {
      deleteMutation.mutate(deletingLocation.id);
    }
  };

  const startEditLocation = (location: Location) => {
    setEditingLocation(location);
    setLocationInput(location.name);
  };

  const cancelEditLocation = () => {
    setEditingLocation(null);
    setLocationInput("");
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingLocation) {
        handleUpdateLocation();
      } else {
        handleAddLocation();
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  const isMutating =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <TabsContent value="locations" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Management
            </CardTitle>
            <CardDescription>
              Add, edit, or remove locations for job postings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add/Edit Location Form */}
            <div className="space-y-2">
              <Label htmlFor="locationInput">
                {editingLocation ? "Edit Location" : "Add New Location"}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="locationInput"
                  placeholder="e.g., Remote, New York, NY"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={handleLocationKeyPress}
                  disabled={isMutating}
                />
                {editingLocation ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleUpdateLocation}
                      disabled={!locationInput.trim() || isMutating}
                    >
                      {updateMutation.isPending ? "Saving..." : "Update"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditLocation}
                      disabled={isMutating}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={handleAddLocation}
                    disabled={isMutating}
                  >
                    {addMutation.isPending ? (
                      "Adding..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Locations Table */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Name</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground"
                      >
                        No locations added yet. Add your first location above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    locations.map((location: Location) => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">
                          {location.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditLocation(location)}
                              className="h-8 w-8"
                              disabled={isMutating}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingLocation(location)}
                              className="h-8 w-8 hover:text-destructive"
                              disabled={isMutating}
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

            {/* Location Count Badge */}
            <div className="flex items-center justify-between pt-2">
              <Badge variant="secondary">
                Total Locations: {locations.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Delete Location Confirmation Dialog */}
      <AlertDialog
        open={!!deletingLocation}
        onOpenChange={(open) => !open && setDeletingLocation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingLocation?.name}"? This
              action cannot be undone and may affect existing job postings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLocation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LocationConfigPage;
