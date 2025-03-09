'use client';

import { AdminClientRelationship } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ApprovedClientsProps {
  clients: (AdminClientRelationship & {
    client: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      questionnaires: {
        id: string;
        createdAt: Date;
      }[];
      videoRequests: {
        id: string;
        status: string;
        createdAt: Date;
      }[];
    }
  })[];
}

export function ApprovedClients({ clients }: ApprovedClientsProps) {
  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Clients Yet</CardTitle>
          <CardDescription>
            You haven't approved any client requests yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Clients</CardTitle>
        <CardDescription>
          View and manage your approved clients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Questionnaires</TableHead>
              <TableHead>Video Requests</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((relationship) => {
              const client = relationship.client;
              const lastActivity = [...client.questionnaires, ...client.videoRequests]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt;

              return (
                <TableRow key={relationship.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={client.image || ''} />
                      <AvatarFallback>
                        {client.name?.charAt(0) || client.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/questionnaire-results?userId=${client.id}`}>
                      <Button variant="link" className="p-0">
                        {client.questionnaires.length} questionnaires
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/video-requests?userId=${client.id}`}>
                      <Button variant="link" className="p-0">
                        {client.videoRequests.length} requests
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {lastActivity ? formatDistance(new Date(lastActivity), new Date(), { addSuffix: true }) : 'No activity'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/admin/client/${client.id}`}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 