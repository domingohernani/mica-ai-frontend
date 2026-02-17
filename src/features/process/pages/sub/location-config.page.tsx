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
import { Badge } from "@/components/ui/badge";
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
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

interface Location {
  id: string;
  name: string;
  createdAt: string;
}

const LocationConfigPage = () => {
  // Locations State
  const [locations, setLocations] = useState<Location[]>([
    { id: "1", name: "Remote", createdAt: new Date().toISOString() },
    { id: "2", name: "New York, NY", createdAt: new Date().toISOString() },
    { id: "3", name: "San Francisco, CA", createdAt: new Date().toISOString() },
    { id: "4", name: "Austin, TX", createdAt: new Date().toISOString() },
    { id: "5", name: "Seattle, WA", createdAt: new Date().toISOString() },
    { id: "6", name: "Boston, MA", createdAt: new Date().toISOString() },
    { id: "7", name: "Chicago, IL", createdAt: new Date().toISOString() },
    { id: "8", name: "Hybrid", createdAt: new Date().toISOString() },
  ]);
  const [locationInput, setLocationInput] = useState("");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(
    null,
  );

  // Location CRUD Operations
  const handleAddLocation = () => {
    if (
      locationInput.trim() &&
      !locations.some((l) => l.name === locationInput.trim())
    ) {
      const newLocation: Location = {
        id: Date.now().toString(),
        name: locationInput.trim(),
        createdAt: new Date().toISOString(),
      };
      setLocations([...locations, newLocation]);
      setLocationInput("");
    }
  };

  const handleUpdateLocation = () => {
    if (editingLocation && locationInput.trim()) {
      setLocations(
        locations.map((loc) =>
          loc.id === editingLocation.id
            ? { ...loc, name: locationInput.trim() }
            : loc,
        ),
      );
      setEditingLocation(null);
      setLocationInput("");
    }
  };

  const handleDeleteLocation = () => {
    if (deletingLocation) {
      setLocations(locations.filter((loc) => loc.id !== deletingLocation.id));
      setDeletingLocation(null);
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
                />
                {editingLocation ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleUpdateLocation}
                      disabled={!locationInput.trim()}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditLocation}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={handleAddLocation}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
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
                    locations.map((location) => (
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
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingLocation(location)}
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LocationConfigPage;
