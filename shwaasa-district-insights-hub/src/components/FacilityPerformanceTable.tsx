
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, Download, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchFacilityData } from '@/services/dashboardService';
import { useToast } from '@/hooks/use-toast';

type SortField = 'name' | 'scans' | 'accuracy' | 'status';
type SortDirection = 'asc' | 'desc';

const FacilityPerformanceTable = () => {
  const [sortField, setSortField] = useState<SortField>('scans');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { toast } = useToast();
  
  const { data: facilities = [], isLoading, error, refetch } = useQuery({
    queryKey: ['facilityData'],
    queryFn: fetchFacilityData,
  });
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedFacilities = [...facilities].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'scans') {
      comparison = a.scans - b.scans;
    } else if (sortField === 'accuracy') {
      comparison = a.accuracy - b.accuracy;
    } else if (sortField === 'status') {
      const statusValue = { 'Green': 3, 'Yellow': 2, 'Red': 1 };
      comparison = statusValue[a.status] - statusValue[b.status];
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Telangana facility performance data is being exported",
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Data has been exported successfully",
      });
    }, 1500);
  };
  
  const handleViewDetails = (facilityName: string) => {
    toast({
      title: facilityName,
      description: "Facility details would open in a modal or new view",
    });
  };

  return (
    <Card className="dashboard-card col-span-12">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Telangana Facility Performance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of performance metrics across Telangana facilities
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button> */}
          {/* <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-10 bg-muted/50 rounded-md w-full"></div>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-muted/30 rounded-md w-full"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-destructive">Error loading Telangana facility data</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[300px] cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort('name')}
                >
                  Facility Name {sortField === 'name' && (
                    <ArrowDownUp className={`h-3 w-3 inline ml-1 ${
                      sortDirection === 'asc' ? 'rotate-180' : ''
                    } transition-transform`} />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort('scans')}
                >
                  Scan Volume {sortField === 'scans' && (
                    <ArrowDownUp className={`h-3 w-3 inline ml-1 ${
                      sortDirection === 'asc' ? 'rotate-180' : ''
                    } transition-transform`} />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort('accuracy')}
                >
                  Accuracy % {sortField === 'accuracy' && (
                    <ArrowDownUp className={`h-3 w-3 inline ml-1 ${
                      sortDirection === 'asc' ? 'rotate-180' : ''
                    } transition-transform`} />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/20"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (
                    <ArrowDownUp className={`h-3 w-3 inline ml-1 ${
                      sortDirection === 'asc' ? 'rotate-180' : ''
                    } transition-transform`} />
                  )}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFacilities.map((facility) => (
                <TableRow key={facility.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell className="text-right">{facility.scans.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{facility.accuracy}%</TableCell>
                  <TableCell className="text-right">
                    <span className={`status-${facility.status.toLowerCase()} inline-flex items-center`}>
                      <span className={`w-2 h-2 rounded-full mr-1 bg-current`}></span>
                      {facility.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(facility.name)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FacilityPerformanceTable;
