import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormContext } from "react-hook-form";

interface UploadBoxProps {
  nameFile: string;
  nameUrl: string;
  title?: string;
  helperText?: string;
}

export default function ImageUpload({
  nameFile,
  nameUrl,
  title = "Upload file",
  helperText = "PNG/JPG/GIF only",
}: UploadBoxProps) {
  const { setValue, watch } = useFormContext();

  const formFileValue = watch(nameFile);
  const formUrlValue = watch(nameUrl);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  // ✅ Sync initial values on edit/load
  useEffect(() => {
    if (formFileValue instanceof File) {
      setFile(formFileValue);
      setUrl("");
    } else if (typeof formUrlValue === "string" && formUrlValue) {
      setUrl(formUrlValue);
      setFile(null);
    } else {
      setFile(null);
      setUrl("");
    }
  }, [formFileValue, formUrlValue]);

  const handleFile = (f: File) => {
    setFile(f);
    setUrl("");
    setValue(nameFile, f, { shouldValidate: true });
    setValue(nameUrl, undefined, { shouldValidate: true });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setFile(null);
    setUrl("");
    setValue(nameFile, undefined, { shouldValidate: true });
    setValue(nameUrl, undefined, { shouldValidate: true });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>

        {(file || url) && (
          <IconButton size="small" onClick={reset}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* ✅ SEPARATE PREVIEW BOX */}
      {(file || url) && (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            p: 2,
            mb: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle2">
            {file ? "Selected Image" : "Existing Image"}
          </Typography>

          <Box mt={1}>
            <img
              src={file ? URL.createObjectURL(file) : url}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: 180,
                borderRadius: 6,
                objectFit: "cover",
              }}
            />
          </Box>

          <LinearProgress variant="determinate" value={100} sx={{ mt: 2 }} />
        </Box>
      )}

      {/* ✅ SEPARATE UPLOAD / DRAG-AND-DROP AREA */}
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: dragActive ? "primary.main" : "grey.400",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          mb: 3,
          cursor: "pointer",
          backgroundColor: dragActive ? "grey.100" : "transparent",
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary" }} />
        <Typography mt={1}>
          Drag & Drop or{" "}
          <Button component="label">
            Choose file
            <input hidden type="file" accept="image/*" onChange={handleSelect} />
          </Button>
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      </Box>

      {/* ✅ Optional URL input (only shown when no local file selected) */}
      {!file && (
        <TextField
          fullWidth
          placeholder="Paste image URL (optional)"
          value={url}
          onChange={(e) => {
            const val = e.target.value;
            setUrl(val);
            setValue(nameUrl, val ? val : undefined, { shouldValidate: true });
          }}
        />
      )}
    </Paper>
  );
}
