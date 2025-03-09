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
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { formatDistance } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Questionnaires</TableHead>
            <TableHead>Video Requests</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="w-24">Actions</TableHead>
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
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Remove Client</span>
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
                </TableCell>
              </TableRow>
            );
          })}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No clients found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 