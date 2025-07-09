import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Thermostat as ThermostatIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Build as BuildIcon,
  SwapHoriz as SwapHorizIcon,
  AutoFixHigh as AutoFixHighIcon,
  Handyman as HandymanIcon,
  ModelTraining as ModelTrainingIcon,
  Balance as BalanceIcon,
  Bolt as BoltIcon,
  GridView as GridViewIcon,
} from "@mui/icons-material";

import { styled, useTheme } from "@mui/material/styles";

// Types
interface MonitoringStatus {
  statuses: {
    migration: { is_running: boolean };
    environmental: { is_running: boolean };
    preventive: { is_running: boolean };
  };
}

type Weights = {
  energy: number;
  balance: number;
  overload: number;
  allocation: number;
};

const Home: React.FC = () => {
  const theme = useTheme();

  // State definitions
  const [monitoringStatus, setMonitoringStatus] =
    useState<MonitoringStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [envTimeUnit, setEnvTimeUnit] = useState<string>("1");
  const [envSteps, setEnvSteps] = useState<string>("5");
  const [envModelType, setEnvModelType] = useState<string>("modelA");

  const [prevTimeUnit, setPrevTimeUnit] = useState<string>("1");
  const [prevSteps, setPrevSteps] = useState<string>("5");
  const [prevModelType, setPrevModelType] = useState<string>("modelA");

  const [migrationMode, setMigrationMode] = useState<"auto" | "semiauto">(
    "auto"
  );
  const [migrationTime, setMigrationTime] = useState<string>("1");
  const [migrationMethod, setMigrationMethod] =
    useState<string>("mathematical");
  const [estimationMethod, setEstimationMethod] = useState<
    "direct" | "indirect"
  >("direct");
  const [migrationModel, setMigrationModel] = useState<string>("modelX");

  const [weights, setWeights] = useState<Weights>({
    energy: 25,
    balance: 25,
    overload: 25,
    allocation: 25,
  });

  const [weightError, setWeightError] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const [blockList, setBlockList] = useState<string[]>([]);
  const [lastConfigSent, setLastConfigSent] = useState<any>(null);

  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Helper function to show alerts
  const showAlert = (
    message: string,
    severity: "error" | "success" | "info"
  ) => {
    setAlert({ open: true, message, severity });
  };
  const handleCloseAlert = () => setAlert((a) => ({ ...a, open: false }));

  // Function to check if any service is running
  const isAnyServiceRunning = (status: MonitoringStatus | null) => {
    if (!status) return false;
    return (
      status.statuses.migration.is_running ||
      status.statuses.environmental.is_running ||
      status.statuses.preventive.is_running
    );
  };

  // Force status update function (async)
  const forceStatusUpdate = async (): Promise<MonitoringStatus | null> => {
    try {
      setIsStatusLoading(true);
      const status = await monitoringService.getMonitoringStatus();
      setMonitoringStatus(status);

      const anyRunning = isAnyServiceRunning(status);
      if (anyRunning !== isMonitoring) {
        setIsMonitoring(anyRunning);
      }
      return status;
    } catch (error) {
      console.error("Error in force status update:", error);
      return null;
    } finally {
      setIsStatusLoading(false);
    }
  };

  // Select change handler with proper typing
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    switch (name) {
      case "envTimeUnit":
        setEnvTimeUnit(value);
        break;
      case "envSteps":
        setEnvSteps(value);
        break;
      case "envModelType":
        setEnvModelType(value);
        break;
      case "prevTimeUnit":
        setPrevTimeUnit(value);
        break;
      case "prevSteps":
        setPrevSteps(value);
        break;
      case "prevModelType":
        setPrevModelType(value);
        break;
      case "migrationTime":
        setMigrationTime(value);
        break;
      case "migrationMethod":
        setMigrationMethod(value);
        break;
      case "estimationMethod":
        setEstimationMethod(value as "direct" | "indirect");
        break;
      case "migrationModel":
        setMigrationModel(value);
        break;
      default:
        break;
    }
  };

  // Migration mode toggle handler
  const handleMigrationModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: "auto" | "semiauto" | null
  ) => {
    if (newMode !== null) setMigrationMode(newMode);
  };

  // Weight change handlers (example, implement your logic)
  const handleSliderChange =
    (key: keyof Weights) => (event: Event, newValue: number | number[]) => {
      const value = Array.isArray(newValue) ? newValue[0] : newValue;
      setWeights((prev) => {
        const newWeights = { ...prev, [key]: value };
        validateWeights(newWeights);
        return newWeights;
      });
    };

  const handleManualWeightChange =
    (key: keyof Weights) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setWeights((prev) => {
        const newWeights = { ...prev, [key]: value };
        validateWeights(newWeights);
        return newWeights;
      });
    };

  // Validation function for weights
  const validateWeights = (weights: Weights) => {
    const total =
      weights.energy + weights.balance + weights.overload + weights.allocation;
    const valid = total === 100;
    setIsValid(valid);
    setWeightError(!valid);
  };

  // useEffect to poll monitoring status (similar to your part 2)
  useEffect(() => {
    const fetchAndUpdateStatus = async () => {
      try {
        if (!monitoringStatus) {
          setIsStatusLoading(true);
        }
        const status = await monitoringService.getMonitoringStatus();
        setMonitoringStatus(status);
        const anyRunning = isAnyServiceRunning(status);
        if (anyRunning !== isMonitoring) {
          setIsMonitoring(anyRunning);
        }
      } catch (error) {
        console.error("Error fetching monitoring status:", error);
      } finally {
        setIsStatusLoading(false);
      }
    };

    fetchAndUpdateStatus();
    const intervalId = setInterval(fetchAndUpdateStatus, 3000);
    return () => clearInterval(intervalId);
  }, [isMonitoring, monitoringStatus]);

  // Render function for status chips
  const renderStatusChip = (isRunning: boolean | undefined) => {
    if (isRunning === undefined) {
      return <StatusChip label="Unknown" className="stopped" size="small" />;
    }
    return (
      <StatusChip
        label={isRunning ? "Running" : "Stopped"}
        className={isRunning ? "running" : "stopped"}
        size="small"
      />
    );
  };

  // ...Your remaining UI rendering code, including buttons and dialog

  return (
    <Box sx={{ height: "calc(100vh - 80px)", overflow: "auto" }}>
      {/* Your conditional rendering based on optimization selection */}
      {/* ... */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          mb: 1,
          color: isAnyServiceRunning(monitoringStatus)
            ? "success.main"
            : "text.secondary",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {isAnyServiceRunning(monitoringStatus) ? (
          <>
            <CheckCircleIcon color="success" /> Monitoring is Active
          </>
        ) : (
          <>
            <ErrorIcon color="error" /> Monitoring is Inactive
          </>
        )}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            try {
              setIsLoading(true);
              await forceStatusUpdate();

              if (isAnyServiceRunning(monitoringStatus)) {
                showAlert("Monitoring is already running", "info");
                setIsLoading(false);
                return;
              }
              if (!isValid) {
                showAlert(
                  "Please ensure weights sum to 100% before starting monitoring",
                  "error"
                );
                setIsLoading(false);
                return;
              }

              // Build config object with stringified values
              const config = {
                migration: {
                  script_time_unit: migrationTime.toString(),
                  virtual_machine_estimation: {
                    estimation_method: estimationMethod,
                    model_type: migrationModel,
                  },
                  migration_advices: {
                    migration_method:
                      migrationMethod === "mathematical"
                        ? "migration_advices_la"
                        : "migration_advices_llm",
                    migration_weights: {
                      power: (weights.energy / 100).toString(),
                      balance: (weights.balance / 100).toString(),
                      overload: (weights.overload / 100).toString(),
                      allocation: (weights.allocation / 100).toString(),
                    },
                  },
                  block_list: blockList,
                },
                environmental: {
                  number_of_steps: envSteps.toString(),
                  script_time_unit: envTimeUnit.toString(),
                  model_type: envModelType,
                },
                preventive: {
                  number_of_steps: prevSteps.toString(),
                  script_time_unit: prevTimeUnit.toString(),
                  model_type: prevModelType,
                },
              };

              console.log(
                "Final config JSON:",
                JSON.stringify(config, null, 2)
              );
              setLastConfigSent(config);

              await monitoringService.startMonitoring(config);
              await forceStatusUpdate();
              setTimeout(async () => {
                await forceStatusUpdate();
              }, 1000);
              showAlert("Monitoring started successfully", "success");
            } catch (startError) {
              console.error("Error starting monitoring:", startError);
              showAlert(
                startError instanceof Error
                  ? startError.message
                  : "Failed to start monitoring",
                "error"
              );
              await forceStatusUpdate();
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading || isAnyServiceRunning(monitoringStatus)}
          sx={{
            minWidth: 200,
            height: 56,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: 600,
            boxShadow: theme.shadows[4],
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              boxShadow: theme.shadows[8],
              transform: "translateY(-2px)",
              backgroundColor: theme.palette.primary.dark,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              opacity: 0.8,
            },
            transition: "all 0.3s ease-in-out",
            px: 4,
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&.Mui-disabled": {
              backgroundColor: isAnyServiceRunning(monitoringStatus)
                ? theme.palette.grey[400]
                : theme.palette.action.disabledBackground,
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(2px)",
                zIndex: 0,
              },
              "&::before": {
                opacity: 0.3,
              },
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "1.5rem",
                mr: 1,
              },
            }}
          >
            <PlayArrowIcon /> Start Monitoring
          </Box>
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            try {
              setIsLoading(true);
              await forceStatusUpdate();

              if (!isAnyServiceRunning(monitoringStatus)) {
                showAlert("Monitoring is not running", "info");
                setIsLoading(false);
                return;
              }

              await monitoringService.stopMonitoring();
              await forceStatusUpdate();
              setTimeout(async () => {
                await forceStatusUpdate();
              }, 1000);
              showAlert("Monitoring stopped successfully", "success");
            } catch (stopError) {
              console.error("Error stopping monitoring:", stopError);
              showAlert(
                stopError instanceof Error
                  ? stopError.message
                  : "Failed to stop monitoring",
                "error"
              );
              await forceStatusUpdate();
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading || !isAnyServiceRunning(monitoringStatus)}
          sx={{
            minWidth: 200,
            height: 56,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: 600,
            boxShadow: theme.shadows[4],
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              boxShadow: theme.shadows[8],
              transform: "translateY(-2px)",
              backgroundColor: theme.palette.error.dark,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              opacity: 0.8,
            },
            transition: "all 0.3s ease-in-out",
            px: 4,
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&.Mui-disabled": {
              backgroundColor: !isAnyServiceRunning(monitoringStatus)
                ? theme.palette.grey[400]
                : theme.palette.action.disabledBackground,
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(2px)",
                zIndex: 0,
              },
              "&::before": {
                opacity: 0.3,
              },
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "1.5rem",
                mr: 1,
              },
            }}
          >
            <StopIcon /> Stop Monitoring
          </Box>
        </Button>
      </Box>

      {/* Rest of your code: StatusCard, Dialog, Snackbar, DebugConsole etc. */}
    </Box>
  );
};

export default Home;
