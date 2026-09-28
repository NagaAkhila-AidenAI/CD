import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CloseIcon from '@mui/icons-material/Close';

export const SAMPLE_DOCUMENT_NAMES = [
  'financial_statements.pdf',
  'certificate_of_incorporation.pdf',
  'proof_of_address.pdf'
];

interface DocumentsFormProps {
  fileNames: string[];
  onFileNamesChange: (fileNames: string[]) => void;
}

export default function DocumentsForm({ fileNames, onFileNamesChange }: DocumentsFormProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const names = Array.from(fileList).map((file) => file.name);
    onFileNamesChange([...fileNames, ...names]);
  };

  const handleRemove = (index: number) => {
    onFileNamesChange(fileNames.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ maxWidth: 700 }}>
      <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.5 }}>
        Mandatory documents
      </Typography>

      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          border: '2px dashed',
          borderColor: isDragOver ? 'primary.main' : 'text.disabled',
          backgroundColor: isDragOver ? 'action.hover' : 'transparent',
          borderRadius: 1,
          px: 2,
          py: 2,
          cursor: 'pointer'
        }}
      >
        <Typography variant='body2' color='text.secondary' sx={{ flexGrow: 1, textAlign: 'center' }}>
          Drop or choose files
        </Typography>
        <IconButton
          size='small'
          component='span'
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
        >
          <AttachFileIcon fontSize='small' />
        </IconButton>
        <input
          ref={inputRef}
          type='file'
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </Box>

      {fileNames.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {fileNames.map((name, index) => (
            <ListItem
              key={`${name}-${index}`}
              secondaryAction={
                <IconButton size='small' onClick={() => handleRemove(index)}>
                  <CloseIcon fontSize='small' />
                </IconButton>
              }
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <InsertDriveFileOutlinedIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
