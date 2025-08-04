import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConversationMessage {
  id: string;
  originalText: string;
  convertedText: string;
  timestamp: Date;
  isPlaying?: boolean;
}

interface ConversationHistoryProps {
  messages: ConversationMessage[];
  onPlayAudio: (messageId: string, text: string) => void;
}

export function ConversationHistory({ messages, onPlayAudio }: ConversationHistoryProps) {
  if (messages.length === 0) {
    return (
      <Card className="glass p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Volume2 className="w-12 h-12 text-muted-foreground opacity-50" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground">
              Start speaking to see your accent conversions appear here
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass h-[400px]">
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* Original Speech (Indian Accent) */}
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full gradient-indian mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-accent-indian">
                      Original (Indian Accent)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-card-foreground bg-accent-indian/10 rounded-lg p-3">
                    {message.originalText}
                  </p>
                </div>
              </div>

              {/* Converted Speech (American Accent) */}
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full gradient-american mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-accent-american">
                      Converted (American Accent)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPlayAudio(message.id, message.convertedText)}
                      disabled={message.isPlaying}
                      className="h-6 w-6 p-0 hover:bg-accent-american/20"
                    >
                      <Play className={cn(
                        "w-3 h-3",
                        message.isPlaying && "text-accent-american animate-pulse"
                      )} />
                    </Button>
                  </div>
                  <p className="text-sm text-card-foreground bg-accent-american/10 rounded-lg p-3">
                    {message.convertedText}
                  </p>
                </div>
              </div>
              
              <div className="border-b border-card-border" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}