import { useState, useCallback } from 'react';
import { VoiceRecorder } from './VoiceRecorder';
import { ConversationHistory, ConversationMessage } from './ConversationHistory';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Mic, Volume2 } from 'lucide-react';

export function AccentConverter() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const handleTranscription = useCallback(async (originalText: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate accent conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple accent conversion simulation
      const convertedText = originalText
        .replace(/\bvery\b/g, "really")
        .replace(/\bisn't it\b/g, "right")
        .replace(/\bactually\b/g, "you know")
        .replace(/\bprepone\b/g, "move up")
        .replace(/\bout of station\b/g, "out of town");

      const newMessage: ConversationMessage = {
        id: Date.now().toString(),
        originalText,
        convertedText,
        timestamp: new Date(),
      };

      setMessages(prev => [newMessage, ...prev]);
    } catch (error) {
      console.error('Error converting accent:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handlePlayAudio = useCallback(async (messageId: string, text: string) => {
    setPlayingMessageId(messageId);
    
    // Update message playing state
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isPlaying: true }
        : { ...msg, isPlaying: false }
    ));

    try {
      // Use Web Speech API for now (would integrate ElevenLabs later)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Try to find an American English voice
      const voices = speechSynthesis.getVoices();
      const americanVoice = voices.find(voice => 
        voice.lang.includes('en-US') && voice.name.includes('Microsoft')
      ) || voices.find(voice => voice.lang.includes('en-US'));
      
      if (americanVoice) {
        utterance.voice = americanVoice;
      }

      utterance.onend = () => {
        setPlayingMessageId(null);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isPlaying: false }
            : msg
        ));
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingMessageId(null);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isPlaying: false }
          : msg
      ));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Wand2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Real-Time Accent Converter</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent-american bg-clip-text text-transparent">
          Indian to American Accent
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Speak naturally in your Indian accent and hear it converted to natural American English in real-time
        </p>
      </div>

      {/* Accent Indicators */}
      <div className="flex justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full gradient-indian" />
          <Badge variant="secondary" className="bg-accent-indian/10 text-accent-indian border-accent-indian/20">
            <Mic className="w-3 h-3 mr-1" />
            Indian Accent
          </Badge>
        </div>
        <div className="flex items-center">
          <Wand2 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full gradient-american" />
          <Badge variant="secondary" className="bg-accent-american/10 text-accent-american border-accent-american/20">
            <Volume2 className="w-3 h-3 mr-1" />
            American Accent
          </Badge>
        </div>
      </div>

      {/* Voice Recorder */}
      <Card className="glass p-8">
        <VoiceRecorder 
          onTranscription={handleTranscription}
          isProcessing={isProcessing}
        />
      </Card>

      {/* Conversation History */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">Conversation History</h2>
        <ConversationHistory 
          messages={messages}
          onPlayAudio={handlePlayAudio}
        />
      </div>
    </div>
  );
}