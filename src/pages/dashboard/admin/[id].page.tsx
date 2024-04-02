import { useQuery } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import api from '@/lib/axios';
import { defaultToastMessage } from '@/lib/constant';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import PdfGenerator from '@/components/fetch/PDFGenerator';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout';
import Seo from '@/components/Seo';
import Typography from '@/components/typography/Typography';

import { ApiResponse, Customer, Transaction } from '@/types/api';

export default function CreateCustomerPage() {
  const router = useRouter();
  const { id } = router.query;
  const url = `/customer/${id}`;

  const { data: detailCustomer } = useQuery<ApiResponse<Customer>, Error>([
    url,
  ]);
  const methods = useForm<Transaction>({
    mode: 'onTouched',
  });

  const generatePdf = () => {
    PdfGenerator(detailCustomer?.data as Transaction);
  };

  //Watch ALl Records Transaction

  //Set initial values
  useEffect(() => {
    if (detailCustomer) {
      methods.reset({
        ...detailCustomer.data,
      });
    }
  }, [detailCustomer, methods]);

  const { handleSubmit } = methods;
  const onSubmitForm: SubmitHandler<Customer> = (data) => {
    toast.promise(
      api.put(`/customer/${detailCustomer?.data.id}`, data).then((_) => {
        return router.back();
      }),

      {
        ...defaultToastMessage,
        success: 'Berhasil! Menambahkan data',
      },
    );
  };

  return (
    <DashboardLayout>
      <Seo templateTitle='Transaksi Baru' />
      <main>
        <section className=''>
          <div className='layout flex min-h-screen-lg flex-col justify-center '>
            <div className='flex gap-2 items-center'>
              <Typography variant='h2'>Edit Transaksi</Typography>
              <IconButton icon={Edit} variant='ghost' />
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmitForm)}
                className='mt-4 w-full max-w-sm md:max-w-screen-lg'
              >
                <div className='space-y-3 md:space-y-0 md:grid  md:gap-y-3 md:gap-x-8 mb-10'>
                  <Input
                    id='name'
                    label='Nama'
                    placeholder='Nama Customer'
                    validation={{}}
                  />
                  <Input
                    id='noTelp'
                    label='No. Telepon'
                    placeholder='No. Telepon'
                    validation={{}}
                  />

                  <TextArea
                    id='address'
                    label='Alamat'
                    placeholder='Alamat Customer'
                    validation={{ required: 'Address must be filled' }}
                  />
                </div>
                <Button
                  onClick={generatePdf}
                  className='mt-6 block w-full'
                  variant='secondary'
                >
                  Download PDF
                </Button>
                <Button type='submit' className='mt-3 block w-full'>
                  Buat Transaksi
                </Button>
              </form>
            </FormProvider>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
