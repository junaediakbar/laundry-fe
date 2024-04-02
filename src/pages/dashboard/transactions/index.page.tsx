import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { buildPaginatedTableURL } from '@/lib/table';
import useServerTable from '@/hooks/useServerTable';

import IconButton from '@/components/buttons/IconButton';
import WithAuth from '@/components/hoc/WithAuth';
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import ServerTable from '@/components/table/ServerTable';
import Tag from '@/components/tag/Tag';
import Typography from '@/components/typography/Typography';

import { PaginatedApiResponse, Transaction } from '@/types/api';

export default WithAuth(TransactionsPage, ['admin']);
function TransactionsPage() {
  const router = useRouter();
  const { tableState, setTableState } = useServerTable<Transaction>({
    sortBy: { key: 'name', type: 'desc' },
  });

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'id',
      },
      {
        accessorKey: 'name',
        header: 'Nama',
      },
      {
        accessorKey: 'address',
        header: 'Alamat',
      },
      {
        accessorKey: 'notaId',
        header: 'No. Nota',
      },
      {
        accessorKey: 'cashier',
        header: 'Kasir',
      },
      {
        accessorKey: 'weight',
        cell: (props) => {
          const weight = props.getValue() as string;
          return `${weight} kg`;
        },
      },
      {
        accessorKey: 'price',
        header: 'harga',
        cell: (props) => {
          const price = props.getValue() as string;
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(Number(price));
        },
      },
      {
        accessorKey: 'noTelp',
        header: 'No. Telp',
      },
      {
        accessorKey: 'dateIn',
        header: 'Tanggal Masuk',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
        },
      },
      {
        accessorKey: 'dateDone',
        header: 'Tanggal Selesai',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
        },
      },
      {
        accessorKey: 'dateOut',
        header: 'Tanggal Keluar',
      },
      {
        accessorKey: 'status',
        cell: (props) => (
          <Tag color='primary'>{props.getValue() as string}</Tag>
        ),
      },
      {
        accessorKey: 'actions',
        cell: (cell) => {
          return (
            <div className='flex justify-center'>
              <ButtonLink
                href={`/dashboard/transactions/${cell.row.original.id}`}
                size='sm'
                variant='outline'
                rightIcon={Eye}
              >
                Edit
              </ButtonLink>
            </div>
          );
        },
      },
    ],
    [],
  );
  const url = buildPaginatedTableURL({
    baseUrl: '/transaction',
    tableState,
    additionalParam: {
      param: tableState.globalFilter,
    },
  });
  const { data: dataCustomer, isLoading } = useQuery<
    PaginatedApiResponse<Omit<Transaction, 'token'>[]>,
    Error
  >([url]);

  const meta = {
    total: dataCustomer?.total,
    currentPages: dataCustomer?.currentPages,
    limit: dataCustomer?.limit,
    maxPages: dataCustomer?.maxPages,
    from: dataCustomer?.from,
    to: dataCustomer?.to,
  };

  return (
    <DashboardLayout>
      <Seo templateTitle='Server Table' />

      <main>
        <section>
          <div className='mt-2 space-y-4 px-10'>
            <div className='flex gap-2 items-center'>
              <Typography variant='h2'>Data Transaksi</Typography>
              <IconButton
                onClick={() => router.replace('/dashboard/transactions/create')}
                size='sm'
                icon={PlusIcon}
              />
            </div>
            <ServerTable
              withFilter
              columns={columns}
              data={dataCustomer?.data ?? []}
              meta={meta}
              isLoading={isLoading}
              tableState={tableState}
              setTableState={setTableState}
              className='mt-8'
            />
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
