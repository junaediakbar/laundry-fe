import { useQuery } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import api from '@/lib/axios';
import { defaultToastMessage } from '@/lib/constant';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import PdfGenerator from '@/components/fetch/PDFGenerator';
import DatePicker from '@/components/forms/DatePicker';
import Input from '@/components/forms/Input';
import SearchableSelectInput from '@/components/forms/SearchableSelectInput';
import TextArea from '@/components/forms/TextArea';
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout';
import Seo from '@/components/Seo';
import Typography from '@/components/typography/Typography';

import REGEX from '@/constant/regex';
import { getServicePrice, services } from '@/constant/services';
import { checkPassword } from '@/constant/users';

import { ApiResponse, Transaction } from '@/types/api';

export default function CreateTransactionPage() {
  const router = useRouter();
  const { id } = router.query;
  const url = `/transaction/${id}`;

  const { data: detailTransaction } = useQuery<ApiResponse<Transaction>, Error>(
    [url],
  );

  const methods = useForm<Transaction>({
    mode: 'onTouched',
  });

  const generatePdf = () => {
    PdfGenerator(detailTransaction?.data as Transaction);
  };

  const date = moment();
  const getDateNowFormatted = date.format('DD/MM/YYYY HH:mm');
  const [price, setPrice] = React.useState('0');
  const [passwordCashier, setPasswordCashier] = useState('');

  //Watch ALl Records Transaction
  const service = methods.watch('service');
  const cashier = methods.watch('cashier');
  const status = methods.watch('status');

  //Set initial values
  useEffect(() => {
    if (detailTransaction) {
      methods.reset({
        ...detailTransaction.data,
      });
    }
  }, [detailTransaction, methods]);

  useEffect(() => {
    if (status === 'lunas') {
      methods.setValue(
        'datePayment',
        detailTransaction?.data.datePayment
          ? detailTransaction?.data.datePayment
          : getDateNowFormatted,
      );
    } else {
      methods.setValue('datePayment', '');
    }
  }, [
    status,
    methods,
    getDateNowFormatted,
    detailTransaction?.data.datePayment,
  ]);

  const { handleSubmit } = methods;
  const onSubmitForm: SubmitHandler<Transaction> = (data) => {
    if (!checkPassword(cashier, passwordCashier)) {
      toast.error('Password salah');
      return;
    }
    toast.promise(
      api.put(`/transaction/${detailTransaction?.data.id}`, data).then((_) => {
        return router.back();
      }),

      {
        ...defaultToastMessage,
        success: 'Berhasil! menyimpan data',
      },
    );
  };

  return (
    <DashboardLayout>
      <Seo templateTitle='Edit Transaksi' />
      <main>
        <section className=''>
          <div className='layout flex min-h-screen flex-col justify-center '>
            <div className='flex gap-2 items-center'>
              <Typography variant='h2'>Edit Transaksi</Typography>
              <IconButton icon={Edit} variant='ghost' />
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmitForm)}
                className='mt-4 w-full max-w-sm md:max-w-screen-lg'
              >
                <div className='space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-y-3 md:gap-x-8 mb-10'>
                  <div className='space-y-2 md:space-y-0 md:grid md:grid-cols-3 md:col-span-2 gap-4'>
                    <Input
                      id='notaId'
                      label='No. Nota'
                      placeholder='M-...'
                      validation={{}}
                    />
                    <SearchableSelectInput
                      id='cashier'
                      label='Pilih Kasir'
                      placeholder='Pilih Nama Kasir'
                      options={[
                        { value: 'dodo', label: 'Dodo' },
                        {
                          value: 'mama',
                          label: 'Mama',
                        },
                        {
                          value: 'papa',
                          label: 'Papa',
                        },
                      ]}
                      validation={{ required: 'Select Input must be filled' }}
                    />
                    <Input
                      value={passwordCashier}
                      onChange={(e) => setPasswordCashier(e.target.value)}
                      type='password'
                      id='passwordCashier'
                      label='Password'
                      placeholder='Masukkan Password Kasir'
                      validation={{}}
                    />
                  </div>

                  <div className='col-span-2'>
                    <Input
                      id='name'
                      label='Nama'
                      placeholder='Nama Pelanggan'
                      validation={{
                        required: 'Nama harus diisi',
                      }}
                    />
                  </div>
                  <Input
                    id='noTelp'
                    label='No. Telp'
                    placeholder='08182'
                    validation={{}}
                  />
                  <Input
                    id='address'
                    label='Alamat'
                    placeholder='Jl. ....'
                    validation={{}}
                  />
                  <SearchableSelectInput
                    id='service'
                    label='Pilih Layanan'
                    placeholder='Pilih Layanan'
                    options={services.map(
                      (v: { value: string; name: string }) => ({
                        value: v.value,
                        label: v.name,
                      }),
                    )}
                    validation={{ required: 'Select Input must be filled' }}
                  />

                  <Input
                    disabled={
                      (service as unknown as string) === 'lainnya'
                        ? false
                        : true
                    }
                    id='per-price'
                    onChange={(e) => setPrice(e.target.value)}
                    label='Harga/kg'
                    placeholder='Harga Persatuan(kg)'
                    validation={{}}
                    value={
                      (service as unknown as string) === 'lainnya'
                        ? price
                        : getServicePrice(service as unknown as string)
                    }
                  />

                  <Input
                    id='weight'
                    label='Berat(kg)'
                    type='number'
                    placeholder='Berat Pakaian(kg)'
                    validation={{
                      pattern: {
                        value: REGEX.NUMBER_AND_DECIMAL,
                        message: 'Berat harus dalam angka/desimal',
                      },
                      required: 'Berat harus diisi',
                    }}
                  />

                  <Input
                    id='price'
                    label='Harga Total'
                    placeholder='Harga Total'
                    validation={{}}
                  />

                  <DatePicker
                    showTimeSelect={true}
                    id='dateIn'
                    label='Tanggal Masuk'
                    placeholder='dd/MM/yyyy HH:mm'
                    defaultYear={2024}
                    dateFormat='dd/MM/yyyy HH:mm'
                    validation={{
                      required: 'Tanggal Masuk harus diisi',
                      valueAsDate: true,
                    }}
                  />

                  <DatePicker
                    showTimeSelect={true}
                    id='dateDone'
                    label='Tanggal Perkiraan Selesai'
                    placeholder='dd/MM/yyyy HH:mm'
                    defaultYear={2024}
                    dateFormat='dd/MM/yyyy HH:mm'
                    validation={{
                      required: 'Tanggal Perkiraan Selesai harus diisi',
                      valueAsDate: true,
                    }}
                  />
                  <SearchableSelectInput
                    id='status'
                    label='Status Pembayaran'
                    placeholder='Status Pembayarann'
                    options={[
                      {
                        value: 'lunas',
                        label: 'Lunas',
                      },
                      {
                        value: 'belum-bayar',
                        label: 'Belum Bayar',
                      },
                      {
                        value: 'bayar-sebagian',
                        label: 'Bayar Sebagian',
                      },
                    ]}
                    validation={{ required: 'Select Input must be filled' }}
                  />
                  <DatePicker
                    showTimeSelect={true}
                    id='datePayment'
                    label='Tanggal Pembayaran'
                    placeholder='dd/MM/yyyy HH:mm'
                    defaultYear={2024}
                    defaultValue={getDateNowFormatted}
                    dateFormat='dd/MM/yyyy HH:mm'
                    validation={{}}
                  />
                  <div className='col-span-2'>
                    <TextArea
                      id='notes'
                      label='Catatan'
                      validation={{ required: 'Address must be filled' }}
                    />
                  </div>
                </div>
                <Button
                  onClick={generatePdf}
                  className='mt-6 block w-full'
                  variant='secondary'
                >
                  Download PDF
                </Button>
                <Button type='submit' className='mt-3 block w-full'>
                  Simpan
                </Button>
              </form>
            </FormProvider>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
