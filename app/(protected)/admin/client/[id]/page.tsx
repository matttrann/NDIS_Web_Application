import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { DashboardHeader } from "@/components/dashboard/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  // Fetch client data
  const relationship = await db.adminClientRelationship.findFirst({
    where: {
      clientId: params.id,
      adminId: user.id,
      status: "APPROVED",
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          questionnaires: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
          videoRequests: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
        },
      },
    },
  });

  if (!relationship) notFound();

  const client = relationship.client;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <DashboardHeader
          heading={`Client: ${client.name || 'Unnamed'}`}
          text={`View detailed information about ${client.name || 'this client'}.`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Personal details and account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.image || ''} />
                <AvatarFallback>
                  {client.name?.charAt(0) || client.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <p className="text-muted-foreground">{client.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Email Verified</div>
                <div className="text-sm font-medium">
                  {client.emailVerified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="outline">Not Verified</Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Member Since</div>
                <div className="text-sm font-medium">
                  {format(new Date(client.createdAt), 'PPP')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-sm font-medium">
                  {format(new Date(client.updatedAt), 'PPP')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Client's subscription status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-sm font-medium">
                  {client.stripeSubscriptionId ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="outline">No Subscription</Badge>
                  )}
                </div>
              </div>
              
              {client.stripeSubscriptionId && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Plan</div>
                    <div className="text-sm font-medium">
                      {client.stripePriceId || 'Basic Plan'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Renewal Date</div>
                    <div className="text-sm font-medium">
                      {client.stripeCurrentPeriodEnd 
                        ? format(new Date(client.stripeCurrentPeriodEnd), 'PPP')
                        : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Customer ID</div>
                    <div className="text-sm font-medium truncate">
                      {client.stripeCustomerId || 'N/A'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="questionnaires" className="w-full">
        <TabsList>
          <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
          <TabsTrigger value="videos">Video Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="questionnaires" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Questionnaires</CardTitle>
              <CardDescription>
                The client has completed {client.questionnaires.length} questionnaire(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {client.questionnaires.length > 0 ? (
                <div className="space-y-4">
                  {client.questionnaires.map((questionnaire) => (
                    <div key={questionnaire.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">Questionnaire #{questionnaire.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          Completed {format(new Date(questionnaire.createdAt), 'PPP')}
                        </p>
                      </div>
                      <Link href={`/admin/questionnaire-results?id=${questionnaire.id}`}>
                        <Button variant="outline" size="sm">View Answers</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  This client hasn't completed any questionnaires yet.
                </div>
              )}
              
              {client.questionnaires.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href={`/admin/questionnaire-results?userId=${client.id}`}>
                    <Button variant="outline">View All Questionnaires</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Video Requests</CardTitle>
              <CardDescription>
                The client has submitted {client.videoRequests.length} video request(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {client.videoRequests.length > 0 ? (
                <div className="space-y-4">
                  {client.videoRequests.map((videoRequest) => (
                    <div key={videoRequest.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">Video Request #{videoRequest.id.slice(0, 8)}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Requested {format(new Date(videoRequest.createdAt), 'PPP')}
                          </p>
                          <Badge variant={
                            videoRequest.status === 'completed' ? 'success' :
                            videoRequest.status === 'pending' ? 'secondary' : 'outline'
                          }>
                            {videoRequest.status.charAt(0).toUpperCase() + videoRequest.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Link href={`/admin/video-requests?id=${videoRequest.id}`}>
                        <Button variant="outline" size="sm">View Request</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  This client hasn't submitted any video requests yet.
                </div>
              )}
              
              {client.videoRequests.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href={`/admin/video-requests?userId=${client.id}`}>
                    <Button variant="outline">View All Video Requests</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 