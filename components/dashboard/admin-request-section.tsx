'use client';

import { useState } from 'react';
import { User, AdminClientRelationship } from '@prisma/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from 'date-fns';

interface AdminRequestSectionProps {
  admins: Pick<User, 'id' | 'name' | 'email' | 'image' | 'description'>[];
  existingRequests: (AdminClientRelationship & {
    admin: Pick<User, 'id' | 'name' | 'email' | 'image' | 'description'>;
  })[];
}

export function AdminRequestSection({ admins, existingRequests }: AdminRequestSectionProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const requestAdmin = async (adminId: string) => {
    try {
      setLoading(adminId);
      const response = await fetch('/api/admin-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId })
      });

      if (!response.ok) throw new Error('Failed to send request');
      
      toast.success('Admin request sent successfully');
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      toast.error('Failed to send admin request');
    } finally {
      setLoading(null);
    }
  };

  const getRequestStatus = (adminId: string) => {
    const request = existingRequests.find(r => r.adminId === adminId);
    return request?.status || null;
  };

  return (
    <div className="grid gap-6">
      {/* Current Admin Section */}
      {existingRequests.some(r => r.status === 'APPROVED') && (
        <Card>
          <CardHeader>
            <CardTitle>Your Admin</CardTitle>
            <CardDescription>
              This admin has access to view your questionnaires and video requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingRequests
                .filter(r => r.status === 'APPROVED')
                .map(request => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.admin.image || ''} />
                        <AvatarFallback>
                          {request.admin.name?.charAt(0) || request.admin.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.admin.name}</p>
                        <p className="text-sm text-muted-foreground">{request.admin.email}</p>
                      </div>
                    </div>
                    <Badge variant="success">Active Admin</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Admins Section */}
      <Card>
        <CardHeader>
          <CardTitle>Available Admins</CardTitle>
          <CardDescription>
            Request an admin to view your questionnaires and video requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {admins.map(admin => {
              const status = getRequestStatus(admin.id);
              
              return (
                <div key={admin.id} className="flex flex-col border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={admin.image || ''} />
                        <AvatarFallback>
                          {admin.name?.charAt(0) || admin.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    
                    {status === 'APPROVED' ? (
                      <Badge variant="success">Approved</Badge>
                    ) : status === 'PENDING' ? (
                      <Badge variant="secondary">Request Pending</Badge>
                    ) : status === 'REJECTED' ? (
                      <Badge variant="destructive">Request Rejected</Badge>
                    ) : (
                      <Button
                        onClick={() => requestAdmin(admin.id)}
                        disabled={loading === admin.id}
                      >
                        Request Access
                      </Button>
                    )}
                  </div>
                  
                  {admin.description && (
                    <div className="mt-2 pl-12">
                      <p className="text-sm text-muted-foreground">
                        {admin.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            
            {admins.length === 0 && (
              <p className="text-center text-muted-foreground">
                No admins available at the moment.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 