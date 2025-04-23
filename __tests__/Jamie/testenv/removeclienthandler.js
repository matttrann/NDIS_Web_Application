//this is used for testing purposes only

export async function handleRemoveClient(relationshipId) {
    const response = await fetch(`/api/admin-client/${relationshipId}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error('Failed to remove client');
    }
  
    return true;
  }
  