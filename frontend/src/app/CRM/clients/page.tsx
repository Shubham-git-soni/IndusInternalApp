//frontend/app/dashboard/clients/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clientApi, type ApiClient } from "@/lib/api";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Building, AlertTriangle, PlusCircle, Grid3x3, Table2, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { parseAsUTCDate } from "@/lib/date-format";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'card' | 'table'>('card');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // DUMMY DATA - Replace with actual API when backend is ready
        const dummyClients: ApiClient[] = [
          {
            id: 1,
            company_name: "Tech Corp Solutions",
            company_email: "contact@techcorp.com",
            segment: "Enterprise",
            converted_date: new Date().toISOString(),
            contacts: [
              { id: 1, contact_name: "John Smith", email: "john@techcorp.com", phone: "+1234567890", designation: "CEO" }
            ],
            attachments: [],
            address: "123 Tech Street",
            city: "San Francisco",
            state: "CA",
            country: "USA"
          },
          {
            id: 2,
            company_name: "Digital Innovations Ltd",
            company_email: "info@digitalinnovations.com",
            segment: "Mid-Market",
            converted_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            contacts: [
              { id: 2, contact_name: "Jane Doe", email: "jane@digitalinnovations.com", phone: "+9876543210", designation: "CTO" }
            ],
            attachments: [],
            address: "456 Innovation Ave",
            city: "New York",
            state: "NY",
            country: "USA"
          },
          {
            id: 3,
            company_name: "Startup Ventures Inc",
            company_email: "hello@startupventures.com",
            segment: "SMB",
            converted_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            contacts: [
              { id: 3, contact_name: "Mike Johnson", email: "mike@startupventures.com", phone: "+5551234567", designation: "Founder" }
            ],
            attachments: [],
            address: "789 Startup Blvd",
            city: "Austin",
            state: "TX",
            country: "USA"
          }
        ] as ApiClient[];

        setClients(dummyClients);
      } catch (err: any) {
        console.error("Failed to fetch clients:", err);
        setError(err.message || "An unknown error occurred while fetching clients.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleRowClick = (clientId: number) => {
    router.push(`/dashboard/clients/${clientId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Clients</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your active clients</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="hidden lg:flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant={viewType === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('card')}
              className="h-8"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('table')}
              className="h-8"
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            All Active Clients
            <span className="ml-2 text-sm font-normal text-muted-foreground">({clients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <>
              {/* Card View - Mobile First */}
              {viewType === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => {
                    const primaryContact = client.contacts && client.contacts[0] ? client.contacts[0] : null;
                    const convertedDate = parseAsUTCDate(client.converted_date);

                    return (
                      <div
                        key={client.id}
                        onClick={() => handleRowClick(client.id)}
                        className="bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-foreground mb-1 truncate">
                              {client.company_name}
                            </h3>
                            {client.segment && (
                              <Badge variant="outline" className="text-xs">
                                {client.segment}
                              </Badge>
                            )}
                          </div>
                          <Building className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-2 mb-4 text-sm">
                          {primaryContact && (
                            <>
                              <div className="flex items-center text-muted-foreground">
                                <User className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{primaryContact.contact_name}</span>
                              </div>
                              {primaryContact.email && (
                                <div className="flex items-center text-muted-foreground">
                                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span className="truncate">{primaryContact.email}</span>
                                </div>
                              )}
                              {primaryContact.phone && (
                                <div className="flex items-center text-muted-foreground">
                                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span className="truncate">{primaryContact.phone}</span>
                                </div>
                              )}
                            </>
                          )}
                          {(client.city || client.state) && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {[client.city, client.state].filter(Boolean).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Converted
                          </div>
                          <div className="text-xs text-foreground font-medium">
                            {convertedDate ? format(convertedDate, "MMM d, yyyy") : "N/A"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table View - Desktop */}
              {viewType === 'table' && (
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Primary Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Segment</TableHead>
                  <TableHead className="text-right">Converted On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => {
                  const primaryContact = client.contacts && client.contacts[0] ? client.contacts[0] : null;
                  const convertedDate = parseAsUTCDate(client.converted_date);

                  return (
                    <TableRow key={client.id} onClick={() => handleRowClick(client.id)} className="cursor-pointer">
                      <TableCell className="font-medium">{client.company_name}</TableCell>
                      <TableCell>{primaryContact?.contact_name || 'N/A'}</TableCell>
                      <TableCell>{client.company_email || primaryContact?.email || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.segment && <Badge variant="outline">{client.segment}</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        {convertedDate ? format(convertedDate, "MMM d, yyyy") : "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
                </Table>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-semibold">No Clients Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Once a lead is won, they will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}