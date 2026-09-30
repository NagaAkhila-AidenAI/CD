import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SectionPanel from './SectionPanel';

export const SAMPLE_DOCUMENT_NAMES = [
  'financial_statements.pdf',
  'certificate_of_incorporation.pdf',
  'proof_of_address.pdf'
];

interface DocumentsFormProps {
  fileNames: string[];
  onFileNamesChange: (fileNames: string[]) => void;
}

const fileType = (name: string) => {
  const ext = name.includes('.') ? name.split('.').pop() : '';
  return ext ? ext.toUpperCase() : '—';
};

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
    <>
      <SectionPanel title='Upload Documents' icon={<CloudUploadOutlinedIcon />}>
        <Box sx={{ backgroundColor: '#f7f7f7', borderRadius: 1, p: 3 }}>
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
              backgroundColor: isDragOver ? 'action.hover' : '#fff',
              borderRadius: 1,
              px: 2,
              py: 2,
              cursor: 'pointer'
            }}
          >
            <Typography variant='body2' color='text.secondary' sx={{ flexGrow: 1, textAlign: 'center' }}>
              Drop or choose files
            </Typography>
            <IconButton size='small' component='span' sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
        </Box>
      </SectionPanel>

      <SectionPanel title='Documents' icon={<InsertDriveFileOutlinedIcon />}>
        <TableContainer component={Paper} variant='outlined' sx={{ borderRadius: 1.5 }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ py: 1.5 }}>
                  Documents
                </TableCell>
                <TableCell align='center' sx={{ py: 1.5, width: 220 }}>
                  Document Type
                </TableCell>
                <TableCell align='center' sx={{ py: 1.5, width: 160 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fileNames.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align='center' sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      <Inventory2OutlinedIcon sx={{ color: 'text.disabled', fontSize: 28 }} />
                      <Typography variant='body2' color='text.secondary'>
                        No data available
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                fileNames.map((name, index) => (
                  <TableRow key={`${name}-${index}`}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{fileType(name)}</TableCell>
                    <TableCell align='center'>
                      <Tooltip title='Remove'>
                        <IconButton size='small' onClick={() => handleRemove(index)} sx={{ color: 'primary.main' }}>
                          <DeleteOutlineIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1.5 }}>
          Showing {fileNames.length === 0 ? 0 : 1} to {fileNames.length} of {fileNames.length} entries
        </Typography>
      </SectionPanel>
    </>
  );
}
