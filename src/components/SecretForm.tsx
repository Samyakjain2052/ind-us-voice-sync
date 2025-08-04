import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

export function SecretForm() {
  const [apiKey, setApiKey] = useState('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');
  const [isConfigured, setIsConfigured] = useState(false);

  const handleSave = async () => {
    try {
      // Store in Supabase secrets via edge function
      const response = await fetch('/api/configure-secrets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          GROQ_API_KEY: apiKey,
        }),
      });

      if (response.ok) {
        setIsConfigured(true);
      }
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  };

  if (isConfigured) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center space-x-2 text-green-700">
          <Key className="w-5 h-5" />
          <span>API Key configured successfully!</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="groq-key">Groq API Key</Label>
        <Input
          id="groq-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Groq API key"
        />
      </div>
      <Button onClick={handleSave} className="w-full">
        Configure API Key
      </Button>
    </Card>
  );
}