import { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Typography, FormControl, InputLabel, Select,
  MenuItem, Button, Grid, useTheme, styled, SelectChangeEvent,
  Slider, TextField, Snackbar, Alert, Chip, CircularProgress,
  Tooltip, ToggleButton, ToggleButtonGroup, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import BuildIcon from '@mui/icons-material/Build';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TimelineIcon from '@mui/icons-material/Timeline';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import SpeedIcon from '@mui/icons-material/Speed';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BalanceIcon from '@mui/icons-material/Balance';
import BoltIcon from '@mui/icons-material/Bolt';
import GridViewIcon from '@mui/icons-material/GridView';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import HandymanIcon from '@mui/icons-material/Handyman';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import { monitoringService } from './monitoringService';
import DebugConsole from '../components/DebugConsole';
import MonitoringSystem from './monitoringSystem';
import { Weights, AlertState, MonitoringStatus } from '../types/monitoring';

// ------ Styled Components -------
const StyledCard = styled(Paper)(({ theme }) => ({ /* styles */ }));
const StyledSelect = styled(Select)(({ theme }) => ({ /* styles */ }));
const SectionTitle = styled(Typography)(({ theme }) => ({ /* styles */ }));
const IconWrapper = styled(Box)(({ theme }) => ({ /* styles */ }));
const WeightSlider = styled(Slider)(({ theme }) => ({ /* styles */ }));
const WeightInput = styled(TextField)(({ theme }) => ({ /* styles */ }));
const StatusChip = styled(Chip)(({ theme }) => ({ /* styles */ }));
const StatusCard = styled(Box)(({ theme }) => ({ /* styles */ }));
const StatusIndicator = styled('div')(({ theme }) => ({ /* styles */ }));

// ------ Constants -------
const timeOptions = ['1', '5'];
const stepOptions = ['3', ...Array.from({ length: 47 }, (_, i) => (i + 4).toString())];
const modelTypes = ['lstm'];
const migrationMethodTypes = ['mathematical', 'AI'];
const migrationModelTypes = {
  direct: ['ssl'],
  indirect: ['xgboost', 'mul_reg']
};

const Home = () => {
  const theme = useTheme();
  const savedState = localStorage.getItem('optimizationState');
  const parsedState = savedState ? JSON.parse(savedState) : null;

  // ----- States -----
  const [hasSelectedOptimization, setHasSelectedOptimization] = useState(!!parsedState);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [blockList, setBlockList] = useState<string[]>(parsedState?.unselectedVMs || []);
  const [selectedVMs, setSelectedVMs] = useState<string[]>(parsedState?.selectedVMs || []);
  const [optimizationState, setOptimizationState] = useState(parsedState || {
    selectedVMs: [],
    unselectedVMs: []
  });

  const [envTimeUnit, setEnvTimeUnit] = useState<string>('1');
  const [envSteps, setEnvSteps] = useState<string>('3');
  const [envModelType, setEnvModelType] = useState<string>('lstm');

  const [prevTimeUnit, setPrevTimeUnit] = useState<string>('1');
  const [prevSteps, setPrevSteps] = useState<string>('3');
  const [prevModelType, setPrevModelType] = useState<string>('lstm');

  const [migrationTime, setMigrationTime] = useState<string>('5');
  const [migrationMethod, setMigrationMethod] = useState<string>('mathematical');
  const [estimationMethod, setEstimationMethod] = useState<'direct' | 'indirect'>('indirect');
  const [migrationModel, setMigrationModel] = useState<string>('mul_reg');
  const [migrationMode, setMigrationMode] = useState<'auto' | 'semiauto'>('auto');

  const [weights, setWeights] = useState<Weights>({
    energy: 25,
    balance: 25,
    overload: 25,
    allocation: 25
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [weightError, setWeightError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false, message: '', severity: 'info'
  });

  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [lastConfigSent, setLastConfigSent] = useState<any>(null);

  // New state for dialog visibility
  const [dialogOpen, setDialogOpen] = useState(false);

  // ---------- Scroll Cleanup ----------
  useEffect(() => {
    return () => {
      monitoringService.stopStatusPolling();
    };
  }, []);

  // Add shimmer keyframes (Only Once)
  useEffect(() => {
    const shimmerKeyframes = `
      @keyframes shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: 0 0; }
      }
    `;
    const styleId = 'shimmer-animation-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = shimmerKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  const validateWeightSum = useCallback(() => {
    const sum = Object.values(weights).reduce((a, b) => a + Number(b), 0);
    return Math.abs(sum - 100) < 0.001;
  }, [weights]);

  useEffect(() => {
    const isValidSum = validateWeightSum();
    setIsValid(isValidSum);
    setWeightError(!isValidSum);
  }, [weights, validateWeightSum]);

  const handleManualWeightChange = (type: keyof Weights) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = event.target.value === '' ? 0 : parseInt(event.target.value);
    if (isNaN(val)) return;

    setWeights(prev => ({
      ...prev,
      [type]: Math.min(100, Math.max(0, Math.round(val)))
    }));
  };

  const handleSliderChange = (type: keyof Weights) => (_: Event, newValue: number | number[]) => {
    const roundedMain = Math.round(newValue as number);
    const others = Object.keys(weights).filter(k => k !== type) as Array<keyof Weights>;
    const remaining = 100 - roundedMain;
    const oldOtherSum = others.reduce((sum, key) => sum + weights[key], 0);

    const scaled = oldOtherSum > 0
      ? others.reduce((acc, key) => ({
        ...acc,
        [key]: Math.round(weights[key] * (remaining / oldOtherSum))
      }), {} as Partial<Weights>)
      : Object.fromEntries(others.map(k => [k, Math.floor(remaining / others.length)]));

    setWeights({
      ...weights,
      [type]: roundedMain,
      ...scaled
    });
  };

  const isAnyServiceRunning = (status: MonitoringStatus | null): boolean =>
    status
      ? status.statuses.migration.is_running ||
        status.statuses.environmental.is_running ||
        status.statuses.preventive.is_running
      : false;

  const forceStatusUpdate = async () => {
    try {
      setIsStatusLoading(true);
      const status = await monitoringService.getMonitoringStatus();
      setMonitoringStatus(status);
      const any = isAnyServiceRunning(status);
      if (any !== isMonitoring) setIsMonitoring(any);
    } catch (err) {
      console.error('Force Status Update Error:', err);
    } finally {
      setIsStatusLoading(false);
    }
  };

  const handleOptimizationSaved = (unselectedVMs: string[], selectedVMs: string[]) => {
    const newState = { selectedVMs, unselectedVMs };
    setBlockList(unselectedVMs);
    setSelectedVMs(selectedVMs);
    setOptimizationState(newState);
    setHasSelectedOptimization(true);
    localStorage.setItem('optimizationState', JSON.stringify(newState));
  };

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    const v = value as string;
    switch (name) {
      case 'envTimeUnit': return setEnvTimeUnit(v);
      case 'envSteps': return setEnvSteps(v);
      case 'envModelType': return setEnvModelType(v);
      case 'prevTimeUnit': return setPrevTimeUnit(v);
      case 'prevSteps': return setPrevSteps(v);
      case 'prevModelType': return setPrevModelType(v);
      case 'migrationTime': return setMigrationTime(v);
      case 'migrationMethod': return setMigrationMethod(v);
      case 'migrationModel': return setMigrationModel(v);
      case 'estimationMethod':
        setEstimationMethod(v as 'direct' | 'indirect');
        return setMigrationModel(migrationModelTypes[v as 'direct' | 'indirect'][0]);
    }
  };

  const showAlert = (message: string, severity: AlertState['severity'] = 'info') => {
    setAlert({ open: true, message, severity });
  };
  const handleCloseAlert = () => setAlert(prev => ({ ...prev, open: false }));

  const handleSaveClick = () => {
    try {
      // Validate before saving
      if (!validateWeightSum()) {
        showAlert('Please ensure weights sum to 100', 'error');
        return;
      }

      const config = {
        envTimeUnit,
        envSteps,
        envModelType,
        prevTimeUnit,
        prevSteps,
        prevModelType,
        migrationTime,
        migrationMethod,
        migrationModel,
        weights
      };

      // Save to localStorage
      localStorage.setItem('monitoringConfig', JSON.stringify(config));
      setLastConfigSent(config);
      
      // Show success and close dialog
      showAlert('Configuration saved successfully!', 'success');
      setDialogOpen(false);
      
    } catch (error) {
      console.error('Save failed:', error);
      showAlert('Failed to save configuration', 'error');
    }
  };

  const renderSaveDialog = () => (
    <Dialog 
      open={dialogOpen} 
      onClose={() => setDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Save Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Are you sure you want to save these settings?
          </Typography>
          <Box sx={{ mt: 3 }}>
            {/* Display summary of current settings */}
            <Typography variant="subtitle1">Current Configuration:</Typography>
            <Typography variant="body2">Environment Time Unit: {envTimeUnit}</Typography>
            <Typography variant="body2">Steps: {envSteps}</Typography>
            <Typography variant="body2">Model Type: {envModelType}</Typography>
            {/* Add more settings display as needed */}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setDialogOpen(false)}
          color="secondary"
          startIcon={<ErrorIcon />}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveClick}
          color="primary"
          variant="contained"
          startIcon={<CheckCircleIcon />}
        >
          Confirm Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!monitoringStatus) setIsStatusLoading(true);
        const status = await monitoringService.getMonitoringStatus();
        setMonitoringStatus(status);
        setIsMonitoring(isAnyServiceRunning(status));
      } catch (err) {
        console.error('Status Polling Error:', err);
      } finally {
        setIsStatusLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [monitoringStatus]);

  // ------ UI Rendering ------
  return (
    <Box sx={{ height: 'calc(100vh - 80px)', overflow: 'auto' }}>
      {/* Your existing layout components... */}

      {/* Add a save button somewhere in your UI */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        startIcon={<SaveIcon />}
      >
        Save Configuration
      </Button>

      {/* Render the dialog */}
      {renderSaveDialog()}

      {/* Existing Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
