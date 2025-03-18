
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TeamNotesProps {
  assessmentId: number;
  notes: Array<{
    id: number;
    note: string;
    type: 'handoff' | 'general';
    providerName: string;
    createdAt: string;
  }>;
}

export function TeamNotes({ assessmentId, notes }: TeamNotesProps) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await fetch('/api/collaboration-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, assessmentId }),
    });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Collaboration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter note or handoff information..."
              {...register('note')}
            />
          </div>
          <div>
            <RadioGroup defaultValue="general">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" {...register('type')} />
                <Label htmlFor="general">General Note</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="handoff" id="handoff" {...register('type')} />
                <Label htmlFor="handoff">Handoff Note</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit">Add Note</Button>
        </form>

        <div className="mt-6 space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border-l-4 border-primary p-4 bg-muted">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{note.providerName}</span>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2">{note.note}</p>
              <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {note.type === 'handoff' ? 'Handoff Note' : 'General Note'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
