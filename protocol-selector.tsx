
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TreatmentProtocol } from '@/server/services/protocols';

interface ProtocolSelectorProps {
  protocols: TreatmentProtocol[];
  onSelect: (protocol: TreatmentProtocol) => void;
}

export function ProtocolSelector({ protocols, onSelect }: ProtocolSelectorProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Treatment Protocols</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {protocols.length === 0 ? (
          <p className="text-gray-500">No standard protocols available for this wound type/stage.</p>
        ) : (
          <div className="space-y-4">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">{protocol.name}</h3>
                  <Button onClick={() => onSelect(protocol)} variant="outline" size="sm">
                    Apply Protocol
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Primary Dressing:</strong> {protocol.primaryDressing}</p>
                  {protocol.secondaryDressing && (
                    <p><strong>Secondary Dressing:</strong> {protocol.secondaryDressing}</p>
                  )}
                  <p><strong>Frequency:</strong> {protocol.frequency}</p>
                  
                  <div className="mt-3">
                    <strong>Steps:</strong>
                    <ul className="list-disc ml-5 mt-1">
                      {protocol.additionalSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-3">
                    <strong>Contraindications:</strong>
                    <ul className="list-disc ml-5 mt-1 text-red-600">
                      {protocol.contraindications.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
