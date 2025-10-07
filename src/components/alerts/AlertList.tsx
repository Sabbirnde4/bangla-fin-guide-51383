import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  alert_type: string;
  target_name: string;
  condition_type: string;
  threshold_value: number | null;
  current_value: number;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

interface AlertListProps {
  alerts: Alert[];
  onToggle?: (alertId: string, isActive: boolean) => void;
  onDelete?: (alertId: string) => void;
  isLoading?: boolean;
}

export const AlertList = ({ alerts, onToggle, onDelete, isLoading }: AlertListProps) => {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No active alerts</h3>
          <p className="text-muted-foreground">
            Set up alerts on products and banks to get notified of rate changes
          </p>
        </CardContent>
      </Card>
    );
  }

  const getConditionText = (alert: Alert) => {
    if (alert.condition_type === 'changes') {
      return 'When rate changes';
    }
    if (alert.condition_type === 'above') {
      return `When rate goes above ${alert.threshold_value}%`;
    }
    return `When rate drops below ${alert.threshold_value}%`;
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={!alert.is_active ? 'opacity-60' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold">{alert.target_name}</h4>
                  <Badge variant={alert.alert_type === 'product' ? 'default' : 'secondary'}>
                    {alert.alert_type}
                  </Badge>
                  {!alert.is_active && (
                    <Badge variant="outline">Paused</Badge>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bell className="h-3.5 w-3.5" />
                    <span>{getConditionText(alert)}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Current rate: <span className="font-medium text-foreground">{alert.current_value.toFixed(2)}%</span>
                  </div>
                  {alert.last_triggered_at && (
                    <div className="text-muted-foreground">
                      Last triggered {formatDistanceToNow(new Date(alert.last_triggered_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {onToggle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggle(alert.id, !alert.is_active)}
                    disabled={isLoading}
                    title={alert.is_active ? 'Pause alert' : 'Activate alert'}
                  >
                    {alert.is_active ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(alert.id)}
                    disabled={isLoading}
                    title="Delete alert"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
