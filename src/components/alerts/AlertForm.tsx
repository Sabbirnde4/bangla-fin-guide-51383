import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AlertFormProps {
  alertType: 'product' | 'bank';
  targetId: string;
  targetName: string;
  currentRate: number;
  onSubmit: (alert: {
    condition_type: string;
    threshold_value: number | null;
  }) => void;
  isSubmitting?: boolean;
}

export const AlertForm = ({
  alertType,
  targetId,
  targetName,
  currentRate,
  onSubmit,
  isSubmitting,
}: AlertFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conditionType, setConditionType] = useState<string>('changes');
  const [thresholdValue, setThresholdValue] = useState<string>('');

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to set up rate alerts
          </p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const threshold = conditionType === 'changes' ? null : parseFloat(thresholdValue);
    
    if (conditionType !== 'changes' && (!threshold || isNaN(threshold))) {
      return;
    }

    onSubmit({
      condition_type: conditionType,
      threshold_value: threshold,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Set Rate Alert
        </CardTitle>
        <CardDescription>
          Get notified when the interest rate {conditionType === 'changes' ? 'changes' : conditionType === 'above' ? 'goes above' : 'drops below'} your target
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Rate</Label>
            <div className="text-2xl font-bold text-primary">
              {currentRate.toFixed(2)}%
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Alert Condition</Label>
            <Select value={conditionType} onValueChange={setConditionType}>
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="changes">Any rate change</SelectItem>
                <SelectItem value="above">Rate goes above</SelectItem>
                <SelectItem value="below">Rate drops below</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {conditionType !== 'changes' && (
            <div className="space-y-2">
              <Label htmlFor="threshold">Target Rate (%)</Label>
              <Input
                id="threshold"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                placeholder="Enter rate"
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Alert...' : 'Create Alert'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
