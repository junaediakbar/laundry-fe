import { useQuery } from '@tanstack/react-query';
import { id } from 'date-fns/locale';
import { DownloadIcon, Edit, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { registerLocale } from 'react-datepicker';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { WhatsappIcon, WhatsappShareButton } from 'react-share';

import api from '@/lib/axios';
import { defaultToastMessage } from '@/lib/constant';
import useDialog from '@/hooks/useDialog';

import Button from '@/components/buttons/Button';
import { CopyButton } from '@/components/buttons/CopyButton';
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
registerLocale('id', id);

export default function CreateTransactionPage() {
  const router = useRouter();
  const { detailId } = router.query;
  const url = `/transaction/${detailId}`;

  const { data: detailTransaction } = useQuery<ApiResponse<Transaction>, Error>(
    [url],
  );

  const methods = useForm<Transaction>({
    mode: 'onTouched',
  });

  const generatePdf = () => {
    PdfGenerator(detailTransaction?.data as Transaction);
  };

  function getDownloadUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    return baseUrl + 'common/nota/' + detailTransaction?.data.transactionId;
  }

  const [passwordCashier, setPasswordCashier] = useState('');

  //Watch ALl Records Transaction
  const service = methods.watch('service');
  const cashier = methods.watch('cashier');
  const status = methods.watch('status');
  const perprice = methods.watch('perprice');
  const weight = methods.watch('weight');
  const statusTaken = methods.watch('statusTaken');

  //Set initial values
  useEffect(() => {
    if (detailTransaction) {
      methods.reset({
        ...detailTransaction.data,
      });
    }
    if (detailTransaction?.data.dateOut !== null) {
      methods.setValue('dateOut', detailTransaction?.data.dateOut);
      methods.setValue('statusTaken', 'diambil');
    } else {
      methods.setValue('statusTaken', 'belum-diambil');
    }
  }, [detailTransaction, methods]);

  useEffect(() => {
    if (weight !== '' && perprice !== '') {
      const totalPrice = Number(weight) * Number(perprice);
      methods.setValue('price', totalPrice.toString());
    } else if (weight === '' || perprice === '') {
      methods.setValue('price', '0');
    }

    return () => {};
  }, [service, weight, perprice, methods, detailTransaction?.data.price]);

  useEffect(() => {
    const date = moment();
    const getDateNowFormatted = date.toISOString() as string;
    if (service !== 'lainnya') {
      if (service === detailTransaction?.data.service) {
        methods.setValue(
          'perprice',
          detailTransaction?.data.perprice.toString(),
        );
      } else {
        methods.setValue('perprice', getServicePrice(service).toString());
      }
    } else {
      methods.setValue('perprice', detailTransaction?.data.perprice as string);
    }
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
    service,
    status,
    methods,
    detailTransaction?.data.datePayment,
    detailTransaction?.data.perprice,
    detailTransaction?.data.service,
  ]);

  useEffect(() => {
    if (statusTaken === 'diambil') {
      if (detailTransaction?.data.dateOut === null) {
        const date = moment();
        const getDateNowFormatted = date.toISOString() as string;
        methods.setValue('dateOut', getDateNowFormatted);
      } else {
        methods.setValue('dateOut', '');
      }
    } else {
      methods.setValue('dateOut', '');
    }
  }, [methods, statusTaken, detailTransaction?.data.dateOut]);

  const { handleSubmit } = methods;
  const onSubmitForm: SubmitHandler<Transaction> = (data) => {
    if (!checkPassword(cashier, passwordCashier)) {
      toast.error('Password salah');
      return;
    }
    toast.promise(
      api.put(`/transaction/${detailTransaction?.data.id}`, data).then((_) => {
        return router.replace('/dashboard/transactions');
      }),

      {
        ...defaultToastMessage,
        success: 'Berhasil! menyimpan data',
      },
    );
  };

  const dialog = useDialog();
  const openAlert = (successFn: () => void, rejectFn: () => void) => {
    dialog({
      title: 'Hapus Transaksi',
      description: 'Anda yakin akan menghapus transaksi ini?',
      submitText: 'Ya',
      variant: 'danger',
      catchOnCancel: true,
    })
      .then(successFn)
      .catch(rejectFn);
  };

  const deleteTransaction = () => {
    if (!checkPassword(cashier, passwordCashier)) {
      toast.error('Password salah');
      return;
    }
    openAlert(
      async () => {
        await toast.promise(
          api.delete(`/transaction/${detailTransaction?.data.id}`).then((_) => {
            return router.back();
          }),
          {
            ...defaultToastMessage,
            success: 'Berhasil! menghapus data',
          },
        );
        return;
      },
      () => {},
    );
  };

  const onTakeLaundry = async () => {
    if (!checkPassword(cashier, passwordCashier)) {
      toast.error('Password salah');
      return;
    }
    await toast.promise(
      api.put(`/transaction/take/${detailTransaction?.data.id}`).then((_) => {
        return;
      }),
      {
        ...defaultToastMessage,
        success: 'Berhasil! mengambil laundry',
      },
    );
    return router.replace('/dashboard/transactions');
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
                      placeholder='Nomor Nota'
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
                    id='perprice'
                    label='Harga/kg'
                    placeholder='Harga Persatuan(kg)'
                    validation={{}}
                  />

                  <Input
                    id='weight'
                    label='Berat(kg)'
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
                    locale='id'
                    dateFormat='dd/MM/yyyy HH:mm'
                    validation={{}}
                  />
                  <SearchableSelectInput
                    id='statusTaken'
                    label='Status Pengambilan'
                    placeholder='Status Pengambilan'
                    options={[
                      {
                        value: 'diambil',
                        label: 'Diambil',
                      },
                      {
                        value: 'belum-diambil',
                        label: 'Belum Diambil',
                      },
                    ]}
                    validation={{ required: 'Select Input must be filled' }}
                  />
                  <DatePicker
                    showTimeSelect={true}
                    id='dateOut'
                    label='Tanggal Pengambilan'
                    placeholder='dd/MM/yyyy HH:mm'
                    defaultYear={2024}
                    locale='id'
                    dateFormat='dd/MM/yyyy HH:mm'
                    validation={{}}
                  />
                  <div className='col-span-2 mb-3'>
                    <TextArea id='notes' label='Catatan' validation={{}} />
                  </div>
                  <div></div>
                  <div className='flex col-span-2 mt-3 w-full'>
                    <CopyButton
                      className='w-full flex-grow '
                      withInput
                      text={getDownloadUrl()}
                    />
                    <WhatsappShareButton
                      content='Check this out!'
                      className='mr-2 flex-grow-0 ml-4'
                      url={getDownloadUrl()}
                      title='Copy to Whatsapp'
                    >
                      <WhatsappIcon
                        className='rounded-lg'
                        round={false}
                        style={{ width: '40px', height: '40px' }}
                      ></WhatsappIcon>
                    </WhatsappShareButton>

                    <IconButton
                      onClick={generatePdf}
                      color=''
                      variant='warning'
                      className='mr-2 flex-grow-0'
                      icon={DownloadIcon}
                    />
                    <IconButton
                      onClick={deleteTransaction}
                      className=' flex-grow-0'
                      variant='danger'
                      icon={Trash2}
                    />
                  </div>
                </div>
                <Button type='submit' className='mt-8 block w-full'>
                  Simpan Data
                </Button>
                <Button
                  variant='warning'
                  onClick={onTakeLaundry}
                  className='mt-3 block w-full'
                >
                  Ambil Laundry
                </Button>
              </form>
            </FormProvider>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
