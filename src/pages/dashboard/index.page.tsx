import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Download,
  LucideIcon,
  ScissorsSquareDashedBottom,
  WeightIcon,
} from 'lucide-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdOutlineMoney, MdPriceChange } from 'react-icons/md';

import api from '@/lib/axios';
import { getPriceFormmated } from '@/lib/formatters';
import useMutationToast from '@/hooks/toast/useMutationToast';

import Button from '@/components/buttons/Button';
import StatisticsCard from '@/components/cards/StatisticsCard';
import PDFRecapGenerator from '@/components/fetch/PDFRecapGenerator';
import DatePicker from '@/components/forms/DatePicker';
import WithAuth from '@/components/hoc/WithAuth';
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout';
import Seo from '@/components/Seo';
import Tag from '@/components/tag/Tag';
import Typography from '@/components/typography/Typography';

import useAuthStore from '@/store/useAuthStore';

import { ApiResponse, Transaction } from '@/types/api';

interface DataRecapResponse {
  dateStart: string;
  dateTomorrow: string;
  data: Transaction[];
  dataPayment: Transaction[];
}

export default WithAuth(HomeDashboardPage, ['admin']);
function HomeDashboardPage() {
  const user = useAuthStore.useUser();
  const methods = useForm<{
    date: string;
  }>({
    mode: 'onChange',
  });
  const { handleSubmit } = methods;

  const [totalPrice, setTotalPrice] = React.useState(0);
  const [totalAmountToday, setTotalAmountToday] = React.useState(0);
  const [totalWeight, setTotalWeight] = React.useState(0);
  const [totalDeposit, setTotalDeposit] = React.useState(0);
  const [totalAmountPayment, setTotalAmountPayment] = React.useState(0);

  const { mutateAsync: getInfoToday, isLoading } = useMutationToast<
    void,
    object
  >(
    useMutation(() => {
      const formattedDate = moment(date).format('yyyy-MM-DD');
      return api
        .get(`/transaction/recap/date?date=${formattedDate}`)
        .then(async (res) => {
          setTotalPrice(res.data.data.price);
          setTotalWeight(
            res.data.data.weight === null ? 0 : res.data.data.weight,
          );
          setTotalDeposit(res.data.data.depositPayment);
          //Nota HARI INI dan SUDAH DIBAYAR
          setTotalAmountToday(res.data.data.amountPaymentToday);
          //Nota Yang DIBAYAR HARI INI (TERMASUK NOTA HARI LAIN)
          setTotalAmountPayment(res.data.data.amountPayment);
        });
    }),
    {
      success: 'Berhasil Mendapatkan Data',
    },
  );
  const { mutateAsync: getDataToday, isLoading: isLoading2 } = useMutationToast<
    AxiosResponse<ApiResponse<DataRecapResponse>>,
    object
  >(
    useMutation((_) => {
      const formattedDate = moment(date).format('yyyy-MM-DD');
      return api.get(`/transaction/recap/list-data?date=${formattedDate}`);
    }),
    {
      success: 'Berhasil Mendapatkan Data',
    },
  );

  const date = methods.watch('date', moment().format('yyyy-MM-DD'));

  useEffect(() => {
    getInfoToday({ date });
  }, [date, getInfoToday]);

  const onSubmit = async (data: { date: string }) => {
    const res = await getDataToday(data);

    PDFRecapGenerator(res.data.data.data, {
      totalPrice: totalPrice.toString(),
      totalWeight: totalWeight.toString(),
      totalDeposit: totalDeposit.toString(),
      totalAmountPayment: totalAmountPayment.toString(),
      totalAmountPaymentToday: totalAmountToday.toString(),
      dateStart: new Date(date).toISOString(),
    });
  };

  return (
    <DashboardLayout>
      <Seo templateTitle='Dashboard' />

      <main>
        <section>
          <div className='mt-2 space-y-4 px-10'>
            <Typography variant='h2'>Welcome, {user?.name} ! </Typography>
          </div>
          <div className='mt-8 space-y-4 px-10'>
            <Typography variant='h2'>Statistics</Typography>
            <Tag color='secondary'>
              {format(new Date(date), 'PPPP', {
                locale: id,
              })}
            </Tag>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6 rounded-lg  py-4'>
              <StatisticsCard
                variant='success'
                icon={WeightIcon}
                label='Total Berat'
                value={totalWeight.toFixed(3) + ' Kg'}
                isLoading={isLoading}
              />
              <StatisticsCard
                variant='primary'
                icon={MdPriceChange as LucideIcon}
                label='Total Pemasukan'
                value={getPriceFormmated(totalPrice)}
                isLoading={isLoading}
              />
              <StatisticsCard
                variant='success'
                icon={MdPriceChange as LucideIcon}
                label='Total Yang Dibayar'
                value={getPriceFormmated(totalAmountToday)}
                isLoading={isLoading}
              />
              <StatisticsCard
                variant='danger'
                icon={ScissorsSquareDashedBottom}
                label='Total Belum Bayar'
                value={getPriceFormmated(totalDeposit)}
                isLoading={isLoading}
              />
              <StatisticsCard
                variant='success'
                icon={MdOutlineMoney as LucideIcon}
                label='Total Pembayaran (Termasuk Nota Hari Lain)'
                value={getPriceFormmated(totalAmountPayment)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>

        <section>
          <div className='mt-2 space-y-4 px-10'>
            <Typography variant='h2'>Rekap Data </Typography>
          </div>
          <div className='mt-8 w-full space-y-2 px-10'>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex mt-8 w-full max-w-sm md:max-w-screen-lg space-x-5 space-y-2.5'
              >
                <DatePicker
                  id='date'
                  dateFormat='dd-MM-yyyy'
                  label='Pilih Tanggal'
                  placeholder='Pilih Tanggal'
                  validation={{ required: 'Tanggal harus diisi' }}
                />
                <div className='!mt-6 flex space-x-2'>
                  <Button
                    type='submit'
                    isLoading={isLoading2}
                    className='px-2'
                    rightIcon={Download}
                  >
                    Download
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
