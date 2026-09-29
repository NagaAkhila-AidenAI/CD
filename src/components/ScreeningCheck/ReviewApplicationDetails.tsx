import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import { FieldGrid, SectionCard, isVisibleFor } from './SectionCard';
import { formatDate, formatValue, pickValue } from './caseData';
import type { CaseSnapshot } from './caseData';
import {
  BORROWER_TYPE_KEYS,
  DETAIL_SECTIONS,
  DOCUMENT_LIST_KEYS,
  OWNERSHIP_COLUMNS,
  OWNERSHIP_LIST_KEYS,
  SUMMARY_KEYS
} from './applicationFields';
import type { BorrowerKind } from './applicationFields';

const SECTION_ICONS: Record<string, ReactNode> = {
  funding: <AccountBalanceIcon />,
  borrower: <PersonIcon />,
  business: <BusinessIcon />
};

export function getBorrowerKind(caseData: CaseSnapshot): BorrowerKind | undefined {
  const type = String(pickValue(caseData.content, BORROWER_TYPE_KEYS) ?? '').toLowerCase();
  if (type.includes('individual')) return 'individual';
  if (type.includes('business')) return 'business';
  return undefined;
}

export function getReviewAnchors(kind: BorrowerKind | undefined) {
  return [
    ...DETAIL_SECTIONS.filter((s) => isVisibleFor(s.showFor, kind)).map((s) => ({ id: s.id, title: s.title })),
    { id: 'ownership', title: 'Ownership Structure' },
    { id: 'documents', title: 'Documents' }
  ];
}

function statusColor(status: string): 'warning' | 'success' | 'error' | 'info' {
  const s = status.toLowerCase();
  if (s.startsWith('resolved-completed') || s.includes('approved')) return 'success';
  if (s.includes('reject') || s.includes('withdrawn') || s.includes('declined')) return 'error';
  if (s.startsWith('pending')) return 'warning';
  return 'info';
}

function priorityColor(priority: string): 'error' | 'warning' | 'default' {
  const p = priority.toLowerCase();
  if (p === 'high' || p === 'critical' || p === 'urgent') return 'error';
  if (p === 'medium') return 'warning';
  return 'default';
}

export default function ReviewApplicationDetails({ caseData }: { caseData: CaseSnapshot }) {
  const { content } = caseData;
  const currency = pickValue(content, SUMMARY_KEYS.currency);
  const applicationNumber = pickValue(content, SUMMARY_KEYS.applicationNumber) ?? caseData.businessId;
  const status = String(pickValue(content, SUMMARY_KEYS.applicationStatus) ?? caseData.status ?? '');
  const priority = String(pickValue(content, SUMMARY_KEYS.priority) ?? '');
  const applicationDate = pickValue(content, SUMMARY_KEYS.applicationDate) ?? caseData.createTime;
  const submissionDate = pickValue(content, SUMMARY_KEYS.submissionDate);
  const ownershipRows: Record<string, any>[] = pickValue(content, OWNERSHIP_LIST_KEYS) ?? [];
  const documents: any[] = pickValue(content, DOCUMENT_LIST_KEYS) ?? [];
  const kind = getBorrowerKind(caseData);

  return (
    <Stack spacing={3}>
      {/* Summary header */}
      <Card variant='outlined' sx={{ borderRadius: 3, p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent='space-between'>
          <Box>
            <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
              Application number
            </Typography>
            <Typography variant='h5' sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
              {applicationNumber || '—'}
            </Typography>
            <Stack direction='row' spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
              {status && <Chip size='small' label={status} color={statusColor(status)} sx={{ fontWeight: 600 }} />}
              {priority && (
                <Chip
                  size='small'
                  variant='outlined'
                  label={`${priority} priority`}
                  color={priorityColor(priority)}
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Chip size='small' variant='outlined' icon={<LockOutlinedIcon />} label='Read only' />
            </Stack>
          </Box>

          <Stack direction='row' spacing={4} alignItems='flex-start'>
            <DateStat label='Application date' value={applicationDate} />
            <DateStat label='Submission date' value={submissionDate} />
          </Stack>
        </Stack>
      </Card>

      {/* Detail sections */}
      {DETAIL_SECTIONS.filter((section) => isVisibleFor(section.showFor, kind)).map((section) => (
        <SectionCard key={section.id} id={section.id} icon={SECTION_ICONS[section.id]} title={section.title}>
          <FieldGrid fields={section.fields} content={content} currency={currency} kind={kind} />
        </SectionCard>
      ))}

      {/* Ownership */}
      <SectionCard id='ownership' icon={<GroupsIcon />} title='Ownership Structure'>
        {Array.isArray(ownershipRows) && ownershipRows.length > 0 ? (
          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table size='small'>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  {OWNERSHIP_COLUMNS.map((col) => (
                    <TableCell key={col.label} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ownershipRows.map((row, i) => (
                  <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                    {OWNERSHIP_COLUMNS.map((col) => (
                      <TableCell key={col.label}>{formatValue(pickValue(row, col.keys)) || '—'}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant='body2' sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
            No ownership records on this application.
          </Typography>
        )}
      </SectionCard>

      {/* Documents */}
      <SectionCard id='documents' icon={<FolderIcon />} title='Documents'>
        {Array.isArray(documents) && documents.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
            {documents.map((doc, i) => {
              const name = typeof doc === 'string' ? doc : pickValue(doc, ['FileName', 'Name', 'pyFileName']) ?? 'Document';
              return (
                <Stack
                  key={`${name}-${i}`}
                  direction='row'
                  spacing={1.5}
                  alignItems='center'
                  sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 0 }}
                >
                  <InsertDriveFileOutlinedIcon sx={{ color: 'primary.main' }} />
                  <Typography variant='body2' sx={{ fontWeight: 500 }} noWrap title={name}>
                    {name}
                  </Typography>
                </Stack>
              );
            })}
          </Box>
        ) : (
          <Typography variant='body2' sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
            No documents uploaded.
          </Typography>
        )}
      </SectionCard>
    </Stack>
  );
}

function DateStat({ label, value }: { label: string; value: unknown }) {
  return (
    <Box>
      <Stack direction='row' spacing={0.5} alignItems='center' sx={{ color: 'text.secondary' }}>
        <EventIcon sx={{ fontSize: 16 }} />
        <Typography variant='caption' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant='body1' sx={{ fontWeight: 600, mt: 0.25 }}>
        {value ? formatDate(value) : '—'}
      </Typography>
    </Box>
  );
}

