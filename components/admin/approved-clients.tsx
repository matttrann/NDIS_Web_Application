'use client';

import { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistance } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TrashIcon } from 'lucide-react';

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
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveClient = async (relationshipId: string, clientName: string | null) => {
    try {
      setIsRemoving(relationshipId);
      
      const response = await fetch(`/api/admin-client/${relationshipId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove client');
      }

      toast.success(
        `Client ${clientName || 'Unknown'} removed successfully`,
        {
          description: 'They will need to request access again if they want to work with you.'
        }
      );
      
      // Refresh the page to show updated client list
      router.refresh();
    } catch (error) {
      console.error('Error removing client:', error);
      toast.error('Failed to remove client');
    } finally {
      setIsRemoving(null);
    }
  };

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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/admin/client/${client.id}`}
                      >
                        View Details
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Client</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {client.name || client.email}? They will no longer be able to
                              access your services and will need to request access again.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveClient(relationship.id, client.name)}
                              disabled={isRemoving === relationship.id}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {isRemoving === relationship.id ? 'Removing...' : 'Remove Client'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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