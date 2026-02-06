import { Layout } from './components/Layout';
import { KPICard } from './components/KPICard';
import { DollarSign, ShieldCheck, Zap, Anchor, Scale } from 'lucide-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import fleetResult from './data/fleet_result.json';
import routeInfo from './data/route_info.json';
import { FleetTable } from './components/FleetTable';
import { ParetoChart, FuelCompositionChart, ShapleyChart, HeatmapChart, CarbonSensitivityChart } from './components/Charts';
import { ComparisonTable } from './components/ComparisonTable';

function App() {
  const { optimal_fleet } = fleetResult;

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
            Optimal Fleet Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Scenario: Baseline (Safety &ge; 3.0)
          </Typography>

          {/* Route Info */}
          <Paper variant="outlined" sx={{ mt: 2, p: 2, display: 'inline-flex', borderRadius: 3 }}>
              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} alignItems="center">
                <Box>
                    <Typography component="span" fontWeight="bold">Route: </Typography>
                    {routeInfo.route}
                </Box>

                <Box>
                    <Typography component="span" fontWeight="bold">Annual Demand: </Typography>
                    {(routeInfo.annual_demand_tonnes / 1000000).toFixed(1)}M tonnes
                </Box>
              </Stack>
          </Paper>
        </Box>

        {/* KPI Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
             <Grid size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ display: 'flex' }}>
                <KPICard
                    title="Total Cost"
                    value={`$${(optimal_fleet.total_cost / 1000000).toFixed(2)}M`}
                    icon={DollarSign}
                    trend="+2.4%"
                    trendDirection="up"
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ display: 'flex' }}>
                <KPICard
                    title="Total DWT"
                    value={`${(optimal_fleet.total_dwt / 1000000).toFixed(2)}M`}
                    unit="tonnes"
                    icon={Scale}
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ display: 'flex' }}>
                <KPICard
                    title="Avg Safety Score"
                    value={optimal_fleet.avg_safety_score}
                    icon={ShieldCheck}
                    trend="+0.1"
                    trendDirection="up"
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ display: 'flex' }}>
                 <KPICard
                    title="Total CO2eq"
                    value={`${(optimal_fleet.total_co2eq / 1000).toFixed(1)}k`}
                    unit="tonnes"
                    icon={Zap}
                    trend="-4.2%"
                    trendDirection="down"
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ display: 'flex' }}>
                <KPICard
                    title="Fleet Size"
                    value={optimal_fleet.fleet_size}
                    unit="vessels"
                    icon={Anchor}
                />
             </Grid>
        </Grid>

        {/* Top Charts Row */}
        <Grid container spacing={4} sx={{ mb: 4, alignItems: 'stretch' }}>
            {/* Left Column */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <ParetoChart />
                    <CarbonSensitivityChart />
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <HeatmapChart />
                    </Box>
                </Box>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Stack spacing={4} sx={{ flexGrow: 1 }}>
                    <FuelCompositionChart />
                    <ShapleyChart />
                    <ComparisonTable />
                </Stack>
            </Grid>
        </Grid>


        {/* Bottom Table Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
             <Grid size={{ xs: 12 }}>
                 <FleetTable />
             </Grid>
        </Grid>

      </Box>
    </Layout>
  )
}

export default App
