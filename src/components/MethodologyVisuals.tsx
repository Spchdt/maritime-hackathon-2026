import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceArea } from 'recharts';
import { BarChart, Bar, XAxis as BarXAxis, YAxis as BarYAxis, LabelList } from 'recharts';
import GamepadIcon from '@mui/icons-material/Gamepad';
import LockIcon from '@mui/icons-material/Lock';
import Stack from '@mui/material/Stack';

export function MethodologyVisuals() {
  return (
    <Grid container spacing={4} sx={{ mt: 4 }}>
      {/* Pareto Section */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pareto Efficiency Frontier
            </Typography>
            <Box sx={{ height: 200, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { safety: 3.0, cost: 20 },
                  { safety: 4.0, cost: 22 },
                  { safety: 4.7, cost: 25 },
                  { safety: 4.8, cost: 18 }, // Drop
                  { safety: 5.0, cost: 19 },
                ]} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="safety" type="number" domain={[3, 5]} hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="cost" stroke="#009688" strokeWidth={3} dot={false} />
                  <ReferenceArea x1={4.7} x2={4.8} strokeOpacity={0.3} fill="red" fillOpacity={0.1} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                21 optimization runs
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
                Spike at 4.7, Drop at 4.8+
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Shapley Section */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
               <GamepadIcon color="primary" />
               <Typography variant="h6" fontWeight="bold">
                  Shapley Value Analysis
               </Typography>
            </Stack>
            
             <Box sx={{ height: 200, width: '100%', mt: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={[
                    { id: 'V001', value: 10.5 },
                    { id: 'V002', value: 10.5 },
                    { id: 'V005', value: 10.1 },
                    { id: 'V008', value: 9.8 },
                    { id: 'V012', value: 9.2 },
                ]} margin={{ left: 10 }}>
                   <BarXAxis type="number" hide />
                   <BarYAxis dataKey="id" type="category" width={40} tick={{ fontSize: 10 }} />
                   <Bar dataKey="value" fill="#3f51b5" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="value" position="right" formatter={(val: any) => `$${val}M`} style={{ fontSize: '10px', fill: '#666' }} />
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
             </Box>
             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                1,000 permutations
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* MCMC Section */}
       <Grid size={{ xs: 12, md: 4 }}>
        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', m: 2 }}>
                <Box sx={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    border: '8px solid #4caf50',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2e7d32'
                }}>
                    <Typography variant="h4" fontWeight="bold">100%</Typography>
                </Box>
                 <LockIcon sx={{ position: 'absolute', bottom: 0, right: 10, bgcolor: 'background.paper', borderRadius: '50%', color: '#4caf50', border: '4px solid white' }} />
            </Box>
            
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: '#2e7d32' }}>
                MCMC Robustness
            </Typography>
            <Typography variant="body2" color="text.secondary">
                10,000 samples
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
