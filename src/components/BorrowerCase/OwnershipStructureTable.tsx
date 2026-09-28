import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export interface OwnershipRow {
  directorName: string;
  directorTitle: string;
  directorId: string;
  ultimateBeneficialOwner: string;
  ownershipPercentage: string;
  parentEntity: string;
  ownershipStructureType: string;
}

export const OWNERSHIP_STRUCTURE_TYPES = ['Direct', 'Indirect', 'Trust', 'Corporate'];
export const YES_NO_OPTIONS = ['Yes', 'No'];

export const EMPTY_OWNERSHIP_ROW: OwnershipRow = {
  directorName: '',
  directorTitle: '',
  directorId: '',
  ultimateBeneficialOwner: '',
  ownershipPercentage: '',
  parentEntity: '',
  ownershipStructureType: ''
};

export const SAMPLE_OWNERSHIP_ROW: OwnershipRow = {
  directorName: 'Alicia Monroe',
  directorTitle: 'Managing Director',
  directorId: 'DIR-10293',
  ultimateBeneficialOwner: 'Yes',
  ownershipPercentage: '35',
  parentEntity: 'Meridian Holdings Group',
  ownershipStructureType: 'Direct'
};

const COLUMNS: { key: keyof OwnershipRow; label: string }[] = [
  { key: 'directorName', label: 'Director Name' },
  { key: 'directorTitle', label: 'Director Title' },
  { key: 'directorId', label: 'Director ID' },
  { key: 'ultimateBeneficialOwner', label: 'Ultimate Beneficial Owner' },
  { key: 'ownershipPercentage', label: 'Ownership Percentage' },
  { key: 'parentEntity', label: 'Parent Entity' },
  { key: 'ownershipStructureType', label: 'Ownership Structure Type' }
];

interface OwnershipStructureTableProps {
  rows: OwnershipRow[];
  onRowsChange: (rows: OwnershipRow[]) => void;
}

export default function OwnershipStructureTable({ rows, onRowsChange }: OwnershipStructureTableProps) {
  const updateCell = (index: number, field: keyof OwnershipRow, value: string) => {
    const next = rows.slice();
    next[index] = { ...next[index], [field]: value };
    onRowsChange(next);
  };

  const handleAdd = () => {
    onRowsChange([...rows, { ...EMPTY_OWNERSHIP_ROW }]);
  };

  const handleRemove = (index: number) => {
    onRowsChange(rows.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
        Ownership Structure
      </Typography>

      <TableContainer component={Paper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: 700 }}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell sx={{ width: 40 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length + 1} align='center' sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Inventory2OutlinedIcon sx={{ color: 'text.disabled', fontSize: 28 }} />
                    <Typography variant='body2' color='text.secondary'>
                      No records
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index}>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key} sx={{ minWidth: 140 }}>
                      {col.key === 'ultimateBeneficialOwner' ? (
                        <TextField
                          select
                          fullWidth
                          size='small'
                          variant='standard'
                          value={row[col.key]}
                          onChange={(e) => updateCell(index, col.key, e.target.value)}
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value='' disabled>
                            Select...
                          </MenuItem>
                          {YES_NO_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : col.key === 'ownershipStructureType' ? (
                        <TextField
                          select
                          fullWidth
                          size='small'
                          variant='standard'
                          value={row[col.key]}
                          onChange={(e) => updateCell(index, col.key, e.target.value)}
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value='' disabled>
                            Select...
                          </MenuItem>
                          {OWNERSHIP_STRUCTURE_TYPES.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <TextField
                          fullWidth
                          size='small'
                          variant='standard'
                          value={row[col.key]}
                          onChange={(e) => updateCell(index, col.key, e.target.value)}
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton size='small' onClick={() => handleRemove(index)}>
                      <DeleteOutlineIcon fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        onClick={handleAdd}
        startIcon={<AddIcon fontSize='small' />}
        sx={{ mt: 1, textTransform: 'none' }}
      >
        Add
      </Button>
    </Box>
  );
}
