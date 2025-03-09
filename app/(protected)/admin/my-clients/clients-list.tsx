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

interface ClientsListProps {
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

export function ClientsList({ clients }: ClientsListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Questionnaires</TableHead>
            <TableHead>Video Requests</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((relationship) => {
            const client = relationship.client;
            const lastActivity = [...client.questionnaires, ...client.videoRequests]
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt;

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
                <TableCell>{client.questionnaires.length}</TableCell>
                <TableCell>{client.videoRequests.length}</TableCell>
                <TableCell>
                  {lastActivity ? formatDistance(lastActivity, new Date(), { addSuffix: true }) : 'No activity'}
                </TableCell>
              </TableRow>
            );
          })}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No clients found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 