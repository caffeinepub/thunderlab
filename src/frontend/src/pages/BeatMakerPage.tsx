import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, Download, Plus, Music } from 'lucide-react';
import { useStepSequencer } from '../features/beat-maker/useStepSequencer';
import { renderToWav } from '../features/beat-maker/renderToWav';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const DRUM_SOUNDS = [
  { id: 'kick', label: 'Kick', color: 'bg-purple-500' },
  { id: 'snare', label: 'Snare', color: 'bg-blue-500' },
  { id: 'hihat', label: 'Hi-Hat', color: 'bg-cyan-500' },
] as const;

export default function BeatMakerPage() {
  const navigate = useNavigate();
  const {
    pattern,
    bpm,
    isPlaying,
    currentStep,
    toggleStep,
    play,
    stop,
    setBpm,
  } = useStepSequencer();

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { blob, filename } = await renderToWav(pattern, bpm);
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Beat exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export beat');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddToProject = async () => {
    try {
      const { blob, filename } = await renderToWav(pattern, bpm);
      
      // For now, show guidance to navigate to projects
      toast.info('Navigate to Projects to import this beat', {
        description: 'Export the beat first, then import it in your project.',
        action: {
          label: 'Go to Projects',
          onClick: () => navigate({ to: '/projects' }),
        },
      });
    } catch (error) {
      console.error('Add to project error:', error);
      toast.error('Failed to prepare beat');
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beat Maker</h1>
          <p className="text-muted-foreground mt-1">Create drum patterns with the step sequencer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddToProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add to Project
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export WAV'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transport & Controls</CardTitle>
          <CardDescription>Control playback and tempo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={isPlaying ? stop : play}
              className="w-32"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Play
                </>
              )}
            </Button>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label>BPM: {bpm}</Label>
              </div>
              <Slider
                value={[bpm]}
                onValueChange={(values) => setBpm(values[0])}
                min={60}
                max={180}
                step={1}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step Sequencer</CardTitle>
          <CardDescription>Click cells to toggle steps on/off</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DRUM_SOUNDS.map((sound) => (
              <div key={sound.id} className="space-y-2">
                <Label className="text-sm font-medium">{sound.label}</Label>
                <div className="grid grid-cols-16 gap-1">
                  {Array.from({ length: 16 }).map((_, stepIndex) => {
                    const isActive = pattern[sound.id][stepIndex];
                    const isCurrent = isPlaying && currentStep === stepIndex;
                    
                    return (
                      <button
                        key={stepIndex}
                        onClick={() => toggleStep(sound.id, stepIndex)}
                        className={`
                          aspect-square rounded-md border-2 transition-all
                          touch-manipulation min-h-[44px] md:min-h-[36px]
                          ${isActive ? sound.color : 'bg-muted/30'}
                          ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''}
                          ${isActive ? 'border-transparent' : 'border-border'}
                          hover:scale-105 active:scale-95
                        `}
                        aria-label={`${sound.label} step ${stepIndex + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Step numbers */}
          <div className="grid grid-cols-16 gap-1 mt-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground">
                {i + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Music className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Quick Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Click cells to toggle drum hits on/off</li>
                <li>• Adjust BPM to change the tempo</li>
                <li>• Export your beat as a WAV file to use in other software</li>
                <li>• Add to project to use your beat in Thunderlab</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
