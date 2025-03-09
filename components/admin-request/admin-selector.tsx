'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Admin {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export function AdminSelector() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin-client');
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      toast.error('Failed to load available admins');
    }
  };

  const requestAdmin = async (adminId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId })
      });

      if (!response.ok) throw new Error('Failed to request admin');
      
      toast.success('Admin request sent successfully');
    } catch (error) {
      toast.error('Failed to send admin request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {admins.map((admin) => (
        <Card key={admin.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={admin.image || ''} />
                <AvatarFallback>
                  {admin.name?.charAt(0) || admin.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{admin.name || admin.email}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => requestAdmin(admin.id)}
              disabled={loading}
              className="w-full"
            >
              Request Access
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 