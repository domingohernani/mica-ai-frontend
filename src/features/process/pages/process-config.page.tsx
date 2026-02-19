import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MapPin, Settings2 } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import DepartmentConfigPage from "./sub/department-config.page";
import LocationConfigPage from "./sub/location-config.page";

const ProcessConfigPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Process Configuration"
        subtitle="Manage departments, locations, and other recruitment settings."
      />

      {/* Tabs */}
      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="w-4 h-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="w-4 h-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="other" className="gap-2">
            <Settings2 className="w-4 h-4" />
            Other Settings
          </TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <DepartmentConfigPage />

        {/* Locations Tab */}
        <LocationConfigPage />

        {/* Other Settings Tab (Placeholder) */}
        <TabsContent value="other" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Other Settings
              </CardTitle>
              <CardDescription>
                Additional configuration options will be available here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Other configuration settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessConfigPage;
