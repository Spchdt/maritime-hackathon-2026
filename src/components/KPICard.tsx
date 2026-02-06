import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down';
  unit?: string;
}

export function KPICard({ title, value, icon: Icon, trend, trendDirection, unit }: KPICardProps) {
  return (
    <Card elevation={0} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography color="text.secondary" variant="subtitle2" component="div" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </Typography>
          <Box sx={{ color: 'text.secondary' }}>
             <Icon size={16} />
          </Box>
        </Box>
        <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {value}<Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{unit}</Typography>
            </Typography>
            {trend && (
                <Typography variant="caption" sx={{ color: trendDirection === 'up' ? 'success.main' : 'error.main', display: 'flex', alignItems: 'center', mt: 1 }}>
                    {trend} vs last scenario
                </Typography>
            )}
        </Box>
      </CardContent>
    </Card>
  );
}
