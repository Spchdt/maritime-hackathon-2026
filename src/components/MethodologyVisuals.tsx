import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { BarChart, Bar, XAxis as BarXAxis, YAxis as BarYAxis, LabelList } from 'recharts';
import GamepadIcon from '@mui/icons-material/Gamepad';
import LockIcon from '@mui/icons-material/Lock';
import Stack from '@mui/material/Stack';

import paretoData from '../data/pareto_frontier.json';
import shapleyData from '../data/shapley_values.json';
import mcmcData from '../data/mcmc_robustness.json';

export function MethodologyVisuals() {
  // Process Pareto Data
  const paretoChartData = paretoData
    .filter((_, i) => i % 2 === 0) // Downsample slightly if needed, or just take all
    .map(d => ({
      safety: d.safety_threshold,
      cost: Number((d.total_cost / 1000000).toFixed(2)) // Cost in Millions
    }));

  // Process Shapley Data (Top 5)
  const topShapley = shapleyData.vessels
    .slice(0, 5)
    .map(v => ({
      id: `V${v.vessel_id.toString().slice(-4)}`, // Short ID
      value: Number((v.shapley_value / 1000000).toFixed(1)) // Value in Millions
    }));

  // Process MCMC Data
  const essentialCount = mcmcData.summary.essential_count;
  const totalCount = mcmcData.summary.vessel_count;
  const robustnessScore = Math.round((essentialCount / totalCount) * 100);

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
                <LineChart data={paretoChartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                  <XAxis dataKey="safety" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <RechartsTooltip 
                    formatter={(value: any) => [`$${value}M`, 'Total Cost']}
                    labelFormatter={(label) => `Safety: ${label}`}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#009688" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                21 optimization runs
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
                Trade-off: Cost vs Safety
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
                <BarChart layout="vertical" data={topShapley} margin={{ left: 10, right: 30 }}>
                   <BarXAxis type="number" hide />
                   <BarYAxis dataKey="id" type="category" width={40} tick={{ fontSize: 10 }} />
                   <Bar dataKey="value" fill="#3f51b5" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="value" position="right" formatter={(val: any) => `$${val}M`} style={{ fontSize: '10px', fill: '#666' }} />
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
             </Box>
             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Top Contributors (Game Theory)
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
                    <Typography variant="h4" fontWeight="bold">{robustnessScore}%</Typography>
                </Box>
                 <LockIcon sx={{ position: 'absolute', bottom: 0, right: 10, bgcolor: 'background.paper', borderRadius: '50%', color: '#4caf50', border: '4px solid white' }} />
            </Box>
            
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: '#2e7d32' }}>
                MCMC Robustness
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {essentialCount} / {totalCount} Essential Vessels
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
