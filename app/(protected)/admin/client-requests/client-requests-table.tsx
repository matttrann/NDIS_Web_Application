'use client';

import { useState } from 'react';
import { AdminClientRelationship } from '@prisma/client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistance } from 'date-fns';

interface ClientRequestsTableProps {
  requests: (AdminClientRelationship & {
    client: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    }
  })[];
}

export function ClientRequestsTable({ requests }: ClientRequestsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRequest = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setLoading(requestId);
      const response = await fetch(`/api/admin-client/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update request');

      toast.success(`Request ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Failed to update request');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={request.client.image || ''} />
                  <AvatarFallback>
                    {request.client.name?.charAt(0) || request.client.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{request.client.name}</p>
                  <p className="text-sm text-muted-foreground">{request.client.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {formatDistance(new Date(request.createdAt), new Date(), { addSuffix: true })}
              </TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell className="text-right">
                {request.status === 'PENDING' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequest(request.id, 'REJECTED')}
                      disabled={loading === request.id}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRequest(request.id, 'APPROVED')}
                      disabled={loading === request.id}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No pending requests
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 